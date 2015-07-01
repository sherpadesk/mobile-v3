/*jshint -W004, -W041, eqeqeq: false, noempty: false, undef: false, latedef: false, eqnull: true, multistr: true*/
/*global jQuery, $ */

$(document).ready(function() {

var fastClicker = {
	init:function() {
		this.clickFast();
	},

	clickFast:function() {

		window.addEventListener('load', function() {
			FastClick.attach(document.body);
		}, false);
	}
};

	var backButton = {
		init:function() {
			$("#goBack").click(function(){
                if (!window.backFunction)
                    window.history.back();
                else
                window.backFunction(); 
                }
        );
        }
	};


	var sideBar = {
		init: function() {
			this.slideController();
			this.pageLocation();
			this.menuSize();
		},

		slideOut: function() {
			if($(window).scrollTop() > 0) {
				window.scrollTo(0,0);
			}
			$(".sideNav").css("top",0);
			$(".bodyContent, header").addClass("contentOut");
			$(".sideNav").addClass("sideNavOut");
			$("body,html").toggleClass("bodyLock");
			//$("a").toggleClass("disabled");
			//document.body.addEventListener('touchstart', function(e){ e.preventDefault(); });
			slide = true;
		},

		slideIn: function() {
			// e.preventDefault();
			$(".bodyContent, .header").removeClass("contentOut");
			$(".sideNav").removeClass("sideNavOut");
			$("body, html").toggleClass("bodyLock");
			//document.body.removeEventListener('touchstart', function(e){ e.preventDefault(); });
			//$("a").toggleClass("disabled");
			slide = false;
		},

		slideController: function() {
			$("#navBars").click(function() {
				sideBar.slideOut();
			});
			$(".sideNav").click(function() {
				sideBar.slideIn();
			});
		},

		pageLocation:function() {
		if (location.pathname.indexOf("dashboard.html") >= 0)
        {
            $("#itemDash").addClass("activeLink");
            $("#itemDash").find(".iconCircle").addClass("activeBorder");
        }
        if (location.pathname.indexOf("ticket_list.html") >= 0)
        {
            $("#itemTickets").addClass("activeLink");
            $("#itemTickets").find(".iconCircle").addClass("activeBorder");

        }
        if (location.pathname.indexOf("Account_List.html") >= 0)
        {
            $("#itemAccount").addClass("activeLink");
            $("#itemAccount").find(".iconCircle").addClass("activeBorder");

        }
        if (location.pathname.indexOf("timelog.html") >= 0)
        {
            $("#itemTimelog").addClass("activeLink");
            $("#itemTimelog").find(".iconCircle").addClass("activeBorder");
        }
        if (location.pathname.indexOf("Queues.html") >= 0)
        {
            $("#itemQueues").addClass("activeLink");
            $("#itemQueues").find(".iconCircle").addClass("activeBorder");
        }
        if (location.pathname.indexOf("invoice_List.html") >= 0)
        {
            $("#itemInvoice").addClass("activeLink");
            $("#itemInovice").find(".iconCircle").addClass("activeBorder");
        }
        if (location.pathname.indexOf("invoice.html") >= 0)
        {
            $("#itemInvoice").addClass("activeLink");
            $("#itemInovice").find(".iconCircle").addClass("activeBorder");
        }

		},

		menuSize:function() {
			var windowHeight = $(window).height();
			if(windowHeight < 570){
				$('.sideNavLinks li').css('height','52');
				$('.activeNav').css('overflow','scroll');
				$('.menuTicketsStat').hide();
			}
			$(window).on('resize',function(){
				windowHeight = $(window).height();
				if(windowHeight < 570){
					$('.sideNavLinks li').css('height','52');
					$('.activeNav').css('overflow','scroll');
					$('.menuTicketsStat').hide();
				}else{
					$('sideNavLinks li').css('height','65');
				}
			});
		}


	};

	var addRecip = {
		init: function() {
			this.slideOut();
			this.slideIn();

		},

		slideOut: function() {
            $(document).on("click",".plusIcon",function(){
                var email = $(this).attr("id");
				$(this).attr("src", 'img/error.png');
                $(this).removeClass().addClass("closeIcon");
                $(this).parents(".recipientParent").appendTo("#recipientList");
			});
			$(document).on("click",".closeIcon",function(){
                var email = $(this).attr("id");
				$(this).attr("src", 'img/check.png');
                $(this).removeClass().addClass("plusIcon");
                $(this).parents(".recipientParent").prependTo('#recipientList');
			});
			$(document).on("click","#addRecipient", function(){
				var insert = "<li class='addInput'><div id='addEm' class='headerSearchContainer addRecipColor'><input class='headerSearch'><img class='searchCloseExpandedR addRecipX' src='img/close_search.png'></div></li>";
				var parent = $(this).parent();
				var label = '<li>Recipients</li>';
				$(parent).empty();
				$(label).appendTo("#recipHeader");
				$(insert).appendTo("#recipHeader");
				$(".headerSearchContainer").animate({
					width: "200px"
				}, 300);
			});
            /*$("ul.recipientDetail").click(function() {

                $(this).parent().parent().prepend($(this).parent());

            });
            var d = document.getElementById('foo0');
            d.parentNode.appendChild(d);*/

		},

		slideIn: function() {
			$(document).on("click",".searchCloseExpandedR", function(){
				$(".headerSearchContainer").animate({
					width: "0px"
				}, 300);
				var insert = "<li id='addRecipient' class='detail3Short'><img class='plusIcon' src='img/plus_icon.png'></li>";
				setTimeout(
  				function()
  				{
  				  //do something special
  				  $(insert).appendTo("#recipHeader");
  				}, 310);

				});
						}
	};

	var searchBar = {
		init: function() {
			this.slideOut();
			this.slideIn();
		},

		slideOut: function() {
			//$(".topHeader li:last-child ").on("click", ".headerSearchIcon", function() {
            if ($(".headerSearchIcon")){
                var parent = $(".headerSearchIcon").parent();
                //console.log(parent);
                var insert = "<div id='searchThis' class='headerSearchContainer'><img class='searchIconExpanded' src='img/search_icon.png'><input class='headerSearch search' "+ (location.pathname.indexOf("dashboard.html") >= 0 ? " placeholder='Search Tickets' ":"") +"><img class='searchCloseExpanded' src='img/close_search.png'></div>";
				$(parent).empty();
				$(insert).appendTo( $( parent ) );
                if (localStorage.getItem("searchItem")){
                    $('.SherpaDesk').css('opacity','0.2');
                    $('.headerSearchContainer').css({
                        backgroundColor:'#0099CC',
                        width:'285px'
                    });
                    $("input.search").focus();
                }
                else{
				$(".headerSearchContainer").animate({
					width: "45px"
				}, 300);
                }
            }
			//});
		},

		slideIn: function() {
			var parent = ".topHeader li:last-child";
			//var insert = "<img class='headerSearchIcon' src='img/search_icon.png'>"
			$(parent).on("click", ".searchCloseExpanded", function() {
                if ($(".search").val())
                {
                    $(".search").val("");
                    if (location.pathname.indexOf("ticket_list.html") >= 0)
                    location.reload(false);
                    else
                        if (location.pathname.indexOf("dashboard.html") < 0) featureList.search();
                }
			});
			$('.searchIconExpanded').click(function(){
				$('.SherpaDesk').animate({
					'opacity':'0.2'
				},200);
				$('.headerSearchContainer').animate({
					'backgroundColor':'#0099CC',
					width:'285px'
				},300);
                $("input.search").focus();
			});
			$('.searchCloseExpanded').click(function(){
				$('.SherpaDesk').animate({
					'opacity':'1'
				},200);
				$('.headerSearchContainer').animate({
					'backgroundColor':'#25B0E6',
					width:'45px'
				},300);
			});
		}
	};

	var ticker = {
		init: function() {
			this.changeTime();
		},

		changeTime: function() {
            var counter = 0;
			$("#addTimeTicket").val(counter);
			$(".buttonList li:nth-child(3), .buttonListSymbols").click(function() {
                val = $("#addTimeTicket").val() ? parseFloat($("#addTimeTicket").val()) : 0;
				//counter = val + 0.25;
                $("#addTimeTicket").val(val + 0.25);
			});
			$(".buttonList li:nth-child(1), .buttonListSymbols").click(function() {
                val = $("#addTimeTicket").val() ? parseFloat($("#addTimeTicket").val()) : 0;
                $("#addTimeTicket").val(val - 0.25);
			});
		}
	};

	var ticketDetails = {
		init: function() {
			this.tab();
			//this.scrollResponse();
			this.latestPost();
		},

		latestPost: function() {
			$(".orginalMessageContainer .responseBlock").addClass("latestResponse");
		},

		tab: function() {
			$('#replyTab, #ticketReply').css('color','#fff');   
            if (localStorage.getItem('userRole') !== "tech") $(".TicketTabs").hide();
            var test = localStorage.getItem("ticketPage");
            this.tabnav(test ? test : "user");
            $(document).on("click",".tabHeader",function(){
				ticketDetails.tabnav($(this));
			});
		},
        
        tabnav: function($element) {
                var test, islist = $('.TicketTabs').length;
                if(Object.prototype.toString.call($element) !== '[object String]'){
                    test = $element.attr("data-id");
                }
                else if(islist) {
                    test = $element.toLowerCase().replace("as", "").replace("tickets","");
                    if (test.length > 5) test = test.replace("tech", "");
                    $element = $("li.tabHeader[data-id="+test+"]");
                }

				$('.TicketTabs > ul > li, .tabs > ul > li').css('color','rgba(255, 255, 255, 0.55)');
				$(".tabpage").hide();
				switch(test) {
					case "info":
                    case "tech":
						$element.css('color','#ffffff');
						$("#tabpage_info").show();
                        if (islist) localStorage.setItem('ticketPage',"asTech");
						break;
					case "all":
						$element.css('color','#ffffff');
						$("#tabpage_all").show();
                        if (islist) localStorage.setItem('ticketPage',"allTickets");
						break;
					case "options":
                    case "alt":
						$element.css('color','#ffffff');
						$("#tabpage_options").show();
                        if (islist) localStorage.setItem('ticketPage',"asAltTech");
                        break;
				    default:
                    case "reply":
                    case "user":
                        $('.TicketTabs > ul > li:first, .tabs > ul > li:first').css('color','#ffffff');
						$("#tabpage_reply").show();
                        if (islist) localStorage.setItem('ticketPage',"asUser");
						break;
				}
			},
	};

	var showExtendedDetails = {
		init: function() {
			this.showDetailOptions();
		},

		showDetailOptions: function() {
				$("#details").click(function(){
				$(".detailedOption").slideToggle(300);
				$(".selectionGroup").slideToggle(300);
				$(".detailsArrowDown").slideToggle(300);
				$(".upArrow").slideToggle(300);


			});
		}
	};

	var billEm = {
		init: function() {
			this.checkBillButton();
		},

		checkBillButton: function() {
			$("#billem, #billem1").click(function(){
				$(".innerCircle").toggleClass("billFill");
			});

			$(document).on("click",".innerCircle",function(){
				$(this).toggleClass("billFill");
			});
		}

	};
    
	var createButton = {
		init:function() {
			this.expandOptions();
		},

		expandOptions:function() {
			var optionsOut = false;
			$('#dashboardCreate').click(function(){
				if(optionsOut == false){
					$('.createActions').show();
					$('.createButton').addClass('destroyButton');
					optionsOut = true;
				}else{
					$('.createActions').hide();
					$('.createButton').removeClass('destroyButton');
					optionsOut = false;
				}
			});
		}
	};

    
    var NAV_MENU="<div class='activeNav'><div class='fold'><i class='fa a-angle-double-left fa-2x'></i></div><img class='navProfile' src='img/profile_3.png'><h2 class='navName'>NO USER DATA</h2><ul class='sideNavLinks'><a href='dashboard.html'><li id='itemDash'><a href='dashboard.html'><div class='iconCircle'><i class='fa fa-tachometer'></i></div><h3>Dashboard</h3></a></li></a> <a class='user' href='ticket_list.html'><li id='itemTickets'><div class='iconCircle'><i class='fa fa-ticket'></i></div><h3>Tickets</h3><div class='menuTicketsStat'><p class='menuTicketStatNumber'>0</p></div></li></a> <a class='time' href='timelog.html'><li id='itemTimelog'><div class='iconCircle'><i class='fa fa-clock-o'></i></div><h3>Timelogs</h3></li></a> <a href='Account_List.html'><li id='itemAccount'><div class='iconCircle'><i class='fa fa-users'></i></div><h3>Accounts</h3></li></a><a href='allInvoice_List.html'><li class='time' id='itemInvoice'><div class='iconCircle'><i class='fa fa-credit-card'></i></div><h3 id='allInvoice'>Invoices</h3></li></a><a href='Queues.html'><li id='itemQueues'><div class='iconCircle'><i class='fa fa-sort-amount-asc'></i></div><h3>Queues</h3></li></a><li class='user' id='switchOrg'><div class='iconCircle'><i class='fa fa-list'></i></div><h3>Switch Org</h3></li><li class='user' id='signOut'><div class='iconCircle'><i class='fa fa-sign-in'></i></div><h3>Signout</h3></li><a class='fullapplink user' href='#'><li><div class='iconCircle'><i class='fa fa-external-link'></i></div><h3>Full App</h3></li></a></ul></div>";
    
    var CREATE_MENU="<div class='createActions'><ul class='createActionsList'><li onclick='window.location.replace(\"add_tickets.html\");'><i class='fa fa-ticket'></i><p>Add Ticket</p></li><li class='time' onclick='window.location.replace(\"add_time.html\");'><i class='fa fa-clock-o'></i><p>Add Time</p></li><li id='itemUnInvoice'  onclick='window.location.replace(\"unInvoice_List.html\");'><i class='fa fa-credit-card'></i><p>Add Invoice</p></li><li class='expense' onclick='window.location.replace(\"addExpence.html\");'><i class='fa fa-money'></i><p>Add Expense</p></li></ul></div>";

	(function() { 
        if (!document.getElementById("goBack")){
        var nav = document.createElement("nav");
        nav.className = "sideNav";
        nav.innerHTML = NAV_MENU;
        document.body.insertBefore(nav, document.body.firstChild);
            		sideBar.init();
        }
        else
            backButton.init();
        var $create_el = $("#dashboardCreate");
        if ($create_el){
            $(CREATE_MENU).insertAfter($create_el);
		createButton.init();
        }
        
        $createButton = $("#ticketCreate");
        if ($createButton){
            $createButton.click(
                function(){
                    window.location.replace("add_tickets.html");
                });
        }
        
		//fastClicker.init();
        //largeScreenStlye.init();
        //fullscreen();
        
		if (Page == "invoice.html")
        {
            addRecip.init();
        }
        
        if ($(".headerSearchIcon").length){
		searchBar.init();
        }
        
        if($("#addTimeTicket").length)
		ticker.init();
        
        if ($(".tabHeader").length)
		ticketDetails.init();
		
		//StickRecentTickets.init();
		billEm.init();
		//footer.init();
        		
        if (Page == "addTicket_V4.html")
        {showExtendedDetails.init();}
		//if($(window).width() < 478){footer.init();}
		//homePage.init();
		//if($(window).width() > 478){hideFooter.init();}
	}());

});
