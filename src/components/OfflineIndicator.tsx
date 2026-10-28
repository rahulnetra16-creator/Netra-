import React from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useApp } from '../context/AppContext';
import { WifiOff, Database } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const { isOnline } = usePWAInstall();
  const { language } = useApp();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-3.5 py-2 text-xs font-bold text-white shadow-xl shadow-amber-950/50 border border-amber-400/40 animate-pulse">
      <WifiOff className="w-4 h-4" />
      <span>
        {language === 'hi' 
          ? 'ऑफलाइन मोड: लोकल स्टोरेज में काम चालू है' 
          : 'Offline Mode: Local database active'}
      </span>
      <Database className="w-3.5 h-3.5 opacity-80" />
    </div>
  );
};
