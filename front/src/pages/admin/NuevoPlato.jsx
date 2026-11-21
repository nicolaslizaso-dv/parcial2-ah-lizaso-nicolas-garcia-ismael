import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "react-toastify"
import { useApiPlatos } from "../../services/platos.service"
import { mensajeDeError } from "../../services/api.service"
import PlatoForm from "../../components/PlatoForm"

export default function NuevoPlato() {
    const navigate = useNavigate()
    const [secciones, setSecciones] = useState([])
    const { getSecciones, createPlato } = useApiPlatos()

    useEffect(() => {
        getSecciones().then(data => setSecciones(data)).catch(() => setSecciones([]))
    }, [])

    const handleGuardar = async (plato, archivo) => {
        try {
            const creado = await createPlato(plato, archivo)
            toast.success("Plato agregado a la carta")
            navigate("/platos/" + creado._id)
        } catch (error) {
            toast.error(mensajeDeError(error))
        }
    }

    return (
        <>
            <h1 className="titulo">Agregar plato</h1>
            <PlatoForm secciones={secciones} onGuardar={handleGuardar} textoBoton="Agregar" />
        </>
    )
}
