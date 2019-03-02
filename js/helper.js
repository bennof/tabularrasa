/* Copyright (c) 2019 Benjamin Benno Falkner
** helper module
*/

var helper = ( function() {

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

    autoload_html('html-src');
    return {
        get_json: get_json,
        get_html: get_html,
        get_data: get_data
    };
})();