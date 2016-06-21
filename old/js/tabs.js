window.addEventListener("DOMContentLoaded", Tabs, false);

function Tabs() {

  // get tab container
    var containers = document.querySelectorAll(".tabContainer");
    for (var i = 0; i < containers.length; i++) {
        initContainer(containers[i]);
    }
}

function initContainer(container)
{
    //displayPage(container);

    //this adds click event to tabs
    var func = function(event) { var tab = event.target.id;
                                if (tab) displayPage(container, tab.split("_")[1]);};
    var navitem = container.querySelector(".tabHeader");
    navitem.parentNode.addEventListener('touchstart', func, false);
    navitem.parentNode.addEventListener('click', func, false);
}

// on click of one of tabs
function displayPage(container, tab) {
    if (!container)
        return;
    tab = tab || container.querySelector(".tabHeader").id.split("_")[1];
    var el = container.querySelector("#tab_" + tab);
    if (!el)
        return;
    var pa = el.parentNode;
  var current = pa.getAttribute("data-current");
  //remove class of activetabheader and hide old contents
    if (current){
    container.querySelector("#tab_" + current).setAttribute("class","tabHeader");
    container.querySelector("#tabpage_" + current).style.display="none";
    }
  //add class of activetabheader to new active tab and show contents
    el.setAttribute("class","tabHeader tabActiveHeader");
    container.querySelector("#tabpage_" + tab).style.display="block";
    pa.setAttribute("data-current",tab);
    if (pa.parentNode.getAttribute("class") == 'ticketslist')
            localStorage.setItem('ticketPage',tab);
}