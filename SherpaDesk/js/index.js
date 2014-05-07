$(document).ready(function() {

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
			slide = true;
		},

		slideIn: function(e) {
			e.preventDefault();
			$(".bodyContent, header").removeClass("contentOut");
			$(".sideNav").removeClass("sideNavOut");
			slide = false;
		}, 

		slideController: function() {
			$(".headerNavIcon").click(function() {
				sideBar.slideOut();
			});
			$(".bodyContent").click(function(e) {
				sideBar.slideIn(e);
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

	(function() {
		homePage.init();
		sideBar.init();
		searchBar.init();
		ticker.init();
	}()); 

}); 
