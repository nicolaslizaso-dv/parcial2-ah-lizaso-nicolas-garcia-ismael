import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "react-router"
import { toast } from "react-toastify"
import { usuarioSchema } from "../../schemas/usuario"
import { useApiAuth } from "../../services/auth.service"
import { mensajeDeError } from "../../services/api.service"
import CampoError from "../../components/CampoError"

export default function Register() {
    const navigate = useNavigate()
    const { register: apiRegister } = useApiAuth()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({ resolver: zodResolver(usuarioSchema), criteriaMode: "all" })

    const onSubmit = async (usuario) => {
        try {
            await apiRegister(usuario)
            toast.success("Cuenta creada. Ya podés ingresar.")
            navigate("/login")
        } catch (error) {
            toast.error(mensajeDeError(error))
        }
    }

    // con criteriaMode all muestro todos los errores de la pass juntos
    const erroresPassword = errors.password?.types
        ? Object.values(errors.password.types).flat()
        : []

    return (
        <div className="d-flex justify-content-center mt-4">
            <div className="card shadow-sm p-4 tarjeta-form">
                <h1 className="h3 text-center mb-4">Crear cuenta</h1>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="name">Nombre</label>
                        <input className="form-control" type="text" id="name" {...register("name")} />
                        <CampoError error={errors.name} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input className="form-control" type="email" id="email" {...register("email")} />
                        <CampoError error={errors.email} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="password">Contraseña</label>
                        <input className="form-control" type="password" id="password" {...register("password")} />
                        {erroresPassword.map((mensaje, indice) =>
                            <div key={indice} className="text-danger small mt-1">{mensaje}</div>)}
                        <div className="form-text">Mínimo 8 caracteres, con mayúscula, minúscula y número.</div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="passwordConfirm">Repetir contraseña</label>
                        <input className="form-control" type="password" id="passwordConfirm" {...register("passwordConfirm")} />
                        <CampoError error={errors.passwordConfirm} />
                    </div>
                    <button disabled={isSubmitting} type="submit" className="btn btn-vino w-100">Crear cuenta</button>
                </form>
                <p className="text-center mt-3 mb-0">¿Ya tenés cuenta? <Link to="/login">Ingresá</Link></p>
            </div>
        </div>
    )
}
