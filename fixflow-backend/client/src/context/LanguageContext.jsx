import React, { createContext, useContext, useState } from 'react';
import { translations } from '../lib/translations';

const LanguageContext = createContext(undefined);

const SUPPORTED = ['en', 'fr', 'ar'];

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState(() => {
        const saved = localStorage.getItem('fixflow_lang');
        return SUPPORTED.includes(saved) ? saved : 'en';
    });

    const changeLang = (newLang) => {
        if (!SUPPORTED.includes(newLang)) return;
        localStorage.setItem('fixflow_lang', newLang);
        setLang(newLang);
    };

    const t = (key) => translations[lang]?.[key] ?? translations['en']?.[key] ?? key;
    const isRTL = lang === 'ar';

    return (
        <LanguageContext.Provider value={{ lang, t, isRTL, changeLang, languages: SUPPORTED }}>
            <div dir={isRTL ? 'rtl' : 'ltr'}>
                {children}
            </div>
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) throw new Error('useLanguage must be used within a LanguageProvider');
    return context;
};
