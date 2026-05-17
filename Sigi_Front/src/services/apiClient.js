import { API_BASE_URL } from '../config/api';

const STORAGE_KEY = 'sigi_auth';

export function getStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredAuth(auth) {
  if (auth) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export async function apiFetch(path, options = {}) {
  const auth = getStoredAuth();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers ?? {}),
  };

  if (auth?.token && !options.skipAuth) {
    headers.Authorization = `Bearer ${auth.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    const err = new Error(message);
    err.status = response.status;
    throw err;
  }

  if (response.status === 204) return null;

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

/** Subida multipart (imágenes) — no enviar Content-Type JSON */
export async function apiUpload(path, formData) {
  const auth = getStoredAuth();
  const headers = {};
  if (auth?.token) {
    headers.Authorization = `Bearer ${auth.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    body: formData,
    headers,
  });

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    throw new Error(message);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export function mediaUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
}

async function parseErrorMessage(response) {
  try {
    const body = await response.json();
    return body.message ?? body.error ?? `Error ${response.status}`;
  } catch {
    const labels = {
      400: 'Datos inválidos',
      401: 'Credenciales incorrectas',
      403: 'No tienes permiso para esta acción',
      404: 'Recurso no encontrado',
      500: 'Error del servidor',
    };
    return labels[response.status] ?? `Error ${response.status}`;
  }
}
