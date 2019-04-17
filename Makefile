# Makefile
# 2018-2019 written by Benjamin Benno Falkner
# https://github.com/bennof/tabularrasa

SCSS     ?= tabularrasa.scss
CSS_MIN  ?= tabularrasa-min.css
TARGET   ?= style.css


all: deps build 

shell: $(SCSS)
	python3 -m http.server 8080 &
	sass --watch $(SCSS) $(TARGET)

build: $(TARGET) $(CSS_MIN)

deps: 

version:
	git tag

clean:
	rm -f *.css *.map

update: 
	git pull

upload:
	git commit -a
	git push origin master

help:
	@echo "Help:"
	@echo "TARGET: $(TARGET)"

$(TARGET): $(SCSS)
	sass -s compressed $< $@

$(CSS_MIN): $(SCSS)
	sass -s compressed $< $@

*.ico: *.svg 
	convert -density 384 $@ -define icon:auto-resize $<
