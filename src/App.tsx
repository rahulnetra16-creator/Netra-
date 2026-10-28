import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { UnifiedDashboard } from './components/UnifiedDashboard';
import { MobileShopView } from './components/mobile/MobileShopView';
import { ReportsView } from './components/reports/ReportsView';
import { CRMView } from './components/crm/CRMView';

// Modals
import { RepairJobCardModal } from './components/mobile/RepairJobCardModal';
import { POSBillingModal } from './components/mobile/POSBillingModal';
import { InvoicePrintView } from './components/mobile/InvoicePrintView';
import { NotificationModal } from './components/NotificationModal';
import { DailyExpensesModal } from './components/expenses/DailyExpensesModal';
import { LoginModal } from './components/auth/LoginModal';
import { APKDownloadModal } from './components/mobile/APKDownloadModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ProfitLossCalculatorModal } from './components/calculator/ProfitLossCalculatorModal';
import { ReminderSchedulerModal } from './components/crm/ReminderSchedulerModal';
import { SettingsBackupModal } from './components/settings/SettingsBackupModal';

import { 
  LayoutDashboard, 
  Smartphone, 
  Wrench,
  Package,
  FileText, 
  Plus, 
  ShieldCheck,
  Users
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeModule, setActiveModule, language, setActiveModal, activeModal } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white pb-20 sm:pb-8">
      {/* Top App Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {activeModule === 'unified' && <UnifiedDashboard />}
        {activeModule === 'crm' && <CRMView />}
        {(activeModule === 'mobile' || activeModule === 'repairs' || activeModule === 'inventory') && <MobileShopView />}
        {activeModule === 'reports' && <ReportsView />}
      </main>

      {/* Mobile Center Modals */}
      <RepairJobCardModal />
      <POSBillingModal />
      <InvoicePrintView />
      <NotificationModal />
      <DailyExpensesModal />
      <LoginModal />
      <APKDownloadModal />
      <ProfitLossCalculatorModal />
      <ReminderSchedulerModal 
        isOpen={activeModal === 'scheduleReminder'} 
        onClose={() => setActiveModal(null)} 
      />
      <SettingsBackupModal />

      {/* Offline Status Toast */}
      <OfflineIndicator />

      {/* Mobile Android-style Bottom Bar (Fixed for responsive screens) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-3 py-1.5 flex justify-around items-center text-[10px]">
        <button
          onClick={() => setActiveModule('unified')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
            activeModule === 'unified' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>{language === 'hi' ? 'डैशबोर्ड' : 'Overview'}</span>
        </button>

        <button
          onClick={() => setActiveModule('mobile')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
            activeModule === 'mobile' || activeModule === 'repairs' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>{language === 'hi' ? 'रिपेयर' : 'Repairs'}</span>
        </button>

        {/* Central Floating Action button */}
        <button
          onClick={() => setActiveModal('repair')}
          className="w-11 h-11 -mt-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 border-2 border-slate-900 font-black cursor-pointer"
          title="New Repair Job"
        >
          <Plus className="w-6 h-6 text-slate-950" />
        </button>

        <button
          onClick={() => setActiveModule('inventory')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
            activeModule === 'inventory' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{language === 'hi' ? 'स्टॉक' : 'Stock'}</span>
        </button>

        <button
          onClick={() => setActiveModule('crm')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
            activeModule === 'crm' ? 'text-blue-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{language === 'hi' ? 'ग्राहक' : 'CRM'}</span>
        </button>

        <button
          onClick={() => setActiveModule('reports')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
            activeModule === 'reports' ? 'text-purple-400 font-bold' : 'text-slate-400'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{language === 'hi' ? 'खाता' : 'Reports'}</span>
        </button>

        <button
          onClick={() => setActiveModal('apk')}
          className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-emerald-400 hover:text-emerald-300 font-bold"
          title="Android APK / App"
        >
          <Smartphone className="w-4 h-4" />
          <span>APK</span>
        </button>
      </nav>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-4 text-center text-xs text-slate-500 print:hidden hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Netra Mobile Center</span>
            <span>•</span>
            <span>Smartphone Sales, Accessories & Multi-Brand Repairing</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Proprietor: <strong className="text-slate-200">Rahul R Kevat</strong></span>
            <span>Helpline: <strong className="text-emerald-400 font-mono">9699962396</strong></span>
            <button
              onClick={() => setActiveModal('apk')}
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android APK Download</span>
            </button>
            <span className="flex items-center gap-1 text-cyan-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Local Secure Storage
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
