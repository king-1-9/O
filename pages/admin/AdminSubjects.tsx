import React, { useState, useEffect } from 'react';
import { useLayout } from '../../components/LayoutProvider';
import { StorageService } from '../../services/storageService';
import { Subject } from '../../types';
import { THEMES } from '../../constants';
import { Trash2, Plus, Book, AlertCircle, Library } from 'lucide-react';

const AdminSubjects: React.FC = () => {
  const { theme, translate, language } = useLayout();
  const themeColors = THEMES[theme];
  
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubject, setNewSubject] = useState<Partial<Subject>>({
    nameEn: '', nameAr: '', descriptionEn: '', descriptionAr: '', icon: 'Book'
  });
  const [error, setError] = useState('');

  const refreshSubjects = () => {
    setSubjects([...StorageService.getSubjects()]);
  };

  useEffect(() => {
    refreshSubjects();
  }, []);

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.nameEn || !newSubject.nameAr) {
        setError('English and Arabic names are required.');
        return;
    }

    const subjectToAdd: Subject = {
      id: Date.now().toString(),
      nameEn: newSubject.nameEn!,
      nameAr: newSubject.nameAr!,
      descriptionEn: newSubject.descriptionEn || '',
      descriptionAr: newSubject.descriptionAr || '',
      icon: newSubject.icon || 'Book'
    };

    StorageService.addSubject(subjectToAdd);
    refreshSubjects();
    setNewSubject({ nameEn: '', nameAr: '', descriptionEn: '', descriptionAr: '', icon: 'Book' });
    setError('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this subject? All associated files will also be removed.')) {
      StorageService.deleteSubject(id);
      setSubjects(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-8 pb-10">
       <h1 className={`text-3xl font-bold ${themeColors.text}`}>Manage Subjects</h1>

       {/* Add Subject Form */}
       <div className={`p-6 rounded-xl shadow-lg ${themeColors.card}`}>
          <div className="flex items-center gap-2 mb-4">
             <div className={`p-2 rounded-lg ${themeColors.secondary}`}>
                <Library size={24} className={themeColors.text} />
             </div>
             <h3 className={`text-xl font-bold ${themeColors.text}`}>Add New Material/Subject</h3>
          </div>
          
          {error && (
             <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
               <AlertCircle size={20}/> {error}
             </div>
          )}

          <form onSubmit={handleAddSubject} className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className={`block mb-1 text-sm ${themeColors.text}`}>Name (English) <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50'}`}
                  value={newSubject.nameEn}
                  onChange={e => setNewSubject({...newSubject, nameEn: e.target.value})}
                  required
                />
             </div>
             <div dir="rtl">
                <label className={`block mb-1 text-sm ${themeColors.text}`}>الاسم (بالعربية) <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50'}`}
                  value={newSubject.nameAr}
                  onChange={e => setNewSubject({...newSubject, nameAr: e.target.value})}
                  required
                />
             </div>
             <div>
                <label className={`block mb-1 text-sm ${themeColors.text}`}>Description (English)</label>
                <input 
                  type="text" 
                  className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50'}`}
                  value={newSubject.descriptionEn}
                  onChange={e => setNewSubject({...newSubject, descriptionEn: e.target.value})}
                />
             </div>
             <div dir="rtl">
                <label className={`block mb-1 text-sm ${themeColors.text}`}>الوصف (بالعربية)</label>
                <input 
                  type="text" 
                  className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50'}`}
                  value={newSubject.descriptionAr}
                  onChange={e => setNewSubject({...newSubject, descriptionAr: e.target.value})}
                />
             </div>
             <div className="md:col-span-2">
                <label className={`block mb-1 text-sm ${themeColors.text}`}>Icon</label>
                <select
                   className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50'}`}
                   value={newSubject.icon}
                   onChange={e => setNewSubject({...newSubject, icon: e.target.value})}
                >
                   <option value="Book">Book</option>
                   <option value="Code">Code</option>
                   <option value="Calculator">Calculator</option>
                   <option value="Database">Database</option>
                   <option value="Cpu">Cpu</option>
                   <option value="Globe">Globe</option>
                   <option value="Shield">Shield</option>
                </select>
             </div>
             <button type="submit" className={`md:col-span-2 py-3 rounded-lg font-bold text-white shadow-lg ${themeColors.primary} hover:opacity-90 flex justify-center items-center gap-2 transform active:scale-95 transition`}>
                <Plus size={20} /> Add Subject
             </button>
          </form>
       </div>

       {/* Subjects List */}
       <div className={`rounded-xl shadow-lg overflow-hidden ${themeColors.card}`}>
         <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className={`text-lg font-bold ${themeColors.text}`}>Current Subjects</h3>
         </div>
         <div className="overflow-x-auto">
           <table className="w-full text-left">
             <thead className={`${themeColors.secondary} ${themeColors.text}`}>
               <tr>
                 <th className="p-4">Name</th>
                 <th className="p-4">Files</th>
                 <th className="p-4">Description</th>
                 <th className="p-4 text-center">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
               {subjects.map(sub => {
                   const fileCount = StorageService.getFiles(sub.id).length;
                   return (
                   <tr key={sub.id} className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} hover:bg-gray-50 dark:hover:bg-gray-700/50 transition`}>
                     <td className="p-4 font-medium">
                        <div className="flex flex-col">
                            <span>{sub.nameEn}</span>
                            <span className="text-xs opacity-60">{sub.nameAr}</span>
                        </div>
                     </td>
                     <td className="p-4">
                        <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">{fileCount} Files</span>
                     </td>
                     <td className="p-4 text-sm opacity-70 truncate max-w-xs">
                        {language === 'en' ? sub.descriptionEn : sub.descriptionAr}
                     </td>
                     <td className="p-4 text-center">
                       <button 
                          type="button"
                          onClick={() => handleDelete(sub.id)} 
                          className="p-2 rounded-full bg-red-100 text-red-500 hover:bg-red-500 hover:text-white transition shadow-sm"
                          title="Delete Subject"
                        >
                          <Trash2 size={18} />
                       </button>
                     </td>
                   </tr>
                 )})}
             </tbody>
           </table>
         </div>
       </div>
    </div>
  );
};

export default AdminSubjects;