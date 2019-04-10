/* Copyright (c) 2019 Benjamin Benno Falkner
** helper module
*/

var helper = ( function() {

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
        });
    };
    
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

    clean_code(document,'clean-code');
    autoload_html('html-src');
    router_html('html-content');
    return {
        get_json: get_json,
        get_html: get_html,
        get_data: get_data
    };
})();