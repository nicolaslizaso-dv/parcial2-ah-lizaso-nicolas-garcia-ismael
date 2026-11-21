import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useApiResenas } from "../../services/resenas.service"
import { mensajeDeError } from "../../services/api.service"
import ResenaCard from "../../components/ResenaCard"
import Loading from "../../components/Loading"
import Error from "../../components/Error"

export default function Resenas() {
    const [resenas, setResenas] = useState([])
    const [busqueda, setBusqueda] = useState("")
    const [estado, setEstado] = useState("LOADING")

    const { getTodas, deleteResena } = useApiResenas()

    useEffect(() => {
        getTodas()
            .then(data => {
                setResenas(data)
                setEstado("READY")
            })
            .catch(() => setEstado("ERROR"))
    }, [])

    const handleBorrar = (resena) => {
        if (!confirm(`¿Borrar la reseña de ${resena.usuario.name} sobre ${resena.plato.nombre}?`)) return
        deleteResena(resena._id)
            .then(() => {
                setResenas(resenas.filter(r => r._id != resena._id))
                toast.success("Reseña borrada")
            })
            .catch(error => toast.error(mensajeDeError(error)))
    }

    if (estado == "LOADING") return <Loading />
    if (estado == "ERROR") return <Error message="No se pudieron traer las reseñas" />

    // filtro x autor o plato en el front
    const texto = busqueda.toLowerCase()
    const filtradas = resenas.filter(r =>
        r.usuario.name.toLowerCase().includes(texto) || r.plato.nombre.toLowerCase().includes(texto))

    return (
        <>
            <h1 className="titulo">Reseñas</h1>
            <p className="text-secondary">{resenas.length} reseñas en total. Como admin podés borrar cualquiera.</p>
            <input
                className="form-control mb-3"
                type="search"
                placeholder="Filtrar por autor o por plato..."
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
            />
            {filtradas.length == 0 && <p>No hay reseñas que coincidan.</p>}
            <div className="resenas">
                {filtradas.map(resena => <ResenaCard key={resena._id} resena={resena} mostrarPlato onBorrar={handleBorrar} />)}
            </div>
        </>
    )
}
