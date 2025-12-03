import React, { useState, useEffect } from 'react';
import { useLayout } from '../../components/LayoutProvider';
import { StorageService } from '../../services/storageService';
import { User } from '../../types';
import { THEMES } from '../../constants';
import { Trash2, Plus, User as UserIcon, Shield, AlertTriangle } from 'lucide-react';

const AdminUsers: React.FC = () => {
  const { theme, translate } = useLayout();
  const themeColors = THEMES[theme];
  
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<{username: string, password: string, fullName: string, role: User['role']}>({ 
      username: '', password: '', fullName: '', role: 'admin' 
  });
  const [error, setError] = useState('');

  useEffect(() => {
    refreshUsers();
  }, []);

  const refreshUsers = () => {
    setUsers([...StorageService.getUsers()]);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username || !newUser.password) {
        setError('Username and password are required');
        return;
    }
    
    // Simple check for duplicates
    if (users.some(u => u.username === newUser.username)) {
        setError('Username already exists');
        return;
    }

    const userToAdd: User = {
      id: Date.now().toString(),
      username: newUser.username,
      password: newUser.password,
      fullName: newUser.fullName || newUser.username,
      role: newUser.role,
      createdAt: new Date().toISOString()
    };

    StorageService.addUser(userToAdd);
    refreshUsers();
    setNewUser({ username: '', password: '', fullName: '', role: 'admin' });
    setError('');
  };

  const handleDelete = (id: string) => {
    const userToDelete = users.find(u => u.id === id);
    if (!userToDelete) return;

    if (users.length <= 1) {
        alert("Cannot delete the last user.");
        return;
    }
    
    if (window.confirm(`Delete user "${userToDelete.username}"?`)) {
      StorageService.deleteUser(id);
      // Update local state immediately
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  return (
    <div className="space-y-8">
       <h1 className={`text-3xl font-bold ${themeColors.text}`}>{translate('controlPanel')}</h1>

       {/* Add User Form */}
       <div className={`p-6 rounded-xl shadow-lg ${themeColors.card}`}>
          <div className="flex items-center gap-2 mb-4">
             <div className={`p-2 rounded-lg ${themeColors.secondary}`}>
                <Shield size={24} className={themeColors.text} />
             </div>
             <h3 className={`text-xl font-bold ${themeColors.text}`}>{translate('addUser')}</h3>
          </div>
          
          {error && <p className="text-red-500 mb-4 text-sm flex items-center gap-2"><AlertTriangle size={16}/> {error}</p>}

          <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className={`block mb-1 text-sm ${themeColors.text}`}>{translate('name')}</label>
                <input 
                  type="text" 
                  className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50'}`}
                  value={newUser.fullName}
                  onChange={e => setNewUser({...newUser, fullName: e.target.value})}
                />
             </div>
             <div>
                <label className={`block mb-1 text-sm ${themeColors.text}`}>Role / Type</label>
                <select
                  className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50'}`}
                  value={newUser.role}
                  onChange={e => setNewUser({...newUser, role: e.target.value as any})}
                >
                   <option value="admin">Admin</option>
                   <option value="super_admin">Super Admin</option>
                   <option value="editor">Editor</option>
                </select>
             </div>
             <div>
                <label className={`block mb-1 text-sm ${themeColors.text}`}>{translate('adminUser')}</label>
                <input 
                  type="text" 
                  className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50'}`}
                  value={newUser.username}
                  onChange={e => setNewUser({...newUser, username: e.target.value})}
                  required
                />
             </div>
             <div>
                <label className={`block mb-1 text-sm ${themeColors.text}`}>{translate('adminPass')}</label>
                <input 
                  type="password" 
                  className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50'}`}
                  value={newUser.password}
                  onChange={e => setNewUser({...newUser, password: e.target.value})}
                  required
                />
             </div>
             <button type="submit" className={`md:col-span-2 py-3 rounded-lg font-bold text-white shadow-lg ${themeColors.primary} hover:opacity-90 flex justify-center items-center gap-2`}>
                <Plus size={20} /> {translate('addUser')}
             </button>
          </form>
       </div>

       {/* Users List */}
       <div className={`rounded-xl shadow-lg overflow-hidden ${themeColors.card}`}>
         <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className={`text-lg font-bold ${themeColors.text}`}>{translate('manageUsers')}</h3>
         </div>
         <div className="overflow-x-auto">
           <table className="w-full text-left">
             <thead className={`${themeColors.secondary} ${themeColors.text}`}>
               <tr>
                 <th className="p-4">{translate('name')}</th>
                 <th className="p-4">{translate('adminUser')}</th>
                 <th className="p-4">{translate('role')}</th>
                 <th className="p-4">{translate('created')}</th>
                 <th className="p-4 text-center">{translate('actions')}</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
               {users.map(user => (
                   <tr key={user.id} className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} hover:bg-gray-50 dark:hover:bg-gray-700/50 transition`}>
                     <td className="p-4 font-medium flex items-center gap-3">
                        <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                           <UserIcon size={16} />
                        </div>
                        {user.fullName}
                     </td>
                     <td className="p-4 opacity-80">{user.username}</td>
                     <td className="p-4 uppercase text-xs font-bold tracking-wider">
                        <span className={`px-2 py-1 rounded-full border ${
                            user.role === 'super_admin' ? 'bg-purple-100 text-purple-700 border-purple-200' : 
                            user.role === 'editor' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                            'bg-green-100 text-green-700 border-green-200'
                        }`}>
                           {user.role.replace('_', ' ')}
                        </span>
                     </td>
                     <td className="p-4 text-sm opacity-60">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                     </td>
                     <td className="p-4 text-center">
                       <button 
                          onClick={() => handleDelete(user.id)} 
                          className="p-2 rounded-full bg-red-100 text-red-500 hover:bg-red-500 hover:text-white transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={users.length <= 1}
                          title={translate('delete')}
                        >
                          <Trash2 size={18} />
                       </button>
                     </td>
                   </tr>
                 ))}
             </tbody>
           </table>
         </div>
       </div>
    </div>
  );
};

export default AdminUsers;