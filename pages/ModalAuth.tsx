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
      console.error("Error al iniciar sesión:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* stopPropagation evita que el modal se cierre al hacer clic dentro del cuadro blanco */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close-btn" aria-label="Cerrar">
          &times;
        </button>

        <h2 className="modal-title">Iniciar sesión</h2>
        <p className="modal-subtitle">Usa tu cuenta para continuar</p>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="google-auth-btn"
        >
          {loading ? (
            <span className="spinner"></span>
          ) : (
            <>
              <img 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                alt="Google" 
                style={{ width: '18px', marginRight: '10px' }} 
              />
              Continuar con Google
            </>
          )}
        </button>
      </div>
    </div>
  )
}