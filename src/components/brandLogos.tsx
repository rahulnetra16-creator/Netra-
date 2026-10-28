import React from 'react';

export interface BrandMeta {
  id: string;
  name: string;
  displayName: string;
  color: string;
  bgColor: string;
  textColor: string;
}

export const mobileBrandsList: BrandMeta[] = [
  { id: 'redmi', name: 'Redmi', displayName: 'Redmi / Xiaomi', color: '#FF6900', bgColor: 'bg-orange-500/10 border-orange-500/40', textColor: 'text-orange-500' },
  { id: 'samsung', name: 'Samsung', displayName: 'Samsung', color: '#1428A0', bgColor: 'bg-blue-600/10 border-blue-600/40', textColor: 'text-blue-500' },
  { id: 'vivo', name: 'Vivo', displayName: 'Vivo', color: '#415FFF', bgColor: 'bg-indigo-500/10 border-indigo-500/40', textColor: 'text-indigo-400' },
  { id: 'realme', name: 'Realme', displayName: 'Realme', color: '#FFC800', bgColor: 'bg-amber-400/10 border-amber-400/40', textColor: 'text-amber-400' },
  { id: 'oppo', name: 'Oppo', displayName: 'Oppo', color: '#008C5E', bgColor: 'bg-emerald-500/10 border-emerald-500/40', textColor: 'text-emerald-400' },
  { id: 'oneplus', name: 'OnePlus', displayName: 'OnePlus', color: '#EB0028', bgColor: 'bg-red-500/10 border-red-500/40', textColor: 'text-red-500' },
  { id: 'apple', name: 'Apple', displayName: 'Apple iPhone', color: '#A2AAAD', bgColor: 'bg-slate-500/10 border-slate-400/40', textColor: 'text-slate-300' },
  { id: 'motorola', name: 'Motorola', displayName: 'Motorola (Moto)', color: '#001489', bgColor: 'bg-blue-500/10 border-blue-500/40', textColor: 'text-blue-400' },
  { id: 'poco', name: 'Poco', displayName: 'Poco', color: '#FFDF00', bgColor: 'bg-yellow-400/10 border-yellow-400/40', textColor: 'text-yellow-400' },
  { id: 'infinix', name: 'Infinix', displayName: 'Infinix / Tecno', color: '#49B649', bgColor: 'bg-green-500/10 border-green-500/40', textColor: 'text-green-400' },
  { id: 'google', name: 'Google', displayName: 'Google Pixel', color: '#4285F4', bgColor: 'bg-cyan-500/10 border-cyan-500/40', textColor: 'text-cyan-400' },
];

export const BrandLogo: React.FC<{ brand: string; className?: string; size?: 'sm' | 'md' | 'lg' }> = ({ brand, className = '', size = 'md' }) => {
  const normalized = (brand || '').toLowerCase();

  const sizeClasses = {
    sm: 'w-5 h-5 text-[9px]',
    md: 'w-7 h-7 text-[11px]',
    lg: 'w-9 h-9 text-xs',
  }[size];

  if (normalized.includes('apple') || normalized.includes('iphone')) {
    return (
      <div className={`inline-flex items-center justify-center rounded-lg bg-slate-800 border border-slate-600 text-slate-200 font-bold ${sizeClasses} ${className}`} title="Apple">
        <svg className="w-3/5 h-3/5 fill-current" viewBox="0 0 170 170">
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.33-6.42-9.78-11.45-20.76-15.08-32.96-3.63-12.2-5.44-23.77-5.44-34.72 0-14.13 3.58-25.86 10.74-35.19 7.16-9.33 16.2-14.16 27.13-14.49 4.35 0 9.29 1.15 14.83 3.44 5.54 2.29 9.38 3.51 11.51 3.66 1.74-.15 5.79-1.47 12.16-3.97 6.37-2.5 11.83-3.63 16.38-3.39 12.38.65 22.42 5.37 30.12 14.16-10.77 6.53-16.03 15.49-15.79 26.89.24 9.14 3.69 16.73 10.35 22.77 6.66 6.04 14.54 9.42 23.64 10.14-2.29 7.08-5.28 14.49-8.98 22.24zM119.22 33.64c0-7.39 2.66-14.24 7.98-20.55 5.32-6.31 11.96-10.35 19.92-12.13.76 2.61 1.14 5.22 1.14 7.83 0 7.39-2.77 14.34-8.31 20.85-5.54 6.51-12.38 10.46-20.52 11.85-.08-2.6-.21-5.21-.21-7.85z" />
        </svg>
      </div>
    );
  }

  if (normalized.includes('samsung')) {
    return (
      <div className={`inline-flex items-center justify-center rounded-lg bg-blue-950 border border-blue-600 text-white font-black tracking-tighter ${sizeClasses} ${className}`} title="Samsung">
        <span className="scale-75 font-black uppercase text-[10px] tracking-tighter text-blue-300">SAMS</span>
      </div>
    );
  }

  if (normalized.includes('redmi') || normalized.includes('xiaomi') || normalized.includes('mi')) {
    return (
      <div className={`inline-flex items-center justify-center rounded-lg bg-orange-600 border border-orange-400 text-white font-extrabold ${sizeClasses} ${className}`} title="Redmi / Xiaomi">
        <span className="text-[11px] font-black tracking-tight">mi</span>
      </div>
    );
  }

  if (normalized.includes('vivo')) {
    return (
      <div className={`inline-flex items-center justify-center rounded-lg bg-indigo-900 border border-indigo-400 text-indigo-200 font-extrabold ${sizeClasses} ${className}`} title="Vivo">
        <span className="text-[10px] italic font-black">vivo</span>
      </div>
    );
  }

  if (normalized.includes('realme')) {
    return (
      <div className={`inline-flex items-center justify-center rounded-lg bg-amber-400 border border-amber-300 text-slate-950 font-black ${sizeClasses} ${className}`} title="Realme">
        <span className="text-[11px] font-black lowercase">r</span>
      </div>
    );
  }

  if (normalized.includes('oppo')) {
    return (
      <div className={`inline-flex items-center justify-center rounded-lg bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold ${sizeClasses} ${className}`} title="Oppo">
        <span className="text-[10px] font-extrabold lowercase">oppo</span>
      </div>
    );
  }

  if (normalized.includes('oneplus')) {
    return (
      <div className={`inline-flex items-center justify-center rounded-lg bg-red-600 border border-red-400 text-white font-black ${sizeClasses} ${className}`} title="OnePlus">
        <span className="text-[11px] font-black">1+</span>
      </div>
    );
  }

  if (normalized.includes('moto')) {
    return (
      <div className={`inline-flex items-center justify-center rounded-lg bg-blue-900 border border-blue-500 text-cyan-300 font-black ${sizeClasses} ${className}`} title="Motorola">
        <span className="text-[11px] font-black italic">M</span>
      </div>
    );
  }

  if (normalized.includes('poco')) {
    return (
      <div className={`inline-flex items-center justify-center rounded-lg bg-yellow-400 border border-yellow-300 text-slate-950 font-black ${sizeClasses} ${className}`} title="Poco">
        <span className="text-[9px] font-black uppercase tracking-tighter">POCO</span>
      </div>
    );
  }

  if (normalized.includes('google') || normalized.includes('pixel')) {
    return (
      <div className={`inline-flex items-center justify-center rounded-lg bg-slate-900 border border-cyan-500 text-cyan-400 font-black ${sizeClasses} ${className}`} title="Google Pixel">
        <span className="text-[11px] font-black">G</span>
      </div>
    );
  }

  // Fallback generic phone icon badge
  return (
    <div className={`inline-flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-amber-400 font-bold ${sizeClasses} ${className}`} title={brand}>
      <span className="text-[10px] font-bold uppercase">{brand.slice(0, 2) || 'PH'}</span>
    </div>
  );
};
