/* Tabular Rasa JS PopUp
** Copyright (c) 2018-2019 Benjamin Benno Falkner
**
** Permission is hereby granted, free of charge, to any person obtaining a copy
** of this software and associated documentation files (the "Software"), to deal
** in the Software without restriction, including without limitation the rights
** to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
** copies of the Software, and to permit persons to whom the Software is
** furnished to do so, subject to the following conditions:
**
** The above copyright notice and this permission notice shall be included in all
** copies or substantial portions of the Software.
**
** THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
** IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
** FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
** AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
** LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
** OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
** SOFTWARE.
*/

/**
* Tabular Rasa
* @module tr/popup
*/

// create a popup
export function popup (Data,Time){
    var T = document.getElementById("popup_area");
    if (!T) {
        T = document.createElement('div');
        T.id = "popup_area";
        document.body.appendChild(T);
    }
    var pop = document.createElement('div');
    pop.className = "popup";
    if (Data instanceof Element || Data instanceof HTMLDocument)
      pop.appendChild(Data);
    else
      pop.innerHTML = Data;
    T.appendChild(pop);
    var f = function(){ T.removeChild(pop); };
    window.setTimeout(f,Time);
}

export function error(Header, Desc) {
    popup('<h1>'+Header+'</h1><p>'+Desc+'</p>', 5000);
}

export function warning(Header, Desc) {
    popup('<h1>'+Header+'</h1><p>'+Desc+'</p>', 5000);
}

export function info(Header, Desc) {
    popup('<h1>'+Header+'</h1><p>'+Desc+'</p>', 5000);
}

export function log(Header, Desc) {
    popup('<h1>'+Header+'</h1><p>'+Desc+'</p>', 5000);
}
