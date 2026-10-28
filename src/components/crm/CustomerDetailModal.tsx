import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import { VoiceSearchInput } from '../common/VoiceSearchInput';
import { 
  User, 
  Phone, 
  MapPin, 
  Smartphone, 
  Wrench, 
  ShoppingCart, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  DollarSign, 
  Share2, 
  Plus, 
  Edit3, 
  X, 
  FileText, 
  Printer, 
  ExternalLink,
  ShieldCheck,
  Building,
  TrendingUp,
  Receipt,
  Bell
} from 'lucide-react';

interface CustomerDetailModalProps {
  customer: Customer | null;
  onClose: () => void;
  onEdit: (customer: Customer) => void;
  onScheduleReminder?: (customer: Customer) => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({ 
  customer, 
  onClose, 
  onEdit,
  onScheduleReminder
}) => {
  const { 
    language, 
    getCustomerHistory, 
    setActiveModal, 
    setSelectedInvoiceToView, 
    openNotificationModal,
    shopSettings 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'timeline' | 'repairs' | 'purchases' | 'notes'>('timeline');
  const [searchHistoryQuery, setSearchHistoryQuery] = useState('');

  if (!customer) return null;

  const history = getCustomerHistory(customer.phone, customer.name);

  const handleCreateRepairForCustomer = () => {
    setActiveModal('repair');
  };

  const handleCreateBillForCustomer = () => {
    setActiveModal('pos');
  };

  const sendWhatsAppReminder = () => {
    if (history.pendingDue > 0) {
      const msg = language === 'hi'
        ? `नमस्ते ${customer.name} जी, नेत्र मोबाइल सेंटर से आपका पुराना बकाया ₹${history.pendingDue} बाकी है। कृपया सुविधानुसार भुगतान करें। संपर्क: राहुल आर. केवट (${shopSettings.phone})`
        : `Dear ${customer.name}, gentle reminder from Netra Mobile Center. Your outstanding balance is Rs.${history.pendingDue}. Please clear at convenience. Contact: Rahul R Kevat (${shopSettings.phone})`;

      openNotificationModal({
        title: language === 'hi' ? 'बकाया भुगतान तकादा (WhatsApp)' : 'Khata Dues Reminder',
        text: msg,
        recipientPhone: customer.phone,
        type: 'whatsapp'
      });
    } else {
      const msg = language === 'hi'
        ? `नमस्ते ${customer.name} जी, नेत्र मोबाइल सेंटर (राहुल आर. केवट) से जुड़ने के लिए धन्यवाद! किसी भी स्मार्टफोन रिपेयर या एक्सेसरीज़ के लिए संपर्क करें: ${shopSettings.phone}`
        : `Hello ${customer.name}, thank you for choosing Netra Mobile Center (Prop. Rahul R Kevat). For any phone repairs or accessories, call: ${shopSettings.phone}`;

      openNotificationModal({
        title: language === 'hi' ? 'ग्राहक संदेश (WhatsApp)' : 'Customer Message',
        text: msg,
        recipientPhone: customer.phone,
        type: 'whatsapp'
      });
    }
  };

  // Combine repairs and invoices into unified timeline
  const timelineEvents = useMemo(() => [
    ...history.repairs.map(r => ({
      id: r.id,
      type: 'repair' as const,
      date: new Date(r.receivedDate).getTime(),
      dateStr: new Date(r.receivedDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }),
      title: `${r.deviceBrand} ${r.deviceModel} Repair`,
      subtitle: r.issueDescription,
      amount: r.finalCost || r.estimatedCost,
      status: r.status,
      refData: r
    })),
    ...history.invoices.map(inv => ({
      id: inv.id,
      type: 'purchase' as const,
      date: new Date(inv.date).getTime(),
      dateStr: new Date(inv.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }),
      title: `Invoice #${inv.invoiceNumber}`,
      subtitle: inv.items.map(i => `${i.title} (x${i.quantity})`).join(', '),
      amount: inv.grandTotal,
      status: inv.status,
      refData: inv
    }))
  ].sort((a, b) => b.date - a.date), [history.repairs, history.invoices]);

  const filteredTimelineEvents = useMemo(() => {
    if (!searchHistoryQuery.trim()) return timelineEvents;
    const q = searchHistoryQuery.toLowerCase().trim();
    return timelineEvents.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.subtitle.toLowerCase().includes(q) ||
      e.id.toLowerCase().includes(q)
    );
  }, [timelineEvents, searchHistoryQuery]);

  const filteredRepairs = useMemo(() => {
    if (!searchHistoryQuery.trim()) return history.repairs;
    const q = searchHistoryQuery.toLowerCase().trim();
    return history.repairs.filter(r =>
      r.deviceBrand.toLowerCase().includes(q) ||
      r.deviceModel.toLowerCase().includes(q) ||
      r.issueDescription.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q) ||
      (r.imeiOrSerial || '').toLowerCase().includes(q)
    );
  }, [history.repairs, searchHistoryQuery]);

  const filteredInvoices = useMemo(() => {
    if (!searchHistoryQuery.trim()) return history.invoices;
    const q = searchHistoryQuery.toLowerCase().trim();
    return history.invoices.filter(inv =>
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.items.some(i => i.title.toLowerCase().includes(q))
    );
  }, [history.invoices, searchHistoryQuery]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header Profile Section */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-4 sm:p-6 border-b border-slate-800 text-white relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pr-10">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-900/30">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-xl font-black text-cyan-400">
                  {customer.name.slice(0, 2).toUpperCase()}
                </div>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    {customer.name}
                  </h2>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                    customer.customerType === 'vip' 
                      ? 'bg-amber-950/60 text-amber-300 border-amber-500/40' 
                      : customer.customerType === 'wholesaler' 
                      ? 'bg-purple-950/60 text-purple-300 border-purple-500/40' 
                      : 'bg-blue-950/60 text-blue-300 border-blue-500/40'
                  }`}>
                    {customer.customerType}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ID: {customer.id}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-300">
                  <a 
                    href={`tel:${customer.phone}`} 
                    className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-mono font-bold"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {customer.phone}
                  </a>
                  {customer.altPhone && (
                    <span className="text-slate-400 font-mono">
                      Alt: {customer.altPhone}
                    </span>
                  )}
                  {customer.cityOrArea && (
                    <span className="flex items-center gap-1 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      {customer.cityOrArea}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              {onScheduleReminder && (
                <button
                  onClick={() => onScheduleReminder(customer)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/40 flex items-center gap-1.5 shadow cursor-pointer transition-transform"
                  title="Schedule recurring reminder or pickup alert"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'hi' ? '+ रिमाइंडर' : '+ Alert'}</span>
                </button>
              )}
              <button
                onClick={sendWhatsAppReminder}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer transition-transform"
                title="Send message or dues reminder on WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={() => onEdit(customer)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'संपादित करें' : 'Edit'}</span>
              </button>
            </div>
          </div>

          {/* Customer Address & Notes Banner */}
          {(customer.address || customer.notes) && (
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-slate-400">
              {customer.address && (
                <div>
                  <span className="text-slate-500">{language === 'hi' ? 'पता:' : 'Address:'}</span>{' '}
                  <span className="text-slate-300">{customer.address}</span>
                </div>
              )}
              {customer.notes && (
                <div>
                  <span className="text-slate-500">{language === 'hi' ? 'नोट:' : 'Note:'}</span>{' '}
                  <span className="text-amber-300">{customer.notes}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4 Key Customer Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 p-3 sm:p-4 bg-slate-950/60 border-b border-slate-800">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block">
              {language === 'hi' ? 'कुल व्यापार (Lifetime Spent)' : 'Lifetime Spend'}
            </span>
            <div className="text-lg sm:text-xl font-black text-cyan-400 mt-0.5">
              ₹{history.totalSpent.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-500">
              {history.totalRepairs} {language === 'hi' ? 'रिपेयर' : 'repairs'} + {history.totalPurchases} {language === 'hi' ? 'बिल' : 'purchases'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block">
              {language === 'hi' ? 'बकाया खाता (Khata Due)' : 'Pending Due'}
            </span>
            <div className={`text-lg sm:text-xl font-black mt-0.5 ${
              history.pendingDue > 0 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
            }`}>
              ₹{history.pendingDue.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-500">
              {history.pendingDue > 0 ? (language === 'hi' ? 'भुगतान बाकी' : 'Balance unpaid') : (language === 'hi' ? 'कोई बकाया नहीं' : 'All clear')}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block">
              {language === 'hi' ? 'मोबाइल रिपेयरिंग (Repairs)' : 'Repair Job Cards'}
            </span>
            <div className="text-lg sm:text-xl font-black text-amber-400 mt-0.5">
              {history.totalRepairs}
            </div>
            <span className="text-[10px] text-slate-500">
              {history.repairs.filter(r => r.status === 'in_repair' || r.status === 'diagnosing' || r.status === 'ready_for_pickup').length} {language === 'hi' ? 'वर्तमान में सक्रिय' : 'active jobs'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block">
              {language === 'hi' ? 'दुकान का शुद्ध नफ़ा (Shop Profit)' : 'Shop Profit Earned'}
            </span>
            <div className="text-lg sm:text-xl font-black text-emerald-400 mt-0.5">
              ₹{history.totalProfit.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-500">
              {language === 'hi' ? 'रिपेयर मार्जिन' : 'repair margin'}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900 px-4 pt-2 gap-2 text-xs font-semibold overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'border-cyan-400 text-cyan-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'सम्पूर्ण गतिविधि टाइमलाइन' : 'All Activity Timeline'}</span>
            <span className="text-[10px] px-1.5 rounded-full bg-slate-800 text-slate-300">
              {timelineEvents.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('repairs')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'repairs'
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'मोबाइल रिपेयर इतिहास' : 'Repair Job History'}</span>
            <span className="text-[10px] px-1.5 rounded-full bg-slate-800 text-slate-300">
              {history.totalRepairs}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('purchases')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'purchases'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'बिलिंग व खरीदारी इतिहास' : 'Purchases & Bills'}</span>
            <span className="text-[10px] px-1.5 rounded-full bg-slate-800 text-slate-300">
              {history.totalPurchases}
            </span>
          </button>
        </div>

        {/* Voice Search Toolbar for Client Records */}
        <div className="px-4 py-2.5 bg-slate-950/70 border-b border-slate-800">
          <VoiceSearchInput
            value={searchHistoryQuery}
            onChange={setSearchHistoryQuery}
            size="sm"
            placeholder="Speak or type to filter this client's jobs, invoices, or faults..."
            placeholderHi="इस ग्राहक का कोई भी काम या बिल बोलकर खोजें (उदा. 'Note 12', 'डिस्प्ले', 'टोकन')..."
          />
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-slate-200 text-xs">
          
          {/* TAB 1: Unified Activity Timeline */}
          {activeTab === 'timeline' && (
            <div className="space-y-3">
              {filteredTimelineEvents.length === 0 ? (
                <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-slate-800 text-slate-400 space-y-2">
                  <Smartphone className="w-10 h-10 mx-auto text-slate-600" />
                  <p className="font-semibold">
                    {searchHistoryQuery
                      ? (language === 'hi' ? `"${searchHistoryQuery}" से मेल खाती कोई गतिविधि नहीं मिली।` : `No records matched "${searchHistoryQuery}".`)
                      : (language === 'hi' ? 'इस ग्राहक का कोई पिछला रिकॉर्ड उपलब्ध नहीं है।' : 'No activity recorded yet for this customer.')}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {language === 'hi' ? 'नीचे दिए गए बटन से नया रिपेयर जॉब या बिलिंग बनाएं।' : 'Create a new repair job or bill below.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredTimelineEvents.map((event) => (
                    <div 
                      key={`${event.type}-${event.id}`}
                      className="p-3 rounded-xl bg-slate-800/60 border border-slate-750 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-slate-600 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          event.type === 'repair' 
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {event.type === 'repair' ? <Wrench className="w-4 h-4" /> : <Receipt className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-100 text-sm">
                              {event.title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {event.dateStr}
                            </span>
                          </div>
                          <p className="text-slate-300 text-xs mt-0.5 line-clamp-2">
                            {event.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-1">
                        <div className="text-sm font-black text-cyan-300">
                          ₹{event.amount.toLocaleString('en-IN')}
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          event.status === 'delivered' || event.status === 'paid'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Repair History Detailed */}
          {activeTab === 'repairs' && (
            <div className="space-y-3">
              {filteredRepairs.length === 0 ? (
                <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-slate-800 text-slate-400">
                  <p>
                    {searchHistoryQuery
                      ? (language === 'hi' ? `"${searchHistoryQuery}" से मेल खाती कोई रिपेयरिंग नहीं मिली।` : `No repairs matched "${searchHistoryQuery}".`)
                      : (language === 'hi' ? 'कोई रिपेयर जॉब कार्ड नहीं है।' : 'No repair jobs found.')}
                  </p>
                </div>
              ) : (
                filteredRepairs.map(job => (
                  <div key={job.id} className="p-4 rounded-xl bg-slate-800/70 border border-slate-750 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">
                          {job.deviceBrand} {job.deviceModel}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-mono">
                          {job.id}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        job.status === 'delivered'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : job.status === 'ready_for_pickup'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      }`}>
                        {job.status.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>

                    <p className="text-slate-300 text-xs">
                      <strong className="text-slate-400">{language === 'hi' ? 'समस्या:' : 'Issue:'}</strong> {job.issueDescription}
                    </p>

                    {job.imeiOrSerial && (
                      <p className="text-[11px] text-slate-400 font-mono">
                        IMEI: {job.imeiOrSerial} {job.passcodePattern ? `• Passcode: ${job.passcodePattern}` : ''}
                      </p>
                    )}

                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="text-slate-400">{language === 'hi' ? 'खर्च:' : 'Cost:'}</span>{' '}
                        <strong className="text-slate-200">₹{job.finalCost || job.estimatedCost}</strong>
                        {job.advancePaid > 0 && (
                          <span className="text-emerald-400 text-[11px] ml-2">
                            (Advance: ₹{job.advancePaid})
                          </span>
                        )}
                      </div>
                      {job.partsCost !== undefined && (
                        <div>
                          <span className="text-slate-400">{language === 'hi' ? 'पार्ट्स लागत:' : 'Parts:'}</span>{' '}
                          <span className="text-slate-300">₹{job.partsCost}</span>
                        </div>
                      )}
                      {job.repairProfit !== undefined && (
                        <div>
                          <span className="text-slate-400">{language === 'hi' ? 'दुकान नफ़ा:' : 'Profit:'}</span>{' '}
                          <span className="text-emerald-400 font-bold">₹{job.repairProfit}</span>
                        </div>
                      )}
                      <div className="text-slate-400 text-[11px]">
                        {job.technicianName}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: Purchases & Invoices Detailed */}
          {activeTab === 'purchases' && (
            <div className="space-y-3">
              {filteredInvoices.length === 0 ? (
                <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-slate-800 text-slate-400">
                  <p>
                    {searchHistoryQuery
                      ? (language === 'hi' ? `"${searchHistoryQuery}" से मेल खाती कोई खरीदारी नहीं मिली।` : `No invoices matched "${searchHistoryQuery}".`)
                      : (language === 'hi' ? 'कोई बिलिंग रिकॉर्ड नहीं है।' : 'No invoices or bills found.')}
                  </p>
                </div>
              ) : (
                filteredInvoices.map(inv => (
                  <div key={inv.id} className="p-4 rounded-xl bg-slate-800/70 border border-slate-750 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">
                          {inv.invoiceNumber}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(inv.date).toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedInvoiceToView(inv);
                          setActiveModal('viewInvoice');
                        }}
                        className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>{language === 'hi' ? 'बिल देखें / प्रिंट करें' : 'View / Print Bill'}</span>
                      </button>
                    </div>

                    <div className="space-y-1">
                      {inv.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-slate-300">
                          <span>{it.title} (x{it.quantity})</span>
                          <span className="font-mono">₹{it.total}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                      <span className="text-slate-400">
                        {language === 'hi' ? 'भुगतान विधि:' : 'Payment:'} <strong className="text-slate-200 uppercase">{inv.paymentMethod}</strong>
                      </span>
                      <div className="flex items-center gap-3">
                        {inv.dueAmount > 0 && (
                          <span className="text-rose-400 font-bold">
                            Due: ₹{inv.dueAmount}
                          </span>
                        )}
                        <span className="text-sm font-black text-white">
                          Total: ₹{inv.grandTotal}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

        {/* Modal Footer with Direct Workflow Action Buttons */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateRepairForCustomer}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer transition-transform"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? '+ नया रिपेयर जॉब' : '+ New Repair Job'}</span>
            </button>

            <button
              onClick={handleCreateBillForCustomer}
              className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer transition-transform"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? '+ नया बिल बनाएं' : '+ New Sale Bill'}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
          >
            {language === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
