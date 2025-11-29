#!/bin/bash

# Codium Project Cleanup Script
# Este script detiene y limpia los servicios de docker-compose

set -e

echo "🛑 Deteniendo Codium Project..."
echo ""

# Detener los contenedores
echo "Deteniendo contenedores..."
docker-compose down

echo ""
echo "✅ Servicios detenidos"
echo ""
echo "⚠️  Para limpiar también los volúmenes de datos (PostgreSQL, Redis):"
echo "    docker-compose down -v"
echo ""
echo "⚠️  Para eliminar también las imágenes construidas:"
echo "    docker-compose down --rmi all"
echo ""
