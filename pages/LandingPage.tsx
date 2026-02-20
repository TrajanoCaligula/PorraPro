import React from 'react';
import { useState } from "react"
import { Link } from 'react-router-dom';
import { Logo } from '../constants';
import ModalAuth from "./pages/ModalAuth"

const LandingPage: React.FC = () => {

  const [isAuthOpen, setIsAuthOpen] = useState(false)

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-6 py-8 flex justify-between items-center">
        <Logo />
        <div className="flex items-center gap-4">

          {/* BOTÓN LOGIN */}
          <button
            onClick={() => setIsAuthOpen(true)}
            className="hidden sm:block text-brand-text-dim font-bold hover:text-white transition-colors"
          >
            Iniciar Sesión
          </button>

          <Link 
            to="/crear-porra" 
            className="bg-brand-green hover:bg-brand-green-dark text-brand-blue-deep px-6 py-2.5 rounded-full font-bold transition-all shadow-lg shadow-brand-green/20"
          >
            Crea Porra
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="container mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-block px-4 py-1.5 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green font-bold text-sm tracking-widest uppercase">
            Mundial 2026
          </div>

          <h1 className="text-6xl md:text-8xl font-black leading-none">
            La porra del Mundial que se <span className="text-brand-green">gestiona sola.</span>
          </h1>

          <p className="text-xl text-brand-text-dim max-w-lg">
            Tiempo real. Cero Excel. Puntuaciones automáticas y ranking en vivo por solo 1,99€.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/crear-porra" 
              className="bg-brand-green hover:bg-brand-green-dark text-brand-blue-deep px-8 py-4 rounded-xl font-black text-lg transition-all text-center flex items-center justify-center gap-2 group"
            >
              Crea tu porra gratis 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>

            <a 
              href="#como-funciona" 
              className="px-8 py-4 rounded-xl font-bold text-lg text-white border border-brand-blue-light hover:bg-brand-blue-light transition-all text-center"
            >
              Ver cómo funciona
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-brand-green/20 blur-3xl rounded-full"></div>
          <div className="relative bg-brand-blue-mid border border-brand-blue-light rounded-3xl p-6 shadow-2xl overflow-hidden">
            <h3 className="display-font text-xl mb-6">Ranking en tiempo real</h3>
            <div className="space-y-3">
              {[
                { name: 'Marc G.', pts: 312, pos: 1, up: true },
                { name: 'Laura P.', pts: 287, pos: 2, up: false },
                { name: 'Jordi T.', pts: 271, pos: 3, up: true },
              ].map((p, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-brand-surface rounded-xl border border-brand-border">
                  <span className="mono-font font-bold w-4 text-center">{p.pos}</span>
                  <span className="font-bold flex-grow">{p.name}</span>
                  <span className="mono-font text-brand-green font-bold">{p.pts} PTS</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-blue-deep border-t border-brand-blue-light py-16 text-center">
        <Logo className="mb-6" />
        <p className="text-brand-text-dim max-w-md mx-auto mb-8">
          Porra Pro NO gestiona el bote de dinero entre participantes.
        </p>
      </footer>

      {/* 🔥 MODAL AUTH AQUÍ */}
      <ModalAuth
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

    </div>
  );
};

export default LandingPage;