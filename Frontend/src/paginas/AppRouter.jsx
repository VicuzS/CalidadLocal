import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Importa tus páginas
import LoginPage from "../paginas/Login";
import RegisterPage from "../paginas/Register";
import SeccionesPage from "../paginas/SeccionesPage";
import TareasIndividualesPage from "../paginas/TareasIndividualesPage";
import CrearTareaPage from "../paginas/CrearTareaPage";
import InvitacionesPendientesButton from "../componentes/InvitacionesPendientesButton";

// --- Componentes de Control de Rutas ---

// Rutas protegidas (solo usuarios autenticados)
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Rutas públicas (login, register)
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/secciones" replace />;
  }

  return children;
}

// --- Enrutador Principal ---

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Rutas Protegidas */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/secciones" replace />
            </ProtectedRoute>
          }
        />

        <Route
          path="/secciones"
          element={
            <ProtectedRoute>
              <InvitacionesPendientesButton />
              <SeccionesPage />
            </ProtectedRoute>
          }
        />

        {/* ✅ Ruta dinámica con idSeccion */}
        <Route
          path="/secciones/:idSeccion/tareas"
          element={
            <ProtectedRoute>
              <TareasIndividualesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/secciones/:idSeccion/crear-tarea"
          element={
            <ProtectedRoute>
              <CrearTareaPage />
            </ProtectedRoute>
          }
        />

        {/* Ruta para cualquier otra URL no definida */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
