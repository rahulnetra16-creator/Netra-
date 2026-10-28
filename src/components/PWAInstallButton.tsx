import React from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useApp } from '../context/AppContext';
import { Download, Smartphone, Check } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'header' | 'banner' | 'card' | 'bottom';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  variant = 'header',
  className = '' 
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const { setActiveModal, language } = useApp();

  // If already installed in standalone mode, show a small subtle status or hide
  if (isInstalled && variant === 'header') {
    return (
      <button
        onClick={() => setActiveModal('apk')}
        title="App Installed - Click to open APK / App Options"
        className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold cursor-pointer transition-all hover:bg-emerald-900/50"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[11px] font-bold">Android App Active</span>
      </button>
    );
  }

  // Header quick install button
  if (variant === 'header') {
    return (
      <button
        onClick={async () => {
          if (isInstallable) {
            const outcome = await install();
            if (outcome === 'accepted') {
              return;
            }
          }
          setActiveModal('apk');
        }}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-900/30 transition-all transform hover:-translate-y-0.5 cursor-pointer border border-emerald-400/40 ${className}`}
        title="Download / Install Android App (.APK)"
      >
        <Download className="w-3.5 h-3.5 animate-bounce stroke-[2.5]" />
        <Smartphone className="w-3.5 h-3.5" />
        <span className="hidden md:inline">
          {language === 'hi' ? 'एंड्रॉइड APK' : 'Download APK / App'}
        </span>
        <span className="md:hidden">
          APK
        </span>
      </button>
    );
  }

  // Top banner variant on Dashboard
  if (variant === 'banner') {
    if (isInstalled) return null;

    return (
      <div className={`w-full p-3 sm:p-4 rounded-xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-cyan-950/70 border border-emerald-500/40 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
              <span>{language === 'hi' ? 'नेत्र मोबाइल सेंटर एंड्रॉइड ऐप डाउनलोड करें' : 'Install Netra Mobile Center Android App & APK'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40">
                Offline Ready
              </span>
            </h4>
            <p className="text-[11px] text-slate-300 mt-0.5">
              {language === 'hi'
                ? 'स्मार्टफोन में ऐप आइकन, फुल-स्क्रीन रिपेयरिंग जॉब कार्ड व तेज बिलिंग के साथ बिना प्ले स्टोर के तुरंत चलाएं।'
                : 'Direct WebAPK installation on phone with homescreen icon, offline billing, and job card management.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveModal('apk')}
            className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer transition-colors whitespace-nowrap"
          >
            {language === 'hi' ? 'APK गाइड व QR' : 'APK Guide & QR'}
          </button>
          <button
            onClick={async () => {
              if (isInstallable) {
                const outcome = await install();
                if (outcome === 'accepted') {
                  return;
                }
              }
              setActiveModal('apk');
            }}
            className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer transition-transform whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{language === 'hi' ? 'सीधा इंस्टॉल करें' : 'Install App'}</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
};
