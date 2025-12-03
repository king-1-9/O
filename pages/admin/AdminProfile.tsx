import React, { useState } from 'react';
import { useLayout } from '../../components/LayoutProvider';
import { StorageService } from '../../services/storageService';
import { THEMES } from '../../constants';
import { Lock, Save, AlertCircle, CheckCircle } from 'lucide-react';

const AdminProfile: React.FC = () => {
  const { theme, translate } = useLayout();
  const themeColors = THEMES[theme];
  
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [status, setStatus] = useState<{ type: 'error' | 'success' | '', msg: string }>({ type: '', msg: '' });

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const user = StorageService.getUser();
    if (!user) return;

    if (user.password !== passwords.current) {
        setStatus({ type: 'error', msg: 'Current password is incorrect.' });
        return;
    }

    if (passwords.new !== passwords.confirm) {
        setStatus({ type: 'error', msg: 'New passwords do not match.' });
        return;
    }

    if (passwords.new.length < 4) {
        setStatus({ type: 'error', msg: 'Password is too short.' });
        return;
    }

    // Update User
    const updatedUser = { ...user, password: passwords.new };
    StorageService.updateUser(updatedUser);
    
    setStatus({ type: 'success', msg: 'Password updated successfully!' });
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
       <h1 className={`text-3xl font-bold ${themeColors.text}`}>My Profile</h1>

       <div className={`p-8 rounded-xl shadow-lg ${themeColors.card}`}>
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
             <div className={`p-2 rounded-lg ${themeColors.secondary}`}>
                <Lock size={24} className={themeColors.text} />
             </div>
             <div>
                 <h3 className={`text-xl font-bold ${themeColors.text}`}>Change Password</h3>
                 <p className="text-sm text-gray-500">Update your security credentials</p>
             </div>
          </div>

          {status.msg && (
              <div className={`p-4 mb-6 rounded-lg flex items-center gap-2 ${status.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {status.type === 'error' ? <AlertCircle size={20}/> : <CheckCircle size={20}/>}
                  {status.msg}
              </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
             <div>
                <label className={`block mb-1 font-medium ${themeColors.text}`}>Current Password</label>
                <input 
                  type="password" 
                  className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50'}`}
                  value={passwords.current}
                  onChange={e => setPasswords({...passwords, current: e.target.value})}
                  required
                />
             </div>
             <div>
                <label className={`block mb-1 font-medium ${themeColors.text}`}>New Password</label>
                <input 
                  type="password" 
                  className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50'}`}
                  value={passwords.new}
                  onChange={e => setPasswords({...passwords, new: e.target.value})}
                  required
                />
             </div>
             <div>
                <label className={`block mb-1 font-medium ${themeColors.text}`}>Confirm New Password</label>
                <input 
                  type="password" 
                  className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50'}`}
                  value={passwords.confirm}
                  onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                  required
                />
             </div>
             <div className="pt-4">
                <button type="submit" className={`w-full py-3 rounded-lg font-bold text-white shadow-lg ${themeColors.primary} hover:opacity-90 flex justify-center items-center gap-2`}>
                    <Save size={20} /> Update Password
                </button>
             </div>
          </form>
       </div>
    </div>
  );
};

export default AdminProfile;