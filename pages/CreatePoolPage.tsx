
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../constants';

const CreatePoolPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [poolName, setPoolName] = useState('');

  return (
    <div className="min-h-screen bg-brand-blue-deep flex flex-col p-6 items-center">
      <header className="py-12">
        <Logo />
      </header>

      <div className="w-full max-w-xl space-y-10">
        {/* Stepper */}
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-brand-blue-light -translate-y-1/2 z-0"></div>
          {[1, 2, 3].map(s => (
            <div 
              key={s} 
              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                step >= s ? 'bg-brand-green border-brand-green text-brand-blue-deep' : 'bg-brand-blue-deep border-brand-blue-light text-brand-text-dim'
              }`}
            >
              {s}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-brand-blue-mid border border-brand-blue-light rounded-3xl p-8 md:p-12 shadow-2xl space-y-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-black">Información Básica</h2>
                <p className="text-brand-text-dim">Comenzarás la mejor porra de la historia.</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-text-dim">Nombre de la Porra</label>
                  <input 
                    type="text" 
                    value={poolName}
                    onChange={(e) => setPoolName(e.target.value)}
                    placeholder="ej. Mundial Oficina 2026" 
                    className="w-full bg-brand-blue-deep border border-brand-blue-light rounded-xl p-4 font-bold outline-none focus:border-brand-green"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-text-dim">Competición</label>
                  <select className="w-full bg-brand-blue-deep border border-brand-blue-light rounded-xl p-4 font-bold outline-none">
                    <option>🌍 Mundial 2026</option>
                    <option disabled>Champions 2026/27 — Pronto</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-black">Configuración</h2>
                <p className="text-brand-text-dim">Personaliza la experiencia de tu grupo.</p>
              </div>
              <div className="bg-brand-surface p-6 rounded-2xl border border-brand-border space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="font-bold">Privacidad</p>
                    <p className="text-xs text-brand-text-dim">¿Todos o solo con invitación?</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-brand-green text-brand-blue-deep rounded-lg font-bold text-xs">Privada</button>
                    <button className="px-4 py-2 bg-brand-blue-deep border border-brand-blue-light rounded-lg font-bold text-xs text-brand-text-dim">Pública</button>
                  </div>
                </div>
                <hr className="border-brand-blue-light" />
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-text-dim uppercase tracking-widest">Sistema de Puntuación</label>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-4 bg-brand-blue-deep border-2 border-brand-green rounded-xl relative">
                      <span className="absolute top-2 right-4 text-[10px] font-black text-brand-green uppercase tracking-tighter">Recomendado</span>
                      <p className="font-bold">B — Equilibrado ★</p>
                      <p className="text-xs text-brand-text-dim">Exacto: +15, 1X2: +5, Dif: +2</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 text-center">
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-brand-green">¡Porra creada! 🎉</h2>
                <p className="text-brand-text-dim">Ahora invita a tus amigos para empezar el juego.</p>
              </div>
              
              <div className="bg-brand-blue-deep border border-brand-blue-light p-4 rounded-xl flex items-center justify-between">
                <span className="mono-font text-xs truncate mr-4">porrapro.app/p/MUNDIAL-OFIC-2026</span>
                <button className="bg-brand-green text-brand-blue-deep px-4 py-2 rounded-lg font-bold text-xs whitespace-nowrap">Copiar</button>
              </div>

              <div className="flex flex-col gap-3">
                <button className="w-full bg-[#25D366] text-white py-4 rounded-xl font-black flex items-center justify-center gap-3">
                   WhatsApp
                </button>
                <Link to="/dashboard" className="w-full bg-brand-green text-brand-blue-deep py-4 rounded-xl font-black">
                  Ir al Dashboard
                </Link>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            {step > 1 && step < 3 && (
              <button onClick={() => setStep(step - 1)} className="flex-grow py-4 bg-brand-blue-deep border border-brand-blue-light rounded-xl font-bold">Atrás</button>
            )}
            {step < 3 && (
              <button 
                onClick={() => setStep(step + 1)} 
                className="flex-[2] py-4 bg-brand-green hover:bg-brand-green-dark text-brand-blue-deep rounded-xl font-black transition-all shadow-xl shadow-brand-green/20"
              >
                Siguiente paso
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-brand-text-dim text-sm italic">
          Porra Pro NO gestiona dinero. Somos una plataforma de pronósticos.
        </p>
      </div>
    </div>
  );
};

export default CreatePoolPage;
