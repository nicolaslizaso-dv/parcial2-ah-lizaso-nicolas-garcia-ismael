import { z } from "zod"

const MAXIMO = 5 * 1024 * 1024

const camposPlato = {
    nombre: z.string("El nombre es obligatorio").trim().min(3, "El nombre debe tener al menos 3 caracteres"),
    descripcion: z.string("La descripción es obligatoria").trim()
        .min(10, "La descripción debe tener al menos 10 caracteres")
        .max(300, "La descripción no puede superar los 300 caracteres"),
    precio: z.number("El precio es obligatorio y tiene que ser un número")
        .int("El precio tiene que ser un número entero")
        .positive("El precio tiene que ser mayor a 0"),
    etiquetas: z.string("Poné al menos una etiqueta").trim().min(1, "Poné al menos una etiqueta"),
    // acepta con o sin https, el back se lo agrega
    link: z.string("El link es obligatorio").trim()
        .min(1, "El link es obligatorio")
        .regex(/^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i, "El link tiene que ser una dirección válida (ej: google.com)"),
    seccion: z.string("Elegí una sección").min(1, "Elegí una sección")
}

// controla q sea imagen y q no pese mas de 5mb
const archivoValido = z.any()
    .refine(archivos => !archivos?.[0] || archivos[0].type.startsWith("image/"), "El archivo tiene que ser una imagen")
    .refine(archivos => !archivos?.[0] || archivos[0].size <= MAXIMO, "La imagen no puede pesar más de 5 MB")

export const platoNuevoSchema = z.object({
    ...camposPlato,
    imagen: archivoValido.refine(archivos => archivos?.length > 0, "Elegí una foto del plato")
})

export const platoEditarSchema = z.object({
    ...camposPlato,
    imagen: archivoValido
})
