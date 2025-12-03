import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useLayout } from '../../components/LayoutProvider';
import { StorageService } from '../../services/storageService';
import { THEMES } from '../../constants';
import { Subject, StudyFile, SummaryRequest } from '../../types';
import { MessageSquare, Clock } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { theme, translate, language } = useLayout();
  const themeColors = THEMES[theme];
  
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [files, setFiles] = useState<StudyFile[]>([]);
  const [requests, setRequests] = useState<SummaryRequest[]>([]);

  useEffect(() => {
    setSubjects(StorageService.getSubjects());
    setFiles(StorageService.getFiles());
    setRequests(StorageService.getRequests().reverse()); // Newest first
  }, []);

  const totalDownloads = files.reduce((acc, f) => acc + f.downloads, 0);
  const avgRating = files.length ? (files.reduce((acc, f) => acc + (f.ratingCount ? f.ratingSum/f.ratingCount : 0), 0) / files.length).toFixed(1) : 0;

  // Prepare Chart Data
  const fileTypeData = [
    { name: 'PDF', value: files.filter(f => f.type === 'pdf').length },
    { name: 'Video', value: files.filter(f => f.type === 'video').length },
    { name: 'Other', value: files.filter(f => !['pdf', 'video'].includes(f.type)).length },
  ];
  
  const subjectFileCountData = subjects.map(s => ({
    name: language === 'en' ? s.nameEn.split(' ')[0] : s.nameAr.split(' ')[0], // Short name
    count: files.filter(f => f.subjectId === s.id).length
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
       <h1 className={`text-3xl font-bold ${themeColors.text}`}>{translate('dashboard')}</h1>

       {/* Stats Cards */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className={`p-6 rounded-xl shadow-lg ${themeColors.card} border-l-4 border-indigo-500`}>
             <h3 className="text-gray-500 text-sm uppercase">{translate('subjects')}</h3>
             <p className={`text-3xl font-bold ${themeColors.text}`}>{subjects.length}</p>
          </div>
          <div className={`p-6 rounded-xl shadow-lg ${themeColors.card} border-l-4 border-green-500`}>
             <h3 className="text-gray-500 text-sm uppercase">{translate('files')}</h3>
             <p className={`text-3xl font-bold ${themeColors.text}`}>{files.length}</p>
          </div>
          <div className={`p-6 rounded-xl shadow-lg ${themeColors.card} border-l-4 border-blue-500`}>
             <h3 className="text-gray-500 text-sm uppercase">{translate('downloads')}</h3>
             <p className={`text-3xl font-bold ${themeColors.text}`}>{totalDownloads}</p>
          </div>
          <div className={`p-6 rounded-xl shadow-lg ${themeColors.card} border-l-4 border-yellow-500`}>
             <h3 className="text-gray-500 text-sm uppercase">{translate('rating')}</h3>
             <p className={`text-3xl font-bold ${themeColors.text}`}>{avgRating}</p>
          </div>
       </div>

       {/* Charts & Comments */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Charts Column */}
          <div className="lg:col-span-2 space-y-8">
              <div className={`p-6 rounded-xl shadow-lg ${themeColors.card}`}>
                <h3 className={`text-lg font-bold mb-4 ${themeColors.text}`}>Files by Subject</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subjectFileCountData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', color: theme === 'dark' ? '#fff' : '#000' }}/>
                        <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className={`p-6 rounded-xl shadow-lg ${themeColors.card}`}>
                <h3 className={`text-lg font-bold mb-4 ${themeColors.text}`}>Files by Type</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                          data={fileTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {fileTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
          </div>

          {/* Recent Comments / Requests */}
          <div className={`lg:col-span-1 rounded-xl shadow-lg ${themeColors.card} p-6 flex flex-col h-full`}>
             <h3 className={`text-lg font-bold mb-4 ${themeColors.text} flex items-center gap-2`}>
                <MessageSquare size={20} />
                Recent Requests & Comments
             </h3>
             
             <div className="flex-1 overflow-y-auto space-y-4 max-h-[600px] pr-2">
                {requests.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No requests yet.</p>
                ) : (
                    requests.map((req) => (
                        <div key={req.id} className={`p-4 rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-700/50' : 'border-gray-100 bg-gray-50'}`}>
                           <div className="flex justify-between items-start mb-2">
                              <span className={`font-bold text-sm ${themeColors.text}`}>{req.studentName}</span>
                              <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded-full">{req.status}</span>
                           </div>
                           <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>"{req.comments}"</p>
                           <div className="flex items-center gap-1 text-xs text-gray-400">
                               <Clock size={12} />
                               <span>Subject ID: {req.subjectId}</span>
                           </div>
                        </div>
                    ))
                )}
             </div>
          </div>
       </div>
    </div>
  );
};

export default AdminDashboard;