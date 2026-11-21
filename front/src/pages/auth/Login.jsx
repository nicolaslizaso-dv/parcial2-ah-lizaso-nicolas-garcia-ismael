import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "react-router"
import { toast } from "react-toastify"
import { loginSchema } from "../../schemas/usuario"
import { useApiAuth } from "../../services/auth.service"
import { mensajeDeError } from "../../services/api.service"
import { useLogin } from "../../context/session.context"
import CampoError from "../../components/CampoError"

export default function Login() {
    const navigate = useNavigate()
    const { login } = useApiAuth()
    const loginSession = useLogin()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({ resolver: zodResolver(loginSchema) })

    const onSubmit = async (datos) => {
        try {
            const usuario = await login(datos)
            loginSession(usuario)
            toast.success(`¡Hola, ${usuario.name}!`)
            navigate("/carta")
        } catch (error) {
            toast.error(mensajeDeError(error))
        }
    }

    return (
        <div className="d-flex justify-content-center mt-4">
            <div className="card shadow-sm p-4 tarjeta-form">
                <h1 className="h3 text-center mb-4">Ingresar</h1>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input className="form-control" type="email" id="email" {...register("email")} />
                        <CampoError error={errors.email} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="password">Contraseña</label>
                        <input className="form-control" type="password" id="password" {...register("password")} />
                        <CampoError error={errors.password} />
                    </div>
                    <button disabled={isSubmitting} type="submit" className="btn btn-vino w-100">Ingresar</button>
                </form>
                <p className="text-center mt-3 mb-0">¿No tenés cuenta? <Link to="/register">Creá una</Link></p>
            </div>
        </div>
    )
}
