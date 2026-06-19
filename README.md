# Proyecto Municipalidad Valle del Sol

Caso semestral Full Stack: plataforma para gestión y prevención de emergencias (incendios, fugas, rutas, etc.) en la comuna ficticia **Valle del Sol**.

**Integrantes:** Hawk Durant, Emilio Jaramillo, Rodrigo Candia.

## Estructura del repositorio

```
Proyecto-Municipalidad-Valle-del-Sol/
├── sigi-backend/          # Microservicios Java (Spring Boot, Eureka, Gateway, MySQL)
├── Sigi_Front/            # Frontend React + Vite + Tailwind
├── docs/                  # PDFs de entrega (patrones, branching, instrucciones)
├── INFORME_PROYECTO_SIGI.pdf
└── README.md              # Este archivo
```

## Tecnologías

| Capa | Stack |
|------|--------|
| Backend | Java 17, Spring Boot 3.5, Spring Cloud, MySQL 8, JWT, Docker Compose |
| Frontend | React 19, Vite, Tailwind CSS, Jest |

## Puesta en marcha

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

## Documentación (PDF)

| Documento | Archivo |
|-----------|---------|
| Informe técnico integral | [INFORME_PROYECTO_SIGI.pdf](INFORME_PROYECTO_SIGI.pdf) |
| Análisis de patrones y arquetipos | [docs/ANALISIS_PATRONES_Y_ARQUETIPOS.pdf](docs/ANALISIS_PATRONES_Y_ARQUETIPOS.pdf) |
| Plan de branching | [docs/PLAN_DE_BRANCHING.pdf](docs/PLAN_DE_BRANCHING.pdf) |
| Instrucciones de uso | [docs/INSTRUCCIONES_DE_USO.pdf](docs/INSTRUCCIONES_DE_USO.pdf) |
| Frontend (detalle) | [Sigi_Front/README.pdf](Sigi_Front/README.pdf) |

## Qué incluye la plataforma

- Registro e inicio de sesión con JWT
- Reporte de emergencias con foto, dirección y prioridad
- Validación por operador y creación de emergencias
- Dashboard y mapa de incidentes (admin)
- Avisos de empleo y postulaciones
- Foto de perfil en servidor
