import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLayout } from '../../components/LayoutProvider';
import { StorageService } from '../../services/storageService';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { THEMES, LOGO_URL } from '../../constants';

const AdminLogin: React.FC = () => {
  const { theme, translate } = useLayout();
  const themeColors = THEMES[theme];
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = StorageService.validateUser(username, password);
    
    if (user) {
       StorageService.login(user);
       navigate('/admin/dashboard');
    } else {
        setError('Invalid username or password');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${themeColors.bg} animate-fade-in`}>
      <div className={`w-full max-w-md p-8 rounded-2xl shadow-2xl ${themeColors.card} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
        <div className="text-center mb-8">
           <img src={LOGO_URL} alt="Logo" className="h-16 w-auto mx-auto mb-4 object-contain" />
           <h2 className={`text-2xl font-bold ${themeColors.text}`}>{translate('adminLogin')}</h2>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center animate-pulse">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
           <div>
             <label className={`block mb-2 font-medium ${themeColors.text}`}>{translate('adminUser')}</label>
             <input 
               type="text" 
               className={`w-full p-3 rounded-lg border outline-none transition ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500' : 'bg-white border-gray-300 focus:border-indigo-500'}`}
               value={username}
               onChange={e => setUsername(e.target.value)}
             />
           </div>
           <div>
             <label className={`block mb-2 font-medium ${themeColors.text}`}>{translate('adminPass')}</label>
             <div className="relative">
               <input 
                 type={showPassword ? "text" : "password"}
                 className={`w-full p-3 rounded-lg border outline-none transition ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500' : 'bg-white border-gray-300 focus:border-indigo-500'}`}
                 value={password}
                 onChange={e => setPassword(e.target.value)}
               />
               <button 
                 type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 className={`absolute right-3 top-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
               >
                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
               </button>
             </div>
           </div>
           <button 
             type="submit" 
             className={`w-full py-3 rounded-lg font-bold text-white shadow-lg ${themeColors.primary} hover:opacity-90 transform active:scale-95 transition`}
           >
             {translate('login')}
           </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;