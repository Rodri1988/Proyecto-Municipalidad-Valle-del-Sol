import { apiFetch } from './apiClient';

export async function crearReporte({ descripcion, direccion, prioridad, fotoMediaId }) {
  return apiFetch('/api/reportes', {
    method: 'POST',
    body: JSON.stringify({ descripcion, direccion, prioridad, fotoMediaId }),
  });
}

export async function misReportes(usuarioId) {
  return apiFetch(`/api/reportes/usuario/${usuarioId}`);
}

export async function reportesPendientes() {
  return apiFetch('/api/reportes/pendientes');
}

export async function listarTodosReportes() {
  return apiFetch('/api/reportes');
}

export async function validarReporte(id, { aprobado, notasOperador }) {
  return apiFetch(`/api/reportes/${id}/validar`, {
    method: 'PUT',
    body: JSON.stringify({ aprobado, notasOperador }),
  });
}
