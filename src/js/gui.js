/* Tabular Rasa JS GUI
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
* @module tr/gui
*/

/*eslint no-unused-vars: ["error", { "args": "none" }]*/


export function enable_nav_burger(Tag = '.navbar-burger') {
  var i, Elem, Elems = document.querySelectorAll(Tag);
  for ( i=0; i<Elems.length; i++ ){
      Elem = Elems[i];
      Elem.addEventListener('click',function(Event){
        var Src = Event.target;
        var Target = Src.dataset.target;
        Src.classList.toggle('is-active');
        document.getElementById(Target).classList.toggle('is-active');
      });
  }
}

export function modal(Data,Time) {
  var Modal = document.createElement('div');
  Modal.classList.add("modal");
  Modal.classList.add("is-active");
  if (Data instanceof Element || Data instanceof HTMLDocument)
    Modal.appendChild(Data);
  else
    Modal.innerHTML = Data;
  document.body.appendChild(Modal);
  if (Time){
    window.setTimeout(function(){ document.body.removeChild(Modal); },Time);
  }
  var i, CB = Modal.querySelectorAll('.close-button');
  for ( i=0; i<CB.length; i++ ){
    CB[i].addEventListener('click',function(){document.body.removeChild(Modal);});
  }
  return Modal;
}

export function warning(Data) {
  var Modal = modal('<div class="modal-background"></div><div class="modal-card">'+
  '<header class="modal-card-head is-warning"><p class="modal-card-title">Warning</p></header>'+
  '<section class="modal-card-body is-warning">'+
  Data+
  '</section><footer class="modal-card-foot"><button class="button is-warning close-button">Ok</button></footer>'+
  '</div>');
  return Modal;
}

export function error(Data) {
  var Modal = modal('<div class="modal-background"></div><div class="modal-card">'+
  '<header class="modal-card-head is-danger"><p class="modal-card-title">Error</p></header>'+
  '<section class="modal-card-body is-danger">'+
  Data+
  '</section><footer class="modal-card-foot"><button class="button is-danger close-button">Ok</button></footer>'+
  '</div>');
  return Modal;
}

export function info(Data) {
  var Modal = modal('<div class="modal-background"></div><div class="modal-card">'+
  '<header class="modal-card-head is-info"><p class="modal-card-title">Info</p></header>'+
  '<section class="modal-card-body is-info">'+
  Data+
  '</section><footer class="modal-card-foot"><button class="button is-info close-button">Ok</button></footer>'+
  '</div>');
  return Modal;
}

export function success(Data) {
  var Modal = modal('<div class="modal-background"></div><div class="modal-card">'+
  '<header class="modal-card-head is-success"><p class="modal-card-title">Success</p></header>'+
  '<section class="modal-card-body is-success">'+
  Data+
  '</section><footer class="modal-card-foot"><button class="button is-success close-button">Ok</button></footer>'+
  '</div>',2000);
  return Modal;
}



// Images

export function modal_image(Src,Alt = '') {
  var Modal = modal('<div class="modal-background"></div><div class="modal-content">'+
    '<p class="image">'+
      '<img src="'+Src+'" alt="'+Alt+'">'+
    '</p>'+
  '</div><button class="modal-close is-large close-button" aria-label="close"></button>');
  return Modal;
}

export function enable_img_zoom(Tag, Root = document){
  var i, Elems = Root.querySelectorAll('['+Tag+']');
  for ( i=0; i<Elems.length; i++ ){
    Elems[i].addEventListener('click',function (Event){
      var Target = Event.target;
      modal_image(Target.src,Target.alt);
    });
  }
}

export function enable_img_modal_tag(Tag, Root = document){
  var i, Elems = Root.querySelectorAll('['+Tag+']');
  for ( i=0; i<Elems.length; i++ ){
    Elems[i].addEventListener('click',function (Event){
      var Target = Event.target;
      modal_image(Target.getAttribute(Tag));
    });
  }
}


// File Dialog
export function open_file_dialog(Func, Title, Types = '', Multiple = false){
  var Mult = (Multiple ? "multiple" : "" );
  var Modal = modal(
    '<div class="modal-background"></div><div class="modal-card">'+
    '<header class="modal-card-head is-info"><p class="modal-card-title">'+Title+'</p></header>'+
    '<section class="modal-card-body is-info">'+
    '<div class="file has-name is-right"><label class="file-label"><input class="file-input" type="file" name="resume" accept="'+Types+'" '+Mult+'>'+
    '<span class="file-cta"><span class="file-label">Choose a file…</span></span>'+
    '<span class="file-name">... </span></label></div>'+
    '</section><footer class="modal-card-foot"><button class="button is-success ok-button">Ok</button><button class="button is-danger close-button">Cancel</button></footer>'+
    '</div>'
  );
  var OK = Modal.querySelector('.ok-button');
  OK.addEventListener('click',(function(){
    Func(Modal.querySelector('.file-input').files);
    document.body.removeChild(Modal);
  }).bind(Func));
  var FileInput = Modal.querySelector('.file-input');
  FileInput.addEventListener('change',function(){
    var i, List = "";
    for ( i=0; i<FileInput.files.length; i++ ){
      List += " " + FileInput.files[i].name;
    }
    Modal.querySelector('.file-name').innerHTML = List;
  });
  return Modal;
}
