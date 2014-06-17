SherpaDesk mobile V3 
====================

HTML pages List
---------------
account_details.html 
Account_List.html
accountTimes.html (Timelogs for an specific account)
add_tickets.html (create a ticket)
add_time.html 
addExpence.html (add expense to a ticket)
addTicket_V4.html (add ticket page with updated fetures)
addTicketTime.html (add time to a specific ticket)
adjustment.html (add adjustment to an invoice)
allInvoice_list.html (list of all invoice )
dashboard.html (landing page after the login/org page)
expen.html (expenses linked to a invoice)
index.html (login page)
Invoice_List.html (list of invoices for a account)
invoice.html (detailed invoice)
invoiceTimes.html (timelogs that are linked to invoice)
org.html ( list of organization pages)
queues.html (list of queues linked to an account)
SelectPayment.html ( select payment method)
ticket_detail.html (details of a ticket)
ticket_list.html (list of tikets)
timelog.html (timelogs associated with the organization )
travel.html (travel expenses that have to deal with a invoice)

JavaScript(main.js) documentation 
---------------------------------

ajaxCallTime.init();
	    UserLogin.init();
	    	- takes username and email obtains api key 
	    newTicket.init();
	    sendInvoince.init();
	    signout.init();
	    search.init();
	    org.init();
	    	- gets the number of organizations 
	    	- calls the methods to setup the dashboard
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