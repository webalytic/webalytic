!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(1);!function(e){var t,n=e.WebAlyticObject,o=new r.default;if(e[n]&&(t=e[n].q,"[object Array]"===Object.prototype.toString.call(t)))for(var i=0;i<e[n].q.length;i+=1){var s=e.WebAlyticSDK[i],c=s[0],u=s[1];o.push(c,u)}window.WebAlyticSDK=o.push.bind(o)}(window)},function(e,t,n){"use strict";var r,o;Object.defineProperty(t,"__esModule",{value:!0}),function(e){e.create="create",e.send="send"}(r||(r={})),function(e){e.PAGEVIEW="pageview",e.EVENT="event"}(o||(o={}));var i=window.location,s=window.screen,c=function(){function e(){this.isInitialized=!1}return e.prototype.getCookie=function(e){for(var t=e+"=",n=document.cookie.split(";"),r=0;r<n.length;r+=1){for(var o=n[r];" "===o.charAt(0);)o=o.substring(1);if(0===o.indexOf(t))return o.substring(t.length,o.length)}return""},e.prototype.getTopHost=function(){var e=i.hostname;return i.hostname.split(".").length>2&&(e=i.hostname.split(".").reverse().slice(0,2).reverse().join("."),~["msk.ru","com.br"].indexOf(e)&&(e=i.hostname.split(".").reverse().slice(0,3).reverse().join("."))),e},e.prototype.setCookie=function(e,t){var n=new Date;n.setTime(n.getTime()+31536e7);var r="expires="+n.toUTCString();document.cookie=e+"="+t+";"+r+";domain="+this.getTopHost()+";path=/;SameSite=None;Secure"},e.prototype.generatreUID=function(){return"10000000-1000-4000-8000-100000000000".replace(/1|0/g,(function(){return(0|16*Math.random()).toString(16)})).replace(/-/g,"")},e.prototype.findOrCreateUID=function(){var e=this.getCookie("_wbltc.uid");return e&&32===e.length||(e=this.generatreUID(),this.setCookie("_wbltc.uid",e)),e},e.prototype.getCustomDimensionsAndMetrics=function(e){return Object.keys(e).filter((function(e){return/^(dimension|metric)([1-9]|[1-9][0-9]|[1][0-9][0-9])$/.test(e)})).map((function(t){return[t.replace("dimension","cd").replace("metric","cm"),e[t]].join("=")}))},e.prototype.sendPostRequest=function(e,t){e.push("cid="+this.findOrCreateUID()),e.push("tid="+this.config.resourceId),e.push("z="+Math.random()),e.push("sr="+[s.width,s.height].join("x")),e.push("ds=sdk");var n=[this.config.apiUrl,"/collect","?",e.join("&")].join("");if(window.navigator.sendBeacon){var r=new Blob([JSON.stringify(t||{})],{type:"text/plain"});window.navigator.sendBeacon(n,r)}else{var o=new XMLHttpRequest;o.open("POST",n,!0),o.withCredentials=!0;var i=JSON.stringify(t);o.send(i)}},e.prototype.create=function(e){if(!e.apiUrl)throw new TypeError("WebAlyticSDK: Init must set api url");if(!e.resourceId)throw new TypeError("WebAlyticSDK: Init must set resourceId");if(this.isInitialized)throw new Error("WebAlyticSDK: WebAlyticSDK already init");this.config=e,this.isInitialized=!0},e.prototype.send=function(e){switch(e.hitType){case o.PAGEVIEW:this.pageview(e);break;case o.EVENT:this.event(e)}},e.prototype.pageview=function(e){var t=encodeURIComponent(document.URL),n=encodeURIComponent(document.referrer);this.sendPostRequest(["t=pageview","dl="+t,"dr="+n].concat(this.getCustomDimensionsAndMetrics(e||[])))},e.prototype.event=function(e){this.sendPostRequest(["t=event","ec="+e.category,"ea="+e.action,"el="+e.label,"ev="+e.value].concat(this.getCustomDimensionsAndMetrics(e)))},e.prototype.push=function(e,t){try{this[e](t)}catch(e){console.error(e)}},e}();t.default=c}]);