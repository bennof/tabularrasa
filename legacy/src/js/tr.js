/* Tabular Rasa Core JavaScript
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

var tabularrasa = (function() {
    /**
     * LOAD FUNCTIONS
     */

    // load json from url and pass to callback
    var get_json = function(Url, Cb) {
        get_data(Url,function (e){
            Cb(JSON.parse(e));
        });
    };

    // load html from url and insert to target
    var get_html = function (Url,Target) {
        get_data(Url, function(e){
            Target.innerHTML = e;
            clean_code(Target,'clean-code');
            exec_js(Target);
        });
    };

    var exec_js = function(Elem){
        var elem = Elem.querySelectorAll('SCRIPT');
        elem.forEach(function(e) {
            eval(e.innerText);
        });
    }

    // load data from url and pass to callback
    var get_data = function (Url,Cb) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState == 4){
                if (xhr.status == 200) {
                    Cb(xhr.responseText);
                } else {
                    console.log("Error: ("+xhr.status+")");
                }
            } 
        };
        xhr.open('GET',Url,true);
        xhr.send();
    };

    // Create clean code
    var EntityMap = {"&": "&amp;","<": "&lt;",">": "&gt;",'"': '&quot;',"'": '&#39;',"/": '&#x2F;'};
    var escape_html = function (string) { return String(string).replace(/[&<>"'\/]/g, function (s) { return EntityMap[s]; }); };
    var clean_code = function (Target) {
        codeElem = Target.querySelectorAll('[clean-code]');
        codeElem.forEach(function(elem) {
          var newContent = escape_html(elem.innerHTML)
          elem.innerHTML = newContent;
        });
    };



    /**
     * ROUTER
     */
    var start_router = function (){
        var elem = document.querySelector('[html-router]');
        tabularrasa.get_html(window.location.hash.substring(1)+".html",elem);
        window.onhashchange = function () {
            console.log("Hash: "+ window.location.hash);
            tabularrasa.get_html(window.location.hash.substring(1)+".html",elem);
        };
    };

    // load data once 
    var load_html_src = function () {
        var elem = document.querySelectorAll('[html-src]');
        elem.forEach(function(e) {
            Url = e.getAttribute('html-src');
            console.log("Load html: "+Url);
            tabularrasa.get_html(Url,e);
        });
    };

    /**
     * Autocomplete
     */
    // Autocomplete
    var autocomplete = function(Target,Opts){
        this.Search = document.querySelector(Target);
        //console.log(this.Search);
        this.AC = null;
        this.Data = null;
        this.Link = Opts.url || '';
        this.Url = Opts.hint || '';
        //this.Method = Opts.Method || JSONP,
        this.Search.onkeyup  = this.update.bind(this);
        document.onclick = this.delete.bind(this); 
    };
    autocomplete.prototype.update = function(e){
        var val = this.Search.value;
        if (val.length > 0) {
            get_json(this.Url+val,this.draw.bind(this));
            if( this.Data != null ) {
                this.draw(this.Data);
            }
            return;
        }
        this.delete();
    };
    autocomplete.prototype.draw = function(e){
        this.Data = e;
        var val = this.Search.value;
        console.log(val);
        // loop data
        var inner = "<ul>";
        var count = 0;
        if (this.Data != null){
            for (i = 0; i < this.Data.length; i++) {
                if (this.Data[i].substr(0, val.length).toLowerCase() == val.toLowerCase()) {
                    inner += "<li><a href=\""+this.Link+this.Data[i]+"\"><strong>" + this.Data[i].substr(0, val.length) + "</strong>"+this.Data[i].substr(val.length)+"</li>";
                    count++;
                }
            }
        }
        console.log(inner);
        if(count>0) {
            inner += "</ul>";
            if(this.AC == null ) { // if no frame exists
                var elem = document.createElement("div");
                //elem.id = this.Name.substr(1)+"autocomplete";
                elem.classList.add("autocomplete");
                //elem.classList.add("indent");
                this.Search.parentElement.appendChild(elem);//("<div id=\""+this.name.substr(1)+"autocomplete\" class=\"autocomplete\"></div>");
                this.AC = elem;//$(this.name+"autocomplete");
            }
            this.AC.innerHTML=inner;
            return ;
        }
        this.delete();
    };
    autocomplete.prototype.delete = function(e){
        if(this.AC) {
            this.AC.remove();
            this.AC = null;
        }
    };


    /**
     * POPUP
     */

    // create a popup
    var popup = function (Data,Time){
        var T = document.querySelector("#popup_area");
        var pop = document.createElement('DIV');
        pop.className = "popup";
        pop.innerHTML = Data;
        T.append(pop);
        var f = function(){ T.removeChild(pop); };
        window.setTimeout(f,Time);
    };

    return {
        clean_code: clean_code,
        get_json: get_json,
        get_html: get_html,
        get_data: get_data,
        start_router: start_router,
        load_html_src: load_html_src,
        autocomplete: autocomplete,
        popup: popup
    };
})();