import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const InvitePage = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Validando invitación...");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Definimos la función DENTRO del useEffect para que tenga acceso a code y navigate
    const handleJoin = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          localStorage.setItem("pendingPoolJoin", code || "");
          setStatus("Casi listo. Identifícate para entrar...");
          setTimeout(() => navigate("/", { state: { openAuth: true } }), 1500);
          return;
        }

        setStatus("Sincronizando tu perfil...");
        
        // 1. Asegurar usuario en tabla pública
        const { error: userError } = await supabase
          .from("Users")
          .upsert({
            "idUser": user.id,
            nickname: user.user_metadata.full_name || user.email?.split('@')[0] || "Jugador",
            email: user.email,
            avatar_url: user.user_metadata.avatar_url,
          }, { onConflict: 'idUser' });

        if (userError) throw new Error("No pudimos conectar con tu perfil");

        // 2. Buscar la porra
        const { data: pool, error: poolError } = await supabase
          .from("Pools")
          .select("idPool, name")
          .eq("code", code)
          .single();

        if (poolError || !pool) throw new Error("Esta porra no existe o el código es incorrecto");

        // 3. Unir al usuario
        const { error: joinError } = await supabase
          .from("PoolParticipations")
          .insert({ idPool: pool.idPool, idUser: user.id });

        // Ignorar si ya es miembro (error 23505)
        if (joinError && joinError.code !== '23505') throw joinError;

        setStatus(`¡Bienvenido a ${pool.name}!`);
        setTimeout(() => navigate("/dashboard"), 2000);

      } catch (error: any) {
        console.error("Error en InvitePage:", error);
        setIsError(true);
        setStatus(error.message || "Error al unirse a la porra");
      }
    };

    if (code) {
      handleJoin();
    } else {
      setIsError(true);
      setStatus("Código de invitación no válido");
    }
  }, [code, navigate]);

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Glow de fondo */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-blue-deep/20 to-black pointer-events-none"></div>
      
      <div className="relative bg-[#161d2f] border border-white/10 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center z-10">
        <div className="mb-6 flex justify-center">
          {isError ? (
            <div className="bg-red-500/20 p-4 rounded-full text-4xl">⚠️</div>
          ) : status.includes("Bienvenido") ? (
            <div className="bg-green-500/20 p-4 rounded-full animate-bounce text-4xl">⚽</div>
          ) : (
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-400 border-r-2 border-transparent"></div>
          )}
        </div>

        <h2 className={`text-2xl font-bold mb-2 ${isError ? 'text-red-400' : 'text-white'}`}>
          {isError ? "¡Ups!" : "Unirse a Porra"}
        </h2>
        
        <p className="text-gray-400 text-lg leading-relaxed min-h-[3rem]">
          {status}
        </p>

        {!isError && !status.includes("Bienvenido") && (
          <div className="mt-8 flex justify-center gap-2">
            <div className="h-1.5 w-1.5 bg-green-400 rounded-full animate-ping"></div>
            <div className="h-1.5 w-1.5 bg-green-400 rounded-full animate-ping [animation-delay:0.2s]"></div>
            <div className="h-1.5 w-1.5 bg-green-400 rounded-full animate-ping [animation-delay:0.4s]"></div>
          </div>
        )}

        {isError && (
          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-6 w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/10"
          >
            Volver al Dashboard
          </button>
        )}
      </div>
    </div>
  );
};

export default InvitePage;