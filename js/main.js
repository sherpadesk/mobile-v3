/*global jQuery, $ */

var appVersion = "13";
var adMessage = "Added badge on New Ticket queue";

//Root Names
var Site = 'sherpadesk.com/';
var MobileSite = 'http://m.' + Site;
var AppSite = 'https://app.' + Site;

var ApiSite = 'http://api.' + Site;

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

function checkURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
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
    if (localStorage.badge > 0){
        cordova.plugins.notification.badge.set(localStorage.badge);
    }
    else
        cordova.plugins.notification.badge.clear();
}

//open link	in blank
function openURL(urlString){
    window.open(urlString, '_blank', 'location=no,EnableViewPortScale=yes');
}

//open link	in system
function openURLsystem(urlString){
    window.open(urlString, '_system');
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
});

function reveal() {
    $("#loading").fadeOut();
};


//If User is Offline....................................
function errorLine(message){
    var func = "location.reload(false)";
    $("#scroller").hide();
    if (!$(".catch-error").length) {
        $('body').prepend('<div class="catch-error"><div class="catch-error-description"><h2>&nbsp;</h2><h2>&nbsp;</h2><h2>Something went wrong...</h2><div id="ctl00_PageBody_StackTrace" class="return-button"><p /><p /><h4>'+message+'</h4><h4>&nbsp;<p>P.S.  Uh... a Yeti just attacked your  camp!</h4><center><button class=loginButton style="width: 200px;" onclick="'+func+'">Refresh</button></center></div></div>');
    }
};

function offLine(){
        var func = "redirectToPage()";
        isOnline = false;
    if (!$(".catch-error").length) {
        $('body').prepend('<div class="catch-error"><div class="catch-error-description"><h2>&nbsp;</h2><h2>&nbsp;</h2><h2>Check your internet connection!</h2><div id="ctl00_PageBody_StackTrace" class="return-button"><p /><p /><h4>P.S.  Uh... a Yeti just attacked your  camp!</h4><center><button class=loginButton style="width: 200px;" onclick="'+func+'">Refresh</button></center></div></div>');
    }
};

window.onerror = function(msg, url, line, col, error) {
    // Note that col & error are new to the HTML 5 spec and may not be 
    // supported in every browser.  It worked for me in Chrome.
    var extra = !col ? '' : '<p>column: ' + col;
    extra += !error ? '' : '<p>error: ' + error;

    // You can view the information in an alert to see things working like this:
    errorLine("<p onclick='$(\".err\").toggle();'>Click for Error Details:</p><div class=err style='display:none;'>" + msg + "<p>page: " + location.href + "<p>url: " + url + "<p>line: " + line + extra + "</div>");

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
};

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
             // offLine();
         };
         img.src = MobileSite + "img/select_arrow.png?rand=" + Math.random();
     }
    }
    else
    {
        // offLine();
    }
};

//pull to refresh
window.onload = function() { if (typeof WebPullToRefresh === 'object') WebPullToRefresh.init( { loadingFunction: function(){ location.reload(false); }});};

//global helper functions
function logout(isRedirect, mess) {
    if (typeof isRedirect === "undefined")
        isRedirect = true;
    clearStorage();
    if (localStorage.is_google) {
        localStorage.removeItem('userName');
        localStorage.removeItem('is_google');
        GooglelogOut();
    }
    else if (isRedirect)
        window.location = "index.html" + ((typeof mess === "undefined") ? "" : "?f="+mess);
}

if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

function GooglelogOut(mess) {
    if (window.self === window.top && !confirm("Do you want to stay logged in Google account?")) {
        var logoutUrl = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=" + MobileSite;
        document.location.href = location.href.replace(/(.+\w\/)(.+)/, "$1") + "index.html" + ((typeof mess === "undefined") ? "" : "?f="+mess);
    }
    else
        window.location = "index.html" + ((typeof isRedirect === "undefined") ? "" : "?f="+mess);
}

function clearStorage()
{
    var userName = localStorage.userName;
    localStorage.clear();
    localStorage.removeItem('userOrgKey');
    localStorage.removeItem('userOrg');
    localStorage.removeItem('userInstanceKey');
    localStorage.removeItem('userKey');
    localStorage.setItem("userName", userName);
    //clear also chrome ext if needed
    if (window.self !== window.top)
        window.top.postMessage("logout", "*");

};

function getInfo4Extension()
{
    if (window.self !== window.top)
    {
        var loginStr = "login?t=" + localStorage.getItem("userKey") +
            "&o=" + localStorage.getItem('userOrgKey') +
            "&i=" + localStorage.getItem('userInstanceKey'); 
        window.top.postMessage(loginStr,"*");
    }
};

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
};

var featureList;
var featureList2;
var featureList3;
var featureList4;
var featureList5;

function filterList(listClass, value_names, init_value){
    $('body').attr('id', 'search_wrap');
    if (typeof value_names === "undefined" || !value_names)
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
    if (typeof init_value !== "undefined" && init_value)
    {
        featureList.search(init_value);
        $(".search").val(init_value);
    }
    featureList.on('updated',function(){
        //console.log(featureList);
        if (featureList.matchingItems.length > 1) 
        {
            var itemMessage = 'There are ' + featureList.matchingItems.length + ' matching tickets.';
            console.log( itemMessage);
        } else if (featureList.matchingItems.length == 1) {
            ;
        } else if (featureList.matchingItems.length == 0) {
            console.log( 'Bummer...  0 items found');
        }
    });
    //console.log("loaded list");
    return featureList;
};
function float2int (value) {
    return value | 0;
}

function createElipse(text, containerWidth, fontSize){
    var windowWidth = $(window).width();
    if(windowWidth > 650){
        windowWidth = 650;
    }
    var characterSpace;
    containerWidth = containerWidth * windowWidth;
    characterSpace = containerWidth / fontSize;
    characterSpace = float2int(characterSpace);
    if(text.length -2 > characterSpace){
        text = text.substring(0,characterSpace)+'...';
    } 
    return text;
};

function createSpan(elname){
    var windowH = $(window).height();
    var elH = $("#content").height();
    if(windowH > elH + 60){
        elH = windowH - elH - 60;
        $("<p id=fill style='height:"+elH+"px'>&nbsp;</p>").appendTo(elname+"");
    }
};



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
    };

    function getParameterByName(name) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    }

    function cleanQuerystring() {
        var clean_uri = location.protocol + "//" + location.host + location.pathname;
        window.history.replaceState({}, document.title, clean_uri);
    }


    // user login
    var UserLogin = {
        init: function () {
            var loginPage = true;
            if (location.pathname.indexOf("index.html") < 0 && location.pathname != "/")
                loginPage = false;
            userKey = localStorage.getItem("userKey");
            userOrgKey = localStorage.getItem('userOrgKey');
            userInstanceKey = localStorage.getItem('userInstanceKey');
            if ((!userKey || !userOrgKey || !userInstanceKey) && !loginPage && location.pathname.indexOf("org.html")<0 && location.pathname.indexOf("signup.html")<0) {
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
                    localStorage.setItem("userKey", key)
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
            if (userName == '' || password == '') {
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

                    localStorage.setItem("userKey", returnData.api_token)
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
            $('form.google_openid').get(0).setAttribute('action', ApiSite + 'api/auth/googleopenid');
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
            if (location.pathname.indexOf("signup.html") < 0)
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
            if (name == '' || email == '' || url == '' || firstname == '' || lastname == '' || password == '' || password_confirm  == '') {
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
                    localStorage.setItem("userKey", returnData.api_token)
                    localStorage.setItem('userName', email);
                    localStorage.setItem('userOrgKey', returnData.organization);
                    localStorage.setItem('userInstanceKey', returnData.instance);

                    //sets user role to user in local storage
                    localStorage.setItem('userRole', "user");
                    getInstanceConfig(returnData.organization, returnData.instance)
                },
                error: function ( event ) {
                    //"User already have one registered organization. Please set is_force_registration=true to continue."
                    if (event.status == 409)
                    {
                        userMessage.showMessage(false, "This email is already in use. Please choose action below");
                        localStorage.setItem('userName', $("#email").val());
                        $("#is_force_registration").prop("checked", true);
                        $("#signupButton").before("<center><h3 style='padding-top: 10px;'>This email is already in use. Would you like to</h3>"
                                                  +" <div class=loginButton onclick='window.location = \"index.html\"'>Login</div>"
                                                  +"<h3>or</h3></center>");
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
            $.ajax({
                type: 'GET',
                beforeSend: function (xhr) {
                    xhr.withCredentials = true;
                    xhr.setRequestHeader('Authorization',
                                         'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
                },

                url:ApiSite +"tickets?status=closed&account="+localStorage.getItem("DetailedAccount"),
                dataType:"json",
                success: function(returnData) {
                    $("#closedTickets").empty();
                    //insert open tickets
                    if(returnData.length > 0)
                    {
                    for(var i = 0; i < returnData.length; i++)
                    {
                        // get email value for gravatar
                        var email = $.md5(returnData[i].user_email);
                        var initialPost = returnData[i].initial_post;
                        var subject = returnData[i].subject;
                        //the key for this specific ticket
                        var data = returnData[i].key;
                        subject = createElipse(subject, .70, 12);
                        var newMessage = (returnData[i].is_new_tech_post && returnData[i].technician_email != localStorage.userName) || (returnData[i].is_new_user_post && returnData[i].user_email != localStorage.userName) ? "<i class='fa fa-envelope-o' style='color: #25B0E6;'></i> " : "";
                        // ensure ticket initial post length is not to long to be displayed (initial post is elipsed if it is)
                        if(initialPost.length > 50)
                        {
                            initialPost = initialPost.substring(0,50);
                        }
                        var ticket = "<ul class='responseBlock item' id='thisBlock' data-id="+data+"><li><p class='blockNumber numberStyle'>#"+returnData[i].number+"</p><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=80' class='TicketBlockFace'><span  class=user_name>"+returnData[i].user_firstname+"</span></li><li class='responseText'><h4>"+newMessage+subject+"</h4><p class ='initailPost'>"+initialPost+"</p></li><li><p class='TicketBlockNumber'>"+returnData[i].class_name+"</p></li></ul>";
                        $(ticket).appendTo("#closedTickets");
                        filterList("closedTickets");
                    };
                    }
                    else
                    {
                        $('<h1 class="noTicketMessage">No Tickets</h1>').appendTo("#closedTickets");
                    }
                    reveal();
                    createSpan("#closedTickets");

                },
                error: function() {
                    console.log("fail @ accounts");
                    // //console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
                }
            });
        }

    };

    // pick up current detailed ticket
    var pickUpTicket = {
        init:function() {
            this.pick();
        },

        pick:function() {
            $("#pickUp").click(function(){
                $.ajax({
                    type: 'PUT',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization',
                                             'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
                    },
                    url: ApiSite + 'tickets/'+localStorage.getItem("ticketNumber"),
                    data: {
                        "action" : "pickup",
                        "note_text": ""

                    },
                    dataType: 'json',
                    success: function (d) {
                        userMessage.showMessage(true, 'Ticket pickup was Succesfull <i class="fa fa-thumbs-o-up"></i>');
                        window.location = "ticket_detail.html";
                    },
                    error: function (e, textStatus, errorThrown) {
                        alert(textStatus);
                    }
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
                $.ajax({
                    type: 'GET',
                    beforeSend: function (xhr) {
                        xhr.withCredentials = true;
                        xhr.setRequestHeader('Authorization',
                                             'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
                    },

                    url:ApiSite +"technicians?limit=200",
                    dataType:"json",
                    success: function(returnData) {
                        //console.log(returnData);
                        // add techs to option select list
                        var insert = "<option value=0 disabled selected> Choose Tech</option>";
                        $(insert).appendTo("#transferTechs");
                        for(var i = 0; i < returnData.length; i++)
                        {
                            var value = returnData[i].id;
                            var name = returnData[i].firstname+" "+returnData[i].lastname;
                            var insert = "<option value="+value+">"+name+"</option>";
                            $(insert).appendTo("#transferTechs");
                        }
                    },
                    complete: function () {
                        reveal();
                    },
                    error: function() {
                        console.log("fail @ time accounts");
                        //console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
                    }
                });
                // get value
                $("#transferTechs").on("change", function(){
                    var techId = $("#transferTechs").val();
                    $.ajax({
                        type: 'PUT',
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('Authorization',
                                                 'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
                        },
                        url: ApiSite + 'tickets/'+localStorage.getItem("ticketNumber"),
                        data: {
                            "action": "transfer",
                            "note_text": " ",
                            "tech_id": techId,
                            "keep_attached": false

                        },
                        dataType: 'json',
                        success: function (d) {
                            location.reload(false);
                        },
                        error: function (e, textStatus, errorThrown) {
                            alert(textStatus);
                        }
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
                $.ajax({
                    type: 'PUT',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization',
                                             'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
                    },
                    url: ApiSite + 'tickets/'+localStorage.getItem("ticketNumber"),
                    data: {
                        "status" : "open",
                        "note_text": ""
                    },
                    success: function (d) {
                        //location.reload(false);
                        setTimeout(
                            function()
                            {
                                userMessage.showMessage(true, 'Ticket has been Reopened <i class="fa fa-thumbs-o-up"></i>');
                                window.location = "ticket_detail.html";

                            }, 1000);
                    },
                    error: function (e, textStatus, errorThrown) {
                        alert(textStatus);
                    }
                });
            });
        },
        
        close: function(closeTicketMessage){
            closeTicketMessage = htmlEscape(closeTicketMessage).trim();
            if (closeTicketMessage.length < 2){
                userMessage.showMessage(false,  "Note cannot be empty!");	
                return;
            }
            if (closeTicketMessage.length > 500){
                userMessage.showMessage(false,  "Note cannot be more than 500 chars!");	
                return;
            }
            $.ajax({
                type: 'PUT',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization',
                                         'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
                },
                url: ApiSite + 'tickets/'+localStorage.getItem("ticketNumber"),
                data: {
                    "status" : "closed",
                    "note_text": closeTicketMessage,
                    "is_send_notifications": true,
                    "resolved": true,
                    dataType: 'json',
                    "confirmed": false,
                    "confirm_note": ""

                },
                success: function (d) {
                    //location.reload(false);
                    setTimeout(
                        function()
                        {
                            userMessage.showMessage(true, 'Ticket has been closed <i class="fa fa-thumbs-o-up"></i>');
                            window.location = "ticket_detail.html";

                        }, 1000);
                    userMessage.setMessage(true, "Ticket was Closed <i class='fa fa-thumbs-o-up'></i>");
                },
                error: function (e, textStatus, errorThrown) {
                    //alert(textStatus);
                }
            });
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
    //date formating function
    var formatDate = function(date){
        var month = date.substring(5,7);
        var day = date.substring(8,10);
        switch(month){
            case "01":
                month = "Jan";
                break;
            case "02":
                month = "Feb";
                break;
            case "03":
                month = "Mar";
                break;
            case "04":
                month = "Apr";
                break;
            case "05":
                month = "May";
                break;
            case '06':
                month = "Jun";
                break;
            case '07':
                month = "Jul";
                break;
            case '08':
                month = "Aug";
                break;
            case '09':
                month = "Sep";
                break;
            case '10':
                month = "Oct";
                break;
            case '11':
                month = "Nov";
                break;
            case '12':
                month = "Dec";
                break;
            default:
                month = "nul";
                break
        }
        return month+" "+day;
    };
    // send an invoice to recipents
    var sendInvoice = {
        init:function() {
            this.submitInvoice();
        },

        submitInvoice:function(){
            $("#sendInvoiceButton").click(function(){
                //alert(localStorage.getItem('invoiceNumber'));
                if ($(".recipient").children(".closeIcon").length < 1)
                {
                    userMessage.showMessage(false, "No accounting contacts added");
                    return;
                }
                var emails = ""; 
                $.each($(".recipient").children(".closeIcon"), function(){emails+=$(this).attr("id") + ",";}); 
                console.log(emails);
                $.ajax({
                    type: 'PUT',
                    beforeSend: function (xhr) {
                        xhr.withCredentials = true;
                        xhr.setRequestHeader('Authorization',
                                             'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
                    },
                    url: ApiSite + 'invoices/'+localStorage.getItem('invoiceNumber'),
                    data: {
                        "action": "sendEmail",
                        "recipients": emails
                    },
                    dataType: 'json',
                    success: function (d) {
                        setTimeout(
                            function()
                            {

                                window.history.back();

                            }, 1000);
                        userMessage.setMessage(true, "Hurray! Invoice sent");
                    },
                    error: function (e, textStatus, errorThrown) {
                        //alert(textStatus);
                    }
                });
            });
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
            $("#switchOrg").click(function(){
                localStorage.setItem("userInstanceKey", "");
                window.location = "org.html";
            });
        }
    };

    function fillSelect(returnData, element, initialValue, prefix, customValues, envelope_start, envelope_end)
    {
        if (typeof returnData === "undefined" || !returnData || !returnData.length)
        { 
            $(""+element).parent().hide();
            return 0;
        }
        var names;
        var isCustom = false;
        if (typeof customValues !== "undefined" && customValues.length > 0){
            names = customValues.split(',');
            if (names.length > 0)
                isCustom = true;
        }
        if (typeof prefix === "undefined")
            prefix = "";
        if (typeof initialValue === "undefined")
            initialValue = "";
        if (typeof envelope_start === "undefined")
            envelope_start = "";
        if (typeof envelope_end === "undefined")
            envelope_end = "";
        var insert = ""+initialValue;
        var i = 0;
        for(i = 0; i < returnData.length; i++)
        {
            var value = returnData[i].id;
            var name = "";
            if (!isCustom)
                name = returnData[i].name;
            else
            {
                for(var j = 0; j < names.length; j++)
                    name += " " + returnData[i][names[j]];
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

            if($('.sub_class1, .sub_class2').is(":visible")){$('.sub_class1, .sub_class2').hide();$('#sub_class1, #sub_class2').empty();};
            var classSelected0 = $(element +' option:selected').val();
            var classSub = $.grep(classResults, function(a){ return a.id == classSelected0; });

            //set class
            selectedEditClass = classSelected0;

            //If sub-class exist
            if((typeof classSub[0] !== "undefined") && (classSub[0].sub !== null || classSub[0].sub > 0)){
                //Show sub-class select
                fillSelect(classSub[0].sub, "#sub_class1", "<option value="+selectedEditClass+">choose a sub class</option>", "Sub class: ");

                $("select#sub_class1").on('change', function(){
                    if($('.sub_class2').is(":visible")){$('.sub_class2').hide();$('#sub_class2').empty();};
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

    // create a new ticket
    var newTicket = {
        init:function() {
            this.addTicket();
        },

        addTicket:function() {
            $("#addTicketAccounts").empty();
            var accountset = localStorage.getItem('addAccountTicket');
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
                     if (accountset)
                         $("#addTicketAccounts").val(accountset);
                     reveal();
                 }, function() {
                     console.log("fail @ ticket accounts");
                 });
                }
            }

            // after an account is choosed it get a list of technicians
            if (!isTech)
            {
                $("#addTicketTechs").parent().hide();reveal();
            }
            else
            {
            var technicians = getApi("technicians?limit=200");
            technicians.then(function(returnData){
                //console.log(returnData);
                // add techs to option select list
                fillSelect(returnData, "#addTicketTechs",
                           "<option value=0 disabled selected>choose a tech</option>", "",
                           "firstname,lastname");
                //reveal();
            },
                             function() {
                console.log("fail @ ticket accounts");

            }
                            );
            }

            // after techs are choosen then get a list of classes
            var classes = getApi('classes');
            classes.done(
                function(classResults){
                    fillClasses(classResults, "#classTicketOptions", "<option value=0 disabled selected>choose a class</option>");
                });



            // make api post call when submit ticket button is clicked
            $("#submitNewTicket").click(function(){
                var subject = htmlEscape($("#addTicketSubject").val().trim());
                var post = htmlEscape($("#addTicketInitPost").val().trim());
                if(subject == "" || $("#addTicketTechs").val() == "" || selectedEditClass < 1)
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
                        "user_id" : localStorage.getItem('userId'),
                        "tech_id" : $("#addTicketTechs").val()
                    }, "POST");
                    addTicket.then(function (d) {
                        localStorage.setItem('addAccountTicket', '');
                        setTimeout(
                            function()
                            {

                                window.location =  isTech ? "dashboard.html" : "ticket_list.html";

                            }, 1000);
                        userMessage.setMessage(true, "Ticket was Succesfully Created :)");


                    },
                                   function (e, textStatus, errorThrown) {
                        alert(textStatus);
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
                if (comment.length > 500) {
                    userMessage.showMessage(false, "Note cannot be more than 500 chars!");
                    return;
                }
                $.ajax({
                    type: 'POST',
                    beforeSend: function (xhr) {
                        xhr.withCredentials = true;
                        xhr.setRequestHeader('Authorization',
                                             'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
                    },
                    url: ApiSite + 'tickets/'+localStorage.getItem('ticketNumber'),
                    data: {
                        "note_text": comment,
                        "action": "response"
                    },
                    dataType: 'json',
                    success: function (d) {

                        location.reload(false);
                    },
                    error: function (e, textStatus, errorThrown) {
                        alert(textStatus);
                    }
                });
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
                    var found = false;
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
                            //console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
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

                            //console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
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

                            //console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
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
                }


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
                onShow:function( ct ){
                    var dat1 = jQuery('#date_end').val();
                    var dat;
                    if (dat1){
                        dat = new Date(dat1);
                        dat.setDate(dat.getDate());
                    }
                    this.setOptions({
                        maxDate:dat1?dat:false
                    })
                }
            });
            jQuery('#date_end').datetimepicker({
                mask: false,
                onShow:function( ct ){
                    var dat1 = jQuery('#date_start').val();
                    var dat;
                    if (dat1){
                        dat = new Date(dat1);
                        dat.setDate(dat.getDate());
                    }
                    this.setOptions({
                        minDate:dat1?dat:false
                    })
                }
            });
        },
        getTaskTypes: function (data, task_type_id){
            if (typeof task_type_id === "undefined")
                task_type_id = 0; 
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
                function() {
                    //reveal();
                    console.log("fail @ task types");
                    //console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
                }
            );
        },
        chooseProjects : function (project_id, task_type_id){
            if (typeof project_id === "undefined")
                project_id = 0; 
            if (typeof task_type_id === "undefined")
                task_type_id = 0; 
            var account = $("#timeAccounts").val();
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
                        function() {
                            console.log("fail @ time accounts");
                            reveal();
                            ////console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
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
                if (note.length > 500)
                {
                    userMessage.showMessage(false, "Note cannot be more than 500 chars!");
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
                    localStorage.setItem('userMessage','Time was successfully added <i class="fa fa-thumbs-o-up"></i>')
                    window.location = "ticket_detail.html";
                },
                                    function (e, textStatus, errorThrown) {
                    alert(textStatus);
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
                var timeLog, timeEntry = localStorage.getItem("timeNumber");
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
                if(!isProject)
                    $("#timeProjects").parent().hide();
                else
                {
                    var chooseProject = "<option value=0>choose a project</option>";
                    $(chooseProject).appendTo("#timeProjects");
                }
                $("#taskTypes").empty();
                $("<option value=0>choose a task type</option>").appendTo("#taskTypes");
                if(!isAccount)
                {
                    $("#timeAccounts").parent().hide();
                    reveal();
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
                        for(var i = 0; i < returnData.length; i++)
                        {
                            var value = returnData[i].id;
                            var task = returnData[i].name;
                            var insert = "<option value="+value+">"+task+"</option>";
                            $(insert).appendTo("#timeAccounts");
                        }
                        if (timeLog)
                        {
                            $("#timeAccounts").val(timeLog.account_id);
                            if (parseInt($("#timeAccounts").val()) !== timeLog.account_id)
                                $("#timeAccounts").val(-1);
                            addTime.chooseProjects(timeLog.project_id, timeLog.task_type_id);
                        }
                        reveal();

                    },
                    function() {
                        console.log("fail @ time accounts");
                        ////console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
                    }
                                                                         );
                }

                $("#timeAccounts").on("change", function(){
                    //console.log(timeLog.task_type_id);
                    addTime.chooseProjects(0, timeLog ? timeLog.task_type_id : 0);
                });

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
                    if(time == 0){
                        userMessage.showMessage(false, "Oops not enough time");
                        return;
                    } else if(accountId == '0'){
                        userMessage.showMessage(false, "choose an account");
                        return;
                    }else{
                        ticketKey = parseInt(isEdit ? timeLog.ticket_id : ticketKey);
                        $.ajax({
                            type: isEdit ? 'PUT' : 'POST',
                            beforeSend: function (xhr) {
                                xhr.setRequestHeader('Authorization',
                                                     'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
                            },
                            url: ApiSite + 'time' + (isEdit ? "/" + timeLog.time_id : ""),
                            data: {
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
                            },
                            dataType: 'json',
                            success: function (d) {
                                localStorage.setItem('isMessage','truePos');
                                localStorage.setItem('userMessage','Time was successfully added <i class="fa fa-thumbs-o-up"></i>')
                                window.history.back();
                            },
                            error: function (e, textStatus, errorThrown) {
                                alert(textStatus);
                            }
                        });
                    }
                });
            }
        }
    };

    // needed methods to propogate a ticket detailed page
    var detailedTicket = {
        init:function(){
            if (!isTech){
                $(".tabs").hide();
                $("#closeu").show();
            }
            else
            {
                $("#closeu").hide();
            }
            this.showTicket();
        },

        showTicket:function(){
            if(localStorage.getItem("isMessage") == "truePos")
            {
                userMessage.showMessage(true);
            }
            // listen for a click of a ticket block from a ticket list page (account detail  ticket list or complete ticket list)
            $(document).on("click",".responseBlock", function(){
                localStorage.setItem('ticketNumber', $(this).attr("data-id")); //set local storage variable to the ticket id of the ticket block from the ticket list
                window.location = "ticket_detail.html"; // change page location from ticket list to ticket detail list
            });
            $('html,body').css('scrollTop','0');
            getApi("tickets/"+localStorage.getItem('ticketNumber')).then(
                function(returnData) {
                    ////console.log(returnData);
                    // calculate the number of days since the ticket was created
                    var daysOld = returnData.daysold_in_minutes / -60;
                    localStorage.setItem('techId', returnData.tech_id); // set the local storage variable with the tech id asscioted with this ticket
                    localStorage.setItem('ticketId',returnData.id); // set the local storage variable with the ticket ID
                    // check to see if the ticket is less than a day old
                    if(daysOld > 24){
                        daysOld = daysOld/24;
                        daysOld = parseInt(daysOld);
                        daysOld = daysOld +" days ago";
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
                    if(ticketHours != 0){
                        $("#ticketHours").html(ticketHours+" Hours");
                    }else{
                        $('#ticketHours').hide();
                    }
                    if(returnData.sla_complete_date == null)
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
                        var levels = getApi('levels');
                        levels.done(
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
                    for(var b = 0; b < returnData.technicians.length; b++)
                    {
                        var techName = returnData.technicians[b].user_fullname;
                        var techId = returnData.technicians[b].user_id;
                        var insert = "<option value="+techId+">"+techName+"</option>";
                        $(insert).appendTo("#ticketTechs");
                    }


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
                        }

                        var method = 'tickets/' + localStorage.getItem('ticketId');

                        var updateEditTicket = getApi(method, response, 'PUT');

                        updateEditTicket.then(function(results){

                            console.log('Then Complete');
                            userMessage.setMessage(true, "Ticket was successfully updated <i class='fa fa-thumbs-o-up'></i>");
                            window.location = "ticket_detail.html";
                            userMessage.showMessage(true);

                            //SherpaDesk.getTicketDetail(configPass, key);
                            //addAlert("success", "Ticket has been Updated");

                        });
                    });
                    //});
                    //add comments (ticketLogs) to the page
                    $("#comments").empty();
                    for(var c = 1; c < returnData.ticketlogs.length; c++)
                    {
                        var email = $.md5(returnData.ticketlogs[c].user_email);
                        var type = returnData.ticketlogs[c].log_type;
                        var userName = returnData.ticketlogs[c].user_firstname+" "+returnData.ticketlogs[c].user_lastname;
                        var note = returnData.ticketlogs[c].note;
                        var date = returnData.ticketlogs[c].record_date.toString().substring(0,10);
                        date = formatDate(date);
                        var attachments = [];
                        //check to see if this comment has attachments
                        
                        if(returnData.attachments != null){
                            for(var e = 0; e < returnData.attachments.length; e++)
                            {
                                if(note.indexOf(returnData.attachments[e].name) >= 0)
                                {
                                    attachments.push(returnData.attachments[e].url);
                                }
                            }
                        }

                        // comment insert
                        var insert = "<ul class='commentBlock'><li><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=80' class='commentImg'></li><li class='commentText'><h3>"+userName+"</h3></li><li><span>"+date+"</span></li><li class='commentText'><p>"+ $("<span />", { html: note }).text().replace(/\n/g, '<p></p>').replace("/<br>/g", "<p></p>")+"</p></li><li>"+type+"</li></ul>";
                        $(insert).appendTo("#comments");
                        for(var f = 0; f < attachments.length; f++)
                        {
                            var insert = "";
                            var file;
                            if (checkURL(attachments[f]))
                                file = "<img class=\"attachment\" src=\"" + attachments[f] + "\">";
                            else
                                file = "<img style='float:none;' src='img/file.png'>&nbsp;" + attachments[f].split("/").slice(-1) + "<p></p>";
                            
                            if (isPhonegap)
                                insert = "<a class=\"comment_image_link\" href=# onclick='openURL(\"" +attachments[f] + "\")'>"+file+"</a>";
                            else
                                insert = "<a class=\"comment_image_link\" target=\"_blank\" href=\"" +attachments[f] + "\">"+file+"</a>";
                            $(insert).appendTo("#comments");
                        }
                        if(attachments.length > 0)
                        {
                            borderInsert = "<div class='attachmentBorder'></div>";
                            $(borderInsert).appendTo("#comments");
                        }
                    }
                    $(".orginalMessageContainer").empty();
                    // add the lastest comment to the top of the comments list
                    var orginalMessageEmail = $.md5(returnData.ticketlogs[0].user_email);
                    var orginalMessageDate = returnData.ticketlogs[0].record_date.toString().substring(0,10);
                    orginalMessageDate = formatDate(orginalMessageDate);
                    var note = returnData.ticketlogs[0].note;
                    var attachments = [];
                    //check to see if this comment has attachments
                    if(returnData.attachments != null){
                        for(var e = 0; e < returnData.attachments.length; e++)
                        {
                            if(note.indexOf(returnData.attachments[e].name) >= 0)
                            {
                                var file;
                                if (checkURL(returnData.attachments[e].url))
                                    file = "<img class=\"attachment\" src=\"" + returnData.attachments[e].url + "\">";
                                else
                                    file = "<img style='float:none;' src='img/file.png'>&nbsp;" + returnData.attachments[e].name + "<p></p>";
                                if (isPhonegap)
                                    attachments[e] = "<a class=\"comment_image_link\" href=# onclick='openURL(\"" +returnData.attachments[e].url + "\")'>"+file+"</a>";
                                else
                                    attachments[e] = "<a class=\"comment_image_link\" target=\"_blank\" href=\"" +returnData.attachments[e].url + "\">"+file+"</a>";
                                $(attachments[e]).error(function(){
                                    attachments[e] = "0";

                                });

                            }
                        }
                    }
                    var orginalMessageinsert = "<ul class='commentBlock'><li><img src='http://www.gravatar.com/avatar/" + orginalMessageEmail + "?d=mm&s=80' class='commentImg'></li><li class='commentText'><h3>"+returnData.ticketlogs[0].user_firstname+" "+returnData.ticketlogs[0].user_lastname+"</h3></li><li><span>"+orginalMessageDate+"</span></li><li class='commentText'><p>"+$("<span />", { html: returnData.ticketlogs[0].note }).text().replace(/\n/g, '<p></p>').replace("<br>", "<p></p>")+"</p></li><li>"+returnData.ticketlogs[0].log_type+"</li></ul></div>";

                    $(orginalMessageinsert).appendTo(".orginalMessageContainer");

                    if(returnData.attachments != null)
                    {
                        for(var f = 0; f < attachments.length; f++)
                        {
                            var attach = attachments[f];
                            $(attach).appendTo(".orginalMessageContainer");
                        }

                    }
                    reveal();
                },
                function() {
                    console.log("fail @ Ticket Detail");
                    //console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
                    localStorage.setItem('ticketId', "");
                    window.location = "ticket_list.html";
                }
            );

        }
    };

    //get info for a specific invoice
    var detailedInvoice = {
        init:function(){
            this.specifics();
        },

        specifics:function(){
            $(document).on("click",".invoiceRows", function(){
                localStorage.setItem('invoiceNumber',$(this).attr("data-id"));
                window.location = "invoice.html";
            });

            $.ajax({
                type: 'GET',
                beforeSend: function (xhr) {
                    xhr.withCredentials = true;
                    xhr.setRequestHeader('Authorization',
                                         'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
                },

                url:ApiSite +"invoices/"+localStorage.getItem("invoiceNumber"),
                dataType:"json",
                success: function(returnData) {
                    ////console.log(returnData);
                    localStorage.setItem("invoiceAccountId",returnData.account_id);
                    localStorage.setItem("invoiceProjectId",returnData.project_id);
                    $("#invoiceNumber").html("Invoice  #"+returnData.id); //invoice number
                    var nameCheck = returnData.customer;
                    nameCheck = createElipse(nameCheck, .70, 12);
                    $("#customerName").html(nameCheck); // customer name
                    var date = returnData.date.substring(0,10);
                    date = formatDate(date);
                    $("#invoiceDate").html(date);
                    $("#invoiceHours").html(returnData.total_hours+"<span class='detail3Small'>hrs</span>"); // hours to invoice
                    var amount = 0;
                    var change = ".00";
                    var length = returnData.amount.toString().length;
                    if(returnData.amount.toString().indexOf(".") >= 0)
                    {
                        amount = returnData.amount.toString().substring(0, length -3);
                        change = "."+returnData.amount.toString().substring(length-2, length);
                        if(change.indexOf("..") >= 0)
                        {
                            change = "."+returnData.total_cost.toString().substring(length-1, length)+"0";
                        }
                    }
                    else
                    {
                        amount = returnData.amount;
                    }
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
                    console.log(Number(returnData.total_cost).toFixed(2).toString());
                    amount = Number(returnData.total_cost).toFixed(2).toString();
                    change = amount.substring(amount.length-3, amount.length);
                    amount = amount.substring(0, amount.length -3);
                    $(".invoiceTotal").html(localStorage.getItem('currency') + amount + "<span class='detail3Small'>" + change + "</span>");
                    $("#recipientList").empty();
                    // add recipients to recipients list
                    if(returnData.recipients != null && returnData.recipients.length > 0){
                        for(var x = 0; x < returnData.recipients.length; x++)
                        {
                            var email = $.md5(returnData.recipients[x].email);
                            var insert = "<li><ul class='recipientDetail'><li><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=80'></li><li><div class='recipient'><p>"+returnData.recipients[x].email+"</p>" +
                                (returnData.recipients[x].is_accounting_contact ? "<img class='closeIcon' id=\""+ returnData.recipients[x].email +"\"  src='img/close_icon.png'>" : "<img class=plusIcon id=\""+ returnData.recipients[x].email +"\" src='img/plus_icon.png'>") +
                                "</div></li></ul></li>";
                            $(insert).appendTo("#recipientList");
                        }
                    }
                    else
                    {
                        var insert = "<li><h3 class=noDataMessage>No accounting contacts found.<p>&nbsp;</p></h3></li>";
                        $(insert).appendTo("#recipientList"); 
                        $("#sendInvoiceButton").remove();
                    }
                    createSpan("#recipientList");

                    // adds timelogs asscoited with this invoice to the invoice timelogs list
                    $("#invoiceLogs").empty();
                    if(returnData.time_logs != null){
                        for(var u = 0; u < returnData.time_logs.length; u++)
                        {
                            var name = returnData.time_logs[u].name;
                            var log = returnData.time_logs[u].total;
                            var date = formatDate(returnData.time_logs[u].date.substring(0,10));
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
                            var date = formatDate(returnData.expenses[c].date.substring(0,10));
                            var logID = returnData.expenses[c].id;
                            var insert = "<li><ul id='invoiceExpense' class='timelog1'><li><div class='billable timeLogAddButton' data-id='"+logID+"'><div class='innerCircle billFill'></div></div></li><li><h2 class='feedName'>"+name+"</h2><p class='taskDescription'>"+date+"</p></li><li><h3 class='feedTime expenceCost'><span>$"+log+"</span></h3></li></ul></li>";
                            $(insert).appendTo("#expensesList");
                        }
                    }

                },
                complete:function(){
                    reveal();
                },
                error: function() {
                    console.log("fail @ Invoice details");
                    //console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
                }
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
				console.log(techId);
				console.log(projectId);
				console.log(accountId);
				console.log(note);
				console.log(hours);
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
        init:function(accountid){
            this.listInvoices(accountid);
        },

        listInvoices:function(accountid){
            var localInvoiceList = [];
            // go to list of account invoice on click
            $("#invoiceOption").click(function(){
                window.location = "Invoice_List.html";
            });
            // go to complete list of invoice on click
            $("#allInvoice, #invoiceFooter").click(function(){
                window.location = "allInvoice_List.html";
            });
            // get list of invoices for a specific account
            getApi("invoices", {"account" : accountid}).then(
                function(returnData) {
                    ////console.log(returnData);
                    $("#invoiceList").empty();
                    if(returnData.length == 0){
                        $('<h3 class="noDataMessage">no invoices at this time</h3>').prependTo('#invoiceList');
                        createSpan('#invoiceList');
                        reveal();
                        return;
                    }
                    if (accountid)
                        returnData = [returnData];
                    for(var i = 0; i < returnData.length; i++)
                    {
                        var customer = returnData[i].customer; // account name
                        var date = returnData[i].date.substring(0,10);
                        // check account name for display purposes
                        date = formatDate(date);
                        customer = createElipse(customer, .33, 12);
                        var insert = "<ul data-id="+returnData[i].id+" class='invoiceRows item'><li class=user_name>"+customer+"</li><li class=responseText>"+date+"</li><li>$"+ Number(returnData[i].total_cost).toFixed(2)+"</li></ul>";
                        $(insert).appendTo("#invoiceList");
                        if (!accountid) localInvoiceList.push(insert);
                    }
                    if (!accountid) localStorage.setItem("storageInvoices",JSON.stringify(localInvoiceList));
                    createSpan('#invoiceList');
                    reveal();
                    //filterList("tabpageContainer");
                },
                function() {
                    console.log("fail @ Invoice List");
                    //console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
                }
            );
        }
    };

    // list tickets of the queue
    var getQueueTickets = {
        init:function() {
            $(".title").html("Tickets @ " + localStorage.getItem("currentQueueName") + " Queue");
            this.queueTickets();
        },

        queueTickets:function() {
            getApi("queues/"+localStorage.getItem("currentQueue")).then(
                function(returnData) {
                    //console.log(returnData);
                    $("#queueTickets").empty();
                    if(returnData.length < 1){
                        var insert = '<h1 class="noTicketMessage">No Tickets</h1>';
                        $(insert).appendTo("#queueTickets");
                    }
                    for(var i = 0; i < returnData.length; i++)
                    {
                        // get email for gravitar avitar
                        var email = $.md5(returnData[i].user_email);
                        var intialPost = returnData[i].initial_post;
                        var subject = returnData[i].subject;
                        var data = returnData[i].key;
                        subject = createElipse(subject, .70, 12);
                        var newMessage = (returnData[i].is_new_tech_post && returnData[i].technician_email != localStorage.userName) || (returnData[i].is_new_user_post && returnData[i].user_email != localStorage.userName) ? "<i class='fa fa-envelope-o' style='color: #25B0E6;'></i> " : "";
                        if(intialPost.length > 100)
                        {
                            intialPost = intialPost.substring(0,100);
                        }
                        var ticket = "<ul class='responseBlock item' id='thisBlock' data-id="+data+"><li><p class='blockNumber numberStyle'>#"+returnData[i].number+"</p><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=80' class='TicketBlockFace'><span class=user_name>"+returnData[i].user_firstname+"</span></li><li class='responseText'><h4>"+newMessage+subject+"</h4><p class ='initafilPost'>"+intialPost+"</p></li><li><p class='TicketBlockNumber'>"+returnData[i].class_name+"</p></li></ul>";

                        $(ticket).appendTo("#queueTickets");
                    filterList("queueTickets");
                    reveal();
                }
                    createSpan("#queueTickets");
                    reveal();
                },
                function() {
                    console.log("fail @ Queues List");
                    //console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
                }
            );
        }
    };

    // get complete queue list for the orginization for the Queues list page
    var getQueues = {
        init:function() {
            this.queues();
        },

        queues:function() {
            $(document).on("click","#queue", function(){
                localStorage.setItem('currentQueue',$(this).attr("data-id"));
                localStorage.setItem('currentQueueName',$(this).find(".OptionTitle").text());
                window.location = "queueTickets.html";
            });
            var localQueues = [];
            var retrievedObject = localStorage.getItem("storageQueues");
            retrievedObject = JSON.parse(retrievedObject);
            if (retrievedObject == undefined || retrievedObject == null || retrievedObject.length == 0)
            {
                console.log("could not load local data")
            }
            else
            {
                for(var a = 0; a < retrievedObject.length; a++)
                {
                    localInsert = retrievedObject[a];
                    $(localInsert).appendTo("#queuesPage");
                    reveal();
                }
            }
            $.ajax({
                type: 'GET',
                beforeSend: function (xhr) {
                    xhr.withCredentials = true;
                    xhr.setRequestHeader('Authorization',
                                         'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
                },

                url:ApiSite +"queues",
                dataType:"json",
                success: function(returnData) {
                    //console.log(returnData);
                    $("#queuesPage").empty();
                    // add queues to the queues list
                    for(var i = 0; i < returnData.length; i++)
                    {
                        if (returnData[i].fullname.toLowerCase().indexOf("new ticket") == 0)
                            localStorage.badge = returnData[i].tickets_count;
                        var insert = "<li class=item><div id='queue' data-id="+returnData[i].id+" class='OptionWrapper'><h3 class='OptionTitle user_name'>"+returnData[i].fullname+"</h3></div><div class='NotificationWrapper'><h2>"+returnData[i].tickets_count+"</h2></div></li>";
                        $(insert).appendTo("#queuesPage");
                        localQueues.push(insert);
                    }
                    createSpan("#queuesPage");
                    localStorage.setItem("storageQueues",JSON.stringify(localQueues));

                },
                complete:function(){
                    reveal();
                    filterList("OptionsList");
                },
                error: function() {
                    console.log("fail @ Queues List");
                    //console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
                }
            });
        }
    };

    // Ajax calls to get open tickets for the app user, tickets include (as tech, as user, as alt tech, all tickets)
    var page = "";
    var ticketList = {
        init:function() {
            this.userTickets();
            if (!isTech){
                $(".TicketTabs").hide();
            }
            else
            {
                this.techTickets();
                this.altTickets();
                this.allTickets();
            }
            this.ticketClick();
        },
        ticketClick:function() {
            $(document).on("click",".responseBlock", function(){
                localStorage.setItem('ticketNumber', $(this).attr("data-id")); //set local storage variable to the ticket id of the ticket block from the ticket list
                window.location = "ticket_detail.html"; // change page location from ticket list to ticket detail list
            });
        },
        //get tickets as tech
        techTickets:function() {
            var ticketView = localStorage.getItem("ticketPage");
            if(ticketView == "asAltTech")
            {
                page ="altContainer";
            }
            else if(ticketView == "asTech")
            {
                page = "techContainer";
            }
            else if(ticketView == "asUser")
            {
                page ="userContainer";
            }
            else if(ticketView == "allTickets")
            {
                page ="allContainer";
            }
            $("#techContainer, #optionsConainer, #allContainer, #userContainer").empty();
            $.ajax({
                type: 'GET',
                beforeSend: function (xhr) {
                    xhr.withCredentials = true;
                    xhr.setRequestHeader('Authorization',
                                         'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
                },

                url:ApiSite +"tickets?status=open&limit=500&role=tech",
                dataType:"json",
                success: function(returnData) {
                    //console.log(returnData);
                    //add tickets as tech to as tech list
                    if(returnData.length < 1){
                        var insert = '<h1 class="noTicketMessage">No Tickets</h1>';
                        $(insert).appendTo("#techContainer");
                    }
                    else for(var i = 0; i < returnData.length; i++)
                    {
                        // get email for gravitar avitar
                        var email = $.md5(returnData[i].user_email);
                        var intialPost = returnData[i].initial_post;
                        var subject = returnData[i].subject;
                        var data = returnData[i].key;
                        subject = createElipse(subject, .70, 12);
                        var newMessage = (returnData[i].is_new_tech_post && returnData[i].technician_email != localStorage.userName) || (returnData[i].is_new_user_post && returnData[i].user_email != localStorage.userName) ? "<i class='fa fa-envelope-o' style='color: #25B0E6;'></i> " : "";
                        //check intial post length can be displayed correctly
                        if(intialPost.length > 100)
                        {
                            intialPost = intialPost.substring(0,100);
                        }
                        var ticket = "<ul class='responseBlock item' id='thisBlock' data-id="+data+"><li><p class='blockNumber numberStyle'>#"+returnData[i].number+"</p><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=80' class='TicketBlockFace'><span class=user_name>"+returnData[i].user_firstname+"</span></li><li class='responseText'><h4>"+newMessage+subject+"</h4><p class ='initailPost'>"+intialPost+"</p></li><li><p class='TicketBlockNumber'>"+returnData[i].class_name+"</p></li></ul>";

                        $(ticket).appendTo("#techContainer");
                    }
                    createSpan("#techContainer");
                },
                complete:function(){
                    //reveal();
                    featureList2 = filterList("techContainer", "", localStorage.getItem("searchItem"));
                },
                error: function() {
                    console.log("fail @ ticket List");
                    //console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
                }
            });
        },
        //get all tickets in this orginization
        allTickets:function() {
            $.ajax({
                type: 'GET',
                beforeSend: function (xhr) {
                    xhr.withCredentials = true;
                    xhr.setRequestHeader('Authorization',
                                         'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
                },

                url:ApiSite +"tickets?status=allopen&limit=500&query=all",
                dataType:"json",
                success: function(returnData) {
                    //console.log(returnData);
                    //add tickets to the all section
                    if(returnData.length < 1){
                        var insert = '<h1 class="noTicketMessage">No Tickets</h1>';
                        $(insert).appendTo("#allContainer");
                    }
                    else
                    for(var i = 0; i < returnData.length; i++)
                    {
                        //get email for gravitar
                        var email = $.md5(returnData[i].user_email);
                        var intialPost = returnData[i].initial_post;
                        var subject = returnData[i].subject;
                        var data = returnData[i].key;
                        subject = createElipse(subject, .70, 12);
                        var newMessage = (returnData[i].is_new_tech_post && returnData[i].technician_email != localStorage.userName) || (returnData[i].is_new_user_post && returnData[i].user_email != localStorage.userName) ? "<i class='fa fa-envelope-o' style='color: #25B0E6;'></i> " : "";
                        //check initial post length
                        if(intialPost.length > 100)
                        {
                            intialPost = intialPost.substring(0,100);
                        }
                        var ticket = "<ul class='responseBlock item' id='thisBlock' data-id="+data+"><li><p class='blockNumber numberStyle'>#"+returnData[i].number+"</p><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=80' class='TicketBlockFace'><span class=user_name>"+returnData[i].user_firstname+"</span></li><li class='responseText'><h4>"+newMessage+subject+"</h4><p class ='initailPost'>"+intialPost+"</p></li><li><p class='TicketBlockNumber'>"+returnData[i].class_name+"</p></li></ul>";
                        $(ticket).appendTo("#allContainer");
                    }
                    createSpan("#allContainer");
                },
                complete:function(){
                    $('.TicketTabs > ul > li, .tabs > ul > li').css('color','rgba(255, 255, 255, 0.55)');
                    featureList3 = filterList("allContainer", "", localStorage.getItem("searchItem"));
                    //filterList(page, "", localStorage.getItem("searchItem"));
                    var ticketView = localStorage.getItem("ticketPage");
                    if(ticketView == "asAltTech")
                    {
                        $('#tabpage_reply, #tabpage_all, #tabpage_info').hide();
                        $('#tabpage_options').fadeIn();
                        $('#altTab').css('color','#ffffff');
                        localStorage.setItem('ticketPage',"asTech");
                    }
                    else if(ticketView == "asTech")
                    {
                        $('#tabpage_reply, #tabpage_all, #tabpage_options').hide();
                        $('#tabpage_info').fadeIn();
                        $('#userTab').css('color','#ffffff');
                    }
                    else if(ticketView == "asUser")
                    {
                        $('#tabpage_info, #tabpage_all, #tabpage_options').hide();
                        $('#tabpage_reply').fadeIn();
                        localStorage.setItem('ticketPage',"asTech");
                        $('#replyTab').css('color','#ffffff');
                    }
                    else if(ticketView == "allTickets")
                    {
                        $('#tabpage_info, #tabpage_reply, #tabpage_options').hide();
                        $('#tabpage_all').fadeIn();
                        localStorage.setItem('ticketPage',"asTech");
                        $('#openTab').css('color','#ffffff');
                    }
                    else
                        $('#replyTab').css('color','#ffffff');
                    
                    localStorage.setItem("searchItem","");
                    reveal();

                },
                error: function() {
                    console.log("fail @ ticket List");
                    //console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
                }
            });
        },

        // get alt tech tickets
        altTickets:function() {
            $.ajax({
                type: 'GET',
                beforeSend: function (xhr) {
                    xhr.withCredentials = true;
                    xhr.setRequestHeader('Authorization',
                                         'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
                },

                url:ApiSite +"tickets?status=open&limit=500&role=alt_tech",
                dataType:"json",
                success: function(returnData) {
                    //console.log(returnData);
                    if(returnData.length < 1){
                        var insert = '<h1 class="noTicketMessage">No Tickets</h1>';
                        $(insert).appendTo("#altContainer");
                    }
                    else
                    for(var i = 0; i < returnData.length; i++)
                    {
                        var email = $.md5(returnData[i].user_email);
                        var intialPost = returnData[i].initial_post;
                        var subject = returnData[i].subject;
                        var data = returnData[i].key;
                        subject = createElipse(subject, .75, 12);
                        var newMessage = (returnData[i].is_new_tech_post && returnData[i].technician_email != localStorage.userName) || (returnData[i].is_new_user_post && returnData[i].user_email != localStorage.userName) ? "<i class='fa fa-envelope-o' style='color: #25B0E6;'></i> " : "";
                        if(intialPost.length > 100)
                        {
                            intialPost = intialPost.substring(0,100);
                        }
                        var ticket = "<ul class='responseBlock item' id='thisBlock' data-id="+data+"><li><p class='blockNumber numberStyle'>#"+returnData[i].number+"</p><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=80' class='TicketBlockFace'><span class=user_name>"+returnData[i].user_firstname+"</span></li><li class='responseText'><h4>"+newMessage+subject+"</h4><p class ='initailPost'>"+intialPost+"</p></li><li><p class='TicketBlockNumber'>"+returnData[i].class_name+"</p></li></ul>";

                        $(ticket).appendTo("#altContainer");
                    }
                    createSpan("#altContainer");
                },
                complete:function(){
                    //reveal();
                    featureList4 = filterList("altContainer", "", localStorage.getItem("searchItem"));
                },
                error: function() {
                    console.log("fail @ ticket List");
                    //console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
                }
            });
        },
        // get as user tickets
        userTickets:function() {
            $("maxSize").hide();
            $.ajax({
                type: 'GET',
                beforeSend: function (xhr) {
                    xhr.withCredentials = true;
                    xhr.setRequestHeader('Authorization',
                                         'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
                },

                url:ApiSite +"tickets?status=open,onhold&limit=500&role=user",
                dataType:"json",
                success: function(returnData) {
                    //console.log(returnData);
                    if(returnData.length < 1){
                        var insert = '<h1 class="noTicketMessage">No Tickets</h1>';
                        $(insert).appendTo("#userContainer");
                    }
                    else for(var i = 0; i < returnData.length; i++)
                    {
                        var email = $.md5(returnData[i].user_email);
                        var intialPost = returnData[i].initial_post;
                        var subject = returnData[i].subject;
                        var data = returnData[i].key;
                        subject = createElipse(subject, .75, 12);
                        var newMessage = (returnData[i].is_new_tech_post && returnData[i].technician_email != localStorage.userName) || (returnData[i].is_new_user_post && returnData[i].user_email != localStorage.userName) ? "<i class='fa fa-envelope-o' style='color: #25B0E6;'></i> " : "";
                        if(intialPost.length > 100)
                        {
                            intialPost = intialPost.substring(0,100);
                        }
                        var ticket = "<ul class='responseBlock item' id='thisBlock' data-id="+data+"><li><p class='blockNumber numberStyle'>#"+returnData[i].number+"</p><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=80' class='TicketBlockFace'><span class=user_name>"+returnData[i].user_firstname+"</span></li><li class='responseText'><h4>"+newMessage+subject+"</h4><p class ='initailPost'>"+intialPost+"</p></li><li><p class='TicketBlockNumber'>"+returnData[i].class_name+"</p></li></ul>";

                        $(ticket).appendTo("#userContainer");
                    }
                    createSpan("#userContainer");
                },
                complete:function(){
                    if (!isTech) {
                        $('#tabpage_reply').fadeIn(); reveal();}
                    featureList5 = filterList("userContainer", "", localStorage.getItem("searchItem"));
                },
                error: function() {
                    console.log("fail @ ticket List");
                    //console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
                }
            });
        }
    };

    //get a complete list of accounts attached to the orginizations
    var accountList = {
        init:function() {
            this.listAccounts();
        },

        listAccounts:function() {
            var localAccountList = [];
            var retrievedObject = localStorage.getItem("storageAccountList");
            retrievedObject = JSON.parse(retrievedObject);
            if (retrievedObject == undefined || retrievedObject == null || retrievedObject.length == 0)
            {
                console.log("could not load local data")
            }
            else
            {
                for(var a = 0; a < retrievedObject.length; a++)
                {
                    localInsert = retrievedObject[a];
                    $(localInsert).appendTo("#fullList");
                }
                reveal();
            }


            $.ajax({
                type: 'GET',
                beforeSend: function (xhr) {
                    xhr.withCredentials = true;
                    xhr.setRequestHeader('Authorization',
                                         'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
                },

                url:ApiSite +"accounts?limit=300",
                dataType:"json",
                success: function(returnData) {
                    //console.log(returnData);
                    $("#fullList").empty();

                    if(returnData.length < 1){
                        var insert = '<h1 class="noTicketMessage">No Accounts</h1>';
                        $(insert).appendTo("#fullList");
                    }else{
                    //add accounts to accountList
                    var name = null;
                    for(var i = 0; i < returnData.length; i++)
                    {
                        name = returnData[i].name;
                        name = createElipse(name, .75, 12);
                        // check the number of open tickets for the account if the number of tickets is greater than 100 sub 99+
                        var openTks = returnData[i].account_statistics.ticket_counts.open;
                        if( openTks > 99)
                        {
                            openTks = "99";
                            var insert = "<ul class='listedAccount item' data-id="+returnData[i].id+"><li class=user_name>"+name+"</li><li><div class='tks'>"+openTks+"<div class='overflowTickets'><p>+</p></div></div></li></ul>";
                            $(insert).appendTo($("#fullList"));
                        }
                        // else add account and number of tickets normally to the list
                        else
                        {
                            var insert = "<ul class='listedAccount item' data-id="+returnData[i].id+"><li class=user_name>"+name+"</li><li><div class='tks'>"+openTks+"<div class='overflowTickets'><p>+</p></div></div></li></ul>";
                            $(insert).appendTo($("#fullList"));
                        }
                        localAccountList.push(insert);
                    }
                    }
                    createSpan("#fullList");
                    localStorage.setItem("storageAccountList",JSON.stringify(localAccountList));
                },
                complete:function(){
                    filterList("ActiveAccountsContainer");
                    reveal();
                },
                error: function() {
                    console.log("fail @ listAccounts");
                    //console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
                }
            });
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
            if (retrievedObject == undefined || retrievedObject == null || retrievedObject.length == 0){
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
                        text = createElipse(text,.50, 8);
                        if(hours.indexOf(".") >= 0)
                        {
                            // do nothing
                        }
                        else
                        {
                            hours = hours+".00";
                        }
                        nameCheck = createElipse(nameCheck,.50, 12);
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
                function() {
                    console.log("fail @ timelogs");
                }
            );
        }
    };


    // calls and methods to propagate the account details page
    var accountDetailsPageSetup = {
        init:function() {
            this.clickedAccount();
            this.pageSetup();
        },
        // when an account is clicked from the active accounts list & account list page, save the account id & set window location to account_details.html
        clickedAccount: function() {
            $(document).on("click",'.tableRows, .listedAccount', function(){
                localStorage.setItem('DetailedAccount',$(this).attr("data-id"));
                window.location = "account_details.html";
            });
        },

        pageSetup: function() {
            var currentDetailedAccount = localStorage.getItem('DetailedAccount');
            var accountHours;
            var accountTickets;
            var accountInvoices;
            var accountName;
            var retrievedObject = localStorage.getItem(currentDetailedAccount);
            var retrievedObjectTickets = localStorage.getItem(currentDetailedAccount+'tickets');
            var accountTicketsList = [];
            retrievedObjectTickets = JSON.parse(retrievedObjectTickets);
            retrievedObject = JSON.parse(retrievedObject);

            if (retrievedObject == undefined || retrievedObject == null || retrievedObject.length == 0){
                console.log("could not load local data")
            }
            else
            {
                //console.log(retrievedObject);
                $("#AD").html(retrievedObject.name);
                $("#ticketsOptionTicker").html(retrievedObject.tickets);
                $("#invoiceOptionTicker").html(retrievedObject.invoices);
                $("#timesOptionTicker").html(retrievedObject.hours);
                for(var d = 0; d < retrievedObjectTickets.length; d++){
                    var localInsert = retrievedObjectTickets[d];
                    $(localInsert).appendTo(".AccountDetailsTicketsContainer");
                }
                reveal();
            }
            $.ajax({
                type: 'GET',
                beforeSend: function (xhr) {
                    xhr.withCredentials = true;
                    xhr.setRequestHeader('Authorization',
                                         'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
                },

                url:ApiSite +"accounts/"+localStorage.getItem("DetailedAccount"),
                dataType:"json",
                success: function(returnData) {
                    //console.log(returnData);
                    //update numbers of notification tickers (open tickets / invoices / Times)
                    accountHours = returnData.account_statistics.hours;
                    accountTickets = returnData.account_statistics.ticket_counts.open;
                    accountInvoices = returnData.account_statistics.invoices;
                    accountName = returnData.name;
                    if(accountHours > 999){
                        accountHours = '999';
                    }
                    accountHours = accountHours.toString();

                    if(accountTickets > 999){
                        accountTickets = '999';
                    }
                    if(accountInvoices > 999){
                        accountInvoices = '999';
                    }
                    $("#AD").html(accountName);
                    $("#ticketsOptionTicker").html(accountTickets);
                    $("#invoiceOptionTicker").html(accountInvoices);
                    $("#timesOptionTicker").html(accountHours);
                    //store account detail on local storage 
                    var localAccountData = {
                        'name': accountName,
                        'tickets': accountTickets,
                        'hours': accountHours,
                        'invoices': accountInvoices
                    };
                    localStorage.setItem(currentDetailedAccount,JSON.stringify(localAccountData));
                },
                complete:function(){
                    reveal();
                    window.setTimeout(reveal,500);
                },
                error: function() {
                    console.log("fail @ accounts");
                    //console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
                }
            });
            // get the open tickets for the account and list them in the open tickets list
            $.ajax({
                type: 'GET',
                beforeSend: function (xhr) {
                    xhr.withCredentials = true;
                    xhr.setRequestHeader('Authorization',
                                         'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
                },

                url:ApiSite +"tickets?status=open&account="+localStorage.getItem("DetailedAccount"),
                dataType:"json",
                success: function(returnData) {
                    $(".AccountDetailsTicketsContainer").empty();
                    //insert open tickets
                    for(var i = 0; i < returnData.length; i++)
                    {
                        // get email value for gravatar
                        var email = $.md5(returnData[i].user_email);
                        var initialPost = returnData[i].initial_post;
                        var subject = returnData[i].subject;
                        //the key for this specific ticket
                        var data = returnData[i].key;
                        subject = createElipse(subject, .75, 12);
                        var newMessage = (returnData[i].is_new_tech_post && returnData[i].technician_email != localStorage.userName) || (returnData[i].is_new_user_post && returnData[i].user_email != localStorage.userName) ? "<i class='fa fa-envelope-o' style='color: #25B0E6;'></i> " : "";
                        // ensure ticket initial post length is not to long to be displayed (initial post is elipsed if it is)
                        if(initialPost.length > 50)
                        {
                            initialPost = initialPost.substring(0,50);
                        }
                        var ticket = "<ul class='responseBlock item' id='thisBlock' data-id="+data+"><li><p class='blockNumber numberStyle'>#"+returnData[i].number+"</p><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=80' class='TicketBlockFace'><span class=user_name>"+returnData[i].user_firstname+"</span></li><li class='responseText'><h4>"+newMessage+subject+"</h4><p class ='initailPost'>"+initialPost+"</p></li><li><p class='TicketBlockNumber'>"+returnData[i].class_name+"</p></li></ul>";
                        $(ticket).appendTo(".AccountDetailsTicketsContainer");
                        accountTicketsList.push(ticket);
                        filterList("AccountDetailsTicketsContainer");
                    }
                    localStorage.setItem(currentDetailedAccount+'tickets',JSON.stringify(accountTicketsList));

                },
                error: function() {
                    console.log("fail @ accounts");
                    //console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
                }
            });
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
            var accountId = localStorage.getItem("DetailedAccount");
            if (!accountId)
                accountId = -1;
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
                        text = createElipse(text, .50, 8);
                        var nameCheck = returnData[i].user_name;
                        nameCheck = createElipse(nameCheck, .50, 12);
                        var log = "<li><ul class='timelog' data-info='"+JSON.stringify(returnData[i]).replace(/'/g, "")+"'> <li><img class='timelogProfile' src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=80'></li><li><h2 class='feedName'>"+nameCheck+"</h2><p class='taskDescription'>"+text+"</p></li><li><img class='feedClock'src='img/clock_icon_small.png'><h3 class='feedTime'><span>"+hours+"</span></h3></li></ul></li>";
                        $(log).appendTo("#accountLogs");
                    }

                },
                function() {
                    console.log("fail @ timelogs");
                    //console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
                }
            );
        }
    };

    // store user variables into local storage
    var storeLocalData = function() {
        localStorage.setItem('userOrgKey',userOrgKey);
        localStorage.setItem('userOrg',userOrg);
        localStorage.setItem('userInstanceKey',userInstanceKey);
        localStorage.setItem('userKey',userKey);
    };

    // get the counts for open tickets (as tech, alt tech, user) and updates the ticket banner on the dashboard
    var getTicketCount = function() {
        $('html,body').css('scrollTop','0');
        $("#all").html(localStorage.getItem("allTickets"));
        $("#userStat").html(localStorage.getItem("userStat"));
        $("#techStat").html(localStorage.getItem("techStat"));
        //$(".mainStatTitle").html("As Tech" + (localStorage.new_messages > 0 ? "<p>"+localStorage.new_messages+"<i class='fa fa-envelope-o' style='color: #25B0E6;'></i></p>" : ""));
        $("#altStat").html(localStorage.getItem("altStat"));
        $.ajax({
            type: 'GET',
            beforeSend: function (xhr) {
                xhr.withCredentials = true;
                xhr.setRequestHeader('Authorization',
                                     'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
            },

            url:ApiSite +"tickets/counts",
            dataType:"json",
            cache: true,
            success: function(returnData) {
                //console.log(returnData);
                var allTickets = returnData.open_all;
                //if ticket count is greater than 100 sub 99+
                if(allTickets > 100){
                    allTickets = "99<div class='overflowTickets headerOverflowTickets'><p class='headerOverflowTicketsP'>+</p></div>";
                    //$("all").addClass("toManyTks");
                }
                // update each notification ticker on the dashboard
                $("#all").html(allTickets);
                $("#UserStat").html(returnData.open_as_user);
                $("#techStat").html(returnData.open_as_tech);
                //$(".mainStatTitle").html("As Tech" + (returnData.new_messages > 0 ? "<p>"+returnData.new_messages+"<i class='fa fa-envelope-o' style='color: #25B0E6;'></i></p>" : ""));
                $("#altStat").html(returnData.open_as_alttech);
                reveal();
                localStorage.setItem("allTickets",allTickets);
                localStorage.setItem("userStat",returnData.open_as_user);
                localStorage.setItem("techStat",returnData.open_as_tech);
                localStorage.setItem("altStat",returnData.open_as_alttech);
                //localStorage.setItem("newStat",returnData.new_messages);
            },
            error: function() {
                console.log("fail @ get getTicketCount");
                console.log(userOrgKey + '-' + userInstanceKey +':'+userKey);(userOrg);
            }
        });
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
            console.log("fail @ config");
            //setTimeout(function () {
            //logout(j.url !== ApiSite + "login", e);
            //}, 1000);
        }
                             );
    };

    // get queues for the organization and list a max of 3 to the dashboard
    var getQueueList = function() {
        var hasLocalData = false;
        var localDashQueues =[];
        var retrievedObject = localStorage.getItem("dashQueues");
        retrievedObject = JSON.parse(retrievedObject);

        if (retrievedObject == undefined || retrievedObject == null || retrievedObject.length == 0){
            console.log("could not load local data")
        }
        else
        {
            for(var c = 0; c < retrievedObject.length; c++)
            {
                var localInsertQueue = retrievedObject[c];
                $(localInsertQueue).prependTo("#DashBoradQueues");
            }
            reveal();
        }
        $.ajax({
            type: 'GET',
            beforeSend: function (xhr) {
                xhr.withCredentials = true;
                xhr.setRequestHeader('Authorization',
                                     'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
            },

            url:ApiSite +"queues?sort_by=tickets_count",
            dataType:"json",
            cache: true,
            success: function(returnData) {
                //console.log(returnData);   
                $("#DashBoradQueues").empty();
                var dashQueues = 0;
                for( var i = 0; i < returnData.length; i++)
                {
                    if(returnData[i].tickets_count > 0 && dashQueues < 3 )
                    {
                        if(isPhonegap){
                            if (returnData[i].fullname.toLowerCase().indexOf("new ticket") == 0)
                            {
                                localStorage.setItem("badge", returnData[i].tickets_count);
                            }
                        }
                        var insertQueue = "<li id='queue' data-id="+returnData[i].id+"><div class='OptionWrapper'><h3 class='OptionTitle'>"+returnData[i].fullname+"</h3></div><div class='NotificationWrapper'><h2>"+returnData[i].tickets_count+"</h2></div></li>";
                        $(insertQueue).prependTo("#DashBoradQueues");
                        localDashQueues.push(insertQueue);
                        dashQueues++;
                        localStorage.setItem("dashQueues",JSON.stringify(localDashQueues));
                    }

                }

                hasLocalData = true;

            },
            complete:function(){
                reveal();
            },
            error: function() {
                console.log("fail");
                console.log(userOrgKey + '-' + userInstanceKey +':'+userKey);(userOrg);
            }

        });
    };

    //get accounts that have open tickets and list them in active accounts container on the Dashboard
    var getActiveAccounts = function() {
        $(document).on("click",'.tableRows, .listedAccount', function(){
            localStorage.setItem('DetailedAccount',$(this).attr("data-id"));
            window.location = "account_details.html";
        });
        //propagate page with data from last Ajax Call
        var dashAccounts =[];
        var retrievedObjectTwo = localStorage.getItem("localDashAccounts");
        retrievedObjectTwo = JSON.parse(retrievedObjectTwo);
        if (retrievedObjectTwo == undefined || retrievedObjectTwo == null || retrievedObjectTwo.length == 0){
            console.log("could not load local data")
        }
        else
        {
            var tableHeader = "<ul class='tableHeader'><li></li><li>Hours</li><li>Expenses</li><li>Tkts</li></ul>";
            $(tableHeader).prependTo("#activeList");
            for(var a = 0; a < retrievedObjectTwo.length; a++){
                localActiveAccount = retrievedObjectTwo[a];
                $(localActiveAccount).appendTo("#activeList");
            }
                reveal();
        }
        $.ajax({
            type: 'GET',
            beforeSend: function (xhr) {
                xhr.withCredentials = true;
                xhr.setRequestHeader('Authorization',
                                     'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
            },

            url:ApiSite +"accounts?limit=300&query=account_statistics.ticket_counts.open>0",
            dataType:"json",
            cache: true,
            success: function(returnData) {
                $("#activeList").empty();
                //insert for  the header of the active account table
                var tableHeader = "<ul class='tableHeader'><li></li><li>Hours</li><li>Expenses</li><li>Tkts</li></ul>";
                $(tableHeader).prependTo("#activeList");
                //console.log(returnData);
                //add accounts to the active accounts list
                var activeLength = returnData.length;
                //if(returnData.length > 7){activeLength = 7;}
                var activeAccount;
                for (var i = 0; i < activeLength; i++)
                {
                    var openTickets = returnData[i].account_statistics.ticket_counts.open;
                    var openHours = returnData[i].account_statistics.hours;
                    var nameCheck = returnData[i].name;
                    nameCheck = createElipse(nameCheck, .30, 12);
                    if(openHours > 999){
                        openHours = 999;
                    }
                    openHours = openHours.toString();
                    //if(openHours.length > 3){
                    //    openHours = openHours.substring(0,3);
                    //}

                    // if account has more than 100 open tickets then sub 99+
                    if(openTickets > 100)
                    {
                        openTickets = "99";
                        activeAccount = "<ul class='tableRows clickme' data-id=" + returnData[i].id + "><li>" + nameCheck + "</li><li>" + openHours + "</li><li>" + localStorage.getItem('currency') + Number(returnData[i].account_statistics.expenses).toFixed(2) + "</li><li><div class='tks1' >" + openTickets + "<div class='overflowTickets'><p>+</p></div></div></li></ul>";
                        $(activeAccount).appendTo("#activeList");
                        //localDashAccounts.push(activeAccount);
                    }else{
                        activeAccount = "<ul class='tableRows' data-id=" + returnData[i].id + "><li>" + nameCheck + "</li><li>" + openHours + "</li><li>" + localStorage.getItem('currency') + Number(returnData[i].account_statistics.expenses).toFixed(2) + "</li><li><div class='tks1' >" + openTickets + "</div></li></ul>";
                        $(activeAccount).appendTo("#activeList");
                    }
                    dashAccounts.push(activeAccount);
                }
                localStorage.setItem('localDashAccounts', JSON.stringify(dashAccounts));

            },
            error: function() {
                console.log("fail @ get getTicketCount");
                console.log(userOrgKey + '-' + userInstanceKey +':'+userKey);(userOrg);
            }
        });
    };

    var userInfo = {
        init:function() {
            this.userData();
        },
        userData:function() {
            //get user info
            $.ajax({
                type: 'GET',
                beforeSend: function (xhr) {
                    xhr.withCredentials = true;
                    xhr.setRequestHeader('Authorization',
                                         'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
                },

                url:ApiSite +"users?query="+localStorage.getItem('userName'),
                dataType:"json",
                success: function(returnData) {
                    //console.log(returnData);
                    //set the name of the nav side menu
                    $(".navName").html(returnData[0].firstname+" "+returnData[0].lastname);
                    //get md5 value of users email for gravatar
                    var email = $.md5(returnData[0].email);
                    //set user avatar picture in side menu
                    $(".navProfile").attr("src","http://www.gravatar.com/avatar/" + email + "?d=mm&s=80");
                    //set user id to local storage
                    localStorage.setItem("userId",returnData[0].id);
                },
                complete:function(){
                    reveal();
                    window.setTimeout(reveal,500);
                },
                error: function() {
                    console.log("fail @ accounts");
                    //console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
                }
            });
        }
    };

    // organization Ajax call
    var org = {
        init: function () {
            if (location.pathname.indexOf("org.html") < 0)
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
                getInstanceConfig(userOrgKey, userInstanceKey)
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
                            $('#orgSelect')
                            .append($("<option></option>")
                                    .attr("value", i)
                                    .text(orglistitem[i].name));
                        }
                        $('#orgSelect')
                        // listen for org selection
                        .change(function () {
                            var index_number = this.value;
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
                                $('#instSelect').find('option:gt(0)').remove();
                                for (var i = 0; i < instances.length; i++) {
                                    $('#instSelect')
                                    .append($("<option></option>")
                                            .attr("value", i)
                                            .text(instances[i].name));
                                }
                                $('.instSelect').show();
                                // listen for Instance selection
                                $('#instSelect').change(function () {
                                    var userInstanceKey = instances[this.value].key;
                                    localStorage.setItem('userInstanceKey', userInstanceKey);
                                    localStorage.setItem('sd_is_MultipleOrgInst', 'true');
                                    getInstanceConfig(userOrgKey, userInstanceKey);
                                });
                            };
                        });
                    };// End > 1

                    // If there is ONLY ONE org and instance
                    if (results.length == 1) {
                        userOrgKey = results[0].key;
                        userOrg =  results[0].name;
                        localStorage.setItem('userOrgKey', userOrgKey);
                        localStorage.setItem('sd_is_MultipleOrgInst', 'false');
                        localStorage.setItem('userOrg', userOrg);
                        $('#orgSelect').append($("<option></option>")
                                .attr("value", 0)
                                .text(results[0].name));
                        $('#orgSelect').val(0);
                        //location.reload(true);
                        var instances = results[0].instances;
                        // If there is only one instance on the selected org
                        if (instances.length == 1) {
                            userInstanceKey = instances[0].key;
                            localStorage.setItem('userInstanceKey', userInstanceKey);
                            getInstanceConfig(userOrgKey, userInstanceKey);
                        }
                        else {
                            // If there is MORE than one instance on the selected org
                            $('#instSelect').find('option:gt(0)').remove();
                            for (var i = 0; i < instances.length; i++) {
                                $('#instSelect')
                                .append($("<option></option>")
                                        .attr("value", i)
                                        .text(instances[i].name));
                            }
                            $('.instSelect').show();
                            // listen for Instance selection
                            $('#instSelect').change(function () {
                                userInstanceKey = instances[this.value].key;
                                localStorage.setItem('userInstanceKey', userInstanceKey);
                                localStorage.setItem('sd_is_MultipleOrgInst', 'true');
                                getInstanceConfig(userOrgKey, userInstanceKey);
                            });
                        };
                    };
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
            })

        }
    };

    var miscClicks = {
        init:function() {
            this.justClicked();
            this.menuFunctions();
        },

        justClicked:function() {
            $(document).on("click",".responseBlock", function(){
                localStorage.setItem('ticketNumber', $(this).attr("data-id")); //set local storage variable to the ticket id of the ticket block from the ticket list
                window.location = "ticket_detail.html"; // change page location from ticket list to ticket detail list
            });
            $("#invoiceOption").click(function(){
                window.location = "Invoice_List.html";
            });
            // go to complete list of invoice on click
            $("#allInvoice, #invoiceFooter").click(function(){
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
            $(document).on('click', '#addAccountTicket', function() {
                var ticketAccount = localStorage.getItem('DetailedAccount');
                console.log(ticketAccount);
                localStorage.setItem('addAccountTicket', ticketAccount);
                window.location = 'add_tickets.html';
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

            if (typeof messageText === "undefined")
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
        if (location.pathname.indexOf("index.html") < 0 && location.pathname != "/" && location.pathname.indexOf("org.html")<0)
        {
            //set the name of the nav side menu
            //$(".navName").html(localStorage.getItem("userFullName"));
            //set user avatar picture in side menu
            //$(".navProfile").attr("src","http://www.gravatar.com/avatar/" + $.md5(localStorage.getItem("userName")) + "?d=mm&s=80");
            //$(".navName").show();
            //$(".navProfile").show();
            signout.init();
            miscClicks.init();
            //init config
            getInstanceConfig("","",false, function(){
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

                //refresh version
                if (localStorage.appVersion !== appVersion)
                {
                    localStorage.setItem("appVersion", appVersion);
                    console.log("Version updated to " + appVersion);
                    if (adMessage.length > 1)
                    {
                        setTimeout(function(){
                    userMessage.showMessage(true, adMessage, function(){
                    //location.reload(true);
                    });}, 3000);
                    }
                    else
                        location.reload(true);
                    //return;
                }
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
                        $("#invoiceFooter").next().hide();
                    }
                    //conditional api calls determined by page
                    if (location.pathname.endsWith("dashboard.html"))
                    {
                        var orgName = localStorage.getItem('userOrg');
                        if (orgName)
                            $("#indexTitle").html(orgName);
                        getTicketCount();
                        getQueueList();
                        //getQueues.init();
                        if(isAccount)
                            getActiveAccounts();
                        search.init();
                        //reveal();
                    }
                    $("#loading").show();
                    if (location.pathname.endsWith("account_details.html"))
                    {
                        if (!isAccount) window.location = "dashboard.html";
                        else
                        {
                            if(!isInvoice) $("#invoiceOption").parent().remove();
                            accountDetailsPageSetup.init();
                            //detailedTicket.init();
                            closedTickets.pageChange();
                        }
                    }
                    if (location.pathname.endsWith("Account_List.html"))
                    {
                        if (!isAccount) window.location = "dashboard.html";
                        else
                        {
                            accountList.init();
                        }
                    }
                    if (location.pathname.endsWith("addTicketTime.html"))
                    {
                        if (isTime) addTime.init();
                        else window.location = "dashboard.html";

                    }
                    if (location.pathname.endsWith("timelog.html"))
                    {if (!isTime) window.location = "dashboard.html";
                     else
                     {
                         //accountTimeLogs.init();
                         timeLogs.init();
                         //addTime.init();
                     }
                    }
                    if (location.pathname.endsWith("accountTimes.html"))
                    {
                        if (!isTime || !isAccount) window.location = "dashboard.html";
                        else
                        {
                            accountTimeLogs.init();
                            //timeLogs.init();
                        }
                    }
                    if (location.pathname.endsWith("allInvoice_List.html"))
                    {
                        if (!isTime || !isInvoice) window.location = "dashboard.html";
                        else
                        {
                            invoiceList.init();
                        }
                    }
                    else if (location.pathname.endsWith("Invoice_List.html"))
                    {
                        if (!isTime || !isInvoice) window.location = "dashboard.html";
                        else
                        {
                            invoiceList.init(localStorage.getItem("DetailedAccount"));
                        }

                    }
                    if (location.pathname.endsWith("invoice.html"))
                    {
                        if (!isTime || !isInvoice) window.location = "dashboard.html";
                        else
                        {
                            detailedInvoice.init();
                            sendInvoice.init();
                            addRecip.init();
                        }
                    }
                    if (location.pathname.endsWith("Queues.html"))
                    {
                        getQueues.init();
                    }
                    if (location.pathname.endsWith("queueTickets.html"))
                    {
                        getQueueTickets.init();
                    }
                }
                if (location.pathname.endsWith("ticket_list.html"))
                {
                    ticketList.init();
                    //accountDetailsPageSetup.init();

                }
                if (location.pathname.endsWith("ticket_detail.html"))
                {
                    detailedTicket.init();
                    pickUpTicket.init();
                    transferTicket.init();
                    closeTicket.init();
                    //addTime.init();
                    postComment.init();
                }
                if (location.pathname.endsWith("closedTickets.html"))
                {
                    // detailedTicket.init();
                    closedTickets.init();
                }
                if (location.pathname.endsWith("add_tickets.html"))
                {
                    newTicket.init();
                    //accountTimeLogs.init();
                }
                if (location.pathname.endsWith("add_time.html"))
                {
                    if (!isTime) window.location = "dashboard.html";
                    else
                    {
                        addTime.init();
                    }
                }
                if (location.pathname.endsWith("edit_time.html"))
                {
                    if (!isTime) window.location = "dashboard.html";
                    else
                    {
                        addTime.init(true);
                    }
                }
                fullapplink();
                if (typeof navigator.splashscreen !== 'undefined') 
                    navigator.splashscreen.hide();
                if (!isTime)
                    $(".time").remove();
            });
        }
    }());


});
