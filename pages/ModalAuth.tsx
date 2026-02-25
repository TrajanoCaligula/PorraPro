import { supabase } from "../lib/supabase"
import { useState, useEffect } from "react"

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function ModalAuth({ isOpen, onClose }: Props) {
  const [loading, setLoading] = useState(false)

  // --- NUEVO: Escuchamos el cambio de estado de sesión ---
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Extraemos los datos de Google de user_metadata
        const profile = {
          name: session.user.user_metadata.full_name || session.user.email,
          avatar_url: session.user.user_metadata.avatar_url || ''
        };

        // Guardamos en localStorage para el Sidebar
        localStorage.setItem('user_profile', JSON.stringify(profile));
        
        // Disparamos evento para que App.tsx se entere si ya estaba cargada
        window.dispatchEvent(new Event('storage'));
        
        // Opcional: Cerrar el modal automáticamente al entrar
        onClose();
      }
      
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('user_profile');
        window.dispatchEvent(new Event('storage'));
      }
    });

    return () => subscription.unsubscribe();
  }, [onClose]);

  if (!isOpen) return null

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // Asegúrate de que esta URL esté permitida en tu Dashboard de Supabase
          redirectTo: window.location.origin, 
        },
      })
      if (error) throw error
    } catch (error) {
      console.error("Error:", error)
      setLoading(false) // Solo lo quitamos si hay error, si no, redirige
    }
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={closeButtonStyle}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 5L5 15M5 5l10 10" />
          </svg>
        </button>

        <div style={contentStyle}>
          <h2 style={titleStyle}>Bienvenido de nuevo</h2>
          <p style={subtitleStyle}>Inicia sesión para acceder a todas las funciones</p>

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
            Al continuar, aceptas nuestros términos y condiciones
          </p>
        </div>
      </div>
    </div>
  )
}

// ... (Tus estilos se mantienen iguales)

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