import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import { toast } from "react-toastify"
import { useApiPlatos } from "../services/platos.service"
import { useApiResenas } from "../services/resenas.service"
import { mensajeDeError } from "../services/api.service"
import { useUsuario } from "../context/session.context"
import Loading from "../components/Loading"
import Error from "../components/Error"
import Etiquetas from "../components/Etiquetas"
import Estrellas from "../components/Estrellas"
import ResenaCard from "../components/ResenaCard"
import ResenaForm from "../components/ResenaForm"

export default function DetallePlato() {
    const { id } = useParams()
    const usuario = useUsuario()

    const [plato, setPlato] = useState(null)
    const [resenas, setResenas] = useState([])
    const [estado, setEstado] = useState("LOADING")

    const { getPlatoById } = useApiPlatos()
    const { getResenasDePlato, createResena, deleteResena } = useApiResenas()

    useEffect(() => {
        Promise.all([getPlatoById(id), getResenasDePlato(id)])
            .then(([plato, resenas]) => {
                setPlato(plato)
                setResenas(resenas)
                setEstado("READY")
            })
            .catch(() => setEstado("ERROR"))
    }, [id])

    // agrego la reseña nueva arriba sin volver a pedir todo
    const handleNuevaResena = async (datos) => {
        try {
            const nueva = await createResena(id, datos)
            setResenas([nueva, ...resenas])
            toast.success("¡Gracias por tu reseña!")
            return true
        } catch (error) {
            toast.error(mensajeDeError(error))
            return false
        }
    }

    const handleBorrar = (resena) => {
        if (!confirm("¿Borrar esta reseña?")) return
        deleteResena(resena._id)
            .then(() => {
                setResenas(resenas.filter(r => r._id != resena._id))
                toast.success("Reseña borrada")
            })
            .catch(error => toast.error(mensajeDeError(error)))
    }

    if (estado == "LOADING") return <Loading />
    if (estado == "ERROR") return <Error message="Ese plato no existe" />

    const promedio = resenas.length > 0
        ? resenas.reduce((total, r) => total + r.puntaje, 0) / resenas.length
        : 0

    return (
        <>
            <h1 className="titulo">{plato.nombre}</h1>
            <div className="row g-4">
                <div className="col-md-6">
                    <img src={plato.imagen} alt={plato.nombre} className="img-fluid rounded" />
                </div>
                <div className="col-md-6">
                    <p className="precio-grande">${plato.precio}</p>
                    <p>{plato.descripcion}</p>
                    <Etiquetas etiquetas={plato.etiquetas} />
                    {resenas.length > 0 && (
                        <p className="mt-2"><Estrellas puntaje={promedio} /> {promedio.toFixed(1)} ({resenas.length} reseñas)</p>
                    )}
                    <p><a href={plato.link} target="_blank" rel="noreferrer">Ver la receta</a></p>
                    <Link className="btn btn-outline-dark" to={`/carta/${plato.seccion}`}>Volver a la carta</Link>
                </div>
            </div>

            <section className="bloque mt-4">
                <h2 className="bloque__titulo">Reseñas</h2>
                <div className="row g-4">
                    <div className="col-lg-7">
                        <div className="resenas resenas--columna">
                            {resenas.map(resena => <ResenaCard key={resena._id} resena={resena} onBorrar={handleBorrar} />)}
                        </div>
                        {resenas.length == 0 && <p>Nadie opinó todavía. ¡Sé el primero!</p>}
                    </div>
                    <div className="col-lg-5">
                        <div className="resena">
                            <h3 className="h5">¿Lo probaste?</h3>
                            {usuario
                                ? <ResenaForm onGuardar={handleNuevaResena} />
                                : <p className="mb-0"><Link to="/login">Ingresá</Link> para dejar tu reseña.</p>}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
