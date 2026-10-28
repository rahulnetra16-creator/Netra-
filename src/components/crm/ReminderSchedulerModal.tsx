import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer, Reminder, ReminderChannel, ReminderFrequency, ReminderType, RepairJob } from '../../types';
import { 
  Bell, 
  Send, 
  Calendar, 
  Clock, 
  Repeat, 
  MessageSquare, 
  Phone, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  X, 
  Share2, 
  Check, 
  Sparkles,
  ShieldCheck,
  DollarSign,
  Info
} from 'lucide-react';

interface ReminderSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillCustomer?: Customer | null;
  prefillRepair?: RepairJob | null;
}

export const ReminderSchedulerModal: React.FC<ReminderSchedulerModalProps> = ({
  isOpen,
  onClose,
  prefillCustomer,
  prefillRepair
}) => {
  const {
    customers,
    reminders,
    addReminder,
    deleteReminder,
    sendReminderNow,
    requestPushNotificationPermission,
    language,
    shopSettings,
    repairJobs
  } = useApp();

  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [deviceInfo, setDeviceInfo] = useState<string>('');
  const [type, setType] = useState<ReminderType>('pickup_ready');
  const [channel, setChannel] = useState<ReminderChannel>('all');
  const [frequency, setFrequency] = useState<ReminderFrequency>('daily');
  const [scheduledDate, setScheduledDate] = useState<string>(() => {
    const d = new Date();
    d.setHours(d.getHours() + 2);
    return d.toISOString().slice(0, 16);
  });
  const [message, setMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<string | null>(null);
  const [pushStatus, setPushStatus] = useState<'default' | 'granted' | 'denied' | 'unsupported'>('default');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Check push notification capability
  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setPushStatus('unsupported');
    } else {
      setPushStatus(Notification.permission as any);
    }
  }, [isOpen]);

  // Handle prefill customer & repair
  useEffect(() => {
    if (prefillCustomer) {
      setSelectedCustomerId(prefillCustomer.id);
      setCustomerName(prefillCustomer.name);
      setPhone(prefillCustomer.phone);
    } else if (prefillRepair) {
      setCustomerName(prefillRepair.customerName);
      setPhone(prefillRepair.phone);
      setDeviceInfo(`${prefillRepair.deviceBrand} ${prefillRepair.deviceModel}`);
    } else if (customers.length > 0 && !selectedCustomerId) {
      setSelectedCustomerId(customers[0].id);
      setCustomerName(customers[0].name);
      setPhone(customers[0].phone);
    }
  }, [prefillCustomer, prefillRepair, customers]);

  // When customer changes in dropdown
  const handleCustomerChange = (custId: string) => {
    setSelectedCustomerId(custId);
    const found = customers.find(c => c.id === custId);
    if (found) {
      setCustomerName(found.name);
      setPhone(found.phone);

      // Find any active repair for this customer
      const custRepairs = repairJobs.filter(r => r.phone === found.phone || r.customerName === found.name);
      if (custRepairs.length > 0) {
        setDeviceInfo(`${custRepairs[0].deviceBrand} ${custRepairs[0].deviceModel}`);
      }
    }
  };

  // Generate dynamic smart template message whenever parameters change
  useEffect(() => {
    const name = customerName.trim() || (language === 'hi' ? 'ग्राहक' : 'Customer');
    const device = deviceInfo.trim() || (language === 'hi' ? 'आपका मोबाइल' : 'your smartphone');
    const shopPhone = shopSettings.phone || '9699962396';
    const owner = shopSettings.ownerName || 'Rahul R Kevat';

    let tmpl = '';
    if (type === 'pickup_ready') {
      tmpl = language === 'hi'
        ? `नमस्ते ${name} जी! आपका ${device} नेत्र मोबाइल सेंटर पर सफलतापूर्वक रिपेयर हो चुका है। कृपया अपनी सुविधानुसार आकर ले जाएं। संपर्क: ${owner} (${shopPhone})`
        : `Hello ${name}! Your ${device} is successfully repaired and ready for pickup at Netra Mobile Center. Kindly visit to collect it. Contact: ${owner} (${shopPhone})`;
    } else if (type === 'followup_warranty') {
      tmpl = language === 'hi'
        ? `नमस्ते ${name} जी, नेत्र मोबाइल सेंटर से फॉलो-अप: आपके ${device} का परफॉर्मेंस कैसा चल रहा है? आपकी रिपेयरिंग वारंटी एक्टिव है। किसी भी समस्या पर तुरंत संपर्क करें: ${shopPhone}`
        : `Hello ${name}, follow-up from Netra Mobile Center: How is your ${device} performing after service? Your warranty is active. Reach us for any help: ${shopPhone}`;
    } else if (type === 'khata_due') {
      tmpl = language === 'hi'
        ? `नमस्ते ${name} जी, नेत्र मोबाइल सेंटर से आपका पिछला रिपेयरिंग/बिल का बकाया खाता बाकी है। कृपया सुविधा अनुसार भुगतान करें। धन्यवाद! संपर्क: ${owner} (${shopPhone})`
        : `Dear ${name}, courteous reminder from Netra Mobile Center regarding your pending balance. Kindly settle at your convenience. Contact: ${owner} (${shopPhone})`;
    } else {
      tmpl = language === 'hi'
        ? `नमस्ते ${name} जी, नेत्र मोबाइल सेंटर (${owner}) की ओर से विशेष सूचना। किसी भी स्मार्टफोन रिपेयर या पार्ट्स के लिए संपर्क करें: ${shopPhone}`
        : `Hello ${name}, greeting from Netra Mobile Center (${owner}). For genuine mobile repair and accessories, call: ${shopPhone}`;
    }

    setMessage(tmpl);
  }, [type, customerName, deviceInfo, language, shopSettings]);

  if (!isOpen) return null;

  const handleRequestPush = async () => {
    const granted = await requestPushNotificationPermission();
    setPushStatus(granted ? 'granted' : 'denied');
    if (granted) {
      showToast(language === 'hi' ? 'पुश नोटिफिकेशन की अनुमति मिल गई!' : 'Push notifications enabled!');
    }
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleSubmitSchedule = (e: React.FormEvent, immediateSend = false) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !message.trim()) return;

    const newRem = addReminder({
      customerId: selectedCustomerId || undefined,
      customerName: customerName.trim(),
      phone: phone.trim(),
      deviceInfo: deviceInfo.trim() || undefined,
      type,
      channel,
      frequency,
      scheduledDate: new Date(scheduledDate).toISOString(),
      message: message.trim()
    });

    if (immediateSend) {
      sendReminderNow(newRem.id);
      showToast(language === 'hi' ? 'अलर्ट सफलतापूर्वक भेजा गया एवं अनुसूची में सहेजा गया!' : 'Alert sent and recurring schedule saved!');
    } else {
      showToast(language === 'hi' ? 'रिमाइंडर सफलतापूर्वक अनुसूची में जोड़ा गया!' : 'Reminder scheduled successfully!');
    }

    setActiveTab('list');
  };

  const handleSendSingle = async (id: string) => {
    setIsSending(id);
    await sendReminderNow(id);
    setIsSending(null);
    showToast(language === 'hi' ? 'अलर्ट ग्राहक को भेजा गया!' : 'Alert dispatched to customer!');
  };

  const activeRemindersList = reminders.filter(r => r.status === 'scheduled');
  const pastRemindersList = reminders.filter(r => r.status === 'sent' || r.status === 'cancelled');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-cyan-500 p-0.5 shadow-lg shadow-cyan-950/30">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Bell className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  {language === 'hi' ? 'ग्राहक रिमाइंडर एवं स्वचालित अलर्ट' : 'Customer Alerts & Recurring Reminders'}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  {activeRemindersList.length} {language === 'hi' ? 'सक्रिय' : 'Active'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'hi'
                  ? 'पिकअप रेडी, फॉलो-अप वारंटी एवं बकाया तकादा के आवर्ती SMS, WhatsApp व Push अलर्ट।'
                  : 'Recurring alerts for ready pickups, warranty follow-ups, and khata dues.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 pt-2">
          <button
            onClick={() => setActiveTab('create')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'create'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{language === 'hi' ? '+ नया रिमाइंडर शेड्यूल करें' : '+ Schedule New Alert'}</span>
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'list'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{language === 'hi' ? 'शेड्यूल कतार' : 'Alert Queue'} ({reminders.length})</span>
          </button>
        </div>

        {/* Notification Permission Banner */}
        {pushStatus !== 'granted' && pushStatus !== 'unsupported' && (
          <div className="bg-amber-950/40 border-b border-amber-800/40 px-4 py-2.5 flex items-center justify-between text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                {language === 'hi'
                  ? 'ब्राउज़र पुश नोटिफिकेशन चालू करें ताकि स्क्रीन पर अलर्ट पॉपअप आ सके।'
                  : 'Enable Web Push Notifications to receive desktop/mobile push popups.'}
              </span>
            </div>
            <button
              onClick={handleRequestPush}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg text-[11px] cursor-pointer whitespace-nowrap"
            >
              {language === 'hi' ? 'अनुमति दें' : 'Enable Push'}
            </button>
          </div>
        )}

        {/* Toast Notification */}
        {successToast && (
          <div className="mx-4 mt-3 p-2.5 bg-emerald-950/80 border border-emerald-500/40 rounded-xl flex items-center gap-2 text-xs text-emerald-200 font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          
          {activeTab === 'create' ? (
            <form onSubmit={(e) => handleSubmitSchedule(e, false)} className="space-y-4 text-xs">
              
              {/* Customer Selection & Quick Fill */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    {language === 'hi' ? 'ग्राहक चुनें (डायरेक्टरी से)' : 'Select Customer (Directory)'}
                  </label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => handleCustomerChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:border-cyan-400 focus:outline-none cursor-pointer"
                  >
                    <option value="">{language === 'hi' ? '-- नया या डायरेक्टरी ग्राहक --' : '-- Choose Customer --'}</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.phone}) {c.cityOrArea ? `- ${c.cityOrArea}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    {language === 'hi' ? 'ग्राहक का नाम *' : 'Customer Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Vikas Kushwaha"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    {language === 'hi' ? 'मोबाइल नंबर (SMS / WhatsApp) *' : 'Mobile Phone Number *'}
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10 digit phone number"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 font-mono focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    {language === 'hi' ? 'हैंडसेट मॉडल / रिपेयर विवरण' : 'Handset Model / Repair Note'}
                  </label>
                  <div className="relative">
                    <Smartphone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={deviceInfo}
                      onChange={(e) => setDeviceInfo(e.target.value)}
                      placeholder="e.g. Samsung M14 (Folder Display)"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Alert Reason & Channel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    {language === 'hi' ? 'रिमाइंडर का उद्देश्य (Type) *' : 'Reminder Reason *'}
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ReminderType)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:border-cyan-400 focus:outline-none cursor-pointer font-medium"
                  >
                    <option value="pickup_ready">
                      {language === 'hi' ? '📱 रिपेयर तैयार (Ready for Pickup)' : '📱 Repair Ready for Pickup'}
                    </option>
                    <option value="followup_warranty">
                      {language === 'hi' ? '🛡️ सर्विस फॉलो-अप व वारंटी चेक' : '🛡️ Post-Repair Follow-up & Warranty'}
                    </option>
                    <option value="khata_due">
                      {language === 'hi' ? '💰 बकाया खाता तकादा (Khata Dues)' : '💰 Khata Payment Reminder'}
                    </option>
                    <option value="custom">
                      {language === 'hi' ? '✏️ कस्टम दुकान सूचना (Custom Notice)' : '✏️ Custom Notice'}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    {language === 'hi' ? 'वितरण माध्यम (Channel) *' : 'Delivery Channel *'}
                  </label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as ReminderChannel)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:border-cyan-400 focus:outline-none cursor-pointer font-medium"
                  >
                    <option value="all">
                      {language === 'hi' ? '🚀 ऑल-इन-वन (WhatsApp + SMS + Push)' : '🚀 Multi-Channel (WhatsApp + SMS + Push)'}
                    </option>
                    <option value="whatsapp">
                      {language === 'hi' ? '🟢 व्हाट्सएप (Direct WhatsApp Link)' : '🟢 WhatsApp Message'}
                    </option>
                    <option value="sms">
                      {language === 'hi' ? '💬 मोबाइल SMS (Cellular SMS)' : '💬 Mobile SMS'}
                    </option>
                    <option value="push">
                      {language === 'hi' ? '🔔 ब्राउज़र पुश (Web Push Notification)' : '🔔 Web Push Notification'}
                    </option>
                  </select>
                </div>
              </div>

              {/* Recurrence Frequency & Scheduled Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    {language === 'hi' ? 'आवर्ती आवृत्ति (Recurring Frequency) *' : 'Recurring Frequency *'}
                  </label>
                  <div className="relative">
                    <Repeat className="w-3.5 h-3.5 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value as ReminderFrequency)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:border-cyan-400 focus:outline-none cursor-pointer font-medium"
                    >
                      <option value="daily">
                        {language === 'hi' ? 'प्रतिदिन (Daily until pickup/payment)' : 'Daily (Every 24 Hours)'}
                      </option>
                      <option value="every_3_days">
                        {language === 'hi' ? 'हर 3 दिन (Every 3 Days)' : 'Every 3 Days'}
                      </option>
                      <option value="weekly">
                        {language === 'hi' ? 'साप्ताहिक (Weekly)' : 'Weekly (Every 7 Days)'}
                      </option>
                      <option value="once">
                        {language === 'hi' ? 'सिर्फ एक बार (Send Once)' : 'Once (One-time alert)'}
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    {language === 'hi' ? 'शेड्यूल दिनांक व समय' : 'Scheduled Date & Time'}
                  </label>
                  <div className="relative">
                    <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="datetime-local"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 font-mono focus:border-cyan-400 focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Message Box */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-400 font-semibold">
                    {language === 'hi' ? 'संदेश टेक्स्ट (ऑटो-जनरेटेड व संपादन योग्य) *' : 'Alert Message Text (Editable) *'}
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">{message.length} chars</span>
                </div>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:border-cyan-400 focus:outline-none leading-relaxed text-xs"
                />
              </div>

              {/* Actions Footer */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2.5 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  {frequency === 'once' 
                    ? (language === 'hi' ? 'एक बार भेजा जाएगा।' : 'One-time notification.')
                    : (language === 'hi' ? 'भेजने के बाद अगली तारीख अपने आप आगे बढ़ेगी।' : 'Automatically rolls over until completed.')}
                </span>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="submit"
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition-colors cursor-pointer"
                  >
                    {language === 'hi' ? 'शेड्यूल में सहेजें' : 'Save Schedule'}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleSubmitSchedule(e, true)}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-1.5 cursor-pointer transition-transform"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'तुरंत भेजें (Send Now)' : 'Send Now'}</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Queue List Tab */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{language === 'hi' ? 'सक्रिय एवं आगामी रिमाइंडर कतार' : 'Active & Upcoming Alert Queue'}</span>
                <span className="font-mono text-cyan-400">{activeRemindersList.length} pending</span>
              </div>

              {reminders.length === 0 ? (
                <div className="text-center py-10 text-slate-500 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800 p-6">
                  <Bell className="w-10 h-10 text-slate-600 mx-auto mb-2 opacity-50" />
                  <p className="font-bold">{language === 'hi' ? 'कोई निर्धारित रिमाइंडर नहीं है।' : 'No reminders scheduled.'}</p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="mt-3 px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs cursor-pointer"
                  >
                    {language === 'hi' ? '+ पहला रिमाइंडर बनाएं' : '+ Create First Alert'}
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {reminders.map((rem) => {
                    const isPickup = rem.type === 'pickup_ready';
                    const isKhata = rem.type === 'khata_due';
                    const isWarranty = rem.type === 'followup_warranty';

                    return (
                      <div
                        key={rem.id}
                        className={`p-3 rounded-2xl border transition-colors ${
                          rem.status === 'sent'
                            ? 'bg-slate-950/40 border-slate-800/80 opacity-75'
                            : 'bg-slate-800/70 border-slate-700/80 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              isPickup ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                              isKhata ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                              isWarranty ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                              'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            }`}>
                              {isPickup && <Smartphone className="w-4 h-4" />}
                              {isKhata && <DollarSign className="w-4 h-4" />}
                              {isWarranty && <ShieldCheck className="w-4 h-4" />}
                              {!isPickup && !isKhata && !isWarranty && <Bell className="w-4 h-4" />}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-xs sm:text-sm">
                                  {rem.customerName}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400">
                                  {rem.phone}
                                </span>
                                {rem.frequency !== 'once' && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30 flex items-center gap-1">
                                    <Repeat className="w-2.5 h-2.5" />
                                    {rem.frequency === 'daily' ? (language === 'hi' ? 'प्रतिदिन' : 'Daily') :
                                     rem.frequency === 'every_3_days' ? (language === 'hi' ? '3-दिन' : '3-Days') :
                                     (language === 'hi' ? 'साप्ताहिक' : 'Weekly')}
                                  </span>
                                )}
                              </div>

                              <div className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                                {rem.deviceInfo && <span className="text-cyan-400 font-medium mr-1.5">[{rem.deviceInfo}]</span>}
                                {rem.message}
                              </div>
                            </div>
                          </div>

                          {/* Trigger actions */}
                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <span className="text-[10px] text-slate-400 font-mono">
                              {rem.sentCount ? `Sent ${rem.sentCount}x` : 'Pending'}
                            </span>

                            <button
                              onClick={() => handleSendSingle(rem.id)}
                              disabled={isSending === rem.id}
                              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
                              title="Send now via WhatsApp/SMS/Push"
                            >
                              <Send className="w-3 h-3" />
                              <span>{isSending === rem.id ? 'Sending...' : (language === 'hi' ? 'भेजें' : 'Send')}</span>
                            </button>

                            <button
                              onClick={() => deleteReminder(rem.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-700/50 transition-colors cursor-pointer"
                              title="Remove reminder"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
