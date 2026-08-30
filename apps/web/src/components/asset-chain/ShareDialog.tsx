import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAssetChain } from '@/contexts/AssetChainContext';
import { toast } from 'sonner';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareDialog({ open, onOpenChange }: ShareDialogProps) {
  const { listAssets, shareAsset } = useAssetChain();
  const [assetId, setAssetId] = useState('');
  const [recipient, setRecipient] = useState('');

  const assets = listAssets();

  const handleShare = () => {
    if (!assetId || !recipient) {
      toast.error('Please select an asset and enter a recipient');
      return;
    }
    
    try {
      shareAsset(assetId, recipient, 'CurrentUser');
      toast.success('Asset shared successfully');
      setAssetId('');
      setRecipient('');
      onOpenChange(false);
    } catch (err) {
      toast.error('Failed to share asset');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-paper">
        <DialogHeader>
          <DialogTitle className="font-serif text-[var(--copper)]">Share Asset</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label className="font-mono text-ink">Asset</Label>
            <Select value={assetId} onValueChange={setAssetId}>
              <SelectTrigger>
                <SelectValue placeholder="Select asset" />
              </SelectTrigger>
              <SelectContent>
                {assets.map((a) => (
                  <SelectItem key={a.assetData.assetId} value={a.assetData.assetId}>
                    {a.assetData.assetName} ({a.assetData.assetId})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label className="font-mono text-ink">Recipient Name</Label>
            <Input 
              value={recipient} 
              onChange={(e) => setRecipient(e.target.value)} 
              placeholder="e.g. Charlie"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleShare} className="bg-[var(--emerald)] hover:bg-emerald-600 text-white font-sans">
            Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
