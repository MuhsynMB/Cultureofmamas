/* Culture of Mamas – shared site script */
(function(){
  var btn=document.getElementById('burger'),menu=document.getElementById('menu');
  function setMenu(o){menu.hidden=!o;btn.setAttribute('aria-expanded',o?'true':'false');}
  var page=document.body.getAttribute('data-page');
  if(page==='home'){ /* send old one-page links (#about etc.) to the new pages */
    var legacy={about:'/about',experiences:'/book',gifts:'/gifts'},h=location.hash.slice(1);
    if(legacy[h]){location.replace(legacy[h]);return;}
  }
  document.querySelectorAll('#menu a').forEach(function(a){
    var cur=a.getAttribute('data-v')===page;a.classList.toggle('cur',cur);if(cur){a.setAttribute('aria-current','page');}
  });
  btn.addEventListener('click',function(e){e.stopPropagation();setMenu(menu.hidden);});
  menu.addEventListener('click',function(e){if(e.target.closest('a')){setMenu(false);}});
  document.addEventListener('click',function(e){
    var s=e.target.closest('[data-scroll]');
    if(s){var el=document.getElementById(s.getAttribute('data-scroll'));if(el){el.scrollIntoView({behavior:'smooth'});}}
    else if(!menu.hidden&&!e.target.closest('header')){setMenu(false);}
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){setMenu(false);}});
  document.getElementById('yr').textContent=new Date().getFullYear();
  (function(){ /* hero background slideshow */
    var sl=document.querySelectorAll('.hero .slide'),i=0;
    function load(el){var u=el&&el.getAttribute('data-bg');if(u){el.style.backgroundImage='url('+u+')';el.removeAttribute('data-bg');}}
    if(sl.length<2||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    load(sl[1]);
    setInterval(function(){
      if(document.hidden)return;
      sl[i].classList.remove('on');i=(i+1)%sl.length;sl[i].classList.add('on');load(sl[(i+1)%sl.length]);
    },5500);
  })();
})();

(function(){
  var dlg=document.getElementById('mail'),form=document.getElementById('mail-form');
  var type=document.getElementById('mail-type'),exp=document.getElementById('mail-exp');
  var subj=document.getElementById('mail-subject'),body=document.getElementById('mail-body'),done=document.getElementById('mail-done');
  var fsB=document.getElementById('fs-booking'),fsG=document.getElementById('fs-gift');
  var pick=null;
  function today(){var d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,10);}
  function sync(){
    var gift=type.value==='Order spices';
    fsB.disabled=gift;fsG.disabled=!gift; /* disabled fields are not submitted */
    subj.value=gift?'Spice order enquiry':'Booking enquiry: '+exp.value;
  }
  function open(kind){
    body.hidden=false;done.hidden=true;
    type.value=kind==='gift'?'Order spices':'Book an experience';
    if(pick&&pick.kind==='booking'){exp.value=pick.name;}
    if(pick&&pick.kind==='gift'){form.querySelectorAll('#mail-products input').forEach(function(c){if(c.value===pick.name)c.checked=true;});}
    document.getElementById('mail-date').min=today();
    sync();
    if(typeof dlg.showModal==='function'){dlg.showModal();}else{dlg.setAttribute('open','');}
    form.querySelector('[name=name]').focus();
  }
  function close(){if(dlg.open){dlg.close();}}
  form.addEventListener('change',function(e){if(e.target.name==='products'){var err=form.querySelector('[data-fs-error="products"]');err.textContent='';err.removeAttribute('data-fs-active');}});
  type.addEventListener('change',sync);exp.addEventListener('change',sync);
  document.addEventListener('click',function(e){
    var w=e.target.closest('[data-wa]');
    if(w){ /* pre-fill the WhatsApp message, including the option the visitor picked */
      var gift=w.getAttribute('data-wa')==='gift',p=pick&&pick.kind===(gift?'gift':'booking')?pick.name:'';
      var msg=gift?"Hi Culture of Mamas! I'd like to order spices.\n\nPackages: "+p+"\nPickup or delivery: "
                  :"Hi Culture of Mamas! I'd like to book a cooking experience.\n\nExperience: "+p+"\nDate: \nNumber of guests: ";
      w.href='https://wa.me/255773958346?text='+encodeURIComponent(msg);return;
    }
    var b=e.target.closest('[data-email]');
    if(b){open(b.getAttribute('data-email'));return;}
    var a=e.target.closest('.opt [data-scroll]');
    if(a){pick={kind:a.getAttribute('data-scroll')==='contact-gift'?'gift':'booking',name:a.closest('.opt').querySelector('h3').textContent.trim()};}
    if(e.target.closest('[data-close]')){close();}
  });
  dlg.addEventListener('click',function(e){if(e.target===dlg){close();}}); /* click on backdrop */
  form.addEventListener('submit',function(e){
    if(!fsG.disabled&&!form.querySelector('#mail-products input:checked')){
      e.preventDefault();e.stopImmediatePropagation();
      var err=form.querySelector('[data-fs-error="products"]');err.textContent='Please choose at least one spice package.';err.setAttribute('data-fs-active','');
    }
  },true);
  window.formspree=window.formspree||function(){(formspree.q=formspree.q||[]).push(arguments);};
  formspree('initForm',{
    formElement:'#mail-form',
    formId:'mjywwdrp',
    data:{page:function(){return location.href;}},
    onSuccess:function(){form.reset();pick=null;body.hidden=true;done.hidden=false;done.querySelector('button').focus();}
  });
})();
