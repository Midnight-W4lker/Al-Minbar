import React from 'react';
import { Link } from 'react-router-dom';
import { useSettingsStore } from '@/store/useSettingsStore';

export const Header: React.FC = () => {
  const language = useSettingsStore((s) => s.language);

  return (
    <header className="md:hidden flex justify-between items-center p-4 bg-lapis-800 border-b border-gold-500/30 z-20">
      <Link to="/dashboard" className="flex items-center gap-2">
        <svg className="w-8 h-8 text-gold-500 animate-spin-slow" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L14.5 9H22L16 13.5L18.5 21L12 16.5L5.5 21L8 13.5L2 9H9.5L12 2Z" />
        </svg>
        <h1 className="text-2xl font-heading font-bold text-gold-400">Al-Minbar</h1>
      </Link>
      <div className="text-xs text-slate-400 uppercase tracking-widest">
        {language === 'en' ? 'Noor-e-Hidayat' : language === 'ur' ? 'نورِ ہدایت' : 'نور الهداية'}
      </div>
    </header>
  );
};