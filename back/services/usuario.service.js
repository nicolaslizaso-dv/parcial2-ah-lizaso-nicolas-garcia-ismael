import { ObjectId } from "mongodb"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { db } from "./db.service.js"

const usuarios = db.collection("Usuarios")

// nunca devuelvo el hash de la contraseña
const SIN_PASSWORD = { projection: { password: 0 } }

export async function listarUsuarios() {
    return await usuarios.find({}, SIN_PASSWORD).toArray()
}

export async function buscarUsuario(id) {
    return await usuarios.findOne({ _id: new ObjectId(id) }, SIN_PASSWORD)
}

// hashea la pass con bcrypt y lo guarda siempre como cliente, si el mail ya existe devuelve null
export async function registrar(datos) {
    const existe = await usuarios.findOne({ email: datos.email })
    if (existe) return null

    const usuario = {
        name: datos.name,
        email: datos.email,
        password: await bcrypt.hash(datos.password, 10),
        rol: "cliente",
        creado: new Date()
    }
    await usuarios.insertOne(usuario)
    delete usuario.password
    return usuario
}

// compara la pass con bcrypt y si esta bien firma el token x 2hs
export async function login(datos) {
    const usuarioDB = await usuarios.findOne({ email: datos.email })
    if (!usuarioDB) return null

    const ok = await bcrypt.compare(datos.password, usuarioDB.password)
    if (!ok) return null

    const payload = {
        _id: usuarioDB._id.toString(),
        name: usuarioDB.name,
        email: usuarioDB.email,
        rol: usuarioDB.rol
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" })

    return { ...payload, token }
}

export async function cambiarRol(id, rol) {
    const resultado = await usuarios.updateOne({ _id: new ObjectId(id) }, { $set: { rol } })
    if (resultado.matchedCount == 0) return null
    return await buscarUsuario(id)
}

export async function borrarUsuario(id) {
    const usuario = await buscarUsuario(id)
    if (!usuario) return null
    await usuarios.deleteOne({ _id: new ObjectId(id) })
    return usuario
}
