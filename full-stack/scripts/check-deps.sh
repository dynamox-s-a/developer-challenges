#!/bin/bash

# Script to check and install project dependencies
# Usage: ./scripts/check-deps.sh

set -e

echo " Checking project dependencies..."
echo

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

check_dependency() {
    local cmd=$1
    local name=$2
    local install_cmd=$3
    local version_param=$4
    local min_version=$5
    
    echo -n "Checking $name... "
    
    if command -v "$cmd" &> /dev/null; then
        if [ -n "$version_param" ]; then
            version=$($cmd $version_param 2>/dev/null || echo "unknown")
            echo -e "${GREEN} Installed ($version)${NC}"
            
            if [ -n "$min_version" ]; then
                echo "    Minimum recommended version: $min_version"
            fi
        else
            echo -e "${GREEN} Installed${NC}"
        fi
        return 0
    else
        echo -e "${RED} Not found${NC}"
        echo "    To install: $install_cmd"
        return 1
    fi
}

install_dependency() {
    local cmd=$1
    local name=$2
    local install_cmd=$3
    
    echo
    read -p " Do you want to install $name now? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo " Installing $name..."
        if eval "$install_cmd"; then
            echo -e "${GREEN} $name installed successfully!${NC}"
        else
            echo -e "${RED} Failed to install $name${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}  $name not installed. The project may not work correctly.${NC}"
    fi
}

detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "Linux detected"
        OS="linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macOS detected"
        OS="macos"
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        echo "Windows detected"
        OS="windows"
    else
        echo "Unrecognized operating system: $OSTYPE"
        OS="unknown"
    fi
}

# Installation based on OS
get_install_command() {
    local name=$1
    local os=$2
    
    case $name in
        "node")
            case $os in
                "macos") echo "brew install node" ;;
                "linux") echo "curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs" ;;
                "windows") echo "choco install nodejs" ;;
                *) echo "Visit https://nodejs.org" ;;
            esac
            ;;
        "pnpm")
            echo "npm install -g pnpm" ;;
        "docker")
            case $os in
                "macos") echo "brew install --cask docker" ;;
                "linux") echo "sudo apt-get install -y docker.io docker-compose-plugin" ;;
                "windows") echo "choco install docker-desktop" ;;
                *) echo "Visit https://docker.com" ;;
            esac
            ;;
        "git")
            case $os in
                "macos") echo "brew install git" ;;
                "linux") echo "sudo apt-get install -y git" ;;
                "windows") echo "choco install git" ;;
                *) echo "Visit https://git-scm.com" ;;
            esac
            ;;
        *)
            echo "Installation command not available for $name"
            ;;
    esac
}

# Check Docker Desktop (macOS/Windows)
check_docker_desktop() {
    if [[ "$OS" == "macos" ]]; then
        if pgrep -f "Docker Desktop" > /dev/null; then
            echo -e "${GREEN} Docker Desktop is running${NC}"
            return 0
        else
            echo -e "${YELLOW}  Docker Desktop is not running${NC}"
            echo "    Start Docker Desktop manually"
            return 1
        fi
    elif [[ "$OS" == "linux" ]]; then
        if systemctl is-active --quiet docker; then
            echo -e "${GREEN} Docker service is running${NC}"
            return 0
        else
            echo -e "${YELLOW}  Docker service is not running${NC}"
            echo "    Run: sudo systemctl start docker"
            return 1
        fi
    fi
}

main() {
    detect_os
    echo
    
    declare -a dependencies=(
        "node:Node.js:node --version:18.0.0"
        "pnpm:pnpm:pnpm --version:8.0.0"
        "docker:Docker:docker --version:20.0.0"
        "git:Git:git --version:2.0.0"
    )
    
    local missing_deps=()
    
    for dep in "${dependencies[@]}"; do
        IFS=':' read -r cmd name version_param min_version <<< "$dep"
        
        if ! check_dependency "$cmd" "$name" "" "$version_param" "$min_version"; then
            missing_deps+=("$name:$cmd")
        fi
    done
    
    echo
    check_docker_desktop || missing_deps+=("docker-desktop")
    
    if [ ${#missing_deps[@]} -gt 0 ]; then
        echo
        echo -e "${YELLOW} Missing dependencies:${NC}"
        for dep in "${missing_deps[@]}"; do
            IFS=':' read -r name cmd <<< "$dep"
            install_cmd=$(get_install_command "$cmd" "$OS")
            echo "   • $name: $install_cmd"
        done
        
        echo
        read -p " Do you want to install the missing dependencies now? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            for dep in "${missing_deps[@]}"; do
                IFS=':' read -r name cmd <<< "$dep"
                install_cmd=$(get_install_command "$cmd" "$OS")
                install_dependency "$cmd" "$name" "$install_cmd"
                echo
            done
        fi
    fi
    
    echo
    echo " Final verification:"
    
    if command -v node &> /dev/null; then
        node_version=$(node --version)
        echo -e "   Node.js: ${GREEN}$node_version${NC}"
    else
        echo -e "   Node.js: ${RED}Not installed${NC}"
    fi
    
    if command -v pnpm &> /dev/null; then
        pnpm_version=$(pnpm --version)
        echo -e "   pnpm: ${GREEN}$pnpm_version${NC}"
    else
        echo -e "   pnpm: ${RED}Not installed${NC}"
    fi
    
    if command -v docker &> /dev/null; then
        docker_version=$(docker --version)
        echo -e "   Docker: ${GREEN}$docker_version${NC}"
    else
        echo -e "   Docker: ${RED}Not installed${NC}"
    fi
    
    if command -v docker-compose &> /dev/null || docker compose version &> /dev/null; then
        echo -e "   Docker Compose: ${GREEN}Installed${NC}"
    else
        echo -e "   Docker Compose: ${RED}Not installed${NC}"
    fi
    
    echo
    echo -e "${BLUE}📚 Complete documentation:${NC}"
    echo "   • Dependencies: docs/dependencies.md"
    echo "   • Docker: docs/docker-containers.md"
    echo "   • Database: docs/database.md"
    echo "   • Features: docs/features.md"
    
    echo
    if [ ${#missing_deps[@]} -eq 0 ]; then
        echo -e "${GREEN} All dependencies are installed!${NC}"
        echo "    You can run: ./scripts/up.sh"
    else
        echo -e "${YELLOW}  Some dependencies are missing.${NC}"
        echo "    Install the dependencies before running the project."
    fi
}

main "$@"
