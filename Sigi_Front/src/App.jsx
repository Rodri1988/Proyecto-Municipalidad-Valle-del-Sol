import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import {
  ROLES,
  ROLES_EQUIPO,
  ROLES_PUEDEN_REPORTAR,
} from './constants/usuariosPrueba';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Reportes from './pages/Reportes';
import MisReportes from './pages/MisReportes';
import NuevoReporte from './pages/NuevoReporte';
import Dashboard from './pages/Dashboard';
import DashboardEquipo from './pages/DashboardEquipo';
import Emergencias from './pages/Emergencias';
import Empleos from './pages/Empleos';
import Actividades from './pages/Actividades';
import Perfil from './pages/Perfil';
import Usuarios from './pages/Usuarios';

function RutaInicio() {
  const { isAuthenticated, rutaInicio } = useAuth();
  return <Navigate to={isAuthenticated ? rutaInicio : '/login'} replace />;
}

const ROLES_OPERADOR = [ROLES.ADMIN, ROLES.OPERADOR_MUNICIPAL];
const ROLES_REPORTES = [...ROLES_OPERADOR, ...ROLES_EQUIPO];

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />

          <Route path="/inicio" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/mis-reportes" element={<ProtectedRoute><MisReportes /></ProtectedRoute>} />
          <Route
            path="/nuevo-reporte"
            element={
              <ProtectedRoute roles={ROLES_PUEDEN_REPORTAR}>
                <NuevoReporte />
              </ProtectedRoute>
            }
          />
          <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
          <Route path="/empleos" element={<ProtectedRoute><Empleos /></ProtectedRoute>} />
          <Route path="/actividades" element={<ProtectedRoute><Actividades /></ProtectedRoute>} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={ROLES_OPERADOR}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/panel-equipo"
            element={
              <ProtectedRoute roles={ROLES_EQUIPO}>
                <DashboardEquipo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reportes"
            element={
              <ProtectedRoute roles={ROLES_REPORTES}>
                <Reportes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/emergencias"
            element={
              <ProtectedRoute roles={ROLES_REPORTES}>
                <Emergencias />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN]}>
                <Usuarios />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<RutaInicio />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
