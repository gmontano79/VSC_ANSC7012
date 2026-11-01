/* v8.30: reference guide and Settings data management. No storage, PDF or signature changes. */
(function(){'use strict';
 const byId=id=>document.getElementById(id), guide=byId('vscReferenceGuide'),settings=byId('vscSettings'),dash=byId('dashboard');
 const button=document.querySelector('#v8-sidebar [data-nav="reference"]');
 function hideGuide(){if(guide)guide.style.display='none';}
 function openGuide(){
  document.body.classList.remove('v8-open');
  document.querySelectorAll('#v8-sidebar button').forEach(b=>b.classList.toggle('active',b.dataset.nav==='reference'));
  const main=document.querySelector('main');if(main)main.style.display='none';
  dash.style.display='block';dash.querySelectorAll(':scope > section').forEach(s=>{if(s!==guide)s.style.display='none'});
  guide.style.display='block';document.querySelector('.footerbar')?.style.setProperty('display','none');window.scrollTo(0,0);
 }
 document.querySelector('#v8-sidebar')?.addEventListener('click',e=>{if(e.target.closest('[data-nav="reference"]')){e.preventDefault();e.stopImmediatePropagation();openGuide()}},true);
 document.querySelectorAll('#v8-sidebar [data-nav]:not([data-nav="reference"])').forEach(el=>el.addEventListener('click',hideGuide,true));
 byId('vscReferenceBack')?.addEventListener('click',()=>{hideGuide();document.querySelector('#v8-sidebar [data-nav="dashboard"]')?.click()});
 const selector=byId('vscReferenceSelect'),pages=Array.from(guide?.querySelectorAll('.rg-page')||[]);
 function showItem(index){if(!selector||!pages.length)return;const idx=Math.max(0,Math.min(index,pages.length-1));pages.forEach((p,i)=>p.hidden=i!==idx);selector.selectedIndex=idx;byId('rgCounter').textContent=`${idx+1} of ${pages.length}`;byId('rgPrev').disabled=idx===0;byId('rgNext').disabled=idx===pages.length-1;if(guide?.style.display==='block')guide.scrollIntoView({block:'start'});}
 selector?.addEventListener('change',()=>showItem(selector.selectedIndex));
 byId('rgPrev')?.addEventListener('click',()=>showItem(selector.selectedIndex-1));
 byId('rgNext')?.addEventListener('click',()=>showItem(selector.selectedIndex+1));
 showItem(0);
 byId('vscBackupSettings')?.addEventListener('click',()=>byId('dashExport')?.click());
 byId('vscRestoreSettings')?.addEventListener('click',()=>byId('v8RestoreFile')?.click());
})();
