import { createContext, useContext, useState } from "react"
import { jwtDecode } from "jwt-decode"

export const contexto = createContext()

// lee la sesion del localStorage, si el token vencio la borra
function leerSesionGuardada() {
    const usuario = JSON.parse(localStorage.getItem("usuario") ?? null)
    if (!usuario?.token) return null
    const payload = jwtDecode(usuario.token)
    if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem("usuario")
        return null
    }
    return usuario
}

export function SessionProvider({ children }) {
    const [usuario, setUsuario] = useState(leerSesionGuardada)

    // el rol y el id los saco del token, no de lo q esta guardado
    const payload = usuario?.token ? jwtDecode(usuario.token) : null
    const rol = payload?.rol ?? null
    const idUsuario = payload?._id ?? null

    const onLogin = (datos) => {
        delete datos.rol
        localStorage.setItem("usuario", JSON.stringify(datos))
        setUsuario(datos)
    }

    const onLogout = () => {
        localStorage.removeItem("usuario")
        setUsuario(null)
    }

    return (
        <contexto.Provider value={{ usuario, rol, idUsuario, onLogin, onLogout }}>
            {children}
        </contexto.Provider>
    )
}

export function useSession() {
    return useContext(contexto)
}

export function useUsuario() {
    return useSession().usuario
}

export function useRol() {
    return useSession().rol
}

export function useIdUsuario() {
    return useSession().idUsuario
}

export function useLogin() {
    return useSession().onLogin
}

export function useLogout() {
    return useSession().onLogout
}
