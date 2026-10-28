import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Phone, 
  KeyRound, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  UserCheck, 
  ArrowRight,
  RefreshCw 
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    userSession, 
    loginWithOtp, 
    logout, 
    language,
    shopSettings 
  } = useApp();

  const [phone, setPhone] = useState('9699962396');
  const [name, setName] = useState('Rahul R Kevat');
  const [role, setRole] = useState<'Owner' | 'Technician' | 'Doctor'>('Owner');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    let timer: any;
    if (otpSent && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, countdown]);

  if (activeModal !== 'login') return null;

  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phone || phone.length < 10) {
      setErrorMsg(language === 'hi' ? 'कृपया सही 10 अंकों का मोबाइल नंबर डालें' : 'Please enter valid 10-digit mobile number');
      return;
    }

    // Generate easy OTP for 9699962396 or random 4-digit
    const newOtp = phone === '9699962396' ? '9696' : Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);
    setOtpSent(true);
    setErrorMsg('');
    setCountdown(30);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp !== generatedOtp) {
      setErrorMsg(language === 'hi' ? 'अमान्य ओटीपी! कृपया सही ओटीपी दर्ज करें।' : 'Invalid OTP! Please enter correct OTP.');
      return;
    }

    loginWithOtp(phone, name, role);
    setActiveModal(null);
  };

  const handleAutoFill = () => {
    setEnteredOtp(generatedOtp);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white relative">
          <button 
            onClick={() => setActiveModal(null)}
            className="absolute right-4 top-4 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-white p-1 flex items-center justify-center mb-3 shadow-md overflow-hidden">
            <img 
              src="/assets/aistudio/large__1__865785a2.png" 
              alt="Mobile Netra Repering" 
              className="w-full h-full object-contain"
            />
          </div>

          <h2 className="text-xl font-black">
            {language === 'hi' ? 'संचालक एवं एडमिन लॉगिन' : 'Admin & Staff Login'}
          </h2>
          <p className="text-xs text-emerald-100 mt-0.5">
            {shopSettings.shopName} • {language === 'hi' ? 'सुरक्षित ओटीपी प्रमाणीकरण' : 'Secure OTP Authentication'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {userSession.isLoggedIn ? (
            /* Already logged in screen */
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
                <UserCheck className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-800 dark:text-white">
                  {userSession.name} ({userSession.role})
                </h3>
                <p className="text-xs font-mono text-slate-500 mt-0.5">
                  Mobile: {userSession.phone}
                </p>
                <span className="inline-block mt-2 px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  ✓ Verified Active Session
                </span>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2.5 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
                >
                  {language === 'hi' ? 'डैशबोर्ड पर जाएँ' : 'Go to Dashboard'}
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="py-2.5 px-4 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 rounded-xl text-xs font-bold border border-rose-200 dark:border-rose-900 hover:bg-rose-100"
                >
                  {language === 'hi' ? 'लॉगआउट' : 'Logout'}
                </button>
              </div>
            </div>
          ) : !otpSent ? (
            /* Step 1: Phone input */
            <form onSubmit={handleSendOtp} className="space-y-4">
              {/* Quick Preset for 9699962396 */}
              <div 
                onClick={() => {
                  setPhone('9699962396');
                  setName('Rahul R Kevat');
                  setRole('Owner');
                }}
                className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl cursor-pointer hover:bg-emerald-100/70 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                      {language === 'hi' ? 'राहुल आर. केवट (संचालक)' : 'Rahul R Kevat (Owner / Admin)'}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    9699962396
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {language === 'hi' ? 'क्लिक करके यह नंबर चुनें और ओटीपी भेजें' : 'Click to select this phone number and send OTP'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'hi' ? 'मोबाइल नंबर (10 अंक)' : 'Mobile Number'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-slate-400 font-bold">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="9699962396"
                    className="w-full pl-12 pr-3 py-2.5 text-sm font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:outline-none dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'hi' ? 'नाम' : 'Your Name'}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'hi' ? 'पद / रोल' : 'Role'}
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
                  >
                    <option value="Owner">Owner / संचालक</option>
                    <option value="Technician">Technician / तकनीशियन</option>
                    <option value="Doctor">Doctor / डॉक्टर</option>
                  </select>
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-500 font-medium">{errorMsg}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>{language === 'hi' ? 'ओटीपी भेजें (Send OTP)' : 'Send Verification OTP'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Step 2: OTP Entry */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              {/* Simulated SMS Notification Alert */}
              <div className="p-3.5 bg-emerald-50 dark:bg-slate-800/90 border border-emerald-300 dark:border-emerald-700 rounded-2xl shadow-inner">
                <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-bold mb-1">
                  <span>📩 SMS Gateway Notification:</span>
                  <span className="font-mono">{phone}</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {language === 'hi' 
                    ? `नेत्र मोबाइल सेंटर: आपका लॉगिन ओटीपी है: `
                    : `Netra Mobile Center: Your login OTP is: `}
                  <strong className="font-mono text-emerald-700 dark:text-emerald-400 font-black text-sm bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded ml-1 tracking-widest">
                    {generatedOtp}
                  </strong>
                </p>
                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleAutoFill}
                    className="text-[11px] font-bold text-teal-700 dark:text-teal-300 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    {language === 'hi' ? 'ऑटो-फिल ओटीपी (Auto-fill)' : 'Auto-fill OTP'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'hi' ? '4-अंकों का ओटीपी दर्ज करें' : 'Enter 4-Digit OTP'}
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    placeholder="e.g. 9696"
                    className="w-full pl-10 pr-3 py-2.5 text-center text-lg font-mono font-black tracking-widest bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:outline-none dark:text-white"
                  />
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-500 font-medium">{errorMsg}</p>
              )}

              <div className="flex items-center justify-between text-xs text-slate-500">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="hover:underline text-slate-600 dark:text-slate-400"
                >
                  {language === 'hi' ? '← नंबर बदलें' : '← Change Phone'}
                </button>
                {countdown > 0 ? (
                  <span>Resend in {countdown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    className="text-emerald-600 font-bold hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'hi' ? 'सत्यापित करें व लॉगिन करें' : 'Verify & Login'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
