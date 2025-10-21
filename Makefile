.PHONY: help dev up down logs clean build restart scale

help:
	@echo "Comandos disponibles:"
	@echo "  make dev        - Iniciar en modo desarrollo"
	@echo "  make up         - Iniciar todos los servicios"
	@echo "  make down       - Detener todos los servicios"
	@echo "  make logs       - Ver logs de todos los servicios"
	@echo "  make clean      - Limpiar volúmenes y contenedores"
	@echo "  make build      - Reconstruir imágenes"
	@echo "  make restart    - Reiniciar servicios"
	@echo "  make scale      - Escalar workers (ej: make scale service=worker-python replicas=3)"

dev:
	docker-compose up -d

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

logs-api:
	docker-compose logs -f api

logs-workers:
	docker-compose logs -f worker-python worker-java worker-nodejs worker-cpp

clean:
	docker-compose down -v
	docker system prune -f

build:
	docker-compose build --no-cache

rebuild:
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d

restart:
	docker-compose restart

scale:
	docker-compose up -d --scale $(service)=$(replicas)

# Ejemplos de escalado
scale-python:
	docker-compose up -d --scale worker-python=3

scale-java:
	docker-compose up -d --scale worker-java=2

scale-all-workers:
	docker-compose up -d --scale worker-python=2 --scale worker-java=2 --scale worker-nodejs=2 --scale worker-cpp=2

# Base de datos
db-migrate:
	docker-compose exec api npm run migration:run

db-seed:
	docker-compose exec api npm run seed

# Producción
prod-up:
	docker-compose -f docker-compose.prod.yml up -d

prod-down:
	docker-compose -f docker-compose.prod.yml down

prod-logs:
	docker-compose -f docker-compose.prod.yml logs -f
