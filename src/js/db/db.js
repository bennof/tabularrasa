/*
* Tabular Rasa JS DB db
*	MIT License (modified) @see LICENSE file
*	Author Benjamin Benno Falkner
*/

"use strict";

/**
* Tabular Rasa
* @module tr/db/db
*/

/**
* create a new table
*  @param {String} Name name of the table
*  @return {DB} a new table object
*/
export function init(Name){
  var R = {
    state: 0,
    name: Name,

    tables: {},
    query: {}
  };
  return R;
}



/**
* Read Access DB
*/
