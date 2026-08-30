'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssetChain } from '@/contexts/AssetChainContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  PlusCircle,
  ArrowRightLeft,
  Sparkles,
  Shield,
  Tag,
  User,
  FileText,
  Layers,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import type { AssetType } from '@/types/asset-chain';

export function AdminPanel() {
  const { createAsset, transferAsset, listAssets, getCurrentOwner } = useAssetChain();
  const [activeTab, setActiveTab] = useState<'create' | 'transfer'>('create');

  // Create Form State
  const [assetId, setAssetId] = useState('');
  const [assetName, setAssetName] = useState('');
  const [assetType, setAssetType] = useState<AssetType>('Hardware');
  const [description, setDescription] = useState('');
  const [initialOwner, setInitialOwner] = useState('Alice Vance');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createErrors, setCreateErrors] = useState<Record<string, string>>({});

  // Transfer Form State
  const [transferAssetId, setTransferAssetId] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);

  const assets = listAssets();

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!assetId.trim()) errors.assetId = 'Asset ID is required';
    if (!assetName.trim()) errors.assetName = 'Asset Name is required';
    if (!initialOwner.trim()) errors.initialOwner = 'Initial Owner is required';

    if (Object.keys(errors).length > 0) {
      setCreateErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 450)); // subtle satisfying micro-delay
      createAsset(
        {
          assetId: assetId.trim().toUpperCase(),
          assetName: assetName.trim(),
          assetType,
          description: description.trim() || 'Enterprise tokenized digital asset registered on-chain.',
        },
        initialOwner.trim(),
        'AdminAuthority'
      );

      toast.success('Asset Block Minted', {
        description: `Block generated for ${assetName} (ID: ${assetId.toUpperCase()}) with SHA-256 state seal.`,
      });

      setAssetId('');
      setAssetName('');
      setDescription('');
      setCreateErrors({});
    } catch (err) {
      toast.error('Minting failed', { description: String(err) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferAssetId) {
      toast.error('Select an asset to transfer');
      return;
    }
    if (!newOwner.trim()) {
      toast.error('Enter recipient new owner address/handle');
      return;
    }

    const currentOwner = getCurrentOwner(transferAssetId);
    if (!currentOwner) {
      toast.error('Invalid asset record');
      return;
    }

    setIsTransferring(true);
    try {
      await new Promise((r) => setTimeout(r, 450));
      transferAsset(transferAssetId, newOwner.trim(), 'AdminAuthority');

      toast.success('Ownership Transfer Executed', {
        description: `Transferred ${transferAssetId} from ${currentOwner} → ${newOwner.trim()}`,
      });

      setTransferAssetId('');
      setNewOwner('');
    } catch (err) {
      toast.error('Transfer failed', { description: String(err) });
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-white/[0.08] bg-zinc-950/70 backdrop-blur-xl p-6 shadow-2xl space-y-6">
      {/* Panel Top Title */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-copper/20 border border-[var(--copper)]/30 text-[var(--copper-bright)]">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono tracking-wide text-white uppercase">
              Admin Governance Console
            </h3>
            <span className="text-[11px] text-zinc-400 font-sans">
              Authorized asset lifecycle and state transition dispatcher
            </span>
          </div>
        </div>

        {/* KokonutUI-Style Animated Tab Pill */}
        <div className="flex p-1 rounded-xl bg-zinc-900/90 border border-white/[0.06] text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'create'
                ? 'bg-gradient-to-r from-[var(--copper)] to-[var(--copper-bright)] text-white shadow-md font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Mint Asset</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('transfer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'transfer'
                ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-md font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ArrowRightLeft className="h-3.5 w-3.5" />
            <span>Transfer</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'create' ? (
          /* Mint Asset Form */
          <motion.form
            key="create-form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleCreateSubmit}
            className="space-y-4 font-mono text-xs"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Asset ID */}
              <div className="space-y-1.5">
                <Label className="text-zinc-300 flex items-center gap-1.5 text-[11px]">
                  <Tag className="h-3 w-3 text-[var(--copper-bright)]" />
                  ASSET IDENTIFIER (ID)
                </Label>
                <Input
                  placeholder="e.g. LAP-001, DOC-404"
                  value={assetId}
                  onChange={(e) => setAssetId(e.target.value)}
                  className="bg-black/50 border-white/[0.1] text-white focus:border-[var(--copper-bright)] text-xs h-9 rounded-lg uppercase"
                />
                {createErrors.assetId && (
                  <span className="text-red-400 text-[10px] block">{createErrors.assetId}</span>
                )}
              </div>

              {/* Asset Classification */}
              <div className="space-y-1.5">
                <Label className="text-zinc-300 flex items-center gap-1.5 text-[11px]">
                  <Layers className="h-3 w-3 text-cyan-400" />
                  CLASSIFICATION TYPE
                </Label>
                <select
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value as AssetType)}
                  className="w-full bg-black/50 border border-white/[0.1] text-white focus:border-[var(--copper-bright)] text-xs h-9 rounded-lg px-3 outline-none cursor-pointer"
                >
                  <option value="Hardware">Hardware Asset</option>
                  <option value="Software">Software License</option>
                  <option value="Document">Confidential Document</option>
                  <option value="Certificate">Accredited Certificate</option>
                  <option value="License">Regulatory License</option>
                </select>
              </div>
            </div>

            {/* Asset Name */}
            <div className="space-y-1.5">
              <Label className="text-zinc-300 flex items-center gap-1.5 text-[11px]">
                <FileText className="h-3 w-3 text-emerald-400" />
                ASSET TITLE / NAME
              </Label>
              <Input
                placeholder="e.g. ThinkPad X1 Carbon Gen 12 (Asset #401)"
                value={assetName}
                onChange={(e) => setAssetName(e.target.value)}
                className="bg-black/50 border-white/[0.1] text-white focus:border-[var(--copper-bright)] text-xs h-9 rounded-lg"
              />
              {createErrors.assetName && (
                <span className="text-red-400 text-[10px] block">{createErrors.assetName}</span>
              )}
            </div>

            {/* Initial Owner */}
            <div className="space-y-1.5">
              <Label className="text-zinc-300 flex items-center gap-1.5 text-[11px]">
                <User className="h-3 w-3 text-amber-400" />
                INITIAL OWNER ENTITY
              </Label>
              <Input
                placeholder="e.g. Alice Vance, did:openbanking:usr101"
                value={initialOwner}
                onChange={(e) => setInitialOwner(e.target.value)}
                className="bg-black/50 border-white/[0.1] text-white focus:border-[var(--copper-bright)] text-xs h-9 rounded-lg"
              />
              {createErrors.initialOwner && (
                <span className="text-red-400 text-[10px] block">{createErrors.initialOwner}</span>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-zinc-300 text-[11px]">DESCRIPTION / SPECIFICATIONS</Label>
              <Textarea
                placeholder="Cryptographic payload specifications, serial numbers, compliance references..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-black/50 border-white/[0.1] text-white focus:border-[var(--copper-bright)] text-xs min-h-[70px] rounded-lg font-sans resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 rounded-xl bg-gradient-to-r from-[var(--copper)] to-[var(--copper-bright)] hover:opacity-90 text-white font-mono text-xs font-bold tracking-wide shadow-lg shadow-amber-900/20 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Proof & Signing Block...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Mint Asset Block to Blockchain
                </>
              )}
            </Button>
          </motion.form>
        ) : (
          /* Transfer Ownership Form */
          <motion.form
            key="transfer-form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleTransferSubmit}
            className="space-y-4 font-mono text-xs"
          >
            {/* Select Asset */}
            <div className="space-y-1.5">
              <Label className="text-zinc-300 flex items-center gap-1.5 text-[11px]">
                <Tag className="h-3 w-3 text-sky-400" />
                SELECT REGISTERED ASSET
              </Label>
              <select
                value={transferAssetId}
                onChange={(e) => setTransferAssetId(e.target.value)}
                className="w-full bg-black/50 border border-white/[0.1] text-white focus:border-sky-500 text-xs h-9 rounded-lg px-3 outline-none cursor-pointer"
              >
                <option value="">-- Choose an active asset --</option>
                {assets.map((asset) => (
                  <option key={asset.assetData.assetId} value={asset.assetData.assetId}>
                    {asset.assetData.assetId} — {asset.assetData.assetName} (Current: {asset.currentOwner})
                  </option>
                ))}
              </select>
            </div>

            {/* Current Owner Context */}
            {transferAssetId && (
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/[0.06] text-xs">
                <span className="text-zinc-400 block text-[10px] uppercase">Current Provenance Owner:</span>
                <span className="text-amber-400 font-bold">{getCurrentOwner(transferAssetId)}</span>
              </div>
            )}

            {/* New Owner */}
            <div className="space-y-1.5">
              <Label className="text-zinc-300 flex items-center gap-1.5 text-[11px]">
                <User className="h-3 w-3 text-cyan-400" />
                NEW RECIPIENT OWNER
              </Label>
              <Input
                placeholder="e.g. Bob Thornton, did:openbanking:usr102"
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
                className="bg-black/50 border-white/[0.1] text-white focus:border-sky-500 text-xs h-9 rounded-lg"
              />
            </div>

            {/* Submit Transfer */}
            <Button
              type="submit"
              disabled={isTransferring || !transferAssetId}
              className="w-full h-10 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-mono text-xs font-bold tracking-wide shadow-lg shadow-sky-900/20 cursor-pointer"
            >
              {isTransferring ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Transferring Ownership...
                </>
              ) : (
                <>
                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                  Append TRANSFER Block to Ledger
                </>
              )}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
