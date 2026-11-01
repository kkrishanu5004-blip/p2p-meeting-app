/* my BUDDY study pack: shared whiteboard, scientific calculator, shared notes, focus sounds. Load AFTER plus.js */
(()=>{
const Q=s=>document.querySelector(s),E=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e};
document.head.appendChild(E('style',0,`#st{position:fixed;inset:0;z-index:1002;background:#050506f5;color:#f4f4f5;font:14px system-ui,sans-serif;display:none;flex-direction:column}#st.on{display:flex}#st *{box-sizing:border-box}
.st-h{display:flex;gap:6px;padding:8px;border-bottom:1px solid #222;align-items:center;flex-wrap:wrap}#st button{border:1px solid #2a2a30;background:#141418;color:#fff;border-radius:10px;padding:8px 12px;cursor:pointer;font-size:14px}#st button.on{border-color:#ffc61a;color:#ffc61a}#st .x{margin-left:auto;border-color:#ff1f2d;color:#ff1f2d}
.st-b{flex:1;overflow:auto;padding:10px;min-height:0}.st-p{display:none}.st-p.on{display:block}#st-cv{width:100%;max-width:1000px;aspect-ratio:5/3;background:#0b0b0d;border:1px solid #2a2a30;border-radius:12px;touch-action:none;display:block;margin:6px auto;cursor:crosshair}
.st-bar{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin:4px auto;max-width:1000px}#st .st-c{width:28px;height:28px;border-radius:50%;border:2px solid #555;padding:0}#st .st-c.on{border-color:#fff;transform:scale(1.2)}
#st-ex{width:100%;background:#0a0a0c;color:#fff;border:1px solid #2a2a30;border-radius:10px;padding:12px;font:18px monospace}#st-res{font:26px monospace;color:#ffc61a;padding:8px 2px;min-height:44px;word-break:break-all}.st-k{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}.st-hd{color:#9a9aa5;font-size:12px;margin-top:10px}
#st-pad{width:100%;height:60vh;background:#0a0a0c;color:#fff;border:1px solid #2a2a30;border-radius:10px;padding:12px;font:15px monospace}.st-row{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:8px 0}#st select{background:#141418;color:#fff;border:1px solid #2a2a30;border-radius:10px;padding:8px}`));
const SYM='θ α β γ ω μ λ Δ Σ ∫ √ ∞ ≈ ≠ ≤ ≥ ° → × ÷ ± π ε ρ τ φ ħ ² ³ ⁻¹ ∝ ∂ ∇'.split(' '),TOOLS={pen:'✏️',line:'╱',arrow:'➜',rect:'▭',circle:'◯',text:'T',eraser:'🧽'},COLS=['#ffffff','#ff4d5a','#ffc61a','#4dd2ff','#4dff88'];
const CONST=[['g','9.8'],['c','3e8'],['h','6.626e-34'],['e','1.602e-19'],['k_B','1.381e-23'],['N_A','6.022e23'],['R','8.314'],['G','6.674e-11'],['m_e','9.109e-31'],['m_p','1.673e-27'],['ε0','8.854e-12'],['μ0','1.2566e-6']];
const ov=E('div');ov.id='st';
ov.innerHTML='<div class="st-h"><button data-t="w" class="on">🎨 Board</button><button data-t="c">🧮 Calc</button><button data-t="n">📝 Notes</button><button data-t="f">🎧 Focus</button><button class="x" id="st-x">✕ Close</button></div><div class="st-b">'+
'<div class="st-p on" id="st-w"><div class="st-bar">'+Object.keys(TOOLS).map(t=>'<button data-tool="'+t+'"'+(t==='pen'?' class="on"':'')+'>'+TOOLS[t]+'</button>').join('')+'</div><div class="st-bar">'+COLS.map((c,i)=>'<button class="st-c'+(i?'':' on')+'" data-c="'+c+'" style="background:'+c+'"></button>').join('')+'<button id="st-sz">● 3</button><button id="st-clr">🗑 Clear</button></div><canvas id="st-cv" width="1000" height="600"></canvas><div class="st-hd" style="text-align:center">Symbols: tap one, then tap on the board to place it. The T tool types any text or formula.</div><div class="st-bar" id="st-sym">'+SYM.map(s=>'<button data-s="'+s+'">'+s+'</button>').join('')+'</div></div>'+
'<div class="st-p" id="st-c"><input id="st-ex" placeholder="e.g. 5*sin(30)+sqrt(2)^3" autocomplete="off"><div id="st-res"></div><div class="st-row"><button id="st-deg" class="on">DEG</button><button id="st-eq">=</button><button id="st-ac">C</button></div><div class="st-k" id="st-k"></div><div class="st-hd">Constants (tap to insert)</div><div class="st-k" id="st-const">'+CONST.map(c=>'<button data-v="'+c[1]+'">'+c[0]+'</button>').join('')+'</div><div class="st-hd">Tip: use ^ for powers, ! for factorial, sqrt(), ln(), log() (base 10), π and E.</div></div>'+
'<div class="st-p" id="st-n"><div class="st-hd">Shared notes: whatever either of you types appears on both screens.</div><textarea id="st-pad" placeholder="Paste formulas, code, steps…"></textarea></div>'+
'<div class="st-p" id="st-f"><div class="st-row"><select id="st-kind"><option value="brown">Brown noise (deep focus)</option><option value="rain">Rain</option><option value="white">White noise</option><option value="bin">Binaural 10 Hz (headphones)</option></select><input id="st-vol" type="range" min="0.05" max="1" step="0.05" value="0.4"><button id="st-play">▶ Start</button></div><label><input type="checkbox" id="st-sync" checked> Start and stop together with my buddy</label><div class="st-hd">The sound is made on each device, so it uses no call data.</div></div></div>';
document.body.appendChild(ov);
const $=s=>ov.querySelector(s),rid=()=>Q('#room-id').value.trim();
const send=o=>{try{const s=JSON.stringify(Object.assign({__b:1},o));if(dataChannel&&dataChannel.readyState==='open')dataChannel.send(s);else if(socket)socket.emit('signal-message',{room:rid(),type:'chat',data:s})}catch(e){}};
/* whiteboard */
const cv=$('#st-cv'),cx=cv.getContext('2d');let tool='pen',col='#ffffff',sz=3,sym='',drawing=false,sx=0,sy=0,lx=0,ly=0,snap=null;const SZ=[3,6,10,2];
const pos=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height]};
function seg(a,c,w,er){cx.save();cx.lineCap='round';cx.lineJoin='round';cx.strokeStyle=c;cx.lineWidth=er?w*6:w;if(er)cx.globalCompositeOperation='destination-out';cx.beginPath();cx.moveTo(a[0]*1000,a[1]*600);cx.lineTo(a[2]*1000,a[3]*600);cx.stroke();cx.restore()}
function shape(t,a,c,w){cx.save();cx.strokeStyle=c;cx.lineWidth=w;cx.lineCap='round';cx.beginPath();const x0=a[0]*1000,y0=a[1]*600,x1=a[2]*1000,y1=a[3]*600;if(t==='line'||t==='arrow'){cx.moveTo(x0,y0);cx.lineTo(x1,y1);if(t==='arrow'){const an=Math.atan2(y1-y0,x1-x0),h=14+w*2;cx.moveTo(x1,y1);cx.lineTo(x1-h*Math.cos(an-.45),y1-h*Math.sin(an-.45));cx.moveTo(x1,y1);cx.lineTo(x1-h*Math.cos(an+.45),y1-h*Math.sin(an+.45))}}else if(t==='rect')cx.rect(x0,y0,x1-x0,y1-y0);else cx.ellipse((x0+x1)/2,(y0+y1)/2,Math.abs(x1-x0)/2,Math.abs(y1-y0)/2,0,0,7);cx.stroke();cx.restore()}
function text(x,y,s,c){cx.save();cx.fillStyle=c;cx.font='bold 34px sans-serif';cx.fillText(s,x*1000,y*600);cx.restore()}
cv.onpointerdown=e=>{const p=pos(e);if(tool==='text'){const s=sym||prompt('Text / formula');sym='';if(s){text(p[0],p[1],s,col);send({k:'st-txt',x:p[0],y:p[1],s,c:col})}return}drawing=true;cv.setPointerCapture(e.pointerId);sx=lx=p[0];sy=ly=p[1];if(tool!=='pen'&&tool!=='eraser')snap=cx.getImageData(0,0,1000,600)};
cv.onpointermove=e=>{if(!drawing)return;const p=pos(e);if(tool==='pen'||tool==='eraser'){const a=[lx,ly,p[0],p[1]],er=tool==='eraser';seg(a,col,sz,er);send({k:'st-seg',a,c:col,w:sz,e:er});lx=p[0];ly=p[1]}else{cx.putImageData(snap,0,0);shape(tool,[sx,sy,p[0],p[1]],col,sz)}};
cv.onpointerup=e=>{if(!drawing)return;drawing=false;if(tool!=='pen'&&tool!=='eraser'){const p=pos(e),a=[sx,sy,p[0],p[1]];cx.putImageData(snap,0,0);shape(tool,a,col,sz);send({k:'st-shp',t:tool,a,c:col,w:sz})}};
ov.querySelectorAll('[data-tool]').forEach(b=>b.onclick=()=>{tool=b.dataset.tool;ov.querySelectorAll('[data-tool]').forEach(x=>x.classList.toggle('on',x===b))});
ov.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{col=b.dataset.c;ov.querySelectorAll('[data-c]').forEach(x=>x.classList.toggle('on',x===b))});
let si=0;$('#st-sz').onclick=()=>{si=(si+1)%4;sz=SZ[si];$('#st-sz').textContent='● '+sz};
$('#st-clr').onclick=()=>{cx.clearRect(0,0,1000,600);send({k:'st-clr'})};
$('#st-sym').onclick=e=>{const b=e.target.closest('button');if(b){sym=b.dataset.s;tool='text';ov.querySelectorAll('[data-tool]').forEach(x=>x.classList.toggle('on',x.dataset.tool==='text'))}};
/* calculator */
let deg=true;const R=x=>deg?x*Math.PI/180:x,D=x=>deg?x*180/Math.PI:x;
const F={sin:x=>Math.sin(R(x)),cos:x=>Math.cos(R(x)),tan:x=>Math.tan(R(x)),asin:x=>D(Math.asin(x)),acos:x=>D(Math.acos(x)),atan:x=>D(Math.atan(x)),ln:Math.log,log:Math.log10,sqrt:Math.sqrt,cbrt:Math.cbrt,abs:Math.abs,exp:Math.exp,fact:n=>{let r=1;for(let i=2;i<=n;i++)r*=i;return r},PI:Math.PI,E:Math.E};
function calc(src){let x=src.replace(/\s+/g,'').replace(/π/g,'PI').replace(/√/g,'sqrt').replace(/×/g,'*').replace(/÷/g,'/').replace(/\^/g,'**').replace(/(\d+)!/g,'fact($1)').replace(/(\d|\))\(/g,'$1*(').replace(/(\d)(?=PI|sqrt|sin|cos|tan|asin|acos|atan|ln|log|exp|abs|cbrt)/g,'$1*');
if(/[^0-9A-Za-z+\-*/().,%]/.test(x))throw 0;const bare=x.replace(/\d+\.?\d*(?:e[+-]?\d+)?|\.\d+(?:e[+-]?\d+)?/gi,'0');if((bare.match(/[A-Za-z]+/g)||[]).some(n=>!(n in F)))throw 0;return Function(...Object.keys(F),'"use strict";return ('+x+')')(...Object.values(F))}
const ex=$('#st-ex'),res=$('#st-res');
$('#st-k').innerHTML=['sin(','cos(','tan(','asin(','acos(','atan(','ln(','log(','sqrt(','cbrt(','^','(',')','π','E','!','%','^2','^-1'].map(t=>'<button data-v="'+t+'">'+t.replace('sqrt(','√(')+'</button>').join('');
const doCalc=()=>{try{const r=calc(ex.value);res.textContent=Number.isFinite(r)?'= '+parseFloat(r.toPrecision(10)):'Math error'}catch(e){res.textContent='Check the expression'}};
ov.querySelectorAll('#st-k button,#st-const button').forEach(b=>b.onclick=()=>{ex.value+=b.dataset.v;ex.focus()});
$('#st-eq').onclick=doCalc;ex.onkeydown=e=>{if(e.key==='Enter')doCalc()};$('#st-ac').onclick=()=>{ex.value='';res.textContent=''};
$('#st-deg').onclick=()=>{deg=!deg;$('#st-deg').textContent=deg?'DEG':'RAD';$('#st-deg').classList.toggle('on',deg)};
/* notes */
const pad=$('#st-pad');let padT=0,padLast=0;pad.oninput=()=>{padLast=Date.now();clearTimeout(padT);padT=setTimeout(()=>send({k:'st-pad',v:pad.value}),300)};
/* focus sounds */
let AC,node=null;function stopF(){if(node){node.s.forEach(s=>{try{s.stop()}catch(e){}});try{node.g.disconnect()}catch(e){}node=null}$('#st-play').textContent='▶ Start'}
function startF(kind,v){stopF();AC=AC||new(window.AudioContext||window.webkitAudioContext)();AC.resume();const g=AC.createGain();g.gain.value=v;g.connect(AC.destination);const s=[];
if(kind==='bin'){[[200,-1],[210,1]].forEach(([f,p])=>{const o=AC.createOscillator(),pn=AC.createStereoPanner();o.frequency.value=f;pn.pan.value=p;o.connect(pn);pn.connect(g);o.start();s.push(o)})}
else{const n=AC.sampleRate*4,b=AC.createBuffer(1,n,AC.sampleRate),a=b.getChannelData(0);let l=0;for(let i=0;i<n;i++){const w=Math.random()*2-1;if(kind==='brown'){l=(l+.02*w)/1.02;a[i]=l*3.5}else a[i]=w*.5}const src=AC.createBufferSource();src.buffer=b;src.loop=true;let out=src;if(kind==='rain'){const hp=AC.createBiquadFilter();hp.type='highpass';hp.frequency.value=900;const lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=9000;src.connect(hp);hp.connect(lp);out=lp}out.connect(g);src.start();s.push(src)}
node={g,s};$('#st-play').textContent='⏹ Stop'}
$('#st-play').onclick=()=>{const on=!node,k=$('#st-kind').value,v=+$('#st-vol').value;if(on)startF(k,v);else stopF();if($('#st-sync').checked)send({k:'st-snd',on,kind:k,v})};
$('#st-vol').oninput=()=>{if(node)node.g.gain.value=+$('#st-vol').value};
/* receive */
function handle(o){switch(o.k){case'st-seg':seg(o.a,o.c,o.w,o.e);break;case'st-shp':shape(o.t,o.a,o.c,o.w);break;case'st-txt':text(o.x,o.y,o.s,o.c);break;case'st-clr':cx.clearRect(0,0,1000,600);break;
case'st-pad':if(document.activeElement!==pad||Date.now()-padLast>1500)pad.value=o.v;break;case'st-snd':if($('#st-sync').checked){$('#st-kind').value=o.kind;$('#st-vol').value=o.v;o.on?startF(o.kind,o.v):stopF()}break}}
const prev=window.appendMessage;window.appendMessage=(t,m)=>{if(typeof t==='string'&&t.startsWith('{"__b"')){try{const o=JSON.parse(t);if(o.k&&o.k.indexOf('st-')===0){handle(o);return}}catch(e){}}prev&&prev(t,m)};
/* open, tabs, close */
ov.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{ov.querySelectorAll('[data-t]').forEach(x=>x.classList.toggle('on',x===b));ov.querySelectorAll('.st-p').forEach(p=>p.classList.toggle('on',p.id==='st-'+b.dataset.t))});
$('#st-x').onclick=()=>ov.classList.remove('on');
const d=Q('#bp-dock');if(d){const b=E('button',0,'📚 Study');b.dataset.a='study';d.insertBefore(b,d.querySelector('[data-a=chat]'));b.addEventListener('click',()=>ov.classList.add('on'))}
document.addEventListener('keydown',e=>{if(e.key==='Escape')ov.classList.remove('on')});
})();
