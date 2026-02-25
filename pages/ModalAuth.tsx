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
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}`,
        },
      })
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Botón X de cerrar mejorado */}
        <button onClick={onClose} style={closeButtonStyle}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 5L5 15M5 5l10 10" />
          </svg>
        </button>

        <div style={contentStyle}>
          <h2 style={titleStyle}>Bienvenido de nuevo</h2>
          <p style={subtitleStyle}>Inicia sesion para acceder a todas las funciones</p>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
            style={googleButtonStyle}
          >
            {loading ? (
              "Cargando..."
            ) : (
              <>
                <img 
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                  alt="Google" 
                  style={{ width: '20px', height: '20px' }} 
                />
                <span style={{ marginLeft: '12px' }}>Continuar con Google</span>
              </>
            )}
          </button>
          
          <p style={footerTextStyle}>
            Al continuar, aceptas nuestros terminos y condiciones
          </p>
        </div>
      </div>
    </div>
  )
}

/* --- Estilos unificados (Corregidos) --- */

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  backdropFilter: "blur(4px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
}

const modalStyle: React.CSSProperties = {
  position: "relative",
  background: "#ffffff",
  padding: "48px 32px 32px 32px",
  borderRadius: "24px",
  width: "90%",
  maxWidth: "400px",
  textAlign: "center",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)", // Sombra más suave
}

const contentStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}

const titleStyle: React.CSSProperties = {
  margin: "0 0 8px 0",
  color: "#111827",
  fontSize: "24px",
  fontWeight: "700",
}

const subtitleStyle: React.CSSProperties = {
  margin: "0 0 32px 0",
  color: "#4b5563",
  fontSize: "16px",
  lineHeight: "1.5",
}

const googleButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  padding: "16px",
  borderRadius: "14px",
  cursor: "pointer",
  border: "1px solid #e5e7eb",
  backgroundColor: "#ffffff",
  fontWeight: "600",
  fontSize: "16px",
  color: "#374151",
  transition: "background-color 0.2s",
}

const closeButtonStyle: React.CSSProperties = {
  position: "absolute",
  top: "20px",
  right: "20px",
  background: "#f3f4f6",
  border: "none",
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "#6b7280",
}

const footerTextStyle: React.CSSProperties = {
  marginTop: "24px",
  fontSize: "13px",
  color: "#9ca3af",
}