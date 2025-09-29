#!/bin/bash
echo "🚀 Configurando entorno de desarrollo CAPRISOFT..."

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado"
    exit 1
fi

# Levantar base de datos
echo "Iniciando base de datos..."
docker-compose up -d database

echo "Esperando que la base de datos esté lista..."
sleep 15

echo "✅ Configuración completada!"
echo "Para desarrollar:"
echo "  Backend: cd backend && ./mvnw spring-boot:run"
echo "  Full stack: docker-compose up"
