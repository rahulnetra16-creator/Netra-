import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wrench, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  Package, 
  Smartphone, 
  ArrowUpRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { BrandLogo } from '../brandLogos';

export const MobileRepairProfitView: React.FC = () => {
  const { repairJobs, language, setActiveModal } = useApp();
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month' | 'all'>('today');

  const now = new Date();
  const todayStr = now.toDateString();

  // Filter repair jobs by date
  const filteredJobs = repairJobs.filter(job => {
    const jobDate = new Date(job.receivedDate);
    if (timeFilter === 'today') {
      return jobDate.toDateString() === todayStr;
    }
    if (timeFilter === 'week') {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return jobDate >= oneWeekAgo;
    }
    if (timeFilter === 'month') {
      return jobDate.getMonth() === now.getMonth() && jobDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  // Totals calculation
  const totalBilled = filteredJobs.reduce((sum, j) => sum + (j.finalCost || j.estimatedCost), 0);
  const totalPartsCost = filteredJobs.reduce((sum, j) => sum + (j.partsCost || 0), 0);
  const totalNetRepairProfit = totalBilled - totalPartsCost;
  const profitMarginPercent = totalBilled > 0 ? ((totalNetRepairProfit / totalBilled) * 100).toFixed(1) : '0';

  // Brand-wise profit breakdown
  const brandProfitMap: Record<string, { count: number; revenue: number; partsCost: number; profit: number }> = {};
  filteredJobs.forEach(job => {
    const brand = job.deviceBrand || 'Other';
    if (!brandProfitMap[brand]) {
      brandProfitMap[brand] = { count: 0, revenue: 0, partsCost: 0, profit: 0 };
    }
    const billed = job.finalCost || job.estimatedCost;
    const parts = job.partsCost || 0;
    brandProfitMap[brand].count += 1;
    brandProfitMap[brand].revenue += billed;
    brandProfitMap[brand].partsCost += parts;
    brandProfitMap[brand].profit += (billed - parts);
  });

  const brandEntries = Object.entries(brandProfitMap).sort((a, b) => b[1].profit - a[1].profit);

  return (
    <div className="space-y-4">
      {/* Top Banner and Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {language === 'hi' ? 'अलग रिपेयर हिसाब (Separate)' : 'Separate Repair Tracker'}
            </span>
            <span className="text-xs text-slate-400">Master Tech: Rahul R Kevat</span>
          </div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg mt-0.5 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-500" />
            <span>{language === 'hi' ? 'मोबाइल रिपेयर दैनिक शुद्ध मुनाफ़ा (Daily Repair Profit)' : 'Mobile Repair Separate Daily Profit'}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'hi' 
              ? 'प्रत्येक फोन के पार्ट्स/फोल्डर खरीद खर्च को घटाकर शुद्ध कारीगरी मुनाफ़ा देखें।' 
              : 'Exact technician labor and service profit after deducting parts/folder cost.'}
          </p>
        </div>

        {/* Time Filter Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setTimeFilter('today')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                timeFilter === 'today' ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm' : 'text-slate-500'
              }`}
            >
              {language === 'hi' ? 'आज (Today)' : 'Today'}
            </button>
            <button
              onClick={() => setTimeFilter('week')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                timeFilter === 'week' ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm' : 'text-slate-500'
              }`}
            >
              {language === 'hi' ? 'हफ्ता (Week)' : 'Week'}
            </button>
            <button
              onClick={() => setTimeFilter('month')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                timeFilter === 'month' ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm' : 'text-slate-500'
              }`}
            >
              {language === 'hi' ? 'महीना (Month)' : 'Month'}
            </button>
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                timeFilter === 'all' ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm' : 'text-slate-500'
              }`}
            >
              {language === 'hi' ? 'कुल (All)' : 'All'}
            </button>
          </div>

          <button
            onClick={() => setActiveModal('repair')}
            className="flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-sm whitespace-nowrap cursor-pointer"
          >
            <span>+ New Job</span>
          </button>
        </div>
      </div>

      {/* Hero Separate Repair Profit Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Net Pure Repair Profit */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 border border-emerald-500/40 text-white shadow-lg">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 block mb-1">
            {language === 'hi' ? 'शुद्ध रिपेयर मुनाफ़ा (Net Profit)' : 'Pure Net Repair Profit'}
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
            +₹{totalNetRepairProfit.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-emerald-200/80 mt-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Margin: <strong>{profitMarginPercent}%</strong> of repair bill</span>
          </p>
        </div>

        {/* Total Repair Revenue (Customer Charges) */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
            {language === 'hi' ? 'रिपेयर से कुल कमाई' : 'Total Repair Revenue'}
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
            ₹{totalBilled.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-400">{filteredJobs.length} Mobiles in record</span>
        </div>

        {/* Parts / Folders Wholesale Cost */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
            {language === 'hi' ? 'पार्ट्स/फोल्डर खरीद खर्च' : 'Parts & Folder Cost'}
          </span>
          <div className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400 mt-1 font-mono">
            ₹{totalPartsCost.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-rose-500/80 font-medium">Deducted from gross billing</span>
        </div>

        {/* Average Profit per Device */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
            {language === 'hi' ? 'औसत मुनाफ़ा प्रति मोबाइल' : 'Avg Profit / Mobile'}
          </span>
          <div className="text-xl sm:text-2xl font-black text-amber-500 mt-1 font-mono">
            +₹{filteredJobs.length > 0 ? Math.round(totalNetRepairProfit / filteredJobs.length) : 0}
          </div>
          <span className="text-[11px] text-slate-400">Average technician margin</span>
        </div>
      </div>

      {/* Brand-Wise Profit Analysis (Which brand made most repair profit) */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-3 flex items-center gap-1.5">
          <Smartphone className="w-4 h-4 text-amber-500" />
          <span>{language === 'hi' ? 'मोबाइल कंपनी अनुसार अलग मुनाफ़ा (Brand-Wise Profit)' : 'Brand-Wise Repair Profit Ranking'}</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {brandEntries.map(([brandName, data]) => (
            <div key={brandName} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrandLogo brand={brandName} size="sm" />
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white block">{brandName}</span>
                  <span className="text-[10px] text-slate-400">{data.count} repairs</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400 block">
                  +₹{data.profit}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Bill ₹{data.revenue}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Itemized Device Repair Profit Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
              {language === 'hi' ? 'प्रति मोबाइल रिपेयर मुनाफ़ा सूची (Job Profit Breakdown)' : 'Device-by-Device Repair Profit Breakdown'}
            </h4>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {filteredJobs.length} Jobs
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3 pl-4">Job Token</th>
                <th className="p-3">Device & Fault</th>
                <th className="p-3">Customer & Tech</th>
                <th className="p-3">Customer Price (A)</th>
                <th className="p-3">Parts / Folder Cost (B)</th>
                <th className="p-3">Separate Profit (A - B)</th>
                <th className="p-3 pr-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No repair jobs recorded for this timeframe.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => {
                  const billed = job.finalCost || job.estimatedCost;
                  const parts = job.partsCost || 0;
                  const profit = billed - parts;
                  const marginPct = billed > 0 ? Math.round((profit / billed) * 100) : 0;

                  return (
                    <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3 pl-4 font-mono font-bold text-amber-600 dark:text-amber-400">
                        {job.id}
                        <span className="block text-[10px] text-slate-400 font-sans">{new Date(job.receivedDate).toLocaleDateString()}</span>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                          <BrandLogo brand={job.deviceBrand} size="sm" />
                          <span>{job.deviceBrand} {job.deviceModel}</span>
                        </div>
                        <p className="line-clamp-1 text-xs text-slate-500 mt-0.5">
                          {job.issueDescription}
                        </p>
                      </td>

                      <td className="p-3">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">{job.customerName}</span>
                        <span className="text-[11px] text-slate-400">Tech: {job.technicianName}</span>
                      </td>

                      <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                        ₹{billed}
                      </td>

                      <td className="p-3 font-mono text-rose-600 dark:text-rose-400">
                        ₹{parts}
                      </td>

                      <td className="p-3">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800">
                          <span className="font-mono font-black text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm">
                            +₹{profit}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-300">
                            ({marginPct}%)
                          </span>
                        </div>
                      </td>

                      <td className="p-3 pr-4 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          job.status === 'ready_for_pickup' || job.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {job.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
