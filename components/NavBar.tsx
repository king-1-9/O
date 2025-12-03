import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, User, Menu, X, Globe, Settings } from 'lucide-react';
import { useLayout } from './LayoutProvider';
import { THEMES, LOGO_URL } from '../constants';
import { ThemeMode } from '../types';

const NavBar: React.FC = () => {
  const { theme, setTheme, language, setLanguage, translate } = useLayout();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const themeColors = THEMES[theme];

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
  };

  // Handle Hash Scrolling
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  const navLinks = [
    { path: '/', label: 'home' },
    { path: '/subjects', label: 'subjects' },
    { path: '/#about', label: 'aboutUs' },
    { path: '/#contact', label: 'contactUs' },
  ];

  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <nav className={`sticky top-0 z-40 backdrop-blur-md shadow-md transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900/90 border-b border-gray-700' : 'bg-white/90 border-b border-gray-200'
    }`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
           <img 
             src={LOGO_URL} 
             alt="Logo" 
             className="h-10 md:h-12 w-auto object-contain" 
           />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {!isAdmin && navLinks.map(link => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`font-medium hover:opacity-75 transition ${themeColors.text}`}
            >
              {translate(link.label)}
            </Link>
          ))}

          <div className="h-6 w-px bg-gray-300 mx-2"></div>

          {/* Theme Controls */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
            <button onClick={() => handleThemeChange('light')} title="Light" className={`p-1.5 rounded-full transition ${theme === 'light' ? 'bg-white shadow' : ''}`}>
              <Sun size={16} className="text-yellow-500" />
            </button>
            <button onClick={() => handleThemeChange('dark')} title="Dark" className={`p-1.5 rounded-full transition ${theme === 'dark' ? 'bg-gray-700 shadow' : ''}`}>
              <Moon size={16} className="text-blue-300" />
            </button>
            <button onClick={() => handleThemeChange('boy')} title="Boy" className={`p-1.5 rounded-full transition ${theme === 'boy' ? 'bg-white shadow' : ''}`}>
               <span className="block w-4 h-4 bg-blue-500 rounded-full"></span>
            </button>
            <button onClick={() => handleThemeChange('girl')} title="Girl" className={`p-1.5 rounded-full transition ${theme === 'girl' ? 'bg-white shadow' : ''}`}>
               <span className="block w-4 h-4 bg-pink-500 rounded-full"></span>
            </button>
          </div>

          {/* Language Switch */}
          <button 
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full border ${theme === 'dark' ? 'border-gray-600 text-white' : 'border-gray-300 text-gray-700'}`}
          >
            <Globe size={16} />
            <span className="uppercase text-xs font-bold">{language}</span>
          </button>

          {/* Admin Link */}
          <Link to="/admin/login" className={`p-2 rounded-full hover:bg-opacity-80 transition ${themeColors.secondary}`}>
            <User size={20} className={theme === 'dark' ? 'text-white' : 'text-gray-700'} />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} className={themeColors.text} /> : <Menu size={24} className={themeColors.text} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className={`md:hidden p-4 border-t ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'}`}>
           <div className="flex flex-col space-y-4">
             {!isAdmin && navLinks.map(link => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  className={`font-medium ${themeColors.text}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {translate(link.label)}
                </Link>
              ))}
               {/* Mobile Controls */}
               <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className={themeColors.text}>Mode</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleThemeChange('light')}><Sun size={20} className="text-yellow-500"/></button>
                    <button onClick={() => handleThemeChange('dark')}><Moon size={20} className="text-blue-300"/></button>
                    <button onClick={() => handleThemeChange('boy')} className="w-5 h-5 bg-blue-500 rounded-full"></button>
                    <button onClick={() => handleThemeChange('girl')} className="w-5 h-5 bg-pink-500 rounded-full"></button>
                  </div>
               </div>
               <div className="flex justify-between items-center">
                  <span className={themeColors.text}>Language</span>
                  <button onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} className={`font-bold ${themeColors.text}`}>{language === 'en' ? 'Arabic' : 'English'}</button>
               </div>
               
               {/* Admin Link for Mobile */}
               <Link 
                 to="/admin/login" 
                 className={`flex items-center gap-2 p-2 rounded-lg ${themeColors.secondary}`}
                 onClick={() => setIsMenuOpen(false)}
               >
                 <User size={20} className={themeColors.text} />
                 <span className={themeColors.text}>Admin / Login</span>
               </Link>
           </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;