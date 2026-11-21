import { call } from "./api.service"

export function useApiResenas() {
    const getTodas = () => call("/resenas")
    const getUltimas = (cantidad) => call("/resenas?limit=" + cantidad)
    const getResenasDeUsuario = (idUsuario) => call("/resenas?usuario=" + idUsuario)
    const getResenasDePlato = (idPlato) => call("/platos/" + idPlato + "/resenas")
    const getResenaById = (id) => call("/resenas/" + id)
    const createResena = (idPlato, resena) => call("/platos/" + idPlato + "/resenas", "POST", resena)
    const updateResena = (id, resena) => call("/resenas/" + id, "PUT", resena)
    const deleteResena = (id) => call("/resenas/" + id, "DELETE")

    return { getTodas, getUltimas, getResenasDeUsuario, getResenasDePlato, getResenaById, createResena, updateResena, deleteResena }
}
