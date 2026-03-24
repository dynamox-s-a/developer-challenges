#!/bin/bash

# Load Balancer Startup Script
# Starts the application with nginx load balancer

set -e

echo " Starting Dynamox Full Stack with Load Balancer..."

if [ ! -f "docker-compose.load-balancer.yml" ]; then
    echo " docker-compose.load-balancer.yml not found"
    exit 1
fi

if [ ! -f "nginx.conf" ]; then
    echo " nginx.conf not found"
    exit 1
fi

echo " Stopping existing containers..."
docker-compose -f docker-compose.yml down 2>/dev/null || true
docker-compose -f docker-compose.load-balancer.yml down 2>/dev/null || true

echo "  Starting containers with load balancer..."
docker-compose -f docker-compose.load-balancer.yml up -d --build

echo "⏳ Waiting for services to be ready..."
sleep 10

echo " Checking load balancer health..."
if curl -s http://localhost:8080/health > /dev/null; then
    echo " Load balancer is healthy"
else
    echo " Load balancer health check failed"
    docker-compose -f docker-compose.load-balancer.yml logs nginx
    exit 1
fi

echo " Checking backend servers health..."
if curl -s http://localhost:8080/backend-health > /dev/null; then
    echo " Backend servers are healthy"
else
    echo " Backend servers health check failed"
    docker-compose -f docker-compose.load-balancer.yml logs
    exit 1
fi

echo ""
echo " Load Balancer Setup Complete!"
echo ""
echo " Services:"
echo "   • Load Balancer: http://localhost:8080"
echo "   • Backend API: http://localhost:8080 (proxied)"
echo "   • Health Check: http://localhost:8080/health"
echo "   • Backend Health: http://localhost:8080/backend-health"
echo ""
echo " Load Balancing:"
echo "   • Algorithm: Round Robin"
echo "   • Backend Instances: 2"
echo "   • Health Checks: Enabled"
echo "   • Failover: Automatic"
echo ""
echo " To test load balancing:"
echo "   for i in {1..10}; do curl http://localhost:8080/health; done"
echo ""
echo " To stop:"
echo "   docker-compose -f docker-compose.load-balancer.yml down"
