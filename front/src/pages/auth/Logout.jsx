import { useEffect } from "react"
import { Navigate } from "react-router"
import { useLogout } from "../../context/session.context"

export default function Logout() {
    const logout = useLogout()

    // en un efecto xq cambia el estado del contexto
    useEffect(() => {
        logout()
    }, [])

    return <Navigate to="/login" />
}
