/* Tabular Rasa JS Page Ready
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

var ReadyFired = false;
var ReadyList = [];
var ReadyEventHandlersInstalled = false;

export function on(cb,ctx){
  if ( typeof callback !== "function" ) {
    throw new TypeError("callback for Ready(fn) must be a function");
  }

  if ( ReadyFired ) { // execute function
    setTimeout(function() {cb(ctx);}, 1);
    return;
  } else { // schedule for document ready
    ReadyList.push({func: cb, ctx: ctx});
  }

  if( document.readyState === "complete" ){
    setTimeout(ready_run,1);
  }
  else if ( !ReadyEventHandlersInstalled ) { // add handler if missing
    if ( document.addEventListener ) {
      document.addEventListener("DOMContentLoaded", ready_run, false);
      window.addEventListener("load", ready_run, false);
    } else {
      document.attachEvent("onreadystatechange", readyStateChange);
      window.attachEvent("onload", ready_run);
    }
    ReadyEventHandlersInstalled = true;
  }
};

function readyStateChange() {
  if ( document.readyState === "complete" ) {
    ready_run();
  }
};

function ready_run () {
  if (!ReadyFired) {
    ReadyFired = true;

    // loop list
    for (var i = 0; i < ReadyList.length; i++) {
      ReadyList[i].func.call(window, ReadyList[i].ctx); //execute
    }
    ReadyList = []; // clear
  }
};
