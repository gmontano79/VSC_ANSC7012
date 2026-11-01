
(function(){'use strict';const KEY='VSC_DIAGNOSTICS_V1',MAX=200,MAX_BYTES=100000;function read(){try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch{return[]}}
function log(level,code,detail){try{const row={time:new Date().toISOString(),level:String(level).slice(0,10),code:String(code).slice(0,64),detail:String(detail||'').slice(0,160)};let a=read();a.push(row);a=a.slice(-MAX);while(a.length>1&&JSON.stringify(a).length>MAX_BYTES)a.shift();localStorage.setItem(KEY,JSON.stringify(a))}catch(e){console.warn('VSC diagnostic log unavailable:',e?.name||'error')}}
window.VSCDiagnostics={log,read,clear(){try{localStorage.removeItem(KEY);return true}catch{return false}},key:KEY};
window.addEventListener('error',e=>log('ERROR','JAVASCRIPT_ERROR','Uncaught exception (details redacted)'));
window.addEventListener('unhandledrejection',e=>log('ERROR','UNHANDLED_REJECTION',e.reason?.name||'rejected'));
log('INFO','APP_STARTED','v8.26; '+(navigator.onLine?'online':'offline'));
})();
