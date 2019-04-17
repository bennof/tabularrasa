/* Copyright (c) 2019 Benjamin Benno Falkner
** helper module
*/

var tabularrasa = ( function() {

    var router_html = function (Marker){
        var elem = document.querySelector('['+Marker+']');
        window.onhashchange = function () {
            console.log("Hash: "+ window.location.hash);
            get_html(window.location.hash.substring(1)+".html",elem);
        };
    }

    // auto load
    var autoload_html = function (Marker) {
        var elem = document.querySelectorAll('['+Marker+']');
        elem.forEach(function(e) {
            Url = e.getAttribute(Marker);
            console.log(Url);
            get_html(Url,e);
        });
    };
    
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
            eval(e.text);
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
    var clean_code = function (Target, Marker) {
        codeElem = Target.querySelectorAll('['+Marker+']');
        codeElem.forEach(function(elem) {
          var newContent = escape_html(elem.innerHTML)
          elem.innerHTML = newContent;
        });
    };

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

    // on document ready
    var ReadyFired = false;
    var ReadyList = [];
    var ReadyEventHandlersInstalled = false;
    var ready = function(cb,ctx){
        if (typeof callback !== "function") { throw new TypeError("callback for Ready(fn) must be a function"); }
        if (ReadyFired) { // execute function 
            setTimeout(function() {cb(ctx);}, 1);
            return;
        } else { // schedule for document ready
            ReadyList.push({func: cb, ctx: ctx});
        }

        if(document.readyState === "complete"){
            setTimeout(ready_run,1);
        } else if (!ReadyEventHandlersInstalled) { // add handler if missing
            if (document.addEventListener) {
                document.addEventListener("DOMContentLoaded", ready_run, false);
                window.addEventListener("load", ready_run, false);
            } else {
                document.attachEvent("onreadystatechange", readyStateChange);
                window.attachEvent("onload", ready_run);
            }
            ReadyEventHandlersInstalled = true;
        }
    };
    function readyStateChange() { if ( document.readyState === "complete" ) { ready_run();} };
    function ready_run () {
        if (!ReadyFired) { ReadyFired = true;
            // loop list
            for (var i = 0; i < ReadyList.length; i++) {
                ReadyList[i].func.call(window, ReadyList[i].ctx); //execute
            }
            ReadyList = []; // clear
        } 
    };

    return {
        ready: ready,
        autocomplete: autocomplete,
        popup: popup,
        clean_code: clean_code,
        router_html: router_html,
        autoload_html: autoload_html,
        get_json: get_json,
        get_html: get_html,
        get_data: get_data
    };
})();