import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Smartphone, 
  Wrench, 
  Phone, 
  User, 
  CheckCircle2, 
  Printer, 
  MessageSquare, 
  DollarSign,
  AlertTriangle,
  FileText,
  Calendar,
  Clock,
  ShieldCheck,
  Tag,
  Scissors,
  Share2,
  Send,
  Check,
  Copy
} from 'lucide-react';
import { RepairJob } from '../../types';
import { BrandLogo, mobileBrandsList } from '../brandLogos';

export const RepairJobCardModal: React.FC = () => {
  const { 
    t, 
    language, 
    activeModal, 
    setActiveModal, 
    addRepairJob, 
    shopSettings, 
    openNotificationModal,
    customers 
  } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [deviceBrand, setDeviceBrand] = useState('Redmi');
  const [deviceModel, setDeviceModel] = useState('');
  const [imeiOrSerial, setImeiOrSerial] = useState('');
  const [passcodePattern, setPasscodePattern] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [conditionNotes, setConditionNotes] = useState('');
  const [estimatedCost, setEstimatedCost] = useState<number | ''>(1200);
  const [partsCost, setPartsCost] = useState<number | ''>(650);
  const [advancePaid, setAdvancePaid] = useState<number | ''>(500);
  const [technicianName, setTechnicianName] = useState('Rahul R Kevat (Proprietor)');
  const [promisedHours, setPromisedHours] = useState('4');

  // Preview / Receipt Mode
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  // Post submit
  const [createdJob, setCreatedJob] = useState<RepairJob | null>(null);

  if (activeModal !== 'repair') return null;

  const commonFaultPills = [
    { en: 'Display / Touch Glass Broken', hi: 'डिस्प्ले व टच टूटा हुआ' },
    { en: 'Charging Jack / Port damaged', hi: 'चार्जिंग जैक खराब / चार्ज नहीं हो रहा' },
    { en: 'Battery draining fast / swollen', hi: 'बैटरी बैकअप कम / फूल गई' },
    { en: 'Water / Liquid damage', hi: 'पानी में गिरा हुआ (Liquid Damage)' },
    { en: 'Dead / No power on', hi: 'मोबाइल ऑन नहीं हो रहा (Dead)' },
    { en: 'Speaker / Mic distorted', hi: 'आवाज नहीं जा रही / स्पीकर खराब' },
    { en: 'Network / SIM not detected', hi: 'नेटवर्क / सिम नहीं पकड़ रहा' },
    { en: 'FRP / Lock / Software update', hi: 'सॉफ्टवेयर लॉक / रीस्टार्ट प्रॉब्लम' },
  ];

  const brands = ['Redmi / Xiaomi', 'Samsung', 'Vivo', 'Realme', 'Oppo', 'OnePlus', 'Apple iPhone', 'Motorola', 'Infinix / Tecno', 'Poco', 'Other'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !deviceModel.trim() || !issueDescription.trim()) {
      return;
    }

    const est = Number(estimatedCost) || 0;
    const parts = Number(partsCost) || 0;
    const adv = Number(advancePaid) || 0;
    const profit = Math.max(0, est - parts);

    const promisedTime = new Date(Date.now() + Number(promisedHours) * 60 * 60 * 1000).toISOString();

    const job = addRepairJob({
      customerName: customerName.trim(),
      phone: phone.trim(),
      deviceBrand,
      deviceModel: deviceModel.trim(),
      imeiOrSerial: imeiOrSerial.trim(),
      passcodePattern: passcodePattern.trim(),
      issueDescription: issueDescription.trim(),
      conditionNotes: conditionNotes.trim() || 'Received with normal usage marks',
      estimatedCost: est,
      partsCost: parts,
      repairProfit: profit,
      advancePaid: adv,
      status: 'received',
      promisedDate: promisedTime,
      technicianName,
      paymentMode: adv > 0 ? 'cash' : 'khata',
    });

    setCreatedJob(job);
    setShowReceiptPreview(true);
  };

  const handlePrintSlip = () => {
    window.print();
  };

  const formatRepairWhatsAppMessage = (job: RepairJob) => {
    const balance = Math.max(0, job.estimatedCost - job.advancePaid);
    const dateFormatted = new Date(job.receivedDate).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    const promisedFormatted = job.promisedDate ? new Date(job.promisedDate).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }) : 'Within 4-24 hrs';

    return language === 'hi'
      ? `*📱 मोबाइल नेत्रा रिपेयरिंग - रिपेयर जॉब कार्ड*
━━━━━━━━━━━━━━━━━━━━
*टोकन नं:* ${job.id}
*दिनांक:* ${dateFormatted}
*ग्राहक:* ${job.customerName} (${job.phone})
*मॉडल:* ${job.deviceBrand} ${job.deviceModel}
*आईएमईआई/सीरियल:* ${job.imeiOrSerial || 'जांच में'}
*खराबी/समस्या:* ${job.issueDescription}
*फोन की स्थिति:* ${job.conditionNotes || 'सामान्य स्क्रैच'}

💰 *खर्च व भुगतान विवरण:*
• अनुमानित लागत: ₹${job.estimatedCost}
• जमा अग्रिम (Advance): ₹${job.advancePaid}
• *बाकी राशि (Balance Due): ₹${balance}*
• अपेक्षित डिलीवरी: ${promisedFormatted}

⚠️ *नियम व शर्तें:*
1. 30 दिनों के भीतर फोन प्राप्त न करने पर दुकान की जिम्मेदारी नहीं होगी।
2. वाटर डैमेज / डेड फोन में रिस्क ग्राहक का होगा।
3. डिलीवरी के समय यह डिजिटल रसीद या टोकन दिखाना अनिवार्य है।

📍 *नेत्रा मोबाइल सेंटर*
स्टेशन रोड, प्रो. राहुल आर. केवट
हेल्पलाइन: ${shopSettings.phone || '9699962396'}`
      : `*📱 NETRA MOBILE CENTER - REPAIR JOB CARD*
━━━━━━━━━━━━━━━━━━━━
*Job Token #:* ${job.id}
*Date:* ${dateFormatted}
*Customer:* ${job.customerName} (${job.phone})
*Device:* ${job.deviceBrand} ${job.deviceModel}
*IMEI / Serial:* ${job.imeiOrSerial || 'Diagnostic'}
*Issue Reported:* ${job.issueDescription}
*Device Condition:* ${job.conditionNotes || 'Normal wear'}

💰 *Cost & Payment Summary:*
• Estimated Cost: Rs. ${job.estimatedCost}
• Advance Paid: Rs. ${job.advancePaid}
• *Balance Due: Rs. ${balance}*
• Expected Delivery: ${promisedFormatted}

⚠️ *Key Terms:*
1. Please collect device within 30 days of intimation.
2. Risk applies to severe liquid / dead motherboard units.
3. Present this digital slip/token at delivery counter.

📍 *Netra Mobile Center*
Station Road, Opp. Old Bus Stand
Proprietor: Rahul R Kevat
Helpline: ${shopSettings.phone || '9699962396'}`;
  };

  const handleShareViaWhatsApp = () => {
    const targetJob = createdJob || getDraftJob();
    const cleanPhone = (targetJob.phone || '').replace(/\D/g, '');
    const msg = formatRepairWhatsAppMessage(targetJob);

    // Directly open WhatsApp with customer's mobile number pre-filled
    const waUrl = cleanPhone.length >= 10
      ? `https://api.whatsapp.com/send?phone=91${cleanPhone.slice(-10)}&text=${encodeURIComponent(msg)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;

    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 3000);
  };

  const handleCopyRepairDetails = () => {
    const targetJob = createdJob || getDraftJob();
    const msg = formatRepairWhatsAppMessage(targetJob);
    navigator.clipboard.writeText(msg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendWhatsAppToken = () => {
    handleShareViaWhatsApp();
  };

  const handleClose = () => {
    setCreatedJob(null);
    setShowReceiptPreview(false);
    setActiveModal(null);
  };

  const getDraftJob = (): RepairJob => {
    const est = Number(estimatedCost) || 0;
    const parts = Number(partsCost) || 0;
    const adv = Number(advancePaid) || 0;
    return {
      id: createdJob ? createdJob.id : `JOB-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      customerName: customerName || 'Valued Customer',
      phone: phone || '9XXXXXXXXX',
      deviceBrand,
      deviceModel: deviceModel || 'Smartphone Model',
      imeiOrSerial: imeiOrSerial || 'N/A',
      passcodePattern: passcodePattern || 'None',
      issueDescription: issueDescription || 'General hardware / display diagnostics',
      conditionNotes: conditionNotes || 'Normal physical signs of usage',
      estimatedCost: est,
      partsCost: parts,
      repairProfit: Math.max(0, est - parts),
      advancePaid: adv,
      status: 'received',
      receivedDate: createdJob ? createdJob.receivedDate : new Date().toISOString(),
      promisedDate: new Date(Date.now() + Number(promisedHours) * 60 * 60 * 1000).toISOString(),
      technicianName,
      paymentMode: adv > 0 ? 'cash' : 'khata',
    };
  };

  const activeReceiptJob = createdJob || getDraftJob();
  const balanceDue = Math.max(0, activeReceiptJob.estimatedCost - activeReceiptJob.advancePaid);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-2xl bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden my-4 print:border-none print:shadow-none print:m-0 print:w-full print:bg-white print:text-black">
        
        {/* Modal Top Header (Hidden on Print) */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">{t.repairJobCard}</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-bold uppercase tracking-wider">
                  {createdJob ? (language === 'hi' ? 'रसीद तैयार' : 'Receipt Ready') : (language === 'hi' ? 'नया जॉब' : 'Intake')}
                </span>
              </div>
              <p className="text-[11px] text-amber-100">{t.repairJobSubtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Share via WhatsApp in Top Header */}
            <button
              type="button"
              onClick={handleShareViaWhatsApp}
              title={`Share digital job card directly to ${activeReceiptJob.phone} on WhatsApp`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{shareSuccess ? (language === 'hi' ? 'भेजा गया!' : 'Sent!') : (language === 'hi' ? 'व्हाट्सएप शेयर' : 'Share via WhatsApp')}</span>
            </button>

            {/* Print Button in Top Header */}
            <button
              type="button"
              onClick={handlePrintSlip}
              title="Print formal customer repair receipt"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-950 hover:bg-amber-100 font-black text-xs rounded-xl shadow-md cursor-pointer transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === 'hi' ? 'प्रिंट रसीद' : 'Print Slip'}</span>
            </button>

            <button 
              onClick={handleClose} 
              className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Hidden on Print) */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-950/70 border-b border-slate-800 text-xs print:hidden">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowReceiptPreview(false)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                !showReceiptPreview
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {language === 'hi' ? '1. जॉब फॉर्म (Form)' : '1. Intake Form'}
            </button>
            <button
              type="button"
              onClick={() => setShowReceiptPreview(true)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                showReceiptPreview
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? '2. रसीद प्रीव्यू व प्रिंट (Receipt)' : '2. Formal Receipt View'}</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 hidden sm:block">
            {language === 'hi' ? 'A4 / A5 व थर्मल प्रिंटर हेतु अनुकूलित' : 'Print-ready for A4 / A5 & Thermal'}
          </div>
        </div>

        {/* Modal Body */}
        {showReceiptPreview ? (
          /* FORMAL PRINTABLE RECEIPT VIEW */
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[82vh] print:max-h-none print:overflow-visible print:p-0">
            
            {/* Top Print Action Banner (Screen only) */}
            <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs print:hidden">
              <div className="flex items-center gap-2.5">
                <Printer className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <span className="font-bold text-amber-300 block">
                    {language === 'hi' ? 'औपचारिक ग्राहक रसीद व जॉब कार्ड तैयार है' : 'Formal Customer Repair Receipt Ready'}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {language === 'hi' 
                      ? 'नीचे प्रिंट बटन दबाकर ग्राहक को दें या कटिंग टैग फोन पर लगाएं।' 
                      : 'Click Print button to generate high-resolution receipt and workshop tag.'}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleShareViaWhatsApp}
                  title={`Send digital repair receipt directly to ${activeReceiptJob.phone} on WhatsApp`}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-950/40 cursor-pointer transition-transform hover:scale-105"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>
                    {shareSuccess
                      ? (language === 'hi' ? 'व्हाट्सएप भेजा गया ✓' : 'Sent via WhatsApp ✓')
                      : (language === 'hi' ? 'व्हाट्सएप पर शेयर करें' : 'Share via WhatsApp')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyRepairDetails}
                  title="Copy receipt text to clipboard"
                  className="p-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={handlePrintSlip}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/30 cursor-pointer transition-transform"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-950" />
                  <span>{language === 'hi' ? 'रसीद प्रिंट करें' : 'Print Formal Receipt'}</span>
                </button>
              </div>
            </div>

            {/* FORMAL RECEIPT PAPER (Rendered on screen & captured during print) */}
            <div 
              id="printable-repair-receipt" 
              className="formal-receipt-paper bg-white text-slate-900 border-2 border-slate-900 rounded-xl p-5 sm:p-6 text-xs space-y-4 shadow-xl print:shadow-none print:border-2 print:border-black"
            >
              
              {/* Receipt Header */}
              <div className="border-b-2 border-slate-900 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-start gap-3.5">
                  <img
                    src="/assets/aistudio/large__1__865785a2.png"
                    alt="Mobile Netra Repering"
                    className="w-16 h-16 object-contain flex-shrink-0 rounded-lg p-0.5"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 uppercase">
                        {shopSettings.shopName || 'NETRA MOBILE CENTER'}
                      </h1>
                    </div>
                    <p className="text-[11px] font-bold text-red-700 tracking-wide uppercase mt-0.5">
                      MOBILE NETRA REPERING • SINCE 2012
                    </p>
                    <div className="text-[11px] text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 font-medium">
                      <span>Prop: <strong className="text-slate-900 font-bold">{shopSettings.ownerName || 'Rahul R Kevat'}</strong></span>
                      <span>•</span>
                      <span>Ph: <strong className="font-mono text-slate-900 font-bold">{shopSettings.phone || '9699962396'}</strong></span>
                      {shopSettings.email && (
                        <>
                          <span>•</span>
                          <span className="font-mono">{shopSettings.email}</span>
                        </>
                      )}
                    </div>
                    <p className="text-[10.5px] text-slate-500 mt-0.5">
                      Station Road, Opp. Old Bus Stand, Netra Mobile Center
                    </p>
                  </div>
                </div>

                {/* Job Token Box */}
                <div className="border-2 border-slate-900 rounded-lg p-2.5 bg-slate-50 text-center min-w-[150px] self-stretch sm:self-auto">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500 block">
                    REPAIR JOB TOKEN #
                  </span>
                  <span className="text-lg font-black font-mono tracking-tight text-slate-950 block my-0.5">
                    {activeReceiptJob.id}
                  </span>
                  <span className="text-[9.5px] font-bold bg-amber-200 text-amber-950 px-2 py-0.2 rounded uppercase block">
                    {activeReceiptJob.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Receipt Document Title Bar */}
              <div className="bg-slate-950 text-white font-black text-center py-1.5 px-3 rounded text-[11.5px] tracking-wider uppercase flex items-center justify-between">
                <span>REPAIR INTAKE RECEIPT & CUSTOMER CLAIM SLIP</span>
                <span className="text-[10px] font-normal text-amber-300">ग्राहक रसीद व जॉब टोकन</span>
              </div>

              {/* Customer & Timestamp Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Customer Information:</span>
                  <span className="font-bold text-sm text-slate-900 block mt-0.5">{activeReceiptJob.customerName}</span>
                  <span className="font-mono text-slate-700 block">Mobile: {activeReceiptJob.phone}</span>
                </div>

                <div className="sm:text-right space-y-0.5">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-semibold">Intake Date: </span>
                    <span className="font-bold text-slate-800 font-mono">
                      {new Date(activeReceiptJob.receivedDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-semibold">Promised Delivery: </span>
                    <span className="font-bold text-amber-800 font-mono">
                      {activeReceiptJob.promisedDate 
                        ? new Date(activeReceiptJob.promisedDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
                        : 'Within 24 Hours'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-semibold">Assigned Tech: </span>
                    <span className="font-bold text-slate-800">{activeReceiptJob.technicianName}</span>
                  </div>
                </div>
              </div>

              {/* Device & Diagnostic Table */}
              <div>
                <table className="formal-receipt-table w-full border-collapse border border-slate-400 text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-400">
                      <th className="p-2 border border-slate-300 w-1/3">Device Details</th>
                      <th className="p-2 border border-slate-300 w-1/4">Security & IMEI</th>
                      <th className="p-2 border border-slate-300 w-5/12">Reported Fault & Diagnostics</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-300">
                      <td className="p-2 border border-slate-300 align-top">
                        <strong className="text-sm text-slate-950 font-black block">
                          {activeReceiptJob.deviceBrand} {activeReceiptJob.deviceModel}
                        </strong>
                        <span className="text-[10px] text-slate-500 block mt-1">Condition:</span>
                        <span className="text-[10.5px] text-slate-700 italic block">
                          {activeReceiptJob.conditionNotes || 'Normal wear and tear marks.'}
                        </span>
                      </td>
                      <td className="p-2 border border-slate-300 align-top font-mono text-[11px]">
                        <div>IMEI: {activeReceiptJob.imeiOrSerial || 'Not specified'}</div>
                        <div className="mt-1">Lock/PIN: {activeReceiptJob.passcodePattern || 'None'}</div>
                      </td>
                      <td className="p-2 border border-slate-300 align-top">
                        <span className="font-bold text-slate-900 block text-xs">
                          {activeReceiptJob.issueDescription}
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-1">
                          Diagnostic status: Hardware inspection & component service initiated.
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation Statement */}
              <div className="border border-slate-400 rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 text-slate-600 font-semibold">Estimated Repair & Service Charges:</td>
                      <td className="p-2 font-mono font-bold text-right text-slate-900 text-sm">
                        ₹{activeReceiptJob.estimatedCost.toLocaleString('en-IN')}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <td className="p-2 text-slate-600 font-semibold">Advance Payment Received:</td>
                      <td className="p-2 font-mono font-bold text-right text-emerald-700 text-sm">
                        ₹{activeReceiptJob.advancePaid.toLocaleString('en-IN')}
                      </td>
                    </tr>
                    <tr className="bg-amber-50/80 font-black">
                      <td className="p-2.5 text-slate-900 text-xs uppercase tracking-wide">
                        Balance Amount Payable on Delivery (बाकी देय):
                      </td>
                      <td className="p-2.5 font-mono text-right text-red-700 text-base font-black">
                        ₹{balanceDue.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Standard Terms & Conditions Block */}
              <div className="border border-slate-300 rounded-lg p-2.5 bg-slate-50 text-[10px] text-slate-600 space-y-1 leading-relaxed">
                <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-slate-700" />
                  <span>Terms & Conditions / नियम व शर्तें:</span>
                </div>
                <ol className="list-decimal pl-4 space-y-0.5">
                  <li>Original Job Card token must be produced at the time of taking delivery. (डिलीवरी लेते समय मूल रसीद दिखाना आवश्यक है।)</li>
                  <li>30 Days service warranty on replaced Display folder/IC against manufacturing defects. Physical cracks or water ingress void warranty.</li>
                  <li>Netra Mobile Center will not be responsible for SIM cards, SD cards, or phone user data. Please ensure backup.</li>
                  <li>Devices unclaimed beyond 30 days of completion notification will be subject to storage disposal.</li>
                </ol>
              </div>

              {/* Signature Blocks */}
              <div className="pt-4 flex justify-between items-end text-xs">
                <div className="signature-box border-t border-slate-900 pt-1 text-center w-40">
                  <span className="block font-semibold text-slate-800">Customer Signature</span>
                  <span className="text-[9px] text-slate-400">(ग्राहक के हस्ताक्षर)</span>
                </div>

                <div className="text-center border-2 border-dashed border-slate-400 p-2 rounded w-44 bg-slate-50/50">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block">NETRA MOBILE CENTER</span>
                  <span className="text-[10px] font-black text-slate-800 block">VERIFIED & ACCEPTED</span>
                  <span className="text-[8.5px] text-slate-500 font-mono mt-0.5">Prop: Rahul R Kevat</span>
                </div>

                <div className="signature-box border-t border-slate-900 pt-1 text-center w-40">
                  <span className="block font-semibold text-slate-800">Authorized Signatory</span>
                  <span className="text-[9px] text-slate-400">(अधिकृत हस्ताक्षर)</span>
                </div>
              </div>

              {/* Cut Line between Customer Claim Copy & Workshop Tag */}
              <div className="receipt-cut-line my-3"></div>

              {/* Workshop Bench Tag for Technician */}
              <div className="border-2 border-dashed border-slate-800 p-3 rounded-lg bg-amber-50/50 text-[11px] space-y-1.5">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-900 font-black">
                    WORKSHOP BENCH TAG: {activeReceiptJob.id}
                  </span>
                  <span className="font-mono text-slate-700">
                    Ph: {activeReceiptJob.phone}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10.5px]">
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Device:</span>
                    <strong className="text-slate-900">{activeReceiptJob.deviceBrand} {activeReceiptJob.deviceModel}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Client:</span>
                    <span className="font-semibold">{activeReceiptJob.customerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Lock/Pattern:</span>
                    <span className="font-mono font-bold text-amber-900">{activeReceiptJob.passcodePattern || 'None'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Due Balance:</span>
                    <span className="font-mono font-black text-red-700">₹{balanceDue}</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 text-[9px] uppercase block">Issue:</span>
                  <span className="font-bold text-slate-800">{activeReceiptJob.issueDescription}</span>
                </div>
              </div>

            </div>

            {/* Bottom Actions Toolbar (Hidden on Print) */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
              <button
                type="button"
                onClick={() => setShowReceiptPreview(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
              >
                ← {language === 'hi' ? 'जॉब विवरण संपादित करें' : 'Back to Edit Details'}
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleShareViaWhatsApp}
                  title={`Send digital repair slip directly to ${activeReceiptJob.phone} on WhatsApp`}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black flex items-center gap-1.5 cursor-pointer shadow-md transition-transform hover:scale-105"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{shareSuccess ? (language === 'hi' ? 'व्हाट्सएप भेजा गया ✓' : 'Sent via WhatsApp ✓') : (language === 'hi' ? 'व्हाट्सएप पर भेजें' : 'Share via WhatsApp')}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintSlip}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black flex items-center gap-2 shadow-lg shadow-amber-500/30 cursor-pointer transition-transform"
                >
                  <Printer className="w-4 h-4 text-slate-950" />
                  <span>{language === 'hi' ? 'औपचारिक रसीद प्रिंट करें' : 'Print Formal Receipt'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold cursor-pointer"
                >
                  {language === 'hi' ? 'समाप्त' : 'Done'}
                </button>
              </div>
            </div>

          </div>
        ) : (
          /* INTAKE FORM VIEW */
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 max-h-[82vh] overflow-y-auto print:hidden">
            {/* Customer info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    {t.customerName} <span className="text-red-400">*</span>
                  </label>
                  {customers.length > 0 && (
                    <span className="text-[10px] text-amber-400 font-semibold">CRM Auto-fill</span>
                  )}
                </div>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    list="repair-customer-list"
                    value={customerName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomerName(val);
                      const match = customers.find(c => c.name.toLowerCase() === val.toLowerCase() || c.phone === val);
                      if (match) {
                        setCustomerName(match.name);
                        setPhone(match.phone);
                      }
                    }}
                    placeholder="e.g. Vikas Kushwaha"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-800 border border-slate-700 rounded-xl focus:border-amber-400 focus:outline-none text-white shadow-inner"
                  />
                  <datalist id="repair-customer-list">
                    {customers.map(c => (
                      <option key={c.id} value={c.name}>{c.phone} - {c.cityOrArea || c.customerType}</option>
                    ))}
                  </datalist>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.customerPhone} <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    list="repair-phone-list"
                    value={phone}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPhone(val);
                      const match = customers.find(c => c.phone === val || c.phone.endsWith(val));
                      if (match) {
                        setCustomerName(match.name);
                      }
                    }}
                    placeholder="10-digit mobile"
                    maxLength={13}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-800 border border-slate-700 rounded-xl focus:border-amber-400 focus:outline-none text-white font-mono shadow-inner"
                  />
                  <datalist id="repair-phone-list">
                    {customers.map(c => (
                      <option key={c.id} value={c.phone}>{c.name}</option>
                    ))}
                  </datalist>
                </div>
              </div>
            </div>

            {/* Device Brand with Brand Logos & Model */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <BrandLogo brand={deviceBrand} size="sm" />
                    <span>{t.deviceBrand}</span>
                  </label>
                  <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider">{deviceBrand}</span>
                </div>

                {/* Quick Brand Logos Grid */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {mobileBrandsList.slice(0, 6).map((b) => {
                    const isSelected = deviceBrand.toLowerCase().includes(b.id);
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setDeviceBrand(b.name)}
                        className={`flex items-center gap-1 px-1.5 py-0.5 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-amber-500/20 text-white border-amber-400 ring-1 ring-amber-400/40 shadow-sm' 
                            : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-750'
                        }`}
                      >
                        <BrandLogo brand={b.name} size="sm" />
                        <span>{b.name}</span>
                      </button>
                    );
                  })}
                </div>

                <select
                  value={deviceBrand}
                  onChange={(e) => setDeviceBrand(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl focus:border-amber-400 focus:outline-none text-white cursor-pointer"
                >
                  {brands.map((b, i) => (
                    <option key={i} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.deviceModel} <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={deviceModel}
                    onChange={(e) => setDeviceModel(e.target.value)}
                    placeholder="e.g., Note 12 5G / Galaxy M14 / Y20"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-800 border border-slate-700 rounded-xl focus:border-amber-400 focus:outline-none text-white shadow-inner"
                  />
                </div>
              </div>
            </div>

            {/* Pattern/PIN & IMEI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.patternPasscode} (Optional)
                </label>
                <input
                  type="text"
                  value={passcodePattern}
                  onChange={(e) => setPasscodePattern(e.target.value)}
                  placeholder="e.g., PIN: 1234 or L-Shape pattern"
                  className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl focus:border-amber-400 focus:outline-none text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.imeiSerial} (Optional)
                </label>
                <input
                  type="text"
                  value={imeiOrSerial}
                  onChange={(e) => setImeiOrSerial(e.target.value)}
                  placeholder="15-digit IMEI"
                  className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl focus:border-amber-400 focus:outline-none text-white font-mono"
                />
              </div>
            </div>

            {/* Issue Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.issueDescription} <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                placeholder="Describe the complaint in detail..."
                className="w-full px-3 py-2 text-sm bg-slate-800 border border-slate-700 rounded-xl focus:border-amber-400 focus:outline-none text-white"
              />

              {/* Quick Fault Pills */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {commonFaultPills.map((pill, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      const textToAdd = language === 'hi' ? pill.hi : pill.en;
                      setIssueDescription(prev => prev ? `${prev}, ${textToAdd}` : textToAdd);
                    }}
                    className="text-[11px] px-2.5 py-1 bg-slate-800 hover:bg-amber-950/40 text-slate-300 hover:text-amber-300 rounded-lg border border-slate-700 hover:border-amber-500/40 transition-colors cursor-pointer"
                  >
                    + {language === 'hi' ? pill.hi : pill.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Physical condition & Technicians */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {language === 'hi' ? 'फोन की स्थिति / स्क्रैच विवरण' : 'Physical Condition Notes'}
                </label>
                <input
                  type="text"
                  value={conditionNotes}
                  onChange={(e) => setConditionNotes(e.target.value)}
                  placeholder="e.g. Scratched screen, minor dent on corner"
                  className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl focus:border-amber-400 focus:outline-none text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {language === 'hi' ? 'डिलीवरी का वादा (Promised Hours)' : 'Promised Time (Hours)'}
                </label>
                <select
                  value={promisedHours}
                  onChange={(e) => setPromisedHours(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl focus:border-amber-400 focus:outline-none text-white cursor-pointer"
                >
                  <option value="2">2 {language === 'hi' ? 'घंटे (त्वरित रिपेयर)' : 'Hours (Quick Service)'}</option>
                  <option value="4">4 {language === 'hi' ? 'घंटे (उसी दिन)' : 'Hours (Same Day)'}</option>
                  <option value="8">8 {language === 'hi' ? 'घंटे' : 'Hours'}</option>
                  <option value="24">24 {language === 'hi' ? 'घंटे (अगले दिन)' : 'Hours (Next Day)'}</option>
                  <option value="48">48 {language === 'hi' ? 'घंटे (पार्ट्स मंगाना है)' : 'Hours (Parts Ordered)'}</option>
                </select>
              </div>
            </div>

            {/* Financial Estimates & Advance */}
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                {language === 'hi' ? 'लागत, अग्रिम एवं शुद्ध मुनाफ़ा' : 'Pricing, Advance & Labor Margin'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t.estimatedCost} <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      min={0}
                      required
                      value={estimatedCost}
                      onChange={(e) => setEstimatedCost(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2 text-sm bg-slate-800 border border-slate-700 rounded-xl font-bold text-amber-300 font-mono focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {language === 'hi' ? 'पार्ट्स लागत (Spare Cost)' : 'Spare Parts Cost'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      min={0}
                      value={partsCost}
                      onChange={(e) => setPartsCost(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2 text-sm bg-slate-800 border border-slate-700 rounded-xl font-bold text-rose-300 font-mono focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t.advancePaid}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      min={0}
                      value={advancePaid}
                      onChange={(e) => setAdvancePaid(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2 text-sm bg-slate-800 border border-slate-700 rounded-xl font-bold text-emerald-300 font-mono focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Live Repair Profit Calculation */}
              <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {language === 'hi' ? 'शुद्ध रिपेयर मुनाफ़ा (Net Labor Profit):' : 'Net Labor & Repair Margin:'}
                </span>
                <span className="font-mono font-black text-sm text-emerald-300">
                  +₹{Math.max(0, (Number(estimatedCost) || 0) - (Number(partsCost) || 0))}
                  <span className="text-[10px] text-slate-400 font-normal ml-1">
                    (₹{Number(estimatedCost) || 0} - ₹{Number(partsCost) || 0})
                  </span>
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={() => setShowReceiptPreview(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>{language === 'hi' ? 'रसीद प्रीव्यू देखें' : 'Preview Formal Receipt'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/30 cursor-pointer transition-transform"
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>{t.saveJobCard}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
