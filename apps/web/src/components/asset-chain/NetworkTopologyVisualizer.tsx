'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Server,
  Share2,
  CheckCircle2,
  Radio,
  Zap,
  Globe,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { usePeerSync } from '@/contexts/PeerSyncContext';
import { useAssetChain } from '@/contexts/AssetChainContext';
import { Button } from '@/components/ui/button';

type PropagationStep = 'idle' | 'created' | 'validating' | 'broadcasting' | 'acknowledged' | 'synchronized';

interface NodeStatus {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'syncing' | 'synced';
  latency: number;
  blockHeight: number;
}

export function NetworkTopologyVisualizer() {
  const { peerId, peerName, peers, requestSync } = usePeerSync();
  const { chain } = useAssetChain();

  const [step, setStep] = useState<PropagationStep>('idle');
  const [activePacket, setActivePacket] = useState<string | null>(null);

  // Simulated & real peers list
  const defaultPeers: NodeStatus[] = [
    {
      id: 'peer-alpha',
      name: 'Validator-Alpha (US-East)',
      role: 'Full Auditing Node',
      status: 'synced',
      latency: 24,
      blockHeight: chain.length,
    },
    {
      id: 'peer-beta',
      name: 'Validator-Beta (EU-Central)',
      role: 'Consensus Peer',
      status: 'synced',
      latency: 48,
      blockHeight: chain.length,
    },
    {
      id: 'peer-gamma',
      name: 'Validator-Gamma (AP-South)',
      role: 'Edge Replica Node',
      status: 'synced',
      latency: 72,
      blockHeight: chain.length,
    },
  ];

  // Merge with real discovered browser peers if any
  const connectedNodes: NodeStatus[] = peers.map((p, idx) => ({
    id: p.peerId,
    name: `${p.displayName} (Browser Tab #${idx + 1})`,
    role: 'P2P Gossip Peer',
    status: 'synced',
    latency: 12,
    blockHeight: p.blockCount || chain.length,
  }));

  const allPeers = connectedNodes.length > 0 ? connectedNodes : defaultPeers;

  // Auto trigger propagation animation when a new block is appended
  useEffect(() => {
    if (chain.length <= 1) return;
    const latestBlock = chain[chain.length - 1];
    triggerPropagation(latestBlock.index, latestBlock.currentHash);
  }, [chain.length]);

  const triggerPropagation = (blockNum: number, hash: string) => {
    setActivePacket(`Block #${blockNum} [${hash.substring(0, 8)}...]`);
    setStep('created');

    setTimeout(() => {
      setStep('validating');
    }, 700);

    setTimeout(() => {
      setStep('broadcasting');
    }, 1500);

    setTimeout(() => {
      setStep('acknowledged');
    }, 2400);

    setTimeout(() => {
      setStep('synchronized');
    }, 3200);

    setTimeout(() => {
      setStep('idle');
      setActivePacket(null);
    }, 5500);
  };

  const latestBlock = chain[chain.length - 1];

  return (
    <div className="w-full space-y-6">
      {/* Topology Header & Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-white/[0.08] bg-zinc-950/60 backdrop-blur-xl shadow-2xl">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <Radio className="h-5 w-5 text-cyan-400 animate-pulse" />
            <h3 className="text-base font-bold font-mono tracking-wide text-white uppercase">
              P2P Network Topology & Block Propagation
            </h3>
          </div>
          <p className="text-xs text-zinc-400 font-sans max-w-xl">
            Live decentralized gossip protocol synchronizing asset states across active peers via browser{' '}
            <code className="text-cyan-300">BroadcastChannel</code> message bus.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={() => triggerPropagation(latestBlock.index, latestBlock.currentHash)}
            disabled={step !== 'idle'}
            className="h-10 px-5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-mono text-xs font-semibold shadow-lg shadow-cyan-900/30 transition-all cursor-pointer"
          >
            <Zap className="h-4 w-4 mr-2" />
            {step === 'idle' ? 'Simulate Gossip Broadcast' : 'Propagating...'}
          </Button>

          <Button
            variant="outline"
            onClick={requestSync}
            className="h-10 px-4 rounded-xl border-white/10 hover:bg-white/5 text-zinc-300 font-mono text-xs cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-2" />
            Resync
          </Button>
        </div>
      </div>

      {/* Propagation Stepper Status Indicator */}
      <AnimatePresence>
        {step !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/30 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4 font-mono text-xs shadow-lg"
          >
            <div className="flex items-center space-x-3">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-cyan-200 font-bold uppercase">Gossip Sequence Active:</span>
              <span className="text-white font-medium">{activePacket}</span>
            </div>

            <div className="flex items-center space-x-2 text-[11px]">
              <span className={step === 'created' ? 'text-cyan-400 font-bold' : 'text-zinc-500'}>
                1. Created
              </span>
              <ArrowRight className="h-3 w-3 text-zinc-600" />
              <span className={step === 'validating' ? 'text-amber-400 font-bold' : 'text-zinc-500'}>
                2. Validating
              </span>
              <ArrowRight className="h-3 w-3 text-zinc-600" />
              <span className={step === 'broadcasting' ? 'text-sky-400 font-bold' : 'text-zinc-500'}>
                3. Broadcasting
              </span>
              <ArrowRight className="h-3 w-3 text-zinc-600" />
              <span className={step === 'acknowledged' ? 'text-purple-400 font-bold' : 'text-zinc-500'}>
                4. Peers Verified
              </span>
              <ArrowRight className="h-3 w-3 text-zinc-600" />
              <span className={step === 'synchronized' ? 'text-emerald-400 font-bold' : 'text-zinc-500'}>
                5. Synchronized ✓
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visual Network Topology Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Origin Authority / Admin Node */}
        <div className="lg:col-span-5 p-6 rounded-2xl border border-emerald-500/30 bg-zinc-950/80 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Server className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">
                  Authoritative Minter
                </span>
                <h4 className="text-sm font-bold font-mono text-white">
                  {peerName} (Local Node)
                </h4>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ● PRIMARY
            </span>
          </div>

          <div className="space-y-2 font-mono text-xs border-t border-white/[0.08] pt-4">
            <div className="flex justify-between text-zinc-400">
              <span>Node Identifier:</span>
              <span className="text-zinc-200">{peerId.substring(0, 14)}...</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Current Block Height:</span>
              <span className="text-emerald-400 font-bold">#{chain.length}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Consensus Engine:</span>
              <span className="text-cyan-300">PoA Cryptographic Ledger</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Gossip Transport:</span>
              <span className="text-zinc-200">BroadcastChannel v1.0</span>
            </div>
          </div>
        </div>

        {/* Center: Conduits & Wave Animation */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center space-y-2 py-4">
          <div className="relative flex items-center justify-center">
            {step === 'broadcasting' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 1 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="absolute h-14 w-14 rounded-full border border-cyan-400 bg-cyan-400/20"
              />
            )}
            <div className="p-3 rounded-full bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 z-10 shadow-lg">
              <Share2 className="h-6 w-6" />
            </div>
          </div>
          <span className="text-[11px] font-mono text-zinc-400 text-center">
            {step === 'broadcasting' ? 'Broadcasting...' : 'Gossip Conduit'}
          </span>
        </div>

        {/* Right: Connected Peer Nodes List */}
        <div className="lg:col-span-5 space-y-3">
          {allPeers.map((node, index) => {
            const isAcknowledging = step === 'acknowledged' || step === 'synchronized';

            return (
              <motion.div
                key={node.id}
                whileHover={{ x: 4 }}
                className={`p-4 rounded-xl border transition-all ${
                  isAcknowledging
                    ? 'border-emerald-500/40 bg-emerald-950/20 shadow-md'
                    : 'border-white/[0.08] bg-zinc-950/60 backdrop-blur-xl'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-4 w-4 text-cyan-400" />
                    <div>
                      <h5 className="text-xs font-bold font-mono text-white">{node.name}</h5>
                      <span className="text-[10px] font-mono text-zinc-400">{node.role}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-[11px] font-mono text-zinc-500">{node.latency}ms</span>
                    {isAcknowledging ? (
                      <span className="flex items-center text-[11px] font-mono text-emerald-400 font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        Verified
                      </span>
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
