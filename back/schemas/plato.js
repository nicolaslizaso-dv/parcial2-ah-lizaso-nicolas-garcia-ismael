import { z } from "zod"
import { secciones } from "../data/secciones.js"

const slugs = secciones.map(seccion => seccion.slug)

export const platoSchema = z.object({
    nombre: z.string("El nombre es obligatorio").trim().min(3, "El nombre debe tener al menos 3 caracteres"),
    descripcion: z.string("La descripción es obligatoria").trim()
        .min(10, "La descripción debe tener al menos 10 caracteres")
        .max(300, "La descripción no puede superar los 300 caracteres"),
    precio: z.number("El precio es obligatorio y tiene que ser un número")
        .int("El precio tiene que ser un número entero")
        .positive("El precio tiene que ser mayor a 0"),
    etiquetas: z.array(z.string().trim().toLowerCase().min(1, "Hay una etiqueta vacía"), "Las etiquetas tienen que ser una lista")
        .min(1, "Poné al menos una etiqueta"),
    link: z.url("El link tiene que ser una dirección válida (ej: google.com)"),
    imagen: z.url("La imagen tiene que ser una URL válida"),
    seccion: z.enum(slugs, "Esa sección no existe en la carta")
}, "JSON inválido")

// para el PATCH, todos los campos opcionales
export const platoParcialSchema = platoSchema.partial()
