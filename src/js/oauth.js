/* Tabular Rasa JS OAuth2
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



/* Definition of the Oauth Object
**
**
*/

// function map(Fun,List) {
//     var R = {}, i, Keys = Object.keys(List)
//     for (i = 0; i < Keys.length; i++) {
//         R[Keys[i]] = Fun(Keys[i],List[Keys[i]]);
//     }
//     return R;
// }
import {map} from "./maps";

// create empty set of login params
function create_params (){
    return {
        client_id: "",
        response_type: "",
        redirect_uri: "",
        scope: "",
        nonce: "",
        state: ""
    }
}

// scans url hash for params
function scan_for_response (){
    var Hash = (window.location.hash.substr(1)).split("&");
    var Query = (window.location.search.substr(1)).split("&");
    var R1, Res = {};
    for (var i=0; i<Query.length; i++) {
        R1 = Query[i].split("=");
        Res[R1[0]]=R1[1] || R1[0];
    }
    for (i=0; i<Hash.length; i++) {
        R1 = Hash[i].split("=");
        Res[R1[0]]=R1[1] || R1[0];
    }
    return Res;
}


// scan header
function scan_header(Xhttp) {
    var i, Elem, Key, Value, R={}, HL = Xhttp.getAllResponseHeaders().trim().split(/[\r\n]+/);
    for ( i=0; i<HL.length; i++ ) {
        Elem = HL[i].split(': ');
        Key   = Elem.shift();
        Value = Elem.join(': ');
        R[Key] = Value;
    }
    return R;
}


/*
** initialize an Oauth object with given name and config
*/
export function init(Name,Cfg) {
    // init object and set name
    var Res = {
        name: Name,
        state: 1,
        login: {},
        id: null,
        access_token: null,
        refresh_token: null,
        resp_state: null,
    }

    // use config
    if (Cfg) {
        load_cfg(Res,Cfg);
    }

    // use local store

    // use session store


    // use params
    var Params = scan_for_response ();
    if (Params.access_token){
        Res.access_token = Params.access_token;
        Res.state = 0;
    }
    if (Params.id_token){
        var base64 = (Params.id_token.split('.')[1]).replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        Res.id = JSON.parse(jsonPayload);
    }
    if (Params.state)
        Res.resp_state = Params.state;

    if (Params.error) {
        Res.state = -1;
        Res.error = Params.error;
        if (Params.error_description) {
            var Lines = Params.error_description.split('+');
            Res.error_desc = "";
            for(var i=0; i<Lines.length; i++) {
                Res.error_desc += decodeURI(Lines[i])+" ";
            }
        } else
            Res.error_desc = "unkown";
    }
    return Res;
}

export function logged_in(OAuth){
  return (OAuth.state === 0 )? true : false;
}

export function load_cfg(OAuth,Cfg){
  OAuth.login.link = Cfg.link || null;
  OAuth.login.param = Cfg.param || create_params();
  return OAuth;
}

export function load_cfg_file(OAuth,File,Cb){
  var Reader = new FileReader();
  Reader.oauth = OAuth;
  Reader.cb = Cb;
  Reader.onload = function(Event) {
      var Cfg = JSON.parse(Event.target.result);
      this.cb(200,load_cfg(this.oauth,Cfg));
  };
  Reader.onerror = function(Event) {
      this.cb(404,Event.target.error.code);
  };
  Reader.readAsText(File);
}

export function login(OAuth,State){
    var Input, Form = document.createElement('form');
    Form.setAttribute('method', 'GET');
    Form.setAttribute('action', OAuth.login.link);
    for (var Param in OAuth.login.param) {
        Input = document.createElement('input');
        Input.setAttribute('type', 'hidden');
        Input.setAttribute('name', Param);
        Input.setAttribute('value', OAuth.login.param[Param]);
        Form.appendChild(Input);
    }
    Input = document.createElement('input');
    Input.setAttribute('type', 'hidden');
    Input.setAttribute('name', 'state');
    Input.setAttribute('value', State);
    Form.appendChild(Input);
    Form.style.display = "none";
    document.body.appendChild(Form);
    Form.submit();
}

export function get(OAuth, Url, Type ,Param, Cb) {
    var Xhttp = new XMLHttpRequest();
    Xhttp.open('GET', Url, true);
    Xhttp.setRequestHeader("Authorization", "Bearer "+OAuth.access_token);
    map(Xhttp.setRequestHeader.bind(Xhttp),Param);
    if (Type) Xhttp.responseType = Type;
    Xhttp.Cb_ = Cb;
    Xhttp.onreadystatechange = function () {
        if(Xhttp.readyState === 4 ) {
            var Header = scan_header(Xhttp);
            this.Cb_(Xhttp.status, Xhttp.response, Header);
        }
    };
    Xhttp.send();
}

export function post(OAuth, Url, Type ,Param, Body, Cb) {
    var Xhttp = new XMLHttpRequest();
    Xhttp.open('POST', Url, true);
    Xhttp.setRequestHeader("Authorization", "Bearer "+OAuth.access_token);
    map(Xhttp.setRequestHeader.bind(Xhttp),Param);
    if (Type) Xhttp.responseType = Type;
    Xhttp.Cb_ = Cb;
    Xhttp.onreadystatechange = function () {
        if(Xhttp.readyState === 4 ) {
            var Header = scan_header(Xhttp);
            this.Cb_(Xhttp.status, Xhttp.response, Header);
        }
    };
    Xhttp.send(Body);
}

export function remove(OAuth, Url, Type ,Param, Cb) {
    var Xhttp = new XMLHttpRequest();
    Xhttp.open('DELETE', Url, true);
    Xhttp.setRequestHeader("Authorization", "Bearer "+OAuth.access_token);
    map(Xhttp.setRequestHeader.bind(Xhttp),Param);
    if (Type) Xhttp.responseType = Type;
    Xhttp.Cb_ = Cb;
    Xhttp.onreadystatechange = function () {
        if(Xhttp.readyState === 4 ) {
            var Header = scan_header(Xhttp);
            this.Cb_(Xhttp.status, Xhttp.response, Header);
        }
    };
    Xhttp.send();
}

//export function renew(OAuth,State,Params){}




//export function request(OAuth){}
