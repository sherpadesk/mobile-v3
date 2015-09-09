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
        window.location = "login.html".addUrlParam("f",mess);
}

function clearStorage(keepOrg)
{
    if (isPhonegap){
        var prefs = plugins.appPreferences;
        var suitePrefs = prefs.iosSuite ("group.io.sherpadesk.mobile");
        suitePrefs.store (ok, fail, 'org', '');
    }
    var userName = localStorage.userName || "";
    var appVersion = localStorage.appVersion || "";
    var ticket = localStorage.loadTicketNumber || "";
    var ticket = localStorage.loadTicketNumber || "";
    var ios_action = localStorage.ios_action || "";
    var loadOrgKey = localStorage.loadOrgKey || "";
    var isPhonegap = localStorage.isPhonegap || "";
    var userKey = localStorage.userKey || "";
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
    localStorage.isPhonegap = isPhonegap;
    if (keepOrg)
        localStorage.userKey = userKey;
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
