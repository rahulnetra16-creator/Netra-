import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, MessageSquare, Copy, Check, Send, ExternalLink, Phone } from 'lucide-react';

export const NotificationModal: React.FC = () => {
  const { activeModal, setActiveModal, notificationMessage, language } = useApp();
  const [copied, setCopied] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (activeModal !== 'notification' || !notificationMessage) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(notificationMessage.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    // Format Indian phone number if needed (strip spaces, add 91 if 10 digits)
    let cleanPhone = notificationMessage.recipientPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = `91${cleanPhone}`;
    }
    const encodedText = encodeURIComponent(notificationMessage.text);
    const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
    
    // Attempt window open
    try {
      window.open(waUrl, '_blank');
    } catch {
      // Fallback
    }
    setSentSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-emerald-200" />
            <h3 className="font-bold text-sm sm:text-base">
              {notificationMessage.title}
            </h3>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1 rounded-lg text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              Recipient: <strong className="text-slate-800 dark:text-slate-200 font-mono">{notificationMessage.recipientPhone}</strong>
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold text-[11px]">
              WhatsApp & SMS Ready
            </span>
          </div>

          {/* Message Textbox preview styled like WhatsApp chat bubble */}
          <div className="p-4 bg-emerald-50 dark:bg-slate-800/80 rounded-xl border border-emerald-200 dark:border-emerald-800/60 font-sans text-xs sm:text-sm text-slate-800 dark:text-slate-100 whitespace-pre-wrap leading-relaxed shadow-inner">
            {notificationMessage.text}
          </div>

          {sentSuccess && (
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-xs rounded-xl flex items-center gap-2 border border-emerald-300 font-medium">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>
                {language === 'hi' 
                  ? 'संदेश व्हाट्सएप पर प्रेषित होने के लिए तैयार है!' 
                  : 'Message ready to send on WhatsApp!'}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-3 py-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white"
              >
                Close
              </button>
              <button
                onClick={handleOpenWhatsApp}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md cursor-pointer transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send WhatsApp</span>
                <ExternalLink className="w-3 h-3 text-emerald-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
