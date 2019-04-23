/*
 * Hijri/Gregorian Calendar using W3CSS
 * 
 * Designed by ZulNs, @Gorontalo, Indonesia, 30 April 2017
 * Revised to using W3CSS, @Gorontalo, Indonesia, 14 January 2019
 */
'use strict';
function Calendar(isHijr,year,month,firstDay,lang,theme,tmout){
	if(typeof HijriDate=='undefined')throw new Error('HijriDate() class required!');
	let cd=typeof this=='object'?this:window,gdate=new Date(),hdate=new HijriDate(),dispDate,tzOffset=Date.parse('01 Jan 1970'),
	gridAni='zoom',actTmoId,isDispToday=false,isAccOpened=false,isAutoNewTheme,isRTL=false,
	aboutElm,aboutTitleElm,aboutDateElm,aboutCloseBtnElm,
	isSmallScreen=(window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth)<640,
	createElm=function(tagName,className,innerHTML){
		let el=document.createElement(tagName);if(className)el.className=className;if(innerHTML)el.innerHTML=innerHTML;return el
	},
	addEvt=function(el,ev,cb){
		if(window.addEventListener)el.addEventListener(ev,cb);else if(el.attachEvent)el.attachEvent('on'+ev,cb);else el['on'+ev]=cb
	},
	calElm=createElm('div','zulns-calendar w3-card-4'),
	headerElm=createElm('div','w3-display-container w3-theme'),
	todayElm=createElm('div','w3-display-topright w3-large unbreakable'),
	yearValElm=createElm('div','w3-display-middle w3-xxlarge unbreakable'),
	monthValElm=createElm('div','w3-display-bottommiddle w3-xlarge unbreakable'),
	menuBtnElm=createElm('button','w3-button w3-ripple','<svg width="18" height="23"><path d="M0 6L18 6L18 8L0 8Z M0 13L18 13L18 15L0 15Z M0 20L18 20L18 22L0 22Z"/></svg>'),
	menuWrapElm=createElm('div','w3-dropdown-content w3-bar-block w3-border w3-light-grey'),
	accFirstDayElm=createElm('div','w3-white w3-border-bottom'),
	menuCalModElm=createElm('button','w3-bar-item w3-button w3-ripple'),
	menuFirstDayElm=createElm('button','w3-bar-item w3-button w3-ripple collapsed','<span></span><span class="w3-right"><svg width="10" height="10"><path d="M1 3L5 7L9 3Z"/></svg></span><span class="w3-right"><svg width="10" height="10"><path d="M1 7L5 3L9 7Z"/></svg></span>'),
	menuTodayElm=createElm('button','w3-bar-item w3-button w3-ripple'),
	menuNewThemeElm=createElm('button','w3-bar-item w3-button w3-ripple'),
	menuAboutElm=createElm('button','w3-bar-item w3-button w3-ripple'),
	menuCloseElm=createElm('button','w3-bar-item w3-button w3-ripple'),
	wdayTitleElm=createElm('div','w3-cell-row w3-center w3-large w3-light-grey'),
	gridsElm=createElm('div','w3-white'),
	createStyle=function(){
		let stl=document.getElementById('ZulNsCalendarStyle'),ct=Calendar.themes,ctl=ct.length;
		if(stl)return false;
		let str='svg{stroke:currentColor;fill:currentColor;stroke-width:1}'+
			'.w3-button{background-color:transparent}'+
			'.w3-bar-item{border-left:6px solid transparent!important}'+
			'.w3-bar-item:not(:disabled):hover{border-color:#f44336!important}'+
			'.w3-bar-item:focus{border-color:#2196F3!important}'+
			'.w3-bar-item.expanded{color:#fff;background-color:#616161}'+
			'button.collapsed + div,button.collapsed>:nth-child(3),button.expanded>:nth-child(2){display:none!important}'+
			'.right-to-left .w3-cell{float:right!important}'+
			'.unbreakable{overflow:hidden;white-space:nowrap}';
		stl=createElm('style',null,str);stl.id='ZulNsCalendarStyle';stl.type='text/css';document.body.appendChild(stl);return true
	},
	createAboutModal=function(){
		aboutElm=document.getElementById('ZulNsAbout');
		if(aboutElm){
			aboutTitleElm=document.getElementById('ZulNsAboutTitle');
			aboutDateElm=document.getElementById('ZulNsAboutDate');
			aboutCloseBtnElm=document.getElementById('ZulNsAboutCloseButton');
			return false
		}
		aboutElm=createElm('div','w3-modal');
		let cont=createElm('div','w3-modal-content w3-card-4 w3-border w3-display w3-black w3-animate-zoom'),
			info=createElm('div','w3-display-middle w3-bar w3-center'),
			zulns=createElm('p',null,'<span class="w3-tag w3-jumbo w3-red">Z</span>&nbsp;<span class="w3-tag w3-jumbo w3-yellow">u</span>&nbsp;<span class="w3-tag w3-jumbo w3-blue">l</span>&nbsp;<span class="w3-tag w3-jumbo w3-green">N</span>&nbsp;<span class="w3-tag w3-jumbo w3-purple">s</span>');
		aboutCloseBtnElm=createElm('button','w3-button w3-ripple w3-display-topright','<svg width="18" height="19"><path d="M5 9L5 10L8 13L5 16L5 17L6 17L9 14L12 17L13 17L13 16L10 13L13 10L13 9L12 9L9 12L6 9Z"/></svg>');
		aboutTitleElm=createElm('p','w3-xlarge');aboutDateElm=createElm('p','w3-large');aboutElm.id='ZulNsAbout';
		aboutElm.style.display='none';aboutElm.setAttribute('callback',null);
		cont.style.cssText='width:440px;height:300px;cursor:default';
		aboutCloseBtnElm.id='ZulNsAboutCloseButton';aboutTitleElm.id='ZulNsAboutTitle';aboutDateElm.id='ZulNsAboutDate';
		info.appendChild(aboutTitleElm);info.appendChild(zulns);info.appendChild(aboutDateElm);cont.appendChild(info);
		cont.appendChild(aboutCloseBtnElm);aboutElm.appendChild(cont);document.body.appendChild(aboutElm);
		addEvt(aboutCloseBtnElm,'click',function(){
			aboutElm.style.display='none';aboutTitleElm.innerHTML='';aboutDateElm.innerHTML='';
			if(typeof aboutElm.callback=='function')aboutElm.callback();aboutElm.callback=null
		});return true
	},
	createCal=function(){
		let rootMenuElm=createElm('div','w3-dropdown-click w3-display-topleft'),
			prevYearBtnElm=createElm('button','w3-button w3-ripple w3-display-left','<svg width="18" height="23"><path d="M7 7L2 15L7 23L9 23L4 15L9 7Z M14 7L9 15L14 23L16 23L11 15L16 7Z"/></svg>'),
			nextYearBtnElm=createElm('button','w3-button w3-ripple w3-display-right','<svg width="18" height="23"><path d="M11 7L16 15L11 23L9 23L14 15L9 7Z M4 7L9 15L4 23L2 23L7 15L2 7Z"/></svg>'),
			prevMonthBtnElm=createElm('button','w3-button w3-ripple w3-display-bottomleft','<svg width="18" height="23"><path d="M10 7L5 15L10 23L12 23L7 15L12 7Z"/></svg>'),
			nextMonthBtnElm=createElm('button','w3-button w3-ripple w3-display-bottomright','<svg width="18" height="23"><path d="M8 7L13 15L8 23L6 23L11 15L6 7Z"/></svg>');
		headerElm.style.height='142px';
		todayElm.style.cssText='margin:12px 20px 0px 0px;cursor:default';
		yearValElm.style.cursor=gridsElm.style.cursor='default';
		monthValElm.style.cssText='margin-bottom:7px;cursor:default';
		rootMenuElm.style.cssText='margin:4px 0px 0px 4px';
		prevYearBtnElm.style.cssText='margin-left:4px';
		nextYearBtnElm.style.cssText='margin-right:4px';
		prevMonthBtnElm.style.cssText='margin:0px 0px 4px 4px';
		nextMonthBtnElm.style.cssText='margin:0px 4px 4px 0px';
		wdayTitleElm.style.cssText='padding:4px 0px;margin-bottom:4px';
		menuWrapElm.style.width='200px';
		menuWrapElm.appendChild(menuCalModElm);menuWrapElm.appendChild(menuFirstDayElm);menuWrapElm.appendChild(accFirstDayElm);
		menuWrapElm.appendChild(menuTodayElm);menuWrapElm.appendChild(menuNewThemeElm);menuWrapElm.appendChild(menuAboutElm);
		menuWrapElm.appendChild(menuCloseElm);rootMenuElm.appendChild(menuBtnElm);rootMenuElm.appendChild(menuWrapElm);
		headerElm.appendChild(todayElm);headerElm.appendChild(yearValElm);headerElm.appendChild(monthValElm);
		headerElm.appendChild(rootMenuElm);headerElm.appendChild(prevYearBtnElm);headerElm.appendChild(nextYearBtnElm);
		headerElm.appendChild(prevMonthBtnElm);headerElm.appendChild(nextMonthBtnElm);gridsElm.appendChild(wdayTitleElm);
		calElm.appendChild(headerElm);calElm.appendChild(gridsElm);
		addEvt(menuBtnElm,'click',onClickMenu);addEvt(menuCalModElm,'click',onChgCalMod);addEvt(menuFirstDayElm,'click',onFirstDay);
		addEvt(menuTodayElm,'click',onDispToday);addEvt(menuNewThemeElm,'click',onNewTheme);addEvt(menuAboutElm,'click',onAbout);
		addEvt(menuCloseElm,'click',onClose);addEvt(prevYearBtnElm,'click',onDecYear);addEvt(nextYearBtnElm,'click',onIncYear);
		addEvt(prevMonthBtnElm,'click',onDecMonth);addEvt(nextMonthBtnElm,'click',onIncMonth);addEvt(window,'resize',onRszWdw);
		for(let i=0;i<7;i++){
			let el=createElm('button','w3-bar-item w3-button w3-ripple');
			el.setAttribute('firstday',i);
			addEvt(el,'click',onSelFirstDay);
			accFirstDayElm.appendChild(el)
		}updMenuLbl();updCalModMenuLbl();updFirstDayMenuLbl();updHeader();createWdayTitle();createDates()
	},
	updMenuLbl=function(){
		let c=Calendar.getVal;
		menuFirstDayElm.children[0].innerHTML=c('menuItem1');
		menuTodayElm.innerHTML=c('menuItem2');
		menuNewThemeElm.innerHTML=c('menuItem3');
		menuAboutElm.innerHTML=c('menuItem4');
		menuCloseElm.innerHTML=c('menuItem5')+'<span class="w3-right">&times;</span>';
	},
	updCalModMenuLbl=function(){
		menuCalModElm.innerHTML=Calendar.getVal('menuItem0')[isHijr?1:0];
	},
	updFirstDayMenuLbl=function(){
		for(let i=0;i<7;i++)accFirstDayElm.children[i].innerHTML='&#9679;&nbsp;'+dispDate.getWeekdayName(i)
	},
	updTodayLbl=function(){todayElm.innerHTML=isSmallScreen?dispDate.todayShortString():dispDate.todayString()},
	updHeader=function(){
		yearValElm.innerHTML=Calendar.getDigit(dispDate.getYearString());
		monthValElm.innerHTML=dispDate.getMonthName()
	},
	createWdayTitle=function(){
		let el=accFirstDayElm.children[firstDay];
		replaceClass(el,'w3-button w3-ripple','w3-transparent');el.disabled=true;
		for(let i=firstDay;i<7+firstDay;i++){
			let day=createElm('div','w3-cell unbreakable',isSmallScreen?dispDate.getWeekdayShortName(i):dispDate.getWeekdayName(i));
			if(i%7==5)day.className+=' w3-text-teal';
			if(i%7==0)day.className+=' w3-text-red';
			day.style.width='14.2857%';wdayTitleElm.appendChild(day)
		}
	},
	recreateWdayTitle=function(){
		while(wdayTitleElm.firstChild)wdayTitleElm.removeChild(wdayTitleElm.firstChild);createWdayTitle()
	},
	createDates=function(){
		let dispTm=dispDate.getTime(),ppdr=dispDate.getDay()-firstDay;
		if(ppdr<0)ppdr+=7;
		let pcdr=dispDate.getDayCountInMonth(),pndr=(7-(ppdr+pcdr)%7)%7;
		dispDate.setDate(1-ppdr);syncDates();
		let pdate=dispDate.getDate(),sdate=getOppsDate().getDate(),pdim=dispDate.getDayCountInMonth(),sdim=getOppsDate().getDayCountInMonth(),
			smsn=getOppsDate().getMonthShortName(),isFri=(13-firstDay)%7,isSun=(8-firstDay)%7,gridCtr=0,ttc,isToday;
		dispDate.setDate(1);getOppsDate().setDate(1);
		if(isDispToday){
			isDispToday=false;replaceClass(menuTodayElm,'w3-transparent','w3-button w3-ripple');menuTodayElm.disabled=false
		}
		for(let i=1;i<=ppdr+pcdr+pndr;i++){
			if(gridCtr==0){var row=createElm('div','w3-cell-row w3-center');gridsElm.appendChild(row)}
			let grid=createElm('div','w3-cell w3-animate-'+gridAni),
				pde=createElm('div','w3-xlarge'),sde=createElm('div','w3-small unbreakable');
			ttc=dispDate.getTime()+(pdate-1)*864e5;
			grid.style.cssText='width:14.2857%;padding:3px 0px';
			grid.appendChild(pde);grid.appendChild(sde);row.appendChild(grid);
			isToday=getCurTime()==ttc;
			if(isToday)grid.className+=' w3-round-large';
			if(i%7==isFri)grid.className+=isToday?' w3-teal':' w3-text-teal';
			else if(i%7==isSun)grid.className+=isToday?' w3-red':' w3-text-red';
			else if(isToday)grid.className+=' w3-dark-grey';
			if(i<=ppdr||ppdr+pcdr<i){grid.className+=' w3-disabled';grid.style.cursor='default'}
			else if(isToday){
				isDispToday=true;
				grid.className+=' w3-round-large';
				replaceClass(menuTodayElm,'w3-button w3-ripple','w3-transparent');
				menuTodayElm.disabled=true;
				if(actTmoId){window.clearTimeout(actTmoId);actTmoId=null}
			}
			if(26586e6==ttc){
				grid.className+=' w3-btn w3-ripple w3-round-large w3-black';grid.style.cursor='pointer';addEvt(grid,'click',onAbout)
			}
			pde.innerHTML=Calendar.getDigit(pdate);sde.innerHTML=Calendar.getDigit(sdate)+' '+smsn;pdate++;
			if(pdate>pdim){pdate=1;dispDate.setMonth(dispDate.getMonth()+1);pdim=dispDate.getDayCountInMonth()}
			sdate++;
			if(sdate>sdim){
				sdate=1;getOppsDate().setMonth(getOppsDate().getMonth()+1);
				sdim=getOppsDate().getDayCountInMonth();smsn=getOppsDate().getMonthShortName()
			}gridCtr=++gridCtr%7
		}
		let spacer=createElm('div','w3-cell-row');spacer.style.height='4px';gridsElm.appendChild(spacer);dispDate.setTime(dispTm)
	},
	recreateDates=function(){
		while(gridsElm.children[1])gridsElm.removeChild(gridsElm.children[1]);createDates()
	},
	updCal=function(){updHeader();recreateDates()},
	onDecMonth=function(){gridAni='right';return isRTL?incMonth():decMonth()},
	onIncMonth=function(){gridAni='left';return isRTL?decMonth():incMonth()},
	onDecYear=function(){gridAni='right';return isRTL?incYear():decYear()},
	onIncYear=function(){gridAni='left';return isRTL?decYear():incYear()},
	onClickMenu=function(){
		if(menuWrapElm.className.indexOf('w3-show')==-1){
			menuBtnElm.className+=' w3-light-grey';menuWrapElm.className+=' w3-show'
		}else hideMenu()
	},
	onChgCalMod=function(){cd.setHijriMode(!isHijr);applyTodayTmout()},
	onFirstDay=function(){
		if (menuFirstDayElm.className.indexOf('expanded')==-1){replaceClass(menuFirstDayElm,'collapsed','expanded');isAccOpened=true}
		else{replaceClass(menuFirstDayElm,'expanded','collapsed');isAccOpened=false}
	},
	onSelFirstDay=function(ev){
		ev=ev||window.event;let el=ev.target||ev.srcElement;cd.setFirstDayOfWeek(el.getAttribute('firstday'));applyTodayTmout();
	},
	onDispToday=function(){cd.today()},
	onNewTheme=function(){newTheme();applyTheme()},
	onAbout=function(){
		hideMenu();
		aboutTitleElm.innerHTML='Hijri/Gregorian&nbsp;Dual&nbsp;Calendar';
		aboutDateElm.innerHTML='Gorontalo,&nbsp;14&nbsp;January&nbsp;2019';
		aboutElm.style.display='block';
		aboutElm.callback=applyTodayTmout;
		if(actTmoId)window.clearTimeout(actTmoId);
		actTmoId=window.setTimeout(function(){
			aboutElm.style.display='none';aboutElm.callback=null;aboutTitleElm.innerHTML=aboutDateElm.innerHTML='';cd.today()
		},tmout*1000)
	},
	onClose=function(){hideMenu()},
	onRszWdw=function(){
		if(isSmallScreen&&calElm.clientWidth>=640||!isSmallScreen&&calElm.clientWidth<640){
			isSmallScreen=!isSmallScreen;updTodayLbl();recreateWdayTitle()
		}
	},
	hideMenu=function(){if(isAccOpened)onFirstDay();replaceClass(menuWrapElm,' w3-show','');replaceClass(menuBtnElm,' w3-light-grey','')},
	decMonth=function(){dispDate.setMonth(dispDate.getMonth()-1);updCal();applyTodayTmout()},
	incMonth=function(){dispDate.setMonth(dispDate.getMonth()+1);updCal();applyTodayTmout()},
	decYear=function(){dispDate.setFullYear(dispDate.getFullYear()-1);updCal();applyTodayTmout()},
	incYear=function(){dispDate.setFullYear(dispDate.getFullYear()+1);updCal();applyTodayTmout()},
	syncDates=function(){getOppsDate().setTime(dispDate.getTime())},
	getOppsDate=function(){return isHijr?gdate:hdate},
	getFixTime=function(t){t-=tzOffset;return t-t%864e5+36e5+tzOffset},
	getCurTime=function(){return getFixTime(Date.now())},
	beginNewDate=function(){
		let n=Date.now()-tzOffset,t=864e5-n%864e5;
		window.setTimeout(beginNewDate,t);updTodayLbl();
		if(isAutoNewTheme){newTheme();applyTheme()}
		if(isDispToday){isDispToday=false;cd.today()}
	},
	applyTodayTmout=function(){
		if(actTmoId){window.clearTimeout(actTmoId);actTmoId=null}
		if(!isDispToday)actTmoId=window.setTimeout(cd.today,tmout*1000)
	},
	newTheme=function(){let ct=Calendar.themes,i;do i=Math.floor(Math.random()*ct.length);while(ct[i]==theme);theme=ct[i]},
	applyTheme=function(){
		headerElm.className=headerElm.className.substring(0,headerElm.className.lastIndexOf('w3-'))+'w3-'+theme
	},
	replaceClass=function(el,dt,sr){el.className=el.className.replace(dt,sr)};
	cd.attachTo=function(el){if(el.appendChild&&!calElm.parentNode){el.appendChild(calElm);onRszWdw();return true}return false};
	cd.fireResize=function(){onRszWdw()};
	cd.getElement=function(){return calElm};
	cd.resetDate=function(y,m){
		let t=dispDate.getTime();
		dispDate.setFullYear(HijriDate.int(y,dispDate.getFullYear()));
		dispDate.setMonth(HijriDate.int(m,dispDate.getMonth()));
		if(dispDate.getTime()!=t){gridAni='zoom';updCal();return true}
		return false
	};
	cd.setFirstDayOfWeek=function(f){
		f=HijriDate.int(f,firstDay)%7;
		if(f!=firstDay){
			let el=accFirstDayElm.children[firstDay];
			replaceClass(el,'w3-transparent','w3-button w3-ripple');
			el.disabled=false;firstDay=f;recreateWdayTitle();gridAni='top';recreateDates();return true
		}return false
	};
	cd.setFullYear=function(y){return cd.resetDate(y)};
	cd.setHijriMode=function(h){
		if(typeof h=='boolean'&&h!=isHijr){
			syncDates();dispDate=getOppsDate();isHijr=h;updCalModMenuLbl();updFirstDayMenuLbl();updTodayLbl();recreateWdayTitle();
			if(isDispToday){isDispToday=false;dispDate.setDate(1);cd.today()}
			else{
				let d=dispDate.getDate();dispDate.setDate(1);
				if(d>15)dispDate.setMonth(dispDate.getMonth()+1);
				gridAni='top';updCal()
			}return true
		}return false
	};
	cd.setLanguage=function(l){
		let c=Calendar;
		if(typeof l=='string'){
			l=l.toLowerCase();
			if(typeof c.language[l]=='object'&&l!=c.lang){
				c.lang=l;
				replaceClass(gridsElm,' right-to-left','');
				isRTL=c.getVal('isRTL');if(isRTL)gridsElm.className+=' right-to-left';
				gridAni='zoom';updMenuLbl();updCalModMenuLbl();updFirstDayMenuLbl();updTodayLbl();updHeader();
				recreateWdayTitle();recreateDates();return true
			}
		}return false
	};
	cd.setMonth=function(m){return cd.resetDate(null,m)};
	cd.setTheme=function(t){
		let ct=Calendar.themes,ctl=ct.length,i=0;
		if(typeof t=='number'){
			if(0<=t&&t<ctl){isAutoNewTheme=false;theme=ct[t]}
			else{isAutoNewTheme=true;newTheme()}
		}else if(typeof t=='string'){
			t=t.toLowerCase();
			for(;i<ctl;i++)if(ct[i]==t)break;
			if(i<ctl){isAutoNewTheme=false;theme=ct[i]}
			else{isAutoNewTheme=true;newTheme()}
		}else{isAutoNewTheme=true;newTheme()}
		applyTheme();return isAutoNewTheme
	};
	cd.setTime=function(t){
		let o=dispDate.getTime();
		dispDate.setTime(getFixTime(HijriDate.int(t,getCurTime())));dispDate.setDate(1);
		if(dispDate.getTime()!=o){gridAni='zoom';updCal();return true}
		return false
	};
	cd.setTodayTimeout=function(t){t=HijriDate.int(t,tmout);if(t>=10){tmout=t;applyTodayTmout();return true}return false};
	cd.today=function(){
		if(!isDispToday){dispDate.setTime(getCurTime());dispDate.setDate(1);gridAni='top';updCal();return true}return false
	};
	if(typeof isHijr!='boolean')isHijr=false;
	dispDate=isHijr?hdate:gdate;
	firstDay=HijriDate.int(firstDay,1)%7;
	if(typeof lang=='string'){lang=lang.toLowerCase();if(typeof Calendar.language[lang]!='object')lang='en'}
	else lang='en';
	Calendar.lang=lang;
	cd.setTheme(theme);
	tmout=HijriDate.int(tmout,120);
	beginNewDate();
	year=HijriDate.int(year,NaN);month=HijriDate.int(month,NaN);
	if(!isNaN(year)&&isNaN(month)){dispDate.setTime(getFixTime(year));dispDate.setDate(1)}
	else{
		dispDate.setTime(getCurTime());dispDate.setDate(1);
		if(!isNaN(year))dispDate.setFullYear(year);
		if(!isNaN(month))dispDate.setMonth(month)
	}
	createStyle();createAboutModal();createCal();applyTodayTmout()
}
Date.prototype.getMonthName=function(m){
	m=(HijriDate.int(m,this.getMonth())%12+12)%12;
	return Calendar.getVal('monthNames')[m]
};
Date.prototype.getMonthShortName=function(m){
	m=(HijriDate.int(m,this.getMonth())%12+12)%12;
	let c=Calendar.getVal,s=c('monthShortNames');
	return s?s[m]:c('monthNames')[m]
};
Date.prototype.getWeekdayName=function(d){
	d=(HijriDate.int(d,this.getDay())%7+7)%7;
	return Calendar.getVal('weekdayNames')[d]
};
Date.prototype.getWeekdayShortName=function(d){
	d=(HijriDate.int(d,this.getDay())%7+7)%7;
	let c=Calendar.getVal,s=c('weekdayShortNames');
	return s?s[d]:c('weekdayNames')[d]
};
Date.prototype.getYearString=function(y){
	y=HijriDate.int(y,this.getFullYear());
	let e=Calendar.getVal('eraSuffix'),i=0;
	if(e){if(y<1){i++;y=1-y}y=y+' '+e[i]}else y=y.toString();return y
};
Date.prototype.todayShortString=function(){
	let t=this.getTime();this.setTime(Date.now());
	let s=this.getWeekdayShortName()+', '+this.getDate()+' '+this.getMonthShortName()+' '+this.getFullYear();
	this.setTime(t);return Calendar.getDigit(s)
};
Date.prototype.todayString=function(){
	let t=this.getTime();this.setTime(Date.now());
	let	s=this.getWeekdayName()+', '+this.getDate()+' '+this.getMonthName()+' '+this.getFullYear();
	this.setTime(t);return Calendar.getDigit(s)
};
HijriDate.prototype.getMonthName=function(m){
	m=(HijriDate.int(m,this.getMonth())%12+12)%12;
	let c=Calendar;
	return c.lang=='en'?HijriDate.monthNames[m]:c.getVal('hMonthNames')[m]
};
HijriDate.prototype.getMonthShortName=function(m){
	m=(HijriDate.int(m,this.getMonth())%12+12)%12;
	let c=Calendar;
	if(c.lang=='en')return HijriDate.monthShortNames[m];
	let cg=c.getVal,s=cg('hMonthShortNames');
	return s?s[m]:cg('hMonthNames')[m]
};
HijriDate.prototype.getWeekdayName=function(d){
	d=(HijriDate.int(d,this.getDay())%7+7)%7;
	let c=Calendar;
	if(c.lang=='en')return HijriDate.weekdayNames[d]
	return c.getVal('weekdayNames')[d]
};
HijriDate.prototype.getWeekdayShortName=function(d){
	d=(HijriDate.int(d,this.getDay())%7+7)%7;
	let c=Calendar;
	if(c.lang=='en')return HijriDate.weekdayShortNames[d]
	let cg=c.getVal,s=cg('weekdayShortNames');
	return s?s[d]:cg('weekdayNames')[d]
};
HijriDate.prototype.getYearString=function(y){
	y=HijriDate.int(y,this.getFullYear());
	let e=Calendar.getVal('hEraSuffix'),i=0;
	if(e){if(y<1){i++;y=1-y}y=y+' '+e[i]}else y=y.toString();return y
};
HijriDate.prototype.todayShortString=function(){
	let t=this.getTime();this.setTime(Date.now());
	let	s=this.getWeekdayShortName()+', '+this.getDate()+' '+this.getMonthShortName()+' '+this.getFullYear();
	this.setTime(t);return Calendar.getDigit(s)
};
HijriDate.prototype.todayString=function(){
	let t=this.getTime();this.setTime(Date.now());
	let	s=this.getWeekdayName()+', '+this.getDate()+' '+this.getMonthName()+' '+this.getFullYear();
	this.setTime(t);return Calendar.getDigit(s)
};
Object.defineProperty(Calendar,'getDigit',{value:function(d){
	let c=Calendar.getVal('digit');
	if(c)return d.toString().replace(/\d(?=[^<>]*(<|$))/g,function($0){return c[$0]});return d
}});
Object.defineProperty(Calendar,'themes',{value:['amber','aqua','black','blue','blue-grey','brown','cyan','dark-grey','deep-orange','deep-purple','green','grey','indigo','khaki','light-blue','light-green','lime','orange','pink','purple','red','teal','yellow']});
Object.defineProperty(Calendar,'lang',{value:'en',writable:true});
Object.defineProperty(Calendar,'getVal',{value:function(key){return Calendar.language[Calendar.lang][key]}});
Calendar.language={en:{
	isRTL:false,
	menuItem0:["Hijri calendar","Gregorian calendar"],
	menuItem1:"Firstday",
	menuItem2:"Today",
	menuItem3:"New theme",
	menuItem4:"About",
	menuItem5:"Close",
	eraSuffix:["AD","BC"],
	hEraSuffix:["H","BH"],
	monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],
	monthShortNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
	weekdayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
	weekdayShortNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
}};
Calendar.language['id']={
	isRTL:false,
	menuItem0:["Kalender Hijriyah","Kalender Masehi"],
	menuItem1:"Mulai hari",
	menuItem2:"Hari ini",
	menuItem3:"Tema baru",
	menuItem4:"Tentang",
	menuItem5:"Tutup",
	eraSuffix:["M","SM"],
	hEraSuffix:["H","SH"],
	monthNames:["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"],
	monthShortNames:["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"],
	weekdayNames:["Minggu","Senin","Selasa","Rabu","Kamis","Jum'at","Sabtu"],
	weekdayShortNames:["Min","Sen","Sel","Rab","Kam","Jum","Sab"],
	hMonthNames:["Muharam","Safar","Rabi'ul-Awal","Rabi'ul-Akhir","Jumadil-Awal","Jumadil-Akhir","Rajab","Sya'ban","Ramadhan","Syawwal","Zulqa'idah","Zulhijjah"],
	hMonthShortNames:["Muh","Saf","Raw","Rak","Jaw","Jak","Raj","Sya","Ram","Syw","Zuq","Zuh"]
};
Calendar.language['ar']={
	isRTL:true,
	digit:["٠","١","٢","٣","٤", "٥","٦","٧","٨","٩"],
	menuItem0:["التقويم الهجري","التقويم الغريغوري"],
	menuItem1:"اليوم الأول",
	menuItem2:"اليوم",
	menuItem3:"لون جديد",
	menuItem4:"حول",
	menuItem5:"أغلق",
	eraSuffix:["ميلادي","قبل الميلاد"],
	hEraSuffix:["هجرة","قبل الهجرة"],
	monthNames:["يَنايِر","فِبرايِر","مارِس","أبريل","مايو","يونيو","يوليو","أغُسطُس","سِبْتَمْبِر","أکْتببِر","نوفَمْبِر","ديسَمْبِر"],
	weekdayNames:["الأحَد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],
	hMonthNames:["المُحَرَّم","صَفَر ","رَبيع الاوَّل","رَبيع الآخِر","جُمادى الأولى","جُمادى الآخِرة","رَجَب","شَعبان","رَمَضان","شَوّال","ذو القَعدة","ذو الحِجّة"]
};
