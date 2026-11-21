import { z } from "zod"

// el autor sale del token y el plato de la url, x eso no estan
export const resenaSchema = z.object({
    descripcion: z.string("La reseña es obligatoria").trim()
        .min(10, "La reseña debe tener al menos 10 caracteres")
        .max(500, "La reseña no puede superar los 500 caracteres"),
    puntaje: z.number("El puntaje es obligatorio")
        .int("El puntaje tiene que ser un número entero")
        .min(1, "El puntaje mínimo es 1")
        .max(5, "El puntaje máximo es 5")
}, "JSON inválido")
