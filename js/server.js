/*jshint -W004, -W041, -W103, eqeqeq: false, noempty: false, undef: false, latedef: false, eqnull: true, multistr: true*/
/*global jQuery, $ */

var Page = location.pathname.substr(1);

var isExtension = window.self !== window.top;
if (isExtension) localStorage.setItem("referrer", Page);

function default_redirect (is_tech)
{
    //window.location = is_tech ? "dashboard.html" : "ticket_list.html";
}

function googleTag() {}

function googleConversion() {}

//Root Names
var Site = 'sherpadesk.com/';
var MobileSite = 'http://m0.' + Site;
var AppSite = 'https://app.beta.' + Site;
var ApiSite = 'http://api.beta.' + Site;
