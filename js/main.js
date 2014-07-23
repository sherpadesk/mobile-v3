$(document).ready(function(){
	
	var userOrgKey = "";
	var userOrg = "";
	var userInstanceKey = "";
	var	userKey = "";
	var accountDetailed = "";

	function getParameterByName(name) {
	    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
	    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
	}

	function cleanQuerystring() {
	    var clean_uri = location.protocol + "//" + location.host + location.pathname;
	    window.history.replaceState({}, document.title, clean_uri);
	}

	function reveal() {
	    $(".loadScreen").hide();
	    $(".maxSize").fadeIn();
	};

	// user login 
	var UserLogin = {
	    init: function () {
	        var loginPage = true;
	        if (location.pathname.indexOf("index.html") < 0 && location.pathname != "/")
	            loginPage = false;
	        userKey = localStorage.getItem("userKey");
	        userOrgKey = localStorage.getItem('userOrgKey');
	        userInstanceKey = localStorage.getItem('userInstanceKey');
	        if ((!userKey || !userOrgKey || !userInstanceKey) && !loginPage) {
	          clearStorage();
	          window.location = "index.html";
	          return;
	        }
	        if (!loginPage)
	          return;
	        if (userKey && userOrgKey && userInstanceKey) {
	            window.location = "dashboard.html";
	            return;
	        }
	        if (userKey) {
	            window.location = "org.html";
	            return;
	        }
	        else {
	            var key = getParameterByName('t');
	            var email = getParameterByName('e');
	            if (key) {
	                cleanQuerystring();
	                localStorage.setItem('is_google', true);
	                localStorage.setItem("userKey", key)
	                localStorage.setItem('userName', email);
	                window.location = "org.html";
	                return;
	            }
	        }
	        this.login();
		},
		do_login: function () {
		    var userName = $("#userName").val();
		    var password = $("#password").val();
		    if (userName == '' || password == '') {
		        $("#errorMessage").html("Please enter a valid Email or Password");
		        return;
		    }
		    $.ajax({
		        type: 'POST',
		        beforeSend: function (xhr) {
		            xhr.withCredentials = true;
		            xhr.setRequestHeader('Authorization',
              'Basic ' + btoa(userName + ':' + password));
		        },
		        url: "http://api.sherpadesk.com/login",
		        dataType: "json",
		        success: function (returnData) {
		            console.log(returnData);

		            localStorage.setItem("userKey", returnData.api_token)
		            localStorage.setItem('userName', userName);
		            window.location = "org.html";

		        },
		        complete: function () {

		        },
		        error: function () {
		            if (userName && userName.indexOf("@gmail.com") != -1)
		                $("#errorMessage").html("If you are attempting to login with a google account, please do not type your google password, click the 'Sign in with Google' button, it is more secure.");
		            else
		                $("#errorMessage").html("There was a problem with your login.  Please try again.");
		            $("#password").val("");
		        }
		    });
		},
		login:function() {
			$('#login_signup').on('click', function (e) {
			    e.preventDefault();
			    var url = 'https://app.sherpadesk.com/mc/signuporg.aspx';
			    if (window.self !== window.top) {
			        alert('Please register in new window and reopen Sherpadesk extension again.');
			        window.open(url, '');
			    }
			    else {
			      document.location.href = url;
			    }
			});
			$('form.google_openid').get(0).setAttribute('action', 'http://api.sherpadesk.com/api/auth/googleopenid');
			$('#sign_in_with_google').on('click', function (e) {
			    e.preventDefault();
			    if (window.self !== window.top) {
			        alert('Please go Google login in new window and reopen Sherpadesk extension again.');
			        $('form.google_openid').get(0).setAttribute('target', '_blank');
			    }
			    $('form.google_openid').get(0).submit();
			});
			$("#loginButton").click(function () { UserLogin.do_login(); });
			$(document).on("keypress", "#password, #userName", function (e) {
			    if (e.which == 13) {
			        UserLogin.do_login();
			    }
			});
			reveal();
		}
	};

	//show closed tickets 
	var closedTickets = {
		init:function() {
			this.showClosedTickets();
			this.pageChange();
		},

		pageChange:function() {
			$(".buttonShowClosedTickets").click(function(){
				window.location = "closedTickets.html";
			});
		},

		showClosedTickets:function() {
			$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.sherpadesk.com/tickets?status=closed&account="+localStorage.getItem("DetailedAccount"),
				dataType:"json",
				success: function(returnData) {
					$("#closedTickets").empty(); 
					//insert open tickets
					for(var i = 0; i < returnData.length; i++) 
					{	
						// get email value for gravatar 
						var email = $.md5(returnData[i].user_email);
						var initialPost = returnData[i].initial_post;
						var subject = returnData[i].subject;
						//the key for this specific ticket
						var data = returnData[i].key;
						// ensure ticket subject length is not to long to be displayed (subject is elipsed if it is)
						if(subject.length > 19)
						{
							subject = subject.substring(0,16)+"...";
						}
						// ensure ticket initial post length is not to long to be displayed (initial post is elipsed if it is)
						if(initialPost.length > 50) 
						{
							initialPost = initialPost.substring(0,50);
						}
						var ticket = "<ul class='responseBlock' id='thisBlock' data-id="+data+"><li><p class='blockNumber numberStyle'>#"+returnData[i].number+"</p><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=80' class='TicketBlockFace'><span>"+returnData[i].user_firstname+"</span></li><li class='responseText'><h4>"+subject+"</h4><p class ='initailPost'>"+initialPost+"</p></li><li><p class='TicketBlockNumber'>"+returnData[i].class_name+"</p></li></ul>";
						$(ticket).appendTo("#closedTickets");
					}
				
					},
				error: function() {
					console.log("fail @ accounts");
					console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
					}
			});
		}

	};

	// pick up current detailed ticket 
	var pickUpTicket = {
		init:function() {
			this.pick();
		},

		pick:function() {
			$("#pickUp").click(function(){
			$.ajax({
    			type: 'PUT',
    			beforeSend: function (xhr) {
    			    xhr.setRequestHeader('Authorization', 
    				                         'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
    			    },
    			url: 'http://api.sherpadesk.com/tickets/'+localStorage.getItem("ticketNumber"),
    			data: {
    					"action" : "pickup",
    					"note_text": ""
    			       
    			       }, 
    			dataType: 'json',
    			success: function (d) {
    			       window.location = "ticket_list.html";
    			},
    			error: function (e, textStatus, errorThrown) {
    			         alert(textStatus);
    			}
 			}); 
 			});
		}
	};

	// transfer current detailed ticket 
	var transferTicket = {
		init:function() {
			this.transfer();
		},

		transfer:function() {
			$("#transfer").click(function(){
			$("#transfer").hide();
			$("#transferSelect").show();
			$.ajax({
				type: 'GET',
				beforeSend: function (xhr) {
					xhr.withCredentials = true;
					xhr.setRequestHeader('Authorization', 
            	              'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
					},
	
						url:"http://api.sherpadesk.com/technicians",
						dataType:"json",
						success: function(returnData) {
								console.log(returnData);
								// add techs to option select list 
								var insert = "<option value=0 disabled selected> Choose Tech</option>";
									$(insert).appendTo("#transferTechs");
								for(var i = 0; i < returnData.length; i++)
								{ 
									var value = returnData[i].id;
									var name = returnData[i].firstname+" "+returnData[i].lastname;
									var insert = "<option value="+value+">"+name+"</option>";
									$(insert).appendTo("#transferTechs");
								}
							},
						complete: function () {
						    reveal();
						},
						error: function() {
							console.log("fail @ time accounts");
							console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
							}
				});
			// get value 
			$("#transferTechs").on("change", function(){
				var techId = $("#transferTechs").val();
			$.ajax({
    			type: 'PUT',
    			beforeSend: function (xhr) {
    			    xhr.setRequestHeader('Authorization', 
    				                         'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
    			    },
    			url: 'http://api.sherpadesk.com/tickets/'+localStorage.getItem("ticketNumber"),
    			data: {
    					"action": "transfer",
    					"note_text": "example",
   					    "tech_id": techId,
   					    "keep_attached": false
    			       
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
 			});
		}
	};

	var addRecip = {
		init:function() {
			this.addEm();
		},

		addEm:function() {
			$(document).on("keypress","#addEm",function(e){
   			 if(e.which == 13) {
       		 var searchItem  = $(".headerSearch").val().toLowerCase();
       		 localStorage.setItem("searchItem",searchItem);
       		 var found = false;
       		 
       		 var email = $("headerSearch").val();
       		}
       		});
		}
	};
	
	// close current detailed ticket 
	var closeTicket = {
		init:function() {
			this.closeIt();
		},

		closeIt:function() {
			$("#closeIt").click(function(){
			$.ajax({
    			type: 'PUT',
    			beforeSend: function (xhr) {
    			    xhr.setRequestHeader('Authorization', 
    				                         'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
    			    },
    			url: 'http://api.sherpadesk.com/tickets/'+localStorage.getItem("ticketNumber"),
    			data: {
    					"status" : "closed",
    					"note_text": "",
    					"is_send_notifications": true,
    					"resolved": true,
    					"confirmed": true,
    					"confirm_note": "confirmed by me"
    			       
    			       }, 
    			dataType: 'json',
    			success: function (d) {
    			       //location.reload(false);
    			       setTimeout(
  						function() 
  						{
  							
  							window.history.back();
  				  			
  						}, 1000);
						localStorage.setItem("userMessage","Ticket was Closed <i class='fa fa-thumbs-o-up'></i>");
						localStorage.setItem("isMessage","truePos");
    			},
    			error: function (e, textStatus, errorThrown) {
    			         alert(textStatus);
    			}
 			}); 
 			});
		}
	};
	//date formating function 
	var formatDate = function(date){
		var month = date.substring(5,7);
		var day = date.substring(8,10);
		switch(month){
			case "01":
				month = "Jan";
				break;
			case "02": 
				month = "Feb";
				break;
			case "03": 
				month = "Mar";
				break;
			case "04":
				month = "Apr";
				break;
			case "05": 
				month = "May";
				break;
			case '06': 
				month = "Jun";
				break;
			case '07':
				month = "Jul";
				break;
			case '08': 
				month = "Aug";
				break;
			case '09': 
				month = "Sep";
				break;
			case '10':
				month = "Oct";
				break;
			case '11': 
				month = "Nov";
				break;
			case '12': 
				month = "Dec";
				break;
			default:
				month = "nul";
				break
		}
		return month+" "+day;
	};
	// send an invoice to recipents 
	var sendInvoince = {
		init:function() {
			this.submitInvoice();
		},

		submitInvoice:function(){
			$("#sendInvoiceButton").click(function(){
				$.ajax({
    				type: 'PUT',
    				beforeSend: function (xhr) {
    				    xhr.withCredentials = true;
    				    xhr.setRequestHeader('Authorization', 
    				                         'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
    				    },
    				url: 'http://api.sherpadesk.com/invoices/'+localStorage.getItem('invoiceNumber'),
    				data: {
   						    "action": "sendEmail"
						   }, 
    				dataType: 'json',
    				success: function (d) {
    				    window.history.back();
    				    
    				},
    				error: function (e, textStatus, errorThrown) {
    				         alert(textStatus);
    				}
 				});
			});
		}
	};
	
	function clearStorage()
	{
	  localStorage.removeItem('userOrgKey');
		localStorage.removeItem('userOrg');
		localStorage.removeItem('userInstanceKey');
		localStorage.removeItem('userKey');
	};
	// when signout button is pressed all user data is whiped from local storage 
	var signout = {
		init:function(){
			this.logOut();
		},

		logOut:function(){
		    $("#signOut").click(function () {
		        clearStorage();
		        if (localStorage.is_google) {
		            localStorage.removeItem('userName');
		            localStorage.removeItem('is_google');
		            GooglelogOut();
		        }
		        else
		            window.location = "index.html";
		    });
		}
	};

	var GooglelogOut = function () {
	    if (window.self === window.top && !confirm("Do you want to stay logged in Google account?")) {
	        var logoutUrl = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=" + MobileSite;
	        document.location.href = location.href.replace(/(.+\w\/)(.+)/, "$1") + "index.html";
	    }
	    else
	        window.location = "index.html";
	}

	// create a new ticket 
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

				url:"http://api.sherpadesk.com/accounts",
				dataType:"json",
				success: function(returnData) {
						console.log(returnData);
						// get list of accounts add them to option select list 
						$("#addTicketAccounts").empty();
						var chooseAccount = "<option value=0 disabled selected>Account</option>";
						$(chooseAccount).appendTo("#addTicketAccounts");
						for(var i = 0; i < returnData.length; i++)
						{ 
							var value = returnData[i].id;
							var task = returnData[i].name;
							var insert = "<option value="+value+">"+task+"</option>";
							$(insert).appendTo("#addTicketAccounts");
						}
						var chooseTech = "<option value=0 disabled selected>Tech</option>";
						var chooseClass = "<option value=0 disabled selected>Class</option>";
						var chooseSubClass = "<option value=0 disabled selected>Sub Class</option>";
						$("#addTicketTechs").empty();
						$("#addTicketClass").empty();
						$("#addTicketSubClass").empty();
						$(chooseTech).appendTo("#addTicketTechs");
						$(chooseClass).appendTo("#addTicketClass");
						$(chooseSubClass).appendTo("#addTicketSubClass");
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
			// after an account is choosed it get a list of technicians 
			 $("#addTicketAccounts").on("change",function(){
			  $.ajax({
				type: 'GET',
				beforeSend: function (xhr) {
					xhr.withCredentials = true;
					xhr.setRequestHeader('Authorization', 
            	              'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
					},
	
						url:"http://api.sherpadesk.com/technicians",
						dataType:"json",
						success: function(returnData) {
								console.log(returnData);
								// add techs to option select list 
								for(var i = 0; i < returnData.length; i++)
								{ 
									var value = returnData[i].id;
									var name = returnData[i].firstname+" "+returnData[i].lastname;
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
			// after techs are choosen then get a list of classes 
			$("#addTicketTechs").on("change",function(){
				$.ajax({
				type: 'GET',
				beforeSend: function (xhr) {
					xhr.withCredentials = true;
					xhr.setRequestHeader('Authorization', 
            	              'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
					},
	
						url:"http://api.sherpadesk.com/classes",
						dataType:"json",
						success: function(returnData) {
								console.log(returnData);
								// add list of classes to option select list
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
			$("#addTicketClass").on("change",function(){
				$.ajax({
				type: 'GET',
				beforeSend: function (xhr) {
					xhr.withCredentials = true;
					xhr.setRequestHeader('Authorization', 
            	              'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
					},
	
						url:"http://api.sherpadesk.com/classes/API/",
						dataType:"json",
						data: {
    					"class_id":"631"
    			       
    			       },
						success: function(returnData) {
								console.log(returnData);
								// add list of classes to option select list
								for(var i = 0; i < returnData.length; i++)
								{ 
									var value = returnData[i].id;
									var name = returnData[i].name;
									var insert = "<option value="+value+">"+name+"</option>";
									$(insert).appendTo("#addTicketSubClass");
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
			// make api post call when submit ticket button is clicked 
			$("#submitNewTicket").click(function(){
				if($("#addTicketSubject").val() == "" || $("#addTicketTechs").val() == "" || $("#addTicketClass").val() == "" || $("#addTicketSubject").val() == "")
				{
					$(".errorMessageNeg").slideDown(100);
					setTimeout(
  					function() 
  					{
  						$(".errorMessageNeg").slideUp(100);
  				  		
  					}, 1500);
  					
					
				}
				else 
				{
			$.ajax({
    				type: 'POST',
    				beforeSend: function (xhr) {
    				    xhr.withCredentials = true;
    				    xhr.setRequestHeader('Authorization', 
    				                         'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
    				    },
    				url: 'http://api.sherpadesk.com/tickets',
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
    				/*    $(".errorMessagePos").slideDown(100);
					setTimeout(
  					function() 
  					{
  						$(".errorMessagePos").slideUp(100);
  						window.location = "dashboard.html";
  				  		
  					}, 1500);*/
					setTimeout(
  					function() 
  					{
  						
  						window.location = "dashboard.html";
  				  		
  					}, 1000);
					localStorage.setItem("userMessage","Ticket was Succesfully Created :)");
					localStorage.setItem("isMessage","truePos");
					
    				    
    				},
    				error: function (e, textStatus, errorThrown) {
    				         alert(textStatus);
    				}
 				});

				}
			});
		}
	};

	// post a comment to a ticket on the ticket details page 
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
    				url: 'http://api.sherpadesk.com/tickets/'+localStorage.getItem('ticketNumber'),
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

	// Ajax calls for semi-universal search bar 
	var search = {
		init:function(){
			this.universalSearch();
		},

		universalSearch:function(){
			//get the search value when the enter key is pressed 
			$(document).on("keypress","#searchThis",function(e){
   			 if(e.which == 13) {
       		 var searchItem  = $(".headerSearch").val().toLowerCase();
       		 localStorage.setItem("searchItem",searchItem);
       		 var found = false;
       		 var matchedTickets = [];
      		 	
      		 // search for a account value that matches the search critera 	
       		 $.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.sherpadesk.com/accounts",
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
					console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
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

				url:"http://api.sherpadesk.com/tickets/"+searchItem,
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

			// search for tickets containing the search critera in the subject and return a list 
			$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.sherpadesk.com/tickets",
				dataType:"json",
				success: function(returnData) {
					console.log(returnData);
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
					function reveal(){
					$(".loadScreen").hide();
					$(".maxSize").fadeIn();
					};
				},
				error: function() {
					
					console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
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
   				 }


			});

		}
	};

	// add time to an account 
	var addTime = {
		init:function(){
			this.inputTime();
			this.accountTime();
		},

		accountTime:function() {
			$("#addTimeAccount").click(function(){
				window.location = "add_time.html";
			});
		},

		inputTime:function(){
			var ticketKey = localStorage.getItem('ticketNumber');
			var isBillable = true;
			var date = new Date().toJSON().slice(0,10);

			// on submit click get the time and note typed by the user 
			$("#submitTicketTime").click(function(){
				var time = $("#addTimeTicket").val();
				var note = $("#noteTimeTicket").val();
				var tech = localStorage.getItem('techId');
				// check to see if user check for time to be billable 
				if($(".innerCircle").hasClass("billFill")){
				isBillable = true;
				}else{
					isBillable = false;
				}
				// add time to the orginization 
				 $.ajax({
    				type: 'POST',
    				beforeSend: function (xhr) {
    				    xhr.setRequestHeader('Authorization', 
    				                         'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
    				    },
    				url: 'http://api.sherpadesk.com/time',
    				data: {
    						"ticket_key": ticketKey,
    						"note_text": note,
    						"task_type_id": 1,
    						"hours": time,
    						"is_billable": isBillable,
    						//"date": date,
    						//"start_date": new Date().toJSON(),
    						//"stop_date": new Date().toJSON(),
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

				url:"http://api.sherpadesk.com/task_types",
				dataType:"json",
				success: function(returnData) {
						console.log(returnData);
						$("#taskTypes").empty();
						// add task types to list 
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

				url:"http://api.sherpadesk.com/accounts",
				dataType:"json",
				success: function(returnData) {
						console.log(returnData);
						$("#timeAccounts").empty();
						var chooseAccount = "<option value=0>Choose An Account</option>";
						$(chooseAccount).appendTo("#timeAccounts");
						// accounts to add time 
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

				url:"http://api.sherpadesk.com/accounts/"+$("#timeAccounts").val(),
				dataType:"json",
				success: function(returnData) {
						console.log(returnData);
						$("#timeProjects").empty();
						// add projects 
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
			// submit time to account 
			$("#submitTime").click(function(){
				var time = $("#addTimeTicket").val();
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
    				url: 'http://api.sherpadesk.com/time',
    				data: {
    						"tech_id" : tech,
    						"project_id": projectId,
    						"account_id" :accountId,
    						"note_text": note,
    						"task_type_id":taskId,
    						"hours":time,
    						"is_billable": isBillable,
    						//"date": date,
    						//"start_date": new Date().toJSON(),
    						//"stop_date": new Date().toJSON(),
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

	// needed methods to propogate a ticket detailed page 
	var detailedTicket = {
		init:function(){
			this.showTicket();
		},

		showTicket:function(){
			// listen for a click of a ticket block from a ticket list page (account detail  ticket list or complete ticket list)
			$(document).on("click",".responseBlock", function(){
				localStorage.setItem('ticketNumber', $(this).attr("data-id")); //set local storage variable to the ticket id of the ticket block from the ticket list 
				window.location = "ticket_detail.html"; // change page location from ticket list to ticket detail list 
			});


			$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.sherpadesk.com/tickets/"+localStorage.getItem('ticketNumber'),
				dataType:"json",
				success: function(returnData) {
						console.log(returnData);
						// calculate the number of days since the ticket was created 
						var daysOld = returnData.daysold_in_minutes / -60;
						localStorage.setItem('techId', returnData.tech_id); // set the local storage variable with the tech id asscioted with this ticket  
						localStorage.setItem('ticketId',returnData.id); // set the local storage variable with the ticket ID 
						// check to see if the ticket is less than a day old 
						if(daysOld > 24){
							daysOld = daysOld/24;
							daysOld = parseInt(daysOld);
							daysOld = daysOld +" days ago";
						} else {
							daysOld = parseInt(daysOld) +" hours ago";
						}

						 // update page variables with correct ticket information 
						 $("#ticketNumber").html(returnData.status+" | "+returnData.number);
						 $("#ticketSubject").html(returnData.subject);
						 $("#ticketClass").html(returnData.class_name);
						 $("#ticketTech").html(returnData.tech_firstname);
						 $("#lastUpdate").html(daysOld);
						 $("#ticketHours").html(returnData.total_hours+" Hours");
						 if(returnData.sla_complete_date == null)
						 {
						 	//do nothing 
						 }
						 else
						 {
						 	$("#ticketSLA").html("SLA: "+returnData.sla_complete_date.toString().substring(0,10));
						 }

						 $("#classOptions").empty();
						 // add select options to class Option box 
						 for(var a = 0; a < returnData.classes.length; a++)
						 {
						 	var className = returnData.classes[a].name;
						 	var classId = returnData.classes[a].id;
						 	var insert = "<option value="+classId+">"+className+"</option>";
						 	$(insert).appendTo("#classOptions");
						 }
						 $("#ticketLevel").empty();
						 // add select options to level Option box 
						 var levelInsert = "<option value="+returnData.level+">Level "+returnData.level+" "+returnData.level_name+"</option>";
						 $(levelInsert).appendTo("#ticketLevel");
						 $("#ticketPriority").empty();
						 // add select options to priority option box 
						 var priorityInsert = "<option value="+returnData.priority_id+">Priority "+returnData.priority+"</option>";
						 $(priorityInsert).appendTo("#ticketPriority");
						 $("#ticketTechs").empty();
						 // add select options to tech Option box
						 for(var b = 0; b < returnData.technicians.length; b++)
						 {
						 	var techName = returnData.technicians[b].user_fullname;
						 	var techId = returnData.technicians[b].user_id;
						 	var insert = "<option value="+techId+">"+techName+"</option>";
						 	$(insert).appendTo("#ticketTechs");
						 }
						 $("#ticketLocation").empty();
						 // add select options to location Option box 
						 if(returnData.location_id == 0)
						 {
						 	$("#location").remove();
						 }
						 var locationInsert = "<option value="+returnData.location_id+">"+returnData.location_name+"</option>";
						 $(locationInsert).appendTo("#ticketLocation");
						 $("#ticketProject").empty();
						 // add select options to project option box 
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
						 	date = formatDate(date);
						 	var attachments = [];
						 	//check to see if this comment has attachments 
						 	if(returnData.attachments != null){
						 	for(var e = 0; e < returnData.attachments.length; e++)
						 	{
						 		if(note.indexOf(returnData.attachments[e].name) >= 0) 
						 		{
						 			attachments.push(returnData.attachments[e].url);
						 		}
						 	}
						 	}

						 	// comment insert 
						 	var insert = "<ul class='commentBlock'><li><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=80' class='commentImg'></li><li class='commentText'><h3>"+userName+"</h3></li><li><span>"+date+"</span></li><li class='commentText'><p>"+note+"</p></li><li>"+type+"</li></ul>";
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
						 // add the lastest comment to the top of the comments list 
						 var orginalMessageEmail = $.md5(returnData.ticketlogs[0].user_email);
						 var orginalMessageDate = returnData.ticketlogs[0].record_date.toString().substring(0,10);
						 orginalMessageDate = formatDate(orginalMessageDate);
						 var orginalMessageinsert = "<ul class='commentBlock'><li><img src='http://www.gravatar.com/avatar/" + orginalMessageEmail + "?d=mm&s=80' class='commentImg'></li><li class='commentText'><h3>"+returnData.ticketlogs[0].user_firstname+" "+returnData.ticketlogs[0].user_lastname+"</h3></li><li><span>"+orginalMessageDate+"</span></li><li class='commentText'><p>"+returnData.ticketlogs[0].note+"</p></li><li>"+returnData.ticketlogs[0].log_type+"</li></ul>"
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
	};

	//get info for a specific invoice 
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

				url:"http://api.sherpadesk.com/invoices/"+localStorage.getItem("invoiceNumber"),
				dataType:"json",
				success: function(returnData) {
						console.log(returnData);
						localStorage.setItem("invoiceAccountId",returnData.account_id);
						localStorage.setItem("invoiceProjectId",returnData.project_id);
						$("#invoiceNumber").html("Invoice  #"+returnData.id); //invoice number 
						var custoName = returnData.customer;
						if(custoName.length > 23){
							custoName = custoName.substring(0,19)+"...";
						} 
						$("#customerName").html(custoName); // customer name 
						var date = returnData.date.substring(0,10);
						date = formatDate(date);
						$("#invoiceDate").html(date); 
						$("#invoiceHours").html(returnData.total_hours+"<span class='detail3Small'>hrs</span>"); // hours to invoice 
						var amount = 0;
						var change = ".00";
						var length = returnData.amount.toString().length;
						if(returnData.amount.toString().indexOf(".") >= 0)
							{
								amount = returnData.amount.toString().substring(0, length -3);
								change = "."+returnData.amount.toString().substring(length-2, length);
								if(change.indexOf("..") >= 0)
								{
									change = "."+returnData.total_cost.toString().substring(length-1, length)+"0";
								}
							}
							else
							{
								amount = returnData.amount;
							}
						$("#invoiceAmount").html("$"+amount +"<span class='detail3Small'>"+change+"</span>");  // invoice amount 
						$("#invoiceTravel").html("$"+returnData.travel_cost+"<span class='detail3Small'>.00</span>"); // travel expenses amount 
						var expenses = 0;
						if(returnData.expenses != null)
						{
							for(var i = 0; i < returnData.expenses.length; i++)
							{
								expenses = expenses + returnData.expenses[i].total;
							}
						}
						$("#invoiceExpenses").html("$"+expenses+"<span class='detail3Small'>.00</span>"); // expenses amount 
						$("#invoiceAdjustments").html("$0<span class='detail3Small'>.00</span>"); // adjustments 
						//$(".invoiceTotal").html("$"+returnData.total_cost+"<span class='detail3Small'>.00</span>");
						 length = returnData.total_cost.toString().length;
						if(returnData.total_cost.toString().indexOf(".") >= 0)
							{

								amount = returnData.total_cost.toString().substring(0, length -3); 
								change = "."+returnData.total_cost.toString().substring(length-2, length);
								if(change.indexOf("..") >= 0)
								{
									change = "."+returnData.total_cost.toString().substring(length-1, length)+"0";
								}
							}
							else
							{
								amount = returnData.total_cost;
							}
						$(".invoiceTotal").html("$"+amount+"<span class='detail3Small'>"+change+"</span>");
						$("#recipientList").empty();
						// add recipients to recipients list
						if(returnData.recipients != null){
						for(var x = 0; x < returnData.recipients.length; x++)
						{
							var email = $.md5(returnData.recipients[x].email);
							var insert = "<li><ul class='recipientDetail'><li><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=80'></li><li><div class='recipient'><p>"+returnData.recipients[x].email+"</p><img class='closeIcon' src='img/close_icon.png'></div></li></ul></li>";
							$(insert).appendTo("#recipientList");
						}
						} 
						// adds timelogs asscoited with this invoice to the invoice timelogs list 
						$("#invoiceLogs").empty();
						if(returnData.time_logs != null){
						for(var u = 0; u < returnData.time_logs.length; u++)
						{
							var name = returnData.time_logs[u].name;
							var log = returnData.time_logs[u].total;
							var date = formatDate(returnData.time_logs[u].date.substring(0,10));
							var logID = returnData.time_logs[u].id;
							var insert = "<li><ul id='invoiceTimelog' data-id='"+logID+"'  class='timelog'><li><div class='billable timeLogAddButton' data-id='"+logID+"'><div class='innerCircle billFill'></div></div></li><li><h2 class='feedName'>"+name+"</h2><p class='taskDescription'>"+date+"</p></li><li><img class='feedClock' src='img/clock_icon_small.png'><h3 class='feedTime'><span>"+log+"</span></h3></li></ul></li>";
							$(insert).appendTo("#invoiceLogs");
						}
						}
						if(returnData.recipients != null){
						$("#expensesList").empty();
						for(var c = 0; c < returnData.expenses.length; c++)
						{
							var name = returnData.expenses[c].name;
							var log = returnData.expenses[c].total;
							var date = formatDate(returnData.expenses[c].date.substring(0,10));
							var logID = returnData.expenses[c].id;
							var insert = "<li><ul id='invoiceExpense' class='timelog'><li><div class='billable timeLogAddButton' data-id='"+logID+"'><div class='innerCircle billFill'></div></div></li><li><h2 class='feedName'>"+name+"</h2><p class='taskDescription'>"+date+"</p></li><li><h3 class='feedTime expenceCost'><span>$"+log+"</span></h3></li></ul></li>";
							$(insert).appendTo("#expensesList");
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
					console.log("fail @ Invoice details");
					console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
					}
			});

		}
	};

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
    				url: 'http://api.sherpadesk.com/time/'+timeId,
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
    				url: 'http://api.sherpadesk.com/expenses'+timeId,
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
    				url: 'http://api.sherpadesk.com/expenses',
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
				console.log(techId);
				console.log(projectId);
				console.log(accountId);
				console.log(note);
				console.log(hours);
				$.ajax({
    				type: 'POST',
    				beforeSend: function (xhr) {
    				    xhr.withCredentials = true;
    				    xhr.setRequestHeader('Authorization', 
    				                         'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
    				    },
    				url: 'http://api.sherpadesk.com/time',
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
    				url: 'http://api.sherpadesk.com/invoices?status=unbilled&project=-1&account=-1&adjustments=-2.4&adjustments_note=my_note',
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

	// get a list of invoices both for a specific account as well as a complete list of invoices 
	var invoiceList = {
		init:function(){
			this.listInvoices();
		},

		listInvoices:function(){
			// go to list of account invoice on click 
			$("#invoiceOption").click(function(){
				window.location = "Invoice_List.html";
			});
			// go to complete list of invoice on click
			$("#allInvoice, #invoiceFooter").click(function(){
				window.location = "allInvoice_List.html";
			});
			// get list of invoices for a specific account 
			$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.sherpadesk.com/invoices?account="+localStorage.getItem("DetailedAccount"),
				dataType:"json",
				success: function(returnData) {
						$("#invoiceList").empty();
						console.log(returnData);
						// add invoice to list 
						for(var i = 0; i < returnData.length; i++)
						{
							var customer = returnData[i].customer; //account name 
							var date = returnData[i].date.substring(0,10);
							date = formatDate(date);
							// check account name for display purposes 
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
			// get complete invoice list for the entire orginization 
			$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.sherpadesk.com/invoices",
				dataType:"json",
				success: function(returnData) {
						console.log(returnData);
						$("#allInvoiceList").empty();
						for(var i = 0; i < returnData.length; i++)
						{	
							var customer = returnData[i].customer; // account name 
							var date = returnData[i].date.substring(0,10);
							// check account name for display purposes 
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

	// list tickets of the queue
	var getQueueTickets = {
		init:function() {
			this.queueTickets();
		},

		queueTickets:function() {
			$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.sherpadesk.com/queues/"+localStorage.getItem("currentQueue"),
				dataType:"json",
				success: function(returnData) {
						console.log(returnData);
						$("#queueTickets").empty();
						 for(var i = 0; i < returnData.length; i++) 
						 {	
						 	// get email for gravitar avitar 
							var email = $.md5(returnData[i].user_email);
							var intialPost = returnData[i].initial_post;
							var subject = returnData[i].subject;
							var data = returnData[i].key;
							//check subject length can be displayed correctly 
							if(subject.length > 19)
							{
								subject = subject.substring(0,16)+"...";
							}
							//check intial post length can be displayed correctly 
							if(intialPost.length > 100) 
							{
								intialPost = intialPost.substring(1,100);
							}
							var ticket = "<ul class='responseBlock' id='thisBlock' data-id="+data+"><li><p class='blockNumber numberStyle'>#"+returnData[i].number+"</p><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=80' class='TicketBlockFace'><span>"+returnData[i].user_firstname+"</span></li><li class='responseText'><h4>"+subject+"</h4><p class ='initailPost'>"+intialPost+"</p></li><li><p class='TicketBlockNumber'>"+returnData[i].class_name+"</p></li></ul>";
							
							$(ticket).appendTo("#queueTickets");
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

	// get complete queue list for the orginization for the Queues list page 
	var getQueues = {
		init:function() {
			this.queues();
		},

		queues:function() {
			$(document).on("click","#queue", function(){
				localStorage.setItem('currentQueue',$(this).attr("data-id"));
				window.location = "queueTickets.html";
			});
			$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.sherpadesk.com/queues",
				dataType:"json",
				success: function(returnData) {
						console.log(returnData);
						 $("#queuesPage").empty();
						 // add queues to the queues list 
						 for(var i = 0; i < returnData.length; i++)
						 {
						 	var insert = "<li><div id='queue' data-id="+returnData[i].id+" class='OptionWrapper'><h3 class='OptionTitle'>"+returnData[i].fullname+"</h3></div><div class='NotificationWrapper'><h2>"+returnData[i].tickets_count+"</h2></div></li>";
						 	$(insert).appendTo("#queuesPage");
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

	// Ajax calls to get open tickets for the app user, tickets include (as tech, as user, as alt tech, all tickets)
	var ticketList = {
		init:function() {
			this.userTickets();
			this.techTickets();
			this.altTickets();
			this.allTickets();
			this.ticketClick();
			
		},
		ticketClick:function() {
			$(document).on("click",".responseBlock", function(){
				localStorage.setItem('ticketNumber', $(this).attr("data-id")); //set local storage variable to the ticket id of the ticket block from the ticket list 
				window.location = "ticket_detail.html"; // change page location from ticket list to ticket detail list 
			});
		},
		//get tickets as tech
		techTickets:function() {
			$("#techContainer, #optionsConainer, #allContainer, #userContainer").empty();
			$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.sherpadesk.com/tickets?status=open&limit=500&role=tech",
				dataType:"json",
				success: function(returnData) {
						console.log(returnData);
						//add tickets as tech to as tech list 
						for(var i = 0; i < returnData.length; i++) 
						 {	
						 	// get email for gravitar avitar 
							var email = $.md5(returnData[i].user_email);
							var intialPost = returnData[i].initial_post;
							var subject = returnData[i].subject;
							var data = returnData[i].key;
							//check subject length can be displayed correctly 
							if(subject.length > 19)
							{
								subject = subject.substring(0,16)+"...";
							}
							//check intial post length can be displayed correctly 
							if(intialPost.length > 100) 
							{
								intialPost = intialPost.substring(1,100);
							}
							var ticket = "<ul class='responseBlock' id='thisBlock' data-id="+data+"><li><p class='blockNumber numberStyle'>#"+returnData[i].number+"</p><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=80' class='TicketBlockFace'><span>"+returnData[i].user_firstname+"</span></li><li class='responseText'><h4>"+subject+"</h4><p class ='initailPost'>"+intialPost+"</p></li><li><p class='TicketBlockNumber'>"+returnData[i].class_name+"</p></li></ul>";
							
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
		//get all tickets in this orginization 
		allTickets:function() {
			$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.sherpadesk.com/tickets?status=allopen&limit=500&query=all",
				dataType:"json",
				success: function(returnData) {
						console.log(returnData);
						//add tickets to the all section 
						for(var i = 0; i < returnData.length; i++) 
						 {	
						 	//get email for gravitar 
							var email = $.md5(returnData[i].user_email);
							var intialPost = returnData[i].initial_post;
							var subject = returnData[i].subject;
							var data = returnData[i].key;
							//check subject length 
							if(subject.length > 19)
							{
								subject = subject.substring(0,16)+"...";
							}
							//check initial post length
							if(intialPost.length > 100) 
							{
								intialPost = intialPost.substring(1,100);
							}
							var ticket = "<ul class='responseBlock' id='thisBlock' data-id="+data+"><li><p class='blockNumber numberStyle'>#"+returnData[i].number+"</p><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=80' class='TicketBlockFace'><span>"+returnData[i].user_firstname+"</span></li><li class='responseText'><h4>"+subject+"</h4><p class ='initailPost'>"+intialPost+"</p></li><li><p class='TicketBlockNumber'>"+returnData[i].class_name+"</p></li></ul>";
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

		// get alt tech tickets 
		altTickets:function() {
			$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.sherpadesk.com/tickets?status=open&limit=500&role=alt_tech",
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
							var ticket = "<ul class='responseBlock' id='thisBlock' data-id="+data+"><li><p class='blockNumber numberStyle'>#"+returnData[i].number+"</p><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=80' class='TicketBlockFace'><span>"+returnData[i].user_firstname+"</span></li><li class='responseText'><h4>"+subject+"</h4><p class ='initailPost'>"+intialPost+"</p></li><li><p class='TicketBlockNumber'>"+returnData[i].class_name+"</p></li></ul>";
							
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
		// get as user tickets
		userTickets:function() {
			$("maxSize").hide();
			$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.sherpadesk.com/tickets?status=open,onhold&limit=500&role=user",
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
							var ticket = "<ul class='responseBlock' id='thisBlock' data-id="+data+"><li><p class='blockNumber numberStyle'>#"+returnData[i].number+"</p><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=80' class='TicketBlockFace'><span>"+returnData[i].user_firstname+"</span></li><li class='responseText'><h4>"+subject+"</h4><p class ='initailPost'>"+intialPost+"</p></li><li><p class='TicketBlockNumber'>"+returnData[i].class_name+"</p></li></ul>";
							
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

	//get a complete list of accounts attached to the orginizations
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

				url:"http://api.sherpadesk.com/accounts",
				dataType:"json",
				success: function(returnData) {
						console.log(returnData);
						$("#fullList").empty();
						//add accounts to accountList
						var name = null;
						for(var i = 0; i < returnData.length; i++) 
						{	
							 name = returnData[i].name;
							if(name.length > 16){
								name = name.substring(0,14)+"...";
							}
							// check the number of open tickets for the account if the number of tickets is greater than 100 sub 99+
							var openTks = returnData[i].account_statistics.ticket_counts.open;
							if( openTks > 99)
							{
								openTks = "99<sup>+</sup>";
								var insert = "<ul class='listedAccount' data-id="+returnData[i].id+"><li>"+name+"</li><li><div class='tks toManyTks'>"+openTks+"</div></li></ul>";
								$(insert).appendTo($("#fullList"));
							}
							// else add account and number of tickets normally to the list 
							else
							{
							var insert = "<ul class='listedAccount' data-id="+returnData[i].id+"><li>"+name+"</li><li><div class='tks'>"+openTks+"</div></li></ul>";
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

	// get complete list of timelogs for the orginization 
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

				url:"http://api.sherpadesk.com/time?limit=200",
				dataType:"json",
				success: function(returnData) {
						console.log(returnData);
						$("#timelogs").empty();
						//add timelogs to list 
						for(var i = 0; i < returnData.length; i++)
						{
							//get users email for gravitar 
							var email = $.md5(returnData[i].user_email);
							var text = returnData[i].note;
							//check to see if hours are has a decimal 
							var hours = returnData[i].hours;
							hours =hours.toString();
							if(hours.indexOf(".") >= 0)
							{
								// do nothing 
							}
							else 
							{
								hours = hours+".00";
							}
							// check text length 
							if(text.length > 18) 
							{
								text = text.substring(0,18)+"...";
							}
							var nameCheck = returnData[i].user_name;
							if(nameCheck.length > 15)
							{
								nameCheck = nameCheck.substring(0,12)+"..."
							}
							var log = "<li><ul class='timelog'> <li><img class='timelogProfile' src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=80'></li><li><h2 class='feedName'>"+nameCheck+"</h2><p class='taskDescription'>"+text+"</p></li><li><img class='feedClock'src='img/clock_icon_small.png'><h3 class='feedTime'><span>"+hours+"</span></h3></li></ul></li>";
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


	// calls and methods to propagate the account details page 
	var accountDetailsPageSetup = {
		init:function() {
			this.clickedAccount();
			this.pageSetup();
		},
		// when an account is clicked from the active accounts list & account list page, save the account id & set window location to account_details.html
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

				url:"http://api.sherpadesk.com/accounts/"+localStorage.getItem("DetailedAccount"),
				dataType:"json",
				success: function(returnData) {
					console.log(returnData);
					//update numbers of notification tickers (open tickets / invoices / Times)
					$("#AD").html(returnData.name);
					$("#ticketsOptionTicker").html(returnData.account_statistics.ticket_counts.open);
					$("#invoiceOptionTicker").html(returnData.invoices);
					$("#timesOptionTicker").html(returnData.timelogs);
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
			// get the open tickets for the account and list them in the open tickets list 
			$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.sherpadesk.com/tickets?status=open&account="+localStorage.getItem("DetailedAccount"),
				dataType:"json",
				success: function(returnData) {
					$(".AccountDetailsTicketsContainer").empty(); 
					//insert open tickets
					for(var i = 0; i < returnData.length; i++) 
					{	
						// get email value for gravatar 
						var email = $.md5(returnData[i].user_email);
						var initialPost = returnData[i].initial_post;
						var subject = returnData[i].subject;
						//the key for this specific ticket
						var data = returnData[i].key;
						// ensure ticket subject length is not to long to be displayed (subject is elipsed if it is)
						if(subject.length > 19)
						{
							subject = subject.substring(0,16)+"...";
						}
						// ensure ticket initial post length is not to long to be displayed (initial post is elipsed if it is)
						if(initialPost.length > 50) 
						{
							initialPost = initialPost.substring(0,50);
						}
						var ticket = "<ul class='responseBlock' id='thisBlock' data-id="+data+"><li><p class='blockNumber numberStyle'>#"+returnData[i].number+"</p><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=80' class='TicketBlockFace'><span>"+returnData[i].user_firstname+"</span></li><li class='responseText'><h4>"+subject+"</h4><p class ='initailPost'>"+initialPost+"</p></li><li><p class='TicketBlockNumber'>"+returnData[i].class_name+"</p></li></ul>";
						$(ticket).appendTo(".AccountDetailsTicketsContainer");
					}
				
					},
				error: function() {
					console.log("fail @ accounts");
					console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
					}
			});
		}

	};

	// get timeLogs for a specific account 
	var accountTimeLogs = {
		init:function(){
			this.getTimeLogs();
		},

		getTimeLogs: function () {
		    var accountId = localStorage.getItem("DetailedAccount");
		    if (!accountId)
		        accountId = -1;
			$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

			url: "http://api.sherpadesk.com/time?account=" + accountId,
				dataType:"json",
				success: function(returnData) {
						console.log(returnData);
						$("#accountLogs").empty();
						//add timelogs to log list 
						for(var i = 0; i < returnData.length; i++)
						{
							var email = $.md5(returnData[i].user_email);
							var text = returnData[i].note;
							// check for two decimals 
							var hours = returnData[i].hours;
							hours =hours.toString();
							if(hours.indexOf(".") >= 0)
							{
								// do nothing 
							}
							else 
							{
								hours = hours+".00";
							}
							// ensure text attached to the time log is short enough to be displayed correctly 
							if(text.length > 15) 
							{
								text = text.substring(0,7)+"...";
							}
							var nameCheck = returnData[i].user_name;
							if(nameCheck.length > 15)
							{
								nameCheck = nameCheck.substring(0,12)+"..."
							}
							var log = "<li><ul class='timelog'> <li><img class='timelogProfile' src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=80'></li><li><h2 class='feedName'>"+nameCheck+"</h2><p class='taskDescription'>"+text+"</p></li><li><img class='feedClock'src='img/clock_icon_small.png'><h3 class='feedTime'><span>"+hours+"</span></h3></li></ul></li>";
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

	// store user variables into local storage 
	var storeLocalData = function() {
		localStorage.setItem('userOrgKey',userOrgKey);
		localStorage.setItem('userOrg',userOrg);
		localStorage.setItem('userInstanceKey',userInstanceKey);
		localStorage.setItem('userKey',userKey);
	};

	// get the counts for open tickets (as tech, alt tech, user) and updates the ticket banner on the dashboard
	var getTicketCount = function() {
		$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.sherpadesk.com/tickets/counts",
				dataType:"json",
				success: function(returnData) {
					var allTickets = returnData.open_all;
					//if ticket count is greater than 100 sub 99+
					if(allTickets > 100){
						allTickets = "99<sup>+</sup>";
						$("all").addClass("toManyTks");
					}
					// update each notification ticker on the dashboard
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

    //get instance config 
	var getInstanceConfig = function (_userOrgKey, _userInstanceKey) {
	    if (!_userOrgKey || !_userInstanceKey) {
	        _userOrgKey = localStorage.getItem('userOrgKey');
	        _userInstanceKey = localStorage.getItem('userInstanceKey');
	    }
	    if (!_userOrgKey || !_userInstanceKey) {
	        return;
	    }
	    //get instance config 
	    $.ajax({
	        type: 'GET',
	        beforeSend: function (xhr) {
	            xhr.withCredentials = true;
	            xhr.setRequestHeader('Authorization',
                          'Basic ' + btoa(_userOrgKey + '-' + _userInstanceKey + ':' + localStorage.getItem("userKey")));
	        },

	        url: "http://api.sherpadesk.com/config",
	        dataType: "json",
	        success: function (returnData) {
	            localStorage.setItem('userRole', returnData.user.is_techoradmin ? "tech" : "user");
	            localStorage.setItem('projectTracking', returnData.is_project_tracking);
	            localStorage.setItem('timeTracking', returnData.is_time_tracking);
	            localStorage.setItem('freshbooks', returnData.is_freshbooks);
	            if (localStorage.getItem('userRole') == "tech")
	                window.location = "dashboard.html";
	            else
	                window.location = "ticket_list.html";
	        },
	        complete: function () {

	        },
	        error: function () {
	            console.log("fail @ config");
	        }
	    });
	};

	// get queues for the organization and list a max of 3 to the dashboard 
	var getQueueList = function() {
		$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.sherpadesk.com/queues?sort_by=tickets_count",
				dataType:"json",
				success: function(returnData) {
					console.log(returnData);
						$("#DashBoradQueues").empty();
						
						for( var i = 0; i < 3; i++)
						{
							var insertQueue = "<li id='queue' data-id="+returnData[i].id+"><div class='OptionWrapper'><h3 class='OptionTitle'>"+returnData[i].fullname+"</h3></div><div class='NotificationWrapper'><h2>"+returnData[i].tickets_count+"</h2></div></li>";
        					$(insertQueue).prependTo("#DashBoradQueues");					
						}

					},
					complete:function(){
					
				},
				error: function() {
					console.log("fail");
					console.log(userOrgKey + '-' + userInstanceKey +':'+userKey);(userOrg);
					}

		});
	};

	//get accounts that have open tickets and list them in active accounts container on the Dashboard
	var getActiveAccounts = function() {
		$(document).on("click",'.tableRows, .listedAccount', function(){
				localStorage.setItem('DetailedAccount',$(this).attr("data-id"));
				window.location = "account_details.html";
			});
		$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.sherpadesk.com/accounts?query=account_statistics.ticket_counts.open>0",
				dataType:"json",
				success: function(returnData) {
					$("#activeList").empty();
					//insert for  the header of the active account table 
					var tableHeader = "<ul class='tableHeader'><li></li><li>Hours</li><li>Expense</li><li>Tickets</li></ul>";
					$(tableHeader).prependTo("#activeList");
					console.log(returnData);
					//add accounts to the active accounts list 
					var activeLength = returnData.length;
					if(returnData.length > 7){activeLength = 7;}
					for (var i = 0; i < activeLength; i++)
					{
						var openTickets = returnData[i].account_statistics.ticket_counts.open;
						// if account has more than 100 open tickets then sub 99+
						if(openTickets > 100)
						{
							if(returnData[i].name.length > 9){
								openTickets = "99<sup>+</sup>";
								var activeAccount = "<ul class='tableRows clickme' data-id="+returnData[i].id+"><li>"+returnData[i].name.substring(0,8)+"..."+"</li><li>"+returnData[i].account_statistics.timelogs+"</li><li>"+returnData[i].account_statistics.invoices+"</li><li><div class='tks1 toManyTksSmall' >"+openTickets+"</div></li></ul>";
								$(activeAccount).appendTo("#activeList");
							}else{
						    openTickets = "99<sup>+</sup>";
							var activeAccount = "<ul class='tableRows clickme' data-id="+returnData[i].id+"><li>"+returnData[i].name+"..."+"</li><li>"+returnData[i].account_statistics.timelogs+"</li><li>"+returnData[i].account_statistics.invoices+"</li><li><div class='tks1 toManyTks' >"+openTickets+"</div></li></ul>";
							$(activeAccount).appendTo("#activeList");
							}
						}
						//if account name is longer than 9 chars then elipse the account name 
						else if(returnData[i].name.length > 9) {
							var activeAccount = "<ul class='tableRows clickme' data-id="+returnData[i].id+"><li>"+returnData[i].name.substring(0,8)+"..."+"</li><li>"+returnData[i].account_statistics.timelogs+"</li><li>"+returnData[i].account_statistics.invoices+"</li><li><div class='tks1' >"+openTickets+"</div></li></ul>";
						$(activeAccount).appendTo("#activeList");
						}else{
							var activeAccount = "<ul class='tableRows' data-id="+returnData[i].id+"><li>"+returnData[i].name+"</li><li>"+returnData[i].account_statistics.timelogs+"</li><li>"+returnData[i].account_statistics.invoices+"</li><li><div class='tks1' >"+openTickets+"</div></li></ul>";
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

				url:"http://api.sherpadesk.com/users?query="+localStorage.getItem('userName'),
				dataType:"json",
				success: function(returnData) {
					console.log(returnData);
					//set the name of the nav side menu 
					$(".navName").html(returnData[0].firstname+" "+returnData[0].lastname);
					//get md5 value of users email for gravatar 
					var email = $.md5(returnData[0].email);
					//set user avatar picture in side menu
					$(".navProfile").attr("src","http://www.gravatar.com/avatar/" + email + "?d=mm&s=80");
					//set user id to local storage
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

	var userInfo = {
		init:function() {
			this.userData();
		},
		userData:function() {
			//get user info 
		$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.sherpadesk.com/users?query="+localStorage.getItem('userName'),
				dataType:"json",
				success: function(returnData) {
					console.log(returnData);
					//set the name of the nav side menu 
					$(".navName").html(returnData[0].firstname+" "+returnData[0].lastname);
					//get md5 value of users email for gravatar 
					var email = $.md5(returnData[0].email);
					//set user avatar picture in side menu
					$(".navProfile").attr("src","http://www.gravatar.com/avatar/" + email + "?d=mm&s=80");
					//set user id to local storage
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

			//get instance config 
	var getInstanceConfig = function (_userOrgKey, _userInstanceKey) {
	    if (!_userOrgKey || !_userInstanceKey) {
	        _userOrgKey = localStorage.getItem('userOrgKey');
	        _userInstanceKey = localStorage.getItem('userInstanceKey');
	    }
	    if (!_userOrgKey || !_userInstanceKey) {
	        return;
	    }
	    //get instance config 
	    $.ajax({
	        type: 'GET',
	        beforeSend: function (xhr) {
	            xhr.withCredentials = true;
	            xhr.setRequestHeader('Authorization',
                          'Basic ' + btoa(_userOrgKey + '-' + _userInstanceKey + ':' + localStorage.getItem("userKey")));
	        },

	        url: "http://api.sherpadesk.com/config",
	        dataType: "json",
	        success: function (returnData) {
	            localStorage.setItem('userRole', returnData.user.is_techoradmin ? "tech" : "user");
	            localStorage.setItem('projectTracking', returnData.is_project_tracking);
	            localStorage.setItem('timeTracking', returnData.is_time_tracking);
	            localStorage.setItem('freshbooks', returnData.is_freshbooks);
	            if (localStorage.getItem('userRole') == "tech")
	                window.location = "dashboard.html";
	            else
	                window.location = "ticket_list.html";
	        },
	        complete: function () {

	        },
	        error: function () {
	            console.log("fail @ config");
	        }
	    });
	};
		}

	};
	
	// organization Ajax call 
	var org = {
	    init: function () {
	        if (location.pathname.indexOf("org.html") < 0)
	            return;
	        $('.instSelect').hide();
	        userKey = localStorage.getItem("userKey");
	        if (!userKey)
	        {
	            window.location = "index.html";
	            return;
	        }
	        userOrgKey = localStorage.getItem('userOrgKey');
	        userInstanceKey = localStorage.getItem('userInstanceKey');
	        if (userOrgKey && userInstanceKey)
	        {
	            window.location = "dashboard.html";
	            return;
	        }
	        this.getOrg();
	        //sets user role to user in local storage 
	        localStorage.setItem('userRole', "user");
	        //hide load screen
		},

		getOrg: function() {
		    userKey = localStorage.getItem("userKey");
			$.ajax({
				type: 'GET',
				beforeSend: function (xhr) {
					xhr.withCredentials = true;
					xhr.setRequestHeader('Authorization', 'Basic ' + btoa('x:' + userKey));
					},
				url: 'http://api.sherpadesk.com/organizations/',
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
                                .attr("value", i)
                                .text(orglistitem[i].name));
					    }
					    $('#orgSelect')
                        // listen for org selection	
                            .change(function () {
                                var index_number = this.value;
                                userOrgKey = results[index_number].key;
                                userOrg = results[index_number].name;
                                var instances = results[index_number].instances;
                                localStorage.setItem('userOrgKey', userOrgKey);

                                // If there is only one instance on the selected org								
                                if (instances.length == 1) {
                                    userInstanceKey = instances[0].key;
                                    localStorage.setItem('userInstanceKey', userInstanceKey);
                                    getInstanceConfig(userOrgKey, userInstanceKey);
                                }
                                else {
                                    // If there is MORE than one instance on the selected org
                                    $('#instSelect').find('option:gt(0)').remove();
                                    for (var i = 0; i < instances.length; i++) {
                                        $('#instSelect')
                                            .append($("<option></option>")
                                            .attr("value", i)
                                            .text(instances[i].name));
                                    }
                                    $('.instSelect').show();
                                    // listen for Instance selection	
                                    $('#instSelect').change(function () {
                                        var userInstanceKey = instances[this.value].key;
                                        localStorage.setItem('userInstanceKey', userInstanceKey);
                                        localStorage.setItem('sd_is_MultipleOrgInst', 'true');
                                        getInstanceConfig(userOrgKey, userInstanceKey);
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
					        getInstanceConfig(userOrgKey, userInstanceKey);
					    }
					    else {
					        // If there is MORE than one instance on the selected org
					        $('#instSelect').find('option:gt(0)').remove();
					        for (var i = 0; i < instances.length; i++) {
					            $('#instSelect')
                                    .append($("<option></option>")
                                    .attr("value", i)
                                    .text(instances[i].name));
					        }
					        $('.instSelect').show();
					        // listen for Instance selection	
					        $('#instSelect').change(function () {
					            userInstanceKey = instances[this.value].key;
					            localStorage.setItem('userInstanceKey', userInstanceKey);
					            localStorage.setItem('sd_is_MultipleOrgInst', 'true');
                                getInstanceConfig(userOrgKey, userInstanceKey);
					        });
					    };
					};
					
				    $("#indexTitle").html(userOrg);
				    //storeLocalData();
				    //window.location = "index.html";
				},
				complete: function () {
				    userOrgKey = localStorage.getItem('userOrgKey');
				    userInstanceKey = localStorage.getItem('userInstanceKey');
				    if (!userOrgKey || !userInstanceKey) {
				        reveal();
				    }
				},
				error: function() {
					console.log("fail @ getOrg");
				  clearStorage();
				  window.location = "index.html";
				}
			}).promise();

		}
	};

	var miscClicks = {
		init:function() {
			this.justClicked();
		},

		justClicked:function() {
			$(document).on("click",".responseBlock", function(){
				localStorage.setItem('ticketNumber', $(this).attr("data-id")); //set local storage variable to the ticket id of the ticket block from the ticket list 
				window.location = "ticket_detail.html"; // change page location from ticket list to ticket detail list 
			});
			$("#invoiceOption").click(function(){
				window.location = "Invoice_List.html";
			});
			// go to complete list of invoice on click
			$("#allInvoice, #invoiceFooter").click(function(){
				window.location = "allInvoice_List.html";
			});
			$(document).on("click",".invoiceRows", function(){
				localStorage.setItem('invoiceNumber',$(this).attr("data-id"));
				window.location = "invoice.html";
			});
			$(document).on("click",'.tableRows, .listedAccount', function(){
				localStorage.setItem('DetailedAccount',$(this).attr("data-id"));
				window.location = "account_details.html";
			});
			$(document).on("click",".responseBlock", function(){
				localStorage.setItem('ticketNumber', $(this).attr("data-id")); //set local storage variable to the ticket id of the ticket block from the ticket list 
				window.location = "ticket_detail.html"; // change page location from ticket list to ticket detail list 
			});
		}
	};

	var userMessage = {
		init:function() {
			this.showMessage();
		},
		showMessage:function() {
				
  				var isMessage = localStorage.getItem("isMessage");
  				if(isMessage == "truePos")
  				{
  				var messageText = localStorage.getItem("userMessage");
  				$(".errorMessagePos").html(messageText);
  				$(".errorMessagePos").slideDown(100);
  				setTimeout(
  					function() 
  					{	
  						$(".errorMessagePos").slideUp(100);
  						localStorage.setItem("isMessage","false");
  				  		
  					}, 3500);
  				}
  				if(isMessage == "trueNeg")
  				{
  				var messageText = localStorage.getItem("userMessage");
  				$(".errorMessageNeg").html(messageText);
  				$(".errorMessageNeg").slideDown(100);
  				setTimeout(
  					function() 
  					{	
  						$(".errorMessageNeg").slideUp(100);
  						localStorage.setItem("isMessage","false");
  				  		
  					}, 3500);
  				}
			
		}
	};
	

	//Main Method that calls all the functions for the app
	(function () {
		//always active api calls
		userMessage.init();
	    UserLogin.init();
	    org.init();
	    signout.init();
	    userInfo.init();
	    
	    //conditional api calls determined by page 
	    if (location.pathname.indexOf("dashboard.html") >= 0)
	    {
	        getTicketCount();
	        getQueueList();
	        getActiveAccounts();
	        reveal();
	    }
	    if (location.pathname.indexOf("account_details.html") >= 0)
	    {
	        accountDetailsPageSetup.init();
	        detailedTicket.init();
	        
	    }
	    if (location.pathname.indexOf("ticket_list.html") >= 0)
	    {
	        ticketList.init();
	        accountDetailsPageSetup.init();
	        
	    }
	    if (location.pathname.indexOf("Account_List.html") >= 0)
	    {
	        accountList.init();
	        
	    }
	    if (location.pathname.indexOf("timelog.html") >= 0)
	    {
	        accountTimeLogs.init();
	        timeLogs.init();
	    }
	    if (location.pathname.indexOf("accountTimes.html") >= 0)
	    {
	        accountTimeLogs.init();
	        timeLogs.init();
	    }
	    if (location.pathname.indexOf("ticket_detail.html") >= 0)
	    {
	        detailedTicket.init();
	    }
	    if (location.pathname.indexOf("Queues.html") >= 0)
	    {
	        getQueues.init();
	    }
	    if (location.pathname.indexOf("queueTickets.html") >= 0)
	    {
	        getQueueTickets.init();
	    }
	    if (location.pathname.indexOf("invoice_List.html") >= 0)
	    {
	       invoiceList.init();
	    }
	    if (location.pathname.indexOf("allInvoice_List.html") >= 0)
	    {
	       invoiceList.init();
	    }
	    if (location.pathname.indexOf("invoice.html") >= 0)
	    {
	       detailedInvoice.init();
	    }
	    if (location.pathname.indexOf("closedTickets.html") >= 0)
	    {
	       detailedTicket.init();
	    }
	    //getTicketCount();
	    //getQueueList();
	    //getActiveAccounts();
	    //reveal();
	    newTicket.init();
	    pickUpTicket.init();
	    closedTickets.init();
	    //getQueueTickets.init();
	    transferTicket.init();
	    closeTicket.init();
	    //accountTimeLogs.init();
	    sendInvoince.init();
	    addRecip.init();
	    // accountDetailsPageSetup.init();
	    search.init();
		//detailedTicket.init();
		//ticketList.init();
		//getQueues.init();
		//accountDetailsPageSetup.init();
		//timeLogs.init();
		//accountList.init();
		//invoiceList.init();
		//detailedInvoice.init();
		addTime.init();
		postComment.init();
		//updateInvoice.init();
	}()); 
	

});
