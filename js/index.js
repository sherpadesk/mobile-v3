$(document).ready(function() {
	
function fullscreen() {
    $('a').click(function() {
        if(!$(this).hasClass('noeffect')) {
            window.location = $(this).attr('href');
            return false;
        }
    });
}

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
 

fullscreen();
	
	var homePage = {
		init: function() {
			this.tabDashboard();
		},

		tabDashboard: function() {
			// Default selected 
			$(".navCircle:first").css("background","#ffffff");
			// Newly selected
			$(".navCircle").click(function() {
				$(this).siblings().animate({
					backgroundColor: "rgba(0,0,0,0)"
				}, 300);
				$(this).animate({
					backgroundColor: "#ffffff"
				}, 300);
				if ($(this).attr("data-dashboard") == "2") {
					$(".dashboardContainer").hide("slide", { direction: "left"}, 300);
				} else {
					$(".dashboardContainer").show("slide", { direction: "left"}, 300);
				}
			});
			// Need to figure out next slide 
		}
	};

	var backButton = {
		init:function() {
			this.lastPage();
		},

		lastPage:function(){
			$(".goBack").click(function(){
				window.history.back();
			});
		}
	};


	var sideBar = {
		init: function() {
			this.slideController();
			this.pageLocation();
		}, 

		slideOut: function() {
			$(".sideNav").css("top",$(window).scrollTop());
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
			$(".headerNavIcon").click(function() {
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
        if (location.pathname.indexOf("allInvoice_List.html") >= 0)
        {
            $("#itemInvoice").addClass("activeLink");
            $("#itemInovice").find(".iconCircle").addClass("activeBorder");
        }
        if (location.pathname.indexOf("invoice.html") >= 0)
        {
            $("#itemInvoice").addClass("activeLink");
            $("#itemInovice").find(".iconCircle").addClass("activeBorder");
        }

		}
	};

	var addRecip = {
		init: function() {
			this.slideOut();
			this.slideIn();
			
		},

		slideOut: function() {
			$(document).on("click","#addRecipient", function(){
				var insert = "<li class='addInput'><div id='addEm' class='headerSearchContainer addRecipColor'><input class='headerSearch'><img class='searchCloseExpanded addRecipX' src='img/close_search.png'></div></li>";
				var parent = $(this).parent();
				var label = '<li>Recipients</li>';
				$(parent).empty();
				$(label).appendTo("#recipHeader");
				$(insert).appendTo("#recipHeader");
				$(".headerSearchContainer").animate({
					width: "200px"
				}, 300);
			});
		},

		slideIn: function() {
			$(document).on("click",".searchCloseExpanded", function(){
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
			$(".topHeader li:last-child ").on("click", ".headerSearchIcon", function() {
				var parent = $(this).parent();
				var insert = "<div id='searchThis' class='headerSearchContainer'><img class='searchIconExpanded' src='img/search_icon.png'><input class='headerSearch'><img class='searchCloseExpanded' src='img/close_search.png'></div>"
				$(parent).empty();
				$(insert).appendTo( $( parent ) );
				$(".headerSearchContainer").animate({
					width: "235px"
				}, 300);
			});
		},

		slideIn: function() {
			var parent = ".topHeader li:last-child";
			var insert = "<img class='headerSearchIcon' src='img/search_icon.png'>"
			$(parent).on("click", ".searchCloseExpanded", function() {
				$(".headerSearchContainer").animate({
					width: "5px"
				}, 300, function() {
					$(parent).empty();
					$(insert).appendTo( $( parent ) );
				});
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
				counter += .25;
				$("#addTimeTicket").val(counter);
			});
			$(".buttonList li:nth-child(1), .buttonListSymbols").click(function() {
				counter -= .25;
				$("#addTimeTicker").val(counter);
			});
		}
	};

	var ticketDetails = {
		init: function() {
			this.tab();
			
			this.scrollResponse();
			this.latestPost();
		},

		latestPost: function() {
			$(".orginalMessageContainer .responseBlock").addClass("latestResponse");
		},

		tab: function() {
			$(".tabHeader").click(function() {
				$(".tabpage").fadeOut(300);
				switch( $(this).attr("data-id") ) {
					case "reply":
						$("#tabpage_reply").fadeIn(300);
						break;
					case "info":
						$("#tabpage_info").fadeIn(300);
						break;
					case "all":
						$("#tabpage_all").fadeIn(300);
						break;
					case "options":
						$("#tabpage_options").fadeIn(300);
						default:
						break;
				}
			});
		},

		addResponse: function() {
			$(".replyButton").click(function(e) {
				e.preventDefault();
				var userInput = $(".textInput").val();
				var prependVal = "<ul class='responseBlock'><li><img src='img/profile_3.png' class='responseImg'><span>Response</span></li><li class=' responseText'><h3>Max Kent</h3><p>" + userInput + "</p></li><li>Just now</li></ul>";
				$(prependVal).hide().prependTo("#tabpage_reply .orginalMessageContainer").slideDown(200);
				$(".textInput").val("");
				var responseBumbed = $(".latestResponse");
				$(".latestResponse").remove();
				$(responseBumbed).hide().prependTo("#tabpage_reply .tabpageContainer").slideDown(200);
				$(".latestResponse").removeClass("latestResponse");
				$(".orginalMessageContainer .responseBlock").addClass("latestResponse");
			});
		},

		scrollResponse: function() {
			$(window).scroll(function(e) {
				$("body").bind("touchmove", function(e) {
					if ($(window).scrollTop() >= 196.5) {
						$(".tabs").css({
							position: "fixed",
							top: "0",
							margin: "45px 0 0 0"
						});
					} else {
						$(".tabs").css({
							position: "relative",
							margin: "0"
						}, 300);
					}
				});
			});
		}
	};

	var invoice = {
		init: function() {
			this.removeRecipients();
		},

		removeRecipients: function() {
			$(document).on("click",".closeIcon",function(){
				$(this).parent().parent().parent().slideUp();
			});
		}
	};

	var footer = {
		init: function() {
			this.dropFooter();
		},

		dropFooter: function() {
			var previousScroll = 0;

    $(window).scroll(function(){
       var currentScroll = $(this).scrollTop();
       if (currentScroll > previousScroll){
           $("footer").fadeOut(100);
       } else {
          $("footer").fadeIn(100);
       }
       previousScroll = currentScroll;
    });
		}
	};

	var hideFooter = {
		init: function() {
			this.hide();
		},

		hide: function() {
			$(".hideFooter").hide();
		}
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
/*
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
*/
	var StickRecentTickets = {
		init: function() {
			this.stickTitle();
		},

		stickTitle: function() {
			$(window).scroll(function(){
				var top = $(this).scrollTop();
				
				if(top > 225) 
				{
					 $(".AccountDetailsTicketsContainer").addClass("recentTicketsStick");
				}
				else 
				{
					$(".AccountDetailsTicketsContainer").removeClass("recentTicketsStick");
				}
			});
		}
	};

	var openTickets = {
		init:function() {
			this.slideDown();
		},
		slideDown:function(){
		$("#openTicketslink").click(function(){
			$('html,body').animate({ scrollTop: $('#openTickets').offset().top }, '400');
		});
	}

	};

	var largeScreenStlye = {
		init:function() {
			this.changeStyle();
		},

		changeStyle:function() {

			if($(window).width() >=800) 
				{
					//add the large style sheet 
					var insert = '<link id="largeCss" rel="stylesheet" href="css/style_LargeScreen.css" />';
					$(insert).appendTo('head');
				}else {
					$(".addTimePanel").hide();
					$(".plusIconHeader").show();
				}
			$(window).resize(function(){
				if($(window).width() >=800) 
				{
					//add the large style sheet 
					var insert = '<link id="largeCss" rel="stylesheet" href="css/style_LargeScreen.css" />';
					$(insert).appendTo('head');
					$(".addTimePanel").show();

				}else{
					$("#largeCss").remove();
					$(".addTimePanel").hide();
				}
			});
		}
	};



	(function() {
		fastClicker.init();
		openTickets.init();
		largeScreenStlye.init();
		backButton.init();
		addRecip.init();
		showExtendedDetails.init();
		if($(window).width() < 478){footer.init();}
		homePage.init();
		if($(window).width() > 478){hideFooter.init();}
		sideBar.init();
		searchBar.init();
		ticker.init();
		ticketDetails.init();
		invoice.init();
		StickRecentTickets.init();
	}()); 

}); 
