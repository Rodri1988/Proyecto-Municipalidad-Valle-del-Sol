// Respuesta del API → formato de la tarjeta del desafío Hooks
export function reporteApiACard(reporte) {
  const prioridadMap = {
    CRITICA: 'crítico',
    ALTA: 'alto',
    MEDIA: 'medio',
    BAJA: 'bajo',
  };

  const fecha = reporte.fechaReporte
    ? new Date(reporte.fechaReporte).toLocaleTimeString('es-CL', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

  return {
    id: reporte.id,
    sector: reporte.direccion ?? 'Sin dirección',
    nivelRiesgo: prioridadMap[reporte.prioridad] ?? 'medio',
    fuente: reporte.estado ?? 'Reporte',
    hora: fecha,
    descripcion: reporte.descripcion,
    estado: reporte.estado,
    latitud: reporte.latitud,
    longitud: reporte.longitud,
    prioridad: reporte.prioridad,
    reportesSimilares: reporte.reportesSimilares ?? 0,
    motivoPrioridad: reporte.motivoPrioridad,
    requiereCarabineros: reporte.requiereCarabineros,
    raw: reporte,
  };
}

export const TIPOS_EMERGENCIA = [
  { value: 'INCENDIO', label: 'Incendio' },
  { value: 'FUGA_GAS', label: 'Fuga de gas' },
  { value: 'AGUA', label: 'Problema de agua' },
  { value: 'RUTA', label: 'Ruta en mal estado' },
  { value: 'OTRO', label: 'Otra emergencia' },
];

export const PRIORIDADES_API = [
  { value: 'BAJA', label: 'Baja' },
  { value: 'MEDIA', label: 'Media' },
  { value: 'ALTA', label: 'Alta' },
  { value: 'CRITICA', label: 'Crítica' },
];
