import { call } from "./api.service"

export function useApiAuth() {
    const login = (datos) => call("/usuarios/login", "POST", datos)
    const register = (usuario) => call("/usuarios", "POST", usuario)
    const perfil = () => call("/usuarios/perfil")

    return { login, register, perfil }
}
