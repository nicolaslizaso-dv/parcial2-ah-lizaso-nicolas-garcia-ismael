import { Link } from "react-router"

export default function PlatoFila({ plato }) {
    return (
        <tr>
            <td><img src={plato.imagen} alt="" className="miniatura" /></td>
            <td>{plato.nombre}</td>
            <td>{plato.seccion}</td>
            <td>${plato.precio}</td>
            <td className="text-nowrap">
                <Link className="btn btn-sm btn-outline-dark mx-1" to={`/platos/${plato._id}`}>Ver</Link>
                <Link className="btn btn-sm btn-outline-dark mx-1" to={`/admin/platos/${plato._id}/editar`}>Editar</Link>
                <Link className="btn btn-sm btn-outline-danger mx-1" to={`/admin/platos/${plato._id}/eliminar`}>Eliminar</Link>
            </td>
        </tr>
    )
}
