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

  const navItems =