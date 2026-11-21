import { z } from "zod"

// el rol no va aca xq sino cualquiera se registra como admin
export const usuarioSchema = z.object({
    name: z.string("El nombre es obligatorio").trim().min(3, "El nombre debe tener al menos 3 caracteres"),
    email: z.email("El email es obligatorio y tiene que ser válido"),
    password: z.string("La contraseña es obligatoria")
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .regex(/[A-Z]/, "La contraseña debe tener una mayúscula")
        .regex(/[a-z]/, "La contraseña debe tener una minúscula")
        .regex(/[0-9]/, "La contraseña debe tener un número"),
    passwordConfirm: z.string("Tenés que repetir la contraseña")
}, "JSON inválido")
    .refine((data) => data.password == data.passwordConfirm, {
        error: "Las contraseñas no coinciden",
        path: ["passwordConfirm"]
    })

export const loginSchema = z.object({
    email: z.email("Ingresá un email válido"),
    password: z.string("La contraseña es obligatoria").min(1, "La contraseña es obligatoria")
}, "JSON inválido")

export const rolSchema = z.object({
    rol: z.enum(["cliente", "admin"], "El rol tiene que ser cliente o admin")
}, "JSON inválido")
