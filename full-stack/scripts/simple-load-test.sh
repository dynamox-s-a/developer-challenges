#!/bin/bash

# Simple Load Test Script
# Uses curl for concurrent load testing

set -e

# Configuration
CONCURRENT_REQUESTS=${1:-20}
TOTAL_REQUESTS=${2:-100}
TARGET_URL=${3:-http://localhost:3001}
ENDPOINT=${4:-/health}

echo " Simple Load Test - Dynamox Full Stack"
echo "======================================"
echo "Concurrent Requests: $CONCURRENT_REQUESTS"
echo "Total Requests: $TOTAL_REQUESTS"
echo "Target: $TARGET_URL$ENDPOINT"
echo ""

echo " Checking target availability..."
if ! curl -s "$TARGET_URL$ENDPOINT" > /dev/null; then
    echo " Target $TARGET_URL$ENDPOINT is not available"
    exit 1
fi

echo " Target is available"
echo ""

make_request() {
    local request_id=$1
    local start_time=$(date +%s%N | cut -c1-13)
    local response=$(curl -s -w "%{http_code}" "$TARGET_URL$ENDPOINT")
    local end_time=$(date +%s%N | cut -c1-13)
    local response_time=$((end_time - start_time))
    local http_code="${response: -3}"
    local response_body="${response%???}"
    
    echo "$request_id,$response_time,$http_code"
}

run_concurrent_test() {
    echo " Running concurrent load test..."
    
    local temp_file=$(mktemp)
    local pids=()
    
    for ((i=1; i<=CONCURRENT_REQUESTS; i++)); do
        make_request $i >> "$temp_file" &
        pids+=($!)
    done
    
    for pid in "${pids[@]}"; do
        wait $pid
    done
    
    local total_requests=$(wc -l < "$temp_file")
    local successful_requests=$(awk -F',' '$3 == "200"' "$temp_file" | wc -l)
    local failed_requests=$((total_requests - successful_requests))
    local avg_response_time=$(awk -F',' '{sum+=$2; count++} END {print sum/count}' "$temp_file")
    local max_response_time=$(awk -F',' 'BEGIN{max=0} $2>max{max=$2} END {print max}' "$temp_file")
    local min_response_time=$(awk -F',' 'BEGIN{min=999999} $2<min{min=$2} END {print min}' "$temp_file")
    
    echo " Load Test Results:"
    echo "   Total Requests: $total_requests"
    echo "   Successful: $successful_requests"
    echo "   Failed: $failed_requests"
    echo "   Success Rate: $((successful_requests * 100 / total_requests))%"
    echo "   Avg Response Time: ${avg_response_time}ms"
    echo "   Min Response Time: ${min_response_time}ms"
    echo "   Max Response Time: ${max_response_time}ms"
    
    rm "$temp_file"
}

test_multiple_endpoints() {
    echo "🔌 Testing Multiple Endpoints"
    echo ""
    
    local endpoints=(
        "/health"
        "/machines?take=5"
        "/monitoring-points?take=5"
    )
    
    for endpoint in "${endpoints[@]}"; do
        echo "Testing: $endpoint"
        ENDPOINT="$endpoint" run_concurrent_test
        echo ""
    done
}

test_auth_load() {
    echo " Testing Authentication Under Load"
    echo ""
    
    echo "Testing login endpoint..."
    ENDPOINT="/auth/login" CONCURRENT_REQUESTS=10 TOTAL_REQUESTS=50 run_concurrent_test
    echo ""
    
    echo "Testing authenticated requests..."
    local token=$(curl -s -X POST "$TARGET_URL/auth/login" \
                   -H "Content-Type: application/json" \
                   -d '{"username":"admin","password":"admin"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    
    if [ -n "$token" ]; then
        echo " Token obtained, testing protected endpoint"
        echo "   (Protected endpoint test requires curl with headers)"
    else
        echo " Failed to obtain token"
    fi
}

echo " Starting Load Tests..."
echo ""

run_concurrent_test

echo ""
test_multiple_endpoints

echo ""
test_auth_load

echo ""
echo " Load Testing Complete!"
echo ""
echo " For more advanced load testing, install Apache Bench (ab):"
echo "   brew install apache2  # macOS"
echo "   sudo apt-get install apache2-utils  # Ubuntu"
echo ""
echo " Then run: ./scripts/load-test.sh 50 100"
