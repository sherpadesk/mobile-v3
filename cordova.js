!function(){var e,n,t="3.6.3";!function(){function t(n){var t=n.factory,r=function(t){var r=t;return"."===t.charAt(0)&&(r=n.id.slice(0,n.id.lastIndexOf(i))+i+t.slice(2)),e(r)};return n.exports={},delete n.factory,t(r,n.exports,n),n.exports}var r={},o=[],a={},i=".";e=function(e){if(!r[e])throw"module "+e+" not found";if(e in a){var n=o.slice(a[e]).join("->")+"->"+e;throw"Cycle in require graph: "+n}if(r[e].factory)try{return a[e]=o.length,o.push(e),t(r[e])}finally{delete a[e],o.pop()}return r[e].exports},n=function(e,n){if(r[e])throw"module "+e+" already defined";r[e]={id:e,factory:n}},n.remove=function(e){delete r[e]},n.moduleMap=r}(),"object"==typeof module&&"function"==typeof e&&(module.exports.require=e,module.exports.define=n),n("cordova",function(e,r,o){function a(e,n){var t=document.createEvent("Events");if(t.initEvent(e,!1,!1),n)for(var r in n)n.hasOwnProperty(r)&&(t[r]=n[r]);return t}var i=e("cordova/channel"),c=e("cordova/platform"),d=document.addEventListener,u=document.removeEventListener,s=window.addEventListener,l=window.removeEventListener,f={},v={};document.addEventListener=function(e,n,t){var r=e.toLowerCase();"undefined"!=typeof f[r]?f[r].subscribe(n):d.call(document,e,n,t)},window.addEventListener=function(e,n,t){var r=e.toLowerCase();"undefined"!=typeof v[r]?v[r].subscribe(n):s.call(window,e,n,t)},document.removeEventListener=function(e,n,t){var r=e.toLowerCase();"undefined"!=typeof f[r]?f[r].unsubscribe(n):u.call(document,e,n,t)},window.removeEventListener=function(e,n,t){var r=e.toLowerCase();"undefined"!=typeof v[r]?v[r].unsubscribe(n):l.call(window,e,n,t)};var p={define:n,require:e,version:t,platformId:c.id,addWindowEventHandler:function(e){return v[e]=i.create(e)},addStickyDocumentEventHandler:function(e){return f[e]=i.createSticky(e)},addDocumentEventHandler:function(e){return f[e]=i.create(e)},removeWindowEventHandler:function(e){delete v[e]},removeDocumentEventHandler:function(e){delete f[e]},getOriginalHandlers:function(){return{document:{addEventListener:d,removeEventListener:u},window:{addEventListener:s,removeEventListener:l}}},fireDocumentEvent:function(e,n,t){var r=a(e,n);"undefined"!=typeof f[e]?t?f[e].fire(r):setTimeout(function(){"deviceready"==e&&document.dispatchEvent(r),f[e].fire(r)},0):document.dispatchEvent(r)},fireWindowEvent:function(e,n){var t=a(e,n);"undefined"!=typeof v[e]?setTimeout(function(){v[e].fire(t)},0):window.dispatchEvent(t)},callbackId:Math.floor(2e9*Math.random()),callbacks:{},callbackStatus:{NO_RESULT:0,OK:1,CLASS_NOT_FOUND_EXCEPTION:2,ILLEGAL_ACCESS_EXCEPTION:3,INSTANTIATION_EXCEPTION:4,MALFORMED_URL_EXCEPTION:5,IO_EXCEPTION:6,INVALID_ACTION:7,JSON_EXCEPTION:8,ERROR:9},callbackSuccess:function(e,n){try{p.callbackFromNative(e,!0,n.status,[n.message],n.keepCallback)}catch(t){console.log("Error in success callback: "+e+" = "+t)}},callbackError:function(e,n){try{p.callbackFromNative(e,!1,n.status,[n.message],n.keepCallback)}catch(t){console.log("Error in error callback: "+e+" = "+t)}},callbackFromNative:function(e,n,t,r,o){var a=p.callbacks[e];a&&(n&&t==p.callbackStatus.OK?a.success&&a.success.apply(null,r):n||a.fail&&a.fail.apply(null,r),o||delete p.callbacks[e])},addConstructor:function(e){i.onCordovaReady.subscribe(function(){try{e()}catch(n){console.log("Failed to run constructor: "+n)}})}};o.exports=p}),n("cordova/argscheck",function(e,n,t){function r(e,n){return/.*?\((.*?)\)/.exec(e)[1].split(", ")[n]}function o(e,n,t,o){if(c.enableChecks){for(var a,u=null,s=0;s<e.length;++s){var l=e.charAt(s),f=l.toUpperCase(),v=t[s];if("*"!=l&&(a=i.typeName(v),(null!==v&&void 0!==v||l!=f)&&a!=d[f])){u="Expected "+d[f];break}}if(u)throw u+=", but got "+a+".",u='Wrong type for parameter "'+r(o||t.callee,s)+'" of '+n+": "+u,"undefined"==typeof jasmine&&console.error(u),TypeError(u)}}function a(e,n){return void 0===e?n:e}var i=(e("cordova/exec"),e("cordova/utils")),c=t.exports,d={A:"Array",D:"Date",N:"Number",S:"String",F:"Function",O:"Object"};c.checkArgs=o,c.getValue=a,c.enableChecks=!0}),n("cordova/base64",function(e,n){function t(e){for(var n,t=e.byteLength,r="",o=i(),c=0;t-2>c;c+=3)n=(e[c]<<16)+(e[c+1]<<8)+e[c+2],r+=o[n>>12],r+=o[4095&n];return t-c==2?(n=(e[c]<<16)+(e[c+1]<<8),r+=o[n>>12],r+=a[(4095&n)>>6],r+="="):t-c==1&&(n=e[c]<<16,r+=o[n>>12],r+="=="),r}var r=n;r.fromArrayBuffer=function(e){var n=new Uint8Array(e);return t(n)},r.toArrayBuffer=function(e){for(var n="undefined"!=typeof atob?atob(e):new Buffer(e,"base64").toString("binary"),t=new ArrayBuffer(n.length),r=new Uint8Array(t),o=0,a=n.length;a>o;o++)r[o]=n.charCodeAt(o);return t};var o,a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",i=function(){o=[];for(var e=0;64>e;e++)for(var n=0;64>n;n++)o[64*e+n]=a[e]+a[n];return i=function(){return o},o}}),n("cordova/builder",function(e,n){function t(e,n,t){for(var r in e)e.hasOwnProperty(r)&&n.apply(t,[e[r],r])}function r(e,t,r){n.replaceHookForTesting(e,t),e[t]=r,e[t]!==r&&c.defineGetter(e,t,function(){return r})}function o(e,n,t,o){o?c.defineGetter(e,n,function(){return console.log(o),delete e[n],r(e,n,t),t}):r(e,n,t)}function a(n,r,d,u){t(r,function(t,r){try{var s=t.path?e(t.path):{};d?("undefined"==typeof n[r]?o(n,r,s,t.deprecated):"undefined"!=typeof t.path&&(u?i(n[r],s):o(n,r,s,t.deprecated)),s=n[r]):"undefined"==typeof n[r]?o(n,r,s,t.deprecated):s=n[r],t.children&&a(s,t.children,d,u)}catch(l){c.alert("Exception building Cordova JS globals: "+l+' for key "'+r+'"')}})}function i(e,n){for(var t in n)n.hasOwnProperty(t)&&(e.prototype&&e.prototype.constructor===e?r(e.prototype,t,n[t]):"object"==typeof n[t]&&"object"==typeof e[t]?i(e[t],n[t]):r(e,t,n[t]))}var c=e("cordova/utils");n.buildIntoButDoNotClobber=function(e,n){a(n,e,!1,!1)},n.buildIntoAndClobber=function(e,n){a(n,e,!0,!1)},n.buildIntoAndMerge=function(e,n){a(n,e,!0,!0)},n.recursiveMerge=i,n.assignOrWrapInDeprecateGetter=o,n.replaceHookForTesting=function(){}}),n("cordova/channel",function(e,n,t){function r(e){if("function"!=typeof e)throw"Function required as first argument!"}var o=e("cordova/utils"),a=1,i=function(e,n){this.type=e,this.handlers={},this.state=n?1:0,this.fireArgs=null,this.numHandlers=0,this.onHasSubscribersChange=null},c={join:function(e,n){for(var t=n.length,r=t,o=function(){--r||e()},a=0;t>a;a++){if(0===n[a].state)throw Error("Can only use join with sticky channels.");n[a].subscribe(o)}t||e()},create:function(e){return c[e]=new i(e,!1)},createSticky:function(e){return c[e]=new i(e,!0)},deviceReadyChannelsArray:[],deviceReadyChannelsMap:{},waitForInitialization:function(e){if(e){var n=c[e]||this.createSticky(e);this.deviceReadyChannelsMap[e]=n,this.deviceReadyChannelsArray.push(n)}},initializationComplete:function(e){var n=this.deviceReadyChannelsMap[e];n&&n.fire()}};i.prototype.subscribe=function(e,n){if(r(e),2==this.state)return void e.apply(n||this,this.fireArgs);var t=e,i=e.observer_guid;"object"==typeof n&&(t=o.close(n,e)),i||(i=""+a++),t.observer_guid=i,e.observer_guid=i,this.handlers[i]||(this.handlers[i]=t,this.numHandlers++,1==this.numHandlers&&this.onHasSubscribersChange&&this.onHasSubscribersChange())},i.prototype.unsubscribe=function(e){r(e);var n=e.observer_guid,t=this.handlers[n];t&&(delete this.handlers[n],this.numHandlers--,0===this.numHandlers&&this.onHasSubscribersChange&&this.onHasSubscribersChange())},i.prototype.fire=function(){var e=Array.prototype.slice.call(arguments);if(1==this.state&&(this.state=2,this.fireArgs=e),this.numHandlers){var n=[];for(var t in this.handlers)n.push(this.handlers[t]);for(var r=0;r<n.length;++r)n[r].apply(this,e);2==this.state&&this.numHandlers&&(this.numHandlers=0,this.handlers={},this.onHasSubscribersChange&&this.onHasSubscribersChange())}},c.createSticky("onDOMContentLoaded"),c.createSticky("onNativeReady"),c.createSticky("onCordovaReady"),c.createSticky("onPluginsReady"),c.createSticky("onDeviceReady"),c.create("onResume"),c.create("onPause"),c.createSticky("onDestroy"),c.waitForInitialization("onCordovaReady"),c.waitForInitialization("onDOMContentLoaded"),t.exports=c}),n("cordova/exec",function(e,n,t){function r(){var e=document.createElement("iframe");return e.style.display="none",document.body.appendChild(e),e}function o(){var e=r();return e.contentWindow.history.replaceState(null,null,"file:///#"),e}function a(){if(f===b.XHR_WITH_PAYLOAD)return!0;if(f===b.XHR_OPTIONAL_PAYLOAD){for(var e=0,n=0;n<_.length;++n)e+=_[n].length;return 4500>e}return!1}function i(e){if(!e||"Array"!=g.typeName(e))return e;var n=[];return e.forEach(function(e){n.push("ArrayBuffer"==g.typeName(e)?{CDVType:"ArrayBuffer",data:m.fromArrayBuffer(e)}:e)}),n}function c(e){if("ArrayBuffer"==e.CDVType){var n=function(e){for(var n=new Uint8Array(e.length),t=0;t<e.length;t++)n[t]=e.charCodeAt(t);return n.buffer},t=function(e){return n(atob(e))};e=t(e.data)}return e}function d(e){var n=[];return e&&e.hasOwnProperty("CDVType")?"MultiPart"==e.CDVType?e.messages.forEach(function(e){n.push(c(e))}):n.push(c(e)):n.push(e),n}function u(){void 0===f&&(f=navigator.userAgent?-1==navigator.userAgent.indexOf(" 5_")?b.IFRAME_NAV:b.XHR_NO_PAYLOAD:b.IFRAME_NAV),window.webkit&&window.webkit.messageHandlers&&window.webkit.messageHandlers.cordova&&window.webkit.messageHandlers.cordova.postMessage&&(f=b.WK_WEBVIEW_BINDING);var e,n,t,r,o,a,c=null;if("string"!=typeof arguments[0])e=arguments[0],n=arguments[1],t=arguments[2],r=arguments[3],o=arguments[4],c="INVALID";else try{return a=arguments[0].split("."),r=a.pop(),t=a.join("."),o=Array.prototype.splice.call(arguments,1),void console.log('The old format of this exec call has been removed (deprecated since 2.1). Change to: cordova.exec(null, null, "'+t+'", "'+r+'",'+JSON.stringify(o)+");")}catch(d){}o=o||[],(e||n)&&(c=t+h.callbackId++,h.callbacks[c]={success:e,fail:n}),o=i(o);var u=[c,t,r,o];if(_.push(JSON.stringify(u)),f===b.WK_WEBVIEW_BINDING)window.webkit.messageHandlers.cordova.postMessage(u);else if(!O&&1==_.length)switch(f){case b.XHR_NO_PAYLOAD:case b.XHR_WITH_PAYLOAD:case b.XHR_OPTIONAL_PAYLOAD:s();break;default:l()}}function s(){y&&4!=y.readyState&&(y=null),y=y||new XMLHttpRequest,y.open("HEAD","/!gap_exec?"+ +new Date,!0),E||(E=/.*\((.*)\)/.exec(navigator.userAgent)[1]),y.setRequestHeader("vc",E),y.setRequestHeader("rc",++A),a()&&y.setRequestHeader("cmds",u.nativeFetchMessages()),y.send(null)}function l(){if(!document.body)return void setTimeout(l);if(f===b.IFRAME_HASH_NO_PAYLOAD||f===b.IFRAME_HASH_WITH_PAYLOAD){p=p||o(),p.contentWindow||(p=o()),w=3^w;var e="%0"+w;f===b.IFRAME_HASH_WITH_PAYLOAD&&(e+=u.nativeFetchMessages()),p.contentWindow.location.hash=e}else v=v||r(),v.contentWindow||(v=r()),(-1==navigator.userAgent.indexOf("Safari")&&-1==navigator.userAgent.indexOf("Presto")&&-1==navigator.userAgent.indexOf("Opera")&&-1==navigator.userAgent.indexOf("OPR")||-1!=navigator.userAgent.indexOf("Chrome"))&&(v.src="gap://ready")}var f,v,p,y,h=e("cordova"),g=(e("cordova/channel"),e("cordova/utils")),m=e("cordova/base64"),b={IFRAME_NAV:0,XHR_NO_PAYLOAD:1,XHR_WITH_PAYLOAD:2,XHR_OPTIONAL_PAYLOAD:3,IFRAME_HASH_NO_PAYLOAD:4,IFRAME_HASH_WITH_PAYLOAD:5,WK_WEBVIEW_BINDING:6},w=1,A=0,E=null,_=[],O=0;u.jsToNativeModes=b,u.setJsToNativeBridgeMode=function(e){v&&(v.parentNode.removeChild(v),v=null),f=e},u.nativeFetchMessages=function(){if(!_.length)return"";var e="["+_.join(",")+"]";return _.length=0,e},u.nativeCallback=function(e,n,t,r){return u.nativeEvalAndFetch(function(){var o=0===n||1===n,a=d(t);h.callbackFromNative(e,o,n,a,r)})},u.nativeEvalAndFetch=function(e){O++;try{return e(),u.nativeFetchMessages()}finally{O--}},t.exports=u}),n("cordova/exec/proxy",function(e,n,t){var r={};t.exports={add:function(e,n){return console.log("adding proxy for "+e),r[e]=n,n},remove:function(e){var n=r[e];return delete r[e],r[e]=null,n},get:function(e,n){return r[e]?r[e][n]:null}}}),n("cordova/init",function(e){function n(e){for(var n=0;n<e.length;++n)2!=e[n].state&&console.log("Channel not fired: "+e[n].type)}function t(e){var n=function(){};n.prototype=e;var t=new n;if(n.bind)for(var r in e)"function"==typeof e[r]&&(t[r]=e[r].bind(e));return t}var r=e("cordova/channel"),o=e("cordova"),a=e("cordova/modulemapper"),i=e("cordova/platform"),c=e("cordova/pluginloader"),d=[r.onNativeReady,r.onPluginsReady];window.setTimeout(function(){2!=r.onDeviceReady.state&&(console.log("deviceready has not fired after 5 seconds."),n(d),n(r.deviceReadyChannelsArray))},5e3),window.navigator&&(window.navigator=t(window.navigator)),window.console||(window.console={log:function(){}}),window.console.warn||(window.console.warn=function(e){this.log("warn: "+e)}),r.onPause=o.addDocumentEventHandler("pause"),r.onResume=o.addDocumentEventHandler("resume"),r.onDeviceReady=o.addStickyDocumentEventHandler("deviceready"),"complete"==document.readyState||"interactive"==document.readyState?r.onDOMContentLoaded.fire():document.addEventListener("DOMContentLoaded",function(){r.onDOMContentLoaded.fire()},!1),window._nativeReady&&r.onNativeReady.fire(),a.clobbers("cordova","cordova"),a.clobbers("cordova/exec","cordova.exec"),a.clobbers("cordova/exec","Cordova.exec"),i.bootstrap&&i.bootstrap(),setTimeout(function(){c.load(function(){r.onPluginsReady.fire()})},0),r.join(function(){a.mapModules(window),i.initialize&&i.initialize(),r.onCordovaReady.fire(),r.join(function(){e("cordova").fireDocumentEvent("deviceready")},r.deviceReadyChannelsArray)},d)}),n("cordova/init_b",function(e){function n(e){for(var n=0;n<e.length;++n)2!=e[n].state&&console.log("Channel not fired: "+e[n].type)}function t(e){var n=function(){};n.prototype=e;var t=new n;if(n.bind)for(var r in e)"function"==typeof e[r]&&(t[r]=e[r].bind(e));return t}var r=e("cordova/channel"),o=e("cordova"),a=e("cordova/platform"),i=[r.onDOMContentLoaded,r.onNativeReady];o.exec=e("cordova/exec"),window.setTimeout(function(){2!=r.onDeviceReady.state&&(console.log("deviceready has not fired after 5 seconds."),n(i),n(r.deviceReadyChannelsArray))},5e3),window.navigator&&(window.navigator=t(window.navigator)),window.console||(window.console={log:function(){}}),window.console.warn||(window.console.warn=function(e){this.log("warn: "+e)}),r.onPause=o.addDocumentEventHandler("pause"),r.onResume=o.addDocumentEventHandler("resume"),r.onDeviceReady=o.addStickyDocumentEventHandler("deviceready"),"complete"==document.readyState||"interactive"==document.readyState?r.onDOMContentLoaded.fire():document.addEventListener("DOMContentLoaded",function(){r.onDOMContentLoaded.fire()},!1),window._nativeReady&&r.onNativeReady.fire(),a.bootstrap&&a.bootstrap(),r.join(function(){a.initialize&&a.initialize(),r.onCordovaReady.fire(),r.join(function(){e("cordova").fireDocumentEvent("deviceready")},r.deviceReadyChannelsArray)},i)}),n("cordova/modulemapper",function(e,t){function r(e,n,t,r){if(!(n in d))throw new Error("Module "+n+" does not exist.");a.push(e,n,t),r&&(i[t]=r)}function o(e,n){if(!e)return n;for(var t,r=e.split("."),o=n,a=0;t=r[a];++a)o=o[t]=o[t]||{};return o}var a,i,c=e("cordova/builder"),d=n.moduleMap;t.reset=function(){a=[],i={}},t.clobbers=function(e,n,t){r("c",e,n,t)},t.merges=function(e,n,t){r("m",e,n,t)},t.defaults=function(e,n,t){r("d",e,n,t)},t.runs=function(e){r("r",e,null)},t.mapModules=function(n){var t={};n.CDV_origSymbols=t;for(var r=0,d=a.length;d>r;r+=3){var u=a[r],s=a[r+1],l=e(s);if("r"!=u){var f=a[r+2],v=f.lastIndexOf("."),p=f.substr(0,v),y=f.substr(v+1),h=f in i?"Access made to deprecated symbol: "+f+". "+h:null,g=o(p,n),m=g[y];"m"==u&&m?c.recursiveMerge(m,l):("d"==u&&!m||"d"!=u)&&(f in t||(t[f]=m),c.assignOrWrapInDeprecateGetter(g,y,l,h))}}},t.getOriginalSymbol=function(e,n){var t=e.CDV_origSymbols;if(t&&n in t)return t[n];for(var r=n.split("."),o=e,a=0;a<r.length;++a)o=o&&o[r[a]];return o},t.reset()}),n("cordova/platform",function(e,n,t){t.exports={id:"ios",bootstrap:function(){e("cordova/channel").onNativeReady.fire()}}}),n("cordova/pluginloader",function(e,t){function r(e,r,o,a){a=a||o,e in n.moduleMap?o():t.injectScript(r,function(){e in n.moduleMap?o():a()},a)}function o(e,n){for(var t,r=0;t=e[r];r++){if(t.clobbers&&t.clobbers.length)for(var o=0;o<t.clobbers.length;o++)c.clobbers(t.id,t.clobbers[o]);if(t.merges&&t.merges.length)for(var a=0;a<t.merges.length;a++)c.merges(t.id,t.merges[a]);t.runs&&c.runs(t.id)}n()}function a(e,n,t){function a(){--i||o(n,t)}var i=n.length;if(!i)return void t();for(var c=0;c<n.length;c++)r(n[c].id,e+n[c].file,a)}function i(){for(var e=null,n=document.getElementsByTagName("script"),t="/cordova.js",r="/phonegap.js",o=n.length-1;o>-1;o--){var a=n[o].src.replace(/\?.*$/,"");if(a.indexOf(t)==a.length-t.length){e=a.substring(0,a.length-t.length)+"/";break}if(a.indexOf(r)==a.length-r.length){e=a.substring(0,a.length-r.length)+"/";break}}return e}{var c=e("cordova/modulemapper");e("cordova/urlutil")}t.injectScript=function(e,n,t){var r=document.createElement("script");r.onload=n,r.onerror=t,r.src=e,document.head.appendChild(r)},t.load=function(n){var t=i();null===t&&(console.log("Could not find cordova.js script tag. Plugin loading may fail."),t=""),r("cordova/plugin_list",t+"cordova_plugins.js",function(){var r=e("cordova/plugin_list");a(t,r,n)},n)}}),n("cordova/urlutil",function(e,n){n.makeAbsolute=function(e){var n=document.createElement("a");return n.href=e,n.href}}),n("cordova/utils",function(e,n){function t(e){for(var n="",t=0;e>t;t++){var r=parseInt(256*Math.random(),10).toString(16);1==r.length&&(r="0"+r),n+=r}return n}var r=n;r.defineGetterSetter=function(e,n,t,r){if(Object.defineProperty){var o={get:t,configurable:!0};r&&(o.set=r),Object.defineProperty(e,n,o)}else e.__defineGetter__(n,t),r&&e.__defineSetter__(n,r)},r.defineGetter=r.defineGetterSetter,r.arrayIndexOf=function(e,n){if(e.indexOf)return e.indexOf(n);for(var t=e.length,r=0;t>r;++r)if(e[r]==n)return r;return-1},r.arrayRemove=function(e,n){var t=r.arrayIndexOf(e,n);return-1!=t&&e.splice(t,1),-1!=t},r.typeName=function(e){return Object.prototype.toString.call(e).slice(8,-1)},r.isArray=function(e){return"Array"==r.typeName(e)},r.isDate=function(e){return"Date"==r.typeName(e)},r.clone=function(e){if(!e||"function"==typeof e||r.isDate(e)||"object"!=typeof e)return e;var n,t;if(r.isArray(e)){for(n=[],t=0;t<e.length;++t)n.push(r.clone(e[t]));return n}n={};for(t in e)t in n&&n[t]==e[t]||(n[t]=r.clone(e[t]));return n},r.close=function(e,n,t){return"undefined"==typeof t?function(){return n.apply(e,arguments)}:function(){return n.apply(e,t)}},r.createUUID=function(){return t(4)+"-"+t(2)+"-"+t(2)+"-"+t(2)+"-"+t(6)},r.extend=function(){var e=function(){};return function(n,t){e.prototype=t.prototype,n.prototype=new e,n.__super__=t.prototype,n.prototype.constructor=n}}(),r.alert=function(e){window.alert?window.alert(e):console&&console.log&&console.log(e)}}),window.cordova=e("cordova"),e("cordova/init")}();