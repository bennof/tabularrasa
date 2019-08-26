/* Tabular Rasa JS Index
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
* @module tr
*/

import './index.scss';

import * as io     from "./js/io.js";
import * as loader from "./js/loader.js";
import * as maps   from "./js/maps.js";
import * as net    from "./js/net.js"
import * as o365   from "./js/o365.js";
import * as oauth  from "./js/oauth.js";
import * as pready from "./js/pageready.js";
import * as popup  from "./js/popup.js";
import * as table  from "./js/table.js";
import * as url    from "./js/url.js";


function run(OAuth){
  //read file
  io.open(null,"text/csv",function(S,D){
    if(S === 200) {
      // parse
      var Teacher = table.read_csv("Lehrer",D[0].data,";");
      document.teacher = Teacher;
      Teacher = table.add_colum(Teacher,"OfficeID");
      var Fn = table.get_col(Teacher,"Vorname"), Ln = table.get_col(Teacher,"Nachname"), Oid = table.get_col(Teacher,"OfficeID");
      // check

      table.map(function(Row){
        //console.log(Row[Fn],Row[Ln])
        o365.users.search(OAuth,{"givenName":Row[Fn],"surname":Row[Ln]},function(S,D){
          if(S === 200) this[Oid] = D;
        }.bind(Row));
        return Row;
      },Teacher);
      //console.log(3)
    }
  });
}

/**
* Load CSV
* @param {String} Name name of the loaded table
*/
export function loadCSV(Name) {
  io.open(null,"text/csv",function(S,D){
    if(S === 200) {
      window[Name] = table.read_csv(Name,D[0].data,";");
    }
    else
      console.log(S,D);
  });
}

export function saveCSV(Filen,Table){
  save(Filen, "text/csv", table.write_csv(Table,";"));
}

function getOfficeID(Tbl,OAuth){
  Tbl = table.add_colum(Tbl,"OfficeID");
  var Fn = table.get_col(Tbl,"Vorname"), Ln = table.get_col(Tbl,"Nachname"), Oid = table.get_col(Tbl,"OfficeID");
  table.map(function(Row){
    o365.users.search(OAuth,{"givenName":Row[Fn],"surname":Row[Ln]},function(S,D){
      if(S === 200) this[Oid] = D;
      else console.log(S,D);
    }.bind(Row));
    return Row;
  },Tbl);
}

function create_classes(OAuth){

}

function fill_classes(OAuth){

}





export {
  io,
  loader,
  maps,
  net,
  o365,
  oauth,
  pready,
  popup,
  table,
  url
}
