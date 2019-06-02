NPM_DEPS += express dotenv sass uglify-js


define server.js.src
require('dotenv').config(); // read .env files\n\
const express = require('express');\n\
const fs = require('fs');\n\
const sass = require('sass');\n\
\n\
const uglify = require('uglify-js');\n\
\n\
\n\
const app = express();\n\
const port = process.env.PORT || 8080;\n\
\n\
\n\
// sass\n\
var regscss=/.*\.scss$$/ig\n\
function proc_scss(Filen) {\n\
    console.log(\`SCSS: \$${Filen}\`);\n\
    try {\n\
        var res = sass.renderSync({\n\
            file: 'src/scss/main.scss',\n\
            outFile: 'public/css/style.min.css',\n\
            sourceMap: true,\n\
            outputStyle: 'compressed'\n\
        });\n\
        fs.writeFileSync('public/css/style.min.css', res.css);\n\
        console.log('.. public/css/style.min.css written.');\n\
        fs.writeFileSync('public/css/style.min.css.map', res.css);\n\
        console.log('.. public/css/style.min.css.map written.');\n\
    } catch (err) {\n\
        console.log(\`ERROR SCSS: \$${err} (\$${Filen})\`);\n\
    }\n\
}\n\
\n\
proc_scss('src/scss/main.scss');\n\
fs.watch('src/scss',(EventType, Filen) => {\n\
    if( Filen.match(regscss)) {\n\
        proc_sass(Filen);\n\
    }\n\
});\n\
\n\
// js\n\
function proc_js(Filen) {\n\
    console.log(\`JS: \$${Filen}\`);\n\
    try {\n\
        var Filen2 = Filen.substring(Filen.lastIndexOf('/') + 1).replace(/\.[^/.]+$$/, '.min.js');\n\
        var src = fs.readFileSync(Filen);\n\
        var res = uglify.minify(src,{\n\
            sourceMap: {\n\
                filename: Filen,\n\
                url: Filen2+'.map'\n\
            },\n\
            toplevel: false,\n\
            ie8: false,\n\
            warnings: true,\n\
        });\n\
        fs.writeFileSync('public/js/'+Filen2, res.code);\n\
        console.log(\`.. public/js/\$${Filen2} written.\`);\n\
        fs.writeFileSync('public/js/'+Filen2+'.map', res.code);\n\
        console.log(\`.. public/js/\$${Filen2}.map written.\`);\n\
    } catch (err) {\n\
        console.log(\`ERROR JS: \$${err} (\$${Filen})\`);\n\
    }\n\
}\n\
\n\
fs.readdir('src/js',(err,Filen) => {\n\
    if(err) {\n\
        console.log(\`ERROR JS: \$${Filen}\`);\n\
    } else {\n\
        proc_js('src/js/'+Filen);\n\
    }\n\
});\n\
fs.watch('src/js/',(EventType, Filen) => {\n\
    proc_js(Filen);\n\
});\n\
\n\
\n\
// Set public folder as root\n\
app.use(express.static('public'));\n\
\n\
// Allow front-end access to node_modules folder\n\
// app.use('/scripts', express.static());\n\
\n\
// Listen for HTTP requests on port 3000\n\
app.listen(port, () => {\n\
  console.log(\`listening on \$${port}\`);\n\
});
endef

define app.js.src
endef

define main.scss.src
endef

define index.html.src
<!DOCTYPE html>\n\
<html lang="en">\n\
<head>\n\
  <meta charset="UTF-8">\n\
  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n\
  <meta http-equiv="X-UA-Compatible" content="ie=edge">\n\
  <link rel="stylesheet" href="css/style.min.css">\n\
  <title>SPA Template</title>\n\
</head>\n\
<body>\n\
  <!-- App Content -->\n\
\n\
  <!-- JS Dependencies -->\n\
  <script src="js/app.min.js"></script>\n\
</body>\n\
</html>
endef



-PHONY: run
run: 
	npm start

clean: 



init: README.md server.js src/js/app.js src/scss/main.scss public/index.html .gitignore LICENSE 
	mkdir -p node_modules lib
	mkdir -p public/css public/js
	touch .env
	npm init -y
	npm install $(NPM_DEPS)

LICENSE:
	@echo "LICENSE" > LICENSE

README.md:
	@echo "# Single Page Application" > README.md
	@echo "" >>  README.md
	@echo "Vanilla JS SPA" >>  README.md

server.js:
	@echo "${server.js.src}" > server.js

src/js/app.js:
	mkdir -p src/js
	@echo '${app.js.src}' > src/js/app.js

src/scss/main.scss:
	mkdir -p src/scss
	@echo '${main.scss.src}' > src/scss/main.scss

public/index.html:
	mkdir -p public
	@echo '$(index.html.src)' > public/index.html

.gitignore:
	@echo "node_modules" > .gitignore
	@echo ".env" >> .gitignore


