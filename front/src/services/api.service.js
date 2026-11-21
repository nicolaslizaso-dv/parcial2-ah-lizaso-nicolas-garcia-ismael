function token() {
    return JSON.parse(localStorage.getItem("usuario"))?.token
}

// si no es 2xx tiro un error con el mensaje q mando el back
async function procesarRespuesta(res) {
    const data = await res.json()
    if (res.ok) return data

    const error = new Error(data?.message ?? "Error en el servidor")
    error.status = res.status
    error.errores = data?.errores ?? []
    throw error
}

// todas las llamadas a la api pasan x aca, le agrega el token
export async function call(uri, method = "GET", body = undefined) {
    const res = await fetch(import.meta.env.VITE_API_URL + uri, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + token()
        },
        body: body ? JSON.stringify(body) : undefined
    })
    return procesarRespuesta(res)
}

// igual q call pero con FormData para la foto, sin content-type xq lo arma el navegador
export async function callForm(uri, method, formData) {
    const res = await fetch(import.meta.env.VITE_API_URL + uri, {
        method: method,
        headers: {
            authorization: "Bearer " + token()
        },
        body: formData
    })
    return procesarRespuesta(res)
}

export function mensajeDeError(error) {
    if (error.errores?.length > 0) return error.errores.join(" | ")
    return error.message
}
