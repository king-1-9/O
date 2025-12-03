import React from 'react';
import { useLayout } from './LayoutProvider';
import { THEMES, LOGO_URL } from '../constants';
import { Github, Mail, Send, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const { theme, translate } = useLayout();
  const themeColors = THEMES[theme];

  return (
    <footer id="contact" className={`py-10 border-t ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="text-center md:text-start rtl:md:text-right">
             <div className="mb-2 flex justify-center md:justify-start rtl:md:justify-end">
                <img src={LOGO_URL} alt="Logo" className="h-8 w-auto object-contain opacity-80" />
             </div>
             <p className="text-gray-500 text-sm max-w-xs">{translate('copyright')}</p>
          </div>

          <div className="flex gap-4">
             <a href="#" className={`p-3 rounded-full transition hover:-translate-y-1 shadow-md ${themeColors.card} ${themeColors.text}`}>
               <Send size={20} />
             </a>
             <a href="#" className={`p-3 rounded-full transition hover:-translate-y-1 shadow-md ${themeColors.card} ${themeColors.text}`}>
               <Instagram size={20} />
             </a>
             <a href="#" className={`p-3 rounded-full transition hover:-translate-y-1 shadow-md ${themeColors.card} ${themeColors.text}`}>
               <Mail size={20} />
             </a>
             <a href="#" className={`p-3 rounded-full transition hover:-translate-y-1 shadow-md ${themeColors.card} ${themeColors.text}`}>
               <Github size={20} />
             </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;