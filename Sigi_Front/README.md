# SIGI Frontend — Municipalidad Valle del Sol

React + Vite con **useState**, **useEffect** y API real vía Gateway (`http://localhost:8080`).

## Requisitos

- Node 18+
- Backend SIGI en ejecución (`docker compose up` en `sigi-backend/`)

## Instalación

```bash
npm install
cp .env.example .env   # VITE_API_URL vacío usa proxy de Vite
npm run dev
```

## Usuarios de prueba (se crean al iniciar el backend)

| Integrante       | Email                              | Contraseña   | Rol                |
|------------------|-------------------------------------|--------------|--------------------|
| Hawk Durant      | hawk.durant@test.com                | secreta123   | CIUDADANO          |
| Emilio Jaramillo | emilio.jaramillo@municipalidad.cl   | operador123  | OPERADOR_MUNICIPAL |
| Rodrigo Candia   | rodrigo.candia@municipalidad.cl     | admin123     | ADMIN              |

## Tests (Jest)

```bash
npm test
```

## Rutas principales

- `/login`, `/registro` — público
- `/inicio`, `/nuevo-reporte`, `/mis-reportes` — ciudadano
- `/dashboard`, `/reportes`, `/usuarios` — operador / admin
- `/emergencias` — equipo de emergencia (lectura/edición estado)

**Empleos/postulaciones** y **fotos** (reportes y perfil) usan los microservicios `servicio-empleo` y `servicio-media`. Las **actividades municipales** siguen en datos locales de demo.
