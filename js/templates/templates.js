(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['accounts'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n	<option data-accId=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" value=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\r\n";
  return buffer;
  }

  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });
templates['addTicket'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<a name=\"top\"/>\r\n<div class=\"navbar navbar-static-top\">\r\n	<div class=\"navbar-inner\">\r\n		<a class=\"menu_button header_left back_icon\" id=\"ticketList\"></a>\r\n		<p class=\"header_label\">Create New Ticket</p>\r\n	</div>  \r\n</div>\r\n\r\n<div class=\"content ticket_add\" style=\"display:none;\"> \r\n	<form class=\"create_ticket\">\r\n		<div class=\"showalert\"></div>	\r\n			\r\n		<label>Account</label>\r\n		<select name=\"account\" id=\"account\">\r\n			<option value=\"\">---</option>\r\n		</select>\r\n		<label>Technician</label>\r\n		<select name=\"tech\" id=\"tech\">\r\n			<option value=\"\">---</option>\r\n		</select>\r\n		<div class=\"add_class\">\r\n			<div class=\"main_class\">\r\n				<label>Class</label>\r\n				<select name=\"class\" id=\"class\">\r\n					<option value=\"\">---</option>			\r\n				</select>\r\n			</div>\r\n		</div>\r\n		\r\n		<label>Subject</label>\r\n		<input name=\"subject\" id=\"subject\" type=\"text\">\r\n		\r\n		<label>Details</label>\r\n		<textarea name=\"details\" id=\"details\" wrap=\"soft\" cols=\"50\" rows=\"10\" ></textarea>\r\n		\r\n		<button class=\"btn btn-large btn-block btn-success\" type=\"submit\">Create Ticket</button>\r\n	  \r\n	</form>  \r\n</div>";
  });
templates['addTicket_subClass1'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n			<option data-classId=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" value=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\r\n		";
  return buffer;
  }

  buffer += "\r\n<div class=\"sub_class1\">\r\n	<label>>> Sub Class</label>\r\n	<select name=\"sub_class1\" id=\"sub_class1\">\r\n		<option value=\"\">---</option>\r\n		";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "			\r\n	</select>\r\n</div>";
  return buffer;
  });
templates['addTicket_subClass2'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n			<option data-classId=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" value=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\r\n		";
  return buffer;
  }

  buffer += "\r\n<div class=\"sub_class2\">\r\n	<label>>> >> Sub Sub Class</label>\r\n	<select name=\"sub_class2\" id=\"sub_class2\">\r\n		<option value=\"\">---</option>\r\n		";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "			\r\n	</select>\r\n</div>";
  return buffer;
  });
templates['alert'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"alert alert-";
  if (helper = helpers.message_type) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.message_type); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\r\n  <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\r\n  ";
  if (helper = helpers.message) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.message); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\r\n</div>";
  return buffer;
  });
templates['classes'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n	<option data-classId=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" value=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\r\n";
  return buffer;
  }

  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });
templates['closeTicket'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<a name=\"top\"/>\r\n<div class=\"closeTicket\"> \r\n	<form class=\"close_ticket\" action=\"#\">\r\n		<div class=\"showalert\"></div>	\r\n		\r\n		<label>\r\n	      <input type=\"checkbox\" id=\"closeNotice\" name=\"closeNotice\"> Notify user via email\r\n	    </label>		\r\n		\r\n		<label>Add Note</label>\r\n		<textarea name=\"details\" id=\"details\" wrap=\"soft\" cols=\"50\" rows=\"10\" ></textarea>\r\n		\r\n		<button class=\"btn btn-large btn-block btn-warning\" type=\"submit\">Close This Ticket</button>\r\n	  \r\n	</form>  \r\n</div>";
  });
templates['inst'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n				<option data-orgkey=\"";
  if (helper = helpers.key) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.key); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" value=\""
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\r\n			";
  return buffer;
  }

  buffer += "<div class=\"content\">\r\n	<div class=\"login-container\">    \r\n		<form class=\"form-signin\">\r\n			<div class=\"logo\"><img src=\"img/Sherpa_Desk-logo.png\"></div>\r\n			<div class=\"showalert\"></div>\r\n			<h2>Select Your Instance</h2>			\r\n			<select name=\"inst\" id=\"inst\">\r\n				<option value=\"\" selected=\"selected\">Choose an Instance</option>\r\n			";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n			</select>\r\n		</form>		\r\n	</div>\r\n</div>";
  return buffer;
  });
templates['login'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"content\">\r\n	<div class=\"login-container\">    \r\n		<form class=\"form-signin\">\r\n			<div class=\"logo\"><img src=\"img/Sherpa_Desk-logo.png\"></div>\r\n			<div class=\"showalert\"></div>			\r\n			<input type=\"email\" id=\"email\" class=\"input-block-level\" placeholder=\"Email Address\">\r\n			<input type=\"password\" id=\"password\" class=\"input-block-level\" placeholder=\"Password\">			\r\n			<button class=\"btn btn-large btn-block btn-success\" type=\"submit\">Sign in</button>\r\n		</form>		\r\n	</div>\r\n	<!-- Sign up Form\r\n	<div class=\"login_signup\">\r\n    	<img class=\"signup_img\" src=\"img/jangbu-signup.png\">\r\n        \r\n        <div class=\"signup_content\">\r\n        	<p>New to SherpaDesk?</p>\r\n            <a class=\"signup_button\">Get a New Account</a>\r\n        </div>\r\n    </div>\r\n	-->\r\n</div>";
  });
templates['orgs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n				<option data-orgkey=\"";
  if (helper = helpers.key) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.key); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" value=\""
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.index)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\r\n			";
  return buffer;
  }

  buffer += "<div class=\"content\">\r\n	<div class=\"login-container\">    \r\n		<form class=\"form-signin\">\r\n			<div class=\"logo\"><img src=\"img/Sherpa_Desk-logo.png\"></div>\r\n			<div class=\"showalert\"></div>\r\n			<h2>Select Your Organization</h2>			\r\n			<select name=\"orgs\" id=\"orgs\">\r\n			  	<option value=\"\" selected=\"selected\">Choose an Org</option>\r\n			";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n			</select>\r\n		</form>		\r\n	</div>\r\n</div>";
  return buffer;
  });
templates['queue_list'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n	<div class=\"showalert\"></div>\r\n	<div class=\"queues_list\" id=\"filter_list\">\r\n		<ul class=\"queues\">\r\n			";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n		</ul>\r\n	</div>\r\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n			<li class=\"queue\">				\r\n				<a class=\"get_queue_list\" data-queid=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\r\n					<div class=\"que_main\">						\r\n						<p class=\"que_title\">";
  if (helper = helpers.fullname) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.fullname); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>												\r\n						<p class=\"que_tkt_cnt\">";
  if (helper = helpers.tickets_count) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.tickets_count); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>                                     \r\n					</div>\r\n				</a>				\r\n			</li>\r\n			";
  return buffer;
  }

function program4(depth0,data) {
  
  
  return "\r\n	<div class=\"noTickets\">\r\n		<h2>We Don't Need No Stinkin' Queues</h2>\r\n		<p>But maybe you should try them out.</p>\r\n	</div>\r\n";
  }

  stack1 = helpers['if'].call(depth0, depth0, {hash:{},inverse:self.program(4, program4, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });
templates['taskTypes'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n	<option data-taskId=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" value=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\r\n";
  return buffer;
  }

  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });
templates['techs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n	<option data-techId=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" value=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.firstname) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.firstname); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " ";
  if (helper = helpers.lastname) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lastname); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\r\n";
  return buffer;
  }

  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });
templates['ticket_header'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"side-menu\" style=\"display:none;\">\r\n	<ul>\r\n		<li class=\"searchform\">\r\n			<input type=\"text\" placeholder=\"Jump to Ticket #\" class=\"ticket-jump-menu\">\r\n		</li>\r\n		<li><p id=\"queues\"><i class=\"icon-folder-open icon-white\"></i> Queues</p></li>\r\n		<li><p id=\"orgInst\"><i class=\"icon-list-alt icon-white\"></i> Change Org/Inst</p></li>\r\n		<li><p id=\"logout\"><i class=\"icon-off icon-white\"></i> Log out</p></li>\r\n		<li><a ";
  if (helper = helpers.full_app_link) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.full_app_link); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "><p id=\"fullSite\"><i class=\"icon-share-alt icon-white\"></i> Switch to Full App</p></a></li>\r\n	</ul>    \r\n</div>\r\n<header>\r\n	<div class=\"navbar\">\r\n		<div class=\"navbar-inner\">\r\n			<a href=\"#\" id=\"left-button\" class=\"menu_button header_left menu_icon ticket_list_menu\"></a>\r\n			<a href=\"#\" id=\"right-button\" class=\"menu_button header_right add_icon add_ticket_button\"></a>\r\n			<p class=\"header_label\">Tickets</p>                \r\n		</div> \r\n		<div class=\"header_search_tickets\">\r\n			<input type=\"text\" class=\"search\" placeholder=\"Search Tickets\">\r\n		</div> \r\n		<div class=\"header_user_type\">\r\n			<ul class=\"filter\">\r\n				<li data-asrole=\"user\">As User</li>\r\n                <li data-asrole=\"tech\">As Tech</li>\r\n                <li data-asrole=\"alt_tech\">As Alt Tech</li>\r\n				<li class=\"open_tickets\" data-asrole=\"all\">All Open</li>\r\n			</ul>\r\n		</div>          \r\n	</div>\r\n</header>";
  return buffer;
  });
templates['ticket_list'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n<div class=\"content\">\r\n	<div class=\"showalert\"></div>\r\n	<div class=\"tickets_list\" id=\"filter_list\">\r\n		<ul class=\"tickets\">\r\n			";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n		</ul>\r\n		<div class=\"loadingtickets\"></div>\r\n	</div>\r\n</div>\r\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n			<li class=\"ticket\">\r\n				<div class=\"gravatar\">	\r\n					<p class=\"cir_gravatar\" data-email=\"";
  if (helper = helpers.user_email) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.user_email); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></p>	\r\n					<p class=\"user_name\">";
  if (helper = helpers.user_firstname) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.user_firstname); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " ";
  if (helper = helpers.user_lastname) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.user_lastname); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\r\n				</div>\r\n				<a class=\"get_single\" data-reskey=\"";
  if (helper = helpers.key) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.key); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\r\n				<div class=\"tkt_main\">                        	\r\n					<!-- Ticket Number --> <!-- Ticket date -->\r\n					<div class=\"tkt_top\">\r\n						<p class=\"tkt_number\">";
  if (helper = helpers.prefix) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.prefix); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1);
  if (helper = helpers.number) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.number); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\r\n						<p class=\"tkt_date fromDate\">";
  if (helper = helpers.created_time) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.created_time); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\r\n					</div>\r\n					<!-- Ticket subject -->\r\n					<!-- Ticket account info -->  \r\n					<div class=\"tkt_bottom\">\r\n						<p class=\"tkt_subject\">";
  if (helper = helpers.subject) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.subject); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\r\n						<p class=\"tkt_account\">";
  if (helper = helpers.account_name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.account_name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\r\n					</div>                                     \r\n				</div>\r\n				</a>\r\n				<div class=\"see_more\" data-key=\"";
  if (helper = helpers.key) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.key); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></div>\r\n				<div class=\"tkt_actions\" data-reskey=\"";
  if (helper = helpers.key) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.key); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\r\n					<div class=\"tkt_actions_menu\">\r\n						<div class=\"tkt_actions_menu_type\">Responses</div>\r\n						<ul>\r\n							<li data-respkey=\"";
  if (helper = helpers.key) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.key); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"responses active\"></li>\r\n							<li data-respkey=\"";
  if (helper = helpers.key) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.key); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"time\"></li>                                	\r\n						</ul>                            \r\n					</div>\r\n					<div class=\"tkt_add_response\">\r\n						<button class=\"add_response\" data-reskey=\"";
  if (helper = helpers.key) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.key); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">Add</button>\r\n						<div class=\"tkt_add_response_input\">\r\n							<textarea id=\"response\" name=\"response\" placeholder=\"Add Response\"></textarea>\r\n						</div>								\r\n					</div>\r\n					<div class=\"tkt_add_time\">\r\n						<button class=\"add_tkt_time\" data-reskey=\"";
  if (helper = helpers.key) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.key); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">Add<br/>Time</button>\r\n						<div class=\"tkt_add_time_input\">\r\n							<button class=\"minus_time\">-</button>\r\n							<button class=\"plus_time\">+</button>\r\n							<p>\r\n								<input type=\"number\" class=\"add_time\" name=\"add_time\" value=\"0\" step=\".25\" />\r\n							</p>\r\n							<p>\r\n								<select name=\"task_type\" id=\"task_type\">\r\n						  			<option value=\"\">Task Type</option>\r\n						  		</select>\r\n							</p>                                   \r\n						</div>								\r\n					</div>\r\n					\r\n					<ul class=\"responses\">                         	\r\n							\r\n					</ul>\r\n				</div>	\r\n			</li>\r\n			";
  return buffer;
  }

function program4(depth0,data) {
  
  
  return "\r\n<div class=\"content\">\r\n	<div class=\"noTickets\">\r\n		<h2>No Tickets Here Mate</h2>\r\n		<p>Perhaps this is a good time to celebrate!</p>\r\n	</div>\r\n</div>\r\n";
  }

  stack1 = helpers['if'].call(depth0, depth0, {hash:{},inverse:self.program(4, program4, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });
templates['ticket_response'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var stack1, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\r\n<!-- Single Response START -->  \r\n<li class=\"response\">\r\n	<div class=\"res_user\">\r\n		<p class=\"res_gravatar\" data-email=\"";
  if (helper = helpers.user_email) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.user_email); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></p>\r\n		<p class=\"tech-name\">";
  if (helper = helpers.user_firstname) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.user_firstname); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " ";
  if (helper = helpers.user_lastname) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.user_lastname); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\r\n		<p class=\"post_type\">";
  if (helper = helpers.log_type) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.log_type); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\r\n	</div>\r\n	<div class=\"comment_main\">\r\n		<p class=\"note_time fromDate\">";
  if (helper = helpers.record_date) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.record_date); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\r\n		<p>";
  stack1 = (helper = helpers.linebreaks || (depth0 && depth0.linebreaks),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.note), options) : helperMissing.call(depth0, "linebreaks", (depth0 && depth0.note), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</p>			\r\n	</div>\r\n</li>\r\n<!-- Single Response END -->\r\n";
  return buffer;
  }

  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });
templates['ticketDet_AddTime'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<a name=\"top\"/>\r\n<div class=\"content time_add\"> \r\n	<form class=\"add_time\">\r\n		<div class=\"showalert\"></div>\r\n		\r\n		<div class=\"tkt_add_time\">\r\n			<div class=\"tkt_add_time_input\">\r\n				<button class=\"minus_time\">-</button>\r\n				<button class=\"plus_time\">+</button>\r\n				<p>\r\n					<input type=\"number\" class=\"add_time\" name=\"add_time\" value=\"0\" step=\".25\" />\r\n				</p>                                    \r\n			</div>								\r\n		</div>		\r\n		\r\n		<label>Select Task Type</label>\r\n		<select name=\"task_type\" id=\"task_type\">\r\n			<option value=\"\">---</option>\r\n		</select>		\r\n		\r\n		<label>Notes</label>\r\n		<textarea name=\"details\" id=\"details\" wrap=\"soft\" cols=\"50\" rows=\"10\" ></textarea>\r\n		\r\n		<button class=\"btn btn-large btn-block btn-success\" type=\"submit\">Add Time</button>\r\n	  \r\n	</form>  \r\n</div>";
  });
templates['ticketDet_Edit'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<a name=\"top\"/>\r\n<div class=\"transfer\"> \r\n	<form class=\"update_ticket\" action=\"#\">\r\n		<div class=\"showalert\"></div>	\r\n		\r\n		<label>Class</label>\r\n		<select name=\"class\" id=\"class\">\r\n			<option value=\"\">---</option>			\r\n		</select>	\r\n		\r\n		<label>Level</label>\r\n		<select name=\"level\" id=\"level\">\r\n			<option value=\"\">---</option>			\r\n		</select>	\r\n		\r\n		<label>Priority</label>\r\n		<select name=\"priority\" id=\"priority\">\r\n			<option value=\"\">---</option>		\r\n		</select>	\r\n		\r\n		<button class=\"btn btn-large btn-block btn-success\" type=\"submit\">Update Ticket</button>\r\n	  \r\n	</form>  \r\n</div>";
  });
templates['ticketDet_response'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<a name=\"top\"/>\r\n<div class=\"content response_add\"> \r\n	<form class=\"create_response\">\r\n		<div class=\"showalert\"></div>	\r\n		\r\n		<textarea name=\"details\" id=\"details\" wrap=\"soft\" cols=\"50\" rows=\"10\" ></textarea>\r\n		\r\n		<button class=\"btn btn-large btn-block btn-success\" type=\"submit\">Add Response</button>\r\n	  \r\n	</form>  \r\n</div>";
  });
templates['ticketDetail_content'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  buffer += "<div class=\"content ticket_detail\"> \r\n		<div class=\"ticket_info\" style=\"display: none;\">\r\n        	<ul>\r\n				\r\n			</ul>\r\n        </div> \r\n		<div class=\"ticket_detail_main\"> \r\n			<div class=\"showalert\"></div>	     \r\n	        \r\n	        <div class=\"tkt_initial_post\">\r\n	        	<div class=\"tkt_ini_gravatar\">\r\n	            	<p class=\"cir_gravatar\" data-email=\"";
  if (helper = helpers.user_email) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.user_email); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></p>\r\n	                <p class=\"tkt_user\">";
  if (helper = helpers.user_firstname) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.user_firstname); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " ";
  if (helper = helpers.user_lastname) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.user_lastname); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\r\n					<p class=\"tkt_user_account\">";
  if (helper = helpers.account_name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.account_name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\r\n	            </div>\r\n				<div class=\"tkt_subject\">\r\n		        	";
  if (helper = helpers.subject) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.subject); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\r\n		        </div>\r\n	            <div class=\"tkt_ini_response\">\r\n	            	";
  stack1 = (helper = helpers.linebreaks || (depth0 && depth0.linebreaks),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.initial_post), options) : helperMissing.call(depth0, "linebreaks", (depth0 && depth0.initial_post), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n	            </div>\r\n	        </div>\r\n	        \r\n	        <div class=\"tkt_actions\" data-reskey=\"";
  if (helper = helpers.key) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.key); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\r\n				<div class=\"tkt_actions_menu\">\r\n						<div class=\"tkt_actions_menu_type\">Responses</div>\r\n						<ul>\r\n							<li data-respkey=\"";
  if (helper = helpers.key) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.key); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"responses active\"></li>\r\n							<li data-respkey=\"";
  if (helper = helpers.key) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.key); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"time\"></li>                                	\r\n						</ul>                            \r\n					</div>\r\n					<div class=\"tkt_add_response\">\r\n						<button class=\"add_response\" data-reskey=\"";
  if (helper = helpers.key) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.key); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">Add</button>\r\n						<div class=\"tkt_add_response_input\">\r\n							<textarea id=\"response\" name=\"response\" placeholder=\"Add Response\"></textarea>\r\n						</div>								\r\n					</div>\r\n					<div class=\"tkt_add_time\">\r\n						<button class=\"add_tkt_time\" data-reskey=\"";
  if (helper = helpers.key) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.key); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">Add<br/>Time</button>\r\n						<div class=\"tkt_add_time_input\">\r\n							<button class=\"minus_time\">-</button>\r\n							<button class=\"plus_time\">+</button>\r\n							<p>\r\n								<input type=\"number\" class=\"add_time\" name=\"add_time\" value=\"0\" step=\".25\" />\r\n							</p>\r\n							<p>\r\n								<select name=\"task_type\" id=\"task_type\">\r\n						  			<option value=\"\">Task Type</option>\r\n						  		</select>\r\n							</p>                                   \r\n						</div>								\r\n					</div>\r\n				\r\n				<ul class=\"responses\">                         	\r\n						\r\n				</ul>\r\n			</div>\r\n		</div>        \r\n    </div>";
  return buffer;
  });
templates['ticketDetail_header'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  if (helper = helpers.user_fullname) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.user_fullname); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "&nbsp;&nbsp;";
  return buffer;
  }

  buffer += "<div class=\"right-menu\" style=\"display:none;\">\r\n	<ul>\r\n		<li class=\"searchform\">\r\n			<input type=\"text\" placeholder=\"Jump to Ticket #\" class=\"ticket-jump-menu\">\r\n		</li>\r\n		<li><p id=\"transfer\"><i class=\"icon-retweet icon-white\"></i> Transfer</p></li>\r\n		<li><p id=\"pickup\"><i class=\"icon-hand-up icon-white\"></i> Pick Up Ticket</p></li>\r\n		<li><p id=\"close\"><i class=\"icon-remove icon-white\"></i> Close</p></li>\r\n		<li><p id=\"response\"><i class=\"icon-comment icon-white\"></i> Response</p></li>\r\n		<li><p id=\"time\"><i class=\"icon-time icon-white\"></i> Time</p></li>\r\n	</ul>    \r\n</div>\r\n<header>	\r\n	<div class=\"navbar navbar-static-top\">\r\n		<div class=\"navbar-inner\">\r\n			<a class=\"menu_button header_left back_icon\" id=\"ticketList\"></a>\r\n			<a href=\"#\" class=\"menu_button header_right menu_icon ticket_list_menu\"></a>\r\n			<p class=\"header_label\">";
  if (helper = helpers.status) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.status); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " | ";
  if (helper = helpers.number) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.number); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>		\r\n		</div>\r\n		<div class=\"header_ticket_detail\">\r\n			<div class=\"menu_button header_right info_icon\"></div>\r\n			<div class=\"tkt_head_info\">\r\n				<div class=\"tkt_det_head_date\">";
  if (helper = helpers.created_time) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.created_time); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\r\n				<div class=\"tkt_det_head_account\">";
  if (helper = helpers.account_name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.account_name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>				\r\n				<div class=\"tkt_det_head_user\">";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.technicians), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div>\r\n			</div>            \r\n		</div>  \r\n	</div>\r\n</header>";
  return buffer;
  });
templates['ticketDetail_info'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n<li>\r\n    <p>Hours: <strong>";
  if (helper = helpers.total_hours) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.total_hours); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " hr</strong></p>    \r\n</li>\r\n";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n<li>\r\n    <p>Estimated: <strong>";
  if (helper = helpers.estimated_time) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.estimated_time); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " hr</strong></p>    \r\n</li>\r\n";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n<li>\r\n    <p>Location: <strong>";
  if (helper = helpers.location_name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.location_name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " hr</strong></p>    \r\n</li>\r\n";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += " - ";
  if (helper = helpers.level_name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.level_name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1);
  return buffer;
  }

function program9(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += " - ";
  if (helper = helpers.priority_name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.priority_name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1);
  return buffer;
  }

function program11(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n<li>\r\n    <p>Request Completion Date: <strong><span class=\"time\">";
  if (helper = helpers.request_completion_date) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.request_completion_date); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></strong></p>    \r\n</li>\r\n";
  return buffer;
  }

function program13(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n<li>\r\n    <p>Follow Up: <strong><span class=\"time\">";
  if (helper = helpers.followup_date) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.followup_date); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></strong></p>    \r\n</li>\r\n";
  return buffer;
  }

function program15(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n<li>\r\n    <p>SLA Complete Date: <strong><span class=\"time\">";
  if (helper = helpers.sla_complete_date) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.sla_complete_date); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></strong></p>    \r\n</li>\r\n";
  return buffer;
  }

function program17(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n  ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.sla_response_date), {hash:{},inverse:self.noop,fn:self.program(18, program18, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n";
  return buffer;
  }
function program18(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n    <li>\r\n    	<p>SLA Response Date: <strong><span class=\"time\">";
  if (helper = helpers.sla_response_date) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.sla_response_date); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></strong></p>    \r\n    </li>\r\n  ";
  return buffer;
  }

function program20(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n<li>\r\n    <p>Confirmed: <strong><span class=\"time\">";
  if (helper = helpers.confirmed_date) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.confirmed_date); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></strong></p>    \r\n</li>\r\n";
  return buffer;
  }

function program22(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n<li>\r\n    <p>Next Step Date: <strong><span class=\"time\">";
  if (helper = helpers.next_step_date) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.next_step_date); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></strong></p>    \r\n</li>\r\n";
  return buffer;
  }

  stack1 = helpers['if'].call(depth0, (depth0 && depth0.total_hours), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.estimated_time), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n<li>\r\n    <p>Last Updated: <strong><span class=\"time\">";
  if (helper = helpers.updated_time) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.updated_time); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></strong></p>    \r\n</li>\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.location_name), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n<li>\r\n    <p>Class: <strong>";
  if (helper = helpers.class_name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.class_name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</strong></p>    \r\n</li>\r\n<li>\r\n    <p>Level: <strong>";
  if (helper = helpers.level) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.level); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1);
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.level_name), {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</strong></p>    \r\n</li>\r\n\r\n<li>\r\n    <p>Priority: <strong>";
  if (helper = helpers.priority) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.priority); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1);
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.priority_name), {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</strong></p>    \r\n</li>\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.request_completion_date), {hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.followup_date), {hash:{},inverse:self.noop,fn:self.program(13, program13, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.sla_complete_date), {hash:{},inverse:self.program(17, program17, data),fn:self.program(15, program15, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.confirmed_date), {hash:{},inverse:self.noop,fn:self.program(20, program20, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.next_step_date), {hash:{},inverse:self.noop,fn:self.program(22, program22, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n";
  return buffer;
  });
templates['transfer'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<a name=\"top\"/>\r\n<div class=\"transfer\"> \r\n	<form class=\"transfer_ticket\" action=\"#\">\r\n		<div class=\"showalert\"></div>	\r\n		\r\n		<label>Technician</label>\r\n		<select name=\"tech\" id=\"tech\">\r\n			<option value=\"\">---</option>			\r\n		</select>		\r\n		\r\n		<label>Add Note</label>\r\n		<textarea name=\"details\" id=\"details\" wrap=\"soft\" cols=\"50\" rows=\"10\" ></textarea>\r\n		\r\n		<button class=\"btn btn-large btn-block btn-success\" type=\"submit\">Transfer Ticket</button>\r\n	  \r\n	</form>  \r\n</div>";
  });
})();