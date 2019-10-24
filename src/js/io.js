/* Tabular Rasa JS IO
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
* @module tr/io
*/



/*eslint no-unused-vars: ["error", { "args": "none" }]*/



/**
* read a file
* @param {Function} Fun Callback function (State,Data)
* @param {File} Filen a file object
* @param {String} Type optional datatype
*/
export function read(Fun,Filen,Type){
  var Reader = new FileReader();
  Reader.cb = Fun;
  Reader.onload = function(Event) {
      this.cb(200,Event.target.result);
  };
  Reader.onerror = function(Event) {
      this.cb(404,Event.target.error.code);
  };
  if(Type == "DataURL")
    Reader.readAsDataURL(Filen);
  else
    Reader.readAsText(Filen);
}

/**
* save file as download
* @param Filen Filename
* @param Mime  Mimetype
* @param Data  data string or blob
**/
export function save(Filen, Mime, Data) { // Mime text/csv;charset=utf-8
  var FileLink = document.createElement('a');
  if (Mime.startsWith('text'))
    FileLink.setAttribute('href', 'data:'+Mime+',' + encodeURIComponent(Data));
  else
    FileLink.setAttribute('href', 'data:'+Mime+',' + btoa(Data));
  FileLink.setAttribute('download', Filen);

  if (document.createEvent) {
    var Event = document.createEvent('MouseEvents');
      Event.initEvent('click', true, true);
      FileLink.dispatchEvent(Event);
    } else {
      FileLink.click();
    }
}
