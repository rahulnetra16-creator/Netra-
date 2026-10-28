import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  Download, 
  Upload, 
  RotateCcw, 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  Share2, 
  CheckCircle, 
  Eye, 
  Smartphone, 
  Settings,
  Phone,
  Receipt,
  BarChart3
} from 'lucide-react';
import { ProfitLossView } from '../expenses/ProfitLossView';
import { SalesAndRepairsChart } from './SalesAndRepairsChart';

export const ReportsView: React.FC = () => {
  const { 
    t, 
    language, 
    invoices, 
    patients, 
    repairJobs, 
    inventory,
    expenses,
    shopSettings, 
    updateShopSettings, 
    exportDataJSON, 
    importDataJSON, 
    resetToSampleData, 
    openNotificationModal,
    setSelectedInvoiceToView,
    setActiveModal 
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profit_loss' | 'charts' | 'khata' | 'settings'>('profit_loss');

  // Settings edit state
  const [ownerName, setOwnerName] = useState(shopSettings.ownerName || 'Rahul R Kevat');
  const [email, setEmail] = useState(shopSettings.email || 'drmobile9696@gmail.com');
  const [phone, setPhone] = useState(shopSettings.phone);
  const [doctorName, setDoctorName] = useState(shopSettings.doctorName);
  const [address, setAddress] = useState(shopSettings.address);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Calculations
  const totalSales = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalCollected = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalDues = invoices.reduce((sum, inv) => sum + inv.dueAmount, 0);

  const clinicInvoices = invoices.filter(i => i.moduleType === 'clinic');
  const shopInvoices = invoices.filter(i => i.moduleType !== 'clinic');

  const clinicTotal = clinicInvoices.reduce((sum, i) => sum + i.paidAmount, 0);
  const shopTotal = shopInvoices.reduce((sum, i) => sum + i.paidAmount, 0);

  // Pending Khata list
  const pendingInvoices = invoices.filter(i => i.dueAmount > 0);

  const handleSendReminder = (inv: (typeof invoices)[0]) => {
    const msg = language === 'hi'
      ? `नमस्ते ${inv.customerName} जी! नेत्र मोबाइल सेंटर से आपका पिछला बिल #${inv.invoiceNumber} का बकाया ₹${inv.dueAmount} बाकी है। कृपया सुविधा अनुसार भुगतान करें। संपर्क: राहुल आर. केवट (${shopSettings.phone})`
      : `Dear ${inv.customerName}, gentle reminder from Netra Mobile Center. Pending balance for bill #${inv.invoiceNumber} is Rs.${inv.dueAmount}. Please clear at convenience. Contact: Rahul R Kevat (${shopSettings.phone})`;

    openNotificationModal({
      title: language === 'hi' ? 'उधार तकादा संदेश (WhatsApp)' : 'Payment Due Reminder',
      text: msg,
      recipientPhone: inv.customerPhone,
      type: 'whatsapp'
    });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateShopSettings({
      ownerName,
      email,
      phone,
      doctorName,
      address
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = importDataJSON(content);
      if (result.success) {
        setImportStatus(language === 'hi' 
          ? `डेटा बैकअप सफलतापूर्वक रिस्टोर हो गया! (${result.stats?.customers || 0} ग्राहक, ${result.stats?.repairs || 0} रिपेयर, ${result.stats?.invoices || 0} बिल)` 
          : `Backup restored successfully! (${result.stats?.customers || 0} customers, ${result.stats?.repairs || 0} repairs, ${result.stats?.invoices || 0} invoices)`);
      } else {
        setImportStatus(result.error || (language === 'hi' ? 'बैकअप JSON पढ़ने में विफल।' : 'Failed to parse backup JSON file.'));
      }
      setTimeout(() => setImportStatus(null), 3500);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 rounded-2xl p-5 sm:p-6 text-white border border-purple-800/40 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40">
            {language === 'hi' ? 'लेखा-जोखा व खाता' : 'Financial Ledger & Profit/Loss'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black mt-1">
            {language === 'hi' ? 'नफा-नुकसान, दैनिक खर्च व बाकी खाता' : 'Profit & Loss, Daily Kharcha & Credit Ledger'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {language === 'hi' 
              ? 'दैनिक आमदनी, सामान लागत, रोज़ के खर्चे और शुद्ध मुनाफ़े का पूरा हिसाब।'
              : 'Daily collections, parts costs, everyday expenses, and net profit ledger.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveModal('expense')}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs sm:text-sm shadow-lg transition-all cursor-pointer"
          >
            <Receipt className="w-4 h-4" />
            <span>{language === 'hi' ? '+ दैनिक खर्च' : '+ Daily Kharcha'}</span>
          </button>
          <button
            onClick={exportDataJSON}
            data-testid="local-data-export-btn"
            title="Download local application data (Clinic and Shop records) as a JSON file for manual backup"
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/25 transition-all cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Local Data Export</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs Bar */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('profit_loss')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'profit_loss'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>{language === 'hi' ? 'नफा-नुकसान व दैनिक खर्च (Profit & Loss)' : 'Profit & Loss & Daily Kharcha'}</span>
        </button>

        <button
          onClick={() => setActiveTab('charts')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'charts'
              ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400 bg-cyan-500/5'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>{language === 'hi' ? 'बिक्री व रिपेयर रुझान (Analytics)' : 'Sales & Repair Volume Trends'}</span>
        </button>

        <button
          onClick={() => setActiveTab('khata')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'khata'
              ? 'border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-500/5'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{language === 'hi' ? 'उधार खाता (Pending Khata)' : 'Customer Credit Ledger'}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 font-bold">
            {pendingInvoices.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-500/5'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>{language === 'hi' ? 'दुकान सेटिंग्स व बैकअप' : 'Settings & Data Backup'}</span>
        </button>
      </div>

      {/* Render based on activeTab */}
      {activeTab === 'profit_loss' && (
        <ProfitLossView />
      )}

      {activeTab === 'charts' && (
        <SalesAndRepairsChart />
      )}

      {activeTab === 'khata' && (
        <>
          {/* Financial Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Total Billed</span>
              <span className="text-xl font-black text-slate-900 dark:text-white block mt-1">
                ₹{totalSales.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-400">{invoices.length} Total Invoices</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 block font-medium">Eye Clinic Collected</span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 block mt-1">
                ₹{clinicTotal.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-400">{clinicInvoices.length} Consultations</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-amber-600 dark:text-amber-400 block font-medium">Shop & Repairs Collected</span>
              <span className="text-xl font-black text-amber-600 dark:text-amber-400 block mt-1">
                ₹{shopTotal.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-400">{shopInvoices.length} Retail & Repair sales</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-red-500 block font-medium">Total Pending Udhaar</span>
              <span className="text-xl font-black text-red-600 dark:text-red-400 block mt-1">
                ₹{totalDues.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-red-500 font-semibold">{pendingInvoices.length} unpaid / partial bills</span>
            </div>
          </div>

          {/* Pending Khata Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {t.pendingCustomers}
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                  {pendingInvoices.length} Pending
                </span>
              </div>
            </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3 pl-4">Invoice #</th>
                <th className="p-3">Customer & Phone</th>
                <th className="p-3">Department</th>
                <th className="p-3">Total Billed</th>
                <th className="p-3">Paid Amount</th>
                <th className="p-3">Balance Due</th>
                <th className="p-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {pendingInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    {language === 'hi' ? 'कोई बकाया खाता नहीं है - सभी भुगतान प्राप्त हैं!' : 'No pending dues - all invoices cleared!'}
                  </td>
                </tr>
              ) : (
                pendingInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 pl-4 font-mono font-bold text-slate-900 dark:text-white">
                      {inv.invoiceNumber}
                      <span className="block text-[10px] text-slate-400 font-sans">{new Date(inv.date).toLocaleDateString()}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-slate-900 dark:text-white block">{inv.customerName}</span>
                      <span className="font-mono text-xs text-slate-500">{inv.customerPhone}</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {inv.moduleType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 font-mono">₹{inv.grandTotal}</td>
                    <td className="p-3 font-mono text-emerald-600">₹{inv.paidAmount}</td>
                    <td className="p-3 font-mono font-black text-red-600">₹{inv.dueAmount}</td>
                    <td className="p-3 pr-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleSendReminder(inv)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>WhatsApp Reminder</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedInvoiceToView(inv);
                            setActiveModal('viewInvoice');
                          }}
                          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold"
                        >
                          View Bill
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )}

  {/* Settings & Data Backup Section */}
  {activeTab === 'settings' && (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Store Settings Form */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Settings className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              {language === 'hi' ? 'दुकान एवं क्लिनिक सेटिंग्स' : 'Store & Clinic Information'}
            </h3>
          </div>
          <form onSubmit={handleSaveSettings} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'hi' ? 'दुकान संचालक / मालिक का नाम' : 'App & Store Owner / Proprietor Name'}
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Rahul R Kevat"
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'hi' ? 'ईमेल आईडी' : 'Email Address'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="drmobile9696@gmail.com"
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'hi' ? 'डॉक्टर / ऑप्टोमेट्रिस्ट का नाम' : 'Doctor / Optometrist Name'}
              </label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'hi' ? 'दुकान फोन / व्हाट्सएप नंबर' : 'Store Phone / WhatsApp'}
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'hi' ? 'दुकान का पता (बिल पर प्रिंट हेतु)' : 'Address (Printed on bills & Rx)'}
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
              />
            </div>
            <div className="flex justify-between items-center pt-2">
              {settingsSaved && (
                <span className="text-xs text-emerald-600 font-semibold">✓ Settings saved!</span>
              )}
              <div className="ml-auto">
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Data Backup & Restore */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Download className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Local Data Export & Backup (स्थानीय डेटा बैकअप)
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              {language === 'hi'
                ? 'मैनुअल बैकअप के लिए अपने सभी लोकल रिकॉर्ड्स (क्लिनिक व मोबाइल शॉप डेटा, रिपेयर, इन्वेंटरी, खर्च व बिल) JSON फ़ाइल में डाउनलोड करें।'
                : 'Download all local application data (Clinic and Shop records, Repairs, Inventory, Invoices, Expenses) as a JSON file for manual backup.'}
            </p>

            <div className="bg-slate-100 dark:bg-slate-800/70 p-3 rounded-xl mb-3 text-xs space-y-1">
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Data included in JSON backup:
              </span>
              <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600 dark:text-slate-400">
                <span>• {repairJobs.length} Repair Job Cards</span>
                <span>• {inventory.length} Stock Items</span>
                <span>• {invoices.length} Invoices & Bills</span>
                <span>• {expenses.length} Expense Logs</span>
                <span>• {patients.length} Clinic Archive Records</span>
                <span>• Store & Owner Config</span>
              </div>
            </div>

            {importStatus && (
              <div className="p-2.5 mb-3 bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 text-xs rounded-xl border border-teal-300">
                {importStatus}
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex gap-2">
              <button
                onClick={exportDataJSON}
                data-testid="local-data-export-btn-card"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Local Data Export</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>Restore Backup</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <button
              onClick={() => setActiveModal('settings')}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold rounded-xl cursor-pointer transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-purple-400" />
              <span>{language === 'hi' ? 'उन्नत बैकअप व रिस्टोर केंद्र खोलें →' : 'Open Advanced Backup & Security Center →'}</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset all patients, repairs, and billing to initial demo sample data?')) {
                  resetToSampleData();
                }
              }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] text-slate-400 hover:text-red-500 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t.resetDemoData}</span>
            </button>
          </div>
        </div>

        {/* Android App APK Download & Distribution Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-emerald-500/30 dark:border-emerald-500/30 p-5 shadow-sm flex flex-col justify-between sm:col-span-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <span>{language === 'hi' ? 'एंड्रॉइड ऐप व APK फ़ाइल केंद्र' : 'Android App & Standalone APK Hub'}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    WebAPK / APK
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {language === 'hi' 
                    ? 'दुकान के फोन या कर्मचारियों के मोबाइल में ऐप इंस्टॉल करें या स्टैंडअलोन .APK फ़ाइल बनाएं।' 
                    : 'Install app directly on shop devices or generate signed .APK package for offline distribution.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveModal('apk')}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-emerald-950/40 cursor-pointer transition-transform"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>{language === 'hi' ? 'APK डाउनलोड व QR केंद्र खोलें' : 'Open APK Download & QR Hub'}</span>
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
};
