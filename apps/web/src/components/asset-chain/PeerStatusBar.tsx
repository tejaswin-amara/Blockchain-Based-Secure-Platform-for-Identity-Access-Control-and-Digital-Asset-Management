import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Clock, RefreshCw, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { usePeerSync } from '@/contexts/PeerSyncContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function PeerStatusBar() {
  const { peerId, peerName, peers, isSyncing, lastSyncAt, requestSync } = usePeerSync();
  const [showPeers, setShowPeers] = useState(false);
  const [timeAgo, setTimeAgo] = useState<string>('Never');

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 10) return 'Just now';
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (lastSyncAt) {
        setTimeAgo(getTimeAgo(lastSyncAt));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lastSyncAt]);

  useEffect(() => {
    if (lastSyncAt) {
      setTimeAgo(getTimeAgo(lastSyncAt));
    }
  }, [lastSyncAt]);

  const hasPeers = peers.length > 0;

  return (
    <div className="flex flex-col w-full bg-[var(--ink)] text-[var(--paper)] font-mono text-sm border-b border-[var(--copper)]/20 shadow-md">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-[var(--copper)] font-semibold">{peerName}</span>
            <span className="text-gray-500 text-xs truncate max-w-[80px]" title={peerId}>
              {peerId.substring(0, 8)}...
            </span>
          </div>

          <div className="h-4 w-px bg-gray-700" />

          <button 
            onClick={() => hasPeers && setShowPeers(!showPeers)}
            className={cn(
              "flex items-center space-x-2 transition-colors",
              hasPeers ? "hover:text-[var(--emerald)] cursor-pointer" : "text-gray-500 cursor-default"
            )}
            disabled={!hasPeers}
          >
            <div className="relative flex h-3 w-3 items-center justify-center">
              {hasPeers ? (
                <>
                  <motion.span 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inline-flex h-full w-full rounded-full bg-[var(--emerald)] opacity-75" 
                  />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--emerald)]" />
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-500" />
              )}
            </div>
            <span className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{peers.length} Peers</span>
              {hasPeers && (
                showPeers ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />
              )}
            </span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {isSyncing ? (
              <span className="text-amber-400 flex items-center">
                <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                Syncing...
              </span>
            ) : hasPeers ? (
              <span className="text-[var(--emerald)] flex items-center">
                <Activity className="h-3 w-3 mr-2" />
                Synced
              </span>
            ) : (
              <span className="text-gray-500">No peers</span>
            )}
          </div>
          
          <div className="flex items-center space-x-1 text-gray-400 text-xs">
            <Clock className="h-3 w-3" />
            <span>{lastSyncAt ? timeAgo : 'Never'}</span>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={requestSync} 
            disabled={isSyncing || !hasPeers}
            className="h-7 text-xs border-[var(--copper)] text-[var(--copper)] hover:bg-[var(--copper)]/10"
          >
            Sync Now
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showPeers && hasPeers && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-black/20"
          >
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {peers.map((peer) => (
                <div key={peer.peerId} className="flex flex-col p-3 rounded-md bg-white/5 border border-white/10 text-xs">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-[var(--emerald)]">{peer.displayName}</span>
                    <span className="text-[10px] text-gray-500" title={peer.peerId}>
                      {peer.peerId.substring(0, 6)}...
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Blocks: {peer.blockCount}</span>
                    <span title={peer.lastSeen}>Seen: {getTimeAgo(peer.lastSeen)}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
