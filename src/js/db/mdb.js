/*
* Tabular Rasa JS DB mdb
*	MIT License (modified) @see LICENSE file
*	Author Benjamin Benno Falkner
*/

"use strict";


/**
* Tabular Rasa
* @module tr/db/mdb
*/


const MDB_PAGE_SIZE = 4096;
const MDB_VER_JET3  = 0;
const MDB_VER_JET4  = 1;
const MDB_VER_ACCDB2007 = 0x02;
const MDB_VER_ACCDB2010 = 0x0103;
const JET3_XOR = [ 0x86,0xfb,0xec,0x37,0x5d,0x44,0x9c,0xfa,0xc6,
                   0x5e,0x28,0xe6,0x13,0xb6,0x8a,0x60,0x54,0x94 ];
const JET4_XOR = [ 0x6aba,0x37ec,0xd561,0xfa9c,0xcffa,
                   0xe628,0x272f,0x608a,0x0568,0x367b,
			             0xe3c9,0xb1df,0x654b,0x4313,0x3ef3,
			             0x33b1,0xf008,0x5b79,0x24ae,0x2a7c ];


/**
* read a page
*/
function read_page(File, Offset, PageSize, Callback){
  var Reader = new FileReader();
  var Blob = File.slice(Offset, PageSize + Offset);
  Reader.onload = Callback;
  Reader.readAsArrayBuffer(Blob);
}

/**
* parse first page
*/
function first_page2(Event){
  if (Event.target.error == null) {
    this.offset += Event.target.result.byteLength;

    this.state = 0;
  } else {
    error(this,Event.target.error);
  }
}


/**
* get page by type
*/
function page(Event){
  if (Event.target.error == null) {
    this.offset += Event.target.result.byteLength;
    var Buffer = new DataView(Event.target.result);
    switch (Buffer.getInt16(0x0,true)){
      case 0x0100: // first page
        first_page(this,Event.target.result);
        break;
      case 0x0101: // data page
        data_page4(this,Event.target.result);
        break;
      case 0x0102: // def page
        def_page4(this,Event.target.result);
        break;
      default:
        error(this,"Unkown Page: "+Buffer.getInt32(0x0,true));
        console.log("Unkown Page: ",Buffer.getInt32(0x0,true));
        return ;
    }
    //this.state = 0;
  } else {
    error(this,Event.target.error);
  }
}

/**
* first page
*/
function first_page(MDB, Buffer){
  var View = new DataView(Buffer);
  var Pwd = new ArrayBuffer(40);
  var PWD = new DataView(Pwd);

  switch(View.getInt32(0x14,true)){
    case MDB_VER_JET3:
      var R, S="", i;
      for(i=0;i<18;i++){
        R = View.getUint8(0x42+2,true) ^ JET3_XOR[i];
        S += String.fromCharCode(R);
      }
      MDB.version = "Jet3";
      MDB.pwd = S;
      break;
    case MDB_VER_JET4:
      var R, S="", i, Magic = View.getInt16(0x66,true) ^ JET4_XOR[18];
      for(i=0;i<18;i++){
        R= View.getUint16(0x42+2*i,true) ^ JET4_XOR[i];
        if(R>255)
          R = R ^ Magic
        S += String.fromCharCode(R);
      }
      MDB.version = "Jet4";
      MDB.pwd = S;
      MDB.cipher = rc4.gen_key(MDB.pwd);
      break;
    // case MDB_VER_ACCDB2007: this.version = "Access2007"; break;
    // case MDB_VER_ACCDB2010: this.version = "Access2010"; break;
    default:
      error(MDB,"Unkown Version: "+View.getInt32(0x14,true))
      console.log("Unkown Version",View.getInt32(0x14,true));
  }
  MDB.state = 0;
}

/**
* data page
*/
function data_page4(MDB, Buffer){
  MDB.state = 0;
}

/**
* def page
*/
function def_page4(MDB, Buffer){
  MDB.state = 0;
}

/**
* send error
*/
function error(MDB,Desc){
  console.log("Read error: " + Desc);
  MDB.state = -1;
  MDB.error = Desc;
}

/**
* Read mdb
*/
export function open(Name, File){
  var MDB = {
    name: Name,
    state: 1,
    file: File,
    offset: 0
  };
  read_page(File,0,MDB_PAGE_SIZE,page.bind(MDB));

  return MDB;
}




/**
* RC4
*/
var rc4 = (function(){
  return {
    /**
    * generate a RC4 cipher
    */
    gen_key: function(Key){ // taken from wikipedia
      var i, J=0, S = [], L = Key.length, H;
      for (i = 0; i < 256; i++)
		    S[i] = i;
      for (i = 0; i < 256; i++) {
        J = (J + S[i] + Key.charCodeAt(i % L)) % 256;
        H = S[i]; S[i] = S[J]; S[J] = H;
      }
      return S;
    },

    /**
    * RC4 encode/decode inplace
    */
    encode: function(Cipher, Data){
      var C = Cipher.slice(0);
      var D = new Uint8Array(Data);
      var n, I = 0, J = 0, H, L = D.length;
      for (n = 0; n < L; n++) {
		    I = (I + 1) % 256;
		    J = (J + C[I]) % 256;
        H = S[I]; S[I] = S[J]; S[J] = H;
		    D[n] = D[n]^ S[(S[I] + S[J]) % 256];
      }
      return Data;
    }
  };
})();
