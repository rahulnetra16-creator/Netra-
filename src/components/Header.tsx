import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Smartphone, 
  LayoutDashboard, 
  FileText, 
  Wrench, 
  Languages, 
  Search,
  ShoppingCart,
  Package,
  Plus,
  Download,
  Users,
  Calculator,
  Settings
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { ActiveModule } from '../types';
import { VoiceSearchInput } from './common/VoiceSearchInput';

export const Header: React.FC = () => {
  const { 
    language, 
    toggleLanguage, 
    t, 
    activeModule, 
    setActiveModule, 
    searchQuery, 
    setSearchQuery,
    setActiveModal,
    userSession,
    customers
  } = useApp();

  const navItems: { id: ActiveModule; label: string; icon: React.ReactNode; color: string; badge?: string }[] = [
    {
      id: 'unified',
      label: language === 'hi' ? 'डैशबोर्ड' : 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4 text-cyan-400" />,
      color: 'from-blue-600 to-indigo-600',
    },
    {
      id: 'crm',
      label: language === 'hi' ? 'ग्राहक CRM' : 'CRM & Clients',
      icon: <Users className="w-4 h-4 text-blue-400" />,
      color: 'from-blue-600 to-cyan-600',
      badge: `${customers.length}`,
    },
    {
      id: 'mobile',
      label: language === 'hi' ? 'मोबाइल रिपेयर' : 'Mobile Repairs',
      icon: <Wrench className="w-4 h-4 text-amber-400" />,
      color: 'from-amber-600 to-orange-600',
      badge: 'Job Cards & Profit',
    },
    {
      id: 'inventory',
      label: language === 'hi' ? 'एक्सेसरीज़ स्टॉक' : 'Stock & Inventory',
      icon: <Package className="w-4 h-4 text-emerald-400" />,
      color: 'from-emerald-600 to-teal-700',
    },
    {
      id: 'reports',
      label: language === 'hi' ? 'खाता, रिपोर्ट व बैकअप' : 'Reports & Backup',
      icon: <FileText className="w-4 h-4 text-purple-400" />,
      color: 'from-purple-600 to-indigo-700',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-lg backdrop-blur-md bg-opacity-95">
      {/* Top Brand Banner */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-3 pb-2 flex flex-wrap items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            {/* Official Mobile Netra Repering Logo */}
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-red-600 via-amber-500 to-red-500 p-0.5 shadow-md shadow-red-950/40 flex-shrink-0">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center overflow-hidden p-0.5">
                <img 
                  src="/assets/aistudio/large__1__865785a2.png" 
                  alt="Mobile Netra Repering" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-red-300 via-amber-200 to-cyan-300 bg-clip-text text-transparent">
                {t.appName}
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 font-mono">
                SINCE 2012
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {t.tagline} • <span className="text-slate-300 font-medium">{t.ownerLabel}</span>
            </p>
          </div>
        </div>

        {/* Global Search Bar with Voice-to-Text */}
        <div className="flex-1 max-w-md mx-2 min-w-[220px]">
          <VoiceSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            moduleName="global"
            size="sm"
            placeholder={t.searchPlaceholder}
            placeholderHi="बोलें या लिखें: ग्राहक, मॉडल, या टोकन..."
          />
        </div>

        {/* Right Actions: Language Switcher & Quick Launch buttons */}
        <div className="flex items-center gap-2">
          {/* PWA & Android APK Quick Install Button */}
          <PWAInstallButton variant="header" />

          {/* Language Toggle Button */}
          <button
            onClick={toggleLanguage}
            title={language === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer shadow-sm"
          >
            <Languages className="w-4 h-4 text-teal-400" />
            <span>{language === 'hi' ? 'EN' : 'हिन्दी'}</span>
          </button>

          {/* Settings & Data Backup Menu Button */}
          <button
            onClick={() => setActiveModal('settings')}
            title={language === 'hi' ? 'सेटिंग्स व डेटा बैकअप (Settings & Backup)' : 'Settings & Data Backup'}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer shadow-sm"
          >
            <Settings className="w-4 h-4 text-purple-400" />
            <span className="hidden xl:inline">{language === 'hi' ? 'सेटिंग्स' : 'Settings'}</span>
          </button>

          {/* User Session / Phone 9699962396 Login Badge */}
          <button
            onClick={() => setActiveModal('login')}
            title="Rahul R Kevat - Owner Login (9699962396)"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            <span className={`w-2 h-2 rounded-full ${userSession?.isLoggedIn ? 'bg-emerald-400 ring-2 ring-emerald-400/30 animate-pulse' : 'bg-slate-500'}`} />
            <span className="hidden sm:inline text-slate-200 font-mono text-[11px]">
              {userSession?.isLoggedIn ? `${userSession.name} (${userSession.phone})` : 'Login (9699962396)'}
            </span>
            <span className="sm:hidden text-emerald-400 font-mono text-[11px]">
              9699962396
            </span>
          </button>

          {/* Profit & Loss Calculator Button */}
          <button
            onClick={() => setActiveModal('calculator')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-sm cursor-pointer border border-emerald-500/30"
            title="Profit & Loss Calculator (नफ़ा-नुकसान कैलकुलेटर)"
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-300" />
            <span className="hidden md:inline">{language === 'hi' ? 'P&L कैलकुलेटर' : 'P&L Calc'}</span>
            <span className="md:hidden">P&L</span>
          </button>

          {/* Quick Daily Kharcha Button */}
          <button
            onClick={() => setActiveModal('expense')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            title="Daily Kharcha"
          >
            <span>+</span>
            <span className="hidden md:inline">{language === 'hi' ? 'दैनिक खर्च' : 'Kharcha'}</span>
            <span className="md:hidden">{language === 'hi' ? 'खर्च' : 'Exp'}</span>
          </button>

          {/* Quick Repair Job Button */}
          <button
            onClick={() => setActiveModal('repair')}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-sm hover:shadow-amber-600/30 cursor-pointer"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.newRepairJob}</span>
            <span className="md:hidden">+ {language === 'hi' ? 'रिपेयर' : 'Repair'}</span>
          </button>

          {/* Quick POS Billing */}
          <button
            onClick={() => setActiveModal('pos')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-semibold cursor-pointer shadow-sm"
            title={t.posBilling}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{language === 'hi' ? 'बिलिंग' : 'Billing'}</span>
          </button>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 flex overflow-x-auto gap-2 py-1.5 border-t border-slate-800/80 scrollbar-none">
        {navItems.map((item) => {
          const isActive = activeModule === item.id || (item.id === 'mobile' && activeModule === 'repairs');
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-white border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-amber-950 text-amber-300 border border-amber-800/50">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Android APK Hub Tab */}
        <button
          onClick={() => setActiveModal('apk')}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 shadow-sm transition-all cursor-pointer whitespace-nowrap"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
          <span>{language === 'hi' ? '📱 एंड्रॉइड APK' : '📱 Android APK'}</span>
        </button>
      </div>
    </header>
  );
};
