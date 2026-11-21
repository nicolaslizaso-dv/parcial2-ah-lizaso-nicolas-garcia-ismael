import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { resenaSchema } from "../schemas/resena"
import CampoError from "./CampoError"

export default function ResenaForm({ resena, onGuardar, textoBoton = "Publicar reseña" }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(resenaSchema),
        defaultValues: resena ?? { descripcion: "", puntaje: 5 }
    })

    const onSubmit = async (datos) => {
        const ok = await onGuardar(datos)
        if (ok && !resena) reset()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mb-3">
                <label className="form-label" htmlFor="puntaje">Puntaje</label>
                <select className="form-select w-auto" id="puntaje" {...register("puntaje", { valueAsNumber: true })}>
                    <option value="5">★★★★★ (5)</option>
                    <option value="4">★★★★☆ (4)</option>
                    <option value="3">★★★☆☆ (3)</option>
                    <option value="2">★★☆☆☆ (2)</option>
                    <option value="1">★☆☆☆☆ (1)</option>
                </select>
                <CampoError error={errors.puntaje} />
            </div>
            <div className="mb-3">
                <label className="form-label" htmlFor="descripcion">Tu reseña</label>
                <textarea className="form-control" id="descripcion" rows="3" {...register("descripcion")}></textarea>
                <CampoError error={errors.descripcion} />
            </div>
            <button disabled={isSubmitting} type="submit" className="btn btn-vino">{textoBoton}</button>
        </form>
    )
}
