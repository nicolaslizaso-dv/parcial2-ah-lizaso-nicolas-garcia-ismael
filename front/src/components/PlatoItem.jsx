import { Link } from "react-router"
import Etiquetas from "./Etiquetas"

export default function PlatoItem({ plato }) {
    return (
        <article className="item-carta">
            <img src={plato.imagen} alt={plato.nombre} className="item-carta__img" />
            <div className="item-carta__texto">
                <div className="item-carta__cabecera">
                    <h2 className="item-carta__nombre">
                        <Link to={`/platos/${plato._id}`}>{plato.nombre}</Link>
                    </h2>
                    <span className="item-carta__puntos"></span>
                    <span className="item-carta__precio">${plato.precio}</span>
                </div>
                <p className="mb-2">{plato.descripcion}</p>
                <Etiquetas etiquetas={plato.etiquetas} />
            </div>
        </article>
    )
}
