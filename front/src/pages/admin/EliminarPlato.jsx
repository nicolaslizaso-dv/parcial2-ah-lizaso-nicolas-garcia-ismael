import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { toast } from "react-toastify"
import { useApiPlatos } from "../../services/platos.service"
import { mensajeDeError } from "../../services/api.service"
import Loading from "../../components/Loading"
import Error from "../../components/Error"

export default function EliminarPlato() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [plato, setPlato] = useState(null)
    const [estado, setEstado] = useState("LOADING")

    const { getPlatoById, deletePlato } = useApiPlatos()

    useEffect(() => {
        getPlatoById(id)
            .then(data => {
                setPlato(data)
                setEstado("READY")
            })
            .catch(() => setEstado("ERROR"))
    }, [id])

    const onSubmit = (event) => {
        event.preventDefault()
        deletePlato(id)
            .then(() => {
                toast.success(`${plato.nombre} salió de la carta`)
                navigate("/admin/platos")
            })
            .catch(error => toast.error(mensajeDeError(error)))
    }

    if (estado == "LOADING") return <Loading />
    if (estado == "ERROR") return <Error message="Ese plato no existe" />

    return (
        <>
            <h1 className="titulo">Eliminar plato</h1>
            <div className="row g-4">
                <div className="col-md-4">
                    <img src={plato.imagen} alt={plato.nombre} className="img-fluid rounded" />
                </div>
                <div className="col-md-8">
                    <p>Vas a sacar <strong>{plato.nombre}</strong> de la carta. ¿Seguro?</p>
                    <form onSubmit={onSubmit}>
                        <button type="submit" className="btn btn-danger">Sí, eliminar</button>
                        <Link to="/admin/platos" className="btn btn-link">Cancelar</Link>
                    </form>
                </div>
            </div>
        </>
    )
}
