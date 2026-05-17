import { apiFetch } from './apiClient';

export async function listarUsuarios() {
  return apiFetch('/api/usuarios');
}

export async function listarPersonalEmergencia() {
  return apiFetch('/api/usuarios/emergencia');
}

export async function obtenerUsuario(id) {
  return apiFetch(`/api/usuarios/${id}`);
}

export async function crearUsuario(data) {
  return apiFetch('/api/usuarios', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function actualizarRolUsuario(id, rol) {
  return apiFetch(`/api/usuarios/${id}/rol`, {
    method: 'PUT',
    body: JSON.stringify({ rol }),
  });
}

export async function suspenderUsuario(id) {
  return apiFetch(`/api/usuarios/${id}/suspender`, { method: 'PUT' });
}

export async function reactivarUsuario(id) {
  return apiFetch(`/api/usuarios/${id}/reactivar`, { method: 'PUT' });
}

export async function eliminarUsuario(id) {
  return apiFetch(`/api/usuarios/${id}`, { method: 'DELETE' });
}

export async function desactivarUsuario(id) {
  return suspenderUsuario(id);
}

export async function actualizarFotoPerfil(fotoMediaId) {
  return apiFetch('/api/usuarios/me/foto', {
    method: 'PUT',
    body: JSON.stringify({ fotoMediaId }),
  });
}
