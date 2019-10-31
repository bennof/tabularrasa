/* Tabular Rasa JS Index
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
* @module tr
*/

// Styles (Bulma based)
import './index.scss';

// Javascript
import * as gui    from "./js/gui.js";
import * as url    from "./js/url.js";

// Ghost specific code
function presenter_mode(PREV,NEXT,TIMEOUT){
  var Query = url.query_map( document.location );
  if(Query.presenter){
    setTimeout(function(){
      if(Query.rewind) {
        if(PREV=="")
          window.location=NEXT+"?presenter";
        else
          window.location=PREV+"?rewind&presenter";
      } else {
        if(NEXT=="")
          window.location=PREV+"?rewind&presenter";
        else
          window.location=NEXT+"?presenter";
      }
    },TIMEOUT);
  }
}


//Exports
export {
  gui,
  url,
  presenter_mode
}
