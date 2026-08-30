// ---------------------------------------------------------------------------
// Peer Synchronization Context – BroadcastChannel-based cross-tab sync
// ---------------------------------------------------------------------------
// This is a demonstration P2P layer using the browser BroadcastChannel API.
// It synchronizes blockchain state across tabs in the same browser.
// The architecture is designed so a real WebSocket transport can replace
// BroadcastChannel with minimal changes.
// ---------------------------------------------------------------------------
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  AssetBlock,
  PeerMessage,
  PeerNode,
  PeerSyncContextValue,
} from "@/types/asset-chain";

const CHANNEL_NAME = "asset-chain-peer-sync";
const ANNOUNCE_INTERVAL = 5_000; // ms
const PEER_TIMEOUT = 15_000; // ms – consider peer offline after this

// ---- Peer identity ---------------------------------------------------------

function getOrCreatePeerId(): string {
  const key = "asset-chain:peer-id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = `peer-${crypto.randomUUID().slice(0, 8)}`;
    sessionStorage.setItem(key, id);
  }
  return id;
}

function getOrCreatePeerName(): string {
  const key = "asset-chain:peer-name";
  let name = sessionStorage.getItem(key);
  if (!name) {
    const adjectives = ["Swift", "Bold", "Keen", "Calm", "True"];
    const nouns = ["Node", "Link", "Shard", "Vault", "Gate"];
    name = `${adjectives[Math.floor(Math.random() * adjectives.length)]}-${nouns[Math.floor(Math.random() * nouns.length)]}`;
    sessionStorage.setItem(key, name);
  }
  return name;
}

// ---- Context ---------------------------------------------------------------

const PeerSyncContext = createContext<PeerSyncContextValue | null>(null);

export function usePeerSync(): PeerSyncContextValue {
  const ctx = useContext(PeerSyncContext);
  if (!ctx) throw new Error("usePeerSync must be used within <PeerSyncProvider>");
  return ctx;
}

interface PeerSyncProviderProps {
  children: React.ReactNode;
  /** Current chain length – used for peer announce payloads. */
  chainLength: number;
  /** Called when a valid block is received from a peer. */
  onBlockReceived: (block: AssetBlock) => boolean;
  /** Called when a full chain sync response is received. */
  onChainSyncResponse: (chain: AssetBlock[]) => void;
  /** Provider supplies the current chain for sync responses. */
  getChain: () => AssetBlock[];
}

export function PeerSyncProvider({
  children,
  chainLength,
  onBlockReceived,
  onChainSyncResponse,
  getChain,
}: PeerSyncProviderProps) {
  const peerId = useMemo(() => getOrCreatePeerId(), []);
  const peerName = useMemo(() => getOrCreatePeerName(), []);
  const [peers, setPeers] = useState<PeerNode[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);

  const channelRef = useRef<BroadcastChannel | null>(null);
  const chainLengthRef = useRef(chainLength);
  chainLengthRef.current = chainLength;

  // Stable refs for callbacks.
  const onBlockReceivedRef = useRef(onBlockReceived);
  onBlockReceivedRef.current = onBlockReceived;
  const onChainSyncResponseRef = useRef(onChainSyncResponse);
  onChainSyncResponseRef.current = onChainSyncResponse;
  const getChainRef = useRef(getChain);
  getChainRef.current = getChain;

  // ---- Channel setup -------------------------------------------------------

  const sendMessage = useCallback(
    (msg: PeerMessage) => {
      channelRef.current?.postMessage(msg);
    },
    [],
  );

  const createMessage = useCallback(
    (type: PeerMessage["type"], payload: unknown): PeerMessage => ({
      type,
      senderId: peerId,
      senderName: peerName,
      timestamp: new Date().toISOString(),
      payload,
    }),
    [peerId, peerName],
  );

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    const handleMessage = (event: MessageEvent<PeerMessage>) => {
      const msg = event.data;
      if (!msg || msg.senderId === peerId) return; // ignore own messages

      // Update peer list.
      setPeers((prev) => {
        const filtered = prev.filter((p) => p.peerId !== msg.senderId);
        return [
          ...filtered,
          {
            peerId: msg.senderId,
            displayName: msg.senderName,
            lastSeen: msg.timestamp,
            blockCount:
              msg.type === "PEER_ANNOUNCE"
                ? (msg.payload as { blockCount: number }).blockCount
                : (filtered.find((p) => p.peerId === msg.senderId)?.blockCount ?? 0),
          },
        ];
      });

      switch (msg.type) {
        case "BLOCK_ADDED": {
          const block = msg.payload as AssetBlock;
          onBlockReceivedRef.current(block);
          setLastSyncAt(new Date().toISOString());
          break;
        }
        case "CHAIN_SYNC_REQUEST": {
          // Respond with our chain.
          const responseMsg = createMessage("CHAIN_SYNC_RESPONSE", getChainRef.current());
          sendMessage(responseMsg);
          break;
        }
        case "CHAIN_SYNC_RESPONSE": {
          const incomingChain = msg.payload as AssetBlock[];
          onChainSyncResponseRef.current(incomingChain);
          setIsSyncing(false);
          setLastSyncAt(new Date().toISOString());
          break;
        }
        case "PEER_ANNOUNCE":
          // Already handled above by updating peer list.
          break;
        case "PEER_GOODBYE":
          setPeers((prev) => prev.filter((p) => p.peerId !== msg.senderId));
          break;
      }
    };

    channel.addEventListener("message", handleMessage);

    // Announce presence immediately.
    channel.postMessage(
      createMessage("PEER_ANNOUNCE", { blockCount: chainLengthRef.current }) as PeerMessage,
    );

    // Periodic announce.
    const announceTimer = setInterval(() => {
      channel.postMessage(
        createMessage("PEER_ANNOUNCE", { blockCount: chainLengthRef.current }) as PeerMessage,
      );
    }, ANNOUNCE_INTERVAL);

    // Prune stale peers.
    const pruneTimer = setInterval(() => {
      const cutoff = Date.now() - PEER_TIMEOUT;
      setPeers((prev) => prev.filter((p) => new Date(p.lastSeen).getTime() > cutoff));
    }, PEER_TIMEOUT);

    return () => {
      channel.postMessage(createMessage("PEER_GOODBYE", null) as PeerMessage);
      clearInterval(announceTimer);
      clearInterval(pruneTimer);
      channel.removeEventListener("message", handleMessage);
      channel.close();
      channelRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peerId, peerName]);

  // ---- Public API ----------------------------------------------------------

  const broadcastBlock = useCallback(
    (block: AssetBlock) => {
      sendMessage(createMessage("BLOCK_ADDED", block));
    },
    [sendMessage, createMessage],
  );

  const requestSync = useCallback(() => {
    setIsSyncing(true);
    sendMessage(createMessage("CHAIN_SYNC_REQUEST", null));
    // Timeout if nobody responds.
    setTimeout(() => setIsSyncing(false), 5_000);
  }, [sendMessage, createMessage]);

  const value = useMemo<PeerSyncContextValue>(
    () => ({
      peerId,
      peerName,
      peers,
      isSyncing,
      lastSyncAt,
      broadcastBlock,
      requestSync,
    }),
    [peerId, peerName, peers, isSyncing, lastSyncAt, broadcastBlock, requestSync],
  );

  return (
    <PeerSyncContext.Provider value={value}>
      {children}
    </PeerSyncContext.Provider>
  );
}
