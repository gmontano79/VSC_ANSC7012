/* v8.30: reference guide and Settings data management. No storage, PDF or signature changes. */
(function(){'use strict';
 const byId=id=>document.getElementById(id), guide=byId('vscReferenceGuide'),settings=byId('vscSettings'),dash=byId('dashboard');
 // The v8.35 view controller owns sidebar and mobile navigation.
 const selector=byId('vscReferenceSelect'),pages=Array.from(guide?.querySelectorAll('.rg-page')||[]);
 function showItem(index){if(!selector||!pages.length)return;const idx=Math.max(0,Math.min(index,pages.length-1));pages.forEach((p,i)=>p.hidden=i!==idx);selector.selectedIndex=idx;byId('rgCounter').textContent=`${idx+1} of ${pages.length}`;byId('rgPrev').disabled=idx===0;byId('rgNext').disabled=idx===pages.length-1;if(guide?.style.display==='block')guide.scrollIntoView({block:'start'});}
 selector?.addEventListener('change',()=>showItem(selector.selectedIndex));
 byId('rgPrev')?.addEventListener('click',()=>showItem(selector.selectedIndex-1));
 byId('rgNext')?.addEventListener('click',()=>showItem(selector.selectedIndex+1));
 showItem(0);
 byId('vscBackupSettings')?.addEventListener('click',()=>byId('dashExport')?.click());
 byId('vscRestoreSettings')?.addEventListener('click',()=>byId('v8RestoreFile')?.click());
})();
