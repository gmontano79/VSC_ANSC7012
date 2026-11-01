
// The Web Share API shares an attachment, but has no recipient parameter; Apple Mail may also discard title.
let v853MailPackage=null;
const v853Dlg=document.getElementById('emailPrepDialog');
function v853Copy(text){
 if(navigator.clipboard&&navigator.clipboard.writeText)return navigator.clipboard.writeText(text);
 const t=document.createElement('textarea');t.value=text;t.style.position='fixed';t.style.opacity='0';document.body.append(t);t.select();const ok=document.execCommand('copy');t.remove();return ok?Promise.resolve():Promise.reject(Error('Copy unavailable'));
}
function v853CopyButton(button,text){v853Copy(text).then(()=>{const old=button.textContent;button.textContent='Copied!';setTimeout(()=>button.textContent=old,1600)}).catch(()=>alert('Select and copy this value manually: '+text))}
document.getElementById('emailPrepCopyTo').onclick=()=>v853CopyButton(document.getElementById('emailPrepCopyTo'),v853MailPackage.email);
document.getElementById('emailPrepCopySubject').onclick=()=>v853CopyButton(document.getElementById('emailPrepCopySubject'),v853MailPackage.subject);
document.getElementById('emailPrepCancel').onclick=()=>v853Dlg.close();
document.getElementById('emailPrepShare').onclick=async()=>{
 const p=v853MailPackage;if(!p)return;
 if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[p.file]}))){
  try{await navigator.share({files:[p.file],title:p.subject,text:p.body});v853Dlg.close();el('message').textContent='PDF shared to mail app. Check recipient, subject, and Send. Inspection stays saved.';return}
  catch(e){if(e.name==='AbortError')return}
 }
 v85Download(p.blob,p.name);
 v853Dlg.close();
 const open=confirm('PDF downloaded. Open a draft addressed to the owner? Attach the downloaded PDF manually.');
 if(open)location.href='mailto:'+encodeURIComponent(p.email)+'?subject='+encodeURIComponent(p.subject)+'&body='+encodeURIComponent(p.body);
};
async function v853PrepareEmail(){
 try{await Promise.all(window.vscSignatureLoads||[])}catch(e){alert('Signature could not be restored. Please sign the form again.');return}
 if(!sigs.examinerSig.get()||!sigs.ownerSig.get()||(mode()==='trainee'&&!traineeSig.get())){alert('Missing signatures. Please sign before emailing the completed form.');return}
 const email=el('email').value.trim();
 if(!email||!el('email').checkValidity()){alert('Enter a valid owner email address before sharing.');return}
 if(!saveRecord(true))return;
 let blob;try{blob=await v85RenderPdfPages()}catch(e){alert('Unable to prepare signed PDF: '+e.message);return}
 const name=vscPdfFilename()+'.pdf';
 const subject='Your Vessel Safety Check Report - '+(el('reg').value.trim()||el('date').value);
 const body='Dear Boat Owner,\n\nThank you for participating in a Vessel Safety Check conducted by the U.S. Coast Guard Auxiliary. Attached is your completed ANSC 7012 report.\n\nBest regards,\nU.S. Coast Guard Auxiliary\nVessel Examination Program';
 v853MailPackage={blob,name,email,subject,body,file:new File([blob],name,{type:'application/pdf'})};
 document.getElementById('emailPrepTo').textContent=email;
 document.getElementById('emailPrepSubject').textContent=subject;
 document.getElementById('emailPrepFile').textContent='Attachment: '+name+' (one-page official PDF)';
 v853Dlg.showModal();
}
el('send').onclick=v853PrepareEmail;
emailSaved=function(r){openSaved(r);v853PrepareEmail()};
for(const n of document.querySelectorAll('#v82-version'))n.textContent='VSC DIGITAL · VERSION 8.31';
