/* Tabular Rasa JS Table
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
* @module tr/table
*/

/// TODO:
/// unify
/// comments
///

/// unify
///


/**
*  initialize a new table
*  @param {String} Name name of the table
*  @param {Array} [Header] array of colum names
*  @return {Table} a new table object
*/
export function init(Name,Header) {
  return {
    /**
    * not used (will be used for async operations)
    * @type {Integer}
    */
    state: 0,
    /**
    * name of the tabel
    * @type {String}
    */
    name: Name,
    /**
    * array[Colum Index] stores colum names
    * @type {Array}
    */
    header: Header || [],
    /**
    * 2 dim array[Row Index][Colum Index] to store data (row major)
    * @type {Array}
    */
    data: [],
    /**
    * index to determin sorting colum; negativ values intent no sorting
    * @type {Integer}
    */
    sorted: -1
  };
}

/**
* clear data of a table (in-place)
* @param {Table} Tbl table to be cleared
* @return {Table} reference of input table
*/
export function clear(Tbl) {
    Tbl.data = [];
    return Tbl;
}

/**
* predefined compare functions
* @type {Array}
*/
export var cmp = {
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



export function add_colum(Tbl, Name, Data) {
    Tbl.header.push(Name);
    var Pos = Tbl.header.length -1;
    for (var i=0;i<Tbl.data.length; i++){
        if(Data && Data[i]) {
            Tbl.data[i][Pos] = Data[i];
        } else {
            Tbl.data[i][Pos] = null;
        }
    }
    return Tbl;
}

export function map(Fun, Tbl){
  var Data = Tbl.data, i;
  for (i = 0; i < Data.length; i++) {
    Data[i] = Fun(Data[i],i);
  }
}

function amap(Fun,Arr){
  var i, R = [];
  for (i=0;i<Arr.length;i++)
    R[i] = Fun(Arr[i],i);
  return R;
}

export function map3(Fun,Inputs,Tbl){
  var Data = Tbl.data, i, B,
    In = amap(function(D){
      return (typeof D == "string") ? get_col(Tbl,D) : D; },Inputs);
  for (i = 0; i < Data.length; i++) {
    B = amap( function(I){return this[I];}.bind(Data[i]),In);
    Data[i] = Fun.apply(null,[Data[i]].concat(B));
  }
}

export function fold(Fun, Acc, Tbl){
  var Data = Tbl.data, i;
  for (i = 0; i < Keys.length; i++) {
    Acc = Fun(Data[i],Acc);
  }
  return Acc;
}

export function fold4(Fun,Acc,Inputs,Tbl) {
  var Data = Tbl.data, i, B,
    In = amap(function(D){
      return (typeof D == "string") ? Tbl.header.indexOf(D) : D; },Inputs);
  for (i = 0; i < Data.length; i++) {
    B = amap( function(I){return this[I];}.bind(Data),In);
    B.push(Acc);
    Acc = Fun.apply(null,B);
  }
  return Acc;
}

export function filter(Fun,Tbl){
  var Out = init(Tbl.name+" filter",Tbl.header.slice(0));
  var Data = Tbl.data, i;
  for (i = 0; i < Data.length; i++) {
    if (Fun(Data[i]))
      Out.data.push(Data[i]);
  }
  return Out;
}

export function reduce(Fun,Colum,Tbl){
  var Cidx = (typeof Colum === "string" ) ? Tbl.header.indexOf(Colum) : Colum;
  if (!Tbl.sorted || Tbl.sorted != Cidx)
    sort(Fun,Cidx,Tbl);
  var Data = Tbl.data, i;
  var Last=Data[0][Cidx], Out = init(Tbl.name+" reduce "+Colum,Tbl.header.slice(0));
  Out.data.push(Data[0]);
  for (i = 1; i < Data.length; i++) {
    if (0 != Fun(Data[i][Cidx],Last))
      Out.data.push(Data[i]);
    Last = Data[i][Cidx];
  }
  return Out;
}



export function sort(Fun, Colum, Tbl){
  var Cidx = (typeof Colum === "string" ) ? Tbl.header.indexOf(Colum) : Colum;
  var Cmp = function(A,B){
    return this.cmp(A[this.idx],B[this.idx]);
  }
  Tbl.data = Tbl.data.sort(Cmp.bind({idx: Cidx, cmp: Fun}));
  Tbl.sorted = Cidx;
  return Cidx;
}

export function search_and_get(Fun,Value,Colum,Key,Tbl){
  var Idx = search(Fun,Value,Colum,Tbl);
  if (Idx > 0) {
    var Cidx = (typeof Colum === "string" ) ? Tbl.header.indexOf(Key) : Key;
    return Tbl.data[Idx][Cidx];
  }
}

export function search(Fun,Value,Colum,Tbl){
  var Cidx;
  if (typeof Colum === "string" )
    Cidx = Tbl.header.indexOf(Colum);
  else
    Cidx = Colum;
  if( Tbl.sorted && Tbl.sorted == Cidx){//binary binsearch
    return binsearch(Fun, Value, Cidx, Tbl);
  } else {
    var i, Data=Tbl.data;
    for (i=0; i<Data.length; i++){
      if(0 == Fun(Data[i][Cidx],Value)){
        return i;
      }
    }
  }
  return -1;
}

export function binary_search(Fun,Value,Colum,Tbl){
  var Cidx = (typeof Colum === "string" ) ? Tbl.header.indexOf(Colum) : Colum;
  if (!Tbl.sorted || Tbl.sorted != Cidx)
    sort(Fun,Cidx,Tbl);
  return binsearch(Fun, Value, Cidx, Tbl);
}

function binsearch(Fun, Value, Cidx, Tbl){
  var Left = 0, Right = Tbl.data.length - 1, Mid, R, Data = Tbl.data;
  while (Left <= Right) { // Interval
    Mid = Left + ((Right - Left) / 2); // half interval
    console.log(Value,Data[Mid]);
    R = Fun(Value,Data[Mid][Cidx]);
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


export function get_col(Tbl, Col_Name){
  return Tbl.header.indexOf(Col_Name);
}

export function get(Tbl,Row,Col) {
    if (typeof(Col) == String){
        Col = Tbl.header.indexOf(Col);
    }
    return Tbl.data[Row][Col];
}

export function get_row_obj(Tbl,Row){
    var Obj = {};
    for(var i=0; i<Tbl.header.length; i++){
        Obj[Tbl.header[i]] = Tbl.data[Row][i];
    }
    return Obj
}

export function add_obj(Tbl,Obj,Idx) {
   var Keys = Object.keys(Obj);
   if (Idx){
    if (typeof(Idx) == String){
        Idx = Tbl.header.indexOf(Idx);
    }
   } else {
       Idx = Tbl.data.length;
       Tbl.data.push(new Array());
   }
   for(var i=0; i<Keys.length; i++ ){
       var Pos = Tbl.header.indexOf(Keys[i]);
       if(Pos == -1){
           console.log("TR_Table: Missing key: "+Keys[i]);
       } else {
           Tbl.data[Idx][Pos] = Obj[Keys[i]];
       }
   }
   return Tbl
}


export function add_obj_array(Tbl,Obj){
    var i,j, L, Keys, Idx;
    for(i=0; i<Obj.length; i++){
        L = new Array();
        Keys = Object.keys(Obj[i]);
        for(j=0; j<Keys.length; j++ ){
            Idx = Tbl.header.indexOf(Keys[j]);
            if (Idx >=0 ) {
                L[Idx] = Obj[i][Keys[j]];
            }
        }
        Tbl.data.push(L);
    }
    return Tbl;
}

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
