import { StrictMode, lazy, Suspense } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter } from "react-router"
import { RouterProvider } from "react-router/dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import "./index.css"

import { SessionProvider } from "./context/session.context"
import Layout from "./components/Layout"
import ProtectedRoute from "./components/ProtectedRoute"
import Loading from "./components/Loading"

const Home = lazy(() => import("./pages/Home"))
const Carta = lazy(() => import("./pages/Carta"))
const DetallePlato = lazy(() => import("./pages/DetallePlato"))
const MisResenas = lazy(() => import("./pages/MisResenas"))
const EditarResena = lazy(() => import("./pages/EditarResena"))
const Login = lazy(() => import("./pages/auth/Login"))
const Register = lazy(() => import("./pages/auth/Register"))
const Logout = lazy(() => import("./pages/auth/Logout"))
const PanelPlatos = lazy(() => import("./pages/admin/PanelPlatos"))
const NuevoPlato = lazy(() => import("./pages/admin/NuevoPlato"))
const EditarPlato = lazy(() => import("./pages/admin/EditarPlato"))
const EliminarPlato = lazy(() => import("./pages/admin/EliminarPlato"))
const Usuarios = lazy(() => import("./pages/admin/Usuarios"))
const Resenas = lazy(() => import("./pages/admin/Resenas"))
const NoEncontrada = lazy(() => import("./pages/NoEncontrada"))

// suspense para las paginas q cargan con lazy
function cargar(pagina) {
  return <Suspense fallback={<Loading />}>{pagina}</Suspense>
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: cargar(<Home />) },
      { path: "/carta", element: cargar(<Carta />) },
      { path: "/carta/:seccion", element: cargar(<Carta />) },
      { path: "/platos/:id", element: cargar(<DetallePlato />) },
      { path: "/login", element: cargar(<Login />) },
      { path: "/register", element: cargar(<Register />) },
      { path: "/logout", element: cargar(<Logout />) },

      { path: "/mis-resenas", element: cargar(<ProtectedRoute element={<MisResenas />} />) },
      { path: "/resenas/:id/editar", element: cargar(<ProtectedRoute element={<EditarResena />} />) },

      { path: "/admin/platos", element: cargar(<ProtectedRoute rol={["admin"]} element={<PanelPlatos />} />) },
      { path: "/admin/platos/nuevo", element: cargar(<ProtectedRoute rol={["admin"]} element={<NuevoPlato />} />) },
      { path: "/admin/platos/:id/editar", element: cargar(<ProtectedRoute rol={["admin"]} element={<EditarPlato />} />) },
      { path: "/admin/platos/:id/eliminar", element: cargar(<ProtectedRoute rol={["admin"]} element={<EliminarPlato />} />) },
      { path: "/admin/usuarios", element: cargar(<ProtectedRoute rol={["admin"]} element={<Usuarios />} />) },
      { path: "/admin/resenas", element: cargar(<ProtectedRoute rol={["admin"]} element={<Resenas />} />) },

      { path: "*", element: cargar(<NoEncontrada />) }
    ]
  }
])

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SessionProvider>
      <RouterProvider router={router} />
    </SessionProvider>
  </StrictMode>
)
