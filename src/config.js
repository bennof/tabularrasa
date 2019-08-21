/* Tabular Rasa JS Config
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

import './index.scss';


// import all dependencies you like to use
import * as io     from "./js/io.js";
import * as loader from "./js/loader.js";
import * as maps   from "./js/maps.js";
import * as o365   from "./js/o365.js";
import * as oauth  from "./js/oauth.js";
import * as pready from "./js/pageready.js";
import * as popup  from "./js/popup.js";
import * as table  from "./js/table.js";
import * as url    from "./js/url.js";

// SPACE FOR YOUR OWN FUNCTIONS

// piublish all used dependencies and functions
export {
  io,
  loader,
  maps,
  o365,
  oauth,
  pready,
  popup,
  table,
  url,
  run,
  login
}
