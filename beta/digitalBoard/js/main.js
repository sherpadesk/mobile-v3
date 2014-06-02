$(document).ready(function(){
	
	var userOrgKey = "";
	var userOrg = "";
	var userInstanceKey = "";
	var	userKey = "aofi3tjbmgf8krsfmmxjercmd6tuxea4";
	var accountDetailed = "";

	

	var storeLocalData = function() {
		localStorage.setItem('userOrgKey',userOrgKey);
		localStorage.setItem('userOrg',userOrg);
		localStorage.setItem('userInstanceKey',userInstanceKey);
		localStorage.setItem('userKey',userKey);
	};


	var getQueueList = function() {
		$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(userOrgKey + '-' + userInstanceKey +':'+userKey));
				},

				url:"http://api.sherpadesk.com/queues?sort_by=tickets_count",
				dataType:"json",
				success: function(returnData) {
						console.log(returnData);
						var que
						for(var i = 0; i < returnData.length; i++)
						{
							if(returnData[i].fullname === "Future Consideration")
							{
								que = returnData[i].id;
								alert(que);
							}
						} 
						$.ajax({
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.withCredentials = true;
				xhr.setRequestHeader('Authorization', 
                          'Basic ' + btoa(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey")));
				},

				url:"http://api.sherpadesk.com/tickets?status=open&que=271",
				dataType:"json",
				success: function(returnData) {
					console.log(returnData);
					$(".feedBackList").empty();
					for(var i =0; i < returnData.length; i++)
					{
						var insert =  "<li id="+i+"><i class='fa fa-quote-left pull-left'></i><strong>"+returnData[i].subject+" </strong>"+"</li>"
						$(insert).appendTo($(".feedBackList")).hide();
					}
					var x =0;
					var y = -1;
					window.setInterval(event, 15000);
					 function event() {
					 		$("#"+y).hide();
 							$("#"+x).show();
 							x++;
 							y++;
						}
				
					},
				error: function() {
					alert("fail @ accounts");
					console.log(localStorage.getItem("userOrgKey") + '-' + localStorage.getItem("userInstanceKey") +':'+localStorage.getItem("userKey"));
					}
			});
					},
				error: function() {
					alert("fail");
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
				url: 'http://api.sherpadesk.com/organizations/',
				async: true,
				cache: false,
				dataType: 'json',			
				success: function(returnData) {
					console.log(returnData);
					userOrgKey = returnData[1].key;
					userOrg = returnData[1].name;
					userInstanceKey = returnData[1].instances[0].key;
					
					storeLocalData();
					
					getQueueList();
					

				},
				error: function() {
					alert("fail @ getOrg");
				}
			}).promise();

		}
	};
	

	(function() {
		org.init();
	}()); 
	

});
