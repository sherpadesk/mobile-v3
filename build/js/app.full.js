(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var ionic_angular_1 = require('ionic-angular');
var providers = require('./providers/providers');
var config_1 = require('./providers/config');
var mocks_1 = require('./providers/mocks');
var helpers = require('./directives/helpers');
var pages = require('./pages/pages');
var modals = require('./pages/modals/modals');
var MyApp = (function () {
    function MyApp(app, platform, config, events, menu, ticketProvider, dataProvider) {
        var _this = this;
        this.app = app;
        this.platform = platform;
        this.config = config;
        this.events = events;
        this.menu = menu;
        this.ticketProvider = ticketProvider;
        this.dataProvider = dataProvider;
        this.is_offline = false;
        this.is_phonegap = false;
        this.img = new Image();
        if (!this.isStorage()) {
            console.log("Please enable coockies!");
            return;
        }
        this.is_phonegap = localStorage.getItem("isPhonegap") === "true";
        this.initializeApp();
        this.ExtendConfig();
        setTimeout(function () {
            return _this.ExtendNavAlert();
        }, 0);
        (document.getElementsByTagName("ion-loading")[0] || {}).outerHTML = '';
        var fake = document.getElementsByTagName("ion-app1");
        if (fake && fake[0]) {
            fake[0].classList.add("loaded");
            setTimeout(function () { document.getElementsByTagName("ion-app1")[0].outerHTML = ''; }, 1500);
        }
        setTimeout(function () { if (window.dash || "")
            localStorage.setItem("dash_cache", window.dash || ""); }, 7000);
        var ios_action = localStorage.getItem('ios_action') || "";
        var key = helpers.getParameterByName('t');
        var email = helpers.getParameterByName('e');
        var platform_string = helpers.getParameterByName('ionicPlatform');
        if (key) {
            config.clearCurrent(key);
            localStorage.setItem("isGoogle", "true");
            localStorage.setItem('username', (email || "").replace("#", ""));
            config.saveCurrent();
            this.rootPage = pages.OrganizationsPage;
            helpers.cleanQuerystring('ionicPlatform', platform_string);
            return;
        }
        else {
            var error = helpers.getParameterByName('f');
            if (error) {
                setTimeout(function () { return _this.nav.alert(error, true); }, 3000);
            }
            localStorage.setItem("isGoogle", "");
        }
        helpers.cleanQuerystring('ionicPlatform', platform_string);
        if (config_1.dontClearCache)
            config.setCurrent(mocks_1.MOCKS["config"]);
        else if (!config.getCurrent("is_logged")) {
            this.rootPage = pages.LoginPage;
            return;
        }
        if (!config.getCurrent("is_chosen")) {
            this.rootPage = pages.OrganizationsPage;
            return;
        }
        setTimeout(function () { return _this.redirect(true); }, config_1.dontClearCache ? 1000 : 0);
    }
    MyApp.prototype.redirect = function (isRedirect) {
        var _this = this;
        this.dataProvider.getConfig().subscribe(function (data) {
            _this.onLine(true);
            clearInterval(_this.interval);
            _this.interval = setInterval(function () { return _this.redirect(); }, 5 * 60 * 1000);
            _this.redirect_logic(isRedirect, data);
        }, function (error) {
            clearInterval(_this.interval);
            _this.nav.alert(error || 'Server error', true);
            if (_this.is_offline && _this.config.getCurrent("user").firstname) {
                _this.redirect_logic(isRedirect, _this.config.getCurrent());
            }
            else {
                _this.config.setCurrent({ org: "" });
            }
        });
    };
    MyApp.prototype.ok = function (value) {
    };
    MyApp.prototype.fail = function (error) { alert(error); };
    MyApp.prototype.initOrgPreferences = function (value) {
        if (window.cordova) {
            var prefs = (window.plugins || {}).appPreferences;
            if (prefs) {
                var suitePrefs = prefs.iosSuite("group.io.sherpadesk.mobile");
                suitePrefs.store(this.ok, this.fail, 'org', value);
            }
        }
    };
    MyApp.prototype.redirect_logic = function (isRedirect, data) {
        this.config.setCurrent(data);
        if (this.config.current.user.is_techoradmin)
            this.pages = [
                { title: 'Dashboard', component: pages.DashboardPage, icon: "speedometer", is_active: true },
                { title: data.names.ticket.p, component: pages.TicketsPage, icon: "create", is_active: true },
                { title: 'Timelogs', component: pages.TimelogsPage, icon: "md-time", is_active: this.config.current.is_time_tracking },
                { title: data.names.account.p, component: pages.AccountsPage, icon: "people", is_active: this.config.current.is_account_manager },
                { title: 'Invoices', component: pages.InvoicesPage, icon: "card", is_active: this.config.current.is_time_tracking && this.config.current.is_invoice },
                { title: 'Queues', component: pages.QueuesPage, icon: "md-list-box", is_active: this.config.current.is_unassigned_queue && (!this.config.current.user.is_limit_assigned_tkts || this.config.current.user.is_admin) },
                { title: 'ToDos', component: pages.TodosPage, icon: "list-box", is_active: this.config.current.is_todos },
                { title: 'Switch Org', component: pages.OrganizationsPage, icon: "md-swap", is_active: this.config.current.is_multiple_org },
                { title: 'Signout', component: pages.LoginPage, icon: "md-log-in", is_active: true },
                { title: 'Full App', component: null, icon: "md-share-alt", is_active: true },
            ];
        else
            this.pages = [
                { title: data.names.ticket.p, component: pages.TicketsPage, icon: "create", is_active: true },
                { title: 'Switch Org', component: pages.OrganizationsPage, icon: "md-swap", is_active: this.config.current.is_multiple_org },
                { title: 'Signout', component: pages.LoginPage, icon: "md-log-in", is_active: true },
                { title: 'Full App', component: null, icon: "md-share-alt", is_active: true },
            ];
        if (localStorage.getItem("isPhonegap") === "true")
            this.initOrgPreferences(this.config.current.org + "-" + this.config.current.instance + ":" + this.config.current.key);
        if (isRedirect && localStorage.getItem("isExtension") === "true") {
            var loginStr = "login?t=" + this.config.current.key +
                "&o=" + this.config.current.org +
                "&i=" + this.config.current.instance;
            window.top.postMessage(loginStr, "*");
        }
        var appVer = localStorage.getItem("version");
        if (appVer !== data.mobile_ver && Number(data.mobile_ver) > Number(appVer))
            this.presentConfirm(data.mobile_ver, isRedirect);
        else
            this.force_redirect(isRedirect);
    };
    MyApp.prototype.force_redirect = function (isRedirect) {
        if (isRedirect) {
            var param = null;
            var ticket = localStorage.getItem('loadTicketNumber') || '';
            if (ticket) {
                localStorage.setItem('loadTicketNumber', '');
                localStorage.setItem('loadOrgKey', "");
                param = { key: ticket };
            }
            var page = this.config.current.user.is_techoradmin && !ticket ? pages.DashboardPage : pages.TicketsPage;
            this.nav.setRoot(page, param, { animation: "wp-transition" });
        }
    };
    MyApp.prototype.presentConfirm = function (version, isRedirect) {
        var _this = this;
        localStorage.setItem("version", version);
        this.config.saveCurrent();
        var alert = ionic_angular_1.Alert.create({
            title: "There is a new update available!",
            message: 'Page will reload in 2 seconds',
            cssClass: "hello",
            buttons: [
                {
                    text: "Yes, do it now",
                    role: 'cancel',
                    handler: function () {
                        window.t1 = null;
                        var element1 = document.createElement("script");
                        element1.src = config_1.MobileSite + "build/js/app.js?_d=" + Date.now();
                        document.body.appendChild(element1);
                        setTimeout(function () { return location.reload(true); }, 2000);
                    }
                },
                {
                    text: "No, I'll do it later",
                    handler: function () {
                        alert.dismiss().then(function () {
                            _this.force_redirect(isRedirect);
                        });
                        return false;
                    }
                }
            ]
        });
        this.nav.present(alert);
    };
    MyApp.prototype.isStorage = function () {
        var mod = 'modernizr';
        try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
        }
        catch (e) {
            var toast = ionic_angular_1.Toast.create({
                message: "Please enable Cookies to work with site!",
                enableBackdropDismiss: false,
                showCloseButton: true,
                cssClass: "toast-error"
            });
            this.nav.present(toast);
            return false;
        }
    };
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            if (localStorage.getItem("isPhonegap") === "true") {
                console.log('cordova ready');
            }
            window.addEventListener('online', function () { return _this.onLine(true); });
            window.addEventListener('offline', function () { return _this.onLine(false); });
            document.addEventListener('handle', function (e) { return _this.handle(e); }, false);
        });
    };
    MyApp.prototype.handle = function (e) {
        var goto = e.detail;
        var key = Object.keys(goto)[0];
        var page;
        var param = {};
        var is_modal = false;
        switch (key) {
            case "ticket":
                if (!this.config.getCurrent("is_logged"))
                    localStorage.setItem('loadTicketNumber', goto[key]);
                else {
                    page = pages.TicketsPage;
                    param = { key: goto[key] };
                }
                break;
            case "add_time":
                is_modal = true;
                page = pages.TimelogPage;
                break;
            case "add_tkt":
                is_modal = true;
                page = modals.TicketCreatePage;
                break;
            case "list":
                is_modal = true;
                page = pages.TicketsPage;
                param = { tab: goto[key] };
                break;
            default:
                break;
        }
        if (page) {
            if (is_modal)
                this.nav.push(page, param, { animation: "wp-transition" });
            else {
                this.nav.setRoot(page, param, { animation: "wp-transition" });
            }
        }
    };
    MyApp.prototype.checkConnection = function () {
        var _this = this;
        if (navigator.onLine) {
            if (localStorage.getItem("isPhonegap") !== "true") {
                this.img.onload = function () { return _this.onLine(true); };
                this.img.onerror = function () { return _this.onLine(false); };
                this.img.src = config_1.MobileSite + "img/select_arrow.png?rand=" + Math.random();
            }
        }
        else {
            this.onLine(false);
        }
    };
    MyApp.prototype.onLine = function (isOnline) {
        var _this = this;
        if (this.is_offline != !isOnline) {
            if (this.offlineTimer && this.offlineTimer.runCount >= 1)
                this.nav.alert(!isOnline ? "Sorry! You are offline now. Please check your internet connection!" : "Hey! You online now! Try again your action", !isOnline);
            if (localStorage.getItem("isPhonegap") !== "true") {
                if (!isOnline) {
                    clearInterval(this.offlineTimer);
                    this.offlineTimer = null;
                    this.offlineTimer = setInterval(function () { return _this.checkConnection(); }, 10 * 1000);
                }
                else {
                    clearInterval(this.offlineTimer);
                    this.offlineTimer = null;
                }
            }
        }
        this.is_offline = !isOnline;
    };
    MyApp.prototype.openPage = function (page, param) {
        this.menu.close();
        if (!page.component) {
            var curr = this.config.getCurrent();
            helpers.fullapplink(config_1.AppSite, "", curr.instance, curr.org);
            return;
        }
        if (this.interval && (page.component == pages.LoginPage || page.component == pages.OrganizationsPage))
            clearInterval(this.interval);
        if (page.index) {
            this.nav.setRoot(page.component || page, { tabIndex: page.index });
        }
        else {
            this.nav.setRoot(page.component || page);
        }
    };
    MyApp.prototype.ngOnInit = function () {
        this.subscribeToEvents();
    };
    MyApp.prototype.ngOnDestroy = function () {
        this.unsubscribeToEvents();
        clearInterval(this.offlineTimer);
        clearInterval(this.interval);
        if (localStorage.getItem("isPhonegap") === "true") {
            this.disconnectSubscription.unsubscribe();
            this.connectSubscription.unsubscribe();
        }
    };
    MyApp.prototype.logout = function (key) {
        this.config.clearCurrent(key);
        if (localStorage.getItem("isPhonegap") === "true")
            this.initOrgPreferences("");
    };
    MyApp.prototype.subscribeToEvents = function () {
        var _this = this;
        this.events.subscribe('login:failed', function () {
            _this.logout();
            _this.openPage({ component: pages.LoginPage });
        });
        this.events.subscribe('app:logout', function (data) {
            _this.logout(data && data[0]);
        });
        this.events.subscribe('connection:error', function (data) {
            _this.checkConnection();
        });
        this.events.subscribe('config:get', function (data) {
            _this.redirect(data);
        });
    };
    MyApp.prototype.unsubscribeToEvents = function () {
        this.events.unsubscribe('login:failed', null);
        this.events.unsubscribe('connection:error', null);
        this.events.unsubscribe('config:get', null);
        this.events.unsubscribe('app:logout', null);
    };
    MyApp.prototype.ExtendConfig = function () {
        localStorage.setItem('isExtension', window.self !== window.top ? "true" : "");
        localStorage.setItem("version", config_1.appVersion);
        this.config.getCurrent = function (property) {
            var tconfig = this.current || JSON.parse(localStorage.getItem("current") || "null") || {};
            tconfig.is_logged = !!tconfig.key;
            tconfig.is_chosen = !!tconfig.instance && !!tconfig.org && !!tconfig.key;
            tconfig.is_online = !this.is_offline;
            var appVer = localStorage.getItem("version");
            tconfig.is_updated = !(appVer !== tconfig.mobile_ver && Number(tconfig.mobile_ver) > Number(appVer));
            if (!tconfig.stat)
                tconfig.stat = {};
            if (!tconfig.user)
                tconfig.user = {};
            if (!tconfig.recent)
                tconfig.recent = {};
            if (!tconfig.cache)
                tconfig.cache = {};
            if (property)
                return tconfig[property] || "";
            return tconfig;
        };
        this.config.current = this.config.getCurrent();
        this.config.saveCurrent = function () {
            var curr = this.getCurrent();
            localStorage.setItem("current", JSON.stringify(curr));
            localStorage.setItem("dateformat", curr.user.date_format || 0);
            localStorage.setItem('timeformat', curr.user.time_format || 0);
            localStorage.setItem('currency', curr.currency || "$");
        };
        this.config.setCurrent = function (nconfig, nosave) {
            this.current = Object.assign({}, this.current || {}, nconfig || {});
            if (!nosave)
                this.saveCurrent();
        };
        this.config.clearCurrent = function (key) {
            localStorage.removeItem("dash_cache");
            localStorage.removeItem("current");
            this.setCurrent({ key: key || "", org: "", instance: "", user: {}, stat: {}, recent: {}, cache: {} });
        };
        this.config.getStat = function (property) {
            var stat = this.getCurrent("stat")[property];
            if (typeof stat == "undefined")
                return -1;
            return stat || {};
        };
        this.config.setStat = function (property, value) {
            this.current.stat[property] = value;
        };
        this.config.getRecent = function (property) {
            var recent = this.getCurrent("recent")[property];
            return recent || {};
        };
        this.config.setRecent = function (property, value) {
            if (!value)
                this.current.recent = Object.assign({}, this.current.recent || {}, property || {});
            else
                this.current.recent[property] = value;
        };
        this.config.getCache = function (property) {
            var cache = this.getCurrent("cache")[property];
            if (typeof cache == "undefined")
                return [];
            return cache || {};
        };
        this.config.setCache = function (property, value) {
            this.current.cache[property] = value;
        };
    };
    MyApp.prototype.ExtendNavAlert = function () {
        this.nav.alert = function (message, isNeg) {
            var toast = ionic_angular_1.Toast.create({
                message: message,
                duration: isNeg ? 7000 : 3000,
                cssClass: isNeg ? "toast-error" : "toast-ok",
                showCloseButton: true,
                closeButtonText: "X"
            });
            this.present(toast);
        };
    };
    __decorate([
        core_1.ViewChild(ionic_angular_1.Nav), 
        __metadata('design:type', ionic_angular_1.Nav)
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        ionic_angular_1.App({
            template: '<ion-menu id="leftMenu" [content]="content"><ion-content class="menu-bg"><ion-list no-lines><div *ngFor="let p of pages" (click)="openPage(p)"><button detail-none *ngIf="p.is_active" ion-item><i><ion-icon name="{{p.icon}}"></ion-icon></i><h3>{{p.title}}</h3></button></div></ion-list></ion-content></ion-menu><div *ngIf="is_offline" class="offline_status {{ is_phonegap ? \'ios7style\' : \'\'}}">OFFLINE</div><ion-nav id="nav" [root]="rootPage" #content swipe-back-enabled="false"></ion-nav>',
            providers: [providers.ApiData, providers.DataProvider, providers.TicketProvider, providers.TimeProvider, providers.TodoProvider],
            prodMode: true,
            config: {
                tabbarPlacement: 'top',
                pageTransitionDelay: 0,
                prodMode: true,
                activator: "ripple",
                ios: {
                    activator: 'ripple'
                }
            }
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.IonicApp, ionic_angular_1.Platform, ionic_angular_1.Config, ionic_angular_1.Events, ionic_angular_1.MenuController, providers.TicketProvider, providers.DataProvider])
    ], MyApp);
    return MyApp;
}());

},{"./directives/helpers":15,"./pages/modals/modals":30,"./pages/pages":35,"./providers/config":55,"./providers/mocks":57,"./providers/providers":58,"@angular/core":"@angular/core","ionic-angular":"ionic-angular"}],2:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var core_1 = require('@angular/core');
var account_details_1 = require('../../pages/account-details/account-details');
var pipes_1 = require('../../pipes/pipes');
var AccountsListComponent = (function () {
    function AccountsListComponent(nav, config) {
        this.nav = nav;
        this.config = config;
        this.is_empty = false;
    }
    AccountsListComponent.prototype.itemTapped = function (event, account) {
        account.account_statistics.ticket_counts.closed = null;
        this.nav.push(account_details_1.AccountDetailsPage, account);
    };
    AccountsListComponent.prototype.ngOnChanges = function (event) {
        if (!this.simple)
            return;
        if ("accounts" in event) {
            if (event.accounts.isFirstChange() && event.accounts.currentValue !== null)
                return;
            this.is_empty = !event.accounts.currentValue || event.accounts.currentValue.length == 0;
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], AccountsListComponent.prototype, "accounts", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], AccountsListComponent.prototype, "simple", void 0);
    AccountsListComponent = __decorate([
        core_1.Component({
            selector: 'accounts-list',
            template: '<ion-list class="list" no-lines><div *ngIf="!simple && accounts?.length" class="flexed color"><div detail-none><span>&nbsp;&nbsp;&nbsp;</span> <span [hidden]="!config.current.is_time_tracking">Hours</span> <span [hidden]="!config.current.is_expenses">Expenses</span> <span>{{config.current.names.ticket.ap}}</span></div></div><div class="accountlist flexed"><div detail-none href="#" *ngFor="let account of accounts" (click)="itemTapped($event, account)"><span>{{account.name}}</span> <span [hidden]="simple || !config.current.is_time_tracking" [innerHTML]="account.account_statistics.hours | More:[1000]"></span> <span [hidden]="simple || !config.current.is_expenses" [innerHTML]="account.account_statistics.expenses | More:[1000,\'$VV\']"></span> <span [innerHTML]="account.account_statistics.ticket_counts.open | More:[1000]"></span></div></div></ion-list><div *ngIf="is_empty && !simple" class="table grey2 menu-text">No Accounts</div>',
            directives: [ionic_angular_1.IONIC_DIRECTIVES],
            pipes: [pipes_1.MorePipe],
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav, ionic_angular_1.Config])
    ], AccountsListComponent);
    return AccountsListComponent;
}());
exports.AccountsListComponent = AccountsListComponent;

},{"../../pages/account-details/account-details":16,"../../pipes/pipes":53,"@angular/core":"@angular/core","ionic-angular":"ionic-angular"}],3:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var core_1 = require('@angular/core');
var modals_1 = require('../../pages/modals/modals');
var timelog_1 = require('../../pages/timelog/timelog');
var ticket_details_1 = require('../../pages/ticket-details/ticket-details');
var expense_create_1 = require('../../pages/expense-create/expense-create');
var todo_create_1 = require('../../pages/todo-create/todo-create');
var uninvoices_1 = require('../../pages/uninvoices/uninvoices');
var ActionButtonComponent = (function () {
    function ActionButtonComponent(navParams, nav, config) {
        this.navParams = navParams;
        this.nav = nav;
        this.config = config;
        this.data = {};
    }
    ActionButtonComponent.prototype.ngOnInit = function () {
    };
    ActionButtonComponent.prototype.openModal = function (page) {
        var _this = this;
        var myModal = ionic_angular_1.Modal.create(page, this.data);
        myModal.onDismiss(function (data1) {
            if (data1 && !_this.data.tech && !_this.data.account)
                _this.nav.push(ticket_details_1.TicketDetailsPage, data1);
        });
        this.nav.present(myModal);
    };
    ActionButtonComponent.prototype.presentActionSheet = function () {
        var _this = this;
        if (!this.config.current.user.is_techoradmin) {
            this.openModal(modals_1.TicketCreatePage);
            return;
        }
        var but = [
            {
                icon: 'create',
                text: 'Add ' + this.config.current.names.ticket.s,
                role: '',
                handler: function () {
                    _this.actionSheet.dismiss().then(function () { return _this.openModal(modals_1.TicketCreatePage); });
                    return false;
                }
            }];
        if (this.config.current.is_time_tracking) {
            but.push({
                icon: 'md-time',
                text: 'Add Time',
                role: '',
                handler: function () {
                    _this.actionSheet.dismiss().then(function () { return _this.openModal(timelog_1.TimelogPage); });
                    return false;
                }
            });
            if (this.config.current.is_invoice)
                but.push({
                    icon: 'card',
                    text: 'Add Invoice',
                    role: '',
                    handler: function () {
                        _this.actionSheet.dismiss().then(function () { return _this.nav.push(uninvoices_1.UnInvoicesPage); });
                        return false;
                    }
                });
            if (this.config.current.is_todos)
                but.push({
                    icon: 'ios-list-box-outline',
                    text: 'Add ToDo',
                    role: '',
                    handler: function () {
                        _this.actionSheet.dismiss().then(function () { return _this.nav.push(todo_create_1.TodoCreatePage); });
                        return false;
                    }
                });
        }
        if (this.config.current.is_expenses)
            but.push({
                icon: 'md-list-box',
                text: 'Add Expense',
                role: '',
                handler: function () {
                    _this.actionSheet.dismiss().then(function () { return _this.openModal(expense_create_1.ExpenseCreatePage); });
                    return false;
                }
            });
        but.push({
            icon: '',
            text: 'Cancel',
            role: 'cancel',
            handler: function () {
                console.log('Cancel clicked');
                return true;
            }
        });
        this.actionSheet = ionic_angular_1.ActionSheet.create({
            title: '',
            buttons: but
        });
        this.nav.present(this.actionSheet);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ActionButtonComponent.prototype, "data", void 0);
    ActionButtonComponent = __decorate([
        core_1.Component({
            selector: 'action-button',
            template: '<button (click)="presentActionSheet()" secondary item-right fab fab-right fab-bottom style="z-index: 2"><ion-icon class="button_circle action-but" name="md-add"></ion-icon></button>',
            directives: [ionic_angular_1.IONIC_DIRECTIVES],
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavParams, ionic_angular_1.Nav, ionic_angular_1.Config])
    ], ActionButtonComponent);
    return ActionButtonComponent;
}());
exports.ActionButtonComponent = ActionButtonComponent;

},{"../../pages/expense-create/expense-create":20,"../../pages/modals/modals":30,"../../pages/ticket-details/ticket-details":39,"../../pages/timelog/timelog":41,"../../pages/todo-create/todo-create":43,"../../pages/uninvoices/uninvoices":45,"@angular/core":"@angular/core","ionic-angular":"ionic-angular"}],4:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var api_data_1 = require('../../providers/api-data');
var core_1 = require('@angular/core');
var modals_1 = require('../../pages/modals/modals');
require('rxjs');
var alertLimit = 10;
var ClassListComponent = (function () {
    function ClassListComponent(nav, apiData, config) {
        this.nav = nav;
        this.apiData = apiData;
        this.config = config;
        this.list = {};
        this.onChanged = new core_1.EventEmitter(false);
        this.init = true;
        this.selected = {};
    }
    ClassListComponent.prototype.ngOnInit = function () {
        if (!this.config.current.is_class_tracking) {
            this.list.hidden = true;
            return;
        }
        if (this.list.url) {
            this.url = this.list.url;
            if (this.preload) {
                this.loadData(false);
            }
        }
    };
    ClassListComponent.prototype.open = function () {
        this.loadData(true);
    };
    ClassListComponent.prototype.loadData = function (show) {
        var _this = this;
        if (this.url != this.list.url || !this.list.items || this.list.items.length == 0) {
            if (this.list.url) {
                this.apiData.get(this.list.url).subscribe(function (data) {
                    _this.list.items = data;
                    _this.proceed_list(show);
                    _this.url = _this.list.url;
                }, function (error) {
                    _this.error("Cannot get " + _this.list.name + " list! Error: " + error);
                    console.log(error || 'Server error');
                });
            }
            else
                this.error(this.list.name + ' list is empty!');
        }
        else {
            this.proceed_list(show);
        }
    };
    ClassListComponent.prototype.error = function (message) {
        this.nav.alert(message, true);
    };
    ClassListComponent.prototype.proceed_list = function (show) {
        if (!this.config.getCurrent("is_tech"))
            this.list.items = this.list.items.filter(function (v) { return !v.is_restrict_to_techs; });
        this.list.items = this.list.items.filter(function (v) { return v.is_active; });
        if (!this.list.items || this.list.items.length == 0) {
            this.list.value = "Default (nothing to select)";
            return;
        }
        if (show) {
            if (this.list.items[0].name != "Default (no selection)")
                this.list.items.splice(0, 0, { hierarchy_level: 0, id: 0, is_active: true, is_lastchild: true, name: "Default (no selection)" });
            this.openModal();
        }
    };
    ClassListComponent.prototype.emit_changed = function (value) {
        value.name = this.findPath(" ", this.list.items, value.id);
        value.type = "class";
        this.onChanged.emit(value);
    };
    ClassListComponent.prototype.findPath = function (path, array, id) {
        if (typeof array != 'undefined' && array) {
            for (var i = 0; i < array.length; i++) {
                if (array[i].id == id)
                    return array[i].name;
                var path = this.findPath(path, array[i].sub, id);
                if (path != null) {
                    return array[i].name + " / " + path;
                }
            }
        }
        return null;
    };
    ClassListComponent.prototype.openRadio = function () {
        var _this = this;
        var title = this.list.name;
        var alert = ionic_angular_1.Alert.create({
            title: 'Choose ' + title,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'OK',
                    handler: function (data) {
                        if (data) {
                            _this.selected = data;
                            _this.emit_changed(data);
                        }
                    }
                }
            ]
        });
        this.list.items.forEach(function (item) {
            alert.addInput({
                type: 'radio',
                label: item.name,
                value: item,
            });
        });
        this.nav.present(alert);
    };
    ClassListComponent.prototype.openModal = function () {
        var _this = this;
        var myModal = ionic_angular_1.Modal.create(modals_1.TreeModal, this.list);
        myModal.onDismiss(function (data) {
            if (data.name) {
                _this.selected = data;
                _this.emit_changed(data);
            }
        });
        this.nav.present(myModal);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ClassListComponent.prototype, "list", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], ClassListComponent.prototype, "preload", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], ClassListComponent.prototype, "onChanged", void 0);
    ClassListComponent = __decorate([
        core_1.Component({
            selector: 'class-list',
            template: '<div *ngIf="!list.hidden"><ion-item no-lines class="labels color">Class:&nbsp;</ion-item></div><button *ngIf="!list.hidden" (click)="open()" class="blue4 width100 disable-hover button button-default button-select"><ion-label class="tkts-table">{{list.value}}</ion-label><ion-icon name="arrow-down"></ion-icon></button>',
            directives: [ionic_angular_1.IONIC_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav, api_data_1.ApiData, ionic_angular_1.Config])
    ], ClassListComponent);
    return ClassListComponent;
}());
exports.ClassListComponent = ClassListComponent;

},{"../../pages/modals/modals":30,"../../providers/api-data":54,"@angular/core":"@angular/core","ionic-angular":"ionic-angular","rxjs":"rxjs"}],5:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require('./queues-list/queues-list'));
__export(require('./accounts-list/accounts-list'));
__export(require('./todo-list/todo-list'));
__export(require('./tickets-list/tickets-list'));
__export(require('./posts-list/posts-list'));
__export(require('./select-list/select-list'));
__export(require('./class-list/class-list'));
__export(require('./action-button/action-button'));

},{"./accounts-list/accounts-list":2,"./action-button/action-button":3,"./class-list/class-list":4,"./posts-list/posts-list":7,"./queues-list/queues-list":8,"./select-list/select-list":9,"./tickets-list/tickets-list":10,"./todo-list/todo-list":11}],6:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var api_data_1 = require('../../providers/api-data');
var core_1 = require('@angular/core');
var modals_1 = require('../../pages/modals/modals');
var helpers_1 = require('../../directives/helpers');
require('rxjs');
var alertLimit = 10;
var LocationListComponent = (function () {
    function LocationListComponent(nav, apiData, config) {
        this.nav = nav;
        this.apiData = apiData;
        this.config = config;
        this.list = {};
        this.onChanged = new core_1.EventEmitter(false);
        this.init = true;
        this.selected = {};
    }
    LocationListComponent.prototype.ngOnInit = function () {
        if (!this.config.current.is_location_tracking) {
            this.list.hidden = true;
            return;
        }
        this.name = (this.config.current.names[this.list.name] || {}).s || this.list.name;
        if (this.list.url) {
            this.url = this.list.url;
            if (this.preload) {
                this.loadData(false);
            }
        }
    };
    LocationListComponent.prototype.open = function () {
        this.loadData(true);
    };
    LocationListComponent.prototype.loadData = function (show) {
        var _this = this;
        if (this.url != this.list.url || !this.list.items || this.list.items.length == 0) {
            if (this.list.url) {
                this.apiData.get(helpers_1.addp(this.list.url, "is_tree", "true")).subscribe(function (data) {
                    _this.list.items = data;
                    _this.proceed_list(show);
                    _this.url = _this.list.url;
                }, function (error) {
                    _this.error("Cannot get " + _this.name + " list! Error: " + error);
                    console.log(error || 'Server error');
                });
            }
            else
                this.error(this.name + ' list is empty!');
        }
        else {
            this.proceed_list(show);
        }
    };
    LocationListComponent.prototype.error = function (message) {
        this.nav.alert(message, true);
    };
    LocationListComponent.prototype.proceed_list = function (show) {
        if (!this.list.items || this.list.items.length == 0) {
            this.list.value = "Default (nothing to select)";
            return;
        }
        if (show) {
            if (this.list.items[0].name != "Default (no selection)")
                this.list.items.splice(0, 0, { hierarchy_level: 0, id: 0, is_active: true, is_lastchild: true, name: "Default (no selection)" });
            this.openModal();
        }
    };
    LocationListComponent.prototype.emit_changed = function (value) {
        value.name = this.findPath(" ", this.list.items, value.id);
        value.type = "location";
        this.onChanged.emit(value);
    };
    LocationListComponent.prototype.findPath = function (path, array, id) {
        if (typeof array != 'undefined' && array) {
            for (var i = 0; i < array.length; i++) {
                if (array[i].id == id)
                    return array[i].name;
                var path = this.findPath(path, array[i].sub, id);
                if (path != null) {
                    return array[i].name + " / " + path;
                }
            }
        }
        return null;
    };
    LocationListComponent.prototype.openRadio = function () {
        var _this = this;
        var title = this.name;
        var alert = ionic_angular_1.Alert.create({
            title: 'Choose ' + title,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'OK',
                    handler: function (data) {
                        if (data) {
                            _this.selected = data;
                            _this.emit_changed(data);
                        }
                    }
                }
            ]
        });
        this.list.items.forEach(function (item) {
            alert.addInput({
                type: 'radio',
                label: item.name,
                value: item,
            });
        });
        this.nav.present(alert);
    };
    LocationListComponent.prototype.openModal = function () {
        var _this = this;
        var myModal = ionic_angular_1.Modal.create(modals_1.TreeModal, this.list);
        myModal.onDismiss(function (data) {
            if (data.name) {
                _this.selected = data;
                _this.emit_changed(data);
            }
        });
        this.nav.present(myModal);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], LocationListComponent.prototype, "list", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], LocationListComponent.prototype, "preload", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], LocationListComponent.prototype, "onChanged", void 0);
    LocationListComponent = __decorate([
        core_1.Component({
            selector: 'location-list',
            template: '<div *ngIf="!list.hidden"><ion-item no-lines class="labels color">{{name}}:&nbsp;</ion-item></div><button *ngIf="!list.hidden" (click)="open()" class="blue4 width100 disable-hover button button-default button-select"><ion-label class="tkts-table">{{list.value}}</ion-label><ion-icon name="arrow-down"></ion-icon></button>',
            directives: [ionic_angular_1.IONIC_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav, api_data_1.ApiData, ionic_angular_1.Config])
    ], LocationListComponent);
    return LocationListComponent;
}());
exports.LocationListComponent = LocationListComponent;

},{"../../directives/helpers":15,"../../pages/modals/modals":30,"../../providers/api-data":54,"@angular/core":"@angular/core","ionic-angular":"ionic-angular","rxjs":"rxjs"}],7:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var core_1 = require('@angular/core');
var pipes_1 = require('../../pipes/pipes');
var PostsListComponent = (function () {
    function PostsListComponent() {
        this.posts = [];
        this._posts = [];
        this.attachments = [];
    }
    PostsListComponent.prototype.filter = function () {
        var posts = [];
        if (!this.is_showlogs)
            posts = this.posts.filter(function (item) { return !!~["Initial Post", "Response", "Closed", "ReOpened"].indexOf(item.log_type); });
        else
            posts = this.posts;
        this._posts = this.is_first ? [posts[0]] : posts.slice(1);
    };
    PostsListComponent.prototype.ngOnInit = function () {
        this.filter();
    };
    PostsListComponent.prototype.ngOnChanges = function (event) {
        if ("is_showlogs" in event) {
            this.filter();
            return;
        }
        if ("posts" in event) {
            if ("posts" in event && (event.posts.isFirstChange() || (event.posts.currentValue[0] || {}).id == (event.posts.previousValue[0] || {}).id))
                return;
            this.filter();
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], PostsListComponent.prototype, "posts", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], PostsListComponent.prototype, "attachments", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], PostsListComponent.prototype, "is_showlogs", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], PostsListComponent.prototype, "is_first", void 0);
    PostsListComponent = __decorate([
        core_1.Component({
            selector: 'posts-list',
            template: '<div><ion-card-content class="card-content" *ngFor="let post of _posts"><div></div><ion-avatar><img [alt]="post.user_firstname" [src]="post.user_email | Gravatar"><p>{{post.user_firstname || post.user_email}}</p></ion-avatar><span class="postlist"><p>{{post.record_date | Daysold}}</p><p>{{post.log_type}}</p></span><p class="post-note" [innerHTML]="post.note | Linebreaks | Files : attachments"></p><ion-item no-lines></ion-item></ion-card-content></div>',
            directives: [ionic_angular_1.IONIC_DIRECTIVES],
            pipes: [pipes_1.LinebreaksPipe, pipes_1.GravatarPipe, pipes_1.DaysoldPipe, pipes_1.FilesPipe],
        }), 
        __metadata('design:paramtypes', [])
    ], PostsListComponent);
    return PostsListComponent;
}());
exports.PostsListComponent = PostsListComponent;

},{"../../pipes/pipes":53,"@angular/core":"@angular/core","ionic-angular":"ionic-angular"}],8:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var core_1 = require('@angular/core');
var queue_tickets_1 = require('../../pages/queue-tickets/queue-tickets');
var pipes_1 = require('../../pipes/pipes');
var QueuesListComponent = (function () {
    function QueuesListComponent(nav) {
        this.nav = nav;
        this.is_empty = false;
    }
    QueuesListComponent.prototype.ngOnChanges = function (event) {
        if (!this.simple)
            return;
        if ("queues" in event) {
            if (event.queues.isFirstChange() && event.queues.currentValue !== null)
                return;
            this.is_empty = !event.queues.currentValue || event.queues.currentValue.length == 0;
        }
    };
    QueuesListComponent.prototype.goToQueueTicketsPage = function (queue) {
        this.nav.push(queue_tickets_1.QueueTicketsPage, queue);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], QueuesListComponent.prototype, "queues", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], QueuesListComponent.prototype, "simple", void 0);
    QueuesListComponent = __decorate([
        core_1.Component({
            selector: 'queues-list',
            template: '<ion-list class="queues-list list" no-lines><a detail-none href="#" *ngFor="let queue of queues" class="queues" (click)="goToQueueTicketsPage(queue)"><span>{{queue.fullname}}</span> <span [innerHTML]="queue.tickets_count | More:[10000]"></span></a></ion-list><div *ngIf="is_empty" class="table grey2 menu-text">No Queues</div>',
            directives: [ionic_angular_1.IONIC_DIRECTIVES],
            pipes: [pipes_1.MorePipe],
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav])
    ], QueuesListComponent);
    return QueuesListComponent;
}());
exports.QueuesListComponent = QueuesListComponent;

},{"../../pages/queue-tickets/queue-tickets":36,"../../pipes/pipes":53,"@angular/core":"@angular/core","ionic-angular":"ionic-angular"}],9:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var api_data_1 = require('../../providers/api-data');
var helpers_1 = require('../../directives/helpers');
var core_1 = require('@angular/core');
var modals_1 = require('../../pages/modals/modals');
var alertLimit = 5;
var SelectListComponent = (function () {
    function SelectListComponent(nav, apiData, config) {
        this.nav = nav;
        this.apiData = apiData;
        this.config = config;
        this.is_enabled = true;
        this.onChanged = new core_1.EventEmitter(false);
        this.selected = {};
        this.init = true;
        this.name = "";
        this.list = {};
    }
    SelectListComponent.prototype.ngOnInit = function () {
        var listname = this.list.name.toLowerCase();
        if ((listname == "project" && !this.config.current.is_project_tracking) ||
            (listname == "location" && !this.config.current.is_location_tracking) ||
            (listname == "priority" && !this.config.current.is_priorities_general) ||
            (listname == "account" && !this.config.current.is_account_manager) ||
            (listname == "level" && !this.config.current.is_ticket_levels) ||
            ((listname == "resolution" || listname == "category") && !this.config.current.is_resolution_tracking)) {
            this.list.hidden = true;
        }
        if (this.list.hidden)
            return;
        if (listname == "tech" || listname == "user")
            this.name = (this.config.current.names[listname] || {}).a;
        else
            this.name = (this.config.current.names[listname] || {}).s || this.list.name;
        if (this.list.url) {
            this.url = this.list.url;
            if (this.preload) {
                this.loadData(false);
            }
        }
    };
    SelectListComponent.prototype.me = function () {
        var he = this.config.getCurrent("user");
        var value = {
            id: he.user_id,
            name: helpers_1.getFullName(he.firstname, he.lastname, he.email)
        };
        this.emit_changed(value);
    };
    SelectListComponent.prototype.open = function () {
        this.loadData(true);
    };
    SelectListComponent.prototype.loadData = function (show) {
        var _this = this;
        if (this.url != this.list.url || !this.list.items || this.list.items.length == 0) {
            if (this.list.url) {
                var loading_1 = null;
                if (show) {
                    loading_1 = ionic_angular_1.Loading.create({
                        content: "Please wait...",
                        dismissOnPageChange: true
                    });
                    this.nav.present(loading_1);
                }
                this.apiData.get(this.list.url).subscribe(function (data) {
                    _this.list.items = data;
                    if (show) {
                        loading_1.dismiss();
                    }
                    _this.proceed_list(show);
                    _this.url = _this.list.url;
                }, function (error) {
                    if (show)
                        loading_1.dismiss();
                    _this.error("Cannot get " + _this.name + " list! Error: " + error);
                    console.log(error || 'Server error');
                });
            }
            else {
                this.list.hidden = true;
                this.error(this.name + ' list is empty!');
            }
        }
        else
            this.proceed_list(show);
    };
    SelectListComponent.prototype.error = function (message) {
        this.nav.alert(message, true);
    };
    SelectListComponent.prototype.proceed_list = function (show) {
        var _this = this;
        if (!this.list.items || this.list.items.length == 0) {
            this.list.value = "Default (nothing to select)";
            return;
        }
        if (show) {
            if (!this.list.items[0].name) {
                var results = [];
                this.list.items.forEach(function (item) {
                    var name;
                    if (item.email)
                        name = helpers_1.getFullName(item.firstname, item.lastname, item.email, _this.isbutton ? "" : " ");
                    else if (item.number)
                        name = "#" + item.number + ": " + item.subject;
                    results.push({ id: item.id, name: name });
                });
                this.list.items = results;
            }
            this.openModal();
        }
    };
    SelectListComponent.prototype.emit_changed = function (value) {
        this.list.value = value.name;
        value.type = this.list.name.split(' ').join('').toLowerCase();
        this.onChanged.emit(value);
    };
    SelectListComponent.prototype.openRadio = function () {
        var _this = this;
        var title = this.name;
        var alert = ionic_angular_1.Alert.create({
            title: 'Choose ' + title,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'OK',
                    handler: function (data) {
                        if (data) {
                            _this.selected = data;
                            _this.emit_changed(data);
                        }
                    }
                }
            ]
        });
        this.list.items.forEach(function (item) {
            alert.addInput({
                type: 'radio',
                label: item.name,
                value: item,
            });
        });
        this.nav.present(alert);
    };
    SelectListComponent.prototype.openModal = function () {
        var _this = this;
        this.list.isbutton = this.isbutton;
        var len = this.list.items.length || 0;
        var modal = len >= 25 && len % 25 == 0 ? modals_1.InfinitySelectModal : modals_1.BasicSelectModal;
        var myModal = ionic_angular_1.Modal.create(modal, this.list);
        myModal.onDismiss(function (data) {
            if (data.name) {
                _this.selected = data;
                _this.emit_changed(data);
            }
        });
        this.nav.present(myModal);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SelectListComponent.prototype, "list", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], SelectListComponent.prototype, "isbutton", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], SelectListComponent.prototype, "is_enabled", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], SelectListComponent.prototype, "is_me", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], SelectListComponent.prototype, "preload", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], SelectListComponent.prototype, "ajax", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], SelectListComponent.prototype, "onChanged", void 0);
    SelectListComponent = __decorate([
        core_1.Component({
            selector: 'select-list',
            template: '<div *ngIf="!list.hidden && !isbutton"><ion-item no-lines class="labels color">{{name}}:&nbsp;</ion-item></div><button [disabled]="!is_enabled" *ngIf="!list.hidden" (click)="open()" class="{{ isbutton? \'blue2 button-block\' : \'blue4\'}} {{ is_me ? \'left button-calc\' : \'width100\'}} disable-hover button button-default button-select"><ion-label class="{{isbutton ? \'center\' : \'tkts-table\'}}">{{list.value}}</ion-label><ion-icon [hidden]="isbutton" name="arrow-down"></ion-icon></button> <button *ngIf="is_me" class="buttonTicket button-ticket attach right color" (click)="me()"><u>Me</u></button>',
            directives: [ionic_angular_1.IONIC_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav, api_data_1.ApiData, ionic_angular_1.Config])
    ], SelectListComponent);
    return SelectListComponent;
}());
exports.SelectListComponent = SelectListComponent;

},{"../../directives/helpers":15,"../../pages/modals/modals":30,"../../providers/api-data":54,"@angular/core":"@angular/core","ionic-angular":"ionic-angular"}],10:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var core_1 = require('@angular/core');
var ticket_provider_1 = require('../../providers/ticket-provider');
var ticket_details_1 = require('../../pages/ticket-details/ticket-details');
var modals_1 = require('../../pages/modals/modals');
var helpers_1 = require('../../directives/helpers');
var pipes_1 = require('../../pipes/pipes');
var TicketsListComponent = (function () {
    function TicketsListComponent(nav, navParams, config, ticketProvider) {
        this.nav = nav;
        this.navParams = navParams;
        this.config = config;
        this.ticketProvider = ticketProvider;
        this.LIMIT = 6;
        this.is_empty = false;
        this.pager = { page: 0, limit: this.LIMIT };
    }
    TicketsListComponent.prototype.ngOnChanges = function (event) {
        return;
        if ("count" in event) {
            if (event.count.isFirstChange())
                return;
            this.count = event.count.currentValue;
            if (this.count < 1)
                this.is_empty = true;
            else {
                this.pager.limit = this.count;
                this.onLoad();
                this.is_empty = false;
            }
        }
    };
    TicketsListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.he = this.config.getCurrent("user");
        this.cachename = this.mode[0] + (this.mode[1] || "");
        this.cachelen = (this.ticketProvider._dataStore[this.cachename] || {}).length;
        if (this.mode[0] == "all") {
            this.pager.limit = this.LIMIT = 15;
        }
        if (this.preload && !this.cachelen) {
            setTimeout(function () {
                _this.onLoad();
            }, this.preload);
        }
        else
            this.onLoad();
    };
    TicketsListComponent.prototype.onLoad = function () {
        var _this = this;
        if (!this.mode)
            return;
        var stat = this.config.getStat("tickets")[this.mode[0]];
        this.count = !stat ? this.count : stat;
        if (this.count !== 0) {
            this.ticketProvider.getTicketsList(this.mode[0], this.mode[1], this.pager);
            this.tickets = this.ticketProvider.tickets$[this.cachename];
            if (!this.ticketProvider._dataStore[this.cachename].length) {
                var timer = setTimeout(function () {
                    _this.busy = true;
                }, 500);
                this.tickets.subscribe(function (data) {
                    clearTimeout(timer);
                    _this.busy = false;
                    _this.is_empty = !data.length;
                });
            }
        }
        else {
            this.is_empty = true;
        }
    };
    TicketsListComponent.prototype.itemTapped = function (event, ticket, slidingItem) {
        if (event.srcElement.tagName.toUpperCase() != "ION-ITEM-SLIDING") {
            slidingItem.close();
            ticket.clicked = true;
            ticket.cachename = this.cachename;
            if (ticket.technician_email == this.he.email)
                ticket.is_new_tech_post = false;
            if (ticket.technician_email == this.he.email)
                ticket.is_new_user_post = false;
            this.nav.push(ticket_details_1.TicketDetailsPage, ticket);
        }
    };
    TicketsListComponent.prototype.addPost = function (ticket, slidingItem) {
        var _this = this;
        slidingItem.close();
        var prompt = ionic_angular_1.Alert.create({
            title: 'Add Response to #' + ticket.number,
            inputs: [
                {
                    name: 'note',
                    placeholder: 'Note'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: function (data) {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Post',
                    handler: function (data) {
                        if (!data.note.trim())
                            return;
                        var post = helpers_1.htmlEscape(data.note.trim()).substr(0, 5000);
                        _this.ticketProvider.addTicketPost(ticket.id, post).subscribe(function (data) {
                            _this.nav.alert('Note added :)');
                        }, function (error) {
                            console.log(error || 'Server error');
                        });
                    }
                }
            ]
        });
        this.nav.present(prompt);
    };
    TicketsListComponent.prototype.closeTicket = function (ticket, slidingItem) {
        var _this = this;
        slidingItem.close();
        if (ticket.status == 'Closed') {
            this.reopenTicket(ticket);
            return;
        }
        var myModal = ionic_angular_1.Modal.create(modals_1.CloseTicketModal, ticket);
        myModal.onDismiss(function (data) {
            if (!data)
                return;
            _this.count -= data;
            _this.ticketProvider._dataStore[_this.cachename].splice(_this.ticketProvider._dataStore[_this.cachename].indexOf(ticket), 1);
            _this.ticketProvider.getTicketsList(_this.mode[0], _this.mode[1], _this.pager);
            if (_this.count < 1)
                _this.is_empty = true;
            else {
                _this.is_empty = false;
            }
        });
        this.nav.present(myModal);
    };
    TicketsListComponent.prototype.reopenTicket = function (ticket) {
        var _this = this;
        var data = {
            "status": "open",
            "note_text": ""
        };
        this.ticketProvider.closeOpenTicket(ticket.key, data).subscribe(function (data) {
            _this.nav.alert('Ticket has been Reopened!');
            ticket.status = "Open";
        }, function (error) {
            console.log(error || 'Server error');
        });
    };
    TicketsListComponent.prototype.doInfinite = function (infiniteScroll) {
        var _this = this;
        if (this.is_empty || (this.count > 0 && (this.count < this.LIMIT)) || (this.cachelen > 0 && (this.cachelen >= this.count || this.cachelen < this.LIMIT))) {
            infiniteScroll.enable(false);
            infiniteScroll.complete();
            return;
        }
        this.pager.page += 1;
        var cachedlen = (this.ticketProvider._dataStore[this.cachename] || {}).length;
        this.ticketProvider.getTicketsList(this.mode[0], this.mode[1], this.pager);
        this.tickets.subscribe(function (data) {
            infiniteScroll.complete();
            var len = data.length;
            infiniteScroll.enable(!(cachedlen == len || len % _this.LIMIT));
            _this.cachelen = len;
        });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], TicketsListComponent.prototype, "mode", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], TicketsListComponent.prototype, "count", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], TicketsListComponent.prototype, "preload", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], TicketsListComponent.prototype, "filter", void 0);
    TicketsListComponent = __decorate([
        core_1.Component({
            selector: 'tickets-list',
            template: '<ion-content style="height: 90vh;"><ion-list class="list indent-bottom general-alignment2" no-lines><img *ngIf="busy" class="imglogo img-padding" src="img/loading2.gif"><ion-item-sliding class="border" *ngFor="let ticket of tickets | async" #slidingItem><a detail-none href="#" ion-item (click)="itemTapped($event, ticket, slidingItem)" class="item margin" [class.only-click]="!ticket.clicked" [class.activated]="ticket.clicked"><ion-avatar padding item-left><li><span item-left>#{{ticket.number}}</span> <img class="img_avatar" [alt]="ticket.user_firstname" [src]="ticket.user_email | Gravatar"><p>{{ticket.user_firstname}} {{ticket.user_lastname}}</p></li></ion-avatar><div class="alignment"><li><h2><ion-icon *ngIf="(ticket.is_new_tech_post && ticket.technician_email != he.email) || (ticket.is_new_user_post && ticket.user_email != he.email)" dark name="mail"></ion-icon>&nbsp;{{ticket.subject | Htmlsafe}}</h2><h3 [innerHTML]="ticket.initial_post | Linebreaks"></h3><p>{{ticket.class_name}}&nbsp;</p></li></div></a><ion-item-options><button (click)="addPost(ticket, slidingItem)" class="grey3 disable-hover button button-default"><ion-icon></ion-icon>Add Response</button> <button (click)="closeTicket(ticket, slidingItem)" class="disable-hover button button-default close-ticket"><ion-icon></ion-icon><p class="close-ticket2">{{ticket.status != \'Closed\' ? "Close" : "ReOpen"}} {{config.current.names.ticket.a}}</p></button></ion-item-options></ion-item-sliding></ion-list><div *ngIf="is_empty" class="table grey2 menu-text">No {{mode[0] | Capitalize}} {{config.current.names.ticket.p}} yet</div><ion-infinite-scroll threshold="30%" (infinite)="doInfinite($event)"><ion-infinite-scroll-content loadingSpinner="circles" loadingText="Loading more data..."></ion-infinite-scroll-content></ion-infinite-scroll></ion-content>',
            directives: [ionic_angular_1.IONIC_DIRECTIVES],
            pipes: [pipes_1.GravatarPipe, pipes_1.LinebreaksPipe, pipes_1.CapitalizePipe, pipes_1.HtmlsafePipe],
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav, ionic_angular_1.NavParams, ionic_angular_1.Config, ticket_provider_1.TicketProvider])
    ], TicketsListComponent);
    return TicketsListComponent;
}());
exports.TicketsListComponent = TicketsListComponent;

},{"../../directives/helpers":15,"../../pages/modals/modals":30,"../../pages/ticket-details/ticket-details":39,"../../pipes/pipes":53,"../../providers/ticket-provider":59,"@angular/core":"@angular/core","ionic-angular":"ionic-angular"}],11:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var core_1 = require('@angular/core');
var todo_provider_1 = require('../../providers/todo-provider');
var todo_create_1 = require('../../pages/todo-create/todo-create');
var helpers_1 = require('../../directives/helpers');
var TodoListComponent = (function () {
    function TodoListComponent(nav, todoProvider, config, navParams) {
        this.nav = nav;
        this.todoProvider = todoProvider;
        this.config = config;
        this.navParams = navParams;
        this.LIMIT = 5000;
        this.is_empty = false;
        this.is_empty_list = true;
        this.undone = 0;
        this.initial_load = true;
        this.is_empty = false;
        this.pager = { page: 0, limit: this.LIMIT };
    }
    TodoListComponent.prototype.ngOnInit = function () {
        this.hidden = this.simple;
        this.is_empty_list = this.simple;
        this.params = this.navParams.data || {};
        this.params.user = { id: this.params.user_id || this.config.current.user.user_id, name: this.params.user_name || "" };
        this.cachename = helpers_1.addp("todos", "assigned_id", this.params.user.id);
        this.cachelen = (this.todoProvider._dataStore[this.cachename] || {}).length;
        if (this.params.is_empty)
            this.params.count = 0;
        this.getTodos();
    };
    TodoListComponent.prototype.getTodos = function () {
        var _this = this;
        this.todoProvider.getTodos(this.params.user.id, this.pager);
        this.todoLists = this.todoProvider.todos$[this.cachename];
        {
            var timer = setTimeout(function () {
                _this.busy = true;
            }, 500);
            setTimeout(function () {
                _this.busy = false;
            }, 3000);
            this.todoLists.subscribe(function (data) {
                clearTimeout(timer);
                _this.busy = false;
                _this.is_empty = !data.length;
                var count = 0, total = 0;
                for (var k in data)
                    for (var l in data[k].sub) {
                        total++;
                        if (!data[k].sub[l].is_completed)
                            count++;
                    }
                ;
                _this.undone = count;
                _this.is_empty_list = _this.simple && !total;
            });
        }
    };
    TodoListComponent.prototype.AddTodo = function (list_id) {
        var myModal = ionic_angular_1.Modal.create(todo_create_1.TodoCreatePage, { "list_id": list_id || "" });
        this.nav.present(myModal);
    };
    TodoListComponent.prototype.setDone = function (todo) {
        this.undone = Math.max(todo.is_completed ? --this.undone : ++this.undone, 0);
        this.todoProvider.setCompletedTodo(todo.id, todo.is_completed);
    };
    TodoListComponent.prototype.setDate = function (date, showmonth, istime) {
        return date ? helpers_1.getDateTime(date, showmonth, istime) : null;
    };
    TodoListComponent.prototype.getFixed = function (value) {
        value = (value || "0").toString();
        if (~value.indexOf("."))
            return Number(value).toFixed(2).toString();
        return value;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], TodoListComponent.prototype, "simple", void 0);
    TodoListComponent = __decorate([
        core_1.Component({
            selector: 'todo-list',
            template: '<div class="todos list general-alignment" [hidden]="is_empty_list"><img *ngIf="busy && !simple" class="imglogo img-padding" src="img/loading2.gif"><div *ngIf="is_empty && !simple" class="table grey2 menu-text">No ToDo\'s yet</div><div *ngIf="simple" class="blue1back alignment-bottom" style="height: 50px;" (click)="hidden = !hidden"><span><ion-icon [ngClass]="{\'ion-ios-arrow-down font18 margin-top3 margin-right10\':!hidden, \'pr8 button-arrow ion-ios-arrow-forward padding-top5\':hidden}" class="left todos-arrow padding-left15 left" role="img"></ion-icon><h5 style="color:white; padding-top: 3px;">ToDo\'s</h5></span> <button fab class="right buttonInvoice email-invoice position-initial margin-right10 general-alignment2">{{undone}}</button></div><block [hidden]="hidden"><template ngFor let-todoList [ngForOf]="todoLists | async" let-even="even" let-odd="odd"><div [ngClass]="{\'grad\': todoList.sub?.length}" (click)="todoList.hidden = !todoList.sub?.length || !todoList.hidden"><ion-icon [style.visibility]="!todoList.sub?.length ?\'hidden\':\'inherit\'" role="img" [ngClass]="{\'ion-ios-arrow-down font18 margin-right10\':!todoList.hidden, \'pr8 button-arrow ion-ios-arrow-forward left\':todoList.hidden}" class="todos-arrow padding-left15"></ion-icon><h5 class="color">{{todoList.name}}</h5><ion-icon (click)="AddTodo(todoList.list_id)" name="md-add" role="img" style="padding-right: 10px;" [ngClass]="{\'\':!todoList.sub?.length, \'color\':!todoList.sub?.length}" class="ion-md-add padding-left15 todos-arrow right" aria-label="arrow down"></ion-icon></div><template [ngIf]="!todoList?.hidden"><template ngFor let-todo [ngForOf]="todoList?.sub" let-last="last" let-even="seven" let-odd="sodd"><div (click)="todo.is_completed = !todo.is_completed;setDone(todo)"><ion-icon [ngClass]="{\'ion-ios-checkmark-circle secondary\' : todo.is_completed, \'ion-ios-radio-button-on grey2\' : !todo.is_completed}" class="font18 todos-padding margin-top3"></ion-icon><h5 [ngClass]="{\'color decoration_line grey3_color\' : todo.is_completed, \'color\' : !todo.is_completed}">{{todo.title}} <i *ngIf="todo.text">{{" - " + todo.text}}</i></h5></div><div class="todos-flex right color"><h6></h6><h6 *ngIf="todo.assigned_name && !simple">{{todo.assigned_name}}</h6><h6 *ngIf="todo.due_date">Due&nbsp;{{setDate(todo.due_date)}}</h6><h6 *ngIf="todo.estimated_remain">{{getFixed(todo.estimated_remain)}}&nbsp;hrs</h6></div><hr *ngIf="!last" class="width_calc100-40"></template></template><hr class="width100"></template></block></div>',
            directives: [ionic_angular_1.IONIC_DIRECTIVES],
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav, todo_provider_1.TodoProvider, ionic_angular_1.Config, ionic_angular_1.NavParams])
    ], TodoListComponent);
    return TodoListComponent;
}());
exports.TodoListComponent = TodoListComponent;

},{"../../directives/helpers":15,"../../pages/todo-create/todo-create":43,"../../providers/todo-provider":61,"@angular/core":"@angular/core","ionic-angular":"ionic-angular"}],12:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var core_1 = require('@angular/core');
var TreeViewComponent = (function () {
    function TreeViewComponent() {
        this.onSelectedChanged = new core_1.EventEmitter();
    }
    TreeViewComponent.prototype.onSelectNode = function (node) {
        this.onSelectedChanged.emit(node);
    };
    TreeViewComponent.prototype.onExpand = function (node) {
        if (!node.sub)
            return;
        node.isExpanded = !node.isExpanded;
    };
    TreeViewComponent.prototype.onRequest = function (parent) {
        console.log("inner request");
        return;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], TreeViewComponent.prototype, "Nodes", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], TreeViewComponent.prototype, "SelectedNode", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], TreeViewComponent.prototype, "onSelectedChanged", void 0);
    TreeViewComponent = __decorate([
        core_1.Component({
            selector: "tree-view",
            template: '<ul class="inner"><li *ngFor="let node of Nodes" class="list-tree"><a detail-none href="#" (click)="onSelectNode(node); onExpand(node)"><span><li class="left icon-class"><ion-icon [hidden]="node != SelectedNode" class="button-arrow margin-top-2" name="checkmark" role="img" aria-label="checkmark"></ion-icon></li>{{node.name}}</span><ion-icon [hidden]="!node.sub" name="ios-arrow-{{node.isExpanded ? \'down\' : \'forward\'}}" role="img" class="button-arrow right" aria-label="arrow"></ion-icon></a><tree-view [Nodes]="node.sub" [SelectedNode]="SelectedNode" (onSelectedChanged)="onSelectNode($event)" *ngIf="node.isExpanded"></tree-view></li></ul>',
            directives: [TreeViewComponent, ionic_angular_1.IONIC_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [])
    ], TreeViewComponent);
    return TreeViewComponent;
}());
exports.TreeViewComponent = TreeViewComponent;

},{"@angular/core":"@angular/core","ionic-angular":"ionic-angular"}],13:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require('./focuser'));

},{"./focuser":14}],14:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var Focuser = (function () {
    function Focuser(renderer, elementRef) {
        this.renderer = renderer;
        this.elementRef = elementRef;
    }
    Focuser.prototype.ngOnInit = function () {
        var _this = this;
        var searchInput = this.elementRef.nativeElement.querySelector('input');
        setTimeout(function () {
            _this.renderer.invokeElementMethod(searchInput, 'setSelectionRange', [0, 999]);
        }, 500);
        setTimeout(function () {
            _this.renderer.invokeElementMethod(searchInput, 'focus', []);
        }, 300);
    };
    Focuser = __decorate([
        core_1.Directive({
            selector: '[focuser]'
        }), 
        __metadata('design:paramtypes', [core_1.Renderer, core_1.ElementRef])
    ], Focuser);
    return Focuser;
}());
exports.Focuser = Focuser;

},{"@angular/core":"@angular/core"}],15:[function(require,module,exports){
"use strict";
var Config = require('../providers/config');
function saveCache(url, data) {
    localStorage.setItem(url, JSON.stringify(data || {}));
}
exports.saveCache = saveCache;
function loadCache(url) {
    return JSON.parse(localStorage.getItem(url));
}
exports.loadCache = loadCache;
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.href);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
exports.getParameterByName = getParameterByName;
function cleanQuerystring(param, value) {
    var url = addp(location.origin + location.pathname, param, value);
    try {
        window.history.replaceState({}, '', url);
    }
    catch (err) { }
}
exports.cleanQuerystring = cleanQuerystring;
function GooglelogOut(mess) {
    var isExtension = false;
    if (!isExtension && !confirm("Do you want to stay logged in Google account?")) {
        var logoutUrl = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=" + Config.MobileSite;
    }
    else
        ;
}
exports.GooglelogOut = GooglelogOut;
function parseXml(xmlStr) {
    if (!xmlStr || xmlStr.length < 9)
        return null;
    if (typeof window.DOMParser != "undefined") {
        return (new window.DOMParser()).parseFromString(xmlStr, "text/xml");
    }
    else if (typeof window.ActiveXObject != "undefined" &&
        new window.ActiveXObject("Microsoft.XMLDOM")) {
        var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(xmlStr);
        return xmlDoc;
    }
    else {
        console.log("No XML parser found");
        return null;
    }
}
exports.parseXml = parseXml;
function addp(url, param, value) {
    if (!url || !value || !param)
        return url;
    var pos = url.indexOf(param + '=');
    if (pos != -1)
        return url.slice(0, pos + param.length) + '=' + value;
    var ch = url.indexOf('?') > 0 ? '&' : '?';
    return url + ch + param + '=' + value;
}
exports.addp = addp;
function fullapplink(site, ticketkey, inst, org) {
    var url = Config.AppSite;
    if (ticketkey)
        url = addp(url, "tkt", ticketkey);
    url = addp(url, "dept", inst);
    url = addp(url, "org", org);
    openURLsystem(url);
}
exports.fullapplink = fullapplink;
function htmlEscape(str) {
    return String(str)
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
exports.htmlEscape = htmlEscape;
function linebreaks(value, args) {
    value = (value || "").trim();
    var is_edit = args;
    if (value.length)
        value = value
            .replace(/&lt;br&gt;/gi, "\n")
            .replace(/<br\s*[\/]?>/gi, "\n")
            .replace(/\r/g, '')
            .replace(/\n\n/g, is_edit ? "\n" : "<br>");
    return value;
}
exports.linebreaks = linebreaks;
exports.FileUrlHelper = {
    isPhonegap: function () { return localStorage.getItem("isPhonegap") === "true"; },
    ReplaceAll: function (note, find, replace) {
        return note.split(find).join(replace);
    },
    checkURL: function (url) {
        if (!url)
            return false;
        return (url.trim().match(/(jpeg|jpg|gif|png|ico)$/i) !== null);
    },
    matchKey: function (search, array) {
        for (var key in array) {
            if (key.indexOf(search) != -1) {
                return key;
            }
        }
        return "";
    },
    addUrls: function (note, files) {
        var length = files.length;
        var filearray = {};
        if (length) {
            var inlineImg = note.match(/\[cid:[^\[\]]*]/g);
            for (var i = 0; i < length; i++) {
                var name = files[i].name;
                note = exports.FileUrlHelper.ReplaceAll(note, " " + name, files[i].is_deleted ? "" : exports.FileUrlHelper.getFileLink(files[i].url, name));
                filearray['"' + name.substring(0, name.lastIndexOf(".")) + '"'] = files[i].url;
            }
            if (inlineImg) {
                for (var j = 0; j < inlineImg.length; j++) {
                    var filename = inlineImg[j].slice(5, -1);
                    if (filename.indexOf("_link_") >= 0) {
                        filename = filename.replace("_link_", "");
                    }
                    else {
                        filename = exports.FileUrlHelper.matchKey(filename.slice(0, -3), filearray);
                        if (filename && typeof (filearray[filename]) !== 'undefined') {
                            filename = filearray[filename];
                        }
                        else
                            filename = "";
                    }
                    if (filename.length)
                        note = exports.FileUrlHelper.ReplaceAll(note, inlineImg[j], exports.FileUrlHelper.getFileLink(filename, inlineImg[j].slice(5, -1)));
                }
            }
            if (length > 1) {
                note = exports.FileUrlHelper.ReplaceAll(note, "a>,", "a>");
            }
            note = exports.FileUrlHelper.ReplaceAll(note, "a>.", "a>");
        }
        return note;
    },
    getFileLink: function (file, name) {
        var img = "";
        if (exports.FileUrlHelper.checkURL(file) || exports.FileUrlHelper.checkURL(name))
            img = "<img class=\"attachment\" src=\"" + file + "\">";
        else
            img = "<ion-icon name=\"md-document\" role=img dark class=\"button_circle ion-md-document\" aria-label=\"md-document\"></ion-icon>&nbsp;<span class=\"decoration width100 color\">" + (name || decodeURIComponent(file.split("/").slice(-1))) + "</span><p></p>";
        return "<p/><a class=\"comment_image_link files-tkts color margin-right_10\"" +
            (exports.FileUrlHelper.isPhonegap() ? (" href=# onclick='window.open(\"" + file + "\", \"_blank\", \"location=no,EnableViewPortScale=yes\")'>" + img + "</a>") :
                (" target=\"_blank\" href=\"" + file + "\">" + img + "</a>"));
    }
};
function openURL(urlString) {
    return window.open(urlString, '_blank', 'location=no,EnableViewPortScale=yes');
}
exports.openURL = openURL;
function openURLsystem(urlString) {
    if (localStorage.getItem("isPhonegap") === "true" && device) {
        if (device.platform.toUpperCase() === 'ANDROID') {
            return navigator.app.loadUrl(urlString, { openExternal: true });
        }
        else if (device.platform.toUpperCase() === 'IOS') {
            return window.open(urlString, '_system');
        }
    }
    return window.open(urlString, '_blank');
}
exports.openURLsystem = openURLsystem;
function symbolEscape(str) {
    return String(str)
        .replace(/&lt;br&gt;/gi, "\n")
        .replace(/<br\s*[\/]?>/gi, "\n")
        .replace(/\n/g, "<p></p>");
}
exports.symbolEscape = symbolEscape;
function getPickerDateTimeFormat(showmonth, istime) {
    var format = "";
    if (!showmonth)
        format = localStorage.getItem("dateformat") !== "1" ? "MM/DD/YYYY" : "DD/MM/YYYY";
    else
        format = localStorage.getItem("dateformat") !== "1" ? "MMM DD / YYYY" : "DD MMM YYYY";
    return format + (istime ? (localStorage.getItem("timeformat") !== "1" ? " hh:mm A" : " HH:mm") : "");
}
exports.getPickerDateTimeFormat = getPickerDateTimeFormat;
function getDateTimeFormat(showmonth, istime) {
    var format = "";
    if (!showmonth)
        format = localStorage.getItem("dateformat") !== "1" ? "m/d/yy" : "d/m/yy";
    else
        format = localStorage.getItem("dateformat") !== "1" ? "mmm d / yyyy" : "d mmm yyyy";
    return format + (istime ? (localStorage.getItem("timeformat") !== "1" ? " hh:MM TT" : " HH:MM") : "");
}
function getDateTime(date, showmonth, istime) {
    return dateFormat(date, getDateTimeFormat(showmonth, istime));
}
exports.getDateTime = getDateTime;
function getCurrency(value) {
    return localStorage.getItem("currency") + Number(value || "0").toFixed(2).toString();
}
exports.getCurrency = getCurrency;
function getFullName(firstname, lastname, email, name) {
    var fname = "";
    if (name)
        fname = name + " ";
    if (lastname)
        fname += lastname + " ";
    if (firstname)
        fname += firstname + " ";
    if (email && email.indexOf("@") > 0) {
        if (!fname.trim())
            fname = email;
        else if (name)
            fname += " (" + email + ")";
    }
    return fname || "NoName";
}
exports.getFullName = getFullName;
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}
exports.toTitleCase = toTitleCase;
function getappTrackConversion(id) {
    var r = document.referrer;
    var h = window.location.href;
    var p = '1';
    var e = id || '';
    var listing_id = '102459';
    var a = document.createElement('script');
    a.type = 'text/javascript';
    a.async = true;
    a.src = 'https://www.getapp.com/conversion/' + encodeURIComponent(listing_id) +
        '/r.js?p=' + encodeURIComponent(p) + '&h=' + encodeURIComponent(h) +
        '&r=' + encodeURIComponent(r) + '&e=' + encodeURIComponent(e);
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(a, s);
}
exports.getappTrackConversion = getappTrackConversion;
function spicePixelTrackConversion() {
    var img = new Image();
    var div = document.getElementsByTagName('body')[0];
    img.onload = function () {
        div.appendChild(img);
    };
    img.src = 'http://px.spiceworks.com/px/8oxz';
    var SWPX = SWPX || {};
    SWPX.cmd = SWPX.cmd || [];
    SWPX.cmd.push(function () {
        SWPX.pixel.setPixel('8oxz');
        SWPX.pixel.setIdentifier('121806');
        SWPX.pixel.fire();
    });
}
exports.spicePixelTrackConversion = spicePixelTrackConversion;
var dateFormat = function (date, mask, utc) {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g, timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g, timezoneClip = /[^-+\dA-Z]/g, pad = function (val, len) {
        val = String(val);
        len = len || 2;
        while (val.length < len)
            val = "0" + val;
        return val;
    };
    return function (date, mask, utc) {
        var dF = dateFormat;
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }
        date = date ? new Date(date) : new Date;
        if (isNaN(date))
            throw SyntaxError("invalid date");
        mask = String(dF.masks[mask] || mask || dF.masks["default"]);
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }
        var _ = utc ? "getUTC" : "get", d = date[_ + "Date"](), D = date[_ + "Day"](), m = date[_ + "Month"](), y = date[_ + "FullYear"](), H = date[_ + "Hours"](), M = date[_ + "Minutes"](), s = date[_ + "Seconds"](), L = date[_ + "Milliseconds"](), o = utc ? 0 : date.getTimezoneOffset(), flags = {
            d: d,
            dd: pad(d),
            ddd: dF.i18n.dayNames[D],
            dddd: dF.i18n.dayNames[D + 7],
            m: m + 1,
            mm: pad(m + 1),
            mmm: dF.i18n.monthNames[m],
            mmmm: dF.i18n.monthNames[m + 12],
            yy: String(y).slice(2),
            yyyy: y,
            h: H % 12 || 12,
            hh: pad(H % 12 || 12),
            H: H,
            HH: pad(H),
            M: M,
            MM: pad(M),
            s: s,
            ss: pad(s),
            l: pad(L, 3),
            L: pad(L > 99 ? Math.round(L / 10) : L),
            t: H < 12 ? "a" : "p",
            tt: H < 12 ? "am" : "pm",
            T: H < 12 ? "A" : "P",
            TT: H < 12 ? "AM" : "PM",
            Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
            o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
            S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : Number(d % 100 - d % 10 != 10) * d % 10]
        };
        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();
dateFormat.masks = {
    "default": "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

},{"../providers/config":55}],16:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var data_provider_1 = require('../../providers/data-provider');
var invoices_1 = require('../invoices/invoices');
var timelogs_1 = require('../timelogs/timelogs');
var expenses_1 = require('../expenses/expenses');
var helpers_1 = require('../../directives/helpers');
var tickets_list_1 = require('../../components/tickets-list/tickets-list');
var action_button_1 = require('../../components/action-button/action-button');
var pipes_1 = require('../../pipes/pipes');
var AccountDetailsPage = (function () {
    function AccountDetailsPage(nav, navParams, dataProvider, config, view) {
        this.nav = nav;
        this.navParams = navParams;
        this.dataProvider = dataProvider;
        this.config = config;
        this.view = view;
        this.is_editnote = true;
        this.is_ready = false;
        this.details_tab = "Stat";
        this.pages = [invoices_1.InvoicesPage, expenses_1.ExpensesPage, timelogs_1.TimelogsPage];
    }
    AccountDetailsPage.prototype.onPageLoaded = function () {
        this.account = this.navParams.data || {};
        this.details_tab = "Stat";
        this.tabsTicket = "Open";
    };
    AccountDetailsPage.prototype.onPageWillEnter = function () {
        var _this = this;
        this.view.setBackButtonText('');
        this.dataProvider.getAccountDetails(this.account.id).subscribe(function (data) {
            _this.account = data;
            _this.is_editnote = !(_this.account.note || "").length;
            _this.is_ready = true;
        }, function (error) {
            console.log(error || 'Server error');
        });
    };
    AccountDetailsPage.prototype.saveNote = function (form) {
        var _this = this;
        var note = (form.value || "").trim();
        if (note != (this.account.note || "").trim()) {
            this.dataProvider.addAccountNote(this.account.id, note).subscribe(function (data) { return _this.saveNoteSuccess(note); }, function (error) {
                console.log(error || 'Server error');
            });
        }
        else
            this.saveNoteSuccess(note);
    };
    AccountDetailsPage.prototype.saveNoteSuccess = function (note) {
        this.nav.alert('Note saved :)');
        this.account.note = (note || "").trim();
        this.is_editnote = !this.account.note.length;
    };
    AccountDetailsPage.prototype.onDelete = function (file) {
        var _this = this;
        var data = {
            "file_id": file.id
        };
        this.dataProvider.deleteFile(data).subscribe(function (data) {
            _this.account.files = _this.account.files.filter(function (item) { return item !== file; });
            _this.nav.alert("File " + file.name + " deleted!");
        }, function (error) {
            console.log(error || 'Server error');
        });
    };
    AccountDetailsPage.prototype.openPage = function (page, count) {
        var _this = this;
        setTimeout(function () {
            return _this.nav.push(_this.pages[page], { "is_empty": !count, "account_id": _this.account.id || "-1", "account_name": _this.account.name });
        }, this.is_ready ? 0 : 2000);
    };
    AccountDetailsPage.prototype.getFileLink = function (file) {
        return helpers_1.FileUrlHelper.getFileLink(file.url, file.name);
    };
    AccountDetailsPage = __decorate([
        ionic_angular_1.Page({
            template: '<ion-navbar *navbar><button menuToggle><ion-icon name="menu"></ion-icon></button><ion-title class="padding-right24">{{account.name}}</ion-title></ion-navbar><ion-content class="account-details"><ion-segment [(ngModel)]="details_tab"><ion-segment-button value="Stat">{{config.current.names.account.a}} Stat</ion-segment-button><ion-segment-button value="Info">Info</ion-segment-button><ion-segment-button *ngIf="config.current.is_project_tracking" value="Projects">Projects</ion-segment-button><ion-segment-button value="Notes">Notes</ion-segment-button><ion-segment-button value="Files">Files</ion-segment-button></ion-segment><div [ngSwitch]="details_tab"><div [hidden]="details_tab != \'Stat\'"><ion-list class="list img-top" no-lines><div class="blue1 left width65 img-top"><a detail-none href="#tickets" ion-item class="textLogin">Open {{config.current.names.ticket.ap}}</a> <a *ngIf="config.current.is_invoice && config.current.is_time_tracking" detail-none href="#" ion-item (click)="openPage(0,account.account_statistics.invoices)" class="textLogin">Invoices</a> <a *ngIf="config.current.is_expenses" detail-none href="#" ion-item (click)="openPage(1, account.account_statistics.expenses)" class="textLogin">Expenses</a> <a *ngIf="config.current.is_time_tracking" detail-none href="#" ion-item (click)="openPage(2, account.account_statistics.hours)" class="textLogin">Hours</a></div><div class="right width35 img-top"><a detail-none href="#tickets" ion-item class="blue2">{{account.account_statistics.ticket_counts.open || 0}}</a> <a *ngIf="config.current.is_invoice && config.current.is_time_tracking" detail-none href="#" ion-item (click)="openPage(0,account.account_statistics.invoices)" class="blue2">{{account.account_statistics.invoices || 0}}</a> <a *ngIf="config.current.is_expenses" detail-none href="#" ion-item (click)="openPage(1, account.account_statistics.expenses)" class="blue2" [innerHTML]="account.account_statistics.expenses | More:[10000,\'<div class=item-inner><div class=input-wrapper><ion-label>$VV</ion-label></div></div><ion-button-effect></ion-button-effect>\']"></a> <a *ngIf="config.current.is_time_tracking" detail-none href="#" ion-item (click)="openPage(2, account.account_statistics.hours)" class="blue2" [innerHTML]="account.account_statistics.hours | More:[10000,\'<div class=item-inner><div class=input-wrapper><ion-label>VV</ion-label></div></div><ion-button-effect></ion-button-effect>\']"></a></div></ion-list><ion-item></ion-item><ion-item class="margin" id="tickets"><div class="list"><ion-segment [(ngModel)]="tabsTicket" class="height32"><ion-segment-button class="button-open" value="Open">Open {{config.current.names.ticket.ap}}</ion-segment-button><ion-segment-button class="button-open" value="Close">Closed {{config.current.names.ticket.ap}}</ion-segment-button></ion-segment></div></ion-item><br><tickets-list [hidden]="tabsTicket != \'Open\'" [mode]="[\'open\', account.id]" [count]="account.account_statistics.ticket_counts.open"></tickets-list><tickets-list [hidden]="tabsTicket != \'Close\'" preload="1500" [mode]="[\'closed\', account.id]" [count]="account.account_statistics.ticket_counts.closed"></tickets-list></div><ion-list class="list margin-top21" no-lines *ngSwitchWhen="\'Info\'"><ion-item class="margin color"><h3 class="left width35 text-left">BWD Acct#</h3><h3 class="right width50 tkts-table">{{account.bwd_number}}</h3></ion-item><ion-item class="margin color"><h3 class="left width35 text-left">Acc#</h3><h3 class="right width50 tkts-table">{{account.number}}</h3></ion-item><ion-item class="margin color"><h3 class="left width35 text-left">Ref1#</h3><h3 class="right width50 tkts-table">{{account.ref1}}</h3></ion-item><ion-item class="margin color"><h3 class="left width35 text-left">Ref2#</h3><h3 class="right width50 tkts-table">{{account.ref2}}</h3></ion-item><ion-item class="margin color"><h3 class="left width35 text-left">Org/Indiv</h3><h3 class="right width50 tkts-table">{{account.is_organization ? "Organization" : "Individual"}}</h3></ion-item><ion-item class="margin color"><h3 class="left width35 text-left">Acc Rep</h3><h3 class="right width50 tkts-table">{{account.representative_name}}</h3></ion-item><ion-item class="margin color"><h3 class="left width35 text-left space-initial">Internal location</h3><h3 class="right width50 tkts-table">{{account.internal_location_name}}</h3></ion-item><ion-item class="margin color"><h3 class="left width35 text-left">Email Suffix</h3><h3 class="right width50 tkts-table">{{account.email_suffix}}</h3></ion-item><ion-item class="margin color"><h3 class="left width35 text-left">Address 1</h3><h3 class="right width50 tkts-table">{{account.address1}}</h3></ion-item><ion-item class="margin color"><h3 class="left width35 text-left">Address 2</h3><h3 class="right width50 tkts-table">{{account.address2}}</h3></ion-item><ion-item class="margin color"><h3 class="left width35 text-left">City</h3><h3 class="right width50 tkts-table">{{account.city}}</h3></ion-item><ion-item class="margin color"><h3 class="left width35 text-left">Postal Code</h3><h3 class="right width50 tkts-table">{{account.zipcode}}</h3></ion-item><ion-item class="margin color"><h3 class="left width35 text-left">Country</h3><h3 class="right width50 tkts-table">{{account.country}}</h3></ion-item><ion-item class="margin color"><h3 class="left width35 text-left">Phone 1</h3><h3 class="right width50 tkts-table">{{account.phone1}}</h3></ion-item><ion-item class="margin color"><h3 class="left width35 text-left">Phone 2</h3><h3 class="right width50 tkts-table">{{account.phone2}}</h3></ion-item><ion-item class="color" *ngFor="let customfield of account.customfields"><h3 class="left width35 text-left">{{customfield.Key}}</h3><h3 class="right width50 tkts-table">{{customfield.Value || \'&nbsp;\'}}</h3></ion-item></ion-list><ion-list class="list margin-top21" *ngSwitchWhen="\'Projects\'"><div [hidden]="account.projects?.length" class="table grey2 menu-text">No Projects yet</div><ion-item *ngIf="account.projects?.length" no-lines class="margin color"><p class="text width30 text-left left"></p><p class="width17 right table table_account">Open</p><p class="width17 right table table_account">Logged</p><p class="width17 right table table_account">Remain</p><p class="width19 right table table_account">Complete</p></ion-item><ion-item class="color margin" *ngFor="let project of account.projects"><p class="text color width30 left table_account text-left">{{project.name}}</p><h3 class="width17 left table">{{project.open_tickets}}</h3><h3 class="width17 left table">{{project.logged_hours}}</h3><h3 class="width17 left table">{{project.remaining_hours}}</h3><h3 class="width19 right table">{{project.complete}}%</h3></ion-item></ion-list><ion-list class="list general-alignment max-width700" [hidden]="details_tab != \'Notes\'"><div [hidden]="is_editnote" class="width100 textLogin note-account commentText" [innerHTML]="account?.note" type="text" (click)="is_editnote = true"></div><button [hidden]="is_editnote" secondary class="button_reply img-top right" (click)="is_editnote = true">Edit Notes</button> <textarea autofocus [hidden]="!is_editnote" [ngModel]="account?.note" class="glow width100 textLogin commentText" #notetext type="text" placeholder="Notes:"></textarea> <button [hidden]="!is_editnote" secondary class="button_reply img-top right" (click)="saveNote(notetext)">{{account?.note?.length ? \'Save\' : \'Add\'}} Notes</button></ion-list><ion-list class="list margin-top21" no-lines *ngSwitchWhen="\'Files\'"><div [hidden]="account.files?.length" class="table grey2 menu-text">No Files yet</div><ion-item *ngFor="let file of account.files"><div class="left width59 tkts-table" [innerHTML]="getFileLink(file)"></div><div class="files-tkts"><span class="color right text-left space-initial flex1 font-size_span">{{file.name}}</span></div></ion-item></ion-list></div></ion-content><action-button [hidden]="details_tab != \'Stat\'" [data]="{\'account\': { id: account.id, name: account.name}}"></action-button>',
            directives: [tickets_list_1.TicketsListComponent, action_button_1.ActionButtonComponent],
            pipes: [pipes_1.MorePipe],
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav, ionic_angular_1.NavParams, data_provider_1.DataProvider, ionic_angular_1.Config, ionic_angular_1.ViewController])
    ], AccountDetailsPage);
    return AccountDetailsPage;
}());
exports.AccountDetailsPage = AccountDetailsPage;

},{"../../components/action-button/action-button":3,"../../components/tickets-list/tickets-list":10,"../../directives/helpers":15,"../../pipes/pipes":53,"../../providers/data-provider":56,"../expenses/expenses":21,"../invoices/invoices":23,"../timelogs/timelogs":42,"ionic-angular":"ionic-angular"}],17:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var data_provider_1 = require('../../providers/data-provider');
var components_1 = require('../../components/components');
var AccountsPage = (function () {
    function AccountsPage(nav, config, dataProvider) {
        this.nav = nav;
        this.config = config;
        this.dataProvider = dataProvider;
        this.LIMIT = 500;
    }
    AccountsPage.prototype.onPageLoaded = function () {
        var _this = this;
        this.pager = { page: 0, limit: this.LIMIT };
        var timer = setTimeout(function () {
            _this.busy = true;
        }, 500);
        this.getItems(null, timer);
    };
    AccountsPage.prototype.getItems = function (infiniteScroll, timer) {
        var _this = this;
        this.dataProvider.getAccountList(false, this.pager, true, true).subscribe(function (data) {
            if (timer) {
                clearTimeout(timer);
                _this.busy = false;
                _this.accounts = data;
            }
            else {
                (_a = _this.accounts).push.apply(_a, data);
                _this.config.current.stat.accounts += data.length;
            }
            if (infiniteScroll) {
                infiniteScroll.enable(data.length == _this.LIMIT);
                infiniteScroll.complete();
            }
            _this.count = data.length;
            var _a;
        }, function (error) {
            if (timer) {
                clearTimeout(timer);
                _this.busy = false;
            }
            console.log(error || 'Server error');
        });
    };
    AccountsPage.prototype.doInfinite = function (infiniteScroll) {
        if (this.count < this.LIMIT) {
            infiniteScroll.enable(false);
            infiniteScroll.complete();
            return;
        }
        this.pager.page += 1;
        this.getItems(infiniteScroll, null);
    };
    AccountsPage = __decorate([
        ionic_angular_1.Page({
            template: '<ion-navbar *navbar><button menuToggle><ion-icon name="menu"></ion-icon></button><ion-title>{{config.current.names.account.p}}</ion-title></ion-navbar><ion-content class="accounts"><p class="general-alignment"></p><img *ngIf="busy" class="imglogo img-padding" src="img/loading2.gif"><accounts-list margin-top [simple]="true" [accounts]="accounts"></accounts-list><ion-infinite-scroll (infinite)="doInfinite($event)" threshold="30%"><ion-infinite-scroll-content loadingSpinner="circles" loadingText="Loading more data..."></ion-infinite-scroll-content></ion-infinite-scroll></ion-content><action-button></action-button>',
            directives: [components_1.AccountsListComponent, components_1.ActionButtonComponent],
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav, ionic_angular_1.Config, data_provider_1.DataProvider])
    ], AccountsPage);
    return AccountsPage;
}());
exports.AccountsPage = AccountsPage;

},{"../../components/components":5,"../../providers/data-provider":56,"ionic-angular":"ionic-angular"}],18:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var providers_1 = require('../../providers/providers');
var helpers_1 = require('../../directives/helpers');
var ticket_details_1 = require('../ticket-details/ticket-details');
var directives_1 = require('../../directives/directives');
var AjaxSearchPage = (function () {
    function AjaxSearchPage(nav, navParams, config, apiData, ticketProvider) {
        this.nav = nav;
        this.navParams = navParams;
        this.config = config;
        this.apiData = apiData;
        this.ticketProvider = ticketProvider;
        this.data = [];
        this.items = [];
        this.is_empty = false;
    }
    AjaxSearchPage.prototype.ngOnInit = function () {
        var _this = this;
        this.term = this.navParams.data.search || "";
        this.pager = { limit: 20 };
        if (this.ticketProvider._dataStore.all.length)
            this.data = this.ticketProvider._dataStore.all;
        else if (this.ticketProvider._dataStore.tech.length)
            this.data = this.ticketProvider._dataStore.tech;
        else if (this.ticketProvider._dataStore.user.length)
            this.data = this.ticketProvider._dataStore.user;
        var q = this.term.toLowerCase();
        if (this.data.length && q.length < 4) {
            this.items = this.data.filter(function (v) { return _this.searchCriteria(v, q); });
        }
        this.count = this.items.length;
        if (q.length > 3) {
            var timer = setTimeout(function () {
                _this.is_empty = true;
                _this.busy = true;
            }, 500);
            this.getItems(q, timer);
        }
        else
            this.is_empty = !this.items.length;
    };
    AjaxSearchPage.prototype.dismiss = function (ticket) {
        this.nav.push(ticket_details_1.TicketDetailsPage, ticket);
    };
    AjaxSearchPage.prototype.searchCriteria = function (ticket, term) {
        return ticket.number.toString().indexOf(term) > -1
            || ticket.subject.toLowerCase().indexOf(term) > -1
            || ticket.initial_post.toLowerCase().indexOf(term) > -1
            || ticket.user_firstname.toLowerCase().indexOf(term) > -1
            || ticket.user_lastname.toLowerCase().indexOf(term) > -1
            || ticket.location_name.toLowerCase().indexOf(term) > -1
            || ticket.class_name.toLowerCase().indexOf(term) > -1;
    };
    AjaxSearchPage.prototype.searchItems = function (searchbar) {
        var _this = this;
        this.items = this.data;
        var q = searchbar.value;
        if (q.trim() == '' || this.busy) {
            if (q.trim() == '')
                this.is_empty = !this.items.length;
            return;
        }
        if (q.length < 4) {
            this.items = this.data.filter(function (v) { return _this.searchCriteria(v, q); });
            this.is_empty = !this.items.length;
        }
        else {
            var timer = setTimeout(function () { _this.busy = true; }, 500);
            this.getItems(q, timer);
        }
    };
    AjaxSearchPage.prototype.getItems = function (term, timer) {
        var _this = this;
        this.items = [];
        this.url = "tickets?query=all";
        this.apiData.getPaged(helpers_1.addp(this.url, "search", term + "*"), this.pager).subscribe(function (data) {
            if (timer) {
                clearTimeout(timer);
                _this.busy = false;
            }
            _this.is_empty = !data.length;
            if (!term) {
                _this.items = _this.data = data;
            }
            else
                _this.items = data;
            _this.count = data.length;
        }, function (error) {
            if (timer) {
                clearTimeout(timer);
                _this.busy = false;
            }
            console.log(error || 'Server error');
        });
    };
    AjaxSearchPage = __decorate([
        ionic_angular_1.Page({
            template: '<ion-navbar *navbar><button menuToggle><ion-icon name="menu"></ion-icon></button><ion-title class="padding-right24">Search {{config.current.names.ticket.p}}</ion-title></ion-navbar><ion-content><ion-searchbar [focuser] debounce="400" [(ngModel)]="term" (input)="searchItems($event)" placeholder="Search {{config.current.names.ticket.p}} (min 4 chars)" hideCancelButton="true"></ion-searchbar><img *ngIf="busy" class="imglogo img-padding" src="img/loading2.gif"><ion-list class="ajax"><a detail-none href="#" ion-item *ngFor="let item of items" (click)="dismiss(item)"><h2>#{{item.number}} - {{item.subject}} ({{item.user_firstname}} {{item.user_lastname}})</h2></a></ion-list><div *ngIf="is_empty" class="table grey2 search-text">No {{config.current.names.ticket.p}} found yet</div></ion-content>',
            directives: [directives_1.Focuser],
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav, ionic_angular_1.NavParams, ionic_angular_1.Config, providers_1.ApiData, providers_1.TicketProvider])
    ], AjaxSearchPage);
    return AjaxSearchPage;
}());
exports.AjaxSearchPage = AjaxSearchPage;

},{"../../directives/directives":13,"../../directives/helpers":15,"../../providers/providers":58,"../ticket-details/ticket-details":39,"ionic-angular":"ionic-angular"}],19:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var providers_1 = require('../../providers/providers');
var directives_1 = require('../../directives/directives');
var components_1 = require('../../components/components');
var tickets_1 = require('../tickets/tickets');
var account_details_1 = require('../account-details/account-details');
var ticket_details_1 = require('../ticket-details/ticket-details');
var ajax_search_1 = require('../ajax-search/ajax-search');
var pipes_1 = require('../../pipes/pipes');
var helpers_1 = require('../../directives/helpers');
var DashboardPage = (function () {
    function DashboardPage(nav, config, apiData, dataProvider, ticketProvider, timeProvider) {
        var _this = this;
        this.nav = nav;
        this.config = config;
        this.apiData = apiData;
        this.dataProvider = dataProvider;
        this.ticketProvider = ticketProvider;
        this.timeProvider = timeProvider;
        this.counts = { open_as_tech: 0 };
        this.accounts = [];
        this.queues = [];
        this.term = '';
        this.simple = false;
        var counts = config.getStat("tickets");
        if (counts == -1 && config.current.is_online) {
            this.downloadTimer = setInterval(function () { _this.counts.open_as_tech = ++_this.counts.open_as_tech; }, 800);
        }
        else {
            if (config.current.user.is_limit_assigned_tkts && !config.current.user.is_admin)
                counts.open_all = Math.max(counts.open_as_user, counts.open_as_tech);
            this.counts = this.counts || counts;
        }
    }
    DashboardPage.prototype.onPageLoaded = function () {
        var _this = this;
        this.simple = !this.config.current.is_time_tracking && !this.config.current.is_expenses;
        this.ticketProvider.getTicketsCounts();
        this.ticketProvider.tickets$["tickets/counts"].subscribe(function (data) {
            if (_this.config.current.user.is_limit_assigned_tkts && !_this.config.current.user.is_admin)
                data.open_all = Math.max(data.open_as_user, data.open_as_tech);
            clearInterval(_this.downloadTimer);
            _this.counts = data;
            _this.config.setStat("tickets", {
                "all": data.open_all,
                "tech": data.open_as_tech,
                "alt": data.open_as_alttech,
                "user": data.open_as_user
            });
            setTimeout(function () { _this.saveCache(); }, 1000);
        }, function (error) {
            clearInterval(_this.downloadTimer);
            console.log(error || 'Server error');
        });
        if (this.config.current.is_unassigned_queue) {
            this.queues = this.config.getCache("dashqueues");
            this.dataProvider.getQueueList(3).subscribe(function (data) {
                _this.queues = data;
                _this.config.setCache("dashqueues", data);
            }, function (error) {
                console.log(error || 'Server error');
            });
        }
        if (this.config.current.is_account_manager) {
            this.accounts = this.config.getCache("dashaccounts");
            var accountslen = 500;
            var pager = { limit: ~accountslen ? accountslen : 500 };
            if (!this.accounts || this.accounts.length == 0)
                this.dataProvider.getAccountList(true, pager, true, true).subscribe(function (data) {
                    _this.accounts = data;
                    _this.config.setStat("accounts", data.length);
                    if (_this.simple)
                        _this.config.setCache("dashaccounts", data);
                }, function (error) {
                    console.log(error || 'Server error');
                });
            if (!this.simple)
                this.dataProvider.getAccountList(true, pager).subscribe(function (data) {
                    _this.accounts = data;
                    _this.config.setCache("dashaccounts", data);
                }, function (error) {
                    console.log(error || 'Server error');
                });
        }
        if (!this.ticketProvider._dataStore.tech.length) {
            this.ticketProvider.getTicketsList("tech", "", { "limit": 6 });
        }
        this.timer = setTimeout(function () {
            if (!_this.ticketProvider._dataStore.user.length) {
                _this.ticketProvider.getTicketsList("user", "", { "limit": 6 });
            }
            if (_this.config.current.is_time_tracking && !(_this.timeProvider._dataStore["time"] || {}).length)
                _this.timeProvider.getTimelogs("", { "limit": 25 });
        }, 2500);
    };
    DashboardPage.prototype.onPageDidEnter = function () {
        this.term = "";
    };
    DashboardPage.prototype.saveCache = function () {
        var el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
        var content = el.closest('ion-nav');
        if (content) {
            window.dash = content.innerHTML.replace(/\s\s+/g, ' ');
        }
    };
    DashboardPage.prototype.ngOnDestroy = function () {
        clearTimeout(this.timer);
    };
    DashboardPage.prototype.searchItems = function (searchbar) {
        var _this = this;
        this.search_results = [];
        var q = searchbar.value;
        if (q.trim() == '' || this.busy) {
            return;
        }
        if (q.length > 1) {
            var timer = setTimeout(function () { _this.busy = true; }, 500);
            this.getItems(q, timer);
        }
    };
    DashboardPage.prototype.getItems = function (term, timer) {
        var _this = this;
        this.search_results = [];
        var url = "tickets?query=all";
        var pager = { limit: 3 };
        var is_ticket = term[term.length - 1] == " " || term[term.length - 1] == ",";
        if (!is_ticket)
            term += "*";
        else
            url = "tickets/" + term.trim() + ",";
        this.apiData.getPaged(helpers_1.addp(url, "search", term), pager).subscribe(function (data) {
            if (timer) {
                clearTimeout(timer);
                _this.busy = false;
            }
            _this.search_results = data;
        }, function (error) {
            if (timer) {
                clearTimeout(timer);
                _this.busy = false;
            }
            console.log(error || 'Server error');
        });
    };
    DashboardPage.prototype.gotoTicket = function (ticket, searchBar) {
        this.test = false;
        this.clearSearch();
        this.nav.push(ticket_details_1.TicketDetailsPage, ticket);
    };
    DashboardPage.prototype.clearSearch = function (searchbar) {
        this.search_results = [];
        this.busy = false;
        if (searchbar)
            searchbar.value = "";
    };
    DashboardPage.prototype.getSearch = function (searchbar) {
        this.test = false;
        this.clearSearch();
        var term = searchbar.target.value;
        if (term.length < 4)
            term += "    ";
        var list = { search: term };
        this.test = false;
        this.nav.push(ajax_search_1.AjaxSearchPage, list);
    };
    DashboardPage.prototype.itemTappedTL = function (tab) {
        if (this.config.current.user.is_limit_assigned_tkts && tab.tab == 'all') {
            this.nav.alert("Please contact Administator to obtain permission to view All Tickets", true);
        }
        this.nav.setRoot(tickets_1.TicketsPage, tab);
    };
    DashboardPage.prototype.itemTappedAD = function () { this.nav.setRoot(account_details_1.AccountDetailsPage); };
    DashboardPage = __decorate([
        ionic_angular_1.Page({
            template: '<ion-navbar *navbar><ion-buttons start><button menuToggle><ion-icon name="menu"></ion-icon></button></ion-buttons><ion-title>Dashboard</ion-title><ion-buttons end><button danger class="right transparent" (click)="test = !test"><ion-icon name="ios-search"></ion-icon></button></ion-buttons></ion-navbar><ion-content class="dashboard"><ion-searchbar *ngIf="test" [focuser] debounce="700" (cancel)="test = !test" (input)="searchItems($event)" [(ngModel)]="term" placeholder="{{config.current.names.ticket.s}} number (2 chars) or Enter to search" (search)="getSearch($event)"></ion-searchbar><img *ngIf="busy" class="imglogo" src="img/loading2.gif"><ion-list class="ajax" [hidden]="!search_results"><a detail-none href="#" ion-item *ngFor="let item of search_results" (click)="gotoTicket(item)"><h2>{{item.status}} | #{{item.number}} - {{item.subject}} ({{item.user_firstname}} {{item.user_lastname}})</h2></a></ion-list><ion-list class="list height" no-lines margin-top><div class="width50 left blue3 decoration_none"><a detail-none href="#" (click)="itemTappedTL({tab:\'tech\', count: counts.open_as_tech})" ion-item class="mainStat itemTech">{{counts.open_as_tech}}</a> <a detail-none href="#" (click)="itemTappedTL({tab:\'tech\', count: counts.open_as_tech})" ion-item class="itemTech">As {{config.current.names.tech.a}}</a></div><div class="width17 right blue3"><a detail-none href="#" ion-item (click)="itemTappedTL({tab:\'user\', count: counts.open_as_user})" class="itemTech" [innerHTML]="counts.open_as_user | More:[100,\'<div class=item-inner><div class=input-wrapper><ion-label>VV</ion-label></div></div><ion-button-effect></ion-button-effect>\']"></a> <a detail-none href="#" ion-item (click)="itemTappedTL({tab:\'alt\', count: counts.open_as_alttech})" class="itemTech" [innerHTML]="counts.open_as_alttech | More:[100,\'<div class=item-inner><div class=input-wrapper><ion-label>VV</ion-label></div></div><ion-button-effect></ion-button-effect>\']"></a> <a detail-none href="#" ion-item (click)="itemTappedTL({tab:\'all\', count: counts.open_all})" class="itemTech" [innerHTML]="counts.open_all | More:[100,\'<div class=item-inner><div class=input-wrapper><ion-label>VV</ion-label></div></div><ion-button-effect></ion-button-effect>\']"></a></div><div class="width33 right blue3 dashborder"><a detail-none href="#" ion-item (click)="itemTappedTL({tab:\'user\', count: counts.open_as_user})" class="itemTech dashboardRight dashboard font-size1 tkts-table">As {{config.current.names.user.a}}</a> <a detail-none href="#" ion-item (click)="itemTappedTL({tab:\'alt\', count: counts.open_as_alttech})" class="itemTech dashboardRight dashboard font-size1 tkts-table">Alt {{config.current.names.tech.a}}</a> <a detail-none href="#" ion-item (click)="itemTappedTL({tab:\'all\', count: counts.open_all})" class="itemTech dashboardRight dashboard font-size1 tkts-table">All Open</a></div><br></ion-list><br><todo-list margin-top *ngIf="config.current.is_todos" [simple]="true"></todo-list><queues-list margin-top class="container_list" *ngIf="config.current.is_unassigned_queue" [queues]="queues"></queues-list><accounts-list margin-top class="container_list" *ngIf="config.current.is_account_manager" [simple]="simple" [accounts]="accounts"></accounts-list><span class="span-block"></span></ion-content><action-button></action-button>',
            directives: [components_1.QueuesListComponent, components_1.AccountsListComponent, components_1.ActionButtonComponent, components_1.TodoListComponent, directives_1.Focuser],
            pipes: [pipes_1.MorePipe],
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav, ionic_angular_1.Config, providers_1.ApiData, providers_1.DataProvider, providers_1.TicketProvider, providers_1.TimeProvider])
    ], DashboardPage);
    return DashboardPage;
}());
exports.DashboardPage = DashboardPage;

},{"../../components/components":5,"../../directives/directives":13,"../../directives/helpers":15,"../../pipes/pipes":53,"../../providers/providers":58,"../account-details/account-details":16,"../ajax-search/ajax-search":18,"../ticket-details/ticket-details":39,"../tickets/tickets":40,"ionic-angular":"ionic-angular"}],20:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var core_1 = require('@angular/core');
var helpers_1 = require('../../directives/helpers');
var api_data_1 = require('../../providers/api-data');
var class_list_1 = require('../../components/class-list/class-list');
var select_list_1 = require('../../components/select-list/select-list');
var ExpenseCreatePage = (function () {
    function ExpenseCreatePage(nav, navParams, apiData, config, view) {
        this.nav = nav;
        this.navParams = navParams;
        this.apiData = apiData;
        this.config = config;
        this.view = view;
    }
    ExpenseCreatePage.prototype.ngOnInit = function () {
        this.expense = this.navParams.data || {};
        var name = (this.expense.user_name + " " + this.expense.user_email).trim().split(' ')[0];
        if (this.expense.expense_id) {
            this.title = ("Expense by " + name + " on\u00A0") + this.setDate(this.expense.date, false, true);
            this.expense.note = helpers_1.linebreaks(this.expense.note, true);
            this.expense.note_internal = helpers_1.linebreaks(this.expense.note_internal, true);
        }
        else if (this.expense.number)
            this.title = "Add Expense to\u00A0#" + this.expense.number + " " + this.expense.subject;
        else
            this.title = "Create Expense";
        this.expense.amount = this.getFixed(this.expense.amount);
        this.isbillable = typeof this.expense.billable === 'undefined' ? true : this.expense.billable;
        this.he = this.config.getCurrent("user");
        var recent = {};
        if (!this.expense.number && !this.expense.expense_id && !this.expense.account) {
            recent = this.config.current.recent || {};
        }
        var account_id = (this.expense.account || {}).id || this.expense.account_id || (recent.account || {}).selected || this.he.account_id || -1;
        var project_id = (this.expense.project || {}).id || this.expense.project_id || (recent.project || {}).selected || 0;
        this.selects = {
            "account": {
                name: "Account",
                value: this.expense.account_name || (this.expense.account || {}).name || (recent.account || {}).value || this.he.account_name,
                selected: account_id,
                url: "accounts?is_with_statistics=false",
                hidden: false
            },
            "project": {
                name: "Project",
                value: this.expense.project_name || (recent.project || {}).value || "Default",
                selected: project_id,
                url: "projects?account=" + account_id + "&is_with_statistics=false",
                hidden: false
            },
        };
    };
    ExpenseCreatePage.prototype.saveSelect = function (event) {
        var name = event.type;
        var account_id = this.selects.account.selected;
        switch (name) {
            case "account":
                if (this.selects.account.selected === event.id) {
                    break;
                }
                this.selects.project.url = "projects?account=" + event.id + "&is_with_statistics=false";
                this.selects.project.value = "Default";
                this.selects.project.selected = 0;
                account_id = event.id;
                this.selects.project.hidden = false;
                break;
        }
        this.selects[name].selected = event.id;
        this.selects[name].value = event.name;
    };
    ExpenseCreatePage.prototype.onSubmit = function (form) {
        var _this = this;
        if (form.valid) {
            if (this.expense.in_progress && Date.now() - this.expense.in_progress < 1500) {
                return;
            }
            this.expense.in_progress = Date.now();
            var amount = isNaN(form.value.amount) ? 0 : Number(form.value.amount);
            if (amount <= 0) {
                this.nav.alert("Not enough amount", true);
                return;
            }
            var note = helpers_1.htmlEscape(this.expense.note.trim()).substr(0, 5000);
            var isEdit = !!this.expense.expense_id;
            var data = {
                "ticket_key": this.expense.ticket_number || null,
                "account_id": this.selects.account.selected,
                "project_id": !this.expense.ticket_number ? this.selects.project.selected : null,
                "tech_id": isEdit ? this.expense.user_id : this.he.user_id,
                "note": this.expense.note,
                "note_internal": this.expense.note_internal,
                "amount": amount,
                "is_billable": this.isbillable,
                "vendor": this.expense.vendor
            };
            this.apiData.get("expenses" + (!isEdit ? "" : ("/" + this.expense.expense_id)), data, isEdit ? "PUT" : "POST").subscribe(function (data) {
                if (!_this.expense.number && !_this.expense.expense_id && !_this.expense.account) {
                    _this.config.setRecent({ "account": _this.selects.account,
                        "project": _this.selects.project });
                }
                _this.nav.alert('Expense was successfully added :)');
                setTimeout(function () { return _this.close(); }, 500);
            }, function (error) {
                console.log(error || 'Server error');
            });
        }
    };
    ExpenseCreatePage.prototype.setDate = function (date, showmonth, istime) {
        return date ? helpers_1.getDateTime(date, showmonth, istime) : null;
    };
    ExpenseCreatePage.prototype.getFixed = function (value) {
        return Number(value || "0").toFixed(2).toString();
    };
    ExpenseCreatePage.prototype.close = function () {
        this.view.dismiss();
    };
    ExpenseCreatePage = __decorate([
        ionic_angular_1.Page({
            template: '<ion-toolbar><button (click)="close()" class="bar-button bar-button-default"><span *ngIf="title?.length < 15" primary>Cancel</span><ion-icon *ngIf="title?.length > 15" primary class="invoiceCircle" name="ios-arrow-back"></ion-icon></button><ion-title class="ellipsis padding-right24">{{title}}</ion-title></ion-toolbar><ion-content class="expense-create"><form #addForm="ngForm"><ion-list class="list max-width700 general-alignment" no-lines><input class="width100 textLogin commentText subject-create" placeholder="Amount" required ngControl="amount" [ngModel]="expense.amount"><div class="class-margin"><select-list *ngIf="!expense.number" [list]="selects.account" ajax="true" preload="true" (onChanged)="saveSelect($event)"></select-list><select-list *ngIf="!expense.number" [list]="selects.project" preload="true" (onChanged)="saveSelect($event)"></select-list></div><div class="tooltips"><textarea required [(ngModel)]="expense.note" ngControl="note" #note="ngForm" class="width100 textLogin commentText" type="text" placeholder="Note" maxlength="4000"></textarea> <span [hidden]="note.valid || note.untouched">Note is required and less 4000 chars</span></div><br><textarea [(ngModel)]="expense.vendor" class="width100 textLogin commentText subject-create" type="text" placeholder="Vendor"></textarea> <textarea [(ngModel)]="expense.note_internal" class="width100 textLogin commentText subject-create" type="text" placeholder="Internal Notes"></textarea><ion-item no-lines class="left toggle-width"><ion-toggle class="toggle" [(ngModel)]="isbillable"></ion-toggle></ion-item><p class="left width30 text-toggle color">Billable</p><div><button (click)="onSubmit(addForm)" secondary block type="submit" [disabled]="!addForm.valid" class="disable-hover button button-default button-block">{{expense.expense_id ? \'Update\' : \'Add\'}} Expense</button></div></ion-list></form></ion-content>',
            directives: [core_1.forwardRef(function () { return class_list_1.ClassListComponent; }), core_1.forwardRef(function () { return select_list_1.SelectListComponent; })],
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav, ionic_angular_1.NavParams, api_data_1.ApiData, ionic_angular_1.Config, ionic_angular_1.ViewController])
    ], ExpenseCreatePage);
    return ExpenseCreatePage;
}());
exports.ExpenseCreatePage = ExpenseCreatePage;

},{"../../components/class-list/class-list":4,"../../components/select-list/select-list":9,"../../directives/helpers":15,"../../providers/api-data":54,"@angular/core":"@angular/core","ionic-angular":"ionic-angular"}],21:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var data_provider_1 = require('../../providers/data-provider');
var helpers_1 = require('../../directives/helpers');
var expense_create_1 = require('../expense-create/expense-create');
var pipes_1 = require('../../pipes/pipes');
var ExpensesPage = (function () {
    function ExpensesPage(nav, dataProvider, config, navParams, view) {
        this.nav = nav;
        this.dataProvider = dataProvider;
        this.config = config;
        this.navParams = navParams;
        this.view = view;
        this.LIMIT = 15;
        this.is_empty = false;
    }
    ExpensesPage.prototype.onPageLoaded = function () {
        this.params = this.navParams.data || {};
        this.pager = { page: 0 };
        this.params.account = { id: this.params.account_id || -1, name: this.params.account_name || this.config.getCurrent("user").account_name };
    };
    ExpensesPage.prototype.onPageWillEnter = function () {
        var _this = this;
        if (this.params.account_name)
            this.view.setBackButtonText('');
        if (this.params.is_empty)
            this.params.count = 0;
        if (this.params.count !== 0) {
            var timer = setTimeout(function () {
                _this.busy = true;
            }, 500);
            this.getItems(null, timer);
        }
        else
            this.is_empty = true;
    };
    ExpensesPage.prototype.getItems = function (infiniteScroll, timer) {
        var _this = this;
        this.dataProvider.getExpenses(this.params.account.id, this.pager).subscribe(function (data) {
            if (timer) {
                _this.is_empty = !data.length;
                clearTimeout(timer);
                _this.busy = false;
                _this.expenses = data;
            }
            else
                (_a = _this.expenses).push.apply(_a, data);
            if (infiniteScroll) {
                infiniteScroll.enable(data.length == _this.LIMIT);
                infiniteScroll.complete();
            }
            _this.count = data.length;
            var _a;
        }, function (error) {
            if (timer) {
                clearTimeout(timer);
                _this.busy = false;
            }
            console.log(error || 'Server error');
        });
    };
    ExpensesPage.prototype.doInfinite = function (infiniteScroll) {
        if (this.is_empty || this.count < this.LIMIT) {
            infiniteScroll.enable(false);
            infiniteScroll.complete();
            return;
        }
        this.pager.page += 1;
        this.getItems(infiniteScroll, null);
    };
    ExpensesPage.prototype.itemTapped = function (expense) {
        expense = expense || {};
        expense.account = expense.account || this.params.account;
        this.nav.push(expense_create_1.ExpenseCreatePage, expense);
    };
    ExpensesPage.prototype.setDate = function (date, showmonth, istime) {
        return date ? helpers_1.getDateTime(date, showmonth, istime) : null;
    };
    ExpensesPage.prototype.getCurrency = function (value) {
        return helpers_1.getCurrency(value);
    };
    ExpensesPage = __decorate([
        ionic_angular_1.Page({
            template: '<ion-navbar *navbar><button menuToggle><ion-icon name="menu"></ion-icon></button><ion-title class="padding-right24">Expenses {{params.account_name ? "of&nbsp;" + params.account.name : ""}}</ion-title></ion-navbar><ion-content><div *ngIf="is_empty" class="table grey2 menu-text">No Expenses yet</div><ion-list class="list general-alignment2" no-lines><a detail-none href="#" ion-item *ngFor="let expense of expenses" (click)="itemTapped(expense)" class="margin-top0"><ion-avatar item-left><img [alt]="expense.user_firstname" class="img" [src]="expense.user_email | Gravatar"></ion-avatar><div class="expenses"><li class="text-left left"><h2 class="ellipsis color">{{expense.user_name}} @ {{setDate(expense.date, false, true)}}</h2><h3 class="timelogs ellipsis color" [innerHTML]="expense.note | Linebreaks"></h3><h3 class="timelogs ellipsis color" *ngIf="expense.ticket_id">{{"#"+expense.ticket_number+": "+expense.ticket_subject}}</h3><h3 class="timelogs ellipsis" *ngIf="expense.project_id">{{"Project: "+expense.project_name}}</h3></li><li class="right margin font-time text-right"><span class="expense-hours color">{{getCurrency(expense.amount)}}</span></li></div></a></ion-list></ion-content><button (click)="itemTapped()" secondary item-right fab fab-right fab-bottom style="z-index: 2"><ion-icon class="button_circle action-but" name="md-add"></ion-icon></button>',
            pipes: [pipes_1.GravatarPipe, pipes_1.MorePipe, pipes_1.LinebreaksPipe],
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav, data_provider_1.DataProvider, ionic_angular_1.Config, ionic_angular_1.NavParams, ionic_angular_1.ViewController])
    ], ExpensesPage);
    return ExpensesPage;
}());
exports.ExpensesPage = ExpensesPage;

},{"../../directives/helpers":15,"../../pipes/pipes":53,"../../providers/data-provider":56,"../expense-create/expense-create":20,"ionic-angular":"ionic-angular"}],22:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var helpers_1 = require('../../directives/helpers');
var pipes_1 = require('../../pipes/pipes');
var data_provider_1 = require('../../providers/data-provider');
var api_data_1 = require('../../providers/api-data');
var InvoiceDetailsPage = (function () {
    function InvoiceDetailsPage(nav, navParams, dataProvider, apiData, config, view) {
        this.nav = nav;
        this.navParams = navParams;
        this.dataProvider = dataProvider;
        this.apiData = apiData;
        this.config = config;
        this.view = view;
    }
    InvoiceDetailsPage.prototype.onPageLoaded = function () {
        var _this = this;
        this.invoice = this.navParams.data || {};
        if (this.invoice.id)
            this.title = "Send Invoice #" + this.invoice.id + " to\u00A0" + this.invoice.account_name;
        else
            this.title = "Create Invoice on\u00A0" + this.invoice.account_name;
        this.dataProvider.getInvoice(this.invoice.id, this.invoice.account_id, this.invoice.project_id).subscribe(function (data) {
            if (data.length == 1)
                data = data[0];
            if (data.recipients)
                data.recipients = data.recipients.sort(function (a, b) {
                    return a.is_accounting_contact < b.is_accounting_contact ? 1 : -1;
                });
            _this.invoice = data;
        }, function (error) {
            console.log(error || 'Server error');
        });
    };
    InvoiceDetailsPage.prototype.onPageWillEnter = function () {
        this.view.setBackButtonText('');
    };
    InvoiceDetailsPage.prototype.setDate = function (date, showmonth, istime) {
        return helpers_1.getDateTime(date || new Date(), showmonth, istime);
    };
    InvoiceDetailsPage.prototype.getCurrency = function (value) {
        return helpers_1.getCurrency(value);
    };
    InvoiceDetailsPage.prototype.changeContact = function (recipient) {
        recipient.is_accounting_contact = !recipient.is_accounting_contact;
    };
    InvoiceDetailsPage.prototype.send = function () {
        var _this = this;
        if (!this.invoice.recipients.filter(function (v) { return v.is_accounting_contact; }).length) {
            this.nav.alert("No accounting contacts selected", true);
            return;
        }
        if (this.invoice.in_progress && Date.now() - this.invoice.in_progress < 1500) {
            return;
        }
        this.invoice.in_progress = Date.now();
        var emails = "";
        this.invoice.recipients.forEach(function (v) {
            if (v.is_accounting_contact) {
                emails += v.email + ",";
            }
        });
        var data = {};
        if (!this.invoice.id) {
            data.status = "unbilled";
            data.account = this.invoice.account_id;
            data.project = this.invoice.project_id;
            data.start_date = (new Date(this.invoice.start_date || Date.now().toString())).toJSON();
            data.end_date = (new Date(this.invoice.end_date || Date.now().toString())).toJSON();
        }
        else
            data.action = "sendEmail";
        data.recipients = emails;
        this.apiData.get('invoices/' + (this.invoice.id || ""), data, !this.invoice.id ? 'POST' : 'PUT').subscribe(function (data) {
            _this.nav.alert('Hurray! Invoice sent :)');
            if (!_this.invoice.id)
                _this.nav.popTo(_this.nav.getByIndex(_this.nav.length() - 3));
            else
                _this.nav.pop();
        }, function (error) {
            console.log(error || 'Server error');
        });
    };
    InvoiceDetailsPage = __decorate([
        ionic_angular_1.Page({
            template: '<ion-navbar *navbar><button menuToggle><ion-icon name="menu"></ion-icon></button><ion-title class="ellipsis padding-right24">{{title}}</ion-title></ion-navbar><ion-content padding class="invoice-details"><ion-item><p item-right class="text_list color">{{setDate(invoice.start_date, true)}} - {{setDate(invoice.end_date, true)}}</p></ion-item><ion-item no-lines class="width65 left"><h2 class="color" item-left>Time</h2></ion-item><ion-item no-lines class="width35 left"><h2 item-right class="color">{{getCurrency(invoice.amount)}}</h2></ion-item><ion-item no-lines class="width65 left"><h2 item-left class="color">Travel</h2></ion-item><ion-item no-lines class="width35 left"><h2 item-right class="color">{{getCurrency(invoice.travel_cost)}}</h2></ion-item><ion-item no-lines class="width65 left"><h2 item-left class="color">Expenses</h2></ion-item><ion-item no-lines class="width35 left"><h2 item-right class="color">{{getCurrency(invoice.misc_cost)}}</h2></ion-item><ion-item no-lines class="width65 left"><h2 item-left class="color">Adjustments</h2></ion-item><ion-item no-lines class="width35 left"><h2 item-right class="color">{{getCurrency(invoice.adjustments)}}</h2></ion-item><ion-item class="width45 right basic-margin color"></ion-item><ion-item no-lines><h2 item-right class="font-invoice color">{{getCurrency(invoice.total_cost)}}</h2></ion-item><br><ion-item padding><br><h2 class="color">Recipients</h2></ion-item><ion-list class="list"><div *ngIf="!invoice.recipients" class="table grey2 menu-text">No recipients yet</div><div *ngFor="let recipient of invoice.recipients"><div><ion-avatar class="ticketImg left recipient width23"><img class="avatarInvoice margin-top10 img_avatar" [alt]="recipient.fullname" [src]="recipient.email | Gravatar"></ion-avatar></div><ion-item class="blue3 width80 invoicelist right margin" no-lines><h3 class="recipient-calc left textLogin margin-top2 ellipsis">{{recipient.email}}</h3><button fab class="{{recipient.is_accounting_contact ? \'green\' : \'red\'}} buttonInvoice right topInvoice email-invoice button-fab" (click)="changeContact(recipient)"><ion-icon *ngIf="recipient.is_accounting_contact" class="invoiceCircle" name="checkmark"></ion-icon><ion-icon *ngIf="!recipient.is_accounting_contact" class="invoiceCircle" name="close"></ion-icon></button></ion-item></div></ion-list><div><button (click)="send()" [disabled]="!invoice.recipients" secondary class="disable-hover button button-default button-block img-top display">{{!invoice.id ? "Create &" : ""}} Send</button></div></ion-content>',
            pipes: [pipes_1.GravatarPipe],
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav, ionic_angular_1.NavParams, data_provider_1.DataProvider, api_data_1.ApiData, ionic_angular_1.Config, ionic_angular_1.ViewController])
    ], InvoiceDetailsPage);
    return InvoiceDetailsPage;
}());
exports.InvoiceDetailsPage = InvoiceDetailsPage;

},{"../../directives/helpers":15,"../../pipes/pipes":53,"../../providers/api-data":54,"../../providers/data-provider":56,"ionic-angular":"ionic-angular"}],23:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var data_provider_1 = require('../../providers/data-provider');
var pipes_1 = require('../../pipes/pipes');
var invoice_details_1 = require('../invoice-details/invoice-details');
var uninvoices_1 = require('../uninvoices/uninvoices');
var helpers_1 = require('../../directives/helpers');
var InvoicesPage = (function () {
    function InvoicesPage(nav, dataProvider, config, navParams, view) {
        this.nav = nav;
        this.dataProvider = dataProvider;
        this.config = config;
        this.navParams = navParams;
        this.view = view;
        this.LIMIT = 15;
        this.is_empty = false;
        this.invoices = [];
    }
    InvoicesPage.prototype.onPageLoaded = function () {
        var _this = this;
        this.params = this.navParams.data || {};
        this.pager = { page: 0, limit: this.LIMIT };
        this.params.account = { id: this.params.account_id || 0, name: this.params.account_name || this.config.getCurrent("user").account_name };
        if (this.params.is_empty)
            this.params.count = 0;
        if (this.params.count !== 0) {
            var timer = setTimeout(function () {
                _this.busy = true;
            }, 500);
            this.getItems(null, timer);
        }
        else
            this.is_empty = true;
    };
    InvoicesPage.prototype.onPageWillEnter = function () {
        if (this.params.account_name)
            this.view.setBackButtonText('');
    };
    InvoicesPage.prototype.getItems = function (infiniteScroll, timer) {
        var _this = this;
        this.dataProvider.getInvoices(this.params.account.id, true, this.pager).subscribe(function (data) {
            if (timer) {
                _this.is_empty = !data.length;
                clearTimeout(timer);
                _this.busy = false;
                _this.invoices = data;
            }
            else
                (_a = _this.invoices).push.apply(_a, data);
            if (infiniteScroll) {
                infiniteScroll.enable(data.length == _this.LIMIT);
                infiniteScroll.complete();
            }
            _this.count = data.length;
            var _a;
        }, function (error) {
            if (timer) {
                clearTimeout(timer);
                _this.busy = false;
            }
            console.log(error || 'Server error');
        });
    };
    InvoicesPage.prototype.doInfinite = function (infiniteScroll) {
        if (this.is_empty || this.count < this.LIMIT) {
            infiniteScroll.enable(false);
            infiniteScroll.complete();
            return;
        }
        this.pager.page += 1;
        this.getItems(infiniteScroll, null);
    };
    InvoicesPage.prototype.itemTapped = function (item) {
        this.nav.push(invoice_details_1.InvoiceDetailsPage, item);
    };
    InvoicesPage.prototype.showUninvoiced = function () {
        this.nav.push(uninvoices_1.UnInvoicesPage, this.params);
    };
    InvoicesPage.prototype.setDate = function (date, showmonth, istime) {
        return helpers_1.getDateTime(date || new Date(), showmonth, istime);
    };
    InvoicesPage.prototype.getCurrency = function (value) {
        return helpers_1.getCurrency(value);
    };
    InvoicesPage = __decorate([
        ionic_angular_1.Page({
            template: '<ion-navbar *navbar><button menuToggle><ion-icon name="menu"></ion-icon></button><ion-title class="padding-right24">Invoices {{params.account_name ? "of&nbsp;" + params.account.name : ""}}</ion-title></ion-navbar><ion-content padding><img *ngIf="busy" class="imglogo img-padding" src="img/loading2.gif"><div *ngIf="is_empty" class="table grey2 menu-text">No Invoices yet</div><div><ion-list class="invoices" padding><a detail-none href="#" ion-item (click)="itemTapped(invoice)" *ngFor="let invoice of invoices"><p>{{setDate(invoice.end_date || invoice.date, true)}}</p><h2>{{invoice.account_name || invoice.customer}}</h2><h4 item-right>{{getCurrency(invoice.total_cost)}}</h4></a></ion-list><ion-infinite-scroll (infinite)="doInfinite($event)" threshold="30%"><ion-infinite-scroll-content loadingSpinner="circles" loadingText="Loading more data..."></ion-infinite-scroll-content></ion-infinite-scroll></div></ion-content><button (click)="showUninvoiced()" secondary item-right fab fab-right fab-bottom style="z-index: 2"><ion-icon class="button_circle action-but" name="md-add"></ion-icon></button>',
            pipes: [pipes_1.MorePipe],
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav, data_provider_1.DataProvider, ionic_angular_1.Config, ionic_angular_1.NavParams, ionic_angular_1.ViewController])
    ], InvoicesPage);
    return InvoicesPage;
}());
exports.InvoicesPage = InvoicesPage;

},{"../../directives/helpers":15,"../../pipes/pipes":53,"../../providers/data-provider":56,"../invoice-details/invoice-details":22,"../uninvoices/uninvoices":45,"ionic-angular":"ionic-angular"}],24:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var config_1 = require('../../providers/config');
var helpers_1 = require('../../directives/helpers');
var data_provider_1 = require('../../providers/data-provider');
var organizations_1 = require('../organizations/organizations');
var signup_1 = require('../signup/signup');
var LoginPage = (function () {
    function LoginPage(nav, dataProvider, config, events) {
        this.nav = nav;
        this.dataProvider = dataProvider;
        this.config = config;
        this.events = events;
        this.google_action = "";
        this.busy = false;
        this.is_sd = config_1.isSD;
        this.fileDest = { ticket: "wonvhr" };
        if (localStorage.getItem("isPhonegap") !== "true")
            this.google_action = config_1.ApiSite + 'auth/auth0';
        if (localStorage.getItem("isExtension") === "true")
            window.top.postMessage("logout", "*");
        events.publish("app:logout");
    }
    LoginPage.prototype.onPageLoaded = function () {
        document.title = config_1.AppTitle + "Mobile App";
        this.login = { username: localStorage.getItem('username') || "" };
    };
    LoginPage.prototype.onLogin = function (form) {
        var _this = this;
        this.busy = true;
        if (form.valid) {
            localStorage.setItem('username', form.value.email || "");
            this.dataProvider.checkLogin(form.value.email, form.value.password).subscribe(function (data) {
                _this.config.setCurrent({ "key": data.api_token });
                _this.nav.setRoot(organizations_1.OrganizationsPage, null, { animation: "wp-transition" });
            }, function (error) {
                var message = 'There was a problem with your login.  Check your login and password.';
                if (form.value.email && ~form.value.email.indexOf("@gmail.com")) {
                    message = "Wrong Password, maybe you used Google password";
                }
                _this.nav.alert(message, true);
                _this.login.password = "";
                _this.busy = false;
            });
        }
        else {
            this.nav.alert('Please enter email and password!', true);
            this.busy = false;
        }
    };
    LoginPage.prototype.ngAfterViewInit = function () {
    };
    LoginPage.prototype.support = function () {
        helpers_1.openURLsystem("https://support." + config_1.Site + "portal/");
    };
    LoginPage.prototype.onGoogleSignin = function () {
        window.location.href = config_1.ApiSite + 'auth/auth0' + (localStorage.getItem("isPhonegap") === "true" ? ("?ios_action=" + (localStorage.isIos || localStorage.isIosStatus || "")) : "");
    };
    LoginPage.prototype.onSignup = function () {
        this.nav.push(signup_1.SignupPage, null, { animation: "wp-transition" });
    };
    LoginPage = __decorate([
        ionic_angular_1.Page({
            template: '<ion-content padding class="login"><div class="list max-width"><a title="Support Portal" (click)="support()"><img class="imglogo img-padding" src="img/logo.png"></a><form #loginForm="ngForm" novalidate><div class="tooltips"><input class="width100 blue3 subject-create commentText" type="email" [(ngModel)]="login.username" placeholder="email" ngControl="email" #username="ngForm" required pattern="^[^@\\s]+@[^@\\s]+(\\.[^@\\s]+)+$"> <span *ngIf="username.dirty && !username.valid">Valid Email is required</span></div><br><div class="tooltips"><input class="width100 blue3 subject-create commentText" [(ngModel)]="login.password" placeholder="password" ngControl="password" type="password" #password="ngForm" required> <span *ngIf="password.dirty && !password.valid">Password is required</span></div><br><button class="login-margin" [disabled]="!loginForm.valid || busy" (click)="onLogin(loginForm)" type="submit" block secondary>Login</button></form><br><template [ngIf]="is_sd"><div><ul class="googleStripes"><li></li><li></li><li></li><li></li></ul></div><button class="login-margin text-google itemTech grey3 itemTech2" (click)="onGoogleSignin()" block light><span>Sign in with&nbsp;<big>Google</big></span></button><br><button (click)="onSignup()" block dark class="login-margin">Create New Account</button></template></div></ion-content>',
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav, data_provider_1.DataProvider, ionic_angular_1.Config, ionic_angular_1.Events])
    ], LoginPage);
    return LoginPage;
}());
exports.LoginPage = LoginPage;

},{"../../directives/helpers":15,"../../providers/config":55,"../../providers/data-provider":56,"../organizations/organizations":34,"../signup/signup":38,"ionic-angular":"ionic-angular"}],25:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var data_provider_1 = require('../../../providers/data-provider');
var AddUserModal = (function () {
    function AddUserModal(nav, navParams, dataProvider, config, viewCtrl) {
        this.nav = nav;
        this.navParams = navParams;
        this.dataProvider = dataProvider;
        this.config = config;
        this.viewCtrl = viewCtrl;
        this.firstname_m = "";
        nav.swipeBackEnabled = false;
    }
    AddUserModal.prototype.ngOnInit = function () {
        this.ispassword = true;
        this.data = (this.navParams.data || {}).type || {};
        this.firstname_m = (this.navParams.data || {}).name || " ";
    };
    AddUserModal.prototype.ngAfterViewInit = function () {
        setTimeout(function () { var s = document.getElementsByTagName("ion-page")[0]; s.style.display = 'none'; s.offsetHeight; s.style.display = ''; }, 200);
        this.firstname_m = this.firstname_m.trim();
    };
    AddUserModal.prototype.dismissPage = function (data) {
        this.viewCtrl.dismiss(data);
    };
    AddUserModal.prototype.onSubmit = function (form) {
        var _this = this;
        if (form.valid) {
            this.dataProvider.addUser(form.value.email, form.value.firstname, form.value.lastname, this.data.type).subscribe(function (data) {
                _this.nav.alert(_this.data.charAt(0).toUpperCase() + _this.data.slice(1) + ' was created :)');
                setTimeout(function () {
                    _this.dismissPage(data);
                }, 1000);
            }, function (error) {
                _this.nav.alert(form.value.email + ' already exists! Please try again', true);
                console.log(error || 'Server error');
            });
        }
    };
    AddUserModal = __decorate([
        ionic_angular_1.Page({
            template: '<ion-toolbar><ion-buttons start class="searchbar"><button (click)="dismissPage()"><span primary>Cancel</span></button></ion-buttons><ion-title>Add {{data != "tech" ? config.current.names.user.a : config.current.names.tech.a}}</ion-title></ion-toolbar><ion-content><ion-list class="list"><p class="general-alignment"></p><form #addForm="ngForm"><div class="tooltips"><input class="add-user-input" autofocus tabindex="1" type="email" [ngModel]="email_m" placeholder="Valid Email" ngControl="email" #username="ngForm" required pattern="^[^@\\s]+@[^@\\s]+(\\.[^@\\s]+)+$"> <span *ngIf="username.dirty && !username.valid">Valid Email is required</span></div><div class="tooltips"><input class="add-user-input" type="text" [ngModel]="firstname_m" placeholder="Firstname" ngControl="firstname" #firstname="ngForm" required> <span *ngIf="firstname.dirty && !firstname.valid">Firstname cannot be empty</span></div><div class="tooltips"><input class="add-user-input" type="text" [ngModel]="lastname_m" placeholder="Lastname" ngControl="lastname" #lastname="ngForm" required> <span *ngIf="lastname.dirty && !lastname.valid">Lastname cannot be empty</span></div><div class="img-top"><button [disabled]="!addForm.valid" secondary block (click)="onSubmit(addForm)" type="submit" class="disable-hover button button-default button-block">Add New {{data != "tech" ? "User" : "Tech"}}</button><br><button *ngIf="config.current.is_time_tracking" (click)="dismissPage()" block type="submit" class="blue2 disable-hover button button-default button-block class-margin">Cancel</button></div></form></ion-list></ion-content>',
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav, ionic_angular_1.NavParams, data_provider_1.DataProvider, ionic_angular_1.Config, ionic_angular_1.ViewController])
    ], AddUserModal);
    return AddUserModal;
}());
exports.AddUserModal = AddUserModal;

},{"../../../providers/data-provider":56,"ionic-angular":"ionic-angular"}],26:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var api_data_1 = require('../../../providers/api-data');
var config_1 = require('../../../providers/config');
var modals_1 = require('../modals');
var helpers_1 = require('../../../directives/helpers');
var AjaxSelectModal = (function () {
    function AjaxSelectModal(nav, navParams, config, apiData, viewCtrl) {
        this.nav = nav;
        this.navParams = navParams;
        this.config = config;
        this.apiData = apiData;
        this.viewCtrl = viewCtrl;
        this.isdefault_enabled = false;
        this.isnew_enabled = false;
        nav.swipeBackEnabled = false;
    }
    AjaxSelectModal.prototype.ngOnInit = function () {
        var _this = this;
        this.term = '';
        this.name = this.navParams.data.name || "List";
        this.isdefault_enabled = !~["user", "account", "tech", "task type"].indexOf(this.name.toLowerCase());
        this.isnew_enabled = !!~["user", "tech"].indexOf(this.name.toLowerCase());
        this.url = this.navParams.data.url || "";
        this.data = this.navParams.data.items || {};
        this.pager = { limit: 20 };
        this.items = this.data;
        this.count = this.items.length;
        this.is_empty = false;
        if (this.items.length === 0) {
            var timer = setTimeout(function () {
                _this.busy = true;
            }, 500);
            this.getItems(null, timer);
        }
    };
    AjaxSelectModal.prototype.dismiss = function (item) {
        item = item || {};
        this.viewCtrl.dismiss(item);
    };
    AjaxSelectModal.prototype.invite = function () {
        var _this = this;
        var myModal = ionic_angular_1.Modal.create(modals_1.AddUserModal, { type: this.name.toLowerCase(), name: this.term });
        myModal.onDismiss(function (data) {
            if (data) {
                data.name = helpers_1.getFullName(data.firstname, data.lastname, data.email);
                _this.dismiss(data);
            }
        });
        this.nav.present(myModal);
    };
    AjaxSelectModal.prototype.searchItems = function (searchbar) {
        var _this = this;
        this.items = this.data;
        var q = searchbar.value.trim();
        if (q.trim() == '' || this.busy) {
            if (q.trim() == '')
                this.is_empty = !this.items.length;
            return;
        }
        if (q.length < 3) {
            this.items = this.items.filter(function (v) { return v.name.toLowerCase().indexOf(q.toLowerCase()) > -1; });
            this.is_empty = !this.items.length;
        }
        else {
            var timer = setTimeout(function () { _this.busy = true; }, 500);
            this.getItems(q, timer);
        }
    };
    AjaxSelectModal.prototype.getItems = function (term, timer) {
        var _this = this;
        this.items = [];
        if (config_1.isSD && ~["location", "account"].indexOf(this.name.toLowerCase())) {
            term = term + "*";
        }
        this.apiData.getPaged(helpers_1.addp(this.url, "search", term), this.pager).subscribe(function (data) {
            if (data.length && !data[0].name) {
                var results = [];
                data.forEach(function (item) {
                    var name;
                    if (item.email)
                        name = helpers_1.getFullName(item.firstname, item.lastname, item.email, " ");
                    results.push({ id: item.id, name: name });
                });
                data = results;
            }
            if (timer) {
                clearTimeout(timer);
                _this.busy = false;
            }
            _this.is_empty = !data.length;
            if (!term) {
                _this.items = _this.data = data;
            }
            else
                _this.items = data;
            _this.count = data.length;
        }, function (error) {
            if (timer) {
                clearTimeout(timer);
                _this.busy = false;
            }
            console.log(error || 'Server error');
        });
    };
    AjaxSelectModal = __decorate([
        ionic_angular_1.Page({
            template: '<ion-toolbar><ion-buttons style="flex: 1;" start><button (click)="dismiss()"><span>Cancel</span></button></ion-buttons><ion-searchbar debounce="400" [(ngModel)]="term" (input)="searchItems($event)" placeholder="{{name}} (min 3 chars)" hideCancelButton="true"></ion-searchbar></ion-toolbar><ion-content><img *ngIf="busy" src="img/loading2.gif" class="imglogo img-padding"><ion-list class="ajax"><a *ngIf="isdefault_enabled" detail-none href="#" ion-item (click)="dismiss({name: \'Default\', id: 0})"><h2>Default (no selection)</h2></a> <a *ngIf="isnew_enabled" detail-none href="#" ion-item (click)="invite()"><h2 class="color"><ion-icon name="add-circle"></ion-icon>&nbsp;&nbsp;&nbsp;Invite new {{name}} {{is_empty ? \'"\'+term+\'"\' : ""}}</h2></a> <a detail-none href="#" ion-item *ngFor="let item of items" (click)="dismiss(item)"><h2>{{item.name}}</h2></a></ion-list><div *ngIf="is_empty && !isdefault_enabled && !isnew_enabled" class="table grey2 menu-text">No {{name}} found yet</div></ion-content>',
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav, ionic_angular_1.NavParams, ionic_angular_1.Config, api_data_1.ApiData, ionic_angular_1.ViewController])
    ], AjaxSelectModal);
    return AjaxSelectModal;
}());
exports.AjaxSelectModal = AjaxSelectModal;

},{"../../../directives/helpers":15,"../../../providers/api-data":54,"../../../providers/config":55,"../modals":30,"ionic-angular":"ionic-angular"}],27:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var modals_1 = require('../modals');
var helpers_1 = require('../../../directives/helpers');
var BasicSelectModal = (function () {
    function BasicSelectModal(nav, params, viewCtrl) {
        this.nav = nav;
        this.params = params;
        this.viewCtrl = viewCtrl;
        this.searchQuery = '';
        this.is_empty = false;
        this.isdefault_enabled = false;
        this.isnew_enabled = false;
        this.name = this.params.data.name;
        this.isdefault_enabled = !~["user", "account", "tech", "task type"].indexOf(this.name.toLowerCase());
        this.isnew_enabled = !!~["user", "tech"].indexOf(this.name.toLowerCase());
        this.data = this.params.data.items;
        this.items = this.data;
    }
    BasicSelectModal.prototype.dismiss = function (item) {
        item = item || {};
        this.viewCtrl.dismiss(item);
    };
    BasicSelectModal.prototype.invite = function () {
        var _this = this;
        var myModal = ionic_angular_1.Modal.create(modals_1.AddUserModal, { type: this.name.toLowerCase(), name: this.searchQuery });
        myModal.onDismiss(function (data) {
            if (data) {
                data.name = helpers_1.getFullName(data.firstname, data.lastname, data.email);
                _this.dismiss(data);
            }
        });
        this.nav.present(myModal);
    };
    BasicSelectModal.prototype.getItems = function (searchbar) {
        this.items = this.data;
        var q = searchbar.value;
        if (q.trim() == '') {
            return;
        }
        this.items = this.items.filter(function (v) { return v.name.toLowerCase().indexOf(q.toLowerCase()) > -1; });
        this.is_empty = !this.items.length;
    };
    BasicSelectModal = __decorate([
        ionic_angular_1.Page({
            template: '<ion-toolbar><ion-buttons style="flex: 1;" start><button (click)="dismiss()"><span>Cancel</span></button></ion-buttons><ion-searchbar [ngModel]="searchQuery" (input)="getItems($event)" [placeholder]="name" hideCancelButton="true"></ion-searchbar></ion-toolbar><ion-content><ion-list class="basic-list"><a *ngIf="isdefault_enabled" detail-none href="#" ion-item (click)="dismiss({name: \'Default\', id: 0})"><h2>Default (no selection)</h2></a> <a *ngIf="isnew_enabled" detail-none href="#" ion-item (click)="invite()"><h2 class="color"><ion-icon name="add-circle"></ion-icon>&nbsp;&nbsp;&nbsp;Invite new {{name}} {{is_empty ? \'"\'+searchQuery+\'"\' : ""}}</h2></a> <a detail-none href="#" ion-item *ngFor="let item of items" (click)="dismiss(item)"><h2>{{item.name}}</h2></a></ion-list><div *ngIf="is_empty && !isdefault_enabled && !isnew_enabled" class="table grey2 menu-text">No {{name}} found yet</div></ion-content>',
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav, ionic_angular_1.NavParams, ionic_angular_1.ViewController])
    ], BasicSelectModal);
    return BasicSelectModal;
}());
exports.BasicSelectModal = BasicSelectModal;

},{"../../../directives/helpers":15,"../modals":30,"ionic-angular":"ionic-angular"}],28:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var core_1 = require('@angular/core');
var ticket_provider_1 = require('../../../providers/ticket-provider');
var api_data_1 = require('../../../providers/api-data');
var helpers_1 = require('../../../directives/helpers');
var select_list_1 = require('../../../components/select-list/select-list');
var CloseTicketModal = (function () {
    function CloseTicketModal(nav, navParams, apiData, ticketProvider, config, viewCtrl) {
        this.nav = nav;
        this.navParams = navParams;
        this.apiData = apiData;
        this.ticketProvider = ticketProvider;
        this.config = config;
        this.viewCtrl = viewCtrl;
        nav.swipeBackEnabled = false;
        this.config = config;
    }
    CloseTicketModal.prototype.ngOnInit = function () {
        var _this = this;
        this.isconfirm = true;
        this.ticket = this.navParams.data || 0;
        this.categories = [];
        this.selects = {
            "resolution": {
                name: "Resolution",
                value: "Resolved",
                selected: 1,
                hidden: false,
                items: [
                    { "name": 'Resolved', "id": 1 },
                    { "name": 'UnResolved', "id": 0 },
                ]
            },
            "category": {
                name: "Category",
                value: "Choose",
                selected: 0,
                hidden: false,
                items: []
            }
        };
        if (!this.config.current.is_resolution_tracking)
            return;
        this.apiData.get("resolution_categories").subscribe(function (data) {
            _this.categories = data;
            _this.selects.category.items = data.filter(function (v) { return v.is_resolved; });
            _this.selects.category.hidden = !_this.selects.category.items.length;
        }, function (error) {
            console.log(error || 'Server error');
        });
    };
    CloseTicketModal.prototype.dismiss = function (num) {
        this.viewCtrl.dismiss(num || 0);
    };
    CloseTicketModal.prototype.saveSelect = function (event) {
        var name = event.type;
        this.selects[name].selected = event.id;
        this.selects[name].value = event.name;
        if (name == "resolution") {
            this.selects.category.value = "Choose";
            this.selects.category.selected = 0;
            this.selects.category.items = this.selects.resolution.selected ?
                this.categories.filter(function (v) { return v.is_resolved; }) : this.categories.filter(function (v) { return !v.is_resolved; });
            this.selects.category.hidden = !this.selects.category.items.length;
        }
    };
    CloseTicketModal.prototype.onSubmit = function (form) {
        var _this = this;
        if (form.valid) {
            var post = helpers_1.htmlEscape((this.ticketnote || "").trim()).substr(0, 5000);
            if (this.config.current.is_ticket_require_closure_note && !post.length) {
                this.nav.alert("Note is required!", true);
                return;
            }
            var data = {
                "status": "closed",
                "note_text": post,
                "is_send_notifications": true,
                "resolved": this.selects.resolution.selected == 1,
                "resolution_id": this.selects.category.selected,
                "confirmed": this.isconfirm,
                "confirm_note": ""
            };
            this.ticketProvider.closeOpenTicket(this.ticket.key, data).subscribe(function (data) {
                _this.nav.alert('Ticket has been closed :)');
                _this.dismiss(1);
            }, function (error) {
                console.log(error || 'Server error');
            });
        }
    };
    CloseTicketModal = __decorate([
        ionic_angular_1.Page({
            template: '<ion-toolbar><ion-buttons start class="searchbar"><button (click)="dismiss()"><span primary>Cancel</span></button></ion-buttons><ion-title class="ellipsis padding-right24 padding-left87">Close {{config.current.names.ticket.s}} #{{ticket.number}} {{ticket.subject}}</ion-title></ion-toolbar><ion-content class="has-header"><div class="list max-width700 general-alignment"><select-list [list]="selects.resolution" preload="true" (onChanged)="saveSelect($event)"></select-list><select-list [list]="selects.category" preload="true" (onChanged)="saveSelect($event)"></select-list><form #addForm="ngForm" class="response-ticket"><template [ngIf]="config.current.is_confirmation_tracking"><ion-item no-lines class="left toggle-width"><ion-toggle class="toggle" [(ngModel)]="isconfirm" disabled="false"></ion-toggle></ion-item><p class="left width35 text-toggle color">Confirm Now?</p></template><div class="tooltips"><textarea class="width100 textLogin commentText" [(ngModel)]="ticketnote" type="text" placeholder="Add closing comments" ngControl="note" #note="ngForm" maxlength="4000"></textarea> <span [hidden]="note.valid || note.untouched">Note should be less 5000 chars</span></div><button secondary class="button_reply img-top right" [disabled]="!addForm.valid" (click)="onSubmit(addForm)" type="submit">Close {{config.current.names.ticket.s}}</button></form></div></ion-content>',
            directives: [core_1.forwardRef(function () { return select_list_1.SelectListComponent; })],
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav, ionic_angular_1.NavParams, api_data_1.ApiData, ticket_provider_1.TicketProvider, ionic_angular_1.Config, ionic_angular_1.ViewController])
    ], CloseTicketModal);
    return CloseTicketModal;
}());
exports.CloseTicketModal = CloseTicketModal;

},{"../../../components/select-list/select-list":9,"../../../directives/helpers":15,"../../../providers/api-data":54,"../../../providers/ticket-provider":59,"@angular/core":"@angular/core","ionic-angular":"ionic-angular"}],29:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var api_data_1 = require('../../../providers/api-data');
var config_1 = require('../../../providers/config');
var helpers_1 = require('../../../directives/helpers');
var modals_1 = require('../modals');
var InfinitySelectModal = (function () {
    function InfinitySelectModal(nav, navParams, config, apiData, viewCtrl) {
        this.nav = nav;
        this.navParams = navParams;
        this.config = config;
        this.apiData = apiData;
        this.viewCtrl = viewCtrl;
        this.isdefault_enabled = false;
        this.isnew_enabled = false;
        nav.swipeBackEnabled = false;
    }
    InfinitySelectModal.prototype.ngOnInit = function () {
        var _this = this;
        this.term = '';
        this.name = this.navParams.data.name || "List";
        this.isdefault_enabled = !~["user", "account", "tech", "task type"].indexOf(this.name.toLowerCase());
        this.isnew_enabled = !!~["user", "tech"].indexOf(this.name.toLowerCase());
        this.url = this.navParams.data.url || "";
        this.data = this.navParams.data.items || {};
        this.items = this.data;
        this.count = this.items.length;
        this.isbutton = this.navParams.data.isbutton;
        this.is_empty = false;
        this.pager = { page: ((this.count % 25 == 0) ? Math.max(this.count / 25 - 1, 0) : 0), limit: 25 };
        if (this.items.length === 0) {
            var timer = setTimeout(function () {
                _this.busy = true;
            }, 500);
            this.getItems("", null, timer);
        }
    };
    InfinitySelectModal.prototype.dismiss = function (item) {
        item = item || {};
        this.viewCtrl.dismiss(item);
    };
    InfinitySelectModal.prototype.invite = function () {
        var _this = this;
        var myModal = ionic_angular_1.Modal.create(modals_1.AddUserModal, { type: this.name.toLowerCase(), name: this.term });
        myModal.onDismiss(function (data) {
            if (data) {
                data.name = helpers_1.getFullName(data.firstname, data.lastname, data.email);
                _this.dismiss(data);
            }
        });
        this.nav.present(myModal);
    };
    InfinitySelectModal.prototype.searchItems = function (searchbar) {
        var _this = this;
        this.items = this.data;
        var q = searchbar.value.trim();
        if (q.trim() == '' || this.busy) {
            if (q.trim() == '')
                this.is_empty = !this.items.length;
            return;
        }
        this.date = Date.now();
        if (q.length < 3) {
            this.items = this.items.filter(function (v) { return v.name.toLowerCase().indexOf(q.toLowerCase()) > -1; });
            this.is_empty = !this.items.length;
        }
        else {
            var timer = setTimeout(function () { _this.busy = true; }, 500);
            this.getItems(q, null, timer);
        }
    };
    InfinitySelectModal.prototype.getItems = function (term, infiniteScroll, timer) {
        var _this = this;
        var pager = { page: this.pager.page, limit: this.pager.limit };
        var sterm = term;
        if (term.length > 2)
            pager.page = 0;
        if (config_1.isSD && ~["location", "account"].indexOf(this.name.toLowerCase())) {
            sterm = term + "*";
        }
        this.apiData.getPaged(helpers_1.addp(this.url, "search", sterm), pager).subscribe(function (data) {
            if (data.length && !data[0].name) {
                var results = [];
                data.forEach(function (item) {
                    var name;
                    if (item.email)
                        name = helpers_1.getFullName(item.firstname, item.lastname, item.email, _this.isbutton ? "" : " ");
                    else if (item.number)
                        name = "#" + item.number + ": " + item.subject;
                    results.push({ id: item.id, name: name });
                });
                data = results;
            }
            if (timer) {
                _this.is_empty = !data.length;
                clearTimeout(timer);
                _this.busy = false;
            }
            _this.count = 25;
            if (!term || term.length < 3) {
                if (timer) {
                    _this.data = data;
                }
                else
                    (_a = _this.data).push.apply(_a, data);
                if (infiniteScroll) {
                    infiniteScroll.enable(data.length == 25);
                }
                _this.count = data.length;
                _this.searchItems({ value: term });
            }
            else if (data.length)
                _this.items = data;
            else
                _this.items = _this.data;
            if (infiniteScroll) {
                infiniteScroll.complete();
            }
            var _a;
        }, function (error) {
            if (timer) {
                clearTimeout(timer);
                _this.busy = false;
            }
            console.log(error || 'Server error');
        });
    };
    InfinitySelectModal.prototype.doInfinite = function (infiniteScroll) {
        if (this.date && Date.now() - this.date < 1000) {
            infiniteScroll.complete();
            return;
        }
        if (this.is_empty || this.count < 25) {
            infiniteScroll.complete();
            if ((this.is_empty && !this.term) || this.count < 25)
                infiniteScroll.enable(false);
            return;
        }
        this.pager.page += 1;
        this.term = "";
        this.getItems("", infiniteScroll);
    };
    InfinitySelectModal = __decorate([
        ionic_angular_1.Page({
            template: '<ion-toolbar><ion-buttons style="flex: 1;" start><button (click)="dismiss()"><span>Cancel</span></button></ion-buttons><ion-searchbar debounce="400" [(ngModel)]="term" (input)="searchItems($event)" placeholder="{{name}} (min 3 chars)" hideCancelButton="true"></ion-searchbar></ion-toolbar><ion-content class="has-header"><img *ngIf="busy" class="imglogo img-padding" src="img/loading2.gif"><ion-list class="list basic-list"><a *ngIf="isdefault_enabled" detail-none href="#" ion-item class="basic-margin text-left" (click)="dismiss({name: \'Default (no selection)\', id: 0})"><h2 class="color">Default (no selection)</h2></a> <a *ngIf="isnew_enabled" detail-none href="#" ion-item (click)="invite()"><h2 class="color"><ion-icon name="add-circle"></ion-icon>&nbsp;&nbsp;&nbsp;Invite new {{name}} {{is_empty ? \'"\'+term+\'"\' : ""}}</h2></a> <a detail-none href="#" ion-item class="basic-margin text-left" *ngFor="let item of items" (click)="dismiss(item)"><h2 class="color">{{item.name}}</h2></a></ion-list><div *ngIf="is_empty && !isdefault_enabled && !isnew_enabled" class="table grey2 menu-text">No {{name}} found yet</div><ion-infinite-scroll (infinite)="doInfinite($event)" threshold="30%"><ion-infinite-scroll-content loadingSpinner="circles" loadingText="Loading more data..."></ion-infinite-scroll-content></ion-infinite-scroll></ion-content>',
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav, ionic_angular_1.NavParams, ionic_angular_1.Config, api_data_1.ApiData, ionic_angular_1.ViewController])
    ], InfinitySelectModal);
    return InfinitySelectModal;
}());
exports.InfinitySelectModal = InfinitySelectModal;

},{"../../../directives/helpers":15,"../../../providers/api-data":54,"../../../providers/config":55,"../modals":30,"ionic-angular":"ionic-angular"}],30:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require('./basic-select/basic-select'));
__export(require('./ajax-select/ajax-select'));
__export(require('./infinity-select/infinity-select'));
__export(require('./close-ticket/close-ticket'));
__export(require('./tree-modal/tree-modal'));
__export(require('./ticket-create/ticket-create'));
__export(require('./add-user/add-user'));
__export(require('./privacy/privacy'));

},{"./add-user/add-user":25,"./ajax-select/ajax-select":26,"./basic-select/basic-select":27,"./close-ticket/close-ticket":28,"./infinity-select/infinity-select":29,"./privacy/privacy":31,"./ticket-create/ticket-create":32,"./tree-modal/tree-modal":33}],31:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var PrivacyModal = (function () {
    function PrivacyModal(nav, viewCtrl) {
        this.nav = nav;
        this.viewCtrl = viewCtrl;
        nav.swipeBackEnabled = false;
    }
    PrivacyModal.prototype.dismiss = function (item) {
        this.viewCtrl.dismiss();
    };
    PrivacyModal = __decorate([
        ionic_angular_1.Page({
            template: '<ion-toolbar><ion-buttons start><button nav-pop><span primary>Cancel</span></button></ion-buttons></ion-toolbar><ion-content padding><div class="list max-width"><img class="imglogo img-padding" src="img/logo.png"><div><p class="margin-top0">When you register for a SherpaDesk trial you can be certain that we have implemented comprehensive security practices to ensure that only you and those people you provide authorized access to can see your help desk. We respect your right to privacy and feel it is important for you to know how we handle the information we receive from you via our website at http:www.sherpadesk.com (the “Site”) and through our on-demand support platform, tools and services offered on the Site (the “Service”).</p><h4>Information you Provide</h4><p class="margin-top0">When you register for the Service, we ask for information such as your name, e-mail address, company name and address. bigWebApps uses a third-party intermediary to manage credit card processing. This intermediary is not permitted to store, retain, or use your billing information except for the sole purpose of credit card processing on bigWebApps behalf.</p><p class="margin-top0">bigWebApps practice is not to use such personal information for marketing purposes. bigWebApps may use the collected personal information and other information bigWebApps collects about your use of the Service to operate and make the Service available to you, for billing, identification and authentication, to contact you about your use of the Service, research purposes and to generally improve the content and functionality of the Service and Site.</p><p>bigWebApps may also transmit or share your personal information with its third party vendors and hosting partners to provide the necessary hardware, software, networking, storage, and other technology and services required to operate and maintain the Service, which may require that your personal information be transferred from your current location to the offices and servers of bigWebApps and the authorized third parties referred to here. Although bigWebApps owns the software, code, databases, all rights to the SherpaDesk application, you retain all rights to your data.</p><h4>Cookies</h4><p class="margin-top0">When you visit the Site or use the Service, we use session “cookies” – a piece of information stored on your computer – to allow the Site or Service to uniquely identify your browser while you are logged in and to enable bigWebApps to process your online transactions. Session cookies also help us confirm your identity and are required in order to use the Service. SherpaDesk uses persistent cookies that only SherpaDesk can read and use, to identify you as a SherpaDesk customer and make it easier for you to log in to the Service. Users who disable their web browsers’ ability to accept cookies will be able to browse our Site, but will not be able to access or take advantage of the Service.</p><h4>Information Sharing</h4><p class="margin-top0">Except as described in this policy, bigWebApps will not give, sell, rent, or loan any identifiable personal information to any third party. We may disclose such information to respond to subpoenas, court orders, or legal process, or to establish or exercise our legal rights or defend against legal claims. We may also share such information if we believe it is necessary in order to investigate, prevent, or take action regarding illegal activities, suspected fraud, situations involving potential threats to the physical safety of any person, violations of our Terms of Service, or as otherwise required by law. bigWebApps may also provide non-personal, summary or group statistics about our customers, sales, traffic patterns, and related Site information to reputable third-party vendors, but these statistics will include no personally identifying information.</p><h4>Children’s Personal Information</h4><p class="margin-top0">The Service and Site are not intended for, nor does bigWebApps knowingly collect any personally identifiable information from children under the age of 13.</p><h4>Protection of Information</h4><p class="margin-top0">bigWebApps maintains reasonable security measures to protect your information from loss, destruction, misuse, unauthorized access or disclosure. These technologies help ensure that your data is safe, secure, and only available to you and to those you provided authorized access. However, no data transmission over the Internet or information storage technology can be guaranteed to be 100% secure.</p><h4>Changes to Privacy Policy</h4><p class="margin-top0">bigWebApps may update this policy from time to time. You can review the most current version of this privacy policy at any time at http://www.sherpadesk.com/privacy. Your continued use of the Site or Service constitutes your agreement to be bound by such changes to the privacy policy. Your only remedy, if you do not accept the terms of this privacy policy, is to discontinue use of the Site and Service.</p><h4>Business Transactions</h4><p class="margin-top0">bigWebApps may assign or transfer this privacy policy, and your user account and related information and data, to any person or entity that acquires or is merged with SherpaDesk.</p><h4>Terms of Service</h4><p class="margin-top0">When you access and use the Service, you are subject to the SherpaDesk Terms of Service.</p><h4>Contact Us</h4><p class="margin-top0">If you have questions regarding this privacy policy or about the security practices of bigWebApps, please contact us by email at corporate@bigwebapps.com.</p></div></div></ion-content>',
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav, ionic_angular_1.ViewController])
    ], PrivacyModal);
    return PrivacyModal;
}());
exports.PrivacyModal = PrivacyModal;

},{"ionic-angular":"ionic-angular"}],32:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var core_1 = require('@angular/core');
var providers_1 = require('../../../providers/providers');
var helpers_1 = require('../../../directives/helpers');
var class_list_1 = require('../../../components/class-list/class-list');
var location_list_1 = require('../../../components/location-list/location-list');
var select_list_1 = require('../../../components/select-list/select-list');
var ticket_details_1 = require('../../../pages/ticket-details/ticket-details');
var TicketCreatePage = (function () {
    function TicketCreatePage(nav, navParams, ticketProvider, config, viewCtrl) {
        this.nav = nav;
        this.navParams = navParams;
        this.ticketProvider = ticketProvider;
        this.config = config;
        this.viewCtrl = viewCtrl;
        this.fileDest = { ticket: "11" };
        this.files = [];
        nav.swipeBackEnabled = false;
    }
    TicketCreatePage.prototype.ngOnInit = function () {
        this.he = this.config.getCurrent("user");
        this.data = this.navParams.data || {};
        var recent = {};
        if (!this.data.account) {
            recent = this.config.current.recent || {};
        }
        var account_id = (this.data.account || {}).id || (recent.account || {}).selected || this.he.account_id || -1;
        this.selects = {
            "user": {
                name: "User",
                value: helpers_1.getFullName(this.he.firstname, this.he.lastname, this.he.email),
                selected: this.he.user_id,
                url: "users",
                hidden: false
            },
            "location": {
                name: "Location",
                value: (recent.location || {}).value || "Default",
                selected: (recent.location || {}).selected || 0,
                url: "locations?account=" + account_id + "&limit=500",
                hidden: false
            },
            "project": {
                name: "Project",
                value: (recent.project || {}).value || "Default",
                selected: (recent.project || {}).selected || 0,
                url: "projects?account=" + account_id + "&is_with_statistics=false",
                hidden: false
            },
            "class": {
                name: "Class",
                value: (recent.class || {}).value || "Default",
                selected: (recent.class || {}).selected || 0,
                url: "classes",
                hidden: false
            },
            "priority": {
                name: "Priority",
                value: (recent.priority || {}).value || "Default",
                selected: (recent.priority || {}).selected || 0,
                url: "priorities",
                hidden: false
            }
        };
        this.selects.tech = {
            name: "Tech",
            value: (this.data.tech || {}).name || "Default",
            selected: (this.data.tech || {}).id || 0,
            url: "technicians",
            hidden: false
        };
        this.selects.account = {
            name: "Account",
            value: (this.data.account || {}).name || (recent.account || {}).value || this.he.account_name,
            selected: account_id,
            url: "accounts?is_with_statistics=false",
            hidden: false
        };
        this.ticket =
            {
                "subject": "",
                "initial_post": "",
                "class_id": null,
                "account_id": account_id,
                "location_id": null,
                "user_id": this.he.user_id,
                "tech_id": 0,
                "priority_id": 0,
            };
    };
    TicketCreatePage.prototype.dismissPage = function (data) {
        if (data)
            this.nav.alert(this.config.current.names.ticket.s + ' was Succesfully Created :)');
        this.viewCtrl.dismiss(data);
    };
    TicketCreatePage.prototype.saveSelect = function (event) {
        var name = event.type;
        this.selects[name].selected = event.id;
        this.selects[name].value = event.name;
        switch (name) {
            case "account":
                this.selects.project.url = "projects?account=" + event.id + "&is_with_statistics=false";
                this.selects.project.value = "Default";
                this.selects.project.selected = 0;
                this.selects.location.url = "locations?account=" + event.id + "&limit=500";
                this.selects.location.value = "Default";
                this.selects.location.selected = 0;
                break;
        }
    };
    TicketCreatePage.prototype.uploadedFile = function (event) {
        this.dismissPage(this.ticket);
    };
    TicketCreatePage.prototype.selectedFile = function (event) {
        this.files = event;
        this.ticket.initial_post = this.ticket.initial_post.trim();
        if (event.length && !this.ticket.initial_post) {
            this.ticket.initial_post = "  ";
        }
    };
    TicketCreatePage.prototype.onSubmit = function (form) {
        var _this = this;
        if (form.valid) {
            if (this.ticket.in_progress && Date.now() - this.ticket.in_progress < 1500) {
                return;
            }
            this.ticket.in_progress = Date.now();
            this.ticket.subject = helpers_1.htmlEscape(this.ticket.subject.trim());
            this.ticket.initial_post = helpers_1.htmlEscape(this.ticket.initial_post.trim()).substr(0, 4500);
            if (this.files.length) {
                this.ticket.initial_post += "\n\nFollowing file" + (this.files.length > 1 ? "s were" : " was") + " uploaded: " + this.files.join(", ") + ".";
            }
            this.ticket.class_id = this.selects.class.selected;
            this.ticket.account_id = this.selects.account.selected;
            this.ticket.location_id = this.selects.location.selected;
            this.ticket.user_id = this.he.is_techoradmin ? this.selects.user.selected : this.he.user_id;
            this.ticket.tech_id = this.selects.tech.selected;
            this.ticket.priority_id = this.selects.priority.selected;
            this.ticketProvider.addTicket(this.ticket).subscribe(function (data) {
                if (!_this.data.account) {
                    _this.config.setRecent({ "account": _this.selects.account,
                        "location": _this.selects.location,
                        "project": _this.selects.project,
                        "class": _this.selects.class,
                        "priority": _this.selects.priority });
                }
                if (_this.files.length) {
                    _this.ticket = data;
                    _this.fileDest.ticket = data.key;
                    _this.uploadComponent.onUpload();
                }
                else
                    _this.dismissPage(data);
            }, function (error) {
                _this.nav.alert(_this.he.is_techoradmin ? ("Please select " + _this.config.current.names.tech.s) : error, true);
                console.log(error || 'Server error');
            });
        }
    };
    __decorate([
        core_1.ViewChild(ticket_details_1.UploadButtonComponent), 
        __metadata('design:type', ticket_details_1.UploadButtonComponent)
    ], TicketCreatePage.prototype, "uploadComponent", void 0);
    TicketCreatePage = __decorate([
        ionic_angular_1.Page({
            template: '<ion-toolbar><ion-buttons start class="searchbar"><button (click)="dismissPage()"><span primary>Cancel</span></button></ion-buttons><ion-title>New {{config.current.names.ticket.s}}</ion-title></ion-toolbar><ion-content><div class="list max-width700 margin-top-5"><template [ngIf]="config.current.user.is_techoradmin"><select-list ajax="true" [list]="selects.user" (onChanged)="saveSelect($event)" preload="true"></select-list></template><select-list [list]="selects.account" [preload]="config.current.user.is_techoradmin" [is_enabled]="config.current.user.is_techoradmin" ajax="true" (onChanged)="saveSelect($event)"></select-list><location-list preload="true" [list]="selects.location" (onChanged)="saveSelect($event)"></location-list><template [ngIf]="config.current.user.is_techoradmin"><select-list [list]="selects.project" preload="true" (onChanged)="saveSelect($event)"></select-list></template><select-list [list]="selects.priority" preload="true" (onChanged)="saveSelect($event)"></select-list><class-list preload="true" [list]="selects.class" (onChanged)="saveSelect($event)"></class-list><template [ngIf]="config.current.user.is_techoradmin"><select-list is_me="true" [list]="selects.tech" ajax="true" preload="true" (onChanged)="saveSelect($event)"></select-list></template></div><form margin-top class="container_list" #addForm="ngForm"><div class="list max-width700"><div class="tooltips"><input class="width100 blue3 subject-create commentText margin-bottom3" [(ngModel)]="ticket.subject" placeholder="Subject" ngControl="subject" #subject="ngForm" required maxlength="100"> <span [hidden]="subject.valid || subject.untouched">Subject is required and less 100 chars</span></div><br><textarea class="width100 textLogin commentText margin-bottom1" type="text" [(ngModel)]="ticket.initial_post" ngControl="text" #note="ngForm" placeholder="Details..."></textarea><br><upload-button #u (filesUploaded)="uploadedFile($event)" (filesSelected)="selectedFile($event)" [fileDest]="fileDest"></upload-button><button [disabled]="!addForm.valid" secondary block (click)="onSubmit(addForm)" type="submit" class="disable-hover button button-default button-block">Add Ticket</button> <span class="span-block"></span></div></form></ion-content>',
            directives: [core_1.forwardRef(function () { return class_list_1.ClassListComponent; }), core_1.forwardRef(function () { return location_list_1.LocationListComponent; }), core_1.forwardRef(function () { return select_list_1.SelectListComponent; }), ticket_details_1.UploadButtonComponent],
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav, ionic_angular_1.NavParams, providers_1.TicketProvider, ionic_angular_1.Config, ionic_angular_1.ViewController])
    ], TicketCreatePage);
    return TicketCreatePage;
}());
exports.TicketCreatePage = TicketCreatePage;

},{"../../../components/class-list/class-list":4,"../../../components/location-list/location-list":6,"../../../components/select-list/select-list":9,"../../../directives/helpers":15,"../../../pages/ticket-details/ticket-details":39,"../../../providers/providers":58,"@angular/core":"@angular/core","ionic-angular":"ionic-angular"}],33:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var tree_view_1 = require('../../../components/tree-view/tree-view');
var TreeModal = (function () {
    function TreeModal(params, viewCtrl) {
        this.params = params;
        this.viewCtrl = viewCtrl;
        this.name = this.params.data.name;
        this.Nodes = this.params.data.items;
    }
    TreeModal.prototype.onSelectNode = function (node) {
        this.selectedNode = node;
    };
    TreeModal.prototype.onRequest = function (parent) {
        return;
    };
    TreeModal.prototype.dismiss = function (isCancel) {
        var item = {};
        if (this.selectedNode && !isCancel)
            item = {
                id: this.selectedNode.id,
                name: this.selectedNode.name
            };
        this.viewCtrl.dismiss(item);
    };
    TreeModal = __decorate([
        ionic_angular_1.Page({
            template: '<ion-toolbar><ion-buttons start><button (click)="dismiss(\'1\')"><span primary>Cancel</span></button></ion-buttons><ion-buttons end style="flex: 1;"><button (click)="dismiss()"><span primary>Select</span></button></ion-buttons></ion-toolbar><ion-content class="has-header"><div class="basic-margin class-list list"><tree-view [Nodes]="Nodes" [SelectedNode]="selectedNode" (onSelectedChanged)="onSelectNode($event)"></tree-view></div></ion-content>',
            directives: [tree_view_1.TreeViewComponent]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavParams, ionic_angular_1.ViewController])
    ], TreeModal);
    return TreeModal;
}());
exports.TreeModal = TreeModal;

},{"../../../components/tree-view/tree-view":12,"ionic-angular":"ionic-angular"}],34:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var data_provider_1 = require('../../providers/data-provider');
var ticket_provider_1 = require('../../providers/ticket-provider');
var time_provider_1 = require('../../providers/time-provider');
var config_1 = require('../../providers/config');
var helpers_1 = require('../../directives/helpers');
var login_1 = require('../login/login');
var OrganizationsPage = (function () {
    function OrganizationsPage(nav, dataProvider, config, events, ticketProvider, timeProvider) {
        var _this = this;
        this.nav = nav;
        this.dataProvider = dataProvider;
        this.config = config;
        this.events = events;
        this.ticketProvider = ticketProvider;
        this.timeProvider = timeProvider;
        this.list = [];
        var key = this.config.getCurrent("key");
        events.publish("app:logout", key);
        this.ticketProvider._dataStore = { all: [], alt: [], tech: [], user: [] };
        this.dataProvider._dataStore = this.timeProvider._dataStore = {};
        if (localStorage.getItem("isExtension") === "true")
            window.top.postMessage("logout", "*");
        this.dataProvider.getOrganizations(key).subscribe(function (data) {
            var org = localStorage.getItem('loadOrgKey') || '';
            if (org)
                localStorage.setItem('loadOrgKey', "");
            var org_data = org ? data.filter(function (t) { return t.key == org; }) : null;
            if (org_data)
                data = org_data;
            if (data.length == 1) {
                if (data[0].instances.length == 1) {
                    _this.config.setCurrent({ is_multiple_org: false });
                    _this.onSelectInst({ org: data[0].key, inst: data[0].instances[0].key });
                    return;
                }
                else {
                    _this.list = data;
                    _this.toggle(data[0], 0);
                }
            }
            else
                _this.list = data;
            _this.config.setCurrent({ is_multiple_org: true });
        }, function (error) {
            _this.nav.alert("Cannot get list of Organizations", true);
            _this.config.clearCurrent();
            _this.nav.setRoot(login_1.LoginPage, null, { animation: "wp-transition" });
        });
    }
    OrganizationsPage.prototype.onPageLoaded = function () {
    };
    OrganizationsPage.prototype.toggle = function (org, index) {
        if (org.instances.length == 1) {
            this.onSelectInst({ org: org.key, inst: org.instances[0].key });
            return;
        }
        this.list.forEach(function (o, i) { return o.expanded = false; });
        this.list[index].expanded = this.list[index].expanded ? false : true;
    };
    OrganizationsPage.prototype.support = function () {
        helpers_1.openURLsystem("https://support." + config_1.Site + "portal/");
    };
    OrganizationsPage.prototype.alertOrg = function (name) {
        this.nav.alert(name + " has expired or inactivated. Contact SherpaDesk for assistance. Email: support@sherpadesk.com Phone: +1 (866) 996-1200, then press 2", true);
    };
    OrganizationsPage.prototype.onSelectInst = function (instance) {
        var loading = ionic_angular_1.Loading.create({
            content: "Loading configuration...",
            duration: 3000,
            dismissOnPageChange: true
        });
        this.nav.present(loading);
        this.config.setCurrent({ org: instance.org, instance: instance.inst });
        this.events.publish("config:get", true);
    };
    OrganizationsPage = __decorate([
        ionic_angular_1.Page({
            template: '<ion-content padding class="organizations"><ion-list class="list max-width" no-lines><a title="Support Portal" (click)="support()"><img class="imglogo img-padding" src="img/logo.png"></a><div *ngFor="let org of list; let i = index"><a detail-none href="#" ion-item [hidden]="!org.is_expired && org.instances.length" class="blue1 org expired" (click)="alertOrg(org.name)">{{org.name}} (Expired)</a> <a detail-none href="#" ion-item [hidden]="org.is_expired || !org.instances.length" class="blue1 org" (click)="toggle(org, i)"><ion-label class="padding-left8">{{org.name}} {{org.instances.length == 1 ? org.instances[0].name : \'\' }}</ion-label></a><div *ngIf="org.expanded && org.instances.length > 1"><a detail-none href="#" ion-item *ngFor="let inst of org.instances" (click)="onSelectInst({org: org.key, inst: inst.key})" class="inst org2"><ion-label class="padding-left8">{{inst.name}}</ion-label></a></div></div></ion-list></ion-content>',
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav, data_provider_1.DataProvider, ionic_angular_1.Config, ionic_angular_1.Events, ticket_provider_1.TicketProvider, time_provider_1.TimeProvider])
    ], OrganizationsPage);
    return OrganizationsPage;
}());
exports.OrganizationsPage = OrganizationsPage;

},{"../../directives/helpers":15,"../../providers/config":55,"../../providers/data-provider":56,"../../providers/ticket-provider":59,"../../providers/time-provider":60,"../login/login":24,"ionic-angular":"ionic-angular"}],35:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require('./account-details/account-details'));
__export(require('./accounts/accounts'));
__export(require('./ajax-search/ajax-search'));
__export(require('./dashboard/dashboard'));
__export(require('./expense-create/expense-create'));
__export(require('./expenses/expenses'));
__export(require('./invoice-details/invoice-details'));
__export(require('./invoices/invoices'));
__export(require('./login/login'));
__export(require('./organizations/organizations'));
__export(require('./queue-tickets/queue-tickets'));
__export(require('./queues/queues'));
__export(require('./signup/signup'));
__export(require('./ticket-details/ticket-details'));
__export(require('./tickets/tickets'));
__export(require('./timelog/timelog'));
__export(require('./timelogs/timelogs'));
__export(require('./uninvoices/uninvoices'));
__export(require('./todos/todos'));
__export(require('./todo-create/todo-create'));

},{"./account-details/account-details":16,"./accounts/accounts":17,"./ajax-search/ajax-search":18,"./dashboard/dashboard":19,"./expense-create/expense-create":20,"./expenses/expenses":21,"./invoice-details/invoice-details":22,"./invoices/invoices":23,"./login/login":24,"./organizations/organizations":34,"./queue-tickets/queue-tickets":36,"./queues/queues":37,"./signup/signup":38,"./ticket-details/ticket-details":39,"./tickets/tickets":40,"./timelog/timelog":41,"./timelogs/timelogs":42,"./todo-create/todo-create":43,"./todos/todos":44,"./uninvoices/uninvoices":45}],36:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var modals_1 = require('../modals/modals');
var ticket_details_1 = require('../ticket-details/ticket-details');
var tickets_list_1 = require('../../components/tickets-list/tickets-list');
var QueueTicketsPage = (function () {
    function QueueTicketsPage(nav, navParams, view, config) {
        this.nav = nav;
        this.navParams = navParams;
        this.view = view;
        this.config = config;
        this.queue = this.navParams.data;
    }
    QueueTicketsPage.prototype.onPageWillEnter = function () {
        this.view.setBackButtonText('');
    };
    QueueTicketsPage.prototype.addTicket = function () {
        var _this = this;
        var myModal = ionic_angular_1.Modal.create(modals_1.TicketCreatePage, { 'tech': { id: this.queue.id, name: 'Queue ' + this.queue.fullname } });
        myModal.onDismiss(function (data1) {
            if (data1)
                setTimeout(function () {
                    _this.queue.tickets_count += 1;
                    _this.nav.push(ticket_details_1.TicketDetailsPage, data1);
                }, 500);
        });
        this.nav.present(myModal);
    };
    QueueTicketsPage = __decorate([
        ionic_angular_1.Page({
            template: '<ion-navbar *navbar><button menuToggle><ion-icon name="menu"></ion-icon></button><ion-title class="padding-right24">{{config.current.names.ticket.p}} of&nbsp;{{queue.fullname}} Queue</ion-title></ion-navbar><div class="queues mycontent"><tickets-list [mode]="[\'queue\', queue.id]" [count]="queue.tickets_count"></tickets-list></div><button (click)="addTicket()" secondary item-right fab fab-right fab-bottom style="z-index: 2"><ion-icon class="button_circle action-but" name="md-add"></ion-icon></button>',
            directives: [tickets_list_1.TicketsListComponent],
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav, ionic_angular_1.NavParams, ionic_angular_1.ViewController, ionic_angular_1.Config])
    ], QueueTicketsPage);
    return QueueTicketsPage;
}());
exports.QueueTicketsPage = QueueTicketsPage;

},{"../../components/tickets-list/tickets-list":10,"../modals/modals":30,"../ticket-details/ticket-details":39,"ionic-angular":"ionic-angular"}],37:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var data_provider_1 = require('../../providers/data-provider');
var components_1 = require('../../components/components');
var QueuesPage = (function () {
    function QueuesPage(nav, dataProvider) {
        this.nav = nav;
        this.dataProvider = dataProvider;
    }
    QueuesPage.prototype.onPageLoaded = function () {
        var _this = this;
        this.dataProvider.getQueueList().subscribe(function (data) {
            _this.queues = data;
        }, function (error) {
            console.log(error || 'Server error');
        });
    };
    QueuesPage = __decorate([
        ionic_angular_1.Page({
            template: '<ion-navbar *navbar><button menuToggle><ion-icon name="menu"></ion-icon></button><ion-title>Queues</ion-title></ion-navbar><ion-content class="queues"><p class="general-alignment"></p><queues-list margin-top [queues]="queues" [simple]="true"></queues-list><span class="span-block"></span></ion-content><action-button></action-button>',
            directives: [components_1.QueuesListComponent, components_1.ActionButtonComponent]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav, data_provider_1.DataProvider])
    ], QueuesPage);
    return QueuesPage;
}());
exports.QueuesPage = QueuesPage;

},{"../../components/components":5,"../../providers/data-provider":56,"ionic-angular":"ionic-angular"}],38:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var helpers_1 = require('../../directives/helpers');
var data_provider_1 = require('../../providers/data-provider');
var login_1 = require('../login/login');
var organizations_1 = require('../organizations/organizations');
var modals_1 = require('../modals/modals');
var SignupPage = (function () {
    function SignupPage(nav, dataProvider, config, events) {
        this.nav = nav;
        this.dataProvider = dataProvider;
        this.config = config;
        this.events = events;
        this.login = {};
        this.is_force_registration = false;
    }
    SignupPage.prototype.onPageLoaded = function () {
        this.is_force_registration = false;
    };
    SignupPage.prototype.getUrl = function (name) {
        this.login.name = name.value || "";
        this.login.url = name.value ? name.value.toLowerCase().replace(/[^a-zA-Z0-9-]/g, '') : "";
    };
    SignupPage.prototype.onSignup = function (form) {
        var _this = this;
        if (form.valid) {
            var data = {
                "name": form.value.name,
                "email": form.value.email,
                "url": form.value.url,
                "is_force_registration": this.is_force_registration,
                "is_force_redirect": false,
                "firstname": form.value.firstname,
                "lastname": form.value.lastname,
                "password": form.value.password,
                "password_confirm": form.value.password_confirm,
                "how": form.value.how,
                "note": localStorage.getItem("isPhonegap") === "true" ? "registered by iPhone app" : "registered from m.sherpadesk.com"
            };
            this.dataProvider.registerOrganization(data).subscribe(function (data) {
                if (!data.api_token) {
                    _this.nav.setRoot(login_1.LoginPage, null, { animation: "wp-transition" });
                    return;
                }
                if (!data.organization || !data.instance) {
                    _this.nav.setRoot(organizations_1.OrganizationsPage, null, { animation: "wp-transition" });
                    return;
                }
                _this.config.setCurrent({
                    "key": data.api_token,
                    "org": data.organization,
                    "instance": data.instance
                });
                helpers_1.spicePixelTrackConversion();
                helpers_1.getappTrackConversion(form.value.url);
                _this.nav.alert("Thanks for registration! You are redirected to new org now ...");
                setTimeout(function () { return _this.events.publish("config:get", true); }, 3000);
            }, function (error) {
                if (~error.toString().indexOf("409")) {
                    _this.presentConfirm();
                }
                else
                    _this.nav.alert(error, true);
            });
        }
        else
            this.nav.alert('Please fill the form!', true);
    };
    SignupPage.prototype.presentConfirm = function () {
        var _this = this;
        var alert = ionic_angular_1.Alert.create({
            title: "Wait. Haven't I seen you?",
            subTitle: "This email is already in use.",
            message: 'Would you like to',
            cssClass: "hello",
            buttons: [
                {
                    text: 'Login',
                    role: 'cancel',
                    handler: function () {
                        localStorage.setItem('username', _this.login.email || "");
                        alert.dismiss().then(function () {
                            _this.nav.setRoot(login_1.LoginPage, null, { animation: "wp-transition" });
                        });
                        return false;
                    }
                },
                {
                    text: 'Create New Org',
                    handler: function () {
                        var navTransition = alert.dismiss();
                        _this.is_force_registration = true;
                        navTransition.then(function () {
                            var form = { valid: true, value: _this.login };
                            _this.onSignup(form);
                        });
                        return false;
                    }
                }
            ]
        });
        this.nav.present(alert);
    };
    SignupPage.prototype.onGoogleSignip = function () {
        this.nav.setRoot(SignupPage), null, { animation: "wp-transition" };
    };
    SignupPage.prototype.gotoPrivacy = function () {
        this.nav.present(ionic_angular_1.Modal.create(modals_1.PrivacyModal));
    };
    SignupPage.prototype.onCancel = function () {
        this.nav.setRoot(login_1.LoginPage, null, { animation: "wp-transition" });
    };
    SignupPage = __decorate([
        ionic_angular_1.Page({
            template: '<ion-content padding class="signup"><div class="list max-width"><img class="imglogo img-padding" src="img/logo.png"><form #loginForm="ngForm" novalidate><div class="tooltips"><input autofocus class="width100 blue3 subject-create commentText" [ngModel]="login.name" (ngModelChange)="getUrl(name)" ngControl="name" #name="ngForm" required minlength="3" placeholder="Company name (required)"> <span *ngIf="name.dirty && !name.valid">Name is required</span></div><div class="tooltips"><input class="width100 blue3 subject-create commentText" type="email" [(ngModel)]="login.email" ngControl="email" #username="ngForm" required pattern="^[^@\\s]+@[^@\\s]+(\\.[^@\\s]+)+$" placeholder="Email (required)"> <span *ngIf="username.dirty && !username.valid">Valid Email is required</span></div><div class="tooltips"><div class="width21 left signup-font">https://</div><input class="width30 blue3 subject-create commentText left padding5" [(ngModel)]="login.url" ngControl="url" placeholder="Company url (optional)"><div class="text-right right width48 signup-font ellipsis">.sherpadesk.com</div></div><div class="tooltips"><input class="width100 blue3 subject-create commentText" [(ngModel)]="login.firstname" ngControl="firstname" #firstname="ngForm" required minlength="3" placeholder="First Name (required)"> <span *ngIf="firstname.dirty && !firstname.valid">First Name is required</span></div><div class="tooltips"><input class="width100 blue3 subject-create commentText" [(ngModel)]="login.lastname" ngControl="lastname" #lastname="ngForm" required minlength="3" placeholder="Last Name (required)"> <span *ngIf="lastname.dirty && !lastname.valid">Valid Email is required</span></div><div class="tooltips"><input class="width100 blue3 subject-create commentText" [(ngModel)]="login.password" ngControl="password" type="password" #password="ngForm" placeholder="Password (optional)"></div><div class="tooltips"><input class="width100 blue3 subject-create commentText" [(ngModel)]="login.password_confirm" ngControl="password_confirm" #password_confirm="ngForm" type="password" placeholder="Confirm Pass (optional)"> <span *ngIf="password_confirm.dirty && password.dirty && (password_confirm.value != password.value)">Passwords should match</span></div><div class="tooltips"><input class="width100 blue3 subject-create commentText" [(ngModel)]="login.how" ngControl="how" placeholder="How\'d You Hear About Us"></div><br><button [disabled]="!loginForm.valid" class="login-margin" block secondary (click)="onSignup(loginForm)">Create My Account</button><br><button class="login-margin grey3" block nav-pop>Back to Login Page</button><br>By clicking the button above I agree to <a href="#" (click)="gotoPrivacy()">Terms of Use and Privacy Policy</a></form></div></ion-content><script>\n          var SWPX = SWPX || {};\n          SWPX.cmd = SWPX.cmd || [];\n          SWPX.cmd.push(function() {\n              SWPX.pixel.setPixel(\'mvc7\');\n              // Uncomment the following line to place an identifer\n              SWPX.pixel.setIdentifier(\'121806\');\n              SWPX.pixel.fire();\n          });\n      </script><script src="//px.spiceworks.com/px.js" async></script><noscript><img src="//px.spiceworks.com/px/mvc7" height="1" width="1"></noscript>',
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav, data_provider_1.DataProvider, ionic_angular_1.Config, ionic_angular_1.Events])
    ], SignupPage);
    return SignupPage;
}());
exports.SignupPage = SignupPage;

},{"../../directives/helpers":15,"../../providers/data-provider":56,"../login/login":24,"../modals/modals":30,"../organizations/organizations":34,"ionic-angular":"ionic-angular"}],39:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var config_1 = require('../../providers/config');
var data_provider_1 = require('../../providers/data-provider');
var ticket_provider_1 = require('../../providers/ticket-provider');
var helpers_1 = require('../../directives/helpers');
var posts_list_1 = require('../../components/posts-list/posts-list');
var select_list_1 = require('../../components/select-list/select-list');
var class_list_1 = require('../../components/class-list/class-list');
var location_list_1 = require('../../components/location-list/location-list');
var modals_1 = require('../../pages/modals/modals');
var timelog_1 = require('../../pages/timelog/timelog');
var expense_create_1 = require('../../pages/expense-create/expense-create');
var pipes_1 = require('../../pipes/pipes');
var core_1 = require("@angular/core");
var ionic_angular_2 = require('ionic-angular');
var config_2 = require('../../providers/config');
var UploadButtonComponent = (function () {
    function UploadButtonComponent(nav, renderer, config) {
        this.nav = nav;
        this.renderer = renderer;
        this.config = config;
        this.filesSelected = new core_1.EventEmitter(false);
        this.filesUploaded = new core_1.EventEmitter(false);
        this.allowMultiple = true;
        this.multi = "multiple";
        this.error = "";
        this.files = [];
        this.MAX_SIZE = 4194304;
        if (this.allowMultiple === false) {
            this.multi = "";
        }
    }
    UploadButtonComponent.prototype.ngOnInit = function () {
    };
    UploadButtonComponent.prototype.upload = function (url, files) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(xhr.response);
                    }
                    else {
                        reject(xhr.response);
                    }
                }
            };
            var token = _this.config.getCurrent("key"), org = _this.config.getCurrent("org"), inst = _this.config.getCurrent("instance");
            xhr.open('POST', url + "files/", true);
            xhr.setRequestHeader("Authorization", "Basic " + btoa(org + "-" + inst + ":" + token));
            var formData = new FormData();
            for (var key in _this.fileDest) {
                formData.append(key, _this.fileDest[key]);
            }
            for (var i = 0; i < files.length; i++) {
                formData.append("uploads[]", files[i], files[i].upload_name);
            }
            xhr.send(formData);
        });
    };
    UploadButtonComponent.prototype.onUpload = function (is_Close) {
        var _this = this;
        if (!this.files.length) {
            this.filesUploaded.next("ok" + " no files " + (is_Close ? " on close" : ""));
            return;
        }
        if (this.in_progress && Date.now() - this.in_progress < 1500) {
            return;
        }
        this.in_progress = Date.now();
        var loading = null;
        if (this.files.length >= 2 || this.files[0].size > 20000) {
            loading = ionic_angular_2.Loading.create({
                content: "Uploading file(s)...",
                dismissOnPageChange: true
            });
            this.nav.present(loading);
        }
        this.upload(config_2.ApiSite, this.files).then(function (data) {
            _this.reset();
            if (loading)
                loading.dismiss();
            _this.filesUploaded.next("ok " + data + (is_Close ? " on close" : ""));
        }).catch(function (ex) {
            if (loading) {
                setTimeout(function () { return loading.dismiss(); }, 1000);
            }
            console.error('Error uploading files', ex);
            _this.filesUploaded.next("error " + ex);
            _this.nav.alert('Error uploading files! Cannot add files! Please try again later ... or try to upload one file or check your internet connection', true);
        });
    };
    UploadButtonComponent.prototype.reset = function (file) {
        if (file) {
            this.files = this.files.filter(function (item) { return item !== file; });
            this.filesSelected.next(this.files.map(function (item) { return item.upload_name; }));
        }
        if (!file || !this.files.length) {
            this.error = "";
            this.files = [];
            this.nativeInputBtn.nativeElement.value = '';
        }
    };
    UploadButtonComponent.prototype.callback = function (event) {
        this.log("UploadButton: Callback executed triggerig click event", this.nativeInputBtn.nativeElement);
        var clickEvent = new MouseEvent("click", { bubbles: true });
        this.renderer.invokeElementMethod(this.nativeInputBtn.nativeElement, "dispatchEvent", [clickEvent]);
    };
    UploadButtonComponent.prototype.filesAdded = function (event) {
        this.log("UploadButton: Added files", this.nativeInputBtn.nativeElement.files);
        var len = this.nativeInputBtn.nativeElement.files.length;
        var checkfiles = [];
        this.error = "";
        if (len) {
            var selNames = {}, existNames = {};
            if (this.filesExist)
                for (var j = 0; j < this.filesExist.length; j++) {
                    existNames[this.filesExist[j].name.trim()] = this.filesExist[j].size;
                }
            for (var i = 0; i < len; i++) {
                var file = this.nativeInputBtn.nativeElement.files[i];
                if (this.isFile(file)) {
                    if (file.size > this.MAX_SIZE)
                        this.error += "File " + file.name + " will be skipped. It is more 4 MB<br>";
                    else if (file.size === 0)
                        this.error += "File " + file.name + " will be skipped. It has zero size <br>";
                    else if (!file.name.trim())
                        this.error += "File #" + i + " will be skipped. It has empty name<br>";
                    else {
                        var new_name = file.name.trim();
                        if (file.size != (existNames[new_name.trim()] || file.size))
                            new_name = this.add_tag(new_name, file.size);
                        if (file.size != (selNames[new_name] || file.size))
                            new_name = this.add_tag(new_name, file.size);
                        file.upload_name = new_name;
                        checkfiles.push(file);
                        selNames[new_name] = file.size;
                    }
                }
                else {
                    this.error += "File #" + i + " will be skipped. It is empty<br>";
                }
            }
        }
        this.files = checkfiles;
        this.filesSelected.next(this.files.map(function (item) { return item.upload_name; }));
    };
    UploadButtonComponent.prototype.add_tag = function (name, tag) {
        var index = name.lastIndexOf("."), len = name.length;
        return name.substr(0, index) + "_" + tag + name.substr(index, len);
    };
    UploadButtonComponent.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (this.logCallback) {
            console.log(args);
        }
    };
    UploadButtonComponent.prototype.humanizeBytes = function (bytes) {
        if (bytes === 0) {
            return '0 Byte';
        }
        var k = 1024;
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    UploadButtonComponent.prototype.isImage = function (url) {
        if (!url || url.trim().match(/(jpeg|jpg|gif|png|ico)$/i) === null)
            return "md-document";
        return "md-image";
    };
    UploadButtonComponent.prototype.isFile = function (file) {
        return file !== null && file instanceof Blob;
    };
    __decorate([
        core_1.ViewChild("input"), 
        __metadata('design:type', core_1.ElementRef)
    ], UploadButtonComponent.prototype, "nativeInputBtn", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], UploadButtonComponent.prototype, "filesSelected", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], UploadButtonComponent.prototype, "filesUploaded", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], UploadButtonComponent.prototype, "fileDest", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], UploadButtonComponent.prototype, "filesExist", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], UploadButtonComponent.prototype, "btnStyle", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], UploadButtonComponent.prototype, "allowMultiple", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Function)
    ], UploadButtonComponent.prototype, "logCallback", void 0);
    UploadButtonComponent = __decorate([
        core_1.Component({
            directives: [ionic_angular_2.IONIC_DIRECTIVES],
            selector: "upload-button",
            template: '<div><div><div><button type="button" (click)="callback($event)" left class="button-attach attach color"><ion-icon class="button-font action-but color" name="md-attach"></ion-icon>Add Files</button></div></div><span *ngIf="error" class="error-button" [innerHTML]="error"></span> <input type="file" (change)="filesAdded($event)" style="display: none" [multiple]="multi" #input><div *ngFor="let file of files"><p class="comment_image_link files-tkts width100"><ion-icon name="{{isImage(file.name)}}" role="img" dark class="button_circle ion-{{isImage(file.name)}}"></ion-icon>&nbsp;<span class="decoration width100 flex1 color">{{file.upload_name}}&nbsp;({{humanizeBytes(file.size)}})</span> <button block (click)="reset(file)" fab class="red buttonInvoice email-invoice button-fab position-initial"><ion-icon class="invoiceCircle" name="close"></ion-icon></button></p></div><button type="button" *ngIf="!fileDest?.ticket" [disabled]="!files.length" block secondary (click)="onUpload()">Upload</button> <span class="span-block2"></span></div>',
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav, core_1.Renderer, ionic_angular_1.Config])
    ], UploadButtonComponent);
    return UploadButtonComponent;
}());
exports.UploadButtonComponent = UploadButtonComponent;
var TicketDetailsPage = (function () {
    function TicketDetailsPage(nav, navParams, ticketProvider, dataProvider, config) {
        this.nav = nav;
        this.navParams = navParams;
        this.ticketProvider = ticketProvider;
        this.dataProvider = dataProvider;
        this.config = config;
        this.ticket = {};
        this.is_editnote = true;
        this.cachename = "";
        this.closed_index = 0;
        this.fileDest = { ticket: "" };
        this.files = [];
        this.is_showlogs = false;
        this.posts = [
            {
                "id": 0,
                "ticket_key": "",
                "user_id": 0,
                "user_email": " ",
                "user_firstname": " ",
                "user_lastname": " ",
                "record_date": "2016-01-01T00:00:00.0000000",
                "log_type": "Initial Post",
                "note": " ",
                "ticket_time_id": 0,
                "sent_to": " ",
                "is_waiting": false,
                "sla_used": 0
            }];
    }
    TicketDetailsPage.prototype.onPageLoaded = function () {
        this.ticket.customfields = [];
        this.active = true;
        this.he = this.config.getCurrent("user");
        this.details_tab = "Reply";
        var data = this.navParams.data || {};
        this.cachename = data.cachename;
        this.posts[0].record_date = data.updated_time || this.posts[0].record_date;
        this.is_showlogs = false;
        this.ticketnote = "";
        this.fileDest = { ticket: data.key };
        this.getPosts(data.key);
        this.processDetails(data, true);
    };
    TicketDetailsPage.prototype.initSelects = function (data) {
        var account_id = data.account_id || -1;
        this.username = helpers_1.getFullName(data.user_firstname, data.user_lastname, data.user_email);
        this.techname = helpers_1.getFullName(data.technician_firstname || data.tech_firstname, data.technician_lastname || data.tech_lastname, data.technician_email || data.tech_email);
        this.select_button = {
            "tech": {
                name: "Tech",
                value: "Transfer " + this.config.current.names.ticket.s,
                selected: data.tech_id,
                url: "technicians",
                hidden: false
            },
        };
        this.selects = {
            "user": {
                name: "User",
                value: this.username,
                selected: data.user_id,
                url: "users",
                hidden: false
            },
            "location": {
                name: "Location",
                value: data.location_name || "( Not Set )",
                selected: data.location_id || 0,
                url: "locations?account=" + account_id + "&limit=500",
                hidden: false
            },
            "tech": {
                name: "Tech",
                value: this.techname,
                selected: data.tech_id,
                url: "technicians",
                hidden: false
            },
            "project": {
                name: "Project",
                value: data.project_name || "( Not Set )",
                selected: data.project_id || 0,
                url: "projects?account=" + account_id + "&is_with_statistics=false",
                hidden: false
            },
            "level": {
                name: "Level",
                value: data.level_name ? (data.level + " - " + data.level_name) : "( Not Set )",
                selected: data.level || 0,
                url: "levels",
                hidden: false
            },
            "priority": {
                name: "Priority",
                value: data.priority_name ? (data.priority + " - " + data.priority_name) : "( Not Set )",
                selected: data.priority_id || 0,
                url: "priorities",
                hidden: false
            },
            "class": {
                name: "Class",
                value: data.class_name || "( Not Set )",
                selected: data.class_id || 0,
                url: "classes",
                hidden: false
            }
        };
        this.selects.account = {
            name: "Account",
            value: (data.account || {}).name || data.account_name || this.he.account_name,
            selected: account_id,
            url: "accounts?is_with_statistics=false",
            hidden: false
        };
    };
    TicketDetailsPage.prototype.uploadedFile = function (event) {
        if (event.indexOf("ok") == 0) {
            this.onSubmit(!this.config.current.user.is_techoradmin && this.ticket.status != 'Closed' && ~event.indexOf("close"));
        }
    };
    TicketDetailsPage.prototype.selectedFile = function (event) {
        this.files = event;
        this.ticketnote = this.ticketnote.trim();
        if (event.length && !this.ticketnote) {
            this.ticketnote = "  ";
        }
    };
    TicketDetailsPage.prototype.getPosts = function (key) {
        var _this = this;
        this.ticketProvider.getTicketDetails(key).subscribe(function (data) {
            _this.processDetails(data);
        }, function (error) {
            console.log(error || 'Server error');
            _this.redirectOnEmpty();
        });
    };
    TicketDetailsPage.prototype.processDetails = function (data, isShortInfo) {
        if (!isShortInfo && (!data || !data.ticketlogs || data.ticketlogs == 0)) {
            this.redirectOnEmpty();
            return;
        }
        this.ticket = data;
        this.is_editnote = !(this.ticket.workpad || "").length;
        this.ticket.customfields = [];
        this.initSelects(data);
        if (data.ticketlogs && data.ticketlogs.length > 0)
            this.posts = data.ticketlogs;
        if (!isShortInfo) {
            this.attachments = (data.attachments || []).slice().reverse();
            var xml = helpers_1.parseXml(this.ticket.customfields_xml);
            if (xml) {
                var t = [];
                for (var n = xml.documentElement.firstChild; n; n = n.nextSibling) {
                    t.push({ "id": n.attributes[0].nodeValue, "name": n.firstChild.innerHTML.replace("&amp;amp;", "&amp;"), "value": (n.firstChild.nextSibling.innerHTML || "").replace("&amp;amp;", "&amp;") });
                }
                this.ticket.customfields = t;
            }
        }
    };
    TicketDetailsPage.prototype.redirectOnEmpty = function () {
        var _this = this;
        this.nav.alert('Incorrect ticket. Going back...', true);
        setTimeout(function () {
            _this.nav.pop();
        }, 1000);
    };
    TicketDetailsPage.prototype.saveSelect = function (event) {
        var name = event.type;
        this.selects[name].selected = event.id;
        this.selects[name].value = event.name;
        switch (name) {
            case "account":
                this.selects.project.url = "projects?account=" + event.id + "&is_with_statistics=false";
                this.selects.project.value = "Default";
                this.selects.project.selected = 0;
                this.selects.location.url = "locations?account=" + event.id + "&limit=500";
                this.selects.location.value = "Default";
                this.selects.location.selected = 0;
                break;
        }
    };
    TicketDetailsPage.prototype.onSubmit = function (isClose) {
        var _this = this;
        if (this.ticket.in_progress && Date.now() - this.ticket.in_progress < 1500) {
            return;
        }
        this.ticket.in_progress = Date.now();
        var post = helpers_1.htmlEscape(this.ticketnote.trim()).substr(0, 5000);
        if (isClose && this.files.length || !isClose) {
            this.ticketProvider.addTicketPost(this.ticket.id, post, this.files).subscribe(function (data) {
                if (!isClose) {
                    _this.nav.alert('New post added :)');
                    _this.ticketnote = "";
                    _this.active = false;
                    setTimeout(function () { return _this.active = true; }, 0);
                    _this.getPosts(_this.ticket.key);
                }
                _this.files = [];
            }, function (error) {
                console.log(error || 'Server error');
            });
        }
        if (isClose) {
            this.onClose(true);
        }
    };
    TicketDetailsPage.prototype.saveNote = function (form) {
        var _this = this;
        var note = (form.value || "").trim();
        if (note != (this.ticket.workpad || "").trim()) {
            this.ticketProvider.addTicketNote(this.ticket.id, note).subscribe(function (data) { return _this.saveNoteSuccess(note); }, function (error) {
                console.log(error || 'Server error');
            });
        }
        else
            this.saveNoteSuccess(note);
    };
    TicketDetailsPage.prototype.openAlert = function (name, value) {
        if (!value || value.length < 22)
            return;
        var alert = ionic_angular_1.Alert.create({
            title: name,
            subTitle: value,
            buttons: [
                {
                    text: 'Ok',
                    role: 'cancel',
                }]
        });
        this.nav.present(alert);
    };
    TicketDetailsPage.prototype.saveNoteSuccess = function (note) {
        this.nav.alert('Note saved :)');
        this.ticket.workpad = (note || "").trim();
        this.is_editnote = !this.ticket.workpad.length;
    };
    TicketDetailsPage.prototype.onClose = function (isForce) {
        var _this = this;
        if (!isForce && this.ticket.in_progress && Date.now() - this.ticket.in_progress < 1500) {
            return;
        }
        this.ticket.in_progress = Date.now();
        var post = helpers_1.htmlEscape(this.ticketnote.trim()).substr(0, 5000);
        var data = {
            "status": "closed",
            "note_text": post,
            "is_send_notifications": true,
            "resolved": true,
            "resolution_id": 0,
            "confirmed": true,
            "confirm_note": ""
        };
        this.ticketProvider.closeOpenTicket(this.ticket.key, data).subscribe(function (data) {
            _this.update_tlist_logic(true);
            _this.nav.alert(_this.config.current.names.ticket.s + ' has been closed :)');
            _this.ticket.status = "Closed";
            if (post.length) {
                _this.ticketnote = "";
                _this.active = false;
                setTimeout(function () { return _this.active = true; }, 0);
                _this.files = [];
                _this.getPosts(_this.ticket.key);
            }
        }, function (error) {
            console.log(error || 'Server error');
        });
    };
    TicketDetailsPage.prototype.onUpdate = function () {
        var _this = this;
        if (this.ticket.in_progress && Date.now() - this.ticket.in_progress < 1500) {
            return;
        }
        this.ticket.in_progress = Date.now();
        var data = {
            "class_id": this.selects.class.selected,
            "level_id": this.selects.level.selected,
            "priority_id": this.selects.priority.selected,
            "project_id": this.selects.project.selected,
            "location_id": this.selects.location.selected,
            "account_id": this.selects.account.selected,
            "tech_id": this.selects.tech.selected,
            "user_id": this.selects.user.selected
        };
        this.ticketProvider.closeOpenTicket(this.ticket.key, data).subscribe(function (data) {
            _this.nav.alert(_this.config.current.names.ticket.s + ' was successfully updated :)');
            _this.getPosts(_this.ticket.key);
        }, function (error) {
            console.log(error || 'Server error');
        });
    };
    TicketDetailsPage.prototype.transferTicket = function (event) {
        var _this = this;
        if (!event)
            return;
        var techid = event.id;
        this.select_button.tech.selected = techid;
        this.select_button.tech.value = "Transfer " + this.config.current.names.ticket.s;
        var data = {
            "tech_id": techid
        };
        this.ticketProvider.closeOpenTicket(this.ticket.key, data).subscribe(function (data) {
            _this.nav.alert(_this.config.current.names.ticket.s + ' has been transferred :)');
            _this.techname = _this.selects.tech.value = _this.ticket.tech_firstname = event.name;
            _this.ticket.tech_lastname = _this.ticket.tech_email = "";
            _this.selects.tech.selected = techid;
        }, function (error) {
            console.log(error || 'Server error');
        });
    };
    TicketDetailsPage.prototype.pickUp = function () {
        var _this = this;
        var data = {
            "action": "pickup",
            "note_text": ""
        };
        if (this.ticket.in_progress && Date.now() - this.ticket.in_progress < 1500) {
            return;
        }
        this.ticket.in_progress = Date.now();
        this.ticketProvider.closeOpenTicket(this.ticket.key, data).subscribe(function (data) {
            _this.nav.alert(_this.config.current.names.ticket.s + ' pickup was Succesfull!');
            _this.techname = _this.selects.tech.value = _this.ticket.tech_firstname = helpers_1.getFullName(_this.he.firstname, _this.he.lastname, _this.he.email);
            _this.ticket.tech_lastname = _this.ticket.tech_email = "";
            _this.selects.tech.selected = _this.he.user_id;
        }, function (error) {
            console.log(error || 'Server error');
        });
    };
    TicketDetailsPage.prototype.onDelete = function (file) {
        var _this = this;
        var data = {
            "ticket": this.ticket.key,
            "file_id": file.id
        };
        this.dataProvider.deleteFile(data).subscribe(function (data) {
            _this.attachments = _this.attachments.filter(function (item) { return item !== file; });
            _this.getPosts(_this.ticket.key);
            _this.nav.alert("File " + file.name + " deleted!");
        }, function (error) {
            console.log(error || 'Server error');
        });
    };
    TicketDetailsPage.prototype.reopenTicket = function () {
        var _this = this;
        var data = {
            "status": "open",
            "note_text": ""
        };
        this.ticketProvider.closeOpenTicket(this.ticket.key, data).subscribe(function (data) {
            _this.update_tlist_logic(false);
            _this.nav.alert(_this.config.current.names.ticket.s + ' has been Reopened!');
            _this.ticket.status = "Open";
        }, function (error) {
            console.log(error || 'Server error');
        });
    };
    TicketDetailsPage.prototype.update_tlist_logic = function (is_close) {
        var _this = this;
        if (this.cachename) {
            if (~this.cachename.indexOf("closed")) {
                is_close = !is_close;
                this.closed_index = 0;
            }
            if (is_close) {
                this.closed_index = this.ticketProvider._dataStore[this.cachename].findIndex(function (tkt) { return tkt.key === _this.ticket.key; });
                this.ticketProvider._dataStore[this.cachename].splice(this.closed_index, 1);
                if (~this.cachename.indexOf("closed")) {
                    this.ticketProvider._dataStore[this.cachename.replace("closed", "open")].splice(0, 0, this.ticket);
                }
            }
            else {
                this.ticketProvider._dataStore[this.cachename].splice(this.closed_index, 0, this.ticket);
                if (~this.cachename.indexOf("closed")) {
                    this.ticketProvider._dataStore[this.cachename.replace("open", "closed")].splice(this.ticketProvider._dataStore[this.cachename.replace("open", "closed")].findIndex(function (tkt) { return tkt.key === _this.ticket.key; }), 1);
                }
            }
        }
    };
    TicketDetailsPage.prototype.closeTicket = function () {
        var _this = this;
        if (this.ticket.status == 'Closed') {
            this.reopenTicket();
            return;
        }
        var myModal = ionic_angular_1.Modal.create(modals_1.CloseTicketModal, { "number": this.ticket.number, "key": this.ticket.key, "subject": this.ticket.subject });
        myModal.onDismiss(function (data) {
            if (data) {
                _this.ticket.status = "Closed";
                _this.update_tlist_logic(true);
            }
        });
        this.nav.present(myModal);
    };
    TicketDetailsPage.prototype.addTime = function () {
        var myModal = ionic_angular_1.Modal.create(timelog_1.TimelogPage, { "number": this.ticket.number, "ticket_number": this.ticket.key, "subject": this.ticket.subject, "account_id": this.ticket.account_id });
        this.nav.present(myModal);
    };
    TicketDetailsPage.prototype.addExpense = function () {
        var myModal = ionic_angular_1.Modal.create(expense_create_1.ExpenseCreatePage, { "number": this.ticket.number, "ticket_number": this.ticket.key, "subject": this.ticket.subject, "account_id": this.ticket.account_id });
        this.nav.present(myModal);
    };
    TicketDetailsPage.prototype.getFullapplink = function (ticketkey) {
        var curr = this.config.getCurrent();
        helpers_1.fullapplink(config_1.AppSite, ticketkey, curr.instance, curr.org);
    };
    TicketDetailsPage.prototype.getFullName = function (firstname, lastname, email, name) {
        return helpers_1.getFullName(firstname, lastname, email, name);
    };
    TicketDetailsPage.prototype.getCurrency = function (value) {
        return helpers_1.getCurrency(value);
    };
    TicketDetailsPage.prototype.getFileLink = function (file) {
        return helpers_1.FileUrlHelper.getFileLink(file.url, file.name);
    };
    TicketDetailsPage.prototype.setDate = function (date, showmonth, istime) {
        return date ? helpers_1.getDateTime(date, showmonth, istime) : null;
    };
    TicketDetailsPage = __decorate([
        ionic_angular_1.Page({
            template: '<ion-navbar *navbar><button menuToggle><ion-icon name="menu"></ion-icon></button><ion-title class="padding-right24">{{ticket.status}} | <a href="#" (click)="getFullapplink(ticket.key)" class="text-decor">{{ticket.number}}&nbsp;<ion-icon class="outline" name="ios-open-outline"></ion-icon></a></ion-title></ion-navbar><ion-content><ion-toolbar class="blue3 display_flex"><h4 class="width90">{{ticket.subject | Htmlsafe}}</h4><span no-lines class="span-left"><p *ngIf="config.current.is_class_tracking && ticket.class_name"><u>Class</u>:&nbsp;{{ticket.class_name}}</p><p><u>{{config.current.names.tech.a}}</u>: {{techname}}</p><p><u>{{config.current.names.user.a}}</u>: {{username}}</p><p *ngIf="config.current.is_account_manager && ticket.account_name"><u>{{config.current.names.account.a}}</u>:&nbsp;{{ticket.account_name}}</p><p *ngIf="config.current.is_location_tracking && ticket.location_name"><u>{{config.current.names.location.a}}</u>:&nbsp;{{ticket.location_name}}</p></span> <span class="span-right"><p><u>{{ticket.days_old_in_minutes | Daysold}}</u></p><br><template [ngIf]="config.current.is_time_tracking && ticket.total_hours > 0"><p><u>{{ticket.total_hours}}</u>&nbsp;Hours</p><br></template><template [ngIf]="ticket.sla_complete_date != null"><p><u>SLA</u>: {{setDate(ticket.sla_complete_date, false, true)}}</p><br></template><template [ngIf]="config.current.is_expenses && ticket.misc_cost > 0"><p><u>Expenses</u>: {{getCurrency(ticket.misc_cost)}}</p><br></template></span></ion-toolbar><ion-segment [(ngModel)]="details_tab" *ngIf="config.current.user.is_techoradmin"><ion-segment-button value="Reply">Reply</ion-segment-button><ion-segment-button value="Info">Info</ion-segment-button><ion-segment-button value="Notes">Notes</ion-segment-button><ion-segment-button value="Files">Files</ion-segment-button><ion-segment-button value="Options">Options</ion-segment-button></ion-segment><div [ngSwitch]="details_tab"><div class="list" [hidden]="details_tab != \'Reply\'"><ion-item no-lines class="margin-bottom10"><ion-label class="width30 font-size17 text-right">Show logs</ion-label><ion-toggle [(ngModel)]="is_showlogs"></ion-toggle></ion-item><posts-list [posts]="posts" [is_first]="true" [attachments]="attachments" [is_showlogs]="is_showlogs"></posts-list><form *ngIf="active" #addForm="ngForm"><div class="tooltips"><textarea class="width100 textLogin commentText" [(ngModel)]="ticketnote" type="text" placeholder="Add Response" ngControl="note" #note="ngForm" required maxlength="4000"></textarea> <span [hidden]="note.valid || note.untouched">Response is required (max 5000 chars)</span></div><button secondary class="button_reply right indent-bottom margin-left10" [disabled]="!addForm.valid && !files?.length" (click)="u.onUpload()" type="submit">Reply</button> <button *ngIf="!config.current.user.is_techoradmin && ticket.status != \'Closed\'" secondary class="button_reply right indent-bottom margin-left10" (click)="u.onUpload(true)" [disabled]="!addForm.valid && !files?.length">Reply & Close</button><upload-button #u (filesUploaded)="uploadedFile($event)" (filesSelected)="selectedFile($event)" btnStyle="add-circle" [allowMultiple]="true" [fileDest]="fileDest" [filesExist]="attachments" [logCallback]></upload-button></form><posts-list [posts]="posts" [attachments]="attachments" class="general-alignment" [is_showlogs]="is_showlogs"></posts-list><span class="span-block"></span></div><div *ngSwitchWhen="\'Info\'" class="list max-width700 general-alignment"><select-list is_me="true" ajax="true" [list]="selects.user" (onChanged)="saveSelect($event)" preload="true"></select-list><select-list [list]="selects.account" preload="true" ajax="true" (onChanged)="saveSelect($event)"></select-list><class-list preload="true" [list]="selects.class" (onChanged)="saveSelect($event)"></class-list><select-list preload="true" [list]="selects.level" (onChanged)="saveSelect($event)"></select-list><select-list preload="true" [list]="selects.priority" (onChanged)="saveSelect($event)"></select-list><select-list is_me="true" preload="true" [list]="selects.tech" (onChanged)="saveSelect($event)"></select-list><location-list preload="true" [list]="selects.location" (onChanged)="saveSelect($event)"></location-list><select-list preload="true" [list]="selects.project" (onChanged)="saveSelect($event)"></select-list><hr class="color-bg" *ngIf="ticket.customfields.length"><div *ngFor="let customfield of ticket.customfields"><div><ion-item no-lines class="labels color">{{customfield.name | Htmlsafe}}:&nbsp;</ion-item></div><button (click)="openAlert(customfield.name, customfield.value)" class="blue4 width100 disable-hover button button-default button-select"><ion-label class="{{isbutton ? \'center\' : \'tkts-table\'}} select-list">&nbsp;&nbsp;{{customfield.value || \'&nbsp;\'}}</ion-label></button></div><div>&nbsp;&nbsp;</div><button secondary block (click)="onUpdate()" type="submit" class="disable-hover button button-default button-block">Update</button> <span class="span-block"></span></div><ion-list class="list general-alignment max-width700" [hidden]="details_tab != \'Notes\'"><div [hidden]="is_editnote" class="width100 textLogin note-account commentText" [innerHTML]="ticket?.workpad" type="text" (click)="is_editnote = true"></div><button [hidden]="is_editnote" secondary class="button_reply img-top right" (click)="is_editnote = true">Edit Notes</button> <textarea autofocus [hidden]="!is_editnote" [ngModel]="ticket?.workpad" class="glow width100 textLogin commentText" #workpadtext type="text" placeholder="Notes:"></textarea> <button [hidden]="!is_editnote" secondary class="button_reply img-top right" (click)="saveNote(workpadtext)">{{ticket?.workpad?.length ? \'Save\' : \'Add\'}} Notes</button> <span class="span-block"></span></ion-list><ion-list class="list img-top" no-lines *ngSwitchWhen="\'Files\'"><div [hidden]="attachments?.length" class="table grey2 menu-text">No Files yet</div><ion-item *ngFor="let file of attachments"><div class="left width59 tkts-table" [innerHTML]="getFileLink(file)"></div><div class="files-tkts"><span class="color right text-left space-initial flex1 font-size_span subject-ticket">{{file.name}}</span> <button (click)="onDelete(file)" block fab class="red buttonInvoice email-invoice button-fab position-initial button-files margin-left5"><ion-icon class="invoiceCircle" name="close"></ion-icon></button></div></ion-item><span class="span-block"></span></ion-list><div *ngSwitchWhen="\'Options\'" class="list max-width700 general-alignment"><button *ngIf="config.current.is_time_tracking" (click)="addTime()" block type="submit" class="blue2 disable-hover button button-default button-block class-margin">Add Time</button> <button *ngIf="config.current.is_expenses" (click)="addExpense()" block type="submit" class="blue2 disable-hover button button-default button-block class-margin">Add Expense</button><select-list class="class-margin" preload="true" [isbutton]="true" [list]="select_button.tech" (onChanged)="transferTicket($event)"></select-list><button *ngIf="(ticket.technician_email || ticket.tech_email) != he.email" (click)="pickUp()" block type="submit" class="blue2 class-margin">Pick Up {{config.current.names.ticket.s}}</button> <button (click)="closeTicket()" secondary block type="submit" class="class-margin">{{ticket.status != \'Closed\' ? \'Close\' : \'ReOpen\'}} {{config.current.names.ticket.s}}</button> <span class="span-block"></span></div></div></ion-content>',
            directives: [posts_list_1.PostsListComponent, core_1.forwardRef(function () { return select_list_1.SelectListComponent; }), core_1.forwardRef(function () { return class_list_1.ClassListComponent; }), core_1.forwardRef(function () { return location_list_1.LocationListComponent; }), UploadButtonComponent],
            pipes: [pipes_1.GravatarPipe, pipes_1.LinebreaksPipe, pipes_1.DaysoldPipe, pipes_1.HtmlsafePipe],
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav, ionic_angular_1.NavParams, ticket_provider_1.TicketProvider, data_provider_1.DataProvider, ionic_angular_1.Config])
    ], TicketDetailsPage);
    return TicketDetailsPage;
}());
exports.TicketDetailsPage = TicketDetailsPage;

},{"../../components/class-list/class-list":4,"../../components/location-list/location-list":6,"../../components/posts-list/posts-list":7,"../../components/select-list/select-list":9,"../../directives/helpers":15,"../../pages/expense-create/expense-create":20,"../../pages/modals/modals":30,"../../pages/timelog/timelog":41,"../../pipes/pipes":53,"../../providers/config":55,"../../providers/data-provider":56,"../../providers/ticket-provider":59,"@angular/core":"@angular/core","ionic-angular":"ionic-angular"}],40:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var providers_1 = require('../../providers/providers');
var modals_1 = require('../modals/modals');
var ticket_details_1 = require('../ticket-details/ticket-details');
var ajax_search_1 = require('../ajax-search/ajax-search');
var components_1 = require('../../components/components');
var directives_1 = require('../../directives/directives');
var helpers_1 = require('../../directives/helpers');
var TicketsPage = (function () {
    function TicketsPage(nav, navParams, config, apiData, ticketProvider) {
        this.nav = nav;
        this.navParams = navParams;
        this.config = config;
        this.apiData = apiData;
        this.ticketProvider = ticketProvider;
        this.term = '';
        this.counts = {};
    }
    TicketsPage.prototype.onPageLoaded = function () {
        this.is_tech = this.config.getCurrent("user").is_techoradmin;
        var param = this.navParams.data || {};
        if (param.count)
            this.counts[param.tab] = param.count;
        if (this.is_tech)
            this.ticket_tab = this.config.current.user.is_limit_assigned_tkts || !param.tab ? "tech" : param.tab;
        else
            this.ticket_tab = "user";
        this.nav.tickets_tab = null;
        if (param.key) {
            this.gotoTicket(param);
        }
    };
    TicketsPage.prototype.onPageDidEnter = function () {
        this.term = "";
    };
    TicketsPage.prototype.addTicket = function () {
        var _this = this;
        var myModal = ionic_angular_1.Modal.create(modals_1.TicketCreatePage);
        myModal.onDismiss(function (data1) {
            _this.gotoTicket(data1);
        });
        this.nav.present(myModal);
    };
    TicketsPage.prototype.gotoTicket = function (data) {
        var _this = this;
        this.test = false;
        this.clearSearch();
        if (data) {
            this.ticketProvider.getTicketsList(this.ticket_tab, "", { "limit": 25 });
            setTimeout(function () {
                _this.nav.push(ticket_details_1.TicketDetailsPage, data);
            }, 500);
        }
    };
    TicketsPage.prototype.searchItems = function (searchbar) {
        var _this = this;
        this.search_results = [];
        var q = searchbar.value;
        if (q.trim() == '' || this.busy) {
            return;
        }
        if (q.length > 1) {
            var timer = setTimeout(function () { _this.busy = true; }, 500);
            this.getItems(q, timer);
        }
    };
    TicketsPage.prototype.getItems = function (term, timer) {
        var _this = this;
        this.search_results = [];
        var url = "tickets?query=all";
        var pager = { limit: 3 };
        var is_ticket = term[term.length - 1] == " " || term[term.length - 1] == ",";
        if (!is_ticket)
            term += "*";
        else
            url = "tickets/" + term.trim() + ",";
        this.apiData.getPaged(helpers_1.addp(url, "search", term), pager).subscribe(function (data) {
            if (timer) {
                clearTimeout(timer);
                _this.busy = false;
            }
            _this.search_results = data;
        }, function (error) {
            if (timer) {
                clearTimeout(timer);
                _this.busy = false;
            }
            console.log(error || 'Server error');
        });
    };
    TicketsPage.prototype.clearSearch = function (searchbar) {
        this.search_results = [];
        this.busy = false;
        if (searchbar)
            searchbar.value = "";
    };
    TicketsPage.prototype.getSearch = function (searchbar) {
        this.test = false;
        this.clearSearch();
        var term = searchbar.target.value;
        if (term.length < 4)
            term += "    ";
        var list = { search: term };
        this.test = false;
        this.nav.push(ajax_search_1.AjaxSearchPage, list);
    };
    TicketsPage = __decorate([
        ionic_angular_1.Page({
            template: '<ion-navbar *navbar><ion-buttons start><button menuToggle><ion-icon name="menu"></ion-icon></button></ion-buttons><ion-title class="names">{{config.current.names.ticket.p}}</ion-title><ion-buttons end><button danger class="right transparent" (click)="test = !test"><ion-icon name="ios-search"></ion-icon></button></ion-buttons></ion-navbar><div class="tickets mycontent"><ion-searchbar *ngIf="test" [focuser] debounce="700" (cancel)="test = !test" (input)="searchItems($event)" [(ngModel)]="term" placeholder="{{config.current.names.ticket.s}} number (2 chars) or Enter to search" (search)="getSearch($event)"></ion-searchbar><img *ngIf="busy" class="imglogo" src="img/loading2.gif"><ion-list class="ajax" [hidden]="!search_results"><a detail-none href="#" ion-item *ngFor="let item of search_results" (click)="gotoTicket(item)"><h2>{{item.status}} | #{{item.number}} - {{item.subject}} ({{item.user_firstname}} {{item.user_lastname}})</h2></a></ion-list><div *ngIf="is_tech" class="tabsTicket"><ion-segment [(ngModel)]="ticket_tab"><ion-segment-button value="user">{{config.current.names.user.a}}</ion-segment-button><ion-segment-button value="tech">{{config.current.names.tech.a}}</ion-segment-button><ion-segment-button value="alt">Alt</ion-segment-button><ion-segment-button *ngIf="!config.current.user.is_limit_assigned_tkts" value="all">All Open</ion-segment-button></ion-segment></div><tickets-list [hidden]="ticket_tab != \'user\' && is_tech" [preload]="ticket_tab == \'user\' ? 0 : 1500" [mode]="[\'user\']" [count]="counts.user"></tickets-list><tickets-list *ngIf="is_tech" [hidden]="ticket_tab != \'tech\'" [preload]="ticket_tab == \'tech\' ? 0 : 1500" [mode]="[\'tech\']" [count]="counts.tech"></tickets-list><tickets-list *ngIf="is_tech" [hidden]="ticket_tab != \'alt\'" [preload]="ticket_tab == \'alt\' ? 0 : 1500" [mode]="[\'alt\']" [count]="counts.alt"></tickets-list><tickets-list *ngIf="is_tech" [hidden]="ticket_tab != \'all\'" [preload]="ticket_tab == \'all\' ? 0 : 1500" [mode]="[\'all\']" [count]="counts.all"></tickets-list></div><button (click)="addTicket()" secondary item-right fab fab-right fab-bottom style="z-index: 2"><ion-icon class="button_circle action-but" name="md-add"></ion-icon></button>',
            directives: [components_1.TicketsListComponent, directives_1.Focuser],
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav, ionic_angular_1.NavParams, ionic_angular_1.Config, providers_1.ApiData, providers_1.TicketProvider])
    ], TicketsPage);
    return TicketsPage;
}());
exports.TicketsPage = TicketsPage;

},{"../../components/components":5,"../../directives/directives":13,"../../directives/helpers":15,"../../providers/providers":58,"../ajax-search/ajax-search":18,"../modals/modals":30,"../ticket-details/ticket-details":39,"ionic-angular":"ionic-angular"}],41:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var core_1 = require('@angular/core');
var helpers_1 = require('../../directives/helpers');
var time_provider_1 = require('../../providers/time-provider');
var class_list_1 = require('../../components/class-list/class-list');
var select_list_1 = require('../../components/select-list/select-list');
var TimelogPage = (function () {
    function TimelogPage(nav, navParams, timeProvider, config, view) {
        this.nav = nav;
        this.navParams = navParams;
        this.timeProvider = timeProvider;
        this.config = config;
        this.view = view;
        this.time = {};
        this.title = "";
        this.selects = {};
        this.minuteValues = [0, 15, 30, 45, 0];
        this.start_time = "";
        this.stop_time = "";
        this.UserDateOffset = -5;
        this.start_stop_hours = 0;
    }
    TimelogPage.prototype.decrement = function () {
        this.timecount = Math.max(Number(this.timecount) - this.inc, 0).toFixed(2);
    };
    TimelogPage.prototype.increment = function () {
        this.timecount = (Number(this.timecount) + this.inc).toFixed(2);
    };
    TimelogPage.prototype.ngAfterViewInit = function () {
    };
    TimelogPage.prototype.AddHours = function (date, hours) {
        if (date) {
            if (date.length == 19)
                date = date.slice(0, -3);
            var temp = new Date(date);
            return new Date(temp.setTime(temp.getTime() + (hours * 60 * 60 * 1000))).toJSON();
        }
        return date;
    };
    TimelogPage.prototype.ngOnInit = function () {
        this.UserDateOffset = this.config.getCurrent("timezone_offset");
        this.time = this.navParams.data || {};
        var name = (this.time.user_name + " " + this.time.user_email).trim().split(' ')[0];
        if (this.time.time_id) {
            this.title = ("Timelog #" + this.time.time_id + " by\u00A0" + name + " on\u00A0") + this.setDate(this.time.date, false, true);
            this.start_time = this.AddHours(this.time.start_time, this.time.time_offset);
            this.stop_time = this.AddHours(this.time.stop_time, this.time.time_offset);
            if (this.start_time && this.stop_time)
                this.start_stop_hours = Number(Math.round((+(new Date(this.stop_time)) - +(new Date(this.start_time))) / 60000) / 60);
        }
        else if (this.time.number)
            this.title = "#" + this.time.number + " " + this.time.subject;
        else
            this.title = "Add Time";
        this.mintime = this.config.getCurrent("time_minimum_time") || 0.25;
        this.mintime = this.mintime > 0 ? this.mintime : 0.25;
        this.isbillable = typeof this.time.billable === 'undefined' ? true : this.time.billable;
        this.inc = this.config.getCurrent("time_hour_increment") > 0 ? this.config.getCurrent("time_hour_increment") : 0.25;
        this.displayFormat = helpers_1.getPickerDateTimeFormat(false, true);
        if (this.inc >= 1)
            this.minuteValues = [0];
        else if (this.inc != 0.25) {
            this.minuteValues = [];
            var min = 0;
            do {
                this.minuteValues.push(min);
                min += 60 * this.inc;
            } while (min < 60);
            this.minuteValues.push(0);
        }
        this.timecount = (this.time.hours || this.mintime).toFixed(2);
        this.timenote = helpers_1.linebreaks(this.time.note || "", true);
        this.he = this.config.getCurrent("user");
        var recent = {};
        if (!this.time.number && !this.time.time_id && !(this.time.account || {}).id) {
            recent = this.config.current.recent || {};
        }
        var account_id = (this.time.account || {}).id || this.time.account_id || (recent.account || {}).selected || this.he.account_id || -1;
        var project_id = (this.time.project || {}).id || this.time.project_id || (recent.project || {}).selected || 0;
        this.selects = {
            "account": {
                name: "Account",
                value: (this.time.account || {}).name || this.time.account_name || (recent.account || {}).value || this.he.account_name,
                selected: account_id,
                url: "accounts?is_with_statistics=false",
                hidden: false
            },
            "project": {
                name: "Project",
                value: this.time.project_name || (recent.project || {}).value || "Default",
                selected: project_id,
                url: "projects?account=" + account_id + "&is_with_statistics=false",
                hidden: false
            },
            "ticket": {
                name: "Ticket",
                value: this.time.ticket_number ? "#" + this.time.ticket_number + ": " + this.time.ticket_subject : "Choose (optional)",
                selected: this.time.ticket_number || 0,
                url: "tickets?status=open&account=" + account_id + "&project=" + project_id,
                hidden: this.time.is_project_log || this.time.task_type_id || false
            },
            "tasktype": {
                name: "Task Type",
                value: this.time.task_type || (recent.tasktype || {}).value || "Choose",
                selected: this.time.task_type_id || this.config.getRecent("tasktype").selected || 0,
                url: this.time.ticket_number ? "task_types?ticket=" + this.time.ticket_number : "task_types?account=" + account_id,
                hidden: false
            }
        };
    };
    TimelogPage.prototype.saveSelect = function (event) {
        var name = event.type;
        var account_id = this.selects.account.selected;
        switch (name) {
            case "account":
                if (this.selects.account.selected === event.id) {
                    break;
                }
                this.selects.project.url = "projects?account=" + event.id + "&is_with_statistics=false";
                this.selects.project.value = "Default";
                this.selects.project.selected = 0;
                account_id = event.id;
                this.selects.ticket.hidden = this.time.is_project_log || this.time.task_type_id || false;
                this.selects.project.hidden = !this.config.current.is_project_tracking;
            case "project":
                if (this.selects.project.selected === event.id) {
                    break;
                }
                if (!this.time.task_type_id) {
                    this.selects.ticket.hidden = this.time.is_project_log || this.time.task_type_id || false;
                    this.selects.ticket.url = "tickets?status=open&account=" + account_id + "&project=" + event.id,
                        this.selects.ticket.value = "Choose (optional)";
                    this.selects.ticket.selected = 0;
                }
                break;
            case "ticket":
                if (this.selects.ticket.selected === event.id) {
                    break;
                }
                this.selects.tasktype.url = event.id ? "task_types?ticket=" + event.id : "task_types?account=" + account_id;
                this.selects.tasktype.value = "Choose";
                this.selects.tasktype.selected = 0;
                break;
        }
        this.selects[name].selected = event.id;
        this.selects[name].value = event.name;
    };
    TimelogPage.prototype.onSubmit = function (form) {
        var _this = this;
        var hours = Number(this.timecount);
        if (hours < this.mintime) {
            this.nav.alert("Not enough time", true);
            return;
        }
        if (this.start_stop_hours && hours > this.start_stop_hours) {
            this.nav.alert("Hours value should be lesser or equal than Start/Stop range.", true);
            return;
        }
        if (!this.selects.tasktype.selected) {
            this.nav.alert("Please, select Task Type from the list.", true);
            return;
        }
        if (form.valid) {
            if (this.time.in_progress && Date.now() - this.time.in_progress < 1500) {
                return;
            }
            this.time.in_progress = Date.now();
            var note = helpers_1.htmlEscape(this.timenote.trim()).substr(0, 5000);
            var isEdit = !!this.time.time_id;
            var time_offset = -1 * (isEdit ? this.time.time_offset : this.UserDateOffset);
            var data_1 = {
                "tech_id": isEdit ? this.time.user_id : this.he.user_id,
                "project_id": this.selects.project.selected,
                "is_project_log": !this.selects.ticket.selected,
                "ticket_key": this.selects.ticket.selected,
                "account_id": this.selects.account.selected,
                "note_text": note,
                "task_type_id": this.selects.tasktype.selected,
                "hours": hours,
                "is_billable": this.isbillable,
                "date": this.AddHours(this.start_time, time_offset) || "",
                "start_date": this.AddHours(this.start_time, time_offset) || "",
                "stop_date": this.AddHours(this.stop_time, time_offset) || ""
            };
            this.timeProvider.addTime(this.time.time_id, data_1, isEdit ? "PUT" : "POST").subscribe(function (res) {
                if (!_this.time.number && !_this.time.time_id && !(_this.time.account || {}).id) {
                    _this.config.setRecent({ "account": _this.selects.account,
                        "project": _this.selects.project,
                        "tasktype": _this.selects.tasktype });
                }
                if (isEdit) {
                    _this.time.start_time = data_1.start_date;
                    _this.time.stop_time = data_1.stop_date;
                    _this.time.hours = data_1.hours;
                    _this.time.is_billable = data_1.is_billable;
                }
                else {
                    var tdate = data_1.date || _this.AddHours(new Date(), _this.UserDateOffset);
                    var tt = {
                        time_id: 0,
                        account_id: data_1.account_id,
                        account_name: _this.selects.account.value,
                        billable: data_1.is_billable,
                        date: tdate,
                        hours: data_1.hours,
                        is_project_log: data_1.is_project_log,
                        note: data_1.note_text,
                        project_id: data_1.project_id,
                        project_name: _this.selects.project.value,
                        start_time: data_1.start_date,
                        stop_time: data_1.stop_date,
                        time_offset: time_offset,
                        task_type: _this.selects.tasktype.value,
                        task_type_id: data_1.task_type_id,
                        ticket_number: data_1.ticket_key,
                        ticket_subject: _this.selects.ticket.value,
                        user_email: _this.he.email,
                        user_id: _this.he.user_id,
                        user_name: _this.he.firstname + " " + _this.he.lastname };
                    (_this.timeProvider._dataStore[_this.time.cachename] || []).splice(0, 0, tt);
                }
                _this.nav.alert('Time was successfully ' + (isEdit ? 'updated' : 'added') + ' :)');
                _this.close();
            }, function (error) {
                console.log(error || 'Server error');
            });
        }
    };
    TimelogPage.prototype.setDate = function (date, showmonth, istime) {
        return date ? helpers_1.getDateTime(date, showmonth, istime) : null;
    };
    TimelogPage.prototype.setMinTime = function (date) {
        return (date || this.time.date || this.AddHours(new Date(), this.UserDateOffset)).substring(0, 4);
    };
    TimelogPage.prototype.setMaxTime = function (date) {
        return (date || this.time.date || this.AddHours(new Date(), this.UserDateOffset)).substring(0, 4);
    };
    TimelogPage.prototype.getStartDate = function (time) {
        return (time || this.time.date || this.AddHours(new Date(), this.UserDateOffset)).substring(0, 19);
    };
    TimelogPage.prototype.setStartDate = function (time) {
        if (time) {
            this.start_time = time.substring(0, 19);
            if (this.stop_time) {
                this.updateHours();
            }
        }
    };
    TimelogPage.prototype.setStopDate = function (time) {
        if (time) {
            this.stop_time = time.substring(0, 19);
            if (this.start_time) {
                this.updateHours();
            }
        }
    };
    TimelogPage.prototype.updateHours = function () {
        var timecount = Math.round((+(new Date(this.stop_time)) - +(new Date(this.start_time))) / 60000);
        if (timecount < 0) {
            this.start_time = this.AddHours(this.start_time, -24);
            this.start_stop_hours = Number(24 + timecount / 60);
        }
        else
            this.start_stop_hours = Number(timecount / 60);
        this.timecount = this.start_stop_hours.toFixed(2);
    };
    TimelogPage.prototype.getFixed = function (value) {
        return Number(value || "0").toFixed(2).toString();
    };
    TimelogPage.prototype.close = function () {
        this.view.dismiss();
    };
    TimelogPage = __decorate([
        ionic_angular_1.Page({
            template: '<ion-toolbar><button (click)="close()" class="bar-button bar-button-default"><span *ngIf="title?.length < 9" primary>Cancel</span><ion-icon *ngIf="title?.length > 9" primary class="invoiceCircle" name="ios-arrow-back"></ion-icon></button><ion-title class="ellipsis padding-right24">{{title}}</ion-title></ion-toolbar><ion-content class="timelog"><div class="list max-width700"><div class="img-top"><a detail-none href="#" (click)="decrement()" class="left width30 button-timelog"><ion-item no-lines class="width100 blue4"><ion-icon name="remove" class="padding-left8"></ion-icon></ion-item></a><ion-item no-lines class="blue3 left width30 button-timelog line-height5 height51"><ion-input class="timelog-input width100 right margin padding-1px" [(ngModel)]="timecount"></ion-input></ion-item><a detail-none href="#" (click)="increment()" class="right width30 button-timelog dashboardRight"><ion-item no-lines class="width100 blue4"><ion-icon name="add" class="padding-left8"></ion-icon></ion-item></a></div><ion-item no-lines class="start-end top0">Start Time</ion-item><ion-item no-lines class="blue3 top0 bottom5"><ion-label class="start-end2">Start Time</ion-label><ion-datetime [ngClass]="{\'nocolor\': !start_time, \'text-color\': start_time}" #starttime [displayFormat]="displayFormat" [min]="setMinTime(start_time)" [max]="setMaxTime(stop_time)" [minuteValues]="minuteValues" (ngModelChange)="setStartDate($event)" [ngModel]="getStartDate(start_time)"></ion-datetime></ion-item><div class="general-alignment2"><ion-item no-lines class="start-end">End Time</ion-item><ion-item no-lines class="blue3 top0 bottom5"><ion-label class="start-end2">End Time</ion-label><ion-datetime [ngClass]="{\'nocolor\': !stop_time, \'text-color\': stop_time}" #stoptime [displayFormat]="displayFormat" [min]="setMinTime(start_time)" [max]="setMaxTime(stop_time)" [minuteValues]="minuteValues" (ngModelChange)="setStopDate($event)" [ngModel]="getStartDate(stop_time)"></ion-datetime></ion-item></div><div class="general-alignment2"><select-list *ngIf="!time.number" [list]="selects.account" ajax="true" preload="true" (onChanged)="saveSelect($event)"></select-list><select-list *ngIf="!time.number" [list]="selects.project" preload="true" (onChanged)="saveSelect($event)"></select-list><select-list *ngIf="!time.number" [list]="selects.ticket" preload="true" (onChanged)="saveSelect($event)"></select-list><select-list [list]="selects.tasktype" preload="true" (onChanged)="saveSelect($event)"></select-list></div><form #addForm="ngForm"><ion-item no-lines class="left toggle-width"><ion-toggle class="toggle" [(ngModel)]="isbillable"></ion-toggle></ion-item><p class="left width30 text-toggle color">Billable</p><textarea class="width100 textLogin commentText" type="text" placeholder="I completed..." [(ngModel)]="timenote" ngControl="note" #note="ngForm" maxlength="4000">{{time.note}}</textarea><div class="img-top"><button secondary block type="submit" class="disable-hover button button-default button-block" [disabled]="!addForm.valid" (click)="onSubmit(addForm)">{{time.time_id ? \'Update\' : \'Add\'}} Time</button> <span class="span-block"></span></div></form></div></ion-content>',
            directives: [class_list_1.ClassListComponent, core_1.forwardRef(function () { return select_list_1.SelectListComponent; })],
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav, ionic_angular_1.NavParams, time_provider_1.TimeProvider, ionic_angular_1.Config, ionic_angular_1.ViewController])
    ], TimelogPage);
    return TimelogPage;
}());
exports.TimelogPage = TimelogPage;

},{"../../components/class-list/class-list":4,"../../components/select-list/select-list":9,"../../directives/helpers":15,"../../providers/time-provider":60,"@angular/core":"@angular/core","ionic-angular":"ionic-angular"}],42:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var time_provider_1 = require('../../providers/time-provider');
var helpers_1 = require('../../directives/helpers');
var timelog_1 = require('../timelog/timelog');
var action_button_1 = require('../../components/action-button/action-button');
var helpers_2 = require('../../directives/helpers');
var pipes_1 = require('../../pipes/pipes');
var TimelogsPage = (function () {
    function TimelogsPage(nav, timeProvider, config, navParams, view) {
        this.nav = nav;
        this.timeProvider = timeProvider;
        this.config = config;
        this.navParams = navParams;
        this.view = view;
        this.LIMIT = 25;
        this.is_empty = false;
        this.initial_load = true;
        this.pager = { page: 0, limit: this.LIMIT };
    }
    TimelogsPage.prototype.onPageLoaded = function () {
        this.params = this.navParams.data || {};
        this.pager = { page: 0 };
        this.params.account = { id: this.params.account_id || "", name: this.params.account_name || "" };
        this.cachename = helpers_1.addp("time", "account", this.params.account.id);
        this.cachelen = (this.timeProvider._dataStore[this.cachename] || {}).length;
        if (this.params.is_empty)
            this.params.count = 0;
        if (this.params.count !== 0) {
            this.getTimeLogs();
        }
        else
            this.is_empty = true;
    };
    TimelogsPage.prototype.getTimeLogs = function () {
        var _this = this;
        this.timeProvider.getTimelogs(this.params.account.id, this.pager);
        this.timelogs = this.timeProvider.times$[this.cachename];
        if (!this.cachelen) {
            var timer = setTimeout(function () {
                _this.busy = true;
            }, 500);
            setTimeout(function () {
                _this.busy = false;
            }, 3000);
            this.timelogs.subscribe(function (data) {
                clearTimeout(timer);
                _this.busy = false;
                _this.is_empty = !data.length;
            });
        }
    };
    TimelogsPage.prototype.onPageWillEnter = function () {
        if (this.params.account_name)
            this.view.setBackButtonText('');
        if (!this.initial_load)
            this.getTimeLogs();
        this.initial_load = false;
    };
    TimelogsPage.prototype.doInfinite = function (infiniteScroll) {
        var _this = this;
        if (this.is_empty || (this.cachelen > 0 && (this.cachelen >= this.params.count || this.cachelen < this.LIMIT)) || (this.params.count > 0 && (this.params.count < this.LIMIT))) {
            infiniteScroll.enable(false);
            infiniteScroll.complete();
            return;
        }
        this.pager.page += 1;
        var cachedlen = (this.timeProvider._dataStore[this.cachename] || {}).length;
        this.timeProvider.getTimelogs(this.params.account.id, this.pager);
        this.timelogs.subscribe(function (data) {
            infiniteScroll.complete();
            var len = data.length;
            infiniteScroll.enable(!(cachedlen == len || len % _this.LIMIT));
            _this.cachelen = len;
        });
    };
    TimelogsPage.prototype.itemTapped = function (time) {
        time = time || {};
        time.account = time.account || this.params.account;
        time.cachename = this.cachename;
        this.nav.push(timelog_1.TimelogPage, time);
    };
    TimelogsPage.prototype.setDate = function (date, showmonth, istime) {
        return date ? helpers_2.getDateTime(date, showmonth, istime) : null;
    };
    TimelogsPage.prototype.getFixed = function (value) {
        return Number(value || "0").toFixed(2).toString();
    };
    TimelogsPage = __decorate([
        ionic_angular_1.Page({
            template: '<ion-navbar *navbar><button menuToggle><ion-icon name="menu"></ion-icon></button><ion-title class="padding-right24">Timelogs {{params.account_name ? "of&nbsp;" + params.account.name : ""}}</ion-title></ion-navbar><ion-content><ion-list class="list general-alignment2" no-lines><img *ngIf="busy" class="imglogo img-padding" src="img/loading2.gif"><ion-item-sliding class="timelog-item" *ngFor="let time of timelogs | async" #slidingItem><a detail-none href="#" ion-item (click)="itemTapped(time)"><ion-avatar padding item-left><li><img class="img_avatar" [alt]="time.user_firstname" [src]="time.user_email | Gravatar"><p>{{time.user_name}} {{time.user_lastname}}</p></li></ion-avatar><div><li class="font-hours"><ion-icon name="time">&nbsp;</ion-icon><h2>{{getFixed(time.hours)}}</h2><p>{{setDate(time.date)}}</p></li><span class="timelog-span"><h3 [innerHTML]="((time.ticket_number ? (\'#\'+time.ticket_number+\': \'+time.ticket_subject + (time.note ? \' - \' : \'\')) : \'\') + time.note) | Linebreaks"></h3></span></div></a></ion-item-sliding></ion-list><div *ngIf="is_empty" class="table grey2 menu-text">No Timelogs yet</div><ion-infinite-scroll (infinite)="doInfinite($event)" threshold="30%"><ion-infinite-scroll-content loadingSpinner="circles" loadingText="Loading more data..."></ion-infinite-scroll-content></ion-infinite-scroll></ion-content><button (click)="itemTapped()" secondary item-right fab fab-right fab-bottom style="z-index: 2"><ion-icon class="button_circle action-but" name="md-add"></ion-icon></button>',
            directives: [action_button_1.ActionButtonComponent],
            pipes: [pipes_1.GravatarPipe, pipes_1.MorePipe, pipes_1.LinebreaksPipe],
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav, time_provider_1.TimeProvider, ionic_angular_1.Config, ionic_angular_1.NavParams, ionic_angular_1.ViewController])
    ], TimelogsPage);
    return TimelogsPage;
}());
exports.TimelogsPage = TimelogsPage;

},{"../../components/action-button/action-button":3,"../../directives/helpers":15,"../../pipes/pipes":53,"../../providers/time-provider":60,"../timelog/timelog":41,"ionic-angular":"ionic-angular"}],43:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var helpers_1 = require('../../directives/helpers');
var todo_provider_1 = require('../../providers/todo-provider');
var TodoCreatePage = (function () {
    function TodoCreatePage(nav, navParams, todoProvider, config, view) {
        this.nav = nav;
        this.navParams = navParams;
        this.todoProvider = todoProvider;
        this.config = config;
        this.view = view;
        this.UserDateOffset = -5;
        this.he = config.current.user;
    }
    TodoCreatePage.prototype.ngOnInit = function () {
        this.todo = this.navParams.data || {};
        this.UserDateOffset = this.config.getCurrent("timezone_offset");
        this.displayFormat = helpers_1.getPickerDateTimeFormat(false, false);
        this.todo.due_date = this.todo.due_date ? this.AddHours(this.todo.due_date, this.UserDateOffset) : "";
    };
    TodoCreatePage.prototype.AddHours = function (date, hours) {
        if (date) {
            if (date.length == 19)
                date = date.slice(0, -3);
            var temp = new Date(date);
            return new Date(temp.setTime(temp.getTime() + (hours * 60 * 60 * 1000))).toJSON();
        }
        return date;
    };
    TodoCreatePage.prototype.onSubmit = function (form) {
        var _this = this;
        var hours = this.todo.estimated_remain || "";
        if (form.valid) {
            if (hours) {
                if (~hours.indexOf('.')) {
                    var parts = hours.split('.');
                    hours = Number(parts[0]) + Number(parts[1]) / 60;
                }
                else if (~hours.indexOf(':')) {
                    var parts = hours.split(':');
                    hours = Number(parts[0]) + Number(parts[1]) / 60;
                }
                else if (Number(hours)) {
                    hours = Number(hours);
                }
            }
            else
                hours = 0;
            if (this.todo.in_progress && Date.now() - this.todo.in_progress < 2500) {
                return;
            }
            this.todo.in_progress = Date.now();
            var data = {
                task_id: null,
                title: this.todo.title,
                text: this.todo.note,
                assigned_id: this.he.user_id,
                estimated_remain: hours,
                due_date: this.AddHours(this.todo.due_date, -1 * this.UserDateOffset) || "",
                notify: false,
                list_id: this.todo.list_id,
                ticket_key: null,
                project_id: 0
            };
            this.todoProvider.addTodo(data).subscribe(function (data) {
                _this.nav.alert('Todo was successfully added :)');
                _this.todoProvider.getTodos(_this.he.user_id, { page: 0, limit: 5000 });
                setTimeout(function () { return _this.close(); }, 500);
            }, function (error) {
                console.log(error || 'Server error');
            });
        }
    };
    TodoCreatePage.prototype.setMinTime = function (date) {
        return (date || this.todo.due_date || this.AddHours(new Date(), this.UserDateOffset)).substring(0, 4);
    };
    TodoCreatePage.prototype.getStartDate = function (time) {
        return (time || this.todo.due_date || this.AddHours(new Date(), this.UserDateOffset)).substring(0, 19);
    };
    TodoCreatePage.prototype.setStartDate = function (time) {
        if (time) {
            this.todo.due_date = time.substring(0, 19);
        }
    };
    TodoCreatePage.prototype.close = function () {
        this.view.dismiss();
    };
    TodoCreatePage = __decorate([
        ionic_angular_1.Page({
            template: '<ion-toolbar><button (click)="close()" class="bar-button bar-button-default"><span *ngIf="title?.length < 15" primary>Cancel</span><ion-icon *ngIf="title?.length > 15" primary class="invoiceCircle" name="ios-arrow-back"></ion-icon></button><ion-title class="ellipsis padding-right24">Add ToDo</ion-title></ion-toolbar><ion-content class="expense-create"><form #addForm="ngForm"><ion-list class="list max-width700 general-alignment" no-lines><div class="tooltips"><input [(ngModel)]="todo.title" class="width100 blue3 subject-create commentText margin-bottom3" placeholder="Title" ngControl="title" required maxlength="100"></div><br><textarea [(ngModel)]="todo.note" ngControl="note" #note="ngForm" class="width100 textLogin commentText margin" type="text" placeholder="Note" maxlength="4000"></textarea><br><div class="general-alignment2"><ion-item no-lines class="start-end">Due Date</ion-item><ion-item no-lines class="blue3 top0 bottom5"><ion-label class="start-end2">Due Date</ion-label><ion-datetime [ngClass]="{\'nocolor\': !todo.due_date, \'text-color\': todo.due_date}" #due_date [displayFormat]="displayFormat" [min]="setMinTime(todo.due_date)" (ngModelChange)="setStartDate($event)" [ngModel]="getStartDate(todo.due_date)"></ion-datetime></ion-item></div><br><textarea [(ngModel)]="todo.estimated_remain" class="width100 textLogin commentText subject-create" type="text" placeholder="Est. Time hh:mm"></textarea><br><div><button (click)="onSubmit(addForm)" secondary block type="submit" [disabled]="!addForm.valid" class="disable-hover button button-default button-block">Add ToDo</button></div></ion-list></form></ion-content>',
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav, ionic_angular_1.NavParams, todo_provider_1.TodoProvider, ionic_angular_1.Config, ionic_angular_1.ViewController])
    ], TodoCreatePage);
    return TodoCreatePage;
}());
exports.TodoCreatePage = TodoCreatePage;

},{"../../directives/helpers":15,"../../providers/todo-provider":61,"ionic-angular":"ionic-angular"}],44:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var todo_create_1 = require('../todo-create/todo-create');
var components_1 = require('../../components/components');
var TodosPage = (function () {
    function TodosPage(nav, config, navParams) {
        this.nav = nav;
        this.config = config;
        this.navParams = navParams;
        this.is_empty = false;
    }
    TodosPage.prototype.onPageLoaded = function () {
        this.params = this.navParams.data || {};
        this.params.user = { id: this.params.user_id || this.config.current.user.user_id, name: this.params.user_name || "" };
    };
    TodosPage.prototype.AddTodo = function () {
        var myModal = ionic_angular_1.Modal.create(todo_create_1.TodoCreatePage, { "list_id": "" });
        this.nav.present(myModal);
    };
    TodosPage = __decorate([
        ionic_angular_1.Page({
            template: '<ion-navbar *navbar><button menuToggle><ion-icon name="menu"></ion-icon></button><ion-title class="padding-right24">ToDo\'s</ion-title></ion-navbar><ion-content><todo-list></todo-list></ion-content><button (click)="AddTodo()" secondary item-right fab fab-right fab-bottom style="z-index: 2"><ion-icon class="button_circle action-but" name="md-add"></ion-icon></button>',
            directives: [components_1.TodoListComponent],
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav, ionic_angular_1.Config, ionic_angular_1.NavParams])
    ], TodosPage);
    return TodosPage;
}());
exports.TodosPage = TodosPage;

},{"../../components/components":5,"../todo-create/todo-create":43,"ionic-angular":"ionic-angular"}],45:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var data_provider_1 = require('../../providers/data-provider');
var pipes_1 = require('../../pipes/pipes');
var invoice_details_1 = require('../invoice-details/invoice-details');
var helpers_1 = require('../../directives/helpers');
var UnInvoicesPage = (function () {
    function UnInvoicesPage(nav, dataProvider, config, navParams, view) {
        this.nav = nav;
        this.dataProvider = dataProvider;
        this.config = config;
        this.navParams = navParams;
        this.view = view;
        this.LIMIT = 15;
        this.is_empty = false;
        this.invoices = [];
        nav.swipeBackEnabled = false;
    }
    UnInvoicesPage.prototype.onPageLoaded = function () {
        var _this = this;
        this.params = this.navParams.data || {};
        this.pager = { page: 0, limit: this.LIMIT };
        this.params.account = { id: this.params.account_id || 0, name: this.params.account_name || this.config.getCurrent("user").account_name };
        if (this.params.is_empty)
            this.params.count = 0;
        if (this.params.count !== 0) {
            var timer = setTimeout(function () {
                _this.busy = true;
            }, 500);
            this.getItems(null, timer);
        }
        else
            this.is_empty = true;
    };
    UnInvoicesPage.prototype.onPageWillEnter = function () {
        if (this.params.account_name)
            this.view.setBackButtonText('');
    };
    UnInvoicesPage.prototype.getItems = function (infiniteScroll, timer) {
        var _this = this;
        this.dataProvider.getInvoices(this.params.account.id, false, this.pager).subscribe(function (data) {
            if (timer) {
                _this.is_empty = !data.length;
                clearTimeout(timer);
                _this.busy = false;
                _this.invoices = data;
            }
            else
                (_a = _this.invoices).push.apply(_a, data);
            if (infiniteScroll) {
                infiniteScroll.enable(data.length == _this.LIMIT);
                infiniteScroll.complete();
            }
            _this.count = data.length;
            var _a;
        }, function (error) {
            if (timer) {
                clearTimeout(timer);
                _this.busy = false;
            }
            console.log(error || 'Server error');
        });
    };
    UnInvoicesPage.prototype.doInfinite = function (infiniteScroll) {
        if (this.is_empty || this.count < this.LIMIT) {
            infiniteScroll.enable(false);
            infiniteScroll.complete();
            return;
        }
        this.pager.page += 1;
        this.getItems(infiniteScroll, null);
    };
    UnInvoicesPage.prototype.itemTapped = function (item) {
        this.nav.push(invoice_details_1.InvoiceDetailsPage, item);
    };
    UnInvoicesPage.prototype.setDate = function (date, showmonth, istime) {
        return helpers_1.getDateTime(date || new Date(), showmonth, istime);
    };
    UnInvoicesPage.prototype.getCurrency = function (value) {
        return helpers_1.getCurrency(value);
    };
    UnInvoicesPage = __decorate([
        ionic_angular_1.Page({
            template: '<ion-navbar *navbar><button menuToggle><ion-icon name="menu"></ion-icon></button><ion-title class="padding-right24">Create Invoices {{params.account_name ? "on&nbsp;" + params.account.name : ""}}</ion-title></ion-navbar><ion-content padding><img *ngIf="busy" class="imglogo img-padding" src="img/loading2.gif"><div *ngIf="is_empty" class="table grey2 menu-text">No Invoices yet</div><div><ion-list class="general-alignment2"><a detail-none href="#" ion-item class="margin" (click)="itemTapped(invoice)" *ngFor="let invoice of invoices"><p class="width45 tkts-table left invoices color padding-top6">{{setDate(invoice.end_date || invoice.date, true)}}</p><h2 class="width55 tkts-table right color">{{invoice.account_name || invoice.customer}}</h2><p item-right class="text width30 text-right color">{{getCurrency(invoice.total_cost)}}</p></a></ion-list><ion-infinite-scroll (infinite)="doInfinite($event)" threshold="30%"><ion-infinite-scroll-content loadingSpinner="circles" loadingText="Loading more data..."></ion-infinite-scroll-content></ion-infinite-scroll></div></ion-content>',
            pipes: [pipes_1.MorePipe],
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Nav, data_provider_1.DataProvider, ionic_angular_1.Config, ionic_angular_1.NavParams, ionic_angular_1.ViewController])
    ], UnInvoicesPage);
    return UnInvoicesPage;
}());
exports.UnInvoicesPage = UnInvoicesPage;

},{"../../directives/helpers":15,"../../pipes/pipes":53,"../../providers/data-provider":56,"../invoice-details/invoice-details":22,"ionic-angular":"ionic-angular"}],46:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var CapitalizePipe = (function () {
    function CapitalizePipe() {
    }
    CapitalizePipe.prototype.transform = function (value, args) {
        if (value) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
        return value;
    };
    CapitalizePipe = __decorate([
        core_1.Pipe({
            name: 'Capitalize'
        }), 
        __metadata('design:paramtypes', [])
    ], CapitalizePipe);
    return CapitalizePipe;
}());
exports.CapitalizePipe = CapitalizePipe;

},{"@angular/core":"@angular/core"}],47:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var DaysoldPipe = (function () {
    function DaysoldPipe() {
    }
    DaysoldPipe.prototype.transform = function (value) {
        value = value || 0;
        if (isNaN(value))
            value = Math.round((Date.now() - +new Date(value)) / 60000);
        var daysOld = value / 60;
        var result = "";
        if (!value || value < 15)
            result = "a minute ago";
        else if (value < 60)
            result = "within hour";
        else if (daysOld > 24) {
            result = parseInt((daysOld / 24).toString()) + " days ago";
        }
        else {
            result = parseInt(daysOld.toString()) + " hours ago";
        }
        return result;
    };
    DaysoldPipe = __decorate([
        core_1.Pipe({
            name: 'Daysold'
        }), 
        __metadata('design:paramtypes', [])
    ], DaysoldPipe);
    return DaysoldPipe;
}());
exports.DaysoldPipe = DaysoldPipe;

},{"@angular/core":"@angular/core"}],48:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var helpers_1 = require('../directives/helpers');
var FilesPipe = (function () {
    function FilesPipe() {
    }
    FilesPipe.prototype.transform = function (value, args) {
        var isPhonegap = localStorage.getItem("isPhonegap") === "true";
        value = value || "";
        var files = args || [];
        if (!value || !files || files.length == 0 ||
            !(~value.indexOf("cid:") || ~value.indexOf("ollowing file")))
            return value;
        files.sort(function (a, b) {
            return b.name.length - a.name.length;
        });
        value = helpers_1.FileUrlHelper.addUrls(value, files);
        return value;
    };
    FilesPipe = __decorate([
        core_1.Pipe({
            name: 'Files'
        }), 
        __metadata('design:paramtypes', [])
    ], FilesPipe);
    return FilesPipe;
}());
exports.FilesPipe = FilesPipe;

},{"../directives/helpers":15,"@angular/core":"@angular/core"}],49:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var md5Hex = require('md5-hex');
var GravatarPipe = (function () {
    function GravatarPipe() {
    }
    GravatarPipe.prototype.transform = function (value, args) {
        var hash = "";
        if (value) {
            hash = md5Hex(value);
        }
        else
            return "img/def_ava.png";
        return "https://secure.gravatar.com/avatar/" + hash + "?s=80&d=mm";
    };
    GravatarPipe = __decorate([
        core_1.Pipe({
            name: 'Gravatar'
        }), 
        __metadata('design:paramtypes', [])
    ], GravatarPipe);
    return GravatarPipe;
}());
exports.GravatarPipe = GravatarPipe;

},{"@angular/core":"@angular/core","md5-hex":"md5-hex"}],50:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var HtmlsafePipe = (function () {
    function HtmlsafePipe() {
    }
    HtmlsafePipe.prototype.transform = function (value, args) {
        value = (value || "").trim();
        if (value.length) {
            var element = document.createElement('div');
            var entity = /&(?:#x[a-f0-9]+|#[0-9]+|[a-z0-9]+);?/ig;
            value = value.replace(entity, function (m) {
                element.innerHTML = m;
                return element.textContent;
            });
            element.textContent = '';
        }
        return value;
    };
    HtmlsafePipe = __decorate([
        core_1.Pipe({
            name: 'Htmlsafe'
        }), 
        __metadata('design:paramtypes', [])
    ], HtmlsafePipe);
    return HtmlsafePipe;
}());
exports.HtmlsafePipe = HtmlsafePipe;

},{"@angular/core":"@angular/core"}],51:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var helpers_1 = require('../directives/helpers');
var LinebreaksPipe = (function () {
    function LinebreaksPipe() {
    }
    LinebreaksPipe.prototype.transform = function (value, args) {
        return helpers_1.linebreaks(value, args);
    };
    LinebreaksPipe = __decorate([
        core_1.Pipe({
            name: 'Linebreaks'
        }), 
        __metadata('design:paramtypes', [])
    ], LinebreaksPipe);
    return LinebreaksPipe;
}());
exports.LinebreaksPipe = LinebreaksPipe;

},{"../directives/helpers":15,"@angular/core":"@angular/core"}],52:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var MorePipe = (function () {
    function MorePipe() {
    }
    MorePipe.prototype.transform = function (value, args) {
        args = args || [100, "VV"];
        value = value || 0;
        var max = args[0];
        var template = args[1] || "VV";
        if (value >= max) {
            value = (max - 1) + "<sup>+</sup>";
        }
        else {
            var s_value = value.toString();
            if (~template.indexOf("$") || ~s_value.indexOf("."))
                value = value.toFixed(value > 99 && ~s_value.indexOf(".00") ? 0 : 2);
        }
        if (~template.indexOf("$"))
            template = template.replace("$", localStorage.getItem("currency"));
        value = template.replace("VV", value);
        return value;
    };
    MorePipe = __decorate([
        core_1.Pipe({
            name: 'More'
        }), 
        __metadata('design:paramtypes', [])
    ], MorePipe);
    return MorePipe;
}());
exports.MorePipe = MorePipe;

},{"@angular/core":"@angular/core"}],53:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require('./more'));
__export(require('./capitalize'));
__export(require('./linebreaks'));
__export(require('./htmlsafe'));
__export(require('./gravatar'));
__export(require('./daysold'));
__export(require('./files'));

},{"./capitalize":46,"./daysold":47,"./files":48,"./gravatar":49,"./htmlsafe":50,"./linebreaks":51,"./more":52}],54:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var ionic_angular_1 = require('ionic-angular');
var http_1 = require('@angular/http');
var rxjs_1 = require('rxjs');
var config_1 = require('./config');
var helpers_1 = require('../directives/helpers');
var mocks_1 = require('./mocks');
require('rxjs');
var ApiData = (function () {
    function ApiData(http, config, events) {
        this.http = http;
        this.config = config;
        this.events = events;
    }
    ApiData.prototype.request = function (method, data, type, headers) {
        var _this = this;
        if (config_1.dontClearCache) {
            return this.mock_get(method);
        }
        var req = new http_1.Request({
            method: type || 'GET',
            url: config_1.ApiSite + method,
            headers: headers,
            body: JSON.stringify(data)
        });
        return this.http.request(req)
            .map(function (res) { return res.json(); })
            .catch(function (error) {
            return _this.handleError(error);
        });
    };
    ApiData.prototype.mock_get = function (method) {
        var arr = null;
        var pos = method.indexOf('?');
        if (pos != -1)
            method = method.substring(0, pos);
        arr = mocks_1.MOCKS[method];
        return rxjs_1.Observable.create(function (observer) {
            observer.next(arr);
            observer.complete();
        });
    };
    ApiData.prototype.get = function (method, data, type) {
        var key = this.config.getCurrent("key"), org = this.config.getCurrent("org"), inst = this.config.getCurrent("instance");
        if (!key || !org || !inst || key.length != 32) {
            return this.handleError("403: Invalid organization!");
        }
        var headers = new http_1.Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(org + "-" + inst + ":" + key)
        });
        return this.request(method, data, type, headers);
    };
    ApiData.prototype.processData = function (data) {
        return data;
    };
    ApiData.prototype.getPager = function (url, pager) {
        if (pager) {
            if (pager.limit)
                url = helpers_1.addp(url, "limit", pager.limit);
            if (pager.page)
                url = helpers_1.addp(url, "page", pager.page);
        }
        return url;
    };
    ApiData.prototype.getPaged = function (url, pager) {
        url = this.getPager(url, pager);
        return this.get(url);
    };
    ApiData.prototype.handleError = function (error) {
        var message = "";
        try {
            var e = JSON.parse(error._body);
            if (typeof e === 'string')
                message = e;
            else
                message = ((e || {}).ResponseStatus || {}).Message;
        }
        catch (e) {
            message = error._body;
            if (message == "[object ProgressEvent]")
                message = "Cannot connect to API server";
        }
        message = message || "Error. Please contact Administrator";
        var url = error.url || "";
        var status = (error.status || {}).toString();
        message += " (" + status + ") ";
        if ((status == "403" && !~url.indexOf("organizations")) || ~url.indexOf("config") || ~message.indexOf("User with token")) {
            this.events.publish("login:failed");
        }
        this.events.publish("connection:error", (message || "Error occured") + " Please contact Administator!");
        return rxjs_1.Observable.throw(new Error(message));
    };
    ApiData = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, ionic_angular_1.Config, ionic_angular_1.Events])
    ], ApiData);
    return ApiData;
}());
exports.ApiData = ApiData;

},{"../directives/helpers":15,"./config":55,"./mocks":57,"@angular/core":"@angular/core","@angular/http":"@angular/http","ionic-angular":"ionic-angular","rxjs":"rxjs"}],55:[function(require,module,exports){
"use strict";
exports.isPhonegap = false;
exports.dontClearCache = false;
exports.isSD = true;
exports.Site = exports.isSD ? 'sherpadesk.com/' : 'bigwebapps.com/';
exports.MobileSite = 'https://m0.' + exports.Site;
exports.AppSite = 'https://app.beta.' + exports.Site;
exports.ApiSite = 'https://api.beta.' + exports.Site;
exports.year = "2017";
exports.appVersion = "39";
exports.AppTitle = exports.isSD ? 'SherpaDesk ' : 'HelpDesk ';

},{}],56:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var api_data_1 = require('./api-data');
var helpers_1 = require('../directives/helpers');
require('rxjs');
var DataProvider = (function () {
    function DataProvider(apiData) {
        this.apiData = apiData;
        this.data$ = {};
        this._dataObserver = {};
        this._dataStore = {};
    }
    DataProvider.prototype.checkLogin = function (username, password) {
        if (!username || !password) {
            return this.apiData.handleError("Please enter login and password!");
        }
        var url = "login";
        var headers = new http_1.Headers({
            'Content-Type': 'text/plain;charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*',
            'Authorization': 'Basic ' + btoa(username + ":" + password)
        });
        return this.apiData.request(url, "", "POST", headers);
    };
    DataProvider.prototype.getOrganizations = function (token) {
        if (!token || token.length != 32) {
            return this.apiData.handleError("Invalid token!");
        }
        var url = "organizations";
        var headers = new http_1.Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa("x:" + token)
        });
        return this.apiData.request(url, " ", "", headers);
    };
    DataProvider.prototype.registerOrganization = function (data) {
        var url = "organizations";
        var headers = new http_1.Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        });
        return this.apiData.request(url, data, "POST", headers);
    };
    DataProvider.prototype.deleteFile = function (data) {
        var url = "files/" + data.file_id;
        return this.apiData.get(url, data, "DELETE");
    };
    DataProvider.prototype.getConfig = function () {
        var url = "config";
        return this.apiData.get(url);
    };
    DataProvider.prototype.updateBadge = function () {
        if (window.cordova && ((cordova.plugins || {}).notification || {}).badge) {
            if (localStorage.badge > 0) {
                cordova.plugins.notification.badge.set(localStorage.badge);
            }
            else
                cordova.plugins.notification.badge.clear();
        }
    };
    DataProvider.prototype.getQueueList = function (limit) {
        var _this = this;
        var url = helpers_1.addp("queues", "sort_by", "tickets_count");
        return this.apiData.get(url).map(function (arr) {
            var nt = arr.filter(function (val) { return val.fullname.toLowerCase().indexOf("new ticket") == 0; });
            var badge = 0;
            if (nt && nt.length > 0)
                badge = nt[0].tickets_count;
            localStorage.badge = badge;
            _this.updateBadge();
            if (arr && limit) {
                arr = arr.filter(function (val) { return val.tickets_count > 0; }).slice(0, limit);
            }
            return arr;
        });
    };
    DataProvider.prototype.getInvoices = function (account_id, status, pager) {
        var url = helpers_1.addp("invoices", "account", account_id);
        if (status === false)
            url = helpers_1.addp(url, "status", "unbilled");
        return this.apiData.getPaged(url, pager);
    };
    DataProvider.prototype.getInvoice = function (id, account_id, project_id) {
        var url = "invoices";
        var data = {};
        if (!id) {
            url = helpers_1.addp(url, "status", "unbilled");
            url = helpers_1.addp(url, "account", account_id);
            url = helpers_1.addp(url, "project", project_id);
        }
        else {
            url += "/" + id;
            url = helpers_1.addp(url, "action", "sendEmail");
        }
        return this.apiData.get(url, data);
    };
    DataProvider.prototype.getExpenses = function (account_id, pager) {
        var url = helpers_1.addp("expenses", "account", account_id);
        return this.apiData.getPaged(url, pager);
    };
    DataProvider.prototype.getPriorities = function () {
        return this.apiData.get("priorities");
    };
    DataProvider.prototype.getAccountList = function (is_dashboard, pager, is_no_stat, is_open) {
        var url = "accounts";
        if (is_no_stat)
            url = helpers_1.addp(url, "is_with_statistics", "false");
        if (is_open)
            url = helpers_1.addp(url, "is_open_tickets", "true");
        return this.apiData.getPaged(url, pager).map(function (arr) {
            if (is_dashboard && arr) {
                arr = arr.filter(function (val) { return val.account_statistics.ticket_counts.open > 0; });
            }
            return arr;
        });
    };
    DataProvider.prototype.getAccountDetails = function (id, is_no_stat) {
        var url = "accounts/" + id;
        if (is_no_stat)
            url = helpers_1.addp(url, "is_with_statistics", "false");
        return this.apiData.get(url);
    };
    DataProvider.prototype.addAccountNote = function (id, note) {
        var url = "accounts/" + id;
        var data = {
            "note": note,
        };
        return this.apiData.get(url, data, "PUT");
    };
    DataProvider.prototype.addUser = function (email, firstname, lastname, role) {
        var url = "users";
        var data = {
            "Lastname": lastname,
            "Firstname": firstname,
            "email": email,
            "role": role
        };
        return this.apiData.get(url, data, "POST");
    };
    DataProvider = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [api_data_1.ApiData])
    ], DataProvider);
    return DataProvider;
}());
exports.DataProvider = DataProvider;

},{"../directives/helpers":15,"./api-data":54,"@angular/core":"@angular/core","@angular/http":"@angular/http","rxjs":"rxjs"}],57:[function(require,module,exports){
"use strict";
exports.MOCKS = {
    "tickets/counts": {
        "new_messages": 1,
        "open_all": 284,
        "open_as_tech": 10,
        "open_as_alttech": 2,
        "open_as_user": 1001,
        "onhold": 3,
        "reminder": 0,
        "parts_on_order": 0,
        "unconfirmed": 45,
        "waiting": 2
    },
    "todos": [{ "list_id": "d71f45cd260b4ae48761fa20e92af85d", "id": null, "name": "test2", "text": "", "title": "", "order_list": 1, "order_item": -1, "assigned_id": null, "assigned_name": "", "type": 1, "ticket_id": 0, "project_id": 0, "account_id": 0, "due_date": null, "updated_at": null, "is_completed": false, "estimated_remain": null, "ticket_number": null, "time_hours": null, "time_is_billable": true, "time_task_type_id": null, "time_task_type_name": "", "time_payment_id": null, "time_invoice_id": null, "time_start_time": null, "time_stop_time": null,
            "sub": [{ "list_id": "d71f45cd260b4ae48761fa20e92af85d", "id": "0b3d804f15cb4687afc3305aa0156f94", "name": "test2", "text": "test2-1-1", "title": "test2-1", "order_list": 1, "order_item": 1, "assigned_id": 1325, "assigned_name": "Tech/Admin Eugene", "type": 2, "ticket_id": 0, "project_id": 0, "account_id": 0, "due_date": "2016-12-13T00:00:00.0000000", "updated_at": "2016-12-08T15:53:27.3700000", "is_completed": false, "estimated_remain": 10.0000, "ticket_number": null, "time_hours": null, "time_is_billable": true, "time_task_type_id": null, "time_task_type_name": "", "time_payment_id": null, "time_invoice_id": null, "time_start_time": null, "time_stop_time": null, "sub": null }, { "list_id": "d71f45cd260b4ae48761fa20e92af85d", "id": "6fbcdb59d8c740c89e5fdea55f98d757", "name": "test2", "text": "test2-2-2", "title": "test2-2", "order_list": 1, "order_item": 2, "assigned_id": 1325, "assigned_name": "Tech/Admin Eugene", "type": 2, "ticket_id": 0, "project_id": 0, "account_id": 0, "due_date": "2016-12-07T00:00:00.0000000", "updated_at": "2016-12-08T15:53:41.2130000", "is_completed": false, "estimated_remain": 11.0000, "ticket_number": null, "time_hours": null, "time_is_billable": true, "time_task_type_id": null, "time_task_type_name": "", "time_payment_id": null, "time_invoice_id": null, "time_start_time": null, "time_stop_time": null, "sub": null }] }, { "list_id": "2e6e6a93dc254993abc4b072059d1468", "id": null, "name": "My ToDo's", "text": "", "title": "", "order_list": 5, "order_item": -1, "assigned_id": null, "assigned_name": "", "type": 1, "ticket_id": 0, "project_id": 0, "account_id": 0, "due_date": null, "updated_at": null, "is_completed": false, "estimated_remain": null, "ticket_number": null, "time_hours": null, "time_is_billable": true, "time_task_type_id": null, "time_task_type_name": "", "time_payment_id": null, "time_invoice_id": null, "time_start_time": null, "time_stop_time": null, "sub": [{ "list_id": "2e6e6a93dc254993abc4b072059d1468", "id": "1863275673334b468fbd6f1eb2356ea3", "name": "My ToDo's", "text": "", "title": "my-1", "order_list": 5, "order_item": 1, "assigned_id": 1325, "assigned_name": "Tech/Admin Eugene", "type": 2, "ticket_id": 0, "project_id": 0, "account_id": 0, "due_date": null, "updated_at": "2016-12-08T15:53:59.2470000", "is_completed": false, "estimated_remain": null, "ticket_number": null, "time_hours": null, "time_is_billable": true, "time_task_type_id": null, "time_task_type_name": "", "time_payment_id": null, "time_invoice_id": null, "time_start_time": null, "time_stop_time": null, "sub": null }] }],
    "login": {
        "api_token": "re36rym3mjqxm8ej2cscfajmxpsew33m"
    },
    "organizations": [
        {
            "key": "u0diuk",
            "name": "bigWebApps",
            "is_expired": false,
            "is_trial": false,
            "instances": [
                {
                    "key": "b95s6o",
                    "name": "Support",
                    "is_expired": false,
                    "is_trial": false
                }
            ]
        }
    ],
    "config": {
        stat: {},
        "key": "2mzer2k5k0srgncebsizvfmip0isp2ii",
        "org": "u0diuk",
        "instance": "b95s6o",
        "is_onhold_status": false,
        "is_time_tracking": true,
        "is_freshbooks": false,
        "freshbooks_url": "https://micajah3.freshbooks.com",
        "is_parts_tracking": false,
        "is_project_tracking": true,
        "is_unassigned_queue": true,
        "is_location_tracking": true,
        "is_waiting_on_response": true,
        "is_invoice": true,
        "is_payments": true,
        "is_expenses": true,
        "is_class_tracking": true,
        "is_travel_costs": true,
        "is_priorities_general": true,
        "is_confirmation_tracking": true,
        "is_resolution_tracking": true,
        "is_ticket_levels": true,
        "is_account_manager": true,
        "is_require_ticket_initial_post": true,
        "is_ticket_require_closure_note": true,
        "is_asset_tracking": true,
        "assets": {
            "unique1_caption": "",
            "unique2_caption": "",
            "unique3_caption": "",
            "unique4_caption": "",
            "unique5_caption": "",
            "unique6_caption": "",
            "unique7_caption": ""
        },
        "time_hour_increment": -1,
        "time_minimum_time": -1,
        "timezone_offset": -5,
        "timezone_name": "Eastern Standard Time",
        "currency": "$",
        "businessday_length": 540,
        "logo": "/mafsf.axd?d=aW5zdGFuY2UtbG9nby9jOTMzMWE1OWNiNzY0YjQyYmM2M2JhZDRhNTAwZTE4My9zaGVycGFkZXNrXzMxMHg5NS5wbmd8MzAwfDQ1fDB8YzkzMzFhNTljYjc2NGI0MmJjNjNiYWQ0YTUwMGUxODNw0",
        "user": {
            "account_name": "bigWebApps Support",
            "login_id": "51b348ac5ef34ecea7d043f0d2688634",
            "user_id": 1325,
            "email": "jtrue@mail.ru",
            "firstname": "Tech/Admin",
            "lastname": "Eugene",
            "is_techoradmin": true,
            "is_admin": true,
            "is_limit_assigned_tkts": false,
            "is_useworkdaystimer": false,
            "account_id": 0,
            "time_format": 1,
            "date_format": 0
        }
    }
};

},{}],58:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require('./api-data'));
__export(require('./data-provider'));
__export(require('./ticket-provider'));
__export(require('./time-provider'));
__export(require('./todo-provider'));

},{"./api-data":54,"./data-provider":56,"./ticket-provider":59,"./time-provider":60,"./todo-provider":61}],59:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var ionic_angular_1 = require('ionic-angular');
var config_1 = require('./config');
var rxjs_1 = require('rxjs');
var api_data_1 = require('./api-data');
var mocks_1 = require('./mocks');
require('rxjs');
var TicketProvider = (function () {
    function TicketProvider(apiData, config, events) {
        this.apiData = apiData;
        this.config = config;
        this.events = events;
        this.URL = "tickets";
        this.tickets$ = {};
        this._ticketsObserver = {};
        this._dataStore = {
            all: [],
            alt: [],
            tech: [],
            user: []
        };
    }
    TicketProvider.prototype.getTicketsList = function (tab, id, pager) {
        var _this = this;
        var url = "";
        switch (tab.toString()) {
            case "tech":
                url = this.URL + "?status=open&role=tech";
                break;
            case "all":
                url = this.URL + "?status=allopen&query=all";
                break;
            case "alt":
                url = this.URL + "?status=open&role=alt_tech";
                break;
            case "open":
                url = this.URL + "?status=open&account=" + id;
                break;
            case "closed":
                url = this.URL + "?status=closed&account=" + id;
                break;
            case 'queue':
                url = "queues/" + id;
                break;
            default:
                url = this.URL + "?status=open,onhold&role=user";
                break;
        }
        pager.limit = pager.limit || 25;
        pager.page = pager.page || 0;
        tab += id || "";
        this._dataStore[tab] = this._dataStore[tab] || [];
        if (config_1.dontClearCache) {
            this.tickets$[tab] = new rxjs_1.Observable(function (observer) { return _this._ticketsObserver[tab] = observer; }).share();
            this._dataStore[tab] = mocks_1.MOCKS["tickets"];
        }
        var cachelen = this._dataStore[tab].length;
        if (pager.page == 0) {
            if (cachelen) {
                setTimeout(function () {
                    if (_this._ticketsObserver[tab])
                        _this._ticketsObserver[tab].next(_this._dataStore[tab] || []);
                }, 0);
            }
            else {
                this.tickets$[tab] = new rxjs_1.Observable(function (observer) { return _this._ticketsObserver[tab] = observer; }).share();
            }
        }
        this.apiData.getPaged(url, pager).subscribe(function (data) {
            if (pager.page > 0 && cachelen > 0)
                (_a = _this._dataStore[tab]).push.apply(_a, data);
            else
                _this._dataStore[tab] = data;
            if (_this._ticketsObserver[tab])
                _this._ticketsObserver[tab].next(_this._dataStore[tab]);
            var _a;
        }, function (error) { return _this.apiData.handleError('Could not load tickets.'); });
        return cachelen;
    };
    TicketProvider.prototype.getTicketDetails = function (key) {
        var url = this.URL + "/" + key;
        return this.apiData.get(url);
    };
    TicketProvider.prototype.getTicketsCounts = function () {
        var _this = this;
        var url = this.URL + "/counts";
        if (!this._dataStore[url]) {
            this._dataStore[url] = [];
            this.tickets$[url] = new rxjs_1.Observable(function (observer) { _this._ticketsObserver[url] = observer; }).share();
        }
        else {
            if (this._dataStore[url].open_all >= 0) {
                setTimeout(function () {
                    _this._ticketsObserver[url].next(_this._dataStore[url] || []);
                }, 0);
            }
        }
        this.apiData.get(url).subscribe(function (data) {
            _this._dataStore[url] = data;
            _this._ticketsObserver[url].next(_this._dataStore[url]);
        }, function (error) { return console.log('Could not load tickets.'); });
    };
    TicketProvider.prototype.addTicket = function (data) {
        data.status = "open";
        return this.apiData.get(this.URL, data, "POST");
    };
    TicketProvider.prototype.closeOpenTicket = function (id, data) {
        var url = this.URL + "/" + id;
        return this.apiData.get(url, data, "PUT");
    };
    TicketProvider.prototype.addTicketPost = function (id, note, files) {
        var url = this.URL + "/" + id;
        var data = {
            "action": "response",
            "note_text": note,
            "files": files || []
        };
        return this.apiData.get(url, data, "POST");
    };
    TicketProvider.prototype.addTicketNote = function (id, note) {
        var url = this.URL + "/" + id;
        var data = {
            "action": "note",
            "workpad": note,
        };
        return this.apiData.get(url, data, "POST");
    };
    TicketProvider = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [api_data_1.ApiData, ionic_angular_1.Config, ionic_angular_1.Events])
    ], TicketProvider);
    return TicketProvider;
}());
exports.TicketProvider = TicketProvider;

},{"./api-data":54,"./config":55,"./mocks":57,"@angular/core":"@angular/core","ionic-angular":"ionic-angular","rxjs":"rxjs"}],60:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var ionic_angular_1 = require('ionic-angular');
var config_1 = require('./config');
var rxjs_1 = require('rxjs');
var api_data_1 = require('./api-data');
var helpers_1 = require('../directives/helpers');
require('rxjs');
var mocks_1 = require('./mocks');
var TimeProvider = (function () {
    function TimeProvider(apiData, config, events) {
        this.apiData = apiData;
        this.config = config;
        this.events = events;
        this.URL = "time";
        this.times$ = {};
        this._timesObserver = {};
        this._dataStore = {};
    }
    TimeProvider.prototype.getTimelogs = function (account_id, pager) {
        var _this = this;
        var url = helpers_1.addp(this.URL, "account", account_id);
        pager.limit = pager.limit || 25;
        pager.page = pager.page || 0;
        this._dataStore[url] = this._dataStore[url] || [];
        if (config_1.dontClearCache) {
            this.times$[url] = new rxjs_1.Observable(function (observer) { return _this._timesObserver[url] = observer; }).share();
            this._dataStore[url] = mocks_1.MOCKS["time"];
        }
        var cachelen = this._dataStore[url].length;
        if (pager.page == 0) {
            pager.limit = cachelen || pager.limit;
            if (cachelen) {
                setTimeout(function () {
                    if (_this._timesObserver[url])
                        _this._timesObserver[url].next(_this._dataStore[url] || []);
                }, 0);
            }
            else {
                this.times$[url] = new rxjs_1.Observable(function (observer) { return _this._timesObserver[url] = observer; }).share();
            }
        }
        this.apiData.getPaged(url, pager).subscribe(function (data) {
            if (pager.page > 0 && cachelen > 0)
                (_a = _this._dataStore[url]).push.apply(_a, data);
            else
                _this._dataStore[url] = data;
            if (_this._timesObserver[url])
                _this._timesObserver[url].next(_this._dataStore[url]);
            var _a;
        }, function (error) { return console.log('Could not load timelogs.'); });
        return cachelen;
    };
    TimeProvider.prototype.addTime = function (id, data, method) {
        var url = this.URL + (!id ? "" : ("/" + id));
        return this.apiData.get(url, data, method);
    };
    TimeProvider = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [api_data_1.ApiData, ionic_angular_1.Config, ionic_angular_1.Events])
    ], TimeProvider);
    return TimeProvider;
}());
exports.TimeProvider = TimeProvider;

},{"../directives/helpers":15,"./api-data":54,"./config":55,"./mocks":57,"@angular/core":"@angular/core","ionic-angular":"ionic-angular","rxjs":"rxjs"}],61:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var ionic_angular_1 = require('ionic-angular');
var config_1 = require('./config');
var rxjs_1 = require('rxjs');
var api_data_1 = require('./api-data');
var helpers_1 = require('../directives/helpers');
require("rxjs");
var mocks_1 = require('./mocks');
var TodoProvider = (function () {
    function TodoProvider(apiData, config, events) {
        this.apiData = apiData;
        this.config = config;
        this.events = events;
        this.URL = "todos";
        this.todos$ = {};
        this._todosObserver = {};
        this._dataStore = {};
    }
    TodoProvider.prototype.getTodos = function (user_id, pager) {
        var _this = this;
        var url = helpers_1.addp(this.URL, "assigned_id", user_id);
        pager.limit = pager.limit || 25;
        pager.page = pager.page || 0;
        this._dataStore[url] = this._dataStore[url] || [];
        if (config_1.dontClearCache) {
            this.todos$[url] = new rxjs_1.Observable(function (observer) { return _this._todosObserver[url] = observer; }).share();
            this._dataStore[url] = mocks_1.MOCKS["todo"];
        }
        var cachelen = this._dataStore[url].length;
        if (pager.page == 0) {
            if (cachelen) {
                setTimeout(function () {
                    if (_this._todosObserver[url])
                        _this._todosObserver[url].next(_this._dataStore[url] || []);
                }, 0);
            }
            else {
                this.todos$[url] = new rxjs_1.Observable(function (observer) { return _this._todosObserver[url] = observer; }).share();
            }
        }
        this.apiData.getPaged(url + "&all_item_types=true&is_completed=false&is_sub_view=true", pager).subscribe(function (data) {
            if (pager.page > 0 && cachelen > 0)
                (_a = _this._dataStore[url]).push.apply(_a, data);
            else
                _this._dataStore[url] = data;
            if (_this._todosObserver[url])
                _this._todosObserver[url].next(_this._dataStore[url]);
            var _a;
        }, function (error) { return console.log('Could not load todologs.'); });
        return cachelen;
    };
    TodoProvider.prototype.addTodo = function (data) {
        return this.apiData.get(this.URL, data, "POST");
    };
    TodoProvider.prototype.setCompletedTodo = function (id, is_done) {
        var url = this.URL + "/" + id;
        var stream = this.apiData.get(url, { is_completed: is_done }, "PUT").publishLast();
        stream.connect();
        return (stream);
    };
    TodoProvider = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [api_data_1.ApiData, ionic_angular_1.Config, ionic_angular_1.Events])
    ], TodoProvider);
    return TodoProvider;
}());
exports.TodoProvider = TodoProvider;

},{"../directives/helpers":15,"./api-data":54,"./config":55,"./mocks":57,"@angular/core":"@angular/core","ionic-angular":"ionic-angular","rxjs":"rxjs"}],62:[function(require,module,exports){

},{}]},{},[1,62]);
