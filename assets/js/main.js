'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const menu=$('#services-menu'),booking=$('#booking');
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
let menuOpener=null;
$$('[data-menu]').forEach(b=>b.addEventListener('click',()=>{menuOpener=b;menu.showModal();$$('[data-menu]').forEach(x=>x.setAttribute('aria-expanded','true'));}));
$('[data-close-menu]').onclick=()=>menu.close();
menu.addEventListener('close',()=>{$$('[data-menu]').forEach(x=>x.setAttribute('aria-expanded','false'));menuOpener?.focus();});
[menu,booking].forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
$$('.mega-layout nav a').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const target=$(a.getAttribute('href'));if(target){$('#service-search').value='';filterServices();target.scrollIntoView({behavior:reduced()?'instant':'smooth',block:'start'});}}));
function filterServices(){const q=$('#service-search').value.trim().toLocaleLowerCase('ru');let count=0;$$('.mega-group').forEach(g=>{const title=$('h3',g).textContent.toLocaleLowerCase('ru'),groupMatch=title.includes(q);let visible=0;$$(':scope > a',g).forEach(a=>{const match=groupMatch||a.textContent.toLocaleLowerCase('ru').includes(q);a.hidden=!match;if(match)visible++;});g.hidden=!groupMatch&&!visible;if(!g.hidden)count++;});$('#no-services').hidden=count!==0;}
$('#service-search').addEventListener('input',filterServices);
$$('[data-book]').forEach(b=>b.addEventListener('click',()=>{const doctor=b.dataset.doctor;$('#booking-description').textContent=doctor?'Запись к врачу: '+doctor:'Выберите удобную клинику и оставьте номер телефона';$('.form-status').textContent='';booking.showModal();}));
$('[data-close-book]').onclick=()=>booking.close();
$('#booking-form').addEventListener('submit',e=>{e.preventDefault();$('.form-status').textContent='Для подтверждения записи позвоните: +7 (499) 707-25-35';});
$('#footer-booking-form').addEventListener('submit',e=>{e.preventDefault();$('.footer-form-status').textContent='Для подтверждения записи позвоните: +7 (499) 707-25-35';});
const normalize=s=>s.toLocaleLowerCase('ru').replaceAll('ё','е');
if($('#doctor-search')){
let doctorLimit=6;
const aliases={orthoped:'протезирование коронки ортопед',implant:'имплантация',surgeon:'хирургия удаление',therapy:'лечение зубов кариес',child:'детский дети',ortho:'брекеты элайнеры прикус',perio:'десны пародонтология',hygiene:'чистка гигиена',anesthesia:'сон наркоз анестезия',endo:'каналы микроскоп'};
const mobileDoctorsMedia=matchMedia('(max-width:760px)');
const doctorCards=$$('.doctor-card');
const shuffledDoctors=[...doctorCards];
for(let i=shuffledDoctors.length-1;i>0;i--){const k=Math.floor(Math.random()*(i+1));[shuffledDoctors[i],shuffledDoctors[k]]=[shuffledDoctors[k],shuffledDoctors[i]];}
const mobileDoctorSelection=new Set(shuffledDoctors.slice(0,3));
function filterDoctors(){
 const q=normalize($('#doctor-search').value.trim()),tag=$('#specialty').value;
 const mobileDefault=mobileDoctorsMedia.matches&&!q&&tag==='all';
 const matches=doctorCards.filter(card=>{const tags=card.dataset.specialty.split(' ');return (tag==='all'||tags.includes(tag))&&normalize(card.textContent+' '+tags.map(x=>aliases[x]||'').join(' ')).includes(q);});
 const visible=new Set(mobileDefault?matches.filter(card=>mobileDoctorSelection.has(card)):matches.slice(0,doctorLimit));
 doctorCards.forEach(card=>card.hidden=!visible.has(card));
 const count=matches.length,last=count%10,teen=count%100;
 $('#doctor-count').textContent=mobileDefault?'Показаны '+visible.size+' из '+count:count+' '+(last===1&&teen!==11?'специалист':last>=2&&last<=4&&(teen<12||teen>14)?'специалиста':'специалистов');
 $('#doctor-empty').hidden=count!==0;$('#show-more-doctors').hidden=mobileDefault||count<=doctorLimit;
}
mobileDoctorsMedia.addEventListener('change',()=>{doctorLimit=6;filterDoctors();});
['input','change'].forEach(event=>$(event==='input'?'#doctor-search':'#specialty').addEventListener(event,()=>{doctorLimit=6;filterDoctors();}));
$('#show-more-doctors').onclick=()=>{doctorLimit+=6;filterDoctors();};
$('#reset-doctors').onclick=()=>{$('#doctor-search').value='';$('#specialty').value='all';doctorLimit=6;filterDoctors();$('#doctor-search').focus();};
filterDoctors();
}
$('#comparison-range')?.addEventListener('input',e=>$('.comparison').style.setProperty('--compare',e.target.value+'%'));
if(window.gsap && $('.hero-copy')){gsap.matchMedia().add('(prefers-reduced-motion: no-preference)',()=>{const tl=gsap.timeline({defaults:{ease:'power2.out'}});tl.from('.hero-copy > *',{y:8,autoAlpha:0,duration:.28,stagger:.04},0).from('.hero-side',{x:8,autoAlpha:0,duration:.28},.15);});}

const stickyHeader=$('.sticky-header');
const stickyObserver=new IntersectionObserver(entries=>{const active=!entries[0].isIntersecting&&entries[0].boundingClientRect.bottom<0;stickyHeader.classList.toggle('is-visible',active);stickyHeader.inert=!active;},{threshold:0});
stickyHeader.inert=true;stickyObserver.observe($('.header'));

const filmDialog=$('#clinic-film'),filmFrame=$('iframe',filmDialog);
$('.clinic-film-button')?.addEventListener('click',()=>{const videoUrl=new URL(filmFrame.dataset.videoSrc);videoUrl.searchParams.set('autoplay','1');filmFrame.src=videoUrl.href;filmDialog.showModal();});
$('.film-close').addEventListener('click',()=>filmDialog.close());
filmDialog.addEventListener('close',()=>{filmFrame.removeAttribute('src');$('.clinic-film-button')?.focus();});
filmDialog.addEventListener('click',e=>{if(e.target===filmDialog){const r=filmDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)filmDialog.close();}});

function phoneDigits(value){let n=value.replace(/\D/g,'');if(n[0]==='7'||n[0]==='8')n=n.slice(1);return n.slice(0,10);}
function maskedPhone(n){if(!n)return '';let out='+7 ('+n.slice(0,3);if(n.length>=3)out+=') ';if(n.length>3)out+=n.slice(3,6);if(n.length>6)out+='-'+n.slice(6,8);if(n.length>8)out+='-'+n.slice(8,10);return out;}
$$('input[type="tel"]').forEach(input=>{
 input.addEventListener('input',()=>{const pos=input.selectionStart??input.value.length;const before=input.value.slice(0,pos).replace(/\D/g,'').length;const digits=phoneDigits(input.value);input.value=maskedPhone(digits);let caret=input.value.length;if(pos<input.value.length){let count=0;for(let i=0;i<input.value.length;i++){if(/\d/.test(input.value[i]))count++;if(count>=before){caret=i+1;break;}}}input.setSelectionRange(caret,caret);input.setCustomValidity('');});
 input.addEventListener('keydown',e=>{if(e.key==='Backspace'&&input.selectionStart===input.selectionEnd){const pos=input.selectionStart;if(pos&&/[^\d]/.test(input.value[pos-1])){e.preventDefault();const n=phoneDigits(input.value);const digitsBefore=phoneDigits(input.value.slice(0,pos)).length;const idx=Math.max(0,digitsBefore-1);input.value=maskedPhone(n.slice(0,idx)+n.slice(idx+1));const prefix=maskedPhone(n.slice(0,idx));input.setSelectionRange(prefix.length,prefix.length);}}});
 input.addEventListener('blur',()=>{if(input.value&&phoneDigits(input.value).length!==10)input.setCustomValidity('Введите номер полностью: +7 (999) 999-99-99');else input.setCustomValidity('');});
});

const serviceScroller=$('.mega-content'),serviceNav=$('.mega-layout>nav');
const serviceLinks=$$('a[href^="#group-"]',serviceNav);
const serviceHighlight=document.createElement('span');serviceHighlight.className='mega-active-highlight';serviceHighlight.setAttribute('aria-hidden','true');serviceNav.prepend(serviceHighlight);
let activeService=null,serviceFrame=0;
function activateService(id){
 const link=serviceLinks.find(a=>a.getAttribute('href')==='#'+id);
 if(!link){serviceHighlight.hidden=true;serviceLinks.forEach(a=>a.removeAttribute('aria-current'));activeService=null;return;}
 serviceHighlight.hidden=false;serviceLinks.forEach(a=>{a.classList.toggle('is-active',a===link);if(a===link)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
 serviceHighlight.style.height=link.offsetHeight+'px';serviceHighlight.style.transform='translateY('+link.offsetTop+'px)';
 if(activeService!==id){const top=link.offsetTop,bottom=top+link.offsetHeight;if(top<serviceNav.scrollTop+12||bottom>serviceNav.scrollTop+serviceNav.clientHeight-12)serviceNav.scrollTo({top:Math.max(0,top-serviceNav.clientHeight/2+link.offsetHeight/2),behavior:reduced()?'instant':'smooth'});}
 activeService=id;
}
function syncServiceCategory(){
 serviceFrame=0;if(!menu.open)return;
 const groups=$$('.mega-group',serviceScroller).filter(g=>!g.hidden);if(!groups.length){activateService(null);return;}
 const threshold=serviceScroller.getBoundingClientRect().top+45;
 let current=groups[0];for(const g of groups){if(g.getBoundingClientRect().top<=threshold)current=g;else break;}
 if(serviceScroller.scrollHeight-serviceScroller.clientHeight-serviceScroller.scrollTop<3)current=groups[groups.length-1];
 activateService(current.id);
}
function queueServiceSync(){if(!serviceFrame)serviceFrame=requestAnimationFrame(syncServiceCategory);}
serviceScroller.addEventListener('scroll',queueServiceSync,{passive:true});
$$('[data-menu]').forEach(b=>b.addEventListener('click',queueServiceSync));
$('#service-search').addEventListener('input',queueServiceSync);
serviceLinks.forEach(a=>a.addEventListener('click',()=>activateService(a.hash.slice(1))));
new ResizeObserver(queueServiceSync).observe(serviceNav);

// Occasional marketing reveals: once, short, never hide content while waiting.
const motionEase='cubic-bezier(.23,1,.32,1)';
const revealObserver=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;revealObserver.unobserve(entry.target);if(!reduced())entry.target.animate([{opacity:.72,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:250,easing:motionEase});}},{threshold:.15});
$$('.service-benefit,.family-photo,.appointment-photo,.installment-heading,.article').forEach(el=>revealObserver.observe(el));
const moreServices=$('.more-services'),moreSummary=moreServices?$('summary',moreServices):null;let accordionMotion=null,accordionExpanded=moreServices?.open;
moreSummary?.addEventListener('click',e=>{
 if(reduced()||e.detail===0)return;
 e.preventDefault();const wasOpen=accordionExpanded;accordionExpanded=!wasOpen;const from=moreServices.getBoundingClientRect().height;
 accordionMotion?.cancel();moreServices.style.height='auto';moreServices.open=true;
 const to=wasOpen?moreSummary.getBoundingClientRect().height:moreServices.getBoundingClientRect().height;
 moreServices.style.overflow='hidden';
 accordionMotion=moreServices.animate([{height:from+'px'},{height:to+'px'}],{duration:200,easing:motionEase});
 accordionMotion.onfinish=()=>{moreServices.open=!wasOpen;moreServices.style.height='';moreServices.style.overflow='';accordionMotion=null;};
});
const doctorMotionObserver=new MutationObserver(records=>{const shown=records.filter(r=>r.attributeName==='hidden'&&!r.target.hidden).map(r=>r.target);if(reduced())return;shown.forEach((card,i)=>card.animate([{opacity:.65,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:200,delay:Math.min(i,4)*30,easing:motionEase}));});
$$('.doctor-card').forEach(card=>doctorMotionObserver.observe(card,{attributes:true,attributeFilter:['hidden']}));

document.addEventListener('keydown',()=>document.documentElement.classList.add('keyboard-navigation'));document.addEventListener('pointerdown',()=>document.documentElement.classList.remove('keyboard-navigation'),{passive:true});
moreServices?.addEventListener('toggle',()=>{if(!accordionMotion)accordionExpanded=moreServices?.open;});

const siteNavigation=$('#site-navigation');let siteNavOpener=null;
$$('[data-site-menu]').forEach(button=>button.addEventListener('click',()=>{siteNavOpener=button;siteNavigation.showModal();$$('[data-site-menu]').forEach(b=>b.setAttribute('aria-expanded','true'));}));
$('[data-close-site-nav]').addEventListener('click',()=>siteNavigation.close());
siteNavigation.addEventListener('close',()=>{$$('[data-site-menu]').forEach(b=>b.setAttribute('aria-expanded','false'));if(!menu.open&&!booking.open)siteNavOpener?.focus();});
siteNavigation.addEventListener('click',e=>{if(e.target===siteNavigation){const r=siteNavigation.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)siteNavigation.close();}});
$$('nav a',siteNavigation).forEach(a=>a.addEventListener('click',()=>siteNavigation.close()));
$$('[data-book]',siteNavigation).forEach(b=>b.addEventListener('click',()=>siteNavigation.close()));
$('[data-open-services]').addEventListener('click',()=>{siteNavigation.close();menuOpener=siteNavOpener;menu.showModal();$$('[data-menu]').forEach(b=>b.setAttribute('aria-expanded','true'));queueServiceSync();$('#service-search').focus();});

const desktopNav=$('.sticky-header>nav'),desktopLinks=$$(':scope>a',desktopNav);
const overflowMenu=document.createElement('details');overflowMenu.className='nav-overflow';overflowMenu.hidden=true;
overflowMenu.innerHTML='<summary aria-label="Другие разделы сайта">Ещё <svg class="icon" aria-hidden="true"><use href="#i-chevron"/></svg></summary><div class="nav-overflow-panel"></div>';
desktopNav.append(overflowMenu);let navResizeFrame=0;
function fitDesktopNavigation(){
 navResizeFrame=0;if(matchMedia('(max-width:760px)').matches){overflowMenu.hidden=true;overflowMenu.open=false;return;}
 desktopLinks.forEach(a=>a.hidden=false);overflowMenu.hidden=true;
 const available=desktopNav.clientWidth;if(!available)return;
 const gap=Number.parseFloat(getComputedStyle(desktopNav).columnGap)||18;
 const widths=desktopLinks.map(a=>a.getBoundingClientRect().width);
 const total=widths.reduce((a,b)=>a+b,0)+gap*(widths.length-1);
 const panel=$('.nav-overflow-panel',overflowMenu);panel.replaceChildren();
 if(total<=available){overflowMenu.open=false;return;}
 overflowMenu.hidden=false;const moreWidth=overflowMenu.getBoundingClientRect().width;
 let used=moreWidth,visible=0;
 for(let i=0;i<desktopLinks.length;i++){if(used+gap+widths[i]>available)break;used+=gap+widths[i];visible++;}
 desktopLinks.forEach((a,i)=>{a.hidden=i>=visible;if(a.hidden){const copy=a.cloneNode(true);copy.hidden=false;copy.addEventListener('click',()=>overflowMenu.open=false);panel.append(copy);}});
}
function queueNavResize(){if(!navResizeFrame)navResizeFrame=requestAnimationFrame(fitDesktopNavigation);}
new ResizeObserver(queueNavResize).observe(desktopNav);
document.fonts.ready.then(queueNavResize);window.addEventListener('resize',queueNavResize,{passive:true});queueNavResize();
document.addEventListener('click',e=>{if(!overflowMenu.contains(e.target))overflowMenu.open=false;});
overflowMenu.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();overflowMenu.open=false;$('summary',overflowMenu).focus();}});

$$('[data-callback]').forEach(button=>button.addEventListener('click',()=>{$('#booking-title').textContent='Заказать бесплатный звонок';$('#booking-description').textContent='Оставьте номер — администратор свяжется с вами';$('.form-status').textContent='';booking.showModal();}));
booking.addEventListener('close',()=>{$('#booking-title').textContent='Знакомство начинается с улыбки';});

 document.querySelectorAll("#services-menu [data-book]").forEach(b=>b.addEventListener("click",()=>document.querySelector("#services-menu").close()));

// Static hosting uses directory URLs; file previews use explicit index.html files.
if(location.protocol!=='file:')document.querySelectorAll('a[href]').forEach(a=>{const href=a.getAttribute('href');if(/(?:^|\/)doctors\/(?:bandurin-yurij-valerevich\/)?index\.html(?:#.*)?$/.test(href))a.setAttribute('href',href.replace(/index\.html(?=#|$)/,''));});
