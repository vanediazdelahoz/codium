#!/bin/bash

echo "Esperando a que PostgreSQL esté listo..."
until docker-compose exec -T postgres pg_isready -U codium; do
  sleep 1
done

echo "PostgreSQL está listo!"
echo "Ejecutando migraciones..."
docker-compose exec -T api npm run migration:run

echo "Base de datos inicializada correctamente!"
