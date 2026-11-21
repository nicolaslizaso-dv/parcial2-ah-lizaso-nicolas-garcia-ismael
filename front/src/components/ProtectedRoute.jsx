import { Navigate } from "react-router"
import { useRol, useUsuario } from "../context/session.context"

// si no esta logueado va al login, si no tiene el rol vuelve al inicio
export default function ProtectedRoute({ element, rol }) {
    const usuario = useUsuario()
    const rolUsuario = useRol()

    if (!usuario?.token) return <Navigate to="/login" />
    if (rol && !rol.includes(rolUsuario)) return <Navigate to="/" />
    return element
}
