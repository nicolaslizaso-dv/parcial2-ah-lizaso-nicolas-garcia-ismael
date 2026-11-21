import * as usuarioService from "../../services/usuario.service.js"

export async function registrar(req, res) {
    try {
        const usuario = await usuarioService.registrar(req.body)
        if (usuario) res.status(201).json(usuario)
        else res.status(400).json({ message: "Ya existe una cuenta con ese email" })
    } catch (error) {
        res.status(500).json({ message: "No se pudo crear la cuenta" })
    }
}

export async function login(req, res) {
    try {
        const usuario = await usuarioService.login(req.body)
        if (usuario) res.status(200).json(usuario)
        else res.status(400).json({ message: "Email o contraseña incorrectos" })
    } catch (error) {
        res.status(500).json({ message: "No se pudo iniciar sesión" })
    }
}

export async function perfil(req, res) {
    try {
        const usuario = await usuarioService.buscarUsuario(req.usuario._id)
        if (usuario) res.status(200).json(usuario)
        else res.status(404).json({ message: "El usuario ya no existe" })
    } catch (error) {
        res.status(500).json({ message: "No se pudo obtener el perfil" })
    }
}

export async function listar(req, res) {
    try {
        const usuarios = await usuarioService.listarUsuarios()
        res.status(200).json(usuarios)
    } catch (error) {
        res.status(500).json({ message: "No se pudieron obtener los usuarios" })
    }
}

// el admin no se puede cambiar el rol a si mismo
export async function cambiarRol(req, res) {
    try {
        if (req.params.id == req.usuario._id) {
            return res.status(400).json({ message: "No podés cambiarte el rol a vos mismo" })
        }
        const usuario = await usuarioService.cambiarRol(req.params.id, req.body.rol)
        if (usuario) res.status(202).json(usuario)
        else res.status(404).json({ message: "No existe un usuario con ese id" })
    } catch (error) {
        res.status(500).json({ message: "No se pudo cambiar el rol" })
    }
}

export async function borrar(req, res) {
    try {
        if (req.params.id == req.usuario._id) {
            return res.status(400).json({ message: "No podés borrar tu propia cuenta desde acá" })
        }
        const usuario = await usuarioService.borrarUsuario(req.params.id)
        if (usuario) res.status(202).json(usuario)
        else res.status(404).json({ message: "No existe un usuario con ese id" })
    } catch (error) {
        res.status(500).json({ message: "No se pudo borrar el usuario" })
    }
}
