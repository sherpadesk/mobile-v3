var SherpaDesk = {
	init: function(){
		//cache config	
		var configPass = {			
			apiKey: localStorage.sd_api_key,
			org: localStorage.sd_org_key,
			inst: localStorage.sd_inst_key,
			role: localStorage.sd_user_role,
			url: 'http://api.sherpadesk.com/'
			}; 
		
		$(document).ajaxStart(function() { $( "body" ).addClass('spinner');	 }).ajaxComplete(function() { $( "body" ).removeClass('spinner'); });
			
		//If !api_key then show login 
		if (configPass.apiKey == '' || configPass.apiKey == null){
				SherpaDesk.showLogin();
				checkLogin(configPass);
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
		if(config.user && config.pass)	{var header = config.user + ':' + config.pass;} 
										else 
										{var header = config.org + '-' + config.inst + ':' + config.apiKey;};		
		var url = config.url;
		if( apimethod != '' ){var methodType = apimethod;} else {var methodType = 'GET';};
        
        return $.ajax({
            type: methodType,
            beforeSend: function (xhr) {
                xhr.withCredentials = true;
                xhr.setRequestHeader('Authorization', 'Basic ' + btoa(header));
                },
            url: url + method,
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
					},
					function(results){
		  				addAlert("error", "There was a problem retrieving config options.");
		  			}
				).done(
					function(results){
						
						if (localStorage.sd_from_queueid > 0 ){							
							  	console.log(localStorage.sd_from_queueid);
								SherpaDesk.showTicketHeader();
								changeRoles(configPass);	
								ticket_list_menu(".side-menu", "left");
								add_ticket_button(configPass);
								ticketListMenuActions(configPass);
							  	SherpaDesk.getQueueList(configPass, localStorage.sd_from_queueid); 
							} else {
								SherpaDesk.getTickets(configPass);	
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
			function(results){
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
								};
						});
								
					// listen for Instance selection	
					$('select#inst').change(function(){
						var index_number = this.value;
						localStorage.setItem('sd_inst_key', index_number);
						localStorage.setItem('sd_is_MultipleOrgInst', 'true');
						$("body").empty().addClass('spinner');
						SherpaDesk.init();
						//location.reload(true);
						});
					};// End > 1 
					
				// If there is ONLY ONE org and instance
				if (results.length == 1){
					var myorg = results[0].key;
					var myinst = results[0].instances[0].key;
					localStorage.setItem('sd_org_key', myorg);
					localStorage.setItem('sd_inst_key', myinst);
					localStorage.setItem('sd_is_MultipleOrgInst', 'false');
					$("body").empty().addClass('spinner');
					SherpaDesk.init();
					//location.reload(true);					
				};	
						
			
			},//End orgSetup Success
			function(){
				addAlert("error", "Great Merciful Crap!!  Something has gone horribly wrong.");
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
				$('.tkt_actions .tkt_add_response input#response').val('');
				$('.tkt_actions .tkt_add_response button.add_response').text('Add').removeClass('buttonSpinner');
				SherpaDesk.getComments(config, key);
				addAlert("success", "Roger that. Message received.");				
			},
			//failed
			function(results){
				$('.tkt_actions .tkt_add_response button.add_response').text('Add').removeClass('buttonSpinner');
				$('.ticket .tkt_actions .tkt_add_response').append('<p class=\"resultsError\"><strong>Whoops!<strong> The server no likey something in your response.</p>');
			}
		);					
	},
	
	getTickets: function(configPass){	
		// Get Tickets
		var getTicketList = SherpaDesk.getSherpaDesk(configPass, 'tickets?status=open&limit=500&role=' + localStorage.sd_user_role);
		//sucess
		getTicketList.then(
			function(results){
				SherpaDesk.showTicketHeader();
				SherpaDesk.showTicketList(results);
			},
			//failed
			function(results){
				$('div.content').prepend('<div class=showalert></div>');
				$('div.showalert').empty();				
				addAlert("error", "There was a problem fetching your tickets.");
				}
			);
		getTicketList.done (
			function(){
				setCurrentRole();
				fromDate(".fromDate");
				changeRoles(configPass);				
				ticketActions(configPass);
				ticket_list_menu(".side-menu", "left");
				ticketListMenuActions(configPass);
				add_ticket_button(configPass);
				get_single_ticket(configPass);
				addResponse(configPass);
				addTime(configPass);
				getGravatar("p.cir_gravatar", 40);
				ticketJump(configPass);
				if ( ($("ul.tickets li.ticket").size()) > 0){
						filterList(); // if more than 0 tickets, enable filter
					};					  
				if(configPass.role == "user" || configPass.role == "all"){
					$('li.time').hide();
					};
				if( localStorage.sd_tech_admin === "false" ){
					$('li.open_tickets, li[data-asrole="tech"], li[data-asrole="alt_tech"]').hide();
					};
				if( localStorage.sd_is_MultipleOrgInst === "false" ){
					$('li p#orgInst').parent().hide();
					};						
				}
			);	
		},
	
	getTicketsQueues: function(configPass){
			$('.content').empty().addClass('spinner');
			$('p.header_label').trigger('click');
			$("ul.filter li").removeClass("active");			
			
			var getQueues = SherpaDesk.getSherpaDesk(configPass, 'queues');
			
			getQueues.then(
			function(results){
				SherpaDesk.showQueueList(results);
			},
			//failed
			function(results){
				$('div.content').prepend('<div class=showalert></div>').removeClass('spinner');				
				addAlert("error", "There was a problem fetching your Queues.");
				}
			);
			
			getQueues.done(function(){
				//Add queue click listener
				getQueueLists(configPass);
				});
		},
	
	getQueueList: function(configPass, id){
		
		if($('div.content').length){
				$('.content').empty().addClass('spinner').trigger('click');
			} else {
				$('div.jPanelMenu-panel').append('<div class="content spinner"></div>');
				$('p.header_label').trigger('click');
			}
		
		
		// Get Tickets
		var getQueueList = SherpaDesk.getSherpaDesk(configPass, 'queues/' + id);
		//sucess
		getQueueList.then(
			function(results){
				SherpaDesk.showQueueTicketList(results);
			},
			//failed
			function(results){
				$('div.content').prepend('<div class=showalert></div>').removeClass('spinner');				
				addAlert("error", "There was a problem fetching your tickets.");
				}
			);
		getQueueList.done (
			function(){
				fromDate(".fromDate");				
				ticketActions(configPass);
				get_single_ticket(configPass);
				addResponse(configPass);
				addTime(configPass);
				getGravatar("p.cir_gravatar", 40);
				
				localStorage.setItem('sd_from_queueid', id);	
				
				if ( ($("ul.tickets li.ticket").size()) > 0){
						filterList();
					};
				$('li.time').hide();				
				}
				
			);
		
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
						ticketDetMenuActions();
						getGravatar("p.cir_gravatar", 80);//main gravatar					
						getGravatar("p.res_gravatar", 30);//responses gravatar
						fromDate("div.tkt_ini_res_date");								
						fromDate("p.note_time");
						ticketActions(configPass); //activate ticket action menu
						addResponse(configPass); // activate inline response listener
						addTime(configPass); // activate inline time listener
						ticket_list_menu(".right-menu","right"); //slide menu right side
						ticketListMenuActions(configPass, results.key); //add click listners for menu
						ticketJump(configPass);// add listener for ticket jump
						showTicketInfoPanel(); //show | hide info panel
						fixedDate("span.time");	
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
					}
				);
		},
	
	getTicketDetailTransfer: function(configPass, key){	
			
		$('div.ticket_detail_main').empty().addClass('spinner').trigger('click');
		$('a#ticketList').unbind('click').on('click', function(e){e.preventDefault(); SherpaDesk.getTicketDetail(configPass, key);});		
		
		SherpaDesk.showTransfer();
		
		var method = "technicians";
		var getTechs = SherpaDesk.getSherpaDesk(configPass, method);
	
		getTechs.then(
			//success
			function(results){
				$('div.ticket_detail_main').removeClass('spinner');
				SherpaDesk.showTechs(results);								
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
					addAlert("success", "Whew! That monkey is off your back!");
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
				addAlert("success", "See, now we're communicating.");
			},
			//failed
			function(results){
				SherpaDesk.getTicketDetailResponse(configPass, key);
				addAlert("error", "There was an problem posting your response.");	
			}
		);
		
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
				
				$('form.add_time button[type=submit]').on('click', function(e){
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
					addAlert("success", "Your time has been record.");
				},
				//failed
				function(results){
					SherpaDesk.getTicketDetailAddTime(configPass, key);
					addAlert("error", "Sorry, there was a problem posting your time.");	
				}
			);
		},
	
	//Add New Ticket
	addTicket: function(configPass){		
		var classes = SherpaDesk.getSherpaDesk(configPass, 'classes');
		var accounts = SherpaDesk.getSherpaDesk(configPass, 'accounts');
		var techs = SherpaDesk.getSherpaDesk(configPass, 'technicians');
		var user = SherpaDesk.getSherpaDesk(configPass, 'users?email=' + localStorage.sd_user_email);
		
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
			function(results){SherpaDesk.showClasses(results);},
			function(results){addAlert("error", "Could Not Retieve Classes");}	
			);
		
		$("select").uniform();
		
		$('div.content.ticket_add').show();
		$('body').removeClass('spinner');
		ticketDetMenuActions();
		user.done(function(results){ 
			$('form.create_ticket button[type=submit]').on('click', function(e){
					e.preventDefault();					
					var classSelected = $('form select#class option:selected').val(),
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
					SherpaDesk.init();
					addAlert("success", "Awesome Job! Your ticket was created.");
					},
				//failed
				function(){
					addAlert("error", "There was a problem submitting your ticket. Please try again.");
					}
			);
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
	showAccounts: function(accounts){
		var template = Handlebars.templates['accounts']; 							
		$('form select#account').append( template(accounts) );
		},
	showTechs: function(techs){
		var template = Handlebars.templates['techs']; 							
		$('form select#tech').append( template(techs) );
		},	
	showClasses: function(classes){
		var template = Handlebars.templates['classes']; 							
		$('form select#class').append( template(classes) );
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
		$('.content').append( template(que) ).slideDown().removeClass('spinner');
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
	showTransfer: function(techs){			
		var template = Handlebars.templates['transfer']; 							
		$('div.ticket_detail_main').append( template(techs) );
		$("select").uniform();
		},
	showTicketClose: function(){			
		var template = Handlebars.templates['closeTicket']; 							
		$('div.ticket_detail_main').append( template() ).removeClass('spinner');
		$("input[type=checkbox]").uniform();
		}
};

SherpaDesk.init();
	
// add listeners --------------------------------------------

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
		localStorage.removeItem('sd_from_queueid');			
		SherpaDesk.init();
		//SherpaDesk.getTickets(configPass);
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
			$(".tkt_actions").slideUp("slow"); // Hide other Comments  			
			if ($(this).next(".tkt_actions").is(":hidden")){
					var ticketKey = $(this).data('key');										
					$(this).next(".tkt_actions").slideToggle("slow");	
					SherpaDesk.getComments(configPass, ticketKey);	
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
		var response = htmlEscape( $(this).next().children('input#response').val().trim() );
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
	$('#jPanelMenu-menu li p#close').on('click', function(){ SherpaDesk.getTicketDetailClose(configPass, key) });
	$('#jPanelMenu-menu li p#response').on('click', function(){ SherpaDesk.getTicketDetailResponse(configPass, key) });	
	$('#jPanelMenu-menu li p#time').on('click', function(){ SherpaDesk.getTicketDetailAddTime(configPass, key) });		
	};
	
//insert images in comments
function getCommentImages(attachments){	
	$.each(attachments, function(key, value){
		var file = value.name,
			url = value.url,
			imageInsert = "<a class=\"comment_image_link\" target=\"_blank\" href=\"" + url + "\"><img class=\"comment_image\" src=\"" + url + "\" alt=\"" + file + "\"></a>",
			ext = file.substr( (file.lastIndexOf('.') +1) ).toLowerCase();
		if(ext === "jpg" || ext === "png" || ext === "gif" ){
			$('div.tkt_ini_response:contains(' + file + '), div.comment_main:contains(' + file + ')').append(imageInsert);
			};		 
		});		
	};

function get_single_ticket(configPass){
	
	$("a.get_single").on('click', function(){
		//$('body').empty().addClass('spinner'); 
		var key = $(this).data("reskey");
		SherpaDesk.getTicketDetail(configPass, key);
		});
	};

function getQueueLists(configPass){
	$('a.get_queue_list').on('click',function(){
		$('.content').empty().addClass('spinner'); 
		var id = $(this).data("queid");
		SherpaDesk.getQueueList(configPass, id)
		});
	};

function ticketDetMenuActions(){
	$('a#ticketList').on('click', function(e){
		e.preventDefault(); 
		$('body').empty();
		SherpaDesk.init();
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
	$('div.jPanelMenu-panel').attr('id', 'search_wrap');
	window.setTimeout(function(){
		var options = {
			listClass: 'tickets',
		    valueNames: [ 'tkt_number', 'tkt_subject', 'tkt_account', 'user_name' ]			
	    };
	    var featureList = new List('search_wrap', options);
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
		if(tech.length == 0){
			$('li p#close, li p#transfer, li p#time').parent().hide();
			$('li.time').hide();			
			};
				
		
		
	};	

/*
 * Helpers
 */
function htmlEscape(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
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
	},800);
	};

// Logout
function logOut(){
	$('body').empty().addClass('login');
	localStorage.removeItem('sd_api_key');
	localStorage.removeItem('sd_inst_key');
	localStorage.removeItem('sd_org_key');
	localStorage.removeItem('sd_from_queueid');	
	location.reload(true);
	};

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

// Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	    })(window,document,'script','http://www.google-analytics.com/analytics.js','ga');
	  
	    ga('create', 'UA-998328-15', 'sherpadesk.com');
	    ga('send', 'pageview');

	