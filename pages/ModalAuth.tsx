import { supabase } from "../lib/supabase"
import { useState } from "react"

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function ModalAuth({ isOpen, onClose }: Props) {
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleGoogleLogin = async () => {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
            redirectTo: `${window.location.origin}`,
      }
    })
    setLoading(false)
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        {/* Botón de cerrar (X) */}
        <button onClick={onClose} style={closeButtonStyle}>
          &times;
        </button>

        <h2 style={titleStyle}>Iniciar sesión</h2>
        <p style={subtitleStyle}>Usa tu cuenta para continuar</p>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={googleButtonStyle}
        >
          {loading ? "Cargando..." : "Continuar con Google"}
        </button>
      </div>
    </div>
  )
}

/* --- Estilos actualizados --- */

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.6)", // Fondo un poco más oscuro
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
}

const modalStyle: React.CSSProperties = {
  position: "relative", // Necesario para posicionar la X
  background: "white",
  padding: "2.5rem 2rem 2rem 2rem",
  borderRadius: "16px",
  width: "340px",
  textAlign: "center",
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
}

const titleStyle: React.CSSProperties = {
  marginBottom: "8px",
  color: "#1a1a1a", // Texto casi negro para mejor contraste
  fontSize: "1.5rem",
}

const subtitleStyle: React.CSSProperties = {
  marginBottom: "24px",
  color: "#4a4a4a", // Gris oscuro
  fontSize: "0.9rem",
}

const googleButtonStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  cursor: "pointer",
  border: "1px solid #ccc",
  backgroundColor: "#fff",
  fontWeight: "600",
  color: "#222", // Texto del botón más oscuro
  transition: "background 0.2s",
}

const closeButtonStyle: React.CSSProperties = {
  position: "absolute",
  top: "12px",
  right: "16px",
  background: "none",
  border: "none",
  fontSize: "24px",
  lineHeight: "1",
  cursor: "pointer",
  color: "#333", // Color de la X
  padding: "5px",
}