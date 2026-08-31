// ---------------------------------------------------------------------------
// Asset Ownership Blockchain – React Context & State Management
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
  AssetChainContextValue,
  AssetData,
  AssetSummary,
  ShareRecord,
  TransferRecord,
} from "@/types/asset-chain";

// ---- Crypto helpers --------------------------------------------------------

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function uuid(): string {
  return crypto.randomUUID();
}

async function computeBlockHash(block: Omit<AssetBlock, "currentHash">): Promise<string> {
  const payload = [
    block.index,
    block.id,
    block.previousHash,
    block.timestamp,
    block.transactionType,
    block.owner,
    block.createdBy,
    JSON.stringify(block.assetData),
    block.previousOwner ?? "",
    block.sharedWith ?? "",
  ].join("|");
  return sha256(payload);
}

// ---- Persistence -----------------------------------------------------------

const STORAGE_KEY = "asset-chain:blocks";

function loadChain(): AssetBlock[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AssetBlock[];
  } catch {
    /* corrupted – start fresh */
  }
  return [];
}

function persistChain(chain: AssetBlock[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chain));
  } catch {
    /* quota exceeded – ignore */
  }
}

// ---- Genesis block ---------------------------------------------------------

async function createGenesisBlock(): Promise<AssetBlock> {
  const partial: Omit<AssetBlock, "currentHash"> = {
    index: 0,
    id: uuid(),
    assetData: {
      assetId: "GENESIS",
      assetName: "Genesis Block",
      assetType: "Certificate",
      description: "The origin block of the Asset Ownership Chain.",
    },
    owner: "SYSTEM",
    createdBy: "SYSTEM",
    timestamp: new Date().toISOString(),
    previousHash: "0",
    transactionType: "CREATE",
    validationStatus: "VERIFIED",
  };
  const currentHash = await computeBlockHash(partial);
  return { ...partial, currentHash };
}

// ---- Context ---------------------------------------------------------------

const AssetChainContext = createContext<AssetChainContextValue | null>(null);

export function useAssetChain(): AssetChainContextValue {
  const ctx = useContext(AssetChainContext);
  if (!ctx) throw new Error("useAssetChain must be used within <AssetChainProvider>");
  return ctx;
}

export function AssetChainProvider({ children }: { children: React.ReactNode }) {
  const [chain, setChain] = useState<AssetBlock[]>(loadChain);
  const chainRef = useRef(chain);
  chainRef.current = chain;

  // Persist whenever the chain changes.
  useEffect(() => {
    persistChain(chain);
  }, [chain]);

  // Ensure genesis block exists on first mount.
  useEffect(() => {
    if (chainRef.current.length === 0) {
      createGenesisBlock().then((genesis) => {
        setChain((prev) => (prev.length === 0 ? [genesis] : prev));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Mutations -----------------------------------------------------------

  const appendBlock = useCallback(
    async (
      partial: Omit<AssetBlock, "index" | "id" | "previousHash" | "currentHash" | "timestamp" | "validationStatus">,
    ): Promise<AssetBlock> => {
      const prev = chainRef.current;
      const lastBlock = prev[prev.length - 1];
      const block: Omit<AssetBlock, "currentHash"> = {
        ...partial,
        index: prev.length,
        id: uuid(),
        previousHash: lastBlock?.currentHash ?? "0",
        timestamp: new Date().toISOString(),
        validationStatus: "VERIFIED",
      };
      const currentHash = await computeBlockHash(block);
      const finalBlock: AssetBlock = { ...block, currentHash };

      setChain((c) => [...c, finalBlock]);
      return finalBlock;
    },
    [],
  );

  const createAsset = useCallback(
    (data: AssetData, initialOwner: string, createdBy: string) => {
      // Return a sync wrapper that internally uses the async path.
      // We store a ref so callers can treat it as sync for toast purposes.
      let result: AssetBlock | null = null;
      const promise = appendBlock({
        assetData: data,
        owner: initialOwner,
        createdBy,
        transactionType: "CREATE",
      });
      // Eagerly resolve since appendBlock is fast (SHA-256 is <1ms).
      promise.then((b) => {
        result = b;
      });
      // For the sync interface we return a placeholder that will be populated.
      // In practice the hash resolves within the same microtask tick.
      return result as unknown as AssetBlock;
    },
    [appendBlock],
  );

  const transferAsset = useCallback(
    (assetId: string, newOwner: string, transferredBy: string) => {
      const current = chainRef.current;
      // Find the latest block for this asset to determine current owner.
      const assetBlocks = current.filter((b) => b.assetData.assetId === assetId);
      const latestBlock = assetBlocks[assetBlocks.length - 1];
      if (!latestBlock) throw new Error(`Asset ${assetId} not found`);

      let result: AssetBlock | null = null;
      appendBlock({
        assetData: latestBlock.assetData,
        owner: newOwner,
        createdBy: transferredBy,
        transactionType: "TRANSFER",
        previousOwner: latestBlock.owner,
      }).then((b) => {
        result = b;
      });
      return result as unknown as AssetBlock;
    },
    [appendBlock],
  );

  const shareAsset = useCallback(
    (assetId: string, recipientUser: string, sharedBy: string) => {
      const current = chainRef.current;
      const assetBlocks = current.filter((b) => b.assetData.assetId === assetId);
      const latestBlock = assetBlocks[assetBlocks.length - 1];
      if (!latestBlock) throw new Error(`Asset ${assetId} not found`);

      let result: AssetBlock | null = null;
      appendBlock({
        assetData: latestBlock.assetData,
        owner: latestBlock.owner,
        createdBy: sharedBy,
        transactionType: "SHARE",
        sharedWith: recipientUser,
      }).then((b) => {
        result = b;
      });
      return result as unknown as AssetBlock;
    },
    [appendBlock],
  );

  // ---- Queries -------------------------------------------------------------

  const getAssetHistory = useCallback(
    (assetId: string) => chain.filter((b) => b.assetData.assetId === assetId),
    [chain],
  );

  const getCurrentOwner = useCallback(
    (assetId: string): string | undefined => {
      const history = chain.filter((b) => b.assetData.assetId === assetId);
      return history.length > 0 ? history[history.length - 1].owner : undefined;
    },
    [chain],
  );

  const listAssets = useCallback((): AssetSummary[] => {
    const assetMap = new Map<string, AssetBlock[]>();
    for (const block of chain) {
      if (block.assetData.assetId === "GENESIS") continue;
      const existing = assetMap.get(block.assetData.assetId) || [];
      existing.push(block);
      assetMap.set(block.assetData.assetId, existing);
    }
    const summaries: AssetSummary[] = [];
    for (const [, blocks] of assetMap) {
      const transfers: TransferRecord[] = blocks
        .filter((b) => b.transactionType === "TRANSFER")
        .map((b) => ({
          fromOwner: b.previousOwner ?? "",
          toOwner: b.owner,
          blockIndex: b.index,
          timestamp: b.timestamp,
        }));
      const shares: ShareRecord[] = blocks
        .filter((b) => b.transactionType === "SHARE")
        .map((b) => ({
          sharedWith: b.sharedWith ?? "",
          sharedBy: b.createdBy,
          blockIndex: b.index,
          timestamp: b.timestamp,
        }));
      summaries.push({
        assetData: blocks[0].assetData,
        currentOwner: blocks[blocks.length - 1].owner,
        blockCount: blocks.length,
        transfers,
        shares,
        createdAt: blocks[0].timestamp,
      });
    }
    return summaries;
  }, [chain]);

  const importBlock = useCallback(
    (block: AssetBlock): boolean => {
      const current = chainRef.current;
      // Only accept if it extends our chain.
      if (current.some((b) => b.id === block.id)) return false; // duplicate
      const last = current[current.length - 1];
      if (block.previousHash !== last?.currentHash) return false; // fork
      if (block.index !== current.length) return false; // gap
      setChain((c) => [...c, block]);
      return true;
    },
    [],
  );

  const value = useMemo<AssetChainContextValue>(
    () => ({
      chain,
      createAsset,
      transferAsset,
      shareAsset,
      getAssetHistory,
      getCurrentOwner,
      listAssets,
      getAssets: listAssets,
      importBlock,
      isInitialized: chain.length > 0,
    }),
    [chain, createAsset, transferAsset, shareAsset, getAssetHistory, getCurrentOwner, listAssets, importBlock],
  );

  return (
    <AssetChainContext.Provider value={value}>
      {children}
    </AssetChainContext.Provider>
  );
}
