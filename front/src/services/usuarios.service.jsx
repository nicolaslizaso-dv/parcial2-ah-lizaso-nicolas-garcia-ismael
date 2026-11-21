import { call } from "./api.service"

export function useApiUsuarios() {
    const getUsuarios = () => call("/usuarios")
    const cambiarRol = (id, rol) => call("/usuarios/" + id, "PATCH", { rol })
    const deleteUsuario = (id) => call("/usuarios/" + id, "DELETE")

    return { getUsuarios, cambiarRol, deleteUsuario }
}
