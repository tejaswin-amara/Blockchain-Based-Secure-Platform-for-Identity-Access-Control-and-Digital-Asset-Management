import React from 'react';
import { useAssetChain } from '@/contexts/AssetChainContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, User, Hash, Share2, ShieldCheck, Clock } from 'lucide-react';

interface UserAssetViewProps {
  userName: string;
}

export function UserAssetView({ userName }: UserAssetViewProps) {
  const { getAssets } = useAssetChain();
  const allAssets = getAssets();

  // Filter assets owned by the user or shared with them
  const visibleAssets = allAssets.filter(
    (asset: any) => asset.currentOwner === userName || (asset.sharedWith && asset.sharedWith.includes(userName))
  );

  const getValidationBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <Badge className="bg-[var(--emerald)] hover:bg-[var(--emerald)]/80 text-white font-mono"><ShieldCheck className="w-3 h-3 mr-1"/> VERIFIED</Badge>;
      case 'PENDING':
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-mono"><Clock className="w-3 h-3 mr-1"/> PENDING</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive" className="font-mono">REJECTED</Badge>;
      default:
        return <Badge variant="outline" className="font-mono">{status}</Badge>;
    }
  };

  if (visibleAssets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-[var(--paper)]/60 bg-[var(--ink)]/50 rounded-lg border border-[var(--copper)]/20">
        <FileText className="w-12 h-12 mb-4 text-[var(--copper)]/50" />
        <h3 className="text-xl font-serif text-[var(--paper)]">No Assets Found</h3>
        <p className="mt-2 font-sans">You don't own any assets and no assets have been shared with you.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[var(--ink)] p-6 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl font-serif text-[var(--paper)] mb-2">My Assets</h2>
        <p className="text-[var(--paper)]/70 font-sans">View assets you own or that have been shared with you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleAssets.map((asset: any) => {
          const isShared = asset.currentOwner !== userName;

          return (
            <Card key={asset.id} className="bg-[#1e1c19] border-[var(--copper)]/40 text-[var(--paper)] shadow-lg hover:border-[var(--copper)] transition-colors overflow-hidden flex flex-col">
              <CardHeader className="pb-3 bg-black/20">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="font-serif text-xl text-[#d08a5d]">{asset.name}</CardTitle>
                    <CardDescription className="font-mono text-xs text-[var(--paper)]/50 mt-1 flex items-center">
                      <Hash className="w-3 h-3 mr-1" />
                      {asset.id}
                    </CardDescription>
                  </div>
                  {getValidationBadge(asset.validationStatus || 'VERIFIED')}
                </div>
              </CardHeader>
              
              <CardContent className="pt-4 flex-grow font-mono text-sm space-y-4">
                {isShared && (
                  <div className="bg-[var(--copper)]/10 text-[#d08a5d] text-xs py-1.5 px-3 rounded-md flex items-center border border-[var(--copper)]/20">
                    <Share2 className="w-3 h-3 mr-2" />
                    Shared with you by {asset.currentOwner}
                  </div>
                )}
                
                {!isShared && (
                  <div className="flex items-center text-[var(--paper)]/80">
                    <User className="w-4 h-4 mr-2 text-[var(--emerald)]" />
                    <span className="text-gray-400 mr-2">Owner:</span> 
                    <span className="text-[var(--emerald)] font-semibold">You</span>
                  </div>
                )}

                <div className="flex items-center text-[var(--paper)]/80">
                  <span className="text-gray-400 mr-2">Latest Block:</span> 
                  <span>#{asset.latestBlockNumber}</span>
                </div>
                
                {asset.description && (
                  <div className="text-[var(--paper)]/70 font-sans mt-4 text-sm bg-black/20 p-3 rounded-md border border-white/5">
                    {asset.description}
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
