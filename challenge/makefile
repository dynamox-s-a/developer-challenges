# Makefile definitions

SRC = src
ECHO = @echo -e "\n---|"

# Commands

run: run_server run_app

run_server: build_server
	$(ECHO) "Running server"

run_app: build_app
	$(ECHO) "Running app"
	npm run start

build_server:
	$(ECHO) "Building server"

build_app:
	$(ECHO) "Building application"
	npm ci
	npm run build

clean: clean_server clean_app
	$(ECHO) "Removing common files"
	rm -rf .next
	rm -rf node_modules

clean_server:
	$(ECHO) "Removing server files"

clean_app:
	$(ECHO) "Removing application files"

