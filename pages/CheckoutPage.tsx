
import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../constants';

const CheckoutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-blue-deep flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-4">
          <Logo className="mx-auto mb-4" />
          <h1 className="text-3xl font-black">Desbloquea tus pronósticos</h1>
          <p className="text-brand-text-dim">Mundial Oficina 2026 · Creado por Marc G. · 18 miembros</p>
        </div>

        <div className="bg-brand-blue-mid border-2 border-brand-green rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-brand-green text-brand-blue-deep px-4 py-1 text-[10px] font-black uppercase tracking-tighter transform rotate-12 translate-x-2 translate-y-2">
            Pago único
          </div>

          <div className="text-center space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-widest">ACCESO COMPLETO</h2>
            <div className="text-6xl font-black">1,99€</div>
            <p className="text-brand-text-dim text-sm italic">"El precio de un café para todo el Mundial"</p>

            <ul className="text-left space-y-3 text-sm font-medium pt-4">
              <li className="flex items-center gap-3"><span className="text-brand-green">✓</span> 104 partidos del Mundial 2026</li>
              <li className="flex items-center gap-3"><span className="text-brand-green">✓</span> Ranking actualizado en tiempo real</li>
              <li className="flex items-center gap-3"><span className="text-brand-green">✓</span> Notificaciones de resultados</li>
              <li className="flex items-center gap-3"><span className="text-brand-green">✓</span> Estadísticas detalladas</li>
              <li className="flex items-center gap-3"><span className="text-brand-green">✓</span> Pronósticos bloqueados anti-trampa</li>
            </ul>

            <div className="space-y-3 pt-6">
              <Link to="/dashboard" className="block w-full bg-brand-green hover:bg-brand-green-dark text-brand-blue-deep py-4 rounded-xl font-black transition-all shadow-xl shadow-brand-green/20">
                Pagar con Tarjeta
              </Link>
              <button className="w-full bg-white text-black py-4 rounded-xl font-black flex items-center justify-center gap-2">
                <span> Pay</span> Apple Pay
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-brand-text-dim">
              <span>🔒</span> Pago seguro vía Stripe
            </div>
          </div>
        </div>

        <div className="space-y-6 text-center">
          <p className="text-xs text-brand-text-dim leading-relaxed">
            "Porra Pro cobra 1,99€ por el acceso a la plataforma tecnológica. Porra Pro NO gestiona, custodia ni interviene en ningún bote de dinero entre participantes. Cualquier acuerdo económico entre miembros del grupo es responsabilidad exclusiva de los mismos."
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 grayscale opacity-50">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" className="h-4" alt="Stripe" />
            </div>
            <div className="w-px h-4 bg-brand-blue-light"></div>
            <p className="text-xs text-brand-text-dim">Política de devolución: 7 días</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
