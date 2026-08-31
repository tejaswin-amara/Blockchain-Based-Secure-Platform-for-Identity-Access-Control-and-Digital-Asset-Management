'use client';

import React, { useMemo } from 'react';
import { useAssetChain } from '@/contexts/AssetChainContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, User, Hash, Share2, ShieldCheck, Clock, Layers, ArrowRight } from 'lucide-react';
import type { AssetSummary } from '@/types/asset-chain';

interface UserAssetViewProps {
  userName?: string;
  onOpenAdmin?: () => void;
}

export function UserAssetView({ userName = 'Alice Vance', onOpenAdmin }: UserAssetViewProps) {
  const { listAssets, getAssets, chain } = useAssetChain();

  // Safely retrieve asset summaries from context or derive from chain blocks
  const allAssets: AssetSummary[] = useMemo(() => {
    try {
      if (typeof listAssets === 'function') {
        const res = listAssets();
        if (Array.isArray(res) && res.length > 0) return res;
      }
      if (typeof getAssets === 'function') {
        const res = getAssets();
        if (Array.isArray(res) && res.length > 0) return res;
      }
    } catch (e) {
      console.warn('Error fetching assets via listAssets/getAssets:', e);
    }

    // Fallback: derive summaries directly from chain
    if (chain && chain.length > 0) {
      const map = new Map<string, any[]>();
      for (const b of chain) {
        if (!b.assetData?.assetId) continue;
        const list = map.get(b.assetData.assetId) || [];
        list.push(b);
        map.set(b.assetData.assetId, list);
      }
      const derived: AssetSummary[] = [];
      for (const [, blocks] of map) {
        derived.push({
          assetData: blocks[0].assetData,
          currentOwner: blocks[blocks.length - 1].owner,
          blockCount: blocks.length,
          transfers: [],
          shares: [],
          createdAt: blocks[0].timestamp,
        });
      }
      return derived;
    }

    return [];
  }, [listAssets, getAssets, chain]);

  // Filter assets owned by or shared with the user (or show all if admin/default)
  const visibleAssets = useMemo(() => {
    if (allAssets.length === 0) return [];
    return allAssets.filter((asset) => {
      const isOwner =
        asset.currentOwner?.toLowerCase() === userName.toLowerCase() ||
        userName.toLowerCase() === 'admin' ||
        userName.toLowerCase() === 'alice vance';
      const isShared = asset.shares?.some(
        (s) => s.sharedWith?.toLowerCase() === userName.toLowerCase()
      );
      return isOwner || isShared;
    });
  }, [allAssets, userName]);

  const getValidationBadge = (status: string = 'VERIFIED') => {
    switch (status) {
      case 'VERIFIED':
        return (
          <Badge className="bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> VERIFIED
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge className="bg-amber-950/80 border border-amber-500/30 text-amber-400 font-mono text-[10px] flex items-center gap-1">
            <Clock className="w-3 h-3" /> PENDING
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-white/10 text-zinc-400 font-mono text-[10px]">
            {status}
          </Badge>
        );
    }
  };

  if (visibleAssets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center rounded-xl border border-white/[0.08] bg-black/40 text-zinc-400 space-y-4">
        <div className="h-12 w-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-[var(--copper-bright)]">
          <Layers className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-serif text-white font-medium">Vault Empty</h3>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto">
            No assets are currently registered in your vault. Mint an asset using the Admin
            Console to anchor it into the 3D blockchain.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            REGISTERED ASSET INVENTORY
          </span>
          <h4 className="text-base font-serif text-white font-medium">
            {visibleAssets.length} Assets Synchronized
          </h4>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {visibleAssets.map((asset) => {
          const assetName = asset.assetData?.assetName || 'Hardware Enclave';
          const assetId = asset.assetData?.assetId || 'AST-001';
          const assetType = asset.assetData?.assetType || 'Hardware';
          const description = asset.assetData?.description || 'Cryptographic secure element';
          const isShared = asset.currentOwner?.toLowerCase() !== userName.toLowerCase();

          return (
            <Card
              key={assetId}
              className="bg-black/60 border border-white/[0.08] hover:border-[var(--copper-bright)]/40 transition-all rounded-xl overflow-hidden shadow-lg"
            >
              <CardHeader className="p-4 bg-white/[0.02] border-b border-white/[0.04]">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="font-serif text-base text-white">
                      {assetName}
                    </CardTitle>
                    <CardDescription className="font-mono text-[11px] text-zinc-400 mt-1 flex items-center gap-1.5">
                      <Hash className="w-3 h-3 text-[var(--copper-bright)]" />
                      <span>{assetId}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-cyan-400">{assetType}</span>
                    </CardDescription>
                  </div>
                  {getValidationBadge('VERIFIED')}
                </div>
              </CardHeader>

              <CardContent className="p-4 font-mono text-xs space-y-3">
                {isShared ? (
                  <div className="bg-[var(--copper)]/10 text-[var(--copper-bright)] text-[11px] py-1.5 px-3 rounded-lg flex items-center border border-[var(--copper)]/20">
                    <Share2 className="w-3.5 h-3.5 mr-2 shrink-0" />
                    <span>Shared with you by {asset.currentOwner}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-zinc-400 text-xs">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Recorded Owner:</span>
                    </span>
                    <span className="text-white font-medium font-sans">
                      {asset.currentOwner || userName}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-zinc-400 text-xs pt-1 border-t border-white/[0.04]">
                  <span>Block Mutations:</span>
                  <span className="text-cyan-400 font-bold">
                    {asset.blockCount} Block{asset.blockCount !== 1 ? 's' : ''}
                  </span>
                </div>

                {description && (
                  <div className="text-zinc-400 font-sans text-xs bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.04] mt-2">
                    {description}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
