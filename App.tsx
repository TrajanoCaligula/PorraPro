
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

import ProtectedRoute from "./pages/ProtectedRoute";
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import MatchesPage from './pages/MatchesPage';
import RankingPage from './pages/RankingPage';
import CreatePoolPage from './pages/CreatePoolPage';
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
  const [isPaid, setIsPaid] = useState(false);

  // Bottom Nav for mobile, Sidebar for desktop
  const navItems = [
    { label: 'Inicio', path: '/dashboard', icon: '🏠' },
    { label: 'Partidos', path: '/partits', icon: '⚽' },
    { label: 'Ranking', path: '/ranking', icon: '🏆' },
    { label: 'Ajustes', path: '/dashboard', icon: '⚙️' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-brand-blue-mid border-r border-brand-blue-light p-6 sticky top-0 h-screen">
        <Logo className="mb-12" />
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
        <div className="mt-auto pt-6 border-t border-brand-blue-light">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center font-bold text-brand-blue-deep">
              TU
            </div>
            <div>
              <p className="font-bold text-white">Tu Nombre</p>
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
