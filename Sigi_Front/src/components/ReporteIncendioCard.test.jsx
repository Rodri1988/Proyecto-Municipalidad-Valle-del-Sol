import { render, screen, fireEvent } from '@testing-library/react';
import ReporteIncendioCard from './ReporteIncendioCard';

const reporte = {
  id: 1,
  sector: 'Sector Norte',
  nivelRiesgo: 'crítico',
  fuente: 'Vecino',
  hora: '08:30',
};

describe('ReporteIncendioCard', () => {
  it('marca como atendido con estado independiente', () => {
    const onAtendido = jest.fn();
    render(<ReporteIncendioCard reporte={reporte} onAtendido={onAtendido} />);
    const btn = screen.getByRole('button', { name: /marcar como atendido/i });
    fireEvent.click(btn);
    expect(onAtendido).toHaveBeenCalledWith(1);
    expect(screen.getByRole('button', { name: /atendido/i })).toBeDisabled();
  });
});
