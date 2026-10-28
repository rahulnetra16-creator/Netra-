import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer, CustomerType } from '../../types';
import { User, Phone, MapPin, FileText, Check, X, Building, ShieldCheck } from 'lucide-react';

interface CustomerModalProps {
  customerToEdit?: Customer | null;
  onClose?: () => void;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({ customerToEdit, onClose }) => {
  const { activeModal, setActiveModal, language, addCustomer, updateCustomer } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [address, setAddress] = useState('');
  const [cityOrArea, setCityOrArea] = useState('');
  const [customerType, setCustomerType] = useState<CustomerType>('regular');
  const [notes, setNotes] = useState('');
  const [gstin, setGstin] = useState('');
  const [error, setError] = useState('');

  const isOpen = activeModal === 'customer';

  useEffect(() => {
    if (customerToEdit) {
      setName(customerToEdit.name || '');
      setPhone(customerToEdit.phone || '');
      setAltPhone(customerToEdit.altPhone || '');
      setAddress(customerToEdit.address || '');
      setCityOrArea(customerToEdit.cityOrArea || '');
      setCustomerType(customerToEdit.customerType || 'regular');
      setNotes(customerToEdit.notes || '');
      setGstin(customerToEdit.gstin || '');
    } else {
      setName('');
      setPhone('');
      setAltPhone('');
      setAddress('');
      setCityOrArea('');
      setCustomerType('regular');
      setNotes('');
      setGstin('');
    }
    setError('');
  }, [customerToEdit, isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setActiveModal(null);
    if (onClose) onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(language === 'hi' ? 'कृपया ग्राहक का नाम दर्ज करें' : 'Please enter customer name');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setError(language === 'hi' ? 'कृपया मान्य 10 अंकों का मोबाइल नंबर दर्ज करें' : 'Please enter valid 10-digit mobile number');
      return;
    }

    if (customerToEdit) {
      updateCustomer(customerToEdit.id, {
        name: name.trim(),
        phone: phone.trim(),
        altPhone: altPhone.trim() || undefined,
        address: address.trim() || undefined,
        cityOrArea: cityOrArea.trim() || undefined,
        customerType,
        notes: notes.trim() || undefined,
        gstin: gstin.trim() || undefined,
      });
    } else {
      addCustomer({
        name: name.trim(),
        phone: phone.trim(),
        altPhone: altPhone.trim() || undefined,
        address: address.trim() || undefined,
        cityOrArea: cityOrArea.trim() || undefined,
        customerType,
        notes: notes.trim() || undefined,
        gstin: gstin.trim() || undefined,
      });
    }

    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-950/40 border border-white/20 flex items-center justify-center">
              <User className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                {customerToEdit
                  ? (language === 'hi' ? 'ग्राहक जानकारी संपादित करें' : 'Edit Customer Contact Details')
                  : (language === 'hi' ? 'नया ग्राहक जोड़ें (CRM)' : 'Add New Customer Profile')}
              </h3>
              <p className="text-xs text-blue-100/90">
                {language === 'hi' ? 'नेत्र मोबाइल सेंटर • ग्राहक डायरेक्टरी' : 'Netra Mobile Center • Customer Directory'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-950/30 hover:bg-slate-950/60 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-xs">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-500/50 text-rose-300 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Full Name & Phone Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {language === 'hi' ? 'ग्राहक का नाम *' : 'Customer Name *'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={language === 'hi' ? 'उदा. रोहित शर्मा' : 'e.g. Rohit Sharma'}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {language === 'hi' ? 'मोबाइल नंबर (10 अंक) *' : 'Mobile Phone (10 digits) *'}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Alternate Phone & Customer Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {language === 'hi' ? 'वैकल्पिक फोन (घर / रिश्तेदार)' : 'Alternate Phone (Optional)'}
              </label>
              <input
                type="tel"
                value={altPhone}
                onChange={(e) => setAltPhone(e.target.value)}
                placeholder={language === 'hi' ? 'वैकल्पिक संपर्क' : 'Alternate contact'}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {language === 'hi' ? 'ग्राहक श्रेणी (Category)' : 'Customer Category'}
              </label>
              <select
                value={customerType}
                onChange={(e) => setCustomerType(e.target.value as CustomerType)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:border-cyan-400 focus:outline-none cursor-pointer"
              >
                <option value="regular">{language === 'hi' ? 'नियमित ग्राहक (Regular)' : 'Regular Customer'}</option>
                <option value="vip">{language === 'hi' ? 'विशेष ग्राहक (VIP / Premium)' : 'VIP / Premium Customer'}</option>
                <option value="retail">{language === 'hi' ? 'रिटेल ग्राहक (Walk-in Retail)' : 'Retail Walk-in'}</option>
                <option value="wholesaler">{language === 'hi' ? 'थोक व्यापारी (Wholesaler)' : 'Wholesaler'}</option>
                <option value="technician">{language === 'hi' ? 'कारीगर / सब-डीलर (Technician)' : 'Technician Sub-dealer'}</option>
              </select>
            </div>
          </div>

          {/* City / Area & Full Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {language === 'hi' ? 'मोहल्ला / कस्बा / वार्ड' : 'Area / Locality / Town'}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={cityOrArea}
                  onChange={(e) => setCityOrArea(e.target.value)}
                  placeholder={language === 'hi' ? 'उदा. स्टेशन रोड, वार्ड 5' : 'e.g. Station Road'}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {language === 'hi' ? 'GSTIN नंबर (यदि लागू हो)' : 'GSTIN (Optional)'}
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  placeholder="09AAECN1234F1Z5"
                  className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 font-mono uppercase focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              {language === 'hi' ? 'पूरा पता (Full Address)' : 'Full Address'}
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={language === 'hi' ? 'दुकान, घर या लैंडमार्क पता' : 'Home/Shop address with landmark'}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {/* Notes & Handset History */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              {language === 'hi' ? 'विशेष टिप्पणी (Notes, पसंदीदा मोबाइल मॉडल, छूट आदि)' : 'Customer Notes (Handset preference, discount terms)'}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={language === 'hi' ? 'उदा. हमेशा ओरिजिनल डिस्प्ले फोल्डर लगवाते हैं, 5% छूट मान्य...' : 'e.g. Prefers original OLED displays, always clears dues promptly...'}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none resize-none"
            />
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              {language === 'hi' ? 'लोकल सिक्योर डेटाबेस' : 'Secure Local CRM'}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold cursor-pointer transition-colors"
              >
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-cyan-900/40 cursor-pointer transition-transform"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>{customerToEdit ? (language === 'hi' ? 'अपडेट करें' : 'Save Changes') : (language === 'hi' ? 'ग्राहक सहेजें' : 'Save Customer')}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
