import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Receipt, 
  Calendar, 
  Plus, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight,
  Eye,
  Smartphone,
  Wrench,
  CheckCircle2,
  Calculator
} from 'lucide-react';

export const ProfitLossView: React.FC = () => {
  const { 
    invoices, 
    expenses, 
    inventory, 
    language, 
    setActiveModal 
  } = useApp();

  const [timeFilter, setTimeFilter] = useState<'today' | 'month' | 'all'>('today');

  const now = new Date();
  const todayStr = now.toDateString();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Filter invoices & expenses based on timeframe
  const filteredInvoices = invoices.filter(inv => {
    const d = new Date(inv.date);
    if (timeFilter === 'today') return d.toDateString() === todayStr;
    if (timeFilter === 'month') return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    return true;
  });

  const filteredExpenses = expenses.filter(exp => {
    const d = new Date(exp.date);
    if (timeFilter === 'today') return d.toDateString() === todayStr;
    if (timeFilter === 'month') return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    return true;
  });

  // Revenue Breakdown
  const totalRevenue = filteredInvoices.reduce((sum, i) => sum + i.paidAmount, 0);
  const clinicRevenue = filteredInvoices.filter(i => i.moduleType === 'clinic').reduce((sum, i) => sum + i.paidAmount, 0);
  const shopRevenue = filteredInvoices.filter(i => i.moduleType === 'mobile_shop').reduce((sum, i) => sum + i.paidAmount, 0);
  const repairRevenue = filteredInvoices.filter(i => i.moduleType === 'repair').reduce((sum, i) => sum + i.paidAmount, 0);

  // Estimate Cost of Goods Sold (COGS) based on sold inventory items
  let estimatedCOGS = 0;
  filteredInvoices.forEach(inv => {
    inv.items.forEach(it => {
      if (it.type === 'product') {
        const found = inventory.find(invItem => invItem.name === it.title || invItem.id === it.id);
        if (found) {
          estimatedCOGS += found.costPrice * it.quantity;
        } else {
          // Approximate 40% margin if item not matched
          estimatedCOGS += it.total * 0.6;
        }
      } else if (it.type === 'repair') {
        // Approximate 30% parts cost for repairs
        estimatedCOGS += it.total * 0.3;
      }
    });
  });

  // Total Operating Kharcha (Daily Expenses)
  const totalKharcha = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Net Profit / Loss
  const netProfitOrLoss = totalRevenue - estimatedCOGS - totalKharcha;
  const isProfit = netProfitOrLoss >= 0;
  const profitMarginPercent = totalRevenue > 0 ? ((netProfitOrLoss / totalRevenue) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-4">
      {/* Top Bar with Time Filter and Add Expense button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <span>{language === 'hi' ? 'नफा-नुकसान एवं दैनिक खर्च रिपोर्ट (Profit & Loss)' : 'Profit & Loss Statement & Daily Kharcha'}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'hi' ? 'कुल कमाई, सामान की खरीद लागत, दैनिक खर्चे और शुद्ध मुनाफ़ा' : 'Revenue, cost of goods, daily overheads, and net profit'}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Timeframe Filter */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setTimeFilter('today')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                timeFilter === 'today' ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500'
              }`}
            >
              {language === 'hi' ? 'आज (Today)' : 'Today'}
            </button>
            <button
              onClick={() => setTimeFilter('month')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                timeFilter === 'month' ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500'
              }`}
            >
              {language === 'hi' ? 'इस माह (Month)' : 'Month'}
            </button>
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                timeFilter === 'all' ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500'
              }`}
            >
              {language === 'hi' ? 'कुल (All)' : 'All Time'}
            </button>
          </div>

          {/* Open P&L Calculator Button */}
          <button
            onClick={() => setActiveModal('calculator')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'लाइव P&L कैलकुलेटर' : 'Live P&L Calculator'}</span>
          </button>

          {/* Add Daily Kharcha Button */}
          <button
            onClick={() => setActiveModal('expense')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? '+ दैनिक खर्च (Kharcha)' : '+ Daily Kharcha'}</span>
          </button>
        </div>
      </div>

      {/* Main Net Profit/Loss Card */}
      <div className={`p-6 rounded-3xl border shadow-lg ${
        isProfit 
          ? 'bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 border-emerald-500/40 text-white' 
          : 'bg-gradient-to-br from-rose-950 via-red-950 to-slate-900 border-rose-500/40 text-white'
      }`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/10 text-white inline-block mb-2">
              {timeFilter === 'today' ? "Today's Result" : timeFilter === 'month' ? "This Month's Result" : "Overall Result"}
            </span>
            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl sm:text-4xl font-black font-mono">
                {isProfit ? '+' : '-'}₹{Math.abs(Math.round(netProfitOrLoss)).toLocaleString('en-IN')}
              </h2>
              <span className={`px-2.5 py-1 rounded-lg font-black text-xs uppercase tracking-wider ${
                isProfit ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
              }`}>
                {isProfit ? (language === 'hi' ? 'शुद्ध मुनाफ़ा (NET PROFIT)' : 'NET PROFIT') : (language === 'hi' ? 'नुकसान (NET LOSS)' : 'NET LOSS')}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Net Profit Margin: <strong className="text-white">{profitMarginPercent}%</strong> of total received collections.
            </p>
          </div>

          {/* Quick Math Equation display */}
          <div className="bg-black/30 p-3.5 rounded-2xl border border-white/10 text-xs space-y-1 font-mono">
            <div className="flex justify-between gap-6 text-emerald-300">
              <span>+ Total Collections:</span>
              <span>₹{Math.round(totalRevenue)}</span>
            </div>
            <div className="flex justify-between gap-6 text-amber-300">
              <span>- Parts / Goods Cost:</span>
              <span>₹{Math.round(estimatedCOGS)}</span>
            </div>
            <div className="flex justify-between gap-6 text-rose-300">
              <span>- Daily Kharcha (Overheads):</span>
              <span>₹{Math.round(totalKharcha)}</span>
            </div>
            <div className="border-t border-white/20 pt-1 font-bold flex justify-between gap-6 text-white text-sm">
              <span>= Net Balance:</span>
              <span>₹{Math.round(netProfitOrLoss)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Revenue Sources */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
            1. Income Sources (कुल कमाई)
          </span>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <Eye className="w-3.5 h-3.5 text-emerald-500" />
                Eye Clinic (OPD & Fees)
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">₹{Math.round(clinicRevenue)}</span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <Smartphone className="w-3.5 h-3.5 text-blue-500" />
                Mobile Shop (Accessories & Items)
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">₹{Math.round(shopRevenue)}</span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <Wrench className="w-3.5 h-3.5 text-amber-500" />
                Mobile Repair Service Fees
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">₹{Math.round(repairRevenue)}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700 font-bold text-emerald-600">
              <span>Total Revenue:</span>
              <span className="font-mono">₹{Math.round(totalRevenue)}</span>
            </div>
          </div>
        </div>

        {/* Operating Kharcha Breakdown */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm md:col-span-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              2. Daily Kharcha Log (दैनिक खर्चे) - Total: ₹{totalKharcha}
            </span>
            <button
              onClick={() => setActiveModal('expense')}
              className="text-xs text-rose-600 font-bold hover:underline"
            >
              + Add Kharcha
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {filteredExpenses.length === 0 ? (
              <p className="col-span-2 text-center py-6 text-slate-400">
                No daily expenses logged for this timeframe. Click "+ Daily Kharcha" to add.
              </p>
            ) : (
              filteredExpenses.map(exp => (
                <div key={exp.id} className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">{exp.title}</span>
                    <span className="text-[10px] text-slate-400">{new Date(exp.date).toLocaleDateString()} • {exp.paidVia}</span>
                  </div>
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                    -₹{exp.amount}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
