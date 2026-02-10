#!/bin/bash

# Load Balancer Test Script
# Tests the load balancer functionality

set -e

echo " Testing Load Balancer..."

if ! curl -s http://localhost:8080/health > /dev/null; then
    echo " Load balancer is not running. Start it first with:"
    echo "   ./scripts/load-balancer-up.sh"
    exit 1
fi

echo ""
echo " Load Balancer Health Check:"
curl -s http://localhost:8080/health || echo " Failed"

echo ""
echo " Backend Health Check:"
curl -s http://localhost:8080/backend-health || echo " Failed"

echo ""
echo "  Testing Load Distribution (10 requests):"
echo "Request #Server"
for i in {1..10}; do
    response=$(curl -s http://localhost:8080/health)
    server=$(echo "$response" | grep -o '"server":"[^"]*"' | cut -d'"' -f4 2>/dev/null || echo "unknown")
    echo "  $i        $server"
    sleep 0.1
done

echo ""
echo " Testing Failover:"
echo "Stopping backend-1..."
docker-compose -f docker-compose.load-balancer.yml stop backend-1

echo "Making request during failover..."
response=$(curl -s http://localhost:8080/health)
server=$(echo "$response" | grep -o '"server":"[^"]*"' | cut -d'"' -f4 2>/dev/null || echo "unknown")
echo "  Response from: $server"

echo ""
echo "Restarting backend-1..."
docker-compose -f docker-compose.load-balancer.yml start backend-1
sleep 5

echo ""
echo " Load Balancer Test Complete!"
echo ""
echo " Load Balancer Features:"
echo "   • Round Robin distribution"
echo "   • Health checks enabled"
echo "   • Automatic failover"
echo "   • Multiple backend instances"
echo ""
echo " Access URLs:"
echo "   • Load Balancer: http://localhost:8080"
echo "   • API: http://localhost:8080/api"
echo "   • Health: http://localhost:8080/health"
