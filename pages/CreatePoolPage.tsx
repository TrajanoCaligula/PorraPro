import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../constants';
import { supabase } from '../lib/supabase';

const CreatePoolPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Estados del formulario
  const [poolName, setPoolName] = useState('');
  const [competition, setCompetition] = useState('Mundial 2026');
  const [isPrivate, setIsPrivate] = useState(true);
  const [poolCode, setPoolCode] = useState(''); // El código generado por Supabase

  const handleCreatePool = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error("Debes estar logueado");

      // Insertar en la tabla 'porras' (ajusta el nombre si es distinto)
      const { data, error } = await supabase
          .from('Pools') // Nombre exacto de tu tabla
          .insert([
            { 
              name: poolName, 
              competition: competition,
              is_private: isPrivate,
              idAdmin: user.id, // Tu tabla usa idAdmin
              score_system: 'equilibrado'
            }
          ])
          .select()
          .single();

        if (error) throw error;

        // Ahora usamos .code que es la columna nueva
        setPoolCode(data.code); 
        setStep(3);
    } catch (error) {
      console.error("Error creando porra:", error);
      alert("No se pudo crear la porra. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const link = `porrapro.vercel.app/p/${poolCode}`;
    navigator.clipboard.writeText(link);
    alert("¡Enlace copiado!");
  };

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
          
          {/* PASO 1: INFORMACIÓN */}
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
                    className="w-full bg-brand-blue-deep border border-brand-blue-light rounded-xl p-4 font-bold outline-none focus:border-brand-green text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-text-dim">Competición</label>
                  <select 
                    value={competition}
                    onChange={(e) => setCompetition(e.target.value)}
                    className="w-full bg-brand-blue-deep border border-brand-blue-light rounded-xl p-4 font-bold outline-none text-white"
                  >
                    <option value="Mundial 2026">🌍 Mundial 2026</option>
                    <option disabled>Champions 2026/27 — Pronto</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* PASO 2: CONFIGURACIÓN */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-black">Configuración</h2>
                <p className="text-brand-text-dim">Personaliza la experiencia de tu grupo.</p>
              </div>
              <div className="bg-brand-surface p-6 rounded-2xl border border-brand-border space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="font-bold text-white">Privacidad</p>
                    <p className="text-xs text-brand-text-dim">¿Todos o solo con invitación?</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsPrivate(true)}
                      className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${isPrivate ? 'bg-brand-green text-brand-blue-deep' : 'bg-brand-blue-deep text-brand-text-dim border border-brand-blue-light'}`}
                    >
                      Privada
                    </button>
                    <button 
                      onClick={() => setIsPrivate(false)}
                      className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${!isPrivate ? 'bg-brand-green text-brand-blue-deep' : 'bg-brand-blue-deep text-brand-text-dim border border-brand-blue-light'}`}
                    >
                      Pública
                    </button>
                  </div>
                </div>
                <hr className="border-brand-blue-light" />
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-text-dim uppercase tracking-widest">Sistema de Puntuación</label>
                  <div className="p-4 bg-brand-blue-deep border-2 border-brand-green rounded-xl relative">
                    <span className="absolute top-2 right-4 text-[10px] font-black text-brand-green uppercase tracking-tighter">Recomendado</span>
                    <p className="font-bold text-white">B — Equilibrado ★</p>
                    <p className="text-xs text-brand-text-dim">Exacto: +15, 1X2: +5, Dif: +2</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PASO 3: ÉXITO */}
          {step === 3 && (
            <div className="space-y-8 text-center">
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-brand-green">¡Porra creada! 🎉</h2>
                <p className="text-brand-text-dim">Ahora invita a tus amigos para empezar el juego.</p>
              </div>
              
              <div className="bg-brand-blue-deep border border-brand-blue-light p-4 rounded-xl flex items-center justify-between">
                <span className="mono-font text-xs truncate mr-4 text-brand-green">porrapro.vercel.app/p/{poolCode}</span>
                <button 
                  onClick={copyToClipboard}
                  className="bg-brand-green text-brand-blue-deep px-4 py-2 rounded-lg font-bold text-xs whitespace-nowrap"
                >
                  Copiar
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <a 
                  href={`https://wa.me/?text=¡Únete a mi porra ${poolName} del Mundial 2026! Entra aquí: porrapro.vercel.app/p/${poolCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] text-white py-4 rounded-xl font-black flex items-center justify-center gap-3"
                >
                  Compartir en WhatsApp
                </a>
                <Link to="/dashboard" className="w-full bg-brand-green text-brand-blue-deep py-4 rounded-xl font-black">
                  Ir al Dashboard
                </Link>
              </div>
            </div>
          )}

          {/* BOTONES DE NAVEGACIÓN */}
          <div className="flex gap-4 pt-4">
            {step > 1 && step < 3 && (
              <button 
                disabled={loading}
                onClick={() => setStep(step - 1)} 
                className="flex-grow py-4 bg-brand-blue-deep border border-brand-blue-light rounded-xl font-bold text-white disabled:opacity-50"
              >
                Atrás
              </button>
            )}
            {step < 3 && (
              <button 
                onClick={step === 2 ? handleCreatePool : () => setStep(step + 1)} 
                disabled={loading || (step === 1 && !poolName)}
                className="flex-[2] py-4 bg-brand-green hover:bg-brand-green-dark text-brand-blue-deep rounded-xl font-black transition-all shadow-xl shadow-brand-green/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creando..." : step === 2 ? "Finalizar y Crear" : "Siguiente paso"}
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