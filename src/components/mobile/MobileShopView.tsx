import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Smartphone, 
  Wrench, 
  Package, 
  ShoppingCart, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  TrendingUp
} from 'lucide-react';
import { RepairTracker } from './RepairTracker';
import { InventoryManagement } from './InventoryManagement';
import { MobileRepairProfitView } from './MobileRepairProfitView';

export const MobileShopView: React.FC = () => {
  const { 
    t, 
    language, 
    repairJobs, 
    inventory, 
    invoices, 
    activeModule,
    setActiveModal 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'repairs' | 'repair_profit' | 'inventory'>(() => {
    return activeModule === 'inventory' ? 'inventory' : 'repairs';
  });

  React.useEffect(() => {
    if (activeModule === 'inventory') {
      setActiveTab('inventory');
    } else if (activeModule === 'mobile' || activeModule === 'repairs') {
      setActiveTab('repairs');
    }
  }, [activeModule]);

  // Stats
  const activeRepairsCount = repairJobs.filter(j => j.status === 'in_repair' || j.status === 'diagnosing' || j.status === 'received').length;
  const readyRepairsCount = repairJobs.filter(j => j.status === 'ready_for_pickup').length;
  const lowStockCount = inventory.filter(i => i.stockQty <= i.minThreshold).length;

  const today = new Date().toDateString();
  const todayShopInvoices = invoices.filter(inv => {
    return (inv.moduleType === 'mobile_shop' || inv.moduleType === 'repair') &&
      new Date(inv.date).toDateString() === today;
  });
  const todayShopCollection = todayShopInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-orange-950 to-slate-900 rounded-2xl p-5 sm:p-6 text-white border border-amber-800/50 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
              {language === 'hi' ? 'मोबाइल शॉप एवं रिपेयर डिवीजन' : 'Mobile Sales & Repair Division'}
            </span>
            <span className="text-xs text-slate-400">Rahul R Kevat (Master Tech)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black mt-1">
            {language === 'hi' ? 'स्मार्टफोन रिपेयर, एक्सेसरीज व त्वरित बिलिंग' : 'Smartphone Repair, Accessories & Billing'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            {language === 'hi'
              ? 'डिवाइस जमा करें, जॉब कार्ड बनाएं, रिपेयर स्टेटस ट्रैक करें, स्टॉक मैनेज करें और बिलिंग करें।'
              : 'Create repair job cards, diagnose hardware/software faults, track inventory stock, and issue GST/retail invoices.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActiveModal('repair')}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Wrench className="w-5 h-5 text-slate-950" />
            <span>{t.newRepairJob}</span>
          </button>
          <button
            onClick={() => setActiveModal('pos')}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-cyan-300 border border-cyan-700/60 font-bold text-sm transition-all cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{t.posBilling}</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shrink-0">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
              {language === 'hi' ? 'काम चालू (In Repair)' : 'Active Repairs'}
            </span>
            <span className="text-xl font-black text-slate-900 dark:text-white">
              {activeRepairsCount}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
              {language === 'hi' ? 'डिलीवरी हेतु तैयार (Ready)' : 'Ready for Pickup'}
            </span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {readyRepairsCount}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
              {language === 'hi' ? 'कम स्टॉक अलर्ट' : 'Low Stock Items'}
            </span>
            <span className="text-xl font-black text-rose-600 dark:text-rose-400">
              {lowStockCount}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
              {language === 'hi' ? 'दुकान बिक्री आज' : 'Today\'s Sales'}
            </span>
            <span className="text-xl font-black text-cyan-600 dark:text-cyan-400">
              ₹{todayShopCollection.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Sub tabs: Repairs vs Separate Repair Profit vs Inventory */}
      <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('repairs')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'repairs'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-500/5'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>{language === 'hi' ? 'रिपेयर जॉब कार्ड व ट्रैकर' : 'Repair Job Cards & Tracking'}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {repairJobs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('repair_profit')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'repair_profit'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span>{language === 'hi' ? 'रिपेयर दैनिक मुनाफ़ा (Separate)' : 'Repair Daily Profit (Separate)'}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-extrabold border border-emerald-300 dark:border-emerald-800">
            {language === 'hi' ? 'अलग' : 'Separate'}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'inventory'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-500/5'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{language === 'hi' ? 'सामान एवं एक्सेसरीज स्टॉक' : 'Inventory & Accessories Stock'}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {inventory.length}
          </span>
        </button>
      </div>

      {/* Tab views */}
      {activeTab === 'repairs' && <RepairTracker />}
      {activeTab === 'repair_profit' && <MobileRepairProfitView />}
      {activeTab === 'inventory' && <InventoryManagement />}
    </div>
  );
};
