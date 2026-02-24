import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const InvitePage = () => {
  const { code } = useParams(); // Captura el código de la URL
  const navigate = useNavigate();
  const [status, setStatus] = useState("Procesando invitación...");

  useEffect(() => {
    const joinPool = async () => {
      // 1. Verificar si hay sesión
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        // Si no está logueado, guardamos el código y mandamos a login
        localStorage.setItem("pendingPoolJoin", code || "");
        setStatus("Redirigiendo al login...");
        // Aquí podrías abrir tu ModalAuth o redirigir a una página de login
        navigate("/", { state: { openAuth: true } }); 
        return;
      }

      try {
        // 2. Obtener el idPool a partir del código corto (code)
        const { data: pool, error: poolError } = await supabase
          .from("Pools")
          .select("idPool")
          .eq("code", code)
          .single();

        if (poolError || !pool) throw new Error("La porra no existe.");

        // 3. Obtener el idUser real de tu tabla "Users" (ya que tu tabla usa bigint, no el UUID de auth directamente)
        const { data: userData } = await supabase
          .from("Users")
          .select("idUser")
          .eq("auth_id", session.user.id) // Asumiendo que guardas el UUID de Supabase en 'auth_id'
          .single();

        if (!userData) throw new Error("Usuario no encontrado en la base de datos.");

        // 4. Intentar insertar la participación
        const { error: joinError } = await supabase
          .from("PoolParticipations")
          .insert([
            { idPool: pool.idPool, idUser: userData.idUser }
          ]);

        // Si el error es '23505' significa que ya existe (PKey duplicada), lo ignoramos
        if (joinError && joinError.code !== '23505') throw joinError;

        setStatus("¡Unido con éxito! Redirigiendo...");
        setTimeout(() => navigate(`/dashboard`), 1500);

      } catch (error: any) {
        console.error(error);
        setStatus(`Error: ${error.message}`);
      }
    };

    if (code) joinPool();
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