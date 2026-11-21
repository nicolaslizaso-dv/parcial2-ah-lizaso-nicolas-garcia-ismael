import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useApiUsuarios } from "../../services/usuarios.service"
import { mensajeDeError } from "../../services/api.service"
import { useIdUsuario } from "../../context/session.context"
import UsuarioFila from "../../components/UsuarioFila"
import Loading from "../../components/Loading"
import Error from "../../components/Error"

export default function Usuarios() {
    const idUsuario = useIdUsuario()
    const [usuarios, setUsuarios] = useState([])
    const [estado, setEstado] = useState("LOADING")

    const { getUsuarios, cambiarRol, deleteUsuario } = useApiUsuarios()

    function traerUsuarios() {
        getUsuarios()
            .then(data => {
                setUsuarios(data)
                setEstado("READY")
            })
            .catch(() => setEstado("ERROR"))
    }

    useEffect(() => {
        traerUsuarios()
    }, [])

    const handleRol = (usuario, rol) => {
        cambiarRol(usuario._id, rol)
            .then(() => {
                toast.success(`${usuario.name} ahora es ${rol}`)
                traerUsuarios()
            })
            .catch(error => toast.error(mensajeDeError(error)))
    }

    const handleBorrar = (usuario) => {
        if (!confirm(`¿Borrar la cuenta de ${usuario.name}?`)) return
        deleteUsuario(usuario._id)
            .then(() => {
                toast.success("Usuario borrado")
                traerUsuarios()
            })
            .catch(error => toast.error(mensajeDeError(error)))
    }

    if (estado == "LOADING") return <Loading />
    if (estado == "ERROR") return <Error message="No se pudieron traer los usuarios" />

    return (
        <>
            <h1 className="titulo">Usuarios</h1>
            <div className="table-responsive">
                <table className="table align-middle">
                    <thead>
                        <tr><th>Nombre</th><th>Email</th><th>Rol</th><th></th></tr>
                    </thead>
                    <tbody>
                        {usuarios.map(usuario =>
                            <UsuarioFila
                                key={usuario._id}
                                usuario={usuario}
                                esYo={usuario._id == idUsuario}
                                onRol={handleRol}
                                onBorrar={handleBorrar}
                            />)}
                    </tbody>
                </table>
            </div>
        </>
    )
}
