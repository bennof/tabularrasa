/* Tabular Rasa JS URL
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

// scan header
export function get_http_header_map(Xhttp){
  var i, Elem, Key, Value, R={}, HL = Xhttp.getAllResponseHeaders().trim().split(/[\r\n]+/);
  for ( i=0; i<HL.length; i++ ) {
      Elem = HL[i].split(': ');
      Key   = Elem.shift();
      Value = Elem.join(': ');
      R[Key] = Value;
  }
  return R;
}

export function get_hash_map(URL){
  var i, Hash = (URL.hash.substr(1)).split("&");
  for (i=0; i<Hash.length; i++) {
      R1 = Hash[i].split("=");
      Res[R1[0]]=R1[1] || R1[0];
  }
  return Res;
}

// window.location
export function get_query_map(){
  var i, Query = (URL.search.substr(1)).split("&");
  for (i=0; i<Query.length; i++) {
      R1 = Query[i].split("=");
      Res[R1[0]]=R1[1] || R1[0];
  }
  return Res;
}
