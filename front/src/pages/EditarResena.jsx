import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { toast } from "react-toastify"
import { useApiResenas } from "../services/resenas.service"
import { mensajeDeError } from "../services/api.service"
import ResenaForm from "../components/ResenaForm"
import Loading from "../components/Loading"
import Error from "../components/Error"

export default function EditarResena() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [resena, setResena] = useState(null)
    const [estado, setEstado] = useState("LOADING")

    const { getResenaById, updateResena } = useApiResenas()

    useEffect(() => {
        getResenaById(id)
            .then(data => {
                setResena(data)
                setEstado("READY")
            })
            .catch(() => setEstado("ERROR"))
    }, [id])

    const handleGuardar = async (datos) => {
        try {
            await updateResena(id, datos)
            toast.success("Reseña actualizada")
            navigate("/platos/" + resena.plato._id)
            return true
        } catch (error) {
            toast.error(mensajeDeError(error))
            return false
        }
    }

    if (estado == "LOADING") return <Loading />
    if (estado == "ERROR") return <Error message="Esa reseña no existe" />

    return (
        <>
            <h1 className="titulo">Editar reseña</h1>
            <p>Sobre <Link to={`/platos/${resena.plato._id}`}>{resena.plato.nombre}</Link></p>
            <div className="col-lg-6">
                <ResenaForm resena={resena} onGuardar={handleGuardar} textoBoton="Guardar cambios" />
            </div>
        </>
    )
}
