import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { supabase } from "./lib/supabase"; 

import ProtectedRoute from "./pages/ProtectedRoute";
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import MatchesPage from './pages/MatchesPage';
import RankingPage from './pages/RankingPage';
import CreatePoolPage from './pages/CreatePoolPage';
import InvitePage from './pages/InvitePage';
import CheckoutPage from './pages/CheckoutPage';
import { Logo } from './constants';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <WithNavigation><Dashboard /></WithNavigation>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/partits" 
            element={
              <ProtectedRoute>
                <WithNavigation><MatchesPage /></WithNavigation>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/ranking" 
            element={
              <ProtectedRoute>
                <WithNavigation><RankingPage /></WithNavigation>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/crear-porra" 
            element={
              <ProtectedRoute>
                <WithNavigation><CreatePoolPage /></WithNavigation>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/p/:code"
            element={
              <ProtectedRoute>
                <WithNavigation><InvitePage /></WithNavigation>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pagar" 
            element={
              <ProtectedRoute>
                <WithNavigation><CheckoutPage /></WithNavigation>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

const WithNavigation: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [userData, setUserData] = useState<{ name: string; avatar_url: string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('user_profile');
    if (saved) setUserData(JSON.parse(saved));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
        const profile = {
          name: session.user.user_metadata.full_name || session.user.email || 'Usuario',
          avatar_url: session.user.user_metadata.avatar_url || ''
        };
        localStorage.setItem('user_profile', JSON.stringify(profile));
        setUserData(profile);
      }
      
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('user_profile');
        setUserData(null);
      }
    });

    const handleStorageChange = () => {
      const updated = localStorage.getItem('user_profile');
      if (updated) setUserData(JSON.parse(updated));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('user_profile');
    window.location.href = "/"; // Redirección total para limpiar estados
  };

  const navItems = [
    { label: 'Inicio', path: '/dashboard', icon: '🏠' },
    { label: 'Partidos', path: '/partits', icon: '⚽' },
    { label: 'Ranking', path: '/ranking', icon: '🏆' },
    { label: 'Ajustes', path: '/settings', icon: '⚙️' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-brand-blue-mid border-r border-brand-blue-light p-6 sticky top-0 h-screen">
        <Link to="/dashboard" className="transition-transform hover:scale-105 active:scale-95 inline-block">
          <Logo className="mb-12" />
        </Link>
        <nav className="flex flex-col gap-2 flex-grow">
          {navItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path 
                  ? 'bg-brand-green/10 text-brand-green border border-brand-green/20' 
                  : 'text-brand-text-dim hover:bg-brand-blue-light hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-semibold">{item.label}</span>
            </Link>
          ))}
        </nav>
        
        {/* Footer Sidebar: Logout + Perfil */}
        <div className="mt-auto pt-6 border-t border-brand-blue-light">
          {/* BOTÓN CERRAR SESIÓN */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 mb-4 px-2 text-[11px] font-bold text-brand-text-dim hover:text-red-400 transition-colors uppercase tracking-widest group"
          >
            <span className="text-sm group-hover:rotate-12 transition-transform">🚪</span>
            Cerrar sesi&oacute;n
          </button>

          <div className="flex items-center gap-3">
            {userData?.avatar_url ? (
              <img 
                src={userData.avatar_url} 
                alt="Avatar" 
                className="w-10 h-10 rounded-full object-cover border-2 border-brand-green" 
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center font-bold text-brand-blue-deep uppercase">
                {userData?.name?.substring(0, 2) || 'TU'}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="font-bold text-white truncate text-sm">
                {userData?.name || 'Cargando...'}
              </p>
              <p className="text-xs text-brand-green font-mono">3º de 20</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow bg-brand-blue-deep pb-24 md:pb-0 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Nav Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-brand-blue-mid border-t border-brand-blue-light px-6 py-3 flex justify-between items-center z-50 backdrop-blur-lg bg-opacity-90">
        {navItems.map(item => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`flex flex-col items-center gap-1 transition-all ${
              location.pathname === item.path ? 'text-brand-green' : 'text-brand-text-dim'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default App;