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

/*eslint no-unused-vars: ["error", { "args": "none" }]*/

export function open(Filen,Mime,Cb) {
  if(Filen == null) { // create dialog
    var FileInput = document.createElement('input');
    FileInput.setAttribute('type','file');
    FileInput.setAttribute('accept',Mime);
    FileInput.addEventaddEventListener("change", function(){
      open(this.input.files,this.mime,this.cb);
    }.bind({input: FileInput, mime: Mime, cb: Cb}), false);
    if (document.createEvent) {
      var Event = document.createEvent('MouseEvents');
      Event.initEvent('click', true, true);
      FileInput.dispatchEvent(Event);
    } else {
      FileInput.click();
    }
    return;
  }

  // Read files
  if(Array.isArray(Files)) {
    files_read(Files,[],Cb);
  } else {
    var Reader = new FileReader();
    Reader.onload = function(){
      Cb(200,Reader.result);
    };
    Reader.onerror = function(){
      Cb(404,Reader.error);
    };
    if(Mime.startsWith('text'))
      reader.readAsText(F);
    else
      reader.readAsDataURL(F);
  }
}

function files_read(Files,Mime,Res,Cb){
  var F = Files.shift(), Reader = new FileReader();
  // if done
  if (F == null) {
    Cb(200,Res);
    return;
  }
  Reader.onload = function(){
    files_read(this.files,this.mime,this.res.push({src: F, data: Reader.result}),this.cb)
  }.bind({files: Files, mime: Mime, res: Res, cb: Cb});
  Reader.onerror = function(){
    Cb(404,{src: F, error: Reader.error, data: Res});
  };
  if(Mime.startsWith('text'))
    reader.readAsText(F);
  else
    reader.readAsDataURL(F);
}

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
