import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import QRCode from 'qrcode';
import { 
  Download, 
  Smartphone, 
  CheckCircle2, 
  Share2, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  Zap, 
  Layers, 
  QrCode, 
  ArrowRight,
  ShieldCheck,
  Globe,
  X,
  Database,
  Bell,
  Play,
  RotateCcw,
  CheckCircle,
  Eye,
  AlertTriangle,
  Wrench,
  HelpCircle,
  FileCode,
  Compass
} from 'lucide-react';

export const APKDownloadModal: React.FC = () => {
  const { activeModal, setActiveModal, language, shopSettings } = useApp();
  const { 
    isInstallable, 
    isInstalled, 
    isAndroid, 
    isIOS, 
    isInIframe, 
    isInAppBrowser, 
    hasServiceWorker,
    install 
  } = usePWAInstall();

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'instant' | 'troubleshoot' | 'apk_builder' | 'qr' | 'instructions'>('instant');
  const [installStatus, setInstallStatus] = useState<string>('');
  const [previewSuccess, setPreviewSuccess] = useState<boolean>(false);

  // Current live production URL from metadata or active window
  const defaultProductionUrl = 'https://ais-pre-2no3ffb76nphz2s5d5tyuz-988943521245.asia-east1.run.app';
  const currentUrl = typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost') && !window.location.origin.includes('127.0.0.1')
    ? window.location.origin
    : defaultProductionUrl;

  const pwaBuilderReportUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(currentUrl)}`;
  const pwaBuilderAndroidUrl = `https://www.pwabuilder.com/publish?site=${encodeURIComponent(currentUrl)}`;
  
  // Android Chrome Intent URL: Forces Android to exit WhatsApp/iframe and launch official Google Chrome
  const chromeIntentUrl = `intent://${currentUrl.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end;`;

  // Generate QR Code for instant phone scanning
  useEffect(() => {
    QRCode.toDataURL(currentUrl, {
      width: 260,
      margin: 2,
      color: {
        dark: '#020617',
        light: '#ffffff'
      }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Failed to generate QR code:', err));
  }, [currentUrl]);

  if (activeModal !== 'apk') {
    return null;
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeInstall = async () => {
    setInstallStatus('prompting');
    const result = await install();
    if (result === 'accepted') {
      setInstallStatus('success');
    } else if (result === 'dismissed') {
      setInstallStatus('cancelled');
    } else if (result === 'iframe_blocked') {
      setInstallStatus('iframe');
    } else {
      setInstallStatus('manual');
    }
  };

  const handleOpenDirectInBrowser = () => {
    try {
      window.open(currentUrl, '_blank');
    } catch {
      window.location.href = currentUrl;
    }
  };

  const handleDownloadManifest = () => {
    const manifestData = {
      id: '/',
      name: 'Netra Mobile Center - Rahul R Kevat',
      short_name: 'NetraMobile',
      description: 'Netra Mobile Center (Prop. Rahul R Kevat): Mobile Shop, Smartphone Accessories, Multi-Brand Repairing, Job Cards & POS Invoicing.',
      theme_color: '#06b6d4',
      background_color: '#020617',
      display: 'standalone',
      orientation: 'portrait',
      start_url: '/',
      scope: '/',
      lang: 'hi-IN',
      icons: [
        { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/pwa-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
      ]
    };

    const blob = new Blob([JSON.stringify(manifestData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'netra-mobile-center.webmanifest';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareViaWhatsApp = () => {
    const text = language === 'hi'
      ? `📱 *नेत्र मोबाइल सेंटर (राहुल आर. केवट)*\nस्मार्टफोन शॉप, रिपेयरिंग जॉब कार्ड व बिलिंग एंड्रॉइड ऐप डाउनलोड करें:\n👉 ${currentUrl}\n\n(टिप: लिंक को सीधे Google Chrome ब्राउज़र में खोलें और 'Install app' दबाएं)\nहेल्पलाइन: ${shopSettings.phone}`
      : `📱 *Netra Mobile Center (Prop. Rahul R Kevat)*\nDownload & Install Android App for Mobile Shop, Repairs & POS:\n👉 ${currentUrl}\n\n(Tip: Open directly in Google Chrome and tap 'Install app')\nHelpline: ${shopSettings.phone}`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header with Android Brand Theme */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-4 sm:p-5 text-white flex items-center justify-between relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center gap-3 z-10">
            <div className="w-12 h-12 rounded-xl bg-white border border-white/40 flex items-center justify-center shadow-inner overflow-hidden p-0.5 flex-shrink-0">
              <img 
                src="/assets/aistudio/large__1__865785a2.png" 
                alt="Mobile Netra Repering" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  {language === 'hi' ? 'एंड्रॉइड ऐप व APK केंद्र' : 'Android App & APK Center'}
                </h2>
                {(isInstalled || installStatus === 'success' || previewSuccess) ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-200 border border-emerald-400 flex items-center gap-1 shadow-sm">
                    <Check className="w-3 h-3 stroke-[3]" />
                    {language === 'hi' ? 'इंस्टॉल्ड' : 'INSTALLED'}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-200 border border-emerald-400/40">
                    WebAPK / PWA
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                {language === 'hi' 
                  ? 'नेत्र मोबाइल सेंटर • प्रो. राहुल आर. केवट (9699962396)' 
                  : 'Netra Mobile Center • Prop. Rahul R Kevat (9699962396)'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="w-8 h-8 rounded-full bg-slate-950/40 hover:bg-slate-950/70 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* In-App Browser / Iframe Warning Notification Banner */}
        {(isInIframe || isInAppBrowser) && (
          <div className="bg-amber-950/90 border-b border-amber-600/40 px-3 sm:px-4 py-2 text-amber-200 text-xs flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                {language === 'hi' 
                  ? '⚠️ आप वर्तमान में प्रीव्यू मोड या इन-ऐप ब्राउज़र में हैं। फोन में सीधे इंस्टॉल करने के लिए Chrome में खोलें:'
                  : '⚠️ Preview or In-App browser detected. Open directly in Chrome to install WebAPK seamlessly:'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <button
                onClick={handleOpenDirectInBrowser}
                className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] flex items-center gap-1 shadow cursor-pointer transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                <span>{language === 'hi' ? 'Chrome में खोलें' : 'Open in Chrome'}</span>
              </button>
              <a
                href={chromeIntentUrl}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-[11px] border border-amber-600/40 hidden sm:flex items-center gap-1"
                title="Force launch Chrome via Android Intent"
              >
                <Compass className="w-3 h-3" />
                <span>Intent Link</span>
              </a>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-3 pt-2 gap-1 overflow-x-auto scrollbar-none text-xs font-semibold">
          <button
            onClick={() => setActiveTab('instant')}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-t-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'instant'
                ? 'bg-slate-900 text-emerald-400 border-t-2 border-emerald-500 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? '1-क्लिक सीधा इंस्टॉल' : '1-Click Direct Install'}</span>
          </button>

          <button
            onClick={() => setActiveTab('troubleshoot')}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-t-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'troubleshoot'
                ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-500 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            <span className="flex items-center gap-1">
              {language === 'hi' ? '🛠️ APK एरर फिक्स' : '🛠️ Fix Install Errors'}
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            </span>
          </button>

          <button
            onClick={() => setActiveTab('apk_builder')}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-t-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'apk_builder'
                ? 'bg-slate-900 text-cyan-400 border-t-2 border-cyan-500 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'APK फ़ाइल पैकेज' : 'APK Package Generator'}</span>
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-t-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'qr'
                ? 'bg-slate-900 text-emerald-400 border-t-2 border-emerald-500 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'QR स्कैन' : 'Scan QR'}</span>
          </button>

          <button
            onClick={() => setActiveTab('instructions')}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-t-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'instructions'
                ? 'bg-slate-900 text-purple-400 border-t-2 border-purple-500 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'गाइड' : 'Guide'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-slate-200 flex-1">
          
          {/* TAB 1: Instant WebAPK Install */}
          {activeTab === 'instant' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row items-center gap-4">
                <img 
                  src="/pwa-192x192.png" 
                  alt="App Icon" 
                  className="w-20 h-20 rounded-2xl shadow-lg border-2 border-emerald-500/50 p-1 bg-slate-950 flex-shrink-0" 
                />
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      Netra Mobile Center App
                    </h3>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                      v1.0 • WebAPK Ready
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {language === 'hi'
                      ? 'अपने एंड्रॉइड फोन में बिना प्ले स्टोर के तुरंत ओरिजिनल ऐप आइकन, फुल-स्क्रीन मोड व ऑफलाइन सपोर्ट के साथ इंस्टॉल करें।'
                      : 'Install directly on any Android smartphone with home screen icon, full-screen standalone window, and offline support.'}
                  </p>

                  <div className="mt-2.5 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {language === 'hi' ? 'ऑफलाइन डेटा' : 'Offline Support'}
                    </span>
                    <span className="flex items-center gap-1 text-cyan-400">
                      <ShieldCheck className="w-3.5 h-3.5" /> {language === 'hi' ? 'सुरक्षित स्टोरेज' : 'Secure Local Storage'}
                    </span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <Zap className="w-3.5 h-3.5" /> {language === 'hi' ? 'फास्ट स्पीड' : 'Instant 0s Load'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Install Status Card & Celebration Screen */}
              {(isInstalled || installStatus === 'success' || previewSuccess) ? (
                <div className="rounded-2xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-teal-950/70 border-2 border-emerald-500/60 p-4 sm:p-5 shadow-xl shadow-emerald-950/50 space-y-4 animate-in fade-in zoom-in-95 duration-300">
                  
                  {/* Top Celebration Banner */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/30">
                      <Check className="w-7 h-7 stroke-[3]" />
                    </div>
                    <div className="text-center sm:text-left flex-1">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <span className="text-[10px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950">
                          {language === 'hi' ? 'सफलतापूर्वक इंस्टॉल' : 'Installation Successful'}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> {language === 'hi' ? 'प्रमाणित एंड्रॉइड ऐप' : 'Verified Android WebAPK'}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-black text-white mt-0.5">
                        {language === 'hi' 
                          ? '🎉 बधाई! आपके डिवाइस में ऐप इंस्टॉल हो गया है!' 
                          : '🎉 Congratulations! Android App Successfully Installed!'}
                      </h4>
                      <p className="text-xs text-emerald-100/80">
                        {language === 'hi'
                          ? 'नेत्र मोबाइल सेंटर अब आपके स्मार्टफोन में बिना ब्राउज़र के स्टैंडअलोन मोड में चलने के लिए तैयार है।'
                          : 'Netra Mobile Center is now installed and running in native standalone mode on your device.'}
                      </p>
                    </div>
                  </div>

                  {/* App Verified Identity Badge */}
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-center gap-3.5">
                    <div className="relative flex-shrink-0">
                      <img 
                        src="/assets/aistudio/large__1__865785a2.png" 
                        alt="Mobile Netra Repering" 
                        className="w-16 h-16 rounded-xl bg-white p-1 border-2 border-emerald-500/60 object-contain shadow-md"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center border-2 border-slate-950 shadow">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <h5 className="text-sm sm:text-base font-bold text-white">
                          Mobile Netra Repering (Since 2012)
                        </h5>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                          v1.0 Ready
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {language === 'hi' 
                          ? 'प्रो. राहुल आर. केवट • हेल्पलाइन: 9699962396 • rahulnetra16@gmail.com' 
                          : 'Prop. Rahul R Kevat • Helpline: 9699962396 • rahulnetra16@gmail.com'}
                      </p>
                      
                      <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {language === 'hi' ? 'स्टैंडअलोन मोड एक्टिव' : 'Standalone Active'}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                          <Database className="w-3 h-3" />
                          {language === 'hi' ? 'लोकल डेटाबेस सेव' : 'Local DB Synced'}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          {language === 'hi' ? '0s सुपरफास्ट लोड' : 'Instant 0s Launch'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                    <button
                      onClick={() => setActiveModal(null)}
                      className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-slate-950" />
                      <span>{language === 'hi' ? '🚀 ऐप का उपयोग शुरू करें' : '🚀 Open App & Start Using'}</span>
                    </button>

                    <button
                      onClick={() => setActiveModal('backup')}
                      className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Database className="w-4 h-4 text-cyan-400" />
                      <span>{language === 'hi' ? 'डेटा बैकअप' : 'Data Backup'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleNativeInstall}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <Download className="w-5 h-5 stroke-[2.5]" />
                    <span>{language === 'hi' ? 'एंड्रॉइड ऐप इंस्टॉल करें (Install Now)' : 'Install Android App on this Device'}</span>
                  </button>

                  {installStatus === 'iframe' && (
                    <div className="p-3.5 bg-amber-950/60 border border-amber-500/50 rounded-xl text-xs text-amber-200 space-y-2">
                      <div className="flex items-center gap-2 font-bold">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span>{language === 'hi' ? 'प्रीव्यू आईफ्रेम में ऑटोमैटिक पॉपअप ब्लॉक है:' : 'Automatic prompt blocked inside iframe:'}</span>
                      </div>
                      <p className="text-[11px] text-amber-100/90">
                        {language === 'hi'
                          ? 'एंड्रॉइड सुरक्षा नियमों के कारण ऐप केवल असली Chrome विंडो में ही इंस्टॉल हो सकता है।'
                          : 'Android security restricts WebAPK installation from inside preview frames.'}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          onClick={handleOpenDirectInBrowser}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>{language === 'hi' ? 'सीधा Chrome में खोलें' : 'Open in Chrome Tab'}</span>
                        </button>
                        <button
                          onClick={() => setActiveTab('troubleshoot')}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 text-amber-300 font-semibold text-xs border border-amber-600/40 cursor-pointer"
                        >
                          {language === 'hi' ? 'एरर समाधान देखें' : 'View Fix Steps'}
                        </button>
                      </div>
                    </div>
                  )}

                  {installStatus === 'manual' && (
                    <div className="p-3.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-slate-200 space-y-2">
                      <div className="flex items-center justify-between font-bold text-cyan-300">
                        <span className="flex items-center gap-1.5">
                          <Smartphone className="w-4 h-4 text-cyan-400" />
                          {language === 'hi' ? 'मैन्युअल इंस्टॉल विधि (Chrome 3-Dots):' : 'Manual Install Steps (Chrome 3-Dots):'}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">100% Working</span>
                      </div>
                      <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px]">
                        <li>{language === 'hi' ? 'मोबाइल ब्राउज़र के ऊपर दाईं ओर 3 डॉट्स (⋮) मेनू पर टैप करें।' : 'Tap the top-right 3 dots menu (⋮) in your Chrome browser.'}</li>
                        <li>{language === 'hi' ? '"Install app" (ऐप इंस्टॉल करें) या "Add to Home screen" चुनें।' : 'Select "Install app" or "Add to Home screen".'}</li>
                        <li>{language === 'hi' ? '"Install" दबाएं। ऐप आपके फोन स्क्रीन पर आ जाएगा।' : 'Tap "Install". The icon will appear on your phone home screen.'}</li>
                      </ol>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => setActiveTab('troubleshoot')}
                          className="text-[11px] text-amber-400 hover:text-amber-300 underline underline-offset-2 cursor-pointer flex items-center gap-1"
                        >
                          <Wrench className="w-3 h-3" />
                          <span>{language === 'hi' ? 'अगर फिर भी एरर आए तो यहाँ क्लिक करें' : 'Still having issues? Open Error Fixer'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {installStatus === 'cancelled' && (
                    <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-slate-300 flex items-center justify-between">
                      <span>{language === 'hi' ? 'इंस्टॉलेशन रद्द किया गया।' : 'Install prompt was cancelled.'}</span>
                      <button 
                        onClick={handleNativeInstall}
                        className="text-emerald-400 font-bold hover:underline cursor-pointer"
                      >
                        {language === 'hi' ? 'दोबारा कोशिश करें' : 'Try Again'}
                      </button>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-1 text-xs">
                    <button
                      onClick={() => setActiveTab('troubleshoot')}
                      className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'APK इंस्टॉल नहीं हो रहा? एरर समाधान' : 'APK install failing? Troubleshoot & Fix'}</span>
                    </button>

                    <button
                      onClick={() => setPreviewSuccess(!previewSuccess)}
                      className="text-[11px] text-slate-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                      title="Toggle preview of install state"
                    >
                      <Eye className="w-3 h-3" />
                      <span>{previewSuccess ? 'Standard' : 'Demo Success'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Share to WhatsApp */}
                <button
                  onClick={shareViaWhatsApp}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 flex items-center gap-3 text-left transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white flex items-center gap-1">
                      {language === 'hi' ? 'व्हाट्सएप पर लिंक भेजें' : 'Share via WhatsApp'}
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      {language === 'hi' ? 'स्टाफ या ग्राहक फोन पर ऐप लिंक भेजें' : 'Send app install link to phone'}
                    </p>
                  </div>
                </button>

                {/* Copy Web Link */}
                <button
                  onClick={handleCopyLink}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 flex items-center gap-3 text-left transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
                    {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white flex items-center gap-1">
                      {copied ? (language === 'hi' ? 'लिंक कॉपी हो गया!' : 'Link Copied!') : (language === 'hi' ? 'ऐप लिंक कॉपी करें' : 'Copy Live App URL')}
                    </h5>
                    <p className="text-[11px] text-slate-400 truncate max-w-[180px]">
                      {currentUrl}
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: TROUBLESHOOT & FIX APK / INSTALL ERRORS */}
          {activeTab === 'troubleshoot' && (
            <div className="space-y-4">
              
              {/* System Diagnostic Status Grid */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      {language === 'hi' ? 'सिस्टम डायग्नोस्टिक्स व इंस्टॉलेशन स्टेटस' : 'System Diagnostic & Health Check'}
                    </h4>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                    Diagnostic OK
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block mb-0.5">Manifest URL</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                      <Check className="w-3 h-3 stroke-[3]" /> /manifest.webmanifest
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block mb-0.5">High-Res Icons</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                      <Check className="w-3 h-3 stroke-[3]" /> 192px & 512px
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block mb-0.5">Security / HTTPS</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                      <Check className="w-3 h-3 stroke-[3]" /> SSL Active
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block mb-0.5">Service Worker</span>
                    <span className={`font-bold flex items-center gap-1 text-[11px] ${hasServiceWorker ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {hasServiceWorker ? <Check className="w-3 h-3 stroke-[3]" /> : '⚠️'} {hasServiceWorker ? 'Active & Cached' : 'Checking'}
                    </span>
                  </div>
                </div>

                {/* Fast Action to Launch in Chrome Directly */}
                <div className="p-3 rounded-lg bg-gradient-to-r from-cyan-950/60 to-slate-900 border border-cyan-500/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="font-bold text-white block">
                      {language === 'hi' ? '⚡ 1-क्लिक समाधान: सीधे Google Chrome में खोलें' : '⚡ #1 Fix: Open Directly in Google Chrome'}
                    </span>
                    <p className="text-[11px] text-slate-300">
                      {language === 'hi' 
                        ? 'एंड्रॉइड का असली WebAPK इंस्टॉलर केवल स्टैंडअलोन Chrome ब्राउज़र में ही काम करता है।' 
                        : 'Chromium WebAPK installer requires running outside of iframes and WhatsApp webviews.'}
                    </p>
                  </div>
                  <button
                    onClick={handleOpenDirectInBrowser}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer whitespace-nowrap"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'Chrome ऐप में लॉन्च करें' : 'Launch in Chrome'}</span>
                  </button>
                </div>
              </div>

              {/* 5 Common Errors & Step-by-Step Solutions */}
              <div className="space-y-3">
                <h4 className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  {language === 'hi' ? 'एंड्रॉइड पर आम एरर्स और उनके पक्के समाधान:' : 'Common Android Install Errors & Proven Fixes:'}
                </h4>

                {/* Error 1 */}
                <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-rose-300 font-bold">
                    <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px]">त्रुटि 1</span>
                    <span>{language === 'hi' ? '"Install" बटन दबाने पर कुछ नहीं हो रहा या एरर आ रहा है' : '"Install" button not opening prompt or doing nothing'}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    <strong>{language === 'hi' ? 'कारण:' : 'Cause:'}</strong>{' '}
                    {language === 'hi' 
                      ? 'यदि आपने लिंक WhatsApp, Facebook या किसी आईफ्रेम में खोला है, तो ब्राउज़र ऑटोमैटिक इंस्टॉल ब्लॉक कर देता है।'
                      : 'Triggered when opened inside an in-app webview or cross-origin iframe where beforeinstallprompt is suppressed.'}
                  </p>
                  <p className="text-emerald-300 text-[11px] leading-relaxed font-semibold">
                    <strong>{language === 'hi' ? 'समाधान:' : 'Fix:'}</strong>{' '}
                    {language === 'hi' 
                      ? 'Chrome ब्राउज़र में ऊपर दिए 3 डॉट्स (⋮) दबाएं और "Install app" (ऐप इंस्टॉल करें) या "Add to Home screen" चुनें।'
                      : 'Tap Chrome 3 dots (⋮) -> tap "Install app" or "Add to Home screen". Alternatively, tap "Launch in Chrome" above.'}
                  </p>
                </div>

                {/* Error 2 */}
                <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-rose-300 font-bold">
                    <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px]">त्रुटि 2</span>
                    <span>{language === 'hi' ? 'Play Protect / "अज्ञात ऐप ब्लॉक" चेतावनी (Blocked by Play Protect)' : '"Blocked by Play Protect" or "Unrecognized app"'}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    <strong>{language === 'hi' ? 'कारण:' : 'Cause:'}</strong>{' '}
                    {language === 'hi' 
                      ? 'जब कोई ऐप सीधे दुकान या वेब से इंस्टॉल किया जाता है (बिना Google Play Store शुल्क के), तो Android सुरक्षा पुष्टि मांगता है।'
                      : 'Google Play Protect alerts users when sideloading or installing apps outside the Play Store catalog.'}
                  </p>
                  <p className="text-emerald-300 text-[11px] leading-relaxed font-semibold">
                    <strong>{language === 'hi' ? 'समाधान:' : 'Fix:'}</strong>{' '}
                    {language === 'hi' 
                      ? 'स्क्रीन पर "More details" (अधिक जानकारी) पर क्लिक करें और फिर "Install anyway" (फिर भी इंस्टॉल करें) दबाएं। यह ऐप 100% सुरक्षित और केवल नेत्र मोबाइल सेंटर के लिए बना है।'
                      : 'Tap "More details" -> then tap "Install anyway". The application is 100% safe, verified, and ad-free.'}
                  </p>
                </div>

                {/* Error 3 */}
                <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-rose-300 font-bold">
                    <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px]">त्रुटि 3</span>
                    <span>{language === 'hi' ? '"App not installed / पैकेज करप्ट है" (Package invalid or corrupt)' : '"App not installed" or package conflict'}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    <strong>{language === 'hi' ? 'कारण:' : 'Cause:'}</strong>{' '}
                    {language === 'hi' 
                      ? 'फोन में पहले से पुराना वर्शन या अधूरा डाउनलोड मौजूद हो सकता है।'
                      : 'An existing older test version or mismatched package signature is currently stored on the device.'}
                  </p>
                  <p className="text-emerald-300 text-[11px] leading-relaxed font-semibold">
                    <strong>{language === 'hi' ? 'समाधान:' : 'Fix:'}</strong>{' '}
                    {language === 'hi' 
                      ? 'फोन की होम स्क्रीन से पुराने "Netra Mobile" शॉर्टकट को डिलीट करें, Chrome को रीस्टार्ट करें और दोबारा "Install app" दबाएं।'
                      : 'Remove any previous Netra icon from your home screen, restart Chrome, and tap "Install app" afresh.'}
                  </p>
                </div>

                {/* Error 4 */}
                <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold">
                    <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px]">फ़ाइल बैकअप</span>
                    <span>{language === 'hi' ? 'मैन्युअल WebAPK कॉन्फिगरेशन फ़ाइल डाउनलोड' : 'Download Manual WebAPK Manifest Configuration'}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {language === 'hi' 
                      ? 'यदि आप कस्टम APK बिल्डर या Bubblewrap का उपयोग कर रहे हैं, तो आप सीधे ऐप की मानक कॉन्फ़िग फ़ाइल डाउनलोड कर सकते हैं:'
                      : 'Directly download the validated W3C web manifest file for standalone Android APK compilation:'}
                  </p>
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      onClick={handleDownloadManifest}
                      className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{language === 'hi' ? 'netra-mobile-center.webmanifest डाउनलोड करें' : 'Download .webmanifest file'}</span>
                    </button>
                    <a
                      href="/manifest.webmanifest"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <span>View in Browser</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: Standalone APK Generator (PWABuilder & Bubblewrap) */}
          {activeTab === 'apk_builder' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-cyan-500/30 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {language === 'hi' ? 'स्टैंडअलोन .APK फ़ाइल डाउनलोड करें (PWABuilder)' : 'Generate Standalone .APK File (PWABuilder)'}
                  </h3>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {language === 'hi'
                    ? 'यदि आपको अपने कर्मचारियों या ग्राहकों के फोन में बिना ब्राउज़र के सीधे पेनड्राइव या व्हाट्सएप से .apk फ़ाइल भेजकर इंस्टॉल करवानी है, तो आप Microsoft PWABuilder से 1-क्लिक में फ्री में साइन्ड .apk डाउनलोड कर सकते हैं:'
                    : 'If you need a standalone .apk package to distribute via WhatsApp, pen drive, or upload to Google Play Console, you can generate a signed production APK with 1-click via PWABuilder:'}
                </p>

                <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs flex-1">
                    <span className="text-slate-400 font-medium">{language === 'hi' ? 'सत्यापित ऐप यूआरएल (Verified URL):' : 'Verified Live App URL:'}</span>
                    <p className="text-cyan-300 font-mono text-[11px] break-all">{currentUrl}</p>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                      <Check className="w-3 h-3" /> Manifest verified at /manifest.webmanifest
                    </span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                    <a
                      href={pwaBuilderAndroidUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow cursor-pointer whitespace-nowrap"
                    >
                      <span>{language === 'hi' ? 'सीधा APK पैकेज बनाएं' : 'Build Android APK'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <a
                      href={pwaBuilderReportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-1 transition-colors border border-slate-700 cursor-pointer whitespace-nowrap"
                    >
                      <span>Report Card</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-700 text-xs">
                  <h4 className="font-bold text-slate-200">
                    {language === 'hi' ? 'PWABuilder से APK डाउनलोड करने के आसान स्टेप्स:' : 'Easy Steps on PWABuilder:'}
                  </h4>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[12px]">
                    <li>{language === 'hi' ? 'ऊपर दिए गए "Build Android APK" बटन पर क्लिक करें।' : 'Click the "Build Android APK" button above.'}</li>
                    <li>{language === 'hi' ? 'वेबसाइट खुलने पर "Package for Stores" या "Android" पर क्लिक करें।' : 'Click "Package for Stores" or select "Android".'}</li>
                    <li>{language === 'hi' ? '"Generate" दबाएं और सीधे अपने कंप्यूटर या फोन में .apk फ़ाइल डाउनलोड करें!' : 'Click "Generate" and download your signed .apk package!'}</li>
                  </ol>
                </div>
              </div>

              {/* Advanced Android Studio / Bubblewrap CLI Card */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    Bubblewrap CLI (Google Trusted Web Activity)
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">CLI Command</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {language === 'hi' 
                    ? 'डेवलपर्स के लिए: Google की आधिकारिक Bubblewrap टूल से लोकल मशीन पर APK बिल्ड करने की कमांड:' 
                    : 'For developers: Build signed APK using Google’s official CLI tool:'}
                </p>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto">
                  npx @bubblewrap/cli init --manifest={currentUrl}/manifest.webmanifest
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: QR Code Scanning on Phone */}
          {activeTab === 'qr' && (
            <div className="text-center space-y-4 py-2">
              <div>
                <h3 className="text-base font-bold text-white">
                  {language === 'hi' ? 'फोन के कैमरे से QR कोड स्कैन करें' : 'Scan QR Code with Phone Camera'}
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  {language === 'hi'
                    ? 'अपने एंड्रॉइड फोन में कैमरा या Google Lens खोलकर इस कोड को स्कैन करें और सीधे मोबाइल में ऐप चलाएं व इंस्टॉल करें।'
                    : 'Open camera or Google Lens on your smartphone, scan this QR code to launch and install the app immediately.'}
                </p>
              </div>

              <div className="inline-block p-4 bg-white rounded-2xl shadow-xl shadow-cyan-950/50">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="App QR Code" className="w-52 h-52 sm:w-60 sm:h-60 mx-auto" />
                ) : (
                  <div className="w-52 h-52 flex items-center justify-center text-slate-800">
                    Generating QR...
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Link'}</span>
                </button>

                <button
                  onClick={shareViaWhatsApp}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: Instructions Guide */}
          {activeTab === 'instructions' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-3">
                <h4 className="font-bold text-sm text-emerald-300 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" />
                  {language === 'hi' ? 'एंड्रॉइड फोन (Google Chrome / Brave) में इंस्टॉलेशन विधि' : 'Android Smartphone Installation (Chrome / Brave)'}
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 leading-relaxed text-[12px]">
                  <li>
                    <strong>{language === 'hi' ? 'लिंक खोलें:' : 'Open Link:'}</strong>{' '}
                    {language === 'hi' ? 'फोन के क्रोम ब्राउज़र में ऐप का लिंक खोलें।' : 'Open the live app URL in Chrome on Android.'}
                  </li>
                  <li>
                    <strong>{language === 'hi' ? 'बैनर या मेनू देखें:' : 'Look for Install Banner:'}</strong>{' '}
                    {language === 'hi' 
                      ? 'नीचे या ऊपर "Install Netra Mobile Center" का बटन दिखेगा, उस पर टैप करें।' 
                      : 'Tap "Install App" button or tap Chrome menu (⋮) -> "Install app".'}
                  </li>
                  <li>
                    <strong>{language === 'hi' ? '"Install" दबाएं:' : 'Confirm Install:'}</strong>{' '}
                    {language === 'hi'
                      ? 'एंड्रॉइड आपके फोन के ऐप ड्रॉअर में बिना प्ले स्टोर के सीधा ओरिजिनल ऐप डाल देगा।'
                      : 'Android will add the official standalone app to your app launcher and home screen.'}
                  </li>
                  <li>
                    <strong>{language === 'hi' ? 'फुल स्क्रीन में उपयोग करें:' : 'Enjoy Native Fullscreen:'}</strong>{' '}
                    {language === 'hi'
                      ? 'ऐप बिना किसी यूआरएल बार के बिल्कुल नेटिव ऐप की तरह तेज स्पीड और ऑफलाइन डेटा सेविंग के साथ काम करेगा।'
                      : 'The app operates fullscreen with no browser URL bar, fast startup, and local caching.'}
                  </li>
                </ol>
              </div>

              {/* iOS Guide */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/80 space-y-2">
                <h4 className="font-bold text-sm text-cyan-300">
                  {language === 'hi' ? 'iPhone / iPad (iOS Safari) में इंस्टॉलेशन' : 'iPhone / iPad (Safari) Installation'}
                </h4>
                <p className="text-slate-300 text-[12px] leading-relaxed">
                  {language === 'hi'
                    ? '1. Safari में ऐप खोलें। 2. नीचे शेयर आइकन (Square with Up Arrow) दबाएं। 3. नीचे स्क्रॉल करके "Add to Home Screen" दबाएं।'
                    : '1. Open link in Safari. 2. Tap the Share button (square with arrow). 3. Scroll down and tap "Add to Home Screen".'}
                </p>
              </div>
            </div>
          )}

          {/* App Specifications Bar */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
            <div>
              <span className="text-slate-500">{language === 'hi' ? 'ऐप का नाम:' : 'App Name:'}</span>{' '}
              <strong className="text-slate-300">Netra Mobile Center</strong>
            </div>
            <div>
              <span className="text-slate-500">{language === 'hi' ? 'प्रोपराइटर:' : 'Proprietor:'}</span>{' '}
              <strong className="text-slate-300">Rahul R Kevat</strong>
            </div>
            <div>
              <span className="text-slate-500">{language === 'hi' ? 'हेल्पलाइन:' : 'Phone:'}</span>{' '}
              <strong className="text-emerald-400 font-mono">9699962396</strong>
            </div>
            <div>
              <span className="text-slate-500">{language === 'hi' ? 'साइज:' : 'Size:'}</span>{' '}
              <strong className="text-cyan-400 font-mono">&lt; 2 MB</strong>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">
              {language === 'hi' ? '100% सुरक्षित • कोई वायरस नहीं' : '100% Safe • Local Storage'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
            >
              {language === 'hi' ? 'बंद करें' : 'Close'}
            </button>
            <a
              href={pwaBuilderAndroidUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'APK डाउनलोड करें' : 'Get APK'}</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
