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
import {popup} from "./popup.js";

export function open(Filen,Mime,Cb,Type) {
  if(Filen == null) { // create dialog
    var FileInput = document.createElement('input');
    FileInput.setAttribute('type','file');
    FileInput.setAttribute('id','testfile');
    if ( Mime )
      FileInput.setAttribute('accept',Mime);
    FileInput.addEventListener('change', function(){
      open(this.input.files,this.mime,this.cb);
    }.bind({input: FileInput, mime: Mime, cb: Cb}), false);

    // if (document.createEvent) {
    //   console.log("create event");
    //   var Event = document.createEvent('MouseEvents');
    //   Event.initEvent('click', true, true);
    //   FileInput.click();//dispatchEvent(Event);
    // } else {
    //   FileInput.click();
    // }
    popup(FileInput,10000);
    return;
  }


  // Read files
  if(Filen.length) {
    files_read(Filen,0,Mime,[],Cb);
  } else {
    var Reader = new FileReader();
    Reader.onload = function(){
      Cb(200,Reader.result);
    };
    Reader.onerror = function(){
      Cb(404,Reader.error);
    };
    if(Type == "DataURL")
      Reader.readAsDataURL(Filen);
    else
      Reader.readAsText(Filen);
  }
}

function files_read(Files,i,Mime,Res,Cb,Type){
  // if done
  if (Files.length <= i) {
    Cb(200,Res);
    return;
  }

  var F = Files[i], Reader = new FileReader();
  Reader.onload = function(){
    this.res.push({src: F.name, data: Reader.result});
    files_read(this.files,this.i+1,this.mime,this.res,this.cb,this.Type)
  }.bind({files: Files, i:i, mime: Mime, res: Res, cb: Cb, type: Type});
  Reader.onerror = function(){
    Cb(404,{src: F, error: Reader.error, data: Res});
  };
  if(Type == "DataURL")
    Reader.readAsDataURL(F);
  else
    Reader.readAsText(F);
}


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
