import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useLayout } from './LayoutProvider';
import { StorageService } from '../services/storageService';
import { THEMES, LOGO_URL } from '../constants';
import { LayoutDashboard, FileText, Users, LogOut, Settings, Library } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { theme, translate } = useLayout();
  const themeColors = THEMES[theme];
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    StorageService.logout();
    navigate('/');
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'dashboard' },
    { path: '/admin/content', icon: FileText, label: 'manageContent' },
    { path: '/admin/subjects', icon: Library, label: 'Manage Subjects' }, // New Item
    { path: '/admin/users', icon: Users, label: 'controlPanel' },
    { path: '/admin/profile', icon: Settings, label: 'My Profile' },
  ];

  return (
    <div className={`min-h-screen flex ${themeColors.bg}`}>
      {/* Sidebar */}
      <aside className={`w-64 fixed inset-y-0 left-0 rtl:left-auto rtl:right-0 z-50 flex flex-col shadow-2xl ${themeColors.card} transition-transform duration-300 transform md:translate-x-0 -translate-x-full rtl:translate-x-full rtl:md:translate-x-0 border-r dark:border-gray-700`}>
        <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex justify-center`}>
           <img src={LOGO_URL} alt="Admin Panel" className="h-12 w-auto object-contain" />
        </div>
        <nav className="flex-1 p-4 space-y-2">
           {menuItems.map(item => (
             <NavLink
               key={item.path}
               to={item.path}
               className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                 isActive ? `${themeColors.primary} text-white shadow-lg translate-x-1` : `${themeColors.text} hover:bg-gray-100 dark:hover:bg-gray-700`
               }`}
             >
               <item.icon size={20} />
               <span>{translate(item.label) || item.label}</span>
             </NavLink>
           ))}
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
           <button 
             onClick={handleLogout}
             className="flex items-center gap-3 p-3 w-full rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
           >
             <LogOut size={20} />
             <span>{translate('logout')}</span>
           </button>
        </div>
      </aside>

      {/* Main Content with Transition */}
      <main className={`flex-1 md:ml-64 rtl:md:ml-0 rtl:md:mr-64 p-8 overflow-x-hidden ${themeColors.bg}`}>
        <div key={location.pathname} className="fade-in">
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;