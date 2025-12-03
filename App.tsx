import React from 'react';
import { HashRouter, Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import { LayoutProvider, useLayout } from './components/LayoutProvider';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import Home from './pages/Home';
import Subjects from './pages/Subjects';
import SubjectDetail from './pages/SubjectDetail';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminContent from './pages/admin/AdminContent';
import AdminSubjects from './pages/admin/AdminSubjects';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProfile from './pages/admin/AdminProfile';
import AdminLayout from './components/AdminLayout';
import { StorageService } from './services/storageService';

const StudentLayout = () => {
  const location = useLocation();
  return (
    <>
      <NavBar />
      <main className="min-h-screen">
        {/* Key prop triggers re-render and animation on route change */}
        <div key={location.pathname} className="fade-in">
           <Outlet />
        </div>
      </main>
      <AIAssistant />
      <Footer />
    </>
  );
};

const PrivateRoute = ({ children }: { children?: React.ReactNode }) => {
  const user = StorageService.getUser();
  // Allow any role that is not 'student' (or logic specific to admin)
  return user && user.role !== 'student' ? <>{children}</> : <Navigate to="/admin/login" />;
};

const App: React.FC = () => {
  return (
    <LayoutProvider>
      <HashRouter>
        <Routes>
          {/* Public / Student Routes */}
          <Route element={<StudentLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/subjects/:id" element={<SubjectDetail />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route path="/admin" element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="subjects" element={<AdminSubjects />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>
        </Routes>
      </HashRouter>
    </LayoutProvider>
  );
};

export default App;