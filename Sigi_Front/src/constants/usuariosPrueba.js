/**
 * Usuarios de demostración — Grupo Valle del Sol
 * Hawk Durant · Emilio Jaramillo · Rodrigo Candia
 */
export const USUARIOS_PRUEBA = [
  {
    id: 'hawk',
    nombre: 'Hawk',
    apellido: 'Durant',
    email: 'hawk.durant@test.com',
    password: 'secreta123',
    rut: '12.345.678-9',
    rol: 'CIUDADANO',
    descripcion: 'Residente — reporta emergencias y consulta avisos municipales',
  },
  {
    id: 'emilio',
    nombre: 'Emilio',
    apellido: 'Jaramillo',
    email: 'emilio.jaramillo@municipalidad.cl',
    password: 'operador123',
    rut: '11.222.333-4',
    rol: 'OPERADOR_MUNICIPAL',
    descripcion: 'Operador / brigada — valida reportes y actualiza emergencias',
  },
  {
    id: 'rodrigo',
    nombre: 'Rodrigo',
    apellido: 'Candia',
    email: 'rodrigo.candia@municipalidad.cl',
    password: 'admin123',
    rut: '18.765.432-1',
    rol: 'ADMIN',
    descripcion: 'Administrador — dashboard, usuarios y mapa de incidentes',
  },
];

export const ROLES = {
  CIUDADANO: 'CIUDADANO',
  OPERADOR_MUNICIPAL: 'OPERADOR_MUNICIPAL',
  EQUIPO_EMERGENCIA: 'EQUIPO_EMERGENCIA',
  ADMIN: 'ADMIN',
};

export function esAdmin(rol) {
  return rol === ROLES.ADMIN;
}

export function esOperador(rol) {
  return rol === ROLES.OPERADOR_MUNICIPAL || rol === ROLES.ADMIN;
}

export function esEquipoEmergencia(rol) {
  return rol === ROLES.EQUIPO_EMERGENCIA || rol === ROLES.OPERADOR_MUNICIPAL || rol === ROLES.ADMIN;
}

export function esCiudadano(rol) {
  return rol === ROLES.CIUDADANO;
}

export function rutaInicioPorRol(rol) {
  if (esAdmin(rol) || esOperador(rol)) return '/dashboard';
  if (esEquipoEmergencia(rol) && rol === ROLES.EQUIPO_EMERGENCIA) return '/emergencias';
  return '/inicio';
}
