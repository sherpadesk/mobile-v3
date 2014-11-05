(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['accounts'] = template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "	<option data-accId=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" value=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</option>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1;
  stack1 = helpers.each.call(depth0, depth0, {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { return stack1; }
  else { return ''; }
  },"useData":true});
templates['account_list'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "	<div class=\"showalert\"></div>\r\n	<div class=\"accounts_list\">\r\n		<ul class=\"accounts\">\r\n";
  stack1 = helpers.each.call(depth0, depth0, {"name":"each","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "		</ul>\r\n	</div>\r\n";
},"2":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda;
  return "			<li class=\"account\">			\r\n				<a class=\"get_account_list\" data-accountid=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-open=\""
    + escapeExpression(lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.account_statistics : depth0)) != null ? stack1.ticket_counts : stack1)) != null ? stack1.open : stack1), depth0))
    + "\" data-name=\""
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "\">\r\n					<div class=\"account_main\">						\r\n						<p class=\"account_title\">"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</p>												\r\n						<p class=\"account_tkt_cnt\">"
    + escapeExpression(lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.account_statistics : depth0)) != null ? stack1.ticket_counts : stack1)) != null ? stack1.open : stack1), depth0))
    + "</p>                                     \r\n					</div>\r\n				</a>				\r\n			</li>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<header>\r\n	<div class=\"navbar\">\r\n		<div class=\"navbar-inner\">\r\n			<a href=\"#\" id=\"left-button\" class=\"menu_button header_left home_icon home_button\"></a>\r\n			<p class=\"header_label\">Accounts</p>                \r\n		</div> 		        \r\n	</div>\r\n</header>\r\n<div class=\"content\">\r\n";
  stack1 = helpers['if'].call(depth0, depth0, {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>";
},"useData":true});
templates['addTicket'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<a name=\"top\"/>\r\n<div class=\"navbar navbar-static-top\">\r\n	<div class=\"navbar-inner\">\r\n		<a class=\"menu_button header_left back_icon\" id=\"ticketList\"></a>\r\n		<p class=\"header_label\">Create New Ticket</p>\r\n	</div>  \r\n</div>\r\n\r\n<div class=\"content ticket_add\" style=\"display:none;\"> \r\n	<form class=\"create_ticket\">\r\n		<div class=\"showalert\"></div>	\r\n			\r\n		<label>Account</label>\r\n		<select name=\"account\" id=\"account\">\r\n			<option value=\"\">---</option>\r\n		</select>\r\n		<label>Technician</label>\r\n		<select name=\"tech\" id=\"tech\">\r\n			<option value=\"\">---</option>\r\n		</select>\r\n		<div class=\"add_class\">\r\n			<div class=\"main_class\">\r\n				<label>Class</label>\r\n				<select name=\"class\" id=\"class\">\r\n					<option value=\"\">---</option>			\r\n				</select>\r\n			</div>\r\n		</div>\r\n		\r\n		<label>Subject</label>\r\n		<input name=\"subject\" id=\"subject\" type=\"text\">\r\n		\r\n		<label>Details</label>\r\n		<textarea name=\"details\" id=\"details\" wrap=\"soft\" cols=\"50\" rows=\"10\" ></textarea>\r\n		\r\n		<button class=\"btn btn-large btn-block btn-success\" type=\"submit\">Create Ticket</button>\r\n	  \r\n	</form>  \r\n</div>";
  },"useData":true});
templates['addTicket_subClass1'] = template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "			<option data-classId=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" value=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</option>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "\r\n<div class=\"sub_class1\">\r\n	<label>>> Sub Class</label>\r\n	<select name=\"sub_class1\" id=\"sub_class1\">\r\n		<option value=\"\">---</option>\r\n";
  stack1 = helpers.each.call(depth0, depth0, {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "	</select>\r\n</div>";
},"useData":true});
templates['addTicket_subClass2'] = template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "			<option data-classId=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" value=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</option>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "\r\n<div class=\"sub_class2\">\r\n	<label>>> >> Sub Sub Class</label>\r\n	<select name=\"sub_class2\" id=\"sub_class2\">\r\n		<option value=\"\">---</option>\r\n";
  stack1 = helpers.each.call(depth0, depth0, {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "	</select>\r\n</div>";
},"useData":true});
templates['alert'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div class=\"alert alert-"
    + escapeExpression(((helper = (helper = helpers.message_type || (depth0 != null ? depth0.message_type : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"message_type","hash":{},"data":data}) : helper)))
    + "\">\r\n  <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\r\n  "
    + escapeExpression(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"message","hash":{},"data":data}) : helper)))
    + "\r\n</div>";
},"useData":true});
templates['classes'] = template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "	<option data-classId=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" value=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</option>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1;
  stack1 = helpers.each.call(depth0, depth0, {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { return stack1; }
  else { return ''; }
  },"useData":true});
templates['closeTicket'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<a name=\"top\"/>\r\n<div class=\"closeTicket\"> \r\n	<form class=\"close_ticket\" action=\"#\">\r\n		<div class=\"showalert\"></div>	\r\n		\r\n		<label>\r\n	      <input type=\"checkbox\" id=\"closeNotice\" name=\"closeNotice\"> Notify user via email\r\n	    </label>		\r\n		\r\n		<label>Add Note</label>\r\n		<textarea name=\"details\" id=\"details\" wrap=\"soft\" cols=\"50\" rows=\"10\" ></textarea>\r\n		\r\n		<button class=\"btn btn-large btn-block btn-warning\" type=\"submit\">Close This Ticket</button>\r\n	  \r\n	</form>  \r\n</div>";
  },"useData":true});
templates['dashboard'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div class=\"side-menu\" style=\"display:none;\">\r\n	<ul>\r\n		<li class=\"searchform\">\r\n			<input type=\"text\" placeholder=\"Jump to Ticket #\" class=\"ticket-jump-menu\">\r\n		</li>\r\n		<li><p id=\"queues\"><i class=\"icon-folder-open icon-white\"></i> Queues</p></li>\r\n		<li><p id=\"orgInst\"><i class=\"icon-list-alt icon-white\"></i> Change Org/Inst</p></li>\r\n		<li><p id=\"logout\"><i class=\"icon-off icon-white\"></i> Log out</p></li>\r\n		<li><a "
    + escapeExpression(((helper = (helper = helpers.full_app_link || (depth0 != null ? depth0.full_app_link : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"full_app_link","hash":{},"data":data}) : helper)))
    + "><p id=\"fullSite\"><i class=\"icon-share-alt icon-white\"></i> Switch to Full App</p></a></li>\r\n	</ul>    \r\n</div>\r\n<header>\r\n	<div class=\"navbar\">\r\n		<div class=\"navbar-inner\">\r\n			<a href=\"#\" id=\"left-button\" class=\"menu_button header_left menu_icon ticket_list_menu\"></a>\r\n			<a href=\"#\" id=\"right-button\" class=\"menu_button header_right add_icon add_ticket_button\"></a>\r\n			<p class=\"header_label\">SherpaDesk</p>                \r\n		</div>\r\n</header>\r\n\r\n<div class=\"showalert\"></div>\r\n	<div class=\"dashboard\">\r\n    	<div class=\"dash-tkts\">\r\n                <div data-asrole=\"tech\" class=\"get-tickets dash-astech blue-fade\">\r\n                    <p class=\"dash-number-large\">"
    + escapeExpression(((helper = (helper = helpers.open_as_tech || (depth0 != null ? depth0.open_as_tech : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"open_as_tech","hash":{},"data":data}) : helper)))
    + "</p>\r\n                    <p class=\"dash-desc-large\">Tickets As Tech</p>\r\n                </div>\r\n                <div data-asrole=\"user\" class=\"get-tickets blue tkt-right\">\r\n                    <p class=\"dash-number-sm left-num blue-fade\">"
    + escapeExpression(((helper = (helper = helpers.open_as_user || (depth0 != null ? depth0.open_as_user : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"open_as_user","hash":{},"data":data}) : helper)))
    + "</p>\r\n                    <p class=\"dash-desc\"><span>As</span><br/>User</p>\r\n                </div>\r\n                <div data-asrole=\"alt_tech\" class=\"get-tickets blue tkt-right\">\r\n                    <p class=\"dash-number-sm left-num blue-fade\">"
    + escapeExpression(((helper = (helper = helpers.open_as_alttech || (depth0 != null ? depth0.open_as_alttech : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"open_as_alttech","hash":{},"data":data}) : helper)))
    + "</p>\r\n                    <p class=\"dash-desc\"><span>Alt</span><br/>Tech</p>\r\n                </div>\r\n                <div data-asrole=\"all\" class=\"get-tickets blue tkt-right last\">\r\n                    <p class=\"dash-number-sm left-num blue-fade\">"
    + escapeExpression(((helper = (helper = helpers.open_all || (depth0 != null ? depth0.open_all : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"open_all","hash":{},"data":data}) : helper)))
    + "</p>\r\n                    <p class=\"dash-desc\">All<br/>Open</p>\r\n                </div>\r\n        </div><!-- End Dash Tickets -->\r\n        <div class=\"dash-options\">\r\n	                <div id=\"option_time\" class=\"option-single blue\">\r\n	                    <p class=\"dash-icon\"><img src=\"img/dash-clock.png\" width=\"55\" alt=\"Add\"></p>\r\n	                    <p class=\"dash-desc-md\">Time</p>\r\n	                </div>\r\n	                <div id=\"option_accounts\" class=\"option-single blue\">\r\n	                    <p class=\"dash-icon\"><img src=\"img/dash-accounts.png\" width=\"55\" alt=\"Add\"></p>\r\n	                    <p class=\"dash-desc-md\">Accounts</p>\r\n	                </div>\r\n	                <div id=\"option_add_ticket\" class=\"option-single green\">\r\n	                    <p class=\"dash-icon\"><img src=\"img/dash-plus-gr.png\" width=\"55\" alt=\"Add\"></p>\r\n	                    <p class=\"dash-desc-md\">Ticket</p>\r\n	                </div>\r\n        </div><!-- End Dash Options -->\r\n    </div><!-- End Dashboard -->";
},"useData":true});
templates['inst'] = template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda;
  return "				<option data-orgkey=\""
    + escapeExpression(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"key","hash":{},"data":data}) : helper)))
    + "\" value=\""
    + escapeExpression(lambda((data && data.index), depth0))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</option>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class=\"content\">\r\n	<div class=\"login-container\">    \r\n		<form class=\"form-signin\">\r\n			<div class=\"logo\"><img src=\"img/Sherpa_Desk-logo.png\"></div>\r\n			<div class=\"showalert\"></div>\r\n			<h2>Select Your Instance</h2>			\r\n			<select name=\"inst\" id=\"inst\">\r\n				<option value=\"\" selected=\"selected\">Choose an Instance</option>\r\n";
  stack1 = helpers.each.call(depth0, depth0, {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "			</select>\r\n		</form>		\r\n	</div>\r\n</div>";
},"useData":true});
templates['levels'] = template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "	<option data-levelId=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" value=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</option>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1;
  stack1 = helpers.each.call(depth0, depth0, {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { return stack1; }
  else { return ''; }
  },"useData":true});
templates['login'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"content\">	\r\n	<div class=\"login-container\">     		\r\n		<form class=\"form-signin\">			\r\n			<div class=\"logo\">\r\n				<img src=\"img/Sherpa_Desk-logo.png\">\r\n			</div>			\r\n			<div class=\"showalert\">\r\n			</div>			 			\r\n			<input type=\"email\" id=\"email\" class=\"input-block-level\" placeholder=\"Email Address\">			\r\n			<input type=\"password\" id=\"password\" class=\"input-block-level\" placeholder=\"Password\">			 			\r\n			<button class=\"btn btn-large btn-block btn-success\" type=\"submit\">Sign in\r\n			</button>		\r\n		</form>		 	\r\n		<hr/> \r\n		<form class=google_openid action='' method=POST> \r\n			<a class='sign-in-with-google' href=#>\r\n				<span>Sign in with <strong>Google</strong>\r\n				</span></a>  \r\n		</form>\r\n		<form class=login_signup action='' method=POST>  \r\n			<p/>\r\n			<p>New to SherpaDesk?\r\n			</p>  \r\n			<a href=# class='btn btn-large btn-block btn-success login_signup'>Get Started for FREE</a>   		\r\n	</div>	\r\n	<!-- Sign up Form	<div class='login_signup'>    	<img class='signup_img' src='img/jangbu-signup.png'>                <div class='signup_content'>        	<p>New to SherpaDesk?</p>      </div>   </div>	-->\r\n</div>\r\n</div>";
  },"useData":true});
templates['orgs'] = template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda;
  return "				<option data-orgkey=\""
    + escapeExpression(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"key","hash":{},"data":data}) : helper)))
    + "\" value=\""
    + escapeExpression(lambda((data && data.index), depth0))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</option>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class=\"content\">\r\n	<div class=\"login-container\">    \r\n		<form class=\"form-signin\">\r\n			<div class=\"logo\"><img src=\"img/Sherpa_Desk-logo.png\"></div>\r\n			<div class=\"showalert\"></div>\r\n			<h2>Select Your Organization</h2>			\r\n			<select name=\"orgs\" id=\"orgs\">\r\n			  	<option value=\"\" selected=\"selected\">Choose an Org</option>\r\n";
  stack1 = helpers.each.call(depth0, depth0, {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "			</select>\r\n		</form>		\r\n	</div>\r\n</div>";
},"useData":true});
templates['priorities'] = template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "	<option data-levelId=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" value=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.priority_level || (depth0 != null ? depth0.priority_level : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"priority_level","hash":{},"data":data}) : helper)))
    + " - "
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</option>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1;
  stack1 = helpers.each.call(depth0, depth0, {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { return stack1; }
  else { return ''; }
  },"useData":true});
templates['projects'] = template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "	<option data-proId=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" value=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</option>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1;
  stack1 = helpers.each.call(depth0, depth0, {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { return stack1; }
  else { return ''; }
  },"useData":true});
templates['queue_list'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "	<div class=\"showalert\"></div>\r\n	<div class=\"queues_list\" id=\"filter_list\">\r\n		<ul class=\"queues\">\r\n";
  stack1 = helpers.each.call(depth0, depth0, {"name":"each","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "		</ul>\r\n	</div>\r\n";
},"2":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "			<li class=\"queue\">				\r\n				<a class=\"get_queue_list\" data-queid=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\">\r\n					<div class=\"que_main\">						\r\n						<p class=\"que_title\">"
    + escapeExpression(((helper = (helper = helpers.fullname || (depth0 != null ? depth0.fullname : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"fullname","hash":{},"data":data}) : helper)))
    + "</p>												\r\n						<p class=\"que_tkt_cnt\">"
    + escapeExpression(((helper = (helper = helpers.tickets_count || (depth0 != null ? depth0.tickets_count : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"tickets_count","hash":{},"data":data}) : helper)))
    + "</p>                                     \r\n					</div>\r\n				</a>				\r\n			</li>\r\n";
},"4":function(depth0,helpers,partials,data) {
  return "	<div class=\"noTickets\">\r\n		<h2>We Don't Need No Stinkin' Queues</h2>\r\n		<p>But maybe you should try them out.</p>\r\n	</div>\r\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class=\"content\">\r\n";
  stack1 = helpers['if'].call(depth0, depth0, {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(4, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>";
},"useData":true});
templates['taskTypes'] = template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "	<option data-taskId=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" value=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</option>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1;
  stack1 = helpers.each.call(depth0, depth0, {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { return stack1; }
  else { return ''; }
  },"useData":true});
templates['techs'] = template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "	<option data-techId=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" value=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.firstname || (depth0 != null ? depth0.firstname : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"firstname","hash":{},"data":data}) : helper)))
    + " "
    + escapeExpression(((helper = (helper = helpers.lastname || (depth0 != null ? depth0.lastname : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"lastname","hash":{},"data":data}) : helper)))
    + "</option>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1;
  stack1 = helpers.each.call(depth0, depth0, {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { return stack1; }
  else { return ''; }
  },"useData":true});
templates['ticketDetail_content'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\"content ticket_detail\"> \r\n		<div class=\"ticket_info\" style=\"display: none;\">\r\n        	<ul>\r\n				\r\n			</ul>\r\n        </div> \r\n		<div class=\"ticket_detail_main\"> \r\n			<div class=\"showalert\"></div>	     \r\n	        \r\n	        <div class=\"tkt_initial_post\">\r\n	        	<div class=\"tkt_ini_gravatar\">\r\n	            	<p class=\"cir_gravatar\" data-email=\""
    + escapeExpression(((helper = (helper = helpers.user_email || (depth0 != null ? depth0.user_email : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"user_email","hash":{},"data":data}) : helper)))
    + "\"></p>\r\n	                <p class=\"tkt_user\">"
    + escapeExpression(((helper = (helper = helpers.user_firstname || (depth0 != null ? depth0.user_firstname : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"user_firstname","hash":{},"data":data}) : helper)))
    + " "
    + escapeExpression(((helper = (helper = helpers.user_lastname || (depth0 != null ? depth0.user_lastname : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"user_lastname","hash":{},"data":data}) : helper)))
    + "</p>\r\n					<p class=\"tkt_user_account\">"
    + escapeExpression(((helper = (helper = helpers.account_name || (depth0 != null ? depth0.account_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"account_name","hash":{},"data":data}) : helper)))
    + "</p>\r\n	            </div>\r\n				<div class=\"tkt_subject\">\r\n		        	"
    + escapeExpression(((helpers.htmlEscape || (depth0 && depth0.htmlEscape) || helperMissing).call(depth0, (depth0 != null ? depth0.subject : depth0), {"name":"htmlEscape","hash":{},"data":data})))
    + "\r\n		        </div>\r\n	            <div class=\"tkt_ini_response\">\r\n	            	";
  stack1 = ((helpers.linebreaks || (depth0 && depth0.linebreaks) || helperMissing).call(depth0, (depth0 != null ? depth0.initial_post : depth0), {"name":"linebreaks","hash":{},"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n	            </div>\r\n	        </div>\r\n	        \r\n	        <div class=\"tkt_actions\" data-reskey=\""
    + escapeExpression(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"key","hash":{},"data":data}) : helper)))
    + "\">\r\n				<div class=\"tkt_actions_menu\">\r\n						<div class=\"tkt_actions_menu_type\">Responses</div>\r\n						<ul>\r\n							<li data-respkey=\""
    + escapeExpression(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"key","hash":{},"data":data}) : helper)))
    + "\" class=\"responses active\"></li>\r\n							<li data-respkey=\""
    + escapeExpression(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"key","hash":{},"data":data}) : helper)))
    + "\" class=\"time\"></li>                                	\r\n						</ul>                            \r\n					</div>\r\n					<div class=\"tkt_add_response\">\r\n						<button class=\"add_response\" data-reskey=\""
    + escapeExpression(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"key","hash":{},"data":data}) : helper)))
    + "\">Add</button>\r\n						<div class=\"tkt_add_response_input\">\r\n							<textarea id=\"response\" name=\"response\" placeholder=\"Add Response\"></textarea>\r\n						</div>								\r\n					</div>\r\n					<div class=\"tkt_add_time\">\r\n						<button class=\"add_tkt_time\" data-reskey=\""
    + escapeExpression(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"key","hash":{},"data":data}) : helper)))
    + "\">Add<br/>Time</button>\r\n						<div class=\"tkt_add_time_input\">\r\n							<button class=\"minus_time\">-</button>\r\n							<button class=\"plus_time\">+</button>\r\n							<p>\r\n								<input type=\"number\" class=\"add_time\" name=\"add_time\" value=\"0\" step=\".25\" />\r\n							</p>\r\n							<p>\r\n								<select name=\"task_type\" id=\"task_type\">\r\n						  			<option value=\"\">Task Type</option>\r\n						  		</select>\r\n							</p>                                   \r\n						</div>								\r\n					</div>\r\n				\r\n				<ul class=\"responses\">                         	\r\n						\r\n				</ul>\r\n			</div>\r\n		</div>        \r\n    </div>";
},"useData":true});
templates['ticketDetail_header'] = template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return escapeExpression(((helper = (helper = helpers.user_fullname || (depth0 != null ? depth0.user_fullname : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"user_fullname","hash":{},"data":data}) : helper)))
    + "&nbsp;&nbsp;";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<header>\r\n	<div class=\"right-menu\" style=\"display:none;\">\r\n		<ul>\r\n			<li class=\"searchform\">\r\n				<input type=\"text\" placeholder=\"Jump to Ticket #\" class=\"ticket-jump-menu\">\r\n			</li>\r\n			<li><p id=\"transfer\"><i class=\"icon-retweet icon-white\"></i> Transfer</p></li>\r\n			<li><p id=\"pickup\"><i class=\"icon-hand-up icon-white\"></i> Pick Up Ticket</p></li>\r\n			<li><p id=\"edit\"><i class=\"icon-edit icon-white\"></i> Edit</p></li>\r\n			<li><p id=\"close\"><i class=\"icon-remove icon-white\"></i> Close</p></li>\r\n			<li><p id=\"response\"><i class=\"icon-comment icon-white\"></i> Response</p></li>\r\n			<li><p id=\"time\"><i class=\"icon-time icon-white\"></i> Time</p></li>\r\n		</ul>    \r\n	</div>\r\n	\r\n	<div class=\"navbar navbar-static-top\">\r\n		<div class=\"navbar-inner\">\r\n			<a class=\"menu_button header_left back_icon\" id=\"ticketList\"></a>\r\n			<a href=\"#\" class=\"menu_button header_right menu_icon ticket_list_menu\"></a>\r\n			<p class=\"header_label\">"
    + escapeExpression(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"status","hash":{},"data":data}) : helper)))
    + " | "
    + escapeExpression(((helper = (helper = helpers.number || (depth0 != null ? depth0.number : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"number","hash":{},"data":data}) : helper)))
    + "</p>		\r\n		</div>\r\n		<div class=\"header_ticket_detail\">\r\n			<div class=\"menu_button header_right info_icon\"></div>\r\n			<div class=\"tkt_head_info\">\r\n				<div class=\"tkt_det_head_date\">"
    + escapeExpression(((helper = (helper = helpers.created_time || (depth0 != null ? depth0.created_time : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"created_time","hash":{},"data":data}) : helper)))
    + "</div>\r\n				<div class=\"tkt_det_head_account\">"
    + escapeExpression(((helper = (helper = helpers.account_name || (depth0 != null ? depth0.account_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"account_name","hash":{},"data":data}) : helper)))
    + "</div>				\r\n				<div class=\"tkt_det_head_user\">";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.technicians : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>\r\n			</div>            \r\n		</div>  \r\n	</div>\r\n</header>";
},"useData":true});
templates['ticketDetail_info'] = template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li>\r\n    <p>Hours: <strong>"
    + escapeExpression(((helper = (helper = helpers.total_hours || (depth0 != null ? depth0.total_hours : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"total_hours","hash":{},"data":data}) : helper)))
    + " hr</strong></p>    \r\n</li>\r\n";
},"3":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li>\r\n    <p>Estimated: <strong>"
    + escapeExpression(((helper = (helper = helpers.estimated_time || (depth0 != null ? depth0.estimated_time : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"estimated_time","hash":{},"data":data}) : helper)))
    + " hr</strong></p>    \r\n</li>\r\n";
},"5":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li>\r\n    <p>Location: <strong>"
    + escapeExpression(((helper = (helper = helpers.location_name || (depth0 != null ? depth0.location_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"location_name","hash":{},"data":data}) : helper)))
    + " hr</strong></p>    \r\n</li>\r\n";
},"7":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return " - "
    + escapeExpression(((helper = (helper = helpers.level_name || (depth0 != null ? depth0.level_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"level_name","hash":{},"data":data}) : helper)));
},"9":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return " - "
    + escapeExpression(((helper = (helper = helpers.priority_name || (depth0 != null ? depth0.priority_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"priority_name","hash":{},"data":data}) : helper)));
},"11":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li>\r\n    <p>Request Completion Date: <strong><span class=\"time\">"
    + escapeExpression(((helper = (helper = helpers.request_completion_date || (depth0 != null ? depth0.request_completion_date : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"request_completion_date","hash":{},"data":data}) : helper)))
    + "</span></strong></p>    \r\n</li>\r\n";
},"13":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li>\r\n    <p>Follow Up: <strong><span class=\"time\">"
    + escapeExpression(((helper = (helper = helpers.followup_date || (depth0 != null ? depth0.followup_date : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"followup_date","hash":{},"data":data}) : helper)))
    + "</span></strong></p>    \r\n</li>\r\n";
},"15":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li>\r\n    <p>SLA Complete Date: <strong><span class=\"time\">"
    + escapeExpression(((helper = (helper = helpers.sla_complete_date || (depth0 != null ? depth0.sla_complete_date : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"sla_complete_date","hash":{},"data":data}) : helper)))
    + "</span></strong></p>    \r\n</li>\r\n";
},"17":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.sla_response_date : depth0), {"name":"if","hash":{},"fn":this.program(18, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"18":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "    <li>\r\n    	<p>SLA Response Date: <strong><span class=\"time\">"
    + escapeExpression(((helper = (helper = helpers.sla_response_date || (depth0 != null ? depth0.sla_response_date : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"sla_response_date","hash":{},"data":data}) : helper)))
    + "</span></strong></p>    \r\n    </li>\r\n";
},"20":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li>\r\n    <p>Confirmed: <strong><span class=\"time\">"
    + escapeExpression(((helper = (helper = helpers.confirmed_date || (depth0 != null ? depth0.confirmed_date : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"confirmed_date","hash":{},"data":data}) : helper)))
    + "</span></strong></p>    \r\n</li>\r\n";
},"22":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<li>\r\n    <p>Next Step Date: <strong><span class=\"time\">"
    + escapeExpression(((helper = (helper = helpers.next_step_date || (depth0 != null ? depth0.next_step_date : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"next_step_date","hash":{},"data":data}) : helper)))
    + "</span></strong></p>    \r\n</li>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.total_hours : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.estimated_time : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "<li>\r\n    <p>Last Updated: <strong><span class=\"time\">"
    + escapeExpression(((helper = (helper = helpers.updated_time || (depth0 != null ? depth0.updated_time : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"updated_time","hash":{},"data":data}) : helper)))
    + "</span></strong></p>    \r\n</li>\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.location_name : depth0), {"name":"if","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "<li>\r\n    <p>Class: <strong>"
    + escapeExpression(((helper = (helper = helpers.class_name || (depth0 != null ? depth0.class_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"class_name","hash":{},"data":data}) : helper)))
    + "</strong></p>    \r\n</li>\r\n<li>\r\n    <p>Level: <strong>"
    + escapeExpression(((helper = (helper = helpers.level || (depth0 != null ? depth0.level : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"level","hash":{},"data":data}) : helper)));
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.level_name : depth0), {"name":"if","hash":{},"fn":this.program(7, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "</strong></p>    \r\n</li>\r\n\r\n<li>\r\n    <p>Priority: <strong>"
    + escapeExpression(((helper = (helper = helpers.priority || (depth0 != null ? depth0.priority : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"priority","hash":{},"data":data}) : helper)));
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.priority_name : depth0), {"name":"if","hash":{},"fn":this.program(9, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "</strong></p>    \r\n</li>\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.request_completion_date : depth0), {"name":"if","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.followup_date : depth0), {"name":"if","hash":{},"fn":this.program(13, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.sla_complete_date : depth0), {"name":"if","hash":{},"fn":this.program(15, data),"inverse":this.program(17, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.confirmed_date : depth0), {"name":"if","hash":{},"fn":this.program(20, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.next_step_date : depth0), {"name":"if","hash":{},"fn":this.program(22, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n";
},"useData":true});
templates['ticketDet_AddTime'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<a name=\"top\"/>\r\n<div class=\"content time_add\"> \r\n	<form class=\"add_time\">\r\n		<div class=\"showalert\"></div>\r\n		\r\n		<div class=\"tkt_add_time\">\r\n			<div class=\"tkt_add_time_input\">\r\n				<button class=\"minus_time\">-</button>\r\n				<button class=\"plus_time\">+</button>\r\n				<p>\r\n					<input type=\"number\" class=\"add_time\" name=\"add_time\" value=\"0\" step=\".25\" />\r\n				</p>                                    \r\n			</div>								\r\n		</div>		\r\n		\r\n		<label>Select Task Type</label>\r\n		<select name=\"task_type\" id=\"task_type\">\r\n			<option value=\"\">---</option>\r\n		</select>		\r\n		\r\n		<label>Notes</label>\r\n		<textarea name=\"details\" id=\"details\" wrap=\"soft\" cols=\"50\" rows=\"10\" ></textarea>\r\n		\r\n		<button class=\"btn btn-large btn-block btn-success\" type=\"submit\">Add Time</button>\r\n	  \r\n	</form>  \r\n</div>";
  },"useData":true});
templates['ticketDet_Edit'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<a name=\"top\"/>\r\n<div class=\"update\" style=\"display: none;\"> \r\n	<form class=\"update_ticket\" action=\"#\">\r\n		<div class=\"showalert\"></div>	\r\n		\r\n		<label>Account</label>\r\n		<select name=\"account\" id=\"account\">\r\n			<option value=\"\"></option>\r\n		</select>\r\n		\r\n		<div class=\"add_class\">\r\n				<label>Class</label>\r\n				<select name=\"class\" id=\"class\">\r\n					<option data-classId=\""
    + escapeExpression(((helper = (helper = helpers.class_id || (depth0 != null ? depth0.class_id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"class_id","hash":{},"data":data}) : helper)))
    + "\" value=\""
    + escapeExpression(((helper = (helper = helpers.class_id || (depth0 != null ? depth0.class_id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"class_id","hash":{},"data":data}) : helper)))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.class_name || (depth0 != null ? depth0.class_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"class_name","hash":{},"data":data}) : helper)))
    + "</option>			\r\n				</select>\r\n		</div>	\r\n		\r\n		<label>Level</label>\r\n		<select name=\"level\" id=\"level\">\r\n			<option value=\"\"></option>			\r\n		</select>	\r\n		\r\n		<label>Priority</label>\r\n		<select name=\"priority\" id=\"priority\">\r\n			<option value=\"\"></option>		\r\n		</select>	\r\n		<br/>\r\n		<br/>\r\n		<button class=\"btn btn-large btn-block btn-success ticket-update\" type=\"submit\">Update Ticket</button>\r\n	  \r\n	</form>  \r\n</div>";
},"useData":true});
templates['ticketDet_response'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<a name=\"top\"/>\r\n<div class=\"content response_add\"> \r\n	<form class=\"create_response\">\r\n		<div class=\"showalert\"></div>	\r\n		\r\n		<textarea name=\"details\" id=\"details\" wrap=\"soft\" cols=\"50\" rows=\"10\" ></textarea>\r\n		\r\n		<button class=\"btn btn-large btn-block btn-success\" type=\"submit\">Add Response</button>\r\n	  \r\n	</form>  \r\n</div>";
  },"useData":true});
templates['ticket_header'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<header>\r\n	<div class=\"navbar\">\r\n		<div class=\"navbar-inner\">\r\n			<a href=\"#\" id=\"left-button\" class=\"menu_button header_left home_icon home_button\"></a>\r\n			<a href=\"#\" id=\"right-button\" class=\"menu_button header_right add_icon add_ticket_button\"></a>\r\n			<p class=\"header_label\">Tickets</p>                \r\n		</div> \r\n		<div class=\"header_search_tickets\">\r\n			<input type=\"text\" class=\"search\" placeholder=\"Search Tickets\">\r\n		</div> \r\n		<div class=\"header_user_type\">\r\n			<ul class=\"filter\">\r\n				<li data-asrole=\"user\">As User</li>\r\n                <li data-asrole=\"tech\">As Tech</li>\r\n                <li data-asrole=\"alt_tech\">As Alt Tech</li>\r\n				<li class=\"open_tickets\" data-asrole=\"all\">All Open</li>\r\n			</ul>\r\n		</div>          \r\n	</div>\r\n</header>";
  },"useData":true});
templates['ticket_list'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class=\"content\">\r\n	<div class=\"showalert\"></div>\r\n	<div class=\"tickets_list\" id=\"filter_list\">\r\n		<ul class=\"tickets\">\r\n";
  stack1 = helpers.each.call(depth0, depth0, {"name":"each","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "		</ul>\r\n		<div class=\"loadingtickets\"></div>\r\n	</div>\r\n</div>\r\n";
},"2":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "			<li class=\"ticket\">\r\n				<div class=\"gravatar\">	\r\n					<p class=\"cir_gravatar\" data-email=\""
    + escapeExpression(((helper = (helper = helpers.user_email || (depth0 != null ? depth0.user_email : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"user_email","hash":{},"data":data}) : helper)))
    + "\"></p>	\r\n					<p class=\"user_name\">"
    + escapeExpression(((helper = (helper = helpers.user_firstname || (depth0 != null ? depth0.user_firstname : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"user_firstname","hash":{},"data":data}) : helper)))
    + " "
    + escapeExpression(((helper = (helper = helpers.user_lastname || (depth0 != null ? depth0.user_lastname : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"user_lastname","hash":{},"data":data}) : helper)))
    + "</p>\r\n				</div>\r\n				<a class=\"get_single\" data-reskey=\""
    + escapeExpression(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"key","hash":{},"data":data}) : helper)))
    + "\">\r\n				<div class=\"tkt_main\">                        	\r\n					<!-- Ticket Number --> <!-- Ticket date -->\r\n					<div class=\"tkt_top\">\r\n						<p class=\"tkt_number\">"
    + escapeExpression(((helper = (helper = helpers.prefix || (depth0 != null ? depth0.prefix : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"prefix","hash":{},"data":data}) : helper)))
    + escapeExpression(((helper = (helper = helpers.number || (depth0 != null ? depth0.number : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"number","hash":{},"data":data}) : helper)))
    + "</p>\r\n						<p class=\"tkt_date fromDate\">"
    + escapeExpression(((helper = (helper = helpers.created_time || (depth0 != null ? depth0.created_time : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"created_time","hash":{},"data":data}) : helper)))
    + "</p>\r\n					</div>\r\n					<!-- Ticket subject -->\r\n					<!-- Ticket account info -->  \r\n					<div class=\"tkt_bottom\">\r\n						<p class=\"tkt_subject\">"
    + escapeExpression(((helpers.htmlEscape || (depth0 && depth0.htmlEscape) || helperMissing).call(depth0, (depth0 != null ? depth0.subject : depth0), {"name":"htmlEscape","hash":{},"data":data})))
    + "</p>\r\n						<p class=\"tkt_account\">"
    + escapeExpression(((helper = (helper = helpers.account_name || (depth0 != null ? depth0.account_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"account_name","hash":{},"data":data}) : helper)))
    + "</p>\r\n					</div>                                     \r\n				</div>\r\n				</a>\r\n				<div class=\"see_more\" data-key=\""
    + escapeExpression(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"key","hash":{},"data":data}) : helper)))
    + "\"></div>\r\n				<div class=\"tkt_actions\" data-reskey=\""
    + escapeExpression(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"key","hash":{},"data":data}) : helper)))
    + "\">\r\n					<div class=\"tkt_actions_menu\">\r\n						<div class=\"tkt_actions_menu_type\">Responses</div>\r\n						<ul>\r\n							<li data-respkey=\""
    + escapeExpression(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"key","hash":{},"data":data}) : helper)))
    + "\" class=\"responses active\"></li>\r\n							<li data-respkey=\""
    + escapeExpression(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"key","hash":{},"data":data}) : helper)))
    + "\" class=\"time\"></li>                                	\r\n						</ul>                            \r\n					</div>\r\n					<div class=\"tkt_add_response\">\r\n						<button class=\"add_response\" data-reskey=\""
    + escapeExpression(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"key","hash":{},"data":data}) : helper)))
    + "\">Add</button>\r\n						<div class=\"tkt_add_response_input\">\r\n							<textarea id=\"response\" name=\"response\" placeholder=\"Add Response\"></textarea>\r\n						</div>								\r\n					</div>\r\n					<div class=\"tkt_add_time\">\r\n						<button class=\"add_tkt_time\" data-reskey=\""
    + escapeExpression(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"key","hash":{},"data":data}) : helper)))
    + "\">Add<br/>Time</button>\r\n						<div class=\"tkt_add_time_input\">\r\n							<button class=\"minus_time\">-</button>\r\n							<button class=\"plus_time\">+</button>\r\n							<p>\r\n								<input type=\"number\" class=\"add_time\" name=\"add_time\" value=\"0\" step=\".25\" />\r\n							</p>\r\n							<p>\r\n								<select name=\"task_type\" id=\"task_type\">\r\n						  			<option value=\"\">Task Type</option>\r\n						  		</select>\r\n							</p>                                   \r\n						</div>								\r\n					</div>\r\n					\r\n					<ul class=\"responses\">                         	\r\n							\r\n					</ul>\r\n				</div>	\r\n			</li>\r\n";
},"4":function(depth0,helpers,partials,data) {
  return "<div class=\"content\">\r\n	<div class=\"noTickets\">\r\n		<h2>No Tickets Here Mate</h2>\r\n		<p>Perhaps this is a good time to celebrate!</p>\r\n	</div>\r\n</div>\r\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1;
  stack1 = helpers['if'].call(depth0, depth0, {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(4, data),"data":data});
  if (stack1 != null) { return stack1; }
  else { return ''; }
  },"useData":true});
templates['ticket_list_append'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers.each.call(depth0, depth0, {"name":"each","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"2":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "	<li class=\"ticket "
    + escapeExpression(((helper = (helper = helpers.page || (depth0 != null ? depth0.page : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"page","hash":{},"data":data}) : helper)))
    + "\">\r\n		<div class=\"gravatar\">	\r\n			<p class=\"cir_gravatar\" data-email=\""
    + escapeExpression(((helper = (helper = helpers.user_email || (depth0 != null ? depth0.user_email : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"user_email","hash":{},"data":data}) : helper)))
    + "\"></p>	\r\n			<p class=\"user_name\">"
    + escapeExpression(((helper = (helper = helpers.user_firstname || (depth0 != null ? depth0.user_firstname : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"user_firstname","hash":{},"data":data}) : helper)))
    + " "
    + escapeExpression(((helper = (helper = helpers.user_lastname || (depth0 != null ? depth0.user_lastname : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"user_lastname","hash":{},"data":data}) : helper)))
    + "</p>\r\n		</div>\r\n		<a class=\"get_single\" data-reskey=\""
    + escapeExpression(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"key","hash":{},"data":data}) : helper)))
    + "\">\r\n		<div class=\"tkt_main\">                        	\r\n			<!-- Ticket Number --> <!-- Ticket date -->\r\n			<div class=\"tkt_top\">\r\n				<p class=\"tkt_number\">"
    + escapeExpression(((helper = (helper = helpers.prefix || (depth0 != null ? depth0.prefix : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"prefix","hash":{},"data":data}) : helper)))
    + escapeExpression(((helper = (helper = helpers.number || (depth0 != null ? depth0.number : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"number","hash":{},"data":data}) : helper)))
    + "</p>\r\n				<p class=\"tkt_date fromDate "
    + escapeExpression(((helper = (helper = helpers.page || (depth0 != null ? depth0.page : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"page","hash":{},"data":data}) : helper)))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.created_time || (depth0 != null ? depth0.created_time : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"created_time","hash":{},"data":data}) : helper)))
    + "</p>\r\n			</div>\r\n			<!-- Ticket subject -->\r\n			<!-- Ticket account info -->  \r\n			<div class=\"tkt_bottom\">\r\n				<p class=\"tkt_subject\">"
    + escapeExpression(((helpers.htmlEscape || (depth0 && depth0.htmlEscape) || helperMissing).call(depth0, (depth0 != null ? depth0.subject : depth0), {"name":"htmlEscape","hash":{},"data":data})))
    + "</p>\r\n				<p class=\"tkt_account\">"
    + escapeExpression(((helper = (helper = helpers.account_name || (depth0 != null ? depth0.account_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"account_name","hash":{},"data":data}) : helper)))
    + "</p>\r\n			</div>                                     \r\n		</div>\r\n		</a>\r\n		<div class=\"see_more\" data-key=\""
    + escapeExpression(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"key","hash":{},"data":data}) : helper)))
    + "\"></div>\r\n		<div class=\"tkt_actions\" data-reskey=\""
    + escapeExpression(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"key","hash":{},"data":data}) : helper)))
    + "\">\r\n			<div class=\"tkt_actions_menu\">\r\n				<div class=\"tkt_actions_menu_type\">Responses</div>\r\n				<ul>\r\n					<li data-respkey=\""
    + escapeExpression(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"key","hash":{},"data":data}) : helper)))
    + "\" class=\"responses active\"></li>\r\n					<li data-respkey=\""
    + escapeExpression(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"key","hash":{},"data":data}) : helper)))
    + "\" class=\"time\"></li>                                	\r\n				</ul>                            \r\n			</div>\r\n			<div class=\"tkt_add_response\">\r\n				<button class=\"add_response\" data-reskey=\""
    + escapeExpression(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"key","hash":{},"data":data}) : helper)))
    + "\">Add</button>\r\n				<div class=\"tkt_add_response_input\">\r\n					<input type=\"text\" id=\"response\" name=\"response\" placeholder=\"Add Response\" />\r\n				</div>								\r\n			</div>\r\n			<div class=\"tkt_add_time\">\r\n				<button class=\"add_tkt_time\" data-reskey=\""
    + escapeExpression(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"key","hash":{},"data":data}) : helper)))
    + "\">Add<br/>Time</button>\r\n				<div class=\"tkt_add_time_input\">\r\n					<button class=\"minus_time\">-</button>\r\n					<button class=\"plus_time\">+</button>\r\n					<p>\r\n						<input type=\"number\" class=\"add_time\" name=\"add_time\" value=\"0\" step=\".25\" />\r\n					</p>\r\n					<p>\r\n						<select name=\"task_type\" id=\"task_type\">\r\n							<option value=\"\">Task Type</option>\r\n						</select>\r\n					</p>                                   \r\n				</div>								\r\n			</div>\r\n			\r\n			<ul class=\"responses\">                         	\r\n					\r\n			</ul>\r\n		</div>	\r\n	</li>\r\n";
},"4":function(depth0,helpers,partials,data) {
  return "<li>\r\n	<div class=\"noTickets listend\">\r\n		<p>That's the end of this list.</p>\r\n	</div>\r\n</li>\r\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1;
  stack1 = helpers['if'].call(depth0, depth0, {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(4, data),"data":data});
  if (stack1 != null) { return stack1; }
  else { return ''; }
  },"useData":true});
templates['ticket_response'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<!-- Single Response START -->  \r\n<li class=\"response\">\r\n	<div class=\"res_user\">\r\n		<p class=\"res_gravatar\" data-email=\""
    + escapeExpression(((helper = (helper = helpers.user_email || (depth0 != null ? depth0.user_email : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"user_email","hash":{},"data":data}) : helper)))
    + "\"></p>\r\n		<p class=\"tech-name\">"
    + escapeExpression(((helper = (helper = helpers.user_firstname || (depth0 != null ? depth0.user_firstname : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"user_firstname","hash":{},"data":data}) : helper)))
    + " "
    + escapeExpression(((helper = (helper = helpers.user_lastname || (depth0 != null ? depth0.user_lastname : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"user_lastname","hash":{},"data":data}) : helper)))
    + "</p>\r\n		<p class=\"post_type\">"
    + escapeExpression(((helper = (helper = helpers.log_type || (depth0 != null ? depth0.log_type : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"log_type","hash":{},"data":data}) : helper)))
    + "</p>\r\n	</div>\r\n	<div class=\"comment_main\">\r\n		<p class=\"note_time fromDate\">"
    + escapeExpression(((helper = (helper = helpers.record_date || (depth0 != null ? depth0.record_date : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"record_date","hash":{},"data":data}) : helper)))
    + "</p>\r\n		<p>";
  stack1 = ((helpers.linebreaks || (depth0 && depth0.linebreaks) || helperMissing).call(depth0, (depth0 != null ? depth0.note : depth0), {"name":"linebreaks","hash":{},"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</p>			\r\n	</div>\r\n</li>\r\n<!-- Single Response END -->\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1;
  stack1 = helpers.each.call(depth0, depth0, {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { return stack1; }
  else { return ''; }
  },"useData":true});
templates['time_AddTime'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<header>\r\n	<div class=\"navbar\">\r\n		<div class=\"navbar-inner\">\r\n			<a class=\"menu_button header_left back_icon\" id=\"timeroll\"></a>\r\n			<p class=\"header_label\">Add Time</p>                \r\n		</div> 		        \r\n	</div>\r\n</header>\r\n<a name=\"top\"/>\r\n<div class=\"content time_add timeroll_add\"> \r\n	<form class=\"add_time roll_time\">\r\n		<div class=\"showalert\"></div>\r\n		\r\n		<div class=\"tkt_add_time\">\r\n			<div class=\"tkt_add_time_input\">\r\n				<button class=\"minus_time\">-</button>\r\n				<button class=\"plus_time\">+</button>\r\n				<p>\r\n					<input type=\"number\" class=\"add_time\" name=\"add_time\" value=\"0\" step=\".25\" />\r\n				</p>                                    \r\n			</div>								\r\n		</div>		\r\n		\r\n		<label>Select Account</label>\r\n		<select name=\"account\" id=\"account\">\r\n			<option value=\"\">---</option>\r\n		</select>\r\n		\r\n		<div class=\"projects\" style=\"display: none;\">\r\n	  		<label>Select Project</label>\r\n	  		<select name=\"project\" id=\"project\">\r\n	  			<option value=\"\">---</option>\r\n	  		</select>\r\n  		</div>\r\n		\r\n		<label>Select Task Type<span class=\"required\">*</span></label>\r\n		<select name=\"task_type\" id=\"task_type\">\r\n			<option value=\"\">---</option>\r\n		</select>	\r\n		\r\n		<div class=\"billable\" style=\"display:none;\">\r\n	  		<label>\r\n	  	      <input type=\"checkbox\" id=\"isBillable\" name=\"isBillable\"> Is time billable?\r\n	  	    </label>\r\n		</div>	\r\n		\r\n		<label>Notes<span class=\"required\">*</span></label>\r\n		<textarea name=\"details\" id=\"details\" wrap=\"soft\" cols=\"50\" rows=\"10\" ></textarea>		\r\n		<button class=\"btn btn-large btn-block btn-success\" type=\"submit\">Add Time</button>\r\n	  \r\n	</form>  \r\n</div>";
  },"useData":true});
templates['time_list'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class=\"content\">	\r\n	<div class=\"showalert\"></div>\r\n	<div class=\"timelog\"> \r\n		<ul class=\"timelogs\">\r\n";
  stack1 = helpers.each.call(depth0, depth0, {"name":"each","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "	    </ul>     	\r\n        	\r\n    </div><!-- End Time Log -->\r\n    \r\n</div>\r\n\r\n";
},"2":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "	        <li class=\"log_entry\">	        	\r\n	            <div class=\"log_data\">\r\n	            	<div class=\"log_data_top\">\r\n                    	<div class=\"log_time_amount\">\r\n	                    	<p>"
    + escapeExpression(((helper = (helper = helpers.hours || (depth0 != null ? depth0.hours : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"hours","hash":{},"data":data}) : helper)))
    + " <span>hrs</span></p>\r\n	                        <p class=\"date\">"
    + escapeExpression(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"date","hash":{},"data":data}) : helper)))
    + "</p>\r\n	                    </div>\r\n	                    <p class=\"log_type\"><strong>"
    + escapeExpression(((helper = (helper = helpers.account_name || (depth0 != null ? depth0.account_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"account_name","hash":{},"data":data}) : helper)))
    + "</strong></p>\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.task_type : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.project_name : depth0), {"name":"if","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.ticket_number : depth0), {"name":"if","hash":{},"fn":this.program(7, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "	                </div>\r\n                    <div class=\"log_data_bottom\">\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.note : depth0), {"name":"if","hash":{},"fn":this.program(9, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "	                </div>	                \r\n	            </div>\r\n	        </li>\r\n";
},"3":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "                        <p class=\"log_type smaller\"><strong>"
    + escapeExpression(((helper = (helper = helpers.task_type || (depth0 != null ? depth0.task_type : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"task_type","hash":{},"data":data}) : helper)))
    + "</strong></p>\r\n";
},"5":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "	                    <p class=\"log_type smaller\">Project <strong>"
    + escapeExpression(((helper = (helper = helpers.project_name || (depth0 != null ? depth0.project_name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"project_name","hash":{},"data":data}) : helper)))
    + "</strong></p>\r\n";
},"7":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "	                    <p class=\"log_type smaller\">Ticket <strong>"
    + escapeExpression(((helper = (helper = helpers.ticket_number || (depth0 != null ? depth0.ticket_number : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"ticket_number","hash":{},"data":data}) : helper)))
    + "</strong></p>\r\n";
},"9":function(depth0,helpers,partials,data) {
  var helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "	                    <p class=\"log_note\">"
    + escapeExpression(((helpers.htmlEscape || (depth0 && depth0.htmlEscape) || helperMissing).call(depth0, (depth0 != null ? depth0.note : depth0), {"name":"htmlEscape","hash":{},"data":data})))
    + "</p>  \r\n";
},"11":function(depth0,helpers,partials,data) {
  return "<div class=\"content\">\r\n	<div class=\"noTickets\">\r\n		<h2>No Time Logs Here Mate.</h2>\r\n	</div>\r\n</div>\r\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<header>\r\n	<div class=\"navbar\">\r\n		<div class=\"navbar-inner\">\r\n			<a href=\"#\" id=\"left-button\" class=\"menu_button header_left home_icon home_button\"></a>\r\n            <a href=\"#\" id=\"right-button\" class=\"menu_button header_right add_icon add_time_button\"></a>\r\n			<p class=\"header_label\">Time Logs</p>                \r\n		</div> 		        \r\n	</div>\r\n</header>\r\n";
  stack1 = helpers['if'].call(depth0, depth0, {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(11, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true});
templates['transfer'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<a name=\"top\"/>\r\n<div class=\"transfer\"> \r\n	<form class=\"transfer_ticket\" action=\"#\">\r\n		<div class=\"showalert\"></div>	\r\n		\r\n		<label>Technician</label>\r\n		<select name=\"tech\" id=\"tech\">\r\n			<option value=\"\">---</option>			\r\n		</select>		\r\n		\r\n		<label>Add Note</label>\r\n		<textarea name=\"details\" id=\"details\" wrap=\"soft\" cols=\"50\" rows=\"10\" ></textarea>\r\n		\r\n		<button class=\"btn btn-large btn-block btn-success\" type=\"submit\">Transfer Ticket</button>\r\n	  \r\n	</form>  \r\n</div>";
  },"useData":true});
})();
