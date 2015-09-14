/*jshint -W004, -W041, -W103, eqeqeq: false, noempty: false, undef: false, latedef: false, eqnull: true, multistr: true*/
/*global jQuery, $ */

var isPhonegap = false;

    //var img = new Image();
    //img.src = MobileSite + "img/error-background.png";

    var userOrgKey = "";
    var userInstanceKey = "";
    var	userKey = "";

function done() {
    if (localStorage.isPhonegap !== "true")
        localStorage.isPhonegap = !!RegExp('[?&]ios_action=').exec(window.location.href);
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
            //logout();
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
if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/))
    window.onload = function () {setTimeout(done, 200);};
else
    done();
