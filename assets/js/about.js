(() => {
 const dialog=document.querySelector('#about-lightbox');if(!dialog)return;
 const image=dialog.querySelector('figure img');let items=[],index=0,opener;
 function show(i){index=(i+items.length)%items.length;image.src=items[index].dataset.image;image.alt=items[index].querySelector('img').alt;}
 document.querySelectorAll('[data-gallery]').forEach(button=>button.addEventListener('click',()=>{opener=button;items=Array.from(document.querySelectorAll('[data-gallery="'+button.dataset.gallery+'"]'));show(items.indexOf(button));dialog.showModal();document.documentElement.classList.add("about-gallery-open");}));
 dialog.querySelector('.about-lightbox-close').onclick=()=>dialog.close();dialog.querySelector('.about-lightbox-prev').onclick=()=>show(index-1);dialog.querySelector('.about-lightbox-next').onclick=()=>show(index+1);
 dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')show(index-1);if(e.key==='ArrowRight')show(index+1);});dialog.addEventListener('close',()=>{document.documentElement.classList.remove('about-gallery-open');opener?.focus();});dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
let touchX=null,touchY=null;dialog.addEventListener('touchstart',e=>{if(e.touches.length===1){touchX=e.touches[0].clientX;touchY=e.touches[0].clientY;}else{touchX=null;}},{passive:true});dialog.addEventListener('touchend',e=>{if(touchX===null)return;const dx=e.changedTouches[0].clientX-touchX,dy=e.changedTouches[0].clientY-touchY;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)show(index+(dx<0?1:-1));touchX=null;},{passive:true});
})();
