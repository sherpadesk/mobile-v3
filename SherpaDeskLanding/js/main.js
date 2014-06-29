$(document).ready(function(){

function fullscreen() {
    $('a').click(function() {
        if(!$(this).hasClass('noeffect')) {
            window.location = $(this).attr('href');
            return false;
        }
    });
}
 
fullscreen();

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
		this.playVideo();
		this.getStarted();
	},

	getStarted:function() {
		var viewportHeight = $(window).height();
		if(viewportHeight < 700){
			viewportHeight = 780;
		} 
	 	var viewportWidth = $(window).width();
	 	$("#headerGetStarted").css("top",viewportHeight - 150);
	 	$("#headerGetStarted").css("left",(viewportWidth / 2) - 90 );
	},

	playVideo:function() {
		var viewportHeight = $(window).height();
		if(viewportHeight < 700){
			viewportHeight = 700;
		}
	 	var viewportWidth = $(window).width();
	 	$(".playVideoButton").css("top",viewportHeight + 350);
	 	
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
   		}else{
   			$(".arrowDown").fadeIn(100);
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
	},

	fadeTitle:function(){
		$(window).scroll(function(){
			var top = $(window).scrollTop();
			var threshold = false;
			console.log(top);

			if( top > 25 )
				{	
					$("#word1").fadeOut("slow");
					setTimeout(
  					function() 
  					{
  				  		$("#word1").css("color","transparent");
  					}, 400);
					$("#word1").fadeIn("fast");
				
				}
			if( top > 75)
				{	
					$(".small").fadeOut("slow");
					setTimeout(
  					function() 
  					{
  				  		$(".small").css("color","transparent");
  					}, 400);
					$(".small").fadeIn("fast");
				}
			if( top > 125)
				{	
					$(".big").fadeOut("slow");
					setTimeout(
  					function() 
  					{
  				  		$(".big").css("color","transparent");
  					}, 400);
					$(".big").fadeIn("fast");
				}
			if( top > 175)
				{	
					$("#damn").fadeOut("slow");
					setTimeout(
  					function() 
  					{
  				  		$("#damn").css("color","transparent");
  					}, 400);
					$("#damn").fadeIn("fast");
				}
			if( top > 175 )
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
		var height = $(window).height();
		$(window).scroll(function() {
   			if($(window).scrollTop() > height -260 ){
				$("#logo").fadeOut(100);
   			}else{
   				$("#logo").fadeIn(100);
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
			console.log($(window).scrollTop());
			if($(window).scrollTop() > 3500)
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


(function() {
	expandPhones.init();
	setBanner.init();
	sideMenu.init();
	downArrow.init();
	header.init();
  }()); 
});