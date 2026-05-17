import { apiFetch } from './apiClient';

export async function listarEmergenciasActivas() {
  return apiFetch('/api/emergencias/activas');
}

export async function listarTodasEmergencias() {
  return apiFetch('/api/emergencias');
}

export async function actualizarEstadoEmergencia(id, { estado, notas }) {
  return apiFetch(`/api/emergencias/${id}/estado`, {
    method: 'PUT',
    body: JSON.stringify({ estado, notas }),
  });
}
