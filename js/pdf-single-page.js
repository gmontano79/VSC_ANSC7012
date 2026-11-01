
// Both Print / Save PDF and Email Result use the same one-page PDF generator.
async function v856SavePDF(){
 try{
  await Promise.all(window.vscSignatureLoads||[]);
  if(!sigs.examinerSig.get()||!sigs.ownerSig.get()||(mode()==='trainee'&&!traineeSig.get())){
   alert('Required signatures are missing. Open the examination and sign before saving the PDF.');return;
  }
  if(!saveRecord(true))return;
  const blob=await v85RenderPdfPages();v85Download(blob,vscPdfFilename()+'.pdf');
  el('message').textContent='Completed ANSC 7012 PDF saved (one page).';
 }catch(e){alert('Could not generate PDF: '+e.message)}
}
el('print').onclick=v856SavePDF;
printableSaved=function(r){openSaved(r);v856SavePDF()};
// Email: wait for restored signatures before saving so they cannot be cleared by an async image load.
const v856OldEmail=v85EmailResult;
v85EmailResult=async function(){
 try{await Promise.all(window.vscSignatureLoads||[])}catch(e){alert('Signature could not be restored. Please sign the form again.');return}
 if(!sigs.examinerSig.get()||!sigs.ownerSig.get()||(mode()==='trainee'&&!traineeSig.get())){alert('Missing signatures. Please sign before emailing the completed form.');return}
 return v856OldEmail();
};
el('send').onclick=v85EmailResult;
emailSaved=function(r){openSaved(r);v85EmailResult()};
// Application version label
for(const n of document.querySelectorAll('#v82-version'))n.textContent='VSC DIGITAL · VERSION 8.31';
