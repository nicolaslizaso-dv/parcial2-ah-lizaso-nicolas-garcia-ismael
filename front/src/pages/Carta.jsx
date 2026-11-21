import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import { useApiPlatos } from "../services/platos.service"
import PlatoItem from "../components/PlatoItem"
import Loading from "../components/Loading"
import Error from "../components/Error"

export default function Carta() {
    const { seccion } = useParams()

    const [secciones, setSecciones] = useState([])
    const [platos, setPlatos] = useState([])
    const [busqueda, setBusqueda] = useState("")
    const [estado, setEstado] = useState("LOADING")

    const { getSecciones, getPlatos } = useApiPlatos()

    useEffect(() => {
        getSecciones().then(data => setSecciones(data)).catch(() => setSecciones([]))
    }, [])

    // se vuelve a ejecutar cuando cambia la seccion o lo q se busca
    useEffect(() => {
        getPlatos({ seccion, nombre: busqueda })
            .then(data => {
                setPlatos(data)
                setEstado("READY")
            })
            .catch(() => setEstado("ERROR"))
    }, [seccion, busqueda])

    const seccionActual = secciones.find(s => s.slug == seccion)

    let contenido
    switch (estado) {
        case "LOADING":
            contenido = <Loading />
            break
        case "READY":
            contenido = platos.length > 0
                ? platos.map(plato => <PlatoItem key={plato._id} plato={plato} />)
                : <p className="mt-3">No hay platos que coincidan.</p>
            break
        default:
            contenido = <Error message="No se pudieron traer los platos" />
    }

    return (
        <>
            <h1 className="titulo">{seccionActual ? seccionActual.nombre : "La carta"}</h1>

            <div className="d-flex flex-wrap gap-2 mb-3">
                <Link className={`btn btn-sm ${!seccion ? "btn-dark" : "btn-outline-dark"}`} to="/carta">Todo</Link>
                {secciones.map(s =>
                    <Link key={s.slug} className={`btn btn-sm ${s.slug == seccion ? "btn-dark" : "btn-outline-dark"}`} to={`/carta/${s.slug}`}>
                        {s.nombre}
                    </Link>)}
            </div>

            <input
                className="form-control mb-3"
                type="search"
                placeholder="Buscar un plato por nombre..."
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
            />

            {contenido}
        </>
    )
}
