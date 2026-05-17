import { apiFetch } from './apiClient';

export async function listarUsuarios() {
  return apiFetch('/api/usuarios');
}

export async function obtenerUsuario(id) {
  return apiFetch(`/api/usuarios/${id}`);
}

export async function desactivarUsuario(id) {
  return apiFetch(`/api/usuarios/${id}`, { method: 'DELETE' });
}

export async function actualizarFotoPerfil(fotoMediaId) {
  return apiFetch('/api/usuarios/me/foto', {
    method: 'PUT',
    body: JSON.stringify({ fotoMediaId }),
  });
}
