import { Link } from "react-router"
import Estrellas from "./Estrellas"
import { useIdUsuario, useRol } from "../context/session.context"

export default function ResenaCard({ resena, mostrarPlato = false, onBorrar }) {
    const idUsuario = useIdUsuario()
    const rol = useRol()
    // mismas reglas q el back: editar solo el autor, borrar autor o admin
    const esAutor = resena.usuario._id == idUsuario
    const puedeBorrar = esAutor || rol == "admin"
    const fecha = new Date(resena.fecha).toLocaleDateString("es-AR")

    return (
        <article className="resena">
            <div className="d-flex justify-content-between align-items-start">
                <div>
                    <p className="resena__nombre">{resena.usuario.name}</p>
                    <Estrellas puntaje={resena.puntaje} />
                </div>
                <small className="text-secondary">{fecha}</small>
            </div>
            {mostrarPlato && (
                <p className="small mb-1 mt-2">
                    Sobre <Link to={`/platos/${resena.plato._id}`}>{resena.plato.nombre}</Link>
                </p>
            )}
            <p className="mt-2 mb-0">{resena.descripcion}</p>

            {puedeBorrar && onBorrar && (
                <div className="mt-3 d-flex gap-2">
                    {esAutor && <Link className="btn btn-sm btn-outline-dark" to={`/resenas/${resena._id}/editar`}>Editar</Link>}
                    <button className="btn btn-sm btn-outline-danger" onClick={() => onBorrar(resena)}>Borrar</button>
                </div>
            )}
        </article>
    )
}
