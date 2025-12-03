import React, { useState } from 'react';
import { useLayout } from '../components/LayoutProvider';
import { Search, CheckCircle } from 'lucide-react';
import { THEMES, INITIAL_SUBJECTS, LOGO_URL } from '../constants';
import { StorageService } from '../services/storageService';
import { SummaryRequest } from '../types';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const { theme, translate, language } = useLayout();
  const themeColors = THEMES[theme];
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [requestData, setRequestData] = useState({ name: '', comments: '', subjectId: INITIAL_SUBJECTS[0].id });
  const [requestSent, setRequestSent] = useState(false);

  // Search Logic
  const allSubjects = StorageService.getSubjects();
  const allFiles = StorageService.getFiles();
  
  const filteredSubjects = searchTerm ? allSubjects.filter(s => 
    s.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.nameAr.includes(searchTerm)
  ) : [];

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRequest: SummaryRequest = {
      id: Date.now().toString(),
      studentName: requestData.name,
      comments: requestData.comments,
      subjectId: requestData.subjectId,
      status: 'pending'
    };
    StorageService.saveRequest(newRequest);
    setRequestSent(true);
    setTimeout(() => {
        setRequestSent(false);
        setRequestData({ name: '', comments: '', subjectId: INITIAL_SUBJECTS[0].id });
    }, 3000);
  };

  return (
    <div className={`min-h-screen ${themeColors.bg} transition-colors duration-500`}>
      {/* Hero Section */}
      <section className={`relative py-20 px-4 overflow-hidden`}>
        <div className={`container mx-auto text-center relative z-10 flex flex-col items-center`}>
          <img 
            src={LOGO_URL} 
            alt="Welcome Logo" 
            className="h-24 md:h-32 w-auto object-contain mb-8 animate-fade-in"
          />
          <h1 className={`text-5xl md:text-6xl font-extrabold mb-6 animate-fade-in ${themeColors.text}`}>
            {translate('welcome')}
          </h1>
          <p className={`text-xl md:text-2xl mb-10 opacity-80 ${themeColors.text}`}>
            {translate('welcomeSub')}
          </p>
          
          {/* Advanced Search */}
          <div className="max-w-2xl w-full mx-auto relative group">
            <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${language==='ar'?'right-0 left-auto pr-3':''}`}>
              <Search className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={translate('searchPlaceholder')}
              className={`block w-full pl-10 pr-3 py-4 rounded-full border-none shadow-xl focus:ring-4 focus:ring-opacity-50 transition-all text-lg ${
                theme === 'dark' ? 'bg-gray-800 text-white focus:ring-indigo-500' : 'bg-white text-gray-900 focus:ring-indigo-300'
              } ${language==='ar'?'pr-10 pl-3':''}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            {/* Search Suggestions */}
            {searchTerm && (
              <div className={`absolute w-full mt-2 rounded-xl shadow-2xl z-[60] overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                {filteredSubjects.length > 0 ? (
                  filteredSubjects.map(sub => (
                    <div 
                        key={sub.id} 
                        onClick={() => navigate(`/subjects/${sub.id}`)}
                        className={`p-3 cursor-pointer hover:bg-opacity-10 hover:bg-gray-500 ${themeColors.text}`}
                    >
                      {language === 'en' ? sub.nameEn : sub.nameAr}
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-gray-500">No results found</div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Decorative Circles */}
        <div className={`absolute top-0 left-0 w-64 h-64 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob ${themeColors.secondary}`}></div>
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000 ${theme === 'light' ? 'bg-pink-300' : 'bg-purple-900'}`}></div>
      </section>

      {/* About Us */}
      <section id="about" className={`py-16 px-4 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'} relative z-20`}>
         <div className="container mx-auto grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
               <h2 className={`text-3xl font-bold ${themeColors.text}`}>{translate('aboutUs')}</h2>
               <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                 {translate('aboutText')}
               </p>
               <div className="flex gap-4">
                  <div className={`p-4 rounded-xl shadow-md ${themeColors.card} text-center flex-1`}>
                     <h4 className={`font-bold text-2xl ${themeColors.text}`}>{allSubjects.length}</h4>
                     <span className="text-sm opacity-70">{translate('subjects')}</span>
                  </div>
                  <div className={`p-4 rounded-xl shadow-md ${themeColors.card} text-center flex-1`}>
                     <h4 className={`font-bold text-2xl ${themeColors.text}`}>{allFiles.length}</h4>
                     <span className="text-sm opacity-70">{translate('files')}</span>
                  </div>
               </div>
            </div>
            <div className="flex justify-center">
               <div className={`w-full h-64 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition duration-500 ${themeColors.primary} flex items-center justify-center`}>
                   <img src={LOGO_URL} alt="Hub" className="w-48 h-auto object-contain brightness-0 invert opacity-50" />
               </div>
            </div>
         </div>
      </section>

      {/* Request Summary Form */}
      <section className="py-16 px-4 container mx-auto">
        <div className={`max-w-3xl mx-auto rounded-2xl shadow-2xl overflow-hidden ${themeColors.card}`}>
          <div className={`${themeColors.primary} p-6 text-white text-center`}>
            <h2 className="text-2xl font-bold">{translate('requestSummary')}</h2>
          </div>
          <div className="p-8">
            {requestSent ? (
               <div className="flex flex-col items-center justify-center py-10 text-green-500">
                  <CheckCircle size={64} className="mb-4" />
                  <h3 className="text-2xl font-bold">{translate('success')}</h3>
                  <p>{translate('requestSent')}</p>
               </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-6">
                <div>
                  <label className={`block mb-2 font-medium ${themeColors.text}`}>{translate('studentName')}</label>
                  <input 
                    required
                    type="text" 
                    className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'}`}
                    value={requestData.name}
                    onChange={e => setRequestData({...requestData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className={`block mb-2 font-medium ${themeColors.text}`}>{translate('subjects')}</label>
                  <select 
                    className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'}`}
                    value={requestData.subjectId}
                    onChange={e => setRequestData({...requestData, subjectId: e.target.value})}
                  >
                    {allSubjects.map(s => (
                      <option key={s.id} value={s.id}>{language === 'en' ? s.nameEn : s.nameAr}</option>
                    ))}
                  </select>
                </div>
                <div>
                   <label className={`block mb-2 font-medium ${themeColors.text}`}>{translate('comments')}</label>
                   <textarea 
                     required
                     rows={4}
                     className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'}`}
                     value={requestData.comments}
                     onChange={e => setRequestData({...requestData, comments: e.target.value})}
                   ></textarea>
                </div>
                <button 
                  type="submit"
                  className={`w-full py-4 rounded-lg font-bold text-white shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 ${themeColors.primary}`}
                >
                  {translate('sendRequest')}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;