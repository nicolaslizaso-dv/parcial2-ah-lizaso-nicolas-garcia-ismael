import { call, callForm } from "./api.service"

// paso el plato a FormData xq lleva archivo
function armarFormData(plato, archivo) {
    const form = new FormData()
    Object.entries(plato).forEach(([campo, valor]) => form.append(campo, valor))
    form.set("etiquetas", plato.etiquetas.join(","))
    if (archivo) form.set("imagen", archivo)
    return form
}

export function useApiPlatos() {
    const getSecciones = () => call("/secciones")

    const getPlatos = (filtros = {}) => {
        let query = "?"
        if (filtros.seccion) query += "seccion=" + encodeURIComponent(filtros.seccion) + "&"
        if (filtros.nombre) query += "nombre=" + encodeURIComponent(filtros.nombre)
        return call("/platos" + query)
    }
    const getPlatoById = (id) => call("/platos/" + id)
    const createPlato = (plato, archivo) => callForm("/platos", "POST", armarFormData(plato, archivo))
    const updatePlato = (id, plato, archivo) => callForm("/platos/" + id, "PUT", armarFormData(plato, archivo))
    const deletePlato = (id) => call("/platos/" + id, "DELETE")

    return { getSecciones, getPlatos, getPlatoById, createPlato, updatePlato, deletePlato }
}
