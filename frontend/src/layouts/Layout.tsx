import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';

// --- Composants d'icônes SVG ---
const Icons = {
  Dashboard: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
  ),
  Tasks: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  ),
  Validation: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
  ),
  Reports: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
  ),
  Users: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Departments: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
  ),
  Objectives: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
  ),
  Processes: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
  )
};

export default function Layout() {
  const { user, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Tableau de bord', icon: <Icons.Dashboard />, roles: ['Agent', 'Chef de département', 'Administrateur'] },
    { path: '/tasks', label: 'Suivi des activités', icon: <Icons.Tasks />, roles: ['Agent', 'Chef de département', 'Administrateur'] },
    { path: '/validation', label: 'Validation Manager', icon: <Icons.Validation />, roles: ['Chef de département', 'Administrateur'] },
    { path: '/reports', label: 'Reporting & Pilotage', icon: <Icons.Reports />, roles: ['Agent', 'Chef de département', 'Administrateur'] },
  ];

  const adminItems = [
    { path: '/users', label: 'Collaborateurs', icon: <Icons.Users />, roles: ['Administrateur'] },
    { path: '/departments', label: 'Directions', icon: <Icons.Departments />, roles: ['Administrateur'] },
    { path: '/objectives', label: 'Axes Stratégiques', icon: <Icons.Objectives />, roles: ['Administrateur'] },
    { path: '/processes', label: 'Processus Métiers', icon: <Icons.Processes />, roles: ['Administrateur'] },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      
      {/* Sidebar - Design clean blanc */}
      <aside className="w-[280px] bg-white border-r border-gray-200 flex flex-col z-20 hidden lg:flex shadow-sm">
        
        {/* Header de la sidebar - Fond BLEU BGFIBank pur */}
        <div className="h-16 flex items-center px-6 bg-bgfi-blue gap-3">
          <img 
            src="/images/bgfi.jfif" 
            alt="Logo" 
            className="h-8 w-8 object-contain bg-white rounded p-0.5"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <h2 className="text-xl font-black tracking-tight text-white">
            BGFI<span className="text-bgfi-olive">Bank</span>
          </h2>
        </div>

        {/* Zone des menus de navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 mt-2">Navigation Principale</p>
          
          {navItems.map((item) => (
            profile && item.roles.includes(profile.role) && (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive(item.path) 
                    ? 'bg-bgfi-blue text-white shadow-md shadow-bgfi-blue/20' 
                    : 'text-gray-600 hover:bg-bgfi-blue/5 hover:text-bgfi-blue'
                }`}
              >
                <span className={`flex-shrink-0 ${isActive(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-bgfi-blue'}`}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            )
          ))}

          {profile?.role === 'Administrateur' && (
            <div className="pt-6 mt-6 border-t border-gray-100">
              <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Administration Système</p>
              {adminItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive(item.path) 
                      ? 'bg-bgfi-blue text-white shadow-md shadow-bgfi-blue/20' 
                      : 'text-gray-600 hover:bg-bgfi-blue/5 hover:text-bgfi-blue'
                  }`}
                >
                   <span className={`flex-shrink-0 ${isActive(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-bgfi-blue'}`}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Profil de l'utilisateur */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 m-2 rounded-xl border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-bgfi-blue/10 text-bgfi-blue flex items-center justify-center text-sm font-bold border border-bgfi-blue/20">
              {profile?.name ? profile.name.substring(0, 2).toUpperCase() : '👤'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{profile?.name || 'Chargement...'}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                <p className="text-xs font-medium text-gray-500 truncate">{profile?.role || 'Vérification...'}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Contenu principal de la page */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        
        {/* En-tête supérieur (Top bar) */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
          
          {/* Titre dynamique pour le mobile */}
          <div className="flex items-center gap-3 lg:hidden">
            <img 
              src="/images/bgfi.jfif" 
              alt="Logo" 
              className="h-8 w-8 object-contain rounded"
            />
            <h2 className="text-lg font-black text-bgfi-blue">
              BGFI<span className="text-bgfi-olive">Bank</span>
            </h2>
          </div>

          <div className="hidden lg:block flex-1">
            <p className="text-sm font-medium text-gray-500">
              Espace sécurisé <span className="text-bgfi-blue font-bold px-1">•</span> Session active
            </p>
          </div>

          {/* Bouton de déconnexion */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-red-600 transition-all bg-white hover:bg-red-50 px-3 py-1.5 rounded-md border border-gray-200"
          >
            <span>Déconnexion</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </header>

        {/* Espace d'affichage des composants enfants */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] relative">
          <div className="w-full">
            <Outlet />
          </div>
        </main>
        
      </div>
    </div>
  );
}