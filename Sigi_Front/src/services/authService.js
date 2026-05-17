import { apiFetch, setStoredAuth } from './apiClient';

export async function login(email, password) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    skipAuth: true,
  });

  const auth = {
    token: data.token,
    tipoToken: data.tipoToken,
    email: data.email,
    rol: data.rol,
    usuarioId: data.usuarioId,
    expiracionEnSegundos: data.expiracionEnSegundos,
  };
  setStoredAuth(auth);
  return auth;
}

export async function registro(payload) {
  return apiFetch('/auth/registro', {
    method: 'POST',
    body: JSON.stringify(payload),
    skipAuth: true,
  });
}

export function logout() {
  setStoredAuth(null);
}
