$(document).ready(function(){
	
	var userOrgKey = "";
	var userOrg = "";
	var userInstanceKey = "";
	var	userKey = "";
	var accountDetailed = "";


	var UserLogin = {
		init:function(){
			this.login();
		},
		login:function() {
			$("#loginButton").click(function(){
				var userName = $("#userName").val();
				var password = $("#password").val();
				$.ajax({
			type: 'POST',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization',
          'Basic ' + btoa(userName + ':' + password ));
			},
				url:"http://api.beta.sherpadesk.com/login",
				dataType:"json",
				success: function(returnData) {
						console.log(returnData);
						localStorage.setItem("userKey", returnData.api_token)
						localStorage.setItem('userName', userName);
						window.location = "org.html";
					},
					complete:function(){
				},
				error: function() {
					console.log("fail @ Login");
					alert("error", "There was a problem with your login.  Please try again.");
					}
			});
			});
		}
	};

	var detailedTicket = {
		init:function(){
			this.showTicket();
		},

		showTicket:function(){
			$(document).on("click",".responseBlock", function(){
				localStorage.setItem('ticketNumber', $(this).attr("data-id"));
				window.location = "ticket_detail.html";
			});

			$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.beta.sherpadesk.com/tickets/"+localStorage.getItem('ticketNumber'),
				dataType:"json",
				success: function(returnData) {
						console.log(returnData);
						var daysOld = returnData.daysold_in_minutes / -60;
						if(daysOld > 24){
							daysOld = daysOld/24;
							daysOld = parseInt(daysOld);
							daysOld = daysOld +" days ago";
						} else {
							daysOld = parseInt(daysOld) +" hours ago";
						}

						 $("#ticketNumber").html("OPEN | "+returnData.number);
						 $("#ticketSubject").html(returnData.subject);
						 $("#ticketClass").html(returnData.class_name);
						 $("#ticketTech").html(returnData.tech_firstname);
						 $("#lastUpdate").html(daysOld);
						 $("#ticketHours").html(returnData.total_hours+" Hours");
						 $("#ticketSLA").html("SLA: "+returnData.sla_complete_date.toString().substring(0,10));

						 $("#classOptions").empty();
						 for(var a = 0; a < returnData.classes.length; a++)
						 {
						 	var className = returnData.classes[a].name;
						 	var classId = returnData.classes[a].id;
						 	var insert = "<option value="+classId+">"+className+"</option>";
						 	$(insert).appendTo("#classOptions");
						 }
						 $("#ticketLevel").empty();
						 var levelInsert = "<option value="+returnData.level+">Level "+returnData.level+" "+returnData.level_name+"</option>";
						 $(levelInsert).appendTo("#ticketLevel");
						 $("#ticketPriority").empty();
						 var priorityInsert = "<option value="+returnData.priority_id+">Priority "+returnData.priority+"</option>";
						 $(priorityInsert).appendTo("#ticketPriority");
						 $("#ticketTechs").empty();
						 for(var b = 0; b < returnData.technicians.length; b++)
						 {
						 	var techName = returnData.technicians[b].user_fullname;
						 	var techId = returnData.technicians[b].user_id;
						 	var insert = "<option value="+techId+">"+techName+"</option>";
						 	$(insert).appendTo("#ticketTechs");
						 }
						 $("#ticketLocation").empty();
						 var locationInsert = "<option value="+returnData.location_id+">"+returnData.location_name+"</option>";
						 $(locationInsert).appendTo("#ticketLocation");
						 $("#ticketProject").empty();
						 var projectInsert = "<option value="+returnData.project_id+">"+returnData.project_name+"</option>";
						 $(projectInsert).appendTo("#ticketProject");


					},
					complete:function(){
					function reveal(){
					$(".loadScreen").hide();
					$(".maxSize").fadeIn();
					};
				},
				error: function() {
					console.log("fail @ Ticket Detail");
					console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
					}
			});

		}
	}

	var detailedInvoice = {
		init:function(){
			this.specifics();
		},

		specifics:function(){
			$(document).on("click",".invoiceRows", function(){
				localStorage.setItem('invoiceNumber',$(this).attr("data-id"));
				window.location = "invoice.html";
			});

			$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.beta.sherpadesk.com/invoices/"+localStorage.getItem("invoiceNumber"),
				dataType:"json",
				success: function(returnData) {
						console.log(returnData);
						$("#invoiceNumber").html("Invoice  #"+returnData.id);
						$("#customerName").html(returnData.customer);
						$("#invoiceDate").html(returnData.date.substring(0,10));
						$("#invoiceHours").html(returnData.total_hours+"<span class='detail3Small'>hrs</span>");
						var amount = 0;
						var change = "00";
						var length = returnData.amount.toString().length;
						if(returnData.amount.toString().indexOf(".") >= 0)
							{
								amount = returnData.amount.toString().substring(0, length -3);
								change = returnData.amount.toString().substring(length-2, length);
							}
							else
							{
								amount = returnData.amount;
							}
						$("#invoiceAmount").html("$"+amount +"<span class='detail3Small'>."+change+"</span>");
						$("#invoiceTravel").html("$"+returnData.travel_cost+"<span class='detail3Small'>.00</span>");
						var expences = 0;
						if(returnData.expences.length > 0)
						{
							for(var i = 0; i < returnData.expences.length; i++)
							{
								expences = expences + returnData.expences[i].total;
							}
						}
						$("#invoiceExpenses").html("$"+expences+"<span class='detail3Small'>.00</span>");
						$("#invoiceAdjustments").html("$0<span class='detail3Small'>.00</span>");
						$(".invoiceTotal").html("$"+returnData.total_cost+"<span class='detail3Small'>.00</span>");
						$("#recipientList").empty();
						for(var x = 0; x < returnData.recipients.length; x++)
						{
							var email = $.md5(returnData.recipients[x].email);
							var insert = "<li><ul class='recipientDetail'><li><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=30'></li><li><div class='recipient'><p>"+returnData.recipients[x].email+"</p><img class='closeIcon' src='img/close_icon.png'></div></li></ul></li>";
							$(insert).appendTo("#recipientList");
						}
						$("#invoiceLogs").empty();
						for(var u = 0; u < returnData.time_logs.length; u++)
						{
							var name = returnData.time_logs[u].name;
							var log = returnData.time_logs[u].total;
							var date = returnData.time_logs[u].date.substring(0,10);
							var logID = returnData.time_logs[u].date.id;
							var insert = "<li><ul class='timelog'><li><div class='billable timeLogAddButton' data-id='"+logID+"'><div class='innerCircle billFill'></div></div></li><li><h2 class='feedName'>"+name+"</h2><p class='taskDescription'>"+date+"</p></li><li><img class='feedClock' src='img/clock_icon_small.png'><h3 class='feedTime'><span>"+log+"</span> hrs</h3></li></ul></li>";
							$(insert).appendTo("#invoiceLogs");
						}
						$("#expencesList").empty();
						for(var c = 0; c < returnData.expences.length; c++)
						{
							var name = returnData.expences[c].name;
							var log = returnData.expences[c].total;
							var date = returnData.expences[c].date.substring(0,10);
							var logID = returnData.expences[c].date.id;
							var insert = "<li><ul class='timelog'><li><div class='billable timeLogAddButton' data-id='"+logID+"'><div class='innerCircle billFill'></div></div></li><li><h2 class='feedName'>"+name+"</h2><p class='taskDescription'>"+date+"</p></li><li><h3 class='feedTime expenceCost'><span>$"+log+"</span></h3></li></ul></li>";
							$(insert).appendTo("#expencesList");
						}

					},
					complete:function(){
					function reveal(){
					$(".loadScreen").hide();
					$(".maxSize").fadeIn();
					};
				},
				error: function() {
					console.log("fail @ Invoice details");
					console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
					}
			});

		}
	};

	var invoiceList = {
		init:function(){
			this.listInvoices();
		},

		listInvoices:function(){
			$("#invoiceOption").click(function(){
				window.location = "Invoice_List.html";
			});
			$("#allInvoice, #invoiceFooter").click(function(){
				window.location = "allInvoice_List.html";
			});
			$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.beta.sherpadesk.com/invoices?account="+localStorage.getItem("DetailedAccount"),
				dataType:"json",
				success: function(returnData) {
						console.log(returnData);
						for(var i = 0; i < returnData.length; i++)
						{	var customer = returnData[i].customer;
							var date = returnData[i].date.substring(0,10);
							if(customer.length > 10)
							{
								customer = customer.substring(0,7)+"...";
							}
							var insert = "<ul data-id="+returnData[i].id+" class='invoiceRows'><li>"+customer+"</li><li>"+date+"</li><li>$"+returnData[i].total_cost+"</li></ul>";
							$(insert).appendTo("#invoiceList");
						}
					},
					complete:function(){
					function reveal(){
					$(".loadScreen").hide();
					$(".maxSize").fadeIn();
					};
				},
				error: function() {
					console.log("fail @ Invoice List");
					console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
					}
			});
			$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.beta.sherpadesk.com/invoices",
				dataType:"json",
				success: function(returnData) {
						console.log(returnData);
						for(var i = 0; i < returnData.length; i++)
						{	var customer = returnData[i].customer;
							var date = returnData[i].date.substring(0,10);
							if(customer.length > 10)
							{
								customer = customer.substring(0,7)+"...";
							}
							var insert = "<ul data-id="+returnData[i].id+" class='invoiceRows'><li>"+customer+"</li><li>"+date+"</li><li>$"+returnData[i].total_cost+"</li></ul>";
							$(insert).appendTo("#allInvoiceList");
						}
					},
					complete:function(){
					function reveal(){
					$(".loadScreen").hide();
					$(".maxSize").fadeIn();
					};
				},
				error: function() {
					console.log("fail @ Invoice List");
					console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
					}
			});
		}
	};

	var getQueues = {
		init:function() {
			this.queues();
		},

		queues:function() {
			$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.beta.sherpadesk.com/queues",
				dataType:"json",
				success: function(returnData) {
						console.log(returnData);
						 $(".OptionsList").empty();
						 for(var i = 0; i < returnData.length; i++)
						 {
						 	var insert = "<li><div class='OptionWrapper'><h3 class='OptionTitle'>"+returnData[i].fullname+"</h3></div><div class='NoticationWrapper'><h2>"+returnData[i].tickets_count+"</h2></div></li>";
						 	$(insert).appendTo(".OptionsList");
						 }

					},
					complete:function(){
					function reveal(){
					$(".loadScreen").hide();
					$(".maxSize").fadeIn();
					};
				},
				error: function() {
					console.log("fail @ Queues List");
					console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
					}
			});
		}
	};

	var ticketList = {
		init:function() {
			this.userTickets();
			this.techTickets();
			this.altTickets();
			this.allTickets();
			
		},

		techTickets:function() {
			$("#techContainer, #optionsConainer, #allContainer, #userContainer").empty();
			$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.beta.sherpadesk.com/tickets?status=open&limit=500&role=tech",
				dataType:"json",
				success: function(returnData) {
						console.log(returnData);
						
						for(var i = 0; i < returnData.length; i++) 
						 {	
							var email = $.md5(returnData[i].user_email);
							var intialPost = returnData[i].initial_post;
							var subject = returnData[i].subject;
							if(subject.length > 19)
							{
								subject = subject.substring(0,16)+"...";
							}
							if(intialPost.length > 100) 
							{
								intialPost = intialPost.substring(1,100);
							}
							var ticket = "<ul class='responseBlock' id='thisBlock'><li><p class='blockNumber numberStyle'>#"+returnData[i].number+"</p><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=30' class='TicketBlockFace'><span>"+returnData[i].user_firstname+"</span></li><li class='responseText'><h4>"+subject+"</h4><p class ='initailPost'>"+intialPost+"</p></li><li><p class='TicketBlockNumber'>"+returnData[i].class_name+"</p></li></ul>";
							
							$(ticket).appendTo("#techContainer");
						 }
					},
					complete:function(){
					function reveal(){
					$(".loadScreen").hide();
					$(".maxSize").fadeIn();
					};
				},
				error: function() {
					console.log("fail @ ticket List");
					console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
					}
			});
		},

		allTickets:function() {
			$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.beta.sherpadesk.com/tickets?status=allopen&limit=500&query=all",
				dataType:"json",
				success: function(returnData) {
						console.log(returnData);
						
						for(var i = 0; i < returnData.length; i++) 
						 {	
							var email = $.md5(returnData[i].user_email);
							var intialPost = returnData[i].initial_post;
							var subject = returnData[i].subject;
							if(subject.length > 19)
							{
								subject = subject.substring(0,16)+"...";
							}
							if(intialPost.length > 100) 
							{
								intialPost = intialPost.substring(1,100);
							}
							var ticket = "<ul class='responseBlock' id='thisBlock'><li><p class='blockNumber numberStyle'>#"+returnData[i].number+"</p><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=30' class='TicketBlockFace'><span>"+returnData[i].user_firstname+"</span></li><li class='responseText'><h4>"+subject+"</h4><p class ='initailPost'>"+intialPost+"</p></li><li><p class='TicketBlockNumber'>"+returnData[i].class_name+"</p></li></ul>";
							$(ticket).appendTo("#allContainer");
						 }
					},
					complete:function(){
					function reveal(){
					$(".loadScreen").hide();
					$(".maxSize").fadeIn();
					};
				},
				error: function() {
					console.log("fail @ ticket List");
					console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
					}
			});
		},


		altTickets:function() {
			$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.beta.sherpadesk.com/tickets?status=open&limit=500&role=alt_tech",
				dataType:"json",
				success: function(returnData) {
						console.log(returnData);
						
						for(var i = 0; i < returnData.length; i++) 
						 {	
							var email = $.md5(returnData[i].user_email);
							var intialPost = returnData[i].initial_post;
							var subject = returnData[i].subject;
							if(subject.length > 19)
							{
								subject = subject.substring(0,16)+"...";
							}
							if(intialPost.length > 100) 
							{
								intialPost = intialPost.substring(1,100);
							}
							var ticket = "<ul class='responseBlock' id='thisBlock'><li><p class='blockNumber numberStyle'>#"+returnData[i].number+"</p><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=30' class='TicketBlockFace'><span>"+returnData[i].user_firstname+"</span></li><li class='responseText'><h4>"+subject+"</h4><p class ='initailPost'>"+intialPost+"</p></li><li><p class='TicketBlockNumber'>"+returnData[i].class_name+"</p></li></ul>";
							
							$(ticket).appendTo("#altContainer");
						 }
					},
					complete:function(){
					function reveal(){
					$(".loadScreen").hide();
					$(".maxSize").fadeIn();
					};
				},
				error: function() {
					console.log("fail @ ticket List");
					console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
					}
			});
		},

		userTickets:function() {
			$("maxSize").hide();
			$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.beta.sherpadesk.com/tickets?status=open,onhold&limit=500&role=user",
				dataType:"json",
				success: function(returnData) {
						console.log(returnData);
						for(var i = 0; i < returnData.length; i++) 
						 {	
							var email = $.md5(returnData[i].user_email);
							var intialPost = returnData[i].initial_post;
							var subject = returnData[i].subject;
							if(subject.length > 14)
							{
								subject = subject.substring(0,11)+"...";
							}
							if(intialPost.length > 100) 
							{
								intialPost = intialPost.substring(1,100);
							}
							var ticket = "<ul class='responseBlock' id='thisBlock'><li><p class='blockNumber numberStyle'>#"+returnData[i].number+"</p><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=30' class='TicketBlockFace'><span>"+returnData[i].user_firstname+"</span></li><li class='responseText'><h4>"+subject+"</h4><p class ='initailPost'>"+intialPost+"</p></li><li><p class='TicketBlockNumber'>"+returnData[i].class_name+"</p></li></ul>";
							
							$(ticket).appendTo("#userContainer");
						 }
					},
					complete:function(){
					function reveal(){
					$(".loadScreen").hide();
					$(".maxSize").fadeIn();
					};
				},
				error: function() {
					console.log("fail @ ticket List");
					console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
					}
			});
		}
	};
	var accountList = {
		init:function() {
			this.listAccounts();
		},

		listAccounts:function() {
			$("maxSize").hide();
			$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.beta.sherpadesk.com/accounts",
				dataType:"json",
				success: function(returnData) {
						console.log(returnData);
						$("#fullList").empty();
						for(var i = 0; i < returnData.length; i++) 
						{	
							var openTks = returnData[i].account_statistics.ticket_counts.open;
							if( openTks > 99)
							{
								openTks = "99<sup>+</sup>"
								var insert = "<ul class='listedAccount' data-id="+returnData[i].id+"><li>"+returnData[i].name+"</li><li><div class='tks toManyTks'>"+openTks+"</div></li></ul>";
								$(insert).appendTo($("#fullList"));
							}else{
							var insert = "<ul class='listedAccount' data-id="+returnData[i].id+"><li>"+returnData[i].name+"</li><li><div class='tks'>"+openTks+"</div></li></ul>";
							$(insert).appendTo($("#fullList"));
							}
						}
					},
					complete:function(){
					function reveal(){
					$(".loadScreen").hide();
					$(".maxSize").fadeIn();
					};
				},
				error: function() {
					console.log("fail @ listAccounts");
					console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
					}
			});
		}
	};

	var timeLogs = {
		init:function() {
			this.getLogs();
		},

		getLogs:function() {
			$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.beta.sherpadesk.com/time?limit=200",
				dataType:"json",
				success: function(returnData) {
						console.log(returnData);
						$("#timelogs").empty();
						for(var i = 0; i < returnData.length; i++)
						{
							var email = $.md5(returnData[i].user_email);
							var text = returnData[i].note;
							if(text.length > 15) 
							{
								text = text.substring(0,7)+"...";
							}
							var log = "<li><ul class='timelog'> <li><img class='timelogProfile' src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=30'></li><li><h2 class='feedName'>"+returnData[i].user_name+"</h2><p class='taskDescription'>"+text+"</p></li><li><img class='feedClock'src='img/clock_icon_small.png'><h3 class='feedTime'><span>"+returnData[i].hours+"</span> hrs</h3></li></ul></li>";
          					$(log).appendTo("#timelogs");
						}
					},
				error: function() {
					console.log("fail @ timelogs");
					console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
					}
			});
		}
	};

	var accountDetailsPageSetup = {
		init:function() {
			this.clickedAccount();
			this.pageSetup();
		},

		clickedAccount: function() {
			$(document).on("click",'.tableRows, .listedAccount', function(){
				localStorage.setItem('DetailedAccount',$(this).attr("data-id"));
				window.location = "account_details.html";
			});
		},

		pageSetup: function() {
			$(".maxSize").hide();
			$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.beta.sherpadesk.com/accounts/"+localStorage.getItem("DetailedAccount"),
				dataType:"json",
				success: function(returnData) {
					console.log(returnData);
					$("#AD").html(returnData.name);
					$("#ticketsOptionTicker").html(returnData.account_statistics.ticket_counts.open);
					$("#invoiceOptionTicker").html(returnData.account_statistics.invoices);
					$("#timesOptionTicker").html(returnData.account_statistics.timelogs);
					},
					complete:function(){
					function reveal(){
					$(".loadScreen").hide();
					$(".maxSize").fadeIn();
				};
				window.setTimeout(reveal,500);
				},
				error: function() {
					console.log("fail @ accounts");
					console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
					}
			});
			$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.beta.sherpadesk.com/tickets?status=open&account="+localStorage.getItem("DetailedAccount"),
				dataType:"json",
				success: function(returnData) {
					$(".AccountDetailsTicketsContainer").empty(); 
					for(var i = 0; i < returnData.length; i++) 
					{	
						var email = $.md5(returnData[i].user_email);
						var initialPost = returnData[i].initial_post;
						var subject = returnData[i].subject;
						var data = returnData[i].key;
						if(subject.length > 19)
						{
							subject = subject.substring(0,16)+"...";
						}
						if(initialPost.length > 50) 
						{
							initialPost = initialPost.substring(1,50);
						}
						var ticket = "<ul class='responseBlock' id='thisBlock' data-id="+data+"><li><p class='blockNumber numberStyle'>#"+returnData[i].number+"</p><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=30' class='TicketBlockFace'><span>"+returnData[i].user_firstname+"</span></li><li class='responseText'><h4>"+subject+"</h4><p class ='initailPost'>"+initialPost+"</p></li><li><p class='TicketBlockNumber'>"+returnData[i].class_name+"</p></li></ul>";
						$(ticket).appendTo(".AccountDetailsTicketsContainer");
					}
				
					},
				error: function() {
					console.log("fail @ accounts");
					console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
					}
			});

			$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.beta.sherpadesk.com/time?account="+localStorage.getItem("DetailedAccount"),
				dataType:"json",
				success: function(returnData) {
						console.log(returnData);
						$("#accountLogs").empty();
						for(var i = 0; i < returnData.length; i++)
						{
							var email = $.md5(returnData[i].user_email);
							var text = returnData[i].note;
							if(text.length > 15) 
							{
								text = text.substring(0,7)+"...";
							}
							var log = "<li><ul class='timelog'> <li><img class='timelogProfile' src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=30'></li><li><h2 class='feedName'>"+returnData[i].user_name+"</h2><p class='taskDescription'>"+text+"</p></li><li><img class='feedClock'src='img/clock_icon_small.png'><h3 class='feedTime'><span>"+returnData[i].hours+"</span> hrs</h3></li></ul></li>";
          					$(log).appendTo("#accountLogs");
						}
						
					},
				error: function() {
					console.log("fail @ timelogs");
					console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
					}
			});
		}


	};

	var storeLocalData = function() {
		localStorage.setItem('userOrgKey',userOrgKey);
		localStorage.setItem('userOrg',userOrg);
		localStorage.setItem('userInstanceKey',userInstanceKey);
		localStorage.setItem('userKey',userKey);
	};

	var getTicketCount = function() {
		$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.beta.sherpadesk.com/tickets/counts",
				dataType:"json",
				success: function(returnData) {
					$(".mainStat").html(returnData.open_all);
					$("#userStat").html(returnData.open_as_user);
					$("#techStat").html(returnData.open_as_tech);
					$("#altStat").html(returnData.open_as_alttech);

					},
				error: function() {
					console.log("fail @ get getTicketCount");
					console.log(userOrgKey + '-' + userInstanceKey +':'+userKey);(userOrg);
					}
		});
	};

	var getQueueList = function() {
		$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.beta.sherpadesk.com/queues?sort_by=tickets_count",
				dataType:"json",
				success: function(returnData) {
						var queuesLength = returnData.length; 
						$("#DashBoradQueues").empty();
						if(queuesLength > 3 ) {
							queuesLength = 3; 
						}
						for( var i = 0; i < queuesLength; i++)
						{
							var insertQueue = "<li><a href='ticket_list.html'><div class='OptionWrapper'><h3 class='OptionTitle'>"+returnData[i].fullname+"</h3></div><div class='NoticationWrapper'><h2>"+returnData[i].tickets_count+"</h2></div></a></li>";
        					$(insertQueue).prependTo("#DashBoradQueues");					
						}
					},
				error: function() {
					console.log("fail");
					console.log(userOrgKey + '-' + userInstanceKey +':'+userKey);(userOrg);
					}
		});
	};

	var getActiveAccounts = function() {
		$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.beta.sherpadesk.com/accounts?query=account_statistics.ticket_counts.open>0",
				dataType:"json",
				success: function(returnData) {
					$("#activeList").empty();
					var tableHeader = "<ul class='tableHeader'><li></li><li>Hours</li><li>Invoice</li><li>Tickets</li></ul>";
					$(tableHeader).prependTo("#activeList");
					console.log(returnData);
					for (var i = 0; i < returnData.length; i++)
					{
						if(returnData[i].name.length > 9) {
							var activeAccount = "<ul class='tableRows clickme' data-id="+returnData[i].id+"><li>"+returnData[i].name.substring(0,8)+"..."+"</li><li>"+returnData[i].account_statistics.timelogs+"</li><li>"+returnData[i].account_statistics.invoices+"</li><li>"+returnData[i].account_statistics.ticket_counts.open+"</li></ul>";
						$(activeAccount).appendTo("#activeList");
						}else{
							var activeAccount = "<ul class='tableRows' data-id="+returnData[i].id+"><li>"+returnData[i].name+"</li><li>"+returnData[i].account_statistics.timelogs+"</li><li>"+returnData[i].account_statistics.invoices+"</li><li>"+returnData[i].account_statistics.ticket_counts.open+"</li></ul>";
						$(activeAccount).appendTo("#activeList");
					}
					}
					
					

					},
				error: function() {
					console.log("fail @ get getTicketCount");
					console.log(userOrgKey + '-' + userInstanceKey +':'+userKey);(userOrg);
					}
		});
	};
	
	var org = {
		init: function() {
		    this.getOrg();
		    localStorage.setItem('userRole', 'user');
		    $('#instSelect').hide();
		},

		getOrg: function() {
		    $(".maxSize").hide();
		    userKey = localStorage.getItem("userKey");
			$.ajax({
				type: 'GET',
				beforeSend: function (xhr) {
					xhr.withCredentials = true;
					xhr.setRequestHeader('Authorization', 'Basic ' + btoa('x:' + userKey));
					},
				url: 'http://api.beta.sherpadesk.com/organizations/',
				async: true,
				cache: false,
				dataType: 'json',			
				success: function(results) {
					console.log(results);
				    // If there are more than one org
					if (results.length > 1) {
					    localStorage.setItem('sd_is_MultipleOrgInst', 'true');
					    var orglistitem = results;
					    for (var i = 0; i < orglistitem.length; i++) {
					        $('#orgSelect')
                                .append($("<option></option>")
                                .attr("value", orglistitem[i].key)
                                .text(orglistitem[i++].name));
					    }
					    $('#orgSelect')
                        // listen for org selection	
                            .change(function () {
                                var index_number = this.value;
                                userOrgKey = results[index_number].key;
                                userOrg = results[index_number].name;
                                var instances = results[index_number].instances;
                                localStorage.setItem('userOrgKey', orgkey);

                                // If there is only one instance on the selected org								
                                if (instances.length == 1) {
                                    userInstanceKey = instances[0].key;
                                    localStorage.setItem('userInstanceKey', instkey);
                                    //window.location = "index.html";
                                }
                                else {
                                    // If there is MORE than one instance on the selected org
                                    for (var i = 0; i < instances.length; i++) {
                                        $('#instSelect')
                                            .append($("<option></option>")
                                            .attr("value", instances[i].key)
                                            .text(instances[i++].name));
                                    }
                                    $('#instSelect').show();
                                    // listen for Instance selection	
                                    $('#instSelect').change(function () {
                                        var userInstanceKey = instances[this.value].key;
                                        localStorage.setItem('userInstanceKey', userInstanceKey);
                                        localStorage.setItem('sd_is_MultipleOrgInst', 'true');
                                        //window.location = "index.html";
                                    });
                                };
                            });
					};// End > 1 

				    // If there is ONLY ONE org and instance
					if (results.length == 1) {
					    userOrgKey = results[0].key;
					    userOrg =  results[0].name;
					    localStorage.setItem('userOrgKey', userOrgKey);
					    localStorage.setItem('sd_is_MultipleOrgInst', 'false');
					    //location.reload(true);
					    var myinst = results[0].instances;
					    // If there is only one instance on the selected org								
					    if (myinst.length == 1) {
					        userInstanceKey = myinst[0].key;
					        localStorage.setItem('userInstanceKey', userInstanceKey);
							if(window.location.pathname == "org.html"){
								window.location = "index.html";
							}
							$("#orgButton").click(function(){
								window.location = "index.html";
							});
					        //window.location = "index.html";
					    
					    }
					    else {
					        // If there is MORE than one instance on the selected org
					        for (var i = 0; i < instances.length; i++) {
					            $('#instSelect')
                                    .append($("<option></option>")
                                    .attr("value", instances[i].key)
                                    .text(instances[i++].name));
					        }
					        $('#instSelect').show();
					        // listen for Instance selection	
					        $('#instSelect').change(function () {
					            userInstanceKey = instances[this.value].key;
					            localStorage.setItem('userInstanceKey', userInstanceKey);
					            localStorage.setItem('sd_is_MultipleOrgInst', 'true');
					        });
					    };
					};
					
				    $("#indexTitle").html(userOrg);
				    storeLocalData();
				    //window.location = "index.html";
					getTicketCount();
					getQueueList();
					getActiveAccounts();

				},
				complete:function(){
					function reveal(){
					$(".loadScreen").hide();
					$(".maxSize").fadeIn();
				};
				window.setTimeout(reveal,500);
				},
				error: function() {
					console.log("fail @ getOrg");
				}
			}).promise();

		}
	};
	

	(function () {
	    UserLogin.init();
	    org.init();
		detailedTicket.init();
		ticketList.init();
		getQueues.init();
		accountDetailsPageSetup.init();
		timeLogs.init();
		accountList.init();
		invoiceList.init();
		detailedInvoice.init();
	}()); 
	

});
