/*jshint -W004, -W041, -W103, eqeqeq: false, noempty: false, undef: false, latedef: false, eqnull: true, multistr: true*/
/*global jQuery, $ */

var year="2015";
var appVersion = "25";

//global helper functions
function logout(isRedirect, mess) {
    clearStorage();
    if (localStorage.is_google) {
        localStorage.removeItem('userName');
        localStorage.removeItem('is_google');
        GooglelogOut();
    }
    else if (isRedirect || true)
        window.location = "login.html" + (!mess ? "" : "?f="+mess);
}

function clearStorage()
{
    var userName = localStorage.userName || "";
    var appVersion = localStorage.appVersion || "";
    var ticket = localStorage.loadTicketNumber || "";
    var ios_action = localStorage.ios_action || "";
    var loadOrgKey = localStorage.loadOrgKey || "";
    localStorage.clear();
    //localStorage.removeItem('userOrgKey');
    //localStorage.removeItem('userOrg');
    //localStorage.removeItem('userInstanceKey');
    //localStorage.removeItem('userKey');
    localStorage.setItem("userName", userName);
    localStorage.appVersion = appVersion;
    localStorage.loadTicketNumber = ticket;
    localStorage.ios_action = ios_action;
    localStorage.loadOrgKey = loadOrgKey;
    //clear also chrome ext if needed
    if (isExtension)
        window.top.postMessage("logout", "*");

}


function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.href);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function cleanQuerystring() {
    try {window.history.replaceState( {} , '', location.origin + location.pathname );}
    catch (err){}
}


    //var img = new Image();
    //img.src = MobileSite + "img/error-background.png";

    var userOrgKey = "";
    var userInstanceKey = "";
    var	userKey = "";

function done() {
    var ios_action = getParameterByName('ios_action') || localStorage.getItem('ios_action');
    if (ios_action && ios_action != "undefined"){
        cleanQuerystring();
        ios_action = ios_action.replace('#', '?');
        localStorage.setItem('ios_action', ios_action);
        console.log("initial ios action: " + ios_action);
    }
    var ticket = getParameterByName('ticket');
    var org = getParameterByName('org');
    if (ticket) {
        cleanQuerystring();
        localStorage.setItem('loadTicketNumber', ticket);
    }
    if (org) {
        cleanQuerystring();
        localStorage.setItem('loadOrgKey', org);
    }

    userKey = localStorage.getItem("userKey");
    userOrgKey = localStorage.getItem('userOrgKey');
    userInstanceKey = localStorage.getItem('userInstanceKey');

    if (!userOrgKey || !userInstanceKey)
    {
        if (userKey) 
        {
            window.location = "org.html";
        }
        else 
        {
            logout();
            window.location = "login.html";
        }
        return;
    }
    
    if (ios_action && ios_action !== "undefined"){
        localStorage.setItem('ios_action', "");
        window.location = ios_action;
        return;
    }

    ticket = localStorage.loadTicketNumber; 

    if (ticket) {
        localStorage.loadTicketNumber = '';
        localStorage.setItem('ticketNumber', ticket);
        window.location = "ticket_detail.html";
        return;
    }
    
    window.location = localStorage.getItem('userRole') === "tech" ? "dashboard.html" : "ticket_list.html";
}

function handleOpenURL(url) {
    localStorage.setItem('ios_action', url.substring(13));
    console.log("initial url: " + url);
}


    //Main Method that calls all the functions for the app
if (navigator.userAgent.match(/iphone|ipad|ipod/i))
    window.onload = function () {setTimeout(done, 200);};
else
    done();
