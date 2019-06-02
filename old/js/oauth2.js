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


var OAuth2 = (function(){
    
    /**
     * initialize OAuth 
     * @param {Function(State,Opt)} Callback callback function
     * @param {String} URL adress for login
     * @param {[Stirng] Object} Opt options used
     * @returns {Object} State 
     */
    var init = function(Callback, URL, Opt){
        var State = {state: 0, login_link: URL};
        process_hash(State,Callback,Opt);
        return State;
    };

    var process_hash = function(State,Callback,Opt){
        // get params from header
        var Params = parse_hash();
        // check for error
        if(Params['error']) {
            error_h(Params['error'],Opt);
        }
        // check for success
        if(Params['state'] && Params['access_token'] && Params['token_type']){
            console.log('success');
            // replace id token by readable data
            if(Params["id_token"]) {
                var base64Url = Params["id_token"].split('.')[1];
                var base64 = base64Url.replace('-', '+').replace('_', '/');
                Params["id_token"] = JSON.parse(window.atob(base64));
            }
            State.params = Params; 
            State.state = 4; 

            if(Callback) {
                Callback(State,Opt);
            }
            return
        }
        // login wont return
        login_h(State);
    }

    /**
     * perfom login
     * @param {Object} State current state object
     */
    var login_h = function(State){
        State.state = 1;
        var form = document.createElement('form');
        form.setAttribute('method', 'GET'); 
        form.setAttribute('action', State.login_link);
        document.body.appendChild(form);
        form.submit();
    }

    /**
     * create an error
     * @param {Object} State current state
     * @param {String} Msg error message
     * @param {[Sting] Object} Opt options collection
     */
    var error_h = function(State,Msg,Opt) {
        State.state = -1;
        if (Opt.on_error) {Opt.on_error(State,Msg,Opt);}
        else {console.log("ERROR [Oauth2]: " + Msg);}
    }

    /**
     *  parse hash
     *  @return {[String] String} map of params 
     */
    var parse_hash = function(){
        // Parse hash
        var Hash = location.hash.substring(1);
        var Params = {}; 
        var Regex = /([^&=]+)=([^&]*)/g, Elem;
        while (Elem = Regex.exec(Hash)) {
            Params[decodeURIComponent(Elem[1])] = decodeURIComponent(Elem[2]);
        }
        console.log(Params)
        return Params
    };

    /**
     * send a request
     * @param {Object} State current state object 
     * @param {String} URL request url
     * @param {Object} Opt optons: {timeout, body, method, type}
     * @param {Function(State,Response)} Callback callback for response
     */
    var request = function(State, URL, Opt, Callback){
        if (State.state != 4){error_h(State,"Incomplete Init ... ",Opt)}
        // create Xhr
        var Xhr = new XMLHttpRequest();
        Xhr.timeout = Opt.timeout || 0;
        Xhr.state = State;
        Xhr.cb = Callback;
        Xhr.ontimeout = function(){ 
            error_h(State_,"loading config timeout",Opts); 
            return; 
        };
        // handle response
        Xhr.onreadystatechange = function(){
            if (Xhr.readyState === 4 && Xhr.status === 200) {
                var Resp = JSON.parse(Xhr.responseText);
                Xhr.cb(Xhr.State,Resp);
            } else {
                error_h(State_,"HTTP "+Xhr.status,Opts);
                return;
            }
        };
        // setup request
        Xhr.open(Opt.method || "GET", URL, true);
        http.setRequestHeader('Authorization', 'Bearer ' + State.params['access_token']);
        if (Opt.body) {
            http.setRequestHeader('Content-Type', Opt.type || "text/plain");
            http.send(Opt.body)
        } else {
            http.send(null);
        }
    };

    return {
        init: init,
        request: request
    };
})();