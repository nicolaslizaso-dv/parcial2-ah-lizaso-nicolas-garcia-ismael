import multer from "multer"
import sharp from "sharp"
import { randomUUID } from "node:crypto"
import { existsSync } from "node:fs"
import { unlink, writeFile } from "fs/promises"

const CARPETA = "uploads/"
const MAXIMO = 5 * 1024 * 1024

// multer guarda el archivo en uploads con un nombre temporal
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, CARPETA)
    },
    filename: (req, file, cb) => {
        cb(null, "tmp-" + randomUUID())
    }
})

export const upload = multer({ storage })

async function borrarTemporal(req) {
    if (req.file?.path && existsSync(req.file.path)) await unlink(req.file.path)
}

function errorImagen(res, mensaje) {
    res.status(400).json({ message: "Hay datos incorrectos", errores: [`imagen: ${mensaje}`] })
}

// achica la foto con sharp, la pasa a webp y deja la url en el body
export async function procesarImagen(req, res, next) {
    if (!req.file) return next()

    try {
        if (!req.file.mimetype.startsWith("image/")) {
            await borrarTemporal(req)
            return errorImagen(res, "El archivo tiene que ser una imagen")
        }
        if (req.file.size > MAXIMO) {
            await borrarTemporal(req)
            return errorImagen(res, "La imagen no puede pesar más de 5 MB")
        }

        const nombre = randomUUID() + ".webp"
        const buffer = await sharp(req.file.path)
            .resize(800)
            .webp()
            .toBuffer()
        await writeFile(CARPETA + nombre, buffer)
        await borrarTemporal(req)

        req.body.imagen = `${req.protocol}://${req.get("host")}/uploads/${nombre}`
        next()
    } catch (error) {
        await borrarTemporal(req)
        errorImagen(res, "No se pudo procesar la imagen")
    }
}
