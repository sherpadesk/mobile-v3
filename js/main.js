/*jshint -W004, -W041, -W103, eqeqeq: false, undef: true, latedef: true, eqnull: true, multistr: true*/
/*global jQuery, $, location, window, localStorage, navigator, document, cordova, setTimeout, console, alert, confirm, btoa, Image, history, setInterval, clearInterval, year, MobileSite, ApiSite, logout, backFunction, cleanQuerystring, getParameterByName, googleTag, appVersion, isSD, clearStorage, WebPullToRefresh, googleConversion, getappTrackConversion, AppSite, List, initOrgPreferences, default_redirect, displayPage, sideBar */

var Page = location.href.split('/').pop().split('?').shift();

var isExtension = window.self !== window.top;
if (isExtension) localStorage.setItem("referrer", Page);

var adMessage = "Accounts and Resolution features";

function updatedFunction ()
{
    location.reload(true);
}

function noop() {}

function getDateTimeFormat()
{ 
    return (localStorage.dateformat !== "1" ? "m/d/Y" : "d/m/Y") + (localStorage.timeformat !== "1" ? " h:i A" : " H:i");
}

function getDateTime(date)
{
    return new Date(date).dateFormat(getDateTimeFormat());   
}

//get the full name of the following options:firstname, lastname, email,name
function getFullName(firstname,lastname,email,name) {
    var fname = "";
    if (name)
        fname = name + " ";
    if (lastname)
        fname += lastname + " ";
    if (firstname)
        fname += firstname + " ";
    if (email && email.indexOf("@") > 0){
        if (!fname.trim())
            fname = email;
        else if (name)
            fname += " (" + email + ")";
    }
    return fname || "NoName";
}

var updateStatusBar = navigator.userAgent.match(/iphone|ipad|ipod/i) &&
    parseInt(navigator.appVersion.match(/OS (\d)/)[1], 10) >= 7;

//global config
var isTech = false,
    isProject = true,
    isTime = true,
    isAccount = true,
    isLevel = true,
    isClass = true,
    isLocation = true,
    isFreshbook = true,
    isExpenses = true,
    isTravelCosts = true,
    isInvoice = true,
    is_MultipleOrgInst = true,
    isLimitAssignedTkts = true,
    isConfirmationTracking = true,
    isResolutionTracking = true,
    isQueues = true;

var formatDate=function(a){if (!a || a.length < 12) return a;  var y=a.substring(0,4),e=a.substring(5,7),r=a.substring(8,10);switch(e){case"01":e="Jan";break;case"02":e="Feb";break;case"03":e="Mar";break;case"04":e="Apr";break;case"05":e="May";break;case"06":e="Jun";break;case"07":e="Jul";break;case"08":e="Aug";break;case"09":e="Sep";break;case"10":e="Oct";break;case"11":e="Nov";break;case"12":e="Dec";break;default:e="nul";}return e+"&nbsp;"+r + (year != y ? ("&nbsp;/&nbsp;" + y) : "");};

$.fn.show1 = function() {
    if (this[0]) 
        this[0].style.display = "block";
    //else
    //    console.log(this);
};

$.fn.hide1 = function() {
    if (this[0])
        this[0].style.display = "none";
    //else
    //    console.log(this);
};

//Cache settings
var cacheName = "", //current cache to kill on refresh
    cacheTime = 5000; // milliseconds before cache update 

function checkEmail(email) {
    return(email.trim().match(/^[^@\s]+@[^@\s]+(\.[^@\s]+)+$/i) !== null);
}

function checkURL(url) {
    if(!url)
        return false;
    return(url.trim().match(/(jpeg|jpg|gif|png)$/i) !== null);
}

if (typeof String.prototype.addUrlParam !== 'function') {
    String.prototype.addUrlParam = function(param, value) {
        if (!value || !param)
            return this;
        var pos = this.indexOf(param + '=');
        //if parameter exists
        if (pos != -1)
            return this.slice(0, pos + param.length) + '=' + value;
        var ch = this.indexOf('?') > 0 ? '&' : '?';
        return this + ch + param + '=' + value;
    };
}

//Phonegap specific
var isPhonegap = localStorage.isPhonegap === "true";
var isOnline = true;


//If User is Offline....................................
function errorLine(message){
    var func = "location.reload(false)";
    $("#scroller").hide();
    if (!$(".catch-error").length) {
        $('body').prepend('<div class="catch-error"><div class="catch-error-description"><h2>&nbsp;</h2><h2>&nbsp;</h2><h2>Something went wrong...</h2><div id="ctl00_PageBody_StackTrace" class="return-button"><p /><p /><h4>'+message+'</h4><h4>&nbsp;<p>P.S.  Uh... a Yeti just attacked your  camp!</h4><center><button class=loginButton loginGoogle style="width: 200px;" onclick="'+func+'">Refresh</button></center></div></div>');
    }
}

function offLine(){
    var func = "redirectToPage()";
    isOnline = false;
    if (!$(".catch-error").length && !window.dontClearCache) {
        $('body').prepend('<div class="catch-error"><div class="catch-error-description"><h2>&nbsp;</h2><h2>&nbsp;</h2><h2>Check your internet connection!</h2><div id="ctl00_PageBody_StackTrace" class="return-button"><p /><p /><h4>P.S.  Uh... a Yeti just attacked your  camp!</h4><center><button class=loginButton loginGoogle style="width: 200px;" onclick="'+func+'">Refresh</button></center></div></div>');
    }
}

function onLine (){
    if (!isOnline){
        $(".catch-error").remove();
        location.reload(false);
        //document.location.href = MobileSite + "login.html";
    }
    isOnline = true;
}

function redirectToPage() {
    if (navigator.onLine)
    {  if (isPhonegap) onLine();
     else
     {
         var img = document.body.appendChild(document.createElement("img"));
         img.style.display = 'none';
         img.onload = function () {
             onLine();
         };
         img.onerror = function () {
             offLine();
         };
         img.src = MobileSite + "img/select_arrow.png?rand=" + Math.random();
     }
    }
    else
    {
        offLine();
    }
}

function onDeviceReady() {
    //alert("gap init");
    localStorage.isPhonegap = "true";
    isPhonegap = true;
    if (updateStatusBar) {
        var t=document.getElementsByTagName("header")[0];
        if (t){
            t.style.paddingTop = "13px";
            t.style.height = "63px";
            $('body').css('margin-top', function (index, curValue) {
                return parseInt(curValue, 10) + 18 + 'px';
            });
        }
        t = document.getElementById("ptr");
        if (t){t.style.marginTop = "18px";}
        if (Page == "dashboard.html") $("#techStat").css("padding-top", "18px");
    }
    //if (Page == "login.html")
    //    getappTrackConversion();
    if (Page == "login.html" || (Page=="ticket_list.html" && !isTech) || Page=="dashboard.html")
        googleConversion();
}

document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("offline", offLine,false);
document.addEventListener("online", onLine ,false);

function updateBadge() {
    if (window.cordova && cordova.plugins.notification.badge){
        if (localStorage.badge > 0){
            cordova.plugins.notification.badge.set(localStorage.badge);
        }
        else
            cordova.plugins.notification.badge.clear();
    }
}

function isStorage() {
    var mod = 'modernizr';
    try {
        localStorage.setItem(mod, mod);
        localStorage.removeItem(mod);
        return true;
    } catch(e) {
        errorLine("Please enable Cookies to work with site!");
        return false;
    }
}

//open link	in blank
function openURL(urlString){
    return window.open(urlString, '_blank', 'location=no,EnableViewPortScale=yes');
}

//open link	in system
function openURLsystem(urlString){
    return window.open(urlString, '_system');
}

function reveal() {
    $("#loading").hide1();
    if ($("input.search").length)
        $("input.search").prop("readonly", "");
}

$(document).ajaxStop(function() {
    setTimeout(function(){ reveal();
                          $("body").show1();
                         }, 1000);
});

//global error handler
$( document ).ajaxError(function( event, request, settings ) {
    //console.log(event);
    //console.log(request);
    //console.log(settings);
    //        alert(request.statusText);
    //alert(request.responseText);
    //    alert(settings.url);
    if ((request.status == 403 && settings.url !== ApiSite + "organizations") || (request.status == 404 && settings.url === ApiSite + "config"))
    {
        logout(settings.url !== ApiSite + "login", request.statusText);
    }
    setTimeout(function(){ reveal();
                          $("body").show1(); console.log("ajaxError:"+request.statusText + " page: " + settings.url);
                          redirectToPage();}, 1000);
});

window.onerror = function(msg, url, line, col, error) {
    // Note that col & error are new to the HTML 5 spec and may not be 
    // supported in every browser.  It worked for me in Chrome.
    var extra = !col ? '' : '<p>column: ' + col;
    extra += !error ? '' : '<p>error: ' + error;

    // You can view the information in an alert to see things working like this:
    if (line > 0)
        setTimeout(function(){errorLine("<p onclick='$(\".err\").toggle();'>Click for Error Details:</p><div class=err style='display:none;'>" + msg + "<p>page: " + location.href + "<p>url: " + url + "<p>line: " + line + extra + "</div>");
                              reveal();
                              $("body").show1();console.log("onerror:"+msg + " page: " + location.href + " url: " + url + " line: " + line + extra);}, 2000);

    // TODO: Report this error via ajax so you can keep track
    //       of what pages have JS issues

    var suppressErrorAlert = true;
    // If you return true, then error alerts (like in older versions of 
    // Internet Explorer) will be suppressed.
    return suppressErrorAlert;
}; 

function PullToRefresh() { 
    if (typeof WebPullToRefresh === 'object') WebPullToRefresh.init( { loadingFunction: function(){ 
        if (cacheName === "dash")
        {
            localStorage.setItem("storageQueues", "");
            localStorage.setItem("storageAccountList", "");
            localStorage.setItem("ticketsStat", "");
        }
        else
            localStorage.setItem(cacheName, ""); 
        location.reload(false);}});}

//pull to refresh
window.addEventListener("DOMContentLoaded", PullToRefresh, false);

var noLoading = false;

function loading(isLoading) {
    if ($("input.search").length)
        $("input.search").prop("readonly", "readonly");
    if (!noLoading || isLoading)
        $("#loading").show1();
}

window.onbeforeunload = loading;

//global helper functions
function GooglelogOut(mess) {
    if (!isExtension && !confirm("Do you want to stay logged in Google account?")) {
        var logoutUrl = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=" + MobileSite;
        document.location.href = MobileSite + "login.html".addUrlParam("f",mess);
    }
    else
        window.location = "login.html" + mess;
}


function getInfo4Extension()
{
    if (isExtension)
    {
        var loginStr = "login?t=" + localStorage.getItem("userKey") +
            "&o=" + localStorage.getItem('userOrgKey') +
            "&i=" + localStorage.getItem('userInstanceKey'); 
        window.top.postMessage(loginStr,"*");
    }
}


function fullapplink (classn, urlString){
    if (isPhonegap) {
        //alert("gap!");
        $("."+classn).on('click', function (e) {
            e.preventDefault();
            openURLsystem(urlString);});
    } else if (isExtension) {

        $("."+classn).on('click', function (e) {
            e.preventDefault();
            //alert('Please register in new window and reopen Sherpadesk extension again.');
            var origOpenFunc = window.__proto__.open;
            origOpenFunc.apply(window, [urlString, "_blank"]); 
        });
    }
    else
    {
        $("."+classn).attr("target", "_blank");
        $("."+classn).attr("href", urlString);
    }

    return urlString;
}


//HTML encode
function htmlEscape(str) {
    return String(str)
        .replace(/&/g, '&amp;amp;')
        .replace(/&quot;/g, '&amp;quot;')
        .replace(/&apos;/g, '&amp;apos;')
        .replace(/&lt;/g, '&amp;lt;')
        .replace(/&gt;/g, '&amp;gt;')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    //.replace(/\n/g, "<br />")
    ;
}

//HTML decode
function symbolEscape(str) {
    return String(str)
    //.replace(/&lt;/g, '<')
    // .replace(/&gt;/g, '>')
    // .replace(/&quot;/g, '"')
    // .replace(/&apos;/g, "'")
    // .replace(/&/g, '&amp;')
        .replace(/&lt;br&gt;/gi, "\n")
        .replace(/<br\s*[\/]?>/gi, "\n")
        .replace(/\n/g, "<p></p>");

}

var userMessage = {
    init:function() {
        this.showMessage();
    },
    setMessage:function(isPos, messageText, func) {
        localStorage.setItem("userMessage", messageText);
        localStorage.setItem("isMessage", isPos ? "truePos" : "trueNeg");
        if(typeof func === 'function')
            setTimeout(func, 1500);
    },
    showMessage:function(isPos, messageText, func) {
        setTimeout(reveal, 500);
        if (typeof isPos === "undefined")
        {
            var isMessage = localStorage.getItem("isMessage");
            if(isMessage == "truePos")
            {isPos = true;localStorage.setItem("isMessage","false");}
            else if(isMessage == "trueNeg")
            {isPos = false;localStorage.setItem("isMessage","false");}
            else
                return;
        }

        if (!messageText)
        {
            messageText = localStorage.getItem("userMessage");
        }

        var messageEl = isPos ? ".errorMessagePos" : ".errorMessageNeg";
        var $messageEl = $(messageEl);
        if(!$messageEl.length)
        {
            if (!isExtension)
                alert(messageText);
            if(typeof func === 'function')
                func();
            return;
        }
        $messageEl.html(messageText);
        $messageEl.slideDown(100);
        setTimeout(
            function()
            {
                $messageEl.slideUp(100);
                if(typeof func === 'function')
                    func();
            }, 3500);
    }
};

var FileUrlHelper = {
    ReplaceAll : function (note, find, replace) {
        return note.split(find).join(replace);
        //return str.replace(new RegExp(find, 'g'), replace);
    },

    matchKey : function (search, array){
        for(var key in array) {
            if(key.indexOf(search) != -1) {
                return key;
            }
        }
        return "";
    },

    addUrls : function (note, files)
    {
        var length = files.length;
        var filearray = {};
        if (length)
        {
            var inlineImg = note.match(/\[cid:[^\[\]]*]/g);
            for(var i = 0; i < length; i++){
                var name = files[i].name;
                note = FileUrlHelper.ReplaceAll(note, " "+name, files[i].is_deleted ? "" :  FileUrlHelper.getFileLink(files[i].url,name));
                filearray['"'+name.substring(0, name.lastIndexOf("."))+'"'] = files[i].url;
            }
            if (inlineImg)
            {
                for(var j = 0; j < inlineImg.length; j++){
                    var filename = inlineImg[j].slice(5, -1); 
                    if (filename.indexOf("_link_") >= 0)
                    {
                        filename = filename.replace("_link_", "");
                    }
                    else
                    {
                        filename = FileUrlHelper.matchKey(filename.slice(0, -3), filearray);
                        if(filename && typeof(filearray[filename]) !== 'undefined' ) {
                            filename = filearray[filename];
                        }
                        else
                            filename = "";
                    }
                    if (filename.length)
                        note = FileUrlHelper.ReplaceAll(note, inlineImg[j], FileUrlHelper.getFileLink(filename,inlineImg[j].slice(5, -1)));
                }
            }
            //note = note.replaceAll("Following file was ", "");
            if (length > 1) {
                //note = note.replaceAll("Following files were ", "");
                note = FileUrlHelper.ReplaceAll(note, "a>,", "a>");
            }
            //note = note.replaceAll("uploaded:", "");
            note = FileUrlHelper.ReplaceAll(note, "a>.", "a>");
            //note += "<div class='attachmentBorder'></div>"; 
        }
        return note;
    },
    //get file of the folllowing options: file, name
    getFileLink : function (file,name)
    {
        var img ="";
        if (checkURL(file) || checkURL(name))
            img = "<img class=\"attachment\" src=\"" + file + "\">";
        else
            img = "<i class='ion-android-document ion-3x ionColor'></i> &nbsp;" + (name ||  decodeURIComponent(file.split("/").slice(-1))) + "<p></p>";
        return "<p/><a class=\"comment_image_link\"" + 
            (isPhonegap ? (" href=# onclick='openURL(\"" +file + "\")'>"+img+"</a>") :
             (" target=\"_blank\" href=\"" +file + "\">"+img + "</a>"));
    }};


var featureList;
var featureList2;
var featureList3;
var featureList4;
var featureList5;

//search in the list
function filterList(listClass, init_value, value_names){
    $('body').attr('id', 'search_wrap');
    if (!value_names)
    {
        value_names = [ 'blockNumber', 'responseText', 'TicketBlockNumber', 'user_name', 'ticketlocation', 'locationtick'];
    }
    else if (value_names)
    {
        value_names = value_names.split(',');
    }
    var options = {
        listClass: listClass,
        item: "item",
        valueNames: value_names			
    };
    featureList = new List('search_wrap', options);
    init_value = init_value || $(".search").val();
    if (init_value)
    {
        featureList.search(init_value);
        $(".search").val(init_value);
    }
    /*
    featureList.on('updated',function(){
        //console.log(featureList);
        if (featureList.matchingItems.length > 1) 
        {
            var itemMessage = 'There are ' + featureList.matchingItems.length + ' matching tickets.';
            //console.log( itemMessage);
        } else if (featureList.matchingItems.length === 0) {
            console.log( 'Bummer...  0 items found');
        }
        //else if (featureList.matchingItems.length == 1) { ; }
    });
    */
    //console.log("loaded list");
    return featureList;
}

function createSpan(elname){
    var windowH = $(window).height();
    var elH = $("#content").height();
    if(windowH > elH + 60){
        elH = windowH - elH - 60;
        $("<p id=fill style='height:"+elH+"px'>&nbsp;</p>").appendTo(elname+"");
    }
}

/*
t -
e -
f -
ticket -
ios - 
org - 
*/

function showError(e){
    //console.log(e);
    var error = e.data || (((e || {}).responseJSON || {}).ResponseStatus || {}).Message || e.statusText;
    setTimeout(function(){
        reveal();
        userMessage.showMessage(false, error || "Error. Please contact Administrator");
    }, 2000);
}

var userOrgKey = "";
var userOrg = "";
var userInstanceKey = "";
var	userKey = "";
var accountDetailed = "";
var selectedEditClass;

function getApi (method, data, type) {
    userKey = localStorage.getItem("userKey");
    userOrgKey = localStorage.getItem('userOrgKey');
    userInstanceKey = localStorage.getItem('userInstanceKey');
    if (!userKey || !userOrgKey || !userInstanceKey || userKey.length != 32) {
        console.log("Invalid organization!");
        return;
    }
    if( !type ) type = 'GET';
    return $.ajax({
        type: type,
        beforeSend: function (xhr) {
            xhr.withCredentials = true;
            xhr.setRequestHeader('Authorization',
                                 'Basic ' + btoa(userOrgKey + '-' + userInstanceKey +':'+userKey));
        },
        url: ApiSite + method,
        cache: true,
        data: data,
        dataType: "json"
    }).promise();
}

$(document).ready(function(){
    
    var once = function(func) {
    var ran = false, memo;
    return function() {
        if (ran) return memo;
        ran = true;
        memo = func.apply(this, arguments);
        func = null;
        return memo;
    };
};
    //preload image
    var img = new Image();
    img.src = MobileSite + "img/error-background.png";

    var osearch = {   
        minimumResultsForSearch: 25,
        width: "95%"
    };

    var nosearch = {   
        minimumResultsForSearch: Infinity,
        width: "95%"
    };

    function fillSelect(returnData, element, initialValue, prefix, customValues, envelope_start, envelope_end, isnosearch, notinit)
    {
        var $element = $(""+element);
        if (!returnData || !returnData.length)
        { 
            $element.parent().hide();
            return 0;
        }
        var names;
        var isCustom = false;
        if (customValues && customValues.length > 0){
            names = customValues.split(',');
            if (names.length > 0)
                isCustom = true;
        }
        prefix = prefix || "";
        initialValue = initialValue || "";
        envelope_start = envelope_start || "";
        envelope_end = envelope_end || "";
        var insert = initialValue;
        var i = 0;
        for(i = 0; i < returnData.length; i++)
        {
            var value = returnData[i].id || returnData[i].user_id;
            var name = "";
            if (!isCustom)
                name = returnData[i].name;
            else
            {
                var len = names.length-1;
                for(var j = 0; j < len; j++)
                {
                    var test = returnData[i][names[j]];
                    if (test)
                        name += " " +test;
                }
                var email = returnData[i][names[len]] || "";
                if (email && email.indexOf("@") > 0){
                    if (!name.trim())
                        name = email;
                    else
                        name += " (" + email + ")";
                }
            }
            insert += "<option value="+value+">"+prefix+(name || "NoName")+"</option>";
        }
        // $element.empty();
        if (i > 0){
            $(""+envelope_start + insert + envelope_end).appendTo(""+element);
            $element.parent().show();
            $element.parent().parent().show();
            if (!notinit)
                //if ($element.prop("class").length)
                //    $element.select2("destroy");
                $element.select2(isnosearch || osearch);
        }
        else
            $element.parent().hide();
        return i;
    }

    function fillClasses(classResults, element, initialValue)
    {
        if(!isClass) {$(''+element).parent().parent().hide();
                      return;}
        fillSelect(classResults, element, initialValue, "Class: ");

        //Listen for class and detect sub-classes
        $(''+element).on('change', function(){

            if($('.sub_class1, .sub_class2').is(":visible")){$('.sub_class1, .sub_class2').hide();$('#sub_class1, #sub_class2').empty();}
            var classSelected0 = $(element +' option:selected').val();
            var classSub = $.grep(classResults, function(a){ return a.id == classSelected0; });

            //set class
            selectedEditClass = classSelected0;

            //If sub-class exist
            if((typeof classSub[0] !== "undefined") && (classSub[0].sub !== null || classSub[0].sub > 0)){
                //Show sub-class select
                fillSelect(classSub[0].sub, "#sub_class1", "<option value="+selectedEditClass+">choose a sub class</option>", "Sub class: ");

                $("select#sub_class1").on('change', function(){
                    if($('.sub_class2').is(":visible")){$('.sub_class2').hide();$('#sub_class2').empty();}
                    var classSelected1 = $('select#sub_class1 option:selected').val();
                    var classSub1 = $.grep(classSub[0].sub, function(a){ return a.id == classSelected1; });
                    //reset class
                    selectedEditClass = classSelected1;
                    //If sub-sub-class exist
                    if((typeof classSub1[0] !== "undefined") && (classSub1[0].sub > 0 || classSub1[0].sub!== null)){
                        //Show sub-class select
                        fillSelect(classSub1[0].sub, "#sub_class2", "<option value="+selectedEditClass+">Sub Sub Class: ---</option>", "Sub Sub Class: ");

                        $("select#sub_class2").on('change', function(){
                            var classSelected2 = $('select#sub_class2 option:selected').val();
                            //reset class
                            selectedEditClass = classSelected2;
                        });
                    }
                });
            }

        });
    }

    /***
    list of available parameters:
    t - use this token, i.e. "hgkdsghf4kjsdhjks444jhjhjjk"
    e - use this email, i.e. "eugene@micajah.com"
    f - use this error message, i.e. "incorrect id"
    tab - values: "all" (goto allopen tickets), "my" (goto tech tickets)
    org - use this org key, i.e. "gdhsj"
    ticket - goto ticket, i.e. "2345" or "eghjw"
    */
    // user login
    //#login.html
    var UserLogin = {
        init: function () {
            if (!isStorage())
                return;
            var key = getParameterByName('t');
            var email = getParameterByName('e');
            if (key) {
                cleanQuerystring();
                localStorage.setItem('is_google', true);
                localStorage.setItem("userKey", key);
                localStorage.setItem('userName', email.replace("#", ""));
                window.location = "org.html";
                return;
            }
            else
            {
                var error = getParameterByName('f');
                if (error) {
                    cleanQuerystring();
                    userMessage.showMessage(false, error);
                }
            }
            this.login();
        },
        do_login: function () {
            var userName = $("#userName").val();
            var password = $("#password").val();
            if (userName === '' || password === '') {
                userMessage.showMessage(false, "Please enter a valid Email or Password");
                return;
            }
            //test
            localStorage.setItem("userName",userName);
            //localStorage.setItem('userOrgKey',2);
            //localStorage.setItem('userInstanceKey',3);
            //getInfo4Extension();
            //return;
            $.ajax({
                type: 'POST',
                beforeSend: function (xhr) {
                    xhr.withCredentials = true;
                    xhr.setRequestHeader('Authorization',
                                         'Basic ' + btoa(userName + ':' + password));
                },
                url: ApiSite +"login",
                dataType: "json",
                success: function (returnData) {
                    //console.log(returnData);

                    localStorage.setItem("userKey", returnData.api_token);
                    localStorage.setItem('userName', userName);
                    window.location = "org.html";

                },
                complete: function () {

                },
                error: function () {
                    if(userName && userName.indexOf("@gmail.com") != -1){
                        userMessage.showMessage(false, "Wrong Password, Google sign password is not neeeded");
                    }else{
                        userMessage.showMessage(false, "There was a problem with your login.  Please try again.");
                        $("#password").val("");
                    }
                    // if (userName && userName.indexOf("@gmail.com") != -1)
                    //     $("#errorMessage").html("If you are attempting to login with a google account, please do not type your google password, click the 'Sign in with Google' button, it is more secure.");
                    // else
                    //     $("#errorMessage").html("There was a problem with your login.  Please try again.");
                    // $("#password").val("");
                }
            });
        },
        login:function() {
            if (!isSD){
                $('.sdonly').remove();
            }
            //$("body").show1();
            var userName = localStorage.getItem('userName');
            if (userName !== null && userName.length > 0)
                $("#userName").val(userName);
            $('#login_signup').on('click', function (e) {
                e.preventDefault();
                document.location.href = "signup.html";
            });
            $('form.google_openid').get(0).setAttribute('action', ApiSite + 'auth/auth0');
            $('#sign_in_with_google').on('click', function (e) {
                e.preventDefault();
                if (isPhonegap) {
                    var win = openURL($('form.google_openid').prop('action'));
                    var onExit = function() { localStorage.lastclick = ""; location.reload();};
                    win.addEventListener( "loadstop", function() {
                        var loop = setInterval(function() {
                            win.executeScript(
                                {
                                    code: "localStorage.getItem('is_google')"
                                },
                                function( values ) {
                                    var name = values[0];
                                    if (name) {
                                        clearInterval(loop);
                                        win.close();
                                        onExit();
                                    }
                                }
                            );
                        });
                    });
                    win.addEventListener('exit', onExit);
                    return;
                }
                /*if (isExtension) {
                    //alert('Please goto Google login in new window and reopen Sherpadesk extension again.');
                    //$('form.google_openid').get(0).setAttribute('target', '_blank');
                }*/
                $('form.google_openid').get(0).submit();
            });
            $("#loginButton").click(function () { UserLogin.do_login(); });
            $(document).on("keypress", "#password, #userName", function (e) {
                if (e.which == 13) {
                    UserLogin.do_login();
                }
            });
        }
    };

    // org signup
    //#signup.html
    var OrgSignup = {
        init: function () {
            var userName = localStorage.getItem('userName');
            if (userName !== null && userName.length > 0)
                $("#email").val(userName);
            $("#signupButton").click(function () { OrgSignup.add(); });
            $(document).on("change", "#name", function (e) {
                var t=$("#name").val();
                if (t)
                    $("#url").val(t.toLowerCase().replace(/[^a-zA-Z0-9-]/g, ''));
            });
            $("#is_force_registration").prop("checked", false);
            reveal();   
        },
        //add org
        add: function () {
            var name = $("#name").val().trim();
            var email = $("#email").val().trim();
            var url = $("#url").val().toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
            var firstname = $("#firstname").val();
            var lastname = $("#lastname").val();
            var password = $("#password").val();
            var password_confirm = $("#password_confirm").val();
            var how = $("#how").val();
            if (name === '' || email === '' || firstname === '' || lastname === '') {
                userMessage.showMessage(false, "Please enter name and email!");
                return;
            }
            if (password){
            if (password != password_confirm) {
                userMessage.showMessage(false, "Passwords do not match!");
                return;
            }
            if (password.length < 5) {
                userMessage.showMessage(false, "Password too weak! Must be more that 5 letters");
                return;
            }
            }
            if (!getParameterByName('test'))
            $.ajax({
                type: 'POST',
                url: ApiSite +"organizations",
                dataType: "json",
                data: {"name": name, 
                       "email":email, 
                       "url":url, 
                       "is_force_registration": $("#is_force_registration").is(':checked'),
                       "firstname": firstname,
                       "lastname":lastname,
                       "password":password,
                       "password_confirm": password_confirm,
                       "how": how,
                       "note": isPhonegap ? "registered by iPhone app" : "registered from m.sherpadesk.com"
                      },
                success: function (returnData) {
                    if (!returnData.api_token)
                    {
                        window.location = "login.html";
                        return;
                    }
                    if (!returnData.organization || !returnData.instance)
                    {
                        window.location = "org.html";
                        return;
                    }        
                    localStorage.setItem("userKey", returnData.api_token);
                    localStorage.setItem('userName', email);
                    localStorage.setItem('userOrgKey', returnData.organization);
                    localStorage.setItem('userInstanceKey', returnData.instance);

                    //sets user role to user in local storage
                    localStorage.setItem('userRole', "user");
                    getappTrackConversion(url);
                    userMessage.showMessage(true, "Thanks for registration! You are redirected to new org now ...",                      function(){getInstanceConfig(returnData.organization, returnData.instance);});
                },
                error: function ( event ) {
                    //"User already have one registered organization. Please set is_force_registration=true to continue."
                    if (event.status == 409)
                    {
                        userMessage.showMessage(false, "This email is already in use. Please choose action below");
                        localStorage.setItem('userName', $("#email").val());
                        $("#is_force_registration").prop("checked", true);
                        $("#signupButton").before("<center><h3 style='padding-top: 10px;'>This email is already in use. Would you like to</h3>"+" <div class=loginButton loginGoogle onclick='window.location = \"login.html\"'>Login</div>"+"<h3>or</h3></center>");
                        $("#signupButton").text("Create New Organization");
                        $("html, body").animate({ scrollTop: $(document).height() }, 1000);
                        return;
                    }
                    //var note = ((results.data || {}).ResponseStatus || {}).Message || results.data || 'Sorry, there was a problem processing your registration.  Please try again.';
                    userMessage.showMessage(false, event.responseText);
                }
            });
            else
            {
                cleanQuerystring();
                $("body").append("test passed");
            }
        }
    };

    //show closed tickets
    //#closedTickets.html
    var closedTickets = {
        init:function() {
            if(localStorage.getItem("isMessage") == "truePos")
            {
                userMessage.showMessage(true);
            }
            ticketList.getTickets("closed");
            this.pageChange();
        },

        pageChange:function() {
            closedTickets.pageChange = noop;
            $(".buttonShowClosedTickets").click(function(){
                window.location = "closedTickets.html";
            });
        },            
    };

    // when signout button is pressed all user data is whiped from local storage
    var signout = {
        init:function(){
            this.logOut();
        },

        logOut:function(){
            $("#signOut").click(logout);
        }
    };

    // when signout button is pressed all user data is whiped from local storage
    var switchOrg = {
        init:function(){
            this.changeOrg();
        },

        changeOrg:function(){
            if (is_MultipleOrgInst)
                $("#switchOrg").click(function(){
                    clearStorage(true);
                    window.location = "org.html";
                });
        }
    };

    // create a new ticket
    //#add_tickets.html
    var newTicket = {
        init:function() {
            var storeUser = function (isTech)
            {
                localStorage.setItem('add_user_type', isTech ? 'tech' : "");
                var userid = $("#addTicketUser").val();
                if (userid) {
                    localStorage.setItem('add_user_userid', userid);
                    localStorage.setItem('add_user_username', $("#addTicketUser").find(":selected").text());
                }
                var techid = $("#addTicketTechs").val();
                if (techid) {
                    localStorage.setItem('add_user_techid',techid);
                    localStorage.setItem('add_user_techname',$("#addTicketTechs").find(":selected").text());
                }
                var account = $("#timeAccounts").val();
                if (account) {
                    localStorage.setItem('add_user_accountid',account);
                    localStorage.setItem('add_user_accountname',account);
                }
                window.location = "add_user.html";
            };

            if(isTech){
                loading();
                $("#userCreate").on("click", function(){
                    storeUser();
                });

                $("#TechCreate").on("click", function(){
                    storeUser(true);
                }); 
            }

            this.addTicket();
        },
        getSearch: function(element, method, parameters, default_id, default_name, noloading){
            if (!noloading)
                loading();
            if (method == "users"){
                newTicket.getSearchAjax(element, method, parameters, default_id, default_name);
                return;
            }
            var limit = 30;
            var records = getApi((method + parameters).addUrlParam("limit", limit));
            var count = 0;
            records.done(
                function(results){
                    count = results.length;
                    if (count < limit)
                    {   
                        var initial = "<option value=0 disabled "+(default_id ? "" : "selected ") + ">choose "+method.toLowerCase().slice(0, -1)+"</option>";
                        if (default_id && !$.grep(results, function(el){
                            return el.id === default_id;
                        }).length)
                            initial += "<option value="+default_id+" selected>"+default_name+"</option>";
                        fillSelect(results, element, initial, "", "name,firstname,lastname,email");
                        if (default_id)
                            $(""+element).val(default_id).trigger("change");
                    }
                    else
                        newTicket.getSearchAjax(element, method, parameters, default_id, default_name);
                });
        },
        getSearchAjax: function(element, method, parameters, default_id, default_name){
            var initial = !default_id ? ("<option value=0 disabled selected>choose "+method.toLowerCase().slice(0, -1)+"</option>") : "<option value="+default_id+" selected>"+default_name +"</option>";
            $(""+element).append(initial);
            //reveal();
            //var symbolArray = [{id:1, text: 'AB1C'},{id:2, text:'DEF'}, {id:3, text: 'GHI'}];
            $(element).select2({
                width: "95%",
                //data: symbolArray,
                ajax: {
                    beforeSend: function (xhr) {
                        xhr.withCredentials = true;
                        xhr.setRequestHeader('Authorization',
                                             'Basic ' + btoa(userOrgKey + '-' + userInstanceKey +':'+userKey));
                    },
                    url: ApiSite + method+parameters,
                    dataType: "json",
                    delay: 800,
                    data: function (params) {
                        return {
                            search: params.term // search term
                        };
                    },
                    processResults: function (data, page) {
                        var results = [];
                        //return dt;
                        $.each(data, function(i, concretePage) {
                            var name = getFullName(concretePage.firstname,concretePage.lastname,concretePage.email,concretePage.name);
                            results.push({'id': concretePage.id, 'text': name });
                        });
                        if (results.length == 25)
                            results.push({'id': -1, 'text': "input search for more...", disabled: true});
                        return {
                            results: results
                        };
                    },
                    error: function(e) {
                        //showError(e);
                        console.log("fail @ search on " + Page);
                    },
                    cache: true
                },
                minimumInputLength: 3
            });
            if (default_id)
                $(""+element).val(default_id).trigger("change");
        },
        getLocations: function(account, default_id, def_name, noloading){
            if (!isLocation){
                $("#ticket_Location").parent().hide1();
                return;
            }
            $("#ticket_Location").empty();
            newTicket.getSearch("#ticket_Location", "locations", "?account="+account, default_id, def_name, noloading);           
        },
        addTicket:function() {
            $("#timeAccounts").empty();
            var accountset = localStorage.getItem('addAccountTicket');
            var account = Number(localStorage.getItem('add_user_accountid')) || Number(localStorage.getItem("account_id")) || -1;
            accountset  = accountset ? accountset : account; 
            localStorage.setItem('addAccountTicket', '');
            if(!isTech){
                $("#istech").hide1();
            }
            else
            {                
                if(!isAccount) {
                    $("#timeAccounts").parent().hide1();
                    var account_id = Number(localStorage.getItem("account_id")) || -1;
                    newTicket.getLocations(account_id);
                    addTime.chooseProjects(account_id, 0, 0);
                }
                else
                {   
                    if (accountset){
                        localStorage.setItem('add_user_accountid', ''); 
                    }
                    //localStorage.account_id
                    newTicket.getSearch("#timeAccounts", "accounts", "?is_with_statistics=false", accountset, localStorage.userOrg);

                    $("#timeAccounts").on("change", function(){
                        var account = $("#timeAccounts").val();
                        addTime.chooseProjects(account, 0, 0);
                        newTicket.getLocations(account);
                    });
                }

                // list of Users
                var userid = localStorage.getItem('add_user_userid');
                if (userid)  
                    localStorage.setItem('add_user_userid', "");
                else 
                    userid = localStorage.getItem('userId');

                var userName = localStorage.getItem('add_user_username');
                if (userName) localStorage.setItem('add_user_username', '');
                else userName = localStorage.getItem("userFullName");

                if (!userName.trim())
                    userName = localStorage.getItem("userName");

                newTicket.getSearch("#addTicketUser", "users", "?account="+accountset, userid, userName);

                // after an account is choosed it get a list of technicians
                // list of Tech
                var techid = localStorage.getItem('add_user_techid');
                var techname = localStorage.getItem('add_user_techname');
                if (techid) {
                    localStorage.setItem('add_user_techid', '');
                    localStorage.setItem('add_user_techname', '');
                }
                newTicket.getSearch("#addTicketTechs", "technicians", "", techid, techname);
                // after techs are choosen then get a list of classes
                var classes = getApi('classes');
                classes.done(
                    function(classResults){
                        fillClasses(classResults, "#classTicketOptions", "<option value=0 disabled selected>choose a class</option>");
                    });

            }

            // make api post call when submit ticket button is clicked

            $("#submitNewTicket").click(function(e){
                loading();
                console.log(1);
                var subject = htmlEscape($("#addTicketSubject").val().trim());
                var post = htmlEscape($("#addTicketInitPost").val().trim());
                if(subject === "" || $("#addTicketTechs").val() === "" || selectedEditClass < 1)
                {
                    userMessage.showMessage(false, "Please enter subject");
                }
                else if (subject.length > 100){
                    userMessage.showMessage(false, "Subject should be less 100 chars!");	
                } 
                else if (post.length > 5000) {
                    userMessage.showMessage(false, "Details cannot be more than 5000 chars!");
                }
                else
                {
                    var addTicket = getApi("tickets", {
                        "status" : "open",
                        "subject" : subject,
                        "initial_post" : post,
                        "class_id" : selectedEditClass,
                        "account_id" :
                        $("#timeAccounts").val(),
                        "location_id":
                        $("#ticket_Location").val(),
                        "user_id" : isTech ? $("#addTicketUser").val() : localStorage.getItem('userId'),
                        "tech_id" : $("#addTicketTechs").val()
                    }, "POST");
                    addTicket.then(function (d) {
                        userMessage.setMessage(true, "Ticket was Succesfully Created :)");
                        if (!isTech)
                            location.replace("ticket_list.html");
                        else
                            backFunction();
                    },
                                   function(e) {
                        showError(e);
                        console.log("fail @ tickets");
                    }

                                  );
                }
            });
        }
    };
    
     var addRecip = {
        init:function() {
            this.addEm();
        },

        addEm:function() {
            $(document).on("keypress","#addEm",function(e){
                if(e.which == 13) {
                    var searchItem  = $(".headerSearch").val().toLowerCase();
                    localStorage.setItem("searchItem",searchItem);
                    var found = false;

                    var email = $("headerSearch").val();
                }
            });
        }
    };

    // Ajax calls for semi-universal search bar
    //#dashboard.html
    var search = {
        init:function(){
            this.universalSearch();
        },

        universalSearch:function(){
            //get the search value when the enter key is pressed
            $(document).on("keypress","#searchThis",function(e){
                if(e.which == 13) {
                    var searchItem  = $(".headerSearch").val().toLowerCase();
                    if (isNaN(searchItem))
                    {
                        localStorage.setItem("searchItem",searchItem);
                        localStorage.setItem("ticketPage", isLimitAssignedTkts ? "tech" : "all");
                        window.location = "ticket_list.html";
                    }
                    else
                    {
                        localStorage.setItem("ticketNumber", searchItem);
                        window.location = "ticket_list.html";
                    }
                    return;
                }


            });

        }
    };

    // add time to an account
    //#addExpence.html
    var addExpence = {
        init:function(ticket_id){
            this.addExpence(getParameterByName("ticket"));
        },
        addExpence: function(ticket_id){
            var account_id = localStorage.DetailedAccount ? localStorage.DetailedAccount : -1;
            var project_id=0;
            if(!isAccount || ticket_id)
            {
                $("#timeAccounts").parent().hide();
                reveal();
            }
            else
            {
                //get accounts
                newTicket.getSearch("#timeAccounts", "accounts", "?is_with_statistics=false", account_id, localStorage.userOrg);

                $("#timeAccounts").on("change", function(){
                    //console.log(timeLog.task_type_id);
                    addTime.chooseProjects(0, 0, 0);
                });                                                        
            }

            if(!isProject || ticket_id){
                $("#timeProjects").parent().hide();
                reveal();
            }
            else
            {
                addTime.chooseProjects(account_id, project_id, 0);
            }

            //add an expense
            $("#addexpenseButton").click(function(){
                $('#loading').show1();
                var money=$("#expenseAmount").val();
                if (!money)
                {
                    userMessage.showMessage(false, "Please enter amount");
                    return;
                }
                var note= htmlEscape($("#expenseNote").val()).trim();
                if (note.length < 1)
                {
                    userMessage.showMessage(false, "Please enter note");
                    return;
                }
                getApi('expenses',{
                    "ticket_key": ticket_id ? ticket_id : null,
                    "account_id": !ticket_id ? $("#timeAccounts").val() : null ,
                    "project_id": !ticket_id ? $("#timeProjects").val() : null,
                    "tech_id": localStorage.getItem("user_id"),
                    "note": note,
                    "note_internal": $("#expenseInternal").val(),
                    "amount": money,
                    "is_billable": $(".innerCircle").hasClass("billFill"),
                    "vendor": $("#vendor").val()
                    //"markup": 
                },'POST').then(function (d) {
                    localStorage.setItem('isMessage','truePos');
                    localStorage.setItem('userMessage','Expense was successfully added <i class="ion-cash"></i>');
                    backFunction();
                },
                               function (e, textStatus, errorThrown) {
                    showError(e);
                    console.log("fail @ pickup");
                }

                              );
            });
        }
    };



    // adjustment at invoice
    //#adjustment.html
    var Adjust = {
        init:function(){
            this.Adjustment();
        },
        Adjustment: function(){
            //add adjustment
            $("#addAdjustment").click(function(){
                var currency=$("#adjustVal").val();
                if (!currency)
                {
                    userMessage.showMessage(false, "Please enter amount");
                    return;
                }
                var note= htmlEscape($("#adjustNote").val()).trim();
                if (note.length < 1)
                {
                    userMessage.showMessage(false, "Please enter note");
                    return;
                }
                getApi('Adjustment',{
                    "note": note,
                    "adjustment": currency,
                    "is_billable": $(".innerCircle").hasClass("billFill"),
                    //"markup": 
                },'POST').then(function (d) {
                    localStorage.setItem('isMessage','truePos');
                    localStorage.setItem('userMessage','Adjustment was successfully added <i class="ion-cash"></i>');
                    backFunction();
                },
                               function (e, textStatus, errorThrown) {
                    showError(e);
                    console.log("fail @ pickup");
                }

                              );
            });
        }
    };

    // add user to an account
    //#add_user.html
    var addUser = {
        init:function(){
            $(".innerCircle").click(function(){
                if ($(".innerCircle").hasClass("billFill")) {$("#addTicketPassword").hide(); $("#addTicketConfirmPassword").hide();}
                else  {$("#addTicketPassword").show(); $("#addTicketConfirmPassword").show();}

            });

            var value = localStorage.getItem('add_user_type');
            localStorage.setItem('add_user_type', '');
            if (value == "tech"){
                $('.SherpaDesk').text('Add New Tech');
                $('.greenButton').text('Add New Tech');
                value = 'Tech';
            }
            else
                value = 'User';

            $("#submitNewUser").click(function(){
                $('#loading').show1();
                var email = $("#addTicketEmail").val().trim();
                if (email.length < 1)
                {
                    userMessage.showMessage(false, "Please enter email");
                    return;
                }
                if (!checkEmail(email))
                {
                    userMessage.showMessage(false, "Please correct email");
                    return;
                }

                var Firstname = $("#addTicketFirstname").val().trim();
                if (Firstname.length < 1)
                {
                    userMessage.showMessage(false, "Please enter Firstname");
                    return;
                }
                var Lastname = $("#addTicketLastname").val().trim();
                if (Lastname.length < 1)
                {
                    userMessage.showMessage(false, "Please enter Lastname");
                    return;
                }
                getApi('users', {
                    "Lastname": Lastname,
                    "Firstname": Firstname,
                    "email":email,
                    "role" : value
                }, 'POST').then(
                    function (d) {
                        userMessage.showMessage(true, value +' was created <i class="ion-thumbsup"></i>', function(){ 
                            localStorage.setItem('add_user_username', '');
                            localStorage.setItem('add_user_techname', '');
                            if (value == "Tech")
                            {
                                localStorage.setItem('add_user_techid', d.id);
                                localStorage.setItem('add_user_techname', getFullName(Firstname,Lastname,email, " "));
                            }
                            else
                            {
                                localStorage.setItem('add_user_userid', d.id);
                                localStorage.setItem('add_user_username',getFullName(Firstname,Lastname,email, " "));
                            }
                            backFunction();
                        }); 
                    },
                    function(e) {
                        showError(e);
                        console.log("fail @ pickup");
                    }
                );
            });
        }
    };

    // add time to an account
    //#edit_time.html
    //#add_time.html
    //#addTicketTime.html
    var addTime = {
        init:function(isEdit){
            this.addpicker();
            loading();
            this.inputTime(isEdit);
        },
        addpicker: function(){
            jQuery('#date_start').datetimepicker({
                format: getDateTimeFormat(),
                mask: false,
                step:5,
                onShow:function( ct ){
                    var dat1 = jQuery('#date_end').val();
                    var dat;
                    if (dat1){
                        dat = new Date(dat1);
                        dat.setDate(dat.getDate());
                    }
                    this.setOptions({
                        maxDate:dat1?dat:false
                    });
                }
            });
            jQuery('#date_end').datetimepicker({
                format: getDateTimeFormat(),
                mask: false,
                step:5,
                onShow:function( ct ){
                    var dat1 = jQuery('#date_start').val();
                    var dat;
                    if (dat1){
                        dat = new Date(dat1);
                        dat.setDate(dat.getDate());
                    }
                    this.setOptions({
                        minDate:dat1?dat:false
                    });
                }
            });
        },
        getTaskTypes: function (data, task_type_id){
            if (!$("#taskTypes").length)
                return;
            task_type_id = task_type_id || 0; 
            //loading();
            $("#taskTypes").empty();
            $("<option value=0 selected disabled>choose a task type</option>").appendTo("#taskTypes");
            //get task types
            var taskTypes = getApi("task_types", data);
            taskTypes.then(
                function(returnData) {
                    ////console.log(returnData);
                    if (returnData.length > 0){
                        $("#taskTypes").empty();
                        // add task types to list
                        fillSelect(returnData, "#taskTypes", "<option value=0 selected disabled>choose a task type</option>");
                        if (task_type_id > 0)
                            $("#taskTypes").val(task_type_id).trigger("change");
                    }
                    //if (!$("#timeTicket").length)
                    //    reveal();
                },
                function(e) {
                    showError(e);
                    console.log("fail @ task Types");
                }
            );
        },
        chooseProjects : function (account, project_id, task_type_id){
            if (typeof account === "undefined")
                account = -1;
            project_id = project_id || 0; 
            task_type_id = task_type_id || 0; 
            if (!account)
                account = isAccount ? $("#timeAccounts").val() : -1;
            if (isProject){
                $("#timeProjects").empty();
                $("<option value=0>choose a project</option>").appendTo("#timeProjects");

                if (account !== "0"){
                    //get projects
                    loading();
                    getApi("projects".addUrlParam("account", account).addUrlParam("is_with_statistics", "false")).then(
                        function(returnData) {
                            ////console.log(returnData);
                            // add projects
                            $("#timeProjects").empty();
                            fillSelect(returnData, "#timeProjects", "<option value=0>choose a project</option>");
                            $("#timeProjects").val(project_id).trigger("change");
                            //addTime.getTaskTypes({"account" : account, "project": project_id}, task_type_id);
                            //addTime.chooseTickets(account, project_id, 0);
                            //reveal();

                        },
                        function(e) {
                            $("#timeProjects").parent().hide1();
                            console.log(e);
                            console.log("fail @ time Projects");
                        }
                    );
                }
            }
            else{
                $("#timeProjects").parent().hide1();
                addTime.getTaskTypes({"account" : account}, task_type_id);
                addTime.chooseTickets(account, project_id, 0);
            }
        },
        chooseTickets : function (account, project_id, ticket_id){
            if (!$("#timeTicket").length)
                return;
            if (typeof account === "undefined")
                account = -1;
            project_id = project_id || 0; 
            ticket_id = ticket_id || 0;
            if (!account)
                account = isAccount ? $("#timeAccounts").val() : -1;

            $("#timeTicket").empty();
            //get projects
            loading();
            getApi("tickets?status=open&limit=100&account="+account+"&project="+project_id).then( 
                function(returnData) {
                    ////console.log(returnData);
                    $("#timeTicket").empty();
                    var len = returnData.length;
                    if (len <= 0 ) $("<option disabled=disabled value=>no open tickets found</option>").appendTo("#timeTicket"); 
                    else {
                        var insert = "<option value=>choose a ticket</option>";
                        for(var i = 0; i < len; i++)
                        {
                            insert += "<option value="+returnData[i].number+">#"+ returnData[i].number+"&nbsp;:&nbsp;"+returnData[i].subject+"</option>";
                        }
                        $(insert).appendTo("#timeTicket");
                        $("#timeTicket").select2(osearch);
                        //$("#timeTicket").val(ticket_id);
                    }

                    setTimeout(reveal, 500);

                },
                function(e) {
                    showError(e);
                    console.log("fail @ time Projects");
                }
            );
        },
        inputTime:function(isEdit){
            var isBillable = true;
            //var date = new Date().toJSON().slice(0,10);

            // on submit click get the time and note typed by the user
            $("#submitTicketTime").click(function(){
                $('#loading').show1();
                var time = $("#addTimeTicket").val();
                var note = htmlEscape($("#noteTimeTicket").val().trim());
                var tech = localStorage.getItem('techId');
                var task_type = $("#taskTypes").val();
                var ticketKey = localStorage.getItem('ticketNumber');
                if (note.length < 1)
                {
                    userMessage.showMessage(false, "Please enter note");
                    return;
                }
                if (note.length > 5000)
                {
                    userMessage.showMessage(false, "Note cannot be more than 5000 chars!");
                    return;
                }
                if(task_type == '0'){
                    userMessage.showMessage(false, "Choose a tasktype");
                    return;
                }
                if(time <= 0){
                    userMessage.showMessage(false, "Oops not enough time");
                    return;
                }
                // check to see if user check for time to be billable
                if($(".innerCircle").hasClass("billFill")){
                    isBillable = true;
                }else{
                    isBillable = false;
                }
                //date
                var dat1 = jQuery('#date_start').val();
                var sdat;
                if (dat1){
                    sdat = JSON.stringify(new Date(dat1));
                }
                var dat2 = jQuery('#date_end').val();
                var edat;
                if (dat2){
                    edat = JSON.stringify(new Date(dat2));
                }
                // add time to the orginization
                getApi('time',
                       {
                    "ticket_key": ticketKey,
                    "note_text": note,
                    "task_type_id": task_type,
                    "hours": time,
                    "is_billable": isBillable,
                    "date": dat1 ? sdat : "",
                    "start_date": dat1 ? sdat : "",
                    "stop_date": dat2 ? edat : "",
                    "tech_id": tech,
                },
                       'POST').then(function (d) {
                    localStorage.setItem('isMessage','truePos');
                    localStorage.setItem('userMessage','Time was successfully added <i class="ion-thumbsup"></i>');
                    window.location.replace("ticket_list.html");
                },
                                    function (e, textStatus, errorThrown) {
                    showError(e);
                    console.log("fail @ pickup");
                }
                                   );
            });

            if ($("#submitTicketTime").length)
            {
                //get task types
                addTime.getTaskTypes({"ticket" : localStorage.getItem('ticketNumber')}, 0);
            }
            else
            {
                var timeLog = 0, timeEntry = localStorage.getItem("timeNumber");
                if (isEdit && timeEntry)
                {
                    timeLog = JSON.parse(timeEntry);
                    if (!timeLog.billable)
                        $(".innerCircle").removeClass("billFill");
                    $("#noteTime").val(timeLog.note.replace(/&lt;br&gt;/gi, "\n").replace(/<br\s*[\/]?>/gi, "\n"));
                    $("#addTimeTicket").val(timeLog.hours || 0);
                    $(".title").html("Time #"+ timeLog.time_id + " by " + timeLog.user_name + " @ " + getDateTime(timeLog.date));
                    if (timeLog.start_time)
                        $("#date_start").val(getDateTime(timeLog.start_time));
                    if (timeLog.stop_time)
                        $("#date_end").val(getDateTime(timeLog.stop_time));
                }
                else 
                    $("#timeTicket").parent().show1();

                var account_id = localStorage.DetailedAccount || -1;
                var project_id = 0;
                var task_type_id = 0;
                var ticket_id = "";
                if (timeLog)
                {
                    account_id = timeLog.account_id;
                    project_id = timeLog.project_id;
                    task_type_id = timeLog.task_type_id;
                    ticket_id = timeLog.ticket_number;
                }

                if(isAccount)
                {
                    //get accounts
                    newTicket.getSearch("#timeAccounts", "accounts", "?is_with_statistics=false", account_id, localStorage.userOrg);

                    $("#timeAccounts").on("change", function(){
                        //console.log(timeLog.task_type_id);
                        addTime.chooseProjects(0, project_id, task_type_id);
                    });
                }
                else{
                    $("#timeAccounts").parent().hide1();
                    addTime.chooseProjects(account_id, project_id, task_type_id);
                }
                if (isProject)
                    $("#timeProjects").on("change", function(){
                        var account = isAccount ? $("#timeAccounts").val() : -1;
                        var project = $("#timeProjects").val();
                        addTime.getTaskTypes({"account" : account, "project": project}, task_type_id);
                        addTime.chooseTickets(account, project, 0);
                    });
                // submit time to account

                $("#submitTime").click(function(){
                    $('#loading').show1();
                    var time = $("#addTimeTicket").val();
                    var note = htmlEscape($("#noteTime").val().trim());
                    var tech = localStorage.getItem('userId');
                    var accountId = $("#timeAccounts").val();
                    var projectId = $("#timeProjects").val();
                    var taskId = $("#taskTypes").val();
                    if($(".innerCircle").hasClass("billFill")){
                        isBillable = true;
                    }else{
                        isBillable = false;
                    }
                    //date
                    var dat1 = jQuery('#date_start').val();
                    var sdat;
                    if (dat1){
                        sdat = JSON.stringify(new Date(dat1));
                    }
                    var dat2 = jQuery('#date_end').val();
                    var edat;
                    if (dat2){
                        edat = JSON.stringify(new Date(dat2));
                    }
                    if(time <= 0){
                        userMessage.showMessage(false, "Oops not enough time");
                        return;
                    } 
                    if(accountId == '0' && isAccount){
                        userMessage.showMessage(false, "Choose an account");
                        return;
                    }
                    if(taskId == '0'){
                        userMessage.showMessage(false, "Choose a tasktype");
                        return;
                    }
                    if(note.length == 0){
                        userMessage.showMessage(false, "Enter note");
                        return;
                    }

                    ticket_id = ticket_id || $("#timeTicket").val();
                    getApi('time' + (isEdit ? "/" + timeLog.time_id : ""),{
                        "tech_id" : isEdit ? timeLog.user_id : tech,
                        "project_id": projectId,
                        "is_project_log": !ticket_id,
                        "ticket_key": ticket_id,
                        "account_id" : accountId,
                        "note_text": note,
                        "task_type_id":taskId,
                        "hours":time,
                        "is_billable": isBillable,
                        "date": dat1 ? sdat: "",
                        "start_date": dat1 ? sdat : "",
                        "stop_date": dat2 ? edat : ""
                    }, isEdit ? 'PUT' : 'POST').then(function (d) {
                        localStorage.setItem('isMessage','truePos');
                        localStorage.setItem('userMessage','Time was successfully added <i class="ion-thumbsup"></i>');
                        backFunction();
                    },
                                                     function (e, textStatus, errorThrown) {
                        showError(e);
                        console.log("fail @ pickup");
                    }
                                                    );
                });
            }
        }
    };
    
    var tiketListTimer, tiketListTimer2;

    // Ajax calls to get open tickets for the app user, tickets include (as tech, as user, as alt tech, all tickets)
    //#ticket_list.html
    var ticketList = {
        init:function() {
            var tab = getParameterByName('tab') || localStorage.ticketPage;
            cleanQuerystring();
            var page = tab;
            switch (tab){
                case "all":
                    page = isLimitAssignedTkts ? "" : "all";
                    break;
                case "my":
                    page = "";
                    break;
            }
            if (!page || !isTech)
                page = isTech ? "tech" : "user";
            localStorage.ticketPage = page;
            displayPage(document.querySelector(".TicketTabs").parentElement, page);
            
            if (!isTech){
                this.getTickets("user"); 
                $('#userContainer').css('padding-top', '20px');
                $(".TicketTabs").hide();
            }
            else
            {                
                var searchItem = localStorage.getItem("searchItem");
                $(".search").val(searchItem);
                localStorage.setItem("searchItem",'');
                
                var showOther = function(){
                    var page = localStorage.ticketPage;
                    var list = ["user","tech","alt","all"];
                    for (var i=0; i<4; i++)
                    {
                        if (page != list[i])
                            ticketList.getTickets(list[i], searchItem);
                    }
                };
                
                this.getTickets(page, searchItem);
                tiketListTimer2 = setTimeout(showOther, 1500);
                if (isLimitAssignedTkts)
                {
                    $("#tab_all").click(function() { return false; });
                    $("#tab_all").empty();
                }
            }
            $("maxSize").hide();
        },

        //todo: return id and hours to list
        createTicketsList : function (returnData, parent, cachePrefix){
            var $table = $(parent);
            $table.empty();
            if(!returnData || returnData.length < 1){
                $table.html('<h1 class="noTicketMessage">No Tickets</h1>');
            }else{
                var name = null;
                var textToInsert =  [],
                    length = returnData.length;
                for (var i = 0; i<length; i += 1) {
                    // get email value for gravatar
                    var email = $.md5(returnData[i].user_email);
                    var initialPost = returnData[i].initial_post;
                    var subject = returnData[i].subject;
                    //the key for this specific ticket
                    returnData[i].index = returnData[i].key +',' + i;
                    var data = returnData[i].key;
                    //subject = createElipse(subject, 0.80, 12);
                    var newMessage = (returnData[i].is_new_tech_post && returnData[i].technician_email != localStorage.userName) || (returnData[i].is_new_user_post && returnData[i].user_email != localStorage.userName) ? "<i class='ion-ios-email-outline ionEmail'></i> " : "";
                    // ensure ticket initial post length is not to long to be displayed (initial post is elipsed if it is)
                    if(initialPost.length > 400)
                    {
                        initialPost = initialPost.substring(0,400)+"...";
                    }
                    initialPost=symbolEscape(initialPost);
                    var username = returnData[i].user_firstname || returnData[i].user_lastname || returnData[i].user_email;
                    textToInsert.push("<ul class='responseBlock item' id='thisBlock' data-id="+data+"><li><p class='blockNumber numberStyle'>#"+returnData[i].number+"</p><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=80' class='TicketBlockFace'><span class=user_name>"+username+"</span></li><li class='responseText'><h4 class=dots>"+newMessage+subject+"</h4><div class ='initailPost'>"+initialPost+"</div></li><li class='ticketLo ticketblok'><span class='ticketlocation'>"+ returnData[i].location_name+"</span><p class='locationtick'>"+returnData[i].class_name+"</p></li></ul>");
                    if(length>10 && i==10){
                        $table.html(textToInsert.join(''));
                        textToInsert =  [];
                    }
                }
                $table.append(textToInsert.join(''));
                createSpan(parent);
            }
            if (cachePrefix){
                localStorage.setItem(cachePrefix+'tickets',JSON.stringify(returnData));
            }
        },
        //get tickets tab = tech as tech
        //user alt all closed
        //account'+localStorage.getItem("DetailedAccount")
        getTickets:function(tab, searchItem, func) {
            if (tab == "all" && isLimitAssignedTkts)
                return;
            var cachePrefix = tab != "closed" ? tab : ('account'+localStorage.getItem("DetailedAccount") + tab);
            var container = tab+"Container", retrievedObject = localStorage.getItem(cachePrefix+"tickets");
            var time = cacheTime;
            if (retrievedObject)
                retrievedObject = JSON.parse(retrievedObject);
            if (!retrievedObject || retrievedObject.length == 0)
            {
                console.log("could not load local data");
                time = 10;
            }
            else
            {
                ticketList.createTicketsList(retrievedObject, "#"+container);
                filterList(container, searchItem);
            }
            tiketListTimer = setTimeout(function(){
                if (Page == "ticket_list.html")
                    loading();
                var query = "";
                switch (tab)
                {
                  case "all": 
                        query = "status=allopen&query=all";
                        break;
                    case "alt":
                        query = "status=open&role=alt_tech";
                        break;
                    case "user":
                        query = "status=open,onhold&role=user";
                        break;
                    case "closed":
                        query = "status=closed&account="+localStorage.getItem("DetailedAccount");
                        break;
                    default:
                        query = "status=open&role="+tab;
                        break;
                }
                getApi("tickets?limit=100&"+query).then(function(returnData) {
                    //add tickets as tech to as tech list
                    ticketList.createTicketsList(returnData, "#"+container, cachePrefix);
                    if (returnData.length)
                        filterList(container);
                    if(typeof func === 'function')
                        func();
                },
                function(e) {
                    showError(e);
                    console.log("fail @ "+ container);
                }
                                                                      );}, time); 
        }
    };

    var ticketTech;
    
    // pick up current detailed ticket
    //#ticket_detail.html
    var pickUpTicket = {
        init:function() {
            pickUpTicket.init = noop;
            this.pick();
        },

        pick:function() {
            $("#pickUp").click(function(){
                $('#loading').show1();
                getApi('tickets/'+localStorage.getItem("ticketNumber"),{
                    "action" : "pickup",
                    "note_text": ""
                }, 'PUT').then(function (d) {
                    userMessage.showMessage(true, 'Ticket pickup was Succesfull <i class="ion-thumbsup"></i>',
                                            function(){routing("ticket_detail.html");});     
                },
                               function(e) {
                    showError(e);
                    console.log("fail @ pickup");
                });


            });
        }
    };
    
    // close current detailed ticket
    //#ticket_detail.html
    var closeTicket = {
        init:function() {
            closeTicket.init = noop;
            this.closeIt();
            this.reopenIt();
        },
        reopenIt:function() {
            $('#openIt').click(function(){
                getApi('tickets/'+localStorage.getItem("ticketNumber"),
                       {
                    "status" : "open",
                    "note_text": ""
                }, 'PUT').then(function (d) {
                    //location.reload(false);
                    userMessage.showMessage(true, 'Ticket has been Reopened <i class="ion-thumbsup"></i>',
                                            function(){location.reload();});     
                },
                               function (e, textStatus, errorThrown) {
                    showError(e);
                    console.log("fail @ ticketNumber");
                });
            });
        },

        close: function(closeTicketMessage){
            closeTicketMessage = htmlEscape(closeTicketMessage).trim();
            if (closeTicketMessage.length < 2){
                userMessage.showMessage(false,  "Note cannot be empty!");	
                return;
            }
            if (closeTicketMessage.length > 5000){
                userMessage.showMessage(false,  "Note cannot be more than 5000 chars!");	
                return;
            }
            getApi('tickets/'+localStorage.getItem("ticketNumber"),{
                "status" : "closed",
                "note_text": closeTicketMessage,
                "is_send_notifications": true,
                "resolved": $("#closeResolved").val() == "1",
                "resolution_id": $("#closeResolvedCat").val(),
                "confirmed": $("#closeConfirm").hasClass("billFill"),
                "confirm_note": ""

            }, 'PUT').then(function (d) {
                //location.reload(false);
                userMessage.showMessage(true, 'Ticket has been closed <i class="ion-thumbsup"></i>',
                                        function()
                                        {
                    $('#closeArea').hide1();
                    if(window.location.href.indexOf("ticket_list") >=0){
                        localStorage.ticketNumber = "";
                        routing("ticket_list.html"); // change page location from ticket list to ticket detail list
                    }
                    else
                    window.history.back();

                });
            },
                           function (e, textStatus, errorThrown) {
                showError(e);
                console.log("fail @ ticket Number");
            }
                           //alert(textStatus);

                          );
        },

        closeIt:function() {
            $("#closeIt").click(function(){
                $('#closeArea').slideDown(400, function(){
                    $('#closeMessageButton').fadeIn();
                    $('html,body').animate({
                        scrollTop: $('#closeMessageButton').offset().top
                    },400);
                });
            });
            $('#closeMessageButton').click(function() {
                $('#loading').show1();
                closeTicket.close($('#closingMessage').val());});
            $('#closeu').click(function() {
                $('#loading').show1();
                closeTicket.close($('#commentText').val());});
        }
    };

    // post a comment to a ticket on the ticket details page
    //#ticket_detail.html
    var postComment = {
        init:function(){
            postComment.init = noop;
            this.sendComment();
        },

        sendComment:function(){
            $("#reply").click(function(){
                $('#loading').show1();
                var comment = htmlEscape($("#commentText").val().trim());
                if (!comment) {
                    userMessage.showMessage(false, "Please enter note");
                    return;
                }
                if (comment.length > 5000) {
                    userMessage.showMessage(false, "Note cannot be more than 5000 chars!");
                    return;
                }
                getApi('tickets/'+localStorage.getItem('ticketNumber'),{
                    "note_text": comment,
                    "action": "response"
                }, 'POST').then(function (d) {
                    location.reload(false);
                },
                                function (e, textStatus, errorThrown) {
                    showError(e);
                    console.log("fail @ ticket Number");
                }
                               );
            });
        }
    };


    // needed methods to propogate a ticket detailed page
    //#ticket_detail.html
    var detailedTicket = {
        init:function(){
            window.clearTimeout(tiketListTimer);
            //window.clearTimeout(tiketListTimer2);
            $("#comments").empty();
            $(".orginalMessageContainer").empty();
            if (!isTech){ $(".tabs").hide();
                         $("#closeu").show(); }
            else { 
                $("#closeu").hide();
                $("#ticketTechs").parent().removeClass("selected");
                $(".updateButton").html("Update");
                this.transfer();
                this.updateTicket();
            }
            displayPage(document.querySelector(".tabs").parentElement);
            this.showTicket();
        },
        transfer: function(){
            detailedTicket.transfer = noop;
            $("#transfer").click(function(){
                displayPage(document.querySelector(".tabs").parentElement, "info");
                $("html, body").animate({ scrollTop: $(document).height() }, 1000);
                $("#ticketTechs").parent().addClass("selected");
                $(".updateButton").html("Transfer");                          
            });
        },
        updateTicket: function(){
            detailedTicket.updateTicket = noop;
            $(".updateButton").click(function(){
                //var ticketAccount = $('form.update_ticket select#account').val(),
                var	ticketClass = selectedEditClass,
                    ticketLevel = $("#ticketLevel").val(),
                    ticketPriority = $("#ticketPriority").val(),
                    ticketProject = $("#ticketProject").val(),
                    ticketLocation = $("#ticketLocation").val(),
                    ticketTech = $("#ticketTechs").val();

                var response = {
                    //"account_id" : ticketAccount,
                    "class_id" : ticketClass,
                    "level_id" : ticketLevel,
                    "priority_id" : ticketPriority,
                    "project_id" : ticketProject,
                    "location_id" : ticketLocation,
                    "account_id": $("#inputAccountId").val(),
                    "tech_id": ticketTech
                };

                getApi('tickets/' + localStorage.getItem('ticketNumber'), response, 'PUT').then(function(results){
                    userMessage.showMessage(true, "Ticket was successfully updated <i class='ion-thumbsup'></i>",
                                            function(){
                        routing("ticket_detail.html");
                    });
                    //SherpaDesk.getTicketDetail(configPass, key);
                    //addAlert("success", "Ticket has been Updated");

                });
            });
        },
        getCustomFields : function (fieldsXml){
            if (!fieldsXml || fieldsXml.length < 9 )
                return;
            var xmlDoc = $.parseXML(fieldsXml),
                $xml = $( xmlDoc ),
                $field = $xml.find( "field" ),
                infoFields = $('#customfields');
            infoFields.empty();
            $.each($field, function(i,item) {
                var caption = $(this).find('caption'),
                    value = $(this).find('value');				
                infoFields.append("<div class=styledSelect><span class='question'>" + caption[0].textContent +":</span>&nbsp;&nbsp;&nbsp;<span class='replyTicket'>" + value[0].textContent + "</span></span></div>");
            });
        },
        prepareTicket : function (returnData, is_fetched) {
            //if (!is_fetched){
                /*$(".orginalMessageContainer").empty();
                var email = $.md5(returnData.user_email);
                var type = "Initial Post";
                var userName = returnData.user_firstname+" "+returnData.user_lastname;
                var note = symbolEscape(returnData.initial_post.trim());
                var date = formatDate(returnData.created_time);

                // comment insert
                note = "<ul class='commentBlock'><li><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=80' class='commentImg'></li><li class='commentText'><h3 class=dots>"+userName+"</h3></li><li><span>"+date+"</span></li><li class='commentText'><p>"+note+"</p></li><li>"+type+"</li></ul>";

                $(".orginalMessageContainer").html(note);
                */
                var number =  "<a class=shareTicket href='#'>"+returnData.number+" <i class='ion-share shareFont'></i></a>";

                $("#ticketNumber").html(returnData.status+" | "+number);   

                fullapplink("shareTicket", AppSite.addUrlParam("tkt",localStorage.getItem("ticketNumber"))
                            .addUrlParam("dept",userInstanceKey)
                            .addUrlParam("org",userOrgKey));

                if(returnData.status == 'Closed'){
                    $('#closeIt').hide();
                    $('#closeu').hide();
                }else{
                    $('#openIt').hide();
                }
                $("#inputAccountId").val(returnData.account_id); 

                localStorage.setItem('ticketId',returnData.id); // set the local storage variable with the ticket ID
                $("#ticketExpense").attr("href", "addExpence.html?ticket=" + returnData.id);
            //}

            var fname = returnData.tech_firstname || returnData.technician_firstname;
            var lname = returnData.tech_lastname || returnData.technician_lastname;
            var email = returnData.tech_email || returnData.technician_email;
            ticketTech = getFullName(fname, lname,  email);

            if(email == localStorage.getItem('userName')){
                $('#pickUp').hide();
            } 

            $("#ticketTech").html(ticketTech);

            //detailedTicket.createLogs([returnData.ticketlogs.shift()], ".orginalMessageContainer", files);
            $("#ticketSubject").html(returnData.subject);
            $("#ticketClass").html(returnData.class_name);
            $("#ticket_locations").html(returnData.location_name);

            // update page variables with correct ticket information
            var ticketHours = returnData.total_hours;     

            if(ticketHours !== 0){
                $("#ticketHours").html(ticketHours+" Hours");
            }else{
                $('#ticketHours').hide();
            }
            if(returnData.sla_complete_date === null)
            {
                $('#ticketSLA').hide();
            }
            else
            {
                $("#ticketSLA").html("SLA: "+getDateTime(returnData.sla_complete_date));
            }
            
            var techid = returnData.tech_id;
            localStorage.setItem('techId', techid);


            if (!isTech)
                return;

            if (!is_fetched)
            {
                $("#classOptions").empty();
                $("#ticketPriority").empty();
                $("#ticketProject").empty();
                $("#ticketLevel").empty();
                $("#ticketTechs").empty();
                $("#ticket_Location").empty();
                /*$("#ticketPriority").val(returnData.priority_id).trigger("change");
                $("#classOptions").val(returnData.class_id).trigger("change");
                $("#ticket_Location").val(returnData.location_id).trigger("change");
                $("#ticketTechs").val(techid).trigger("change");
                if (!isProject)
                    $("#ticketProject").val(returnData.project_id || "null").trigger("change");
                if (!isLevel)
                    $("#ticketLevel").val(returnData.level).trigger("change");
                return;
            */

            var classes = getApi('classes');

            classes.done(
                function(classResults){
                    //Init ticket class if not changed
                    selectedEditClass = returnData.class_id;
                    var sel = "<option disabled=disabled value=0>Choose class</option>";
                    
                    if (selectedEditClass)
                        sel = "<option data-classId="+selectedEditClass+" value="+selectedEditClass+">Class: "+returnData.class_name+"</option>";
                        
                    fillClasses(classResults, "#classOptions", sel);
                });

            newTicket.getLocations(returnData.account_id, returnData.location_id, returnData.location_name, true);

            // add select options to priority option box
            var priorities = getApi('priorities');
            priorities.done(
                function(prioritiesResults){
                    if (prioritiesResults.length === 0)
                    {
                        $("#ticketPriority").parent().hide1();
                        return;
                    }
                    fillSelect(prioritiesResults, "#ticketPriority", "<option disabled=disabled value=0>Choose priority</option>", "Priority: ");
                    $("#ticketPriority").val(returnData.priority_id).trigger("change");
                }
            );

            if (!isProject)
                $("#project").hide();
            else
            {
                // add select options to project option box
                var projects = getApi('projects');
                projects.done(
                    function(projectResults){
                        fillSelect(projectResults, "#ticketProject", "<option value='null' disabled=disabled>choose project</option>");
                        $("#ticketProject").val(returnData.project_id || "null").trigger("change");
                    }
                );
            }

            if (!isLevel) $("#ticketLevel").parent().hide();
            else{
                // add select options to level Option box
                getApi('levels').done(
                    function(levelResults){
                        fillSelect(levelResults, "#ticketLevel", "<option disabled=disabled value=0>Choose level</option>", "Level: ");
                        $("#ticketLevel").val(returnData.level).trigger("change");
                    }
                );
            }

            // add select options to tech Option box
            newTicket.getSearch("#ticketTechs", "technicians", "", techid, "Tech: " + ticketTech, true);
            }

        },
        showTicket:function(showTicketMessage){
            if(localStorage.getItem("isMessage") == "truePos")
            {
                userMessage.showMessage(true);
            }
            $('html,body').css('scrollTop','0');
            var key = localStorage.getItem('ticketNumber');
            //localStorage.setItem('ticketNumber', "");
            var retrievedObject, test = localStorage.getItem(localStorage.getItem("ticketPage")+"tickets");
            if (test){
                var match = new RegExp('\"' + key +',(\\d+)').exec(test);
                if (match) {
                    test = JSON.parse(test);
                    retrievedObject = test[Number(match[1])];
                }
            }
            // get the open tickets for the account and list them in the open tickets list

            if (retrievedObject){
                detailedTicket.prepareTicket(retrievedObject, false);
            }

            loading(true);
            getApi("tickets/"+key).then(
                function(returnData) {
                    // calculate the number of days since the ticket was created
                    var daysOld = returnData.days_old_in_minutes / 60;

                    // check to see if the ticket is less than a day old
                    if (!returnData.days_old_in_minutes || returnData.days_old_in_minutes < 15)
                        daysOld = "a minute ago"; 
                    else if(daysOld > 24){
                        daysOld = parseInt(daysOld/24) +" days ago";
                    } else {
                        daysOld = parseInt(daysOld) +" hours ago";
                    }
                    $("#lastUpdate").html(daysOld);
                    //check to see if a ticket is closed or open. If a ticket is closed the offer the reopen option   

                    if (returnData.misc_cost)
                        $("#expenses").html("Expenses: " +localStorage.currency + Number(returnData.misc_cost).toFixed(2).toString());
                    else
                        $("#expenses").hide();


                    //add comments (ticketLogs) to the page
                    var logslen = returnData.ticketlogs.length;
                    var files = returnData.attachments || [];
                    //sort files by filename to avoid wrong replace
                    files.sort(function(a, b){
                        return b.name.length - a.name.length;
                    });
                    detailedTicket.createLogs([returnData.ticketlogs.shift()], ".orginalMessageContainer", files);

                    // add the lastest comment to the top of the comments list
                    if (logslen > 1){
                        detailedTicket.createLogs(returnData.ticketlogs, "#comments", files);

                    }
                    else
                    {
                        $("#comments").append('<p id="fill" style="height:200px">&nbsp;</p>');
                    }

                    detailedTicket.prepareTicket(returnData, false);

                    reveal();
                    //localStorage.setItem('ticketNumber', "");
                    if (!isTech)
                        return; 

                    //Add custom fields to info area
                    if (returnData.customfields_xml !== null && returnData.customfields_xml.length > 0 ){
                        detailedTicket.getCustomFields(returnData.customfields_xml);
                    }
                    
                    if (!isConfirmationTracking)
                        $('#closeConfirm').parent().parent().hide1();
                    if (!isResolutionTracking){
                        $("#closeResolvedCat").parent().hide1();
                        $('#closeResolved').parent().hide1();
                    }
                    else
                    {
                    var insert = "";
                    for(var x = 0; x < returnData.resolution_categories.length ; x++)
                    {
                        var r = returnData.resolution_categories[x];
                        if (r.is_active)
                            insert += '<option class="r'+(r.is_resolved ? 1 : 0) +'"  value="'+r.id+'">'+r.name+'</option>';
                    }
                    var $closeResCatsEl = $("#closeResolvedCat");
                    $closeResCatsEl.html(insert);
                    
                        $closeResCatsEl.data('options', $('#closeResolvedCat option').detach());
                        $closeResCatsEl.empty().append( $closeResCatsEl.data('options').filter('.r1'));
                        $closeResCatsEl.parent().css('visibility', $closeResCatsEl.find('option').length > 0 ? 'visible' : 'hidden');
                    
                    $('#closeResolved').on('change', function () {
                        $("#closeResolvedCat").empty().append( $("#closeResolvedCat").data('options').filter('.r'+$(this).val()) );
                        $("#closeResolvedCat").parent().css('visibility', $("#closeResolvedCat").find('option').length > 0 ? 'visible' : 'hidden');
                    });                        
                    }
                },
                function(e) {
                    //showError(e);
                    console.log("fail @ Ticket Detail");
                    userMessage.showMessage(false, "No ticket found. Going back to a list.",
                                            function(){
                        localStorage.setItem('ticketNumber', "");
                        if (history.length < 3)
                            window.location = "ticket_list.html";
                        else
                            history.back();}); 
                }
            );

        },

        createLogs: function (logs, parent, files){
            var len = logs.length,
                insert =[],
                $table = $(parent);

            for(var c = 0; c < len; c++)
            {
                var email = $.md5(logs[c].user_email);
                var type = logs[c].log_type;
                var userName = logs[c].user_firstname+" "+logs[c].user_lastname;
                var note = logs[c].note.trim();
                note=symbolEscape(note);
                var date = formatDate(logs[c].record_date);

                // comment insert
                insert[c] = "<ul class='commentBlock'><li><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=80' class='commentImg'></li><li class='commentText'><h3 class=dots>"+userName+"</h3></li><li><span>"+date+"</span></li><li class='commentText'><p>"+note+"</p></li><li>"+type+"</li></ul>";
            }
            var notes = FileUrlHelper.addUrls(insert.join(''), files);
            $table.html(notes);
        }
    };

    //get info for a specific invoice
    //#invoice.html
    var detailedInvoice = {
        init:function(){
            loading();
            this.specifics();        
        },
        specifics:function(){
            var number = localStorage.invoiceNumber;

            if (!number){
                backFunction(); 
            }

            var data = {};
            var isUnbilled = (number.indexOf(",") != -1);
            if (isUnbilled)
            {
                $("#sendInvoiceButton").html("Create Invoice"); 
                $("#invoiceNumber").html("Create Invoice"); 
                number = number.split(",");
                data = {"status": "unbilled", "account" : number[0], "project" : number[1]};
                number = 'invoices';
            }
            else
            {
                data.action = "sendEmail";
                number = 'invoices/' +number;
            }


            data.is_detailed=true;

            var start_date, end_date;

            getApi(number, data).then(function(returnData) {
                ////console.log(returnData);
                localStorage.setItem("invoiceAccountId",returnData.account_id);
                localStorage.setItem("invoiceProjectId",returnData.project_id);
                start_date = returnData.start_date || new Date().toJSON();
                end_date = returnData.end_date || new Date().toJSON();
                $("#invoiceNumber").html(returnData.id ? "Invoice  #"+returnData.id : "Create Invoice"); //invoice number            
                var nameCheck = returnData.customer || returnData.account_name; //createElipse(returnData.customer, 0.9, 12);                
                $("#customerName").html(nameCheck); // customer name
                var date = (start_date != end_date ? (formatDate(start_date) + "&nbsp;-&nbsp;") : "") + formatDate(end_date);
                $("#invoiceDate").html(date);
                $("#invoiceHours").html(returnData.total_hours.toFixed(2)+"<span class='detail3Small'>hrs</span>"); // hours to invoice
                var amount = returnData.amount.toFixed(2).toString().split(".");

                $("#invoiceAmount").html(localStorage.getItem('currency')+amount[0] +"<span class='detail3Small'>."+amount[1]+"</span>");  // invoice amount
                if (!isTravelCosts) {
                    $("#invoiceTravel").parent().parent().hide();
                }
                else {
                    amount = returnData.travel_cost.toFixed(2).toString().split(".");

                    $("#invoiceTravel").html(localStorage.getItem('currency') + amount[0] + "<span class='detail3Small'>."+amount[1]+"</span>");
                }
                // travel expenses amount
                if (!isExpenses)
                    $("#invoiceExpenses").parent().parent().hide();
                else {
                    var expenses = returnData.misc_cost.toFixed(2).toString().split(".");
                    /*if (returnData.expenses != null) {
                        for (var i = 0; i < returnData.expenses.length; i++) {
                            expenses = expenses + returnData.expenses[i].total;
                        }
                    }*/
                    $("#invoiceExpenses").html(localStorage.getItem('currency') + expenses[0] + "<span class='detail3Small'>."+expenses[1]+"</span>"); // expenses amount
                }
                // adjustments
                $("#invoiceAdjustments").html(localStorage.getItem('currency') + "0<span class='detail3Small'>.00</span>");

                //$(".invoiceTotal").html("$"+returnData.total_cost+"<span class='detail3Small'>.00</span>");
                //console.log(Number(returnData.total_cost).toFixed(2).toString());
                amount = Number(returnData.total_cost).toFixed(2).toString().split(".");
                $(".invoiceTotal").html(localStorage.getItem('currency') + amount[0] + "<span class='detail3Small'>." + amount[1] + "</span>");
                $("#recipientList").empty();
                // add recipients to recipients list
                var insert = "";
                var rec = returnData.recipients;
                var recl= returnData.recipients.length;
                if(recl > 0){
                    rec.sort(function(a,b){
                        return a.is_accounting_contact < b.is_accounting_contact ? 1 : -1;
                    });
                    for(var x = 0; x < recl; x++)
                    {
                        var email = $.md5(rec[x].email);
                        insert += "<li class=recipientParent><ul class='recipientDetail'><li><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=80'></li><li><div class='recipient'><p class=dots>"+rec[x].email /*createElipse(rec[x].email, 0.9, 12)*/+"</p>" + (rec[x].is_accounting_contact ? "<i class='plusIcon pcIcon ion-checkmark-circled circleInvoice' id=\""+ rec[x].email +"\"></i>" : "<i class='closeIcon pcIcon ion-close-circled circleInvoice' id=\""+ rec[x].email +"\"></i>") + "</div></li></ul></li>";
                    }
                    $("#recipientList").html(insert);
                }
                else
                {
                    $("<li><h3 class=noTicketMessage>No accounting contacts found.<p>&nbsp;</p></h3></li>").appendTo("#recipientList"); 
                    $("#sendInvoiceButton").remove();

                }

                //createSpan("#recipientList");

                // adds timelogs asscoited with this invoice to the invoice timelogs list
                /*
                $("#timelog").empty();
               if(returnData.time_logs){
                if(returnData.time_logs.length){                                $("#TimeLogs").show1();

                    var string = returnData.time_logs.length+" Timelogs "+ "|" + " $"+returnData.amount.toFixed(2).toString();
                 $("#timeSumma").text(string);
                    for(var u = 0; u < returnData.time_logs.length; u++)
                    {
                        var name = returnData.time_logs[u].name;
                        //var log = returnData.time_logs[u].total;
                        var date = formatDate(returnData.time_logs[u].date);
                       //var logID = returnData.time_logs[u].id;
                        //6 hours by Igor in #567 at 23 Jul

                        var ticketNumber = " " ;
                        if (returnData.time_logs[u].ticket_id>0) {
                            ticketNumber = " in #" + returnData.time_logs[u].ticket_id;

                        }

                        var insert = "<li><input class=time type=checkbox value=><span class=textBox>" + returnData.time_logs[u].hours + " hours by " + name + ticketNumber + " at " + date + "</span></li>";
                        $(insert).appendTo("#timelog");
                    }
                }
               }

                 $("#travellog").empty();
               if(returnData.travel_logs){
                if(returnData.travel_logs.length>0){
                    $("#TravelLogs").show1();
                    var string = returnData.travel_logs.length+" Travellogs "+ "|" + " $"+returnData.travel_cost.toFixed(2).toString();
                 $("#textInvoice").text(string);
                    for(var m = 0; m < returnData.travel_logs.length; m++)
                    {
                        var name = "";
                           if (returnData.travel_logs[m].name) {
                        name = " by " + returnData.travel_logs[m].name;
                        }

                        var date = formatDate(returnData.travel_logs[m].date);

                        var ticketString = " " ;
                        if (returnData.travel_logs[m].ticket_id>0) {
                            ticketString = " in #" + returnData.travel_logs[m].ticket_id;
                        }

                        var total = returnData.travel_logs[m].total;

                        var insert = "<li><input class=time type=checkbox value=>" + total + "$" + name + ticketString + " at " + date + "</li>";
                        $(insert).appendTo("#travellog");
                    }
                }
               }

                $("#expenseslog").empty();
                if(returnData.expenses){
                if(returnData.expenses.length >0) {
                    $("#expenses").show1();
                     var string = returnData.expenses.length+" Expenses "+ "|" + " $"+returnData.misc_cost.toFixed(2).toString();
                 $("#expensesSumma").text(string);
                    for(var c = 0; c < returnData.expenses.length; c++)
                    {
                        var name = "";
                        if (returnData.expenses[c].name.length >0)
                            name = " by " + returnData.expenses[c].name; 
                        var log = returnData.expenses[c].total;
                        var date = formatDate(returnData.expenses[c].date);
                            var ticketNumber = "";
                            if (returnData.expenses[c].ticket_id >0) {
                             ticketNumber = " in #" + returnData.expenses[c].ticket_id; 
                            }

                        var insert = "<li><input class=time type=checkbox value=>" + log + "$" + name + ticketNumber + " at " + date + "</li>";
                        $(insert).appendTo("#expenseslog");
                    }
                    }
                }
                */
                reveal();
            },
                                      function(e) {
                showError(e);
                console.log("fail @ Invoice details");

            }
                                     );

            $("#sendInvoiceButton").click(function(){
                $('#loading').show1();
                //alert(localStorage.getItem('invoiceNumber'));
                if ($(".recipient").children(".plusIcon").length < 1)
                {
                    userMessage.showMessage(false, "No accounting contacts selected");
                    return;
                }
                var emails = ""; 
                $.each($(".recipient").children(".plusIcon"), function(){emails+=$(this).attr("id") + ",";}); 

                if (isUnbilled)
                {
                    data.start_date = start_date;
                    data.end_date = end_date;
                }

                data.recipients = emails;

                getApi(number, data, isUnbilled ? 'POST' : 'PUT').then(function (d) {
                    userMessage.setMessage(true, "Hurray! Invoice sent");
                    backFunction();
                },
                                                                       function (e, textStatus, errorThrown) {
                    //alert(textStatus);
                    showError(e);
                    console.log("fail @ storage Account List");
                }

                                                                      );
            });
        }
    };

    // get a list of invoices both for a specific account as well as a complete list of invoices
    //#unInvoice_List.html
    //#Invoice_List.html
    var invoiceList = {
        init:function(is_unbilled){
            loading();
            var accountid = localStorage.DetailedAccount;
            //todo localStorage.DetailedAccount = "";
            //cleanQuerystring();
            if (!is_unbilled)
                $("#invoiceCreate").click(
                    function(){
                        //localStorage.setItem('add_user_techid',localStorage.getItem("currentQueue"));
                        //localStorage.setItem('add_user_accountid',account);
                        window.location.replace("unInvoice_List.html");
                    });
            this.listInvoices(accountid, is_unbilled);
            $(document).on("click",".invoiceRows", function(){
                localStorage.setItem('invoiceNumber',$(this).attr("data-id"));
                window.location = "invoice.html";
            });
        },

        listInvoices:function(accountid, is_unbilled){
            var localInvoiceList = [];
            // get list of invoices for a specific account
            getApi("invoices", {"status": is_unbilled, "account" : accountid}).then(
                function(returnData) {
                    $("#invoiceList").empty();
                    if(returnData.length == 0){
                        $('<h3 class="noTicketMessage">no invoices at this time</h3>').prependTo('#invoiceList');
                        createSpan('#invoiceList');
                        reveal();
                        return;
                    }
                    else if(typeof returnData.length === 'undefined')
                        returnData = [returnData];
                    var insert = "";
                    for(var i = 0; i < returnData.length; i++)
                    {
                        var customer = returnData[i].customer  || returnData[i].account_name; //createElipse(returnData[i].customer, 0.33, 12); // account name
                        var date = formatDate(returnData[i].end_date || returnData[i].date || new Date().toJSON());
                        var id = is_unbilled ? 
                            returnData[i].account_id +","+returnData[i].project_id : returnData[i].id;
                        insert += "<ul data-id="+id+" class='invoiceRows detailInvoice item'><li class='responseText'>"+date+"</li><li class='user_name dots'>"+customer+"</li><li>$"+ Number(returnData[i].total_cost).toFixed(2)+"</li></ul>";
                        //if (!accountid) localInvoiceList.push(insert);
                    }
                    $(insert).appendTo("#invoiceList");
                    //if (!accountid) localStorage.setItem("storageInvoices",JSON.stringify(localInvoiceList));
                    createSpan('#invoiceList');
                    reveal();
                    filterList("tabpageContainer");
                },
                function(e) {
                    showError(e);
                    console.log("fail @ invoice List");
                }
            );
        }
    };

    // list tickets of the queue
    //#queueTickets.html
    var getQueueTickets = {
        init:function() {
            $(".title").html("Tickets @ " + localStorage.getItem("currentQueueName") + " Queue");
            this.queueTickets();
            $("#ticketCreate").click(
                function(){
                    localStorage.setItem('add_user_techid',localStorage.getItem("currentQueue"));
                    //localStorage.setItem('add_user_accountid',account);
                    window.location.replace("add_tickets.html");
                });
        },

        queueTickets:function() {
            var queueId = localStorage.getItem("currentQueue");
            if (!queueId) {
                console.log("fail @ Queues tickets");
                window.history.back();
            }
            getApi("queues/"+queueId).then(
                function(returnData) {
                    //console.log(returnData);
                    ticketList.createTicketsList(returnData, "#queueTickets"); 
                    if (returnData.length)
                        filterList("queueTickets");
                    reveal();
                    var retrievedObject, test = localStorage.getItem("storageQueues");
                    if (test){
                        var match = new RegExp('\"' + queueId+',(\\d+)').exec(test);
                        if (match) {
                            test = JSON.parse(test);
                            test[Number(match[1])].tickets_count = returnData.length;
                            localStorage.setItem("storageQueues", JSON.stringify(test));
                        }
                    }
                },
                function(e) {
                    showError(e);
                    console.log("fail @ queue Tickets");
                }
            );
        }
    };

    // get complete queue list for the orginization for the Queues list page
    //#Queues.html
    var getQueues = {
        init:function(parent, limit) {
            if (!isQueues){
                $(parent).parent().remove();
                return;
            }
            if (parent) 
            {$(document).on("click","#queue", function(){
                localStorage.setItem('currentQueue',$(this).attr("data-id"));
                localStorage.setItem('currentQueueName',$(this).find(".OptionTitle").text());
                window.location = "queueTickets.html";
            });
            }
            cacheName = "storageQueues";
            getQueues.queues(limit, parent);
        },

        queues:function(limit, parent) {
            var time = cacheTime;
            if (parent) 
            {
                var retrievedObject = localStorage.getItem("storageQueues");
                if (retrievedObject)
                    retrievedObject = JSON.parse(retrievedObject);
                if (!retrievedObject || retrievedObject.length == 0)
                {
                    console.log("could not load local data");
                    time = 10;
                }
                else
                {
                    getQueues.createQueuesList(parent, retrievedObject, limit);
                    if (!limit) createSpan(parent);
                }
            }
            else
                time = 10;

            setTimeout(function(){
                getApi("queues", {"sort_by" : "tickets_count"}).then(function(returnData) {
                    if (true) //isPhonegap)
                    {
                        var badge = 0;
                        for (var i = 0; i<returnData.length; i += 1) {
                            if (returnData[i].fullname.toLowerCase().indexOf("new ticket") == 0)
                                badge = returnData[i].tickets_count;
                        }
                        localStorage.badge = badge;
                        updateBadge();
                    }
                    if (parent) 
                    {
                        getQueues.createQueuesList(parent, returnData, limit);
                        localStorage.setItem("storageQueues",JSON.stringify(returnData));
                        reveal();
                        if (!limit) {createSpan(parent);
                                     if (returnData.length)
                                         filterList("OptionsList");}
                    }

                },
                                                                     function(e) {
                    showError(e);
                    console.log("fail @ Queues List");
                });
            }, time);
        },

        createQueuesList : function (parent, returnData, limit){
            // add queues to the queues list
            if(!returnData || returnData.length < 1){
                if (!limit)
                    $(parent).html('<h2 class="noTicketMessage">No Queues</h2>');
                else
                    $(parent).parent().remove();
                return;
            }
            var activeQueues=0;
            var textToInsert =  [],
                length = returnData.length,
                $table = $(parent);
            for (var i = 0; i<length; i += 1) {
                returnData[i].index = returnData[i].id +',' + i;
                if (limit && returnData[i].tickets_count < 1)
                    continue;
                if (limit && activeQueues>= limit)
                    continue;
                textToInsert.push("<li class=item><div id='queue' data-id="+returnData[i].id+" class='OptionWrapper optionWrapper3'><h3 class='OptionTitle dots user_name'>"+returnData[i].fullname+"</h3></div><div class='NotificationWrapper notificatio'><h2>"+returnData[i].tickets_count+"</h2></div></li>");

                if(length > 10 && i == 10){
                    $table.html(textToInsert.join(''));
                }
                activeQueues += 1;
            }
            $table.html(textToInsert.join(''));
        }
    };

    //get a complete list of accounts attached to the orginizations
    //#Account_List.html
    //#dashboard.html (active list of account list)
    var accountList = {
        init:function(parent, limit) {
            $(document).on("click",'.tableRows, .listedAccount', function(){
                localStorage.setItem('DetailedAccount',$(this).attr("data-id"));
                window.location = "account_details.html";
            });
            cacheName = "storageAccountList";
            accountList.listAccounts(parent, limit);
        },

        listAccounts:function(parent, limit) {
            var time = cacheTime;
            var retrievedObject = localStorage.getItem("storageAccountList");
            if (retrievedObject) retrievedObject = JSON.parse(retrievedObject);
            if (!retrievedObject || retrievedObject.length == 0)
            {
                console.log("could not load local data");
                time = 10;
            }
            else
            {
                if (!limit)
                    accountList.createAccountsList(parent, retrievedObject);
                else {
                    cacheName = "dash";
                    accountList.createDashAccountsList(parent, retrievedObject);
                }
                reveal();
            }

            setTimeout(function(){ getApi("accounts?limit=500").then(function(returnData) {
                if (!limit)
                    accountList.createAccountsList(parent, returnData);
                else
                    accountList.createDashAccountsList(parent, returnData);
                localStorage.setItem("storageAccountList",JSON.stringify(returnData));
                reveal();
            },
                                                                     function(e) {
                showError(e);
                console.log("fail @ Account List");
            }
                                                                    );}, time);
        },
        createAccountsList : function (parent, returnData){
            if(returnData.length < 1){
                var insert = '<h1 class="noTicketMessage">No Accounts</h1>';
                $(insert).html(parent);
            }else{
                var name = null;
                var textToInsert =  [],
                    length = returnData.length,
                    $table = $(parent);
                for (var i = 0; i<length; i += 1) {
                    returnData[i].index = returnData[i].id +',' + i;
                    var openTks = returnData[i].account_statistics.ticket_counts.open;
                    var nameCheck = returnData[i].name;
                    // nameCheck = createElipse(nameCheck, 0.75, 12);
                    textToInsert.push("<ul class='listedAccount item' data-id="+returnData[i].id+"><li class=user_name>"+nameCheck+"</li><li><div class='tks tks2' "+(openTks > 99 ? "style='height: 42px;'>99<sup>+</sup>" : ">"+openTks)+"</div></li></ul>");

                    if(length > 10 && i == 10){
                        $table.html(textToInsert.join(''));
                    }
                }
                $table.html(textToInsert.join(''));
                createSpan(parent); 
                if (length) filterList("ActiveAccountsContainer");
            }
        },
        //create account list on dashboard.html 
        createDashAccountsList : function (parent, returnData){
            var textToInsert =  [],
                length = returnData.length,
                $table = $(parent);
            if (length>0)
                textToInsert=["<ul class='tableHeader'><li></li><li>Hours</li><li>Expenses</li><li>Tkts</li></ul>"];
            for (var i = 0; i<length; i += 1) {
                returnData[i].index = returnData[i].id +',' + i;
                var openTks = returnData[i].account_statistics.ticket_counts.open;
                if (openTks < 1)
                    continue;
                var nameCheck = returnData[i].name;
                //nameCheck = createElipse(nameCheck, 0.30, 12);
                var openHours = Math.min(returnData[i].account_statistics.hours || 0, 999);
                textToInsert.push("<ul class='tableRows clickme' data-id=" + returnData[i].id + "><li>" + nameCheck + "</li><li>" + openHours + "</li><li>" + localStorage.getItem('currency') + Number(returnData[i].account_statistics.expenses).toFixed(2) + "</li><li><div class='tks1 tks2 " + (openTks > 99 ? "overflowTickets' style='height: 42px;'>99<sup>+</sup>" : "'>"+openTks) + "</div></li></ul>");

                if(length > 10 && i == 10){
                    $table.html(textToInsert.join(''));
                }
            }
            $table.html(textToInsert.join(''));
        }
    };

    //expenses
    //#expen.html
    var expenses = {
        init:function() {
            this.getLogs();
        },

        getLogs:function() {
            var account = localStorage.getItem('DetailedAccount');
            getApi('expenses', {"account": account, "limit" : 200}).then(function(returnData) {
                $(".accountContainerExpen").empty();
                var noninvoiced = false;
                if (returnData.length > 0){
                    //add timelogs to list
                    for(var i = 0; i < returnData.length; i++)
                    {
                        if (returnData[i].invoice_id)
                            continue;
                        noninvoiced = true;
                        //get users email for gravitar
                        var email = $.md5(returnData[i].user_email);
                        var text = returnData[i].note;

                        //check to see if hours are has a decimal
                        var nameCheck = returnData[i].user_name  || returnData[i].user_lastname || returnData[i].user_email;
                        //text = createElipse(text, 0.50, 8)


                        var amount = "";
                        if (returnData[i].amount.toString().indexOf(".") >0) {
                            amount = returnData[i].amount.toFixed(2).toString(); 
                        }    
                        else { 
                            amount = returnData[i].amount.toString();
                        }



                        var expenDate = formatDate(returnData[i].date);
                        var ticketNumber = "";
                        if (returnData[i].ticket_number>0) {
                            ticketNumber = "#" + returnData[i].ticket_number + ": " + returnData[i].ticket_subject;
                        }
                        // Project: sdfsaf
                        else if (returnData[i].project_id >0) {
                            ticketNumber = "Project: " + returnData [i].project_name; 
                        }
                        // Account: dskjlsdkajgl
                        else
                        {
                            ticketNumber = "Account: " + returnData[i].account_name;
                        }

                        var log = '<li class="expenLi"><ul class="responseBlock item responseBlockExpen"> <li class="expen"><img class="TicketBlockFace expenImg" src="http://www.gravatar.com/avatar/'+email+'d=mm&amp;s=80"><span class="user_name">'+nameCheck+'</span></li><li class="textExpen"><h4><p class="subjectExpen dots">'+ticketNumber+'</p></h4><div class="initailPost">'+text+'</div></li><li class="TicketBlockNumber expenE"><h3 class="feedTimeExpen"><span>$'+amount+'</span></h3><span>'+expenDate+'</span></li></ul></li>';

                        $(log).appendTo(".accountContainerExpen");
                        if (i==9)
                            reveal();
                        //localTimelogs.push(log);
                    }
                }
                if (!noninvoiced)
                    $('<h1 class="noTicketMessage">No Expenses</h1>').appendTo(".accountContainerExpen");

                createSpan("#accountContainerExpen");
                reveal();
                //localStorage.setItem("storageTimeLogs",LZString.compressToUTF16(JSON.stringify(localTimelogs)));
                //if (returnData.length > 1)
                //    filterList("timelogs");
            },
                                                                         function(e) {
                showError(e);
                console.log("fail @ time logs");
            }
                                                                        );
        }
    };


    // get complete list of timelogs for the orginization
    //#timelog.html
    var timeLogs = {
        init:function() {
            this.getLogs();
        },

        getLogs:function() {
            /*
            var localTimelogs = [];
            var retrievedObject = JSON.parse(LZString.decompressFromUTF16(localStorage.getItem("storageTimeLogs")));
            if (!retrievedObject || retrievedObject.length == 0){
                console.log("could not load local data")
            }
            else
            {
                for(var c = 0; c < retrievedObject.length; c++)
                {
                    var localInsertlog = retrievedObject[c];
                    $(localInsertlog).appendTo("#timelogs");
                }
            }
            */
            getApi('time', {"limit" : 200}).then(function(returnData) {
                $("#timelogs").empty();
                if (returnData.length < 1){
                    var insert = '<h1 class="noTicketMessage">No Timelogs</h1>';
                    $(insert).appendTo("#timelogs");
                }
                else{
                    //add timelogs to list
                    for(var i = 0; i < returnData.length; i++)
                    {
                        //get users email for gravitar
                        var email = $.md5(returnData[i].user_email);
                        var text = returnData[i].note;
                        var id = returnData[i].time_id;
                        //check to see if hours are has a decimal
                        var hours = returnData[i].hours.toString();
                        var nameCheck = returnData[i].user_name || returnData[i].user_email;
                        var date = formatDate(returnData[i].date);
                        //text = createElipse(text, 0.50, 8);

                        if (!returnData[i].is_project_log)
                        {
                            //  #123: test me
                            var ticketNumber = "#"+returnData[i].ticket_number+": "+returnData[i].ticket_subject;
                            if (text != "" )
                                ticketNumber = "<span style='display: block;'>" + ticketNumber+ "</span>";

                            text = text + ticketNumber;
                        }
                        if(hours.indexOf(".") ==  -1)
                        {
                            hours = hours+".00";
                        }
                        //nameCheck = createElipse(nameCheck, 0.50, 12);

                        var log = "<li class=item><ul class='timelog' data-id="+id+" data-info='"+JSON.stringify(returnData[i]).replace(/'/g, "")+"'> <li><img class='timelogProfile' src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=80'></li><li><h2 class='feedName dots user_name'>"+nameCheck+"</h2><p class='taskDescription'>"+text+"</p></li><li class='feedClock ion-ios-clock-outline'</li><h3 class='feedTime'><span>"+hours+"</span><p> "+date+"</p></h3></li></ul></li>";
                        $(log).appendTo("#timelogs");
                        if (i==9)
                            reveal();
                        //localTimelogs.push(log);
                    }
                }
                createSpan("#timelogs");
                reveal();
                //localStorage.setItem("storageTimeLogs",LZString.compressToUTF16(JSON.stringify(localTimelogs)));
                if (returnData.length)
                    filterList("timelogs");
            },
                                                 function(e) {
                showError(e);
                console.log("fail @ time logs");
            }
                                                );
        }
    };



    // get complete list of todos 
    //#todos.html
    var todos = {
        init:function() {
            this.getTodoList();
        },

        getTodoList:function() {

            getApi('todos', {"limit" : 200}).then(function(returnData) {
                $("#todoList").empty();
                if (returnData.length < 1){
                    var insert = '<h1 class="noTicketMessage">No Todos</h1>';

                    $(insert).appendTo("#todoList");
                }
                else {
                    for(var i = 0; i < returnData.length; i++)
                    {    
                        var ticket_string = " ";
                        if(returnData[i].ticket_id>0){
                            ticket_string = "#" + returnData[i].ticket_id;
                        }
                        else 
                            if(returnData[i].project_id>0) {
                                ticket_string = returnData[i].project_id;
                            }
                        else {
                            ticket_string = " ";
                        }
                        var date = "";
                        if(returnData[i].due_date>0){
                            date = formatDate(returnData[i].due_date);
                        }

                        var log = "<ul id='recipHeader' class='lineTodos'><li>"+ticket_string+"</li><li id='addRecipient' class='detail3Short'><!--img class='addIcon' src='img/check.png'--></li></ul><div class='styleMain todosMainText'>"+ returnData[i].name+"</div><ul id='recipientList' class='recipientTodos dots'><h4><p class='todos'><input class='timeTodos' type='checkbox' value=''>"+ returnData[i].text+"</p></h4><p class='todosData'>"+ returnData[i].assigned_name+ " "+date+"</p></div></ul>";


                        $(log).appendTo("#todoList");
                        if (i==9)
                            reveal();
                    }
                }

                //newTicket.getSearch("#addTicketUser", "users", "?account="+accountset, userid, userName);

                createSpan("#todoList");
                reveal();

                if (returnData.length > 1) ;
                //filterList("todoList");
            },
                                                  function(e) {
                showError(e);
                console.log("fail @ todos");
            }
                                                 );
        }
    };


    // calls and methods to propagate the account details page
    //#account_details.html
    var accountDetailsPageSetup = {
        init:function() {
            displayPage(document.querySelector(".TicketTabs").parentElement);
            var ticketAccount = localStorage.getItem('DetailedAccount');
            localStorage.setItem('addAccountTicket', ticketAccount);   
            if(!isExpenses) $("#expensesOption").parent().parent().remove();
            if(!isInvoice) $("#invoiceOption").parent().remove();
            else $("#invoiceOption").click(function(){
                window.location = "Invoice_List.html";
            });
            this.pageSetup();
            this.slideDown();
        },
        slideDown:function(){
            $("#openTicketslink").click(function(){
                $('html,body').animate({ scrollTop: $('#openTickets').offset().top }, '400');
            });
        },
        createAccDetails: function (returnData) {
            if (returnData && returnData.account_statistics && returnData.account_statistics.ticket_counts){
                if (returnData.account_statistics.ticket_counts.closed)
                    $(".buttonShowClosedTickets").show();
                var accountHours = Math.min(returnData.account_statistics.hours, 999),
                    accountTickets = Math.min(returnData.account_statistics.ticket_counts.open, 999),
                    accountInvoices = Math.min(returnData.account_statistics.invoices, 999),
                    accountExpenses = Math.min(returnData.account_statistics.expenses, 999);
                $("#AD").html(returnData.name);
                $("#city").html(returnData.city);
                $("#state").html(returnData.state);
                $("#zipcode").html(returnData.zipcode);
                $("#country").html(returnData.country);
                $("#phone1").html(returnData.phone1);
                $("#phone2").html(returnData.phone2);
                $("#address1").html(returnData.address1);
                $("#address2").html(returnData.address2);
            $("#email_suffix").html(returnData.email_suffix);
$("#internal_location_name").html(returnData.internal_location_name);
                $("#name").html(returnData.name);
                $("#bwd_number").html(returnData.bwd_number);                 $("#logo").html(returnData.logo); 
                $("#acc_number").html(returnData.id);
                $("#logo").html(returnData.logo); 
                $("#note").html(returnData.note);
                $("#ref1").html(returnData.ref1);
                $("#ref2").html(returnData.ref2);
$("#fb_client_id").html(returnData.fb_client_id);              
$("#qb_customer_id").html(returnData.qb_customer_id);   
                $("#client_contract_id").html(returnData.client_contract_id); $("#is_organization").html(returnData.is_organization === false ? "Individual" : "Organization");
$("#representative_name").html(returnData.representative_name);
$("#ticketsOptionTicker").html(accountTickets);
$("#invoiceOptionTicker").html(accountInvoices);
$("#timesOptionTicker").html(accountHours);
 $("#expenseOptionTicker").html(localStorage.currency + Number(accountExpenses).toFixed(2).toString());
                
               
                if (returnData.customfields && returnData.customfields.length > 0){
                var insert = "";
                    for(var x = 0; x < returnData.customfields.length ; x++)
                    {
                        var r = returnData.customfields[x];
                        insert += '<ul><li class="infoAccount">'+r.Key+'</li><li class="accountInfo dots">'+r.Value+'</li></ul>';

                    }
                    $("#customfields_projects").html(insert);
                }
                                
                if (!returnData.projects)
                    return;
                
               if (returnData.projects.length > 0){
                var insert = "";
                    for(var x = 0; x < returnData.projects.length ; x++)
                    {
                        var r = returnData.projects[x];
        insert += '<ul class="table_account clickme border_account"><li>'+r.name+'</li><li>'+r.open_tickets +'</li><li class="hrsAccount">'+r.logged_hours +'<span class="detail3Small" >hr</span></li><li class="hrsAccount">'+r.remaining_hours +'<span class="detail3Small">hr</span></li><li>'+r.complete+'%</li></ul>';
                        
                    }
                    $("#projects_account").html(insert);
                }
            else
            {
                $(".invoiceShrinker").hide1();
            }
                
            }
        },
        pageSetup: function() {
            var currentDetailedAccount = localStorage.getItem('DetailedAccount');
            var accountHours;
            var accountTickets;
            var accountInvoices;
            var accountName;
            var retrievedObject;
            var retrievedObjectTickets = localStorage.getItem('account'+currentDetailedAccount+'tickets');
            var accountTicketsList = [];
            var match, time = 10, timeTickets=10;
            var test = localStorage.getItem("storageAccountList");
            if (test){
                match = new RegExp('\"' + currentDetailedAccount+',(\\d+)').exec(test);
                if (match) {
                    test = JSON.parse(test);
                    retrievedObject = test[Number(match[1])];
                }
            }
            // get the open tickets for the account and list them in the open tickets list
            if (retrievedObjectTickets){
                retrievedObjectTickets = JSON.parse(retrievedObjectTickets);
                ticketList.createTicketsList(retrievedObjectTickets, ".AccountDetailsTicketsContainer");
                if (retrievedObjectTickets.length)
                    filterList("AccountDetailsTicketsContainer");
            }
            else
            {
                timeTickets = 10; 
                console.log("could not load local account tickets data");
            }

            if (!retrievedObject || retrievedObject.length == 0){
                console.log("could not load local account details data");
                time = 10;
            }
            else
            {
                //console.log(retrievedObject);
                accountDetailsPageSetup.createAccDetails(retrievedObject);
                //reveal();
            }

            setTimeout( function(){
                getApi("accounts/"+currentDetailedAccount).then(function(returnData) {
                    accountDetailsPageSetup.createAccDetails(returnData);
                    //storedata
                    if (retrievedObject) {
                        test[Number(match[1])].account_statistics = returnData.account_statistics;
                        localStorage.setItem("storageAccountList", JSON.stringify(test));
                    }
                },
                  function(e) {
                    showError(e);
                    console.log("fail @ storage Account List");
                }
                                                               );
            }, time);

            setTimeout( function(){ 
                getApi("tickets?status=open&account="+currentDetailedAccount).then( 
                    function(returnData) {
                        ticketList.createTicketsList(returnData, ".AccountDetailsTicketsContainer",'account'+currentDetailedAccount);
                        if (returnData.length)
                            filterList("AccountDetailsTicketsContainer");
                    },
                    function(e) {
                        showError(e);
                        console.log("fail @ Account");
                    }
                );
            }, timeTickets);
        }        
    };

    // get timeLogs for a specific account
    //#accountTimes.html
    var accountTimeLogs = {
        init:function(){
            $("#addTimeAccount").click(function(){
                window.location = "add_time.html";
            });
            this.getTimeLogs();
        },

        getTimeLogs: function () {
            var accountId = localStorage.getItem("DetailedAccount") || -1;

            getApi("time?account=" + accountId).then(function(returnData) {
                //console.log(returnData);
                //console.log(returnData);
                $("#accountLogs").empty();
                //add timelogs to log list
                if (returnData.length < 1){
                    var insert = '<h1 class="noTicketMessage">No Timelogs</h1>';
                    $(insert).appendTo("#accountLogs");
                }
                else
                    for(var i = 0; i < returnData.length; i++)
                    {
                        var email = $.md5(returnData[i].user_email);
                        var text = returnData[i].note;
                        // check for two decimals
                        var hours = returnData[i].hours.toString();
                        if(hours.indexOf(".") == -1)
                        {
                            hours = hours+".00";
                        }
                        //text = createElipse(text, 0.50, 8);
                        var nameCheck = returnData[i].user_name || returnData[i].user_email;
                        //nameCheck = createElipse(nameCheck, 0.50, 12);
                        var log = "<li><ul class='timelog' data-info='"+JSON.stringify(returnData[i]).replace(/'/g, "")+"'> <li><img class='timelogProfile' src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=80'></li><li><h2 class='feedName dots'>"+nameCheck+"</h2><p class='taskDescription'>"+text+"</p></li> <li class='feedClock ion-ios-clock-outline'</li><h3 class='feedTime'><span>"+hours+"</span></h3></li></ul></li>";
                        $(log).appendTo("#accountLogs");
                    }

            },
                                                     function(e) {
                showError(e);
                console.log("fail @ accountlogs");
            }

                                                    );
        }
    };

    // get the counts for open tickets (as tech, alt tech, user) and updates the ticket banner on the dashboard
    var TicketsCounts = {
        init: function() {
            $('html,body').css('scrollTop','0');
            var time = 10;
            var cachedTickets = localStorage.ticketsStat;
            if (cachedTickets)
                cachedTickets = JSON.parse(cachedTickets);
            if (cachedTickets)
            {
                TicketsCounts.setTicketCounts(cachedTickets);
            }
            else
            {
                //time = 10;
                console.log("no cache TicketsCounts"); 
            }   
            setTimeout(function(){
                getApi("tickets/counts").then(function(returnData) {
                    TicketsCounts.setTicketCounts(returnData);
                    reveal();
                    localStorage.setItem("ticketsStat", JSON.stringify(returnData));
                },
                                              function(e) {
                    showError(e);
                    console.log("fail @ get TicketsCounts");
                }
                                             );
            }, time);
            $(document).on('click','#asUserStat', function(){
                localStorage.setItem('ticketPage','user');
                window.location = "ticket_list.html";
            });
            $(document).on('click','#techStat', function(){
                localStorage.setItem('ticketPage','tech');
                window.location = "ticket_list.html";
            });
            $(document).on('click','#asAltTechStat', function(){
                localStorage.setItem('ticketPage','alt');
                window.location = "ticket_list.html";
            });
            if (!isLimitAssignedTkts){
                $(document).on('click','#allTicketsStat', function(){
                    localStorage.setItem('ticketPage','all');
                    window.location = "ticket_list.html";
                });
            }
            else
                $("#allTicketsStat").empty();
        },
        setTicketCounts: function (returnData) {
            var allTickets = returnData.open_all;
            //if ticket count is greater than 100 sub 99+
            if(allTickets > 100){
                allTickets = "&nbsp;99<sup>+</sup>";
            }
            else
            {
                $("#all").removeClass("headerOverflowTickets");
            }
            // update each notification ticker on the dashboard
            $("#all").html(allTickets);
            $("#userStat").html(returnData.open_as_user);
            $("#techStat").html(returnData.open_as_tech);
            $("#altStat").html(returnData.open_as_alttech);
        }
    };

    //get instance config
    var getInstanceConfig = function (_userOrgKey, _userInstanceKey, is_redirect, paramFunc) {

        if (typeof is_redirect === "undefined")
            is_redirect = true;        
        if (!_userOrgKey || !_userInstanceKey) {
            _userOrgKey = localStorage.getItem('userOrgKey');
            _userInstanceKey = localStorage.getItem('userInstanceKey');
        }
        if (!_userOrgKey || !_userInstanceKey) {
            return;
        }

        //get instance config
        getApi("config").then(function (returnData) {  
            if (isPhonegap && localStorage.getItem("userKey").length === 32)
                initOrgPreferences(localStorage.getItem('userOrgKey') + "-" + localStorage.getItem('userInstanceKey') + ":" + localStorage.getItem("userKey"));

            localStorage.setItem('userRole', returnData.user.is_techoradmin ? "tech" : "user");
            isTech = returnData.user.is_techoradmin;
            localStorage.setItem('projectTracking', returnData.is_project_tracking);
            localStorage.setItem('timeTracking', returnData.is_time_tracking);
            localStorage.setItem('accountManager', returnData.is_account_manager);
            localStorage.setItem('ticketLevels', returnData.is_ticket_levels);
            localStorage.setItem('is_resolution_tracking', returnData.is_resolution_tracking);
            localStorage.setItem('is_confirmation_tracking', returnData.is_confirmation_tracking);
            localStorage.setItem('classTracking', returnData.is_class_tracking);
            localStorage.setItem('locationTracking', returnData.is_location_tracking);
            localStorage.setItem('freshbooks', returnData.is_freshbooks);
            localStorage.setItem('is_invoice', returnData.is_invoice);
            localStorage.setItem('is_expenses', returnData.is_expenses);
            localStorage.setItem('is_travel_costs', returnData.is_travel_costs);
            localStorage.setItem('currency', returnData.currency);
            localStorage.setItem('dateformat', returnData.user.date_format);
            localStorage.setItem('timeformat', returnData.user.time_format);
            localStorage.setItem("userFullName", getFullName(returnData.user.firstname, returnData.user.lastname,localStorage.userName, " "));
            localStorage.setItem('userId', returnData.user.user_id);
            localStorage.setItem('account_id', returnData.user.account_id);
            localStorage.setItem('account_name', returnData.user.account_name);
            if (!localStorage.userOrg)
                userOrg = localStorage.userOrg = localStorage.account_name;
            localStorage.setItem('is_limit_assigned_tkts', returnData.user.is_limit_assigned_tkts);
            if (paramFunc && (typeof paramFunc == "function"))
                paramFunc(); 
            //success login only
            else
                getInfo4Extension();
            if (is_redirect)
            {
                /*if (isExtension){
                    var reff = localStorage.referrer;
                    console.log(reff);
                    if (reff) {window = reff};
                }
                */
                if (isTech)
                    window.location = "dashboard.html";
                else
                    window.location = "ticket_list.html";
            }
        },
                              function (j,t,e) {
            showError(e);
            console.log("fail @ config");
            //setTimeout(function () {
            //logout(j.url !== ApiSite + "login", e);
            //}, 1000);
        }
                             );
    };

    var userInfo = {
        init:function() {
            this.userData();
        },
        userData:function() {
            //get user info
            getApi("users?search="+localStorage.getItem('userName')).then(function(returnData) {
                //console.log(returnData);
                //set the name of the nav side menu
                $(".navName").html(returnData[0].firstname+" "+returnData[0].lastname);
                //get md5 value of users email for gravatar
                var email = $.md5(returnData[0].email);
                //set user avatar picture in side menu
                $(".navProfile").attr("src","http://www.gravatar.com/avatar/" + email + "?d=mm&s=80");
                //set user id to local storage
                localStorage.setItem("userId",returnData[0].id);
                reveal();
                window.setTimeout(reveal,500);
            },
                                                                          function(e) {
                showError(e);
                console.log("fail @ Account");

            }
                                                                         );
        }
    };

    // organization Ajax call
    //#org.html
    var org = {
        init: function () {
            //sets user role to user in local storage
            localStorage.setItem('userRole', "user");
            this.chooseOrg();
            this.getOrg();
            //hide load screen
        },
        chooseOrg : function (){
            if (userOrgKey && userInstanceKey)
            {
                getInstanceConfig(userOrgKey, userInstanceKey);
                return;
            }
        },
        createOrgList : function(results) {
            for (var i = 0; i < results.length; i++) {
                var instances = results[i].instances;
                var many_instances = instances.length > 1;
                var name = results[i].name, 
                    intst = "";
                var expired = "", expiredclass="";

                if (instances.length == 0)
                    results[i].is_expired = true;
                else if (!many_instances) {
                    name += " " + instances[0].name;
                    intst = instances[0].key;
                }

                if (results[i].is_expired){
                    expired =  " <font color=black>(Expired)</font>";
                    expiredclass = "expired";
                }                
                var insert = "<li class=item><div data-id='"+results[i].key+"' data-inst='"+intst+"' data-name='"+results[i].name+"' class='OptionWrapper1 optionWrapper3 org'><h3 class='OptionTitle dots user_name "+expiredclass+"'>"+name+expired+"</h3></div></li>";
                $('#orgsPage').append(insert);

                if (many_instances) {
                    var insert = '<ul data-id="'+results[i].key+'" class="InstsList' + (results.length > 1 ? ' d0">' : '">');
                    for (var j = 0; j < instances.length; j++) {
                        var expired = "", expiredclass="";
                        /*if (false && instances[j].is_expired){
                            expired =  " <font color=black>(Expired)</font>";
                            expiredclass = "expired";
                        }*/
                        insert += "<li style='height: 45px;margin-top: 10px;' class=item><div data-id='"+instances[j].key+"' class='OptionWrapper2 optionWrapper3 inst'><h3 class='OptionTitle dots user_name"+expiredclass+"'>"+instances[j].name+expired+"</h3></div></li>";
                    }
                    $('#orgsPage').append(insert+'</ul>');
                }
                if (results.length > 1 || many_instances) {
                    localStorage.setItem('sd_is_MultipleOrgInst', 'true');
                }
            }   

            $(document).on("click",".org", function () {
                if ($(this).find("h3.expired").length)
                {
                    userMessage.showMessage(false, userOrg + " has expired or inactivated. Contact SherpaDesk for assistance. Email: support@sherpadesk.com Phone: +1 (866) 996-1200, then press 2");
                    return;
                } 
                $("ul.InstsList").hide();
                userOrgKey = localStorage.userOrgKey = $(this).data("id");
                userOrg = localStorage.userOrg = $(this).data("name");
                userInstanceKey = localStorage.userInstanceKey = $(this).data("inst");
                $("ul.InstsList[data-id='"+userOrgKey+"']").show();
                org.chooseOrg();
            });

            // listen for Instance selection
            $(document).on("click",".inst", function () {
                if ($(this).find("h3.expired").length)
                {
                    userMessage.showMessage(false, instances[$(this).attr("data-id")].name + " has expired. Contact SherpaDesk for assistance. Email: support@sherpadesk.com Phone: +1 (866) 996-1200, then press 2");
                    return;
                }
                userOrgKey = localStorage.userOrgKey = $(this).parent().parent().data("id");
                userInstanceKey = localStorage.userInstanceKey = $(this).data("id");
                org.chooseOrg();
            });
        },

        getOrg: function() {
            $("body").show1();
            loading();
            $.ajax({
                type: 'GET',
                beforeSend: function (xhr) {
                    xhr.withCredentials = true;
                    xhr.setRequestHeader('Authorization', 'Basic ' + btoa('x:' + userKey));
                },
                url: ApiSite + 'organizations/',
                async: true,
                cache: false,
                dataType: 'json',
                success: function(results) {
                    if (localStorage.loadOrgKey){
                        userOrgKey = localStorage.userOrgKey = localStorage.loadOrgKey;
                        localStorage.loadOrgKey = "";
                        var organization = $.grep(results, function(a){ return a.key == userOrgKey; }).pop();
                        if (organization){
                            userOrg = localStorage.userOrg = organization.name;
                            userInstanceKey = localStorage.userInstanceKey = organization.instances[0].key;
                            org.chooseOrg();
                            return;
                        }
                    }
                    if (results.length > 1 || results[0].is_expired || results[0].instances.length > 1)
                        org.createOrgList(results);
                    else
                    {
                        userOrgKey = localStorage.userOrgKey = results[0].key;
                        userOrg = localStorage.userOrg = results[0].name;
                        userInstanceKey = localStorage.userInstanceKey = results[0].instances[0].key;
                        org.chooseOrg();
                    }
                },
                complete: function () {
                    userOrgKey = localStorage.getItem('userOrgKey');
                    userInstanceKey = localStorage.getItem('userInstanceKey');
                    if (!userOrgKey || !userInstanceKey) {
                        reveal();
                    }
                },
                error: function() {
                    console.log("fail @ getOrg");
                    logout();
                }
            });
        }
    };

    function routing(page){
        if (page){
            Page = page;
            //sideBar.init();
        }
        if (localStorage.getItem('userRole') === "tech")
            isTech = true;
        else
            $(".sideNavLinks").children(":not('.user')").hide();

        if (localStorage.getItem('projectTracking') === "false")
            isProject = false;
        if (localStorage.getItem('timeTracking') === "false")
        {
            isTime = false;
            $(".time").remove();
        }
        if (localStorage.getItem('accountManager') === "false")
        {
            isAccount = false;
            $("#itemAccount").hide();
        }
        if (localStorage.getItem('ticketLevels') === "false")
            isLevel = false;
        if (localStorage.getItem('is_confirmation_tracking') === "false")
            isConfirmationTracking = false;
        if (localStorage.getItem('is_resolution_tracking') === "false")
            isResolutionTracking = false;
        if (localStorage.getItem('classTracking') === "false")
            isClass = false;
        if (localStorage.getItem('locationTracking') === "false")
            isLocation = false;
        if (localStorage.getItem('freshbooks') === "false")
            isFreshbook = false;
        if (localStorage.getItem('is_invoice') === "false")
        {
            isInvoice = false;
            $("#itemInvoice").hide();
            $("#itemUnInvoice").hide();
        }
        if (localStorage.getItem('is_expenses') === "false")
        {
            isExpenses = false;
            $(".expense").hide();
        }
        if (localStorage.getItem('is_travel_costs') === "false")
            isTravelCosts = false;
        if (localStorage.getItem('is_limit_assigned_tkts') === "false"){
            isLimitAssignedTkts = false;
        }
        if (!isQueues)
            $("#itemQueues").hide1();
        if (localStorage.getItem('sd_is_MultipleOrgInst') === "false")
        {
            is_MultipleOrgInst = false;
            $("#switchOrg").hide();
        }
        else
            $("#switchOrg").show();
        //return;
        //update badge every 1 min 
        if (isPhonegap)
            setInterval(function () { getQueues.queues(4, ''); }, 2*60*1000);
        fullapplink("fullapplink", AppSite + "?dept=" + localStorage.getItem('userInstanceKey') + "&org=" + localStorage.getItem('userOrgKey'));
        switchOrg.init();
        signout.init();
        //if (typeof navigator.splashscreen !== 'undefined') 
        //    navigator.splashscreen.hide();
        
         clickOnticket();

        if (localStorage.ticketNumber && Page=="ticket_list.html")
            Page="ticket_detail.html";

        if (Page=="ticket_list.html")
        {
            $(".ticket_detail").hide();
            $(".ticket_list").show();
            localStorage.DetailedAccount = localStorage.addAccountTicket = '';
            ticketList.init();
            //accountDetailsPageSetup.init();
            return;

        }
        if (Page=="ticket_detail.html")
        {
            if (window.location.href.indexOf("ticket_detail") <0)
            window.backFunction = function(){
                localStorage.setItem('ticketNumber', "");
                routing("ticket_list.html");
                };
            $(".ticket_detail").show();
            $(".ticket_list").hide();
            detailedTicket.init();
            pickUpTicket.init();
            closeTicket.init();
            //addTime.init();
            postComment.init();
            return;
        }

        //Only for tech
        if (isTech)
        {
            //conditional api calls determined by page
            if (Page=="dashboard.html")
            {
                localStorage.DetailedAccount = localStorage.addAccountTicket = '';
                var orgName = localStorage.getItem('userOrg');
                if (orgName)
                    $("#indexTitle").html(orgName);
                TicketsCounts.init();
                getQueues.init("#DashBoradQueues", 3);
                if(isAccount)
                    accountList.init("#activeList", 1);
                search.init();
                //reveal();
                return;
            }
            if (Page=="Account_List.html")
            {
                if (isAccount)
                {
                    localStorage.DetailedAccount = localStorage.addAccountTicket = '';
                    accountList.init("#fullList");
                    return;
                }
            }

            if (Page=="todos.html")
            {
                todos.init();
                return;
            }

            if (Page=="allInvoice_List.html")
            {
                if (isTime && isInvoice)
                {
                    invoiceList.init();
                    return;
                }
            }
            if (Page=="Queues.html")
            {
                getQueues.init("#queuesPage");
                return;
            }
            if (Page=="queueTickets.html")
            {
                localStorage.setItem('ticketNumber', "");
                getQueueTickets.init();
                return;
            }

            if (Page=="closedTickets.html")
            {
                localStorage.setItem('ticketNumber', "");
                closedTickets.init();
                return;
            }
            if (Page=="addTicketTime.html")
            {
                if (isTime) { 
                    addTime.init();
                    return;
                }

            }

            $(document).on("click",".timelog", function(){
                localStorage.setItem('timeNumber', $(this).attr("data-info")); //set local storage variable to the ticket id of the ticket block from the ticket list
                window.location = "edit_time.html"; // change page location from ticket list to ticket detail list
            });

            if (Page=="timelog.html")
            {
                if (isTime)
                {
                    //accountTimeLogs.init();
                    timeLogs.init();
                    //addTime.init();
                    return;
                }
            }
        }
        //set page
        var currPage = Page+'_ref';
        var test = localStorage.getItem(currPage);
        if (!test || test === location.href)
            localStorage.setItem(currPage, document.referrer || localStorage.referrer || "login.html");

        window.backFunction = function(){
            var reff = localStorage.getItem(currPage);
            if (!reff)
            {
                if (history.length < 3)
                    window.location = "login.html"; 
                else
                    history.back();
            }
            else {
                localStorage.setItem(currPage, "");
                window.location.replace(reff);
            }

        };

        if (isTech){
            if (Page=="account_details.html")
            {
                if (isAccount)
                {
                    localStorage.setItem('ticketNumber', "");
                    accountDetailsPageSetup.init();
                    //detailedTicket.init();
                    closedTickets.pageChange();
                    return;
                }
            }
            if (Page=="accountTimes.html")
            {
                if (isTime && isAccount)
                {
                    accountTimeLogs.init();
                    //timeLogs.init();
                    return;
                }
            }
            if (Page=="expen.html")
            {
                if (isTime)
                {
                    expenses.init();
                    //timeLogs.init();
                    return;
                }
            }
            if (Page=="Invoice_List.html")
            {
                if (isTime && isInvoice)
                {
                    invoiceList.init();
                    return;
                }
            }
            if (Page=="unInvoice_List.html")
            {
                if (isTime && isInvoice)
                {
                    invoiceList.init("unbilled");
                    return;
                }
            }

            if (Page=="invoice.html")
            {
                if (isTime && isInvoice)
                {
                    detailedInvoice.init();
                    //addRecip.init();
                    return;
                }
            }
            if (Page=="add_time.html")
            {
                if (isTime)
                {
                    addTime.init();
                    return;
                }
            }
            if (Page=="add_user.html")
            {
                addUser.init();
                return;
            }

            if (Page=="addExpence.html")
            {
                if (isExpenses)
                {
                    addExpence.init();
                    return;
                }
            }

            if (Page=="adjustment.html")
            {
                Adjust.init();
                return;
            }

            if (Page=="edit_time.html")
            {
                if (isTime)
                {
                    addTime.init(true);
                    return;
                }
            }
        }

        if (Page=="add_tickets.html")
        {
            newTicket.init();
            //accountTimeLogs.init();
            return;
        }

        /*if (Page=="addTicket_V4.html")
        {
            newTicket4.init();
            //accountTimeLogs.init();
            return;
        }*/

        default_redirect(isTech);
    }
    
     var clickOnticket = once(function(){$(document).on("click",".responseBlock", function(){
                localStorage.setItem('ticketNumber', $(this).attr("data-id")); //set local storage variable to the ticket id of the ticket block from the ticket list
         if(Page.indexOf("ticket_") >=0)
            routing("ticket_list.html"); // change page location from ticket list to ticket detail list
         else
             document.location = "ticket_detail.html";
                                      });});

    //Main Method that calls all the functions for the app
    (function () {
        if (Page == "signup.html"){
            OrgSignup.init();
            return;
        }

        //always active api calls
        userMessage.init();

        if (window.dontClearCache && localStorage.techtickets && Page !== "login.html" && Page !== "org.html") {
            routing(); 
            return;}

        //refresh version
        if (!localStorage.appVersion)
            localStorage.setItem("appVersion", appVersion);
        else if (localStorage.appVersion !== appVersion)
        {
            localStorage.setItem("appVersion", appVersion);
            console.log("Version updated to " + appVersion);
            if (adMessage.length > 1)
            {
                setTimeout(function(){
                    userMessage.showMessage(true, adMessage,updatedFunction);
                }, 3000);
            }
            else
                location.reload(true);
        }
        var loginPage = Page == "login.html";
        userKey = localStorage.getItem("userKey");
        userOrgKey = localStorage.getItem('userOrgKey');
        userInstanceKey = localStorage.getItem('userInstanceKey');
        var orgkey = getParameterByName('org');
        if (orgkey) {
            localStorage.setItem('loadOrgKey', orgkey);
        }

        if (!userOrgKey || !userInstanceKey)
        {
            if (userKey && userKey.length == 32) 
            {
                if (Page != "org.html") {
                    window.location = "org.html";
                }
                else
                {
                    org.init();
                }
            }
            else 
            {
                if (!loginPage){
                    logout();
                }
                else
                    UserLogin.init();
            }
            googleTag();
            return;
        }

        if(loginPage){
            window.location = localStorage.getItem('userRole') === "tech" ? "dashboard.html" : "ticket_list.html";
            return;
        }

        if (Page == "org.html") {
            org.init();
            googleTag();
            return;
        }

        var ticket = localStorage.loadTicketNumber; 

        if (ticket && ticket != "undefined") {
            localStorage.loadTicketNumber = '';
            localStorage.setItem('ticketNumber', ticket);
            window.location = "ticket_list.html";
            return;
        }

        var ios_action = localStorage.getItem('ios_action');

        if (ios_action && ios_action !== "undefined"){
            localStorage.setItem('ios_action', "");
            window.location = ios_action;
            return;
        }

        if (ios_action  && ios_action !== "undefined"){
            localStorage.setItem('ios_action', "");
            window.location = ios_action;
            return;
        }


        googleTag();
        //userInfo.init();

        //when user logged in

        //set the name of the nav side menu
        //$(".navName").html(localStorage.getItem("userFullName"));
        //set user avatar picture in side menu
        //$(".navProfile").attr("src","http://www.gravatar.com/avatar/" + $.md5(localStorage.getItem("userName")) + "?d=mm&s=80");
        //$(".navName").show();
        //$(".navProfile").show();
        //init config
        //refresh version

        if (!localStorage.lastclick)
        {
            localStorage.lastclick = new Date();
        }
        else if (((new Date()).valueOf() - Date.parse(localStorage.lastclick).valueOf()) / 60 > 1200)
        {
            localStorage.lastclick = new Date();
            getInstanceConfig("","",false, routing);
            return;
        }
        routing();
    }());


});

function handleOpenURL(url) { 
    var ios_action = url.substring(13).replace('#', "?");
    ios_action = ios_action.replace('#', '?');
    console.log("main url: " + ios_action + " loc:" + location.href.substring(location.origin.length+1));
    if (location.href.substring(location.origin.length+1) == ios_action)
        return;
    localStorage.setItem('ios_action', ios_action || "");
    if (ios_action)
        location.reload(true);
    //localStorage.setItem('ios_action', "");
    //window.location = ios_action;
}

