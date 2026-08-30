// ---------------------------------------------------------------------------
// Asset Chain Page – Main page assembling 3D visualization, admin/user panels,
// and P2P status into a single cohesive view.
// ---------------------------------------------------------------------------
import { useCallback, useRef, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Box,
  ChevronLeft,
  Eye,
  Link2,
  Blocks,
  Shield,
  ShieldCheck,
  Users,
} from "lucide-react";

import { AssetChainProvider, useAssetChain } from "@/contexts/AssetChainContext";
import { PeerSyncProvider, usePeerSync } from "@/contexts/PeerSyncContext";
import type { AssetBlock } from "@/types/asset-chain";

import { BlockchainChain3D } from "@/components/asset-chain/BlockchainChain3D";
import { BlockDetailPanel } from "@/components/asset-chain/BlockDetailPanel";
import { AdminPanel } from "@/components/asset-chain/AdminPanel";
import { ShareDialog } from "@/components/asset-chain/ShareDialog";
import { PeerStatusBar } from "@/components/asset-chain/PeerStatusBar";
import { UserAssetView } from "@/components/asset-chain/UserAssetView";

// ---- Inner content (needs context) -----------------------------------------

function AssetChainContent() {
  const { chain, importBlock } = useAssetChain();
  const { broadcastBlock } = usePeerSync();

  const [selectedBlock, setSelectedBlock] = useState<AssetBlock | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [role, setRole] = useState<"admin" | "user">("admin");
  const [userName, setUserName] = useState("Alice");

  const [, navigate] = useLocation();

  // When a 3D block is clicked.
  const handleSelectBlock = useCallback((block: AssetBlock) => {
    setSelectedBlock(block);
    setDetailOpen(true);
  }, []);

  // Wrap mutations so we broadcast new blocks.
  const originalCreateAsset = useAssetChain().createAsset;
  const originalTransferAsset = useAssetChain().transferAsset;
  const originalShareAsset = useAssetChain().shareAsset;

  // We monitor chain length to detect new blocks (created locally).
  const prevChainLenRef = useRef(chain.length);
  if (chain.length > prevChainLenRef.current) {
    const newBlock = chain[chain.length - 1];
    if (newBlock) {
      broadcastBlock(newBlock);
    }
    prevChainLenRef.current = chain.length;
  }

  return (
    <div className="asset-chain-page">
      {/* ── Header Bar ────────────────────────────────────────────── */}
      <header className="ac-header">
        <div className="ac-header-left">
          <button
            type="button"
            className="ac-back-btn"
            onClick={() => navigate("/")}
          >
            <ChevronLeft size={16} />
            <span>Dashboard</span>
          </button>
          <div className="ac-brand">
            <Blocks size={20} style={{ color: "var(--copper-bright)" }} />
            <span className="ac-brand-title">ASSET OWNERSHIP CHAIN</span>
          </div>
        </div>

        <div className="ac-header-right">
          {/* Role Toggle */}
          <div className="ac-role-toggle">
            <button
              type="button"
              className={`ac-role-btn ${role === "admin" ? "active" : ""}`}
              onClick={() => setRole("admin")}
            >
              <Shield size={14} />
              Admin
            </button>
            <button
              type="button"
              className={`ac-role-btn ${role === "user" ? "active" : ""}`}
              onClick={() => setRole("user")}
            >
              <Eye size={14} />
              User
            </button>
          </div>

          {/* User selector (for demo) */}
          {role === "user" && (
            <div className="ac-user-select">
              <label>Viewing as:</label>
              <select
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              >
                <option value="Alice">Alice</option>
                <option value="Bob">Bob</option>
                <option value="Charlie">Charlie</option>
                <option value="Dave">Dave</option>
              </select>
            </div>
          )}

          {/* Share button (admin only) */}
          {role === "admin" && (
            <button
              type="button"
              className="ac-action-btn"
              onClick={() => setShareOpen(true)}
            >
              <Link2 size={14} />
              Share Asset
            </button>
          )}

          {/* Chain stats */}
          <div className="ac-chain-stats">
            <ShieldCheck size={14} style={{ color: "var(--emerald)" }} />
            <span>{chain.length} blocks</span>
          </div>
        </div>
      </header>

      {/* ── Peer Status ───────────────────────────────────────────── */}
      <PeerStatusBar />

      {/* ── Main Content ──────────────────────────────────────────── */}
      <div className="ac-main">
        {/* 3D Visualization */}
        <div className="ac-3d-container">
          <BlockchainChain3D
            chain={chain}
            selectedBlock={selectedBlock}
            onSelectBlock={handleSelectBlock}
          />

          {/* Chain legend overlay */}
          <div className="ac-legend">
            <div className="ac-legend-item">
              <span className="ac-legend-dot" style={{ background: "#b66a42" }} />
              Genesis
            </div>
            <div className="ac-legend-item">
              <span className="ac-legend-dot" style={{ background: "#31755d" }} />
              Create
            </div>
            <div className="ac-legend-item">
              <span className="ac-legend-dot" style={{ background: "#3b82f6" }} />
              Transfer
            </div>
            <div className="ac-legend-item">
              <span className="ac-legend-dot" style={{ background: "#8b5cf6" }} />
              Share
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={role}
            className="ac-side-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {role === "admin" ? (
              <AdminPanel />
            ) : (
              <UserAssetView userName={userName} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Block Detail Sheet ────────────────────────────────────── */}
      <BlockDetailPanel
        block={selectedBlock}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      {/* ── Share Dialog ──────────────────────────────────────────── */}
      <ShareDialog open={shareOpen} onOpenChange={setShareOpen} />
    </div>
  );
}

// ---- Outer wrapper with providers ------------------------------------------

function AssetChainWithSync() {
  const { chain, importBlock } = useAssetChain();
  const chainRef = useRef(chain);
  chainRef.current = chain;

  const handleBlockReceived = useCallback(
    (block: AssetBlock): boolean => {
      const accepted = importBlock(block);
      if (accepted) {
        toast.success(`Block #${block.index} synced from peer`, {
          description: `${block.transactionType}: ${block.assetData.assetName}`,
        });
      }
      return accepted;
    },
    [importBlock],
  );

  const handleChainSyncResponse = useCallback(
    (incomingChain: AssetBlock[]) => {
      // Simple strategy: if incoming chain is longer, accept blocks we don't have.
      const current = chainRef.current;
      if (incomingChain.length > current.length) {
        for (let i = current.length; i < incomingChain.length; i++) {
          importBlock(incomingChain[i]);
        }
        toast.info(`Synced ${incomingChain.length - current.length} blocks from peer`);
      }
    },
    [importBlock],
  );

  const getChain = useCallback(() => chainRef.current, []);

  return (
    <PeerSyncProvider
      chainLength={chain.length}
      onBlockReceived={handleBlockReceived}
      onChainSyncResponse={handleChainSyncResponse}
      getChain={getChain}
    >
      <AssetChainContent />
    </PeerSyncProvider>
  );
}

// ---- Exported page component -----------------------------------------------

export default function AssetChainPage() {
  return (
    <AssetChainProvider>
      <AssetChainWithSync />
    </AssetChainProvider>
  );
}
