# Tabular Rasa Makefile

all: build

clean:
	npm clean

clean-all:
	npm run clean-all

build: deps
	npm run build

dev: deps
	npm run dev

deps:
	npm install
