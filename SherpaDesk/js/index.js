$(document).ready(function() {
	
function fullscreen() {
    $('a').click(function() {
        if(!$(this).hasClass('noeffect')) {
            window.location = $(this).attr('href');
            return false;
        }
    });
}
 
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

	var sideBar = {
		init: function() {
			this.slideController();
		}, 

		slideOut: function() {
			$(".bodyContent, header").addClass("contentOut");
			$(".sideNav").addClass("sideNavOut");
			$("body").toggleClass("bodyLock");
			$("a").toggleClass("disabled");
			slide = true;
		},

		slideIn: function() {
			// e.preventDefault();
			$(".bodyContent, header").removeClass("contentOut");
			$(".sideNav").removeClass("sideNavOut");
			$("body").toggleClass("bodyLock");
			$("a").toggleClass("disabled");
			slide = false;
		}, 

		slideController: function() {
			$(".headerNavIcon").click(function() {
				sideBar.slideOut();
			});
			$(".bodyContentCover").click(function() {
				sideBar.slideIn();
			});
		}
	};

	var searchBar = {
		init: function() {
			this.slideOut();
			this.slideIn();
		},

		slideOut: function() {
			$(".topHeader li:last-child").on("click", ".headerSearchIcon", function() {
				var parent = $(this).parent();
				var insert = "<div class='headerSearchContainer'><img class='searchIconExpanded' src='img/search_icon.png'><input class='headerSearch'><img class='searchCloseExpanded' src='img/close_search.png'></div>"
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
			var spanSelector = $(".buttonList li:nth-child(2) span");

			spanSelector.html(counter);
			$(".buttonList li:nth-child(3)").click(function() {
				counter += .25;
				spanSelector.html(counter);
			});
			$(".buttonList li:nth-child(1)").click(function() {
				counter -= .25;
				spanSelector.html(counter);
			});
		}
	};

	var ticketDetails = {
		init: function() {
			this.tab();
			this.addResponse();
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
						break
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
			$(".closeIcon").click(function() {
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

	var billEm = {
		init: function() {
			this.checkBillButton();
		}, 

		checkBillButton: function() {
			$(".billable").click(function(){
				$(".innerCircle").toggleClass("billFill");
			});
		}

	};

	var ticketActions = {
		init: function() {
			this.rightActions();
		},

		rightActions: function() {
			$("#thisBlock" || ".responseText" || ".responseImg").on("swiperight",function(){
				$(".rightOptions").toggle().slideDown(300);
			});
			$(".rightOptions").on("swipeleft",function(){
				$(".rightOptions").toggle().slideUp(300);
			});
		}
	};

	(function() {
		ticketActions.init();
		billEm.init();
		showExtendedDetails.init();
		if($(window).width() < 478){footer.init();}
		homePage.init();
		if($(window).width() > 478){hideFooter.init();}
		sideBar.init();
		searchBar.init();
		ticker.init();
		ticketDetails.init();
		invoice.init();
	}()); 

}); 
