# Codium - Plataforma de Evaluación de Algoritmos

Plataforma backend tipo juez online (similar a HackerRank, LeetCode) construida con Clean Architecture.

## Características

- Autenticación JWT con roles (STUDENT, PROFESSOR, ADMIN)
- CRUD de retos algorítmicos
- Gestión de cursos
- Ejecución de código en contenedores aislados
- Soporte para Python, Java, Node.js y C++
- Procesamiento asíncrono con Redis y Bull
- Calificación automática con casos de prueba

## Tecnologías

- **Backend**: NestJS + TypeScript
- **Base de datos**: PostgreSQL
- **Cola de trabajos**: Redis + Bull
- **Contenedores**: Docker + Docker Compose
- **Arquitectura**: Clean Architecture

## Requisitos

- Docker >= 20.10
- Docker Compose >= 2.0
- Node.js >= 20 (solo para desarrollo local)

## Instalación y Ejecución

### Desarrollo

\`\`\`bash
# Clonar el repositorio
git clone <repo-url>
cd codium

# Copiar variables de entorno
cp .env.example .env

# Iniciar servicios
make dev

# Ver logs
make logs

# Ver logs solo del API
make logs-api
\`\`\`

La API estará disponible en: http://localhost:3000/api

Documentación Swagger: http://localhost:3000/docs

### Inicializar Base de Datos

\`\`\`bash
# Ejecutar migraciones
bash scripts/init-db.sh

# Sembrar datos de prueba
bash scripts/seed-db.sh
\`\`\`

Usuario de prueba:
- Email: admin@codium.com
- Password: admin123

### Escalar Workers

\`\`\`bash
# Escalar worker de Python a 3 instancias
make scale service=worker-python replicas=3

# Escalar todos los workers
make scale-all-workers
\`\`\`

## Estructura del Proyecto

\`\`\`
codium/
├── src/
│   ├── domain/              # Entidades y reglas de negocio
│   ├── application/         # Casos de uso
│   ├── infrastructure/      # Implementaciones (DB, Redis, etc)
│   └── presentation/        # Controllers, DTOs, Guards
├── workers/                 # Workers por lenguaje
│   ├── python-worker/
│   ├── java-worker/
│   ├── nodejs-worker/
│   └── cpp-worker/
├── docker-compose.yml
└── Dockerfile
\`\`\`

## API Endpoints

### Autenticación

- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión

### Retos

- `GET /api/challenges` - Listar retos
- `GET /api/challenges/:id` - Obtener reto
- `POST /api/challenges` - Crear reto (ADMIN/PROFESSOR)
- `PUT /api/challenges/:id` - Actualizar reto (ADMIN/PROFESSOR)
- `DELETE /api/challenges/:id` - Eliminar reto (ADMIN/PROFESSOR)
- `POST /api/challenges/:id/test-cases` - Agregar caso de prueba

### Submissions

- `POST /api/submissions` - Enviar solución
- `GET /api/submissions/:id` - Ver resultado
- `GET /api/submissions/user/:userId` - Submissions de un usuario

### Cursos

- `GET /api/courses` - Listar cursos
- `POST /api/courses` - Crear curso (PROFESSOR/ADMIN)
- `POST /api/courses/:id/enroll` - Inscribir estudiante

## Comandos Útiles

\`\`\`bash
# Detener servicios
make down

# Limpiar todo (volúmenes incluidos)
make clean

# Reconstruir imágenes
make build

# Reiniciar servicios
make restart

# Producción
make prod-up
\`\`\`

## Arquitectura Clean

El proyecto sigue los principios de Clean Architecture:

1. **Domain**: Entidades y reglas de negocio puras
2. **Application**: Casos de uso (lógica de aplicación)
3. **Infrastructure**: Implementaciones concretas (DB, Redis, etc)
4. **Presentation**: Controllers, DTOs, Guards

## Flujo de Submission

1. Estudiante envía código → API
2. API guarda submission (status: QUEUED)
3. API encola job en Redis
4. Worker toma el job
5. Worker lanza contenedor aislado (runner)
6. Runner ejecuta código con casos de prueba
7. Worker actualiza resultado en DB
8. Estudiante consulta resultado

## Desarrollo

\`\`\`bash
# Instalar dependencias
npm install

# Desarrollo local (sin Docker)
npm run start:dev

# Tests
npm run test

# Linting
npm run lint
\`\`\`

## Entrega Semana 2 (23 Octubre)

- [x] Diseño de modelos y capas
- [x] Implementar auth + CRUD retos
- [x] Montar Compose con api + db + redis
- [x] Workers stub con Redis

## Próximos Pasos (Semana 5)

- [ ] Implementar runners efímeros
- [ ] Guardar resultados + leaderboard
- [ ] Logs y métricas
- [ ] Bonus: Kubernetes

## Licencia

MIT
