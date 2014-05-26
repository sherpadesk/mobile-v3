//var iPad = /iPad/i.test(navigator.userAgent);
//var android = /android/i.test(navigator.userAgent);

//Disable all animation on iPhone less iPhone5
$.fx.off = /iPhone/i.test(navigator.userAgent) && !(window.screen.height == (1136 / 2));

//Root Names
var Site = 'beta.sherpadesk.com/';
var MobileSite = 'http://m.sherpadesk.com/beta/';//'http://localhost:7702;//
var AppSite = 'http://app.'+Site;

var ApiSite = 'http://api.'+Site;//'http://localhost:81'; // http://api.beta.'+Site;

//Phonegap specific
var isPhonegap = false;
var isOnline = true;


document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
       isPhonegap = true;
       //If User is Offline....................................
      /* document.addEventListener("offline",function(){ 
	   if (!$("#offline").length) {
				 $('body').prepend('<div id=offline>offline</div><div class="catch-error"><div class="catch-error-description"><h2>Check your internet connection!</h2><div id="ctl00_PageBody_StackTrace" class="return-button"><p /><p /><h4>P.S.  Uh... a Yeti just attacked your  camp!</h4></div></div>');
				 $("#offline").show();
				 isOnline = false;
			 } 
         },false);
       document.addEventListener("online",function(){ $("#offline").hide(); isOnline = true; window.open(MobileSite + "index.html", "_self"); },false);
    */};
   


	function onOffline() {
/*		 if (isPhonegap) 
			window.open("error.html", "_self"); 
		 else
			document.location.href= 'error.html'; 
	*/	}
    
//End Phonegap specific

function cleanQuerystring() {
var clean_uri = location.protocol + "//" + location.host + location.pathname;
window.history.replaceState({}, document.title, clean_uri);
}

// ---- SHERPADESK OBJECT LEGEND -----
// 01 - init - Initialization
// 02 - getSherpaDesk - Global ajax request
// 03 - getConfig - Global config options / Set init landing page
// 04 - getLogin
// 05 - getOrgs - Retrieves orgs and instances
// 06 - getOrgInst - Parses org inst selection
// 07 - getComments - Get comments for a single ticket
// 08 - postComments - Post a comment
// 09 - getTickets - Get list of tickets
// 10 - getTicketQueues - Get ticket ques and counts
// 11 - getAccounts - Get a list of accounts
// 12 - getTicketDetail - Get ticket Detail
// 13 - getTicketDetailTransfer - Transfer ticket inside of ticket detail
// 14 - postTicketDetailTransfer - Post transfer
// 15 - postTicketDetailPickup - Post pickup ticket
// 16 - getTicketDetailClose - Get close ticket in ticket detail
// 17 - postTicketDetailClose - Post ticket close
// 18 - getTicketDetailResponse - Get ticket detail response
// 19 - postTicketDetailResponse - Post ticket detial response
// 20 - getTicketDetailEdit - Get ticket detail edit - account/class/level/priority
// 21 - updateTicketDetailEdit - update Edit from Ticket Detail
// 22 - getTicketDetailAddTime - Add time in ticket deail- not in responses
// 23 - postTicketDetailAddTime - Post ticket detail time - not in responses
// 24 - getTimeRollRecent - Time Roll
// 25 - getTimeRollAddTime - Get add time from time roll
// 26 - postTimeRollAddTime - Post time from time roll
// 27 - addTicket - Add ticket from dash/ticket list
// 28 - postNewTicket - Post new ticket
// 29 - getDashboard - Get the dashboard
////////////////////////////////////////////////////////////////////////////
// Show Medthods -- handlebars maps ---- note need to consolidate some
////////////////////////////////////////////////////////////////////////////
// 30 - showLogin
// 31 - showOrg
// 32 - showInst
// 33 - showDashboard
// 34 - showAccounts
// 35 - showProjects
// 36 - showTechs
// 37 - showLevels
// 38 - showPriorities
// 39 - showClasses
// 40 - showSubClass1
// 41 - showSubClass2
// 42 - showTaskTypes
// 43 - showTicketHeader
// 44 - showTicketList
// 45 - showTicketListAppend
// 46 - showQueueList
// 47 - showQueueTicketList
// 48 - showResponses
// 49 - showTicketDetHeader
// 50 - showTicketDetContent
// 51 - showTicketInfo
// 52 - showTimeLogs
// 53 - showAddTicket
// 54 - showTicketDetResponse
// 55 - showTicketDetAddTime
// 56 - showTimeRollAddTime
// 57 - showTicketDetEdit
// 58 - showTransfer
// 59 - showTicketClose
// 60 - showAccountsList
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

var SherpaDesk = {
    
	init: function(){
		//cache config	
		var configPass = {			
			apiKey: localStorage.sd_api_key,
			org: localStorage.sd_org_key,
			inst: localStorage.sd_inst_key,
			role: localStorage.sd_user_role,
			url: ApiSite
			}; 

		//If !api_key then show login 
		if (configPass.apiKey == '' || configPass.apiKey == null) {
		    var key = getParameterByName('t');
		    var email = getParameterByName('e');
		        if (key) {
		            cleanQuerystring();
		            localStorage.setItem('is_google', true);
		            localStorage.setItem('sd_api_key', key);
		            localStorage.setItem('sd_user_email', email);
		            configPass.pass = '';
		            configPass.apiKey = key;
		            SherpaDesk.getOrgInst(configPass);
		        }
		        else {
		            SherpaDesk.showLogin();
		            checkLogin(configPass);
		            var error = getParameterByName('f');
		            if (error) {
		                cleanQuerystring();
		                addAlert("danger", error);
		            }
		        }
			} else
		if (configPass.org == '' || configPass.inst == '' || configPass.org == null || configPass.inst == null){				
				SherpaDesk.getOrgInst(configPass);				
			} else {
				//$("body").empty().removeClass("login").addClass('spinner');
				$("body").removeClass("login");
				SherpaDesk.getConfig(configPass);				
			};       			
		}, //End init
		
	//Global AJAX request
	getSherpaDesk: function(config, method, apimethod, data){	
    /*if (!isOnline)	{if (!$("#offline").length) $('body').prepend('<div id=offline>offline</div><div class="catch-error"><div class="catch-error-description"><h2>Check your internet connection!</h2><div class="return-button"><p /><p /><h4>P.S.  Uh... a Yeti just attacked your  camp!</h4></div></div>');
         $("#offline").show();}*/
		if(config.user && config.pass)	{var header = config.user + ':' + config.pass;} 
										else 
										{var header = config.org + '-' + config.inst + ':' + config.apiKey;};		
		var url = config.url;
		var limit = ""; 
		if( apimethod ){var methodType = apimethod;} 
    	else {var methodType = 'GET'; 
          if (method.indexOf("limit") < 0) 
          {
           	if (method.indexOf("?") != -1) limit = "&"; else limit = "?"; 
           	limit += "limit=200";
          }
        };  
        return $.ajax({
            type: methodType,
            beforeSend: function (xhr) {
                xhr.withCredentials = true;
                xhr.setRequestHeader('Authorization', 'Basic ' + btoa(header));
                },
            url: url + method + limit,
            cache: false,
            data: data, 
            dataType: 'json'   
		}).promise();
		
		},
		
	//Set Config Options
	getConfig: function(configPass){
		SherpaDesk.getSherpaDesk(configPass, 'config')
			.then(
				function(results){
					localStorage.setItem('sd_currentUser_id', results.user.user_id);
					localStorage.setItem('sd_tech_admin', results.user.is_techoradmin);
					localStorage.setItem('sd_is_project_tracking', results.is_project_tracking);
					localStorage.setItem('sd_is_time_tracking', results.is_time_tracking);
					localStorage.setItem('sd_is_freshbooks', results.is_freshbooks);				
				},
				function(results){
					console.log("There was a problem retrieving config options.");
					localStorage.clear();
					console.log("We have cleared the local storage and re-initialized the app.");
					SherpaDesk.init();
				}
			).done(
				function (results) {
				    var key = getParameterByName('ticket');
				    if (key) {
				        cleanQuerystring();
				        SherpaDesk.getTicketDetail(configPass, key);
				    }

				    else {
				        //SherpaDesk.getTickets(configPass);

				        // -------------------------------------------------------
				        // ----------  Set initial landing page	------------------
				        // -------------------------------------------------------					
				        SherpaDesk.getDashboard(configPass);
				    }
				}
			);
		},
		
	getLogin: function(config, user, pass){
		
		var method = 'login';
			config.user = user;
			config.pass = pass;
		var apimethod = 'POST';
		var login = SherpaDesk.getSherpaDesk(config, method, apimethod);
		login.then(
			//success
			function(results){
				localStorage.setItem('sd_api_key', results.api_token);	
				localStorage.setItem('sd_user_email', config.user);	
				config.pass = '';
				config.apiKey = results.api_token;
				SherpaDesk.getOrgInst(config);
			},
			//failed	
			function (results) {
			    console.log(user);
			    if (user && user.indexOf("@gmail.com") != -1)
			        addAlert("error", "If you are attempting to login with a google account, please do not type your google password, click the 'Login as Google' button, it is more secure.");
			    else
			        addAlert("error", "There was a problem with your login.  Please try again.");
			}
			);
		},
	//AJAX request for just ORGS -- need to refactor this into global	
	getOrgs: function(url, apikey){
		return $.ajax({
				type: 'GET',
				beforeSend: function (xhr) {
					xhr.withCredentials = true;
					xhr.setRequestHeader('Authorization', 'Basic ' + btoa('x:' + apikey));
					},
				url: url,
				async: true,
				cache: false,
				dataType: 'json',			
			}).promise();
		},	
	
	getOrgInst: function(config){
		// Remove error notice if there is one.
		$('div.showalert').empty();
		
		var orgSetup = SherpaDesk.getOrgs(config.url + 'organizations', config.apiKey);
		
		orgSetup.then(function(results){
					
				//initialize user state
				localStorage.setItem('sd_user_role', 'user');
								
				// If there are more than one org
				if (results.length > 1) {
					localStorage.setItem('sd_is_MultipleOrgInst', 'true');
					var orglistitem = results;
					SherpaDesk.showOrg(orglistitem);							
					$('select#orgs')					
					// listen for org selection	
						.change(function(){
							var index_number = this.value;
							var orgkey = results[index_number].key;
							var instances = results[index_number].instances;
							localStorage.setItem('sd_org_key', orgkey);	
							
							// If there is only one instance on the selected org								
							if (instances.length == 1){
									instkey = instances[0].key;
									localStorage.setItem('sd_inst_key', instkey);
									$("body").empty().addClass('spinner');
									SherpaDesk.init();
									//location.reload(true);
								} 
							else {
							// If there is MORE than one instance on the selected org
									SherpaDesk.showInst(instances);
									// listen for Instance selection	
				  					$('select#inst').change(function(){
										var instkey = instances[this.value].key;
				  						localStorage.setItem('sd_inst_key', instkey);
				  						localStorage.setItem('sd_is_MultipleOrgInst', 'true');
				  						$("body").empty().addClass('spinner');
				  						SherpaDesk.init();
				  						//location.reload(true);
				  						});
								};
						});
					};// End > 1 
					
				// If there is ONLY ONE org and instance
				if (results.length == 1){
					var myorg = results[0].key;
					localStorage.setItem('sd_org_key', myorg);
					localStorage.setItem('sd_is_MultipleOrgInst', 'false');
					//location.reload(true);
					var myinst = results[0].instances;
					// If there is only one instance on the selected org								
							if (myinst.length == 1){
									instkey = myinst[0].key;
									localStorage.setItem('sd_inst_key', instkey);
									$("body").empty().addClass('spinner');
									SherpaDesk.init();
									//location.reload(true);
								} 
							else {
							// If there is MORE than one instance on the selected org
									SherpaDesk.showInst(myinst);
									// listen for Instance selection	
				  					$('select#inst').change(function(){
										var instkey = myinst[this.value].key;
				  						localStorage.setItem('sd_inst_key', instkey);
				  						localStorage.setItem('sd_is_MultipleOrgInst', 'true');
				  						$("body").empty().addClass('spinner');
				  						SherpaDesk.init();
				  						//location.reload(true);
				  						});
								};					
				};	
			},//End orgSetup Success
			function () {
			    console.log("There was a problem retrieving organizations.");
			    localStorage.clear();
			    console.log("We have cleared the local storage and re-initialized the app.");
			    SherpaDesk.init();
				//addAlert("error", "Great Merciful Crap!!  Something has gone horribly wrong.");
			}//End orgSetup Error
			);//End orgSetup	
		},	
		
		
	getComments : function(config, key){				
		var method = 'tickets/' + key;
		var comments = SherpaDesk.getSherpaDesk(config, method);
		
		comments.then(function(results){
				SherpaDesk.showResponses(results, key);
			});
		comments.done(function(results){				
				$('p.res_gravatar').each(function(){
					var email = $.MD5($(this).data('email'));
					if ( $(this).is(':empty') ){
						$(this).append('<img src="http://www.gravatar.com/avatar/' + email + '?d=mm&s=30" />');
					};
				});
				fromDate("p.note_time");
				
				if (results.attachments !== null && results.attachments.length > 0 ){
					getCommentImages(results.attachments);
					};
											
			});
		},
	postComments: function(config, key, response){	
		$('.tkt_actions .tkt_add_response button.add_response').text('').addClass('buttonSpinner');
		var method = 'tickets/' + key + '/posts',
		data = {
				"note_text":response
				},
		sendResponse = SherpaDesk.getSherpaDesk(config, method, 'post', data);		
		sendResponse.then(
			//success
			function(results){
				$('.tkt_actions .tkt_add_response textarea#response').val('');
				$('.tkt_actions .tkt_add_response button.add_response').text('Add').removeClass('buttonSpinner');
				SherpaDesk.getComments(config, key);
				addAlert("success", "Roger that. Message received.");				
			},
			//failed
			function(results){
				$('.tkt_actions .tkt_add_response button.add_response').text('Add').removeClass('buttonSpinner');
				addAlert("error", "Whoops! There was a problem posting your response.</p>");
			}
		);					
	},
	getTickets: function(configPass,tktType){	
		// Get Tickets
		if(!tktType){var tktType={};}
		tktType.type = localStorage.getItem('sd_is_from');
		tktType.Id = localStorage.getItem('sd_is_from_id');
		
		if (tktType && tktType.type == "accounts") {
		    var getTicketList = SherpaDesk.getSherpaDesk(configPass, 'tickets?account=' + tktType.Id + '&status=open&limit=500');
		} else if (tktType && tktType.type == "queues") {
		    var getTicketList = SherpaDesk.getSherpaDesk(configPass, 'queues/' + tktType.Id);
		} else {
		    var status = "open";
		    if (localStorage.sd_user_role == "all")
		        status = 'allopen';
		    if (localStorage.sd_user_role == "user")
		        status = 'open,onhold';
		    var getTicketList = SherpaDesk.getSherpaDesk(configPass, 'tickets?status=' + status + '&limit=500&query=' + localStorage.sd_user_role);
		}
		
		getTicketList.then(
			//sucess
			function(results){     	
				SherpaDesk.showTicketHeader();
				SherpaDesk.showTicketList(results);
			},
			//failed
			function(results){			
				addAlert("error", "There was a problem fetching your tickets.");
				}
			);
		getTicketList.done (
			function(){
					queuesAndTicketHeader(configPass, tktType);														
				}
			);	
		},
	getTicketsQueues: function(configPass){
			$('.body').empty(); 			
			
			var getQueues = SherpaDesk.getSherpaDesk(configPass, 'queues');
			
			getQueues.then(
				function(results){
					SherpaDesk.showTicketHeader();
					SherpaDesk.showQueueList(results);
				},
				//failed
				function(results){				
					addAlert("error", "There was a problem fetching your Queues.");
				}
			);			
			getQueues.done(function(){
				//localStorage.removeItem('sd_user_role');
				queuesAndTicketHeader(configPass);
				$('ul.filter li').removeClass('active');
				$('a.get_queue_list').on('click',function(e){
					e.preventDefault();
					$('body').empty().addClass('spinner'); 			
					var queueinfo = {
								"type" : "queues",
								"Id" : $(this).data("queid")
							};
					localStorage.setItem('sd_is_from', queueinfo.type);
					localStorage.setItem('sd_is_from_id', queueinfo.Id);
					SherpaDesk.getTickets(configPass, queueinfo);
				});
			});
		},
		
	getAccounts: function(configPass){
			$('.body').empty();						
			
			var accounts = SherpaDesk.getSherpaDesk(configPass, 'accounts');
			
			accounts.then(
			function(results){
				SherpaDesk.showAccountsList(results);
			},
			//failed
			function(results){			
				addAlert("error", "There was a problem finding your accounts.");
				}
			);
			
			accounts.done(function(){
				//Set the home button
				$('a.home_button').off().on('click', function(e){
					e.preventDefault();
					$('body').empty().addClass('spinner');	
					SherpaDesk.init();			
					});
				
				$('a.get_account_list').off().on('click', function(e){
					  	e.preventDefault();
						e.stopPropagation();
						console.log('test')
						$('body').empty().addClass('spinner'); 	
						var accountinfo = {
								"type" : "accounts",
								"Id" : $(this).data('accountid'),
								"accountname": $(this).data('name'),
								"tktcnt" : $(this).data('open')
							}
						
						localStorage.setItem('sd_is_from', accountinfo.type);
						localStorage.setItem('sd_is_from_id', accountinfo.Id);						
						SherpaDesk.getTickets(configPass, accountinfo);
					});
				
				
				});
		},
				
	getTicketDetail: function(configPass, ticketKey){
		$('body').empty().addClass('spinner');
		//get ticket
		
			var getTicket = SherpaDesk.getSherpaDesk(configPass, 'tickets/' + ticketKey);
			getTicket.then(
				function(results){
					SherpaDesk.showTicketDetHeader(results);
					SherpaDesk.showTicketDetContent(results);
					SherpaDesk.showResponses(results, results.key);				
				},
				//failed
				function(results){					
					SherpaDesk.getTickets(configPass);				
					addAlert("error", "Sorry. There was a problem fetching that ticket.");
					}
				);
				
			getTicket.done (
					function(results){
						SherpaDesk.showTicketInfo(results);
						fromDate("div.tkt_det_head_date");
						ticketDetMenuActions(configPass);
						getGravatar("p.cir_gravatar", 80);//main gravatar					
						getGravatar("p.res_gravatar", 30);//responses gravatar
						fromDate("div.tkt_ini_res_date"); //note: put this in a helper function								
						fromDate("p.note_time"); //note: put this in a helper function	
						ticketActions(configPass); //activate ticket action menu
						addResponse(configPass); // activate inline response listener
						addTime(configPass); // activate inline time listener
						ticket_list_menu(".right-menu","right"); //slide menu right side
						ticketListMenuActions(configPass, results.key); //add click listners for menu
						ticketJump(configPass);// add listener for ticket jump
						showTicketInfoPanel(); //show | hide info panel
						fixedDate("span.time");	//note: put this in a helper function	
						ticket_menu_rev(results); // Show hide menu items based on ticket | user type
						
						// Hide Account if user type = user and account = sherpadesk
						var userType = SherpaDesk.getSherpaDesk(configPass, 'users?id=' + results.user_id),
							accountID = results.account_id;
						userType.done(function(user){
								if (user.type == "user" && accountID < 0){
										$('p.tkt_user_account').hide();
									};
							});
						
						if (results.attachments !== null && results.attachments.length > 0 ){
							getCommentImages(results.attachments);
							};
							
						//Add custom fields to info area
						if (results.customfields_xml !== null && results.customfields_xml.length > 0 ){
							getCustomFields(results.customfields_xml);
							};															
					}
				);
		},
	
	getTicketDetailTransfer: function(configPass, key){	
			
		$('div.ticket_detail_main').empty().addClass('spinner').trigger('click');
		$('a#ticketList').unbind('click').on('click', function(e){e.preventDefault(); SherpaDesk.getTicketDetail(configPass, key);});		
		
				
		var method = "technicians";
		var getTechs = SherpaDesk.getSherpaDesk(configPass, method);
	
		getTechs.then(
			//success
			function(results){
				SherpaDesk.showTransfer();
				SherpaDesk.showTechs(results);
				$('div.ticket_detail_main').removeClass('spinner');												
				},
			//failed
			function(results){
				SherpaDesk.getTicketDetail(configPass, key);
				addAlert("error", "Could not retrieve Technicians for Transfer");
				}
			);
		getTechs.done(
			function(results){			
				$('form.transfer_ticket button[type=submit]').on('click', function(e){
					e.preventDefault();					
					var techs = $('form select#tech option:selected').val(),
						details = htmlEscape($('textarea#details').val().trim());
					if (techs == ""){addAlert("error", "Please select a Technician"); scrollToAnchor("top"); return;};
					if (details.length > 5000) {
						addAlert("error", "Details cannot be more than 5000 chars!");
						scrollToAnchor("top");
						return;	
						};
					SherpaDesk.postTicketDetailTransfer(configPass, key, techs, details)					
					});
				}
			);
		},
	postTicketDetailTransfer: function(configPass, key, techs, details){
		$('div.ticket_detail_main').empty().addClass('spinner');
		var data = {
			    "note_text": details,
			    "keep_attached": false
			},
			method = 'tickets/' + key + '/technicians/' + techs,
			postTransfer = SherpaDesk.getSherpaDesk(configPass, method, "put", data);
			postTransfer.then(
				//success
				function(){
					SherpaDesk.getTicketDetail(configPass, key);
					addAlert("success", "Great! Now it's in capable hands.");
					},
				//error
				function(){
					$('div.ticket_detail_main').removeClass('spinner');
					SherpaDesk.getTicketDetailTransfer(configPass, key);
					addAlert("error", "There was a problem transfering this ticket.");
					}
			);
		},
		
	postTicketDetailPickup: function(configPass, key){
			$('body').empty().addClass('spinner');
			var tech = localStorage.sd_currentUser_id;
			var data = {
			    "action" : "pickup"
			},
			method = 'tickets/' + key,
			pickupTicket = SherpaDesk.getSherpaDesk(configPass, method, "put", data);
			
			pickupTicket.then(
			//Success
			  function(results){				  				  
				  SherpaDesk.getTicketDetail(configPass, key);
				  addAlert("success", "I'm sure you'll be great at this!");
				  },
			//Fail fail fail	   
			  function(results){
				  $('body').empty();
				  SherpaDesk.getTicketDetail(configPass, key);
				  addAlert("error", "There was a problem picking up this ticket.");
				  }
			 );
			
		},	
		
	//Close Ticket	
	getTicketDetailClose: function(configPass, key){		
		$('div.ticket_detail_main').empty().addClass('spinner').trigger('click');
		$('a#ticketList').unbind('click').on('click', function(e){e.preventDefault(); SherpaDesk.getTicketDetail(configPass, key);});
				
		SherpaDesk.showTicketClose();
		
		$('form.close_ticket button[type=submit]').on('click', function(e){
			e.preventDefault();					
			
			var notify = $('label div.checker span').attr('class'),
				details = htmlEscape($('textarea#details').val().trim());
			
			if (!notify || notify == "" || notify == null){
					notify = false;
				} else {
					notify = true;
					};
			
			SherpaDesk.postTicketDetailClose(configPass, key, notify, details)					
			});
		
	
		//UniformJS fix for checkbox listner
		$("#closeNotice").on("click", function() {
			  $.uniform.update(this);
		  });	
		},
	
	postTicketDetailClose: function(configPass, key, notify, details){
		$('div.ticket_detail_main').hide().addClass('spinner');
		var data = {
				    "status" : "closed",
				    "note_text": details,
				    "is_send_notifications": notify,
				    "resolved": false,
				    "confirmed": false
				},
			method = 'tickets/' + key ,
			postClose = SherpaDesk.getSherpaDesk(configPass, method, "put", data); //PUT /tickets/h8s2f2/
			postClose.then(
				//success
				function(){
					SherpaDesk.getTicketDetail(configPass, key);
					addAlert("success", "Awesome! This ticket is now closed.");
					},
				//error
				function(){
					$('div.ticket_detail_main').show().removeClass('spinner');
					addAlert("error", "There was a problem closing this ticket.");					
					}
			);
			
		},
	
	//Add Response from Ticket Detail	
	getTicketDetailResponse: function(configPass, key){
		$('div.ticket_detail_main').empty().addClass('spinner').trigger('click');
		$('a#ticketList').unbind('click').on('click', function(e){e.preventDefault(); SherpaDesk.getTicketDetail(configPass, key);});	
		
		SherpaDesk.showTicketDetResponse();
		
		$('form.create_response button[type=submit]').on('click', function(e){
			e.preventDefault();					
			
			var response = htmlEscape($('textarea#details').val().trim());
			
			if(response == "" || response == null){
					addAlert("error", "Please add a response.");
				} else {
					SherpaDesk.postTicketDetailResponse(configPass, key, response);		
				};					
			});
		},
	
	//Post Response from Ticket Detail	
	postTicketDetailResponse: function(configPass, key, response){		
		var method = 'tickets/' + key + '/posts',
		data = {
				"note_text":response
				},
		sendResponse = SherpaDesk.getSherpaDesk(configPass, method, 'post', data);		
		sendResponse.then(
			//success
			function(results){
				SherpaDesk.getTicketDetail(configPass, key);
				addAlert("success", "Success! Your response has been logged.");
			},
			//failed
			function(results){
				SherpaDesk.getTicketDetailResponse(configPass, key);
				addAlert("error", "There was an problem posting your response.");	
			}
		);
		
		},
		
	//Add Edit Ticket Details from Ticket Detail	
	getTicketDetailEdit: function(configPass, key){
		$('div.ticket_detail_main').empty().addClass('spinner').trigger('click');
		$('a#ticketList').unbind('click').on('click', function(e){e.preventDefault(); SherpaDesk.getTicketDetail(configPass, key);});	
		
		
		
		var getTicket = SherpaDesk.getSherpaDesk(configPass, 'tickets/' + key);
		var classes = SherpaDesk.getSherpaDesk(configPass, 'classes');
		var levels = SherpaDesk.getSherpaDesk(configPass, 'levels');
		var priorities = SherpaDesk.getSherpaDesk(configPass, 'priorities');
		var accounts = SherpaDesk.getSherpaDesk(configPass, 'accounts');
		var selectedEditClass;
		
		getTicket.done(
			function(results){
								
				//place Edit Page
				SherpaDesk.showTicketDetEdit(results);
				
				var ticketAccount = results.account_id,
					ticketClass = results.class_id,
					ticketLevel = results.level,
					ticketPriority = results.priority_id;
				
				//get Accounts
				accounts.done(
					function(accountResults){
							SherpaDesk.showAccounts(accountResults);
							$("form.update_ticket select#account").val(ticketAccount).uniform();					
						}
				);	
				
				//get Classes
				classes.done(
					function(classResults){
													
							SherpaDesk.showClasses(classResults);
							$("#class").uniform();	
							
							//Init ticket class if not changed
							selectedEditClass = ticketClass;
							
							//Listen for class and detect sub-classes
							$('form.update_ticket select#class').on('change', function(){
								
								if($('.sub_class1, .sub_class2').is(":visible")){$('.sub_class1, .sub_class2').remove();};
								var classSelected0 = $('form.update_ticket select#class option:selected').val();					
								var classSub = $.grep(classResults, function(a){ return a.id == classSelected0; });
								
								
								//set class
								selectedEditClass = classSelected0;
								
								//If sub-class exist
								if(classSub[0].sub > 0 || classSub[0].sub !== null){										
										//Show sub-class select
										SherpaDesk.showSubClass1(classSub[0].sub);
										$("form.update_ticket select#sub_class1").uniform().on('change', function(){
												if($('.sub_class2').is(":visible")){$('.sub_class2').remove();};
												var classSelected1 = $('form.update_ticket select#sub_class1 option:selected').val();					
												var classSub1 = $.grep(classSub[0].sub, function(a){ return a.id == classSelected1; });
												
												//reset class
												selectedEditClass = classSelected1;
												//If sub-sub-class exist
												if(classSub1[0].sub > 0 || classSub1[0].sub!== null){
														//Show sub-class select
														SherpaDesk.showSubClass2(classSub1[0].sub);
														$("form.update_ticket select#sub_class2").uniform().on('change', function(){
															var classSelected2 = $('form.update_ticket select#sub_class2 option:selected').val();
															//reset class
															selectedEditClass = classSelected2;
														});
													}
											});
									}
										
								}); //end Sub-Class listener
								
								$('form.update_ticket button[type=submit]').on('click', function(e){
									e.preventDefault();		
									
									var ticketAccount = $('form.update_ticket select#account').val(),
										ticketClass = selectedEditClass,
										ticketLevel = $('form.update_ticket select#level').val(),
										ticketPriority = $('form.update_ticket select#priority').val();
									
									var response = {
											"account_id" : ticketAccount,
											"class_id" : ticketClass,
											"level_id" : ticketLevel,
											"priority_id" : ticketPriority
										}
									SherpaDesk.updateTicketDetailEdit(configPass, key, response);	
														
									});
												
						}//End done function
				); // End classes.done
				
				//get Levels
				levels.done(
					function(levelResults){
							SherpaDesk.showLevels(levelResults);
							$("form.update_ticket select#level").val(ticketLevel).uniform();					
						}
				);
				
				//get Priorities
				priorities.done(
					function(priorityResults){
							SherpaDesk.showPriorities(priorityResults);
							$("form.update_ticket select#priority").val(ticketPriority).uniform();						
						}
				);
				$(".update").show(); // Show Ticket Edit view							
			}
		);
		
		
		},
	
	//Post or update Edit from Ticket Detail	
	updateTicketDetailEdit: function(configPass, key, response){		
		method = 'tickets/' + key;	
		
		updateEditTicket = SherpaDesk.getSherpaDesk(configPass, method, 'PUT', response);
				
		updateEditTicket.then(function(results){
			
			console.log('Then Complete');		
			 	SherpaDesk.getTicketDetail(configPass, key);
			 	addAlert("success", "Ticket has been Updated");
			  
			}); 
		},
		
	//Add Time in Ticket Detail		
	getTicketDetailAddTime: function(configPass, key){
		$('div.ticket_detail_main').empty().addClass('spinner').trigger('click');
		$('a#ticketList').unbind('click').on('click', function(e){e.preventDefault(); SherpaDesk.getTicketDetail(configPass, key);});
		
		var tasktypes = SherpaDesk.getSherpaDesk(configPass, 'task_types');	
		
		SherpaDesk.showTicketDetAddTime();
		
		$("select").uniform();
		
		tasktypes.then(
			//success
			function(results){
				SherpaDesk.showTaskTypes(results);
				
				$('div.ticket_detail_main').removeClass('spinner');
				
				//Setup the plus and minus buttons
				$(".plus_time").on('touchstart click', function(e){
					e.preventDefault();	
					var add_time = $(this).parent().find('p input.add_time').val();	
					$(this).parent().find('p input.add_time').val(  Number(add_time) + .25)	
				});
				$(".minus_time").on('touchstart click', function(e){
					e.preventDefault();
					if ($(this).parent().find('p input.add_time').val() >= .25){
						var sub_time = $(this).parent().find('p input.add_time').val();
						$(this).parent().find('p input.add_time').val( Number(sub_time) - .25 );
					}		  
				});
				
				$('form.add_time button[type=submit]').off().on('click', function(e){
					e.preventDefault();					
					
					var time = $('input.add_time').val().trim(),
						tasktype = $('form select#task_type option:selected').val(),
						details = htmlEscape($('textarea#details').val().trim());
					
					if (time == 0 || time == null){addAlert("error", "Your time needs to be greater than 0."); return false;}
					if (tasktype == 0 || tasktype == null){addAlert("error", "Please enter a task type."); return false;}
					if (details == "" || details == null){addAlert("error", "Please enter a description in the note field."); return false;}
					
					$('div.ticket_detail_main').empty().addClass('spinner');
					SherpaDesk.postTicketDetailAddTime(configPass, key, time, tasktype, details);					
					});
					
			},
			//failed
			function(results){
				addAlert("error", "Could Not Retrieve Task Types");
				}				
			);
			
			tasktypes.done( 
				function(){
					$.uniform.update("select#task_type");
					}									
			);
		},
		
	postTicketDetailAddTime: function(configPass, key, time, tasktype, details){
			var method = 'time',
			data = {
					    "ticket_key": key,
					    "note_text": details,
					    "task_type_id": tasktype,
					    "hours": time
					},
			sendTime = SherpaDesk.getSherpaDesk(configPass, method, 'post', data);		
			sendTime.then(
				//success
				function(results){
					SherpaDesk.getTicketDetail(configPass, key);
					addAlert("success", "Your time has been recorded.");
				},
				//failed
				function(results){
					SherpaDesk.getTicketDetailAddTime(configPass, key);
					addAlert("error", "Sorry, there was a problem posting your time.");	
				}
			);
		},
		
	getTimeRollRecent: function(configPass){
		$('body').empty().addClass('spinner');

		var timeEntries = SherpaDesk.getSherpaDesk(configPass, 'time');
		timeEntries.done(function(results){			
		    SherpaDesk.showTimeLogs(results);
		    fixedDate("p.date");
			
			//Set the home button
			$('a.home_button').on('click', function(e){
				e.preventDefault();
				$('body').empty().addClass('spinner');	
				SherpaDesk.init();			
				});
			
			$('a.add_time_button').on('click', function(e){
				e.preventDefault();
				$('body').empty().addClass('spinner');		
				SherpaDesk.getTimeRollAddTime(configPass);	
				});
				
			});// End timeEntries.done
		},

	//Add Time from Time Roll		
	getTimeRollAddTime: function(configPass){
		$('body').empty().addClass('spinner');					
		
		var tasktypes = SherpaDesk.getSherpaDesk(configPass, 'task_types'),
			accounts = SherpaDesk.getSherpaDesk(configPass, 'accounts');
			
		SherpaDesk.showTimeRollAddTime();
		$("select, :checkbox").uniform();
		
		
		// If we are tracking projects, then add them in.
		if (localStorage.sd_is_project_tracking == 'true' ){
			$('div.projects').show();
			var projects = SherpaDesk.getSherpaDesk(configPass, 'projects');
				projects.then(
					function(results){SherpaDesk.showProjects(results);},
					function(results){addAlert("error", "Could Not Retrieve Projects");}
				);			
			}
		
		accounts.then(
			function(accounts){SherpaDesk.showAccounts(accounts);},
			function(results){addAlert("error", "Could Not Retrieve Accounts");}
			);		
		
		tasktypes.then(
			//success
			function(results){
				SherpaDesk.showTaskTypes(results);	
				
					
			},
			//failed
			function(results){
				addAlert("error", "Could Not Retrieve Task Types");
				}				
			);
			
			tasktypes.done( 
				function(){					
					//$.uniform.update("select#task_type");
					}									
			);
			
			$(document).ajaxStop(function() {
			  // place code to be executed on completion of last outstanding ajax call here
			  $('a#timeroll').unbind('click').on('click', function(e){e.preventDefault(); SherpaDesk.getTimeRollRecent(configPass);});
			  
			  //Setup the plus and minus buttons
				$(".plus_time").on('touchstart click', function(e){
					e.preventDefault();	
					var add_time = $(this).parent().find('p input.add_time').val();	
					$(this).parent().find('p input.add_time').val(  Number(add_time) + .25)	
				});
				$(".minus_time").on('touchstart click', function(e){
					e.preventDefault();
					if ($(this).parent().find('p input.add_time').val() >= .25){
						var sub_time = $(this).parent().find('p input.add_time').val();
						$(this).parent().find('p input.add_time').val( Number(sub_time) - .25 );
					}		  
				});
				
				if( localStorage.sd_is_time_tracking == "true" ){$('.billable').show();}
				
				$('form.roll_time button[type=submit]').off().on('click', function(e){
					e.preventDefault();	
									
					//Empty existing alerts
					$('div.showalert').empty();
					
					var time = $('input.add_time').val().trim(),
						account = $('form select#account option:selected').val(),
						project = $('form select#project option:selected').val(),
						tasktype = $('form select#task_type option:selected').val(),
						details = htmlEscape($('textarea#details').val().trim()),
						isBillable;
												
		  			
					
					if ($('#isBillable').is(":checked")){
		  					isBillable = true;
		  				} else {
		  					isBillable = false;
		  					};
					
					if (time == 0 || time == null){addAlert("error", "Your time needs to be greater than 0."); return false;}
					if (tasktype == 0 || tasktype == null){addAlert("error", "Please enter a task type."); return false;}
					if (details == "" || details == null){addAlert("error", "Please enter a description in the note field."); return false;}					
								
					var data = {
						"hours" : time,
						"account_id" : account,
						"project_id" : project,
						"task_type_id" : tasktype,
						"note_text" : details,
						"is_billable" : isBillable
						};
										
					SherpaDesk.postTimeRollAddTime(configPass, data);					
					}); //End form capture
					
					//UniformJS fix for checkbox listner
					$("#isBillable").on("click", function() {
						  $.uniform.update(this);
					  });
				});
			
		},
		
	postTimeRollAddTime: function(configPass, data){
			var method = 'time',
			
			sendTime = SherpaDesk.getSherpaDesk(configPass, method, 'post', data);		
			sendTime.then(
				//success
				function(results){
					SherpaDesk.getTimeRollRecent(configPass);
					addAlert("success", "Your time has been recorded.");
				},
				//failed
				function(results){
					addAlert("error", "Sorry, there was a problem posting your time.");	
					return false;
				}
			);
		},	
	
	//Add New Ticket
	addTicket: function(configPass){		
		var classes = SherpaDesk.getSherpaDesk(configPass, 'classes');
		var accounts = SherpaDesk.getSherpaDesk(configPass, 'accounts');
		var techs = SherpaDesk.getSherpaDesk(configPass, 'technicians');
		var user = SherpaDesk.getSherpaDesk(configPass, 'users?email=' + localStorage.sd_user_email);
		
		//init class to null
		var selectedClass = '';
		
		SherpaDesk.showAddTicket();		
		
		accounts.then(
			function(results){SherpaDesk.showAccounts(results);},
			function(results){addAlert("error", "Could Not Retrieve Accounts");}			
			);
		techs.then(
			function(results){SherpaDesk.showTechs(results);},
			function(results){addAlert("error", "Could Not Retrieve Technicians");}	
			);
		classes.then(
			//Class success
			function(results){
				SherpaDesk.showClasses(results);
				//Listen for class and detect sub-classes
				$('form select#class').on('change', function(){
					if($('.sub_class1, .sub_class2').is(":visible")){$('.sub_class1, .sub_class2').remove();};
					var classSelected0 = $('form select#class option:selected').val();					
					var classSub = $.grep(results, function(a){ return a.id == classSelected0; });
					
					//set class
					selectedClass = classSelected0;
					
					//If sub-class exist
					if(classSub[0].sub > 0 || classSub[0].sub!== null){
							//Show sub-class select
							SherpaDesk.showSubClass1(classSub[0].sub);
							$("select#sub_class1").uniform().on('change', function(){
									if($('.sub_class2').is(":visible")){$('.sub_class2').remove();};
									var classSelected1 = $('form select#sub_class1 option:selected').val();					
									var classSub1 = $.grep(classSub[0].sub, function(a){ return a.id == classSelected1; });
									
									//reset class
									selectedClass = classSelected1;
									//If sub-sub-class exist
									if(classSub1[0].sub > 0 || classSub1[0].sub!== null){
											//Show sub-class select
											SherpaDesk.showSubClass2(classSub1[0].sub);
											$("select#sub_class2").uniform().on('change', function(){
												var classSelected2 = $('form select#sub_class2 option:selected').val();
												//reset class
												selectedClass = classSelected2;
											});
										}
								});
						}
							
					});
				},
			//Class failed
			function(results){addAlert("error", "Could Not Retieve Classes");}	
			);
		
		$("select").uniform();
		$('body').removeClass('spinner');
		$('div.content.ticket_add').show();
		
		ticketDetMenuActions(configPass);	
		
		user.done(function(results){ 
			$('form.create_ticket button[type=submit]').on('click', function(e){
					e.preventDefault();			
					var classSelected = selectedClass, //$('form select#class option:selected').val(),
					    techs = $('form select#tech option:selected').val(),
						accounts = $('form select#account option:selected').val(),
						subject = htmlEscape($('input[type=text]#subject').val().trim()),
						details = htmlEscape($('textarea#details').val().trim()),
						user = results[0].id;
					if (account == ""){addAlert("error", "Please select an Account"); scrollToAnchor("top"); return;} else
					if (techs == ""){addAlert("error", "Please select a Technician"); scrollToAnchor("top"); return;} else
					if (classSelected == ""){addAlert("error", "Please select a Ticket Class"); scrollToAnchor("top"); return;};
					
					if (!subject){
						addAlert("error", "Please add a Ticket Subject!");
						scrollToAnchor("top");
						return;
						} else 
					if (subject.length > 100){
						addAlert("error", "Subject should be less 100 chars!");	
						scrollToAnchor("top");
						return;
						} else
					if (details.length > 5000) {
						addAlert("error", "Details cannot be more than 5000 chars!");
						scrollToAnchor("top");
						return;	
						};
					
					SherpaDesk.postNewTicket(configPass, classSelected, techs, accounts, subject, details, user);
					
				});
			});
		},
		
	postNewTicket: function(configPass, classSelected, techs, accounts, subject, details, user){
		var data = {
			    "status" : "open",
			    "subject" : subject,
			    "initial_post" : details,
			    "class_id" : classSelected,
			    "account_id" : accounts,
			    "user_id" : user,
			    "tech_id" : techs
			},
			postTicket = SherpaDesk.getSherpaDesk(configPass, "tickets", "post", data);
			postTicket.then(
				//success
				function(results){
					$('body').empty().addClass('spinner');
					SherpaDesk.getTickets(configPass);
					addAlert("success", "Awesome Job! Your ticket was created.");
					},
				//failed
				function(){
					addAlert("error", "There was a problem submitting your ticket. Please try again.");
					}
			);
		},
	
	//--------------------------- Dashboard ------------------------------
	
	getDashboard: function(configPass){
		$('body').addClass('spinner');
		var ticketCounts = SherpaDesk.getSherpaDesk(configPass, "tickets/counts");
		
		ticketCounts.done(function(results){
			SherpaDesk.showDashboard(results);
			$('body').removeClass('spinner');			
			//Set ticket clicks
			$(".dash-tkts .get-tickets").on('click', function(e){	
				e.preventDefault();	
				$('body').empty().addClass('spinner');	
				var asRole = $(this).data('asrole');
				localStorage.setItem('sd_user_role', asRole);
				localStorage.setItem('sd_is_from', 'tickets');
				localStorage.setItem('sd_is_from_id', '');
				SherpaDesk.getTickets(configPass);
				});
			//Set Time Clicks
			$("#option_time").on('click', function(e){
				e.preventDefault();	
				$('body').empty().addClass('spinner');	
				SherpaDesk.getTimeRollRecent(configPass);
				});
			//Set Account Click
			$("#option_accounts").on('click', function(e){
				e.preventDefault();	
				$('body').empty().addClass('spinner');	
				SherpaDesk.getAccounts(configPass);
				});
			//Set Add Ticket Click 
			$('#option_add_ticket, a.add_ticket_button').off().on('click', function(e){
				e.preventDefault();
				$('body').empty().addClass('spinner');
					localStorage.setItem('sd_is_from', 'dash');
					localStorage.setItem('sd_is_from_id', '');		
					SherpaDesk.addTicket(configPass);	
				});		
					
			//Sidebar Setup
			ticket_list_menu(".side-menu", "left");
			ticketListMenuActions(configPass);
			ticketJump(configPass);
			
			// Hide change org select
			if( localStorage.sd_is_MultipleOrgInst === "false" ){
				$('li p#orgInst').parent().hide();
				};
											
			//Limit all open to 999
			if(results.open_all > 999) {
					$('div[data-asrole=all] p.dash-number-sm').text("999+").addClass('over99');
				};				
			});	//End ticketCounts.done
		},	
		
	//------------------------- Show  Methods ----------------------------	
	showLogin: function(){
		$('body').empty().addClass('login');
		var template = Handlebars.templates['login']; 							
		$('body').append( template() ).show();
	  		if (localStorage['sd_user_email']){
	  			$('input#email').val(localStorage['sd_user_email']);
			};
		},
	showOrg: function(orgs){
		$('body').empty().addClass('login');
		var template = Handlebars.templates['orgs']; 							
		$('body').append( template(orgs) );
		$("select").uniform();
		},
	showInst: function(inst){
		$('body').empty().addClass('login');
		var template = Handlebars.templates['inst']; 							
		$('body').append( template(inst) );
		$("select").uniform();
		},
	showDashboard: function(numbers){
		$('body').empty();
		
		// Create link to specific org | instance
		var full_app_link = "",
		    urlString = AppSite + "?dept=" + localStorage.sd_inst_key + "&org=" + localStorage.sd_org_key;
	  	if (isPhonegap)
		 	full_app_link = "href=#  onclick=openURLsystem('" + urlString + "')";
	  	else
			full_app_link = "href=" + urlString + " target=_system";
	  	//var organization = {"full_app_link" : full_app_link};
		
		numbers["full_app_link"] = full_app_link; //Add link to object
		
		var template = Handlebars.templates['dashboard']; 							
		$('body').append( template(numbers) );
		},
	showAccounts: function(accounts){
		var template = Handlebars.templates['accounts']; 							
		$('form select#account').append( template(accounts) );
		},
	showProjects: function(projects){
		var template = Handlebars.templates['projects']; 							
		$('form select#project').append( template(projects) );
		},
	showTechs: function(techs){
		var template = Handlebars.templates['techs']; 							
		$('form select#tech').append( template(techs) );
		},
	showLevels: function(levels){
		var template = Handlebars.templates['levels']; 							
		$('form select#level').append( template(levels) );
		},	
	showPriorities: function(priorities){
		var template = Handlebars.templates['priorities']; 							
		$('form select#priority').append( template(priorities) );
		},
	showClasses: function(classes){
		var template = Handlebars.templates['classes']; 							
		$('form select#class').append( template(classes) );
		},
	showSubClass1: function(subclass1){
		var template = Handlebars.templates['addTicket_subClass1']; 							
		$('.add_class').append( template(subclass1) );
		},
	showSubClass2: function(subclass2){
		var template = Handlebars.templates['addTicket_subClass2']; 							
		$('.add_class').append( template(subclass2) );
		},
	showTaskTypes: function(tasktypes){
		var template = Handlebars.templates['taskTypes']; 							
		$('form select#task_type').append( template(tasktypes) );
		},
	showTicketHeader: function(){
		$('body').empty();	      
		var template = Handlebars.templates['ticket_header']; 							
		$('body').prepend( template() );		
		},
	showTicketList: function(list){
		var template = Handlebars.templates['ticket_list'];									
		$('body').append( template(list) ).slideDown().removeClass('spinner');
		},
	showTicketListAppend: function(list){
		var template = Handlebars.templates['ticket_list_append']; 							
		$('ul.tickets').append( template(list) );
		},
	showQueueList: function(que){
		var template = Handlebars.templates['queue_list']; 							
		$('body').append( template(que) ).slideDown().removeClass('spinner');
		},
	showQueueTicketList: function(queues){
		var template = Handlebars.templates['ticket_list']; 										
		$('.content').empty().append( template(queues) ).slideDown().removeClass('spinner');		
		},
	showResponses: function(results, key) {
		var responses = results.ticketlogs,
		    template = Handlebars.templates['ticket_response']; 
		$('*[data-reskey="' + key + '"]').find('ul.responses').empty().append( template(responses) );
		},
	showTicketDetHeader: function(detail){	
		var template = Handlebars.templates['ticketDetail_header']; 							
		$('body').prepend( template(detail) );
		},
	showTicketDetContent: function(detail){			
		var template = Handlebars.templates['ticketDetail_content']; 							
		$('body').append( template(detail) ).removeClass('spinner');
		},
	showTicketInfo: function(info){			
		var template = Handlebars.templates['ticketDetail_info']; 							
		$('div.ticket_info ul').empty().append( template(info) );
		},
	showTimeLogs: function(time){			
		var template = Handlebars.templates['time_list']; 							
		$('body').empty().append( template(time) ).removeClass('spinner');
		},	
	showAddTicket: function(){
		$('body').empty();			
		var template = Handlebars.templates['addTicket']; 							
		$('body').append( template() );
		},
	showTicketDetResponse: function(){
		var template = Handlebars.templates['ticketDet_response']; 							
		$('div.ticket_detail_main').append( template() ).removeClass('spinner');
		},
	showTicketDetAddTime: function(){
		var template = Handlebars.templates['ticketDet_AddTime']; 							
		$('div.ticket_detail_main').append( template() ).removeClass('spinner');
		},
	showTimeRollAddTime: function(){
		var template = Handlebars.templates['time_AddTime']; 							
		$('body').append( template() ).removeClass('spinner');
		},
	showTicketDetEdit: function(editDetail){
		var template = Handlebars.templates['ticketDet_Edit']; 							
		$('div.ticket_detail_main').append( template(editDetail) ).removeClass('spinner');
		},
	showTransfer: function(techs){			
		var template = Handlebars.templates['transfer']; 							
		$('div.ticket_detail_main').append( template(techs) );
		$("select").uniform();
		},
	showTicketClose: function(){			
		var template = Handlebars.templates['closeTicket']; 							
		$('div.ticket_detail_main').append( template() ).removeClass('spinner');
		$("input[type=checkbox]").uniform();
		},
	showAccountsList: function(accountlist){
		var template = Handlebars.templates['account_list']; 							
		$('body').append( template(accountlist) ).removeClass('spinner');
		}
};

SherpaDesk.init(); // Initialize the entire app here <- kinda important

	
// add listeners and global helper functions --------------------------------------------

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

// Login
function checkLogin(configPass){	
	$('form.form-signin button[type=submit]').on('click', function(e){
		e.preventDefault();
		var email = $('form.form-signin input#email').val();
		var pass = $('form.form-signin input#password').val();			
		if (email == '' || pass == ''){
				addAlert("danger", "Please enter a valid Email or Password");
			} else {						
				SherpaDesk.getLogin(configPass, email, pass);				
			};
	});
	$('form.google_openid').get(0).setAttribute('action', ApiSite + 'api/auth/googleopenid');
    $('a.sign-in-with-google').on('click', function(e){
        e.preventDefault();
        if (window.self !== window.top) {
            alert('Please go Google login in new window and reopen Sherpadesk extension again.');
            $('form.google_openid').get(0).setAttribute('target', '_blank'); 
        }
        $('form.google_openid').get(0).submit();
    });
    $('a.login_signup').on('click', function (e) {
        e.preventDefault();
        var url = AppSite + 'mc/signuporg.aspx';
        if (window.self !== window.top) {
            $('form.login_signup').get(0).setAttribute('action', url);
            alert('Please register in new window and reopen Sherpadesk extension again.');
            $('form.login_signup').get(0).setAttribute('target', '_blank');
            $('form.login_signup').get(0).submit();
        }
        else {
            if (isPhonegap)
                openURL(url);
            else
                document.location.href = url;
        }
    });
	};	
			
// Set the current Role in header filter
function setCurrentRole(){
	$("ul.filter li").each(function(){
			if( $(this).data("asrole") == localStorage.sd_user_role){
				$(this).addClass("active");
			};
		});
	};
// On Click - Change Roles
function changeRoles(configPass){
	$("ul.filter li").on('touchstart click', function(e){	
		e.preventDefault();	
		$("ul.filter li").removeClass("active");
		$(this).addClass("active");
		$('div.content').empty().addClass('spinner');	
		var asRole = $(this).data('asrole');
		localStorage.setItem('sd_user_role', asRole);
		//localStorage.removeItem('sd_from_queueid');			
		//SherpaDesk.init();
		localStorage.setItem('sd_is_from', 'tickets');
		localStorage.setItem('sd_is_from_id', '');
		SherpaDesk.getTickets(configPass);
		});
	};
	
// Set Dates as Time from now -> after loaded
function fromDate(somediv, format){
	$(somediv).each(function(){
		var d = new Date();
		// Get local machine timezone offset
		var offset = d.getTimezoneOffset() / 60;  
		var date = moment( $(this).text() ).subtract('hours', offset).fromNow();
		$(this).empty().text(date);
		});
	};

// Format Fixed Dates -> after loaded
function fixedDate(somediv, format){
	$(somediv).each(function(){
		var d = new Date();
		// Get local machine timezone offset
		var offset = d.getTimezoneOffset() / 60;
		var date = moment( $(this).text() ).subtract('hours', offset).format('LLL');
		$(this).empty().text(date);
		});
	};

//Loads Add Ticket listener when showing a ticket list
function add_ticket_button(configPass){
	$('a.add_ticket_button').on('touchstart click', function(e){
		e.preventDefault();
		$('body').empty().addClass('spinner');		
			SherpaDesk.addTicket(configPass);	
		});
		
	};
//Loads when showing a ticket list
function ticketActions(configPass){
		
		$("div.see_more").on('click',function(e){
			e.preventDefault();
			var isHidden = $(this).next(".tkt_actions").is(":hidden");//cache div state
			$(".tkt_actions").slideUp("slow"); // Hide other Comments 			
			if (isHidden){
					//if hidden the show	
					var ticketKey = $(this).data('key');										
					$(this).next(".tkt_actions").slideDown("slow");					
					SherpaDesk.getComments(configPass, ticketKey);						
				} else {
					//if showing then hide
					$(this).next(".tkt_actions").slideUp("slow");	
				};
			  			
			});
		
		$("div.tkt_actions_menu ul li").on('click',function(e){
			e.preventDefault();
			var ticketId = $(this).data('respkey');			
			$(this).siblings().removeClass("active"); // Hide other Comments      	
			$(this).addClass('active');	
				if ($(this).hasClass("responses")){
					$(this).parent().parent().siblings("div.tkt_add_time").slideUp();
					$('div[data-reskey=' + ticketId + '] div.tkt_actions_menu_type').text('Responses');
					$(this).parent().parent().siblings("div.tkt_add_response").slideToggle("slow");
				} 
				else if ($(this).hasClass("time")) {
					
					$(this).parent().parent().siblings("div.tkt_add_response").slideUp();
						var tasktypes = SherpaDesk.getSherpaDesk(configPass, 'task_types');
						var tasksCount = $('div[data-reskey=' + ticketId + '] div.tkt_add_time_input select option').length;
							tasktypes.done(function(tasks){
								var template = Handlebars.templates['taskTypes']; 
								if( tasksCount <= 1 ){																
									$('div[data-reskey=' + ticketId + '] div.tkt_add_time_input select').append( template(tasks) ).uniform();									
								};												
								});		
					$('div[data-reskey=' + ticketId + '] div.tkt_actions_menu_type').text('Time');							
					$(this).parent().parent().siblings("div.tkt_add_time").slideToggle("slow");
								
				};		
			});
		
		$(".plus_time").on('touchstart click', function(e){	
			e.preventDefault();
			var add_time = $(this).parent().find('p input.add_time').val();	
			$(this).parent().find('p input.add_time').val(  Number(add_time) + .25)	
		});
		$(".minus_time").on('touchstart click', function(e){
			e.preventDefault();
			if ($(this).parent().find('p input.add_time').val() >= .25){
				var sub_time = $(this).parent().find('p input.add_time').val();
				$(this).parent().find('p input.add_time').val( Number(sub_time) - .25 );
			}		  
		});				
	};

//Add Response at ticket list level
function addResponse(configPass){
	//On Click - Submit Response
	$('button.add_response').unbind('click').on('click', function(e){
		e.preventDefault();
		var response = htmlEscape( $(this).next().children('textarea#response').val().trim() );
		if(response === ''){
				$('div.alert.alert-error').remove();
				var alertmessage = {
							"message_type" : "error",
							"message" : "Nothing is there... hmmmm"
							};
						var template = Handlebars.templates['alert']; 
						$(this).parent().prepend( template(alertmessage) ).fadeIn();				
				return false;
			} 
			else if (response.length > 5000){
				$('div.alert.alert-error').remove();
				var alertmessage = {
							"message_type" : "error",
							"message" : "That's way too much. < 5000 chrs pls :)"
							};
						var template = Handlebars.templates['alert']; 
						$(this).parent().prepend( template(alertmessage) ).fadeIn();				
				return false;
			}			
			else {
				$('div.alert.alert-error').remove();
				var ticket_key = $(this).data('reskey');
				SherpaDesk.postComments(configPass, ticket_key, response.toString());
			};			
		});	
	};

//Add Time to ticket at ticket list level
function addTime(configPass){
	
	//On Click - Submit Response
	$('button.add_tkt_time').unbind('click').on('click', function(e){
		e.preventDefault();
		
		var hours = $(this).siblings('div.tkt_add_time_input').children().next('p').children('input.add_time').val().trim();
		var taskType = $(this).siblings('div.tkt_add_time_input')
						.children().eq(3).children('div.selector')
						.children('select#task_type')
						.children('option:selected').val();
			
		if(hours == '' || hours == 0 ){
				$(this).siblings('div.tkt_add_time_input')
					   .children().next('p')
					   .children('input.add_time')
					   .css("background-color", "#f2dede");
				return;
			} else 
		if (taskType == '' || taskType == 0){
				$(this).siblings('div.tkt_add_time_input')
						.children().eq(3).children('div.selector')
						.children('option:selected')
						.css("background-color", "#f2dede");
				return;
			} else {
				$('input.add_time').css("background-color", "#ffffff").val(0);
				var ticket_key = $(this).data('reskey'),
				    hours = htmlEscape( hours ),
					that = $(this);
				
				var method = 'time',
				data = {
							"ticket_key": ticket_key,
							"note_text": "Time entered via mobile app",
							"task_type_id": taskType,
							"hours": hours
						},
				sendTime = SherpaDesk.getSherpaDesk(configPass, method, 'post', data);		
				sendTime.then(
					//success
					function(results){
						SherpaDesk.getComments(configPass, ticket_key);
						var alertmessage = {
							"message_type" : "success",
							"message" : "Good job! Your time is logged."
							};
						var template = Handlebars.templates['alert']; 
						$(that).parent().prepend( template(alertmessage) ).fadeIn();
					},
					//failed
					function(results){
						var alertmessage = {
							"message_type" : "error",
							"message" : "Sorry that did not post."
							};
						var template = Handlebars.templates['alert']; 
						$(that).parent().prepend( template(alertmessage) ).fadeIn();							
					}
				);
			};			
		});	
	};

//Create sidebar menu
function ticket_list_menu(selector, direction){
		var sideMenu = $.jPanelMenu({
		    menu: selector,
		    trigger: '.ticket_list_menu',
			duration: 100,
			openPosition: "225px",
			animated: false,
			direction: direction			
		});
		sideMenu.off();
		sideMenu.on();	
		$("div.content").css("min-height", $(window).height() - 50);
		$(window).on("resize", function(){
			$("div.content").css("min-height", $(window).height());
			});			
	};
//initialize the sidebar menu items	
function ticketListMenuActions(configPass, key){
	$('#jPanelMenu-menu li p#logout').on('click', function(){ logOut(); });
	$('#jPanelMenu-menu li p#orgInst').on('click', function(){ changeOrgs(); });
	$('#jPanelMenu-menu li p#queues').on('click', function(){ SherpaDesk.getTicketsQueues(configPass) });
	//Ticket Detail view
	$('#jPanelMenu-menu li p#transfer').on('click', function(){ SherpaDesk.getTicketDetailTransfer(configPass, key) });
	$('#jPanelMenu-menu li p#pickup').on('click', function(){ SherpaDesk.postTicketDetailPickup(configPass, key) });
	$('#jPanelMenu-menu li p#edit').on('click', function(){ SherpaDesk.getTicketDetailEdit(configPass, key) });	
	$('#jPanelMenu-menu li p#close').on('click', function(){ SherpaDesk.getTicketDetailClose(configPass, key) });
	$('#jPanelMenu-menu li p#response').on('click', function(){ SherpaDesk.getTicketDetailResponse(configPass, key) });	
	$('#jPanelMenu-menu li p#time').on('click', function(){ SherpaDesk.getTicketDetailAddTime(configPass, key) });		
	};

//open link	in blank
function openURL(urlString){
    window.open(urlString, '_blank', 'location=no');
}

//open link	in system
function openURLsystem(urlString){
    window.open(urlString, '_system');
}
 
//insert images in comments
function getCommentImages(attachments){	
	$.each(attachments, function(key, value){
    var file = value.name,
			url = value.url,
			ext = file.substr( (file.lastIndexOf('.') +1) ).toLowerCase(); // lowercase the extension
      
    var imageInsert = "";
    if (isPhonegap)
       imageInsert = "<a class=\"comment_image_link\" href=# onclick='openURL(\"" + url + "\")'><img class=\"comment_image\" src=\"" + url + "\" alt=\"" + file + "\"></a>";
    else
       imageInsert = "<a class=\"comment_image_link\" target=\"_system\" href=\"" + url + "\"><img class=\"comment_image\" src=\"" + url + "\" alt=\"" + file + "\"></a>";
          
		if(ext === "jpg" || ext === "png" || ext === "gif" ){
			$('div.tkt_ini_response:contains(' + file + '), div.comment_main:contains(' + file + ')').append(imageInsert);
			};		 
		});		
	};

function getCustomFields(fieldsXml){
		var xmlDoc = $.parseXML(fieldsXml),
			$xml = $( xmlDoc ),
			$field = $xml.find( "field" ),
			infoFields = $('div.ticket_info ul');
			$.each($field, function(i,item) {
				var caption = $(this).find('caption'),
					value = $(this).find('value');				
				infoFields.append("<li><p>" + caption[0].textContent +": <strong>" + value[0].textContent + "</strong></p></li>");
			});
	};

function get_single_ticket(configPass){	
	$("a.get_single").on('click', function(){
		var key = $(this).data("reskey");
		SherpaDesk.getTicketDetail(configPass, key);
		});
	};

function ticketDetMenuActions(configPass){
	var last = localStorage.getItem('sd_is_from');
	$('a#ticketList').on('click', function(e){
		e.preventDefault(); 
		$('body').empty();
		if (last == "dash"){
				SherpaDesk.init();
			} else {
				SherpaDesk.getTickets(configPass);
			}		
		});
	};

function getGravatar(gravDiv, size) {
		$(gravDiv).each(function(){
			var email = $.MD5($(this).data('email'));
			if ( $(this).is(':empty') ){
				$(this).append('<img src="http://www.gravatar.com/avatar/' + email + '?d=mm&s=' + size + '" />');
			};
		});
	};
function showTicketInfoPanel(){
	$('.menu_button.header_right.info_icon').on('click', function(){
		$('div.content.ticket_detail div.ticket_info').slideToggle();
		});
	};

function filterList(){
	$('body').attr('id', 'search_wrap');
	window.setTimeout(function(){
		var options = {
			listClass: 'tickets',
		    valueNames: [ 'tkt_number', 'tkt_subject', 'tkt_account', 'user_name' ]			
	    };
	    var featureList = new List('search_wrap', options);

	    featureList.on('updated',function(){
	    	if (featureList.matchingItems.length > 1) 
	    	{
		    	var itemMessage = 'There are ' + featureList.matchingItems.length + ' matching tickets.';
		    	addAlert('success', itemMessage);
	    	} else if (featureList.matchingItems.length == 1) {
	    		$('.showalert').empty();
	    	} else if (featureList.matchingItems.length == 0) {
	    		addAlert('info', 'Bummer...  0 items found');
	    	}
	    });

		},500);
	};

function ticketJump(configPass){
	$('input.ticket-jump-menu').keypress(function (e) {
		  if (e.which == 13) {
		    var ticketNum = $(this).val();
			SherpaDesk.getTicketDetail(configPass, ticketNum);
		  }
		});	
	};

function ticket_menu_rev(results){
		//check to show time and close
	  	if (results.status === "Closed"){$('li p#close, li p#time, li p#transfer').parent().hide();}
		
		//check to pickup
		var tech_type = localStorage.sd_tech_admin;	
		var tech_id = localStorage.sd_currentUser_id;		
		var tech = $.grep(results.technicians, function(a){ return a.user_id == tech_id; });
		if(tech.length > 0 || tech_type == "false"){$('li p#pickup').parent().hide()};
		
		//check tech on ticket		
		if(tech_type == "false"){
			$('li p#transfer').parent().hide();
			};		
		if(tech.length == 0){
			$('li p#close, li p#time, li p#edit').parent().hide();
			$('li.time').hide();			
			};	
		
	};	

//Bind header actions for queues and tickets
function queuesAndTicketHeader(configPass, tktType) {
	setCurrentRole();
	fromDate(".fromDate");
	changeRoles(configPass);				
	ticketActions(configPass);
	add_ticket_button(configPass);
	get_single_ticket(configPass);
	addResponse(configPass);
	addTime(configPass);
	getGravatar("p.cir_gravatar", 40); // This should be in a helper
	
	if(tktType && tktType.type=="accounts"){
		$('ul.filter li').removeClass('active');
		$('li.time').hide();
		//Set the home button
		$('a.home_button').off()
			.removeClass('home_icon').addClass('back_icon')
			.on('click', function(e){
				e.preventDefault();
				$('body').empty().addClass('spinner');	
				SherpaDesk.getAccounts(configPass);
			});
	} else if (tktType && tktType.type=="queues") {
		$('ul.filter li').removeClass('active');
		$('li.time').hide();
		//Set the home button
		$('a.home_button').off()
			.removeClass('home_icon').addClass('back_icon')
			.on('click', function(e){
				e.preventDefault();
				$('body').empty().addClass('spinner');	
				SherpaDesk.getTicketsQueues(configPass);
			});
	} else {
		//Set the home button
		$('a.home_button').off().on('click', function(e){
			e.preventDefault();
			$('body').empty().addClass('spinner');	
			SherpaDesk.init();
		});
	};
	
	//Init list.js only if more than 0
	if ( ($("ul.tickets li.ticket").size()) > 0){
			filterList(); // if more than 0 tickets, enable filter
		};		
	
	// Hide time if ticket as_user			  
	if(localStorage.sd_user_role == "user" || localStorage.sd_user_role == "all"){
		$('li.time').hide();
		};
	
	// Hide if just a user and not tech
	if( localStorage.sd_tech_admin === "false" ){
		$('li.open_tickets, li[data-asrole="tech"], li[data-asrole="alt_tech"]').hide();
		};
	};


/*
 * Helpers
 */
function htmlEscape(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        //.replace(/\n/g, "<br />")
        ;
		};
		
function clearComments(){
	$("ul.responses").empty();
	};
function clearContent(){
	$("div.content").empty();
	};

function scrollToAnchor(aid){
    var aTag = $("a[name='"+ aid +"']");
    $('html,body').animate({scrollTop: aTag.offset().top},'slow');
}
	
// Global Alert Action
function addAlert(type, message) {
	//success danger error info block
	var alertmessage = {
		"message_type" : type,
		"message" : message
		};
	var template = Handlebars.templates['alert']; 
	window.setTimeout(function(){							
	$('div.showalert').empty().append( template(alertmessage) ).fadeIn();
	},500);
	};

// Logout
function logOut(){
    $('body').empty().addClass('login');
	localStorage.removeItem('sd_api_key');
	localStorage.removeItem('sd_inst_key');
	localStorage.removeItem('sd_org_key');
	localStorage.removeItem('sd_from_queueid');
	localStorage.removeItem('access_token');
	localStorage.removeItem('refresh_token');
	localStorage.removeItem('expires_at');
	if (localStorage.is_google) {
	    localStorage.removeItem('sd_user_email');
	    localStorage.removeItem('is_google');
	    GooglelogOut();
	}
	else
	    location.reload(true);
};

var GooglelogOut = function () {
    if (window.self === window.top && !confirm("Do you want to stay logged in Google account?")) {
        var logoutUrl = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=" + MobileSite;
        document.location.href = logoutUrl;
    }
    else
        location.reload(true);
}

// Change Orgs / Inst
function changeOrgs(){
	$('body').empty().addClass('login');
	localStorage.removeItem('sd_inst_key');
	localStorage.removeItem('sd_org_key');
	localStorage.removeItem('sd_from_queueid');	
	SherpaDesk.init();
	};
	
// handlebars helpers

Handlebars.registerHelper('linebreaks', function(context) {
    return context.replace(/\n/g, "<br />");
});	

Handlebars.registerHelper('htmlEscape', function(context) {
    return context
        .replace(/&amp;/g, "&" )
        .replace(/&quot;/, '/"')
        .replace(/&apos;/g, "'" )
        .replace(/&lt;/g, "<" )
        .replace(/&gt;/g, ">");
});	

