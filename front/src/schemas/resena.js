import { z } from "zod"

export const resenaSchema = z.object({
    descripcion: z.string("La reseña es obligatoria").trim()
        .min(10, "La reseña debe tener al menos 10 caracteres")
        .max(500, "La reseña no puede superar los 500 caracteres"),
    puntaje: z.number("Elegí un puntaje")
        .int()
        .min(1, "El puntaje mínimo es 1")
        .max(5, "El puntaje máximo es 5")
})
