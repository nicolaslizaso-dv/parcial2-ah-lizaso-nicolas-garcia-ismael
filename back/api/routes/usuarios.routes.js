import { Router } from "express"
import * as usuariosController from "../controllers/usuarios.controller.js"
import { validateToken, validateRol } from "../../middlewares/auth.validate.js"
import { validate, validateId } from "../../middlewares/validate.js"
import { usuarioSchema, loginSchema, rolSchema } from "../../schemas/usuario.js"

const router = Router()

router.post("/api/usuarios", [validate(usuarioSchema)], usuariosController.registrar)
router.post("/api/usuarios/login", [validate(loginSchema)], usuariosController.login)

router.get("/api/usuarios/perfil", [validateToken], usuariosController.perfil)

router.get("/api/usuarios", [validateToken, validateRol(["admin"])], usuariosController.listar)
router.patch("/api/usuarios/:id", [validateToken, validateRol(["admin"]), validateId, validate(rolSchema)], usuariosController.cambiarRol)
router.delete("/api/usuarios/:id", [validateToken, validateRol(["admin"]), validateId], usuariosController.borrar)

export default router
