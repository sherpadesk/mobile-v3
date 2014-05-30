$(document).ready(function(){
	
	var userOrgKey = "";
	var userOrg = "";
	var userInstanceKey = "";
	var	userKey = "xyjfvhjajkmcarswif5k0whm7hkhmfju";
	var accountDetailed = "";


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
						$(".timelogs").empty();
						for(var i = 0; i < returnData.length; i++)
						{
							var email = $.md5(returnData[i].user_email);
							var log = "<li><ul class='timelog'> <li><img class='timelogProfile' src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=30'></li><li><h2 class='feedName'>"+returnData[i].user_name+"</h2><p class='taskDescription'>"+returnData[i].note+"</p></li><li><img class='feedClock'src='img/clock_icon_small.png'><h3 class='feedTime'><span>"+returnData[i].hours+"</span> hrs</h3></li></ul></li>";
          					$(log).appendTo(".timelogs");
						}
					},
				error: function() {
					alert("fail @ timelogs");
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
			$(document).on("click",'.tableRows', function(){
				localStorage.setItem('DetailedAccount',$(this).attr("data-id"));
				window.location = "account_details.html";
			});
		},

		pageSetup: function() {
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
					$("#AD").html(returnData.name);
					$("#ticketsOptionTicker").html(returnData.account_statistics.ticket_counts.open);
					$("#invoiceOptionTicker").html(returnData.account_statistics.invoices);
					$("#ticketsOptionTicker").html(returnData.account_statistics.ticket_counts.timelogs);
					},
				error: function() {
					alert("fail @ accounts");
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
					console.log(returnData);
					$(".AccountDetailsTicketsContainer").empty(); 
					for(var i = 0; i < returnData.length; i++) 
					{	
						var email = $.md5(returnData[i].user_email);
						var ticket = "<ul class='responseBlock' id='thisBlock'><li><p class='blockNumber'>#"+returnData[i].number+"</p><img src='http://www.gravatar.com/avatar/" + email + "?d=mm&s=30' class='TicketBlockFace'><span>"+returnData[i].user_firstname+" "+returnData[i].user_lastname+"</span></li><li class='responseText'><h4>"+returnData[i].subject+"</h4><p>How to export tickets from one queue to another?</p></li><li><p class='TicketBlockNumber'>"+returnData[i].class_name+"</p></li></ul>";
						$(ticket).appendTo(".AccountDetailsTicketsContainer");
					}
				
					},
				error: function() {
					alert("fail @ accounts");
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
                          'Basic ' + btoa(userOrgKey + '-' + userInstanceKey +':'+userKey));
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
					alert("fail @ get getTicketCount");
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
                          'Basic ' + btoa(userOrgKey + '-' + userInstanceKey +':'+userKey));
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
					alert("fail");
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
                          'Basic ' + btoa(userOrgKey + '-' + userInstanceKey +':'+userKey));
				},

				url:"http://u0diuk-b95s6o:fzo3fkthioj5xi696jzocabuojekpb5o@api.beta.sherpadesk.com/accounts?query=account_statistics.ticket_counts.open>0",
				dataType:"json",
				success: function(returnData) {
					$(".ActiveAccountsContainer").empty();
					var tableHeader = "<ul class='tableHeader'><li></li><li>Hours</li><li>Invoice</li><li>Tickets</li></ul>";
					$(tableHeader).prependTo(".ActiveAccountsContainer");
					console.log(returnData);
					for (var i = 0; i < returnData.length; i++)
					{
						if(returnData[i].name.length > 9) {
							var activeAccount = "<ul class='tableRows clickme' data-id="+returnData[i].id+"><li>"+returnData[i].name.substring(0,8)+"..."+"</li><li>"+returnData[i].account_statistics.timelogs+"</li><li>"+returnData[i].account_statistics.invoices+"</li><li>"+returnData[i].account_statistics.ticket_counts.open+"</li></ul>";
						$(activeAccount).appendTo(".ActiveAccountsContainer");
						}else{
							var activeAccount = "<ul class='tableRows' data-id="+returnData[i].id+"><li>"+returnData[i].name+"</li><li>"+returnData[i].account_statistics.timelogs+"</li><li>"+returnData[i].account_statistics.invoices+"</li><li>"+returnData[i].account_statistics.ticket_counts.open+"</li></ul>";
						$(activeAccount).appendTo(".ActiveAccountsContainer");
					}
					}
					
					

					},
				error: function() {
					alert("fail @ get getTicketCount");
					console.log(userOrgKey + '-' + userInstanceKey +':'+userKey);(userOrg);
					}
		});
	};
	
	var org = {
		init: function() {
			this.getOrg();
		},

		getOrg: function() {
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
				success: function(returnData) {
					
					userOrgKey = returnData[0].key;
					userOrg = returnData[0].name;
					userInstanceKey = returnData[0].instances[0].key;
					$("#indexTitle").html(userOrg);
					storeLocalData();
					getTicketCount();
					getQueueList();
					getActiveAccounts();

				},
				error: function() {
					alert("fail @ getOrg");
				}
			}).promise();

		}
	};
	

	(function() {
		org.init();
		accountDetailsPageSetup.init();
		timeLogs.init();
		
	}()); 
	

});
