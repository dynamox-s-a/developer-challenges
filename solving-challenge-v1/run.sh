#!/bin/bash

echo "🏗️  Iniciando infraestrutura Dynamox..."
docker-compose down
docker-compose up -d --build db api

echo "🧐 Aguardando serviços e medindo latência..."


docker logs -f tester
docker-compose run --rm tester