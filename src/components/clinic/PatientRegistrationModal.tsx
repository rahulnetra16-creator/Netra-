import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  User, 
  Phone, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  Printer, 
  Eye, 
  CreditCard,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { Patient } from '../../types';

export const PatientRegistrationModal: React.FC = () => {
  const { 
    t, 
    language, 
    activeModal, 
    setActiveModal, 
    addPatient, 
    openNotificationModal,
    setSelectedPatientForRx,
    shopSettings 
  } = useApp();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<Patient['gender']>('male');
  const [address, setAddress] = useState('');
  const [initialComplaint, setInitialComplaint] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [hasDiabetes, setHasDiabetes] = useState(false);
  const [consultationFee, setConsultationFee] = useState<number>(200);
  const [paymentMode, setPaymentMode] = useState<Patient['paymentMode']>('cash');
  const [notes, setNotes] = useState('');
  
  // Post-submit state
  const [savedPatient, setSavedPatient] = useState<Patient | null>(null);

  if (activeModal !== 'patient') return null;

  const quickComplaints = [
    { en: 'Blurry / Dim vision for distant & near', hi: 'दूर व पास का धुंधला दिखना' },
    { en: 'Headache while reading or phone screen', hi: 'पढ़ते या मोबाइल चलाते समय सिरदर्द' },
    { en: 'Watery eyes, discharge & redness', hi: 'आँखों से पानी गिरना, लाली व कीचड़' },
    { en: 'Severe itching and burning sensation', hi: 'तेज़ खुजली, जलन व चुभन' },
    { en: 'Routine optical number checkup', hi: 'रूटीन चश्मे का नंबर चेकअप' },
    { en: 'Cataract (Motiyabind) checkup', hi: 'मोतियाबिंद की जाँच (धुंधला पर्दा)' },
    { en: 'Foreign body / Dust particle irritation', hi: 'आँख में कचरा या कंकड़ चुभना' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !age || !initialComplaint.trim()) {
      return;
    }

    const newPat = addPatient({
      fullName: fullName.trim(),
      phone: phone.trim(),
      age: Number(age),
      gender,
      address: address.trim() || (language === 'hi' ? 'स्थानीय' : 'Local Area'),
      initialComplaint: initialComplaint.trim(),
      bloodPressure: bloodPressure.trim(),
      hasDiabetes,
      consultationFee: Number(consultationFee),
      paymentStatus: paymentMode === 'pending' ? 'pending' : (consultationFee === 0 ? 'free' : 'paid'),
      paymentMode,
      notes: notes.trim(),
    });

    setSavedPatient(newPat);
  };

  const handlePrintSlip = () => {
    window.print();
  };

  const handleSendSMS = () => {
    if (!savedPatient) return;
    const msg = language === 'hi'
      ? `नमस्ते ${savedPatient.fullName} जी! नेत्र मोबाइल सेंटर (आई क्लिनिक) में आपका पंजीकरण टोकन #${savedPatient.tokenNumber} (ID: ${savedPatient.id}) पर हो गया है। परामर्श शुल्क: ₹${savedPatient.consultationFee}। धन्यवाद - राहुल आर. केवट (मो. ${shopSettings.phone})`
      : `Dear ${savedPatient.fullName}, Welcome to Netra Mobile Center Eye Clinic. Your OPD Token is #${savedPatient.tokenNumber} (ID: ${savedPatient.id}). Consultation Fee: Rs.${savedPatient.consultationFee}. - Rahul R Kevat (Ph: ${shopSettings.phone})`;

    openNotificationModal({
      title: language === 'hi' ? 'ओपीडी पंजीकरण रसीद SMS/WhatsApp' : 'OPD Registration Slip SMS/WhatsApp',
      text: msg,
      recipientPhone: savedPatient.phone,
      type: 'whatsapp'
    });
  };

  const handleClose = () => {
    setSavedPatient(null);
    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {t.patientRegistration}
              </h2>
              <p className="text-xs text-emerald-100 font-normal">
                {t.patientRegistrationSubtitle}
              </p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {savedPatient ? (
          /* Success Screen with Printable OPD Token Slip */
          <div className="p-6">
            <div className="flex flex-col items-center text-center pb-5 border-b border-slate-200 dark:border-slate-700">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-400 text-emerald-600 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {t.patientSavedSuccess}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {language === 'hi' 
                  ? 'मरीज़ कतार में जुड़ गया है और ओपीडी टोकन जारी कर दिया गया है।'
                  : 'Patient added to waiting queue and token is ready for consultation.'}
              </p>
            </div>

            {/* Printable OPD Token Card */}
            <div className="my-5 p-5 bg-emerald-50/70 dark:bg-slate-800/80 border border-emerald-200 dark:border-emerald-800/60 rounded-xl print:p-8">
              <div className="flex items-start justify-between border-b border-emerald-200 dark:border-slate-700 pb-3 mb-3">
                <div>
                  <h4 className="text-base font-extrabold text-emerald-900 dark:text-emerald-300">
                    {language === 'hi' ? 'नेत्र मोबाइल सेंटर - आई क्लिनिक पर्ची' : 'Netra Mobile Center - Eye OPD Slip'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Patient ID: <span className="font-semibold text-slate-700 dark:text-slate-200">{savedPatient.id}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase text-slate-400 font-semibold block">{language === 'hi' ? 'टोकन नंबर' : 'Token No.'}</span>
                  <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">#{savedPatient.tokenNumber}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 text-xs block">{t.fullName}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{savedPatient.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 text-xs block">{t.phone}</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{savedPatient.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 text-xs block">{t.age} / {t.gender}</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{savedPatient.age} Y / {savedPatient.gender}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 dark:text-slate-400 text-xs block">{t.initialEyeComplaint}</span>
                  <span className="font-medium text-emerald-900 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-950 px-2 py-0.5 rounded inline-block">
                    {savedPatient.initialComplaint}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 text-xs block">{t.consultationFee}</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹{savedPatient.consultationFee} ({savedPatient.paymentMode.toUpperCase()})</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedPatientForRx(savedPatient);
                  setActiveModal('prescription');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>{language === 'hi' ? 'अभी चश्मे का नंबर / Rx लिखें' : 'Create Optical Rx Now'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSendSMS}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm rounded-xl font-medium transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-500" />
                  <span>WhatsApp / SMS</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrintSlip}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm rounded-xl font-medium transition-colors"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  <span>{language === 'hi' ? 'पर्ची प्रिंट' : 'Print Slip'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white text-xs sm:text-sm rounded-xl font-semibold transition-colors"
                >
                  {language === 'hi' ? 'समाप्त' : 'Done'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Patient Registration Form */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[82vh] overflow-y-auto">
            {/* Row 1: Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.fullName} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={language === 'hi' ? 'उदा. अमित वर्मा' : 'e.g., Amit Verma'}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.phone} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit Mobile Number"
                    maxLength={13}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Age, Gender, Address */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.age} <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 45"
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:outline-none dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.gender}
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Patient['gender'])}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:outline-none dark:text-white"
                >
                  <option value="male">{t.male}</option>
                  <option value="female">{t.female}</option>
                  <option value="other">{t.other}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.address}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={language === 'hi' ? 'शहर / गाँव का नाम' : 'City / Village'}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:outline-none dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Initial Eye Complaint (Chief Complaint) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.initialEyeComplaint} <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={initialComplaint}
                onChange={(e) => setInitialComplaint(e.target.value)}
                placeholder={t.complaintPlaceholder}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:text-white"
              />

              {/* Quick Clickable Complaint Suggestions */}
              <div className="mt-1.5">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 mb-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  {t.commonComplaints}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {quickComplaints.map((item, idx) => {
                    const label = language === 'hi' ? item.hi : item.en;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setInitialComplaint(prev => prev ? `${prev}, ${label}` : label);
                        }}
                        className="text-[11px] px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 transition-colors cursor-pointer"
                      >
                        + {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Row 4: Medical History (Diabetes, BP) */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                {t.medicalHistory} (Optional)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={hasDiabetes}
                    onChange={(e) => setHasDiabetes(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <span>{t.hasDiabetes} (Diabetic Retinopathy check)</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 whitespace-nowrap">{t.bloodPressure}:</span>
                  <input
                    type="text"
                    value={bloodPressure}
                    onChange={(e) => setBloodPressure(e.target.value)}
                    placeholder="e.g. 120/80"
                    className="w-28 px-2 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Row 5: Consultation Fee & Payment Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.consultationFee}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min={0}
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:outline-none dark:text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.paymentMode}
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value as Patient['paymentMode'])}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:outline-none dark:text-white"
                  >
                    <option value="cash">{t.cash}</option>
                    <option value="upi">{t.upi}</option>
                    <option value="card">{t.card}</option>
                    <option value="pending">{t.pending}</option>
                    <option value="free">{t.free}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Row 6: Additional Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'hi' ? 'विशेष टिप्पणी (पुराने चश्मे का विवरण आदि)' : 'Special Notes / History'}
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={language === 'hi' ? 'उदा. पहले +1.50 का चश्मा लगाते थे' : 'e.g., Using +1.50 reading glasses earlier'}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none dark:text-white"
              />
            </div>

            {/* Submit Buttons */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              >
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-700/20 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.savePatient}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
