var stimer, vtimer;

function downloadJSAtOnload() {

  var temp = document.getElementsByTagName("ion-app1");
  var loading2 = '';
  if (!localStorage.current || (localStorage.current.indexOf("\"instance\"") - localStorage.current.indexOf("\"key\"") < 56))
    localStorage.dash_cache = "";
  else
  {
    loading2 = '<img id=preload class=Absolute-Center src=img/loading2.gif alt="Loading...">';
    var a=new XMLHttpRequest();a.open("GET","http://api.sherpadesk.com/ping",!0);
    var c = JSON.parse(localStorage.getItem("current") || "null") || {};
    a.setRequestHeader("Authorization","Basic "+ btoa(c.org+"-"+c.inst+":"+c.key));a.send();
  }

  var dash_cache = localStorage.dash_cache || '<ion-loading role="dialog" class="loading-cmp"><div class="backdrop" disable-activated="" role="presentation"></div><div class="loading-wrapper loading-wrapper1" style="opacity: 1;  transform: scale(1);"><div class="loading-spinner"><img src="img/loading2.gif"></div><div class="loading-content">Loading Your Profile...</div></div></ion-loading><ion-nav id="nav" swipe-back-enabled="false" class="menu-content menu-content-reveal has-views" style="touch-action: pan-y; -webkit-user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); transform: translateX(0px);"><div></div><ion-page _ngcontent-tcs-14="" class="login-page show-page" style="z-index: 99;"><ion-content class="login" padding=""><scroll-content><div class="list max-width"><a title="Support Portal" href="https://support.sherpadesk.com/portal/"><img class="imglogo img-padding" src="img/logo.png"></a><form novalidate=""><div class="tooltips"><input disabled class="width100 blue3 subject-create commentText ng-untouched ng-pristine ng-valid" ngcontrol="email" pattern="^[^@\s]+@[^@\s]+(\.[^@\s]+)+$" placeholder="email" required="" type="email"> <!--template bindings={}--></div><br><div class="tooltips"><input disabled class="width100 blue3 subject-create commentText ng-untouched ng-dirty ng-valid" ngcontrol="password" placeholder="password" required="" type="password"> <!--template bindings={}--></div><br><button block="" class="login-margin disable-hover button button-default button-block button-secondary" secondary="" type="submit"><span class="button-inner">Login</span><ion-button-effect></ion-button-effect></button><br></scroll-content></ion-content></ion-page><div nav-portal=""></div></ion-nav>';

  var element;

  if (localStorage.getItem("isPhonegap") === "true" && localStorage.getItem("version") == "24"){
    element = document.createElement("script");
    element.src = "build/js/cordova.js";
    document.body.appendChild(element);
  }

  element = document.createElement("script");
  element.src = "build/js/es6-shim.min.js";
  document.body.appendChild(element);

  element = document.createElement("script");
  element.src = "build/js/shims_for_IE.js";
  document.body.appendChild(element);

  element = document.createElement("script");
  element.src = "build/js/Reflect.js";
  document.body.appendChild(element);

  element = document.createElement("script");
  element.src = "build/js/zone.min.js";
  document.body.appendChild(element);

  element = document.createElement( "link" );
  element.href = "http://m.sherpadesk.com/build/css/app.ios.css";
  element.rel = "stylesheet";
  document.body.appendChild(element);

  element = document.createElement("script");
  element.src = "build/js/vendor.bundle.js";
  document.body.appendChild(element);

  element = null;

setTimeout(function(){
  vtimer = setInterval(reloadScript, 500);
}, localStorage.isPhonegap !== "true" ? 500 : 200);

  if (temp && temp[0] && dash_cache)
    stimer = setInterval( function(){
      if (checksloaded())
      {
          clearInterval(stimer);
    temp[0].innerHTML = loading2 + dash_cache;
      temp = null;
  dash_cache = null;
  loading2 = null;
}
}, 500);

}

function reloadScript()
{
  console.log('error');
  var element1 = document.createElement("script");
  element1.src = "build/js/app.bundle.js";
  document.body.appendChild(element1);
  element1 = null;
}

function checksloaded(){
    var ss = document.styleSheets;
    for (var i = 0, max = ss.length; i < max; i++) {
        if (ss[i].href == "http://m.sherpadesk.com/build/css/app.ios.css"){
          return true;
        }
    }
    return false;
}

if (window.addEventListener)
  window.addEventListener("load", downloadJSAtOnload, false);
else if (window.attachEvent)
  window.attachEvent("onload", downloadJSAtOnload);
else window.onload = downloadJSAtOnload;


function detectIE() {
  var ua = window.navigator.userAgent;

  var msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  var trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11 => return version number
    var rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  var edge = ua.indexOf('Edge/');
  if (edge > 0) {
    // Edge (IE 12+) => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  }
  return false;
}

//Operating on classes doesn't work with SVG elements in IE 11
if (detectIE) {
  if (!("classList" in document.createElementNS("http://www.w3.org/2000/svg","g"))) {
    var descr = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'classList');
    Object.defineProperty(SVGElement.prototype, 'classList', descr);
  }
//remove() as a method on HTMLElements is quite new and not yet supported by Internet Explorer.
Element.prototype.remove = function() {
  this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
  for(var i = this.length - 1; i >= 0; i--) {
    if(this[i] && this[i].parentElement) {
      this[i].parentElement.removeChild(this[i]);
    }
  }
}
}

    //preload image
    var img1 = new Image();
    img1.src = "img/close.png";
    //preload image
    var img2 = new Image();
    img2.src = "img/loading2.gif";

    window.onbeforeunload = function (evt) {
      if (window.dash || "")
        localStorage.setItem("dash_cache", window.dash || ""); 
      return;  
      var message = "Are you sure you want to leave? All app cache and unsaved changes will be lost...";
      if (typeof evt == "undefined") {
        evt = window.event;
      }
      if (evt) {
        evt.returnValue = message;
      }
      return message;
    }

    function handleOpenURL(url) {
      //localStorage.setItem('ios_action', url.substring(13));
    // First create the event

    if (url) {
      var val = url.substring(13);
      val = val.split(":");
      url = {};
      url[val[0]] = val[1];

      //console.log("initial url: " + url);
      var myEvent = document.createEvent('CustomEvent');
      myEvent.initCustomEvent('handle', false, false, url);
      document.dispatchEvent(myEvent);
    }
  }

  var _gaq = _gaq || [];

  function googleTag() {
    _gaq.push(['_setAccount', 'UA-998328-15']);
    _gaq.push(['_trackPageview']);
    (function() {
      var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
      ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
  }

//googleTag();

function googleConversion()
{
  var img = new Image();
  var div = document.getElementsByTagName('body')[0];

  img.onload = function() {
    div.appendChild(img);
  };

  img.src = 'http://www.googleadservices.com/pagead/conversion/1040470683/?value=1.00&currency_code=USD&label=KRf-CIfZrQQQm6WR8AM&guid=ON&script=0';
}

//googleConversion();
