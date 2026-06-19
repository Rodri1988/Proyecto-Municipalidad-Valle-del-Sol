import { API_BASE_URL } from '../config/api';
import { parseApiError } from '../utils/apiError';

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
    throw await buildApiError(response, path);
  }

  if (response.status === 204) return null;

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

// Fotos: multipart, sin Content-Type JSON
export async function apiUpload(path, formData, options = {}) {
  const auth = getStoredAuth();
  const headers = {};
  if (auth?.token && !options.skipAuth) {
    headers.Authorization = `Bearer ${auth.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    body: formData,
    headers,
  });

  if (!response.ok) {
    throw await buildApiError(response, path);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export function mediaUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
}

async function buildApiError(response, path) {
  const bodyText = await response.text();
  return parseApiError(response.status, path, bodyText);
}
