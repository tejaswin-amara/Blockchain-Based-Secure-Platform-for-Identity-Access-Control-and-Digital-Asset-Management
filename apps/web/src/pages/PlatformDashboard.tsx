'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import {
  X,
  Blocks,
  Activity,
  Layers,
  Users,
  Radio,
  Sparkles,
  ArrowRight,
  Shield,
  Eye,
  Link2,
  ExternalLink,
  ChevronDown,
  Lock,
  Zap,
} from 'lucide-react';

import { AssetChainProvider, useAssetChain } from '@/contexts/AssetChainContext';
import { PeerSyncProvider, usePeerSync } from '@/contexts/PeerSyncContext';
import type { AssetBlock } from '@/types/asset-chain';

import { BlockchainChain3D } from '@/components/asset-chain/BlockchainChain3D';
import { BlockDetailPanel } from '@/components/asset-chain/BlockDetailPanel';
import { AdminPanel } from '@/components/asset-chain/AdminPanel';
import { UserAssetView } from '@/components/asset-chain/UserAssetView';
import { ShareDialog } from '@/components/asset-chain/ShareDialog';
import { BlockchainAnalytics } from '@/components/asset-chain/BlockchainAnalytics';
import { NetworkTopologyVisualizer } from '@/components/asset-chain/NetworkTopologyVisualizer';
import { ImmersiveHUD } from '@/components/asset-chain/ImmersiveHUD';

type SpatialDrawer = 'none' | 'admin' | 'assets' | 'network' | 'analytics';

function DashboardSpatialInner() {
  const { chain, listAssets } = useAssetChain();
  const { broadcastBlock, peers } = usePeerSync();
  const [, navigate] = useLocation();

  const [hasEntered, setHasEntered] = useState(false);
  const [isInspecting, setIsInspecting] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<AssetBlock | null>(null);
  const [activeDrawer, setActiveDrawer] = useState<SpatialDrawer>('none');
  const [role, setRole] = useState<'admin' | 'user'>('admin');
  const [userName, setUserName] = useState('Alice Vance');
  const [shareOpen, setShareOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Broadcast any newly created block across peers
  const prevChainLengthRef = useRef(chain.length);
  useEffect(() => {
    if (chain.length > prevChainLengthRef.current) {
      const newBlock = chain[chain.length - 1];
      if (newBlock) {
        broadcastBlock(newBlock);
      }
      prevChainLengthRef.current = chain.length;
    }
  }, [chain, broadcastBlock]);

  const latestBlock = chain.length > 0 ? chain[chain.length - 1] : null;

  // Clicking the 3D block initiates camera push-in & internal core discovery
  const handleBlockSelect = useCallback((block: AssetBlock) => {
    setSelectedBlock(block);
    setIsInspecting(true);
    // Also prepare the detail sheet if the user wants deeper metadata
  }, []);

  const handleExitInspect = useCallback(() => {
    setIsInspecting(false);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#030508] text-zinc-100 select-none">
      {/* ── IMMERSIVE FULLSCREEN 3D CANVAS (Hero Centerpiece & World) ────────── */}
      <div className="absolute inset-0 z-0">
        <BlockchainChain3D
          chain={chain}
          selectedBlock={selectedBlock}
          onSelectBlock={handleBlockSelect}
          mode="centerpiece"
          centerpieceBlock={selectedBlock || latestBlock}
          isDetailMode={isInspecting}
          onExitDetail={handleExitInspect}
          height="100%"
        />
      </div>

      {/* ── MINIMAL ARCHITECTURAL FLOATING HUD CHROME ───────────────────────── */}
      <ImmersiveHUD
        chain={chain}
        activeBlock={selectedBlock || latestBlock}
        isInspecting={isInspecting}
        onExitInspect={handleExitInspect}
        role={role}
        onToggleRole={setRole}
        onOpenAdmin={() => setActiveDrawer('admin')}
        onOpenAssets={() => setActiveDrawer('assets')}
        onOpenNetwork={() => setActiveDrawer('network')}
        onOpenBanking={() => navigate('/open-banking')}
        hasEntered={hasEntered}
        onEnter={() => setHasEntered(true)}
        peerCount={peers.length}
      />

      {/* ── BOTTOM CORNER ACTION: OPEN DEEP METADATA SHEET ─────────────────── */}
      {isInspecting && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setSheetOpen(true)}
            className="px-5 py-2.5 rounded-full border border-cyan-500/40 bg-black/80 hover:bg-cyan-950/40 text-cyan-300 text-xs font-mono tracking-wider uppercase backdrop-blur-xl transition-all shadow-2xl flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Open Provenance Sheet</span>
          </motion.button>
        </div>
      )}

      {/* ── SLIDING GLASS DRAWER FOR ASSETS, ADMIN, & NETWORK ────────────────── */}
      <AnimatePresence>
        {activeDrawer !== 'none' && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[540px] z-40 bg-[#06080e]/92 border-l border-white/[0.08] backdrop-blur-2xl p-6 flex flex-col shadow-2xl overflow-hidden text-xs font-mono"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center space-x-2.5">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <h3 className="text-sm font-bold tracking-wider text-white uppercase">
                  {activeDrawer === 'admin'
                    ? 'Governance & Minting Console'
                    : activeDrawer === 'assets'
                    ? 'Decentralized Asset Vault'
                    : 'Gossip Network Topology'}
                </h3>
              </div>

              <button
                onClick={() => setActiveDrawer('none')}
                className="h-8 w-8 rounded-lg border border-white/[0.08] hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto py-6 space-y-6">
              {activeDrawer === 'admin' && (
                <div className="space-y-6">
                  <AdminPanel />
                  <div className="p-4 rounded-xl border border-white/[0.06] bg-black/40 text-zinc-400 font-sans text-xs">
                    <span className="font-mono text-cyan-300 font-bold block mb-1">
                      IMMUTABLE TRANSACTION DISPATCHER
                    </span>
                    Every asset creation or ownership transfer commits a new cryptographically
                    anchored block directly to the living 3D blockchain world.
                  </div>
                </div>
              )}

              {activeDrawer === 'assets' && (
                <div className="space-y-4">
                  <UserAssetView userName={userName} />
                </div>
              )}

              {activeDrawer === 'network' && (
                <div className="space-y-6">
                  <NetworkTopologyVisualizer />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BLOCK DETAIL SHEET ──────────────────────────────────────────────── */}
      <BlockDetailPanel
        block={selectedBlock || latestBlock}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSelectBlock={setSelectedBlock}
      />

      {/* ── SHARE ASSET DIALOG ──────────────────────────────────────────────── */}
      <ShareDialog open={shareOpen} onOpenChange={setShareOpen} />
    </div>
  );
}

function DashboardWithProviders() {
  const { chain, importBlock } = useAssetChain();
  const chainRef = useRef(chain);
  chainRef.current = chain;

  const handleBlockReceived = useCallback(
    (block: AssetBlock): boolean => {
      const accepted = importBlock(block);
      if (accepted) {
        toast.success(`Block #${block.index} synchronized via gossip`, {
          description: `${block.transactionType}: ${block.assetData?.assetName}`,
        });
      }
      return accepted;
    },
    [importBlock]
  );

  const handleChainSyncResponse = useCallback(
    (incomingChain: AssetBlock[]) => {
      const current = chainRef.current;
      if (incomingChain.length > current.length) {
        for (let i = current.length; i < incomingChain.length; i++) {
          importBlock(incomingChain[i]);
        }
        toast.info(`Synced ${incomingChain.length - current.length} blocks from peer`);
      }
    },
    [importBlock]
  );

  const getChain = useCallback(() => chainRef.current, []);

  return (
    <PeerSyncProvider
      chainLength={chain.length}
      onBlockReceived={handleBlockReceived}
      onChainSyncResponse={handleChainSyncResponse}
      getChain={getChain}
    >
      <DashboardSpatialInner />
    </PeerSyncProvider>
  );
}

export default function PlatformDashboard() {
  return (
    <AssetChainProvider>
      <DashboardWithProviders />
    </AssetChainProvider>
  );
}
