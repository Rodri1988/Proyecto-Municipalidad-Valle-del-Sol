import { reporteApiACard } from './reporteMappers';

describe('reporteApiACard', () => {
  it('mapea prioridad CRITICA a crítico', () => {
    const card = reporteApiACard({
      id: 5,
      descripcion: 'Humo',
      direccion: 'Cerro Alto',
      prioridad: 'CRITICA',
      estado: 'PENDIENTE',
      fechaReporte: '2026-05-17T10:00:00',
    });
    expect(card.nivelRiesgo).toBe('crítico');
    expect(card.sector).toBe('Cerro Alto');
  });
});
