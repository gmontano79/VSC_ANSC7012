
(function(){
 const dash=document.getElementById('dashboard'); if(!dash)return;
 document.querySelectorAll('#v82-version').forEach(n=>n.textContent='VSC DIGITAL · VERSION 8.30');
 const lower=document.getElementById('v82-lower');if(lower)lower.remove();
 const stats=dash.querySelector('.dash-stats');const head=dash.querySelector('.v82-panel-header');
 if(head&&stats&&head.nextElementSibling!==stats)head.after(stats);
 const statInfo=[['▤','Inspections Today'],['✓','Passed'],['✕','Failed'],['✉','Sent to Owners']];
 if(stats){[...stats.querySelectorAll('.dash-stat')].forEach((card,i)=>{
  const strong=card.querySelector('strong');if(!strong)return;
  [...card.childNodes].filter(n=>n.nodeType===3).forEach(n=>n.remove());
  card.querySelectorAll('span').forEach(n=>n.remove());
  let ico=card.querySelector('.v84-stat-icon');if(!ico){ico=document.createElement('span');ico.className='v84-stat-icon';card.prepend(ico)}ico.textContent=statInfo[i]?.[0]||'▤';
  let label=card.querySelector('.v84-label');if(!label){label=document.createElement('span');label.className='v84-label';card.append(label)}label.textContent=statInfo[i]?.[1]||'';
 });}
 const old=renderDashboard;
 function clean(){
  const list=document.getElementById('dashList');if(!list)return;
  const headings=list.querySelector('.v82-table-header');if(headings)headings.innerHTML='<span>Date</span><span>Registration</span><span>Owner / Operator</span><span>Result</span><span>Email status / Options</span>';
  const data=typeof records==='function'?records():[];
  list.querySelectorAll('.dash-entry').forEach(row=>{
   const reg=row.querySelector('.v82-reg strong')?.textContent||'';
   const date=row.querySelector('.v82-date')?.textContent||'';
   const matching=data.find(r=>{const x=r.data?.fields||{};const v=x.reg||x.owner||'Unnamed vessel';if(v!==reg)return false;const iso=x.date||'';return !date||!iso||date===iso.slice(5,7)+'/'+iso.slice(8,10)+'/'+iso.slice(2,4)})||data.find(r=>(r.data?.fields?.reg||r.data?.fields?.owner)===reg);
   const owner=row.querySelector('.v82-owner');if(owner&&matching)owner.textContent=matching.data?.fields?.owner||'';
   const status=row.querySelector('.v82-tag')?.parentElement; if(status){status.querySelectorAll('small').forEach(n=>n.remove());}
   const actions=row.querySelector('.v82-actions');if(!actions)return;
   const block=document.createElement('div');block.className='v84-email-actions';
   const email=document.createElement('span');const emailStatus=matching?.emailStatus||'Not sent';email.className='v84-email-status'+(/confirmed|sent/i.test(emailStatus)&&!/^not sent/i.test(emailStatus)?' sent':'');email.textContent=emailStatus;
   block.append(email,actions);
   // Explicit examiner confirmation only; the native share sheet does not report email delivery.
   if(matching){
    const confirmed=matching.emailStatus==='Sent — confirmed';
    const toggle=document.createElement('button');
    toggle.type='button';toggle.className='btn secondary vsc-email-confirm';
    toggle.style.cssText='font-size:12px;padding:7px 10px;white-space:normal;max-width:100%';
    toggle.textContent=confirmed?'Undo sent confirmation':'Confirm email sent';
    toggle.setAttribute('aria-label',confirmed?'Undo manual email confirmation':'Manually confirm owner email sent');
    toggle.onclick=()=>{
      const message=confirmed?'Remove the manual Sent confirmation for this inspection?':'Did you verify in your email app that the ANSC 7012 report was sent to the vessel owner?';
      if(!window.confirm(message))return;
      try{
        const a=records(),r=a.find(x=>x.id===matching.id);
        if(!r){alert('Inspection no longer available.');return;}
        r.emailStatus=confirmed?'Not sent':'Sent — confirmed';
        if(!confirmed)r.emailConfirmedAt=new Date().toISOString();else delete r.emailConfirmedAt;
        persist(a);
        const check=records().find(x=>x.id===matching.id);
        if(!check||check.emailStatus!==r.emailStatus)throw Error('Email status read-back failed');
        window.VSCDiagnostics?.log('INFO',confirmed?'EMAIL_CONFIRMATION_UNDONE':'EMAIL_MANUALLY_CONFIRMED','Local record status verified');
        renderDashboard();
      }catch(e){window.VSCDiagnostics?.log('ERROR','EMAIL_STATUS_SAVE_FAILED',e?.name||'storage failure');alert('Could not save email status. Please retry.');}
    };
    block.append(toggle);
   }
   row.append(block);
  });
 }
 renderDashboard=function(){old();clean()};clean();
})();
