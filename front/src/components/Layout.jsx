import { Outlet } from "react-router"
import { Bounce, ToastContainer } from "react-toastify"
import Nav from "./Nav"

export default function Layout() {
    return (
        <>
            <Nav />
            <ToastContainer
                position="top-right"
                autoClose={4000}
                pauseOnHover
                theme="colored"
                transition={Bounce}
            />
            <main className="container py-4">
                <Outlet />
            </main>
            <footer className="pie">
                <div className="container">Bodegón Don Ramón · Parcial 2 Aplicaciones Híbridas</div>
            </footer>
        </>
    )
}
