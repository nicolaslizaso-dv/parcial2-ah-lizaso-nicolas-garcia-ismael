import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { toast } from "react-toastify"
import { useApiPlatos } from "../../services/platos.service"
import { mensajeDeError } from "../../services/api.service"
import PlatoForm from "../../components/PlatoForm"
import Loading from "../../components/Loading"
import Error from "../../components/Error"

export default function EditarPlato() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [plato, setPlato] = useState(null)
    const [secciones, setSecciones] = useState([])
    const [estado, setEstado] = useState("LOADING")

    const { getPlatoById, getSecciones, updatePlato } = useApiPlatos()

    useEffect(() => {
        Promise.all([getPlatoById(id), getSecciones()])
            .then(([plato, secciones]) => {
                setPlato(plato)
                setSecciones(secciones)
                setEstado("READY")
            })
            .catch(() => setEstado("ERROR"))
    }, [id])

    const handleGuardar = async (datos, archivo) => {
        try {
            await updatePlato(id, datos, archivo)
            toast.success("Plato actualizado")
            navigate("/admin/platos")
        } catch (error) {
            toast.error(mensajeDeError(error))
        }
    }

    if (estado == "LOADING") return <Loading />
    if (estado == "ERROR") return <Error message="Ese plato no existe" />

    return (
        <>
            <h1 className="titulo">Editar plato</h1>
            <PlatoForm secciones={secciones} plato={plato} onGuardar={handleGuardar} textoBoton="Guardar cambios" />
        </>
    )
}
