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
		slide: false,

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

	(function() {
		homePage.init();
		sideBar.init();
	}()); 

}); 
