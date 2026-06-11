'use strict';

const { BrowserWindow } = require('electron');

function wins() {
    return BrowserWindow.getAllWindows().filter(w => !w.isDestroyed());
}

function code(id, css, removing) {
    return `(()=>{
var I=${JSON.stringify(id)},C=${JSON.stringify(css)},R=${!!removing};
function w(r){
var s=r.getElementById(I);
if(!s&&!R){s=document.createElement('style');s.id=I;r.appendChild(s)}
if(s){if(R)s.remove();else if(s.textContent.indexOf(C)<0)s.textContent+=C+'\\n'}}
function a(){var d=document.querySelector('#dock');
if(!d||!d.shadowRoot)return;
d.shadowRoot.querySelectorAll('panel-frame').forEach(function(p){
var sr=p.shadowRoot;if(sr&&sr.querySelector('.animator'))w(sr)})}
a();
if(!R&&!window['__e_'+I]){window['__e_'+I]=true;
var d=document.querySelector('#dock');
if(d&&d.shadowRoot){window['__o_'+I]=new MutationObserver(a);
window['__o_'+I].observe(d.shadowRoot,{childList:true,subtree:true})}}
if(R){if(window['__o_'+I]){window['__o_'+I].disconnect();window['__o_'+I]=null}
window['__e_'+I]=false}
return true})()`;
}

function run(win, id, css, removing) {
    return win.webContents.executeJavaScript(code(id, css, removing)).catch(() => {});
}

function runAll(id, css, removing) {
    wins().forEach(w => run(w, id, css, removing));
}

module.exports = { runAll, hasWindows: () => wins().length > 0 };
