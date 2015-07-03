/*jshint -W004, -W041, -W103, eqeqeq: false, noempty: false, undef: false, latedef: false, eqnull: true, multistr: true*/
/*global jQuery, $ */

String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/, function(match, number) { 
        return typeof args[number] !== 'undefined' ? args[number] : match;
    });
};

function BuildList(parent, arr, template, values, header)
{
    header = header || '';
    var textToInsert = [header],
        length = returnData.length,
        $table = $(parent);
    for (var i = 0; i<length; i += 1) {
        textToInsert.push(template.format());
        if(length > 10 && i == 10){
            $table.html(textToInsert.join(''));
        }
    }
    $table.html(textToInsert.join(''));
}

function float2int (value) {
    return value | 0;
}

var lenElipse = 0;
var widthElipse = 0;

function createElipse(text, containerWidth, fontSize){
    var len = text.length;
    if (lenElipse > 0 && widthElipse == containerWidth)
    {
        if(len > lenElipse){
            text = text.substring(0,lenElipse)+'...';
        } 
        return text;
    }
    var windowWidth = $(window).width();
    if(windowWidth > 650){
        windowWidth = 650;
    }
    var characterSpace;
    widthElipse = containerWidth;
    containerWidth = containerWidth * windowWidth;
    characterSpace = containerWidth / fontSize;
    characterSpace = float2int(characterSpace);
    lenElipse = characterSpace - 3;
    if(len > characterSpace - 2){
        text = text.substring(0,characterSpace)+'...';
    } 
    return text;
}


Object.toType = (function toType(global) {
    return function(obj) {
        if (obj === global) {
            return "global";
        }
        return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
    };
})(this);

if (typeof String.prototype.addUrlParam !== 'function') {
    String.prototype.addUrlParam = function(param, value) {
        if (!value || !param)
            return this;
        var pos = this.indexOf(param + '=');
        //if parameter exists
        if (pos != -1)
            return this.slice(0, pos + param.length) + '=' + value;
        var ch = this.indexOf('?') > 0 ? '&' : '?';
        return this + ch + param + '=' + value;
    };
}

if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

function HasProp(obj, prop) {
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            if (p === prop) {
                return obj;
            } else if (obj[p] instanceof Object && HasProp(obj[p], prop)) {
                return obj[p];
            }
        }
    }
    return null;
}

/*
function showElement(element) {
    element[0].style.display = "inline-block";
}

function hideElement(element) {
    element[0].style.display = "none";
}
*/

var splashScreen ={
    init:function(){
        this.Splash();
    },

    Splash:function(){
        if (location.pathname.indexOf("index.html") >= 0){
            $('.bodyContent').hide();
            setTimeout(function(){
                $('.bodyContent').show();
                $('.splashScreenSherpa').animate({
                    'opacity':0,
                },1000);
            },500);
            setTimeout(function(){
                $('.splashScreenLogo').animate({
                    'margin-top':'-404.5px'
                },1000);
            },500);
            setTimeout(function(){
                $('.splashScreen').fadeOut();
            },1500);
        }
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

var hideFooter = {
    init: function() {
        this.hide();
    },

    hide: function() {
        $(".hideFooter").hide();
    }
};

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

function fullscreen() {
    $('a').click(function() {
        if(!$(this).hasClass('noeffect')) {
            window.location = $(this).attr('href');
            return false;
        }
    });
}

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

/*
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
        */
/*
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
        */

//search
/*var found = false;
                    var matchedTickets = [];

                    // search for a account value that matches the search critera
                    $.ajax({
                        type: 'GET',
                        beforeSend: function (xhr) {
                            xhr.withCredentials = true;
                            xhr.setRequestHeader('Authorization',
                                                 'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
                        },

                        url:ApiSite +"accounts",
                        dataType:"json",
                        success: function(returnData) {
                            for(var i = 0; i < returnData.length; i++)
                            {
                                if(returnData[i].name.toLowerCase() == searchItem)
                                {
                                    found = true;
                                    localStorage.setItem("DetailedAccount", returnData[i].id);
                                }
                                if (found == true)
                                {
                                    window.location = "account_details.html";
                                }
                            }


                        },
                        complete:function(){
                            reveal();
                        },
                        error: function() {

                        }
                    });
                    // search for a ticket number that matches the search critera
                    $.ajax({
                        type: 'GET',
                        beforeSend: function (xhr) {
                            xhr.withCredentials = true;
                            xhr.setRequestHeader('Authorization',
                                                 'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
                        },

                        url:ApiSite +"tickets/?status=open"+searchItem,
                        dataType:"json",
                        success: function(returnData) {
                            localStorage.setItem("ticketNumber",searchItem);
                            window.location = "ticket_detail.html";


                        },
                        complete:function(){
                            reveal();
                        },
                        error: function() {

                        }
                    });

                    // search for tickets containing the search critera in the subject and return a list
                    $.ajax({
                        type: 'GET',
                        beforeSend: function (xhr) {
                            xhr.withCredentials = true;
                            xhr.setRequestHeader('Authorization',
                                                 'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
                        },

                        url:ApiSite +"tickets",
                        dataType:"json",
                        success: function(returnData) {
                            //console.log(returnData);
                            for(var i = 0; i < returnData.length; i++)
                            {
                                if(returnData[i].subject.toLowerCase().indexOf(searchItem) >= 0)
                                {
                                    matchedTickets.push(returnData[i]);
                                    found = true;

                                }
                            }
                            if(found == false){
                                $(".searchReturn").show();
                                $("body").addClass("bodyLock");
                                var insert = "<li class='' data-id=null><span class='returnedItem'>Nothing matches that Search</span></li>";
                                $(insert).appendTo(".searchReturn");
                            }
                            // add list of tickets that match the search critera
                            for(var a = 0; a < matchedTickets.length; a++)
                            {
                                $(".searchReturn").show();
                                $("body").addClass("bodyLock");
                                var insert = "<li class='searched' data-id="+matchedTickets[a].key+"><span class='returnedItem'> #"+matchedTickets[a].number+" "+matchedTickets[a].subject +"</span></li>";
                                $(insert).appendTo(".searchReturn");
                            }
                        },
                        complete:function(){
                            reveal();
                        },
                        error: function() {

                        }
                    });
                    // close the search when the "X" icon is pressed
                    $(document).on("click",".searchCloseExpanded", function(){
                        $("body").removeClass("bodyLock");
                        $(".searchReturn").hide();
                        $(".searchReturn").empty();
                    });
                    // close the search when something outside of the search is pressed
                    $(document).on("click",".bodyLock", function(){
                        $("body").removeClass("bodyLock");
                        $(".searchReturn").hide();
                        $(".searchReturn").empty();
                    });
                    // go to the ticket detail of the pressed returned search return
                    $(document).on("click",".searched", function(){
                        $("body").removeClass("bodyLock");
                        localStorage.setItem('ticketNumber', $(this).attr("data-id"));
                        window.location = "ticket_detail.html";
                    });
                    */

/*
	//methods & Api calls that deal with changing time adding adjustments, expenses
	var updateInvoice ={
		init:function(){
			this.changeInvoice();
		},

		changeInvoice:function(){
			//update timelog after being clicked
			$(document).on("click","#invoiceTimelog, #billem",function(){
				var timeId = $(this).attr("data-id");
				var billable = false;
				$(this).find(".innerCircle").toggleClass("billFill");
				//change billable to oposite of its current state
				if($(this).find(".innerCircle").hasClass("billFill"))
				{
					billable = false;
				}
				$.ajax({
    				type: 'PUT',
    				beforeSend: function (xhr) {
    				    xhr.withCredentials = true;
    				    xhr.setRequestHeader('Authorization',
    				                         'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
    				    },
    				url: ApiSite + 'time/'+timeId,
    				data: {
    				    	"is_billable" : billable,
							"is_project_log": true
						   },
    				dataType: 'json',
    				success: function (d) {
    				    console.log("time log has been updated "+billable);

    				},
    				error: function (e, textStatus, errorThrown) {
    				         console.log(textStatus);
    				}
 				});

			});
			//update expense after beign clicked
			$(document).on("click","#invoiceExpense",function(){
				var timeId = $(this).find(".timeLogAddButton").attr("data-id");
				alert(timeId);
				$(this).find(".innerCircle").toggleClass("billFill");

				$.ajax({
    				type: 'DELETE',
    				beforeSend: function (xhr) {
    				    xhr.withCredentials = true;
    				    xhr.setRequestHeader('Authorization',
    				                         'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
    				    },
    				url: ApiSite + 'expenses'+timeId,
    				data: {

						   },
    				dataType: 'json',
    				success: function (d) {
    				    console.log("Deleted Expense");

    				},
    				error: function (e, textStatus, errorThrown) {
    				         console.log(textStatus);
    				}
 				});
			});

			//add an expense
			$("#addexpenseButton").click(function(){

				$.ajax({
    				type: 'POST',
    				beforeSend: function (xhr) {
    				    xhr.withCredentials = true;
    				    xhr.setRequestHeader('Authorization',
    				                         'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
    				    },
    				url: ApiSite + 'expenses',
    				data: {
    				    	"account_id": localStorage.getItem("invoiceAccountId"),
    						"project_id": localStorage.getItem("invoiceProjectId"),
    						"tech_id": localStorage.getItem("user_id"),
    						"note": $("#expensesNote").val(),
    						"note_internal": $("#expensesInternal").val(),
    						"amount": $("#expenseAmount").val(),
    						"is_billable": true,
    						"vendor": "vendor name",
    						"markup": 10
						   },
    				dataType: 'json',
    				success: function (d) {
    				    console.log("time log has been added");

    				},
    				error: function (e, textStatus, errorThrown) {
    				         console.log(textStatus);
    				}
 				});
			});

			//add travel log
			$("#addTravelLog").click(function(){

			});

			//addTime to an invoice
			$("#submitInvoiceTime").click(function(){
				var techId = localStorage.getItem("userId");
				var projectId = localStorage.getItem("invoiceProjectId");
				var accountId = localStorage.getItem("invoiceAccountId");
				var note = $("#noteTimeTicket").val();
				var hours = $("#addTimeTicket").val();
				//console.log(techId);
				//console.log(projectId);
				//console.log(accountId);
				//console.log(note);
				//console.log(hours);
				$.ajax({
    				type: 'POST',
    				beforeSend: function (xhr) {
    				    xhr.withCredentials = true;
    				    xhr.setRequestHeader('Authorization',
    				                         'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
    				    },
    				url: ApiSite + 'time',
    				data: {
    				    	"tech_id" : techId,
    						"project_id": projectId,
    						"account_id" :accountId,
    						"note_text": note,
    						"task_type_id": 1,
    						"hours":hours,
    						"is_billable": true,
    						"date": new Date().toJSON(),
    						"start_date": new Date().toJSON(),
    						"stop_date": new Date().toJSON()
						   },
    				dataType: 'json',
    				success: function (d) {
    				    console.log("time log has been added");

    				},
    				error: function (e, textStatus, errorThrown) {
    				         console.log(textStatus);
    				}
 				});

			});

			//add and adjustment to an invoice
			$("#addAdjustment").click(function(){
				var amount = $("#adjustVal").val();
				var note= $("#adjustNote").val();
				var projectId = localStorage.getItem("invoiceProjectId");
				var accountId = localStorage.getItem("invoiceAccountId");
				$.ajax({
    				type: 'POST',
    				beforeSend: function (xhr) {
    				    xhr.withCredentials = true;
    				    xhr.setRequestHeader('Authorization',
    				                         'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
    				    },
    				url: ApiSite + 'invoices?status=unbilled&project=-1&account=-1&adjustments=-2.4&adjustments_note=my_note',
    				data: {

						   },
    				dataType: 'json',
    				success: function (d) {
    				    location.reload(false);

    				},
    				error: function (e, textStatus, errorThrown) {
    				         console.log(textStatus);
    				}
 				});
			});

		}
	};
	*/


