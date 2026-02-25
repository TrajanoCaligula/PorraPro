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
    <div 
      style={overlayStyle} 
      onClick={onClose} // Cierra al hacer clic fuera
    >
      <div 
        style={modalStyle} 
        onClick={(e) => e.stopPropagation()} // Evita cerrar al hacer clic dentro
      >
        {/* Botón de cerrar */}
        <button onClick={onClose} style={closeButtonStyle} aria-label="Cerrar">
          &times;
        </button>

        <div style={contentStyle}>
          <h2 style={titleStyle}>¡Bienvenido de nuevo!</h2>
          <p style={subtitleStyle}>Inicia sesión para acceder a todas las funciones.</p>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
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
                  style={{ width: '18px', height: '18px' }} 
                />
                <span style={{ marginLeft: '12px' }}>Continuar con Google</span>
              </>
            )}
          </button>
          
          <p style={footerTextStyle}>
            Al continuar, aceptas nuestros términos y condiciones.
          </p>
        </div>
      </div>
    </div>
  )
}

/* --- Estilos unificados y mejorados --- */

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.4)", // Fondo más suave
  backdropFilter: "blur(5px)", // Efecto de desenfoque moderno
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const modalStyle: React.CSSProperties = {
  position: "relative",
  background: "#ffffff",
  padding: "40px 32px",
  borderRadius: "20px",
  width: "100%",
  maxWidth: "380px",
  textAlign: "center",
  boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
  border: "1px solid rgba(0,0,0,0.05)",
  animation: "modalFadeIn 0.3s ease-out",
}

const contentStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}

const titleStyle: React.CSSProperties = {
  margin: "0 0 10px 0",
  color: "#111827",
  fontSize: "24px",
  fontWeight: "700",
  letterSpacing: "-0.5px",
}

const subtitleStyle: React.CSSProperties = {
  margin: "0 0 32px 0",
  color: "#6B7280",
  fontSize: "15px",
  lineHeight: "1.5",
}

const googleButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  cursor: "pointer",
  border: "1px solid #E5E7EB",
  backgroundColor: "#ffffff",
  fontWeight: "600",
  fontSize: "16px",
  color: "#374151",
  transition: "all 0.2s ease",
  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
}

const closeButtonStyle: React.CSSProperties = {
  position: "absolute",
  top: "16px",
  right: "16px",
  background: "#F3F4F6",
  border: "none",
  fontSize: "20px",
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "#9CA3AF",
  transition: "color 0.2s",
}

const footerTextStyle: React.CSSProperties = {
  marginTop: "24px",
  fontSize: "12px",
  color: "#9CA3AF",
}