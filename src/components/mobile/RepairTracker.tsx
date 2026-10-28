import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wrench, 
  Search, 
  Smartphone, 
  Clock, 
  CheckCircle, 
  Share2, 
  Phone, 
  Printer, 
  AlertCircle,
  Package,
  CheckCircle2,
  Calendar,
  X,
  ShieldCheck
} from 'lucide-react';
import { RepairJob, RepairStatus } from '../../types';
import { BrandLogo } from '../brandLogos';
import { VoiceSearchInput } from '../common/VoiceSearchInput';

export const RepairTracker: React.FC = () => {
  const { 
    t, 
    language, 
    repairJobs, 
    searchQuery, 
    setSearchQuery,
    updateRepairStatus, 
    shopSettings, 
    openNotificationModal,
    setActiveModal 
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [jobToPrint, setJobToPrint] = useState<RepairJob | null>(null);

  const filteredJobs = repairJobs.filter(job => {
    const matchesQuery = 
      job.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.phone.includes(searchQuery) ||
      job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.deviceModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.deviceBrand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.issueDescription.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const getStatusBadge = (status: RepairStatus) => {
    switch (status) {
      case 'received':
        return { label: t.statusReceived, bg: 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300' };
      case 'diagnosing':
        return { label: t.statusDiagnosing, bg: 'bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300' };
      case 'in_repair':
        return { label: t.statusInRepair, bg: 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300' };
      case 'waiting_parts':
        return { label: t.statusWaitingParts, bg: 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300' };
      case 'ready_for_pickup':
        return { label: t.statusReadyForPickup, bg: 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold' };
      case 'delivered':
        return { label: t.statusDelivered, bg: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300' };
      default:
        return { label: status, bg: 'bg-slate-100 text-slate-600 border-slate-300' };
    }
  };

  const handleNotifyReady = (job: RepairJob) => {
    const balance = job.estimatedCost - job.advancePaid;
    const msg = language === 'hi'
      ? `नमस्ते ${job.customerName} जी! आपका मोबाइल ${job.deviceBrand} ${job.deviceModel} (जॉब टोकन #${job.id}) पूरी तरह से ठीक होकर डिलीवरी के लिए तैयार है। 
बाकी देय राशि: ₹${balance}।
कृपया दुकान पर आकर प्राप्त कर लें।
- नेत्र मोबाइल सेंटर (राहुल आर. केवट, फोन: ${shopSettings.phone})`
      : `Dear ${job.customerName}, Good news! Your phone ${job.deviceBrand} ${job.deviceModel} (Job #${job.id}) is REPAIRED and READY for pickup at Netra Mobile Center. Balance due: Rs.${balance}. Please collect it today. - Rahul R Kevat (${shopSettings.phone})`;

    openNotificationModal({
      title: language === 'hi' ? 'फोन तैयार होने की सूचना (WhatsApp/SMS)' : 'Ready for Pickup Notification',
      text: msg,
      recipientPhone: job.phone,
      type: 'whatsapp'
    });
  };

  const handleShareWhatsAppSlip = (job: RepairJob) => {
    const balance = Math.max(0, job.estimatedCost - job.advancePaid);
    const dateFormatted = new Date(job.receivedDate).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    const cleanPhone = (job.phone || '').replace(/\D/g, '');
    const msg = language === 'hi'
      ? `*📱 मोबाइल नेत्रा रिपेयरिंग - रिपेयर जॉब रसीद*
━━━━━━━━━━━━━━━━━━━━
*टोकन नं:* ${job.id}
*दिनांक:* ${dateFormatted}
*ग्राहक:* ${job.customerName} (${job.phone})
*मॉडल:* ${job.deviceBrand} ${job.deviceModel}
*आईएमईआई/सीरियल:* ${job.imeiOrSerial || 'जांच में'}
*खराबी/समस्या:* ${job.issueDescription}
*फोन की स्थिति:* ${job.conditionNotes || 'सामान्य'}
*स्थिति (Status):* ${job.status.replace('_', ' ')}

💰 *खर्च व भुगतान विवरण:*
• अनुमानित लागत: ₹${job.estimatedCost}
• जमा अग्रिम (Advance): ₹${job.advancePaid}
• *बाकी राशि (Balance Due): ₹${balance}*

📍 *नेत्रा मोबाइल सेंटर*
स्टेशन रोड, प्रो. राहुल आर. केवट
हेल्पलाइन: ${shopSettings.phone || '9699962396'}`
      : `*📱 NETRA MOBILE CENTER - REPAIR JOB RECEIPT*
━━━━━━━━━━━━━━━━━━━━
*Job Token #:* ${job.id}
*Date:* ${dateFormatted}
*Customer:* ${job.customerName} (${job.phone})
*Device:* ${job.deviceBrand} ${job.deviceModel}
*IMEI / Serial:* ${job.imeiOrSerial || 'Diagnostic'}
*Issue Reported:* ${job.issueDescription}
*Status:* ${job.status.replace('_', ' ')}

💰 *Cost & Payment Summary:*
• Estimated Cost: Rs. ${job.estimatedCost}
• Advance Paid: Rs. ${job.advancePaid}
• *Balance Due: Rs. ${balance}*

📍 *Netra Mobile Center*
Station Road, Opp. Old Bus Stand
Proprietor: Rahul R Kevat
Helpline: ${shopSettings.phone || '9699962396'}`;

    const waUrl = cleanPhone.length >= 10
      ? `https://api.whatsapp.com/send?phone=91${cleanPhone.slice(-10)}&text=${encodeURIComponent(msg)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;

    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-4">
      {/* Table & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                {t.allRepairs}
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {filteredJobs.length} {language === 'hi' ? 'जॉब्स' : 'Jobs'}
              </span>
            </div>

            {/* Voice-to-Text Search Bar for Repair Jobs */}
            <div className="flex-1 max-w-lg">
              <VoiceSearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                moduleName="repair"
                size="sm"
                placeholder="Speak or type token #, customer, handset, or issue..."
                placeholderHi="टोकन #, ग्राहक नाम, मोबाइल या खराबी बोलें या लिखें..."
              />
            </div>

            {/* Status Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
              <button
                onClick={() => setStatusFilter('all')}
                className={`text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-slate-900 dark:bg-slate-700 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {language === 'hi' ? 'सभी रिपेयर' : 'All Jobs'}
              </button>
              <button
                onClick={() => setStatusFilter('in_repair')}
                className={`text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  statusFilter === 'in_repair'
                    ? 'bg-amber-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {t.statusInRepair}
              </button>
              <button
                onClick={() => setStatusFilter('ready_for_pickup')}
                className={`text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  statusFilter === 'ready_for_pickup'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {t.statusReadyForPickup}
              </button>
              <button
                onClick={() => setStatusFilter('delivered')}
                className={`text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  statusFilter === 'delivered'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {t.statusDelivered}
              </button>
            </div>
          </div>
        </div>

        {/* List of Repair Jobs */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3 pl-4">Job Token</th>
                <th className="p-3">Customer & Phone</th>
                <th className="p-3">Device & Fault</th>
                <th className="p-3">Repair Status</th>
                <th className="p-3">Est. Cost / Advance</th>
                <th className="p-3">Balance Due</th>
                <th className="p-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    No repair jobs match your search
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => {
                  const badge = getStatusBadge(job.status);
                  const balance = job.estimatedCost - job.advancePaid;
                  return (
                    <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-3 pl-4">
                        <span className="font-mono font-bold text-amber-600 dark:text-amber-400 block">{job.id}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(job.receivedDate).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="p-3">
                        <span className="font-bold text-slate-900 dark:text-white block">{job.customerName}</span>
                        <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{job.phone}</span>
                      </td>

                      <td className="p-3 max-w-xs">
                        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                          <BrandLogo brand={job.deviceBrand} size="sm" />
                          <span>{job.deviceBrand} {job.deviceModel}</span>
                        </div>
                        <p className="line-clamp-2 text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                          {job.issueDescription}
                        </p>
                        {job.passcodePattern && (
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5 inline-block">
                            Key: {job.passcodePattern}
                          </span>
                        )}
                      </td>

                      <td className="p-3">
                        <select
                          value={job.status}
                          onChange={(e) => updateRepairStatus(job.id, e.target.value as RepairStatus)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${badge.bg}`}
                        >
                          <option value="received">{t.statusReceived}</option>
                          <option value="diagnosing">{t.statusDiagnosing}</option>
                          <option value="in_repair">{t.statusInRepair}</option>
                          <option value="waiting_parts">{t.statusWaitingParts}</option>
                          <option value="ready_for_pickup">{t.statusReadyForPickup}</option>
                          <option value="delivered">{t.statusDelivered}</option>
                        </select>
                      </td>

                      <td className="p-3">
                        <span className="font-bold text-slate-900 dark:text-white block">₹{job.estimatedCost}</span>
                        <div className="flex flex-wrap items-center gap-1 text-[11px] mt-0.5">
                          <span className="text-slate-500 font-medium">
                            Adv: ₹{job.advancePaid}
                          </span>
                          {job.partsCost !== undefined && (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/80 px-1 py-0.2 rounded border border-emerald-300 dark:border-emerald-800">
                              +₹{job.estimatedCost - job.partsCost} Profit
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-3">
                        {balance > 0 ? (
                          <span className="font-bold text-red-600 dark:text-red-400">₹{balance}</span>
                        ) : (
                          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                            Cleared
                          </span>
                        )}
                      </td>

                      <td className="p-3 pr-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Print Formal Receipt button */}
                          <button
                            onClick={() => setJobToPrint(job)}
                            title="Print Formal Job Card Receipt"
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-750 text-xs font-semibold transition-all cursor-pointer"
                          >
                            <Printer className="w-3 h-3 text-amber-400" />
                            <span>{language === 'hi' ? 'रसीद' : 'Slip'}</span>
                          </button>

                          {/* Notify Ready button */}
                          <button
                            onClick={() => handleNotifyReady(job)}
                            title="Send Ready Status via WhatsApp"
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all cursor-pointer"
                          >
                            <Share2 className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formal Printable Receipt Modal for Tracker */}
      {jobToPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static">
          <div className="relative w-full max-w-2xl bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden my-4 print:border-none print:shadow-none print:m-0 print:w-full print:bg-white">
            
            {/* Action Bar (Hidden on Print) */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white print:hidden">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Printer className="w-4 h-4 text-white" />
                <span>{language === 'hi' ? 'रिपेयर जॉब रसीद' : 'Repair Job Receipt'} ({jobToPrint.id})</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShareWhatsAppSlip(jobToPrint)}
                  title={`Send digital repair slip directly to ${jobToPrint.phone} on WhatsApp`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-md cursor-pointer transition-all"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'व्हाट्सएप पर भेजें' : 'Share via WhatsApp'}</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-950 hover:bg-amber-100 rounded-xl text-xs font-black shadow-md cursor-pointer transition-all"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-600" />
                  <span>{language === 'hi' ? 'प्रिंट रसीद' : 'Print Receipt'}</span>
                </button>
                <button
                  onClick={() => setJobToPrint(null)}
                  className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Paper */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[82vh] print:max-h-none print:p-0">
              <div id="printable-repair-receipt" className="formal-receipt-paper bg-white text-slate-900 border-2 border-slate-900 rounded-xl p-5 text-xs space-y-3.5 shadow-xl print:shadow-none print:border-2 print:border-black">
                
                {/* Header */}
                <div className="border-b-2 border-slate-900 pb-2.5 flex justify-between items-start gap-3">
                  <div className="flex items-start gap-3">
                    <img
                      src="/assets/aistudio/large__1__865785a2.png"
                      alt="Mobile Netra Repering"
                      className="w-14 h-14 object-contain flex-shrink-0"
                    />
                    <div>
                      <h1 className="text-xl font-black text-slate-950 uppercase">{shopSettings.shopName}</h1>
                      <p className="text-[11px] font-bold text-red-700 uppercase tracking-wide">MOBILE NETRA REPERING • SINCE 2012</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Prop: <strong>{shopSettings.ownerName}</strong> • Phone: <strong className="font-mono">{shopSettings.phone}</strong>
                      </p>
                      <p className="text-[10px] text-slate-500">{shopSettings.address}</p>
                    </div>
                  </div>
                  <div className="border-2 border-slate-900 rounded-lg p-2 bg-slate-50 text-center min-w-[130px]">
                    <span className="text-[9px] uppercase font-bold text-slate-500 block">TOKEN #</span>
                    <span className="text-base font-black font-mono text-slate-950 block">{jobToPrint.id}</span>
                    <span className="text-[9px] font-bold uppercase bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded block mt-0.5">
                      {jobToPrint.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950 text-white font-black text-center py-1 rounded text-[11px] tracking-wider uppercase">
                  REPAIR INTAKE RECEIPT & CUSTOMER CLAIM SLIP
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded border border-slate-300 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Customer:</span>
                    <strong className="text-slate-900 block">{jobToPrint.customerName}</strong>
                    <span className="font-mono text-slate-700">Mob: {jobToPrint.phone}</span>
                  </div>
                  <div className="text-right text-[11px]">
                    <div>Received: <span className="font-mono font-bold">{new Date(jobToPrint.receivedDate).toLocaleDateString()}</span></div>
                    <div>Tech: <strong>{jobToPrint.technicianName}</strong></div>
                  </div>
                </div>

                {/* Device Table */}
                <table className="formal-receipt-table w-full border-collapse border border-slate-400 text-xs">
                  <thead>
                    <tr className="bg-slate-100 font-bold">
                      <th className="p-2 border border-slate-300">Device</th>
                      <th className="p-2 border border-slate-300">Lock / IMEI</th>
                      <th className="p-2 border border-slate-300">Reported Issue</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border border-slate-300 font-bold">{jobToPrint.deviceBrand} {jobToPrint.deviceModel}</td>
                      <td className="p-2 border border-slate-300 font-mono text-[11px]">{jobToPrint.passcodePattern || 'None'} / {jobToPrint.imeiOrSerial || 'N/A'}</td>
                      <td className="p-2 border border-slate-300">{jobToPrint.issueDescription}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Financial Summary */}
                <div className="border border-slate-400 rounded overflow-hidden">
                  <table className="w-full text-xs">
                    <tbody>
                      <tr className="border-b border-slate-200">
                        <td className="p-2 text-slate-600">Estimated Total:</td>
                        <td className="p-2 font-mono font-bold text-right">₹{jobToPrint.estimatedCost}</td>
                      </tr>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <td className="p-2 text-slate-600">Advance Paid:</td>
                        <td className="p-2 font-mono font-bold text-right text-emerald-700">₹{jobToPrint.advancePaid}</td>
                      </tr>
                      <tr className="bg-amber-50 font-black">
                        <td className="p-2 text-slate-900 uppercase">Balance Due (बाकी देय):</td>
                        <td className="p-2 font-mono font-black text-right text-red-700 text-sm">
                          ₹{Math.max(0, jobToPrint.estimatedCost - jobToPrint.advancePaid)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Terms */}
                <div className="text-[9.5px] text-slate-600 border border-slate-300 rounded p-2 bg-slate-50 space-y-0.5">
                  <span className="font-bold block text-slate-800">Terms & Conditions:</span>
                  <p>1. Present this original claim slip at delivery. 2. 30 Days service warranty on parts (excludes water/physical damage). 3. Not responsible for data backup.</p>
                </div>

                {/* Signatures */}
                <div className="pt-3 flex justify-between items-end text-xs">
                  <div className="signature-box border-t border-slate-900 pt-1 text-center w-36">
                    <span className="font-semibold block">Customer Signature</span>
                  </div>
                  <div className="signature-box border-t border-slate-900 pt-1 text-center w-36">
                    <span className="font-semibold block">Netra Mobile Center</span>
                  </div>
                </div>

                {/* Cut line & workshop tag */}
                <div className="receipt-cut-line my-2"></div>

                <div className="border-2 border-dashed border-slate-700 p-2.5 rounded bg-amber-50/50 text-[10.5px]">
                  <div className="flex justify-between font-bold">
                    <span>WORKSHOP TAG: {jobToPrint.id}</span>
                    <span>Ph: {jobToPrint.phone}</span>
                  </div>
                  <div className="mt-1 flex gap-3 text-slate-800">
                    <span><strong>{jobToPrint.deviceBrand} {jobToPrint.deviceModel}</strong></span>
                    <span>•</span>
                    <span>Lock: {jobToPrint.passcodePattern || 'None'}</span>
                    <span>•</span>
                    <span className="text-red-700 font-bold">Due: ₹{Math.max(0, jobToPrint.estimatedCost - jobToPrint.advancePaid)}</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
