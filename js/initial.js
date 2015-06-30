/*jshint -W004, -W041, -W103, eqeqeq: false, noempty: false, undef: false, latedef: false, eqnull: true, multistr: true*/
/*global jQuery, $ */

var year="2015";
var appVersion = "25";

//Root Names
var Site = 'sherpadesk.com/';
var MobileSite = 'http://m.' + Site;
var AppSite = 'https://app.' + Site;

var isExtension = window.self !== window.top;

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
    var userName = localStorage.userName;
    var appVersion = localStorage.appVersion;
    var ticket = localStorage.loadTicketNumber;
    localStorage.clear();
    //localStorage.removeItem('userOrgKey');
    //localStorage.removeItem('userOrg');
    //localStorage.removeItem('userInstanceKey');
    //localStorage.removeItem('userKey');
    localStorage.setItem("userName", userName);
    localStorage.appVersion = appVersion;
    localStorage.loadTicketNumber = ticket;
    //clear also chrome ext if needed
    if (isExtension)
        window.top.postMessage("logout", "*");

}


function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function cleanQuerystring() {
    try {window.history.replaceState({}, document.title, location + Page);}
    catch (err){}
}


    //var img = new Image();
    //img.src = MobileSite + "img/error-background.png";

    var userOrgKey = "";
    var userInstanceKey = "";
    var	userKey = "";

function done() {
    var ticket = getParameterByName('ticket');
    if (ticket) {
        cleanQuerystring();
        localStorage.setItem('loadTicketNumber', ticket);
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

    ticket = localStorage.loadTicketNumber; 

    if (ticket) {
        localStorage.loadTicketNumber = '';
        localStorage.setItem('ticketNumber', ticket);
        window.location = "ticket_detail.html";
        return;
    }

    window.location = localStorage.getItem('userRole') === "tech" ? "dashboard.html" : "ticket_list.html";
}


    //Main Method that calls all the functions for the app
if (navigator.userAgent.match(/iphone|ipad|ipod/i))
    window.onload = function () {setTimeout(done, 200);};
else
    done();
