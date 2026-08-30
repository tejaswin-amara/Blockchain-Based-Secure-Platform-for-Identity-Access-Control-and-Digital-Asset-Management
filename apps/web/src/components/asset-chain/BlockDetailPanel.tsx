'use client';

import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Copy,
  Check,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Share2,
  Lock,
  Clock,
  User,
  Layers,
} from 'lucide-react';
import { toast } from 'sonner';
import { OwnershipTimeline } from './OwnershipTimeline';
import { useAssetChain } from '@/contexts/AssetChainContext';
import type { AssetBlock } from '@/types/asset-chain';

interface BlockDetailPanelProps {
  block: AssetBlock | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectBlock?: (block: AssetBlock) => void;
}

export function BlockDetailPanel({
  block,
  open,
  onOpenChange,
  onSelectBlock,
}: BlockDetailPanelProps) {
  const { chain } = useAssetChain();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!block) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(`Copied ${label} to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const currentIndex = chain.findIndex((b) => b.id === block.id);
  const prevBlock = currentIndex > 0 ? chain[currentIndex - 1] : null;
  const nextBlock = currentIndex < chain.length - 1 ? chain[currentIndex + 1] : null;

  const statusColors =
    block.validationStatus === 'VERIFIED'
      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
      : block.validationStatus === 'REJECTED'
      ? 'border-red-500/30 bg-red-500/10 text-red-400'
      : 'border-amber-500/30 bg-amber-500/10 text-amber-400';

  const typeColors =
    block.transactionType === 'CREATE'
      ? 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30'
      : block.transactionType === 'TRANSFER'
      ? 'text-sky-400 bg-sky-950/40 border-sky-500/30'
      : 'text-purple-400 bg-purple-950/40 border-purple-500/30';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg bg-[#0a0c13]/95 border-l border-white/[0.08] backdrop-blur-2xl text-zinc-100 flex flex-col p-0 shadow-2xl z-50">
        {/* Header Bar */}
        <SheetHeader className="p-6 pb-4 border-b border-white/[0.08] bg-zinc-950/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
                Ledger Inspector
              </span>
            </div>

            {/* Block Stepper Navigation */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                disabled={!prevBlock}
                onClick={() => prevBlock && onSelectBlock?.(prevBlock)}
                className="h-7 w-7 p-0 text-zinc-400 hover:text-white hover:bg-white/10"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs font-mono text-zinc-400 px-1">
                {currentIndex + 1} / {chain.length}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={!nextBlock}
                onClick={() => nextBlock && onSelectBlock?.(nextBlock)}
                className="h-7 w-7 p-0 text-zinc-400 hover:text-white hover:bg-white/10"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <SheetTitle className="text-2xl font-bold font-mono text-white flex items-center gap-2">
              {block.index === 0 ? 'GENESIS BLOCK' : `BLOCK #${block.index}`}
            </SheetTitle>

            <span className={`px-2.5 py-1 rounded-full text-xs font-mono border ${statusColors}`}>
              ● {block.validationStatus}
            </span>
          </div>

          <SheetDescription className="font-mono text-[11px] text-zinc-400 truncate mt-1">
            UUID: {block.id}
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable Block Contents */}
        <ScrollArea className="flex-1 p-6 space-y-6">
          {/* Section 1: Transaction Context Card */}
          <div className="p-4 rounded-xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-md space-y-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-zinc-400">OPERATION TYPE</span>
              <span className={`px-2 py-0.5 rounded text-[11px] border font-bold ${typeColors}`}>
                {block.transactionType}
              </span>
            </div>

            {block.transactionType === 'TRANSFER' && (
              <div className="py-2 px-3 rounded-lg bg-sky-950/20 border border-sky-500/20 flex items-center justify-center gap-2 font-mono text-sm text-sky-300">
                <span className="font-bold">{block.previousOwner}</span>
                <ArrowRight className="h-4 w-4 text-sky-400" />
                <span className="font-bold text-white">{block.owner}</span>
              </div>
            )}

            {block.transactionType === 'SHARE' && (
              <div className="py-2 px-3 rounded-lg bg-purple-950/20 border border-purple-500/20 flex items-center justify-center gap-2 font-mono text-sm text-purple-300">
                <Share2 className="h-4 w-4 text-purple-400" />
                <span>Authorized View Granted to:</span>
                <span className="font-bold text-white">{block.sharedWith}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono border-t border-white/[0.06]">
              <div>
                <span className="text-zinc-400 block text-[10px]">RECORDED OWNER</span>
                <span className="text-zinc-100 font-medium">{block.owner}</span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px]">MINTER / AUTH</span>
                <span className="text-zinc-100 font-medium">{block.createdBy}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Asset Payload Record */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
              <Layers className="h-3.5 w-3.5 text-cyan-400" />
              <span>Asset Payload Data</span>
            </div>

            <div className="p-4 rounded-xl border border-white/[0.08] bg-zinc-900/40 space-y-3 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Asset Identifier:</span>
                <span className="text-cyan-300 font-bold">{block.assetData?.assetId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Classification:</span>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 text-[10px]">
                  {block.assetData?.assetType}
                </span>
              </div>
              <div className="border-t border-white/[0.06] pt-2">
                <span className="text-zinc-400 block text-[10px] mb-1">ASSET NAME</span>
                <span className="text-white text-sm font-semibold block">{block.assetData?.assetName}</span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[10px] mb-1">DESCRIPTION & METADATA</span>
                <p className="text-zinc-300 text-xs font-sans leading-relaxed">
                  {block.assetData?.description || 'No additional descriptive metadata attached.'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Cryptographic Signatures & Hashes */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
              <Lock className="h-3.5 w-3.5 text-amber-400" />
              <span>Cryptographic Proof</span>
            </div>

            <div className="p-4 rounded-xl border border-white/[0.08] bg-zinc-900/40 space-y-3 font-mono text-xs">
              {/* Current Hash */}
              <div>
                <div className="flex justify-between items-center text-[10px] text-zinc-400 mb-1">
                  <span>SHA-256 STATE HASH</span>
                  <button
                    onClick={() => copyToClipboard(block.currentHash, 'State Hash')}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 cursor-pointer"
                  >
                    {copiedField === 'State Hash' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>Copy</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-black/60 border border-white/[0.06] text-cyan-300 break-all text-[11px] leading-relaxed">
                  {block.currentHash}
                </div>
              </div>

              {/* Previous Hash */}
              <div>
                <div className="flex justify-between items-center text-[10px] text-zinc-400 mb-1">
                  <span>PREVIOUS BLOCK HASH (PARENT)</span>
                  <button
                    onClick={() => copyToClipboard(block.previousHash, 'Previous Hash')}
                    className="flex items-center gap-1 text-zinc-400 hover:text-zinc-300 cursor-pointer"
                  >
                    {copiedField === 'Previous Hash' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>Copy</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-black/60 border border-white/[0.06] text-zinc-400 break-all text-[11px] leading-relaxed">
                  {block.previousHash}
                </div>
              </div>

              {/* Timestamp */}
              <div className="flex items-center justify-between text-zinc-400 pt-2 border-t border-white/[0.06] text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-zinc-500" />
                  CONFIRMED AT:
                </span>
                <span className="text-zinc-200">{new Date(block.timestamp).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Provenance Timeline */}
          {block.assetData?.assetId && block.assetData.assetId !== 'GENESIS' && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Asset Provenance Chain</span>
              </div>
              <div className="p-4 rounded-xl border border-white/[0.08] bg-zinc-900/40">
                <OwnershipTimeline assetId={block.assetData.assetId} onBlockSelect={onSelectBlock} />
              </div>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
