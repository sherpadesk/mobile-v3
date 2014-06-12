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
					$("#errorMessage").html("Invalid Username / Password");
					$("#password").val("");
					}
			});
			});
		}
	};

	var sendInvoince = {
		init:function() {
			this.submitInvoice();
		},

		submitInvoice:function(){
			$("#sendInvoiceButton").click(function(){
				$.ajax({
    				type: 'POST',
    				beforeSend: function (xhr) {
    				    xhr.withCredentials = true;
    				    xhr.setRequestHeader('Authorization', 
    				                         'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
    				    },
    				url: 'http://api.beta.sherpadesk.com/invoices/'+localStorage.getItem('invoiceNumber'),
    				data: {
   						    "action": "sendEmail"
						   }, 
    				dataType: 'json',
    				success: function (d) {
    				    
    				    location.reload(false);
    				},
    				error: function (e, textStatus, errorThrown) {
    				         alert(textStatus);
    				}
 				});
			});
		}
	};
	var signout = {
		init:function(){
			this.logOut();
		},

		logOut:function(){
			$("#signOut").click(function(){
				localStorage.setItem('userOrgKey',"");
				localStorage.setItem('userOrg',"");
				localStorage.setItem('userInstanceKey',"");
				localStorage.setItem('userKey',"");
				window.location = "index.html";
			});
		}
	};

	var newTicket = {
		init:function() {
			this.addTicket();
		},

		addTicket:function() {
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
						$("#addTicketAccounts").empty();
						var chooseAccount = "<option value=0 disabled selected>Choose an Account</option>";
						$(chooseAccount).appendTo("#addTicketAccounts");
						for(var i = 0; i < returnData.length; i++)
						{ 
							var value = returnData[i].id;
							var task = returnData[i].name;
							var insert = "<option value="+value+">"+task+"</option>";
							$(insert).appendTo("#addTicketAccounts");
						}
						var chooseTech = "<option value=0 disabled selected>Choose a Tech</option>";
						var chooseClass = "<option value=0 disabled selected>Choose a class</option>";
						$("#addTicketTechs").empty();
						$("#addTicketClass").empty();
						$(chooseTech).appendTo("#addTicketTechs");
						$(chooseClass).appendTo("#addTicketClass");
					},
					complete:function(){
					function reveal(){
					$(".loadScreen").hide();
					$(".maxSize").fadeIn();
					};
				},
				error: function() {
					console.log("fail @ time accounts");
					console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
					}
			});
			 $("#addTicketAccounts").on("change",function(){
			  $.ajax({
				type: 'GET',
				beforeSend: function (xhr) {
					xhr.withCredentials = true;
					xhr.setRequestHeader('Authorization', 
            	              'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
					},
	
						url:"http://api.beta.sherpadesk.com/technicians",
						dataType:"json",
						success: function(returnData) {
								console.log(returnData);
								for(var i = 0; i < returnData.length; i++)
								{ 
									var value = returnData[i].id;
									var name = returnData[i].firstname;
									var insert = "<option value="+value+">"+name+"</option>";
									$(insert).appendTo("#addTicketTechs");
								}
							},
							complete:function(){
							function reveal(){
							$(".loadScreen").hide();
							$(".maxSize").fadeIn();
							};
						},
						error: function() {
							console.log("fail @ time accounts");
							console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
							}
				});
			 });
			$("#addTicketTechs").on("change",function(){
				$.ajax({
				type: 'GET',
				beforeSend: function (xhr) {
					xhr.withCredentials = true;
					xhr.setRequestHeader('Authorization', 
            	              'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
					},
	
						url:"http://api.beta.sherpadesk.com/classes",
						dataType:"json",
						success: function(returnData) {
								console.log(returnData);
								for(var i = 0; i < returnData.length; i++)
								{ 
									var value = returnData[i].id;
									var name = returnData[i].name;
									var insert = "<option value="+value+">"+name+"</option>";
									$(insert).appendTo("#addTicketClass");
								}
							},
							complete:function(){
							function reveal(){
							$(".loadScreen").hide();
							$(".maxSize").fadeIn();
							};
						},
						error: function() {
							console.log("fail @ time accounts");
							console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
							}
				});
			});
			$("#submitNewTicket").click(function(){

			$.ajax({
    				type: 'POST',
    				beforeSend: function (xhr) {
    				    xhr.withCredentials = true;
    				    xhr.setRequestHeader('Authorization', 
    				                         'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
    				    },
    				url: 'http://api.beta.sherpadesk.com/tickets',
    				data: {
    				    	"status" : "open",
    						"subject" : $("#addTicketSubject").val(),
    						"initial_post" : $("#addTicketInitPost").val(), 
    						"class_id" : $("#addTicketClass").val(),
    						"account_id" : $("#addTicketAccounts").val(),
    						"user_id" : localStorage.getItem('userId'),
    						"tech_id" : $("#addTicketTechs").val()
						   }, 
    				dataType: 'json',
    				success: function (d) {
    				    
    				    location.reload(false);
    				},
    				error: function (e, textStatus, errorThrown) {
    				         alert(textStatus);
    				}
 				});
			});
		}
	};
	var postComment = {
		init:function(){
			this.sendComment();
		},

		sendComment:function(){
			$("#reply").click(function(){
			    var comment = $("#commentText").val();
				 $.ajax({
    				type: 'POST',
    				beforeSend: function (xhr) {
    				    xhr.withCredentials = true;
    				    xhr.setRequestHeader('Authorization', 
    				                         'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
    				    },
    				url: 'http://api.beta.sherpadesk.com/tickets/'+localStorage.getItem('ticketNumber'),
    				data: {
    				    "note_text": comment,
   						    "action": "response"
						   }, 
    				dataType: 'json',
    				success: function (d) {
    				    
    				    location.reload(false);
    				},
    				error: function (e, textStatus, errorThrown) {
    				         alert(textStatus);
    				}
 				}); 
			});
		}
	};

	var search = {
		init:function(){
			this.universalSearch();
		},

		universalSearch:function(){
			$(document).on("keypress",".headerSearch",function(e){
   			 if(e.which == 13) {
       		 var searchItem  = $(".headerSearch").val().toLowerCase();
       		 localStorage.setItem("searchItem",searchItem);
       		 var found = false;
       		 var matchedTickets = [];
      		 	
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
					function reveal(){
					$(".loadScreen").hide();
					$(".maxSize").fadeIn();
					};
				},
				error: function() {
					alert("fail @ search");
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

				url:"http://api.beta.sherpadesk.com/tickets/"+searchItem,
				dataType:"json",
				success: function(returnData) {
						localStorage.setItem("ticketNumber",searchItem);
						window.location = "ticket_detail.html";
						
						
					},
					complete:function(){
					function reveal(){
					$(".loadScreen").hide();
					$(".maxSize").fadeIn();
					};
				},
				error: function() {
					
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

				url:"http://api.beta.sherpadesk.com/tickets",
				dataType:"json",
				success: function(returnData) {
					console.log(returnData);
						for(var i = 0; i < returnData.length; i++)
						{
							if(returnData[i].subject.toLowerCase().indexOf(searchItem) >= 0)
							{
								matchedTickets.push(returnData[i]);

							}
						}
						for(var a = 0; a < matchedTickets.length; a++)
						{
							$(".searchReturn").show();
							$("body").addClass("bodyLock");
							var insert = "<li class='searched' data-id="+matchedTickets[a].key+"><span class='returnedItem'> #"+matchedTickets[a].number+" "+matchedTickets[a].subject +"</span></li>";
							$(insert).appendTo(".searchReturn");
						}
					},
					complete:function(){
					function reveal(){
					$(".loadScreen").hide();
					$(".maxSize").fadeIn();
					};
				},
				error: function() {
					
					console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
					}
			});
				$(document).on("click",".searchCloseExpanded", function(){
					$("body").removeClass("bodyLock");
					$(".searchReturn").hide();
					$(".searchReturn").empty();
				});
				$(document).on("click",".bodyLock", function(){
					$("body").removeClass("bodyLock");
					$(".searchReturn").hide();
					$(".searchReturn").empty();
				});
				$(document).on("click",".searched", function(){
					$("body").removeClass("bodyLock");
					localStorage.setItem('ticketNumber', $(this).attr("data-id"));
					window.location = "ticket_detail.html";
				});
   				 }


			});
			//get accounts 

		}
	};

	var addTime = {
		init:function(){
			this.inputTime();
		},

		inputTime:function(){
			var ticketKey = localStorage.getItem('ticketNumber');
			var isBillable = true;
			var date = new Date().toJSON().slice(0,10);

			$("#submitTicketTime").click(function(){
				var time = $("#addTimeTicket").val();
				var note = $("#noteTimeTicket").val();
				var tech = localStorage.getItem('techId');
				if($(".innerCircle").hasClass("billFill")){
				isBillable = true;
				}else{
					isBillable = false;
				}

				 $.ajax({
    				type: 'POST',
    				beforeSend: function (xhr) {
    				    xhr.setRequestHeader('Authorization', 
    				                         'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
    				    },
    				url: 'http://api.beta.sherpadesk.com/time',
    				data: {
    						"ticket_key": ticketKey,
    						"note_text": note,
    						"task_type_id": 1,
    						"hours": time,
    						"is_billable": isBillable,
    						"date": date,
    						"start_date": new Date().toJSON(),
    						"stop_date": new Date().toJSON(),
    						"tech_id": tech,
						   }, 
    				dataType: 'json',
    				success: function (d) {
    				         window.location = "ticket_detail.html";
    				},
    				error: function (e, textStatus, errorThrown) {
    				         alert(textStatus);
    				}
 				});  
			});
			//get task types 
			$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.beta.sherpadesk.com/task_types",
				dataType:"json",
				success: function(returnData) {
						console.log(returnData);
						$("#taskTypes").empty();
						for(var i = 0; i < returnData.length; i++)
						{
							var value = returnData[i].id;
							var task = returnData[i].name;
							var insert = "<option value="+value+">"+task+"</option>";
							$(insert).appendTo("#taskTypes");
						}
						
					},
					complete:function(){
					function reveal(){
					$(".loadScreen").hide();
					$(".maxSize").fadeIn();
					};
				},
				error: function() {
					console.log("fail @ task typest");
					console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
					}
			});
			

			//get accounts 
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
						$("#timeAccounts").empty();
						var chooseAccount = "<option value=0>Choose An Account</option>";
						$(chooseAccount).appendTo("#timeAccounts");
						for(var i = 0; i < returnData.length; i++)
						{ 
							var value = returnData[i].id;
							var task = returnData[i].name;
							var insert = "<option value="+value+">"+task+"</option>";
							$(insert).appendTo("#timeAccounts");
						}
						var chooseProject = "<option value=0>Choose a Project</option>";
						$(chooseProject).appendTo("#timeProjects");
						
					},
					complete:function(){
					function reveal(){
					$(".loadScreen").hide();
					$(".maxSize").fadeIn();
					};
				},
				error: function() {
					console.log("fail @ time accounts");
					console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
					}
			});
			$("#timeProjects").empty();
			$("#timeAccounts").on("change", function(){

			//get projects
			$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.beta.sherpadesk.com/accounts/"+$("#timeAccounts").val(),
				dataType:"json",
				success: function(returnData) {
						console.log(returnData);
						$("#timeProjects").empty();
						for(var i = 0; i < returnData.projects.length; i++)
						{
							var value = returnData.projects[i].id;
							var task = returnData.projects[i].name;
							var insert = "<option value="+value+">"+task+"</option>";
							console.log(insert);
							$(insert).appendTo("#timeProjects");
						}
						
						
					},
					complete:function(){
					function reveal(){
					$(".loadScreen").hide();
					$(".maxSize").fadeIn();
					};
				},
				error: function() {
					console.log("fail @ time accounts");
					console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
					}
			});
			});

			$("#submitTime").click(function(){
				var time = $("#addTime").val();
				var note = $("#noteTime").val();
				var tech = localStorage.getItem('userId');
				var accountId = $("#timeAccounts").val();
				var projectId = $("#timeProjects").val();
				var taskId = $("#taskTypes").val();
				if($(".innerCircle").hasClass("billFill")){
				isBillable = true;
				}else{
					isBillable = false;
				}
				$.ajax({
    				type: 'POST',
    				beforeSend: function (xhr) {
    				    xhr.setRequestHeader('Authorization', 
    				                         'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
    				    },
    				url: 'http://api.beta.sherpadesk.com/time',
    				data: {
    						"tech_id" : tech,
    						"project_id": projectId,
    						"account_id" :accountId,
    						"note_text": note,
    						"task_type_id":taskId,
    						"hours":time,
    						"is_billable": isBillable,
    						"date": date,
    						"start_date": new Date().toJSON(),
    						"stop_date": new Date().toJSON(),
						   }, 
    				dataType: 'json',
    				success: function (d) {
    				         window.location = "dashboard.html";
    				},
    				error: function (e, textStatus, errorThrown) {
    				         alert(textStatus);
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
						localStorage.setItem('techId', returnData.tech_id);
						localStorage.setItem('ticketId',returnData.id);
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
						 if(returnData.location_id == 0)
						 {
						 	$("#location").remove();
						 }
						 var locationInsert = "<option value="+returnData.location_id+">"+returnData.location_name+"</option>";
						 $(locationInsert).appendTo("#ticketLocation");
						 $("#ticketProject").empty();
						 if(returnData.project_id == 0)
						 {
						 	$("#project").remove();
						 }
						 var projectInsert = "<option value="+returnData.project_id+">"+returnData.project_name+"</option>";
						 $(projectInsert).appendTo("#ticketProject");

						 //add comments (ticketLogs) to the page
						 $("#comments").empty();
						 for(var c = 1; c < returnData.ticketlogs.length; c++)
						 {
						 	var email = $.md5(returnData.ticketlogs[c].user_email);
						 	var type = returnData.ticketlogs[c].log_type;
						 	var userName = returnData.ticketlogs[c].user_firstname+" "+returnData.ticketlogs[c].user_lastname;
						 	var note = returnData.ticketlogs[c].note;
						 	var date = returnData.ticketlogs[c].record_date.toString().substring(0,10);
						 	var attachments = [];
						 	if(returnData.attachments != null){
						 	for(var e = 0; e < returnData.attachments.length; e++)
						 	{
						 		if(note.indexOf(returnData.attachments[e].name) >= 0) 
						 		{
						 			attachments.push(returnData.attachments[e].url);
						 		}
						 	}
						 	}


						 	var insert = "<ul class='responseBlock'><li><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=30' class='responseImg'><span>"+type+"</span></li><li class='responseText'><h3>"+userName+"</h3><p>"+note+"</p></li><li>"+date+"</li></ul>";
						 	$(insert).appendTo("#comments");
						 	for(var f = 0; f < attachments.length; f++)
						 	{
						 		var insert = "<img class='attachment' src="+attachments[f]+">";
						 		$(insert).appendTo("#comments");
						 	}
						 	if(attachments.length > 0)
						 	{
						 		borderInsert = "<div class='attachmentBorder'></div>";
						 		$(borderInsert).appendTo("#comments");
						 	}
						 }
						 $(".orginalMessageContainer").empty();
						 var orginalMessageEmail = $.md5(returnData.ticketlogs[0].user_email);
						 var orginalMessageinsert = "<ul class='responseBlock'><li><img src='http://www.gravatar.com/avatar/" + orginalMessageEmail + "?d=mm&s=30' class='responseImg'><span>"+returnData.ticketlogs[0].log_type+"</span></li><li class='responseText'><h3>"+returnData.ticketlogs[0].user_firstname+" "+returnData.ticketlogs[0].user_lastname+"</h3><p>"+returnData.ticketlogs[0].note+"</p></li><li>"+returnData.ticketlogs[0].record_date.toString().substring(0,10)+"</li></ul>";
						 	$(orginalMessageinsert).appendTo(".orginalMessageContainer");


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
							var insert = "<li><ul id='invoiceTimelog' class='timelog'><li><div class='billable timeLogAddButton' data-id='"+logID+"'><div class='innerCircle billFill'></div></div></li><li><h2 class='feedName'>"+name+"</h2><p class='taskDescription'>"+date+"</p></li><li><img class='feedClock' src='img/clock_icon_small.png'><h3 class='feedTime'><span>"+log+"</span> hrs</h3></li></ul></li>";
							$(insert).appendTo("#invoiceLogs");
						}
						$("#expencesList").empty();
						for(var c = 0; c < returnData.expences.length; c++)
						{
							var name = returnData.expences[c].name;
							var log = returnData.expences[c].total;
							var date = returnData.expences[c].date.substring(0,10);
							var logID = returnData.expences[c].date.id;
							var insert = "<li><ul id='invoiceExpense' class='timelog'><li><div class='billable timeLogAddButton' data-id='"+logID+"'><div class='innerCircle billFill'></div></div></li><li><h2 class='feedName'>"+name+"</h2><p class='taskDescription'>"+date+"</p></li><li><h3 class='feedTime expenceCost'><span>$"+log+"</span></h3></li></ul></li>";
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

	//methods & Api calls that deal with changing time adding adjustments, expenses 
	var updateInvoice ={
		init:function(){
			this.changeInvoice();
		},

		changeInvoice:function(){
			//update timelog after being clicked 
			$(document).on("click","#invoiceTimelog",function(){
				$(this).find(".innerCircle").toggleClass("billFill");

			});
			//update expense after beign clicked 
			$(document).on("click","#invoiceExpense",function(){
				$(this).find(".innerCircle").toggleClass("billFill");

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
						$("#invoiceList").empty();
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
						$("#allInvoiceList").empty();
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
							var data = returnData[i].key;
							if(subject.length > 19)
							{
								subject = subject.substring(0,16)+"...";
							}
							if(intialPost.length > 100) 
							{
								intialPost = intialPost.substring(1,100);
							}
							var ticket = "<ul class='responseBlock' id='thisBlock' data-id="+data+"><li><p class='blockNumber numberStyle'>#"+returnData[i].number+"</p><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=30' class='TicketBlockFace'><span>"+returnData[i].user_firstname+"</span></li><li class='responseText'><h4>"+subject+"</h4><p class ='initailPost'>"+intialPost+"</p></li><li><p class='TicketBlockNumber'>"+returnData[i].class_name+"</p></li></ul>";
							
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
							var data = returnData[i].key;
							if(subject.length > 19)
							{
								subject = subject.substring(0,16)+"...";
							}
							if(intialPost.length > 100) 
							{
								intialPost = intialPost.substring(1,100);
							}
							var ticket = "<ul class='responseBlock' id='thisBlock' data-id="+data+"><li><p class='blockNumber numberStyle'>#"+returnData[i].number+"</p><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=30' class='TicketBlockFace'><span>"+returnData[i].user_firstname+"</span></li><li class='responseText'><h4>"+subject+"</h4><p class ='initailPost'>"+intialPost+"</p></li><li><p class='TicketBlockNumber'>"+returnData[i].class_name+"</p></li></ul>";
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
							var data = returnData[i].key;
							if(subject.length > 19)
							{
								subject = subject.substring(0,16)+"...";
							}
							if(intialPost.length > 100) 
							{
								intialPost = intialPost.substring(1,100);
							}
							var ticket = "<ul class='responseBlock' id='thisBlock' data-id="+data+"><li><p class='blockNumber numberStyle'>#"+returnData[i].number+"</p><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=30' class='TicketBlockFace'><span>"+returnData[i].user_firstname+"</span></li><li class='responseText'><h4>"+subject+"</h4><p class ='initailPost'>"+intialPost+"</p></li><li><p class='TicketBlockNumber'>"+returnData[i].class_name+"</p></li></ul>";
							
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
							var data = returnData[i].key;
							if(subject.length > 14)
							{
								subject = subject.substring(0,11)+"...";
							}
							if(intialPost.length > 100) 
							{
								intialPost = intialPost.substring(1,100);
							}
							var ticket = "<ul class='responseBlock' id='thisBlock' data-id="+data+"><li><p class='blockNumber numberStyle'>#"+returnData[i].number+"</p><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=30' class='TicketBlockFace'><span>"+returnData[i].user_firstname+"</span></li><li class='responseText'><h4>"+subject+"</h4><p class ='initailPost'>"+intialPost+"</p></li><li><p class='TicketBlockNumber'>"+returnData[i].class_name+"</p></li></ul>";
							
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
								openTks = "99<sup>+</sup>";
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
					var allTickets = returnData.open_all;
					if(allTickets > 100){
						allTickets = "99<sup>+</sup>";
						$("all").addClass("toManyTks");
					}
					$("#all").html(allTickets);
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
							var activeAccount = "<ul class='tableRows clickme' data-id="+returnData[i].id+"><li>"+returnData[i].name.substring(0,8)+"..."+"</li><li>"+returnData[i].account_statistics.timelogs+"</li><li>"+returnData[i].account_statistics.invoices+"</li><li><div class='tks1' >"+returnData[i].account_statistics.ticket_counts.open+"</div></li></ul>";
						$(activeAccount).appendTo("#activeList");
						}else{
							var activeAccount = "<ul class='tableRows' data-id="+returnData[i].id+"><li>"+returnData[i].name+"</li><li>"+returnData[i].account_statistics.timelogs+"</li><li>"+returnData[i].account_statistics.invoices+"</li><li><div class='tks1' >"+returnData[i].account_statistics.ticket_counts.open+"</div></li></ul>";
						$(activeAccount).appendTo("#activeList");
					}
					}
					
					

					},
				error: function() {
					console.log("fail @ get getTicketCount");
					console.log(userOrgKey + '-' + userInstanceKey +':'+userKey);(userOrg);
					}
		});

		//get user info 
		$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.beta.sherpadesk.com/users?query="+localStorage.getItem('userName'),
				dataType:"json",
				success: function(returnData) {
					console.log(returnData);
					$(".navName").html(returnData[0].firstname+" "+returnData[0].lastname);
					var email = $.md5(returnData[0].email);
					$(".navProfile").attr("src","http://www.gravatar.com/avatar/" + email + "?d=mm&s=30");
					localStorage.setItem("userId",returnData[0].id);
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
							if(window.location.pathname == "/org.html"){
								window.location = "dashboard.html";
							}
							$("#orgButton").click(function(){
								
								window.location = "dashboard.html";
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
	
	var ajaxCallTime = {
		init:function(){
			this.printTime();
		},

		printTime:function(){
			console.log($.now());
		}
	};

	(function () {
		if(window.location.pathname == "/.html"){}
		if(window.location.pathname == "/org.html"){}
		if(window.location.pathname == "/org.html"){}
		if(window.location.pathname == "/org.html"){}
		if(window.location.pathname == "/org.html"){}
		if(window.location.pathname == "/org.html"){}
		if(window.location.pathname == "/org.html"){}
		if(window.location.pathname == "/org.html"){}
		ajaxCallTime.init();
	    UserLogin.init();
	    newTicket.init();
	    sendInvoince.init();
	    signout.init();
	    search.init();
	    org.init();
		detailedTicket.init();
		ticketList.init();
		getQueues.init();
		accountDetailsPageSetup.init();
		timeLogs.init();
		accountList.init();
		invoiceList.init();
		detailedInvoice.init();
		addTime.init();
		postComment.init();
		updateInvoice.init();
		ajaxCallTime.init();
	}()); 
	

});
