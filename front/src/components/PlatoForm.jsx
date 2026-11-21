import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router"
import { platoNuevoSchema, platoEditarSchema } from "../schemas/plato"
import CampoError from "./CampoError"

export default function PlatoForm({ secciones, plato, onGuardar, textoBoton = "Guardar" }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(plato ? platoEditarSchema : platoNuevoSchema),
        defaultValues: plato
            ? { ...plato, etiquetas: plato.etiquetas.join(", "), imagen: undefined }
            : { seccion: "" }
    })

    // separo la foto del resto, paso las etiquetas a array y si edita sin foto mando la q tenia
    const onSubmit = async (datos) => {
        const { imagen, ...campos } = datos
        const archivo = imagen?.[0]
        const etiquetas = campos.etiquetas.split(",")
            .map(etiqueta => etiqueta.trim())
            .filter(etiqueta => etiqueta != "")
        const nuevo = { ...campos, etiquetas }
        if (plato && !archivo) nuevo.imagen = plato.imagen
        await onGuardar(nuevo, archivo)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="col-lg-8" noValidate>
            <div className="mb-3">
                <label className="form-label" htmlFor="nombre">Nombre del plato</label>
                <input className="form-control" type="text" id="nombre" {...register("nombre")} />
                <CampoError error={errors.nombre} />
            </div>
            <div className="mb-3">
                <label className="form-label" htmlFor="descripcion">Descripción</label>
                <textarea className="form-control" id="descripcion" rows="3" {...register("descripcion")}></textarea>
                <CampoError error={errors.descripcion} />
            </div>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label" htmlFor="precio">Precio</label>
                    <input className="form-control" type="number" id="precio" {...register("precio", { valueAsNumber: true })} />
                    <CampoError error={errors.precio} />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label" htmlFor="seccion">Sección</label>
                    <select className="form-select" id="seccion" {...register("seccion")}>
                        <option value="" disabled>Elegí una sección</option>
                        {secciones.map(seccion => <option key={seccion.slug} value={seccion.slug}>{seccion.nombre}</option>)}
                    </select>
                    <CampoError error={errors.seccion} />
                </div>
            </div>
            <div className="mb-3">
                <label className="form-label" htmlFor="etiquetas">Etiquetas (separadas por coma, ej: veggie, sin tacc)</label>
                <input className="form-control" type="text" id="etiquetas" {...register("etiquetas")} />
                <CampoError error={errors.etiquetas} />
            </div>
            <div className="mb-3">
                <label className="form-label" htmlFor="link">Link a la receta</label>
                <input className="form-control" type="text" id="link" placeholder="google.com" {...register("link")} />
                <CampoError error={errors.link} />
            </div>
            <div className="mb-3">
                <label className="form-label" htmlFor="imagen">Foto del plato</label>
                {plato && (
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <img src={plato.imagen} alt="Foto actual" className="miniatura rounded" />
                        <small className="text-secondary">Foto actual. Elegí otra solo si la querés cambiar.</small>
                    </div>
                )}
                <input className="form-control" type="file" id="imagen" accept="image/*" {...register("imagen")} />
                <CampoError error={errors.imagen} />
            </div>
            <button disabled={isSubmitting} type="submit" className="btn btn-vino">{textoBoton}</button>
            <Link to="/admin/platos" className="btn btn-link">Cancelar</Link>
        </form>
    )
}
