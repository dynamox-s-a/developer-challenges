#!/usr/bin/env bash
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE} Smoke Test - Dynamox Full Stack${NC}"
echo

echo -e "${YELLOW}  Testing backend health...${NC}"
if curl -s http://localhost:3001/health | python3 -m json.tool; then
    echo -e "${GREEN} Backend health check OK${NC}"
else
    echo -e "${RED} Backend health check FAILED${NC}"
    exit 1
fi
echo

echo -e "${YELLOW}  Testing authentication...${NC}"
TOKEN="$(./scripts/get-token.sh)"
if [ -n "$TOKEN" ]; then
    echo -e "${GREEN} Authentication OK${NC}"
else
    echo -e "${RED} Authentication FAILED${NC}"
    exit 1
fi
echo

echo -e "${YELLOW}  Testing monitoring points API...${NC}"
if curl -s "http://localhost:3001/monitoring-points?take=5&skip=0&sortBy=machineName&sortOrder=asc" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool; then
    echo -e "${GREEN} API monitoring points OK${NC}"
else
    echo -e "${RED} API monitoring points FAILED${NC}"
    exit 1
fi
echo

echo -e "${YELLOW}  Testing frontend...${NC}"
if curl -s http://localhost:5173 | grep -q "html"; then
    echo -e "${GREEN} Frontend OK${NC}"
else
    echo -e "${RED} Frontend FAILED${NC}"
    exit 1
fi
echo

echo -e "${YELLOW}  Running E2E tests...${NC}"
if ./scripts/test-e2e.sh run; then
    echo -e "${GREEN} E2E tests OK${NC}"
else
    echo -e "${RED} E2E tests FAILED${NC}"
    exit 1
fi
echo

echo -e "${GREEN} All tests passed! System is working correctly.${NC}"
