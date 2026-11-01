
(function(){
const dash=document.getElementById('dashboard');const panel=dash?.querySelector('section.panel');if(!panel)return;
const hero=dash.querySelector('.v81-hero');
if(hero){
  const shield=panel.querySelector('.v8-banner img');
  if(shield){let i=shield.cloneNode();i.id='v82HeroShield';hero.append(i)}
  const k=hero.querySelector('.v81-hero-kicker');if(k)k.textContent='USCG AUXILIARY';
}
const brand=document.querySelector('#v8-sidebar .brand');const bottomNav=document.querySelector('#v8-sidebar .nav-bottom');if(bottomNav){let v=document.createElement('div');v.id='v82-version';v.textContent='VSC DIGITAL · VERSION 8.28';bottomNav.append(v)}
const bottom=document.querySelector('#v8-sidebar .nav-bottom');const oldShield=bottom?.querySelector('img');if(oldShield)oldShield.remove();
const banner=panel.querySelector('.v8-banner');const toolbar=panel.querySelector('.dash-toolbar');const stats=panel.querySelector('.dash-stats');const tools=panel.querySelector('.v8-tools');const h=panel.querySelector('h3');const list=panel.querySelector('#dashList');
const head=document.createElement('div');head.className='v82-panel-header';
const t=document.createElement('div');t.innerHTML=`<h2><span aria-hidden="true">▦</span> Today’s Inspections</h2><div class="date" id="v82TodayDate"></div>`;head.append(t,toolbar);
if(banner)banner.after(head);else panel.prepend(head);
if(h)h.classList.add('v82-hidden');
if(stats&&head)head.after(stats);
const lower=document.createElement('section');lower.id='v82-lower';lower.innerHTML='<div><h3>Quick Actions</h3><button type="button" data-action="new">✚ &nbsp; New Examination</button><button type="button" data-action="backup">⇩ &nbsp; Backup Inspections</button><button type="button" data-action="profile">♙ &nbsp; VE & Trainee Profiles</button></div><div><h3>About Vessel Safety Check</h3><div class="about-row" id="v82About"><p>A Vessel Safety Check is a voluntary examination that promotes recreational boating safety. Review each required item before awarding a decal.</p></div></div>';dash.append(lower);
const img=panel.querySelector('.v8-banner img');if(img){const i=img.cloneNode();document.getElementById('v82About').prepend(i)}
lower.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b)return;const a=b.dataset.action;if(a==='new')document.getElementById('dashNew').click();if(a==='backup')document.getElementById('dashExport').click();if(a==='profile')document.querySelector('[data-nav="profile"]')?.click()});
function refresh(){
const date=document.getElementById('v82TodayDate');if(date)date.textContent=new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
const container=document.getElementById('dashList');if(!container)return;
container.querySelector('.v82-table-header')?.remove();
const rows=[...container.querySelectorAll('.dash-entry')];
if(!rows.length)return;
const headings=document.createElement('div');headings.className='v82-table-header';headings.innerHTML='<span>Date</span><span>Registration</span><span>Owner / Operator</span><span>Status</span><span>Actions</span>';container.prepend(headings);
rows.forEach(row=>{
 if(row.dataset.v82==='1')return;row.dataset.v82='1';
 const originalText=row.innerText||'';
 const info=row.querySelector('div');const title=info?.querySelector('b')?.textContent||'';const line=info?.querySelector('small')?.textContent||'';
 const actions=[...row.querySelectorAll('button')];
 const owner=line.split('•')[0].trim();const failed=/Not passed|Failed/i.test(line);const status=/Incomplete/i.test(line)?'Incomplete':failed?'Failed':'Passed';
 const d=document.createElement('div');d.className='v82-date';
 const current=typeof records==='function'?records().find(r=>(r.data?.fields?.reg||r.data?.fields?.owner)===title):null;
 const iso=current?.data?.fields?.date||'';d.textContent=/^\d{4}-\d{2}-\d{2}$/.test(iso)?iso.slice(5,7)+'/'+iso.slice(8,10)+'/'+iso.slice(2,4):iso;
 const reg=document.createElement('div');reg.className='v82-reg';const strong=document.createElement('strong');strong.textContent=title;reg.append(strong);
 const person=document.createElement('div');person.className='v82-owner';person.textContent=owner;
 const state=document.createElement('div');const label=document.createElement('span');label.className='v82-tag'+(failed?' failed':'');label.textContent=status;state.append(label);const sent=document.createElement('small');sent.textContent=(line.match(/Not sent|Sent[^•]*/i)||[])[0]||'Not sent';state.append(sent);
 const action=document.createElement('div');action.className='v82-actions';actions.forEach(b=>action.append(b));row.replaceChildren(d,reg,person,state,action);
});
for(const [id,label] of [['dashTotal','Inspections Today'],['dashPassed','Passed'],['dashFailed','Failed'],['dashSent','Sent to Owners']]){const el=document.getElementById(id);if(el){let stat=el.closest('.dash-stat');if(stat&&!stat.querySelector('span')){const s=document.createElement('span');s.textContent=label;stat.append(s)}}}
}
const oldRender=renderDashboard;renderDashboard=function(){oldRender();refresh()};refresh();
})();
