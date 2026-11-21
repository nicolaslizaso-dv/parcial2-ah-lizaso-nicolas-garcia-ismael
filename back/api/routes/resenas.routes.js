import { Router } from "express"
import * as resenasController from "../controllers/resenas.controller.js"
import { validateToken } from "../../middlewares/auth.validate.js"
import { validate, validateId } from "../../middlewares/validate.js"
import { resenaSchema } from "../../schemas/resena.js"

const router = Router()

router.get("/api/resenas", resenasController.listar)
router.get("/api/resenas/:id", [validateId], resenasController.detalle)

// q sea el autor o admin se chequea en el controller
router.put("/api/resenas/:id", [validateToken, validateId, validate(resenaSchema)], resenasController.editar)
router.delete("/api/resenas/:id", [validateToken, validateId], resenasController.borrar)

export default router
