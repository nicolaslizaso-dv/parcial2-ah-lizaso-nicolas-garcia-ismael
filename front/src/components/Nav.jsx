import { Link } from "react-router"
import { useRol, useUsuario } from "../context/session.context"

export default function Nav() {
    const usuario = useUsuario()
    const rol = useRol()

    return (
        <header className="encabezado">
            <nav className="navbar navbar-expand-md navbar-dark container">
                <Link className="navbar-brand marca" to="/">Bodegón Don Ramón</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
                    aria-controls="menu" aria-expanded="false" aria-label="Abrir menú">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="menu">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item"><Link className="nav-link" to="/">Inicio</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/carta">La carta</Link></li>
                        {rol == "cliente" && <li className="nav-item"><Link className="nav-link" to="/mis-resenas">Mis reseñas</Link></li>}
                        {rol == "admin" && <li className="nav-item"><Link className="nav-link" to="/admin/resenas">Reseñas</Link></li>}
                        {rol == "admin" && <li className="nav-item"><Link className="nav-link" to="/admin/platos">Panel de platos</Link></li>}
                        {rol == "admin" && <li className="nav-item"><Link className="nav-link" to="/admin/usuarios">Usuarios</Link></li>}
                    </ul>
                    <ul className="navbar-nav">
                        {usuario
                            ? <>
                                <li className="nav-item"><span className="nav-link saludo me-2">Hola, {usuario.name}</span></li>
                                <li className="nav-item"><Link className="nav-link" to="/logout">Salir</Link></li>
                            </>
                            : <>
                                <li className="nav-item"><Link className="nav-link" to="/login">Ingresar</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/register">Crear cuenta</Link></li>
                            </>
                        }
                    </ul>
                </div>
            </nav>
            <div className="mantel"></div>
        </header>
    )
}
