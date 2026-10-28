import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Settings, 
  ShieldCheck, 
  Download, 
  Upload, 
  Database, 
  FileText, 
  Users, 
  Wrench, 
  Package, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Copy, 
  Check, 
  HardDrive, 
  Lock, 
  Smartphone,
  Info,
  Calendar,
  Layers
} from 'lucide-react';

export const SettingsBackupModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    language, 
    customers, 
    repairJobs, 
    invoices, 
    inventory, 
    expenses, 
    reminders, 
    shopSettings, 
    updateShopSettings, 
    exportDataJSON, 
    importDataJSON, 
    restorePreRestoreSnapshot, 
    hasPreRestoreSnapshot, 
    resetToSampleData 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'backup' | 'profile' | 'storage'>('backup');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Store settings form state
  const [ownerName, setOwnerName] = useState(shopSettings.ownerName || 'Rahul R Kevat');
  const [shopName, setShopName] = useState(shopSettings.shopName || 'Netra Mobile Center');
  const [phone, setPhone] = useState(shopSettings.phone || '9699962396');
  const [email, setEmail] = useState(shopSettings.email || 'drmobile9696@gmail.com');
  const [address, setAddress] = useState(shopSettings.address || 'Station Road, Opp. Old Bus Stand, Netra Mobile Center');
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Import / Restore inspection state
  const [selectedFileContent, setSelectedFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [inspectedData, setInspectedData] = useState<{
    exportDate?: string;
    customersCount: number;
    repairsCount: number;
    invoicesCount: number;
    inventoryCount: number;
    expensesCount: number;
    storeName?: string;
  } | null>(null);
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('replace');
  const [restoreStatus, setRestoreStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedJSON, setCopiedJSON] = useState(false);

  if (activeModal !== 'settings' && activeModal !== 'backup') {
    return null;
  }

  const handleClose = () => {
    setActiveModal(null);
    setSelectedFileContent(null);
    setInspectedData(null);
    setRestoreStatus(null);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateShopSettings({
      ownerName: ownerName.trim(),
      shopName: shopName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  // Inspect the JSON file before importing
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setRestoreStatus(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (!parsed || typeof parsed !== 'object') {
          setRestoreStatus({
            success: false,
            message: language === 'hi' ? 'अमान्य फ़ाइल: यह वैध JSON फ़ाइल नहीं है।' : 'Invalid file: Not a valid JSON structure.'
          });
          return;
        }

        setSelectedFileContent(content);
        setInspectedData({
          exportDate: parsed.exportDate,
          customersCount: Array.isArray(parsed.customers) ? parsed.customers.length : 0,
          repairsCount: Array.isArray(parsed.repairJobs) ? parsed.repairJobs.length : 0,
          invoicesCount: Array.isArray(parsed.invoices) ? parsed.invoices.length : 0,
          inventoryCount: Array.isArray(parsed.inventory) ? parsed.inventory.length : 0,
          expensesCount: Array.isArray(parsed.expenses) ? parsed.expenses.length : 0,
          storeName: parsed.shopSettings?.shopName || 'Netra Mobile Center',
        });
      } catch (err) {
        setRestoreStatus({
          success: false,
          message: language === 'hi' ? 'फ़ाइल पढ़ने में त्रुटि: कृपया सही JSON बैकअप चुनें।' : 'Error parsing file: Please choose a valid JSON backup file.'
        });
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteRestore = () => {
    if (!selectedFileContent) return;

    const result = importDataJSON(selectedFileContent, importMode);
    if (result.success) {
      setRestoreStatus({
        success: true,
        message: language === 'hi' 
          ? `बैकअप सफलतापूर्वक रिस्टोर हो गया! (${result.stats?.customers || 0} ग्राहक, ${result.stats?.repairs || 0} रिपेयर, ${result.stats?.invoices || 0} बिल)` 
          : `Backup restored successfully! (${result.stats?.customers || 0} customers, ${result.stats?.repairs || 0} repairs, ${result.stats?.invoices || 0} invoices)`
      });
      setSelectedFileContent(null);
      setInspectedData(null);
    } else {
      setRestoreStatus({
        success: false,
        message: result.error || (language === 'hi' ? 'डेटा रिस्टोर विफल रहा।' : 'Data restore failed.')
      });
    }
  };

  const handleUndoRestore = () => {
    if (window.confirm(language === 'hi' ? 'क्या आप अंतिम रिस्टोर को पूर्ववत (Undo) करके पिछला डेटा वापस लाना चाहते हैं?' : 'Revert last restore and bring back pre-restore data?')) {
      const ok = restorePreRestoreSnapshot();
      if (ok) {
        setRestoreStatus({
          success: true,
          message: language === 'hi' ? 'पूर्ववत सफल! पिछला डेटा वापस लोड हो गया।' : 'Rollback successful! Pre-restore snapshot loaded.'
        });
      }
    }
  };

  const handleCopyBackupJSON = () => {
    const fullBackup = {
      shopSettings,
      customers,
      repairJobs,
      inventory,
      invoices,
      expenses,
      reminders,
      exportDate: new Date().toISOString(),
      version: '2.1.0',
    };
    navigator.clipboard.writeText(JSON.stringify(fullBackup, null, 2));
    setCopiedJSON(true);
    setTimeout(() => setCopiedJSON(false), 2500);
  };

  // Rough estimation of LocalStorage size
  const getStorageSizeKB = () => {
    try {
      let total = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += (localStorage[key].length + key.length) * 2;
        }
      }
      return (total / 1024).toFixed(1);
    } catch {
      return '0';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh] text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 border-b border-purple-800/40 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30 shadow-md">
              <ShieldCheck className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">
                  {language === 'hi' ? 'सेटिंग्स एवं डेटा बैकअप उपयोगिता' : 'Settings & Data Backup Utility'}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30 font-bold uppercase">
                  JSON Security
                </span>
              </div>
              <p className="text-xs text-purple-200/80">
                {language === 'hi'
                  ? 'ग्राहक विवरण, रिपेयरिंग जॉब कार्ड व बिलिंग डेटा का सुरक्षित बैकअप व रिस्टोर।'
                  : 'Export and restore complete CRM, repairs, inventory, and billing data securely.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-4 pt-2 bg-slate-950/80 border-b border-slate-800 text-xs font-semibold gap-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('backup')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'backup'
                ? 'border-purple-400 text-purple-300 font-bold bg-purple-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? '1. डेटा बैकअप व रिस्टोर' : '1. Backup & Restore (JSON)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-purple-400 text-purple-300 font-bold bg-purple-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? '2. दुकान व बिलिंग प्रोफ़ाइल' : '2. Shop & Receipt Profile'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('storage')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'storage'
                ? 'border-purple-400 text-purple-300 font-bold bg-purple-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? '3. स्टोरेज व सिस्टम सुरक्षा' : '3. Storage & Security Status'}</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* TAB 1: BACKUP & RESTORE UTILITY */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              
              {/* Status Message */}
              {restoreStatus && (
                <div className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-3 animate-in fade-in duration-150 ${
                  restoreStatus.success
                    ? 'bg-emerald-950/70 text-emerald-200 border-emerald-500/40'
                    : 'bg-rose-950/70 text-rose-200 border-rose-500/40'
                }`}>
                  <div className="flex items-center gap-2">
                    {restoreStatus.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    )}
                    <span>{restoreStatus.message}</span>
                  </div>
                  <button
                    onClick={() => setRestoreStatus(null)}
                    className="text-xs text-slate-400 hover:text-white px-1.5"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* CARD 1: EXPORT UTILITY */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/70 border border-slate-750 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-300 flex items-center justify-center border border-purple-500/30">
                      <Download className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-100 text-sm sm:text-base">
                        {language === 'hi' ? 'डेटा बैकअप डाउनलोड करें (.JSON Export)' : 'Export Application Data (.JSON Backup)'}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {language === 'hi'
                          ? 'सभी ग्राहकों, रिपेयरिंग जॉब्स, इन्वेंटरी, खर्च व बिलिंग का एन्क्रिप्टेड JSON बैकअप डाउनलोड करें।'
                          : 'Download complete application database as a portable JSON file for offline safekeeping.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleCopyBackupJSON}
                      title="Copy complete JSON backup to clipboard"
                      className="p-2 rounded-xl bg-slate-700 hover:bg-slate-650 text-slate-200 text-xs font-bold transition-colors cursor-pointer border border-slate-600 flex items-center gap-1.5"
                    >
                      {copiedJSON ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
                      <span className="hidden sm:inline">{copiedJSON ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={exportDataJSON}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-purple-950/40 cursor-pointer transition-transform hover:scale-102"
                    >
                      <Download className="w-4 h-4 stroke-[2.5]" />
                      <span>{language === 'hi' ? 'JSON बैकअप डाउनलोड करें' : 'Download JSON Backup'}</span>
                    </button>
                  </div>
                </div>

                {/* Live Breakdown Badges */}
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/80">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    {language === 'hi' ? 'इस बैकअप में सुरक्षित डेटा विवरण:' : 'Data Protected in this Backup File:'}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                      <Users className="w-4 h-4 text-cyan-400" />
                      <div>
                        <span className="text-slate-400 text-[10px] block">{language === 'hi' ? 'ग्राहक (CRM)' : 'Customers'}</span>
                        <span className="font-bold text-white font-mono">{customers.length}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                      <Wrench className="w-4 h-4 text-amber-400" />
                      <div>
                        <span className="text-slate-400 text-[10px] block">{language === 'hi' ? 'रिपेयर जॉब कार्ड' : 'Repair Jobs'}</span>
                        <span className="font-bold text-white font-mono">{repairJobs.length}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                      <FileText className="w-4 h-4 text-purple-400" />
                      <div>
                        <span className="text-slate-400 text-[10px] block">{language === 'hi' ? 'बिल व इनवॉइस' : 'Invoices & Bills'}</span>
                        <span className="font-bold text-white font-mono">{invoices.length}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                      <Package className="w-4 h-4 text-emerald-400" />
                      <div>
                        <span className="text-slate-400 text-[10px] block">{language === 'hi' ? 'स्टॉक इन्वेंटरी' : 'Stock Items'}</span>
                        <span className="font-bold text-white font-mono">{inventory.length}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                      <DollarSign className="w-4 h-4 text-rose-400" />
                      <div>
                        <span className="text-slate-400 text-[10px] block">{language === 'hi' ? 'दैनिक खर्चे' : 'Expenses Log'}</span>
                        <span className="font-bold text-white font-mono">{expenses.length}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                      <Lock className="w-4 h-4 text-teal-400" />
                      <div>
                        <span className="text-slate-400 text-[10px] block">{language === 'hi' ? 'दुकान कॉन्फिग' : 'Shop Settings'}</span>
                        <span className="font-bold text-teal-300 font-mono text-[11px] truncate">9699962396</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: RESTORE UTILITY */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/70 border border-slate-750 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-300 flex items-center justify-center border border-cyan-500/30">
                    <Upload className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-100 text-sm sm:text-base">
                      {language === 'hi' ? 'बैकअप फ़ाइल से डेटा रिस्टोर करें (.JSON Import)' : 'Restore Data from JSON Backup (.JSON Import)'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {language === 'hi'
                        ? 'पूर्व में ली गई .JSON बैकअप फ़ाइल चुनें। रिस्टोर करने से पहले सुरक्षा निरीक्षण किया जाएगा।'
                        : 'Select a previously saved .JSON backup file to restore your database with safety validation.'}
                    </p>
                  </div>
                </div>

                {/* Upload Trigger Area */}
                {!inspectedData ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-2xl p-6 text-center bg-slate-900/60 hover:bg-slate-900 transition-colors cursor-pointer space-y-2 group"
                  >
                    <Upload className="w-8 h-8 text-slate-500 group-hover:text-cyan-400 mx-auto transition-colors" />
                    <div>
                      <span className="font-bold text-slate-200 text-sm block">
                        {language === 'hi' ? 'JSON बैकअप फ़ाइल चुनने के लिए यहाँ क्लिक करें' : 'Click or drop JSON backup file here'}
                      </span>
                      <span className="text-slate-400 text-xs mt-0.5 block">
                        Supported file format: <span className="font-mono text-cyan-300">.json</span> (Netra Mobile Center Backup)
                      </span>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                ) : (
                  /* Pre-Restore Inspection Screen */
                  <div className="p-4 bg-slate-900 rounded-2xl border-2 border-cyan-500/40 space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                        <div>
                          <span className="font-bold text-white text-xs sm:text-sm block">
                            {language === 'hi' ? 'वैध बैकअप फ़ाइल का पता चला:' : 'Valid Backup File Detected:'} {fileName}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {inspectedData.exportDate
                              ? `Backup Created: ${new Date(inspectedData.exportDate).toLocaleString()}`
                              : 'Standard Netra Mobile Center Backup File'}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFileContent(null);
                          setInspectedData(null);
                        }}
                        className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
                      >
                        {language === 'hi' ? 'रद्द करें' : 'Change File'}
                      </button>
                    </div>

                    {/* Content inside this backup */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2 rounded bg-slate-800/80 border border-slate-700">
                        <span className="text-slate-400 text-[10px] block">Customers:</span>
                        <strong className="text-white font-mono">{inspectedData.customersCount} records</strong>
                      </div>
                      <div className="p-2 rounded bg-slate-800/80 border border-slate-700">
                        <span className="text-slate-400 text-[10px] block">Repairs:</span>
                        <strong className="text-white font-mono">{inspectedData.repairsCount} jobs</strong>
                      </div>
                      <div className="p-2 rounded bg-slate-800/80 border border-slate-700">
                        <span className="text-slate-400 text-[10px] block">Invoices:</span>
                        <strong className="text-white font-mono">{inspectedData.invoicesCount} bills</strong>
                      </div>
                      <div className="p-2 rounded bg-slate-800/80 border border-slate-700">
                        <span className="text-slate-400 text-[10px] block">Inventory:</span>
                        <strong className="text-white font-mono">{inspectedData.inventoryCount} items</strong>
                      </div>
                    </div>

                    {/* Restore Mode Selector */}
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-slate-300 block">
                        {language === 'hi' ? 'रिस्टोर का तरीका चुनें:' : 'Select Restore Method:'}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                          importMode === 'replace'
                            ? 'bg-purple-950/40 border-purple-500 text-purple-200'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                        }`}>
                          <input
                            type="radio"
                            name="restore_mode"
                            checked={importMode === 'replace'}
                            onChange={() => setImportMode('replace')}
                            className="mt-0.5 text-purple-600 focus:ring-0"
                          />
                          <div>
                            <span className="font-bold block text-slate-100">
                              {language === 'hi' ? 'पूर्ण रिप्लेस (Clean Overwrite)' : 'Clean Overwrite (Recommended)'}
                            </span>
                            <span className="text-[11px] text-slate-400 mt-0.5 block">
                              {language === 'hi' ? 'डेटाबेस को बैकअप फ़ाइल से पूरी तरह बदलें।' : 'Replaces current data completely with backup.'}
                            </span>
                          </div>
                        </label>

                        <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                          importMode === 'merge'
                            ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                        }`}>
                          <input
                            type="radio"
                            name="restore_mode"
                            checked={importMode === 'merge'}
                            onChange={() => setImportMode('merge')}
                            className="mt-0.5 text-cyan-600 focus:ring-0"
                          />
                          <div>
                            <span className="font-bold block text-slate-100">
                              {language === 'hi' ? 'डेटा मिलाएँ (Merge & Append)' : 'Merge & Append'}
                            </span>
                            <span className="text-[11px] text-slate-400 mt-0.5 block">
                              {language === 'hi' ? 'वर्तमान रिकॉर्ड्स रखेगा और नए रिकॉर्ड्स जोड़ देगा।' : 'Keeps existing records and adds new ones.'}
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFileContent(null);
                          setInspectedData(null);
                        }}
                        className="px-3.5 py-2 text-xs rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                      >
                        {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                      </button>

                      <button
                        type="button"
                        onClick={handleExecuteRestore}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-md cursor-pointer transition-transform"
                      >
                        ✓ {language === 'hi' ? 'बैकअप रिस्टोर लागू करें' : 'Confirm & Restore Data'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Safety Rollback Snapshot Button */}
                {hasPreRestoreSnapshot && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-amber-300">
                      <RotateCcw className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>
                        {language === 'hi'
                          ? 'सुरक्षा स्नैपशॉट उपलब्ध है: यदि आपने गलत बैकअप रिस्टोर कर दिया है तो आप पिछला डेटा वापस ला सकते हैं।'
                          : 'Safety snapshot available: Rollback to your data prior to the last restore.'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleUndoRestore}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black whitespace-nowrap cursor-pointer transition-colors"
                    >
                      {language === 'hi' ? 'पिछला डेटा वापस लाएँ (Undo)' : 'Undo Restore'}
                    </button>
                  </div>
                )}
              </div>

              {/* CARD 3: DEMO SAMPLE DATA RESET */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-300 block">
                    {language === 'hi' ? 'डेमो डेटा रीसेट (Testing Reset)' : 'Factory Sample Data Reset'}
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {language === 'hi' 
                      ? 'यदि आप ऐप को शुरुआती डेमो डेटा पर रीसेट करना चाहते हैं।' 
                      : 'Reset customers, repairs, and inventory back to default sample records.'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(language === 'hi' ? 'क्या आप सभी ग्राहकों, रिपेयरिंग व बिलिंग को शुरुआती डेमो डेटा पर रीसेट करना चाहते हैं?' : 'Reset all data back to factory demo state? This will clear recent additions.')) {
                      resetToSampleData();
                      setRestoreStatus({
                        success: true,
                        message: language === 'hi' ? 'डेमो डेटा सफलतापूर्वक रीसेट किया गया।' : 'Reset to sample demo data complete.'
                      });
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-400 border border-slate-700 text-xs font-semibold cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
                  <span>{language === 'hi' ? 'डेमो डेटा पर रीसेट करें' : 'Reset Demo Data'}</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: SHOP PROFILE & RECEIPT SETTINGS */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-xs text-purple-200 flex items-center gap-2">
                <Info className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>
                  {language === 'hi'
                    ? 'यहाँ दर्ज विवरण सभी रिपेयर जॉब कार्ड, बिलिंग रसीद एवं व्हाट्सएप संदेशों पर स्वचालित रूप से छपेगा।'
                    : 'These details are automatically printed on repair job cards, tax invoices, and WhatsApp receipts.'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {language === 'hi' ? 'दुकान का नाम (Shop Name)' : 'Shop Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {language === 'hi' ? 'मालिक / प्रोप्राइटर का नाम' : 'Proprietor / Master Tech Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {language === 'hi' ? 'दुकान हेल्पलाइन / व्हाट्सएप मोबाइल' : 'Store Phone / WhatsApp Helpline'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono font-bold focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {language === 'hi' ? 'ईमेल पता (Email Address)' : 'Official Email Address'}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono focus:border-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {language === 'hi' ? 'दुकान का पूरा पता (Full Store Address on Bills)' : 'Full Store Address on Receipts'}
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                {settingsSaved ? (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    {language === 'hi' ? 'सेटिंग्स सुरक्षित रूप से सहेजी गईं!' : 'Settings saved successfully!'}
                  </span>
                ) : <span />}

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs sm:text-sm shadow-md cursor-pointer transition-transform"
                >
                  {language === 'hi' ? 'सेटिंग्स सहेजें' : 'Save Profile Settings'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: SYSTEM STORAGE & DATA SECURITY */}
          {activeTab === 'storage' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <span className="text-slate-400 text-[11px] block">{language === 'hi' ? 'लोकल स्टोरेज उपयोग' : 'Offline Storage Used'}</span>
                  <div className="text-lg font-black font-mono text-cyan-400">~{getStorageSizeKB()} KB</div>
                  <span className="text-[10px] text-slate-500">Fast client-side cache</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <span className="text-slate-400 text-[11px] block">{language === 'hi' ? 'सुरक्षा स्थिति' : 'Security Status'}</span>
                  <div className="text-lg font-black text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>Protected</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Zero cloud leakage</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <span className="text-slate-400 text-[11px] block">{language === 'hi' ? 'ऐप संस्करण' : 'App Version'}</span>
                  <div className="text-lg font-black text-purple-300 font-mono">v2.1.0</div>
                  <span className="text-[10px] text-slate-500">PWA & APK Ready</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-200 text-xs flex items-center gap-2">
                  <Lock className="w-4 h-4 text-teal-400" />
                  <span>{language === 'hi' ? 'डेटा गोपनीयता एवं सुरक्षा प्रतिबद्धता' : 'Data Privacy & Security Guarantee'}</span>
                </h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {language === 'hi'
                    ? 'नेत्रा मोबाइल सेंटर का समस्त डेटा (ग्राहकों के मोबाइल नंबर, रिपेयरिंग जॉब्स, पार्ट्स की लागत एवं बिलिंग) केवल आपके ब्राउज़र एवं डिवाइस में स्थानीय रूप से सुरक्षित रहता है। नियमित रूप से JSON बैकअप डाउनलोड करके आप डेटा को पेनड्राइव, गूगल ड्राइव या अन्य फोन में सुरक्षित रख सकते हैं।'
                    : 'All customer contacts, repair jobs, margins, and sales invoices reside locally in your browser storage. Downloading regular JSON backups allows you to securely transfer and restore your database across laptops, tablets, and Android smartphones at any time.'}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono text-[11px]">
            Netra Mobile Center • Prop. Rahul R Kevat (9699962396)
          </span>

          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors cursor-pointer"
          >
            {language === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
