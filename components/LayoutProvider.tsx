import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeMode, Language } from '../types';

interface LayoutContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  translate: (key: string) => string;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

import { TRANSLATIONS } from '../constants';

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Update HTML dir and class for global styles
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Manage dark mode class on body for Tailwind
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, language]);

  const translate = (key: string): string => {
    // @ts-ignore
    return TRANSLATIONS[language][key] || key;
  };

  return (
    <LayoutContext.Provider value={{ theme, setTheme, language, setLanguage, translate }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) throw new Error("useLayout must be used within LayoutProvider");
  return context;
};
