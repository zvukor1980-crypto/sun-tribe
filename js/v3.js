'use strict';
// ===== Sun Tribe v3 — Phase 1: living village, animated heroines, juicy feedback, animated buildings =====
const V3={};
function addL(o){ for(const l in o) Object.assign(L[l],o[l]); }
addL({
 ru:{v3_anim:'Анимации и эффекты',v3_hi:['Привет, вождь! 😘','Как я тебе в латексе? 💋','Сегодня отличный день! ☀️','Сфоткай меня! 📸','Я блесну на подиуме ✨','Обожаю наш остров 🌴','Не отвлекай, я позирую 💅','Пойдём на свидание? 💞','Ещё немного — и новая эра! 🌅','Мне идёт этот блеск? 💎'],v3_tapgift:'Подарок от {n}'},
 en:{v3_anim:'Animations & effects',v3_hi:['Hi, chief! 😘','Like my latex look? 💋','What a great day! ☀️','Take my photo! 📸','I’ll shine on the runway ✨','I love our island 🌴','Shh, I’m posing 💅','Shall we go on a date? 💞','A new era is so close! 🌅','Does this shine suit me? 💎'],v3_tapgift:'Gift from {n}'},
 he:{v3_anim:'אנימציות ואפקטים',v3_hi:['היי, צ׳יף! 😘','אהבת את הלטקס שלי? 💋','איזה יום נהדר! ☀️','צלם אותי! 📸','אני אזהר על המסלול ✨','אני אוהבת את האי שלנו 🌴','ששש, אני מצטלמת 💅','נצא לדייט? 💞','עידן חדש כבר קרוב! 🌅','הברק הזה מתאים לי? 💎'],v3_tapgift:'מתנה מ{n}'}
});
// ---------- state (compatible: v stays 2, new keys get defaults) ----------
function ensureV3(n){ if(!n) return n;
 n.fx=Object.assign({dn:'fast',wx:true,anim:true},n.fx||{});
 if(!n.wtap||typeof n.wtap!=='object') n.wtap={day:-1,set:{}};
 return n; }
V3.ens=[ensureV3];
{ const _n=newState, _m=migrate;
  newState=function(l){ const n=_n(l); V3.ens.forEach(f=>f(n)); return n; };
  migrate=function(o){ const n=_m(o); V3.ens.forEach(f=>f(n)); return n; }; }
const animOn=()=>!S||!S.fx||S.fx.anim!==false;
function applyFxClass(){ document.body.classList.toggle('noanim',!animOn()); }

// ---------- extra sfx ----------
{ const _p=Audio2.play.bind(Audio2);
  Audio2.play=function(name){ if(!this.ctx||this.ctx.state!=='running') return; const c=this.ctx,t=c.currentTime+0.005,D=this.sfx,f=m=>this.mf(m);
   const arp=(ns,st,i,v,d)=>ns.forEach((m,j)=>this.inst(i,D,t+j*st,f(m),d||0.3,v));
   switch(name){
    case 'glam': { const b=this.nz(D,t,0.6,0.18,'bandpass',800,2,0.05); b.frequency.exponentialRampToValueAtTime(9000,t+0.5); arp([84,88,91,96,100,103],0.045,'bell',0.07,0.6); this.inst('superpad',D,t,f(72),0.9,0.05); return; }
    case 'firework': { const o=this.osc(D,t,f(60+Math.random()*12),0.35,'sine',0.05,0.01); o.frequency.exponentialRampToValueAtTime(f(96),t+0.3);
      this.nz(D,t+0.32,0.5,0.32,'lowpass',1800,0.7); this.osc(D,t+0.32,60,0.3,'sine',0.25,0.003);
      for(let i=0;i<7;i++) this.nz(D,t+0.45+Math.random()*0.5,0.04,0.06,'highpass',6000); return; }
    case 'whoosh': { const b=this.nz(D,t,0.25,0.12,'bandpass',600,1.5,0.05); b.frequency.exponentialRampToValueAtTime(3500,t+0.22); return; }
    case 'kiss': { const o=this.osc(D,t,f(91),0.12,'sine',0.18,0.004); o.frequency.exponentialRampToValueAtTime(f(98),t+0.08); this.nz(D,t,0.05,0.08,'bandpass',3500,3); arp([88,91],0.09,'bell',0.06); return; }
    case 'hey': { arp([76,79,84],0.06,'pluck',0.12,0.2); return; }
    case 'shake': { this.osc(D,t,48,0.4,'sine',0.35,0.002); this.nz(D,t,0.3,0.15,'lowpass',400); return; }
    case 'shutter': { this.nz(D,t,0.03,0.4,'highpass',3000); this.nz(D,t+0.06,0.05,0.3,'bandpass',2000,1.5); this.osc(D,t,f(100),0.08,'sine',0.05); return; }
    case 'cheer': { for(let i=0;i<14;i++) this.nz(D,t+Math.random()*0.8,0.5+Math.random()*0.6,0.05,'bandpass',900+Math.random()*1800,2,0.15);
      for(let i=0;i<10;i++) this.drum('clap',D,t+0.1+i*0.11+Math.random()*0.04,0.18); return; }
    case 'heart': { arp([79,84,88],0.07,'bell',0.07,0.5); return; }
    case 'chime': { arp([84,91,96],0.12,'bell',0.06,0.9); return; }
    case 'thunder': { this.nz(D,t,2.2,0.35,'lowpass',260,0.8,0.08); this.nz(D,t+0.05,0.4,0.2,'lowpass',900,0.8,0.01); return; }
   }
   return _p(name); }; }

// ---------- Juicy: arc-flying resources ----------
const CU={disp:{},from:{},to:{},t0:{},dur:{},hold:{},raf:0};
function cuTick(ts){ CU.raf=0; let more=false; const tn=performance.now();
 for(const r in CU.to){ const e=document.getElementById('r_'+r); if(!e){ delete CU.to[r]; continue; }
  if(tn<CU.t0[r]){ more=true; continue; }
  const p=Math.min(1,(tn-CU.t0[r])/CU.dur[r]), q=1-Math.pow(1-p,3), v=CU.from[r]+(CU.to[r]-CU.from[r])*q; CU.disp[r]=v;
  const s=fmt(v); if(e.textContent!==s) e.textContent=s;
  if(p>=1){ const up=CU.to[r]>=CU.from[r]; delete CU.to[r]; const pn=e.parentNode; pn.classList.remove('cup','cdn','pop'); void pn.offsetWidth; pn.classList.add('pop'); } else more=true; }
 if(more) CU.raf=requestAnimationFrame(cuTick); }
function cuSet(r,target){ const e=document.getElementById('r_'+r); if(!e) return;
 if(CU.disp[r]==null||!animOn()){ CU.disp[r]=target; const s=fmt(target); if(e.textContent!==s){ e.textContent=s; e.parentNode.classList.remove('pop'); void e.offsetWidth; e.parentNode.classList.add('pop'); } return; }
 if(CU.to[r]===target) return; if(CU.to[r]==null&&Math.floor(CU.disp[r])===Math.floor(target)){ const s=fmt(target); if(e.textContent!==s) e.textContent=s; return; }
 const tn=performance.now(), up=target>CU.disp[r];
 CU.from[r]=CU.disp[r]; CU.to[r]=target; CU.t0[r]=Math.max(tn,up?(CU.hold[r]||0):0); CU.dur[r]=up?750:350;
 e.parentNode.classList.toggle('cup',up); e.parentNode.classList.toggle('cdn',!up);
 if(!CU.raf) CU.raf=requestAnimationFrame(cuTick); }
updHUD=function(){ if(!$('#hlvn')) return; $('#hlvn').textContent=S.lv; $('#hlvx').style.width=(100*S.xp/xpNeed(S.lv))+'%';
 const he=$('#hera'), ht=(V3.eraIcon?V3.eraIcon()+' ':'')+eraName(eraOf(hallLvl()))+' · 🔨'+busyBuilders()+'/'+S.builders; if(he.textContent!==ht) he.textContent=ht;
 ['coins','wood','stone','food','gems'].forEach(r=>cuSet(r,S.r[r]));
 const qb=$('#nav [data-n=quests] .dot'); if(qb){ const [v,n]=questProg(curQuest()); qb.style.display=v>=n?'block':'none'; }
 const sb=$('#nav [data-n=shop] .dot'); if(sb) sb.style.display=now()>=S.gift?'block':'none'; };
{ const _b=buildHUD; buildHUD=function(){ _b(); for(const r in CU.to) delete CU.to[r]; ['coins','wood','stone','food','gems'].forEach(r=>{ if(CU.disp[r]!=null){ const e=$('#r_'+r); if(e) e.textContent=fmt(CU.disp[r]); } }); if(V3.afterHUD) V3.afterHUD.forEach(f=>f()); }; }
V3.afterHUD=[];
const _flyResOld=flyRes;
flyRes=function(from,res,n){ if(!animOn()||!Element.prototype.animate){ _flyResOld(from,res,n); return; }
 const tgt=$('.rp[data-r='+res+']')||$('#hlv'); if(!tgt) return; const [tx,ty]=screenPos(tgt); const app=$('#app'); const ar=app.getBoundingClientRect();
 const cnt=Math.min(10,Math.max(3,Math.round(2+Math.log2(1+n)*1.2))); const base=performance.now(); let landed=0;
 CU.hold[res]=base+560+(cnt-1)*48;
 for(let i=0;i<cnt;i++){ const d=document.createElement('div'); d.className='fly3'; d.textContent=RI[res];
  const sx=from[0]-ar.left+(Math.random()-.5)*70, sy=from[1]-ar.top+(Math.random()-.5)*44, ex=tx-ar.left, ey=ty-ar.top;
  const cx=(sx+ex)/2+(Math.random()-.5)*160, cy=Math.min(sy,ey)-60-Math.random()*90;
  d.style.left='0px'; d.style.top='0px'; app.appendChild(d);
  const fr=[]; for(let k=0;k<=12;k++){ const p=k/12, x=(1-p)*(1-p)*sx+2*(1-p)*p*cx+p*p*ex, y=(1-p)*(1-p)*sy+2*(1-p)*p*cy+p*p*ey;
   const sc=p<.2?0.4+p*4.5:1.3-p*0.75; fr.push({transform:`translate(${x}px,${y}px) translate(-50%,-50%) scale(${sc.toFixed(2)}) rotate(${Math.round(p*(i%2?260:-260))}deg)`,opacity:p>.92?0.5:1}); }
  const a=d.animate(fr,{duration:560+Math.random()*120,delay:i*48,easing:'cubic-bezier(.45,0,.65,1)',fill:'both'});
  a.onfinish=()=>{ d.remove(); landed++; tgt.classList.remove('pop'); void tgt.offsetWidth; tgt.classList.add('pop');
   if(landed===1||landed===cnt) spark(ex,ey); if(landed===cnt) plusChip(ex,ey,res,n); }; } };
function spark(x,y){ const app=$('#app'); for(let i=0;i<6;i++){ const s=document.createElement('i'); s.className='spk3'; s.style.left=x+'px'; s.style.top=y+'px';
 const an=Math.random()*6.28, r=18+Math.random()*22; app.appendChild(s);
 s.animate([{transform:'translate(-50%,-50%) scale(1)',opacity:1},{transform:`translate(${Math.cos(an)*r-3}px,${Math.sin(an)*r-3}px) scale(.2)`,opacity:0}],{duration:420,easing:'ease-out'}).onfinish=()=>s.remove(); } }
function plusChip(x,y,res,n){ const d=document.createElement('div'); d.className='plus3'; d.textContent='+'+fmt(n); d.style.left=x+'px'; d.style.top=(y+16)+'px'; $('#app').appendChild(d); setTimeout(()=>d.remove(),1100); }

// ---------- Juicy: shake, bursts, fireworks ----------
function shake(power){ if(!animOn()) return; const v=$('#view'); if(!v||!v.animate) return; const p=power||6; const fr=[];
 for(let i=0;i<8;i++){ const k=p*(1-i/8); fr.push({transform:`translate(${(Math.random()-.5)*2*k}px,${(Math.random()-.5)*2*k}px)`}); } fr.push({transform:'none'});
 v.animate(fr,{duration:420,easing:'ease-out'}); }
function burstAt(b){ const w=$('#world'), p=PLOTS[b.plot]; if(!w||!p||!animOn()) return; const d=document.createElement('div'); d.className='bburst'; d.style.left=p[0]+'px'; d.style.top=(p[1]-70)+'px'; d.style.zIndex=9400;
 d.innerHTML='<i class="ring"></i><i class="ring r2"></i>'+'⭐✨💫⭐✨🌟'.match(/./gu).map((s,i)=>`<b style="--a:${i*60}deg">${s}</b>`).join(''); w.appendChild(d); setTimeout(()=>d.remove(),1200); }
let FW=null;
function fireworks(ms,opt){ if(!animOn()) return; opt=opt||{}; const app=$('#app'); const end=performance.now()+(ms||4000);
 if(FW){ FW.end=Math.max(FW.end,end); return; }
 const cv=document.createElement('canvas'); cv.className='fw3'; app.appendChild(cv); const dpr=Math.min(1.5,window.devicePixelRatio||1);
 const W=app.clientWidth, H=app.clientHeight; cv.width=W*dpr; cv.height=H*dpr; const g=cv.getContext('2d'); g.scale(dpr,dpr);
 const cols=['#ff4fb4','#ffd54a','#7ee36a','#4fc3f7','#b388ff','#ff8a65','#ffffff','#00e5ff'];
 FW={end,rk:[],pt:[],next:0,snd:0}; let last=performance.now();
 const step=ts=>{ const dt=Math.min(0.05,(ts-last)/1000); last=ts; const F=FW;
  if(ts<F.end&&ts>=F.next){ F.next=ts+(opt.small?380:260)+Math.random()*300; F.rk.push({x:W*(0.15+Math.random()*0.7),y:H+10,vx:(Math.random()-.5)*60,vy:-(H*0.9+Math.random()*H*0.5),ty:H*(0.18+Math.random()*0.3),c:cols[(Math.random()*cols.length)|0]}); }
  g.globalCompositeOperation='destination-out'; g.fillStyle='rgba(0,0,0,0.28)'; g.fillRect(0,0,W,H); g.globalCompositeOperation='lighter';
  F.rk=F.rk.filter(r=>{ r.x+=r.vx*dt; r.y+=r.vy*dt; r.vy+=H*0.5*dt; g.fillStyle='#fff8d0'; g.fillRect(r.x-1.5,r.y-1.5,3,3);
   if(r.y<=r.ty||r.vy>=0){ const n=opt.small?36:56, c2=cols[(Math.random()*cols.length)|0], sp=110+Math.random()*90;
    for(let i=0;i<n;i++){ const a=i/n*Math.PI*2, v=sp*(0.6+Math.random()*0.5); F.pt.push({x:r.x,y:r.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:1,c:i%3?r.c:c2}); }
    if(ts-F.snd>280){ F.snd=ts; sfx('firework'); } return false; } return true; });
  F.pt=F.pt.filter(p=>{ p.x+=p.vx*dt; p.y+=p.vy*dt; p.vx*=0.985; p.vy=p.vy*0.985+90*dt; p.l-=dt*0.85; if(p.l<=0) return false;
   g.globalAlpha=Math.max(0,p.l); g.fillStyle=p.c; g.beginPath(); g.arc(p.x,p.y,2.2*p.l+0.6,0,6.283); g.fill(); return true; }); g.globalAlpha=1;
  if(ts<F.end||F.rk.length||F.pt.length) requestAnimationFrame(step); else { cv.remove(); FW=null; } };
 requestAnimationFrame(step); }
{ const _fb=finishBuild; finishBuild=function(b,quiet){ const oe=eraOf(hallLvl()); _fb(b,quiet); const ne=eraOf(hallLvl());
   if(!quiet){ shake(b.type==='hall'?9:5); burstAt(b); sfx('shake'); }
   if(ne>oe) setTimeout(()=>{ fireworks(6000); const c=$('.celebrate'); if(c&&!c.querySelector('.rays2')) c.insertAdjacentHTML('afterbegin','<div class="rays rays2"></div>'); },quiet?650:450); }; }
{ const _ax=addXP; addXP=function(n){ const lv=S.lv; _ax(n); if(S.lv>lv) setTimeout(()=>fireworks(2200,{small:1}),250); }; }

// ---------- Animated buildings ----------
const NEON={tavern:'BAR 🍸',boutique:'♥ LATEX',market:'SHOP $',hall:'★ SUN ★',workshop:'LAB ⚡',tower:'◉ SKY'};
function bfxHTML(b){ const tr=b.lvl>0?tier(b):1, T=b.type; let h='';
 const smoke=(x,y)=>`<i class="smk" style="left:${x}%;top:${y}%"></i><i class="smk s2" style="left:${x}%;top:${y}%"></i><i class="smk s3" style="left:${x}%;top:${y}%"></i>`;
 if((T==='house'||T==='tavern'||T==='workshop'||T==='sawmill')&&tr<=4) h+=smoke(T==='house'?62:T==='tavern'?66:T==='sawmill'?40:58,T==='house'?12:16);
 if(T==='farm'&&tr!==3) h+=`<div class="mill" style="left:${tr>=5?84:86}%;top:${tr>=5?30:36}%"><svg viewBox="-50 -50 100 100"><g class="bl">${[0,90,180,270].map(a=>`<path transform="rotate(${a})" d="M-3 -4 L-7 -46 L7 -46 L3 -4Z" fill="#fff6e0" stroke="#8a5a2b" stroke-width="2.5"/>`).join('')}<circle r="6" fill="#8a5a2b"/></g></svg></div>`;
 if(T==='farm') h+='<i class="bfly" style="left:20%;top:40%">🦋</i>';
 if(T==='quarry') h+='<i class="dust" style="left:34%;top:62%"></i><i class="dust d2" style="left:58%;top:58%"></i>';
 if(T==='tower'&&tr>=3) h+='<i class="beam" style="left:50%;top:5%"></i>';
 if(T==='tower') h+='<i class="blink" style="left:50%;top:3%"></i>';
 if(T==='market'&&tr<=4) h+='<i class="coinb" style="left:50%;top:6%">🪙</i>';
 if(T==='boutique'||T==='market'||T==='hall') h+=[[22,30],[78,24],[52,12],[30,62]].map(([x,y],i)=>`<i class="tw" style="left:${x}%;top:${y}%;animation-delay:${i*.55}s">✦</i>`).join('');
 if(tr>=5&&NEON[T]) h+=`<div class="neon n${T}" style="left:50%;top:${T==='hall'?60:T==='tower'?44:50}%">${NEON[T]}</div>`;
 if(tr>=5&&(T==='workshop'||T==='sawmill')) h+='<i class="zap" style="left:30%;top:20%">⚡</i>';
 h+='<div class="cons3"><i class="scaf"></i><span class="wkr">👷‍♀️</span><span class="wkr w2">🔨</span><i class="dust c1"></i><i class="dust c2"></i></div>';
 return '<div class="bfx">'+h+'</div>'; }
{ const _rv=renderVillage; renderVillage=function(){ _rv(); const w=$('#world'); if(!w) return;
   S.b.forEach(b=>{ const d=document.getElementById('b'+b.id); if(d&&!d.querySelector('.bfx')) d.insertAdjacentHTML('beforeend',bfxHTML(b)); d&&(d._tr=b.lvl>0?tier(b):1); });
   S.decor.forEach(dc=>{ const p=DECOR_SPOTS[dc.s]; if(!p) return; const el=[...w.querySelectorAll('.dec')].find(e=>e.style.left===p[0]+'px'&&e.style.top===p[1]+'px'); if(!el) return; el.dataset.k=dc.k;
    if(dc.k==='fountain') el.insertAdjacentHTML('beforeend','<div class="spray">'+[0,1,2,3,4,5].map(i=>`<i style="--d:${i*.25}s;--x:${(i%3-1)*14}px"></i>`).join('')+'</div>');
    if(dc.k==='lantern'||dc.k==='crystal'||dc.k==='neonpalm') el.insertAdjacentHTML('beforeend','<i class="glo"></i>'); });
   if(V3.afterRender) V3.afterRender.forEach(f=>f()); walkSync(true); }; }
V3.afterRender=[];
{ const _uv=updVillage; updVillage=function(){ _uv(); S.b.forEach(b=>{ if(b.bt) return; const d=document.getElementById('b'+b.id); if(d&&d._tr!=null&&d._tr!==tier(b)){ const f=d.querySelector('.bfx'); if(f) f.remove(); d.insertAdjacentHTML('beforeend',bfxHTML(b)); d._tr=tier(b); } }); }; }

// ---------- Living village: walking heroines ----------
const WALK=[[400,600],[500,540],[600,520],[660,600],[520,660],[400,720],[480,800],[600,760],[680,700],[760,660],[540,880],[460,940],[600,940],[700,860],[820,760],[900,700],[660,1040],[500,1040],[760,1000]];
const WNB=WALK.map((p,i)=>WALK.map((q,j)=>j).filter(j=>j!==i&&Math.hypot(WALK[j][0]-p[0],WALK[j][1]-p[1])<190));
const WK={list:[],key:'',raf:0,last:0};
function walkSrc(k){ const o=outfitOf(k); return 'a/w/'+o.img.split('/').pop(); }
function walkSync(force){ const w=$('#world'); if(!w||!S||!S.started) return;
 const hs=owned().slice(0,9), key=hs.map(h=>h.k+':'+outfitOf(h.k).id).join(',');
 if(!force&&key===WK.key&&WK.list.every(x=>x.el.isConnected)) return; WK.key=key;
 const keep={}; WK.list.forEach(x=>{ if(hs.some(h=>h.k===x.k)&&x.el.isConnected) keep[x.k]=x; else x.el.remove(); });
 WK.list=hs.map((h,i)=>{ let x=keep[h.k]; if(!x){ const n=(i*7+3)%WALK.length; x={k:h.k,n,x:WALK[n][0],y:WALK[n][1],st:'idle',until:performance.now()+500+Math.random()*2500,fl:Math.random()<.5};
   const el=document.createElement('div'); el.className='walker'; el.innerHTML='<div class="wk-in"><i class="wk-sh"></i><img draggable="false" alt=""></div><div class="wk-bub"></div>';
   el.onclick=e=>{ e.stopPropagation(); Audio2.unlock(); walkerTap(x); }; x.el=el; x.img=el.querySelector('img'); x.bub=el.querySelector('.wk-bub'); w.appendChild(el); wPos(x); }
  const src=walkSrc(h.k); if(x.src!==src){ x.src=src; x.img.src=src; x.img.onerror=()=>{ x.img.onerror=null; x.img.src='a/w/'+h.k+'.webp'; }; } return x; });
 if(!WK.raf&&WK.list.length) WK.raf=requestAnimationFrame(walkLoop); }
function wPos(x){ x.el.style.transform=`translate3d(${x.x.toFixed(1)}px,${x.y.toFixed(1)}px,0)`; const z=Math.round(x.y)+20; if(x.z!==z){ x.z=z; x.el.style.zIndex=z; } }
function wState(x,st,ms){ x.st=st; x.until=performance.now()+ms; x.el.className='walker '+st+(x.fl?' fl':''); }
function walkLoop(ts){ WK.raf=0; if(!WK.list.length) return; if(document.hidden){ setTimeout(()=>{ if(!WK.raf) WK.raf=requestAnimationFrame(walkLoop); },800); return; }
 if(ts-WK.last<33){ WK.raf=requestAnimationFrame(walkLoop); return; } const dt=Math.min(0.1,(ts-(WK.last||ts))/1000); WK.last=ts;
 const still=!animOn();
 WK.list.forEach(x=>{ if(still){ if(x.st!=='idle') wState(x,'idle',1e9); return; }
  if(x.st==='walk'){ const tg=WALK[x.to], dx=tg[0]-x.x, dy=tg[1]-x.y, d=Math.hypot(dx,dy), sp=34;
   if(d<=sp*dt){ x.x=tg[0]; x.y=tg[1]; x.n=x.to; const r=Math.random(); if(r<0.18) { wState(x,'wave',1800); } else if(r<0.32) { wState(x,'pose',2200); } else if(r<0.62) wState(x,'idle',900+Math.random()*2600); else walkNext(x); }
   else { x.x+=dx/d*sp*dt; x.y+=dy/d*sp*dt; } wPos(x); }
  else if(ts>=x.until){ if(x.st==='wave'||x.st==='pose'||x.st==='jump'||Math.random()<0.8) walkNext(x); else wState(x,'idle',1200+Math.random()*2000); } });
 if(!still||WK.list.some(x=>x.st!=='idle')) WK.raf=requestAnimationFrame(walkLoop); else setTimeout(()=>{ if(!WK.raf) WK.raf=requestAnimationFrame(walkLoop); },1000); }
function walkNext(x){ const nb=WNB[x.n]; if(!nb||!nb.length){ wState(x,'idle',3000); return; } let to=nb[(Math.random()*nb.length)|0];
 if(nb.length>1&&to===x.prev) to=nb[(Math.random()*nb.length)|0]; x.prev=x.n; x.to=to; const dx=WALK[to][0]-x.x; if(Math.abs(dx)>4) x.fl=dx<0; wState(x,'walk',1e9); }
function walkerTap(x){ const h=HER.find(q=>q.k===x.k); vib(8); wState(x,'jump',1100); sfx(Math.random()<.5?'kiss':'hey');
 const ph=t('v3_hi'); const lines=Array.isArray(ph)?ph:[ph]; x.bub.textContent=lines[(Math.random()*lines.length)|0]; x.bub.classList.remove('on'); void x.bub.offsetWidth; x.bub.classList.add('on');
 clearTimeout(x.bt); x.bt=setTimeout(()=>x.bub.classList.remove('on'),2600);
 for(let i=0;i<5;i++){ const hh=document.createElement('i'); hh.className='wheart'; hh.textContent=['💖','💕','💗','✨','💋'][i]; hh.style.setProperty('--x',((i-2)*16)+'px'); hh.style.animationDelay=(i*0.07)+'s'; x.el.appendChild(hh); setTimeout(()=>hh.remove(),1500); }
 const d=dayNum(); if(S.wtap.day!==d){ S.wtap={day:d,set:{}}; }
 if(!S.wtap.set[x.k]){ S.wtap.set[x.k]=1; S.r.petals=(S.r.petals||0)+2; S.stats.petals=(S.stats.petals||0)+2; toast('🌸+2 · '+t('v3_tapgift',{n:hname(x.k)}));
  if(V3.onTapHero) V3.onTapHero(x.k); save(); }
 if(V3.tapHero) V3.tapHero(x.k); }
setInterval(()=>{ if(S&&S.started) walkSync(false); },2500);

// ---------- Animated heroines in profile / wardrobe ----------
const LOOK={};
{ const _sh=setHeroImg; setHeroImg=function(el,k,oid){ _sh(el,k,oid); const box=el&&el.parentNode; if(!box||!(box.classList.contains('pimg')||box.classList.contains('wimg'))) return;
   const o=outfitOf(k,oid), s=S.h[k], hue=s&&s.hue?s.hue[o.id]:null, key=box.className.split(' ')[0];
   const prev=LOOK[key], cur={k,o:o.id,hue,m:curModal}; LOOK[key]=cur;
   box.classList.add('alive'); box.querySelectorAll('.hgl,.twk').forEach(e=>e.remove());
   const cut='a/c/'+o.img.split('/').pop();
   box.insertAdjacentHTML('beforeend',`<i class="hgl" style="-webkit-mask-image:url(${cut});mask-image:url(${cut})"></i>`+[[30,26],[68,34],[44,58],[62,72],[36,44]].map(([x,y],i)=>`<i class="twk" style="left:${x}%;top:${y}%;animation-delay:${(i*0.7).toFixed(1)}s">✦</i>`).join(''));
   if(prev&&prev.m===curModal&&prev.k===k&&(prev.o!==o.id||prev.hue!==hue)) outfitFlash(box);
   else if(!prev||prev.k!==k||prev.m!==curModal){ el.classList.remove('hin'); void el.offsetWidth; el.classList.add('hin'); }
   if(V3.heroHook) V3.heroHook.forEach(f=>f(box,el,k,o)); }; }
V3.heroHook=[];
{ const _cm=closeModal; closeModal=function(){ for(const k in LOOK) delete LOOK[k]; return _cm(); }; }
function outfitFlash(box){ if(!animOn()) { sfx('glam'); return; } box.querySelectorAll('.oflash').forEach(e=>e.remove());
 box.insertAdjacentHTML('beforeend','<div class="oflash"><i class="ofr"></i><i class="ofw"></i>'+[0,1,2,3,4,5,6,7].map(i=>`<b style="--a:${i*45}deg">✨</b>`).join('')+'</div>');
 const f=box.querySelector('.oflash'); setTimeout(()=>f.remove(),1100); sfx('glam'); vib(12); }

// ---------- Settings injection ----------
V3.settings=[];
V3.settings.push(()=>`<label class="sl tg">✨ ${t('v3_anim')} <input type="checkbox" id="sfxa" ${animOn()?'checked':''}></label>`);
V3.settingsBind=[()=>{ const a=$('#sfxa'); if(a) a.onchange=e=>{ S.fx.anim=e.target.checked; applyFxClass(); save(); sfx('tap'); }; }];
{ const _om=openModal; openModal=function(name,html,cls){ _om(name,html,cls);
   if(name==='settings'&&$('#smv')){ const n=$('#modal .set .note'); if(n){ n.insertAdjacentHTML('beforebegin','<div class="v3set">'+V3.settings.map(f=>f()).join('')+'</div>'); V3.settingsBind.forEach(f=>f()); } }
   if(V3.onModal) V3.onModal.forEach(f=>f(name)); }; }
V3.onModal=[];
{ const _eg=enterGame; enterGame=function(f){ ensureV3(S); applyFxClass(); _eg(f); }; }
