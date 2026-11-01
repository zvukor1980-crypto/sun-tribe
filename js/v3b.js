// Sun Tribe v3 — Phase 2: day/night + weather, photo studio + album, weekly runway show.
'use strict';
addL({
 ru:{v3_dn:'Смена дня и ночи',v3_dn_fast:'Быстро',v3_dn_real:'По часам',v3_dn_off:'Выкл',v3_wx:'Погода',
  wx_clear:'Ясно',wx_cloud:'Облачно',wx_rain:'Дождь',wx_storm:'Гроза',wx_petals:'Лепестковый ветер',wx_night:'Ночь',
  wxb_rain:'+20% еды и дерева',wxb_storm:'+30% еды и дерева, +10% камня',wxb_petals:'+1 🌸 за каждый сбор',wxb_night:'+15% монет',wxb_clear:'Отличный день!',wxb_cloud:'Спокойная погода',
  studio:'Фотостудия',album:'Альбом',st_bg:'Фон',st_pose:'Поза',st_filter:'Фильтр',st_stk:'Стикеры',st_snap:'Снять!',st_hint:'Тема фона',st_match:'Совпадение темы! ⭐⭐',
  st_saved:'Фото сохранено в альбом',st_rew:'Фото дня: {r}',st_left:'Наград за фото сегодня: {n}/3',st_full:'Альбом полон — удали старые фото',st_empty:'Альбом пуст. Сделай первое фото в студии! 📸',
  st_del:'Удалить',st_share:'Поделиться',st_dl:'Сохранить',st_stars:'Оценка',st_tapstk:'Тяни стикер — двигать, тап — убрать',
  f_none:'Обычный',f_glam:'Гламур',f_neon:'Неон',f_noir:'Нуар',f_vint:'Винтаж',f_sun:'Закат',
  runway:'Подиум',rw_week:'Показ недели',rw_theme:'Тема',rw_ends:'До нового показа: {t}',rw_tries:'Попыток: {n}',rw_pick:'Выбери до 3 моделей',rw_start:'Начать показ 👠',
  rw_more:'Ещё попытка за 🎟️1',rw_style:'Стиль',rw_res:'Итоги показа',rw_you:'Твоё племя',rw_gold:'Золото!',rw_silver:'Серебро!',rw_bronze:'Бронза!',rw_none:'Без медали',
  rw_rew:'Награда: {r}',rw_best:'Лучший результат недели',rw_cons:'Утешительный приз: {r}',rw_skip:'Пропустить ⏩',rw_medals:'Медали',rw_tip:'Наряды в тему недели дают огромный бонус!',
  rw_r1:'Лунные Лисы',rw_r2:'Коралловые Кошки',rw_r3:'Звёздные Пантеры',rw_back:'Назад',rw_again:'Ещё раз',rw_noher:'Нужна хотя бы одна героиня'},
 en:{v3_dn:'Day & night',v3_dn_fast:'Fast',v3_dn_real:'Real clock',v3_dn_off:'Off',v3_wx:'Weather',
  wx_clear:'Clear',wx_cloud:'Cloudy',wx_rain:'Rain',wx_storm:'Storm',wx_petals:'Petal breeze',wx_night:'Night',
  wxb_rain:'+20% food & wood',wxb_storm:'+30% food & wood, +10% stone',wxb_petals:'+1 🌸 per collect',wxb_night:'+15% coins',wxb_clear:'A lovely day!',wxb_cloud:'Calm weather',
  studio:'Photo studio',album:'Album',st_bg:'Backdrop',st_pose:'Pose',st_filter:'Filter',st_stk:'Stickers',st_snap:'Snap!',st_hint:'Backdrop theme',st_match:'Theme match! ⭐⭐',
  st_saved:'Photo saved to album',st_rew:'Photo of the day: {r}',st_left:'Photo rewards today: {n}/3',st_full:'Album is full — delete old photos',st_empty:'Album is empty. Take your first photo in the studio! 📸',
  st_del:'Delete',st_share:'Share',st_dl:'Save',st_stars:'Rating',st_tapstk:'Drag a sticker to move, tap to remove',
  f_none:'Normal',f_glam:'Glam',f_neon:'Neon',f_noir:'Noir',f_vint:'Vintage',f_sun:'Sunset',
  runway:'Runway',rw_week:'Show of the week',rw_theme:'Theme',rw_ends:'Next show in: {t}',rw_tries:'Tries: {n}',rw_pick:'Pick up to 3 models',rw_start:'Start the show 👠',
  rw_more:'One more try for 🎟️1',rw_style:'Style',rw_res:'Show results',rw_you:'Your tribe',rw_gold:'Gold!',rw_silver:'Silver!',rw_bronze:'Bronze!',rw_none:'No medal',
  rw_rew:'Reward: {r}',rw_best:'Best result this week',rw_cons:'Consolation prize: {r}',rw_skip:'Skip ⏩',rw_medals:'Medals',rw_tip:'Outfits matching the weekly theme give a huge bonus!',
  rw_r1:'Moon Foxes',rw_r2:'Coral Cats',rw_r3:'Star Panthers',rw_back:'Back',rw_again:'Again',rw_noher:'You need at least one heroine'},
 he:{v3_dn:'יום ולילה',v3_dn_fast:'מהיר',v3_dn_real:'לפי השעון',v3_dn_off:'כבוי',v3_wx:'מזג אוויר',
  wx_clear:'בהיר',wx_cloud:'מעונן',wx_rain:'גשם',wx_storm:'סערה',wx_petals:'רוח עלי כותרת',wx_night:'לילה',
  wxb_rain:'+20% מזון ועץ',wxb_storm:'+30% מזון ועץ, +10% אבן',wxb_petals:'+1 🌸 לכל איסוף',wxb_night:'+15% מטבעות',wxb_clear:'יום נהדר!',wxb_cloud:'מזג אוויר רגוע',
  studio:'סטודיו צילום',album:'אלבום',st_bg:'רקע',st_pose:'פוזה',st_filter:'פילטר',st_stk:'מדבקות',st_snap:'צלמי!',st_hint:'נושא הרקע',st_match:'התאמת נושא! ⭐⭐',
  st_saved:'התמונה נשמרה באלבום',st_rew:'תמונת היום: {r}',st_left:'פרסי צילום היום: {n}/3',st_full:'האלבום מלא — מחקי תמונות ישנות',st_empty:'האלבום ריק. צלמי את התמונה הראשונה בסטודיו! 📸',
  st_del:'מחיקה',st_share:'שיתוף',st_dl:'שמירה',st_stars:'דירוג',st_tapstk:'גררי מדבקה להזזה, הקישי להסרה',
  f_none:'רגיל',f_glam:'גלאם',f_neon:'ניאון',f_noir:'נואר',f_vint:'וינטג׳',f_sun:'שקיעה',
  runway:'מסלול',rw_week:'תצוגת השבוע',rw_theme:'נושא',rw_ends:'התצוגה הבאה בעוד: {t}',rw_tries:'ניסיונות: {n}',rw_pick:'בחרי עד 3 דוגמניות',rw_start:'להתחיל תצוגה 👠',
  rw_more:'ניסיון נוסף ב־🎟️1',rw_style:'סטייל',rw_res:'תוצאות התצוגה',rw_you:'השבט שלך',rw_gold:'זהב!',rw_silver:'כסף!',rw_bronze:'ארד!',rw_none:'בלי מדליה',
  rw_rew:'פרס: {r}',rw_best:'התוצאה הטובה של השבוע',rw_cons:'פרס ניחומים: {r}',rw_skip:'דלג ⏩',rw_medals:'מדליות',rw_tip:'תלבושות בנושא השבוע נותנות בונוס ענק!',
  rw_r1:'שועלות הירח',rw_r2:'חתולות האלמוג',rw_r3:'פנתרות הכוכבים',rw_back:'חזרה',rw_again:'שוב',rw_noher:'צריך לפחות גיבורה אחת'}
});
V3.ens.push(n=>{ n.fx=n.fx||{}; if(!n.fx.dn) n.fx.dn='fast'; if(n.fx.wx==null) n.fx.wx=true;
 if(!n.st3) n.st3={bg:'studio',f:'none',pose:0,flip:false,day:0,n:0};
 if(!n.rw) n.rw={wk:-1,tries:0,best:9,g:0,s:0,b:0,pick:[]}; return n; });
if(typeof S!=='undefined'&&S) V3.ens.forEach(f=>f(S));

// ---------- music ----------
Object.assign(TRACKS,{
 studio:{name:'Velvet Flash',bpm:96,key:63,sc:'dor',bar:16,ms:8,swing:.12,chords:[0,3,4,3, 0,5,4,6],
  mel:['4---2-4-6---4---','3-2-0-----------','6-7-6-4-2-4-3---','2-1-0-----------'],
  L:[{i:'epiano',r:'stab',p:'x..x..x...x..x..',v:.16},{i:'vibes',r:'mel',o:12,v:.2},{i:'pad',r:'pad',v:.08},{i:'synbass',r:'bass',p:'x.....x.x.......',v:.32},
     {i:'kick',p:'x.......x..x....',v:.4},{i:'rim',p:'....x.......x...',v:.14},{i:'hat',p:'x.xxx.xxx.xxx.xx',v:.05}]},
 runway:{name:'Catwalk Fever',bpm:124,key:62,sc:'min',bar:16,ms:16,chords:[0,0,5,6, 3,3,4,4],
  mel:['7-7-------6-4---','4-----3-2-------','7-9-7-------6-7-','4---------------'],
  L:[{i:'saw',r:'arp16',v:.09},{i:'pluck',r:'mel',o:12,v:.2},{i:'superpad',r:'pad',v:.08},{i:'synbass',r:'bass',p:'x.x.x.xxx.x.x.xx',v:.36},
     {i:'kick',p:'x...x...x...x...',v:.55},{i:'clap',p:'....x.......x...',v:.24},{i:'hat',p:'..x...x...x...x.',v:.1},{i:'zap',p:'.......x.......x',v:.06}]}});
Object.assign(MUSIC,{studio:'studio',album:'studio',runway:'runway'});
Object.assign(NAVOF,{studio:'village',album:'village',runway:'village'});

// ================= DAY / NIGHT + WEATHER =================
const WXI={clear:'☀️',cloud:'⛅',rain:'🌧️',storm:'⛈️',petals:'🌸'};
const DN={h:12,nf:0,warm:0,wx:'clear',slot:null,lay:null,cv:null,raf:0,drops:[],lastT:0,thAt:0,int:0};
function dnHour(){ const m=S.fx.dn; if(m==='off') return 12; if(m==='real'){ const d=new Date(); return d.getHours()+d.getMinutes()/60; } return (Date.now()/40000)%24; }
function nightF(h){ if(h>=21||h<5) return 1; if(h<7) return 1-(h-5)/2; if(h>=18) return (h-18)/3; return 0; }
function warmF(h){ return Math.max(0,1-Math.abs(h-18.6)/1.7)*.55+Math.max(0,1-Math.abs(h-6)/1.3)*.4; }
function wxSlot(){ return S.fx.dn==='real'?Math.floor(Date.now()/1800000):Math.floor(Date.now()/240000); }
function wxOf(slot){ if(!S.fx.wx) return 'clear'; let x=Math.sin(slot*12.9898+78.233)*43758.5453; x-=Math.floor(x); return x<.46?'clear':x<.64?'cloud':x<.82?'rain':x<.9?'storm':'petals'; }
function isNight(){ return DN.nf>=.6; }
V3.eraIcon=()=>{ if(!S||!S.started) return ''; const w=DN.wx; return (w==='clear'?(isNight()?'🌙':'☀️'):WXI[w])+(isNight()&&w!=='clear'?'🌙':''); };
function wxBonus(res){ let m=0; const w=DN.wx; if(w==='rain'&&(res==='food'||res==='wood')) m+=.2; if(w==='storm'){ if(res==='food'||res==='wood') m+=.3; if(res==='stone') m+=.1; } if(isNight()&&res==='coins') m+=.15; return m; }
{ const _c=collect; collect=function(b,silent,fly){ const n=_c(b,silent,fly); if(n>0&&S&&S.started){ const res=BLD[b.type].res, m=wxBonus(res); let ex=Math.floor(n*m);
   if(ex>0){ S.r[res]+=ex; setTimeout(()=>floatAt(b,(DN.wx==='clear'||!m?'🌙':WXI[DN.wx])+' +'+fmt(ex)),260); }
   if(DN.wx==='petals'){ S.r.petals=(S.r.petals||0)+1; S.stats.petals++; } } return n; }; }

function dnLayers(){ const w=$('#world'), v=$('#view'); if(!w||!v) return; if(DN.lay&&DN.lay.n.isConnected) return;
 const mk=(cls,par)=>{ const d=document.createElement('div'); d.className=cls; par.appendChild(d); return d; };
 DN.lay={n:mk('dn3 dn3n',w),w:mk('dn3 dn3w',w),cl:mk('cl3',w),lt:mk('lt3',w),fx:mk('wx3',v),fl:mk('fl3',v)};
 DN.lay.cl.innerHTML='<i></i><i></i><i></i>';
 let p=''; for(let i=0;i<14;i++) p+=`<i style="left:${(Math.random()*100).toFixed(1)}%;animation-delay:-${(Math.random()*9).toFixed(1)}s;animation-duration:${(7+Math.random()*5).toFixed(1)}s">${i%3?'🌸':'🌺'}</i>`;
 DN.lay.fx.innerHTML='<canvas class="rain3"></canvas><div class="pt3">'+p+'</div>'; DN.cv=DN.lay.fx.querySelector('canvas');
 dnLights(); }
function dnLights(){ if(!DN.lay) return; let h=''; S.b.forEach(b=>{ if(b.lvl<1) return; const p=PLOTS[b.plot]; if(!p) return; h+=`<i class="gl3" style="left:${p[0]}px;top:${p[1]-58}px"></i>`; });
 S.decor.forEach(dc=>{ if(!/lantern|crystal|neon|torch|lamp/.test(dc.k)) return; const p=DECOR_SPOTS[dc.s]; if(p) h+=`<i class="gl3 sm" style="left:${p[0]}px;top:${p[1]-40}px"></i>`; });
 const xs=PLOTS.map(p=>p[0]), ys=PLOTS.map(p=>p[1]), x0=Math.min(...xs), x1=Math.max(...xs), y0=Math.min(...ys), y1=Math.max(...ys);
 for(let i=0;i<12;i++) h+=`<b class="ff3" style="left:${(x0+Math.random()*(x1-x0)).toFixed(0)}px;top:${(y0-60+Math.random()*(y1-y0+60)).toFixed(0)}px;animation-delay:-${(Math.random()*6).toFixed(1)}s"></b>`;
 DN.lay.lt.innerHTML=h; }
V3.afterRender.push(()=>{ dnLayers(); dnLights(); dnUpdate(true); });

function dnUpdate(force){ if(!S||!S.started) return; dnLayers(); if(!DN.lay) return;
 const h=dnHour(), nf=nightF(h), wm=warmF(h); DN.h=h; const wasN=isNight(); DN.nf=nf; DN.warm=wm;
 const slot=wxSlot(); if(slot!==DN.slot){ const old=DN.wx; DN.slot=slot; DN.wx=wxOf(slot); if(!force&&old!==DN.wx) wxAnnounce(); }
 const w=DN.wx, cloudy=w==='cloud'||w==='rain'||w==='storm';
 DN.lay.n.style.opacity=Math.min(.62,nf*.5+(w==='storm'?.2:w==='rain'?.12:w==='cloud'?.05:0)).toFixed(3);
 DN.lay.w.style.opacity=(wm*(cloudy?.16:.32)).toFixed(3);
 DN.lay.lt.style.opacity=Math.max(0,(nf-.25)/.75).toFixed(3);
 const app=$('#app'); ['clear','cloud','rain','storm','petals'].forEach(k=>app.classList.toggle('wx-'+k,k===w)); app.classList.toggle('night3',isNight());
 if(!force&&wasN!==isNight()&&!curModal&&isNight()) toast('🌙 '+t('wx_night')+' · '+t('wxb_night'),'good');
 rainStart(); updHUD(); }
function wxAnnounce(){ if(curModal) return; const w=DN.wx; toast(WXI[w]+' '+t('wx_'+w)+' · '+t('wxb_'+w),(w==='rain'||w==='storm'||w==='petals')?'good':''); if(w==='storm') setTimeout(()=>thunder(),900); else if(w==='rain'||w==='petals') sfx('chime'); }
function thunder(){ if(!DN.lay||!animOn()) return; const f=DN.lay.fl; f.classList.remove('on'); void f.offsetWidth; f.classList.add('on'); setTimeout(()=>sfx('thunder'),300+Math.random()*700); DN.thAt=performance.now()+12000+Math.random()*16000; }
function rainOn(){ return (DN.wx==='rain'||DN.wx==='storm')&&animOn()&&!curModal&&!document.hidden&&S&&S.started; }
function rainStart(){ if(rainOn()&&!DN.raf){ DN.lastT=0; DN.raf=requestAnimationFrame(rainLoop); } if(!rainOn()&&DN.cv){ const x=DN.cv.getContext('2d'); x.clearRect(0,0,DN.cv.width,DN.cv.height); } }
function rainLoop(ts){ DN.raf=0; if(!rainOn()){ rainStart(); return; } const c=DN.cv, v=$('#view'); if(!c||!v) return;
 const W=v.clientWidth, Hh=v.clientHeight; if(c.width!==W||c.height!==Hh){ c.width=W; c.height=Hh; }
 const dt=DN.lastT?Math.min(.05,(ts-DN.lastT)/1000):.016; DN.lastT=ts; const storm=DN.wx==='storm', N=storm?150:90;
 while(DN.drops.length<N) DN.drops.push({x:Math.random()*W*1.2,y:Math.random()*Hh,v:700+Math.random()*500,l:10+Math.random()*12});
 if(DN.drops.length>N) DN.drops.length=N; const x=c.getContext('2d'); x.clearRect(0,0,W,Hh);
 x.strokeStyle=storm?'rgba(210,225,255,.55)':'rgba(220,235,255,.45)'; x.lineWidth=1.3; x.beginPath(); const wind=storm?.32:.18;
 for(const d of DN.drops){ d.y+=d.v*dt; d.x-=d.v*wind*dt; if(d.y>Hh||d.x<-20){ d.y=-20-Math.random()*60; d.x=Math.random()*W*1.25; } x.moveTo(d.x,d.y); x.lineTo(d.x+d.l*wind,d.y-d.l); }
 x.stroke(); if(storm&&performance.now()>DN.thAt){ if(DN.thAt) thunder(); else DN.thAt=performance.now()+6000; }
 DN.raf=requestAnimationFrame(rainLoop); }
{ const _cm=closeModal; closeModal=function(){ const was=curModal; _cm(); if(was) setTimeout(rainStart,50); }; }
V3.onModal.push(()=>rainStart());
document.addEventListener('visibilitychange',()=>rainStart());
{ const _eg=enterGame; enterGame=function(f){ _eg(f); V3.ens.forEach(fn=>fn(S)); setTimeout(()=>{ dnLayers(); dnUpdate(true); },60); if(!DN.int) DN.int=setInterval(()=>dnUpdate(false),2000); }; }

// settings
V3.settings.push(()=>`<div class="slh">🌗 ${t('v3_dn')}</div><div class="langs dnsel">${['fast','real','off'].map(m=>`<button class="btn ${S.fx.dn===m?'p':'gr'}" data-dn="${m}">${m==='fast'?'⏩':m==='real'?'🕰️':'⛔'} ${t('v3_dn_'+m)}</button>`).join('')}</div>
 <label class="sl tg">🌦️ ${t('v3_wx')} <input type="checkbox" id="swx" ${S.fx.wx?'checked':''}></label>
 <div class="note wxnow">${V3.eraIcon()} ${t('wx_'+DN.wx)}${isNight()?' · 🌙 '+t('wx_night'):''} — ${t('wxb_'+DN.wx)}${isNight()?', '+t('wxb_night'):''}</div>`);
V3.settingsBind.push(()=>{ $$('[data-dn]').forEach(b=>b.onclick=e=>{ e.stopPropagation(); S.fx.dn=b.dataset.dn; DN.slot=null; save(); sfx('tap'); dnUpdate(true); $$('[data-dn]').forEach(x=>x.className='btn '+(x.dataset.dn===S.fx.dn?'p':'gr')); });
 const w=$('#swx'); if(w) w.onchange=e=>{ S.fx.wx=e.target.checked; DN.slot=null; save(); sfx('tap'); dnUpdate(true); }; });

// ================= SIDE BUTTONS =================
V3.afterHUD.push(()=>{ const sd=$('#side'); if(!sd||sd.querySelector('[data-s=studio]')) return;
 sd.insertAdjacentHTML('beforeend',[['studio','📸',t('studio')],['runway','👠',t('runway')]].map(([k,i,n])=>`<button data-s="${k}" title="${n}"><span>${i}</span><small id="sd_${k}"></small><i class="dot"></i></button>`).join(''));
 sd.querySelectorAll('[data-s=studio],[data-s=runway]').forEach(el=>el.onclick=e=>{ e.stopPropagation(); Audio2.unlock(); sfx('open'); vib(6); hidePointer(); el.dataset.s==='studio'?openStudio():openRunway(); }); });
{ const _us=updSide; updSide=function(){ _us(); const sd=$('#side'); if(!sd) return; const st=sd.querySelector('[data-s=studio] .dot'), rw=sd.querySelector('[data-s=runway] .dot');
  if(st) st.style.display=(S.st3.day!==dayNum())?'block':'none'; if(rw) rw.style.display=(owned().length&&S.rw.wk!==weekNum())?'block':'none'; }; }

// ================= PHOTO STUDIO =================
const SBG=['studio','runway','neon','beach','palace','space','jungle'];
const BGTH={studio:['winter','gala'],runway:['gala','party'],neon:['party','space'],beach:['tropic'],palace:['royal','gala'],space:['space'],jungle:['tropic']};
const POSES=[{i:'🧍‍♀️',s:1,r:0,y:0},{i:'💃',s:1,r:-5,y:0},{i:'🕺',s:1,r:5,y:0},{i:'🔍',s:1.55,r:0,y:4},{i:'🌟',s:.8,r:0,y:-4}];
const FILT={none:'',glam:'saturate(1.25) brightness(1.06) contrast(1.05)',neon:'saturate(1.6) hue-rotate(-12deg) contrast(1.15)',noir:'grayscale(1) contrast(1.35) brightness(1.05)',vint:'sepia(.55) contrast(.95) brightness(1.05) saturate(.9)',sun:'sepia(.25) saturate(1.4) brightness(1.04)'};
const STK=['💋','✨','🌸','🔥','👑','💎','❤️','🦋','⭐','🍸','🌴','🎀'];
const ST={k:null,stk:[]};
const ALBUM_KEY='suntribe_album';
function albumGet(){ try{ return JSON.parse(localStorage.getItem(ALBUM_KEY)||'[]'); }catch(e){ return []; } }
function albumPut(a){ try{ localStorage.setItem(ALBUM_KEY,JSON.stringify(a)); return true; }catch(e){ return false; } }
function cutSrc(o){ return 'a/c/'+o.img.split('/').pop(); }
async function cutHue(k,o){ const s=S.h[k], hue=s&&s.hue?s.hue[o.id]:null, src=cutSrc(o); if(hue!=null&&o.m&&MASKH[o.m]!=null){ try{ return await recolored(src,o.m,hue); }catch(e){} } return src; }
function photoStars(k){ const o=outfitOf(k), s=S.st3; const hue=S.h[k].hue&&S.h[k].hue[o.id]!=null; let v=1;
 if(o.th&&BGTH[s.bg].includes(o.th)) v+=2; if(s.f!=='none') v+=.5; if(ST.stk.length>=1&&ST.stk.length<=4) v+=.5; if(s.pose||s.flip) v+=.5; if(hue||o.id!=='base') v+=.5; return Math.max(1,Math.min(5,Math.round(v))); }
function heroTf(){ const p=POSES[S.st3.pose]||POSES[0]; return `translateX(-50%) translateY(${p.y}%) rotate(${p.r}deg) scale(${S.st3.flip?-p.s:p.s},${p.s})`; }
function openStudio(k){ if(!owned().length){ toast(t('rw_noher'),'bad'); return; } if(k) ST.k=k; if(!ST.k||!S.h[ST.k]) ST.k=S.leader; Audio2.unlock();
 const s=S.st3; if(s.day!==dayNum()){ s.day=dayNum(); s.n=0; }
 const body=`<div class="std3"><div class="stw"><div class="stg3" id="stg"><img class="sbg" id="sbg" draggable="false"><img class="shero" id="shero" draggable="false"><div class="sfx3" id="sfx3"></div><div class="sstk" id="sstk"></div><div class="sflash"></div></div>
  <div class="srow3"><span class="sstar" id="sstar"></span><span class="sthm" id="sthm"></span></div></div>
  <div class="sctl"><div class="slh">👑</div><div class="srow" id="sher"></div>
  <div class="slh">🖼️ ${t('st_bg')}</div><div class="srow" id="sbgs"></div>
  <div class="slh">💃 ${t('st_pose')}</div><div class="srow" id="spose"></div>
  <div class="slh">🎨 ${t('st_filter')}</div><div class="srow" id="sfil"></div>
  <div class="slh">💋 ${t('st_stk')} <small>${t('st_tapstk')}</small></div><div class="srow" id="sstks"></div>
  <div class="sbtns"><button class="btn p big" id="ssnap">📸 ${t('st_snap')}</button><button class="btn gr" id="salb">📒 ${t('album')} (${albumGet().length})</button></div>
  <div class="note" id="sleft">${t('st_left',{n:Math.min(3,s.n)})}</div></div></div>`;
 openModal('studio',{title:'📸 '+t('studio'),body},'full std');
 const draw=()=>{ const o=outfitOf(ST.k); $('#sbg').src='a/s/'+s.bg+'.webp'; const he=$('#shero'); const tok=Math.random(); he.dataset.tok=tok; he.src=cutSrc(o);
  cutHue(ST.k,o).then(u=>{ if(he.dataset.tok==tok) he.src=u; }); he.style.transform=heroTf(); $('#stg').style.filter=FILT[s.f]||''; $('#stg').className='stg3 f-'+s.f;
  $('#sher').innerHTML=owned().map(h=>`<button class="sch ${h.k===ST.k?'on':''}" data-k="${h.k}"><img src="${faceImg(h.k)}"></button>`).join('');
  $('#sbgs').innerHTML=SBG.map(b=>`<button class="sbt ${b===s.bg?'on':''}" data-b="${b}"><img src="a/s/t_${b}.webp"><small>${BGTH[b].map(x=>TH_ICON[x]).join('')}</small></button>`).join('');
  $('#spose').innerHTML=POSES.map((p,i)=>`<button class="sch e ${i===s.pose?'on':''}" data-p="${i}">${p.i}</button>`).join('')+`<button class="sch e ${s.flip?'on':''}" data-fl="1">↔️</button>`;
  $('#sfil').innerHTML=Object.keys(FILT).map(f=>`<button class="sfc ${f===s.f?'on':''}" data-f="${f}"><i class="fsw f-${f}"></i>${t('f_'+f)}</button>`).join('');
  $('#sstks').innerHTML=STK.map(e=>`<button class="sch e" data-st="${e}">${e}</button>`).join('');
  drawStk(); score();
  on('[data-k]',el=>{ ST.k=el.dataset.k; sfx('tap'); draw(); },$('#sher')); on('[data-b]',el=>{ s.bg=el.dataset.b; sfx('swipe'); draw(); });
  on('[data-p]',el=>{ s.pose=+el.dataset.p; sfx('whoosh'); draw(); }); on('[data-fl]',()=>{ s.flip=!s.flip; sfx('whoosh'); draw(); });
  on('[data-f]',el=>{ s.f=el.dataset.f; sfx('sparkle'); draw(); });
  on('[data-st]',el=>{ if(ST.stk.length>=8) ST.stk.shift(); ST.stk.push({e:el.dataset.st,x:12+Math.random()*76,y:10+Math.random()*60,z:.8+Math.random()*.6,r:-20+Math.random()*40}); sfx('pop'); drawStk(); score(); }); };
 const score=()=>{ const st=photoStars(ST.k), o=outfitOf(ST.k); $('#sstar').innerHTML=stars(st); const m=o.th&&BGTH[s.bg].includes(o.th);
  $('#sthm').innerHTML=m?`<b class="mt">${t('st_match')}</b>`:`${t('st_hint')}: ${BGTH[s.bg].map(x=>TH_ICON[x]).join(' ')}`; };
 const drawStk=()=>{ const c=$('#sstk'); c.innerHTML=ST.stk.map((q,i)=>`<i data-i="${i}" style="left:${q.x}%;top:${q.y}%;transform:translate(-50%,-50%) rotate(${q.r}deg) scale(${q.z})">${q.e}</i>`).join('');
  c.querySelectorAll('i').forEach(el=>{ el.onpointerdown=e=>{ e.stopPropagation(); e.preventDefault(); const q=ST.stk[+el.dataset.i], r=$('#stg').getBoundingClientRect(); let mv=0; const sx=e.clientX, sy=e.clientY;
   el.setPointerCapture&&el.setPointerCapture(e.pointerId);
   el.onpointermove=ev=>{ if(Math.abs(ev.clientX-sx)+Math.abs(ev.clientY-sy)>6) mv=1; if(!mv) return; q.x=Math.max(4,Math.min(96,(ev.clientX-r.left)/r.width*100)); q.y=Math.max(4,Math.min(96,(ev.clientY-r.top)/r.height*100)); el.style.left=q.x+'%'; el.style.top=q.y+'%'; };
   el.onpointerup=()=>{ el.onpointermove=null; el.onpointerup=null; if(!mv){ ST.stk.splice(+el.dataset.i,1); sfx('close'); drawStk(); score(); } }; }; }); };
 draw();
 $('#ssnap').onclick=e=>{ e.stopPropagation(); snap(); }; $('#salb').onclick=e=>{ e.stopPropagation(); openAlbum(); }; }
async function snapCanvas(){ const s=S.st3, W=540, Hh=720, c=document.createElement('canvas'); c.width=W; c.height=Hh; const x=c.getContext('2d');
 const o=outfitOf(ST.k); const [bg,he]=await Promise.all([loadImg('a/s/'+s.bg+'.webp'),cutHue(ST.k,o).then(loadImg)]);
 const sc=Math.max(W/bg.naturalWidth,Hh/bg.naturalHeight), bw=bg.naturalWidth*sc, bh=bg.naturalHeight*sc; x.drawImage(bg,(W-bw)/2,(Hh-bh)*.62,bw,bh);
 const p=POSES[s.pose]||POSES[0], hh=Hh*.94, hw=hh*he.naturalWidth/he.naturalHeight, top=Hh-hh+p.y/100*hh;
 x.save(); x.fillStyle='rgba(0,0,0,.28)'; x.beginPath(); x.ellipse(W/2,Hh-10,hw*.32*p.s,14,0,0,7); x.fill(); x.restore();
 x.save(); x.translate(W/2,top+hh/2); x.rotate(p.r*Math.PI/180); x.scale(s.flip?-p.s:p.s,p.s); x.drawImage(he,-hw/2,-hh/2,hw,hh); x.restore();
 filterPx(x,W,Hh,s.f);
 ST.stk.forEach(q=>{ x.save(); x.translate(q.x/100*W,q.y/100*Hh); x.rotate(q.r*Math.PI/180); x.font=`${Math.round(56*q.z)}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`; x.textAlign='center'; x.textBaseline='middle'; x.fillText(q.e,0,0); x.restore(); });
 const g=x.createLinearGradient(0,Hh-90,0,Hh); g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(1,'rgba(40,0,60,.65)'); x.fillStyle=g; x.fillRect(0,Hh-90,W,90);
 x.fillStyle='#fff'; x.font='bold 26px Nunito,Arial,sans-serif'; x.textAlign='left'; x.fillText('☀ '+hname(ST.k),20,Hh-24); x.font='16px Nunito,Arial,sans-serif'; x.textAlign='right'; x.globalAlpha=.85; x.fillText(t('title')+' · '+new Date().toLocaleDateString(),W-18,Hh-26); x.globalAlpha=1;
 x.strokeStyle='#fff'; x.lineWidth=10; x.strokeRect(5,5,W-10,Hh-10);
 return c.toDataURL('image/jpeg',.84); }
function filterPx(x,W,Hh,f){ if(f==='none') return; const id=x.getImageData(0,0,W,Hh), d=id.data;
 for(let i=0;i<d.length;i+=4){ let r=d[i],g=d[i+1],b=d[i+2]; const l=.3*r+.59*g+.11*b;
  if(f==='noir'){ let v=(l-128)*1.35+134; r=g=b=v; }
  else if(f==='vint'){ const sr=.393*r+.769*g+.189*b, sg=.349*r+.686*g+.168*b, sb=.272*r+.534*g+.131*b; r=r*.45+sr*.55+6; g=g*.45+sg*.55+4; b=b*.45+sb*.55-4; }
  else if(f==='glam'){ r=l+(r-l)*1.25+12; g=l+(g-l)*1.25+4; b=l+(b-l)*1.25+10; }
  else if(f==='neon'){ r=l+(r-l)*1.6; g=l+(g-l)*1.4; b=l+(b-l)*1.6; r=(r-128)*1.15+128+(l<110?18:0); b=(b-128)*1.15+128+(l<110?34:0); g=(g-128)*1.15+128; }
  else if(f==='sun'){ r=l+(r-l)*1.4+20; g=l+(g-l)*1.3+6; b=l+(b-l)*1.3-14; }
  d[i]=r<0?0:r>255?255:r; d[i+1]=g<0?0:g>255?255:g; d[i+2]=b<0?0:b>255?255:b; }
 x.putImageData(id,0,0);
 if(f==='vint'||f==='noir'){ const g=x.createRadialGradient(W/2,Hh/2,Hh*.35,W/2,Hh/2,Hh*.75); g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(1,'rgba(0,0,0,.45)'); x.fillStyle=g; x.fillRect(0,0,W,Hh); }
 if(f==='neon'){ const g=x.createLinearGradient(0,0,W,Hh); g.addColorStop(0,'rgba(255,0,170,.16)'); g.addColorStop(1,'rgba(0,220,255,.16)'); x.fillStyle=g; x.fillRect(0,0,W,Hh); }
 if(f==='sun'){ const g=x.createLinearGradient(0,0,0,Hh); g.addColorStop(0,'rgba(255,120,40,.22)'); g.addColorStop(1,'rgba(255,60,140,.12)'); x.fillStyle=g; x.fillRect(0,0,W,Hh); } }
let snapping=false;
async function snap(){ if(snapping) return; snapping=true; sfx('shutter'); vib(20); const f=$('#stg .sflash'); if(f){ f.classList.remove('on'); void f.offsetWidth; f.classList.add('on'); }
 try{ const u=await snapCanvas(), st=photoStars(ST.k), s=S.st3, o=outfitOf(ST.k); const a=albumGet(); a.unshift({id:Date.now(),k:ST.k,o:o.id,s:st,u});
  let ok=false; while(a.length&&!(ok=albumPut(a.slice(0,40)))) a.pop(); if(!ok){ toast(t('st_full'),'bad'); snapping=false; return; }
  if(s.day!==dayNum()){ s.day=dayNum(); s.n=0; } let rw=null; if(s.n<3){ rw={petals:4*st}; if(st>=5) rw.gems=3; give(rw); s.n++; }
  save(); updSide(); setTimeout(()=>photoResult(u,st,rw),350); }catch(e){ console.warn(e); toast('📸 ✖','bad'); }
 snapping=false; }
function photoResult(u,st,rw){ if(curModal!=='studio') return; const d=document.createElement('div'); d.className='pres3'; d.innerHTML=`<div class="pc"><img src="${u}"><div class="pst">${stars(st)}</div>${rw?`<div class="prw">🎁 ${t('st_rew',{r:rwStr(rw)})}</div>`:''}<div class="note">✅ ${t('st_saved')}</div>
  <div class="sbtns"><button class="btn p" data-a="ok">OK</button><button class="btn gr" data-a="alb">📒 ${t('album')}</button></div></div>`;
 $('#modal .sheet').appendChild(d); sfx(st>=4?'cheer':'sparkle'); if(st>=5) confetti(40);
 d.onclick=e=>{ e.stopPropagation(); const a=e.target.closest('[data-a]'); if(!a) return; d.remove(); if(a.dataset.a==='alb') openAlbum(); else { const l=$('#sleft'); if(l) l.textContent=t('st_left',{n:Math.min(3,S.st3.n)}); const b=$('#salb'); if(b) b.textContent='📒 '+t('album')+' ('+albumGet().length+')'; } }; }
function openAlbum(){ const a=albumGet();
 const body=a.length?`<div class="agrid">${a.map((p,i)=>`<button class="aph" data-i="${i}"><img src="${p.u}" loading="lazy"><span>${'⭐'.repeat(p.s)}</span></button>`).join('')}</div>`:`<div class="aempty"><div class="big">📸</div>${t('st_empty')}</div>`;
 openModal('album',{title:`📒 ${t('album')} <small>${a.length}/40</small>`,body:body+`<div class="sbtns"><button class="btn p" id="ast">📸 ${t('studio')}</button></div>`},'full');
 $('#ast').onclick=e=>{ e.stopPropagation(); openStudio(); };
 on('.aph',el=>viewPhoto(+el.dataset.i)); }
function viewPhoto(i){ const a=albumGet(), p=a[i]; if(!p) return; sfx('open');
 const d=document.createElement('div'); d.className='pres3'; d.innerHTML=`<div class="pc"><img src="${p.u}"><div class="pst">${hname(p.k)} · ${stars(p.s)}</div><div class="sbtns">
  ${navigator.share?`<button class="btn p" data-a="sh">📤 ${t('st_share')}</button>`:''}<a class="btn gr" data-a="dl" download="suntribe_${p.id}.jpg" href="${p.u}">💾 ${t('st_dl')}</a><button class="btn r" data-a="del">🗑️ ${t('st_del')}</button><button class="btn gr" data-a="x">✕</button></div></div>`;
 $('#modal .sheet').appendChild(d);
 d.onclick=async e=>{ e.stopPropagation(); const b=e.target.closest('[data-a]'); if(!b){ d.remove(); return; } const k=b.dataset.a;
  if(k==='x'){ d.remove(); } else if(k==='del'){ a.splice(i,1); albumPut(a); sfx('close'); d.remove(); openAlbum(); }
  else if(k==='sh'){ try{ const bl=await (await fetch(p.u)).blob(); const file=new File([bl],'suntribe.jpg',{type:'image/jpeg'}); await navigator.share({files:[file],title:t('title')}); }catch(err){} } }; }

// ================= WEEKLY RUNWAY =================
function weekNum(){ return Math.floor((dayNum()+3)/7); }
function weekTheme(){ return THEMES[weekNum()%THEMES.length]; }
function weekLeft(){ const d=new Date(), ms=((weekNum()+1)*7-3)*86400000+d.getTimezoneOffset()*60000; return Math.max(0,(ms-Date.now())/1000); }
function rwEnsure(){ const r=S.rw, w=weekNum(); if(r.wk!==w){ r.wk=w; r.tries=3; r.best=9; r.pick=[]; } }
function rwStyle(k){ const o=outfitOf(k), s=S.h[k], hue=s.hue&&s.hue[o.id]!=null; return o.ch*1.2+(o.th===weekTheme()?24:0)+(hue?4:0)+s.stars*4+s.lvl*.4+(V3.affStyle?V3.affStyle(k):0); }
function rwPickDefault(){ return owned().map(h=>h.k).sort((a,b)=>rwStyle(b)-rwStyle(a)).slice(0,3); }
function rwRivals(n){ let sd=weekNum()*7919+S.rw.tries*31; const rnd=()=>{ sd=(sd*9301+49297)%233280; return sd/233280; }; const hl=hallLvl(), base=(58+Math.min(14,hl*.7)+rnd()*4-2)*n/3;
 return [base, base-7*n/3+rnd()*2, base-14*n/3+rnd()*2].map(v=>Math.round(v*10)/10); }
const MEDR={1:{gems:40,petals:80,tickets:2},2:{gems:20,petals:50},3:{gems:10,petals:30}};
function openRunway(){ if(!owned().length){ toast(t('rw_noher'),'bad'); return; } rwEnsure(); const r=S.rw; if(!r.pick.length||r.pick.some(k=>!S.h[k])) r.pick=rwPickDefault();
 const th=weekTheme(), mx=Math.min(3,owned().length);
 const cards=owned().map(h=>{ const o=outfitOf(h.k), sel=r.pick.includes(h.k), st=rwStyle(h.k); return `<button class="rwc ${sel?'on':''}" data-k="${h.k}"><img src="${o.tn||faceImg(h.k)}" onerror="this.src='${faceImg(h.k)}'"><b>${hname(h.k)}</b>
   <span class="rwb"><i style="width:${Math.min(100,st/60*100).toFixed(0)}%"></i></span><small>${o.th?TH_ICON[o.th]:'·'}${o.th===th?' 🎯':''}</small>${sel?'<em>✓</em>':''}</button>`; }).join('');
 const rv=rwRivals(mx);
 const body=`<div class="rw3"><div class="rwhead" style="background-image:url(a/s/t_runway.webp)"><div><div class="big">👠 ${t('rw_week')}</div><div class="rth">${t('rw_theme')}: <b>${TH_ICON[th]} ${t('th_'+th)}</b></div>
  <small>⏳ ${t('rw_ends',{t:ftime(weekLeft())})}</small></div><div class="rwm">🥇${r.g} 🥈${r.s} 🥉${r.b}</div></div>
  <div class="note">💡 ${t('rw_tip')}</div>
  <div class="rwriv">${[1,2,3].map(i=>`<span>${['🦊','🐱','🐆'][i-1]} ${t('rw_r'+i)} · <b>${rv[i-1]}</b></span>`).join('')}</div>
  <div class="slh">${t('rw_pick')} (${r.pick.length}/${mx})</div><div class="rwgrid">${cards}</div>
  <div class="sbtns">${r.tries>0?`<button class="btn p big" id="rwgo">${t('rw_start')} · ${t('rw_tries',{n:r.tries})}</button>`:`<button class="btn p big" id="rwbuy" ${(S.r.tickets||0)<1?'disabled':''}>${t('rw_more')}</button>`}</div>
  ${r.best<9?`<div class="note">${t('rw_best')}: ${['','🥇','🥈','🥉','—'][r.best]}</div>`:''}</div>`;
 openModal('runway',{title:'👠 '+t('runway'),body},'full');
 on('.rwc',el=>{ const k=el.dataset.k; const i=r.pick.indexOf(k); if(i>=0){ if(r.pick.length>1) r.pick.splice(i,1); } else { if(r.pick.length>=mx) r.pick.shift(); r.pick.push(k); } sfx('tap'); openRunway(); });
 const go=$('#rwgo'); if(go) go.onclick=e=>{ e.stopPropagation(); r.tries--; save(); runShow(); };
 const by=$('#rwbuy'); if(by) by.onclick=e=>{ e.stopPropagation(); if((S.r.tickets||0)<1){ toast(t('nores'),'bad'); sfx('error'); return; } S.r.tickets--; r.tries++; save(); updHUD(); openRunway(); }; }
let RWT=[];
function runShow(){ const r=S.rw, pick=r.pick.filter(k=>S.h[k]); const rv=rwRivals(pick.length); let sd=Date.now()%100000;
 const rnd=()=>{ sd=(sd*9301+49297)%233280; return sd/233280; };
 const res=pick.map(k=>{ const st=rwStyle(k); const js=[0,1,2].map(()=>Math.max(4,Math.min(10,Math.round((5+st/11+rnd()*1.4-.6)*2)/2))); return {k,js,sum:js.reduce((a,b)=>a+b,0)}; });
 const total=Math.round(res.reduce((a,b)=>a+b.sum,0)*10)/10;
 openModal('runway',{title:'👠 '+t('rw_week')+' · '+TH_ICON[weekTheme()],body:`<div class="show3"><img class="shbg" src="a/s/runway.webp"><div class="spot3"></div><div class="flashes"></div><img class="model" id="model"><div class="judges" id="judges"></div><div class="shname" id="shname"></div><div class="shtot" id="shtot">0</div><button class="btn gr skip3" id="rwskip">${t('rw_skip')}</button></div>`},'full show');
 RWT.forEach(clearTimeout); RWT=[]; let acc=0; const T=(fn,ms)=>RWT.push(setTimeout(()=>{ if(curModal==='runway') fn(); },ms));
 const step=4300; sfx('cheer');
 res.forEach((x,i)=>{ const b=i*step+400;
  T(()=>{ const m=$('#model'); m.classList.remove('walk'); m.src=cutSrc(outfitOf(x.k)); cutHue(x.k,outfitOf(x.k)).then(u=>{ if($('#model')) $('#model').src=u; }); void m.offsetWidth; m.classList.add('walk'); $('#judges').innerHTML=''; $('#shname').textContent=hname(x.k); sfx('whoosh'); },b);
  T(()=>{ camFlash(); sfx('shutter'); },b+1500); T(()=>{ camFlash(); },b+2100); T(()=>{ sfx('glam'); },b+2300);
  x.js.forEach((j,q)=>T(()=>{ const d=document.createElement('div'); d.className='jc'; d.innerHTML=`<span>${['👩‍🎤','💁‍♀️','🧑‍🎨'][q]}</span><b>${j.toFixed(1)}</b>`; $('#judges').appendChild(d); acc+=j; $('#shtot').textContent=acc.toFixed(1); sfx(j>=9?'cheer':'coin'); },b+2700+q*350)); });
 const fin=()=>{ RWT.forEach(clearTimeout); RWT=[]; showResult(total,rv,res); };
 T(fin,res.length*step+900); $('#rwskip').onclick=e=>{ e.stopPropagation(); fin(); }; }
function camFlash(){ const f=$('.flashes'); if(!f) return; const d=document.createElement('i'); d.style.left=(10+Math.random()*80)+'%'; d.style.top=(40+Math.random()*30)+'%'; f.appendChild(d); setTimeout(()=>d.remove(),600); }
function showResult(total,rv,res){ const r=S.rw; const rows=[{n:t('rw_you'),v:total,me:1},...rv.map((v,i)=>({n:['🦊','🐱','🐆'][i]+' '+t('rw_r'+(i+1)),v}))].sort((a,b)=>b.v-a.v);
 const place=rows.findIndex(x=>x.me)+1; let rw, msg;
 if(place<=3&&place<r.best){ rw=MEDR[place]; r.best=place; r[['','g','s','b'][place]]++; msg=t('rw_rew',{r:rwStr(rw)}); } else { rw={petals:place<=3?15:8}; msg=t('rw_cons',{r:rwStr(rw)}); }
 give(rw); save(); updHUD(); updSide();
 const md=['','🥇','🥈','🥉','🎗️'][Math.min(4,place)], tt=[0,'rw_gold','rw_silver','rw_bronze','rw_none'][Math.min(4,place)];
 openModal('runway',{title:'🏆 '+t('rw_res'),body:`<div class="rres3"><div class="medal3 m${place}">${md}</div><div class="big">${t(tt)}</div>
  <div class="rtab">${rows.map((x,i)=>`<div class="${x.me?'me':''}"><span>${i+1}.</span><b>${x.n}</b><em>${x.v.toFixed(1)}</em></div>`).join('')}</div>
  <div class="rfaces">${res.map(x=>`<span><img src="${faceImg(x.k)}"><small>${x.sum.toFixed(1)}</small></span>`).join('')}</div>
  <div class="prw">🎁 ${msg}</div><div class="sbtns"><button class="btn p" id="rwa">${t('rw_again')}</button><button class="btn gr" id="rwx">OK</button></div></div>`},'full');
 if(place===1){ sfx('achievement'); fireworks(4500); confetti(80); } else if(place<=3){ sfx('quest'); confetti(40); } else sfx('pop');
 $('#rwa').onclick=e=>{ e.stopPropagation(); openRunway(); }; $('#rwx').onclick=e=>{ e.stopPropagation(); closeModal(); }; }
{ const _cm2=closeModal; closeModal=function(){ RWT.forEach(clearTimeout); RWT=[]; _cm2(); }; }
