/* Tabular Rasa Core JavaScript
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
 * Office 365 Graph Api Tools
 * all functions are designed to perform async 
 * except init which has to succeed before usage
 * - Singelton - one connection
 */
var o365 = (function(){
    var State;

    /**
     * Initialize an office 365 context
     * @param {String} Tenant Azure Directory ID
     */
    var init = function(Tenant){
        State = OAuth2.init();
        State.tenant = Tenant;
    }

    /**
     * User handling
     */
    var users = (function(){
        return {
            get: null,
        };
    })();

    /**
     * Teams handling
     */
    var teams = (function(){
        return {
            new: null,
            delete: null,
            list: null,
            add: null,
            remove: null,
            add_owner: null,
            remove_owner: null
        };
    })();

    // export public
    return {
        init: init,
        users: users,
        teams: teams
    };
})();