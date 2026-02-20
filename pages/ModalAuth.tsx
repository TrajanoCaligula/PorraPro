// JavaScript source code
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
    })

    setLoading(false)
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 style={{ marginBottom: 20 }}>Iniciar sesión</h2>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={googleButtonStyle}
        >
          {loading ? "Cargando..." : "Continuar con Google"}
        </button>

        <button onClick={onClose} style={closeStyle}>
          Cerrar
        </button>
      </div>
    </div>
  )
}

/* --- estilos simples inline --- */

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
}

const modalStyle: React.CSSProperties = {
  background: "white",
  padding: "2rem",
  borderRadius: "12px",
  width: "320px",
  textAlign: "center",
}

const googleButtonStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  marginBottom: "1rem",
  borderRadius: "6px",
  cursor: "pointer",
  border: "1px solid #ddd",
}

const closeStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
}