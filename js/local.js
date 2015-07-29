/*jshint -W004, -W041, -W103, eqeqeq: false, noempty: false, undef: false, latedef: false, eqnull: true, multistr: true*/
/*global jQuery, $ */

var Page = location.href.match(/(.+\w\/)(.+)/)[2];
$( window ).unload(function() { localStorage.setItem("referrer", Page); });

var isExtension = false;

function default_redirect (is_tech)
{
    //window.location = is_tech ? "dashboard.html" : "ticket_list.html";
}

function googleTag() {}

