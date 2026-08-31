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
  Fingerprint,
  FileText,
  ShieldCheck,
  Clock,
  Check,
  Copy,
} from 'lucide-react';

import { useAssetChain } from '@/contexts/AssetChainContext';
import { usePeerSync } from '@/contexts/PeerSyncContext';
import { useAuth } from '@/contexts/AuthContext';
import type { AssetBlock } from '@/types/asset-chain';

import { BlockchainChain3D } from '@/components/asset-chain/BlockchainChain3D';
import { BlockDetailPanel } from '@/components/asset-chain/BlockDetailPanel';
import { AdminPanel } from '@/components/asset-chain/AdminPanel';
import { UserAssetView } from '@/components/asset-chain/UserAssetView';
import { ShareDialog } from '@/components/asset-chain/ShareDialog';
import { NetworkTopologyVisualizer } from '@/components/asset-chain/NetworkTopologyVisualizer';
import { ImmersiveHUD } from '@/components/asset-chain/ImmersiveHUD';

type SpatialDrawer = 'none' | 'admin' | 'assets' | 'network';
type UserSection = 'identity' | 'permissions' | 'assets' | 'profile';

export default function PlatformDashboard() {
  const { chain } = useAssetChain();
  const { broadcastBlock, peers } = usePeerSync();
  const { role, setRole, toggleRole, userName, userWallet, isAdmin, isUser } = useAuth();
  const [, navigate] = useLocation();

  const [hasEntered, setHasEntered] = useState(false);
  const [isInspecting, setIsInspecting] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<AssetBlock | null>(null);
  const [activeDrawer, setActiveDrawer] = useState<SpatialDrawer>('none');
  const [activeUserSection, setActiveUserSection] = useState<UserSection>('identity');
  const [shareOpen, setShareOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  // User flow state
  const [copiedWallet, setCopiedWallet] = useState(false);
  const [identityVerified, setIdentityVerified] = useState(true);
  const [userConsents, setUserConsents] = useState([
    {
      id: 'cns_8f2a10',
      provider: 'Apex Finance App',
      bank: 'Apex Financial (Bank A)',
      scope: 'TRANSACTIONS',
      status: 'Active',
      expires: 'in 54 minutes',
    },
  ]);
  const [bankSelect, setBankSelect] = useState('Apex Financial (Bank A)');
  const [tspSelect, setTspSelect] = useState('Apex Finance App');
  const [scopeSelect, setScopeSelect] = useState('TRANSACTIONS');
  const [durationSelect, setDurationSelect] = useState('3600');

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

  // Block inspection for Admin
  const handleBlockSelect = useCallback((block: AssetBlock) => {
    if (role === 'admin') {
      setSelectedBlock(block);
      setIsInspecting(true);
    }
  }, [role]);

  const handleExitInspect = useCallback(() => {
    setIsInspecting(false);
  }, []);

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(userWallet);
    setCopiedWallet(true);
    setTimeout(() => setCopiedWallet(false), 2000);
  };

  const handleGrantConsent = (e: React.FormEvent) => {
    e.preventDefault();
    const newConsent = {
      id: `cns_${Math.random().toString(16).substring(2, 8)}`,
      provider: tspSelect,
      bank: bankSelect,
      scope: scopeSelect,
      status: 'Active',
      expires: durationSelect === '3600' ? 'in 1 hour' : durationSelect === '86400' ? 'in 24 hours' : 'in 7 days',
    };
    setUserConsents((prev) => [newConsent, ...prev]);
    toast.success('Permission granted and recorded on ledger.');
  };

  const handleRevokeConsent = (id: string) => {
    setUserConsents((prev) => prev.filter((c) => c.id !== id));
    toast.info('Permission revoked.');
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#030508] text-zinc-100 select-none font-sans">
      {/* ── TOP FLOATING HUD (Strictly filtered navigation by Role) ─────────── */}
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
        onSelectUserSection={setActiveUserSection}
        activeUserSection={activeUserSection}
        hasEntered={hasEntered}
        onEnter={() => setHasEntered(true)}
        peerCount={peers.length}
      />

      {/* ── CONDITIONAL RENDERING: ADMIN (3D BLOCKCHAIN) VS USER (PERSONAL PORTAL) ── */}
      <AnimatePresence mode="wait">
        {role === 'admin' ? (
          /* ═══════════════════════════════════════════════════════════════════
             ADMIN MODE: 3D LIVING BLOCKCHAIN CANVAS & SPATIAL ENGINE
             ═══════════════════════════════════════════════════════════════════ */
          <motion.div
            key="admin-3d-scene"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-0"
          >
            <BlockchainChain3D
              chain={chain}
              selectedBlock={selectedBlock}
              onSelectBlock={handleBlockSelect}
              isDetailMode={isInspecting}
              onExitDetail={handleExitInspect}
              height="100%"
            />
          </motion.div>
        ) : (
          /* ═══════════════════════════════════════════════════════════════════
             USER MODE: DEDICATED PERSONAL IDENTITY & PERMISSIONS WORKSPACE
             (3D Blockchain Canvas & Blocks completely unmounted!)
             ═══════════════════════════════════════════════════════════════════ */
          <motion.div
            key="user-portal-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative z-10 w-full h-full pt-24 pb-12 px-6 overflow-y-auto bg-gradient-to-b from-[#080b11] via-[#05070c] to-[#030508]"
          >
            <div className="max-w-5xl mx-auto space-y-10">
              {/* User Identity Welcome Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    USER WORKSPACE • ALICE VANCE
                  </span>
                  <h1 className="text-3xl font-serif text-white font-normal">
                    Personal Identity & Data Vault
                  </h1>
                </div>

                <div className="flex items-center space-x-3 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-zinc-300 flex items-center gap-2">
                    <span>{userWallet.slice(0, 10)}...{userWallet.slice(-6)}</span>
                    <button
                      onClick={handleCopyWallet}
                      className="p-1 hover:text-white transition-colors cursor-pointer"
                      title="Copy wallet address"
                    >
                      {copiedWallet ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-zinc-400" />
                      )}
                    </button>
                  </div>
                  <span className="px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-semibold">
                    ● Identity Verified
                  </span>
                </div>
              </div>

              {/* ── SECTION 1: IDENTITY ────────────────────────────────────── */}
              {activeUserSection === 'identity' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  <div className="md:col-span-6 space-y-6">
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                        DECENTRALIZED IDENTIFIER
                      </span>
                      <h3 className="text-2xl font-serif text-white">
                        You’re in control.
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                        Your digital identity is anchored to cryptographic keys. You decide exactly
                        which authorized providers can view your account history, balances, or credentials.
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase">
                          Decentralized ID (DID)
                        </span>
                        <div className="font-mono text-xs text-cyan-300 break-all">
                          did:openbanking:usr_70997970c5812dc3a010c7
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between">
                        <span className="text-xs text-zinc-300">Identity Status:</span>
                        <span className="text-xs font-mono text-emerald-400 font-bold">
                          ACTIVE & VERIFIED
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setIdentityVerified(true);
                          toast.success('Identity cryptographically re-verified.');
                        }}
                        className="w-full py-3 rounded-xl border border-white/[0.1] hover:border-white/[0.2] bg-white/[0.03] hover:bg-white/[0.06] text-xs font-medium text-white transition-all cursor-pointer flex items-center justify-center space-x-2"
                      >
                        <ShieldCheck className="h-4 w-4 text-emerald-400" />
                        <span>Re-Verify Digital Identity</span>
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-6 space-y-4">
                    <div className="p-6 rounded-2xl border border-white/[0.08] bg-zinc-950/60 space-y-4 shadow-xl">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-center text-blue-400">
                          <Lock className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">Private & Zero-Knowledge</h4>
                          <p className="text-[11px] text-zinc-400">Your raw credentials are never exposed.</p>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                        Third-party service providers receive short-lived cryptographic tokens
                        strictly matching your explicit consent boundaries.
                      </p>
                      <button
                        onClick={() => setActiveUserSection('permissions')}
                        className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-md"
                      >
                        <span>Manage Data Sharing Permissions</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── SECTION 2: PERMISSIONS & CONSENTS ──────────────────────── */}
              {activeUserSection === 'permissions' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Grant Consent Form */}
                    <div className="md:col-span-6 space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                          DATA CONSENT ENGINE
                        </span>
                        <h3 className="text-xl font-serif text-white">Share your data</h3>
                        <p className="text-xs text-zinc-400">
                          Choose what you want to share and who can access it.
                        </p>
                      </div>

                      <form onSubmit={handleGrantConsent} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                          <label className="text-xs text-zinc-300 font-medium">01 Choose your bank</label>
                          <select
                            value={bankSelect}
                            onChange={(e) => setBankSelect(e.target.value)}
                            className="w-full h-10 px-3 rounded-lg bg-black/60 border border-white/[0.08] text-xs text-zinc-200 focus:border-blue-500 focus:outline-none"
                          >
                            <option value="Apex Financial (Bank A)">Apex Financial (Bank A)</option>
                            <option value="Beacon Trust (Bank B)">Beacon Trust (Bank B)</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs text-zinc-300 font-medium">02 Who are you sharing with?</label>
                          <select
                            value={tspSelect}
                            onChange={(e) => setTspSelect(e.target.value)}
                            className="w-full h-10 px-3 rounded-lg bg-black/60 border border-white/[0.08] text-xs text-zinc-200 focus:border-blue-500 focus:outline-none"
                          >
                            <option value="Apex Finance App">Apex Finance App (Aggregator)</option>
                            <option value="Horizon Wealth Intelligence">Horizon Wealth Intelligence</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-xs text-zinc-300 font-medium">03 Data Scope</label>
                            <select
                              value={scopeSelect}
                              onChange={(e) => setScopeSelect(e.target.value)}
                              className="w-full h-10 px-3 rounded-lg bg-black/60 border border-white/[0.08] text-xs text-zinc-200 focus:border-blue-500 focus:outline-none"
                            >
                              <option value="TRANSACTIONS">Transactions</option>
                              <option value="BALANCE">Balance</option>
                              <option value="ACCOUNT_INFO">Account Info</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs text-zinc-300 font-medium">04 Duration</label>
                            <select
                              value={durationSelect}
                              onChange={(e) => setDurationSelect(e.target.value)}
                              className="w-full h-10 px-3 rounded-lg bg-black/60 border border-white/[0.08] text-xs text-zinc-200 focus:border-blue-500 focus:outline-none"
                            >
                              <option value="3600">1 hour</option>
                              <option value="86400">24 hours</option>
                              <option value="604800">7 days</option>
                            </select>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-all cursor-pointer shadow-lg flex items-center justify-center space-x-2"
                        >
                          <span>Confirm and share</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </form>
                    </div>

                    {/* Active Permissions Stream */}
                    <div className="md:col-span-6 space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                          ACTIVE GRANTS
                        </span>
                        <h3 className="text-xl font-serif text-white">Your active permissions</h3>
                        <p className="text-xs text-zinc-400">
                          See who currently has access to your data.
                        </p>
                      </div>

                      <div className="divide-y divide-white/[0.06] pt-2">
                        {userConsents.map((c) => (
                          <div key={c.id} className="py-3.5 flex items-center justify-between gap-3 text-xs">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-white">{c.provider}</span>
                                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-blue-950/40 border border-blue-500/20 text-blue-400">
                                  {c.scope}
                                </span>
                              </div>
                              <span className="text-zinc-500 text-[11px]">
                                {c.bank} • Expires {c.expires}
                              </span>
                            </div>

                            <button
                              onClick={() => handleRevokeConsent(c.id)}
                              className="text-xs text-red-400 hover:text-red-300 font-medium cursor-pointer py-1 px-2 rounded hover:bg-red-950/20 transition-colors"
                            >
                              Revoke →
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── SECTION 3: MY ASSETS ───────────────────────────────────── */}
              {activeUserSection === 'assets' && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                      SYNCHRONIZED ASSETS
                    </span>
                    <h3 className="text-2xl font-serif text-white">My Accessible Assets</h3>
                    <p className="text-xs text-zinc-400">
                      Tokens, cryptographic credentials, and hardware assets registered to Alice Vance.
                    </p>
                  </div>

                  <UserAssetView userName="Alice Vance" />
                </div>
              )}

              {/* ── SECTION 4: PROFILE & ACTIVITY ──────────────────────────── */}
              {activeUserSection === 'profile' && (
                <div className="space-y-6 max-w-2xl">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                      SECURITY PROFILE
                    </span>
                    <h3 className="text-2xl font-serif text-white">Account & Telemetry</h3>
                  </div>

                  <div className="p-6 rounded-2xl border border-white/[0.08] bg-zinc-950/60 space-y-4 text-xs font-mono">
                    <div className="flex justify-between py-2 border-b border-white/[0.04]">
                      <span className="text-zinc-400">Role:</span>
                      <span className="text-emerald-400 font-bold">Standard User</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/[0.04]">
                      <span className="text-zinc-400">Wallet:</span>
                      <span className="text-zinc-200">{userWallet}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/[0.04]">
                      <span className="text-zinc-400">Blockchain Clearance:</span>
                      <span className="text-zinc-400">Standard (Restricted from Raw Blockchain 3D Engine)</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-zinc-400">Consent Protocol:</span>
                      <span className="text-blue-400">Algorand PyTeal Verifiable Access</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ADMIN ONLY DRAWERS ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeDrawer !== 'none' && role === 'admin' && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed top-0 right-0 z-40 h-screen w-full sm:w-[480px] bg-zinc-950/95 border-l border-white/[0.08] backdrop-blur-2xl shadow-2xl p-6 md:p-8 flex flex-col justify-between"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center space-x-2.5">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <h3 className="text-sm font-bold tracking-wider text-white uppercase font-mono">
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

      {/* ── ADMIN BLOCK DETAIL SHEET ────────────────────────────────────────── */}
      {role === 'admin' && (
        <BlockDetailPanel
          block={selectedBlock || latestBlock}
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          onSelectBlock={setSelectedBlock}
        />
      )}

      {/* ── SHARE ASSET DIALOG ──────────────────────────────────────────────── */}
      <ShareDialog open={shareOpen} onOpenChange={setShareOpen} />
    </div>
  );
}
