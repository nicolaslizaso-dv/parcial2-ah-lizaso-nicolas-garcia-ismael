import jwt from "jsonwebtoken"

// verifica el token del header, si no esta o vencio corta con 401
export function validateToken(req, res, next) {
    try {
        const auth = req.headers.authorization
        const [bearer, token] = auth.split(" ")
        if (bearer != "Bearer") throw new Error()
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.usuario = payload
        next()
    } catch (error) {
        res.status(401).json({ message: "El token no es válido o expiró" })
    }
}

// arma un middleware segun los roles, va siempre despues de validateToken
export function validateRol(roles) {
    return (req, res, next) => {
        if (roles.includes(req.usuario.rol)) next()
        else res.status(403).json({ message: "No tenés permiso para esta acción" })
    }
}
