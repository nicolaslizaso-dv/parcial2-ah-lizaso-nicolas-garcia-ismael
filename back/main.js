import express from "express"
import cors from "cors"
import usuariosApiRoutes from "./api/routes/usuarios.routes.js"
import platosApiRoutes from "./api/routes/platos.routes.js"
import resenasApiRoutes from "./api/routes/resenas.routes.js"

const app = express()
const PORT = process.env.PORT || 3333

// cors xq el front corre en otro puerto
app.use(cors())
app.use(express.json())
// para q se puedan ver las fotos q se suben
app.use("/uploads", express.static("uploads"))

app.use(usuariosApiRoutes)
app.use(platosApiRoutes)
app.use(resenasApiRoutes)

app.use((req, res) => {
    res.status(404).json({ message: "Recurso no encontrado" })
})

app.listen(PORT, () => console.log(`API del Bodegón en http://localhost:${PORT}/api`))
