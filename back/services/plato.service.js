import { ObjectId } from "mongodb"
import { db } from "./db.service.js"
import { borrarImagenSubida } from "./imagen.service.js"

const platos = db.collection("Platos")
const resenas = db.collection("Resenas")

// borrado logico, los q tienen eliminado: true no se muestran
const SOLO_ACTIVOS = { eliminado: { $ne: true } }

// filtros x seccion, etiqueta y nombre (con regex sin importar mayusculas)
export async function listarPlatos(filtros = {}) {
    const consulta = { ...SOLO_ACTIVOS }

    if (filtros.seccion) consulta.seccion = filtros.seccion
    if (filtros.etiqueta) consulta.etiquetas = filtros.etiqueta.toLowerCase()
    if (filtros.nombre) consulta.nombre = { $regex: filtros.nombre, $options: "i" }

    return await platos.find(consulta).sort({ nombre: 1 }).toArray()
}

export async function buscarPlato(id) {
    return await platos.findOne({ _id: new ObjectId(id), ...SOLO_ACTIVOS })
}

export async function crearPlato(plato) {
    await platos.insertOne(plato)
    return plato
}

// las reseñas tienen una copia del nombre del plato, si cambia hay q actualizarlas tmb
async function actualizarNombreEnResenas(id, nombre) {
    if (!nombre) return
    await resenas.updateMany({ "plato._id": new ObjectId(id) }, { $set: { "plato.nombre": nombre } })
}

// PUT reemplaza todo, si cambio la foto borro la vieja
export async function reemplazarPlato(id, plato) {
    const existente = await buscarPlato(id)
    if (!existente) return null
    await platos.replaceOne({ _id: new ObjectId(id) }, plato)
    await actualizarNombreEnResenas(id, plato.nombre)
    if (existente.imagen != plato.imagen) await borrarImagenSubida(existente.imagen)
    return await buscarPlato(id)
}

export async function modificarPlato(id, cambios) {
    const existente = await buscarPlato(id)
    if (!existente) return null
    await platos.updateOne({ _id: new ObjectId(id) }, { $set: cambios })
    await actualizarNombreEnResenas(id, cambios.nombre)
    if (cambios.imagen && existente.imagen != cambios.imagen) await borrarImagenSubida(existente.imagen)
    return await buscarPlato(id)
}

// no lo borro de verdad, le pongo eliminado en true
export async function borrarPlato(id) {
    const plato = await buscarPlato(id)
    if (!plato) return null
    await platos.updateOne({ _id: new ObjectId(id) }, { $set: { eliminado: true } })
    return plato
}
