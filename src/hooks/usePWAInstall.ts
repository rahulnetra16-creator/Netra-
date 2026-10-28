import { useEffect, useState, useCallback } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isAndroid, setIsAndroid] = useState<boolean>(false);
  const [isInIframe, setIsInIframe] = useState<boolean>(false);
  const [isInAppBrowser, setIsInAppBrowser] = useState<boolean>(false);
  const [hasServiceWorker, setHasServiceWorker] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    // Check if running in standalone display mode (installed PWA / WebAPK)
    const checkStandalone = () => {
      if (typeof window === 'undefined') return false;
      const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
      const isNavStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      const isDocReferrer = document.referrer.includes('android-app://');
      return isStandaloneMedia || isNavStandalone || isDocReferrer;
    };

    setIsInstalled(checkStandalone());

    // Detect iframe environment (AI Studio preview, embedded widget)
    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      setIsInIframe(true);
    }

    // Device detection & in-app browser detection
    const ua = (typeof window !== 'undefined' ? window.navigator.userAgent : '').toLowerCase();
    const android = /android/.test(ua);
    const ios = /iphone|ipad|ipod/.test(ua);
    const inApp = /fbav|instagram|fban|line|micromessenger|telegram|whatsapp|wv/.test(ua);
    setIsAndroid(android);
    setIsIOS(ios);
    setIsInAppBrowser(inApp);

    // Check service worker support
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      setHasServiceWorker(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const install = useCallback(async (): Promise<'accepted' | 'dismissed' | 'manual' | 'iframe_blocked'> => {
    if (isInIframe) {
      return 'iframe_blocked';
    }

    if (!deferredPrompt) {
      return 'manual';
    }

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        return 'accepted';
      }
      return 'dismissed';
    } catch (err) {
      console.warn('Install prompt error:', err);
      return 'manual';
    }
  }, [deferredPrompt, isInIframe]);

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS,
    isAndroid,
    isInIframe,
    isInAppBrowser,
    hasServiceWorker,
    isOnline,
    install,
    deferredPrompt
  };
}
