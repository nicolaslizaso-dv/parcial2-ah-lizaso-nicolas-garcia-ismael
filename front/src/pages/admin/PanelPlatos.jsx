import { useEffect, useState } from "react"
import { Link } from "react-router"
import { useApiPlatos } from "../../services/platos.service"
import PlatoFila from "../../components/PlatoFila"
import Loading from "../../components/Loading"
import Error from "../../components/Error"

export default function PanelPlatos() {
    const [platos, setPlatos] = useState([])
    const [estado, setEstado] = useState("LOADING")

    const { getPlatos } = useApiPlatos()

    useEffect(() => {
        getPlatos()
            .then(data => {
                setPlatos(data)
                setEstado("READY")
            })
            .catch(() => setEstado("ERROR"))
    }, [])

    return (
        <>
            <h1 className="titulo">Panel de platos</h1>
            <Link className="btn btn-vino mb-3" to="/admin/platos/nuevo">Agregar plato</Link>

            {estado == "LOADING" && <Loading />}
            {estado == "ERROR" && <Error message="No se pudieron traer los platos" />}
            {estado == "READY" && (
                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead>
                            <tr><th>Foto</th><th>Plato</th><th>Sección</th><th>Precio</th><th></th></tr>
                        </thead>
                        <tbody>
                            {platos.map(plato => <PlatoFila key={plato._id} plato={plato} />)}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    )
}
