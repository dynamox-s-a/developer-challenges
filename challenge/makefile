# Makefile definitions

SRC = src
JS_PAC_MANAGER = npm
ECHO = @echo -e "\n---|"

# Commands

run: run_server run_app

run_server: build_server
	$(ECHO) "Running server"

run_app: build_app
	$(ECHO) "Running app"

build_server:
	$(ECHO) "Building server files"
	touch server.file

build_app:
	$(ECHO) "Building application files"
	touch app.file

clean: clean_server clean_app

clean_server:
	$(ECHO) "Uninstalling server"
	rm -f server.file

clean_app:
	$(ECHO) "Uninstalling application"
	rm -f app.file
