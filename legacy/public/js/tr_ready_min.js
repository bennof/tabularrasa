var tr_ready=function(){var n=!1,o=[],a=!1;function c(){"complete"===document.readyState&&d()}function d(){if(!n){n=!0;for(var t=0;t<o.length;t++)o[t].func.call(window,o[t].ctx);o=[]}}return{on_ready:function(t,e){if("function"!=typeof callback)throw new TypeError("callback for Ready(fn) must be a function");n?setTimeout(function(){t(e)},1):(o.push({func:t,ctx:e}),"complete"===document.readyState?setTimeout(d,1):a||(document.addEventListener?(document.addEventListener("DOMContentLoaded",d,!1),window.addEventListener("load",d,!1)):(document.attachEvent("onreadystatechange",c),window.attachEvent("onload",d)),a=!0))}}}();
//# sourceMappingURL=tr_ready_min.js.map