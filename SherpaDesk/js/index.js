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
			this.slideOut();
		}, 

		slideOut: function() {
			$(".SherpaDesk").click(function() {
				$(".bodyContent").addClass("bodyContentOut");
				$(".sideNav").addClass("sideNavOut");
				// $(".sideNav").show("slide", { direction : "left"}, 200);
				// $(".bodyContent").hide("slide", {direction : "right"}, 300);
				// $(".bodyContent, header").animate({'left': '40%'}, 200);
			});
		}
	};

	(function() {
		homePage.init();
		sideBar.init();
	}()); 

}); 
