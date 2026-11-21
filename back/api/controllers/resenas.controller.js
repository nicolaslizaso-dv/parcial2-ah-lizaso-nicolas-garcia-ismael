import * as resenaService from "../../services/resena.service.js"

export async function listar(req, res) {
    try {
        const resenas = await resenaService.listarResenas(req.query)
        res.status(200).json(resenas)
    } catch (error) {
        res.status(500).json({ message: "No se pudieron obtener las reseñas" })
    }
}

export async function detalle(req, res) {
    try {
        const resena = await resenaService.buscarResena(req.params.id)
        if (resena) res.status(200).json(resena)
        else res.status(404).json({ message: "No existe una reseña con ese id" })
    } catch (error) {
        res.status(500).json({ message: "No se pudo obtener la reseña" })
    }
}

// busco la reseña primero xq necesito saber quien la escribio
export async function editar(req, res) {
    try {
        const resena = await resenaService.buscarResena(req.params.id)
        if (!resena) return res.status(404).json({ message: "No existe una reseña con ese id" })
        if (!resenaService.puedeEditar(resena, req.usuario)) {
            return res.status(403).json({ message: "Solo podés editar tus propias reseñas" })
        }
        const editada = await resenaService.editarResena(req.params.id, req.body)
        res.status(202).json(editada)
    } catch (error) {
        res.status(500).json({ message: "No se pudo editar la reseña" })
    }
}

export async function borrar(req, res) {
    try {
        const resena = await resenaService.buscarResena(req.params.id)
        if (!resena) return res.status(404).json({ message: "No existe una reseña con ese id" })
        if (!resenaService.puedeBorrar(resena, req.usuario)) {
            return res.status(403).json({ message: "Solo podés borrar tus propias reseñas" })
        }
        await resenaService.borrarResena(req.params.id)
        res.status(202).json(resena)
    } catch (error) {
        res.status(500).json({ message: "No se pudo borrar la reseña" })
    }
}
