$(document).ready(function(){



var setBanner = {
  init:function(){
    this.bannerSize();
  },

  bannerSize:function() {
    var viewportHeight = $(window).height();
    if(viewportHeight < 700){
			viewportHeight = 700;
		}
    var stick = viewportHeight -65;
    $("header").css("height",viewportHeight -20);
    $(".navList").css("top",stick);
  }
};


var downArrow = {
	init:function() {
		this.down();
		this.getStarted();
	},

	getStarted:function() {
		var viewportHeight = $(window).height();
		if(viewportHeight < 700){
			viewportHeight = 780;
		} 
	 	var viewportWidth = $(window).width();
	 	$("#headerGetStarted").css("top",viewportHeight - 250);
	 	$("#headerGetStarted").css("left",(viewportWidth / 2) - 90 );
	},


	down:function() {
	 var viewportHeight = $(window).height();
	 if(viewportHeight < 700){
			viewportHeight = 700;
		}
	 var viewportWidth = $(window).width();

	 $(".arrowDown").css("top",viewportHeight - 85);
	 $(".arrowDown").css("left",(viewportWidth)-75 );
	 $(window).scroll(function() {
   		if($(window).scrollTop() > 1) {
       		$(".arrowDown").fadeOut(100);
   		}
	 });
	 $(window).resize(function() {
	    viewportHeight = $(window).height();
	 	viewportWidth = $(window).width();
	 	$(".arrowDown").css("top",viewportHeight - 85);
	 	$(".arrowDown").css("left",(viewportWidth)-25 );
	 });
	}
};


var sideMenu = {
	init:function() {
		this.menu();
	},

	menu:function() {
		var out = false;
		$("#navIcon").click(function(){
			$('#panel').addClass("bodySlide");
			$(".sideMenuContainer").show();
			$(".headerNav").addClass("adjustHeight");
			setTimeout(
  				function() 
  				{
  				  out = true;
  				}, 500);
		});
		$("#panel, #navIcon").click(function(){
			if(out == true) {
			out = false;
			$('#panel').removeClass("bodySlide");
		
		}
		});
	}
};

var header = {
	init:function() {
		this.hideHead();
		this.showNumber();
		this.fadeTitle();
		this.headerColor();
	},

	headerColor:function() {
		var height = $(window).height();
		$(window).scroll(function() {
   			if($(window).scrollTop() > height -70 ){
				$(".headerNav").css("background-color","#fff");
				$("header p").css("color","#4c5156");
				$("header i").css("color","#4c5156");
   			}else{
   				$(".headerNav").css("background-color","transparent");
   				$("header p").css("color","#fff");
   				$("header i").css("color","#fff");
   			}
	 	});
	},

	fadeTitle:function(){
		$(window).scroll(function(){
			var top = $(window).scrollTop();
			var threshold = false;
			

			/*if( top > 5 )
				{	
					$("#word1").fadeOut("slow");
					setTimeout(
  					function() 
  					{
  				  		$("#word1").css("color","transparent");
  					}, 400);
					$("#word1").fadeIn("fast");
				
				}*/
			if( top > 15)
				{	
					$(".small").fadeOut("slow");
					setTimeout(
  					function() 
  					{
  				  		$(".small").css("color","transparent");
  					}, 400);
					$(".small").fadeIn("fast");
				}
			if( top > 40)
				{	
					$(".big").fadeOut("slow");
					setTimeout(
  					function() 
  					{
  				  		$(".big").css("color","transparent");
  					}, 400);
					$(".big").fadeIn("fast");
				}
			if( top > 80)
				{	
					$("#damn").fadeOut("slow");
					setTimeout(
  					function() 
  					{
  				  		$("#damn").css("color","transparent");
  					}, 400);
					$("#damn").fadeIn("fast");
				}
			if( top > 110 )
				{
					$("#name, #largeQoute").animate({
						"font-size":"0px",
					}, 500);
					threshold = true;
					$("#damn").remove();
					$(".big").remove();
					$(".small").remove();
					$("#word1").remove();
				}		
		});
	},

	showNumber:function() {
		$("#phoneIcon").mouseenter(function(){
			$(".phone").fadeIn("fast");
		});
		$("#phoneIcon").mouseleave(function(){
			$(".phone").fadeOut("fast");
		});
	},

	hideHead:function() {
		$(window).load(function () {
    		$("#headerGetStarted").fadeIn();
		});
		var height = $(window).height();
		$(window).scroll(function() {
   			if($(window).scrollTop() > height -180 ){
				$("#logo").fadeOut(100);
				$(".headerNav").css("box-shadow","0px 5px 5px rgba(136, 136, 136, 0.26)");
   			}else{
   				$("#logo").fadeIn(700);

   			}
	 	});
	 	$(window).scroll(function() {
   			if($(window).scrollTop() > height -40 ){
				$("#headerButton").fadeIn(500);
   			}else{
   				$("#headerButton").fadeOut(100);
   				$(".headerNav").css("box-shadow","0px 5px 5px rgba(136, 136, 136, 0)");
   			}
	 	});
	}
};

var expandPhones = {
	init:function() {
		this.unFold();
	},

	unFold:function() {
		$(window).scroll(function(){
			if($(window).scrollTop() > 3300)
			{
				$("#phones").animate({
					"width":"49.33%"
				},1000);
				setTimeout(
  				function() 
  				{
  				  $("#phones").finish();
  				}, 2000);
			}
		});
	}
};

var pricing = {
	init:function() {
		this.overLay();
	},

	overLay:function() {
		$('.custom').hover(
       		function(){ $("#overLayCustom").slideDown()},
       		function(){ $("#overLayCustom").slideUp()}
		)
		$('#free').hover(
       		function(){ $("#overLayFree").slideDown()},
       		function(){ $("#overLayFree").slideUp()}
		)
	}
};

var hovers = {
	init:function() {
		this.video();
		this.screenShot();
		this.button();
		this.social();
		this.footer();
	},

	video:function() {
		$('#video').hover(
       		function(){ $(".playVideoButton").addClass('videoDark') },
       		function(){ $(".playVideoButton").removeClass('videoDark') }
		)
	},

	screenShot:function() {
		$('.screenShot img').hover(
       		function(){  $(this).addClass('screenShotPop') },
       		function(){ $(this).removeClass('screenShotPop') }
		)
	},

	social:function() {
		$('.socialLink').hover(
       		function(){  $(this).addClass('socailPop') },
       		function(){ $(this).removeClass('socailPop') }
		)
	},
	button:function() {
		$('.subscribe, #lastGetStarted, .getStartedButton').hover(
       		function(){  $(this).addClass('buttonPop') },
       		function(){ $(this).removeClass('buttonPop') }
		)
	},
	footer:function() {
		$('.link').hover(
       		function(){  $(this).addClass('linkPop') },
       		function(){ $(this).removeClass('linkPop') }
		)
	}
};

var logoBar = {
	init:function() {
		this.tightenUp();
	},

	tightenUp:function() {
		var viewportHeight = $(window).height();
		var shrunk = false;
		$(window).scroll(function(){
			if($(window).scrollTop() > viewportHeight - 110 && shrunk == false){
			$(".logos").animate({
				"height":"0px",
			}, 500);
			$(".client").fadeOut();
			shrunk = true;
			}
			else if($(window).scrollTop() < viewportHeight - 142 && shrunk == true)
			{
				$(".logos").animate({
				"height":"100px",
			}, 500);
				$(".client").fadeIn();
				shrunk = false;
			}
		});
	}
};

(function() {
	pricing.init();
	logoBar.init();
	hovers.init();
	expandPhones.init();
	setBanner.init();
	sideMenu.init();
	downArrow.init();
	header.init();
  }()); 
});