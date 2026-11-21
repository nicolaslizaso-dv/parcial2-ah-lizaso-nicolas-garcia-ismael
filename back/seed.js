import { MongoClient } from "mongodb"
import { readFile } from "fs/promises"
import bcrypt from "bcrypt"

const cliente = new MongoClient(process.env.MONGO_URI || "mongodb://127.0.0.1:27017")
const db = cliente.db(process.env.DB_NAME || "bodegon")

const USUARIOS = [
    { name: "Don Ramón", email: "admin@bodegon.com", password: "Admin1234", rol: "admin" },
    { name: "Cliente de prueba", email: "cliente@bodegon.com", password: "Cliente1234", rol: "cliente" },
    { name: "Marta G.", email: "marta@bodegon.com", password: "Cliente1234", rol: "cliente" },
    { name: "Julián P.", email: "julian@bodegon.com", password: "Cliente1234", rol: "cliente" }
]

// vacia las colecciones y carga todo de nuevo, asi no se duplica nada
async function sembrar() {
    try {
        const platos = JSON.parse(await readFile("./data/Platos.json", "utf8"))
        const resenasBase = JSON.parse(await readFile("./data/Resenas.json", "utf8"))

        await db.collection("Usuarios").deleteMany({})
        await db.collection("Platos").deleteMany({})
        await db.collection("Resenas").deleteMany({})

        const usuarios = []
        for (const usuario of USUARIOS) {
            usuarios.push({
                ...usuario,
                password: await bcrypt.hash(usuario.password, 10),
                creado: new Date()
            })
        }
        await db.collection("Usuarios").insertMany(usuarios)

        await db.collection("Platos").insertMany(platos)

        const resenas = resenasBase.map((resena, indice) => {
            const plato = platos.find(p => p.nombre == resena.plato)
            const autor = usuarios.find(u => u.email == resena.autor)
            return {
                descripcion: resena.descripcion,
                puntaje: resena.puntaje,
                plato: { _id: plato._id, nombre: plato.nombre },
                usuario: { _id: autor._id, name: autor.name },
                fecha: new Date(Date.now() - indice * 86400000)
            }
        })
        await db.collection("Resenas").insertMany(resenas)

        console.log(`Base cargada: ${usuarios.length} usuarios, ${platos.length} platos y ${resenas.length} reseñas`)
    } catch (error) {
        console.log("No se pudo cargar la base:", error.message)
    } finally {
        await cliente.close()
    }
}

sembrar()
