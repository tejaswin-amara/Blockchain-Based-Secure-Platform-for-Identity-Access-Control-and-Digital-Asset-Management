'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Eye,
  ArrowLeft,
  ExternalLink,
  Zap,
  Radio,
  Layers,
  Sparkles,
} from 'lucide-react';
import type { AssetBlock } from '@/types/asset-chain';

interface ImmersiveHUDProps {
  chain: AssetBlock[];
  activeBlock: AssetBlock | null;
  isInspecting: boolean;
  onExitInspect: () => void;
  role: 'admin' | 'user';
  onToggleRole: (role: 'admin' | 'user') => void;
  onOpenAdmin: () => void;
  onOpenAssets: () => void;
  onOpenNetwork: () => void;
  onOpenBanking: () => void;
  hasEntered: boolean;
  onEnter: () => void;
  peerCount: number;
}

export function ImmersiveHUD({
  chain,
  activeBlock,
  isInspecting,
  onExitInspect,
  role,
  onToggleRole,
  onOpenAdmin,
  onOpenAssets,
  onOpenNetwork,
  onOpenBanking,
  hasEntered,
  onEnter,
  peerCount,
}: ImmersiveHUDProps) {
  const latestBlock = activeBlock || (chain.length > 0 ? chain[chain.length - 1] : null);

  return (
    <>
      {/* ── CINEMATIC OPENING ENTRY CURTAIN ──────────────────────────────────── */}
      <AnimatePresence>
        {!hasEntered && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-between p-8 md:p-14 bg-[#030508] text-white selection:bg-cyan-500/20"
          >
            {/* Top Minimal Reference */}
            <div className="w-full flex items-center justify-between text-[11px] font-mono tracking-widest text-zinc-500 uppercase">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                AETHELIA ARCHITECTURE
              </span>
              <span>VERIFIABLE LEDGER PROTOCOL 01</span>
            </div>

            {/* Center Cinematic Entry Title */}
            <div className="flex flex-col items-center text-center space-y-6 max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/20 text-cyan-400 font-mono text-[11px] tracking-wider uppercase"
              >
                <Sparkles className="h-3 w-3" />
                <span>SPATIAL ASSET OWNERSHIP ENVIRONMENT</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.9 }}
                className="text-4xl md:text-6xl font-serif tracking-tight text-white leading-tight"
              >
                Enter the <em className="text-[var(--copper-bright)] not-italic">Living Blockchain</em>.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.9 }}
                className="text-xs md:text-sm font-sans text-zinc-400 leading-relaxed max-w-lg"
              >
                A spatial cryptographic realm where physical & digital assets exist as immutable,
                inspectable 3D blocks linked through zero-entropy state hashes.
              </motion.p>

              {/* Enter Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                onClick={onEnter}
                className="group relative mt-4 px-8 py-3.5 rounded-full border border-white/20 bg-white/[0.04] hover:bg-white/[0.1] backdrop-blur-xl text-white font-mono text-xs tracking-widest uppercase transition-all duration-300 cursor-pointer shadow-2xl hover:border-cyan-400 hover:shadow-cyan-500/20"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <span>ENTER SPATIAL CHAIN</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">↓</span>
                </span>
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            </div>

            {/* Bottom Telemetry */}
            <div className="w-full flex items-center justify-between text-[10px] font-mono text-zinc-600 uppercase">
              <span>SHA-256 CONSTRAINED STATE ENGINE</span>
              <span>SCROLL / CLICK INTERACTION ENABLED</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MINIMAL FLOATING HUD CHROME (Active in 3D Scene) ────────────────── */}
      <div className="pointer-events-none fixed inset-0 z-30 flex flex-col justify-between p-5 md:p-8 select-none font-mono">
        {/* Top Floating Bar */}
        <header className="flex items-center justify-between">
          {/* Top-Left Brand Telemetry */}
          <div className="pointer-events-auto flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-zinc-900/80 border border-white/[0.1] backdrop-blur-xl flex items-center justify-center shadow-lg">
              <span className="text-sm font-serif text-[var(--copper-bright)] font-bold">◈</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold tracking-widest text-white uppercase">
                  AETHELIA
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="text-[9px] text-zinc-500 tracking-widest uppercase block">
                SPATIAL PROVENANCE ENGINE
              </span>
            </div>
          </div>

          {/* Top-Right Architectural Text Navigation Links */}
          <div className="pointer-events-auto flex items-center space-x-2 md:space-x-4 text-[11px] text-zinc-400">
            {isInspecting ? (
              <button
                onClick={onExitInspect}
                className="px-4 py-2 rounded-full border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 flex items-center gap-2 backdrop-blur-xl transition-all cursor-pointer shadow-lg shadow-cyan-950/40"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>RETURN TO ORBIT</span>
              </button>
            ) : (
              <>
                <button
                  onClick={onOpenAssets}
                  className="px-3 py-1.5 rounded-lg border border-white/[0.06] bg-black/40 hover:bg-white/[0.08] hover:text-white backdrop-blur-md transition-all cursor-pointer"
                >
                  <span className="hidden sm:inline">VAULT</span> ASSETS
                </button>

                <button
                  onClick={onOpenNetwork}
                  className="px-3 py-1.5 rounded-lg border border-white/[0.06] bg-black/40 hover:bg-white/[0.08] hover:text-white backdrop-blur-md transition-all cursor-pointer"
                >
                  <span className="hidden sm:inline">P2P</span> NETWORK
                </button>

                <button
                  onClick={onOpenAdmin}
                  className="px-3 py-1.5 rounded-lg border border-[var(--copper)]/30 bg-[var(--copper)]/10 hover:bg-[var(--copper)]/20 text-[var(--copper-bright)] backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Shield className="h-3 w-3" />
                  <span>ADMIN</span>
                </button>

                <button
                  onClick={onOpenBanking}
                  className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/[0.06] bg-black/40 hover:bg-white/[0.08] hover:text-white backdrop-blur-md transition-all cursor-pointer"
                  title="Open Banking Consent & DID Gateway"
                >
                  <span>BANKING</span>
                  <ExternalLink className="h-2.5 w-2.5 text-zinc-500" />
                </button>

                {/* Role Switcher Pill */}
                <div className="flex p-0.5 rounded-lg border border-white/[0.08] bg-black/50 text-[10px]">
                  <button
                    onClick={() => onToggleRole('admin')}
                    className={`px-2 py-1 rounded transition-all cursor-pointer ${
                      role === 'admin'
                        ? 'bg-[var(--copper)] text-white font-bold'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    ADMIN
                  </button>
                  <button
                    onClick={() => onToggleRole('user')}
                    className={`px-2 py-1 rounded transition-all cursor-pointer ${
                      role === 'user'
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    USER
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Center Floating Discovery Indicator (Only when NOT inspecting) */}
        {!isInspecting && (
          <div className="flex justify-center pointer-events-none pb-2">
            <motion.div
              animate={{ y: [0, -4, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
              className="px-4 py-2 rounded-full border border-white/[0.08] bg-black/60 backdrop-blur-xl text-[10px] text-zinc-400 tracking-wider uppercase flex items-center gap-2 shadow-2xl"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>CLICK BLOCK TO INSPECT INTERNAL CORE • DRAG TO ORBIT</span>
            </motion.div>
          </div>
        )}

        {/* Bottom Floating Telemetry Ribbon */}
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-zinc-500 tracking-widest uppercase">
          {/* Block Height & Hash Preview */}
          <div className="pointer-events-auto flex items-center space-x-3 px-3 py-1.5 rounded-lg bg-black/50 border border-white/[0.06] backdrop-blur-md">
            <span className="text-zinc-400">BLOCK:</span>
            <span className="text-white font-bold">
              {latestBlock ? `#${latestBlock.index.toString().padStart(3, '0')}` : '#000'}
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-cyan-400">
              {latestBlock?.currentHash ? `${latestBlock.currentHash.substring(0, 10)}...` : '0x0000'}
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-emerald-400 font-semibold">
              {latestBlock?.validationStatus || 'VERIFIED'}
            </span>
          </div>

          {/* Network Sync Status */}
          <div className="pointer-events-auto flex items-center space-x-3 px-3 py-1.5 rounded-lg bg-black/50 border border-white/[0.06] backdrop-blur-md">
            <span className="flex items-center gap-1 text-zinc-400">
              <Radio className="h-3 w-3 text-cyan-400 animate-pulse" />
              <span>GOSSIP MESH:</span>
            </span>
            <span className="text-white font-bold">{Math.max(1, peerCount + 1)} NODES</span>
            <span className="text-zinc-600">•</span>
            <span className="text-emerald-400">CHAIN SYNCHRONIZED</span>
          </div>
        </footer>
      </div>
    </>
  );
}
