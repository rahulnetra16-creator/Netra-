import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Receipt, 
  Plus, 
  Trash2, 
  Coffee, 
  Building2, 
  Zap, 
  Wrench, 
  Eye, 
  Users, 
  Car, 
  CheckCircle2 
} from 'lucide-react';
import { Expense } from '../../types';

export const DailyExpensesModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    expenses, 
    addExpense, 
    deleteExpense, 
    language 
  } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Expense['category']>('tea_snacks');
  const [amount, setAmount] = useState<number | ''>('');
  const [moduleType, setModuleType] = useState<Expense['moduleType']>('common');
  const [paidVia, setPaidVia] = useState<'cash' | 'upi'>('cash');
  const [paidTo, setPaidTo] = useState('');

  if (activeModal !== 'expense') return null;

  const quickPresets = [
    { titleHi: 'चाय व नाश्ता (स्टाफ व ग्राहक)', titleEn: 'Tea & Refreshment for staff', cat: 'tea_snacks', amt: 60, mod: 'common' },
    { titleHi: 'लोकल ट्रांसपोर्ट / पेट्रोल खर्च', titleEn: 'Local delivery / Petrol conveyance', cat: 'transport', amt: 100, mod: 'common' },
    { titleHi: 'मार्केट से डिस्प्ले फोल्डर खरीद', titleEn: 'Folder display wholesale purchase', cat: 'mobile_parts_purchase', amt: 1450, mod: 'mobile_shop' },
    { titleHi: 'क्लिनिक आई ड्रॉप्स व लेंस खरीद', titleEn: 'Optical lenses & eye drops purchase', cat: 'clinic_supplies', amt: 850, mod: 'clinic' },
    { titleHi: 'दुकान बिजली बिल / इनवर्टर सर्विस', titleEn: 'Shop electricity bill / Inverter repair', cat: 'electricity', amt: 500, mod: 'common' },
    { titleHi: 'टेक्नीशियन दैनिक वेतन / भत्ता', titleEn: 'Daily technician incentive / wages', cat: 'staff_salary', amt: 400, mod: 'mobile_shop' },
  ];

  const handleApplyPreset = (p: typeof quickPresets[0]) => {
    setTitle(language === 'hi' ? p.titleHi : p.titleEn);
    setCategory(p.cat as any);
    setAmount(p.amt);
    setModuleType(p.mod as any);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    addExpense({
      title: title.trim(),
      titleHindi: title.trim(),
      category,
      amount: Number(amount),
      date: new Date().toISOString(),
      moduleType,
      paidVia,
      paidTo: paidTo.trim() || 'Cashier',
    });

    setTitle('');
    setAmount('');
    setPaidTo('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-4 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {language === 'hi' ? 'दैनिक दुकान खर्च (Daily Kharcha)' : 'Daily Shop & Clinic Expenses'}
              </h2>
              <p className="text-xs text-rose-100">
                {language === 'hi' ? 'दैनिक खर्चे दर्ज करें व मुनाफ़े (Profit/Loss) से घटाएं' : 'Record everyday overheads to track exact net profit'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setActiveModal(null)}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Quick Presets */}
          <div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              {language === 'hi' ? 'त्वरित खर्च विकल्प (एक क्लिक में चुनें):' : 'Quick Common Expenses:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickPresets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="text-xs px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium cursor-pointer transition-colors"
                >
                  + {language === 'hi' ? p.titleHi.split('(')[0] : p.titleEn.split('(')[0]} (₹{p.amt})
                </button>
              ))}
            </div>
          </div>

          {/* Add expense form */}
          <form onSubmit={handleSubmit} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'hi' ? 'खर्च का विवरण (Item Name)' : 'Expense Title'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'hi' ? 'उदा. चाय-नाश्ता, टेम्पर्ड ग्लास ट्रांसपोर्ट' : 'e.g. Shop tea, Display folder local transport'}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'hi' ? 'राशि (₹)' : 'Amount (₹)'} *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-bold dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'hi' ? 'श्रेणी' : 'Category'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
                >
                  <option value="tea_snacks">चाय व नाश्ता (Tea/Snacks)</option>
                  <option value="mobile_parts_purchase">मोबाइल पार्ट्स खरीद (Parts)</option>
                  <option value="clinic_supplies">क्लिनिक सामान/दवा (Eye Clinic)</option>
                  <option value="transport">किराया / पेट्रोल (Transport)</option>
                  <option value="electricity">बिजली / इनवर्टर बिल</option>
                  <option value="rent">दुकान किराया (Shop Rent)</option>
                  <option value="staff_salary">स्टाफ वेतन / मजदूरी</option>
                  <option value="other">अन्य फुटकर खर्च</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'hi' ? 'विभाग' : 'Department'}
                </label>
                <select
                  value={moduleType}
                  onChange={(e) => setModuleType(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
                >
                  <option value="common">कॉमन (दुकान व क्लिनिक दोनों)</option>
                  <option value="mobile_shop">मोबाइल शॉप व रिपेयर</option>
                  <option value="clinic">नेत्र क्लिनिक (Eye Clinic)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'hi' ? 'भुगतान माध्यम' : 'Paid Via'}
                </label>
                <select
                  value={paidVia}
                  onChange={(e) => setPaidVia(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
                >
                  <option value="cash">नकद (Cash)</option>
                  <option value="upi">यूपीआई (UPI / PhonePe)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? '+ खर्च जोड़ें (Add Kharcha)' : '+ Save Expense'}</span>
              </button>
            </div>
          </form>

          {/* Today's Expenses List */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              {language === 'hi' ? 'हाल के दैनिक खर्चे (Recent Expense Log):' : 'Recent Expenses Log:'}
            </h3>

            <div className="space-y-2">
              {expenses.length === 0 ? (
                <p className="text-center py-4 text-xs text-slate-400">
                  {language === 'hi' ? 'कोई दैनिक खर्च दर्ज नहीं है।' : 'No expenses recorded yet.'}
                </p>
              ) : (
                expenses.slice(0, 8).map((exp) => (
                  <div key={exp.id} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{exp.title}</span>
                      <span className="text-[11px] text-slate-500">
                        {new Date(exp.date).toLocaleDateString()} • {exp.moduleType.toUpperCase()} • Paid via {exp.paidVia.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-rose-600 dark:text-rose-400 text-sm">
                        -₹{exp.amount}
                      </span>
                      <button
                        onClick={() => deleteExpense(exp.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 rounded"
                        title="Delete Expense"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-end shrink-0">
          <button
            onClick={() => setActiveModal(null)}
            className="px-4 py-1.5 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-xs font-bold"
          >
            {language === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
