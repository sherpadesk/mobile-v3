
function default_redirect (is_tech)
{
    window.location = isTech ? "dashboard.html" : "ticket_list.html";
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

function googleConversion()
{
    var img = new Image();
    var div = document.getElementById('body');

    img.onload = function() {
        div.appendChild(img);
    };

    img.src = 'http://www.googleadservices.com/pagead/conversion/1040470683/?value=1.00&currency_code=USD&label=KRf-CIfZrQQQm6WR8AM&guid=ON&script=0';
}

var dontClearCache = false;

function getappTrackConversion(id) {
    var r = document.referrer;
    var h = window.location.href;
    var p = '1'; // Price of conversion (optional)
    var e = id || ''; // External ID (optional)
    var listing_id = '102459';

    var a = document.createElement('script');
    a.type = 'text/javascript';
    a.async = true;
    a.src = 'https://www.getapp.com/conversion/' + encodeURIComponent(listing_id) +
        '/r.js?p=' + encodeURIComponent(p) + '&h=' + encodeURIComponent(h) +
        '&r=' + encodeURIComponent(r) + '&e=' + encodeURIComponent(e);
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(a, s);
};