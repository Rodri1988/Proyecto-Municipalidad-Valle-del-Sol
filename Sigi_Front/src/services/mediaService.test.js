import { subirImagen } from './mediaService';
import * as apiClient from './apiClient';

jest.mock('./apiClient');

describe('mediaService', () => {
  it('sube imagen con tipo REPORTE', async () => {
    apiClient.apiUpload.mockResolvedValue({ id: 10, url: '/api/media/10/archivo' });
    const file = new File(['x'], 'foto.jpg', { type: 'image/jpeg' });
    const res = await subirImagen(file, 'REPORTE');
    expect(apiClient.apiUpload).toHaveBeenCalled();
    const [path, form] = apiClient.apiUpload.mock.calls[0];
    expect(path).toBe('/api/media/upload');
    expect(form.get('tipo')).toBe('REPORTE');
    expect(res.id).toBe(10);
  });
});
