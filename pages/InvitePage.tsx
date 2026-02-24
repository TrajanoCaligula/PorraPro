import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const InvitePage = () => {
  const { code } = useParams(); // Captura el código de la URL
  const navigate = useNavigate();
  const [status, setStatus] = useState("Procesando invitación...");

  useEffect(() => {
    const handleJoin = async () => {
      // 1. Verificar si hay sesión de Auth
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Si no está logueado, guardamos el código y mandamos al login
        localStorage.setItem("pendingPoolJoin", code || "");
        setStatus("Redirigiendo al login...");
        navigate("/", { state: { openAuth: true } }); 
        return;
      }

      try {
        setStatus("Sincronizando perfil...");

        // 2. ESTRATEGIA UPSERT: Asegura que el usuario existe en tu tabla pública "Users"
        // Esto evita el error de "Usuario no encontrado" si el trigger tarda
        const { error: userError } = await supabase
          .from("Users")
          .upsert({
            "idUser": user.id, // Tu PK es UUID según tu SQL anterior
            nickname: user.user_metadata.full_name || user.email?.split('@')[0] || "Jugador",
            email: user.email,
            avatar_url: user.user_metadata.avatar_url,
          }, { onConflict: 'idUser' });

        if (userError) throw new Error("Error al sincronizar perfil");

        // 3. Obtener el idPool a partir del código corto
        const { data: pool, error: poolError } = await supabase
          .from("Pools")
          .select("idPool, name")
          .eq("code", code)
          .single();

        if (poolError || !pool) throw new Error("La porra no existe.");

        // 4. Intentar insertar la participación
        const { error: joinError } = await supabase
          .from("PoolParticipations")
          .insert({
            idPool: pool.idPool,
            idUser: user.id // Usamos el ID del usuario autenticado
          });

        // Error '23505' = ya eres miembro, no pasa nada
        if (joinError && joinError.code !== '23505') throw joinError;

        setStatus(`¡Te has unido a ${pool.name}!`);
        setTimeout(() => navigate("/dashboard"), 1500);

      } catch (error: any) {
        console.error(error);
        setStatus(`Error: ${error.message}`);
      }
    };

    if (code) handleJoin();
  }, [code, navigate]);

  return (
    <div className="min-h-screen bg-brand-blue-deep flex items-center justify-center text-white">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-green mx-auto"></div>
        <p className="text-xl font-bold">{status}</p>
      </div>
    </div>
  );
};

export default InvitePage;