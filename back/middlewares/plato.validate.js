// del form llega todo como texto, lo paso al tipo q va y le agrego https al link si no lo tiene
export function prepararPlato(req, res, next) {
    if (typeof req.body.precio == "string") {
        req.body.precio = Number(req.body.precio)
    }
    if (typeof req.body.etiquetas == "string") {
        req.body.etiquetas = req.body.etiquetas.split(",")
            .map(etiqueta => etiqueta.trim())
            .filter(etiqueta => etiqueta != "")
    }

    if (typeof req.body.link == "string") {
        const link = req.body.link.trim()
        req.body.link = link != "" && !/^https?:\/\//i.test(link) ? "https://" + link : link
    }
    next()
}
