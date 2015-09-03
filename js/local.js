/*jshint -W004, -W041, -W103, eqeqeq: false, noempty: false, undef: false, latedef: false, eqnull: true, multistr: true*/
/*global jQuery, $ */

var Page = location.href.match(/(.+\w\/)([^\?]+)/)[2];

var isExtension = false;

function default_redirect (is_tech)
{
    //window.location = is_tech ? "dashboard.html" : "ticket_list.html";
}

function googleTag() {}

function googleConversion() {}

//Root Names
var Site = 'sherpadesk.com/';
var MobileSite = 'http://m.' + Site;
var AppSite = 'https://app.' + Site;
var ApiSite = 'http://api.' + Site;
