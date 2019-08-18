require('dotenv').config(); // read .env files
const express = require('express');
const fs = require('fs');
const sass = require('sass');

const uglify = require('uglify-js');


const app = express();
const port = process.env.PORT || 8080;
const scss_input = process.env.SCSS_INPUT || 'src/scss/main.scss';
const scss_output = process.env.SCSS_OUTPUT || 'public/css/style.min.css';

const js_min_ext = process.env.JS_MIN_EXT || '_min.js';

// sass
var regscss=/.*\.scss$/ig
function proc_scss(Filen) {
console.log(`SCSS: ${Filen}`);
try {
var res = sass.renderSync({
file: scss_input,
outFile: scss_output,
sourceMap: true,
outputStyle: 'compressed'
});
fs.writeFileSync(scss_output, res.css);
console.log('.. '+scss_output+' written.');
fs.writeFileSync(scss_output+'.map', res.css);
console.log('.. '+scss_output+'.map written.');
} catch (err) {
console.log(`ERROR SCSS: ${err} (${Filen})`);
}
}

proc_scss(scss_input);
fs.watch('src/scss',(EventType, Filen) => {
if( Filen.match(regscss)) {
proc_sass(Filen);
}
});

// js
function proc_js(Filen) {
console.log(`JS: ${Filen}`);
try {
var Filen2 = Filen.substring(Filen.lastIndexOf('/') + 1).replace(/\.[^/.]+$/, js_min_ext);
var src = fs.readFileSync(Filen);
var res = uglify.minify(src.toString('utf8'),{
sourceMap: {
filename: Filen,
url: Filen2+'.map'
},
toplevel: false,
ie8: false,
warnings: true,
});
if(res.error) {
    console.log('ERROR: '+res.error);
}
fs.writeFileSync('public/js/'+Filen2, res.code);
console.log(`.. public/js/${Filen2} written.`);
fs.writeFileSync('public/js/'+Filen2+'.map', res.code);
console.log(`.. public/js/${Filen2}.map written.`);
} catch (err) {
console.log(`ERROR JS: ${err} (${Filen})`);
}
}

fs.readdir('src/js',(err,Filen) => {
if(err) {
console.log(`ERROR JS: ${Filen}`);
} else {
    var i;
    for (i=0;i<Filen.length;i++)
       proc_js('src/js/'+Filen[i]);
}
});
fs.watch('src/js/',(EventType, Filen) => {
proc_js('src/js/'+Filen);
});

 
 // Set public folder as root
 app.use(express.static('public'));
 
 // Allow front-end access to node_modules folder
 // app.use('/scripts', express.static());
 
 // Listen for HTTP requests on port 3000
 app.listen(port, () => {
 console.log(`listening on ${port}`);
 });
