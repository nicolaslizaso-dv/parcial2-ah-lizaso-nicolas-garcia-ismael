import { useEffect, useState } from "react"
import { Link } from "react-router"
import { toast } from "react-toastify"
import { useApiResenas } from "../services/resenas.service"
import { mensajeDeError } from "../services/api.service"
import { useIdUsuario } from "../context/session.context"
import ResenaCard from "../components/ResenaCard"
import Loading from "../components/Loading"
import Error from "../components/Error"

export default function MisResenas() {
    const idUsuario = useIdUsuario()
    const [resenas, setResenas] = useState([])
    const [estado, setEstado] = useState("LOADING")

    const { getResenasDeUsuario, deleteResena } = useApiResenas()

    useEffect(() => {
        getResenasDeUsuario(idUsuario)
            .then(data => {
                setResenas(data)
                setEstado("READY")
            })
            .catch(() => setEstado("ERROR"))
    }, [idUsuario])

    const handleBorrar = (resena) => {
        if (!confirm(`¿Borrar tu reseña de ${resena.plato.nombre}?`)) return
        deleteResena(resena._id)
            .then(() => {
                setResenas(resenas.filter(r => r._id != resena._id))
                toast.success("Reseña borrada")
            })
            .catch(error => toast.error(mensajeDeError(error)))
    }

    if (estado == "LOADING") return <Loading />
    if (estado == "ERROR") return <Error message="No se pudieron traer tus reseñas" />

    return (
        <>
            <h1 className="titulo">Mis reseñas</h1>
            {resenas.length == 0 && <p>Todavía no escribiste ninguna. <Link to="/carta">Mirá la carta</Link> y contanos qué probaste.</p>}
            <div className="resenas">
                {resenas.map(resena => <ResenaCard key={resena._id} resena={resena} mostrarPlato onBorrar={handleBorrar} />)}
            </div>
        </>
    )
}
