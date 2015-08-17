/*jshint -W004, -W041, -W103, eqeqeq: false, noempty: false, undef: false, latedef: false, eqnull: true, multistr: true*/
/*global jQuery, $ */

var Page = location.pathname.substr(1);

var isExtension = window.self !== window.top;
if (isExtension) localStorage.setItem("referrer", Page);

function default_redirect (is_tech)
{
    //window.location = is_tech ? "dashboard.html" : "ticket_list.html";
}

var _gaq = _gaq || [];

function googleTag() {
    _gaq.push(['_setAccount', 'UA-998328-15']);
    _gaq.push(['_trackPageview']);
    (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
}

//Root Names
var Site = 'sherpadesk.com/';
var MobileSite = 'http://m.' + Site;
var AppSite = 'https://app.' + Site;
var ApiSite = 'http://api.' + Site;
