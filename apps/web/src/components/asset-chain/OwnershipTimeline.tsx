import React from 'react';
import { useAssetChain } from '@/contexts/AssetChainContext';
import { AssetBlock } from '@/types/asset-chain';
import { PlusCircle, ArrowRightLeft, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface OwnershipTimelineProps {
  assetId: string;
  onBlockSelect?: (block: AssetBlock) => void;
}

export function OwnershipTimeline({ assetId, onBlockSelect }: OwnershipTimelineProps) {
  const { getAssetHistory } = useAssetChain();
  const history = getAssetHistory(assetId);

  if (!history || history.length === 0) {
    return <div className="text-muted-foreground p-4 text-center font-sans">No history found for this asset.</div>;
  }

  return (
    <div className="relative border-l-2 border-[var(--copper)] ml-4 my-6 space-y-8">
      {history.map((block, index) => {
        let Icon = PlusCircle;
        let colorClass = "bg-[var(--emerald)]";
        let actionText = `Created by ${block.createdBy}`;
        
        if (block.transactionType === 'TRANSFER') {
          Icon = ArrowRightLeft;
          colorClass = "bg-blue-500";
          actionText = `${block.previousOwner || 'Unknown'} → ${block.owner}`;
        } else if (block.transactionType === 'SHARE') {
          Icon = Share2;
          colorClass = "bg-purple-500";
          actionText = `Shared with ${block.sharedWith}`;
        }

        return (
          <div 
            key={block.id} 
            className="relative pl-6 cursor-pointer group"
            onClick={() => onBlockSelect?.(block)}
          >
            {/* Dot */}
            <div className={cn(
              "absolute -left-[11px] top-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center",
              colorClass
            )}>
              <Icon className="w-3 h-3 text-white" />
            </div>

            <div className="bg-white p-3 rounded-lg border border-border shadow-sm group-hover:border-[var(--copper)] transition-colors">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="font-mono text-xs">Block #{block.index}</Badge>
                <span className="text-xs text-muted-foreground font-mono">
                  {new Date(block.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="font-sans font-medium text-ink">
                {block.transactionType}
              </div>
              <div className="text-sm text-muted-foreground mt-1 font-serif">
                {actionText}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
