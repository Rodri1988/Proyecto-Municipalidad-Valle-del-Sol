# Proyecto Municipalidad Valle del Sol

Caso semestral Full Stack: plataforma para gestión y prevención de emergencias (incendios, fugas, rutas, etc.) en la comuna ficticia **Valle del Sol**.

Integrantes: **Hawk Durant**, **Emilio Jaramillo**, **Rodrigo Candia**.

## Estructura del repositorio

```
Proyecto-Municipalidad-Valle-del-Sol/
├── sigi-backend/          # Microservicios Java (Spring Boot, Eureka, Gateway, MySQL)
├── Sigi_Front/            # Frontend React + Vite + Tailwind
├── INFORME_PROYECTO_SIGI.md   # Informe técnico completo del proyecto
└── README.md              # Este archivo
```

## Tecnologías

| Capa | Stack |
|------|--------|
| Backend | Java 17, Spring Boot 3.5, Spring Cloud, MySQL 8, JWT, Docker Compose |
| Frontend | React 19, Vite, Tailwind CSS, Jest |

## Inicio rápido

### Backend

```bash
cd sigi-backend
docker compose up --build
```

API pública: http://localhost:8080

### Frontend

```bash
cd Sigi_Front
npm install
npm run dev
```

App: http://localhost:5173

### Usuarios de prueba

| Usuario | Email | Contraseña | Rol |
|---------|-------|------------|-----|
| Hawk Durant | hawk.durant@test.com | secreta123 | CIUDADANO |
| Emilio Jaramillo | emilio.jaramillo@municipalidad.cl | operador123 | OPERADOR_MUNICIPAL |
| Rodrigo Candia | rodrigo.candia@municipalidad.cl | admin123 | ADMIN |

## Documentación

| Documento | Enlace |
|-----------|--------|
| Informe técnico integral | [INFORME_PROYECTO_SIGI.md](INFORME_PROYECTO_SIGI.md) |
| Análisis de patrones y arquetipos (PDF) | [docs/ANALISIS_PATRONES_Y_ARQUETIPOS.md](docs/ANALISIS_PATRONES_Y_ARQUETIPOS.md) |
| Plan de branching (PDF) | [docs/PLAN_DE_BRANCHING.md](docs/PLAN_DE_BRANCHING.md) |
| Instrucciones de uso | [docs/INSTRUCCIONES_DE_USO.md](docs/INSTRUCCIONES_DE_USO.md) |
| Índice documentación / exportar PDF | [docs/README.md](docs/README.md) |
| Backend | [sigi-backend/README.md](sigi-backend/README.md) |
| Frontend | [Sigi_Front/README.md](Sigi_Front/README.md) |

## Funcionalidades principales

- Registro e inicio de sesión con JWT
- Reporte de emergencias con foto, dirección y prioridad
- Validación por operador y creación de emergencias
- Dashboard y mapa de incidentes (admin)
- Avisos de empleo y postulaciones
- Foto de perfil almacenada en servidor
