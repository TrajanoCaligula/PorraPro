
import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../constants';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-6 py-8 flex justify-between items-center">
        <Logo />
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="hidden sm:block text-brand-text-dim font-bold hover:text-white transition-colors">Iniciar Sesión</Link>
          <Link to="/crear-porra" className="bg-brand-green hover:bg-brand-green-dark text-brand-blue-deep px-6 py-2.5 rounded-full font-bold transition-all shadow-lg shadow-brand-green/20">Crea Porra</Link>
        </div>
      </header>

      {/* Hero Section */}
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
            <Link to="/crear-porra" className="bg-brand-green hover:bg-brand-green-dark text-brand-blue-deep px-8 py-4 rounded-xl font-black text-lg transition-all text-center flex items-center justify-center gap-2 group">
              Crea tu porra gratis 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <a href="#como-funciona" className="px-8 py-4 rounded-xl font-bold text-lg text-white border border-brand-blue-light hover:bg-brand-blue-light transition-all text-center">
              Ver cómo funciona
            </a>
          </div>
          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <img key={i} src={`https://picsum.photos/seed/${i}/40/40`} className="w-10 h-10 rounded-full border-2 border-brand-blue-deep" alt="User avatar" />
              ))}
            </div>
            <p className="text-brand-text-dim text-sm">
              <span className="text-white font-bold">+1.200</span> porras creadas esta semana
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 bg-brand-green/20 blur-3xl rounded-full"></div>
          <div className="relative bg-brand-blue-mid border border-brand-blue-light rounded-3xl p-6 shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="display-font text-xl">Ranking en tiempo real</h3>
              <span className="bg-brand-red text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse uppercase">En vivo</span>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Marc G.', pts: 312, pos: 1, up: true },
                { name: 'Laura P.', pts: 287, pos: 2, up: false },
                { name: 'Jordi T.', pts: 271, pos: 3, up: true },
              ].map((p, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-brand-surface rounded-xl border border-brand-border">
                  <span className={`mono-font font-bold w-4 text-center ${i === 0 ? 'text-brand-gold' : 'text-brand-text-dim'}`}>{p.pos}</span>
                  <div className="w-8 h-8 rounded-full bg-brand-blue-light flex items-center justify-center font-bold text-xs">{p.name[0]}</div>
                  <span className="font-bold flex-grow">{p.name}</span>
                  <span className="mono-font text-brand-green font-bold">{p.pts} <span className="text-[10px]">PTS</span></span>
                  <span className={p.up ? 'text-brand-green text-xs' : 'text-brand-red text-xs'}>{p.up ? '▲' : '▼'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section id="como-funciona" className="bg-brand-blue-mid py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16">Tres pasos hacia la gloria</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: '01', title: 'Crea la porra en 2 minutos', desc: 'Define las reglas, el nombre del grupo e invita a todos.', icon: '➕' },
              { step: '02', title: 'Invita a tus amigos con un link', desc: 'Sin registros complicados. Envía un WhatsApp y listo.', icon: '👥' },
              { step: '03', title: 'Seguid el Mundial en tiempo real', desc: 'Cada gol cambia el ranking automáticamente. Cero Excel.', icon: '⚡' },
            ].map((s, i) => (
              <div key={i} className="relative group">
                <div className="text-8xl absolute -top-8 -left-4 opacity-5 mono-font font-black">{s.step}</div>
                <div className="relative space-y-4">
                  <div className="text-5xl mb-6">{s.icon}</div>
                  <h3 className="text-2xl font-black">{s.title}</h3>
                  <p className="text-brand-text-dim leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-brand-blue-mid border-2 border-brand-green rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-brand-green text-brand-blue-deep px-6 py-2 font-black uppercase tracking-tighter transform rotate-12 translate-x-4 -translate-y-1">
              Popular
            </div>
            <h2 className="text-4xl font-black mb-4">ACCESO TOTAL AL MUNDIAL</h2>
            <p className="text-brand-text-dim mb-8">El precio de un café para vivir la mejor porra de tu vida.</p>
            <div className="text-7xl font-black mb-8">1,99€ <span className="text-xl text-brand-text-dim font-normal italic">pago único</span></div>
            <ul className="grid sm:grid-cols-2 gap-4 text-left max-w-md mx-auto mb-10">
              {['104 partidos del Mundial', 'Ranking automático 24/7', 'Notificaciones en vivo', 'Estadísticas y picos', 'Privacidad y anti-trampa', 'Soporte técnico priority'].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="text-brand-green">✓</span> {item}
                </li>
              ))}
            </ul>
            <Link to="/crear-porra" className="inline-block bg-brand-green hover:bg-brand-green-dark text-brand-blue-deep px-12 py-5 rounded-2xl font-black text-xl transition-all shadow-xl shadow-brand-green/20">
              Comienza ahora por 1,99€
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-blue-deep border-t border-brand-blue-light py-16">
        <div className="container mx-auto px-6 flex flex-col items-center text-center">
          <Logo className="mb-6" />
          <p className="text-brand-text-dim max-w-md mb-8">
            Porra Pro NO gestiona el bote de dinero entre participantes. Somos una plataforma tecnológica de pronósticos deportivos.
          </p>
          <div className="flex gap-8 mb-8 text-sm font-bold text-brand-text-dim">
            <a href="#" className="hover:text-white transition-colors">Términos y condiciones</a>
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
          <p className="text-xs text-brand-text-dim opacity-50">© 2026 Porra Pro. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
