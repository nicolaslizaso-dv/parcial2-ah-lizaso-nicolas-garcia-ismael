import { Router } from "express"
import * as platosController from "../controllers/platos.controller.js"
import { validateToken, validateRol } from "../../middlewares/auth.validate.js"
import { validate, validateId } from "../../middlewares/validate.js"
import { platoSchema, platoParcialSchema } from "../../schemas/plato.js"
import { resenaSchema } from "../../schemas/resena.js"
import { upload, procesarImagen } from "../../middlewares/uploads.js"
import { prepararPlato } from "../../middlewares/plato.validate.js"

const router = Router()

const soloAdmin = [validateToken, validateRol(["admin"])]

// multer recibe la foto, sharp la procesa y despues se valida el resto
const conImagen = [upload.single("imagen"), procesarImagen, prepararPlato]

router.get("/api/secciones", platosController.listarSecciones)

router.get("/api/platos", platosController.listar)
router.get("/api/platos/:id", [validateId], platosController.detalle)

router.post("/api/platos", [...soloAdmin, ...conImagen, validate(platoSchema)], platosController.crear)
router.put("/api/platos/:id", [...soloAdmin, validateId, ...conImagen, validate(platoSchema)], platosController.reemplazar)
router.patch("/api/platos/:id", [...soloAdmin, validateId, prepararPlato, validate(platoParcialSchema)], platosController.modificar)
router.delete("/api/platos/:id", [...soloAdmin, validateId], platosController.borrar)

router.get("/api/platos/:id/resenas", [validateId], platosController.listarResenas)
router.post("/api/platos/:id/resenas", [validateToken, validateId, validate(resenaSchema)], platosController.crearResena)

export default router
