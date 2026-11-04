/** VSC Digital - Settings actions and diagnostics (v8.33). */
(function(){'use strict';const q=id=>document.getElementById(id),dg=window.VSCDiagnostics;
 const fmtDate=new Intl.DateTimeFormat(undefined,{year:'numeric',month:'2-digit',day:'2-digit'});
 const fmtTime=new Intl.DateTimeFormat(undefined,{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true});
 const parts=r=>{const d=new Date(r.time);return Number.isNaN(d.valueOf())?[r.time,'—']:[fmtDate.format(d),fmtTime.format(d)]};
 function rows(){return dg?.read()||[];}
 function refresh(){const entries=rows(),target=q('vscDiagView');if(!target)return;target.replaceChildren();
  const table=document.createElement('table');table.className='vsc-log-grid';
  table.innerHTML='<thead><tr><th>Date</th><th>Time (Local)</th><th>Level</th><th>Event</th></tr></thead>';
  const body=document.createElement('tbody');entries.forEach(r=>{const tr=document.createElement('tr');const [date,time]=parts(r);
   [date,time,r.level,r.code+(r.detail?' — '+r.detail:'')].forEach((value,i)=>{const td=document.createElement('td');td.textContent=value||'';if(i===2)td.className='log-level log-'+String(r.level||'info').toLowerCase();tr.append(td)});body.append(tr)});
  if(!entries.length){const tr=document.createElement('tr'),td=document.createElement('td');td.colSpan=4;td.textContent='No diagnostic events yet.';tr.append(td);body.append(tr)}
  table.append(body);target.append(table);q('vscDiagStatus').textContent=entries.length+' events on this device · VSC Digital v'+window.VSC_APP.version;
 }
 function exportLog(){const lines=['VSC Digital diagnostic log v'+window.VSC_APP.version,'Generated local: '+new Date().toLocaleString(),'UTC preserved in stored timestamps','Date\tTime (Local)\tLevel\tEvent',...rows().map(r=>{const p=parts(r);return p.join('\t')+'\t'+r.level+'\t'+r.code+' '+(r.detail||'')})];
  const blob=new Blob([lines.join('\n')],{type:'text/plain'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='VSC_Diagnostics_'+new Date().toISOString().slice(0,10)+'.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);dg?.log('INFO','LOG_EXPORTED','txt');}
 q('vscDiagRefresh')?.addEventListener('click',refresh);
 q('vscDiagExport')?.addEventListener('click',exportLog);
 q('vscDiagClear')?.addEventListener('click',()=>{if(confirm('Clear diagnostic log on this device? This does not delete inspections.')){dg?.clear();dg?.log('INFO','LOG_CLEARED','user action');refresh()}});
 window.VSCSettingsRefresh=refresh;
})();
