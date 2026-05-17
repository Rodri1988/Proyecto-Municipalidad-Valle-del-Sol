import { createContext, useContext, useMemo, useState } from 'react';
import { getStoredAuth, setStoredAuth } from '../services/apiClient';
import { login as loginApi, logout as logoutApi } from '../services/authService';
import { esAdmin, esOperador, esEquipoEmergencia, rutaInicioPorRol } from '../constants/usuariosPrueba';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => getStoredAuth());
  const [error, setError] = useState(null);

  const value = useMemo(
    () => ({
      auth,
      isAuthenticated: Boolean(auth?.token),
      rol: auth?.rol,
      usuarioId: auth?.usuarioId,
      email: auth?.email,
      error,
      esAdmin: esAdmin(auth?.rol),
      esOperador: esOperador(auth?.rol),
      esEquipo: esEquipoEmergencia(auth?.rol),
      rutaInicio: auth ? rutaInicioPorRol(auth.rol) : '/login',
      async login(email, password) {
        setError(null);
        try {
          const session = await loginApi(email, password);
          setAuth(session);
          return session;
        } catch (err) {
          setError(err.message);
          throw err;
        }
      },
      logout() {
        logoutApi();
        setAuth(null);
        setError(null);
      },
      clearError() {
        setError(null);
      },
    }),
    [auth, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}

export function useAuthOptional() {
  return useContext(AuthContext);
}
