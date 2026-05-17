import { apiFetch } from './apiClient';

export async function crearReporte({ descripcion, direccion, prioridad, fotoMediaId }) {
  const body = { descripcion, direccion, fotoMediaId };
  if (prioridad) body.prioridad = prioridad;
  return apiFetch('/api/reportes', {
    method: 'POST',
    body: JSON.stringify(body),
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

export async function listarReportesEquipo() {
  return apiFetch('/api/reportes/equipo');
}

export async function validarReporte(id, { aprobado, notasOperador }) {
  return apiFetch(`/api/reportes/${id}/validar`, {
    method: 'PUT',
    body: JSON.stringify({ aprobado, notasOperador }),
  });
}

export async function actualizarPrioridadReporte(id, { prioridad, notasOperador }) {
  return apiFetch(`/api/reportes/${id}/prioridad`, {
    method: 'PUT',
    body: JSON.stringify({ prioridad, notasOperador }),
  });
}

export async function clasificarReporte(id, { estado, requiereCarabineros, notas }) {
  return apiFetch(`/api/reportes/${id}/clasificar`, {
    method: 'PUT',
    body: JSON.stringify({ estado, requiereCarabineros, notas }),
  });
}

export async function asignarReporte(id, { usuarioId, notas }) {
  return apiFetch(`/api/reportes/${id}/asignar`, {
    method: 'PUT',
    body: JSON.stringify({ usuarioId, notas }),
  });
}
