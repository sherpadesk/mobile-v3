/*jshint -W004, -W041, -W103, eqeqeq: false, noempty: false, undef: false, latedef: false, eqnull: true, multistr: true*/
/*global jQuery, $ */

var appVersion = "22";
var adMessage = "Image fixes";
function updatedFunction ()
{
    location.reload(true);
}

//Root Names
var Site = 'sherpadesk.com/';
var MobileSite = 'http://m0.' + Site;
var AppSite = 'https://app.beta.' + Site;

var ApiSite = 'http://api.beta.' + Site;
var Page = location.pathname.substr(1);

//locally test
//Page = location.href.match(/(.+\w\/)(.+)/)[2];
//$( window ).unload(function() { localStorage.setItem("referrer", Page); });

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
    is_MultipleOrgInst = true;

var formatDate=function(a){if (!a || a.length < 12) return a;  var e=a.substring(5,7),r=a.substring(8,10);switch(e){case"01":e="Jan";break;case"02":e="Feb";break;case"03":e="Mar";break;case"04":e="Apr";break;case"05":e="May";break;case"06":e="Jun";break;case"07":e="Jul";break;case"08":e="Aug";break;case"09":e="Sep";break;case"10":e="Oct";break;case"11":e="Nov";break;case"12":e="Dec";break;default:e="nul";}return e+" "+r;};

Object.toType = (function toType(global) {
    return function(obj) {
        if (obj === global) {
            return "global";
        }
        return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
    };
})(this);

function HasProp(obj, prop) {
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            if (p === prop) {
                return obj;
            } else if (obj[p] instanceof Object && HasProp(obj[p], prop)) {
                return obj[p];
            }
        }
    }
    return null;
}

//Cache settings
var cacheName = "", //current cache to kill on refresh
    cacheTime = 5000; // milliseconds before cache update 

function checkEmail(email) {
    return(email.trim().match(/^[^@\s]+@[^@\s]+(\.[^@\s]+)+$/i) !== null);
}

function checkURL(url) {
    return(url.trim().match(/(jpeg|jpg|gif|png)$/i) !== null);
}

//Phonegap specific
var isPhonegap = false;
var isOnline = true;

document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("offline", offLine,false);
document.addEventListener("online", onLine ,false);

function onDeviceReady() {
    //alert("gap init");
    isPhonegap = true;
    if (cordova.plugins.notification.badge){
        if (localStorage.badge > 0){
            cordova.plugins.notification.badge.set(localStorage.badge);
        }
        else
            cordova.plugins.notification.badge.clear();}
}

//open link	in blank
function openURL(urlString){
    window.open(urlString, '_blank', 'location=no,EnableViewPortScale=yes');
}

//open link	in system
function openURLsystem(urlString){
    window.open(urlString, '_system');
}

if (typeof String.prototype.addUrlParam !== 'function') {
    String.prototype.addUrlParam = function(param, value) {
        if (!value || !param)
            return this;
        var ch = this.indexOf('?') > 0 ? '&' : '?';
        return this + ch + param + '=' + value;
    };
}


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
    setTimeout(function(){ $("#loading").hide();
                          $(".page").show(); 
                          redirectToPage();}, 1000);
});

function reveal() {
    $("#loading").hide();
}


//If User is Offline....................................
function errorLine(message){
    var func = "location.reload(false)";
    $("#scroller").hide();
    if (!$(".catch-error").length) {
        $('body').prepend('<div class="catch-error"><div class="catch-error-description"><h2>&nbsp;</h2><h2>&nbsp;</h2><h2>Something went wrong...</h2><div id="ctl00_PageBody_StackTrace" class="return-button"><p /><p /><h4>'+message+'</h4><h4>&nbsp;<p>P.S.  Uh... a Yeti just attacked your  camp!</h4><center><button class=loginButton style="width: 200px;" onclick="'+func+'">Refresh</button></center></div></div>');
    }
}

function offLine(){
    var func = "redirectToPage()";
    isOnline = false;
    if (!$(".catch-error").length) {
        $('body').prepend('<div class="catch-error"><div class="catch-error-description"><h2>&nbsp;</h2><h2>&nbsp;</h2><h2>Check your internet connection!</h2><div id="ctl00_PageBody_StackTrace" class="return-button"><p /><p /><h4>P.S.  Uh... a Yeti just attacked your  camp!</h4><center><button class=loginButton style="width: 200px;" onclick="'+func+'">Refresh</button></center></div></div>');
    }
}

window.onerror = function(msg, url, line, col, error) {
    // Note that col & error are new to the HTML 5 spec and may not be 
    // supported in every browser.  It worked for me in Chrome.
    var extra = !col ? '' : '<p>column: ' + col;
    extra += !error ? '' : '<p>error: ' + error;

    // You can view the information in an alert to see things working like this:
    if (line > 0)
        setTimeout(function(){errorLine("<p onclick='$(\".err\").toggle();'>Click for Error Details:</p><div class=err style='display:none;'>" + msg + "<p>page: " + location.href + "<p>url: " + url + "<p>line: " + line + extra + "</div>");
                              $("#loading").hide();
                              $(".page").show();}, 1000);

    // TODO: Report this error via ajax so you can keep track
    //       of what pages have JS issues

    var suppressErrorAlert = true;
    // If you return true, then error alerts (like in older versions of 
    // Internet Explorer) will be suppressed.
    return suppressErrorAlert;
};

function onLine (){
    if (!isOnline){
        $(".catch-error").remove();
        location.reload(false);
        //document.location.href = MobileSite + "index.html";
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

//pull to refresh
window.onload = function() { if (typeof WebPullToRefresh === 'object') WebPullToRefresh.init( { loadingFunction: function(){ 
    if (cacheName === "dash")
    {
        localStorage.setItem("storageQueues", "");
        localStorage.setItem("storageAccountList", "");
        localStorage.setItem("ticketsStat", "");
    }
    else
        localStorage.setItem(cacheName, ""); 
    location.reload(false);}});};

//global helper functions
function logout(isRedirect, mess) {
    clearStorage();
    if (localStorage.is_google) {
        localStorage.removeItem('userName');
        localStorage.removeItem('is_google');
        GooglelogOut();
    }
    else if (isRedirect || true)
        window.location = "index.html" + (!mess ? "" : "?f="+mess);
}

if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

function GooglelogOut(mess) {
    mess = !mess ? "" : "?f="+mess;
    if (window.self === window.top && !confirm("Do you want to stay logged in Google account?")) {
        var logoutUrl = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=" + MobileSite;
        document.location.href = MobileSite + "index.html" + mess;
    }
    else
        window.location = "index.html" + mess;
}

function clearStorage()
{
    var userName = localStorage.userName;
    var appVersion = localStorage.appVersion;
    localStorage.clear();
    //localStorage.removeItem('userOrgKey');
    //localStorage.removeItem('userOrg');
    //localStorage.removeItem('userInstanceKey');
    //localStorage.removeItem('userKey');
    localStorage.setItem("userName", userName);
    localStorage.appVersion = appVersion;
    //clear also chrome ext if needed
    if (window.self !== window.top)
        window.top.postMessage("logout", "*");

}

function getInfo4Extension()
{
    if (window.self !== window.top)
    {
        var loginStr = "login?t=" + localStorage.getItem("userKey") +
            "&o=" + localStorage.getItem('userOrgKey') +
            "&i=" + localStorage.getItem('userInstanceKey'); 
        window.top.postMessage(loginStr,"*");
    }
}

function fullapplink (){
    // Create link to specific org | instance
    var urlString = AppSite + "?dept=" + localStorage.getItem('userInstanceKey') + "&org=" + localStorage.getItem('userOrgKey');
    if (isPhonegap) {
        //alert("gap!");
        $(".fullapplink").on('click', function (e) {
            e.preventDefault();
            openURLsystem(urlString);});
    } else if (window.self !== window.top) {

        $(".fullapplink").on('click', function (e) {
            e.preventDefault();
            //alert('Please register in new window and reopen Sherpadesk extension again.');
            var origOpenFunc = window.__proto__.open;
            origOpenFunc.apply(window, [urlString, "_blank"]); 
        });
    }
    else
    {
        $(".fullapplink").attr("target", "_blank");
        $(".fullapplink").attr("href", urlString);
    }

    return urlString;
}

function htmlEscape(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    //.replace(/\n/g, "<br />")
    ;
}

String.prototype.replaceAll = function (find, replace) {
    return this.split(find).join(replace);
    //return str.replace(new RegExp(find, 'g'), replace);
};

function matchKey(search, array){
for(var key in array) {
    if(key.indexOf(search) != -1) {
        return key;
    }
}
return "";
}
    

function addUrls(note, files)
{
    var length = files.length;
    var filearray = {};
    if (length)
    {
        var inlineImg = note.match(/\[cid:[^\[\]]*]/g);
        for(var i = 0; i < length; i++){
            note = note.replaceAll(" "+files[i].name, getFileLink(files[i].url));
            filearray['"'+files[i].name.substring(0, files[i].name.lastIndexOf("."))+'"'] = files[i].url;
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
                        filename = matchKey(filename.slice(0, -3), filearray);
                        if(filename && typeof(filearray[filename]) !== 'undefined' ) {
                            filename = filearray[filename];
                        }
                        else
                            filename = "";
                    }
                if (filename.length)
                    note = note.replaceAll(inlineImg[j], getFileLink(filename));
            }
        }
        //note = note.replaceAll("Following file was ", "");
        if (length > 1) {
            //note = note.replaceAll("Following files were ", "");
            note = note.replaceAll("a>,", "a>");
        }
        //note = note.replaceAll("uploaded:", "");
        note = note.replaceAll("a>.", "a>");
        //note += "<div class='attachmentBorder'></div>"; 
    }
    return note;
}

function getFileLink(file)
{
    var img ="";
    if (checkURL(file))
        img = "<img class=\"attachment\" src=\"" + file + "\">";
    else
        img = "<img style='float:none;' src='img/file.png'>&nbsp;" + decodeURIComponent(file.split("/").slice(-1)) + "<p></p>";

    return "<a class=\"comment_image_link\"" + 
        (isPhonegap ? (" href=# onclick='openURL(\"" +file + "\")'>"+img+"</a>") :
         (" target=\"_blank\" href=\"" +file + "\">"+img+"</a>"));
}


var featureList;
var featureList2;
var featureList3;
var featureList4;
var featureList5;

function filterList(listClass, value_names, init_value){
    $('body').attr('id', 'search_wrap');
    if (!value_names)
    {
        value_names = [ 'blockNumber', 'responseText', 'TicketBlockNumber', 'user_name'];
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
    if (init_value)
    {
        featureList.search(init_value);
        $(".search").val(init_value);
    }
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
    //console.log("loaded list");
    return featureList;
}
function float2int (value) {
    return value | 0;
}

function createElipse(text, containerWidth, fontSize){
    var len = text.length;
    if (len <= 10)
        return text;
    var windowWidth = $(window).width();
    if(windowWidth > 650){
        windowWidth = 650;
    }
    var characterSpace;
    containerWidth = containerWidth * windowWidth;
    characterSpace = containerWidth / fontSize;
    characterSpace = float2int(characterSpace);
    if(len -2 > characterSpace){
        text = text.substring(0,characterSpace)+'...';
    } 
    return text;
}

function createSpan(elname){
    var windowH = $(window).height();
    var elH = $("#content").height();
    if(windowH > elH + 60){
        elH = windowH - elH - 60;
        $("<p id=fill style='height:"+elH+"px'>&nbsp;</p>").appendTo(elname+"");
    }
}



$(document).ready(function(){
    //preload image
    var img = new Image();
    img.src = MobileSite + "img/error-background.png";

    var userOrgKey = "";
    var userOrg = "";
    var userInstanceKey = "";
    var	userKey = "";
    var accountDetailed = "";
    var selectedEditClass;

    function getApi (method, data, type) {
        var userKey = localStorage.getItem("userKey");
        var userOrgKey = localStorage.getItem('userOrgKey');
        var userInstanceKey = localStorage.getItem('userInstanceKey');
        if (!userKey || !userOrgKey || !userInstanceKey) {
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

    function getParameterByName(name) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    }

    function cleanQuerystring() {
        window.history.replaceState({}, document.title, MobileSite + Page);
    }
    
    function showError(e){
        var error = (((e || {}).responseJSON || {}).ResponseStatus || {}).Message;
        userMessage.showMessage(false, error || "Error. Please contact Administrator");
    }

    function fillSelect(returnData, element, initialValue, prefix, customValues, envelope_start, envelope_end)
    {
        if (!returnData || !returnData.length)
        { 
            $(""+element).parent().hide();
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
            var value = returnData[i].id;
            var name = "";
            if (!isCustom)
                name = returnData[i].name;
            else
            {
                var len = names.length-1;
                for(var j = 0; j < len; j++)
                    name += " " + returnData[i][names[j]];
                var email = returnData[i][names[len]];
                if (!name.trim())
                    name = email;
                else
                    name += " (" + email + ")";
            }
            insert += "<option value="+value+">"+prefix+name+"</option>";
        }
        // $(""+element).empty();
        if (i > 0){
            $(""+envelope_start + insert + envelope_end).appendTo(""+element);
            $(""+element).parent().show();
            $(""+element).parent().parent().show();
        }
        else
            $(""+element).parent().hide();
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

    // user login
    var UserLogin = {
        init: function () {
            var loginPage = true;
            if (Page != "index.html" && Page != "")
                loginPage = false;
            userKey = localStorage.getItem("userKey");
            userOrgKey = localStorage.getItem('userOrgKey');
            userInstanceKey = localStorage.getItem('userInstanceKey');
            if ((!userKey || !userOrgKey || !userInstanceKey) && !loginPage && Page != "org.html" && Page != "signup.html") {
                logout();
                return;
            }
            if (!loginPage)
                return;
            if (userKey && userOrgKey && userInstanceKey) {
                getInstanceConfig(userOrgKey, userInstanceKey);
                return;
            }
            if (userKey) {
                window.location = "org.html";
                return;
            }
            else {
                var key = getParameterByName('t');
                var email = getParameterByName('e');
                if (key) {
                    cleanQuerystring();
                    localStorage.setItem('is_google', true);
                    localStorage.setItem("userKey", key);
                    localStorage.setItem('userName', email);
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
            //localStorage.setItem("userKey",1)
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
            $(".page").show();
            userKey = localStorage.getItem("userKey");
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
                if (window.self !== window.top) {
                    //alert('Please goto Google login in new window and reopen Sherpadesk extension again.');
                    //$('form.google_openid').get(0).setAttribute('target', '_blank');
                }
                $('form.google_openid').get(0).submit();
            });
            $("#loginButton").click(function () { UserLogin.do_login(); });
            $(document).on("keypress", "#password, #userName", function (e) {
                if (e.which == 13) {
                    UserLogin.do_login();
                }
            });
            reveal();
        }
    };

    // org signup
    var OrgSignup = {
        init: function () {
            if (Page != "signup.html")
                return;
            var userName = localStorage.getItem('userName');
            if (userName !== null && userName.length > 0)
                $("#email").val(userName);
            $("#signupButton").click(function () { OrgSignup.add(); });
            $(document).on("change", "#name", function (e) {
                var t=$("#name").val();
                if (t)
                    $("#url").val(t.replace(/[^a-zA-Z 0-9]+|[\s]+/g, '').toLowerCase());
            });
            $("#is_force_registration").prop("checked", false);
            reveal();   
        },
        add: function () {
            var name = $("#name").val();
            var email = $("#email").val();
            var url = $("#url").val();
            var firstname = $("#firstname").val();
            var lastname = $("#lastname").val();
            var password = $("#password").val();
            var password_confirm = $("#password_confirm").val();
            var how = $("#how").val();
            if (name === '' || email === '' || url === '' || firstname === '' || lastname === '' || password === '' || password_confirm  === '') {
                userMessage.showMessage(false, "Please enter all fields!");
                return;
            }
            if (password != password_confirm) {
                userMessage.showMessage(false, "Passwords do not match!");
                return;
            }
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
                       "how_did_you_hear_about_us": how,
                       "note": isPhonegap ? "registered by iPhone" : "registered from mobile site"
                      },
                success: function (returnData) {
                    if (!returnData.api_token)
                    {
                        window.location = "index.html";
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
                    getInstanceConfig(returnData.organization, returnData.instance);
                },
                error: function ( event ) {
                    //"User already have one registered organization. Please set is_force_registration=true to continue."
                    if (event.status == 409)
                    {
                        userMessage.showMessage(false, "This email is already in use. Please choose action below");
                        localStorage.setItem('userName', $("#email").val());
                        $("#is_force_registration").prop("checked", true);
                        $("#signupButton").before("<center><h3 style='padding-top: 10px;'>This email is already in use. Would you like to</h3>"+" <div class=loginButton onclick='window.location = \"index.html\"'>Login</div>"+"<h3>or</h3></center>");
                        $("#signupButton").text("Create New Organization");
                        return;
                    }
                    userMessage.showMessage(false, event.statusText);
                }
            });
        }
    };

    //show closed tickets
    var closedTickets = {
        init:function() {
            this.showClosedTickets();
            this.pageChange();
        },

        pageChange:function() {
            $(".buttonShowClosedTickets").click(function(){
                window.location = "closedTickets.html";
            });
        },

        showClosedTickets:function() {
            if(localStorage.getItem("isMessage") == "truePos")
            {
                userMessage.showMessage(true);
            }
            var cacheName1 = "closed",
                retrievedObject = localStorage.getItem(cacheName1 +"tickets");
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
                ticketList.createTicketsList(retrievedObject, "#closedTickets");
                filterList("closedTickets");
            }
            setTimeout(function(){
                getApi("tickets?status=closed&account="+localStorage.getItem("DetailedAccount")).then(function(returnData) {
                    ticketList.createTicketsList(returnData, "#closedTickets", cacheName1);
                    filterList("closedTickets");
                },
                 function(e) {
                    showError(e);
                    console.log("fail @ closed accounts tickets");
                });
            }, time); 
        }
    };

    // pick up current detailed ticket
    var pickUpTicket = {
        init:function() {
            this.pick();
        },

        pick:function() {
            $("#pickUp").click(function(){
                getApi('tickets/'+localStorage.getItem("ticketNumber"),{
                    "action" : "pickup",
                    "note_text": ""
                }, 'PUT').then(function (d) {
                    userMessage.showMessage(true, 'Ticket pickup was Succesfull <i class="fa fa-thumbs-o-up"></i>');
                    window.location = "ticket_detail.html";
                },
                               function(e) {
                    showError(e);
                    console.log("fail @ pickup");
                });

            
            });
        }
    };

    // transfer current detailed ticket
    var transferTicket = {
        init:function() {
            this.transfer();
        },

        transfer:function() {
            $("#transfer").click(function(){
                $('#loading').removeAttr('style');
                $("#loading").show();
                $("#transfer").hide();
                $("#transferSelect").show();
                getApi("technicians?limit=200").then(function(returnData) {
                    //console.log(returnData);
                    // add techs to option select list
                    var insert = "<option value=0 disabled selected> Choose Tech</option>";
                    $(insert).appendTo("#transferTechs");
                    for(var i = 0; i < returnData.length; i++)
                    {
                        var value = returnData[i].id;
                        var name = returnData[i].firstname+" "+returnData[i].lastname;
                        insert = "<option value="+value+">"+name+"</option>";
                        $(insert).appendTo("#transferTechs");
                    }
                    reveal();
                },
                    function(e) {
                    showError(e);
                    console.log("fail @ listTechs");
                }
                                                    );
                // get value
                $("#transferTechs").on("change", function(){
                    var techId = $("#transferTechs").val();
                    getApi('tickets/'+localStorage.getItem("ticketNumber"),{
                        "action": "transfer",
                        "note_text": " ",
                        "tech_id": techId,
                        "keep_attached": false


                    }, 'PUT').then(function (d) {
                        location.reload(false);
                    },
                                   function(e) {
                    showError(e);
                    console.log("fail @ transferTechs");
                });
                });
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

    // close current detailed ticket
    var closeTicket = {
        init:function() {
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
                    setTimeout(
                        function()
                        {
                            userMessage.showMessage(true, 'Ticket has been Reopened <i class="fa fa-thumbs-o-up"></i>');
                            window.history.back();

                        }, 1000);
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
                "resolved": true,
                dataType: 'json',
                "confirmed": false,
                "confirm_note": ""

            }, 'PUT').then(function (d) {
                //location.reload(false);
                setTimeout(
                    function()
                    {
                        userMessage.showMessage(true, 'Ticket has been closed <i class="fa fa-thumbs-o-up"></i>');
                        window.history.back();

                    }, 1000);
                userMessage.setMessage(true, "Ticket was Closed <i class='fa fa-thumbs-o-up'></i>");
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
                $('#closingMessage').slideDown(400, function(){
                    $('#closeMessageButton').fadeIn();
                    $('html,body').animate({
                        scrollTop: $('#closeMessageButton').offset().top
                    },400);
                });
            });
            $('#closeMessageButton').click(function() {
                closeTicket.close($('#closingMessage').val());});
            $('#closeu').click(function() {
                closeTicket.close($('#commentText').val());});
        }
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
                    var appVersion = localStorage.appVersion;
                    var userKey = localStorage.userKey;
                    var userName = localStorage.userName;
                    localStorage.clear();
                    localStorage.userName = userName;
                    localStorage.userKey = userKey;
                    localStorage.appVersion = appVersion;
                    window.location = "org.html";
                });
        }
    };

    // create a new ticket
    var newTicket = {
        init:function() {
            $("#userCreate").on("click", function(){
                var user = $("#addTicketUser").val();
                if (user) localStorage.setItem('add_user_userid', user);
                var tech = $("#addTicketTechs").val();
                if (tech) localStorage.setItem('add_user_techid',tech);
                var account = $("#addTicketAccounts").val();
                if (account) localStorage.setItem('add_user_accountid',account);
                window.location = "add_user.html";
            });

            $("#TechCreate").on("click", function(){
                localStorage.setItem('add_user_type', 'tech');
                var user = $("#addTicketUser").val();
                if (user) localStorage.setItem('add_user_userid', user);
                var tech = $("#addTicketTechs").val();
                if (tech) localStorage.setItem('add_user_techid', tech);
                var account = $("#addTicketAccounts").val();
                if (account) localStorage.setItem('add_user_accountid',account);
                window.location = "add_user.html";           
            }); 

            this.addTicket();
        },
        addTicket:function() {
            $("#addTicketAccounts").empty();
            var accountset = localStorage.getItem('addAccountTicket');
            localStorage.setItem('addAccountTicket', '');
            if(!isTech){
                $("#addTicketAccounts").parent().hide();
            }
            else
            {

                if(!isAccount) {$("#addTicketAccounts").parent().hide();reveal();}
                else
                { var accounts = getApi("accounts?limit=300", {"is_with_statistics":false});
                 accounts.then(function(returnData) {
                     //console.log(returnData);
                     // get list of accounts add them to option select list
                     $("#addTicketAccounts").empty();
                     fillSelect(returnData, "#addTicketAccounts", "<option value=0 disabled selected>choose an account</option>");
                     var account =  localStorage.getItem('add_user_accountid');
                     accountset  = accountset ? accountset : account; 
                     if (accountset){
                         localStorage.setItem('add_user_accountid', '');
                         $("#addTicketAccounts").val(accountset);
                     }
                     reveal();
                 }, function(e) {
                    showError(e);
                    console.log("fail @ ticket accounts");
                 });
                }
            }

            // list of Users
            if (!isTech)
            {
                $("#addTicketUser").parent().hide();
                $("#userCreate").hide();
            }
            else
            {
                var userid = localStorage.getItem('add_user_userid');
                if (userid) localStorage.setItem('add_user_userid', "");
                else userid = localStorage.getItem('userId');

                var userName = localStorage.getItem('add_user_name');
                if (userName) localStorage.setItem('add_user_name', '');
                else userName = localStorage.getItem("userFullName");

                if (!userName.trim())
                    userName = localStorage.getItem("userName");

                $("#addTicketUser").append("<option value="+userid+" selected>"+userName+"</option>");

                var users = getApi("users?limit=2000");
                users.then(function(returnData){
                    //console.log(returnData);
                    // add techs to option select list
                    fillSelect(returnData, "#addTicketUser", "", "",
                               "firstname,lastname,email");
                    $("#addTicketUser").val(userid);
                },
                           function(e) {
                    showError(e);
                    console.log("fail @ TicketUser");
                }
                          );

            }

            // after an account is choosed it get a list of technicians

            // list of Tech
            if (!isTech)
            {
                $("#addTicketTechs").parent().hide();
                $("#TechCreate").hide();

            }
            else
            {
                var technicians = getApi("technicians?limit=200");
                technicians.then(function(returnData){
                    //console.log(returnData);
                    // add techs to option select list
                    fillSelect(returnData, "#addTicketTechs",
                               "<option value=0 disabled selected>choose a tech</option>", "",
                               "firstname,lastname,email");
                    var techid = localStorage.getItem('add_user_techid');
                    if (techid) {
                        localStorage.setItem('add_user_techid', '');
                        $("#addTicketTechs").val(techid);
                    }
                },
                                 function(e) {
                    showError(e);
                    console.log("fail @ Ticket Techs");
                }
                                );
            }

            if (!isTech)
            {
                $(".add_class").hide();
            }
            else
            {
            // after techs are choosen then get a list of classes
            var classes = getApi('classes');
            classes.done(
                function(classResults){
                    fillClasses(classResults, "#classTicketOptions", "<option value=0 disabled selected>choose a class</option>");
                });

            }

            // make api post call when submit ticket button is clicked

            $("#submitNewTicket").click(function(){
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
                        "account_id" : $("#addTicketAccounts").val(),
                        "user_id" : isTech ? $("#addTicketUser").val() : localStorage.getItem('userId'),
                        "tech_id" : $("#addTicketTechs").val()
                    }, "POST");
                    addTicket.then(function (d) {
                        if (!isTech)
                            location.replace("ticket_list.html");
                        else
                            setTimeout(backFunction, 1000);
                        userMessage.setMessage(true, "Ticket was Succesfully Created :)");
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

    // post a comment to a ticket on the ticket details page
    var postComment = {
        init:function(){
            this.sendComment();
        },

        sendComment:function(){
            $("#reply").click(function(){
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

    // Ajax calls for semi-universal search bar
    var search = {
        init:function(){
            this.universalSearch();
        },

        universalSearch:function(){
            //get the search value when the enter key is pressed
            $(document).on("keypress","#searchThis",function(e){
                if(e.which == 13) {
                    var searchItem  = $(".headerSearch").val().toLowerCase();
                    localStorage.setItem("searchItem",searchItem);
                    localStorage.setItem("ticketPage", "asTech");
                    window.location = "ticket_list.html";
                    return;
                    /*var found = false;
                    var matchedTickets = [];

                    // search for a account value that matches the search critera
                    $.ajax({
                        type: 'GET',
                        beforeSend: function (xhr) {
                            xhr.withCredentials = true;
                            xhr.setRequestHeader('Authorization',
                                                 'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
                        },

                        url:ApiSite +"accounts",
                        dataType:"json",
                        success: function(returnData) {
                            for(var i = 0; i < returnData.length; i++)
                            {
                                if(returnData[i].name.toLowerCase() == searchItem)
                                {
                                    found = true;
                                    localStorage.setItem("DetailedAccount", returnData[i].id);
                                }
                                if (found == true)
                                {
                                    window.location = "account_details.html";
                                }
                            }


                        },
                        complete:function(){
                            reveal();
                        },
                        error: function() {

                        }
                    });
                    // search for a ticket number that matches the search critera
                    $.ajax({
                        type: 'GET',
                        beforeSend: function (xhr) {
                            xhr.withCredentials = true;
                            xhr.setRequestHeader('Authorization',
                                                 'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
                        },

                        url:ApiSite +"tickets/?status=open"+searchItem,
                        dataType:"json",
                        success: function(returnData) {
                            localStorage.setItem("ticketNumber",searchItem);
                            window.location = "ticket_detail.html";


                        },
                        complete:function(){
                            reveal();
                        },
                        error: function() {

                        }
                    });

                    // search for tickets containing the search critera in the subject and return a list
                    $.ajax({
                        type: 'GET',
                        beforeSend: function (xhr) {
                            xhr.withCredentials = true;
                            xhr.setRequestHeader('Authorization',
                                                 'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
                        },

                        url:ApiSite +"tickets",
                        dataType:"json",
                        success: function(returnData) {
                            //console.log(returnData);
                            for(var i = 0; i < returnData.length; i++)
                            {
                                if(returnData[i].subject.toLowerCase().indexOf(searchItem) >= 0)
                                {
                                    matchedTickets.push(returnData[i]);
                                    found = true;

                                }
                            }
                            if(found == false){
                                $(".searchReturn").show();
                                $("body").addClass("bodyLock");
                                var insert = "<li class='' data-id=null><span class='returnedItem'>Nothing matches that Search</span></li>";
                                $(insert).appendTo(".searchReturn");
                            }
                            // add list of tickets that match the search critera
                            for(var a = 0; a < matchedTickets.length; a++)
                            {
                                $(".searchReturn").show();
                                $("body").addClass("bodyLock");
                                var insert = "<li class='searched' data-id="+matchedTickets[a].key+"><span class='returnedItem'> #"+matchedTickets[a].number+" "+matchedTickets[a].subject +"</span></li>";
                                $(insert).appendTo(".searchReturn");
                            }
                        },
                        complete:function(){
                            reveal();
                        },
                        error: function() {

                        }
                    });
                    // close the search when the "X" icon is pressed
                    $(document).on("click",".searchCloseExpanded", function(){
                        $("body").removeClass("bodyLock");
                        $(".searchReturn").hide();
                        $(".searchReturn").empty();
                    });
                    // close the search when something outside of the search is pressed
                    $(document).on("click",".bodyLock", function(){
                        $("body").removeClass("bodyLock");
                        $(".searchReturn").hide();
                        $(".searchReturn").empty();
                    });
                    // go to the ticket detail of the pressed returned search return
                    $(document).on("click",".searched", function(){
                        $("body").removeClass("bodyLock");
                        localStorage.setItem('ticketNumber', $(this).attr("data-id"));
                        window.location = "ticket_detail.html";
                    });
                    */
                }


            });

        }
    };
    
    // add time to an account
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
                getApi("accounts?limit=300", {"is_with_statistics":false}).then(function(returnData) {
                    //console.log(returnData);
                    // accounts to add time
                    var insert = "<option value=0>choose an account</option>";
                    for(var i = 0; i < returnData.length; i++)
                    {
                        insert += "<option value="+returnData[i].id+">"+returnData[i].name+"</option>";
                    }
                    $("#timeAccounts").html(insert);
                    if (account_id)
                    {
                        $("#timeAccounts").val(account_id);
                        //if (parseInt($("#timeAccounts").val()) !== account_id)
                        //    $("#timeAccounts").val(-1);
                    }
                    $("#timeAccounts").on("change", function(){
                        //console.log(timeLog.task_type_id);
                        addTime.chooseProjects(0, 0, 0);
                    });
                    reveal();

                },
                    function(e) {
                    showError(e);
                    console.log("fail @ time Accounts");
                }
                                                                               );
            }

            if(!isProject || ticket_id){
                $("#timeProjects").parent().hide();
                reveal();
            }
            else
            {
                var chooseProject = "<option value=0>choose a project</option>";
                $(chooseProject).appendTo("#timeProjects");
                addTime.chooseProjects(account_id, project_id, 0);
            }

            //add an expense
            $("#addexpenseButton").click(function(){
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
                    localStorage.setItem('userMessage','Expense was successfully added <i class="fa fa-money"></i>');
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
    var addUser = {
        init:function(){
            $(".innerCircle").click(function(){
                if ($(".innerCircle").hasClass("billFill")) {$("#addTicketPassword").hide(); $("#addTicketConfirmPassword").hide();}
                else  {$("#addTicketPassword").show(); $("#addTicketConfirmPassword").show();}

            });

            var value = localStorage.getItem('add_user_type');
            if (value == "tech"){
                $('.SherpaDesk').text('Add New Tech');
                $('.greenButton').text('Add New Tech');
                value = 'Tech';
            }
            else
                value = 'User';

            $("#submitNewUser").click(function(){
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
                Lastname = $("#addTicketLastname").val().trim();
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
                        userMessage.showMessage(true, value +' was created <i class="fa fa-thumbs-o-up"></i>', function(){ 
                            localStorage.setItem('add_user_name', '');
                            if (value == "Tech")
                            {
                                localStorage.setItem('add_user_techid', d.id);
                            }
                            else
                            {
                                localStorage.setItem('add_user_userid', d.id);
                                localStorage.setItem('add_user_name', Firstname + " " + Lastname);
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
    var addTime = {
        init:function(isEdit){
            this.addpicker();
            this.inputTime(isEdit);
        },
        addpicker: function(){
            jQuery('#date_start').datetimepicker({
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
            task_type_id = task_type_id || 0; 
            //$("#loading").show();
            $("#taskTypes").empty();
            $("<option value=0>choose a task type</option>").appendTo("#taskTypes");
            //get task types
            var taskTypes = getApi("task_types", data);
            taskTypes.then(
                function(returnData) {
                    ////console.log(returnData);
                    $("#taskTypes").empty();
                    // add task types to list
                    fillSelect(returnData, "#taskTypes", "<option value=0>choose a task type</option>");
                    if (task_type_id > 0)
                        $("#taskTypes").val(task_type_id);
                    reveal();
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
                $("#timeProjects").on("change", function(){
                    var project = $("#timeProjects").val();
                    addTime.getTaskTypes({"account" : account, "project": project}, task_type_id);
                });
                $("#timeProjects").empty();
                $("<option value=0>choose a project</option>").appendTo("#timeProjects");

                if (account !== "0"){
                    //get projects
                    $("#loading").fadeIn();
                    getApi("accounts/"+account, {"is_with_statistics":false}).then(
                        function(returnData) {
                            ////console.log(returnData);
                            // add projects
                            fillSelect(returnData.projects, "#timeProjects");
                            $("#timeProjects").val(project_id);
                            addTime.getTaskTypes({"account" : account, "project": project_id}, task_type_id);
                            reveal();

                        },
                        function(e) {
                    showError(e);
                    console.log("fail @ time Projects");
                }
                    );
                }
                else
                    $("#timeProjects").parent().show();
            }
            else
                addTime.getTaskTypes({"account" : account}, task_type_id);
        },
        inputTime:function(isEdit){
            var ticketKey = localStorage.getItem('ticketNumber');
            var isBillable = true;
            var date = new Date().toJSON().slice(0,10);

            // on submit click get the time and note typed by the user
            $("#submitTicketTime").click(function(){
                var time = $("#addTimeTicket").val();
                var note = htmlEscape($("#noteTimeTicket").val().trim());
                var tech = localStorage.getItem('techId');
                var task_type = $("#ticketTaskTypes").val();
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
                    localStorage.setItem('userMessage','Time was successfully added <i class="fa fa-thumbs-o-up"></i>');
                    window.location.replace("ticket_detail.html");
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
                addTime.getTaskTypes({"ticket" : ticketKey}, 0);
            }
            else
            {
                var timeLog = 0, timeEntry = localStorage.getItem("timeNumber");
                if (isEdit && timeEntry)
                {
                    timeLog = JSON.parse(timeEntry);
                    if (!timeLog.billable)
                        $(".innerCircle").removeClass("billFill");
                    $("#noteTime").val(timeLog.note);
                    $("#addTimeTicket").val(timeLog.hours);
                    $(".title").html("Time #"+ timeLog.time_id + " by " + timeLog.user_name + " @ " + new Date(timeLog.date).dateFormat("Y/\m/\d H:i"));
                    if (timeLog.start_time)
                        $("#date_start").val(new Date(timeLog.start_time).dateFormat("Y/\m/\d H:i"));
                    if (timeLog.stop_time)
                        $("#date_end").val(new Date(timeLog.stop_time).dateFormat("Y/\m/\d H:i"));
                }

                var account_id = localStorage.DetailedAccount ? localStorage.DetailedAccount : -1;
                var project_id = 0;
                var task_type_id = 0;
                if (timeLog)
                {
                    account_id = timeLog.account_id;
                    project_id = timeLog.project_id;
                    task_type_id = timeLog.task_type_id;
                }
                if(!isAccount)
                {
                    $("#timeAccounts").parent().hide();
                }
                else
                {
                    //get accounts
                    getApi("accounts?limit=300", {"is_with_statistics":false}).then(function(returnData) {
                        ////console.log(returnData);
                        $("#timeAccounts").empty();
                        var chooseAccount = "<option value=0>choose an account</option>";
                        $(chooseAccount).appendTo("#timeAccounts");
                        // accounts to add time
                        var insert = "";
                        for(var i = 0; i < returnData.length; i++)
                        {
                            insert += "<option value="+returnData[i].id+">"+ returnData[i].name+"</option>";
                        }
                        $(insert).appendTo("#timeAccounts");
                        $("#timeAccounts").val(account_id);
                        //if (parseInt($("#timeAccounts").val()) !== account_id)
                        //    $("#timeAccounts").val(-1);
                        reveal();

                    },
                        function() {
                       showError(e);
                    console.log("fail @ time accounts");
                }
                          );

                    $("#timeAccounts").on("change", function(){
                        //console.log(timeLog.task_type_id);
                        addTime.chooseProjects(0, project_id, task_type_id);
                    });
                }

                if(!isProject)
                    $("#timeProjects").parent().hide();
                else
                {
                    var chooseProject = "<option value=0>choose a project</option>";
                    $(chooseProject).appendTo("#timeProjects");
                    addTime.chooseProjects(account_id, project_id, task_type_id);
                    reveal();
                }

                $("#taskTypes").empty();
                $("<option value=0>choose a task type</option>").appendTo("#taskTypes");
                if (!isAccount && !isProject)
                    addTime.getTaskTypes({"account" : account_id, "project": project_id}, task_type_id);

                // submit time to account
                $("#submitTime").click(function(){
                    //alert(isEdit);
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
                    if(time === 0){
                        userMessage.showMessage(false, "Oops not enough time");
                        return;
                    } else if(accountId == '0' && isAccount){
                        userMessage.showMessage(false, "choose an account");
                        return;
                    }else{
                        ticketKey = parseInt(isEdit ? timeLog.ticket_id : ticketKey);
                        getApi('time' + (isEdit ? "/" + timeLog.time_id : ""),{
                            "tech_id" : isEdit ? timeLog.user_id : tech,
                            "project_id": projectId,
                            "is_project_log": !ticketKey,
                            "ticket_id": ticketKey,
                            "account_id" :accountId,
                            "note_text": note,
                            "task_type_id":taskId,
                            "hours":time,
                            "is_billable": isBillable,
                            "date": dat1 ? sdat: "",
                            "start_date": dat1 ? sdat : "",
                            "stop_date": dat2 ? edat : ""
                        }, isEdit ? 'PUT' : 'POST').then(function (d) {
                            localStorage.setItem('isMessage','truePos');
                            localStorage.setItem('userMessage','Time was successfully added <i class="fa fa-thumbs-o-up"></i>');
                            backFunction();
                        },
                        function (e, textStatus, errorThrown) {
                    showError(e);
                    console.log("fail @ pickup");
                }
                                                        );
                    }
                });
            }
        }
    };

    // needed methods to propogate a ticket detailed page
    var detailedTicket = {
        init:function(){
            if (!isTech){ $(".tabs").hide();
                         $("#closeu").show(); }
            else { $("#closeu").hide();}

            this.showTicket();
            this.updateTicket();
        },
        updateTicket: function(){
            $(".updateButton").click(function(){
                //var ticketAccount = $('form.update_ticket select#account').val(),
                var	ticketClass = selectedEditClass,
                    ticketLevel = $("#ticketLevel").val(),
                    ticketPriority = $("#ticketPriority").val(),
                    ticketProject = $("#ticketProject").val();

                var response = {
                    //"account_id" : ticketAccount,
                    "class_id" : ticketClass,
                    "level_id" : ticketLevel,
                    "priority_id" : ticketPriority,
                    "project_id" : ticketProject
                };

                getApi('tickets/' + localStorage.getItem('ticketId'), response, 'PUT').then(function(results){

                    console.log('Then Complete');
                    userMessage.setMessage(true, "Ticket was successfully updated <i class='fa fa-thumbs-o-up'></i>");
                    window.location = "ticket_detail.html";
                    userMessage.showMessage(true);

                    //SherpaDesk.getTicketDetail(configPass, key);
                    //addAlert("success", "Ticket has been Updated");

                });
            });
        },
        showTicket:function(){
            if(localStorage.getItem("isMessage") == "truePos")
            {
                userMessage.showMessage(true);
            }
            $('html,body').css('scrollTop','0');
            getApi("tickets/"+localStorage.getItem('ticketNumber')).then(
                function(returnData) {
                    ////console.log(returnData);
                    // calculate the number of days since the ticket was created
                    var daysOld = returnData.daysold_in_minutes / -60;
                    localStorage.setItem('techId', returnData.tech_id); // set the local storage variable with the tech id asscioted with this ticket
                    localStorage.setItem('ticketId',returnData.id); // set the local storage variable with the ticket ID
                    $("#ticketExpense").attr("href", "addExpence.html?ticket=" + returnData.id);
                    // check to see if the ticket is less than a day old
                    if(daysOld > 24){
                        daysOld = parseInt(daysOld/24) +" days ago";
                    } else {
                        daysOld = parseInt(daysOld) +" hours ago";
                    }
                    //check to see if a ticket is closed or open. If a ticket is closed the offer the reopen option
                    if(returnData.status == 'Closed'){
                        $('#closeIt').hide();
                        $('#closeu').hide();
                    }else{
                        $('#openIt').hide();
                    }
                    // update page variables with correct ticket information
                    var ticketHours = returnData.total_hours;
                    $("#ticketNumber").html(returnData.status+" | "+returnData.number);
                    $("#ticketSubject").html(returnData.subject);
                    $("#ticketClass").html(returnData.class_name);
                    $("#ticketTech").html(returnData.tech_firstname);
                    $("#lastUpdate").html(daysOld);
                    if (returnData.misc_cost)
                        $("#expenses").html("Expenses: " +localStorage.currency + Number(returnData.misc_cost).toFixed(2).toString());
                    else
                        $("#expenses").hide();
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
                        $("#ticketSLA").html("SLA: "+returnData.sla_complete_date.toString().substring(0,10));
                    }
                    var ticketTech = returnData.tech_email;
                    //console.log(ticketTech);
                    if(ticketTech == localStorage.getItem('userName')){
                        $('#pickUp').hide();
                    } 
                    //$("ul").find("[data-id='info']").click(function(){

                    var classes = getApi('classes');
                    var priorities = getApi('priorities');

                    $("#ticketLevel").empty();
                    if (!isLevel) $("#ticketLevel").parent().hide();
                    else{
                        // add select options to level Option box
                        getApi('levels').done(
                            function(levelResults){
                                if (fillSelect(levelResults, "#ticketLevel", "", "Level: ") > 0)
                                    $("#ticketLevel").val(returnData.level);
                            }
                        );
                    }
                    $("#classOptions").empty();
                    classes.done(
                        function(classResults){
                            //Init ticket class if not changed
                            selectedEditClass = returnData.class_id;
                            fillClasses(classResults, "#classOptions", "<option data-classId="+returnData.class_id+" value="+returnData.class_id+">Class: "+returnData.class_name+"</option>");
                        });

                    $("#ticketPriority").empty();
                    // add select options to priority option box
                    priorities.done(
                        function(prioritiesResults){
                            var priorityInsert = "";
                            for(var b = 0; b < prioritiesResults.length; b++)
                            {
                                priorityInsert += "<option value="+prioritiesResults[b].id+">Priority: " + prioritiesResults[b].priority_level + " - " +prioritiesResults[b].name+"</option>";
                            }
                            $(priorityInsert).appendTo("#ticketPriority");
                            $("#ticketPriority").val(returnData.priority_id);
                        }
                    );
                    $("#ticketTechs").empty();
                    // add select options to tech Option box
                    var insert = "";
                    for(var b = 0; b < returnData.technicians.length; b++)
                    {
                        insert += "<option value="+returnData.technicians[b].user_id+">"+returnData.technicians[b].user_fullname+"</option>";
                    }
                    $(insert).appendTo("#ticketTechs");

                    $("#location").remove();

                    if (!isProject)
                        $("#project").hide();
                    else
                    {
                        // add select options to project option box
                        var projects = getApi('projects');
                        projects.done(
                            function(projectResults){
                                if (fillSelect(projectResults, "#ticketProject", returnData.project_name == "" ? "<option value='null' disabled selected>Project</option>" : "") >0){
                                    if (returnData.project_name != "") $("#ticketProject").val(returnData.project_id);
                                }
                            }
                        );
                    }
                    //});

                    //add comments (ticketLogs) to the page
                    var logslen = returnData.ticketlogs.length;
                    var files = returnData.attachments || [];
                    //sort files by filename to avoid wrong replace
                    files.sort(function(a, b){
                        return b.name.length - a.name.length;
                    });
                    $(".orginalMessageContainer").empty();
                    detailedTicket.createLogs([returnData.ticketlogs.shift()], ".orginalMessageContainer", files);

                    // add the lastest comment to the top of the comments list
                    if (logslen > 1){
                        $("#comments").empty();
                        detailedTicket.createLogs(returnData.ticketlogs, "#comments", files);
                    }

                    reveal();
                },
                function(e) {
                    showError(e);
                    console.log("fail @ Ticket Detail");
                    setTimeout(function(){
                    window.location = "ticket_list.html";
                    }, 2000);
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
                var note = logs[c].note;
                var date = formatDate(logs[c].record_date);

                // comment insert
                insert[c] = "<ul class='commentBlock'><li><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=80' class='commentImg'></li><li class='commentText'><h3>"+userName+"</h3></li><li><span>"+date+"</span></li><li class='commentText'><p>"+ $("<span />", { html: note.replace(/<br\s*[\/]?>/gi, "\n") }).text().replace(/\n/g, "<p></p>")+"</p></li><li>"+type+"</li></ul>";
            }
            var notes = addUrls(insert.join(''), files);
            $table.html(notes);
        }
    };

    //get info for a specific invoice
    var detailedInvoice = {
        init:function(){
            if (localStorage.invoiceNumber.indexOf(",") != -1){
                $("#sendInvoiceButton").html("Create Invoice"); 
                $("#invoiceNumber").html("Create Invoice"); 
            }

            this.specifics();        
        },
        specifics:function(){
            var data = localStorage.invoiceNumber;
            if (data.indexOf(",") != -1)
            {
                data = data.split(",");
                data = "?status=unbilled&account="+data[0]+"&project="+data[1];
            }
            else
                data = "/"+data;
            
            var start_date, end_date;
            
            getApi("invoices"+data).then(function(returnData) {
                ////console.log(returnData);
                localStorage.setItem("invoiceAccountId",returnData.account_id);
                localStorage.setItem("invoiceProjectId",returnData.project_id);
                start_date = returnData.start_date || new Date().toJSON();
                end_date = returnData.end_date || new Date().toJSON();
                $("#invoiceNumber").html(returnData.id ? "Invoice  #"+returnData.id : "Create Invoice"); //invoice number            
                var nameCheck = returnData.customer;
                nameCheck = createElipse(nameCheck, 0.9, 12);                
                $("#customerName").html(nameCheck); // customer name
                var date = formatDate(returnData.date);
                $("#invoiceDate").html(date);
                $("#invoiceHours").html(returnData.total_hours+"<span class='detail3Small'>hrs</span>"); // hours to invoice
                var amount = Number(returnData.amount).toFixed(2).toString();
                var change = amount.substring(amount.length-3, amount.length);
                var amount = amount.substring(0, amount.length -3);
                
                $("#invoiceAmount").html(localStorage.getItem('currency')+amount +"<span class='detail3Small'>"+change+"</span>");  // invoice amount
                if (!isTravelCosts) {
                    $("#invoiceTravel").parent().parent().hide();
                }
                else {
                    $("#invoiceTravel").html(localStorage.getItem('currency') + returnData.travel_cost + "<span class='detail3Small'>.00</span>");
                }
                // travel expenses amount
                if (!isExpenses)
                    $("#invoiceExpenses").parent().parent().hide();
                else {
                    var expenses = 0;
                    if (returnData.expenses != null) {
                        for (var i = 0; i < returnData.expenses.length; i++) {
                            expenses = expenses + returnData.expenses[i].total;
                        }
                    }
                    $("#invoiceExpenses").html(localStorage.getItem('currency') + expenses + "<span class='detail3Small'>.00</span>"); // expenses amount
                }
                // adjustments
                $("#invoiceAdjustments").html(localStorage.getItem('currency') + "0<span class='detail3Small'>.00</span>");
                //$(".invoiceTotal").html("$"+returnData.total_cost+"<span class='detail3Small'>.00</span>");
                //console.log(Number(returnData.total_cost).toFixed(2).toString());
                amount = Number(returnData.total_cost).toFixed(2).toString();
                change = amount.substring(amount.length-3, amount.length);
                amount = amount.substring(0, amount.length -3);
                $(".invoiceTotal").html(localStorage.getItem('currency') + amount + "<span class='detail3Small'>" + change + "</span>");
                $("#recipientList").empty();
                // add recipients to recipients list
                if(returnData.recipients && returnData.recipients.length > 0){
                    returnData.recipients.sort(function(a,b){
                        return a.is_accounting_contact < b.is_accounting_contact ? 1 : -1;
                    });
                    for(var x = 0; x < returnData.recipients.length; x++)
                    {
                        var email = $.md5(returnData.recipients[x].email);
                        var insert = "<li class=recipientParent><ul class='recipientDetail'><li><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=80'></li><li><div class='recipient'><p>"+returnData.recipients[x].email+"</p>" +
                            (returnData.recipients[x].is_accounting_contact ? "<img class='plusIcon' id=\""+ returnData.recipients[x].email +"\"  src='img/check.png'> " : "<img class=closeIcon id=\""+ returnData.recipients[x].email +"\" src='img/error.png'>") + "</div></li></ul></li>";
                        $(insert).appendTo("#recipientList");
                    }
                }
                else
                {
                    var insert = "<li><h3 class=noDataMessage>No accounting contacts found.<p>&nbsp;</p></h3></li>";
                    $(insert).appendTo("#recipientList"); 
                    $("#sendInvoiceButton").remove();
                }
                //createSpan("#recipientList");
/*
                // adds timelogs asscoited with this invoice to the invoice timelogs list
                $("#invoiceLogs").empty();
                if(returnData.time_logs != null){
                    for(var u = 0; u < returnData.time_logs.length; u++)
                    {
                        var name = returnData.time_logs[u].name;
                        var log = returnData.time_logs[u].total;
                        var date = formatDate(returnData.time_logs[u].date);
                        var logID = returnData.time_logs[u].id;
                        var insert = "<li><ul id='invoiceTimelog' data-id='"+logID+"' data-info='"+JSON.stringify(returnData.time_logs[u]).replace(/'/g, "")+"'  class='timelog'><li><div class='billable timeLogAddButton' data-id='"+logID+"'><div class='innerCircle billFill'></div></div></li><li><h2 class='feedName'>"+name+"</h2><p class='taskDescription'>"+date+"</p></li><li><img class='feedClock' src='img/clock_icon_small.png'><h3 class='feedTime'><span>"+log+"</span></h3></li></ul></li>";
                        $(insert).appendTo("#invoiceLogs");
                    }
                }
                if(returnData.recipients != null){
                    $("#expensesList").empty();
                    for(var c = 0; c < returnData.expenses.length; c++)
                    {
                        var name = returnData.expenses[c].name;
                        var log = returnData.expenses[c].total;
                        var date = formatDate(returnData.expenses[c].date);
                        var logID = returnData.expenses[c].id;
                        var insert = "<li><ul id='invoiceExpense' class='timelog1'><li><div class='billable timeLogAddButton' data-id='"+logID+"'><div class='innerCircle billFill'></div></div></li><li><h2 class='feedName'>"+name+"</h2><p class='taskDescription'>"+date+"</p></li><li><h3 class='feedTime expenceCost'><span>$"+log+"</span></h3></li></ul></li>";
                        $(insert).appendTo("#expensesList");
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
                //alert(localStorage.getItem('invoiceNumber'));
                if ($(".recipient").children(".plusIcon").length < 1)
                {
                    userMessage.showMessage(false, "No accounting contacts added");
                    return;
                }
                var emails = ""; 
                $.each($(".recipient").children(".plusIcon"), function(){emails+=$(this).attr("id") + ",";}); 

                var data, number = localStorage.invoiceNumber;
                var isUnbilled = (number.indexOf(",") != -1);
                if (isUnbilled)
                {
                    number = number.split(",");
                    data = {"status": "unbilled", "account" : number[0], "project" : number[1], 
                            "start_date" : start_date, "end_date" : end_date};
                    number = 'invoices';
                }
                else
                {
                    data = {"action":"sendEmail"};
                    number = 'invoices/' +number;
                }

                data.recipients = emails;

                getApi(number, data, isUnbilled ? 'POST' : 'PUT').then(function (d) {
                    setTimeout(
                        function()
                        {
                            backFunction();
                        }, 1000);
                    userMessage.setMessage(true, "Hurray! Invoice sent");
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

    /*
	//methods & Api calls that deal with changing time adding adjustments, expenses
	var updateInvoice ={
		init:function(){
			this.changeInvoice();
		},

		changeInvoice:function(){
			//update timelog after being clicked
			$(document).on("click","#invoiceTimelog, #billem",function(){
				var timeId = $(this).attr("data-id");
				var billable = false;
				$(this).find(".innerCircle").toggleClass("billFill");
				//change billable to oposite of its current state
				if($(this).find(".innerCircle").hasClass("billFill"))
				{
					billable = false;
				}
				$.ajax({
    				type: 'PUT',
    				beforeSend: function (xhr) {
    				    xhr.withCredentials = true;
    				    xhr.setRequestHeader('Authorization',
    				                         'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
    				    },
    				url: ApiSite + 'time/'+timeId,
    				data: {
    				    	"is_billable" : billable,
							"is_project_log": true
						   },
    				dataType: 'json',
    				success: function (d) {
    				    console.log("time log has been updated "+billable);

    				},
    				error: function (e, textStatus, errorThrown) {
    				         console.log(textStatus);
    				}
 				});

			});
			//update expense after beign clicked
			$(document).on("click","#invoiceExpense",function(){
				var timeId = $(this).find(".timeLogAddButton").attr("data-id");
				alert(timeId);
				$(this).find(".innerCircle").toggleClass("billFill");

				$.ajax({
    				type: 'DELETE',
    				beforeSend: function (xhr) {
    				    xhr.withCredentials = true;
    				    xhr.setRequestHeader('Authorization',
    				                         'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
    				    },
    				url: ApiSite + 'expenses'+timeId,
    				data: {

						   },
    				dataType: 'json',
    				success: function (d) {
    				    console.log("Deleted Expense");

    				},
    				error: function (e, textStatus, errorThrown) {
    				         console.log(textStatus);
    				}
 				});
			});

			//add an expense
			$("#addexpenseButton").click(function(){

				$.ajax({
    				type: 'POST',
    				beforeSend: function (xhr) {
    				    xhr.withCredentials = true;
    				    xhr.setRequestHeader('Authorization',
    				                         'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
    				    },
    				url: ApiSite + 'expenses',
    				data: {
    				    	"account_id": localStorage.getItem("invoiceAccountId"),
    						"project_id": localStorage.getItem("invoiceProjectId"),
    						"tech_id": localStorage.getItem("user_id"),
    						"note": $("#expensesNote").val(),
    						"note_internal": $("#expensesInternal").val(),
    						"amount": $("#expenseAmount").val(),
    						"is_billable": true,
    						"vendor": "vendor name",
    						"markup": 10
						   },
    				dataType: 'json',
    				success: function (d) {
    				    console.log("time log has been added");

    				},
    				error: function (e, textStatus, errorThrown) {
    				         console.log(textStatus);
    				}
 				});
			});

			//add travel log
			$("#addTravelLog").click(function(){

			});

			//addTime to an invoice
			$("#submitInvoiceTime").click(function(){
				var techId = localStorage.getItem("userId");
				var projectId = localStorage.getItem("invoiceProjectId");
				var accountId = localStorage.getItem("invoiceAccountId");
				var note = $("#noteTimeTicket").val();
				var hours = $("#addTimeTicket").val();
				//console.log(techId);
				//console.log(projectId);
				//console.log(accountId);
				//console.log(note);
				//console.log(hours);
				$.ajax({
    				type: 'POST',
    				beforeSend: function (xhr) {
    				    xhr.withCredentials = true;
    				    xhr.setRequestHeader('Authorization',
    				                         'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
    				    },
    				url: ApiSite + 'time',
    				data: {
    				    	"tech_id" : techId,
    						"project_id": projectId,
    						"account_id" :accountId,
    						"note_text": note,
    						"task_type_id": 1,
    						"hours":hours,
    						"is_billable": true,
    						"date": new Date().toJSON(),
    						"start_date": new Date().toJSON(),
    						"stop_date": new Date().toJSON()
						   },
    				dataType: 'json',
    				success: function (d) {
    				    console.log("time log has been added");

    				},
    				error: function (e, textStatus, errorThrown) {
    				         console.log(textStatus);
    				}
 				});

			});

			//add and adjustment to an invoice
			$("#addAdjustment").click(function(){
				var amount = $("#adjustVal").val();
				var note= $("#adjustNote").val();
				var projectId = localStorage.getItem("invoiceProjectId");
				var accountId = localStorage.getItem("invoiceAccountId");
				$.ajax({
    				type: 'POST',
    				beforeSend: function (xhr) {
    				    xhr.withCredentials = true;
    				    xhr.setRequestHeader('Authorization',
    				                         'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
    				    },
    				url: ApiSite + 'invoices?status=unbilled&project=-1&account=-1&adjustments=-2.4&adjustments_note=my_note',
    				data: {

						   },
    				dataType: 'json',
    				success: function (d) {
    				    location.reload(false);

    				},
    				error: function (e, textStatus, errorThrown) {
    				         console.log(textStatus);
    				}
 				});
			});

		}
	};
	*/

    // get a list of invoices both for a specific account as well as a complete list of invoices
    var invoiceList = {
        init:function(is_unbilled){
            var accountid = localStorage.DetailedAccount;
            //todo localStorage.DetailedAccount = "";
            //cleanQuerystring();
            if (is_unbilled){
                $("#invoiceCreate").remove();
                $("h1.SherpaDesk").html("Create Invoices");
            }
            else
                $("#invoiceCreate").click(
                    function(){
                        //localStorage.setItem('add_user_techid',localStorage.getItem("currentQueue"));
                        //localStorage.setItem('add_user_accountid',account);
                        window.location.replace("Invoice_List.html?status=unbilled");
                    });
            this.listInvoices(accountid, is_unbilled);
        },

        listInvoices:function(accountid, is_unbilled){
            var localInvoiceList = [];
            // get list of invoices for a specific account
            getApi("invoices", {"status": is_unbilled, "account" : accountid}).then(
                function(returnData) {
                    $("#invoiceList").empty();
                    if(returnData.length == 0){
                        $('<h3 class="noDataMessage">no invoices at this time</h3>').prependTo('#invoiceList');
                        createSpan('#invoiceList');
                        reveal();
                        return;
                    }
                    else if(typeof returnData.length === 'undefined')
                        returnData = [returnData];
                    var insert = "";
                    for(var i = 0; i < returnData.length; i++)
                    {
                        var customer = createElipse(returnData[i].customer, 0.33, 12); // account name
                        var date = formatDate(returnData[i].date || returnData[i].end_date || new Date().toJSON());
                        var id = returnData[i].id;
                        if (is_unbilled) { 
                            //date = formatDate(returnData[i].start_date || new Date().toJSON()) + " to " + date;
                            id = returnData[i].account_id +","+returnData[i].project_id;// +","+(returnData[i].start_date || new Date().toJSON()).slice(0, 10) +","+ (returnData[i].end_date || new Date().toJSON()).slice(0, 10);
                        }
                        insert += "<ul data-id="+id+" class='invoiceRows item'><li class=user_name>"+customer+"</li><li class=responseText>"+date+"</li><li>$"+ Number(returnData[i].total_cost).toFixed(2)+"</li></ul>";
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
    var getQueueTickets = {
        init:function() {
            $(".title").html("Tickets @ " + localStorage.getItem("currentQueueName") + " Queue");
            this.queueTickets();
            $("#ticketCreate").click(
                function(){
                    localStorage.setItem('add_user_techid',localStorage.getItem("currentQueue"));
                    localStorage.setItem('add_user_accountid',account);
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
                    filterList("queueTickets");
                    reveal();
                    var retrievedObject, test = localStorage.getItem("storageQueues");
                    if (test){
                        match = new RegExp('\"' + queueId+',(\\d+)').exec(test);
                        if (match) {
                            test = JSON.parse(test);
                            retrievedObject = test[Number(match[1])];
                            if (retrievedObject) {
                                test[Number(match[1])].tickets_count = returnData.length;
                                localStorage.setItem("storageQueues", JSON.stringify(test));
                            }
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
    var getQueues = {
        init:function(parent, limit) {
            cacheName = "storageQueues";
            getQueues.queues(limit, parent);
        },

        queues:function(limit, parent) {
            var retrievedObject = localStorage.getItem("storageQueues");
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
                getQueues.createQueuesList(parent, retrievedObject, limit);
                if (!limit) createSpan(parent);
            }
            setTimeout(function(){
                getApi("queues", {"sort_by" : "tickets_count"}).then(function(returnData) {
                    getQueues.createQueuesList(parent, returnData, limit);
                    localStorage.setItem("storageQueues",JSON.stringify(returnData));
                    reveal();
                    if (!limit) {createSpan(parent);filterList("OptionsList");}
                },
                    function(e) {
                    showError(e);
                    console.log("fail @ Queues List");
             });
            }, time);
        },

        createQueuesList : function (parent, returnData, limit){
            // add queues to the queues list
            var badge=0, activeQueues=0;
            var textToInsert =  [],
                length = returnData.length,
                $table = $(parent);
            for (var i = 0; i<length; i += 1) {
                if (returnData[i].fullname.toLowerCase().indexOf("new ticket") == 0)
                    badge = returnData[i].tickets_count;
                returnData[i].index = returnData[i].id +',' + i;
                if (limit && returnData[i].tickets_count < 1)
                    continue;
                if (limit && activeQueues>= limit)
                    continue;
                textToInsert.push("<li class=item><div id='queue' data-id="+returnData[i].id+" class='OptionWrapper'><h3 class='OptionTitle user_name'>"+returnData[i].fullname+"</h3></div><div class='NotificationWrapper'><h2>"+returnData[i].tickets_count+"</h2></div></li>");

                if(length > 10 && i == 10){
                    $table.html(textToInsert.join(''));
                }
                activeQueues += 1;
            }
            $table.html(textToInsert.join(''));
            localStorage.badge = badge;
        }
    };

    // Ajax calls to get open tickets for the app user, tickets include (as tech, as user, as alt tech, all tickets)
    var ticketList = {
        init:function() {
            if (!isTech){
                this.userTickets(); 
                $('#userContainer').css('padding-top', '20px');
                $('#tabpage_reply').fadeIn();
            }
            else
            {
                this.userTickets();
                this.techTickets();
                this.altTickets();
                this.allTickets();
            }
        },
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
                    subject = createElipse(subject, 0.70, 12);
                    var newMessage = (returnData[i].is_new_tech_post && returnData[i].technician_email != localStorage.userName) || (returnData[i].is_new_user_post && returnData[i].user_email != localStorage.userName) ? "<i class='fa fa-envelope-o' style='color: #25B0E6;'></i> " : "";
                    // ensure ticket initial post length is not to long to be displayed (initial post is elipsed if it is)
                    if(initialPost.length > 150)
                    {
                        initialPost = initialPost.substring(0,150)+"...";
                    }
                    initialPost = $("<span />", { html: initialPost.replace(/<br\s*[\/]?>/gi, "\n") }).text();
                    textToInsert.push("<ul class='responseBlock item' id='thisBlock' data-id="+data+"><li><p class='blockNumber numberStyle'>#"+returnData[i].number+"</p><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=80' class='TicketBlockFace'><span class=user_name>"+returnData[i].user_firstname+"</span></li><li class='responseText'><h4>"+newMessage+subject+"</h4><p class ='initailPost'>"+initialPost+"</p></li><li><p class='TicketBlockNumber'>"+returnData[i].class_name+"</p></li></ul>");
                    if(length>10 && i==10){
                        $table.html(textToInsert.join(''));
                        textToInsert =  [];
                    }
                }
                $table.append(textToInsert.join(''));
                createSpan(parent);
                if (cachePrefix){
                    localStorage.setItem(cachePrefix+'tickets',JSON.stringify(returnData));
                }
            }
        },
        //get tickets as tech
        techTickets:function() {
            //$("#techContainer, #optionsConainer, #allContainer, #userContainer").hide();
            var cacheName1 = "tech",
                retrievedObject = localStorage.getItem(cacheName1 +"tickets");
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
                ticketList.createTicketsList(retrievedObject, "#techContainer");
                featureList2 = filterList("techContainer", "", localStorage.getItem("searchItem"));
            }
            setTimeout(function(){
                getApi("tickets?status=open&limit=100&role=tech").then(function(returnData) {
                    //add tickets as tech to as tech list
                    ticketList.createTicketsList(returnData, "#techContainer", cacheName1);
                    featureList2 = filterList("techContainer", "", localStorage.getItem("searchItem"));
                },
                    function(e) {
                    showError(e);
                    console.log("fail @ tech Container");
                }
                                                                      );}, time); 
        },
        //get all tickets in this orginization
        allTickets:function() {
            var cacheName1 = "all",
                retrievedObject = localStorage.getItem(cacheName1 +"tickets");
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
                ticketList.createTicketsList(retrievedObject, "#allContainer");
                featureList3 = filterList("allContainer", "", localStorage.getItem("searchItem"));
            }
            setTimeout(function(){
                getApi("tickets?status=allopen&limit=100&query=all").then(function(returnData) {
                    ticketList.createTicketsList(returnData, "#allContainer", cacheName1);
                    featureList3 = filterList("allContainer", "", localStorage.getItem("searchItem"));
                    localStorage.setItem("searchItem","");
                    reveal();

                },
                   function(e) {
                    showError(e);
                    console.log("fail @ all ticket List");
                }
            );}, time); 
        },

        // get alt tech tickets
        altTickets:function() {
            var cacheName1 = "alt",
                retrievedObject = localStorage.getItem(cacheName1 +"tickets");
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
                ticketList.createTicketsList(retrievedObject, "#altContainer");
                featureList4 = filterList("altContainer", "", localStorage.getItem("searchItem"));
            }
            setTimeout(function(){
                getApi("tickets?status=open&limit=100&role=alt_tech").then(function(returnData){
                    ticketList.createTicketsList(returnData, "#altContainer", cacheName1);
                    featureList4 = filterList("altContainer", "", localStorage.getItem("searchItem"));
                },
                    function(e) {
                    showError(e);
                    console.log("fail @ all ticket List");
                }
                                                                          );}, time); 
        },
        // get as user tickets
        userTickets:function() {
            $("maxSize").hide();
            var cacheName1 = "user",
                retrievedObject = localStorage.getItem(cacheName1 +"tickets");
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
                ticketList.createTicketsList(retrievedObject, "#userContainer");
                featureList5 = filterList("userContainer", "", localStorage.getItem("searchItem"));
            }
            setTimeout(function(){
                getApi("tickets?status=open,onhold&limit=100&role=user").then(function(returnData) {
                    ticketList.createTicketsList(returnData, "#userContainer", cacheName1);
                    featureList5 = filterList("userContainer", "", localStorage.getItem("searchItem"));
                },
                    function(e) {
                    showError(e);
                    console.log("fail @ user Container");
                    }
                                                                             );}, time); 
        }
    };

    String.format = function(format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/, function(match, number) { 
            return typeof args[number] !== 'undefined' ? args[number] : match;
        });
    };

    function BuildList(parent, arr, template, values, header)
    {
        header = header || '';
        var textToInsert = [header],
            length = returnData.length,
            $table = $(parent);
        for (var i = 0; i<length; i += 1) {
            textToInsert.push(template.format());
            if(length > 10 && i == 10){
                $table.html(textToInsert.join(''));
            }
        }
        $table.html(textToInsert.join(''));
    }

    //get a complete list of accounts attached to the orginizations
    var accountList = {
        init:function(parent, limit) {
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

            setTimeout(function(){ getApi("accounts?limit=300").then(function(returnData) {
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
                    nameCheck = createElipse(nameCheck, 0.75, 12);
                    textToInsert.push("<ul class='listedAccount item' data-id="+returnData[i].id+"><li class=user_name>"+nameCheck+"</li><li><div class='tks' "+(openTks > 99 ? "style='height: 42px;'>99<sup>+</sup>" : ">"+openTks)+"</div></li></ul>");

                    if(length > 10 && i == 10){
                        $table.html(textToInsert.join(''));
                    }
                }
                $table.html(textToInsert.join(''));
                createSpan(parent); filterList("ActiveAccountsContainer");
            }
        },
        createDashAccountsList : function (parent, returnData){
            var name = null;
            var textToInsert =  ["<ul class='tableHeader'><li></li><li>Hours</li><li>Expenses</li><li>Tkts</li></ul>"],
                length = returnData.length,
                $table = $(parent);
            for (var i = 0; i<length; i += 1) {
                returnData[i].index = returnData[i].id +',' + i;
                var openTks = returnData[i].account_statistics.ticket_counts.open;
                if (openTks < 1)
                    continue;
                var nameCheck = returnData[i].name;
                nameCheck = createElipse(nameCheck, 0.30, 12);
                var openHours = returnData[i].account_statistics.hours;
                if(openHours > 999){
                    openHours = 999;
                }
                textToInsert.push("<ul class='tableRows clickme' data-id=" + returnData[i].id + "><li>" + nameCheck + "</li><li>" + openHours + "</li><li>" + localStorage.getItem('currency') + Number(returnData[i].account_statistics.expenses).toFixed(2) + "</li><li><div class='tks1 " + (openTks > 99 ? "overflowTickets' style='height: 42px;'>99<sup>+</sup>" : "'>"+openTks) + "</div></li></ul>");

                if(length > 10 && i == 10){
                    $table.html(textToInsert.join(''));
                }
            }
            $table.html(textToInsert.join(''));
        }
    };

    $(document).on("click",".timelog", function(){
        localStorage.setItem('timeNumber', $(this).attr("data-info")); //set local storage variable to the ticket id of the ticket block from the ticket list
        window.location = "edit_time.html"; // change page location from ticket list to ticket detail list
    });

    // get complete list of timelogs for the orginization
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
                        var hours = returnData[i].hours;
                        hours =hours.toString();
                        var nameCheck = returnData[i].user_name;
                        text = createElipse(text, 0.50, 8);
                        if(hours.indexOf(".") >= 0)
                        {
                            // do nothing
                        }
                        else
                        {
                            hours = hours+".00";
                        }
                        nameCheck = createElipse(nameCheck, 0.50, 12);
                        var log = "<li class=item><ul class='timelog' data-id="+id+" data-info='"+JSON.stringify(returnData[i]).replace(/'/g, "")+"'> <li><img class='timelogProfile' src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=80'></li><li><h2 class='feedName user_name'>"+nameCheck+"</h2><p class='taskDescription responseText'>"+text+"</p></li><li><img class='feedClock'src='img/clock_icon_small.png'><h3 class='feedTime'><span>"+hours+"</span></h3></li></ul></li>";
                        $(log).appendTo("#timelogs");
                        if (i==9)
                            reveal();
                        //localTimelogs.push(log);
                    }
                }
                createSpan("#timelogs");
                reveal();
                //localStorage.setItem("storageTimeLogs",LZString.compressToUTF16(JSON.stringify(localTimelogs)));
                if (returnData.length > 1)
                    filterList("timelogs");
            },
                    function(e) {
                    showError(e);
                    console.log("fail @ time logs");
                }
                                                );
        }
    };


    // calls and methods to propagate the account details page
    var accountDetailsPageSetup = {
        init:function() {
            var ticketAccount = localStorage.getItem('DetailedAccount');
            localStorage.setItem('addAccountTicket', ticketAccount);
            this.pageSetup();
        },
        createAccDetails: function (returnData) {
            var accountHours = returnData.account_statistics.hours,
                accountTickets = returnData.account_statistics.ticket_counts.open,
                accountInvoices = returnData.account_statistics.invoices;
            $("#AD").html(returnData.name);
            $("#ticketsOptionTicker").html(accountTickets > 999 ? 999 : accountTickets);
            $("#invoiceOptionTicker").html(accountInvoices > 999 ? 999 : accountInvoices);
            $("#timesOptionTicker").html(accountHours > 999 ? 999 : accountHours);
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
            var match, time = cacheTime, timeTickets=cacheTime;
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
                reveal();
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
                $("#accountLogs").empty();
                //add timelogs to log list
                for(var i = 0; i < returnData.length; i++)
                {
                    var email = $.md5(returnData[i].user_email);
                    var text = returnData[i].note;
                    // check for two decimals
                    var hours = returnData[i].hours;
                    hours =hours.toString();
                    if(hours.indexOf(".") < 0)
                    {
                        hours = hours+".00";
                    }
                    text = createElipse(text, 0.50, 8);
                    var nameCheck = returnData[i].user_name;
                    nameCheck = createElipse(nameCheck, 0.50, 12);
                    var log = "<li><ul class='timelog' data-info='"+JSON.stringify(returnData[i]).replace(/'/g, "")+"'> <li><img class='timelogProfile' src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=80'></li><li><h2 class='feedName'>"+nameCheck+"</h2><p class='taskDescription'>"+text+"</p></li><li><img class='feedClock'src='img/clock_icon_small.png'><h3 class='feedTime'><span>"+hours+"</span></h3></li></ul></li>";
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
        },
        setTicketCounts: function (returnData) {
            var allTickets = returnData.open_all;
            //if ticket count is greater than 100 sub 99+
            if(allTickets > 100){
                allTickets = "99<sup>+</sup>";
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
            localStorage.setItem('userRole', returnData.user.is_techoradmin ? "tech" : "user");
            isTech = returnData.user.is_techoradmin;
            localStorage.setItem('projectTracking', returnData.is_project_tracking);
            localStorage.setItem('timeTracking', returnData.is_time_tracking);
            localStorage.setItem('accountManager', returnData.is_account_manager);
            localStorage.setItem('ticketLevels', returnData.is_ticket_levels);
            localStorage.setItem('classTracking', returnData.is_class_tracking);
            localStorage.setItem('locationTracking', returnData.is_location_tracking);
            localStorage.setItem('freshbooks', returnData.is_freshbooks);
            localStorage.setItem('is_invoice', returnData.is_invoice);
            localStorage.setItem('is_expenses', returnData.is_expenses);
            localStorage.setItem('is_travel_costs', returnData.is_travel_costs);
            localStorage.setItem('currency', returnData.currency);
            localStorage.setItem("userFullName", returnData.user.firstname+" "+returnData.user.lastname);
            localStorage.setItem('userId', returnData.user.user_id);
            if (paramFunc && (typeof paramFunc == "function"))
                paramFunc(); 
            //success login only
            else
                getInfo4Extension();
            if (is_redirect)
            {
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
            getApi("users?query="+localStorage.getItem('userName')).then(function(returnData) {
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
    var org = {
        init: function () {
            if (Page != "org.html")
                return;
            $('.instSelect').hide();
            userKey = localStorage.getItem("userKey");
            if (!userKey)
            {
                window.location = "index.html";
                return;
            }
            userOrgKey = localStorage.getItem('userOrgKey');
            userInstanceKey = localStorage.getItem('userInstanceKey');
            //sets user role to user in local storage
            localStorage.setItem('userRole', "user");
            if (userOrgKey && userInstanceKey)
            {
                getInstanceConfig(userOrgKey, userInstanceKey);
                return;
            }
            this.getOrg();
            //hide load screen
        },

        getOrg: function() {
            $(".page").show();
            $("#loading").show();
            userKey = localStorage.getItem("userKey");
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
                    //console.log(results);
                    // If there are more than one org
                    if (results.length > 1) {
                        localStorage.setItem('sd_is_MultipleOrgInst', 'true');
                        var orglistitem = results;
                        for (var i = 0; i < orglistitem.length; i++) {
                            var insert = "<li class=item><div id='org' data-id="+i+" class='OptionWrapper1'><h3 class='OptionTitle user_name'>"+orglistitem[i].name+"</h3></div></li>";
                            $('#orgsPage').append(insert);
                        }
                        $(document).on("click","#org", function () {
                            var index_number = $(this).attr("data-id");
                            userOrgKey = results[index_number].key;
                            userOrg = results[index_number].name;
                            var instances = results[index_number].instances;
                            localStorage.setItem('userOrgKey', userOrgKey);
                            localStorage.setItem('userOrg', userOrg);

                            if (instances.length == 0) {
                                userMessage.showMessage(false, "You are not associated with any Instance in the Organization or your account is inactivated in the Instances.");
                                return;
                            }

                            // If there is only one instance on the selected org
                            if (instances.length == 1) {
                                userInstanceKey = instances[0].key;
                                localStorage.setItem('userInstanceKey', userInstanceKey);
                                getInstanceConfig(userOrgKey, userInstanceKey);
                            }
                            else {
                                // If there is MORE than one instance on the selected org
                                //$("p[class!='intro']") 
                                $('#instsPage').empty();
                                $("div.OptionWrapper1[data-id!='"+index_number+"']").parent().remove();
                                //$('#orgsPage').find('option:gt(0)').remove();
                                for (var i = 0; i < instances.length; i++) {
                                    var insert = "<li class=item><div id='inst' data-id="+i+" class='OptionWrapper2'><h3 class='OptionTitle user_name'>"+instances[i].name+"</h3></div></li>";
                                    $('#instsPage').append(insert);
                                }
                                $('.instSelect').show();
                                // listen for Instance selection
                                $(document).on("click","#inst", function () {
                                    var userInstanceKey = instances[$(this).attr("data-id")].key;
                                    localStorage.setItem('userInstanceKey', userInstanceKey);
                                    localStorage.setItem('sd_is_MultipleOrgInst', 'true');
                                    $("#loading").show();
                                    getInstanceConfig(userOrgKey, userInstanceKey);
                                });
                            }
                        });
                    }// End > 1

                    // If there is ONLY ONE org and instance
                    if (results.length == 1) {
                        userOrgKey = results[0].key;
                        userOrg =  results[0].name;
                        localStorage.setItem('userOrgKey', userOrgKey);
                        localStorage.setItem('sd_is_MultipleOrgInst', 'false');
                        localStorage.setItem('userOrg', userOrg);
                        var insert = "<li class=item><div id='org' data-id=0 class='OptionWrapper1'><h3 class='OptionTitle user_name'>"+results[0].name+"</h3></div></li>";
                        $('#orgsPage').append(insert);
                        //location.reload(true);
                        var instances = results[0].instances;
                        // If there is only one instance on the selected org
                        if (instances.length == 1) {
                            userInstanceKey = instances[0].key;
                            localStorage.setItem('userInstanceKey', userInstanceKey);
                            getInstanceConfig(userOrgKey, userInstanceKey);
                        }
                        else {
                            $('#instsPage').empty();
                            // If there is MORE than one instance on the selected org
                            for (var i = 0; i < instances.length; i++) {
                                var insert = "<li class=item><div id='inst' data-id="+i+" class='OptionWrapper2'><h3 class='OptionTitle user_name'>"+instances[i].name+"</h3></div></li>";
                                $('#instsPage').append(insert);
                            }
                            $('.instSelect').show();
                            // listen for Instance selection
                            $(document).on("click","#inst", function () {
                                var userInstanceKey = instances[$(this).attr("data-id")].key;
                                localStorage.setItem('userInstanceKey', userInstanceKey);
                                localStorage.setItem('sd_is_MultipleOrgInst', 'true');
                                $("#loading").show();
                                getInstanceConfig(userOrgKey, userInstanceKey);
                            });
                        }
                    }
                    //storeLocalData();
                    //window.location = "index.html";
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

    var miscClicks = {
        init:function() {
            this.justClicked();
            //this.menuFunctions();
        },

        justClicked:function() {
            $createButton = $("#ticketCreate");
            if ($createButton){
                $createButton.click(
                    function(){
                        window.location.replace("add_tickets.html");
                    });
            }
            $("#invoiceOption").click(function(){
                window.location = "Invoice_List.html";
            });
            // go to complete list of invoice on click
            $("#allInvoice").click(function(){
                window.location = "allInvoice_List.html";
            });
            $(document).on("click",".invoiceRows", function(){
                localStorage.setItem('invoiceNumber',$(this).attr("data-id"));
                window.location = "invoice.html";
            });
            $(document).on("click",'.tableRows, .listedAccount', function(){
                localStorage.setItem('DetailedAccount',$(this).attr("data-id"));
                window.location = "account_details.html";
            });
            $(document).on("click",".responseBlock", function(){
                localStorage.setItem('ticketNumber', $(this).attr("data-id")); //set local storage variable to the ticket id of the ticket block from the ticket list
                window.location = "ticket_detail.html"; // change page location from ticket list to ticket detail list
            });
            $(document).on("click","#queue", function(){
                localStorage.setItem('currentQueue',$(this).attr("data-id"));
                localStorage.setItem('currentQueueName',$(this).find(".OptionTitle").text());
                window.location = "queueTickets.html";
            });
            $(document).on('click','#asUserStat', function(){
                localStorage.setItem('ticketPage','asUser');
                window.location = "ticket_list.html";
            });
            $(document).on('click','#techStat', function(){
                localStorage.setItem('ticketPage','asTech');
                window.location = "ticket_list.html";
            });
            $(document).on('click','#asAltTechStat', function(){
                localStorage.setItem('ticketPage','asAltTech');
                window.location = "ticket_list.html";
            });
            $(document).on('click','#allTicketsStat', function(){
                localStorage.setItem('ticketPage','allTickets');
                window.location = "ticket_list.html";
            });
        },

        menuFunctions:function(){
            //set ticket amount in menu 
            var techTicketStats = localStorage.getItem('techStat');
            if(techTicketStats == null){
                $('.menuTicketsStat').hide();
            }else{
                if(techTicketStats > 100){
                    techTicketStats = 99;
                }
                $(".menuTicketStatNumber").html(techTicketStats);
            }
        }
    };

    var userMessage = {
        init:function() {
            this.showMessage();
        },
        setMessage:function(isPos, messageText, func) {
            localStorage.setItem("userMessage", messageText);
            localStorage.setItem("isMessage", isPos ? "truePos" : "trueNeg");
        },
        showMessage:function(isPos, messageText, func) {
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

            $(messageEl).html(messageText);
            $(messageEl).slideDown(100);
            setTimeout(
                function()
                {
                    $(messageEl).slideUp(100);
                    if(typeof func === 'function')
                        func();
                }, 3500);
        }
    };

    function routing(){
        if (localStorage.getItem('userRole') === "tech")
            isTech = true;
        if (localStorage.getItem('projectTracking') === "false")
            isProject = false;
        if (localStorage.getItem('timeTracking') === "false")
            isTime = false;
        if (localStorage.getItem('accountManager') === "false")
            isAccount = false;
        if (localStorage.getItem('ticketLevels') === "false")
            isLevel = false;
        if (localStorage.getItem('classTracking') === "false")
            isClass = false;
        if (localStorage.getItem('locationTracking') === "false")
            isLocation = false;
        if (localStorage.getItem('freshbooks') === "false")
            isFreshbook = false;
        if (localStorage.getItem('is_invoice') === "false")
            isInvoice = false;
        if (localStorage.getItem('is_expenses') === "false")
            isExpenses = false;
        if (localStorage.getItem('is_travel_costs') === "false")
            isTravelCosts = false;
        if (localStorage.getItem('sd_is_MultipleOrgInst') === "false")
        {
            is_MultipleOrgInst = false;
            $("#switchOrg").hide();
        }
        else
            $("#switchOrg").show();
        if (!isTime)
            $(".time").remove();
        //refresh version
        if (localStorage.appVersion !== appVersion)
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
            //return;
        }
        fullapplink();
        if (typeof navigator.splashscreen !== 'undefined') 
            navigator.splashscreen.hide();
        
        //Disable for user
        if (!isTech){
            $(".sideNavLinks").children(":not('.user')").hide();
        }
        //Only for tech
        else{
            if(!isAccount)
                $("#itemAccount").parent().hide();
            if(!isInvoice)
            { 
                $("#itemInvoice").hide();
                $("#invoiceFooter").hide();
            }
            if (!isExpenses)
                $(".expense").hide();

            //conditional api calls determined by page
            if (Page=="dashboard.html")
            {
                localStorage.DetailedAccount = '';
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
            if (Page=="account_details.html")
            {
                if (isAccount)
                {
                    if(!isInvoice) $("#invoiceOption").parent().remove();
                    accountDetailsPageSetup.init();
                    //detailedTicket.init();
                    closedTickets.pageChange();
                    return;
                }
            }
            if (Page=="Account_List.html")
            {
                if (isAccount)
                {
                    localStorage.DetailedAccount = '';
                    accountList.init("#fullList");
                    return;
                }
            }
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
            if (Page=="accountTimes.html")
            {
                if (isTime && isAccount)
                {
                    accountTimeLogs.init();
                    //timeLogs.init();
                    return;
                }
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
                getQueueTickets.init();
                return;
            }
            
            if (Page=="closedTickets.html")
            {
                // detailedTicket.init();
                closedTickets.init();
                return;
            }
            //$("#loading").show();
            if (Page=="addTicketTime.html")
            {
                if (isTime) { 
                    addTime.init();
                    return;
                }

            }
            
            //set page
            var currPage = Page+'_ref';
            
            backFunction = function(){
                if (!currRef)
                    history.back();
                else {
                    var reff = localStorage.getItem(currPage);
                    localStorage.setItem(currPage, "");
                    window.location.replace(reff);
                }

            };
            
            if (Page=="Invoice_List.html")
            {
                if (isTime && isInvoice)
                {
                    var is_unbilled = getParameterByName("status");
                    invoiceList.init(is_unbilled);
                    if (is_unbilled)
                        if (!localStorage.getItem(currPage))
                            localStorage.setItem(currPage, document.referrer || localStorage.referrer || "index.html");
                    return;
                }
            }
            if (!localStorage.getItem(currPage))
            localStorage.setItem(currPage, document.referrer || localStorage.referrer || "index.html");
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
                    //window.location.replace(document.referrer);
                    addTime.init();
                    return;
                }
            }
            if (Page=="add_user.html")
            {
                //window.location.replace(document.referrer);
                addUser.init();
                return;
            }
            
            if (Page=="addExpence.html")
            {
                if (isExpenses)
                {
                    //window.location.replace(document.referrer);
                    addExpence.init();
                    return;
                }
            }
            if (Page=="edit_time.html")
            {
                if (isTime)
                {
                    //window.location.replace(document.referrer);
                    addTime.init(true);
                    return;
                }
            }
            if (Page=="add_tickets.html")
            {
                //window.location.replace(document.referrer);
                newTicket.init();
                //accountTimeLogs.init();
                return;
            }
        }
        if (Page=="ticket_list.html")
        {
            ticketList.init();
            //accountDetailsPageSetup.init();
            return;

        }
        if (Page=="ticket_detail.html")
        {
            detailedTicket.init();
            pickUpTicket.init();
            transferTicket.init();
            closeTicket.init();
            //addTime.init();
            postComment.init();
            return;
        }
        if (Page=="add_tickets.html")
        {
            //window.location.replace(document.referrer);
            newTicket.init();
            //accountTimeLogs.init();
            return;
        }

        //window.location = isTech ? "dashboard.html" : "ticket_list.html";
    }

    //Main Method that calls all the functions for the app
    (function () {
        //always active api calls
        userMessage.init();
        UserLogin.init();
        org.init();
        OrgSignup.init();
        switchOrg.init();
        //userInfo.init();

        //when user logged in
        if (Page !="index.html" && Page != "" && Page !="org.html")
        {
            var updateStatusBar = navigator.userAgent.match(/iphone|ipad|ipod/i) &&
                parseInt(navigator.appVersion.match(/OS (\d)/)[1], 10) >= 7;
            if (updateStatusBar) {
                var t=document.getElementsByTagName("header")[0];
                if (t){
                    t.style.paddingTop = "10px";
                    t.style.height = "63px";
                    $('body').css('margin-top', function (index, curValue) {
                        return parseInt(curValue, 10) + 10 + 'px';
                    });
                }
                t = document.getElementById("ptr");
                if (t){t.style.marginTop = "10px";}
            }
            //set the name of the nav side menu
            //$(".navName").html(localStorage.getItem("userFullName"));
            //set user avatar picture in side menu
            //$(".navProfile").attr("src","http://www.gravatar.com/avatar/" + $.md5(localStorage.getItem("userName")) + "?d=mm&s=80");
            //$(".navName").show();
            //$(".navProfile").show();
            signout.init();
            miscClicks.init();
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
        }
    }());


});
