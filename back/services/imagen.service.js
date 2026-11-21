import { existsSync } from "node:fs"
import { unlink } from "fs/promises"

// borra la foto del disco, solo las q subimos (las de wikimedia no)
export async function borrarImagenSubida(url) {
    try {
        if (!url?.includes("/uploads/")) return
        const archivo = "uploads/" + url.split("/uploads/")[1]
        if (existsSync(archivo)) await unlink(archivo)
    } catch (error) {
        console.log("No se pudo borrar la imagen", url)
    }
}
