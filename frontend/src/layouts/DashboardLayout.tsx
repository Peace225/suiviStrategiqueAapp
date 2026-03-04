import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';

// --- Icônes SVG centralisées pour un look premium ---
const Icons = {
  Dashboard: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>,
  Tasks: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Validation: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>,
  Reports: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>,
  Admin: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
};

export default function DashboardLayout() {
  const { profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  // Configuration dynamique des menus selon les rôles du cahier des charges
  const menuItems = [
    { path: '/', label: 'Tableau de bord', icon: <Icons.Dashboard />, roles: ['Agent', 'Chef de département', 'Administrateur'] },
    { path: '/tasks', label: 'Suivi du Temps', icon: <Icons.Tasks />, roles: ['Agent', 'Chef de département', 'Administrateur'] },
    { path: '/validation', label: 'Validation Manager', icon: <Icons.Validation />, roles: ['Chef de département', 'Administrateur'] },
    { path: '/reports', label: 'Reporting & Audit', icon: <Icons.Reports />, roles: ['Agent', 'Chef de département', 'Administrateur'] },
  ];

  const adminItems = [
    { path: '/users', label: 'Collaborateurs', roles: ['Administrateur'] },
    { path: '/departments', label: 'Directions', roles: ['Administrateur'] },
    { path: '/objectives', label: 'Axes Stratégiques', roles: ['Administrateur'] },
    { path: '/processes', label: 'Processus Métiers', roles: ['Administrateur'] },
  ];

  const filteredMenu = menuItems.filter(item => profile && item.roles.includes(profile.role));

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      
      {/* SIDEBAR - DESKTOP */}
      <aside className="hidden lg:flex w-[280px] bg-white border-r border-slate-200 flex-col z-30 shadow-sm">
        <div className="h-20 flex items-center px-6 bg-bgfi-blue gap-3">
          <div className="h-9 w-9 bg-white rounded flex items-center justify-center p-1 shadow-inner">
            <img src="/images/logo.png" alt="Logo" className="h-full w-full object-contain" />
          </div>
          <h2 className="text-xl font-black text-white">BGFI<span className="text-bgfi-olive">Bank</span></h2>
        </div>

        <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-1">
          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Pilotage</p>
          {filteredMenu.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                isActive(item.path) 
                ? 'bg-bgfi-blue text-white shadow-lg shadow-bgfi-blue/20' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-bgfi-blue'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}

          {profile?.role === 'Administrateur' && (
            <div className="mt-10 pt-6 border-t border-slate-100">
              <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Configuration</p>
              {adminItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive(item.path) ? 'text-bgfi-blue bg-bgfi-blue/5' : 'text-slate-500 hover:text-bgfi-blue'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40"></span>
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </nav>

        {/* Profil bas de Sidebar */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="h-10 w-10 rounded-xl bg-bgfi-blue text-white flex items-center justify-center font-black text-xs">
              {profile?.name?.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-slate-800 truncate">{profile?.name}</p>
              <p className="text-[10px] font-bold text-bgfi-blue uppercase tracking-tighter truncate">{profile?.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* HEADER TOP BAR */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 z-20">
          <div className="flex items-center gap-4">
            {/* Bouton Menu Mobile */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
            </button>
            <div className="hidden md:block">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
                 Système de Pilotage Stratégique
               </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-xs font-black text-slate-500 hover:text-red-600 transition-colors border border-slate-200 rounded-xl hover:bg-red-50 hover:border-red-100"
            >
              <span>DÉCONNEXION</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] custom-scrollbar">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* MOBILE OVERLAY MENU (Optionnel, à implémenter si besoin) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 lg:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
           {/* Sidebar mobile content here */}
        </div>
      )}

    </div>
  );
}