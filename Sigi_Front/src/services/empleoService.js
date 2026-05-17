import { apiFetch } from './apiClient';

export async function listarEmpleos() {
  return apiFetch('/api/empleos');
}

export async function listarEmpleosAdmin() {
  return apiFetch('/api/empleos/admin/todos');
}

export async function listarPostulaciones() {
  return apiFetch('/api/empleos/postulaciones');
}

export async function crearEmpleo(data) {
  return apiFetch('/api/empleos', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function actualizarEmpleo(id, data) {
  return apiFetch(`/api/empleos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function eliminarEmpleo(id) {
  return apiFetch(`/api/empleos/${id}`, { method: 'DELETE' });
}

export async function postularEmpleo(empleoId) {
  return apiFetch(`/api/empleos/${empleoId}/postular`, { method: 'POST' });
}

export async function misPostulaciones() {
  return apiFetch('/api/empleos/postulaciones/mias');
}
