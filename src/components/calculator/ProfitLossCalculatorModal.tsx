import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent, 
  Wrench, 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Plus, 
  FileText, 
  X,
  ShieldCheck,
  Zap,
  Printer
} from 'lucide-react';

export const ProfitLossCalculatorModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    language, 
    invoices, 
    expenses, 
    repairJobs, 
    inventory, 
    shopSettings 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'simulator' | 'store_ledger'>('simulator');
  const [calcMode, setCalcMode] = useState<'repair' | 'retail'>('repair');

  // Interactive Simulator inputs
  const [sellingPrice, setSellingPrice] = useState<number | ''>(2200);
  const [costPrice, setCostPrice] = useState<number | ''>(1350);
  const [extraExpense, setExtraExpense] = useState<number | ''>(50); // e.g. glue, tape, delivery
  const [discount, setDiscount] = useState<number | ''>(100);
  const [quantity, setQuantity] = useState<number>(1);
  const [itemName, setItemName] = useState<string>('Redmi Note 12 Display Folder');

  // Store Ledger timeframe filter
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month' | 'all'>('today');

  const isOpen = activeModal === 'calculator';

  if (!isOpen) return null;

  // Real-time calculations for Simulator
  const sp = Number(sellingPrice) || 0;
  const cp = Number(costPrice) || 0;
  const extra = Number(extraExpense) || 0;
  const disc = Number(discount) || 0;
  const qty = Math.max(1, Number(quantity) || 1);

  const netRevenuePerUnit = Math.max(0, sp - disc);
  const totalCostPerUnit = cp + extra;
  const profitPerUnit = netRevenuePerUnit - totalCostPerUnit;

  const totalRevenue = netRevenuePerUnit * qty;
  const totalCost = totalCostPerUnit * qty;
  const totalNetProfitOrLoss = profitPerUnit * qty;

  const isProfit = totalNetProfitOrLoss >= 0;
  const profitMarginPercent = totalRevenue > 0 ? ((totalNetProfitOrLoss / totalRevenue) * 100).toFixed(1) : '0';
  const markupPercent = totalCost > 0 ? ((totalNetProfitOrLoss / totalCost) * 100).toFixed(1) : '0';
  const breakevenPrice = totalCostPerUnit + disc;

  // Preset quick templates
  const presets = [
    {
      name: language === 'hi' ? 'डिस्प्ले फोल्डर रिप्लेसमेंट' : 'Display Folder Replacement',
      mode: 'repair' as const,
      sp: 2200,
      cp: 1400,
      extra: 50,
      disc: 100,
      desc: 'Screen + Touch Combo',
    },
    {
      name: language === 'hi' ? 'ओरिजिनल बैटरी रिप्लेसमेंट' : 'Original Battery Replacement',
      mode: 'repair' as const,
      sp: 1100,
      cp: 580,
      extra: 20,
      disc: 0,
      desc: 'Mobile Battery',
    },
    {
      name: language === 'hi' ? 'टाइप-सी चार्जिंग सब-बोर्ड' : 'Type-C Charging Sub-board',
      mode: 'repair' as const,
      sp: 450,
      cp: 90,
      extra: 10,
      disc: 0,
      desc: 'CC Sub-board Jack',
    },
    {
      name: language === 'hi' ? '11D यूवी टेम्पर्ड ग्लास' : '11D UV Tempered Glass',
      mode: 'retail' as const,
      sp: 120,
      cp: 25,
      extra: 5,
      disc: 20,
      desc: 'Screen Protector',
    },
    {
      name: language === 'hi' ? '33W सुपर फास्ट चार्जर व केबल' : '33W Fast Dart Charger & Cable',
      mode: 'retail' as const,
      sp: 550,
      cp: 220,
      extra: 10,
      disc: 50,
      desc: 'Accessories',
    },
    {
      name: language === 'hi' ? 'मदरबोर्ड आईसी / वाटर डैमेज सर्विस' : 'Motherboard IC / Water Damage',
      mode: 'repair' as const,
      sp: 1500,
      cp: 200,
      extra: 100,
      disc: 100,
      desc: 'Micro-soldering labor',
    },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setItemName(preset.name);
    setCalcMode(preset.mode);
    setSellingPrice(preset.sp);
    setCostPrice(preset.cp);
    setExtraExpense(preset.extra);
    setDiscount(preset.disc);
    setQuantity(1);
  };

  const resetCalculator = () => {
    setSellingPrice(2000);
    setCostPrice(1200);
    setExtraExpense(50);
    setDiscount(0);
    setQuantity(1);
    setItemName('Custom Phone Repair / Item');
  };

  // STORE LEDGER REAL FINANCIALS
  const now = new Date();
  const todayStr = now.toDateString();

  const filteredInvoices = invoices.filter(inv => {
    const d = new Date(inv.date);
    if (timeFilter === 'today') return d.toDateString() === todayStr;
    if (timeFilter === 'week') return d >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    if (timeFilter === 'month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    return true;
  });

  const filteredExpenses = expenses.filter(exp => {
    const d = new Date(exp.date);
    if (timeFilter === 'today') return d.toDateString() === todayStr;
    if (timeFilter === 'week') return d >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    if (timeFilter === 'month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    return true;
  });

  const filteredRepairs = repairJobs.filter(job => {
    const d = new Date(job.receivedDate);
    if (timeFilter === 'today') return d.toDateString() === todayStr;
    if (timeFilter === 'week') return d >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    if (timeFilter === 'month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    return true;
  });

  // Calculate actual revenue
  const actualRevenue = filteredInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0);

  // Calculate COGS (Parts cost from actual repair jobs + wholesale cost from invoices)
  const actualPartsCost = filteredRepairs.reduce((sum, j) => sum + (j.partsCost || 0), 0);
  
  let actualProductCost = 0;
  filteredInvoices.forEach(inv => {
    inv.items.forEach(it => {
      if (it.type === 'product') {
        const found = inventory.find(i => i.name === it.title || i.id === it.id);
        if (found) {
          actualProductCost += found.costPrice * it.quantity;
        } else {
          actualProductCost += it.total * 0.55;
        }
      }
    });
  });

  const actualCOGS = actualPartsCost + actualProductCost;
  const actualGrossProfit = Math.max(0, actualRevenue - actualCOGS);
  const actualOperatingKharcha = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const actualNetProfitOrLoss = actualRevenue - actualCOGS - actualOperatingKharcha;
  const actualIsProfit = actualNetProfitOrLoss >= 0;
  const actualMarginPercent = actualRevenue > 0 ? ((actualNetProfitOrLoss / actualRevenue) * 100).toFixed(1) : '0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-950/40 border border-white/20 flex items-center justify-center shadow-inner">
              <Calculator className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  {language === 'hi' ? 'नफ़ा-नुकसान कैलकुलेटर (Profit & Loss)' : 'Profit & Loss Calculator & Ledger'}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-200 border border-emerald-400/30">
                  Smart Margin
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                {language === 'hi'
                  ? 'मोबाइल रिपेयरिंग, एक्सेसरीज़ व दुकान खर्चों का वास्तविक मार्जिन व शुद्ध नफ़ा'
                  : 'Calculate margins on repairs, accessories, parts costs & daily shop overheads'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="w-8 h-8 rounded-full bg-slate-950/40 hover:bg-slate-950/70 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 pt-2 gap-2 text-xs font-semibold overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'लाइव मार्जिन कैलकुलेटर (Job / Product Calculator)' : 'Live Job & Product Calculator'}</span>
          </button>

          <button
            onClick={() => setActiveTab('store_ledger')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'store_ledger'
                ? 'border-cyan-400 text-cyan-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'दुकान का वास्तविक लाभ-हानि खाता (Store P&L)' : 'Store-Wide Actual P&L Ledger'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 text-slate-200 text-xs">
          
          {/* TAB 1: Interactive Job & Margin Calculator */}
          {activeTab === 'simulator' && (
            <div className="space-y-5">
              
              {/* Quick Template Presets */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    {language === 'hi' ? 'अक्सर उपयोग होने वाले रिपेयर व सामान (Quick Presets):' : 'Popular Repair & Product Presets:'}
                  </span>
                  <button
                    onClick={resetCalculator}
                    className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{language === 'hi' ? 'रीसेट' : 'Reset'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {presets.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applyPreset(p)}
                      className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 hover:border-emerald-500/50 text-left transition-all cursor-pointer group"
                    >
                      <span className="text-slate-200 font-bold text-[11px] block truncate group-hover:text-emerald-300">
                        {p.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                        ₹{p.cp} → ₹{p.sp}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculator Inputs Grid */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-4">
                
                {/* Item description */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {language === 'hi' ? 'आइटम / रिपेयर विवरण (Item or Repair Service Description)' : 'Item or Repair Description'}
                  </label>
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="e.g. Redmi Note 12 Display Folder"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Selling Price / Customer Quote */}
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {language === 'hi' ? 'ग्राहक मूल्य (Selling Price) *' : 'Selling Price (₹) *'}
                    </label>
                    <div className="relative">
                      <span className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 font-bold">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={sellingPrice}
                        onChange={(e) => setSellingPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-mono font-bold focus:border-emerald-400 focus:outline-none"
                        placeholder="2200"
                      />
                    </div>
                  </div>

                  {/* Wholesale Parts / Purchase Cost */}
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {language === 'hi' ? 'खरीद / पार्ट्स लागत (Cost Price) *' : 'Parts / Cost Price (₹) *'}
                    </label>
                    <div className="relative">
                      <span className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 font-bold">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={costPrice}
                        onChange={(e) => setCostPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-mono font-bold focus:border-rose-400 focus:outline-none"
                        placeholder="1350"
                      />
                    </div>
                  </div>

                  {/* Extra direct expense (glue, packaging, labor) */}
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {language === 'hi' ? 'गोंद/टेप/सामग्री (Consumables)' : 'Extra Consumables (₹)'}
                    </label>
                    <div className="relative">
                      <span className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 font-bold">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={extraExpense}
                        onChange={(e) => setExtraExpense(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-mono focus:border-cyan-400 focus:outline-none"
                        placeholder="50"
                      />
                    </div>
                  </div>

                  {/* Discount to customer */}
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {language === 'hi' ? 'ग्राहक छूट (Discount)' : 'Customer Discount (₹)'}
                    </label>
                    <div className="relative">
                      <span className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 font-bold">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 font-mono focus:border-amber-400 focus:outline-none"
                        placeholder="100"
                      />
                    </div>
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-semibold">{language === 'hi' ? 'मात्रा (Quantity):' : 'Quantity Units:'}</span>
                    <div className="flex items-center gap-1 bg-slate-900 rounded-lg border border-slate-700 p-0.5">
                      {[1, 2, 5, 10].map(q => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => setQuantity(q)}
                          className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                            quantity === q ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 font-mono">
                    {language === 'hi' ? 'न्यूनतम लागत सीमा (Break-even):' : 'Break-even Quote:'}{' '}
                    <strong className="text-amber-400 font-bold">₹{breakevenPrice}</strong>
                  </div>
                </div>
              </div>

              {/* Real-time Calculation Result Card */}
              <div className={`p-5 rounded-3xl border shadow-xl transition-all ${
                isProfit
                  ? 'bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 border-emerald-500/50'
                  : 'bg-gradient-to-br from-rose-950/60 via-slate-900 to-slate-900 border-rose-500/50'
              }`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg ${
                      isProfit 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                        : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                    }`}>
                      {isProfit ? <TrendingUp className="w-8 h-8" /> : <TrendingDown className="w-8 h-8" />}
                    </div>

                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {isProfit 
                          ? (language === 'hi' ? 'अनुमानित शुद्ध नफ़ा (Estimated Net Profit)' : 'Estimated Net Profit')
                          : (language === 'hi' ? 'घाटा चेतावनी (Net Loss Warning!)' : 'Estimated Net Loss Warning!')}
                      </span>
                      <div className={`text-2xl sm:text-3xl font-black mt-0.5 ${
                        isProfit ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {isProfit ? '+' : '-'}₹{Math.abs(totalNetProfitOrLoss).toLocaleString('en-IN')}
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {isProfit
                          ? `${quantity > 1 ? `(₹${profitPerUnit} per unit) ` : ''}${profitMarginPercent}% Margin on Selling Price`
                          : (language === 'hi' ? 'खरीद लागत विक्रय मूल्य से अधिक है!' : 'Cost price exceeds customer quote!')}
                      </p>
                    </div>
                  </div>

                  {/* Profit Health Metric Box */}
                  <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2 text-right">
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs min-w-[160px]">
                      <div className="flex justify-between gap-3 text-slate-400 text-[11px]">
                        <span>Profit Margin:</span>
                        <strong className={`font-mono ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {profitMarginPercent}%
                        </strong>
                      </div>
                      <div className="flex justify-between gap-3 text-slate-400 text-[11px] mt-1">
                        <span>Cost Markup:</span>
                        <strong className="text-cyan-400 font-mono">{markupPercent}%</strong>
                      </div>
                      <div className="flex justify-between gap-3 text-slate-400 text-[11px] mt-1 pt-1 border-t border-slate-800">
                        <span>Net Inflow:</span>
                        <strong className="text-slate-200 font-mono">₹{totalRevenue}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mathematical Formula Footnote */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Formula: (Selling Price - Discount) - (Wholesale Cost + Consumables) = Net Margin</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveModal('repair')}
                      className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] cursor-pointer"
                    >
                      + {language === 'hi' ? 'रिपेयर जॉब कार्ड बनाएं' : 'Create Repair Job'}
                    </button>
                    <button
                      onClick={() => setActiveModal('pos')}
                      className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] cursor-pointer"
                    >
                      + {language === 'hi' ? 'POS बिलिंग बनाएं' : 'Create POS Bill'}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Actual Store-Wide Profit & Loss Statement */}
          {activeTab === 'store_ledger' && (
            <div className="space-y-4">
              
              {/* Time Filter & Store Summary */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700">
                <div>
                  <h4 className="font-bold text-white text-sm">
                    {language === 'hi' ? 'नेत्र मोबाइल सेंटर - वास्तविक बहीखाता (Store P&L Statement)' : 'Netra Mobile Center - Actual Financial Statement'}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Proprietor: Rahul R Kevat • Calculated from live invoices, repair parts & expense logs
                  </p>
                </div>

                {/* Time selector */}
                <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-700 text-xs">
                  {[
                    { id: 'today', label: language === 'hi' ? 'आज' : 'Today' },
                    { id: 'week', label: language === 'hi' ? 'इस सप्ताह' : 'This Week' },
                    { id: 'month', label: language === 'hi' ? 'इस माह' : 'This Month' },
                    { id: 'all', label: language === 'hi' ? 'समग्र' : 'All Time' },
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTimeFilter(t.id as any)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                        timeFilter === t.id ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4 Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <span className="text-[11px] text-slate-400 font-medium block">{language === 'hi' ? 'कुल प्राप्त राशि (Revenue)' : 'Total Revenue Collected'}</span>
                  <div className="text-xl font-black text-cyan-400 mt-1">
                    ₹{actualRevenue.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-slate-500">{filteredInvoices.length} {language === 'hi' ? 'बिल' : 'invoices'}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <span className="text-[11px] text-slate-400 font-medium block">{language === 'hi' ? 'पार्ट्स व माल खरीद (COGS)' : 'Parts & Inventory Cost'}</span>
                  <div className="text-xl font-black text-amber-400 mt-1">
                    ₹{actualCOGS.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-slate-500">{filteredRepairs.length} {language === 'hi' ? 'रिपेयर जॉब्स' : 'repairs'}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <span className="text-[11px] text-slate-400 font-medium block">{language === 'hi' ? 'दैनिक खर्चे (Daily Kharcha)' : 'Daily Overhead Expenses'}</span>
                  <div className="text-xl font-black text-rose-400 mt-1">
                    ₹{actualOperatingKharcha.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-slate-500">{filteredExpenses.length} {language === 'hi' ? 'खर्च प्रविष्टियाँ' : 'expense entries'}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <span className="text-[11px] text-slate-400 font-medium block">{language === 'hi' ? 'शुद्ध लाभ / हानि (Net Profit)' : 'Net Bottom-Line Profit'}</span>
                  <div className={`text-xl font-black mt-1 ${actualIsProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {actualIsProfit ? '+' : '-'}₹{Math.abs(actualNetProfitOrLoss).toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">{actualMarginPercent}% Net Margin</span>
                </div>
              </div>

              {/* Detailed Breakdown Ledger Table */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
                <h5 className="font-bold text-xs text-white uppercase tracking-wider">
                  {language === 'hi' ? 'लेखा-जोखा विवरण (Financial Breakdown):' : 'Financial Ledger Statement:'}
                </h5>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900/60">
                    <span className="text-slate-300">1. {language === 'hi' ? 'कुल सकल बिक्री व बिलिंग (Gross Inflow)' : 'Total Invoiced Billing'}</span>
                    <span className="font-mono font-bold text-white">₹{actualRevenue}</span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900/60">
                    <span className="text-slate-300">2. {language === 'hi' ? 'मोबाइल स्पेयर पार्ट्स लागत (Parts Cost in Repairs)' : 'Wholesale Repair Parts Used'}</span>
                    <span className="font-mono text-rose-300">- ₹{actualPartsCost}</span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900/60">
                    <span className="text-slate-300">3. {language === 'hi' ? 'एक्सेसरीज़ स्टॉक खरीद लागत (Accessories Wholesale Cost)' : 'Accessories Sold Wholesale Cost'}</span>
                    <span className="font-mono text-rose-300">- ₹{actualProductCost}</span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900 font-semibold border border-slate-700">
                    <span className="text-cyan-300">{language === 'hi' ? 'सकल मुनाफ़ा (Gross Profit = Revenue - COGS)' : 'Gross Trading Profit'}</span>
                    <span className="font-mono font-black text-cyan-300">₹{actualGrossProfit}</span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900/60">
                    <span className="text-slate-300">4. {language === 'hi' ? 'दुकान संचालन खर्चे (Overheads / Tea / Salary / Rent)' : 'Operating Daily Overheads'}</span>
                    <span className="font-mono text-rose-400">- ₹{actualOperatingKharcha}</span>
                  </div>

                  <div className={`flex justify-between items-center p-3 rounded-xl border ${
                    actualIsProfit ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                  }`}>
                    <div>
                      <strong className="text-sm block">
                        {actualIsProfit 
                          ? (language === 'hi' ? 'अंतिम शुद्ध मुनाफ़ा (Net Bottom-line Profit)' : 'Final Net Profit')
                          : (language === 'hi' ? 'अंतिम शुद्ध घाटा (Net Operating Loss)' : 'Final Net Operating Loss')}
                      </strong>
                      <span className="text-[11px] opacity-80">{actualMarginPercent}% margin after all wholesale & store expenses</span>
                    </div>
                    <span className="font-mono font-black text-lg">
                      {actualIsProfit ? '+' : '-'}₹{Math.abs(actualNetProfitOrLoss).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{language === 'hi' ? 'नेत्र मोबाइल सेंटर • प्रो. राहुल आर. केवट' : 'Netra Mobile Center • Prop. Rahul R Kevat'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
            >
              {language === 'hi' ? 'बंद करें' : 'Close'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
