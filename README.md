# Proyecto-Municipalidad-Valle-del-Sol Proyecto FullStack Caso Semestral: 
"Municipalidad Valle del Sol – Plataforma inteligente para la gestión y prevención de incendios"   
En diversas regiones del país en los últimos años han ocurrido incendios forestales y urbanos generando una amenaza constante a la seguridad de las personas, la infraestructura y el entorno natural. Las municipalidades cumplen un rol sumamente importante en la prevención, detección temprana y coordinación de emergencias.   
La Municipalidad Valle del Sol, a través de su Subdirección de Gestión de Emergencias y Prevención de desastres desea tomar cartas en el asunto y ejecutar acciones preventivas, monitoreo y respuesta ante situaciones de emergencia en el territorio comunal.   
Según las vivencias previas de las diversas catástrofes que han acontecido se ha identificado que la mayoría de los reportes se reciben a través de llamadas telefónicas, mensajes mediante redes sociales, informes de vecinos, aviso de bomberos o brigadistas forestales.   

---

## Estructura del Proyecto

El sistema está compuesto por los siguientes módulos principales:

- **eureka-server**: Servidor de descubrimiento de microservicios (Spring Cloud Netflix Eureka).
- **api-gateway**: Puerta de entrada a los microservicios, maneja rutas, autenticación JWT y CORS (Spring Cloud Gateway).
- **Sigi_Front**: Frontend moderno en React + Vite + TailwindCSS, permite a los usuarios autenticarse y reportar emergencias.

## Tecnologías principales

- **Backend:** Java 21, Spring Boot 3.2.5, Spring Cloud 2023.0.1, Maven, Docker
- **Frontend:** React 19, Vite, TailwindCSS, ESLint

## Estructura de carpetas

```
├── api-gateway/      # API Gateway (Java, Spring Boot)
├── eureka-server/    # Servidor Eureka (Java, Spring Boot)
├── Sigi_Front/       # Frontend (React, Vite, TailwindCSS)
```

## Instrucciones de uso rápido

### 1. Backend (Eureka y API Gateway)

Requisitos: Java 21, Maven, Docker (opcional)

#### Usando Maven

```bash
cd eureka-server
mvn spring-boot:run
# En otra terminal:
cd ../api-gateway
mvn spring-boot:run
```

#### Usando Docker

```bash
cd eureka-server
docker build -t eureka-server .
docker run -p 8761:8761 eureka-server
# En otra terminal:
cd ../api-gateway
docker build -t api-gateway .
docker run -p 8080:8080 api-gateway
```

### 2. Frontend

Requisitos: Node.js >=18

```bash
cd Sigi_Front
npm install
npm run dev
```
La app estará disponible en http://localhost:5173

---

## Descripción funcional

Plataforma para la gestión y prevención de incendios, permitiendo:
- Registro y autenticación de usuarios
- Reporte de emergencias
- Visualización de información geográfica en tiempo real
- Comunicación con la comunidad

---

## Créditos
Desarrollado como caso semestral para la Municipalidad Valle del Sol.

