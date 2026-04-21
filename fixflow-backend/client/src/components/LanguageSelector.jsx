import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LANG_LABELS = {
  en: { label: 'English', flag: '🇬🇧' },
  fr: { label: 'Français', flag: '🇫🇷' },
  ar: { label: 'العربية', flag: '🇸🇦' },
};

export const LanguageSelector = () => {
  const { lang, changeLang, languages } = useLanguage();

  return (
    <div className="flex gap-2 flex-wrap">
      {languages.map((code) => (
        <button
          key={code}
          onClick={() => changeLang(code)}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all
            ${lang === code
              ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
        >
          <span>{LANG_LABELS[code].flag}</span>
          <span>{LANG_LABELS[code].label}</span>
        </button>
      ))}
    </div>
  );
};
