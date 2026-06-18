import {
  listarEmpleos,
  listarEmpleosAdmin,
  listarPostulaciones,
  crearEmpleo,
  actualizarEmpleo,
  eliminarEmpleo,
  postularEmpleo,
  misPostulaciones,
} from './empleoService';
import * as apiClient from './apiClient';

jest.mock('./apiClient');

describe('empleoService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lista empleos activos', async () => {
    apiClient.apiFetch.mockResolvedValue([{ id: 1, titulo: 'Brigadista' }]);
    const lista = await listarEmpleos();
    expect(apiClient.apiFetch).toHaveBeenCalledWith('/api/empleos');
    expect(lista).toHaveLength(1);
  });

  it('lista empleos para admin', async () => {
    apiClient.apiFetch.mockResolvedValue([
      { id: 1, titulo: 'Brigadista', estado: 'ACTIVO' },
      { id: 2, titulo: 'Técnico', estado: 'INACTIVO' },
    ]);
    const lista = await listarEmpleosAdmin();
    expect(apiClient.apiFetch).toHaveBeenCalledWith('/api/empleos/admin/todos');
    expect(lista).toHaveLength(2);
  });

  it('lista postulaciones del usuario', async () => {
    apiClient.apiFetch.mockResolvedValue([
      { id: 1, empleoId: 5, estado: 'ENVIADA' },
      { id: 2, empleoId: 7, estado: 'ACEPTADA' },
    ]);
    const lista = await listarPostulaciones();
    expect(apiClient.apiFetch).toHaveBeenCalledWith('/api/empleos/postulaciones');
    expect(lista).toHaveLength(2);
  });

  it('crea nuevo empleo', async () => {
    const data = {
      titulo: 'Nuevo Empleo',
      descripcion: 'Descripción',
      salario: 1500,
    };
    apiClient.apiFetch.mockResolvedValue({ id: 10, ...data });
    const resultado = await crearEmpleo(data);
    expect(apiClient.apiFetch).toHaveBeenCalledWith('/api/empleos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    expect(resultado.id).toBe(10);
  });

  it('actualiza empleo existente', async () => {
    const data = { titulo: 'Empleo Actualizado', salario: 2000 };
    apiClient.apiFetch.mockResolvedValue({ id: 5, ...data });
    const resultado = await actualizarEmpleo(5, data);
    expect(apiClient.apiFetch).toHaveBeenCalledWith('/api/empleos/5', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    expect(resultado.id).toBe(5);
  });

  it('elimina empleo', async () => {
    apiClient.apiFetch.mockResolvedValue(null);
    await eliminarEmpleo(3);
    expect(apiClient.apiFetch).toHaveBeenCalledWith('/api/empleos/3', {
      method: 'DELETE',
    });
  });

  it('postula a un empleo', async () => {
    apiClient.apiFetch.mockResolvedValue({ id: 5, empleoId: 1, estado: 'ENVIADA' });
    await postularEmpleo(1);
    expect(apiClient.apiFetch).toHaveBeenCalledWith('/api/empleos/1/postular', { method: 'POST' });
  });

  it('obtiene mis postulaciones', async () => {
    apiClient.apiFetch.mockResolvedValue([{ id: 100, empleoId: 8, estado: 'PENDIENTE' }]);
    const lista = await misPostulaciones();
    expect(apiClient.apiFetch).toHaveBeenCalledWith('/api/empleos/postulaciones/mias');
    expect(lista).toHaveLength(1);
  });
});
