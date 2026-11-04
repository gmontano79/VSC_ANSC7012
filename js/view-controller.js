/** VSC Digital v8.33 - exclusive view navigation. No data or PDF logic changed. */
(function(){'use strict';
 const q=id=>document.getElementById(id),dashboard=q('dashboard'),settings=q('vscSettings'),guide=q('vscReferenceGuide'),profiles=q('v8Profiles');
 const content=dashboard?.querySelector(':scope > section.panel:not(#vscSettings):not(#vscReferenceGuide):not(#v8Profiles)');
 if(!dashboard||!settings||!guide||!content)return;
 const controlled=[content,settings,guide,profiles];
 function closeMenu(){document.body.classList.remove('v8-open');document.querySelector('#v8-sidebar')?.classList.remove('open');}
 function active(nav){document.querySelectorAll('[data-nav]').forEach(b=>b.classList.toggle('active',b.dataset.nav===nav));}
 function showOnly(panel,nav){closeMenu();document.body.classList.remove('vsc-view-settings','vsc-view-reference');
   document.body.classList.add('vsc-view-'+nav);dashboard.style.display='block';document.querySelector('main').style.display='none';
   controlled.forEach(p=>{if(p)p.style.display=p===panel?'block':'none'});document.querySelector('.footerbar')?.style.setProperty('display','none');active(nav);window.scrollTo(0,0);
   if(nav==='settings')window.VSCSettingsRefresh?.();
 }
 function other(nav){closeMenu();document.body.classList.remove('vsc-view-settings','vsc-view-reference');
   settings.style.display='none';guide.style.display='none';content.style.display='';if(profiles)profiles.style.display='none';
   if(typeof navigateV8==='function')navigateV8(nav);active(nav);
 }
 // At document capture, before legacy sidebar and mobile handlers; prevents duplicate navigation.
 document.addEventListener('click',e=>{const button=e.target.closest('[data-nav]');if(!button)return;
   if(!button.closest('#v8-sidebar')&&!button.closest('.v8-mobile-nav')&&!button.closest('.nav-mobile')&&!button.closest('nav'))return;
   const nav=button.dataset.nav;if(!['settings','reference','dashboard','saved','new','profile','trainees','backup','restore'].includes(nav))return;
   e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
   if(nav==='settings')showOnly(settings,'settings');else if(nav==='reference')showOnly(guide,'reference');else other(nav);
 },true);
 q('vscSettingsBack')?.addEventListener('click',()=>other('dashboard'));
 q('vscReferenceBack')?.addEventListener('click',()=>other('dashboard'));
})();
