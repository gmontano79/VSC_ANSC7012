
(function(){
'use strict';
const q=id=>document.getElementById(id), storageKey='VSC_7038_SETTINGS_V1';
let chosen=new Map(), rows=[];
const reportKey='VSC_7038_DAILY_REPORTS_V1';let currentDailyReportId=null;
function savedReports(){try{return JSON.parse(localStorage.getItem(reportKey)||'[]')}catch{return []}}
function saveReports(list){localStorage.setItem(reportKey,JSON.stringify(list))}
function showReportHome(){q('arReportHome').style.display='block';q('arEditor').style.display='none';q('ar7038').style.display='block';hideOther();renderReportHome()}
function openReportEditor(){q('arReportHome').style.display='none';q('arEditor').style.display='block';hideOther()}
function reportDate(date){const m=String(date).match(/^(\\d{4})-(\\d{2})-(\\d{2})$/);return m?`${m[2]}/${m[3]}/${m[1].slice(2)}`:date}
function renderReportHome(){const reports=savedReports().sort((a,b)=>b.date.localeCompare(a.date));q('arHomeCount').textContent=reports.length;q('arHomeVsc').textContent=reports.reduce((s,r)=>s+r.ids.length,0);q('arHomePending').textContent=reports.filter(r=>r.emailStatus!=='Sent').length;const home=q('arHomeRows');home.replaceChildren();if(!reports.length){home.innerHTML='<div class="ar-empty">No daily reports saved yet. Complete your VSCs, then select <b>New Daily Report</b> to close out the day.</div>';return;}reports.forEach(r=>{const card=document.createElement('div');card.className='ar-report-card';const info=document.createElement('div');const name=document.createElement('h4');name.textContent=`ANSC 7038 · ${reportDate(r.date)}`;const sub=document.createElement('p');sub.textContent=`${r.examinerName||'Certified VE'} · ID ${r.member||'—'}`;info.append(name,sub);const stats=document.createElement('div');stats.className='ar-pills';for(const t of [`${r.ids.length} VSCs`,`${r.passed} Passed`,`${r.failed} Failed`]){const span=document.createElement('span');span.className='ar-smallpill';span.textContent=t;stats.append(span)}const st=document.createElement('span');st.className='ar-smallpill '+(r.emailStatus==='Sent'?'confirmed':'pending');st.textContent=r.emailStatus==='Sent'?'Email confirmed':'Not sent';stats.append(st);const acts=document.createElement('div');acts.className='ar-row-buttons';for(const [label,cb] of [['Open',()=>loadDailyReport(r)],['PDF',()=>{loadDailyReport(r);generateActivityPdf(false)}],['Email',()=>{loadDailyReport(r);alert('The official ANSC 7038 can be saved as PDF using the PDF action, then attached to a message for your FSO-IS. Automatic PDF attachment for 7038 is not yet available.')}]]){const b=document.createElement('button');b.className='btn'+(label==='Open'?'':' secondary');b.textContent=label;b.type='button';b.onclick=cb;acts.append(b)}card.append(info,stats,acts);home.append(card)})}
function loadDailyReport(r){startEditor(false);currentDailyReportId=r.id;q('arDate').value=r.date;q('arDivision').value=r.division;q('arFlotilla').value=r.flotilla;q('arName').value=r.examinerName;q('arMember').value=r.member;q('arMinutes').value=String(r.defaultMinutes||20);chosen=new Map();(r.inspections||[]).forEach(x=>chosen.set(x.id,{include:true,minutes:x.minutes}));fillRows();const selected=new Set(r.ids);chosen.forEach((v,k)=>v.include=selected.has(k));fillRows();q('arRemarks').dataset.auto='manual';q('arRemarks').value=r.remarks;calc();q('arMessage').textContent='Saved activity report opened. Review before generating or updating its PDF.'}

const htmlEscape=v=>String(v??'').replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]));
const dateToday=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
function readSaved(){try{return JSON.parse(localStorage.getItem('VSC_7012_RECORDS_V3')||'[]')}catch{return []}}
function readPrefs(){try{return JSON.parse(localStorage.getItem(storageKey)||'{}')}catch{return {}}}
function examiner(){try{return JSON.parse(localStorage.getItem('VSC_7012_EXAMINER_PROFILE_V8')||'{}')}catch{return {}}}
function hideOther(){q('dashboard').style.display='none';document.querySelector('main').style.display='none';if(q('v8Profiles'))q('v8Profiles').style.display='none';const f=document.querySelector('.footerbar');if(f)f.style.display='none';q('ar7038').style.display='block';document.body.classList.remove('v8-open');window.scrollTo(0,0)}
function leave(){q('ar7038').style.display='none';if(typeof navigateV8==='function')navigateV8('dashboard');else{q('dashboard').style.display='block';document.querySelector('main').style.display='none'}}
function two(v){return /^\d{1,2}$/.test(String(v))?String(v).padStart(2,'0'):''}
function getStats(a){return {given:a.length,passed:a.filter(r=>r.passed).length,failed:a.filter(r=>r.failed).length,first:a.filter(r=>r.first).length,mins:a.reduce((s,r)=>s+r.minutes,0)}}
function hours(m){return (m/60).toFixed(2)}
function active(){return rows.filter(r=>chosen.get(r.id)?.include).map(r=>({...r,minutes:chosen.get(r.id).minutes}))}
function fillRows(){const date=q('arDate').value;const dflt=Number(q('arMinutes').value)||20;
 rows=readSaved().filter(r=>r.data?.fields?.date===date).map(r=>{const d=r.data||{},f=d.fields||{},status=d.reqState||[],trainee=d.mode==='trainee'&&d.trainee?.name?.trim()?d.trainee:null;
 return {id:r.id,reg:f.reg||'—',owner:f.owner||'—',examiner:f.examiner||'',examinerNo:f.examinerNo||'',passed:status.length===15&&status.every(x=>x==='Yes'||x==='N/A')&&d.decalAwarded==='Yes',failed:status.some(x=>x==='No'),first:/first/i.test(f.decalOld||''),trainee:trainee?.name?.trim()||'',traineeNo:trainee?.no||''};});
 const body=q('arRows');body.innerHTML='';rows.forEach(r=>{const old=chosen.get(r.id);chosen.set(r.id,{include:old?old.include:true,minutes:old?old.minutes:dflt});const tr=document.createElement('tr');tr.innerHTML=`<td><input type="checkbox" data-id="${htmlEscape(r.id)}" class="ar-select" ${chosen.get(r.id).include?'checked':''}></td><td>${htmlEscape(r.reg)}</td><td>${htmlEscape(r.owner)}</td><td>${r.passed?'Passed':r.failed?'Failed':'Incomplete'}</td><td>${r.first?'Yes':'No'}</td><td>${htmlEscape(r.trainee||'—')}</td><td><input class="ar-duration" type="number" data-id="${htmlEscape(r.id)}" min="1" max="240" value="${chosen.get(r.id).minutes}" aria-label="Inspection duration in minutes"></td>`;body.append(tr)});
 if(!rows.length)body.innerHTML='<tr><td colspan="7">No saved VSCs for this date. Select a date with inspections.</td></tr>';
 body.querySelectorAll('.ar-select').forEach(c=>c.onchange=()=>{chosen.get(c.dataset.id).include=c.checked;calc()});body.querySelectorAll('.ar-duration').forEach(c=>c.onchange=()=>{chosen.get(c.dataset.id).minutes=Math.max(1,Math.min(240,Number(c.value)||20));c.value=chosen.get(c.dataset.id).minutes;calc()});calc()}
function buildRemark(list){const groups=new Map();list.filter(r=>r.trainee).forEach(r=>{const k=(r.traineeNo||r.trainee).trim();if(!groups.has(k))groups.set(k,{name:r.trainee,id:r.traineeNo,rows:[]});groups.get(k).rows.push(r)});
 return [...groups.values()].map(g=>{const s=getStats(g.rows);return `${g.name} (${g.id||'ID N/A'}): ${s.given} Given, ${s.passed} Passed, ${s.failed} Failed, ${s.first} First Time, ${hours(s.mins)} Hours`}).join('\n')}
function calc(){const a=active(),s=getStats(a);q('arKpis').innerHTML=[['Given',s.given],['Passed',s.passed],['Failed',s.failed],['1st Time',s.first],['Hours',hours(s.mins)]].map(([k,v])=>`<div><strong>${v}</strong>${k}</div>`).join('');
 const groups=new Map();for(const r of a.filter(z=>z.trainee)){const k=r.traineeNo||r.trainee;if(!groups.has(k))groups.set(k,{name:r.trainee,id:r.traineeNo,rows:[]});groups.get(k).rows.push(r)}
 const body=q('arBreakdown');body.innerHTML='';function add(name,st){const tr=document.createElement('tr');tr.innerHTML=`<td>${htmlEscape(name)}</td><td>${st.given}</td><td>${st.passed}</td><td>${st.failed}</td><td>${st.first}</td><td>${hours(st.mins)}</td>`;body.append(tr)}
 add(q('arName').value+' (Certified VE)',s);for(const g of groups.values())add(g.name+' (Trainee)',getStats(g.rows));
 if(q('arRemarks').dataset.auto!=='manual')q('arRemarks').value=buildRemark(a);
 const completeRemark=buildRemark(a);const exceeded=completeRemark.length>240;q('arRemarks').dataset.tooLong=exceeded?'1':'0';q('arCharCount').textContent=`${completeRemark.length} / 240 characters`+(exceeded?' — Breakdown exceeds the official Remarks limit. Adjust grouping or create a separate report.':'');q('arCharCount').className='ar-hint '+(exceeded?'ar-warning':'ar-okay');
}
function startEditor(reset=true){const p=examiner(),prefs=readPrefs();q('arName').value=p.name||'';q('arMember').value=p.member||'';q('arDivision').value=p.division||prefs.division||'';q('arFlotilla').value=p.flotilla||prefs.flotilla||'';q('arMinutes').value=String(prefs.minutes||20);q('arDate').value=dateToday();q('arRemarks').dataset.auto='auto';q('arMessage').textContent='';if(reset){chosen=new Map();currentDailyReportId=null;}openReportEditor();fillRows()}
function field(text,x,y,w,h=18,size=9,align="left"){if(text===undefined||text===null||text==='')return;const e=document.createElement('div');e.className='ar-pdf-field';Object.assign(e.style,{left:x+'pt',top:y+'pt',width:w+'pt',height:h+'pt',fontSize:size+'pt',textAlign:align});e.textContent=String(text);q('arOverlay').append(e)}
function renderPDF(){const a=active(),s=getStats(a);q('arOverlay').innerHTML='';const p=examiner();const names=[{name:q('arName').value,id:q('arMember').value},...new Map(a.filter(r=>r.trainee).map(r=>[r.traineeNo||r.trainee,{name:r.trainee,id:r.traineeNo}])).values()];
 field(q('arDivision').value,476,46,27,18,11);field(q('arFlotilla').value,534,46,32,18,11);
 names.slice(0,4).forEach((z,i)=>{
  // IDs are painted directly onto the PDF canvas after clearing the template's
  // irregular digit guides. Do not stamp text over the original black guides.
  field(z.name,148,153+i*24,218,17,9);
  if(i>0)field('X',395,176+(i-1)*24,12,16,11)
});
 field(s.given,238,298,29);field(s.passed,276,298,30);field(s.failed,316,298,30);field(s.first,355,298,32);field(hours(s.mins),396,298,37);
 const rem=q('arRemarks').value;const remarkEl=document.createElement('div');remarkEl.className='ar-pdf-field';Object.assign(remarkEl.style,{left:'39pt',top:'567pt',width:'525pt',height:'76pt',fontSize:'9pt',whiteSpace:'pre-line',lineHeight:'1.35'});remarkEl.textContent=rem;q('arOverlay').append(remarkEl);
 const d=new Date(q('arDate').value+'T12:00:00');field(`${String(d.getDate()).padStart(2,'0')}${d.toLocaleString('en-US',{month:'short'}).toUpperCase()}${String(d.getFullYear()).slice(-2)}`,193,683,119,18,10);
 downloadOfficial7038().catch(err=>{q('arMessage').textContent='Report saved, but the PDF could not be created: '+(err?.message||err);});
}
async function downloadOfficial7038(){
 const image=q('arOfficialImage');
 if(!image.complete||!image.naturalWidth){await new Promise((resolve,reject)=>{image.addEventListener('load',resolve,{once:true});image.addEventListener('error',()=>reject(new Error('Official template image unavailable')),{once:true})})}
 const scale=2;const canvas=document.createElement('canvas');canvas.width=1224;canvas.height=1584;
 const ctx=canvas.getContext('2d',{alpha:false});ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);
 ctx.drawImage(image,0,0,canvas.width,canvas.height);
 // The embedded official template contains the repaired Member ID grid.
 const reportNames=[{name:q('arName').value,id:q('arMember').value},...new Map(active().filter(r=>r.trainee).map(r=>[r.traineeNo||r.trainee,{name:r.trainee,id:r.traineeNo}])).values()];
 ctx.fillStyle='#111';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='19px Arial, sans-serif';
 const rowCenters=[332,375,422,468];
 reportNames.slice(0,4).forEach((person,i)=>{
   const digits=String(person.id||'').replace(/\D/g,'');
   for(let j=0;j<Math.min(7,digits.length);j++)ctx.fillText(digits[j],82+(j+.5)*202/7,rowCenters[i]);
 });
 ctx.textAlign='left';ctx.textBaseline='top';

 // Stamp the same positioned fields used by the official print preview.
 const fields=[...q('arOverlay').querySelectorAll('.ar-pdf-field')];
 ctx.fillStyle='#111';ctx.textBaseline='top';
 for(const el of fields){
   const x=parseFloat(el.style.left||0)*scale,y=parseFloat(el.style.top||0)*scale;
   const maxWidth=(parseFloat(el.style.width||525))*scale;
   const fontPt=parseFloat(el.style.fontSize||9);const fontPx=fontPt*scale;
   ctx.font=`${fontPx}px Arial, sans-serif`;
   let row=0;const lineStep=fontPx*1.35;
   for(const explicitLine of el.textContent.split('\n')){
     let line='';
     for(const word of explicitLine.split(/\s+/).filter(Boolean)){
       const candidate=line?line+' '+word:word;
       if(line&&ctx.measureText(candidate).width>maxWidth){ctx.fillText(line,x,y+row*lineStep,maxWidth);row++;line=word}else line=candidate;
     }
     if(line){if(el.style.textAlign==='center'){ctx.textAlign='center';ctx.fillText(line,x+maxWidth/2,y+row*lineStep,maxWidth);ctx.textAlign='left'}else ctx.fillText(line,x,y+row*lineStep,maxWidth);}
     row++;
   }
 }
 const jpeg=canvas.toDataURL('image/jpeg',0.94).split(',')[1];
 const raw=atob(jpeg);const jpg=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)jpg[i]=raw.charCodeAt(i);
 // One letter-size PDF page with the official form and the completed fields.
 const enc=new TextEncoder(),parts=[],offsets=[0];let byteCount=0;
 function push(data){parts.push(data);byteCount+=data.length}
 function str(v){push(enc.encode(v))}
 str('%PDF-1.4\n');
 function obj(i,body){offsets[i]=byteCount;str(`${i} 0 obj\n${body}\nendobj\n`)}
 obj(1,'<< /Type /Catalog /Pages 2 0 R >>');
 obj(2,'<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
 obj(3,'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>');
 offsets[4]=byteCount;str(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`);push(jpg);str('\nendstream\nendobj\n');
 const content='q 612 0 0 792 0 0 cm /Im0 Do Q\n';obj(5,`<< /Length ${enc.encode(content).length} >>\nstream\n${content}endstream`);
 const start=byteCount;str('xref\n0 6\n0000000000 65535 f \n');for(let i=1;i<=5;i++)str(String(offsets[i]).padStart(10,'0')+' 00000 n \n');str(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`);
 const pdf=new Blob(parts,{type:'application/pdf'});const url=URL.createObjectURL(pdf);
 const a=document.createElement('a');a.href=url;a.download=`ANSC7038_${q('arDate').value.replaceAll('-','')}_${String(q('arMember').value).replace(/[^0-9A-Za-z]/g,'')}.pdf`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
 q('arMessage').textContent='Daily activity report saved. Official one-page ANSC 7038 PDF downloaded. Open Activity Reports to access it again.';
}
function generateActivityPdf(save=true){const a=active();if(!a.length){q('arMessage').textContent='Select at least one inspection.';return}if(a.some(r=>!r.passed&&!r.failed)){q('arMessage').textContent='Complete or exclude incomplete inspections before reporting.';return}
 if(q('arRemarks').value.length>240||q('arRemarks').dataset.tooLong==='1'){q('arMessage').textContent='Report not saved: Trainee Remarks exceed 240 characters. Review and shorten the text without losing the breakdown.';return}
 if(!two(q('arDivision').value)||!two(q('arFlotilla').value)||!q('arMember').value){q('arMessage').textContent='Report not saved: enter Division, Flotilla and Certified VE Member ID. These numbers are not automatically assumed.';q('arMessage').scrollIntoView({behavior:'smooth',block:'center'});return}
 if(a.some(r=>r.examinerNo&&String(r.examinerNo).trim()!==String(q('arMember').value).trim())){const mismatched=a.filter(r=>r.examinerNo&&String(r.examinerNo).trim()!==String(q('arMember').value).trim());q('arMessage').textContent='Cannot save: '+mismatched.map(r=>r.reg+' (VE ID '+r.examinerNo+')').join(', ')+' do not match your profile ID '+q('arMember').value+'. Open those VSCs and verify their Certified VE before reporting.';q('arMessage').scrollIntoView({behavior:'smooth',block:'center'});return}
 if(save&&!confirm('Have you completed all Vessel Safety Checks for '+reportDate(q('arDate').value)+'? This will save the daily closeout report.'))return;
 q('arDivision').value=two(q('arDivision').value);q('arFlotilla').value=two(q('arFlotilla').value);
 try{localStorage.setItem(storageKey,JSON.stringify({division:q('arDivision').value,flotilla:q('arFlotilla').value,minutes:Number(q('arMinutes').value)}));if(save){const list=savedReports(),prior=list.find(r=>r.id===currentDailyReportId||r.date===q('arDate').value&&r.member===q('arMember').value);const s=getStats(a);const item={id:prior?.id||'ar-'+Date.now(),date:q('arDate').value,examinerName:q('arName').value,member:q('arMember').value,division:q('arDivision').value,flotilla:q('arFlotilla').value,defaultMinutes:Number(q('arMinutes').value),ids:a.map(r=>r.id),inspections:a.map(r=>({id:r.id,minutes:r.minutes})),passed:s.passed,failed:s.failed,remarks:q('arRemarks').value,emailStatus:prior?.emailStatus||'Not sent',updated:new Date().toISOString()};if(prior){if(!currentDailyReportId&&!confirm('A daily report already exists for this Certified VE and date. Update the existing report instead of creating a duplicate?'))return;Object.assign(prior,item)}else list.push(item);saveReports(list);currentDailyReportId=item.id;q('arMessage').textContent='Daily report saved locally. Use Activity Reports to reopen it. Official PDF download is starting.';renderReportHome();}}
 catch(e){q('arMessage').textContent='Unable to save report on this device. Check available storage and make a backup.';return}renderPDF()}
q('arPdf').onclick=()=>generateActivityPdf(true);
window.addEventListener('afterprint',()=>{document.body.classList.remove('print7038');document.title='VSC Digital';if(currentDailyReportId)showReportHome()});
q('arRefresh').onclick=fillRows;q('arBack').onclick=showReportHome;q('arNewDaily').onclick=()=>startEditor(true);
// Keep the 7038 section separate from all original ANSC 7012 screens.
document.querySelectorAll('#v8-sidebar button[data-nav]').forEach(b=>b.addEventListener('click',()=>{q('ar7038').style.display='none'}));
q('dashboardGo')?.addEventListener('click',()=>{q('ar7038').style.display='none'});q('arDate').onchange=()=>{chosen=new Map();fillRows()};q('arMinutes').onchange=()=>{const n=Number(q('arMinutes').value);chosen.forEach(x=>x.minutes=n);fillRows()};q('arRemarks').oninput=()=>{q('arRemarks').dataset.auto='manual';q('arCharCount').textContent=q('arRemarks').value.length+' / 240 characters';};
const nav=document.querySelector('#v8-sidebar button[data-nav="saved"]');if(nav){const b=document.createElement('button');b.type='button';b.innerHTML='<span class="navico">▤</span>Activity Reports (7038)';b.onclick=showReportHome;nav.after(b)}
const d=document.getElementById('dashboard');const first=d?.querySelector('.dash-toolbar');if(first){const b=document.createElement('button');b.className='btn secondary';b.textContent='ANSC 7038 Activity Report';b.type='button';b.onclick=showReportHome;first.append(b)}
})();