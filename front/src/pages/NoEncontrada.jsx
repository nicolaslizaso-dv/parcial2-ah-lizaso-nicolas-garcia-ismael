import { Link } from "react-router"

export default function NoEncontrada() {
    return (
        <>
            <h1 className="titulo">Esta página no está en la carta</h1>
            <Link className="btn btn-vino" to="/">Volver al inicio</Link>
        </>
    )
}
