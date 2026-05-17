import { apiUpload } from './apiClient';

export async function subirImagen(file, tipo, referenciaId = null) {
  const form = new FormData();
  form.append('file', file);
  if (tipo === 'CERTIFICADO') {
    return apiUpload('/api/media/upload-registro', form, { skipAuth: true });
  }
  form.append('tipo', tipo);
  if (referenciaId != null) {
    form.append('referenciaId', String(referenciaId));
  }
  return apiUpload('/api/media/upload', form);
}
