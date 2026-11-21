import { ObjectId } from "mongodb"
import { borrarImagenSubida } from "../services/imagen.service.js"

// valida el body con el schema de zod q le paso, si falla devuelve 400 con los errores
export function validate(schema) {
    return async (req, res, next) => {
        try {
            req.body = await schema.parseAsync(req.body ?? {})
            next()
        } catch (error) {
            if (req.file) await borrarImagenSubida(req.body?.imagen)
            const errores = error.issues.map(issue =>
                `${issue.path.length > 0 ? issue.path.join(".") : "JSON"}: ${issue.message}`)
            res.status(400).json({ message: "Hay datos incorrectos", errores })
        }
    }
}

// chequea q el id sea valido xq sino new ObjectId tira error
export function validateId(req, res, next) {
    if (ObjectId.isValid(req.params.id)) next()
    else res.status(400).json({ message: "El id no es válido" })
}
