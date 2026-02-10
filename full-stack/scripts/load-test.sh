#!/bin/bash

# Load Testing Script
# Performs load testing on the Dynamox Full Stack application

set -e

CONCURRENT_USERS=${1:-50}
REQUESTS_PER_USER=${2:-100}
TARGET_URL=${3:-http://localhost:3001}
OUTPUT_DIR="load-test-results"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo "Load Testing - Dynamox Full Stack"
echo "=================================="
echo "Concurrent Users: $CONCURRENT_USERS"
echo "Requests per User: $REQUESTS_PER_USER"
echo "Total Requests: $((CONCURRENT_USERS * REQUESTS_PER_USER))"
echo "Target URL: $TARGET_URL"
echo ""

mkdir -p "$OUTPUT_DIR"

echo " Checking target availability..."
if ! curl -s "$TARGET_URL/health" > /dev/null; then
    echo " Target $TARGET_URL is not available"
    echo " Make sure the application is running:"
    echo "   ./scripts/up.sh"
    exit 1
fi

echo " Target is available"
echo ""

run_load_test() {
    local endpoint=$1
    local method=${2:-GET}
    local data=${3:-""}
    local content_type=${4:-"application/json"}
    local test_name=$5
    
    echo " Testing: $test_name"
    echo "   Endpoint: $endpoint"
    echo "   Method: $method"
    echo "   Concurrent Users: $CONCURRENT_USERS"
    echo "   Requests per User: $REQUESTS_PER_USER"
    
    local output_file="$OUTPUT_DIR/${test_name}_${TIMESTAMP}.txt"
    
    if [ "$method" = "POST" ]; then
        ab -n $((CONCURRENT_USERS * REQUESTS_PER_USER)) -c $CONCURRENT_USERS \
           -T "$content_type" -p "$data" \
           "$TARGET_URL$endpoint" > "$output_file" 2>&1
    else
        ab -n $((CONCURRENT_USERS * REQUESTS_PER_USER)) -c $CONCURRENT_USERS \
           "$TARGET_URL$endpoint" > "$output_file" 2>&1
    fi
    
    local requests_per_second=$(grep "Requests per second" "$output_file" | awk '{print $4}')
    local time_per_request=$(grep "Time per request" "$output_file" | head -1 | awk '{print $4}')
    local failed_requests=$(grep "Failed requests" "$output_file" | awk '{print $3}')
    local connect_time=$(grep "Connect" "$output_file" | awk '{print $4}')
    
    echo "    RPS: $requests_per_second"
    echo "     Avg Response: ${time_per_request}ms"
    echo "    Failed: $failed_requests"
    echo "   Connect: ${connect_time}ms"
    echo "   Results: $output_file"
    echo ""
}

test_auth_endpoints() {
    echo " Testing Authentication Endpoints"

    local login_data='{"username":"admin","password":"admin"}'
    run_load_test "/auth/login" "POST" "$login_data" "application/json" "auth_login"
    
    local token=$(curl -s -X POST "$TARGET_URL/auth/login" \
                   -H "Content-Type: application/json" \
                   -d "$login_data" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    
    if [ -n "$token" ]; then
        echo "    Token obtained, testing protected endpoint"
        run_load_test "/machines?take=5" "GET" "" "application/json" "protected_machines"
    else
        echo "    Failed to obtain token"
    fi
}

test_api_endpoints() {
    echo "Testing API Endpoints"
    
    run_load_test "/health" "GET" "" "text/plain" "health_check"
    
    run_load_test "/machines?take=5" "GET" "" "application/json" "machines_list"
    
    run_load_test "/monitoring-points?take=5" "GET" "" "application/json" "monitoring_points_list"
    
    run_load_test "/monitoring-points/test/time-series?take=10" "GET" "" "application/json" "time_series_list"
}

test_prediction_endpoint() {
    echo "Testing Prediction Endpoint"
    
    local mp_id=$(curl -s "$TARGET_URL/monitoring-points?take=1" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    
    if [ -n "$mp_id" ]; then
        run_load_test "/monitoring-points/$mp_id/time-series/predict?periods=5" "GET" "" "application/json" "prediction"
    else
        echo "    Could not obtain monitoring point ID"
    fi
}

generate_summary() {
    echo " Generating Summary Report..."
    
    local summary_file="$OUTPUT_DIR/summary_${TIMESTAMP}.md"
    
    cat > "$summary_file" << EOF
# Load Test Summary Report

**Date:** $(date)
**Target:** $TARGET_URL
**Configuration:** $CONCURRENT_USERS concurrent users, $REQUESTS_PER_USER requests per user
**Total Requests:** $((CONCURRENT_USERS * REQUESTS_PER_USER))

## Test Results

EOF
    for file in "$OUTPUT_DIR"/*_${TIMESTAMP}.txt; do
        if [ -f "$file" ]; then
            local test_name=$(basename "$file" | sed "s/_${TIMESTAMP}.txt//")
            local rps=$(grep "Requests per second" "$file" | awk '{print $4}')
            local avg_time=$(grep "Time per request" "$file" | head -1 | awk '{print $4}')
            local failed=$(grep "Failed requests" "$file" | awk '{print $3}')
            local status=" PASS"
            
            if [ "$failed" -gt 0 ]; then
                status=" FAIL"
            fi
            
            echo "### $test_name" >> "$summary_file"
            echo "- **Status:** $status" >> "$summary_file"
            echo "- **RPS:** $rps" >> "$summary_file"
            echo "- **Avg Response:** ${avg_time}ms" >> "$summary_file"
            echo "- **Failed Requests:** $failed" >> "$summary_file"
            echo "" >> "$summary_file"
        fi
    done
    
    echo "Summary report generated: $summary_file"
}

echo " Starting Load Tests..."
echo ""

test_api_endpoints
test_auth_endpoints
test_prediction_endpoint

generate_summary

echo " Load Testing Complete!"
echo ""
echo " Results saved to: $OUTPUT_DIR/"
echo " Summary report: $OUTPUT_DIR/summary_${TIMESTAMP}.md"
echo ""
echo " Performance Metrics:"
echo "   • Total requests processed: $((CONCURRENT_USERS * REQUESTS_PER_USER))"
echo "   • Concurrent users simulated: $CONCURRENT_USERS"
echo "   • Endpoints tested: $(ls -1 "$OUTPUT_DIR"/*_${TIMESTAMP}.txt | wc -l)"
echo ""
echo " To view detailed results:"
echo "   cat $OUTPUT_DIR/summary_${TIMESTAMP}.md"
