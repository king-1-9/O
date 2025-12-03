import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLayout } from '../components/LayoutProvider';
import { THEMES } from '../constants';
import { StorageService } from '../services/storageService';
import { StudyFile, Subject } from '../types';
import { Download, Star, FileText, Video, ArrowLeft } from 'lucide-react';
import LoadingLogo from '../components/LoadingLogo';

const SubjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { theme, translate, language } = useLayout();
  const themeColors = THEMES[theme];
  
  const [subject, setSubject] = useState<Subject | null>(null);
  const [files, setFiles] = useState<StudyFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for effect
    setLoading(true);
    const timer = setTimeout(() => {
      if (id) {
        const allSubjects = StorageService.getSubjects();
        const foundSub = allSubjects.find(s => s.id === id);
        setSubject(foundSub || null);
        setFiles(StorageService.getFiles(id));
      }
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [id]);

  const handleDownload = (file: StudyFile) => {
    StorageService.incrementDownload(file.id);
    // Refresh files to show new download count
    if (id) setFiles(StorageService.getFiles(id));
    
    // Open the actual link
    if (file.url) {
        window.open(file.url, '_blank');
    } else {
        alert("Link not available");
    }
  };

  const handleRate = (fileId: string, rating: number) => {
    StorageService.rateFile(fileId, rating);
    if (id) setFiles(StorageService.getFiles(id));
  };

  if (loading || !subject) return <LoadingLogo />;

  return (
    <div className={`min-h-screen py-10 px-4 ${themeColors.bg}`}>
      <div className="container mx-auto">
        <Link to="/subjects" className={`flex items-center gap-2 mb-6 ${themeColors.text} hover:underline`}>
          <ArrowLeft size={20} /> {translate('subjects')}
        </Link>

        <div className={`rounded-3xl p-8 mb-10 shadow-xl ${themeColors.primary} text-white`}>
           <h1 className="text-4xl font-bold mb-2">{language === 'en' ? subject.nameEn : subject.nameAr}</h1>
           <p className="opacity-90">{language === 'en' ? subject.descriptionEn : subject.descriptionAr}</p>
        </div>

        <div className="grid gap-4">
           {files.length === 0 ? (
             <div className="text-center py-20 text-gray-500">{translate('noFiles')}</div>
           ) : (
             files.map(file => (
               <div key={file.id} className={`flex flex-col md:flex-row items-center p-4 rounded-xl shadow-md border hover:shadow-lg transition ${themeColors.card} ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                  {/* Icon */}
                  <div className={`p-4 rounded-full mr-4 rtl:mr-0 rtl:ml-4 ${themeColors.secondary}`}>
                     {file.type === 'video' ? <Video size={24} className={themeColors.text} /> : <FileText size={24} className={themeColors.text} />}
                  </div>

                  {/* Info */}
                  <div className="flex-1 w-full md:w-auto text-center md:text-start rtl:md:text-right mb-4 md:mb-0">
                     <h4 className={`font-bold text-lg ${themeColors.text}`}>{file.title}</h4>
                     <div className="text-sm opacity-60 flex gap-4 justify-center md:justify-start rtl:md:justify-end">
                       <span>{file.type.toUpperCase()}</span>
                       <span>•</span>
                       <span>{file.downloads} {translate('downloads')}</span>
                       <span>•</span>
                       <span className="flex items-center gap-1">
                          <Star size={12} fill="currentColor" className="text-yellow-500"/> 
                          {file.ratingCount > 0 ? (file.ratingSum / file.ratingCount).toFixed(1) : '0'}
                       </span>
                     </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                     {/* Rating Stars (Simple implementation) */}
                     <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button key={star} onClick={() => handleRate(file.id, star)} className="hover:scale-110 transition">
                             <Star size={16} className={star <= (file.ratingCount > 0 ? file.ratingSum/file.ratingCount : 0) ? "text-yellow-500 fill-current" : "text-gray-300"} />
                          </button>
                        ))}
                     </div>

                     <button 
                       onClick={() => handleDownload(file)}
                       className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-white shadow-lg ${themeColors.primary} hover:opacity-90`}
                     >
                       <Download size={18} /> {translate('download')}
                     </button>
                  </div>
               </div>
             ))
           )}
        </div>
      </div>
    </div>
  );
};

export default SubjectDetail;