'use strict';
// ===== Sun Tribe — main engine =====
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const SAVE_KEY='suntribe_v1';
let S=null, lastSave=0;
const now=()=>Date.now();

// ---------- i18n ----------
function t(k,v){ let s=(L[S?S.lang:'ru']||L.ru)[k]; if(s==null) s=L.en[k]; if(s==null) s=k;
 if(v) for(const x in v) s=s.split('{'+x+'}').join(v[x]); return s; }
function fmt(n){ n=Math.floor(n); if(n<1000) return ''+n; const u=['K','M','B','T','Q'];
 let i=-1; while(n>=1000&&i<u.length-1){n/=1000;i++;} return (n>=100?Math.floor(n):n>=10?n.toFixed(1):n.toFixed(2)).replace(/\.0+$/,'')+u[i]; }
function ftime(sec){ sec=Math.max(0,Math.ceil(sec)); const h=Math.floor(sec/3600), m=Math.floor(sec%3600/60), s=sec%60;
 if(h>0) return h+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0'); return m+':'+String(s).padStart(2,'0'); }
const hname=k=>t('h_'+k), bname=k=>t('b_'+k);
function costStr(c){ return Object.entries(c).filter(([k,v])=>v>0).map(([k,v])=>`<span class="cs${(S.r[k]||0)>=v?'':' no'}">${RI[k]}${fmt(v)}</span>`).join(' '); }

// ---------- state ----------
function newState(lang){
 return {v:1,lang:lang||'ru',started:false,leader:null,mv:.6,sv:.8,vib:true,
  r:{coins:150,wood:40,stone:0,food:30,gems:20,tickets:0,books:0,shards:0},
  xp:0,lv:1,b:[],nid:1,h:{},builders:1,exp:null,reg:{home:true},far:0,q:0,qc:0,qn:0,
  gift:0,tfree:0,last:now(),era:1,seenTut:0,stats:{coll:0}};
}
function save(){ if(!S) return; S.last=now(); try{ localStorage.setItem(SAVE_KEY,JSON.stringify(S)); }catch(e){} lastSave=now(); }
function load(){ try{ const j=localStorage.getItem(SAVE_KEY); if(j){ const o=JSON.parse(j); if(o&&o.v===1) return Object.assign(newState(o.lang),o); } }catch(e){} return null; }

// ---------- derived ----------
const hallB=()=>S.b.find(b=>b.type==='hall');
const hallLvl=()=>{const h=hallB(); return h?h.lvl:1;};
function eraOf(h){ return h<5?1:h<10?2:3+Math.floor((h-10)/5); }
function eraName(e){ if(e<=3) return t('era'+e); const n=e-3; return t('era4')+(n>1?' '+n:''); }
function tier(b){ const own=b.lvl>=10?3:b.lvl>=5?2:1; return Math.min(own,Math.min(3,eraOf(hallLvl()))); }
function bimg(type,tr){ return 'a/b/'+type+'_'+tr+'.webp'; }
function exploredCount(){ return REG.filter(r=>r.k!=='home'&&S.reg[r.k]).length + S.far; }
function plotsOpen(){ return Math.min(PLOTS.length, BASE_PLOTS+2*REG.filter(r=>r.k!=='home'&&S.reg[r.k]).length); }
const xpNeed=L=>Math.round(100*Math.pow(1.18,L));
const owned=()=>HER.filter(h=>S.h[h.k]);
const H=k=>HER.find(h=>h.k===k);
function perk(kind){ let v=0; owned().forEach(h=>{ if(h.perk===kind){ const s=S.h[h.k]; v+=h.pv*(1+0.03*(s.lvl-1))*Math.pow(1.15,s.stars-1);} });
 return Math.min(kind==='loot'?200:60,v); }
function skillSum(br){ let v=0; owned().forEach(h=>v+=S.h[h.k].sk[br]); return v; }
function charm(){ let c=0; owned().forEach(h=>{ const s=S.h[h.k]; const o=OUT[h.k].find(o=>o.id===s.o)||OUT[h.k][0];
  c+=o.ch+(s.owned.length-1)*2+s.sk.charm*3+(s.hue&&s.hue[s.o]!=null?1:0)+s.stars; }); return Math.round(c*(1+perk('charm')/100)); }
const happiness=()=>Math.min(50,charm()*0.5);
function heroBonus(k){ const h=H(k), s=S.h[k]; return (h.base+0.5*(s.lvl-1))*Math.pow(1.25,s.stars-1)*(1+0.02*s.sk.res); }
function teamOf(b){ return owned().filter(h=>S.h[h.k].at===b.id).map(h=>h.k); }
function slotsOf(b){ return Math.min(3,1+Math.floor(b.lvl/5)); }
function heroInB(k,b){ const h=H(k); const m=(h.res==='all'||h.res===BLD[b.type].res)?1:0.5; return heroBonus(k)*m; }
function bonusOf(b){ const tm=teamOf(b); let v=0; tm.forEach(k=>v+=heroInB(k,b));
 SYNERGY.forEach(([a,c])=>{ if(tm.includes(a)&&tm.includes(c)) v+=5; });
 v+=happiness(); const res=BLD[b.type].res;
 REG.forEach(r=>{ if(r.k!=='home'&&S.reg[r.k]&&(r.bon===res||r.bon==='all')) v+=5; });
 return v; }
function rate(b){ return BLD[b.type].rate*Math.pow(1.3,b.lvl-1)*(1+bonusOf(b)/100); } // per minute
function capOf(b){ return Math.max(rate(b)*120, BLD[b.type].rate<0.1?2:10); }
function stored(b){ if(b.bt) return 0; return Math.min(capOf(b), rate(b)*(now()-b.t0)/60000); }
function bCost(type,L){ const base=BLD[type].cost, m=Math.pow(1.6,L-1)*(1-perk('cost')/100), o={};
 for(const k in base){ if(type==='hall'&&k==='stone'&&L<3) continue; o[k]=Math.ceil(base[k]*m); }
 if(L>=8) o.books=Math.ceil((L-6)*1.5); return o; }
function bTime(type,L){ return Math.max(3,BLD[type].time*Math.pow(1.45,L-1)*(1-Math.min(70,perk('build')+skillSum('build')*1.5)/100)); }
function hasRes(c){ for(const k in c){ if(k==='hall'){ if(hallLvl()<c[k]) return false; continue; } if((S.r[k]||0)<c[k]) return false; } return true; }
function pay(c){ for(const k in c){ if(k!=='hall') S.r[k]-=c[k]; } }
function give(c,mult=1){ for(const k in c){ if(k==='xp') addXP(c[k]); else if(k==='builder') S.builders=2; else S.r[k]=(S.r[k]||0)+Math.floor(c[k]*mult); } }
function busyBuilders(){ return S.b.filter(b=>b.bt).length; }
function countType(type){ return S.b.filter(b=>b.type===type).length; }
function maxLvl(b){ return b.type==='hall'?Infinity:hallLvl()*2; }

// ---------- feedback ----------
function vib(ms=12){ if(S&&S.vib&&navigator.vibrate) try{navigator.vibrate(ms);}catch(e){} }
function sfx(n){ Audio2.play(n); }
function toast(msg,cls=''){ const d=document.createElement('div'); d.className='toast '+cls; d.innerHTML=msg; $('#toasts').appendChild(d);
 setTimeout(()=>d.classList.add('out'),2300); setTimeout(()=>d.remove(),2800); }
function floatAt(b,txt){ const p=PLOTS[b.plot]; const d=document.createElement('div'); d.className='floaty'; d.textContent=txt;
 d.style.left=p[0]+'px'; d.style.top=(p[1]-120)+'px'; $('#world').appendChild(d); setTimeout(()=>d.remove(),1300); }

// ---------- XP / levels ----------
function addXP(n){ n=Math.round(n*(1+perk('xp')/100)); S.xp+=n;
 while(S.xp>=xpNeed(S.lv)){ S.xp-=xpNeed(S.lv); S.lv++; const g=3+S.lv; S.r.gems+=g; S.r.coins+=50*S.lv;
  celebrate('🎉 '+t('levelup'), t('level')+' '+S.lv, `${RI.gems}+${g} ${RI.coins}+${50*S.lv}`); sfx('levelup'); }
}
function celebrate(title,big,sub,img){ const d=document.createElement('div'); d.className='celebrate';
 d.innerHTML=`<div class="rays"></div><div class="cbox">${img?`<img src="${img}">`:''}<div class="ct">${title}</div><div class="cb">${big}</div><div class="cs2">${sub||''}</div><button class="btn g">OK</button></div>`;
 d.onclick=()=>{ d.remove(); sfx('tap'); }; $('#app').appendChild(d); vib(30); }

// ---------- buildings ----------
function startBuild(plot,type){ const c=bCost(type,1);
 if(busyBuilders()>=S.builders){ toast(t('busy'),'bad'); sfx('error'); return false; }
 if(!hasRes(c)){ toast(t('nores'),'bad'); sfx('error'); return false; }
 pay(c); const b={id:S.nid++,type,lvl:0,plot,t0:now(),bt:{end:now()+bTime(type,1)*1000,total:bTime(type,1)*1000,to:1}};
 S.b.push(b); sfx('build'); vib(); renderVillage(); updHUD(); save(); return true; }
function startUpgrade(b){ const L=b.lvl+1, c=bCost(b.type,L);
 if(b.type==='hall'&&S.lv<b.lvl){ toast(t('needlvl',{n:b.lvl}),'bad'); sfx('error'); return; }
 if(L>maxLvl(b)){ toast(t('needhall',{n:Math.ceil(L/2)}),'bad'); sfx('error'); return; }
 if(busyBuilders()>=S.builders){ toast(t('busy'),'bad'); sfx('error'); return; }
 if(!hasRes(c)){ toast(t('nores'),'bad'); sfx('error'); return; }
 collect(b,true); pay(c); const tm=bTime(b.type,L)*1000; b.bt={end:now()+tm,total:tm,to:L}; sfx('build'); vib();
 closeModal(); renderVillage(); updHUD(); save(); }
function finishBuild(b,quiet){ const oldEra=eraOf(hallLvl()); b.lvl=b.bt.to; b.bt=null; b.t0=now();
 addXP(10*b.lvl+(b.type==='hall'?30*b.lvl:0));
 if(!quiet){ sfx('done'); floatAt(b,'✓ '+t('done')); }
 const ne=eraOf(hallLvl()); if(ne>oldEra){ S.era=ne; Audio2.era=ne;
  setTimeout(()=>{ celebrate('🌅 '+t('newera'), eraName(ne), t('b_hall')+' '+t('lvl')+' '+hallLvl(), bimg('hall',Math.min(3,ne))); sfx('levelup'); },quiet?500:300); }
 renderVillage(); }
function speedCost(b){ const rem=(b.bt.end-now())/1000; return rem<30?0:Math.ceil(rem/120); }
function speedUp(b){ const c=speedCost(b); if(S.r.gems<c){ toast(t('nores'),'bad'); sfx('error'); return; }
 S.r.gems-=c; b.bt.end=now(); finishBuild(b); closeModal(); updHUD(); save(); }
function collect(b,silent){ const st=stored(b); const n=Math.floor(st); if(n<1) return 0; const res=BLD[b.type].res;
 const r=rate(b); const cap=capOf(b);
 b.t0 = st>=cap ? now() : now()-((st-n)/r)*60000;
 S.r[res]+=n; S.stats.coll++; questEvent('collect',res,n);
 if(!silent){ sfx(res==='coins'?'coin':'collect'); vib(8); floatAt(b,'+'+fmt(n)+' '+RI[res]); addXP(1); }
 return n; }

// ---------- heroines ----------
function newHero(k){ const h=H(k); S.h[k]={lvl:1,xp:0,stars:h.st||1,o:'base',owned:['base'],hue:{},sk:{res:0,build:0,charm:0},sp:0,at:null}; }
function heroCap(k){ const s=S.h[k]; return s.stars>=5?Infinity:30*s.stars; }
function lvlCost(k){ const L=S.h[k].lvl; return {coins:Math.ceil(200*Math.pow(1.2,L)),food:Math.ceil(20*Math.pow(1.15,L)),books:L<5?0:Math.ceil(L/3)}; }
const STARN=[10,20,30,50,80];
function heroLevelUp(k){ const s=S.h[k], c=lvlCost(k);
 if(s.xp<xpNeed(s.lvl)||s.lvl>=heroCap(k)||!hasRes(c)){ sfx('error'); toast(t('nores'),'bad'); return; }
 pay(c); s.xp-=xpNeed(s.lvl); s.lvl++; s.sp++; sfx('levelup'); vib(25); addXP(15); toast('✨ '+hname(k)+' → '+t('lvl')+' '+s.lvl,'good'); save(); }
function heroTrain(k){ const s=S.h[k], c={food:Math.ceil(15*Math.pow(1.12,s.lvl))};
 if(!hasRes(c)){ sfx('error'); toast(t('nores'),'bad'); return; } pay(c); s.xp+=Math.ceil(xpNeed(s.lvl)/4); sfx('sparkle'); save(); }
function heroStar(k){ const s=S.h[k]; if(s.stars>=5) return; const n=STARN[s.stars-1];
 if(S.r.shards<n){ sfx('error'); toast(t('nores'),'bad'); return; } S.r.shards-=n; s.stars++; sfx('levelup'); vib(30);
 celebrate('★',hname(k),'★'.repeat(s.stars),faceImg(k)); save(); }
function faceImg(k){ return 'a/h/face_'+k+'.webp'; }
function assign(k,bid){ const s=S.h[k]; if(bid!=null){ const b=S.b.find(x=>x.id===bid); if(!b) return;
  const tm=teamOf(b).filter(x=>x!==k); if(tm.length>=slotsOf(b)) { S.h[tm[tm.length-1]].at=null; } }
 // freeze current stored amounts before changing rates
 S.b.forEach(b=>{ if(!b.bt){ const st=stored(b); b._st=st; } });
 s.at=bid;
 S.b.forEach(b=>{ if(!b.bt){ const r=rate(b); b.t0=now()-(b._st/r)*60000; delete b._st; } });
 sfx('tap'); save(); }
function autoAssign(){ S.b.forEach(b=>{ if(!b.bt){ b._st=stored(b);} });
 owned().forEach(h=>S.h[h.k].at=null);
 const hs=owned().slice().sort((a,b)=>heroBonus(b.k)-heroBonus(a.k));
 const bs=S.b.filter(b=>b.lvl>0).sort((a,b)=>BLD[b.type].rate*Math.pow(1.3,b.lvl)*(b.type==='hall'?1:1)-BLD[a.type].rate*Math.pow(1.3,a.lvl));
 const free=b=>teamOf(b).length<slotsOf(b);
 hs.forEach(h=>{ let tgt=bs.find(b=>free(b)&&(h.res==='all'||BLD[b.type].res===h.res)); if(!tgt) tgt=bs.find(free); if(tgt) S.h[h.k].at=tgt.id; });
 S.b.forEach(b=>{ if(!b.bt&&b._st!=null){ b.t0=now()-(b._st/rate(b))*60000; delete b._st;} });
 sfx('sparkle'); save(); }

// ---------- outfits / recolor ----------
const rcCache={}, imgCache={};
function loadImg(src){ if(imgCache[src]) return imgCache[src]; return imgCache[src]=new Promise((res,rej)=>{ const i=new Image(); i.onload=()=>res(i); i.onerror=rej; i.src=src; }); }
function rgb2hsv(r,g,b){ const mx=Math.max(r,g,b), mn=Math.min(r,g,b), d=mx-mn; let h=0;
 if(d){ if(mx===r) h=((g-b)/d)%6; else if(mx===g) h=(b-r)/d+2; else h=(r-g)/d+4; h/=6; if(h<0) h+=1; } return [h,mx?d/mx:0,mx]; }
function hsv2rgb(h,s,v){ const i=Math.floor(h*6), f=h*6-i, p=v*(1-s), q=v*(1-f*s), u=v*(1-(1-f)*s);
 switch(((i%6)+6)%6){case 0:return[v,u,p];case 1:return[q,v,p];case 2:return[p,v,u];case 3:return[p,q,v];case 4:return[u,p,v];default:return[v,p,q];} }
async function recolored(src,mask,hue){ const key=src+'|'+hue; if(rcCache[key]) return rcCache[key];
 const center=MASKH[mask]; if(center==null) return src;
 const [im,mk]=await Promise.all([loadImg(src),loadImg('a/m/'+mask+'.png')]);
 const w=im.naturalWidth,h=im.naturalHeight, c=document.createElement('canvas'); c.width=w; c.height=h; const x=c.getContext('2d');
 x.drawImage(mk,0,0,w,h); const md=x.getImageData(0,0,w,h).data; x.clearRect(0,0,w,h); x.drawImage(im,0,0); const id=x.getImageData(0,0,w,h), d=id.data;
 const dh=(hue-center)/360;
 for(let i=0;i<d.length;i+=4){ const m=md[i]/255; if(m<0.03) continue;
  const [hh,ss,vv]=rgb2hsv(d[i]/255,d[i+1]/255,d[i+2]/255); let nh=hh+dh; nh-=Math.floor(nh);
  let ns=ss; if(hue===0||hue===330) ns=Math.min(1,ss*1.05);
  const [r,g,b]=hsv2rgb(nh,ns,vv); d[i]=d[i]*(1-m)+r*255*m; d[i+1]=d[i+1]*(1-m)+g*255*m; d[i+2]=d[i+2]*(1-m)+b*255*m; }
 x.putImageData(id,0,0);
 const url=await new Promise(res=>c.toBlob(bl=>res(bl?URL.createObjectURL(bl):c.toDataURL('image/png')),'image/png'));
 return rcCache[key]=url; }
function outfitOf(k,oid){ return OUT[k].find(o=>o.id===(oid||S.h[k].o))||OUT[k][0]; }
function setHeroImg(el,k,oid){ const o=outfitOf(k,oid), s=S.h[k]; el.src=o.img; const hue=s&&s.hue?s.hue[o.id]:null;
 if(hue!=null&&o.m&&MASKH[o.m]!=null){ const tok=Math.random(); el.dataset.tok=tok; recolored(o.img,o.m,hue).then(u=>{ if(el.dataset.tok==tok) el.src=u; }).catch(()=>{}); } }

// ---------- quests ----------
function curQuest(){ return S.q<QUESTS.length?QUESTS[S.q]:genQuest(S.q); }
function questText(q){ const [ty,a,n]=q.g; let an=a;
 if(ty==='build'||ty==='upgrade') an=bname(a); if(ty==='collect') an=RI[a];
 return t('q_'+ty,{a:an,n:fmt(n)}); }
function questProg(q){ const [ty,a,n]=q.g; let v=0;
 switch(ty){ case 'build': v=S.b.filter(b=>b.type===a&&b.lvl>=1).length; break;
  case 'collect': case 'color': case 'outfit': v=S.qc; break;
  case 'assign': v=owned().filter(h=>S.h[h.k].at!=null).length; break;
  case 'upgrade': v=Math.max(0,...S.b.filter(b=>b.type===a).map(b=>b.lvl)); break;
  case 'own': v=owned().length; break;
  case 'herolvl': v=Math.max(0,...owned().map(h=>S.h[h.k].lvl)); break;
  case 'herostar': v=Math.max(0,...owned().map(h=>S.h[h.k].stars)); break;
  case 'explore': v=exploredCount(); break;
  case 'bldlvl': v=Math.max(0,...S.b.filter(b=>b.type!=='hall').map(b=>b.lvl)); break; }
 return [Math.min(v,n),n]; }
function questEvent(ty,a,n){ const q=curQuest(); if(q.g[0]===ty&&(q.g[1]==null||q.g[1]===a)) S.qc+=n; }
function claimQuest(){ const q=curQuest(), [v,n]=questProg(q); if(v<n) return; give(q.r); S.q++; S.qc=0; sfx('done'); vib(20);
 toast('🏆 '+t('qdone')+' '+rwStr(q.r),'good'); save(); updQuest(); updHUD(); if(curModal==='quests') openQuests(); }
function rwStr(r){ return Object.entries(r).map(([k,v])=>(RI[k]||'')+'+'+fmt(v)).join(' '); }

// ---------- map / expeditions ----------
function regState(r){ if(S.reg[r.k]) return 'done'; if(S.exp&&S.exp.k===r.k) return 'going'; const tw=S.b.find(b=>b.type==='tower');
 return (r.tw===0||(tw&&tw.lvl>=r.tw))?'open':'locked'; }
function farReg(){ const n=S.far; return {k:'far',tw:12+n,food:Math.round(30000*Math.pow(1.35,n)),min:Math.round(180+30*n),rw:{gems:100+20*n,shards:40+8*n,books:20+5*n,tickets:2}}; }
function expTime(r){ return r.min*60*(1-perk('exp')/100); }
function startExp(r){ if(S.exp){ toast(t('exploring'),'bad'); sfx('error'); return; }
 const tw=S.b.find(b=>b.type==='tower'); if(r.tw&&(!tw||tw.lvl<r.tw)){ toast(t('needtower',{n:r.tw}),'bad'); sfx('error'); return; }
 if(S.r.food<r.food){ toast(t('nores'),'bad'); sfx('error'); return; }
 S.r.food-=r.food; S.exp={k:r.k,end:now()+expTime(r)*1000,total:expTime(r)*1000}; sfx('whoosh'); vib(); save(); openMap(r.k); }
function finishExp(quiet){ const k=S.exp.k; const r=k==='far'?farReg():REG.find(x=>x.k===k); S.exp=null;
 const mult=1+perk('loot')/100; give(r.rw,mult); addXP(50+r.min*3);
 if(k==='far') S.far++; else S.reg[k]=true;
 setTimeout(()=>{ celebrate('🗺️ '+t('explored'), k==='far'?t('endless')+' #'+S.far:t('g_reg_'+k), rwStr(Object.fromEntries(Object.entries(r.rw).map(([a,b])=>[a,Math.floor(b*mult)])))+(k!=='far'&&plotsOpen()<=PLOTS.length?'<br>'+t('plots'):'')); sfx('done'); },quiet?600:100);
 renderVillage(); save(); }

// ---------- tick ----------
function tick(){ if(!S||!S.started) return; const tn=now();
 S.b.forEach(b=>{ if(b.bt&&b.bt.end<=tn) finishBuild(b); });
 if(S.exp&&S.exp.end<=tn) finishExp();
 // passive heroine XP: 3/min when assigned
 const dt=(tn-(S._lt||tn))/60000; S._lt=tn;
 if(dt>0) owned().forEach(h=>{ const s=S.h[h.k]; if(s.at!=null) s.xp=Math.min(s.xp+3*dt*(1+perk('xp')/100), xpNeed(s.lvl)*3); });
 updVillage(); updHUD(); updQuest();
 if(curModal&&modalTick) modalTick();
 if(tn-lastSave>5000) save(); }
function offlineCatchup(){ const tn=now(), away=tn-(S.last||tn); let fin=0;
 S.b.forEach(b=>{ if(b.bt&&b.bt.end<=tn){ const e=b.bt.end; finishBuild(b,true); b.t0=e; fin++; } });
 if(S.exp&&S.exp.end<=tn) finishExp(true);
 const mins=away/60000; if(mins>0) owned().forEach(h=>{ const s=S.h[h.k]; if(s.at!=null) s.xp=Math.min(s.xp+3*mins,xpNeed(s.lvl)*3); });
 S._lt=tn;
 if(away>120000){ const full=S.b.filter(b=>!b.bt&&stored(b)>=1).length;
  setTimeout(()=>toast(`🌙 ${t('offline')}: ${ftime(away/1000)}<br>🏠×${full} ${fin?'· 🔨✓×'+fin:''}`,'good'),800); } }

// ================= UI =================
let curModal=null, modalTick=null;
function openModal(name,html,cls=''){ curModal=name; modalTick=null; const m=$('#modal'); m.className='modal show '+cls;
 m.innerHTML=`<div class="sheet ${cls}"><div class="mhead"><div class="mtitle">${html.title||''}</div><button class="x" data-a="close">✕</button></div><div class="mbody">${html.body}</div></div>`;
 m.querySelector('.sheet').onclick=e=>e.stopPropagation(); m.onclick=()=>closeModal(); m.querySelector('[data-a=close]').onclick=()=>closeModal();
 setNav(name); }
function closeModal(){ if(!curModal) return; curModal=null; modalTick=null; const m=$('#modal'); m.className='modal'; m.innerHTML=''; sfx('close'); setNav('village'); }
function setNav(n){ $$('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.n===n)); }
function on(sel,fn,root){ (root||document).querySelectorAll(sel).forEach(el=>el.onclick=e=>{ e.stopPropagation(); Audio2.unlock(); fn(el,e); }); }

// ---------- HUD ----------
function buildHUD(){ $('#hud').innerHTML=`
 <div class="lvbox" id="hlv"><div class="lvc"><span id="hlvn">1</span></div><div class="lvbar"><i id="hlvx"></i></div><div class="era" id="hera"></div></div>
 <div class="resrow">${['coins','wood','stone','food','gems'].map(r=>`<div class="rp" data-r="${r}"><b>${RI[r]}</b><span id="r_${r}">0</span></div>`).join('')}</div>
 <button class="gear" id="hgear">⚙️</button>`;
 on('#hgear',()=>openSettings()); on('#hlv',()=>openHeroes()); on('.rp',()=>openShop()); }
function updHUD(){ if(!$('#hlvn')) return; $('#hlvn').textContent=S.lv; $('#hlvx').style.width=(100*S.xp/xpNeed(S.lv))+'%';
 $('#hera').textContent=eraName(eraOf(hallLvl()))+' · 🔨'+busyBuilders()+'/'+S.builders;
 ['coins','wood','stone','food','gems'].forEach(r=>{ const e=$('#r_'+r); const v=fmt(S.r[r]); if(e.textContent!==v){ e.textContent=v; e.parentNode.classList.remove('pop'); void e.offsetWidth; e.parentNode.classList.add('pop'); } });
 const qb=$('#nav [data-n=quests] .dot'); if(qb){ const [v,n]=questProg(curQuest()); qb.style.display=v>=n?'block':'none'; }
 const sb=$('#nav [data-n=shop] .dot'); if(sb) sb.style.display=now()>=S.gift?'block':'none'; }
function buildNav(){ const items=[['village','🏝️'],['heroes','👑'],['wardrobe','👗'],['map','🗺️'],['shop','🛍️'],['quests','📜']];
 $('#nav').innerHTML=items.map(([n,i])=>`<button data-n="${n}"><span class="ni">${i}</span><span class="nl">${t(n)}</span><i class="dot"></i></button>`).join('');
 on('#nav button',el=>{ sfx('open'); vib(6); const n=el.dataset.n; if(n==='village') { closeModal(); return; }
  ({heroes:openHeroes,wardrobe:()=>openWardrobe(),map:()=>openMap(),shop:openShop,quests:openQuests})[n](); }); setNav(curModal||'village'); }
function updQuest(){ const q=curQuest(), [v,n]=questProg(q), el=$('#qtrack'); if(!el) return;
 const done=v>=n; const html=`<div class="qi">${done?'🏆':'📜'}</div><div class="qt"><div>${questText(q)}</div><div class="qbar"><i style="width:${100*v/n}%"></i></div><small>${fmt(v)}/${fmt(n)}</small></div>${done?`<button class="btn g sm" id="qclaim">${t('claim')}</button>`:''}`;
 if(el._h!==html){ el._h=html; el.innerHTML=html; el.classList.toggle('done',done); on('#qclaim',()=>claimQuest(),el); } }

// ---------- village ----------
function renderVillage(){ const w=$('#world'); if(!w) return; w.querySelectorAll('.plot,.bld').forEach(e=>e.remove());
 const po=plotsOpen(); const used={}; S.b.forEach(b=>used[b.plot]=b);
 PLOTS.forEach((p,i)=>{ if(used[i]) return; const d=document.createElement('div'); d.className='plot'+(i>=po?' lk':''); d.style.left=p[0]+'px'; d.style.top=p[1]+'px'; d.style.zIndex=p[1];
  d.innerHTML=i>=po?'<span>🔒</span>':'<span>+</span>'; d.onclick=e=>{ e.stopPropagation(); Audio2.unlock(); if(i>=po){ toast('🔒 '+t('plotlock')); sfx('error'); return; } openBuildMenu(i); }; w.appendChild(d); });
 S.b.forEach(b=>{ const p=PLOTS[b.plot]; const d=document.createElement('div'); d.className='bld'+(b.type==='hall'?' hall':''); d.id='b'+b.id;
  d.style.left=p[0]+'px'; d.style.top=p[1]+'px'; d.style.zIndex=p[1];
  const tr=b.lvl>0?tier(b):1;
  d.innerHTML=`<img src="${bimg(b.type,tr)}" draggable="false"><div class="blv">${b.lvl||'·'}</div><div class="bub"></div><div class="bbar"><i></i><span></span></div><div class="team"></div>`;
  d.onclick=e=>{ e.stopPropagation(); Audio2.unlock(); tapBuilding(b); }; w.appendChild(d); });
 updVillage(); }
function updVillage(){ S.b.forEach(b=>{ const d=document.getElementById('b'+b.id); if(!d) return;
  d.classList.toggle('cons',!!b.bt); const bar=d.querySelector('.bbar'), bub=d.querySelector('.bub');
  if(b.bt){ const rem=(b.bt.end-now())/1000; bar.style.display='block'; bar.querySelector('i').style.width=(100*(1-rem*1000/b.bt.total))+'%'; bar.querySelector('span').textContent='🔨 '+ftime(rem); bub.style.display='none'; }
  else { bar.style.display='none'; const st=stored(b), res=BLD[b.type].res; const show=st>=1&&(st>=capOf(b)*0.08||BLD[b.type].rate<0.3);
   bub.style.display=show?'flex':'none'; if(show){ const tx=RI[res]+(st>=capOf(b)?'!':''); if(bub.textContent!==tx) bub.textContent=tx; bub.classList.toggle('full',st>=capOf(b)); } }
  const tm=teamOf(b), te=d.querySelector('.team'), key=tm.join(','); if(te._k!==key){ te._k=key; te.innerHTML=tm.map(k=>`<img src="${faceImg(k)}">`).join(''); }
  const lv=d.querySelector('.blv'); const lt=String(b.bt?b.bt.to:b.lvl); if(lv.textContent!==lt) lv.textContent=lt;
  if(!b.bt){ const img=d.querySelector('img'), src=bimg(b.type,tier(b)); if(!img.src.endsWith(src)) img.src=src; } }); }
function tapBuilding(b){ if(b.bt){ openBuilding(b); return; } const n=collect(b); if(n>0){ updHUD(); updQuest(); updVillage(); } else openBuilding(b); }
function openBuildMenu(plot){ sfx('open'); const hl=hallLvl();
 const items=BORDER.filter(k=>k!=='hall').map(k=>{ const B=BLD[k], c=bCost(k,1), cnt=countType(k);
  let lock=''; if(hl<B.hall) lock=t('needhall',{n:B.hall}); else if(cnt>=B.max) lock=t('maxcount');
  return `<div class="bcard${lock?' lk':''}" data-k="${k}"><img src="${bimg(k,Math.min(3,eraOf(hl)))}"><div class="bn">${bname(k)} <small>${cnt}/${B.max}</small></div>
   <div class="bp">${RI[B.res]} ${fmt(B.rate*60)}${t('per_h')} · ⏱${ftime(bTime(k,1))}</div><div class="bc">${lock?'🔒 '+lock:costStr(c)}</div></div>`; }).join('');
 openModal('build',{title:'🔨 '+t('buildmenu'),body:`<div class="bgrid">${items}</div>`},'mid');
 on('.bcard:not(.lk)',el=>{ if(startBuild(plot,el.dataset.k)) closeModal(); }); on('.bcard.lk',()=>{ sfx('error'); }); }
function openBuilding(b){ sfx('open'); const B=BLD[b.type];
 const draw=()=>{ const tm=teamOf(b), sl=slotsOf(b); const L=b.lvl+1, c=bCost(b.type,L);
  let block=''; if(b.type==='hall'&&S.lv<b.lvl) block=t('needlvl',{n:b.lvl}); else if(L>maxLvl(b)) block=t('needhall',{n:Math.ceil(L/2)});
  const st=stored(b), r=rate(b);
  const slots=[...Array(sl)].map((_,i)=>{ const k=tm[i]; return k?`<div class="slot f" data-k="${k}"><img src="${faceImg(k)}"><small>+${Math.round(heroInB(k,b))}%</small></div>`:`<div class="slot" data-i="${i}">＋<small>${t('empty')}</small></div>`; }).join('')
   + (sl<3?`<div class="slot lk">🔒<small>${t('lvl')} ${5*sl}</small></div>`:'');
  let body=`<div class="bpanel"><div class="bpi"><img src="${bimg(b.type,b.lvl?tier(b):1)}"><div class="eratag">${eraName(b.lvl?tier(b):1)}</div></div><div class="bpd">`;
  if(b.bt){ const rem=(b.bt.end-now())/1000, sc=speedCost(b);
   body+=`<div class="big">${b.lvl?t('upgrading'):t('building')} → ${t('lvl')} ${b.bt.to}</div><div class="pbar"><i style="width:${100*(1-rem*1000/b.bt.total)}%"></i></div><div class="tm">⏱ ${ftime(rem)}</div>
    <button class="btn p" data-a="speed">⚡ ${t('speed')} ${sc?RI.gems+sc:t('speedfree')}</button>`; }
  else { body+=`<div class="stat">${t('prod')}: <b>${RI[B.res]} ${r*60>=10?fmt(r*60):(r*60).toFixed(1)}${t('per_h')}</b> <span class="bon">+${Math.round(bonusOf(b))}%</span></div>
    <div class="stat">${t('stored')}: <b>${RI[B.res]} ${fmt(st)}/${fmt(capOf(b))}</b></div><div class="pbar y"><i style="width:${100*st/capOf(b)}%"></i></div>
    <button class="btn y" data-a="collect" ${st<1?'disabled':''}>${t('collect')}</button>
    <div class="up"><div class="uph">${t('upgrade')} → ${t('lvl')} ${L} <small>⏱${ftime(bTime(b.type,L))}</small></div>${block?`<div class="warn">🔒 ${block}</div>`:`<div class="bc">${costStr(c)}</div>`}
    <button class="btn g" data-a="up" ${block?'disabled':''}>⬆ ${t('upgrade')}</button></div>`; }
  body+=`</div></div><div class="slh">👑 ${t('slots')} <small>(${t('bonus')})</small></div><div class="slots">${slots}</div>`;
  openModal('bld',{title:`${bname(b.type)} · ${t('lvl')} ${b.lvl}`,body},'mid');
  on('[data-a=speed]',()=>speedUp(b)); on('[data-a=collect]',()=>{ collect(b); updHUD(); draw(); }); on('[data-a=up]',()=>startUpgrade(b));
  on('.slot:not(.lk)',el=>pickHero(b,draw));
  modalTick=()=>{ const tm2=$('.tm'); if(b.bt&&tm2){ const rem=(b.bt.end-now())/1000; tm2.textContent='⏱ '+ftime(rem); $('.pbar i').style.width=(100*(1-rem*1000/b.bt.total))+'%'; } else if(b._wasBt&&!b.bt) draw(); b._wasBt=!!b.bt; };
  b._wasBt=!!b.bt; };
 draw(); }
function pickHero(b,back){ const list=owned().map(h=>{ const s=S.h[h.k], here=s.at===b.id; const ob=s.at!=null&&!here?S.b.find(x=>x.id===s.at):null;
  return `<div class="hpick${here?' on':''}" data-k="${h.k}"><img src="${faceImg(h.k)}"><div><b>${hname(h.k)}</b><small>${RI[h.res==='all'?'charm':h.res]} +${Math.round(heroInB(h.k,b))}% ${ob?'· '+bname(ob.type):here?'✓':''}</small></div></div>`; }).join('');
 openModal('pick',{title:t('assign_to'),body:`<div class="hplist">${list}</div>`},'mid');
 on('.hpick',el=>{ const k=el.dataset.k; if(S.h[k].at===b.id) assign(k,null); else { assign(k,b.id); questEvent('assign',null,0); } updVillage(); back(); }); }

// ---------- heroines ----------
function stars(n,max=5){ let s=''; for(let i=1;i<=max;i++) s+=`<i class="${i<=n?'on':'off'}">★</i>`; return `<span class="stars">${s}</span>`; }
function recText(h){ const r=h.rec; if(!r) return ''; if(r.t==='hall') return '🏛️ '+t('needhall',{n:r.v}); return RI[r.t]+' '+fmt(r.v); }
function openHeroes(){ const cards=HER.map(h=>{ const s=S.h[h.k];
  if(!s) return `<div class="hcard no" data-k="${h.k}"><img src="${faceImg(h.k)}"><div class="hn">${hname(h.k)}</div><div class="hr">🔒 ${recText(h)}</div></div>`;
  const b=s.at!=null?S.b.find(x=>x.id===s.at):null; const ready=s.xp>=xpNeed(s.lvl)&&s.lvl<heroCap(h.k);
  return `<div class="hcard" data-k="${h.k}" style="--c:${h.c}"><img src="${faceImg(h.k)}">${ready?'<i class="dot2">⬆</i>':''}<div class="hn">${hname(h.k)}</div><div class="hl">${t('lvl')} ${s.lvl} ${stars(s.stars)}</div><div class="hr">${b?'🏠 '+bname(b.type):'· '+t('not_assigned')}</div></div>`; }).join('');
 openModal('heroes',{title:`👑 ${t('heroes')} <small>${t('owned_n',{n:owned().length+'/'+HER.length})}</small>`,
  body:`<div class="hbar"><button class="btn o sm" data-a="tav">🍹 ${t('tavern')}</button><button class="btn b sm" data-a="team">🤝 ${t('team')}</button><span class="chip">💖 ${charm()} · ${t('happiness')} +${happiness().toFixed(1)}%</span></div><div class="hgrid">${cards}</div>`},'full');
 on('.hcard:not(.no)',el=>openProfile(el.dataset.k)); on('.hcard.no',()=>openTavern()); on('[data-a=tav]',()=>openTavern()); on('[data-a=team]',()=>openTeam()); }
function openProfile(k){ sfx('open'); const h=H(k);
 const draw=()=>{ const s=S.h[k], need=xpNeed(s.lvl), c=lvlCost(k), cap=heroCap(k); const b=s.at!=null?S.b.find(x=>x.id===s.at):null;
  const canLv=s.xp>=need&&s.lvl<cap; const tc={food:Math.ceil(15*Math.pow(1.12,s.lvl))};
  const syn=SYNERGY.filter(p=>p.includes(k)).map(p=>p[0]===k?p[1]:p[0]);
  const body=`<div class="prof" style="--c:${h.c}"><div class="pimg"><img id="pimg"><div class="pname">${hname(k)}</div><div class="prole">${t('ro_'+k)}</div></div><div class="pinfo">
   <div class="row">${stars(s.stars)} <span class="chip">${t('lvl')} ${s.lvl}${cap<Infinity?'/'+cap:''}</span></div>
   <div class="xpb"><i style="width:${Math.min(100,100*s.xp/need)}%"></i><span>${t('xp')} ${fmt(s.xp)}/${fmt(need)}</span></div>
   <div class="stat">${t('bonus')}: <b>${RI[h.res==='all'?'charm':h.res]} +${Math.round(heroBonus(k))}%</b> ${h.res==='all'?'('+t('r_all')+')':t('r_'+h.res)}</div>
   ${h.perk?`<div class="stat">${t('perk')}: <b>${t('p_'+h.perk,{v:Math.round(h.pv*(1+0.03*(s.lvl-1))*Math.pow(1.15,s.stars-1))})}</b></div>`:''}
   ${syn.length?`<div class="stat">${t('sync')}: ${syn.map(x=>`<img class="mini" src="${faceImg(x)}">`).join('')} +5%</div>`:''}
   <div class="stat">${b?t('in_bld')+': <b>'+bname(b.type)+'</b>':t('not_assigned')} <button class="btn b xs" data-a="as">${t('assign')}</button></div>
   <div class="btns"><button class="btn g" data-a="lv" ${canLv&&hasRes(c)?'':'disabled'}>⬆ ${t('lvlup')}<small>${costStr(c)}</small></button>
   <button class="btn o" data-a="tr">${t('train')}<small>${costStr(tc)} → +${fmt(Math.ceil(need/4))}${RI.xp}</small></button>
   ${s.stars<5?`<button class="btn p" data-a="st" ${S.r.shards>=STARN[s.stars-1]?'':'disabled'}>${t('starup')}<small>${t('star_need',{a:fmt(S.r.shards),b:STARN[s.stars-1]})}</small></button>`:''}
   <button class="btn pk" data-a="wd">👗 ${t('wardrobe')}</button></div>
   <div class="skh">${t('skills')} · <b>${s.sp}</b> ${t('sp')}</div>
   ${['res','build','charm'].map(br=>`<div class="sk"><span>${br==='res'?'⛏️':br==='build'?'🔨':'💖'} ${t('br_'+br)}</span><div class="pips">${[...Array(10)].map((_,i)=>`<i class="${i<s.sk[br]?'on':''}"></i>`).join('')}</div><button class="btn g xs" data-br="${br}" ${s.sp>0&&s.sk[br]<10?'':'disabled'}>+</button></div>`).join('')}
  </div></div>`;
  openModal('heroes',{title:hname(k),body},'full'); setHeroImg($('#pimg'),k);
  on('[data-a=lv]',()=>{ heroLevelUp(k); draw(); }); on('[data-a=tr]',()=>{ heroTrain(k); draw(); }); on('[data-a=st]',()=>{ heroStar(k); draw(); });
  on('[data-a=wd]',()=>openWardrobe(k)); on('[data-a=as]',()=>assignFromHero(k,draw));
  on('[data-br]',el=>{ const br=el.dataset.br; if(s.sp>0&&s.sk[br]<10){ s.sp--; s.sk[br]++; sfx('sparkle'); save(); draw(); } }); };
 draw(); }
function assignFromHero(k,back){ const bs=S.b.filter(b=>b.lvl>0);
 const list=`<div class="hpick" data-id="-1"><div class="ico">🚫</div><div><b>${t('remove')}</b></div></div>`+bs.map(b=>{ const tm=teamOf(b); return `<div class="hpick${S.h[k].at===b.id?' on':''}" data-id="${b.id}"><img src="${bimg(b.type,tier(b))}" class="bimg"><div><b>${bname(b.type)} ${t('lvl')} ${b.lvl}</b><small>+${Math.round(heroInB(k,b))}% · ${tm.length}/${slotsOf(b)}</small></div></div>`; }).join('');
 openModal('pick',{title:t('assign_to'),body:`<div class="hplist">${list}</div>`},'mid');
 on('.hpick',el=>{ const id=+el.dataset.id; assign(k,id<0?null:id); updVillage(); back(); }); }
function openTeam(){ const bs=S.b.filter(b=>b.lvl>0);
 const rows=bs.map(b=>{ const tm=teamOf(b), sl=slotsOf(b); return `<div class="trow" data-id="${b.id}"><img class="bimg" src="${bimg(b.type,tier(b))}"><div class="tn"><b>${bname(b.type)} ${t('lvl')} ${b.lvl}</b><small>${RI[BLD[b.type].res]} +${Math.round(bonusOf(b))}%</small></div><div class="tf">${[...Array(sl)].map((_,i)=>tm[i]?`<img src="${faceImg(tm[i])}">`:'<span>＋</span>').join('')}</div></div>`; }).join('');
 openModal('heroes',{title:'🤝 '+t('team'),body:`<button class="btn g" data-a="auto">${t('auto')}</button><div class="tlist">${rows}</div>`},'full');
 on('[data-a=auto]',()=>{ autoAssign(); updVillage(); openTeam(); }); on('.trow',el=>{ const b=S.b.find(x=>x.id==el.dataset.id); pickHero(b,()=>openTeam()); }); }

// ---------- tavern ----------
function openTavern(){ sfx('open'); const tav=S.b.find(b=>b.type==='tavern'&&b.lvl>0);
 const draw=()=>{ const left=S.tfree-now();
  const cards=HER.filter(h=>h.rec).map(h=>{ const s=S.h[h.k], r=h.rec; let ok=!s&&tav;
   if(r.t==='hall') ok=ok&&hallLvl()>=r.v; else ok=ok&&(S.r[r.t]||0)>=r.v;
   return `<div class="tcard${s?' got':''}" style="--c:${h.c}"><img src="a/h/${h.k}.webp"><div class="tci"><b>${hname(h.k)}</b><small>${t('ro_'+h.k)}</small>
    ${s?`<div class="chip">✓ ${t('recruited')}</div>`:`<button class="btn ${ok?'g':'gr'}" data-k="${h.k}" ${ok?'':'disabled'}>${t('recruit')} · ${r.t==='hall'?'🏛️'+r.v:RI[r.t]+fmt(r.v)}</button>`}</div></div>`; }).join('');
  openModal('heroes',{title:'🍹 '+t('tavern')+` <small>${RI.tickets} ${S.r.tickets}</small>`,body:`<div class="tavtop">${!tav?`<div class="warn">🔒 ${t('needtav')}</div>`:
   left>0?`<div class="chip big" id="tft">${t('freeticket')} ${ftime(left/1000)}</div>`:`<button class="btn y" data-a="free">${t('getfree')}</button>`}</div><div class="tgrid">${cards}</div>`},'full tav');
  on('[data-a=free]',()=>{ S.r.tickets++; S.tfree=now()+12*3600e3; sfx('buy'); save(); draw(); });
  on('[data-k]',el=>{ const h=H(el.dataset.k), r=h.rec; if(r.t!=='hall') S.r[r.t]-=r.v; newHero(h.k); sfx('levelup'); vib(30); save();
   celebrate('💃 '+t('recruited'),hname(h.k),t('ro_'+h.k),faceImg(h.k)); draw(); });
  modalTick=()=>{ const e=$('#tft'); if(e){ const l=S.tfree-now(); if(l<=0) draw(); else e.textContent=t('freeticket')+' '+ftime(l/1000); } }; };
 draw(); }

// ---------- wardrobe ----------
let wdHero=null;
function openWardrobe(k){ sfx('open'); wdHero=k||wdHero||S.leader; if(!S.h[wdHero]) wdHero=S.leader;
 const bout=S.b.find(b=>b.type==='boutique'&&b.lvl>0);
 const draw=()=>{ const k=wdHero, s=S.h[k], cur=outfitOf(k);
  const heads=owned().map(h=>`<img class="wh${h.k===k?' on':''}" data-h="${h.k}" src="${faceImg(h.k)}">`).join('');
  const outs=OUT[k].map(o=>{ const own=s.owned.includes(o.id); const p=o.p; let pr='';
   if(!own){ if(p.hall) pr=hallLvl()>=p.hall?t('free'):'🏛️'+p.hall; else pr=costStr(p); }
   return `<div class="oc${o.id===s.o?' on':''}${own?'':' lk'}" data-o="${o.id}"><div class="ot"><img src="${o.img}"></div><b>${t('o_'+o.id)}</b><small>💖${o.ch} ${own?(o.id===s.o?'✓ '+t('worn'):t('owned')):pr}</small></div>`; }).join('');
  const canColor=cur.m&&MASKH[cur.m]!=null; const ch=s.hue[cur.id];
  const sw=HUES.map(hu=>hu==null?`<div class="sw orig${ch==null?' on':''}" data-hu="x">${t('orig')}</div>`:`<div class="sw${ch===hu?' on':''}" data-hu="${hu}" style="background:radial-gradient(circle at 35% 30%,#fff8 0 12%,transparent 30%),hsl(${hu},85%,48%)"></div>`).join('');
  openModal('wardrobe',{title:'👗 '+t('wardrobe')+` <small>💖 ${charm()}</small>`,body:`<div class="wd"><div class="wheads">${heads}</div><div class="wmain"><div class="wimg"><img id="wimg"><div class="pname">${hname(k)}</div></div>
   <div class="wside"><div class="slh">${t('outfits')}</div><div class="ogrid">${outs}</div>${!bout?`<div class="warn sm">🔒 ${t('needbout')}</div>`:''}
   <div class="slh">${t('colors')}</div>${canColor?`<div class="sws">${sw}</div>`:`<div class="warn sm">${t('nocolor')}</div>`}</div></div></div>`},'full wdm');
  setHeroImg($('#wimg'),k);
  on('.wh',el=>{ wdHero=el.dataset.h; sfx('tap'); draw(); });
  on('.oc',el=>{ const o=OUT[k].find(x=>x.id===el.dataset.o);
   if(s.owned.includes(o.id)){ s.o=o.id; sfx('sparkle'); save(); draw(); return; }
   if(o.p.hall){ if(hallLvl()<o.p.hall){ toast(t('needhall',{n:o.p.hall}),'bad'); sfx('error'); return; } }
   else { if(!bout){ toast(t('needbout'),'bad'); sfx('error'); return; } if(!hasRes(o.p)){ toast(t('nores'),'bad'); sfx('error'); return; } pay(o.p); }
   s.owned.push(o.id); s.o=o.id; questEvent('outfit',null,1); sfx('buy'); vib(20); save(); updHUD(); draw(); });
  on('.sw',el=>{ const v=el.dataset.hu; if(v==='x') delete s.hue[cur.id]; else { s.hue[cur.id]=+v; questEvent('color',null,1); } sfx('sparkle'); save(); draw(); }); };
 draw(); }

// ---------- map ----------
function openMap(sel){ sfx('open');
 const draw=(sel)=>{ const tw=S.b.find(b=>b.type==='tower'); const allDone=REG.every(r=>S.reg[r.k]);
  const mk=REG.map(r=>{ const st=regState(r); return `<div class="mk ${st}${sel===r.k?' sel':''}" data-k="${r.k}" style="left:${r.x}%;top:${r.y}%"><span>${st==='done'?'🚩':st==='going'?'⛵':st==='open'?'❗':'🔒'}</span><b>${t('g_reg_'+r.k)}</b></div>`; }).join('')
   + (allDone?`<div class="mk ${S.exp&&S.exp.k==='far'?'going':'open'}${sel==='far'?' sel':''}" data-k="far" style="left:94%;top:20%"><span>🌀</span><b>${t('endless')} #${S.far+1}</b></div>`:'');
  let info='';
  if(sel){ const r=sel==='far'?farReg():REG.find(x=>x.k===sel); const st=sel==='far'?(S.exp&&S.exp.k==='far'?'going':'open'):regState(r);
   const nm=sel==='far'?t('endless')+' #'+(S.far+1):t('g_reg_'+sel);
   info=`<div class="minfo"><b>${nm}</b>`;
   if(sel==='home') info+=`<div>🏝️ ${t('village')}</div>`;
   else if(st==='done') info+=`<div class="chip">✓ ${t('explored')} · ${r.bon==='all'?'💫':RI[r.bon]} +5%</div>`;
   else if(st==='going'){ info+=`<div class="pbar"><i id="mpb"></i></div><div id="mtm" class="tm"></div><button class="btn p" data-a="spd">⚡ ${t('speed')} <span id="msc"></span></button>`; }
   else { info+=`<div>${t('reward')}: ${rwStr(r.rw)}${sel!=='far'?' · '+t('plots'):''}${r.bon?' · '+(r.bon==='all'?'💫':RI[r.bon])+'+5%':''}</div><div>${RI.food} ${fmt(r.food)} · ⏱ ${ftime(expTime(r))} · 🗼${r.tw}</div>`+
     (st==='locked'?`<div class="warn">🔒 ${t('needtower',{n:r.tw})}</div>`:`<button class="btn g" data-a="go" ${S.exp?'disabled':''}>⛵ ${t('explore')}</button>`); }
   info+='</div>'; }
  openModal('map',{title:`🗺️ ${t('map')} <small>🗼${tw?tw.lvl:0} · ${exploredCount()}/${REG.length-1}</small>`,body:`<div class="mapv"><div class="mapi"><img src="a/ui/map.webp">${mk}</div></div>${info}`},'full mapm');
  on('.mk',el=>{ sfx('tap'); draw(el.dataset.k); });
  on('[data-a=go]',()=>startExp(sel==='far'?farReg():REG.find(x=>x.k===sel)));
  on('[data-a=spd]',()=>{ const c=Math.ceil((S.exp.end-now())/120000); if(S.r.gems<c){ toast(t('nores'),'bad'); sfx('error'); return; } S.r.gems-=c; S.exp.end=now(); tick(); draw(sel); });
  const mv=$('.mapv'); if(mv&&sel==null&&!mv._s){ mv.scrollLeft=0; }
  modalTick=()=>{ if(S.exp&&$('#mtm')){ const rem=(S.exp.end-now())/1000; $('#mtm').textContent='⏱ '+ftime(rem); $('#mpb').style.width=(100*(1-rem*1000/S.exp.total))+'%'; $('#msc').textContent=rem<30?t('free'):RI.gems+Math.ceil(rem/120); }
   else if(!S.exp&&$('#mtm')) draw(sel); }; modalTick(); };
 draw(sel); }

// ---------- shop ----------
function openShop(){ sfx('open'); const draw=()=>{ const items=SHOP.map(it=>{ let btn;
   if(it.id==='gift'){ const l=S.gift-now(); btn=l>0?`<button class="btn gr" disabled id="gft">⏱ ${ftime(l/1000)}</button>`:`<button class="btn y" data-id="gift">🎁 ${t('free')}</button>`; }
   else if(it.once&&S.builders>=2) btn=`<button class="btn gr" disabled>✓</button>`;
   else btn=`<button class="btn ${hasRes(it.price)?'g':'gr'}" data-id="${it.id}">${costStr(it.price)}</button>`;
   const ic=it.id==='builder'?'👷‍♀️':it.id==='gift'?'🎁':RI[Object.keys(it.give)[0]];
   return `<div class="scard${it.id==='gift'?' gift':''}"><div class="si">${ic}</div><b>${t('s_'+it.id)}</b><small>${it.id==='builder'?'🔨+1':rwStr(it.give)}</small>${btn}</div>`; }).join('');
  openModal('shop',{title:'🛍️ '+t('shop'),body:`<div class="note">💝 ${t('shopnote')}</div><div class="sgrid">${items}</div>`},'full');
  on('[data-id]',el=>{ const it=SHOP.find(x=>x.id===el.dataset.id);
   if(it.id==='gift'){ if(now()<S.gift) return; give(it.give); S.gift=now()+it.free; }
   else { if(!hasRes(it.price)){ toast(t('nores'),'bad'); sfx('error'); return; } pay(it.price); give(it.give); }
   sfx('buy'); vib(15); toast('✓ '+t('s_'+it.id),'good'); updHUD(); save(); draw(); });
  modalTick=()=>{ const e=$('#gft'); if(e){ const l=S.gift-now(); if(l<=0) draw(); else e.textContent='⏱ '+ftime(l/1000); } }; };
 draw(); }

// ---------- quests ----------
function openQuests(){ const q=curQuest(), [v,n]=questProg(q), done=v>=n;
 const next=[1,2,3].map(i=>{ const qq=S.q+i<QUESTS.length?QUESTS[S.q+i]:genQuest(S.q+i); return `<div class="qrow dim">🔒 ${questText(qq)} <small>${rwStr(qq.r)}</small></div>`; }).join('');
 openModal('quests',{title:`📜 ${t('quests')} <small>#${S.q+1}</small>`,body:`<div class="qmain${done?' done':''}"><img src="${faceImg(S.leader)}"><div><b>${questText(q)}</b><div class="qbar"><i style="width:${100*v/n}%"></i></div><small>${fmt(v)}/${fmt(n)}</small>
  <div>${t('reward')}: ${rwStr(q.r)}</div>${done?`<button class="btn g" data-a="cl">🏆 ${t('claim')}</button>`:''}</div></div>${next}<div class="note">✅ ${S.q} · ${t('hint_offline')}</div>`},'full');
 on('[data-a=cl]',()=>claimQuest()); }

// ---------- settings ----------
function openSettings(){ sfx('open'); const draw=()=>{
 openModal('settings',{title:'⚙️ '+t('settings'),body:`<div class="set"><div class="slh">${t('lang')}</div><div class="langs">${[['ru','🇷🇺 Русский'],['en','🇬🇧 English'],['he','🇮🇱 עברית']].map(([l,n])=>`<button class="btn ${S.lang===l?'p':'gr'}" data-l="${l}">${n}</button>`).join('')}</div>
  <label class="sl">🎵 ${t('settings_music')} <input type="range" min="0" max="100" value="${Math.round(S.mv*100)}" id="smv"></label>
  <label class="sl">🔊 ${t('settings_sfx')} <input type="range" min="0" max="100" value="${Math.round(S.sv*100)}" id="ssv"></label>
  <label class="sl tg">📳 ${t('vib')} <input type="checkbox" id="svb" ${S.vib?'checked':''}></label>
  <div class="note">${t('hint_offline')}<br>${t('version')} ${VERSION}</div>
  <button class="btn r" data-a="reset">🗑️ ${t('reset')}</button></div>`},'mid');
 on('[data-l]',el=>{ setLang(el.dataset.l); draw(); });
 $('#smv').oninput=e=>{ S.mv=e.target.value/100; Audio2.setVol(S.mv,S.sv); }; $('#ssv').oninput=e=>{ S.sv=e.target.value/100; Audio2.setVol(S.mv,S.sv); };
 $('#ssv').onchange=()=>{ sfx('coin'); save(); }; $('#smv').onchange=()=>save(); $('#svb').onchange=e=>{ S.vib=e.target.checked; vib(20); save(); };
 on('[data-a=reset]',()=>{ openModal('settings',{title:t('reset'),body:`<div class="set"><p>${t('resetq')}</p><div class="langs"><button class="btn r" data-a="y">${t('yes')}</button><button class="btn gr" data-a="n">${t('no')}</button></div></div>`},'mid');
  on('[data-a=y]',()=>{ localStorage.removeItem(SAVE_KEY); S=null; location.reload(); }); on('[data-a=n]',()=>draw()); }); };
 draw(); }
function setLang(l){ S.lang=l; document.documentElement.lang=l; document.documentElement.dir=l==='he'?'rtl':'ltr'; document.title=t('title'); buildNav(); buildHUD(); updHUD(); $('#qtrack')._h=''; updQuest(); save(); }

// ---------- intro ----------
function showIntro(){ const el=$('#intro'); el.style.display='flex';
 const splash=()=>{ el.className='intro splash'; el.innerHTML=`<div class="sun"></div><img class="logo" src="icon-512.png"><h1>${t('title')}</h1>
  <div class="langs">${[['ru','RU'],['en','EN'],['he','HE']].map(([l,n])=>`<button class="btn ${S.lang===l?'y':'gr'}" data-l="${l}">${n}</button>`).join('')}</div><div class="tapgo">${t('tap')}</div>`;
  on('[data-l]',b=>{ S.lang=b.dataset.l; document.documentElement.dir=S.lang==='he'?'rtl':'ltr'; document.documentElement.lang=S.lang; sfx('tap'); splash(); },el);
  el.onclick=()=>{ Audio2.unlock(); Audio2.setVol(S.mv,S.sv); sfx('whoosh'); story(); }; };
 const story=()=>{ el.className='intro story'; el.onclick=null; el.innerHTML=`<div class="sbg" style="background-image:url(a/ui/intro.webp)"></div><div class="stxt"><p>${t('story1')}</p><p>${t('story2')}</p><button class="btn g big" id="sgo">${t('choose')} ➜</button></div>`;
  on('#sgo',()=>{ sfx('open'); pick(0); },el); };
 const pick=(i)=>{ const k=STARTERS[i], h=H(k); el.className='intro pick'; el.style.setProperty('--c',h.c);
  el.innerHTML=`<div class="pk"><button class="arr" data-d="-1">‹</button><div class="pkc"><img src="a/h/${k}.webp"><div class="pkn">${hname(k)}</div><div class="pkr">${t('ro_'+k)}</div>
   <div class="pkb">${RI[h.res]} +${h.base}% ${t('r_'+h.res)}${h.perk?' · '+t('p_'+h.perk,{v:h.pv}):''}</div></div><button class="arr" data-d="1">›</button></div>
   <div class="dots">${STARTERS.map((_,j)=>`<i class="${j===i?'on':''}"></i>`).join('')}</div><button class="btn g big" id="pgo">✓ ${t('choose')}: ${hname(k)}</button>`;
  on('.arr',b=>{ sfx('tap'); pick((i+ +b.dataset.d+STARTERS.length)%STARTERS.length); },el);
  let sx=null; el.ontouchstart=e=>{ sx=e.touches[0].clientX; }; el.ontouchend=e=>{ if(sx==null) return; const dx=e.changedTouches[0].clientX-sx; sx=null; if(Math.abs(dx)>50){ sfx('tap'); pick((i+(dx<0?1:-1)+STARTERS.length)%STARTERS.length); } };
  on('#pgo',()=>startGame(k),el); };
 splash(); }
function startGame(k){ S.leader=k; newHero(k); S.started=true; S.tfree=now(); S.gift=now()+600e3;
 S.b.push({id:S.nid++,type:'hall',lvl:1,plot:0,t0:now(),bt:null}); S.h[k].at=S.b[0].id;
 $('#intro').style.display='none'; $('#intro').innerHTML=''; sfx('done'); save(); enterGame();
 setTimeout(()=>tutor(t('tut1',{h:hname(k)})),600); }
function tutor(msg){ const d=$('#tutor'); d.innerHTML=`<img src="${faceImg(S.leader)}"><div class="tb">${msg}</div>`; d.style.display='flex'; d.onclick=()=>{ d.style.display='none'; sfx('tap'); }; }
function enterGame(){ document.documentElement.dir=S.lang==='he'?'rtl':'ltr'; document.documentElement.lang=S.lang; document.title=t('title');
 Audio2.era=eraOf(hallLvl()); buildHUD(); buildNav(); renderVillage(); updHUD(); updQuest(); centerView();
 if(!S.seenTut2&&S.b.some(b=>b.type!=='hall'&&b.lvl>0)){ } }
function centerView(){ const v=$('#view'), w=$('#world'); const p=PLOTS[0]; const sc=parseFloat(getComputedStyle(w).getPropertyValue('--z'))||1;
 v.scrollLeft=p[0]*sc-v.clientWidth/2; v.scrollTop=p[1]*sc-v.clientHeight/2-20; }

// ---------- boot ----------
function boot(){ S=load(); if(!S) S=newState((navigator.language||'ru').slice(0,2)==='he'?'he':(navigator.language||'').startsWith('en')?'en':'ru');
 Audio2.mv=S.mv; Audio2.sv=S.sv;
 $('#qtrack').onclick=e=>{ if(e.target.id!=='qclaim'){ sfx('open'); openQuests(); } };
 if(S.started){ offlineCatchup(); enterGame(); } else showIntro();
 setInterval(tick,1000);
 const unlock=()=>{ Audio2.unlock(); Audio2.setVol(S.mv,S.sv); };
 document.addEventListener('touchend',unlock,{passive:true}); document.addEventListener('click',unlock);
 document.addEventListener('visibilitychange',()=>{ if(document.hidden){ save(); Audio2.suspend(); } else { Audio2.resume(); if(S.started){ offlineCatchup(); renderVillage(); } } });
 window.addEventListener('pagehide',save);
 document.addEventListener('gesturestart',e=>e.preventDefault()); document.addEventListener('dblclick',e=>e.preventDefault());
 window.addEventListener('resize',()=>{ });
 if('serviceWorker' in navigator && location.protocol!=='file:') navigator.serviceWorker.register('sw.js').catch(()=>{});
 window.__S=()=>S; }
window.addEventListener('DOMContentLoaded',boot);
