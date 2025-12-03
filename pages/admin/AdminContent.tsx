import React, { useState, useEffect } from 'react';
import { useLayout } from '../../components/LayoutProvider';
import { StorageService } from '../../services/storageService';
import { Subject, StudyFile } from '../../types';
import { THEMES } from '../../constants';
import { Trash2, Upload, AlertCircle, Search, Link as LinkIcon } from 'lucide-react';

const AdminContent: React.FC = () => {
  const { theme, translate, language } = useLayout();
  const themeColors = THEMES[theme];
  
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [files, setFiles] = useState<StudyFile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newFile, setNewFile] = useState<Partial<StudyFile>>({
    title: '',
    subjectId: '',
    type: 'pdf',
    url: '' // Initialize empty for URL input
  });
  const [error, setError] = useState('');

  // Function to refresh files from storage
  const refreshFiles = () => {
    // Force a new array reference
    const allFiles = StorageService.getFiles();
    setFiles([...allFiles]);
  };

  useEffect(() => {
    setSubjects(StorageService.getSubjects());
    refreshFiles();
  }, []);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFile.title || !newFile.subjectId || !newFile.type || !newFile.url) {
      setError('Please fill in all required fields: Title, Subject, Type, and URL.');
      return;
    }

    const fileToAdd: StudyFile = {
      id: Date.now().toString(),
      subjectId: newFile.subjectId!,
      title: newFile.title!,
      type: newFile.type as any,
      url: newFile.url!,
      downloads: 0,
      ratingSum: 0,
      ratingCount: 0,
      uploadedAt: new Date().toISOString()
    };

    StorageService.addFile(fileToAdd);
    refreshFiles(); // Force update
    setNewFile({ title: '', subjectId: '', type: 'pdf', url: '' });
    setError('');
    alert('Content link added successfully!');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      // 1. Delete from Storage
      StorageService.deleteFile(id);
      
      // 2. Update Local State Immediately
      setFiles(prevFiles => prevFiles.filter(f => f.id !== id));
    }
  };

  const filteredFiles = files.filter(f => 
    f.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <h1 className={`text-3xl font-bold ${themeColors.text}`}>{translate('manageContent')}</h1>
         <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Search files..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-full border ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
         </div>
       </div>

       {/* Upload Form */}
       <div className={`p-6 rounded-xl shadow-lg ${themeColors.card} border-t-4 ${theme === 'light' ? 'border-indigo-500' : 'border-indigo-400'}`}>
          <div className="flex items-center gap-2 mb-6">
             <div className={`p-2 rounded-lg ${themeColors.secondary}`}>
                 <Upload size={24} className={themeColors.text} />
             </div>
             <h3 className={`text-xl font-bold ${themeColors.text}`}>{translate('upload')}</h3>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="md:col-span-2">
               <label className={`block mb-1 text-sm font-bold ${themeColors.text}`}>Title <span className="text-red-500">*</span></label>
               <input 
                 type="text" 
                 placeholder="e.g. Chapter 1 Summary"
                 className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50'}`}
                 value={newFile.title}
                 onChange={e => setNewFile({...newFile, title: e.target.value})}
                 required
               />
             </div>
             <div>
               <label className={`block mb-1 text-sm font-bold ${themeColors.text}`}>Subject <span className="text-red-500">*</span></label>
               <select
                 className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50'}`}
                 value={newFile.subjectId}
                 onChange={e => setNewFile({...newFile, subjectId: e.target.value})}
                 required
               >
                  <option value="">-- Select Subject --</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{language === 'en' ? s.nameEn : s.nameAr}</option>
                  ))}
               </select>
             </div>
             <div>
               <label className={`block mb-1 text-sm font-bold ${themeColors.text}`}>Type <span className="text-red-500">*</span></label>
               <select
                 className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50'}`}
                 value={newFile.type}
                 onChange={e => setNewFile({...newFile, type: e.target.value as any})}
                 required
               >
                  <option value="pdf">PDF</option>
                  <option value="doc">Word (DOC)</option>
                  <option value="ppt">PowerPoint</option>
                  <option value="video">Video</option>
                  <option value="zip">Archive (ZIP)</option>
               </select>
             </div>
             
             {/* URL Input */}
             <div className="md:col-span-2">
                <label className={`block mb-1 text-sm font-bold ${themeColors.text}`}>Link / URL <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon size={18} className="text-gray-400" />
                  </div>
                  <input 
                    type="url" 
                    placeholder="https://drive.google.com/..."
                    className={`w-full pl-10 pr-3 py-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50'}`}
                    value={newFile.url}
                    onChange={e => setNewFile({...newFile, url: e.target.value})}
                    required
                  />
                </div>
                <p className="text-xs mt-1 opacity-60">Paste the direct link to your file (Google Drive, Dropbox, YouTube, etc.)</p>
             </div>

             <button type="submit" className={`md:col-span-2 py-3 rounded-lg font-bold text-white shadow-lg ${themeColors.primary} hover:opacity-90 transition transform active:scale-95 flex justify-center items-center gap-2`}>
                <Upload size={20} /> Add Content
             </button>
          </form>
       </div>

       {/* File List */}
       <div className={`rounded-xl shadow-lg overflow-hidden ${themeColors.card}`}>
         <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className={`text-lg font-bold ${themeColors.text}`}>Uploaded Content</h3>
            <span className="text-sm opacity-60">{filteredFiles.length} files</span>
         </div>
         <div className="overflow-x-auto">
           <table className="w-full text-left">
             <thead className={`${themeColors.secondary} ${themeColors.text}`}>
               <tr>
                 <th className="p-4">{translate('name')}</th>
                 <th className="p-4">{translate('type')}</th>
                 <th className="p-4">{translate('subjects')}</th>
                 <th className="p-4 text-center">{translate('actions')}</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
               {filteredFiles.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center opacity-50">{translate('noFiles')}</td>
                  </tr>
               ) : (
                 filteredFiles.map(file => (
                   <tr key={file.id} className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} hover:bg-gray-50 dark:hover:bg-gray-700/50 transition`}>
                     <td className="p-4 font-medium">
                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-2">
                           {file.title}
                           <LinkIcon size={12} className="opacity-50"/>
                        </a>
                     </td>
                     <td className="p-4 uppercase text-sm font-bold opacity-70">{file.type}</td>
                     <td className="p-4">
                        {(() => {
                            const sub = subjects.find(s => s.id === file.subjectId);
                            return sub ? (language === 'en' ? sub.nameEn : sub.nameAr) : 'Unknown';
                        })()}
                     </td>
                     <td className="p-4 text-center">
                       <button 
                          onClick={() => handleDelete(file.id)} 
                          className="p-2 rounded-full bg-red-100 text-red-500 hover:bg-red-500 hover:text-white transition shadow-sm"
                          title={translate('delete')}
                        >
                          <Trash2 size={18} />
                       </button>
                     </td>
                   </tr>
                 ))
               )}
             </tbody>
           </table>
         </div>
       </div>
    </div>
  );
};

export default AdminContent;