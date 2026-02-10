#!/bin/bash

# E2E Test Script
# Use: ./scripts/test-e2e.sh [run|open]

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

MODE=${1:-run}

echo -e "${BLUE}E2E Tests - Dynamox Full Stack${NC}"
echo

if [ ! -f "package.json" ] || [ ! -d "apps" ]; then
    echo -e "${RED}Run this script from the project root${NC}"
    exit 1
fi

echo -e "${YELLOW}Checking dependencies...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js not found${NC}"
    exit 1
fi

if ! command -v npx &> /dev/null; then
    echo -e "${RED}npx not found${NC}"
    exit 1
fi

if [ ! -d "node_modules/cypress" ]; then
    echo -e "${YELLOW}Installing Cypress...${NC}"
    npx cypress install
fi

echo -e "${YELLOW}Checking services...${NC}"

if ! curl -s http://localhost:3001/health &>/dev/null; then
    echo -e "${RED}Backend is not running at http://localhost:3001${NC}"
    echo -e "${YELLOW}Start with: ./scripts/up.sh${NC}"
    exit 1
fi
echo -e "${GREEN}Backend running${NC}"

if ! curl -s http://localhost:5173 &>/dev/null; then
    echo -e "${RED}Frontend is not running at http://localhost:5173${NC}"
    echo -e "${YELLOW}Start with: ./scripts/up.sh${NC}"
    exit 1
fi
echo -e "${GREEN}Frontend running${NC}"

echo
echo -e "${BLUE}Starting E2E tests...${NC}"

case $MODE in
    "run")
        echo -e "${YELLOW}Mode: Headless (CI/CD)${NC}"
        pnpm --filter frontend exec cypress run --e2e --config-file cypress.config.ts --browser electron
        ;;
    "open")
        echo -e "${YELLOW}Mode: Interactive${NC}"
        pnpm --filter frontend exec cypress open --e2e --config-file cypress.config.ts --browser electron
        ;;
    *)
        echo -e "${RED}Invalid mode: $MODE${NC}"
        echo -e "${YELLOW}Usage: $0 [run|open]${NC}"
        exit 1
        ;;
esac

echo
echo -e "${GREEN}E2E tests completed!${NC}"
echo
echo -e "${BLUE}Available reports:${NC}"
echo "   • Screenshots: apps/frontend/cypress/screenshots/"
echo "   • Videos: apps/frontend/cypress/videos/"
echo "   • Reports: apps/frontend/cypress/reports/"
