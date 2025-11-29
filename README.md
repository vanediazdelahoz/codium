# Codium - Plataforma para Evaluar Algoritmos 💻
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white) ![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

## 📖 Introducción
**Codium** es una plataforma backend que funciona como un juez en línea, similar a plataformas como HackerRank o LeetCode. Permite a los administradores y profesores publicar retos de programación, y a los estudiantes enviar sus soluciones en diferentes lenguajes (Python, Node.js, C++, Java). Las soluciones son ejecutadas en contenedores aislados (sandbox) para calificarlas automáticamente contra un conjunto de casos de prueba.

Este proyecto fue desarrollado como parte del curso "Desarrollo de Aplicaciones Backend" de la Universidad del Norte.

## 🏛️ Arquitectura
El proyecto sigue estrictamente los principios de **Clean Architecture**, separando el código en las siguientes capas principales:
* **`Domain`**: Contiene las entidades y reglas de negocio más puras.
* **`Application`**: Orquesta los flujos de datos a través de los casos de uso.
* **`Infrastructure`**: Implementa los detalles técnicos como la base de datos, colas y servicios externos.
* **`Interface`**: Expone la aplicación al mundo exterior, en este caso, a través de una API REST.

### Stack Tecnológico
* **API Backend:** Node.js + NestJS
* **Base de Datos:** PostgreSQL
* **Cola de Mensajes:** Redis con Bull
* **Autenticación:** JWT (JSON Web Tokens)
* **Contenerización:** Docker y Docker Compose (obligatorio)

## 🚀 Cómo Empezar
Sigue estos pasos para levantar el proyecto en tu entorno local.

### Prerrequisitos
* Tener instalado **Docker Desktop** y asegurarse de que se esté ejecutando.

### Configuración
1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/vanediazdelahoz/codium
    cd codium
    ```

2.  **Crea el archivo de entorno:**
    Copia el archivo `.env.example` y renómbralo a `.env`.
    ```bash
    cp .env.example .env
    ```
    Abre el archivo `.env` y asegúrate de que la variable `JWT_SECRET` tenga un valor secreto, largo y seguro.

3.  **Construye y levanta los contenedores:**
    Este comando construirá las imágenes de Docker, iniciará todos los servicios (API, base de datos, Redis, workers), aplicará las migraciones de la base de datos y ejecutará el script de "seed" para poblar la base de datos con datos de prueba.
    ```bash
    docker-compose up -d --build
    ```
    *Nota: La primera vez que ejecutes este comando puede tardar varios minutos.*

## ⚙️ Uso de la API
Una vez que los contenedores estén corriendo, la aplicación estará disponible:

* **API Base URL:** `http://localhost:3000`
* **Documentación Interactiva (Swagger):** **`http://localhost:3000/docs`**

### Credenciales de Prueba
El script de "seed" crea los siguientes usuarios para que puedas probar la plataforma:

* **Administrador:**
    * **Email:** `admin@codium.com`
    * **Contraseña:** `admin123`
* **Profesor:**
    * **Email:** `professor@codium.com`
    * **Contraseña:** `professor123`
* **Estudiante:**
    * **Email:** `student1@codium.com`
    * **Contraseña:** `student123`

Puedes usar estas credenciales en el endpoint `/api/auth/login` para obtener un token JWT y probar las rutas protegidas.

## ✅ Módulos Implementados
El proyecto incluye la implementación de los siguientes módulos principales, según los requerimientos:
* **Autenticación y Autorización** (Módulo 1) ✅
* **Gestión de Retos** (Módulo 2) ✅
* **Submissions (Envíos)** (Módulo 3) ⏳
* **Gestión de Cursos** (Módulo 5) ✅
* **Queue + Workers** (Módulo 4) 🔴 CRÍTICO (Semana 3)
* **Leaderboard** (Módulo 6) ⏳
* **Observabilidad (Logs + Métricas)** ⏳

---

## 📚 Documentación Completa

**Índice de documentos por rol:**

### 👨‍💼 Project Managers / Tech Leads
- **[EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md)** — Estado general, cambios realizados, roadmap completo (400+ líneas)
- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** — Análisis detallado por semana, estado de completitud, próximos pasos

### 👨‍💻 Backend Developers
- **[QUEUE_WORKERS_GUIDE.md](./QUEUE_WORKERS_GUIDE.md)** — 🔴 **CRÍTICO** — Implementación paso a paso de Queue + Workers con código listo para copiar (290+ líneas)
- **[PROJECT_CHECKLIST.md](./PROJECT_CHECKLIST.md)** — Checkboxes por tarea, validación final, debugging

### 👨‍💻 Frontend Developers
- **[ENDPOINTS.md](./ENDPOINTS.md)** — Especificación técnica completa de todos los endpoints con ejemplos (350+ líneas)
- **[BACKEND_READY.md](./BACKEND_READY.md)** — Quick start en español, credenciales, formato de respuestas

### 🔍 Auditors / QA
- **[INTEGRATION_REPORT.md](./INTEGRATION_REPORT.md)** — Reporte de cambios realizados, matriz de validación, inconsistencias resueltas
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** — Referencia rápida (30 segundos) para todos los roles

---

## 🎯 Estado Actual (Semana 2 Completada)

```
✅ Completado (Semana 1-2):
  • Docker Compose funcional (api, postgres, redis, 4 workers)
  • Modelos Prisma implementados
  • Autenticación JWT + Roles + Guards
  • CRUD Retos con test cases
  • DTOs alineados con frontend

🔴 CRÍTICO (Semana 3):
  • Queue + Workers (submissions se quedan encoladas sin esto)
  • Runners con límites de recursos
  → Guía: QUEUE_WORKERS_GUIDE.md

⏳ Próximas fases (Semana 4+):
  • Leaderboard
  • Evaluaciones
  • Observabilidad (logs + métricas)
  • Swagger automático
  • Kubernetes
```

---

## 🚀 Próximos Pasos (Semana 3 - CRÍTICO)

**Objetivo:** Queue + Workers funcionales

**Tareas:**
1. `npm install dockerode @types/dockerode`
2. Crear `src/infrastructure/queue/queue.module.ts`
3. Crear `src/infrastructure/runners/runner.service.ts` (Docker SDK)
4. Implementar `SubmissionProcessor` (consume jobs de Redis)
5. Actualizar `SubmitSolutionUseCase` para encolar submissions
6. Validar: POST /api/submissions → procesa completamente

**Documentación:** Ver [QUEUE_WORKERS_GUIDE.md](./QUEUE_WORKERS_GUIDE.md) — 290+ líneas con código listo para copiar/pegar

**Tiempo estimado:** 4-6 horas  
**Riesgo:** ALTO (bloquea feature principal)

---

## 📊 Cambios en Esta Sesión

- ✅ Auditoría completa del proyecto (backend + frontend)
- ✅ Alineación frontend-first — Backend reescrito para servir exactamente lo que frontend espera
- ✅ Normalización de lenguajes (acepta "Python" y enum PYTHON)
- ✅ Enriquecimiento con studentName en submissions
- ✅ Endpoints de Test Cases creados
- ✅ 5 documentos generados (1390+ líneas)
- ✅ Build limpio (TypeScript sin errores)

---

_Proyecto desarrollado por Carlos Avendaño, Vanessa Diaz y Oskleiderbeth Vasquez - 2025_

**Última actualización:** 29 de noviembre de 2025 — Sesión: Full Integration + Complete Planning