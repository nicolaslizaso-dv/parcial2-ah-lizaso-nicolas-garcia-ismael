import { ObjectId } from "mongodb"
import { db } from "./db.service.js"
import { buscarPlato } from "./plato.service.js"

const resenas = db.collection("Resenas")

// se puede filtrar x plato, x usuario y limitar la cantidad
export async function listarResenas(filtros = {}) {
    const consulta = {}
    if (filtros.plato && ObjectId.isValid(filtros.plato)) consulta["plato._id"] = new ObjectId(filtros.plato)
    if (filtros.usuario && ObjectId.isValid(filtros.usuario)) consulta["usuario._id"] = new ObjectId(filtros.usuario)

    const limit = parseInt(filtros.limit || 0)

    return await resenas.find(consulta)
        .sort({ fecha: -1 })
        .limit(limit)
        .toArray()
}

export async function buscarResena(id) {
    return await resenas.findOne({ _id: new ObjectId(id) })
}

// guardo una copia del plato y del usuario asi no tengo q cruzar colecciones
export async function crearResena(platoId, usuario, datos) {
    const plato = await buscarPlato(platoId)
    if (!plato) return null

    const resena = {
        descripcion: datos.descripcion,
        puntaje: datos.puntaje,
        plato: { _id: plato._id, nombre: plato.nombre },
        usuario: { _id: new ObjectId(usuario._id), name: usuario.name },
        fecha: new Date()
    }
    await resenas.insertOne(resena)
    return resena
}

export async function editarResena(id, datos) {
    await resenas.updateOne(
        { _id: new ObjectId(id) },
        { $set: { descripcion: datos.descripcion, puntaje: datos.puntaje } }
    )
    return await buscarResena(id)
}

export async function borrarResena(id) {
    const resena = await buscarResena(id)
    if (!resena) return null
    await resenas.deleteOne({ _id: new ObjectId(id) })
    return resena
}

export function esAutor(resena, usuario) {
    return resena.usuario._id.toString() == usuario._id
}

// editar solo el autor, borrar el autor o el admin
export function puedeEditar(resena, usuario) {
    return esAutor(resena, usuario)
}

export function puedeBorrar(resena, usuario) {
    return esAutor(resena, usuario) || usuario.rol == "admin"
}
