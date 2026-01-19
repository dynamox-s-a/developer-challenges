# Makefile definitions

SRC = src
ECHO = @echo -e "\n---|"

APP_DIR = frontend
SERVER_DIR = backend

# Commands

default:
	$(ECHO) "Please, use the targets run_server and run_app"

app: build_app run_app

server: build_server run_server

run_server: 
	$(ECHO) "Running server"
	cd $(SERVER_DIR) && \
	npm run start

run_app:
	$(ECHO) "Running app"
	cd $(APP_DIR) && \
	npm run start

build_server:
	$(ECHO) "Building server"
	cd $(SERVER_DIR) && \
	npm ci && \
	npx drizzle-kit generate && \
	npx drizzle-kit migrate && \
	npm run build

build_app:
	$(ECHO) "Building application"
	cd $(APP_DIR) && \
	npm ci && \
	npm run build

clean: clean_server clean_app
	$(ECHO) "Removing build files"

clean_server:
	$(ECHO) "Removing server files"
	cd $(SERVER_DIR) && \
	rm -rf dist

clean_app:
	$(ECHO) "Removing application files"
	cd $(APP_DIR) && \
	rm -rf .next && \
	rm -rf node_modules

