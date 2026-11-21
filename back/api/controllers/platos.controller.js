import * as platoService from "../../services/plato.service.js"
import * as resenaService from "../../services/resena.service.js"
import { secciones } from "../../data/secciones.js"
import { borrarImagenSubida } from "../../services/imagen.service.js"

export function listarSecciones(req, res) {
    res.status(200).json(secciones)
}

export async function listar(req, res) {
    try {
        const platos = await platoService.listarPlatos(req.query)
        res.status(200).json(platos)
    } catch (error) {
        res.status(500).json({ message: "No se pudieron obtener los platos" })
    }
}

export async function detalle(req, res) {
    try {
        const plato = await platoService.buscarPlato(req.params.id)
        if (plato) res.status(200).json(plato)
        else res.status(404).json({ message: "No existe un plato con ese id" })
    } catch (error) {
        res.status(500).json({ message: "No se pudo obtener el plato" })
    }
}

export async function crear(req, res) {
    try {
        const plato = await platoService.crearPlato(req.body)
        res.status(201).json(plato)
    } catch (error) {
        if (req.file) await borrarImagenSubida(req.body.imagen)
        res.status(500).json({ message: "No se pudo crear el plato" })
    }
}

export async function reemplazar(req, res) {
    try {
        const plato = await platoService.reemplazarPlato(req.params.id, req.body)
        if (plato) return res.status(202).json(plato)
        if (req.file) await borrarImagenSubida(req.body.imagen)
        res.status(404).json({ message: "No existe un plato con ese id" })
    } catch (error) {
        if (req.file) await borrarImagenSubida(req.body.imagen)
        res.status(500).json({ message: "No se pudo reemplazar el plato" })
    }
}

export async function modificar(req, res) {
    try {
        if (Object.keys(req.body).length == 0) {
            return res.status(400).json({ message: "No mandaste ningún campo para cambiar" })
        }
        const plato = await platoService.modificarPlato(req.params.id, req.body)
        if (plato) res.status(202).json(plato)
        else res.status(404).json({ message: "No existe un plato con ese id" })
    } catch (error) {
        res.status(500).json({ message: "No se pudo modificar el plato" })
    }
}

export async function borrar(req, res) {
    try {
        const plato = await platoService.borrarPlato(req.params.id)
        if (plato) res.status(202).json(plato)
        else res.status(404).json({ message: "No existe un plato con ese id" })
    } catch (error) {
        res.status(500).json({ message: "No se pudo borrar el plato" })
    }
}

export async function listarResenas(req, res) {
    try {
        const resenas = await resenaService.listarResenas({ plato: req.params.id })
        res.status(200).json(resenas)
    } catch (error) {
        res.status(500).json({ message: "No se pudieron obtener las reseñas" })
    }
}

export async function crearResena(req, res) {
    try {
        const resena = await resenaService.crearResena(req.params.id, req.usuario, req.body)
        if (resena) res.status(201).json(resena)
        else res.status(404).json({ message: "No existe un plato con ese id" })
    } catch (error) {
        res.status(500).json({ message: "No se pudo guardar la reseña" })
    }
}
