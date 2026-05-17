# Instrucciones de Uso — S.I.G.I.

**Municipalidad Valle del Sol**  
**Integrantes:** Hawk Durant, Emilio Jaramillo, Rodrigo Candia  

---

> **Exportar a PDF:** Imprimir este documento desde Word o navegador si la entrega pide PDF de instrucciones.

---

## 1. Requisitos previos

| Herramienta | Versión mínima | Uso |
|-------------|----------------|-----|
| Docker Desktop | Reciente | Levantar backend completo |
| Node.js | 18+ | Frontend React |
| Git | 2.x | Clonar repositorio |
| Navegador | Chrome / Firefox | Usar la aplicación |

Opcional: JDK 17 y Maven 3.9+ si se ejecuta backend sin Docker.

---

## 2. Clonar el proyecto

```bash
git clone <url-del-repositorio>
cd Proyecto-Municipalidad-Valle-del-Sol
```

---

## 3. Levantar el backend

```bash
cd sigi-backend
docker compose up --build
```

Primera ejecución: puede tardar varios minutos (descarga de imágenes y build Maven).

| Servicio | URL |
|----------|-----|
| API Gateway (usar siempre esta) | http://localhost:8080 |
| Eureka (solo consulta) | http://localhost:8761 |
| MySQL desde el PC | localhost:13306 (usuario `root`, clave `root`) |

Opcional — geocodificación real:

```bash
export OPENCAGE_API_KEY=tu_clave
docker compose up --build
```

---

## 4. Levantar el frontend

En otra terminal:

```bash
cd Sigi_Front
npm install
cp .env.example .env
npm run dev
```

Abrir: http://localhost:5173

El archivo `.env` vacío (`VITE_API_URL=`) usa el proxy de Vite hacia el puerto 8080.

---

## 5. Usuarios de prueba

Se crean automáticamente al iniciar `servicio-usuario`:

| Usuario | Email | Contraseña | Rol |
|---------|-------|------------|-----|
| Hawk Durant | hawk.durant@test.com | secreta123 | CIUDADANO |
| Emilio Jaramillo | emilio.jaramillo@municipalidad.cl | operador123 | OPERADOR_MUNICIPAL |
| Rodrigo Candia | rodrigo.candia@municipalidad.cl | admin123 | ADMIN |

En la pantalla de login hay botones para rellenar credenciales de prueba.

---

## 6. Guía por rol

### 6.1 Ciudadano (Hawk)

1. Iniciar sesión o registrarse en `/registro`.
2. **Inicio** — accesos rápidos.
3. **Reportar** — tipo de emergencia, descripción, dirección, foto opcional.
4. **Mis reportes** — estados pendientes / resueltos.
5. **Empleos** — ver avisos y postular.
6. **Perfil** — subir foto (se guarda en servidor).

### 6.2 Operador (Emilio)

1. Iniciar sesión como operador.
2. **Dashboard** — resumen y cola de validación.
3. Aprobar o rechazar reportes con notas.
4. **Emergencias** — cambiar estado (ACTIVA, EN_PROCESO, etc.).
5. **Cola reportes** — filtros por nivel de riesgo.

### 6.3 Administrador (Rodrigo)

1. Todo lo del operador.
2. **Dashboard** — mapa de incidentes con GPS.
3. **Usuarios** — listar y desactivar cuentas.
4. **Empleos** — crear y desactivar avisos laborales.

---

## 7. Pruebas automatizadas

### Frontend (Jest)

```bash
cd Sigi_Front
npm test
```

### Backend (JUnit, por módulo)

```bash
cd sigi-backend/servicio-usuario
mvn test
```

Repetir en `servicio-reporte`, `servicio-empleo`, etc.

---

## 8. Problemas frecuentes

| Síntoma | Solución |
|---------|----------|
| Puerto 8080 ocupado | `lsof -i :8080` y cerrar proceso, o cambiar puerto en `docker-compose.yml` |
| Gateway cae al iniciar | `docker logs api-gateway` — revisar JWT y nombre filtro `JwtAuth` |
| Login 401 | Verificar que backend esté arriba; mismo `JWT_SECRET` en gateway y usuario |
| No hay GPS en mapa | Configurar `OPENCAGE_API_KEY` o aceptar reportes sin coordenadas |
| Bases `db_empleo` / `db_media` faltan | Ejecutar script `docker/mysql-init/01-databases.sql` o recrear volumen MySQL |
| Eureka no abre en navegador | Normal; consumir API solo por Gateway :8080 |

---

## 9. Documentación relacionada

| Documento | Contenido |
|-----------|-----------|
| [INFORME_PROYECTO_SIGI.md](../INFORME_PROYECTO_SIGI.md) | Informe técnico integral |
| [ANALISIS_PATRONES_Y_ARQUETIPOS.md](ANALISIS_PATRONES_Y_ARQUETIPOS.md) | Patrones y arquetipos |
| [PLAN_DE_BRANCHING.md](PLAN_DE_BRANCHING.md) | Estrategia de ramas Git |
| [sigi-backend/README.md](../sigi-backend/README.md) | Detalle backend y curl |

---

*Hawk Durant, Emilio Jaramillo, Rodrigo Candia — 2026.*
