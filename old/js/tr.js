/* Tabular Rasa JS
** Copyright (c) 2018 Benjamin Benno Falkner
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

var TabularRasa =(function(){

    // Dynamic Images as background
    var ImageBackground = function (type_name) { 
        var list = document.querySelectorAll("div["+type_name+"]");
        for (var i = 0; i < list.length; i++) {
            var url = list[i].getAttribute(type_name);
            list[i].style.backgroundImage="url('" + url + "')";
        }
    };

    // Create clean code
    var EntityMap = {"&": "&amp;","<": "&lt;",">": "&gt;",'"': '&quot;',"'": '&#39;',"/": '&#x2F;'};
    var escapeHtml = function (string) { return String(string).replace(/[&<>"'\/]/g, function (s) { return EntityMap[s]; }); };
    var CleanCode = function (cl_name) {
        codeElem = document.querySelectorAll(cl_name);
        codeElem.forEach(function(elem) {
          var newContent = escapeHtml(elem.innerHTML)
          elem.innerHTML = newContent;
        });
    };
    
    var OffsetTop = function(element) {
        var top = 0;
        do {
            top += element.offsetTop  || 0;
            element = element.offsetParent;
        } while(element);
    
        return top;
    };

    // create fixed toolbar
    var FixedToolbar = function (name){
        this.Nav = document.querySelectorAll(name)[0];
        if (this.Nav == null) {
            console.log("no fixed toolbar");
            return;
        }
        this.NavBarOffset = OffsetTop(this.Nav);
        window.addEventListener('scroll', this.scroll.bind(this));
        window.addEventListener('resize',this.resize.bind(this));
    };
    
    FixedToolbar.prototype.scroll = function(){
        if(this.NavBarOffset < window.scrollY && !this.Nav.classList.contains('fixed')) {
            this.Nav.classList.add('fixed');
        }
        if(this.NavBarOffset > window.scrollY && this.Nav.classList.contains('fixed')) {
            this.Nav.classList.remove('fixed');
        }
    };
    
    FixedToolbar.prototype.resize = function(){
        this.Nav.classList.remove('fixed');
        this.NavBarOffset = OffsetTop(this.Nav);
        this.scroll();
    };



    // auto exec on default elements
    CleanCode('.clean-code');
    ImageBackground('data-image');
    new FixedToolbar('.menubar');

    return {
        clean_code: CleanCode,
        image_background: ImageBackground,
        fixed_toolbar: FixedToolbar
    };
})();