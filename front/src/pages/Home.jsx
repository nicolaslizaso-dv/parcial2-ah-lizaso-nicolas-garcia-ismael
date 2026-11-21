import { useEffect, useState } from "react"
import { Link } from "react-router"
import { useApiPlatos } from "../services/platos.service"
import { useApiResenas } from "../services/resenas.service"
import ResenaCard from "../components/ResenaCard"
import Loading from "../components/Loading"

export default function Home() {
    const [secciones, setSecciones] = useState([])
    const [resenas, setResenas] = useState([])
    const [estado, setEstado] = useState("LOADING")

    const { getSecciones } = useApiPlatos()
    const { getUltimas } = useApiResenas()

    useEffect(() => {
        // pido las secciones y las ultimas reseñas al mismo tiempo
        Promise.all([getSecciones(), getUltimas(3)])
            .then(([secciones, resenas]) => {
                setSecciones(secciones)
                setResenas(resenas)
                setEstado("READY")
            })
            .catch(() => setEstado("ERROR"))
    }, [])

    return (
        <>
            <section className="presentacion">
                <h1 className="titulo">Bienvenidos</h1>
                <p className="presentacion__texto">
                    Milanesas que no entran en el plato, pastas amasadas a mano y el flan de siempre.
                    Cocina porteña para ir con la familia, los amigos o solo, a la barra.
                </p>
                <Link className="btn btn-vino btn-lg" to="/carta">Ver la carta</Link>
            </section>

            {estado == "LOADING" && <Loading />}
            {estado == "ERROR" && <p className="text-danger">No se pudo conectar con la API. ¿Está levantado el back?</p>}

            {estado == "READY" && <>
                <section className="bloque">
                    <h2 className="bloque__titulo">La carta</h2>
                    <div className="indice">
                        {secciones.map(seccion =>
                            <Link key={seccion.slug} className="indice__link" to={`/carta/${seccion.slug}`}>{seccion.nombre}</Link>)}
                    </div>
                </section>

                <section className="bloque">
                    <h2 className="bloque__titulo">Lo que dicen los que vinieron</h2>
                    <div className="resenas">
                        {resenas.map(resena => <ResenaCard key={resena._id} resena={resena} mostrarPlato />)}
                    </div>
                    {resenas.length == 0 && <p>Todavía no hay reseñas.</p>}
                </section>
            </>}
        </>
    )
}
