import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Smartphone, 
  Wrench, 
  ShoppingCart, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  FileText,
  Users,
  Download,
  Package,
  Plus,
  ShieldCheck,
  Share2,
  Calculator
} from 'lucide-react';
import { BrandLogo } from './brandLogos';
import { PWAInstallButton } from './PWAInstallButton';

export const UnifiedDashboard: React.FC = () => {
  const { 
    t, 
    language, 
    repairJobs, 
    inventory, 
    invoices, 
    expenses,
    customers,
    setActiveModule, 
    setActiveModal, 
    setSelectedInvoiceToView,
    exportDataJSON,
    openNotificationModal,
    shopSettings
  } = useApp();

  const today = new Date().toDateString();
  
  // Repairs stats
  const activeRepairs = repairJobs.filter(j => j.status === 'in_repair' || j.status === 'diagnosing' || j.status === 'received' || j.status === 'waiting_parts');
  const readyDevices = repairJobs.filter(j => j.status === 'ready_for_pickup');
  const deliveredJobs = repairJobs.filter(j => j.status === 'delivered');
  const lowStockItems = inventory.filter(i => i.stockQty <= i.minThreshold);

  // Revenue & Daily Kharcha today
  const todayInvoices = invoices.filter(inv => new Date(inv.date).toDateString() === today);
  const totalRevenue = todayInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0);

  const todayExpenses = expenses.filter(e => new Date(e.date).toDateString() === today);
  const totalTodayKharcha = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
  const todayNetProfit = totalRevenue - totalTodayKharcha;

  // Total pending Khata
  const totalPendingDues = invoices.reduce((sum, inv) => sum + inv.dueAmount, 0);

  // Pure separate mobile repair profit (Billed - Parts wholesale cost)
  const totalRepairProfit = repairJobs.reduce((sum, job) => {
    const billed = job.finalCost || job.estimatedCost;
    const parts = job.partsCost || 0;
    return sum + (billed - parts);
  }, 0);

  const popularBrands = [
    'Samsung',
    'Vivo',
    'Xiaomi',
    'Apple',
    'Oppo',
    'Realme',
    'OnePlus',
    'Motorola'
  ];

  const handleNotifyPickup = (job: (typeof repairJobs)[0]) => {
    const msg = language === 'hi'
      ? `नमस्ते ${job.customerName} जी, आपका मोबाइल ${job.deviceBrand} ${job.deviceModel} (जॉब #${job.id}) पूरी तरह से ठीक हो चुका है। कृपया नेत्र मोबाइल सेंटर से आकर ले जाएं। बाकी राशि: ₹${(job.finalCost || job.estimatedCost) - job.advancePaid}। संपर्क: राहुल आर. केवट (${shopSettings.phone})`
      : `Dear ${job.customerName}, your smartphone ${job.deviceBrand} ${job.deviceModel} (Job #${job.id}) is repaired and ready for pickup at Netra Mobile Center. Balance due: Rs.${(job.finalCost || job.estimatedCost) - job.advancePaid}. Contact: Rahul R Kevat (${shopSettings.phone})`;

    openNotificationModal({
      title: language === 'hi' ? 'डिलीवरी सूचना (WhatsApp / SMS)' : 'Pickup Ready Notification',
      text: msg,
      recipientPhone: job.phone,
      type: 'whatsapp'
    });
  };

  return (
    <div className="space-y-6">
      {/* Hero Welcome & Quick Business Overview */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 p-6 sm:p-8 text-white border border-slate-800 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {language === 'hi' ? 'नेत्र मोबाइल सेंटर - मुख्य नियंत्रण कक्ष' : 'Netra Mobile Center • Master HQ'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {language === 'hi' ? 'नमस्ते राहुल आर. केवट जी, व्यापार में आपका स्वागत है!' : 'Welcome back, Rahul R Kevat!'}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-2xl">
              {language === 'hi'
                ? 'स्मार्टफोन रिपेयर, एक्सेसरीज़ इन्वेंटरी, दैनिक खर्च (खर्चा), नफ़ा-नुकसान एवं त्वरित बिलिंग का सम्पूर्ण प्रबंधन।'
                : 'Complete control of your Smartphone Repair Workshop, Accessories Stock, Daily Kharcha, Profit & Loss, and Invoices.'}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveModal('repair')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Wrench className="w-4 h-4 text-slate-950" />
              <span>{t.newRepairJob}</span>
            </button>
            <button
              onClick={() => setActiveModal('expense')}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
            >
              <span>+</span>
              <span>{language === 'hi' ? 'दैनिक खर्च (Kharcha)' : 'Daily Kharcha'}</span>
            </button>
            <button
              onClick={() => setActiveModal('pos')}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{language === 'hi' ? 'बिलिंग (POS)' : 'POS Bill'}</span>
            </button>
            <button
              onClick={() => setActiveModal('calculator')}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer border border-emerald-400/30"
              title="Profit & Loss Calculator (नफ़ा-नुकसान कैलकुलेटर)"
            >
              <Calculator className="w-4 h-4 text-emerald-300" />
              <span>{language === 'hi' ? 'नफ़ा-नुकसान कैलकुलेटर' : 'P&L Calculator'}</span>
            </button>
            <button
              onClick={() => setActiveModal('apk')}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 transition-all cursor-pointer border border-emerald-400/30"
              title="Download Android APK / App"
            >
              <Smartphone className="w-4 h-4 text-emerald-200" />
              <span>{language === 'hi' ? 'एंड्रॉइड APK डाउनलोड' : 'Download Android APK'}</span>
            </button>
            <button
              onClick={() => setActiveModal('settings')}
              title="Open Settings & JSON Data Backup/Restore Utility"
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/40 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md"
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>{language === 'hi' ? 'सेटिंग्स व डेटा बैकअप' : 'Settings & Backup'}</span>
            </button>
          </div>
        </div>

        {/* Subtle decorative background glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Android PWA Install Banner */}
      <PWAInstallButton variant="banner" />

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Today's Collection & Profit/Kharcha */}
        <div 
          onClick={() => setActiveModule('reports')}
          className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-cyan-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.totalRevenue}
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className={`font-bold px-1.5 py-0.2 rounded ${todayNetProfit >= 0 ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/15 text-rose-500'}`}>
              {todayNetProfit >= 0 ? '+' : ''}₹{todayNetProfit} Profit
            </span>
            <span className="text-rose-500 font-medium">
              Kharcha: ₹{totalTodayKharcha}
            </span>
          </div>
        </div>

        {/* Mobiles in Repair */}
        <div 
          onClick={() => setActiveModule('mobile')}
          className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.activeRepairs}
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-500 dark:text-amber-400">
            {activeRepairs.length} <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">({readyDevices.length} Ready)</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <span>{language === 'hi' ? 'रिपेयर ट्रैकर खोलें' : 'Open Repair Tracker'}</span>
            <ArrowRight className="w-3 h-3 text-amber-500" />
          </p>
        </div>

        {/* Mobile Repair Separate Profit */}
        <div 
          onClick={() => setActiveModule('mobile')}
          className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'रिपेयर शुद्ध मुनाफ़ा' : 'Repair Net Profit'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
            ₹{totalRepairProfit.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <span>{language === 'hi' ? 'सामान लागत घटाकर' : 'After wholesale parts cost'}</span>
            <ArrowRight className="w-3 h-3 text-emerald-500" />
          </p>
        </div>

        {/* Low stock & Pending Khata */}
        <div 
          onClick={() => setActiveModule('reports')}
          className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.pendingDues}
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-purple-500 dark:text-purple-400">
            ₹{totalPendingDues.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <span>{lowStockItems.length} Low stock alerts</span>
            <ArrowRight className="w-3 h-3 text-purple-500" />
          </p>
        </div>
      </div>

      {/* CRM Customer Directory Quick Strip */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-cyan-400 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <span>{language === 'hi' ? 'ग्राहक डायरेक्टरी एवं इतिहास (CRM)' : 'Customer Relationship Management (CRM)'}</span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-blue-500/20 text-cyan-300 font-bold border border-blue-500/30">
                {customers.length} {language === 'hi' ? 'ग्राहक' : 'Clients'}
              </span>
            </h4>
            <p className="text-[11px] text-slate-300">
              {language === 'hi' 
                ? 'ग्राहकों के मोबाइल रिपेयरिंग रिकॉर्ड, बिलिंग इतिहास, बकाया खाता एवं व्हाट्सएप अलर्ट।' 
                : 'Search client contact details, lifetime repair logs, invoices, and khata balances.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveModule('crm')}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-cyan-950/40 cursor-pointer transition-transform whitespace-nowrap"
        >
          <span>{language === 'hi' ? 'ग्राहक CRM खोलें' : 'Open Customer CRM'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Brand Logos Showcase */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {language === 'hi' ? 'समर्थित मोबाइल ब्रांड्स' : 'Multi-Brand Service Center'}
            </span>
            <span className="text-xs text-slate-400">
              {language === 'hi' ? 'सभी प्रमुख ब्रांड्स के ओरिजिनल पार्ट्स व डिस्प्ले' : 'Genuine spare parts & display repairs'}
            </span>
          </div>
          <button
            onClick={() => setActiveModule('mobile')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
          >
            <span>{language === 'hi' ? 'ब्रांड अनुसार रिपेयर देखें' : 'View brand jobs'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
          {popularBrands.map(brand => {
            const count = repairJobs.filter(j => j.deviceBrand.toLowerCase() === brand.toLowerCase()).length;
            return (
              <div 
                key={brand}
                onClick={() => setActiveModule('mobile')}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/50 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                  <BrandLogo brand={brand} size="md" />
                </div>
                <span className="text-xs font-bold text-slate-200">{brand}</span>
                <span className="text-[10px] text-amber-400/90 font-mono font-medium">
                  {count} {count === 1 ? 'job' : 'jobs'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Main Division Launchpad Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Smartphone Repairs & Workshop Portal */}
        <div className="bg-gradient-to-br from-amber-950/90 via-orange-950 to-slate-900 rounded-2xl p-5 sm:p-6 text-white border border-amber-700/50 shadow-md relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                  <Wrench className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-amber-100">
                    {language === 'hi' ? 'स्मार्टफोन रिपेयर एवं सर्विस हब' : 'Smartphone Repair & Service Hub'}
                  </h3>
                  <span className="text-xs text-amber-300">Rahul R Kevat • Master Technician</span>
                </div>
              </div>
              <span className="text-xs font-black px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {repairJobs.length} Total Jobs
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 mb-4">
              {language === 'hi'
                ? 'जॉब कार्ड बनाएं, पैटर्न लॉक/IMEI दर्ज करें, फोल्डर व बैटरी बदलें, व्हाट्सएप टोकन भेजें और शुद्ध मुनाफ़ा देखें।'
                : 'Intake devices, record IMEI & pattern passcodes, replace folder displays, send WhatsApp tokens, and compute profit.'}
            </p>

            {/* Quick stats list */}
            <div className="grid grid-cols-3 gap-2 bg-amber-950/60 p-2.5 rounded-xl border border-amber-800/40 text-center text-xs mb-4">
              <div>
                <span className="text-slate-400 block text-[11px]">{language === 'hi' ? 'काम चालू' : 'In Repair'}</span>
                <span className="font-black text-amber-400 text-sm">{activeRepairs.length}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">{language === 'hi' ? 'डिलीवरी रेडी' : 'Ready'}</span>
                <span className="font-black text-emerald-400 text-sm">{readyDevices.length}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">{language === 'hi' ? 'रिपेयर शुद्ध मुनाफ़ा' : 'Repair Profit'}</span>
                <span className="font-black text-emerald-400 text-sm font-mono">+₹{totalRepairProfit.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => setActiveModal('repair')}
              className="flex-1 py-2 px-3 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>{t.newRepairJob}</span>
            </button>
            <button
              onClick={() => setActiveModule('mobile')}
              className="py-2 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>{language === 'hi' ? 'रिपेयर सेंटर खोलें' : 'Open Repairs'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile & Accessories Stock Portal */}
        <div className="bg-gradient-to-br from-cyan-950/90 via-teal-950 to-slate-900 rounded-2xl p-5 sm:p-6 text-white border border-cyan-700/50 shadow-md relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-cyan-100">
                    {language === 'hi' ? 'एक्सेसरीज़ एवं मोबाइल इन्वेंटरी' : 'Accessories & Mobile Inventory'}
                  </h3>
                  <span className="text-xs text-cyan-300">Smartphones • Displays • Chargers • Covers</span>
                </div>
              </div>
              <span className="text-xs font-black px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {inventory.length} Items
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 mb-4">
              {language === 'hi'
                ? 'नया स्टॉक जोड़ें, न्यूनतम स्टॉक चेतावनी (Low stock alerts) देखें और तुरंत बारकोड/पीओएस बिलिंग करें।'
                : 'Track retail stock, wholesale purchase cost, selling prices, auto low-stock warnings, and barcode billing.'}
            </p>

            {/* Quick stats list */}
            <div className="grid grid-cols-3 gap-2 bg-cyan-950/60 p-2.5 rounded-xl border border-cyan-800/40 text-center text-xs mb-4">
              <div>
                <span className="text-slate-400 block text-[11px]">{language === 'hi' ? 'कुल सामान' : 'Total Items'}</span>
                <span className="font-black text-cyan-300 text-sm">{inventory.reduce((sum, i) => sum + i.stockQty, 0)} pcs</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">{language === 'hi' ? 'कम स्टॉक' : 'Low Stock'}</span>
                <span className={`font-black text-sm ${lowStockItems.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {lowStockItems.length}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">{language === 'hi' ? 'आज की बिक्री' : 'Today Sales'}</span>
                <span className="font-black text-white text-sm">₹{totalRevenue}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => setActiveModal('pos')}
              className="flex-1 py-2 px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{t.posBilling}</span>
            </button>
            <button
              onClick={() => setActiveModule('inventory')}
              className="py-2 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>{language === 'hi' ? 'स्टॉक देखें' : 'Open Stock'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-Side Live Feeds: Active Repairs vs Recent Sales/Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Active Mobile Repairs in Shop */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {language === 'hi' ? 'वर्कशॉप में चल रहे रिपेयर (Active Repairs)' : 'Workshop Live Repairs'}
              </h3>
            </div>
            <button
              onClick={() => setActiveModule('mobile')}
              className="text-xs text-amber-500 hover:text-amber-400 font-semibold cursor-pointer"
            >
              {language === 'hi' ? 'सभी देखें →' : 'View All →'}
            </button>
          </div>

          <div className="space-y-2">
            {repairJobs.slice(0, 5).map(job => (
              <div key={job.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-mono font-bold flex items-center justify-center text-[10px]">
                    <BrandLogo brand={job.deviceBrand} size="sm" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-white block">
                      {job.deviceBrand} {job.deviceModel}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {job.customerName} • {job.issueDescription.split(',')[0]}
                    </span>
                  </div>
                </div>
                <div className="text-right flex items-center gap-2">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">₹{job.finalCost || job.estimatedCost}</span>
                    <span className={`text-[10px] font-bold ${
                      job.status === 'ready_for_pickup' 
                        ? 'text-emerald-500 font-black' 
                        : job.status === 'delivered' 
                        ? 'text-slate-400' 
                        : 'text-amber-500'
                    }`}>
                      {job.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  {job.status === 'ready_for_pickup' && (
                    <button
                      onClick={() => handleNotifyPickup(job)}
                      title="Send WhatsApp pickup alert"
                      className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Low Stock Warnings & Recent Invoices */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {language === 'hi' ? 'कम स्टॉक चेतावनी (Low Stock Warnings)' : 'Low Stock Reorder Alerts'}
              </h3>
            </div>
            <button
              onClick={() => setActiveModule('inventory')}
              className="text-xs text-rose-500 hover:text-rose-400 font-semibold cursor-pointer"
            >
              {language === 'hi' ? 'स्टॉक मैनेज करें →' : 'Manage Stock →'}
            </button>
          </div>

          <div className="space-y-2">
            {lowStockItems.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center text-xs text-emerald-400">
                <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                {language === 'hi' ? 'सभी सामान पर्याप्त स्टॉक में हैं।' : 'All accessories and parts are well-stocked.'}
              </div>
            ) : (
              lowStockItems.slice(0, 5).map(item => (
                <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-300/40 dark:border-rose-900/40 text-xs">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-white block">{item.name}</span>
                    <span className="text-[11px] text-slate-500">{item.brand} • SKU: {item.sku}</span>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950">
                      {item.stockQty} {item.unit} left
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Threshold: {item.minThreshold}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
