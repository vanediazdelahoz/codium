#!/bin/bash

# Codium Project Startup Script
# Este script ejecuta docker-compose y proporciona información útil

set -e

echo "🚀 Iniciando Codium Project..."
echo ""

# Verificar que docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado"
    exit 1
fi

# Verificar que docker-compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado"
    exit 1
fi

# Crear el archivo .env si no existe
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env..."
    cat > .env << 'EOF'
DATABASE_URL="postgresql://codium:codium_password@postgres:5432/codium_db"
REDIS_HOST="redis"
REDIS_PORT=6379
JWT_SECRET="codium-jwt-secret-key-change-in-production"
DOCKER_RUNTIME="runc"
EOF
    echo "✅ Archivo .env creado"
fi

echo ""
echo "🐳 Ejecutando docker-compose up --build -d..."
docker-compose up --build -d

echo ""
echo "⏳ Esperando que los servicios estén listos..."
sleep 5

echo ""
echo "✅ Todos los servicios están corriendo!"
echo ""
echo "📊 Estado de los contenedores:"
docker-compose ps
echo ""
echo "🌐 Accesos disponibles:"
echo "   Frontend:        http://localhost:3001"
echo "   API Docs:        http://localhost:3000/api/docs"
echo "   PostgreSQL:      localhost:5432"
echo "   Redis:           localhost:6379"
echo ""
echo "📝 Para ver logs:"
echo "   General:         docker-compose logs -f"
echo "   API:             docker-compose logs -f api"
echo "   Frontend:        docker-compose logs -f frontend"
echo "   Workers:         docker-compose logs -f worker-python"
echo ""
echo "🛑 Para detener todos los servicios:"
echo "   docker-compose down"
echo ""
