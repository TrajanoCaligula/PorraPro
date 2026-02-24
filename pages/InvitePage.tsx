const handleJoin = async () => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    localStorage.setItem("pendingPoolJoin", code || "");
    navigate("/", { state: { openAuth: true } });
    return;
  }

  try {
    setStatus("Sincronizando perfil...");

    // ESTRATEGIA: En lugar de "buscar" si existe, usamos UPSERT.
    // Esto asegura que el usuario EXISTA en la tabla antes de seguir,
    // y si el trigger ya lo creó, simplemente lo actualiza (no da error).
    const { error: userError } = await supabase
      .from("Users")
      .upsert({
        "idUser": user.id,
        nickname: user.user_metadata.full_name || user.email?.split('@')[0] || "Jugador",
        email: user.email,
        avatar_url: user.user_metadata.avatar_url,
      }, { onConflict: 'idUser' });

    if (userError) throw new Error("Error al sincronizar perfil");

    // Ahora que el UPSERT garantiza que el usuario existe, buscamos la porra
    const { data: pool, error: poolError } = await supabase
      .from("Pools")
      .select("idPool, name")
      .eq("code", code)
      .single();

    if (poolError || !pool) throw new Error("La porra no existe");

    // Insertamos la participación
    const { error: joinError } = await supabase
      .from("PoolParticipations")
      .insert({
        idPool: pool.idPool,
        idUser: user.id
      });

    if (joinError && joinError.code !== '23505') throw joinError;

    setStatus(`¡Unido a ${pool.name}!`);
    setTimeout(() => navigate("/dashboard"), 1000);

  } catch (err: any) {
    console.error(err);
    setStatus(`Error: ${err.message}`);
  }
};