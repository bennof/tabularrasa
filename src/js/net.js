/* Tabular Rasa JS Net
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

/**
* Handle network connections on HTTP
* - detect OAuth
* - limit number of connections
* @module tr/net
*/

import {map} from "./maps";
import * as url from "./url";

/**
* Id string use for unique storage identifier
* @type {String}
*/
const  Id_String = "tr_net_conf_";

/**
* initilaize a new connection
* @param {String} Name a name of the connection
* @param {Object} Config a configuration @see missing
* @return {Connection} a new connection object
*/
export function init(Name,Config){
  // init object and set name
  var Res, R;
  // try load from storage (session before local)
  if ((R = sessionStorage.getItem(Id_String + Name)) != null )
    Res = JSON.parse(R);
  else if ((Res = localStorage.getItem(Id_String + Name)) != null )
    Res = JSON.parse(R);
  else
    Res = {
      name: Name,
      state: 1,
      store: null,

      // connections
      conn: 0,
      max_conn: -1,

      // auth
      oauth: null,
      id: null,
      access_token: null,
      refresh_token: null
    };
  // read config
  if(Config){
    Res = config(Res,Config);
  }

  // scan URL hash
  var Params = url.hash_map(window.location);
  // if hash has access_token store it
  if (Params.access_token){
      Res.access_token = Params.access_token;
      Res.state = 0;
  }
  // if hash has id_token store id
  if (Params.id_token){
    var base64 = (Params.id_token.split('.')[1]).replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    Res.id = JSON.parse(jsonPayload);
  }
  // if hash has state store state
  if (Params.state) {
    Res.resp_state = Params.state;
    // check if hidden login
    if(Params.state === 'hidden_redirect:'+Res.name){
      console.log(location.protocol+"//"+location.host);
      console.log(Params);
      if (Params.access_token){
        window.parent.postMessage(Params.access_token,location.protocol+"//"+location.host);
      } else {
        window.parent.postMessage('relogin',location.protocol+"//"+location.host);
      }
    }
  }

  // error handling
  if (Params.error) {
    Res.state = -1;
    Res.error = Params.error;
    Res.error_desc = Params.error_description;
  }

  store(Res,Res.store);

  // if hash has state store state
  if (Params.state) {
    Res.resp_state = Params.state;
    // check if hidden login
    if(Params.state === 'hidden_redirect:'+Res.name){
      console.log(location.protocol+"//"+location.host);
      console.log(Params);
      window.parent.postMessage(Params.access_token,"http://localhost:8080");
    }
    if(Params.state === 'refresh:'+Res.name){
      console.log('refresh')
      refresh_(Res);
    }
  }

  window.addEventListener('message', function(Event) {
    console.log('Event')
    console.log(Event.data);
    if ('relogin' === Event.data)
      alert('login needed')
    else
      this.access_token = Event.data;

    var Frame = document.getElementById('hidden_redirect_'+this.name);
    if(Frame)
      Frame.parentElement.removeChild(Frame);
  }.bind(Res),false);


  return Res;
}

/**
* configure connection
* @param {Connection} Conn a connection object
* @param {Object} Config a configuration for oauth @see missing
* @return {Connection} a modified connection object
*/
export function config(Conn,Cfg){
  if ( typeof Cfg === 'string' ) {
    Cfg = JSON.parse(Cfg);
  }
  Conn.oauth = {};
  Conn.oauth.link = Cfg.link || null;
  Conn.oauth.param = Cfg.param || create_params();

  store(Conn,Conn.store);
  return Conn;
}

// Create empty params for oauth
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

/**
* store settings
*
*/
export function store(Conn,Location){
  Conn.store = Location;

  switch(Location){
    case 'local':
      window.localStorage.setItem(Id_String + Conn.name,JSON.stringify(Conn));
      break;
    case 'session':
      window.sessionStorage.setItem(Id_String + Conn.name,JSON.stringify(Conn));
      break;
  }
}


/**
* Check if login exsits
* @param {Connection} Conn a connection object
* @return {Boolean} is logged in
*/
export function logged_in(Conn){ return (OAuth.state === 0 )? true : false;}

/**
* perform login
*/
export function login(Conn,State){
  if(!Conn.store){
    store(Conn,'session')
  }
  var Input, Form = document.createElement('form');
  Form.setAttribute('method', 'GET');
  Form.setAttribute('action', Conn.oauth.link);
  for (var Param in Conn.oauth.param) {
      Input = document.createElement('input');
      Input.setAttribute('type', 'hidden');
      Input.setAttribute('name', Param);
      Input.setAttribute('value', Conn.oauth.param[Param]);
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

/**
* perform refresh
* @param {Connection} Conn a connection object
*/
export function refresh(Conn){
  if(!Conn.store){
    store(Conn,'session')
  }
  var Link = Conn.oauth.link;
  for (var Param in Conn.oauth.param) {
    Link += encodeURIComponent(Param)+"="
      +encodeURIComponent(Conn.oauth.param[Param])+"&";
  }
  Link += encodeURIComponent('state')+"="
    +encodeURIComponent('hidden_redirect:'+Conn.name)+"&";
  Link += encodeURIComponent('prompt')+"="
    +encodeURIComponent('none')+"&";
  Link += encodeURIComponent('login_hint')+"="
      +encodeURIComponent(Conn.id.email);

  var Iframe = document.createElement('Iframe');
  Iframe.id = "hidden_redirect_"+Conn.name;
  Iframe.style.display = "none";
  //Iframe.src = Link
  Iframe.src =location.protocol+"//"+location.host+'/#state=refresh:'+Conn.name;
  document.body.appendChild(Iframe);

//ok  https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize?
//ok client_id=6731de76-14a6-49ae-97bc-6eba6914391e
//ok response_type=token
//ok &redirect_uri=http%3A%2F%2Flocalhost%2Fmyapp%2F
//ok &scope=https%3A%2F%2Fgraph.microsoft.com%2Fuser.read
//ok &response_mode=fragment
//ok &state=12345&nonce=678910
//ok &prompt=none
}

function refresh_(Conn,State){
  var Link = Conn.oauth.link;
  for (var Param in Conn.oauth.param) {
    Link += encodeURIComponent(Param)+"="
      +encodeURIComponent(Conn.oauth.param[Param])+"&";
  }
  Link += encodeURIComponent('state')+"="
    +encodeURIComponent('hidden_redirect:'+Conn.name)+"&";
  Link += encodeURIComponent('prompt')+"="
    +encodeURIComponent('none')+"&";
  Link += encodeURIComponent('login_hint')+"="
      +encodeURIComponent(Conn.id.email);

  window.location.href = Link;

}



export function get(Fun, Conn, Url, Type, Param){
  return request(Fun, Conn, Url, null, Type, Param);
}
export function post(Fun, Conn, Url, Body, Type, Param){
  return request(Fun, Conn, Url, Body, Type, Param);
}
export function del(Fun, Conn, Url, Type, Param){
  return request(Fun, Conn, Url, null, Type, Param);
}
// export function patch(){}


function request(Fun, Conn, Url, Body, Type, Param){
  var Xhttp = new XMLHttpRequest();
  // start request
  Xhttp.open('GET', Url, true);
  // config request
  if(Conn.access_token)
    Xhttp.setRequestHeader("Authorization", "Bearer "+Conn.access_token);
  map(Xhttp.setRequestHeader.bind(Xhttp),Param);
  if (Type) Xhttp.responseType = Type;
  // callback
  Xhttp.fun = Fun;
  Xhttp.onreadystatechange = function () {
      if(Xhttp.readyState === 4 ) {
          var Header = url.header_map(Xhttp);
          Conn.conn--;
          Xhttp.fun(Xhttp.status, Xhttp.response, Header);
      }
  };
  Conn.conn++;
  (Body) ? Xhttp.send(Body) : Xhttp.send();
  return Xhttp;
}
