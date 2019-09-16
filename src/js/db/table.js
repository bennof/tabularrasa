/*
* Tabular Rasa JS DB table
*	MIT License (modified) @see LICENSE file
*	Author Benjamin Benno Falkner
*/

"use strict";


/**
* Tabular Rasa
* @module tr/db/table
*/


/**
* A number, or a string containing a number.
* @typedef {Object} Table
* @property {Number} state state of the table (not used)
* @property {String} name table name should be unique
* @property {Array.<String>} header header filed of table
* @property {Array} data rows of table
* @property {Number} sorted colum used for sorting (-1 not sorted or by special function)
* @property {Function} sortfk function/comparator used
*/

/**
* create a new table
*  @param {String} Name name of the table
*  @param {Array} [Header] array of colum names
*  @return {Table} a new table object
*/
export function init(Name,Header){
  var R = {
    state: 0,
    name: Name,

    header: Header || [],
    data: [],

    sorted: -1,
    sortfk: null
  };
  return R;
}

/**
* get colum id
* @param {Table} Tbl table element
* @param {String} Colum colum name
* @return {Number} returns the colum index
*/
export function col(Tbl, Colum){
  return (typeof Colum === "string" ) ? Tbl.header.indexOf(Colum) : Colum;
}

/**
* get value of a field
* @param {Table} Tbl table element
* @param {Number} Row row index
* @param {(Number|String)} Colum colum index or colum name
* @return {Object} returns value
*/
export function get(Tbl, Row, Colum) {
  var Cidx = col(Tbl,Colum);
  return Tbl.data[Row][Cidx];
}

/**
* set value of a field
* @param {Table} Tbl table element
* @param {Number} Row row index
* @param {(Number|String)} Colum colum index or colum name
* @param {Object} Value the new value
* @return {Table} returns value
*/
export function set(Tbl, Row, Colum, Value) {
  var Cidx = col(Tbl,Colum);
  if (Cidx >= 0)
    Tbl.data[Row][Cidx] = Value;
  else
    return null;
  Tbl.sorted = -1;
  Tbl.sortfk = null;
  return Tbl;
}

/**
* get row as map
* @param {Table} Tbl table element
* @param {Number} Row row index
* @return {Map} returns a map
*/
export function get_obj(Tbl,Row){
  var Obj = {};
  for(var i=0; i<Tbl.header.length; i++){
    Obj[Tbl.header[i]] = Tbl.data[Row][i];
  }
  return Obj;
}

/**
* set row by map only valid header names will be used
* @param {Table} Tbl table element
* @param {Number} Row row index
* @param {Map} returns a map
* @return {Table} returns new table
*/
export function set_obj(Tbl, Row, Map){
  var i, Keys = Object.keys(Map), Cidx;
  for (i = 0; i < Keys.length; i++) {
    set(Tbl,Row,Key[i],Map[Key[i]]);
  }
  Tbl.sorted = -1;
  Tbl.sortfk = null;
  return Tbl;
}

/**
* add a colum (slow)
* @param {Table} Tbl table element
* @param {(Number|String)} Colum colum index or colum name
* @param {Array} [Data] sets data for new colum
* @return {Table} returns table
*/
export function add_colum(Tbl, Name, Data) {
    var Cidx = col(Tbl,Name);
    if (Cdix >= 0 )
      return null;
    Tbl.header.push(Name);
    var i, Pos = Tbl.header.length -1;
    for (i=0;i<Tbl.data.length; i++){
        if(Data && Data[i]) {
            Tbl.data[i][Pos] = Data[i];
        } else {
            Tbl.data[i][Pos] = null;
        }
    }
    return Tbl;
}

/**
* remove a colum (slow)
* @param {Table} Tbl table element
* @param {(Number|String)} Colum colum index or colum name
* @return {Table} returns table
*/
export function rm_colum(Tbl, Name) {
  var Cidx = col(Tbl,Name);
  if (Cdix < 0 )
    return null;
  var i;
  Tbl.header = Tbl.header.splice(Cidx,1);
  for (i=0;i<Tbl.data.length; i++)
    Tbl.data[i] = Tbl.data[i].splice(Cidx,1);
  return Tbl;
}

/**
* predefined compare functions
* @type {Array}
*/
export var compare = {
  /**
  * compare numbers
  * @type {Function}
  */
  number: function(A,B){return A-B;},
  /**
  * compare strings (local)
  * @type {Function}
  */
  string: function(A,B){return A.localeCompare(B);},
  /**
  * compare anything using toString()
  * @type {Function}
  */
  any: function(A,B){return A.toString().localeCompare(B.toString());}
};

/**
* sort table by colum
* @param {Table} Tbl table element
* @param {(Number|String)} Colum colum index or colum name (if a not exsiting
* colum name or negative id is passed entire rows will be passed into compare
* function)
* @param {Function} [Compare] compare function
* @return {Table} returns new table
*/
export function sort(Tbl,Colum,Compare){
  var Cmp, Cidx = col(Tbl,Colum);
  if (Cidx < 0){
    Cmp = Compare;
  } else {
    Cmp = (function(A,B){
      return this.cmp(A[this.idx],B[this.idx]);
    }).bind(idx: Cidx, cmp: Compare || compare.any);
  }
  Tbl.data = Tbl.data.sort(Cmp);
  Tbl.sorted = Cidx;
  Tbl.sortfk = Compare || compare.any;
  return Tbl;
}

/**
* search for special colum value (binary search)
* @param {Table} Tbl table element
* @param {(Number|String)} Colum colum index or colum name (if a not exsiting
* colum name or negative id is passed entire rows will be passed into compare
* function)
* @param {Object} Value search value
* @param {Function} [Compare] compare function
* @return {Number} returns row index
*/
export function search(Tbl,Colum,Value,Compare){
  var Cmp, Cidx = col(Tbl,Colum);
  if(!Tbl.sorted || Tbl.sorted != Cidx || Tbl.sortfk != (Compare || compare.any))
    sort(Tbl,Colum,Compare);
  if (Cidx < 0){
    Cmp = Compare;
  } else {
    Cmp = (function(A,B){
      return this.cmp(A,B[this.idx]);
    }).bind(idx: Cidx, cmp: Compare || compare.any);
  }
  return binsearch(Tbl, Value, Cmp);
}

// implementatio of binary search
function binsearch(Tbl, Cidx, Value, Compare){
  var Left = 0, Right = Tbl.data.length - 1, Mid, R, Data = Tbl.data;
  while (Left <= Right) { // Interval
    Mid = Left + ((Right - Left) / 2); // half interval
    R = Compare(Value,Data[Mid]);
    if (R == 0) // success
      return Mid;
    else
      if (R < 0) // lower interval
        Right = Mid - 1;
      else // higher interval
        Left = Mid + 1;
  }
  return -1;
}

/**
* get a field by searching for another
* @param {Table} Tbl table element
* @param {(Number|String)} Key colum index or name of the returned field
* @param {(Number|String)} Colum colum index or colum name (if a not exsiting
* colum name or negative id is passed entire rows will be passed into compare
* function)
* @param {Object} Value search value
* @param {Function} [Compare] compare function
* @return {Object} returns first hit
*/
export function get_by(Tbl,Key,Colum,Value,Compare){
  var Idx = search(Tbl,Colum,Value,Compare);
  if (Idx >= 0) {
    return get(Tbl,Idx,Key);
  }
}

// helper for serveral functions maps function on an array
function amap(Arr,Fun){
  var i, R = [];
  for (i=0;i<Arr.length;i++)
    R[i] = Fun(Arr[i],i);
  return R;
}


/**
* Map a function on a table object
* @param {Function} Fun Function to be maped
* @param {Table} Tbl table element
* @param {Array.(Number|String)} Inputs preselected colum values
* @return {Table} Tbl table element
*/
export function map(Fun, Tbl, Inputs) {
  var Data = Tbl.data, i;
  if (Inputs){
    var B,In = amap(Inputs,function(D){col(Tbl,D)});
    for (i = 0; i < Data.length; i++) {
      B = amap( function(I){return this[I];}.bind(Data[i]),In);
      Data[i] = Fun.apply(null,[Data[i]].concat(B),i);
    }
  } else {
    for (i = 0; i < Data.length; i++) {
      Data[i] = Fun(Data[i],i);
    }
  }
  return Tbl;
}

/**
* fold a function on a table object
* @param {Function} Fun Function to be maped
* @param {Table} Tbl table element
* @param {Object} Acc object for accumulation
* @param {Array.<(Number|String)>} Inputs preselected colum values
* @return {Object} accumulator
*/
export function fold(Fun, Tbl, Acc, Inputs) {
  var Data = Tbl.data, i;
  if (Inputs){
    var B,In = amap(Inputs,function(D){col(Tbl,D)});
    for (i = 0; i < Data.length; i++) {
      B = amap( function(I){return this[I];}.bind(Data[i]),In);
      B.push(Data[i]);
      B.push(i);
      Acc = Fun.apply(null,[Acc].concat(B));
    }
  } else {
    for (i = 0; i < Data.length; i++) {
      Acc = Fun(Acc,Data[i],i);
    }
  }
  return Acc;
}

/**
* Filter a table
* @param {Table} Tbl table element
* @param {(Number|String)} Colum colum index or colum name (if a not exsiting
* colum name or negative id is passed entire rows will be passed into compare
* function)
* @param {Object} Query query value
* @param {Function} [Compare] compare function
* @return {Table} returns new table
*/
export function filter(Tbl,Colum,Query,Compare){
  var Cidx = col(Tbl,Colum);
  var Out = init(Tbl.name+" filter "+ Query,Tbl.header.slice(0));
  var Data = Tbl.data, i, Cmp = Compare || compare.any;
  if (Cidx < 0){
    for (i = 0; i < Data.length; i++) {
      if (0 == Cmp(Data[i],Query))
        Out.data.push(Data[i]);
    }
  } else {
    for (i = 0; i < Data.length; i++) {
      if (0 == Cmp(Data[i][Cidx],Query))
        Out.data.push(Data[i]);
    }
  }
  return Out;
}

/**
* reduce multiple values in a colum to a shorter table
* @param {Table} Tbl table element
* @param {(Number|String)} Colum colum index or colum name (if a not exsiting
* colum name or negative id is passed entire rows will be passed into compare
* function)
* @param {Function} [Compare] compare function
* @return {Table} returns new table
*/
export function reduce(Tbl,Colum,Compare){
  var Cidx = col(Tbl,Colum);
  if(!Tbl.sorted || Tbl.sorted != Cidx || Tbl.sortfk != (Compare || compare.any))
    sort(Tbl,Colum,Compare);
  var Data = Tbl.data, i;
  var Last, Out = init(Tbl.name+" reduce "+Colum,Tbl.header.slice(0)); // new table

  Out.data.push(Data[0]);
  if (Cidx < 0){
    Last=Data[0];,
    for (i = 1; i < Data.length; i++) {
      if (0 != Fun(Data[i],Last))
        Out.data.push(Data[i]);
      Last = Data[i];
    }
  } else {
    Last=Data[0][Cidx];
    for (i = 1; i < Data.length; i++) {
      if (0 != Fun(Data[i][Cidx],Last))
        Out.data.push(Data[i]);
      Last = Data[i][Cidx];
    }
  }
  return Out;
}

/**
* read csv from string
* @param {Table/String} Tbl table element to read in data;
* if a string is entered a table with that name is created
* @param {String} Text text/csv encoded data string
* @param {String} FS field seperator
* @param {Boolean} No_Header set to ignore header
*/
export function read_csv(Tbl, Text, FS, No_Header) {
    if (typeof(Tbl) === "string" ) {
      Tbl = init(Tbl);
    }

    var Last_Char = "", Field = "", Obj = [""], Col = 0, Row = 0, No_Quote = !0, C, j, First_Row = (No_Header)? 0 : !0;
    Tbl.data.push(Obj);

    for (j = 0; j < Text.length; j++) {
        C = Text[j]; //get current char
        if ("\"" === C) { // if quote
            if (No_Quote && C === Last_Char)
                Field += C; // if previous was a quote add quote to field string
            No_Quote = !No_Quote; // switch boolean
        }
        else if (FS === C && No_Quote) { // if not quoted FS
            if (First_Row) {
                Tbl.header[Col++] = Field;
            }
            else {
                Obj[Col++] = Field;
            }
            C = Field = "";
        }
        else if ("\n" === C && No_Quote) { // if not quoted line end
                if ("\r" === Last_Char)
                    Field = Field.slice(0, -1); //remove carriage return
                if (First_Row) {
                    First_Row = !First_Row;
                    Tbl.header[Col] = Field;
                    C = Field = "";
                }
                else {
                    Obj[Col] = Field;
                    Tbl.data[++Row] = Obj = [];
                }
                C = Field = "";
                Col = 0;
            }
            else {
                Field += C;
            }
            Last_Char = C;
    }
    if (Col != 0) {
        Obj[Col] = Field;
    }
    if (Obj.length != Tbl.header.length)
      Tbl.data.pop();

    return Tbl;
}


/**
* write table data to csv encoded string
* @param {Table} Tbl table to be text/csv encoded
* @param {String} FS field seperator
* @return {String} text/csv encoded string
*/
export function write_csv(Tbl, FS) {
    var Text = "", Row;
    if (Tbl.header) {
        for (var i = 0; i < Tbl.header.length; i++) {
            if (i > 0)
                Text += FS;
            Text += escape_csv(Tbl.header[i], FS);
        }
        Text += "\r\n";
    }
    for (var i = 0; i < Tbl.data.length; i++) {
        Row = Tbl.data[i];
        for (var j = 0; j < Row.length; j++) {
            if (j > 0)
                Text += FS;
            Text += escape_csv(Row[j], FS);
        }
        Text += "\r\n";
    }
    return Text;
}

// Helper to write csv files escapes
// filds for csv
function escape_csv(Value, FS) {
    var R = "", C, Esc = false;
    if (!Value)
        return "";
    for (var j = 0; j < Value.length; j++) {
        C = Value[j];
        if (C == "\"") {
            R += C;
            R += C;
            Esc = true;
        }
        else if (C == "\n" || C == "\r" || C == FS) {
            R += C;
            Esc = true;
        }
        else {
            R += C;
        }
    }
    if (Esc) {
        return "\"" + R + "\"";
    }
    else {
        return R;
    }
}
