TARGET ?= "./style.css"




all: deps build 

repl: main.scss
	sass --watch main.scss $(TARGET)

build: $(TARGET)

deps: 


help:
	@echo "Help:"
	@echo "TARGET: $(TARGET)"


$(TARGET): main.scss
	sass -s compressed $< $@