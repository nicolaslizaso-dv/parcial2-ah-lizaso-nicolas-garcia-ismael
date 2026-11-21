import { useState } from "react"

export default function UsuarioFila({ usuario, esYo, onRol, onBorrar }) {
    // cada fila tiene su propio estado asi no se pisan los selects
    const [rol, setRol] = useState(usuario.rol)

    return (
        <tr>
            <td>{usuario.name} {esYo && <span className="badge text-bg-secondary">vos</span>}</td>
            <td>{usuario.email}</td>
            <td>
                <div className="d-flex gap-2">
                    <select className="form-select form-select-sm w-auto" value={rol} disabled={esYo}
                        onChange={(event) => setRol(event.target.value)}>
                        <option value="cliente">cliente</option>
                        <option value="admin">admin</option>
                    </select>
                    <button className="btn btn-sm btn-outline-dark" disabled={esYo || rol == usuario.rol}
                        onClick={() => onRol(usuario, rol)}>
                        Guardar
                    </button>
                </div>
            </td>
            <td>
                <button className="btn btn-sm btn-outline-danger" disabled={esYo} onClick={() => onBorrar(usuario)}>Borrar</button>
            </td>
        </tr>
    )
}
