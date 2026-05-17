import { listarEmpleos, postularEmpleo } from './empleoService';
import * as apiClient from './apiClient';

jest.mock('./apiClient');

describe('empleoService', () => {
  it('lista empleos activos', async () => {
    apiClient.apiFetch.mockResolvedValue([{ id: 1, titulo: 'Brigadista' }]);
    const lista = await listarEmpleos();
    expect(apiClient.apiFetch).toHaveBeenCalledWith('/api/empleos');
    expect(lista).toHaveLength(1);
  });

  it('postula a un empleo', async () => {
    apiClient.apiFetch.mockResolvedValue({ id: 5, empleoId: 1, estado: 'ENVIADA' });
    await postularEmpleo(1);
    expect(apiClient.apiFetch).toHaveBeenCalledWith('/api/empleos/1/postular', { method: 'POST' });
  });
});
