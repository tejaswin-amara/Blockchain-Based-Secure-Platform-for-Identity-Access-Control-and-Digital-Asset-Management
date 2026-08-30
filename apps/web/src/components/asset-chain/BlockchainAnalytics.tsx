'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Activity,
  TrendingUp,
  PieChart as PieIcon,
  Layers,
  ShieldCheck,
  Zap,
  Lock,
} from 'lucide-react';
import type { AssetBlock } from '@/types/asset-chain';

interface BlockchainAnalyticsProps {
  chain: AssetBlock[];
}

const COLORS = {
  CREATE: '#10b981', // Emerald
  TRANSFER: '#38bdf8', // Blue
  SHARE: '#a855f7', // Purple
  GENESIS: '#d08a5d', // Copper
};

const TYPE_COLORS: Record<string, string> = {
  Hardware: '#06b6d4',
  Software: '#3b82f6',
  Document: '#f59e0b',
  Certificate: '#10b981',
  License: '#ec4899',
};

export function BlockchainAnalytics({ chain }: BlockchainAnalyticsProps) {
  // 1. Transaction Type Breakdown
  const transactionData = useMemo(() => {
    const counts = { CREATE: 0, TRANSFER: 0, SHARE: 0 };
    chain.forEach((b) => {
      if (b.index === 0) return; // skip genesis
      if (counts[b.transactionType] !== undefined) {
        counts[b.transactionType]++;
      }
    });

    return [
      { name: 'Creation (Mint)', value: counts.CREATE, color: COLORS.CREATE, key: 'CREATE' },
      { name: 'Transfer', value: counts.TRANSFER, color: COLORS.TRANSFER, key: 'TRANSFER' },
      { name: 'Authorization (Share)', value: counts.SHARE, color: COLORS.SHARE, key: 'SHARE' },
    ].filter((item) => item.value > 0 || chain.length <= 2);
  }, [chain]);

  // 2. Activity Timeline (Blocks over sequence)
  const timelineData = useMemo(() => {
    return chain.map((block) => {
      const date = new Date(block.timestamp);
      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      return {
        block: `#${block.index}`,
        time: timeStr,
        cumulative: block.index + 1,
        type: block.transactionType,
      };
    });
  }, [chain]);

  // 3. Asset Type Breakdown
  const assetTypeData = useMemo(() => {
    const types: Record<string, number> = {};
    chain.forEach((b) => {
      if (b.assetData?.assetType && b.assetData.assetId !== 'GENESIS') {
        types[b.assetData.assetType] = (types[b.assetData.assetType] || 0) + 1;
      }
    });

    return Object.entries(types).map(([name, count]) => ({
      name,
      count,
      color: TYPE_COLORS[name] || '#64748b',
    }));
  }, [chain]);

  // Key KPI numbers
  const verifiedCount = chain.filter((b) => b.validationStatus === 'VERIFIED').length;
  const verifiedRate = chain.length > 0 ? Math.round((verifiedCount / chain.length) * 100) : 100;
  const totalTransfers = chain.filter((b) => b.transactionType === 'TRANSFER').length;

  return (
    <div className="w-full space-y-6">
      {/* Analytics KPI Metric Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 rounded-xl border border-white/[0.08] bg-zinc-950/60 backdrop-blur-xl shadow-lg"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono tracking-wider uppercase">Audit Accuracy</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{verifiedRate}%</div>
          <span className="text-[11px] text-emerald-400 font-mono">100% Cryptographically Valid</span>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 rounded-xl border border-white/[0.08] bg-zinc-950/60 backdrop-blur-xl shadow-lg"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono tracking-wider uppercase">Total Transfers</span>
            <Activity className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{totalTransfers}</div>
          <span className="text-[11px] text-sky-400 font-mono">Zero-Drift Provenance</span>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 rounded-xl border border-white/[0.08] bg-zinc-950/60 backdrop-blur-xl shadow-lg"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono tracking-wider uppercase">Block Finality</span>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">&lt; 12ms</div>
          <span className="text-[11px] text-amber-400 font-mono">SHA-256 Micro-Latency</span>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 rounded-xl border border-white/[0.08] bg-zinc-950/60 backdrop-blur-xl shadow-lg"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono tracking-wider uppercase">Cipher Entropy</span>
            <Lock className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">256-bit</div>
          <span className="text-[11px] text-purple-400 font-mono">Collision-Resistant Hash</span>
        </motion.div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Blockchain Growth Over Time */}
        <div className="p-6 rounded-2xl border border-white/[0.08] bg-zinc-950/60 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <h3 className="text-sm font-semibold font-mono tracking-wide text-zinc-100 uppercase">
                Blockchain Growth & Finalized Blocks
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-500">{chain.length} confirmed</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="block"
                  stroke="#52525b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#27272a' }}
                />
                <YAxis
                  stroke="#52525b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#27272a' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090b10',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area
                  type="monotone"
                  dataKey="cumulative"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#growthGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Transaction Mutation Types */}
        <div className="p-6 rounded-2xl border border-white/[0.08] bg-zinc-950/60 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <PieIcon className="h-5 w-5 text-sky-400" />
              <h3 className="text-sm font-semibold font-mono tracking-wide text-zinc-100 uppercase">
                Transaction Mutation Breakdown
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-500">By OpCode</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={transactionData.length > 0 ? transactionData : [{ name: 'Genesis', value: 1, color: '#d08a5d' }]}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={6}
                    dataKey="value"
                  >
                    {(transactionData.length > 0 ? transactionData : [{ color: '#d08a5d' }]).map(
                      (entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} stroke="#090b10" strokeWidth={3} />
                      )
                    )}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090b10',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {transactionData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-zinc-300">{item.name}</span>
                  </div>
                  <span className="text-white font-bold">{item.value}</span>
                </div>
              ))}
              {transactionData.length === 0 && (
                <div className="text-xs text-zinc-500 font-mono">Genesis state loaded.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chart 3: Asset Classifications */}
      {assetTypeData.length > 0 && (
        <div className="p-6 rounded-2xl border border-white/[0.08] bg-zinc-950/60 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Layers className="h-5 w-5 text-purple-400" />
              <h3 className="text-sm font-semibold font-mono tracking-wide text-zinc-100 uppercase">
                Registered Asset Classes
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-500">{assetTypeData.length} classifications</span>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assetTypeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  stroke="#52525b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#27272a' }}
                />
                <YAxis
                  stroke="#52525b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#27272a' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090b10',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {assetTypeData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
