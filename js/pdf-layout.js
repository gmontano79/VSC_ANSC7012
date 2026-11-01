
// PDF prepared from the two official rendered ANSC 7012 page backgrounds and overlaid inputs.
// Email attachment includes only the completed first page. window.print() remains available separately.
async function v85LoadImage(src){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(Error('Could not load official form page'));im.src=src})}
async function v85RenderPdfPages(){
 await Promise.all(window.vscSignatureLoads||[]);
 if(!sigs.examinerSig.get()||!sigs.ownerSig.get()||(mode()==='trainee'&&!traineeSig.get()))throw Error('Missing signature. Open the VSC and sign all required signature fields before generating the PDF.');
 createOfficialReport();
 const pages=[...document.querySelectorAll('#report .official-page')].slice(0,1); // Owner email receives completed ANSC 7012 page 1 only.
 const pdfPages=[];const scale=2;
 for(const page of pages){
  const canvas=document.createElement('canvas');canvas.width=1224;canvas.height=1584;
  const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.scale(scale,scale);
  const base=page.querySelector('.official-template');if(!base)throw Error('Missing official template');
  ctx.drawImage(await v85LoadImage(base.src),0,0,612,792);
  for(const e of page.children){if(e===base)continue;
   const x=parseFloat(e.style.left)||0,y=parseFloat(e.style.top)||0;
   if(e.tagName==='IMG'){const im=await v85LoadImage(e.src);const w=parseFloat(e.style.width)||90,h=parseFloat(e.style.height)||20;const fit=Math.min(w/im.width,h/im.height);const dw=im.width*fit,dh=im.height*fit;ctx.drawImage(im,x+(w-dw)/2,y+(h-dh)/2,dw,dh);continue}
   if(e.classList.contains('official-remarks')){
    ctx.font='8px Arial';ctx.fillStyle='#111';const t=e.textContent||'';let yy=482;for(const line of t.split('\n')){let cur='';for(const word of line.split(' ')){if(ctx.measureText(cur+' '+word).width>276){ctx.fillText(cur,36,yy);yy+=10;cur=word}else cur+=(cur?' ':'')+word}ctx.fillText(cur,36,yy);yy+=10;}continue;
   }
   const size=parseFloat(e.style.fontSize)||(e.classList.contains('official-check')?12:8);
   ctx.font=(e.classList.contains('official-check')?'bold ':'')+size+'px Arial';ctx.fillStyle='#111';ctx.textBaseline='top';
   const t=e.textContent||'';const w=parseFloat(e.style.width)||130;
   if(e.style.textAlign==='center'){ctx.textAlign='center';ctx.fillText(t,x+w/2,y,w)}else{ctx.textAlign='left';ctx.fillText(t,x,y,w)}
  }
  const url=canvas.toDataURL('image/jpeg',.87);const binary=atob(url.split(',')[1]);const bytes=new Uint8Array(binary.length);for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);pdfPages.push({bytes,w:canvas.width,h:canvas.height});
 }
 return v85BuildPdf(pdfPages);
}
function v85BuildPdf(pages){
 const encoder=new TextEncoder();const pieces=[];let position=0;const offsets=[0];
 const put=(s)=>{const b=typeof s==='string'?encoder.encode(s):s;pieces.push(b);position+=b.length};
 const obj=(id,content)=>{offsets[id]=position;put(id+' 0 obj\n'+content+'\nendobj\n')};
 put('%PDF-1.4\n');const N=2+pages.length*3;
 obj(1,'<< /Type /Catalog /Pages 2 0 R >>');
 obj(2,'<< /Type /Pages /Kids ['+pages.map((_,i)=>(3+i*3)+' 0 R').join(' ')+'] /Count '+pages.length+' >>');
 pages.forEach((p,i)=>{
  const pg=3+i*3,im=pg+1,content=pg+2;
  obj(pg,'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /XObject << /Im0 '+im+' 0 R >> >> /Contents '+content+' 0 R >>');
  offsets[im]=position;put(im+' 0 obj\n<< /Type /XObject /Subtype /Image /Width '+p.w+' /Height '+p.h+' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length '+p.bytes.length+' >>\nstream\n');put(p.bytes);put('\nendstream\nendobj\n');
  const instructions='q 612 0 0 792 0 0 cm /Im0 Do Q\n';obj(content,'<< /Length '+instructions.length+' >>\nstream\n'+instructions+'endstream');
 });
 const xref=position;put('xref\n0 '+(N+1)+'\n0000000000 65535 f \n');for(let id=1;id<=N;id++)put(String(offsets[id]).padStart(10,'0')+' 00000 n \n');put('trailer\n<< /Size '+(N+1)+' /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF');return new Blob(pieces,{type:'application/pdf'});
}
function v85Download(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000)}
async function v85EmailResult(){
 if(!saveRecord(true))return;
 const email=el('email').value.trim();if(!email||!el('email').checkValidity()){alert('Enter a valid owner email address before sharing.');return}
 const name=vscPdfFilename()+'.pdf';
 let pdf;try{pdf=await v85RenderPdfPages()}catch(e){alert('Unable to prepare signed PDF: '+e.message);return}
 const file=new File([pdf],name,{type:'application/pdf'});
 const subject='Your Vessel Safety Check Report — '+(el('reg').value.trim()||el('date').value);
 const msg='Dear Boat Owner,\n\nThank you for participating in a Vessel Safety Check conducted by the U.S. Coast Guard Auxiliary. Attached is your completed ANSC 7012 report.\n\nBest regards,\nU.S. Coast Guard Auxiliary\nVessel Examination Program';
 const shareData={files:[file],title:subject,text:msg};
 if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){
  try{await navigator.share(shareData);el('message').textContent='Share sheet closed. Check your mail app to confirm the email was sent; the inspection is saved.';return}
  catch(e){if(e.name==='AbortError'){el('message').textContent='Sharing cancelled. Inspection remains saved.';return}}
 }
 v85Download(pdf,name);
 const mail='mailto:'+encodeURIComponent(email)+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(msg);
 const openMail=confirm('Your browser cannot directly attach PDFs to Mail/Gmail. The PDF has been downloaded as '+name+'. Open an email draft now? You will need to attach the downloaded PDF.');
 if(openMail)window.location.href=mail;
 el('message').textContent='Inspection saved. PDF downloaded; attach it in your mail app before sending.';
}
// Replace legacy mailto-only handler with the PDF-first workflow.
el('send').onclick=v85EmailResult;
emailSaved=function(r){openSaved(r);v85EmailResult()};
// Override dashboard row action closures to point at the updated email handler already in scope.
// Existing renderDashboard invokes emailSaved(r) dynamically.
const v85InitialSave=el('completeSave');
// Keep all existing local storage keys and official print option unchanged.

