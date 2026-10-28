// Smooth desktop wheel scrolling, with native touch and modal scrolling.
(()=>{
 'use strict';
 if(!window.Lenis)return;
 const root=document.documentElement;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const pointer=matchMedia('(pointer: fine)');
 let scroll=null,blocked=false;
 function syncModal(){
  const next=!!document.querySelector('dialog[open]')||root.classList.contains('about-gallery-open');
  if(next===blocked)return;
  blocked=next;
  if(scroll){if(blocked)scroll.stop();else scroll.start();}
 }
 function configure(){
  scroll?.destroy();scroll=null;
  if(reduced.matches||!pointer.matches)return;
  scroll=new Lenis({autoRaf:true,lerp:0.14,smoothWheel:true,syncTouch:false,anchors:false,stopInertiaOnNavigate:true,respectReducedMotion:true,prevent:node=>node.matches?.('dialog,[data-lenis-prevent],.mega-content,.mega-layout>nav,.team-category-nav,.price-mobile-bar,.price-categories,.article-sidebar,.nav-overflow-panel,textarea,select')});
  blocked=false;syncModal();
 }
 document.addEventListener('click',event=>{
  if(!scroll||blocked||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const link=event.target.closest('a[href]');
  if(!link||link.closest('dialog')||link.hasAttribute('download')||(link.target&&link.target!=='_self'))return;
  const url=new URL(link.href,location.href);
  if(url.origin!==location.origin||url.pathname!==location.pathname||url.search!==location.search||!url.hash)return;
  let id;try{id=decodeURIComponent(url.hash.slice(1));}catch{return;}
  const target=document.getElementById(id);if(!target)return;
  event.preventDefault();
  if(location.hash!==url.hash)history.pushState(null,'',url.hash);
  scroll.scrollTo(target,{onComplete:()=>{if(event.detail===0){const temporary=!target.hasAttribute('tabindex');if(temporary)target.setAttribute('tabindex','-1');target.focus({preventScroll:true});if(temporary)target.addEventListener('blur',()=>target.removeAttribute('tabindex'),{once:true});}}});
 });
 new MutationObserver(syncModal).observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});
 new MutationObserver(syncModal).observe(root,{attributes:true,attributeFilter:['class']});
 reduced.addEventListener('change',configure);pointer.addEventListener('change',configure);configure();
})();
