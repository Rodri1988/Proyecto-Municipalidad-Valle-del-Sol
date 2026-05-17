/**
 * Datos municipales (empleos, actividades, perfil, postulaciones)
 * persistidos en localStorage hasta que existan microservicios dedicados.
 */

const KEY_EMPLEOS = 'sigi_empleos';
const KEY_ACTIVIDADES = 'sigi_actividades';
const KEY_PERFILES = 'sigi_perfiles';
const KEY_POSTULACIONES = 'sigi_postulaciones';
const KEY_FOTOS_REPORTE = 'sigi_fotos_reporte';

const empleosIniciales = [
  {
    id: 1,
    titulo: 'Brigadista forestal',
    departamento: 'Prevención',
    plazas: 2,
    cierre: '2026-06-30',
    descripcion: 'Patrullaje y apoyo en incendios rurales del valle.',
  },
  {
    id: 2,
    titulo: 'Operador central de emergencias',
    departamento: 'SIGI',
    plazas: 1,
    cierre: '2026-05-31',
    descripcion: 'Validación de reportes ciudadanos y coordinación.',
  },
];

const actividadesIniciales = [
  {
    id: 1,
    titulo: 'Simulacro de evacuación',
    fecha: '2026-05-25',
    lugar: 'Plaza central',
    descripcion: 'Ejercicio anual con bomberos y juntas de vecinos.',
  },
  {
    id: 2,
    titulo: 'Taller prevención de incendios',
    fecha: '2026-06-10',
    lugar: 'Centro comunitario Norte',
    descripcion: 'Capacitación gratuita para residentes.',
  },
];

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getEmpleos() {
  return read(KEY_EMPLEOS, empleosIniciales);
}

export function getActividades() {
  return read(KEY_ACTIVIDADES, actividadesIniciales);
}

export function getPerfil(usuarioId) {
  const perfiles = read(KEY_PERFILES, {});
  return perfiles[usuarioId] ?? { fotoUrl: null, telefono: '' };
}

export function guardarPerfil(usuarioId, perfil) {
  const perfiles = read(KEY_PERFILES, {});
  perfiles[usuarioId] = { ...perfiles[usuarioId], ...perfil };
  write(KEY_PERFILES, perfiles);
  return perfiles[usuarioId];
}

export function getPostulaciones(usuarioId) {
  const todas = read(KEY_POSTULACIONES, []);
  return todas.filter((p) => p.usuarioId === usuarioId);
}

export function postularEmpleo(usuarioId, empleoId) {
  const todas = read(KEY_POSTULACIONES, []);
  if (todas.some((p) => p.usuarioId === usuarioId && p.empleoId === empleoId)) {
    throw new Error('Ya postulaste a este empleo');
  }
  const postulacion = {
    id: Date.now(),
    usuarioId,
    empleoId,
    fecha: new Date().toISOString(),
    estado: 'ENVIADA',
  };
  todas.push(postulacion);
  write(KEY_POSTULACIONES, todas);
  return postulacion;
}

export function guardarFotoReporte(reporteId, dataUrl) {
  const fotos = read(KEY_FOTOS_REPORTE, {});
  fotos[reporteId] = dataUrl;
  write(KEY_FOTOS_REPORTE, fotos);
}

export function getFotoReporte(reporteId) {
  const fotos = read(KEY_FOTOS_REPORTE, {});
  return fotos[reporteId] ?? null;
}

/** CRUD empleos — solo admin en UI */
export function crearEmpleo(empleo) {
  const lista = getEmpleos();
  const nuevo = { ...empleo, id: Date.now() };
  write(KEY_EMPLEOS, [...lista, nuevo]);
  return nuevo;
}

export function actualizarEmpleo(id, datos) {
  const lista = getEmpleos().map((e) => (e.id === id ? { ...e, ...datos } : e));
  write(KEY_EMPLEOS, lista);
  return lista.find((e) => e.id === id);
}

export function eliminarEmpleo(id) {
  write(
    KEY_EMPLEOS,
    getEmpleos().filter((e) => e.id !== id),
  );
}
