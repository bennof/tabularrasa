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


export function init(Name,Header) {
    return {
        name: Name,
        header: Header || [],
        data: []
    };
}

export function clear(Tbl) {
    Tbl.data = [];
    return Tbl;
}

export function add_colum(Tbl, Name, Data) {
    Tbl.header.push(Name);
    var Pos = tbl.header.length -1;
    for (var i=0;i<Tbl.data.length; i++){
        if(Data && Data[i]) {
            Tbl.data[i][pos] = Data[i];
        } else {
            Tbl.data[i][pos] = null;
        }
    }
    return Tbl;
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

export function read_csv(Tbl, Text, FS) {
    if (typeof(Tbl) == String ) {
        Tbl = init(Tbl);
    }

    var Last_Char = "", Field = "", Obj = [""], Col = 0, Row = 0, No_Quote = !0, C, j, First_Row = !0;
    Tbl.data = [Obj];

    for (j = 0; j < Text.length; j++) {
        C = text[j]; //get current char
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
                    field = field.slice(0, -1); //remove carriage return
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
