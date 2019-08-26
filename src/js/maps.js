/* Tabular Rasa JS Office365
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
*  adds some map functions from functional laguages
*  helper functions
* @module tr/maps
*/


/**
* Fold function for maps / Objects
* @param {Function} Fun(Key,Value,Acc) -> Acc
* @param {Object} Acc Accumulated Value
* @param {Map/Object} Map a map of Key Value pairs
* @return {Object} Accumulated Value
*/
export function fold(Fun,Acc,Map) {
  var i, Keys = Object.keys(Map)
  for (i = 0; i < Keys.length; i++) {
    Acc = Fun(Keys[i],Map[Keys[i]],Acc);
  }
  return Acc;
}

/**
* Map function for maps / Objects
* @param {Function} Fun(Key,Value) -> Value
* @param {Map/Object} Map a map of Key Value pairs
* @return {Map/Object} new Map
*/
export function map(Fun,Map) {
  var R = {}, i, Keys = Object.keys(Map)
  for (i = 0; i < Keys.length; i++) {
    R[Keys[i]] = Fun(Keys[i],Map[Keys[i]]);
  }
  return R;
}

/**
* convert a Map to a list of objects
* @param {Map/Object} Map a map of Key Value pairs
* @return {List/Array} new List
*/
export function to_list(Map) {
  var R = [], i, Keys = Object.keys(Map)
  for (i = 0; i < Keys.length; i++) {
    R.push({key:Keys[i],value: Map[Keys[i]]});
  }
  return R;
}
