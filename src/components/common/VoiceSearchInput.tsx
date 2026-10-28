import React, { useState, useEffect } from 'react';
import { Search, Mic, MicOff, X, AlertCircle, Volume2, Sparkles } from 'lucide-react';
import { useVoiceSearch, VoiceLanguage } from '../../hooks/useVoiceSearch';
import { useApp } from '../../context/AppContext';

interface VoiceSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  placeholderHi?: string;
  moduleName?: 'crm' | 'repair' | 'global';
  className?: string;
  inputClassName?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const VoiceSearchInput: React.FC<VoiceSearchInputProps> = ({
  value,
  onChange,
  placeholder,
  placeholderHi,
  moduleName = 'global',
  className = '',
  inputClassName = '',
  size = 'md',
}) => {
  const { language } = useApp();
  const initialVoiceLang: VoiceLanguage = language === 'hi' ? 'hi-IN' : 'en-IN';
  
  const {
    isSupported,
    isListening,
    interimTranscript,
    error,
    voiceLang,
    setVoiceLang,
    toggleListening,
    stopListening
  } = useVoiceSearch(initialVoiceLang);

  const [dismissError, setDismissError] = useState(false);

  // Sync voice recognition language if app language changes
  useEffect(() => {
    setVoiceLang(language === 'hi' ? 'hi-IN' : 'en-IN');
  }, [language, setVoiceLang]);

  // When error changes, reset dismissal
  useEffect(() => {
    if (error) {
      setDismissError(false);
    }
  }, [error]);

  const handleToggleVoice = () => {
    if (!isSupported) return;
    toggleListening((spokenText) => {
      onChange(spokenText);
    });
  };

  const handleLanguageToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextLang: VoiceLanguage = voiceLang === 'hi-IN' ? 'en-IN' : 'hi-IN';
    setVoiceLang(nextLang);
  };

  const defaultPlaceholder = language === 'hi'
    ? (placeholderHi || (moduleName === 'crm' 
        ? 'ग्राहक का नाम, मोबाइल नंबर, या मॉडल बोलें या लिखें...' 
        : moduleName === 'repair'
        ? 'टोकन #, ग्राहक नाम, मोबाइल या खराबी बोलें...'
        : 'बोलें या लिखें: ग्राहक, मॉडल, या टोकन...'))
    : (placeholder || (moduleName === 'crm'
        ? 'Speak or type customer name, phone, or model...'
        : moduleName === 'repair'
        ? 'Speak or type Job token #, model, or customer...'
        : 'Speak or type to search...'));

  const sizeClasses = {
    sm: 'py-1.5 pl-8 pr-24 text-xs',
    md: 'py-2 pl-9 pr-28 text-xs sm:text-sm',
    lg: 'py-2.5 pl-10 pr-32 text-sm sm:text-base',
  }[size];

  return (
    <div className={`relative flex flex-col ${className}`}>
      <div className="relative flex items-center w-full">
        {/* Left Search Icon */}
        <Search className={`absolute left-3 text-slate-400 pointer-events-none ${
          size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'
        }`} />

        {/* Text Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={defaultPlaceholder}
          className={`w-full bg-slate-800/90 text-slate-100 placeholder-slate-400 rounded-xl border transition-all shadow-inner focus:outline-none ${
            isListening 
              ? 'border-rose-500 ring-2 ring-rose-500/30' 
              : 'border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30'
          } ${sizeClasses} ${inputClassName}`}
        />

        {/* Right Controls: Clear, Language Badge, Mic Button */}
        <div className="absolute right-2 flex items-center gap-1">
          {/* Clear Button */}
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange('');
                if (isListening) stopListening();
              }}
              title={language === 'hi' ? 'साफ़ करें' : 'Clear search'}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Voice Language Switcher (हिन्दी / EN) */}
          {isSupported && (
            <button
              type="button"
              onClick={handleLanguageToggle}
              title={voiceLang === 'hi-IN' 
                ? 'Voice Recognition: Hindi (Click to switch to English)' 
                : 'Voice Recognition: English (Click to switch to Hindi)'}
              className={`px-1.5 py-0.5 rounded text-[10px] font-black transition-all cursor-pointer ${
                voiceLang === 'hi-IN'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
              }`}
            >
              {voiceLang === 'hi-IN' ? 'हिन्दी' : 'EN'}
            </button>
          )}

          {/* Microphone Voice Button */}
          {isSupported ? (
            <button
              type="button"
              onClick={handleToggleVoice}
              title={isListening 
                ? (language === 'hi' ? 'माइक बंद करें' : 'Stop voice search') 
                : (language === 'hi' ? 'बोलकर खोजें (Voice Search)' : 'Voice Search (Speech-to-Text)')}
              className={`relative flex items-center justify-center rounded-lg p-1.5 transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/50 scale-105'
                  : 'bg-slate-700 hover:bg-slate-650 text-slate-300 hover:text-white border border-slate-600'
              }`}
            >
              {isListening && (
                <span className="absolute -inset-0.5 rounded-lg bg-rose-500 opacity-75 animate-ping pointer-events-none" />
              )}
              <Mic className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${isListening ? 'animate-pulse text-white' : ''}`} />
            </button>
          ) : (
            <div 
              title="Voice search is not supported on this browser. Use Google Chrome or Microsoft Edge."
              className="p-1 rounded text-slate-500 opacity-60 cursor-not-allowed"
            >
              <MicOff className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      </div>

      {/* Real-time Listening Visual Feedback Bar */}
      {isListening && (
        <div className="mt-2 p-2.5 rounded-xl bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border border-rose-500/50 shadow-lg flex items-center justify-between gap-2.5 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-3 w-3 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
            </span>
            <div className="truncate">
              <span className="font-bold text-rose-300">
                {language === 'hi' 
                  ? (voiceLang === 'hi-IN' ? 'सुन रहे हैं (हिन्दी)...' : 'सुन रहे हैं (English)...')
                  : (voiceLang === 'hi-IN' ? 'Listening (Hindi)...' : 'Listening (English)...')}
              </span>
              <span className="ml-2 font-medium text-slate-200 italic">
                {interimTranscript ? `"${interimTranscript}"` : (language === 'hi' ? 'स्पष्ट बोलें...' : 'Speak now...')}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={stopListening}
            className="px-2 py-0.5 rounded-md bg-rose-800 hover:bg-rose-700 text-rose-100 text-[11px] font-bold cursor-pointer flex-shrink-0"
          >
            {language === 'hi' ? 'रोकें' : 'Stop'}
          </button>
        </div>
      )}

      {/* Voice Recognition Error Notice */}
      {error && !dismissError && (
        <div className="mt-2 p-2 rounded-xl bg-rose-950/70 border border-rose-500/40 text-[11px] text-rose-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setDismissError(true)}
            className="text-rose-400 hover:text-rose-200 text-xs px-1"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
