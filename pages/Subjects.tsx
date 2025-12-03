import React from 'react';
import { Link } from 'react-router-dom';
import { useLayout } from '../components/LayoutProvider';
import { THEMES } from '../constants';
import { StorageService } from '../services/storageService';
import { Book, Code, Calculator, Database, Cpu, Globe, Shield } from 'lucide-react';

const iconMap: any = { Book, Code, Calculator, Database, Cpu, Globe, Shield };

const Subjects: React.FC = () => {
  const { theme, translate, language } = useLayout();
  const themeColors = THEMES[theme];
  const subjects = StorageService.getSubjects();

  return (
    <div className={`min-h-screen py-10 px-4 ${themeColors.bg}`}>
      <div className="container mx-auto">
        <h1 className={`text-4xl font-bold mb-10 text-center ${themeColors.text}`}>{translate('subjects')}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subjects.map((sub) => {
            const Icon = iconMap[sub.icon] || Book;
            const fileCount = StorageService.getFiles(sub.id).length;
            
            return (
              <Link 
                key={sub.id} 
                to={`/subjects/${sub.id}`}
                className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${themeColors.card}`}
              >
                 {/* Card Header Background */}
                 <div className={`h-32 ${themeColors.secondary} flex items-center justify-center transition-colors group-hover:${themeColors.primary}`}>
                    <Icon size={64} className={`${theme === 'dark' ? 'text-white' : themeColors.text} opacity-50 group-hover:text-white group-hover:scale-110 transition duration-300`} />
                 </div>
                 
                 {/* Content */}
                 <div className="p-6">
                    <h3 className={`text-xl font-bold mb-2 ${themeColors.text}`}>
                      {language === 'en' ? sub.nameEn : sub.nameAr}
                    </h3>
                    <p className={`text-sm mb-4 opacity-70 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                       {language === 'en' ? sub.descriptionEn : sub.descriptionAr}
                    </p>
                    
                    <div className="flex justify-between items-center text-sm font-medium opacity-60">
                       <span>{fileCount} {translate('files')}</span>
                       <span className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">→</span>
                    </div>
                 </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Subjects;
