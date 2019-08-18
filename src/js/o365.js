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

import * as oauth from './oauth.js'


export function get_user(OAuth, Id, Cb) {
    oauth.get(OAuth, "https://graph.microsoft.com/beta/"+Id, "json" ,[], Cb);
}

export function get_group(OAuth, Id, Cb) {
    oauth.get(OAuth, "https://graph.microsoft.com/beta/groups/"+Id, "json" ,[], Cb);
}

export function get_groups(OAuth, Cb) {
    oauth.get(OAuth, "https://graph.microsoft.com/beta/groups/", "json" ,[], Cb);
}

export function get_group_members(OAuth, Id, Cb) {
    oauth.get(OAuth, "https://graph.microsoft.com/beta/groups/"+Id+"/members", "json" ,[], Cb);
}

// function fold(Fun,Acc,List) {
//     var i, Keys = Object.keys(List)
//     for (i = 0; i < Keys.length; i++) {
//         Acc = Fun(Keys[i],List[Keys[i]],Acc);
//     }
//     return Acc;
// }
import {fold} from "./maps.js";

function get_concat (S,D){
    if(S === 200){
        this.data = (this.data) ? this.data.concat(D.value) : D.value;
        if (D["@odata.nextLink"]) { // receive more groups
            oauth.get(this.oauth,
                D["@odata.nextLink"],
                "json",
                [],
                get_concat.bind(this));
        } else {
            this.cb(S,this.data);
        }
    } else {
        this.cb(S,(this.data)? this.data:[]);
    }
}



export var users = (function(){
    return {
        //create: function (OAuth, Cb){},
        //remove: function (OAuth, Cb){},
        list:   function (OAuth, Cb){
            oauth.get(OAuth,
                "https://graph.microsoft.com/beta/users/?$select=id,displayName,givenName,surname,mail",
                "json", [],
                get_concat.bind({oauth:OAuth, cb: Cb}));
        },
        list_by_group: function(OAuth, Gid, Cb){
            teams.get_gid(OAuth,Gid,function(S,D){
                    if( S === 200 ){
                        oauth.get(OAuth,
                            "https://graph.microsoft.com/beta/groups/"+D+"/members/?$select=id,displayName,givenName,surname,mail",
                            "json",
                            [],
                            get_concat.bind(this));
                    }
                }.bind({oauth:OAuth, cb: Cb})
            );
        },
        search: function (OAuth, Value, Cb){ // use values
            // explicite search
            var S = fold(function(K,V,Acc){return Acc+K+"+eq+'"+V+"'+and+"},"",Value).slice(0,-5);
            oauth.get(OAuth,
                "https://graph.microsoft.com/beta/users?$filter="+S+"&$select=id,displayname",
                "json",
                [],
                function(S,D){
                    if( S === 200 && D.value.length > 0){ // results
                        if (D.value.length === 1)// one hit
                            this.cb(S,D.value[0].id);
                        else  // multiple hits
                            this.cb(300, D.value);
                    } else { // more fuzzy search
                        S = fold(function(K,V,Acc){return "startswith("+K+",'"+V+"')+and+"},"",Value).slice(0,-5);
                        oauth.get(this.oauth,
                            "https://graph.microsoft.com/beta/users?$filter="+S+"&$select=id,displayname",
                            "json",
                            [],
                            function(S,D){
                                if( S === 200 && D.value.length > 0){ // results
                                    if (D.value.length === 1)// one hit
                                        this.cb(S,D.value[0].id);
                                    else  // multiple hits
                                        this.cb(300, D.value);
                                } else {
                                    S = fold(function(K,V,Acc){return Acc+"startswith("+K+",'"+V+")'+or+"},"",Value).slice(0,-4);
                                    oauth.get(this.oauth,
                                        "https://graph.microsoft.com/beta/users?$filter="+S+"&$select=id,displayname",
                                        "json",
                                        [],
                                        function(S,D){
                                            if( S === 200  && D.value.length > 0){ // results
                                                if (D.value.length === 1)// one hit
                                                    this.cb(S,D.value[0].id);
                                                else  // multiple hits
                                                    this.cb(300, D.value);
                                            } else {
                                                this.cb((S === 200)? 404 : S, D);
                                            }
                                        }.bind(this)
                                    );
                                }
                            }.bind(this)
                        );
                    }

                }.bind({oauth:OAuth, cb: Cb})
            );
        }
    };
})();

export var teams = (function(){
    return {
        create: function (OAuth, Settings, Cb){
            var Conf ={
                "template@odata.bind": "https://graph.microsoft.com/beta/teamsTemplates('"+ Settings.template || "standard" +"')",
                displayName: Settings.name,
                description: Settings.desc || "Auto Gen",
                memberSettings: {
                    allowCreateUpdateChannels: false
                },
                messagingSettings: {
                    allowUserEditMessages: true,
                    allowUserDeleteMessages: false
                },
                funSettings: {
                    allowGiphy: true,
                    giphyContentRating: "strict"
                }
            };
            teams.get_gid(OAuth,Settings.name, function(S,D){
                if( S != 200 ){
                    oauth.post(this.oauth,
                        "https://graph.microsoft.com/beta/teams",
                        "",
                        {"Content-Type": "application/json"},
                        JSON.stringify(this.conf),
                        function(S,D,H){
                            if(S === 202) {
                                this.cb(S,H["Content-Location"].splice(8));
                            } else
                                this.cb(S,D);
                        }.bind(this));
                } else
                    this.cb(409,D);
            }.bind({oauth:OAuth, cb: Cb, conf: Conf}));
        },

        get_gid: function (OAuth, Gid, Cb) {
            teams.get(OAuth,Gid,function(S,D){
                    if(S === 200 && D.value.length === 1 && D.value[0].id === Gid) { // it is a valid gid
                        this.cb(S,Gid);
                    } else { // try search
                        oauth.get(this.oauth,
                            "https://graph.microsoft.com/beta/groups?$filter=startswith(displayName,'"+Gid
                                +"')+or+startswith(mail,'"+Gid
                                +"')&$select=id,displayname",
                            "json",
                            [],
                            function(S,D){
                                if( S === 200){
                                    if( D.value.length === 1)
                                        this.cb(S,D.value[0].id);
                                    else if ( D.value.length > 1 )
                                        this.cb(300,D.value);
                                    else
                                        this.cb(404,D);
                                } else {
                                    this.cb(S,D)
                                }
                            }.bind(this)
                        );
                    }
                }.bind({oauth:OAuth, cb: Cb})
            );
        },
        //get_:
        get: function (OAuth, Gid, Cb) {
            oauth.get(OAuth,"https://graph.microsoft.com/beta/groups/"+Gid+"/?$select=id,displayname",
                "json",[],CB);
        },
        add_member: function (OAuth, Gid, Uid, Cb){
            oauth.post(OAuth,
                "https://graph.microsoft.com/beta/groups/"+Gid+"/members/$ref",
                "",
                {"Content-Type": "application/json"},
                JSON.stringify({"@odata.id": "https://graph.microsoft.com/beta/users/"+Uid}),
                Cb);
        },
        rm_member:  function (OAuth, Gid, Uid, Cb){
            oauth.remove(OAuth, "https://graph.microsoft.com/beta/groups/"+Gid+"/members/"+Uid+"/$ref", "", {}, Cb);
        },
        add_owner:  function (OAuth, Gid, Uid, Cb){
            oauth.post(OAuth,
                "https://graph.microsoft.com/beta/groups/"+Gid+"/owners/$ref",
                "",
                {"Content-Type": "application/json"},
                JSON.stringify({"@odata.id": "https://graph.microsoft.com/beta/users/"+Uid}),
                Cb);
        },
        rm_owner:  function (OAuth, Gid, Uid, Cb){
            oauth.remove(OAuth, "https://graph.microsoft.com/beta/groups/"+Gid+"/owners/"+Uid+"/$ref", "", {}, Cb);
        },
        remove: function (OAuth, Gid, Cb){
            oauth.remove(OAuth, "https://graph.microsoft.com/beta/groups/"+Gid, "", {}, Cb);
        },
        list_members: function(OAuth, Gid, Cb){
            oauth.get(OAuth,
                "https://graph.microsoft.com/beta/groups/"+D+"/members/?$select=id,displayName,givenName,surname,mail",
                "json", [],  get_concat.bind({oauth:OAuth, cb: Cb}));
        },
        list_owners: function(OAuth, Gid, Cb){
            oauth.get(OAuth,
                "https://graph.microsoft.com/beta/groups/"+D+"/owners/?$select=id,displayName,givenName,surname,mail",
                "json", [], get_concat.bind({oauth:OAuth, cb: Cb}));
        },
        // list all groups
        list_all: function(OAuth, Cb){
            oauth.get(OAuth,
                "https://graph.microsoft.com/beta/groups/?$select=id,displayname,createdDateTime,expirationDateTime",
                "json", [], get_concat.bind({oauth:OAuth, cb: Cb}));
        },
        // list all teams
        list:   function (OAuth, Cb){
            oauth.get(OAuth,
                "https://graph.microsoft.com/beta/groups/?$select=id,displayname,createdDateTime,expirationDateTime&$filter=groupTypes/any(c:c+eq+'Unified')",
                "json", [], get_concat.bind({oauth:OAuth, cb: Cb}));
        }
    };
})();
