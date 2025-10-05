import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../paginas/Login";
import Register from "../paginas/Register";
import Dashboard from "../paginas/SeccionesPage";
import ProtectedRoute from "../context/ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import InvitacionButton from "../componentes/InvitacionButton";

//Le puso el invitacionButton para probar nada más :vs
function AppRouter() {
  return (
    <BrowserRouter>
       <InvitacionButton />
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route 
          path="/seccionesPage" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/seccionesPage" replace />;
  }

  return children;
}

export default AppRouter;