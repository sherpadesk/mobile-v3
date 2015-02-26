/**
 * @preserve jQuery DateTimePicker plugin v2.4.1
 * @homepage http://xdsoft.net/jqplugins/datetimepicker/
 * (c) 2014, Chupurnov Valeriy.
 */
/*global document,window,jQuery,setTimeout,clearTimeout*/
!function(e){"use strict";var t={i18n:{ru:{months:["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],dayOfWeek:["Вск","Пн","Вт","Ср","Чт","Пт","Сб"]},en:{months:["January","February","March","April","May","June","July","August","September","October","November","December"],dayOfWeek:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]},ja:{months:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],dayOfWeek:["日","月","火","水","木","金","土"]},zh:{months:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],dayOfWeek:["日","一","二","三","四","五","六"]}},value:"",lang:"en",format:"Y/m/d H:i",formatTime:"H:i",formatDate:"Y/m/d",startDate:!1,step:60,monthChangeSpinner:!0,closeOnDateSelect:!1,closeOnWithoutClick:!0,closeOnInputClick:!0,timepicker:!0,datepicker:!0,weeks:!1,defaultTime:!1,defaultDate:!1,minDate:!1,maxDate:!1,minTime:!1,maxTime:!1,allowTimes:[],opened:!1,initTime:!0,inline:!1,theme:"",onSelectDate:function(){},onSelectTime:function(){},onChangeMonth:function(){},onChangeYear:function(){},onChangeDateTime:function(){},onShow:function(){},onClose:function(){},onGenerate:function(){},withoutCopyright:!0,inverseButton:!1,hours12:!1,next:"xdsoft_next",prev:"xdsoft_prev",dayOfWeekStart:0,parentID:"body",timeHeightInTimePicker:25,timepickerScrollbar:!0,todayButton:!0,defaultSelect:!0,scrollMonth:!0,scrollTime:!0,scrollInput:!0,lazyInit:!1,mask:!1,validateOnBlur:!0,allowBlank:!0,yearStart:1950,yearEnd:2050,style:"",id:"",fixed:!1,roundTime:"round",className:"",weekends:[],disabledDates:[],yearOffset:0,beforeShowDay:null,enterLikeTab:!0};Array.prototype.indexOf||(Array.prototype.indexOf=function(e,t){var o,n;for(o=t||0,n=this.length;n>o;o+=1)if(this[o]===e)return o;return-1}),Date.prototype.countDaysInMonth=function(){return new Date(this.getFullYear(),this.getMonth()+1,0).getDate()},e.fn.xdsoftScroller=function(t){return this.each(function(){var o,n,a,i,s,r=e(this),d=function(e){var t,o={x:0,y:0};return"touchstart"===e.type||"touchmove"===e.type||"touchend"===e.type||"touchcancel"===e.type?(t=e.originalEvent.touches[0]||e.originalEvent.changedTouches[0],o.x=t.clientX,o.y=t.clientY):("mousedown"===e.type||"mouseup"===e.type||"mousemove"===e.type||"mouseover"===e.type||"mouseout"===e.type||"mouseenter"===e.type||"mouseleave"===e.type)&&(o.x=e.clientX,o.y=e.clientY),o},l=100,f=!1,c=0,u=0,m=0,g=!1,h=0,p=function(){};return"hide"===t?void r.find(".xdsoft_scrollbar").hide():(e(this).hasClass("xdsoft_scroller_box")||(o=r.children().eq(0),n=r[0].clientHeight,a=o[0].offsetHeight,i=e('<div class="xdsoft_scrollbar"></div>'),s=e('<div class="xdsoft_scroller"></div>'),i.append(s),r.addClass("xdsoft_scroller_box").append(i),p=function(e){var t=d(e).y-c+h;0>t&&(t=0),t+s[0].offsetHeight>m&&(t=m-s[0].offsetHeight),r.trigger("scroll_element.xdsoft_scroller",[l?t/l:0])},s.on("touchstart.xdsoft_scroller mousedown.xdsoft_scroller",function(o){n||r.trigger("resize_scroll.xdsoft_scroller",[t]),c=d(o).y,h=parseInt(s.css("margin-top"),10),m=i[0].offsetHeight,"mousedown"===o.type?(document&&e(document.body).addClass("xdsoft_noselect"),e([document.body,window]).on("mouseup.xdsoft_scroller",function a(){e([document.body,window]).off("mouseup.xdsoft_scroller",a).off("mousemove.xdsoft_scroller",p).removeClass("xdsoft_noselect")}),e(document.body).on("mousemove.xdsoft_scroller",p)):(g=!0,o.stopPropagation(),o.preventDefault())}).on("touchmove",function(e){g&&(e.preventDefault(),p(e))}).on("touchend touchcancel",function(){g=!1,h=0}),r.on("scroll_element.xdsoft_scroller",function(e,t){n||r.trigger("resize_scroll.xdsoft_scroller",[t,!0]),t=t>1?1:0>t||isNaN(t)?0:t,s.css("margin-top",l*t),setTimeout(function(){o.css("marginTop",-parseInt((o[0].offsetHeight-n)*t,10))},10)}).on("resize_scroll.xdsoft_scroller",function(e,t,d){var f,c;n=r[0].clientHeight,a=o[0].offsetHeight,f=n/a,c=f*i[0].offsetHeight,f>1?s.hide():(s.show(),s.css("height",parseInt(c>10?c:10,10)),l=i[0].offsetHeight-s[0].offsetHeight,d!==!0&&r.trigger("scroll_element.xdsoft_scroller",[t||Math.abs(parseInt(o.css("marginTop"),10))/(a-n)]))}),r.on("mousewheel",function(e){var t=Math.abs(parseInt(o.css("marginTop"),10));return t-=20*e.deltaY,0>t&&(t=0),r.trigger("scroll_element.xdsoft_scroller",[t/(a-n)]),e.stopPropagation(),!1}),r.on("touchstart",function(e){f=d(e),u=Math.abs(parseInt(o.css("marginTop"),10))}),r.on("touchmove",function(e){if(f){e.preventDefault();var t=d(e);r.trigger("scroll_element.xdsoft_scroller",[(u-(t.y-f.y))/(a-n)])}}),r.on("touchend touchcancel",function(){f=!1,u=0})),void r.trigger("resize_scroll.xdsoft_scroller",[t]))})},e.fn.datetimepicker=function(o){var n,a,i=48,s=57,r=96,d=105,l=17,f=46,c=13,u=27,m=8,g=37,h=38,p=39,x=40,v=9,T=116,_=65,D=67,w=86,y=90,k=89,b=!1,M=e.isPlainObject(o)||!o?e.extend(!0,{},t,o):e.extend(!0,{},t),C=0,S=function(e){e.on("open.xdsoft focusin.xdsoft mousedown.xdsoft",function t(){e.is(":disabled")||e.data("xdsoft_datetimepicker")||(clearTimeout(C),C=setTimeout(function(){e.data("xdsoft_datetimepicker")||n(e),e.off("open.xdsoft focusin.xdsoft mousedown.xdsoft",t).trigger("open.xdsoft")},100))})};return n=function(t){function n(){var e,o=!1;return M.startDate?o=Y.strToDate(M.startDate):(o=M.value||(t&&t.val&&t.val()?t.val():""),o?o=Y.strToDateTime(o):M.defaultDate&&(o=Y.strToDate(M.defaultDate),M.defaultTime&&(e=Y.strtotime(M.defaultTime),o.setHours(e.getHours()),o.setMinutes(e.getMinutes())))),o&&Y.isValidDate(o)?H.data("changed",!0):o="",o||0}var a,C,S,F,O,Y,H=e("<div "+(M.id?'id="'+M.id+'"':"")+" "+(M.style?'style="'+M.style+'"':"")+' class="xdsoft_datetimepicker xdsoft_'+M.theme+" xdsoft_noselect "+(M.weeks?" xdsoft_showweeks":"")+M.className+'"></div>'),I=e('<div class="xdsoft_copyright"><a target="_blank" href="http://xdsoft.net/jqplugins/datetimepicker/">xdsoft.net</a></div>'),W=e('<div class="xdsoft_datepicker active"></div>'),P=e('<div class="xdsoft_mounthpicker"><button type="button" class="xdsoft_prev"></button><button type="button" class="xdsoft_today_button"></button><div class="xdsoft_label xdsoft_month"><span></span><i></i></div><div class="xdsoft_label xdsoft_year"><span></span><i></i></div><button type="button" class="xdsoft_next"></button></div>'),q=e('<div class="xdsoft_calendar"></div>'),z=e('<div class="xdsoft_timepicker active"><button type="button" class="xdsoft_prev"></button><div class="xdsoft_time_box"></div><button type="button" class="xdsoft_next"></button></div>'),V=z.find(".xdsoft_time_box").eq(0),B=e('<div class="xdsoft_time_variant"></div>'),A=e('<div class="xdsoft_select xdsoft_monthselect"><div></div></div>'),N=e('<div class="xdsoft_select xdsoft_yearselect"><div></div></div>'),j=!1,R=0,E=0;P.find(".xdsoft_month span").after(A),P.find(".xdsoft_year span").after(N),P.find(".xdsoft_month,.xdsoft_year").on("mousedown.xdsoft",function(t){var o,n,a=e(this).find(".xdsoft_select").eq(0),i=0,s=0,r=a.is(":visible");for(P.find(".xdsoft_select").hide(),Y.currentTime&&(i=Y.currentTime[e(this).hasClass("xdsoft_month")?"getMonth":"getFullYear"]()),a[r?"hide":"show"](),o=a.find("div.xdsoft_option"),n=0;n<o.length&&o.eq(n).data("value")!==i;n+=1)s+=o[0].offsetHeight;return a.xdsoftScroller(s/(a.children()[0].offsetHeight-a[0].clientHeight)),t.stopPropagation(),!1}),P.find(".xdsoft_select").xdsoftScroller().on("mousedown.xdsoft",function(e){e.stopPropagation(),e.preventDefault()}).on("mousedown.xdsoft",".xdsoft_option",function(){var t=Y.currentTime.getFullYear();Y&&Y.currentTime&&Y.currentTime[e(this).parent().parent().hasClass("xdsoft_monthselect")?"setMonth":"setFullYear"](e(this).data("value")),e(this).parent().parent().hide(),H.trigger("xchange.xdsoft"),M.onChangeMonth&&e.isFunction(M.onChangeMonth)&&M.onChangeMonth.call(H,Y.currentTime,H.data("input")),t!==Y.currentTime.getFullYear()&&e.isFunction(M.onChangeYear)&&M.onChangeYear.call(H,Y.currentTime,H.data("input"))}),H.setOptions=function(o){if(M=e.extend(!0,{},M,o),o.allowTimes&&e.isArray(o.allowTimes)&&o.allowTimes.length&&(M.allowTimes=e.extend(!0,[],o.allowTimes)),o.weekends&&e.isArray(o.weekends)&&o.weekends.length&&(M.weekends=e.extend(!0,[],o.weekends)),o.disabledDates&&e.isArray(o.disabledDates)&&o.disabledDates.length&&(M.disabledDates=e.extend(!0,[],o.disabledDates)),!M.open&&!M.opened||M.inline||t.trigger("open.xdsoft"),M.inline&&(j=!0,H.addClass("xdsoft_inline"),t.after(H).hide()),M.inverseButton&&(M.next="xdsoft_prev",M.prev="xdsoft_next"),M.datepicker?W.addClass("active"):W.removeClass("active"),M.timepicker?z.addClass("active"):z.removeClass("active"),M.value&&(t&&t.val&&t.val(M.value),Y.setCurrentTime(M.value)),M.dayOfWeekStart=isNaN(M.dayOfWeekStart)?0:parseInt(M.dayOfWeekStart,10)%7,M.timepickerScrollbar||V.xdsoftScroller("hide"),M.minDate&&/^-(.*)$/.test(M.minDate)&&(M.minDate=Y.strToDateTime(M.minDate).dateFormat(M.formatDate)),M.maxDate&&/^\+(.*)$/.test(M.maxDate)&&(M.maxDate=Y.strToDateTime(M.maxDate).dateFormat(M.formatDate)),P.find(".xdsoft_today_button").css("visibility",M.todayButton?"visible":"hidden"),M.mask){var n=function(e){try{if(document.selection&&document.selection.createRange){var t=document.selection.createRange();return t.getBookmark().charCodeAt(2)-2}if(e.setSelectionRange)return e.selectionStart}catch(o){return 0}},a=function(e,t){if(e="string"==typeof e||e instanceof String?document.getElementById(e):e,!e)return!1;if(e.createTextRange){var o=e.createTextRange();return o.collapse(!0),o.moveEnd("character",t),o.moveStart("character",t),o.select(),!0}return e.setSelectionRange?(e.setSelectionRange(t,t),!0):!1},C=function(e,t){var o=e.replace(/([\[\]\/\{\}\(\)\-\.\+]{1})/g,"\\$1").replace(/_/g,"{digit+}").replace(/([0-9]{1})/g,"{digit$1}").replace(/\{digit([0-9]{1})\}/g,"[0-$1_]{1}").replace(/\{digit[\+]\}/g,"[0-9_]{1}");return new RegExp(o).test(t)};t.off("keydown.xdsoft"),M.mask===!0&&(M.mask=M.format.replace(/Y/g,"9999").replace(/F/g,"9999").replace(/m/g,"19").replace(/d/g,"39").replace(/H/g,"29").replace(/i/g,"59").replace(/s/g,"59")),"string"===e.type(M.mask)&&(C(M.mask,t.val())||t.val(M.mask.replace(/[0-9]/g,"_")),t.on("keydown.xdsoft",function(o){var S,F,O=this.value,Y=o.which;if(Y>=i&&s>=Y||Y>=r&&d>=Y||Y===m||Y===f){for(S=n(this),F=Y!==m&&Y!==f?String.fromCharCode(Y>=r&&d>=Y?Y-i:Y):"_",Y!==m&&Y!==f||!S||(S-=1,F="_");/[^0-9_]/.test(M.mask.substr(S,1))&&S<M.mask.length&&S>0;)S+=Y===m||Y===f?-1:1;if(O=O.substr(0,S)+F+O.substr(S+1),""===e.trim(O))O=M.mask.replace(/[0-9]/g,"_");else if(S===M.mask.length)return o.preventDefault(),!1;for(S+=Y===m||Y===f?0:1;/[^0-9_]/.test(M.mask.substr(S,1))&&S<M.mask.length&&S>0;)S+=Y===m||Y===f?-1:1;C(M.mask,O)?(this.value=O,a(this,S)):""===e.trim(O)?this.value=M.mask.replace(/[0-9]/g,"_"):t.trigger("error_input.xdsoft")}else if(-1!==[_,D,w,y,k].indexOf(Y)&&b||-1!==[u,h,x,g,p,T,l,v,c].indexOf(Y))return!0;return o.preventDefault(),!1}))}M.validateOnBlur&&t.off("blur.xdsoft").on("blur.xdsoft",function(){M.allowBlank&&!e.trim(e(this).val()).length?(e(this).val(null),H.data("xdsoft_datetime").empty()):Date.parseDate(e(this).val(),M.format)?H.data("xdsoft_datetime").setCurrentTime(e(this).val()):(e(this).val(Y.now().dateFormat(M.format)),H.data("xdsoft_datetime").setCurrentTime(e(this).val())),H.trigger("changedatetime.xdsoft")}),M.dayOfWeekStartPrev=0===M.dayOfWeekStart?6:M.dayOfWeekStart-1,H.trigger("xchange.xdsoft").trigger("afterOpen.xdsoft")},H.data("options",M).on("mousedown.xdsoft",function(e){return e.stopPropagation(),e.preventDefault(),N.hide(),A.hide(),!1}),V.append(B),V.xdsoftScroller(),H.on("afterOpen.xdsoft",function(){V.xdsoftScroller()}),H.append(W).append(z),M.withoutCopyright!==!0&&H.append(I),W.append(P).append(q),e(M.parentID).append(H),a=function(){var t=this;t.now=function(e){var o,n,a=new Date;return!e&&M.defaultDate&&(o=t.strToDate(M.defaultDate),a.setFullYear(o.getFullYear()),a.setMonth(o.getMonth()),a.setDate(o.getDate())),M.yearOffset&&a.setFullYear(a.getFullYear()+M.yearOffset),!e&&M.defaultTime&&(n=t.strtotime(M.defaultTime),a.setHours(n.getHours()),a.setMinutes(n.getMinutes())),a},t.isValidDate=function(e){return"[object Date]"!==Object.prototype.toString.call(e)?!1:!isNaN(e.getTime())},t.setCurrentTime=function(e){t.currentTime="string"==typeof e?t.strToDateTime(e):t.isValidDate(e)?e:t.now(),H.trigger("xchange.xdsoft")},t.empty=function(){t.currentTime=null},t.getCurrentTime=function(){return t.currentTime},t.nextMonth=function(){var o,n=t.currentTime.getMonth()+1;return 12===n&&(t.currentTime.setFullYear(t.currentTime.getFullYear()+1),n=0),o=t.currentTime.getFullYear(),t.currentTime.setDate(Math.min(new Date(t.currentTime.getFullYear(),n+1,0).getDate(),t.currentTime.getDate())),t.currentTime.setMonth(n),M.onChangeMonth&&e.isFunction(M.onChangeMonth)&&M.onChangeMonth.call(H,Y.currentTime,H.data("input")),o!==t.currentTime.getFullYear()&&e.isFunction(M.onChangeYear)&&M.onChangeYear.call(H,Y.currentTime,H.data("input")),H.trigger("xchange.xdsoft"),n},t.prevMonth=function(){var o=t.currentTime.getMonth()-1;return-1===o&&(t.currentTime.setFullYear(t.currentTime.getFullYear()-1),o=11),t.currentTime.setDate(Math.min(new Date(t.currentTime.getFullYear(),o+1,0).getDate(),t.currentTime.getDate())),t.currentTime.setMonth(o),M.onChangeMonth&&e.isFunction(M.onChangeMonth)&&M.onChangeMonth.call(H,Y.currentTime,H.data("input")),H.trigger("xchange.xdsoft"),o},t.getWeekOfYear=function(e){var t=new Date(e.getFullYear(),0,1);return Math.ceil(((e-t)/864e5+t.getDay()+1)/7)},t.strToDateTime=function(e){var o,n,a=[];return e&&e instanceof Date&&t.isValidDate(e)?e:(a=/^(\+|\-)(.*)$/.exec(e),a&&(a[2]=Date.parseDate(a[2],M.formatDate)),a&&a[2]?(o=a[2].getTime()-6e4*a[2].getTimezoneOffset(),n=new Date(Y.now().getTime()+parseInt(a[1]+"1",10)*o)):n=e?Date.parseDate(e,M.format):t.now(),t.isValidDate(n)||(n=t.now()),n)},t.strToDate=function(e){if(e&&e instanceof Date&&t.isValidDate(e))return e;var o=e?Date.parseDate(e,M.formatDate):t.now(!0);return t.isValidDate(o)||(o=t.now(!0)),o},t.strtotime=function(e){if(e&&e instanceof Date&&t.isValidDate(e))return e;var o=e?Date.parseDate(e,M.formatTime):t.now(!0);return t.isValidDate(o)||(o=t.now(!0)),o},t.str=function(){return t.currentTime.dateFormat(M.format)},t.currentTime=this.now()},Y=new a,P.find(".xdsoft_today_button").on("mousedown.xdsoft",function(){H.data("changed",!0),Y.setCurrentTime(0),H.trigger("afterOpen.xdsoft")}).on("dblclick.xdsoft",function(){t.val(Y.str()),H.trigger("close.xdsoft")}),P.find(".xdsoft_prev,.xdsoft_next").on("mousedown.xdsoft",function(){var t=e(this),o=0,n=!1;!function a(e){Y.currentTime.getMonth();t.hasClass(M.next)?Y.nextMonth():t.hasClass(M.prev)&&Y.prevMonth(),M.monthChangeSpinner&&(n||(o=setTimeout(a,e||100)))}(500),e([document.body,window]).on("mouseup.xdsoft",function i(){clearTimeout(o),n=!0,e([document.body,window]).off("mouseup.xdsoft",i)})}),z.find(".xdsoft_prev,.xdsoft_next").on("mousedown.xdsoft",function(){var t=e(this),o=0,n=!1,a=110;!function i(e){var s=V[0].clientHeight,r=B[0].offsetHeight,d=Math.abs(parseInt(B.css("marginTop"),10));t.hasClass(M.next)&&r-s-M.timeHeightInTimePicker>=d?B.css("marginTop","-"+(d+M.timeHeightInTimePicker)+"px"):t.hasClass(M.prev)&&d-M.timeHeightInTimePicker>=0&&B.css("marginTop","-"+(d-M.timeHeightInTimePicker)+"px"),V.trigger("scroll_element.xdsoft_scroller",[Math.abs(parseInt(B.css("marginTop"),10)/(r-s))]),a=a>10?10:a-10,n||(o=setTimeout(i,e||a))}(500),e([document.body,window]).on("mouseup.xdsoft",function s(){clearTimeout(o),n=!0,e([document.body,window]).off("mouseup.xdsoft",s)})}),C=0,H.on("xchange.xdsoft",function(t){clearTimeout(C),C=setTimeout(function(){for(var t,n,a,i,s,r,d,l="",f=new Date(Y.currentTime.getFullYear(),Y.currentTime.getMonth(),1,12,0,0),c=0,u=Y.now(),m=!1,g=!1,h=[],p=!0,x="",v="";f.getDay()!==M.dayOfWeekStart;)f.setDate(f.getDate()-1);for(l+="<table><thead><tr>",M.weeks&&(l+="<th></th>"),t=0;7>t;t+=1)l+="<th>"+M.i18n[M.lang].dayOfWeek[(t+M.dayOfWeekStart)%7]+"</th>";for(l+="</tr></thead>",l+="<tbody>",M.maxDate!==!1&&(m=Y.strToDate(M.maxDate),m=new Date(m.getFullYear(),m.getMonth(),m.getDate(),23,59,59,999)),M.minDate!==!1&&(g=Y.strToDate(M.minDate),g=new Date(g.getFullYear(),g.getMonth(),g.getDate()));c<Y.currentTime.countDaysInMonth()||f.getDay()!==M.dayOfWeekStart||Y.currentTime.getMonth()===f.getMonth();)h=[],c+=1,n=f.getDate(),a=f.getFullYear(),i=f.getMonth(),s=Y.getWeekOfYear(f),h.push("xdsoft_date"),r=M.beforeShowDay&&e.isFunction(M.beforeShowDay.call)?M.beforeShowDay.call(H,f):null,m!==!1&&f>m||g!==!1&&g>f||r&&r[0]===!1?h.push("xdsoft_disabled"):-1!==M.disabledDates.indexOf(f.dateFormat(M.formatDate))&&h.push("xdsoft_disabled"),r&&""!==r[1]&&h.push(r[1]),Y.currentTime.getMonth()!==i&&h.push("xdsoft_other_month"),(M.defaultSelect||H.data("changed"))&&Y.currentTime.dateFormat(M.formatDate)===f.dateFormat(M.formatDate)&&h.push("xdsoft_current"),u.dateFormat(M.formatDate)===f.dateFormat(M.formatDate)&&h.push("xdsoft_today"),(0===f.getDay()||6===f.getDay()||-1===M.weekends.indexOf(f.dateFormat(M.formatDate)))&&h.push("xdsoft_weekend"),M.beforeShowDay&&e.isFunction(M.beforeShowDay)&&h.push(M.beforeShowDay(f)),p&&(l+="<tr>",p=!1,M.weeks&&(l+="<th>"+s+"</th>")),l+='<td data-date="'+n+'" data-month="'+i+'" data-year="'+a+'" class="xdsoft_date xdsoft_day_of_week'+f.getDay()+" "+h.join(" ")+'"><div>'+n+"</div></td>",f.getDay()===M.dayOfWeekStartPrev&&(l+="</tr>",p=!0),f.setDate(n+1);if(l+="</tbody></table>",q.html(l),P.find(".xdsoft_label span").eq(0).text(M.i18n[M.lang].months[Y.currentTime.getMonth()]),P.find(".xdsoft_label span").eq(1).text(Y.currentTime.getFullYear()),x="",v="",i="",d=function(e,t){var o=Y.now();o.setHours(e),e=parseInt(o.getHours(),10),o.setMinutes(t),t=parseInt(o.getMinutes(),10);var n=new Date(Y.currentTime);n.setHours(e),n.setMinutes(t),h=[],(M.minDateTime!==!1&&M.minDateTime>n||M.maxTime!==!1&&Y.strtotime(M.maxTime).getTime()<o.getTime()||M.minTime!==!1&&Y.strtotime(M.minTime).getTime()>o.getTime())&&h.push("xdsoft_disabled"),(M.initTime||M.defaultSelect||H.data("changed"))&&parseInt(Y.currentTime.getHours(),10)===parseInt(e,10)&&(M.step>59||Math[M.roundTime](Y.currentTime.getMinutes()/M.step)*M.step===parseInt(t,10))&&(M.defaultSelect||H.data("changed")?h.push("xdsoft_current"):M.initTime&&h.push("xdsoft_init_time")),parseInt(u.getHours(),10)===parseInt(e,10)&&parseInt(u.getMinutes(),10)===parseInt(t,10)&&h.push("xdsoft_today"),x+='<div class="xdsoft_time '+h.join(" ")+'" data-hour="'+e+'" data-minute="'+t+'">'+o.dateFormat(M.formatTime)+"</div>"},M.allowTimes&&e.isArray(M.allowTimes)&&M.allowTimes.length)for(c=0;c<M.allowTimes.length;c+=1)v=Y.strtotime(M.allowTimes[c]).getHours(),i=Y.strtotime(M.allowTimes[c]).getMinutes(),d(v,i);else for(c=0,t=0;c<(M.hours12?12:24);c+=1)for(t=0;60>t;t+=M.step)v=(10>c?"0":"")+c,i=(10>t?"0":"")+t,d(v,i);for(B.html(x),o="",c=0,c=parseInt(M.yearStart,10)+M.yearOffset;c<=parseInt(M.yearEnd,10)+M.yearOffset;c+=1)o+='<div class="xdsoft_option '+(Y.currentTime.getFullYear()===c?"xdsoft_current":"")+'" data-value="'+c+'">'+c+"</div>";for(N.children().eq(0).html(o),c=0,o="";11>=c;c+=1)o+='<div class="xdsoft_option '+(Y.currentTime.getMonth()===c?"xdsoft_current":"")+'" data-value="'+c+'">'+M.i18n[M.lang].months[c]+"</div>";A.children().eq(0).html(o),e(H).trigger("generate.xdsoft")},10),t.stopPropagation()}).on("afterOpen.xdsoft",function(){if(M.timepicker){var e,t,o,n;B.find(".xdsoft_current").length?e=".xdsoft_current":B.find(".xdsoft_init_time").length&&(e=".xdsoft_init_time"),e?(t=V[0].clientHeight,o=B[0].offsetHeight,n=B.find(e).index()*M.timeHeightInTimePicker+1,n>o-t&&(n=o-t),V.trigger("scroll_element.xdsoft_scroller",[parseInt(n,10)/(o-t)])):V.trigger("scroll_element.xdsoft_scroller",[0])}}),S=0,q.on("click.xdsoft","td",function(o){o.stopPropagation(),S+=1;var n=e(this),a=Y.currentTime;return(void 0===a||null===a)&&(Y.currentTime=Y.now(),a=Y.currentTime),n.hasClass("xdsoft_disabled")?!1:(a.setDate(1),a.setFullYear(n.data("year")),a.setMonth(n.data("month")),a.setDate(n.data("date")),H.trigger("select.xdsoft",[a]),t.val(Y.str()),(S>1||M.closeOnDateSelect===!0||0===M.closeOnDateSelect&&!M.timepicker)&&!M.inline&&H.trigger("close.xdsoft"),M.onSelectDate&&e.isFunction(M.onSelectDate)&&M.onSelectDate.call(H,Y.currentTime,H.data("input"),o),H.data("changed",!0),H.trigger("xchange.xdsoft"),H.trigger("changedatetime.xdsoft"),void setTimeout(function(){S=0},200))}),B.on("click.xdsoft","div",function(t){t.stopPropagation();var o=e(this),n=Y.currentTime;return(void 0===n||null===n)&&(Y.currentTime=Y.now(),n=Y.currentTime),o.hasClass("xdsoft_disabled")?!1:(n.setHours(o.data("hour")),n.setMinutes(o.data("minute")),H.trigger("select.xdsoft",[n]),H.data("input").val(Y.str()),M.inline||H.trigger("close.xdsoft"),M.onSelectTime&&e.isFunction(M.onSelectTime)&&M.onSelectTime.call(H,Y.currentTime,H.data("input"),t),H.data("changed",!0),H.trigger("xchange.xdsoft"),void H.trigger("changedatetime.xdsoft"))}),W.on("mousewheel.xdsoft",function(e){return M.scrollMonth?(e.deltaY<0?Y.nextMonth():Y.prevMonth(),!1):!0}),t.on("mousewheel.xdsoft",function(e){return M.scrollInput?!M.datepicker&&M.timepicker?(F=B.find(".xdsoft_current").length?B.find(".xdsoft_current").eq(0).index():0,F+e.deltaY>=0&&F+e.deltaY<B.children().length&&(F+=e.deltaY),B.children().eq(F).length&&B.children().eq(F).trigger("mousedown"),!1):M.datepicker&&!M.timepicker?(W.trigger(e,[e.deltaY,e.deltaX,e.deltaY]),t.val&&t.val(Y.str()),H.trigger("changedatetime.xdsoft"),!1):void 0:!0}),H.on("changedatetime.xdsoft",function(t){if(M.onChangeDateTime&&e.isFunction(M.onChangeDateTime)){var o=H.data("input");M.onChangeDateTime.call(H,Y.currentTime,o,t),delete M.value,o.trigger("change")}}).on("generate.xdsoft",function(){M.onGenerate&&e.isFunction(M.onGenerate)&&M.onGenerate.call(H,Y.currentTime,H.data("input")),j&&(H.trigger("afterOpen.xdsoft"),j=!1)}).on("click.xdsoft",function(e){e.stopPropagation()}),F=0,O=function(){var t=H.data("input").offset(),o=t.top+H.data("input")[0].offsetHeight-1,n=t.left,a="absolute";M.fixed?(o-=e(window).scrollTop(),n-=e(window).scrollLeft(),a="fixed"):(o+H[0].offsetHeight>e(window).height()+e(window).scrollTop()&&(o=t.top-H[0].offsetHeight+1),0>o&&(o=0),n+H[0].offsetWidth>e(window).width()&&(n=e(window).width()-H[0].offsetWidth)),H.css({left:n,top:o,position:a})},H.on("open.xdsoft",function(t){var o=!0;M.onShow&&e.isFunction(M.onShow)&&(o=M.onShow.call(H,Y.currentTime,H.data("input"),t)),o!==!1&&(H.show(),O(),e(window).off("resize.xdsoft",O).on("resize.xdsoft",O),M.closeOnWithoutClick&&e([document.body,window]).on("mousedown.xdsoft",function n(){H.trigger("close.xdsoft"),e([document.body,window]).off("mousedown.xdsoft",n)}))}).on("close.xdsoft",function(t){var o=!0;P.find(".xdsoft_month,.xdsoft_year").find(".xdsoft_select").hide(),M.onClose&&e.isFunction(M.onClose)&&(o=M.onClose.call(H,Y.currentTime,H.data("input"),t)),o===!1||M.opened||M.inline||H.hide(),t.stopPropagation()}).on("toggle.xdsoft",function(){H.trigger(H.is(":visible")?"close.xdsoft":"open.xdsoft")}).data("input",t),R=0,E=0,H.data("xdsoft_datetime",Y),H.setOptions(M),Y.setCurrentTime(n()),t.data("xdsoft_datetimepicker",H).on("open.xdsoft focusin.xdsoft mousedown.xdsoft",function(){t.is(":disabled")||t.data("xdsoft_datetimepicker").is(":visible")&&M.closeOnInputClick||(clearTimeout(R),R=setTimeout(function(){t.is(":disabled")||(j=!0,Y.setCurrentTime(n()),H.trigger("open.xdsoft"))},100))}).on("keydown.xdsoft",function(t){var o,n=(this.value,t.which);return-1!==[c].indexOf(n)&&M.enterLikeTab?(o=e("input:visible,textarea:visible"),H.trigger("close.xdsoft"),o.eq(o.index(this)+1).focus(),!1):-1!==[v].indexOf(n)?(H.trigger("close.xdsoft"),!0):void 0})},a=function(t){var o=t.data("xdsoft_datetimepicker");o&&(o.data("xdsoft_datetime",null),o.remove(),t.data("xdsoft_datetimepicker",null).off(".xdsoft"),e(window).off("resize.xdsoft"),e([window,document.body]).off("mousedown.xdsoft"),t.unmousewheel&&t.unmousewheel())},e(document).off("keydown.xdsoftctrl keyup.xdsoftctrl").on("keydown.xdsoftctrl",function(e){e.keyCode===l&&(b=!0)}).on("keyup.xdsoftctrl",function(e){e.keyCode===l&&(b=!1)}),this.each(function(){var t=e(this).data("xdsoft_datetimepicker");if(t){if("string"===e.type(o))switch(o){case"show":e(this).select().focus(),t.trigger("open.xdsoft");break;case"hide":t.trigger("close.xdsoft");break;case"toggle":t.trigger("toggle.xdsoft");break;case"destroy":a(e(this));break;case"reset":this.value=this.defaultValue,this.value&&t.data("xdsoft_datetime").isValidDate(Date.parseDate(this.value,M.format))||t.data("changed",!1),t.data("xdsoft_datetime").setCurrentTime(this.value)}else t.setOptions(o);return 0}"string"!==e.type(o)&&(!M.lazyInit||M.open||M.inline?n(e(this)):S(e(this)))})},e.fn.datetimepicker.defaults=t}(jQuery);
    
(function () {

/*! Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 3.1.12
 *
 * Requires: jQuery 1.2.2+
 */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a:a(jQuery)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})});

// Parse and Format Library
//http://www.xaprb.com/blog/2005/12/12/javascript-closures-for-runtime-efficiency/
/*
 * Copyright (C) 2004 Baron Schwartz <baron at sequent dot org>
 *
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by the
 * Free Software Foundation, version 2.1.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more
 * details.
 */
Date.parseFunctions={count:0};Date.parseRegexes=[];Date.formatFunctions={count:0};Date.prototype.dateFormat=function(b){if(b=="unixtime"){return parseInt(this.getTime()/1000);}if(Date.formatFunctions[b]==null){Date.createNewFormat(b);}var a=Date.formatFunctions[b];return this[a]();};Date.createNewFormat=function(format){var funcName="format"+Date.formatFunctions.count++;Date.formatFunctions[format]=funcName;var code="Date.prototype."+funcName+" = function() {return ";var special=false;var ch="";for(var i=0;i<format.length;++i){ch=format.charAt(i);if(!special&&ch=="\\"){special=true;}else{if(special){special=false;code+="'"+String.escape(ch)+"' + ";}else{code+=Date.getFormatCode(ch);}}}eval(code.substring(0,code.length-3)+";}");};Date.getFormatCode=function(a){switch(a){case"d":return"String.leftPad(this.getDate(), 2, '0') + ";case"D":return"Date.dayNames[this.getDay()].substring(0, 3) + ";case"j":return"this.getDate() + ";case"l":return"Date.dayNames[this.getDay()] + ";case"S":return"this.getSuffix() + ";case"w":return"this.getDay() + ";case"z":return"this.getDayOfYear() + ";case"W":return"this.getWeekOfYear() + ";case"F":return"Date.monthNames[this.getMonth()] + ";case"m":return"String.leftPad(this.getMonth() + 1, 2, '0') + ";case"M":return"Date.monthNames[this.getMonth()].substring(0, 3) + ";case"n":return"(this.getMonth() + 1) + ";case"t":return"this.getDaysInMonth() + ";case"L":return"(this.isLeapYear() ? 1 : 0) + ";case"Y":return"this.getFullYear() + ";case"y":return"('' + this.getFullYear()).substring(2, 4) + ";case"a":return"(this.getHours() < 12 ? 'am' : 'pm') + ";case"A":return"(this.getHours() < 12 ? 'AM' : 'PM') + ";case"g":return"((this.getHours() %12) ? this.getHours() % 12 : 12) + ";case"G":return"this.getHours() + ";case"h":return"String.leftPad((this.getHours() %12) ? this.getHours() % 12 : 12, 2, '0') + ";case"H":return"String.leftPad(this.getHours(), 2, '0') + ";case"i":return"String.leftPad(this.getMinutes(), 2, '0') + ";case"s":return"String.leftPad(this.getSeconds(), 2, '0') + ";case"O":return"this.getGMTOffset() + ";case"T":return"this.getTimezone() + ";case"Z":return"(this.getTimezoneOffset() * -60) + ";default:return"'"+String.escape(a)+"' + ";}};Date.parseDate=function(a,c){if(c=="unixtime"){return new Date(!isNaN(parseInt(a))?parseInt(a)*1000:0);}if(Date.parseFunctions[c]==null){Date.createParser(c);}var b=Date.parseFunctions[c];return Date[b](a);};Date.createParser=function(format){var funcName="parse"+Date.parseFunctions.count++;var regexNum=Date.parseRegexes.length;var currentGroup=1;Date.parseFunctions[format]=funcName;var code="Date."+funcName+" = function(input) {\nvar y = -1, m = -1, d = -1, h = -1, i = -1, s = -1, z = -1;\nvar d = new Date();\ny = d.getFullYear();\nm = d.getMonth();\nd = d.getDate();\nvar results = input.match(Date.parseRegexes["+regexNum+"]);\nif (results && results.length > 0) {";var regex="";var special=false;var ch="";for(var i=0;i<format.length;++i){ch=format.charAt(i);if(!special&&ch=="\\"){special=true;}else{if(special){special=false;regex+=String.escape(ch);}else{obj=Date.formatCodeToRegex(ch,currentGroup);currentGroup+=obj.g;regex+=obj.s;if(obj.g&&obj.c){code+=obj.c;}}}}code+="if (y > 0 && z > 0){\nvar doyDate = new Date(y,0);\ndoyDate.setDate(z);\nm = doyDate.getMonth();\nd = doyDate.getDate();\n}";code+="if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0 && s >= 0)\n{return new Date(y, m, d, h, i, s);}\nelse if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0)\n{return new Date(y, m, d, h, i);}\nelse if (y > 0 && m >= 0 && d > 0 && h >= 0)\n{return new Date(y, m, d, h);}\nelse if (y > 0 && m >= 0 && d > 0)\n{return new Date(y, m, d);}\nelse if (y > 0 && m >= 0)\n{return new Date(y, m);}\nelse if (y > 0)\n{return new Date(y);}\n}return null;}";Date.parseRegexes[regexNum]=new RegExp("^"+regex+"$");eval(code);};Date.formatCodeToRegex=function(b,a){switch(b){case"D":return{g:0,c:null,s:"(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)"};case"j":case"d":return{g:1,c:"d = parseInt(results["+a+"], 10);\n",s:"(\\d{1,2})"};case"l":return{g:0,c:null,s:"(?:"+Date.dayNames.join("|")+")"};case"S":return{g:0,c:null,s:"(?:st|nd|rd|th)"};case"w":return{g:0,c:null,s:"\\d"};case"z":return{g:1,c:"z = parseInt(results["+a+"], 10);\n",s:"(\\d{1,3})"};case"W":return{g:0,c:null,s:"(?:\\d{2})"};case"F":return{g:1,c:"m = parseInt(Date.monthNumbers[results["+a+"].substring(0, 3)], 10);\n",s:"("+Date.monthNames.join("|")+")"};case"M":return{g:1,c:"m = parseInt(Date.monthNumbers[results["+a+"]], 10);\n",s:"(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)"};case"n":case"m":return{g:1,c:"m = parseInt(results["+a+"], 10) - 1;\n",s:"(\\d{1,2})"};case"t":return{g:0,c:null,s:"\\d{1,2}"};case"L":return{g:0,c:null,s:"(?:1|0)"};case"Y":return{g:1,c:"y = parseInt(results["+a+"], 10);\n",s:"(\\d{4})"};case"y":return{g:1,c:"var ty = parseInt(results["+a+"], 10);\ny = ty > Date.y2kYear ? 1900 + ty : 2000 + ty;\n",s:"(\\d{1,2})"};case"a":return{g:1,c:"if (results["+a+"] == 'am') {\nif (h == 12) { h = 0; }\n} else { if (h < 12) { h += 12; }}",s:"(am|pm)"};case"A":return{g:1,c:"if (results["+a+"] == 'AM') {\nif (h == 12) { h = 0; }\n} else { if (h < 12) { h += 12; }}",s:"(AM|PM)"};case"g":case"G":case"h":case"H":return{g:1,c:"h = parseInt(results["+a+"], 10);\n",s:"(\\d{1,2})"};case"i":return{g:1,c:"i = parseInt(results["+a+"], 10);\n",s:"(\\d{2})"};case"s":return{g:1,c:"s = parseInt(results["+a+"], 10);\n",s:"(\\d{2})"};case"O":return{g:0,c:null,s:"[+-]\\d{4}"};case"T":return{g:0,c:null,s:"[A-Z]{3}"};case"Z":return{g:0,c:null,s:"[+-]\\d{1,5}"};default:return{g:0,c:null,s:String.escape(b)};}};Date.prototype.getTimezone=function(){return this.toString().replace(/^.*? ([A-Z]{3}) [0-9]{4}.*$/,"$1").replace(/^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/,"$1$2$3");};Date.prototype.getGMTOffset=function(){return(this.getTimezoneOffset()>0?"-":"+")+String.leftPad(Math.floor(Math.abs(this.getTimezoneOffset())/60),2,"0")+String.leftPad(Math.abs(this.getTimezoneOffset())%60,2,"0");};Date.prototype.getDayOfYear=function(){var a=0;Date.daysInMonth[1]=this.isLeapYear()?29:28;for(var b=0;b<this.getMonth();++b){a+=Date.daysInMonth[b];}return a+this.getDate();};Date.prototype.getWeekOfYear=function(){var b=this.getDayOfYear()+(4-this.getDay());var a=new Date(this.getFullYear(),0,1);var c=(7-a.getDay()+4);return String.leftPad(Math.ceil((b-c)/7)+1,2,"0");};Date.prototype.isLeapYear=function(){var a=this.getFullYear();return((a&3)==0&&(a%100||(a%400==0&&a)));};Date.prototype.getFirstDayOfMonth=function(){var a=(this.getDay()-(this.getDate()-1))%7;return(a<0)?(a+7):a;};Date.prototype.getLastDayOfMonth=function(){var a=(this.getDay()+(Date.daysInMonth[this.getMonth()]-this.getDate()))%7;return(a<0)?(a+7):a;};Date.prototype.getDaysInMonth=function(){Date.daysInMonth[1]=this.isLeapYear()?29:28;return Date.daysInMonth[this.getMonth()];};Date.prototype.getSuffix=function(){switch(this.getDate()){case 1:case 21:case 31:return"st";case 2:case 22:return"nd";case 3:case 23:return"rd";default:return"th";}};String.escape=function(a){return a.replace(/('|\\)/g,"\\$1");};String.leftPad=function(d,b,c){var a=new String(d);if(c==null){c=" ";}while(a.length<b){a=c+a;}return a;};Date.daysInMonth=[31,28,31,30,31,30,31,31,30,31,30,31];Date.monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];Date.dayNames=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];Date.y2kYear=50;Date.monthNumbers={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};Date.patterns={ISO8601LongPattern:"Y-m-d H:i:s",ISO8601ShortPattern:"Y-m-d",ShortDatePattern:"n/j/Y",LongDatePattern:"l, F d, Y",FullDateTimePattern:"l, F d, Y g:i:s A",MonthDayPattern:"F d",ShortTimePattern:"g:i A",LongTimePattern:"g:i:s A",SortableDateTimePattern:"Y-m-d\\TH:i:s",UniversalSortableDateTimePattern:"Y-m-d H:i:sO",YearMonthPattern:"F, Y"};
}());
