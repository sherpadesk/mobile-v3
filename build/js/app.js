var isSD=!0,Site=isSD?"sherpadesk.com/":"bigwebapps.com/",MobileSite="https://m."+Site,ApiSite="https://api."+Site,vtimer,scripts=document.getElementsByTagName("script"),param=scripts[scripts.length-1],param=(param=param.src.split("?")[1])?"?"+param:"",scripts=null;function check(){var b=document.getElementsByTagName("ion-app1");b&&b[0]&&location.reload()}
function downloadJSAtOnload(){setTimeout(check,"true"==localStorage.isPhonegap ? 40E3 : 15E3);var b=document.getElementsByTagName("ion-app1");if("true"==localStorage.isPhonegap){var a=document.createElement("style");a.type="text/css";a.styleSheet?a.styleSheet.cssText="ion-app1 scroll-content {padding-top: 36px  !important;} ion-app1 ion-navbar {top: 20px  !important;} ":a.appendChild(document.createTextNode("ion-app1 scroll-content {padding-top: 36px  !important;} ion-app1 ion-navbar {top: 20px  !important;} "));document.getElementsByTagName("head")[0].appendChild(a)}var c=
"";if(!localStorage.current||56>localStorage.current.indexOf('"instance"')-localStorage.current.indexOf('"key"'))localStorage.dash_cache="";else{c='<img id=preload class=Absolute-Center src=img/loading2.gif alt="Loading...">';a=new XMLHttpRequest;a.open("GET",ApiSite+"ping",!0);var d=JSON.parse(localStorage.getItem("current")||"null")||{};a.setRequestHeader("Authorization","Basic "+btoa(d.org+"-"+d.inst+":"+d.key));a.send()}var e=localStorage.dash_cache||'<ion-loading role="dialog" class="loading-cmp"><div class="backdrop" disable-activated="" role="presentation"></div><div class="loading-wrapper loading-wrapper1" style="opacity: 1;  transform: scale(1);"><div class="loading-spinner"><img src="img/loading2.gif"></div><div class="loading-content">Loading Your Profile...</div></div></ion-loading><ion-nav id="nav" swipe-back-enabled="false" class="menu-content menu-content-reveal has-views" style="touch-action: pan-y; -webkit-user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); transform: translateX(0px);"><div></div><ion-page _ngcontent-tcs-14="" class="login-page show-page" style="z-index: 99;"><ion-content class="login" padding=""><scroll-content><div class="list max-width"><a title="Support Portal" href="https://support.sherpadesk.com/portal/"><img class="imglogo img-padding" src="img/logo.png"></a><form novalidate=""><div class="tooltips"><input disabled class="width100 blue3 subject-create commentText ng-untouched ng-pristine ng-valid" ngcontrol="email" pattern="^[^@s]+@[^@s]+(.[^@s]+)+$" placeholder="email" required="" type="email"> \x3c!--template bindings={}--\x3e</div><br><div class="tooltips"><input disabled class="width100 blue3 subject-create commentText ng-untouched ng-dirty ng-valid" ngcontrol="password" placeholder="password" required="" type="password"> \x3c!--template bindings={}--\x3e</div><br><button block="" class="login-margin disable-hover button button-default button-block button-secondary" secondary="" type="submit"><span class="button-inner">Login</span><ion-button-effect></ion-button-effect></button><br></scroll-content></ion-content></ion-page><div nav-portal=""></div></ion-nav>';
("true"===localStorage.getItem("isPhonegap") || navigator.userAgent.match(/(Android)/))&&(a=document.createElement("script"),a.src=(localStorage.getItem("isIos") !== "true" && navigator.userAgent.match(/(Android)/) ? "build/js/android/cordova.js" : "build/js/cordova.js"),document.body.appendChild(a));if("true"===localStorage.getItem("isPhonegap")||"function"!==typeof Map)a=document.createElement("script"),a.src="build/js/es6-shim.min.js",document.body.appendChild(a);a=document.createElement("script");a.src="build/js/shims_for_IE.js";document.body.appendChild(a);a=document.createElement("script");a.src="build/js/Reflect.js";document.body.appendChild(a);a=document.createElement("script");
a.src="build/js/zone.min.js";document.body.appendChild(a);a=document.createElement("link");a.href="build/css/app.ios.css";a.rel="stylesheet";document.body.appendChild(a);a=document.createElement("link");a.href=MobileSite+"build/css/my.css"+param;a.rel="stylesheet";document.body.appendChild(a);a=document.createElement("script");a.src="build/js/vendor.bundle.js";document.body.appendChild(a);a=null;setTimeout(function(){vtimer=setInterval(reloadScript,1E3)},"true"!==localStorage.isPhonegap?500:200);
b&&b[0]&&e&&setTimeout(function(){b[0].innerHTML=c+e;c=e=b=null},500)}function reloadScript(){if(!window.t1){var b=document.createElement("script");b.src=MobileSite+"build/js/app.bundle.js"+param;document.body.appendChild(b)}}window.addEventListener?window.addEventListener("load",downloadJSAtOnload,!1):window.attachEvent?window.attachEvent("onload",downloadJSAtOnload):window.onload=downloadJSAtOnload;
function detectIE(){var b=window.navigator.userAgent,a=b.indexOf("MSIE ");if(0<a)return parseInt(b.substring(a+5,b.indexOf(".",a)),10);if(0<b.indexOf("Trident/"))return a=b.indexOf("rv:"),parseInt(b.substring(a+3,b.indexOf(".",a)),10);a=b.indexOf("Edge/");return 0<a?parseInt(b.substring(a+5,b.indexOf(".",a)),10):!1}
if(detectIE){if(!("classList"in document.createElementNS("http://www.w3.org/2000/svg","g"))){var descr=Object.getOwnPropertyDescriptor(HTMLElement.prototype,"classList");Object.defineProperty(SVGElement.prototype,"classList",descr)}Element.prototype.remove=function(){this.parentElement.removeChild(this)};NodeList.prototype.remove=HTMLCollection.prototype.remove=function(){for(var b=this.length-1;0<=b;b--)this[b]&&this[b].parentElement&&this[b].parentElement.removeChild(this[b])}}var img1=new Image;
img1.src="img/close.png";var img2=new Image;img2.src="img/loading2.gif";window.onbeforeunload=function(b){window.dash&&localStorage.setItem("dash_cache",window.dash||"")};function handleOpenURL(b){if(b){var a=b.substring(13),a=a.split(":");b={};b[a[0]]=a[1];a=document.createEvent("CustomEvent");a.initCustomEvent("handle",!1,!1,b);document.dispatchEvent(a)}}var _gaq=_gaq||[];
function googleTag(){_gaq.push(["_setAccount","UA-998328-15"]);_gaq.push(["_trackPageview"]);var b=document.createElement("script");b.type="text/javascript";b.async=!0;b.src=("https:"==document.location.protocol?"https://ssl":"http://www")+".google-analytics.com/ga.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(b,a)}setTimeout(googleTag, 5000);
function googleConversion(){var b=new Image,a=document.getElementsByTagName("body")[0];b.onload=function(){a.appendChild(b)};b.src="http://www.googleadservices.com/pagead/conversion/1040470683/?value=1.00&currency_code=USD&label=KRf-CIfZrQQQm6WR8AM&guid=ON&script=0"}setTimeout(googleConversion, 5000); 