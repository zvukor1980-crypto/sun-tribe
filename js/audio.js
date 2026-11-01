'use strict';
// ===== Sun Tribe audio engine v2 (WebAudio, fully procedural) =====
// Data-defined music tracks with crossfades + rich synthesized SFX. API: init, unlock, setVol, suspend, resume, play(name), track(name), era
const SCALES={maj:[0,2,4,5,7,9,11],min:[0,2,3,5,7,8,10],dor:[0,2,3,5,7,9,10],mix:[0,2,4,5,7,9,10],phr:[0,1,4,5,7,8,10],hmin:[0,2,3,5,7,8,11],pent:[0,2,4,7,9,12,14],mpent:[0,3,5,7,10,12,15]};
// Melody strings: one char per melody step; 0-9,a,b,c = scale degrees (0=root), '-' = hold, '.' = rest
const TRACKS={
 menu:{name:'Sunrise Lagoon',bpm:92,key:60,sc:'maj',bar:16,ms:8,chords:[0,5,3,4, 0,5,1,4],
  mel:['4-2-0-2-4-5-4---','3-2-1-3-2---1---','4-2-0-2-4-7-6-5-','4-3-2-1-0-------'],
  L:[{i:'marimba',r:'mel',o:12,v:.5},{i:'pad',r:'pad',v:.11},{i:'bass',r:'bass',p:'x.......x...x...',v:.4},{i:'kal',r:'arp',p:'..x...x...x...x.',o:12,v:.12},
     {i:'shaker',p:'.x.x.x.x.x.x.x.x',v:.1},{i:'conga',p:'x.....x...x.....',v:.25}]},
 era1:{name:'Stone Drums',bpm:100,key:62,sc:'mpent',bar:16,ms:8,chords:[0,0,3,4, 0,0,2,4],
  mel:['0-2-3-4---3-2---','0-2-4-3-2-0----.','4-5-4-3-2-3-4---','3-2-0-2-0-------'],
  L:[{i:'kal',r:'mel',o:12,v:.5},{i:'flute',r:'mel2',o:12,v:.16},{i:'bass',r:'bass',p:'x..x..x...x..x..',v:.42},{i:'logdrum',r:'arp',p:'x.x..x.x..x.x...',o:-12,v:.28},
     {i:'kick',p:'x.......x.......',v:.5},{i:'conga',p:'..x..x....x..x.x',v:.35},{i:'shaker',p:'xxxxxxxxxxxxxxxx',v:.06}]},
 era2:{name:'Temple of Olives',bpm:86,key:57,sc:'hmin',bar:16,ms:8,chords:[0,3,4,0, 5,3,4,4],
  mel:['4-5-4-3-4-------','2-3-4-5-6-5-4---','7-6-5-4-3-4-5-4-','3-2-1-0---------'],
  L:[{i:'harp',r:'arp',p:'x.x.x.x.x.x.x.x.',v:.22},{i:'flute',r:'mel',o:12,v:.32},{i:'pad',r:'pad',v:.08},{i:'bass',r:'bass',p:'x.......x.......',v:.38},
     {i:'frame',p:'x..x..x.x..x....',v:.3},{i:'tamb',p:'....x.......x...',v:.12}]},
 era3:{name:'Castle Courtyard',bpm:96,key:62,sc:'dor',bar:16,ms:8,chords:[0,6,0,4, 2,6,3,4],
  mel:['4-3-2-1-0-1-2-4-','3-2-1-0-6---0---','4-5-6-7-6-5-4---','2-3-1-2-0-------'],
  L:[{i:'lute',r:'arp',p:'x.xxx.x.x.xxx.x.',v:.2},{i:'flute',r:'mel',o:12,v:.3},{i:'organ',r:'pad',v:.07},{i:'bass',r:'bass',p:'x.......x...x...',v:.36},
     {i:'tamb',p:'..x...x...x...x.',v:.12},{i:'frame',p:'x.......x.x.....',v:.3}]},
 era4:{name:'Steam & Swing',bpm:112,key:55,sc:'maj',bar:16,ms:8,swing:.18,chords:[0,5,1,4, 0,3,4,0],
  mel:['4-4-5-4-2-0---.','5-5-6-5-3-1----','7-6-5-4-5-6-7---','6-5-4-2-0-------'],
  L:[{i:'brass',r:'mel',o:0,v:.22},{i:'epiano',r:'stab',p:'..x...x...x...x.',v:.16},{i:'bass',r:'walk',p:'x...x...x...x...',v:.42},
     {i:'kick',p:'x.......x.......',v:.35},{i:'snare',p:'....x.......x...',v:.18},{i:'hat',p:'x.xxx.xxx.xxx.xx',v:.07}]},
 era5:{name:'City Lights',bpm:118,key:65,sc:'maj',bar:16,ms:8,chords:[0,4,5,3, 0,4,5,3],
  mel:['4-4-2-4-5-4-2---','2-2-0-2-3-2-1---','4-4-2-4-7-6-5-4-','5-4-2-1-0-------'],
  L:[{i:'pluck',r:'mel',o:12,v:.26},{i:'pad',r:'pad',v:.1},{i:'synbass',r:'bass',p:'x.x...x.x.x...x.',v:.36},{i:'pluck',r:'arp',p:'.x.x.x.x.x.x.x.x',o:0,v:.08},
     {i:'kick',p:'x...x...x...x...',v:.5},{i:'clap',p:'....x.......x...',v:.25},{i:'hat',p:'..x...x...x...x.',v:.1}]},
 era6:{name:'Neon Horizon',bpm:124,key:64,sc:'min',bar:16,ms:16,chords:[0,5,2,6, 0,5,3,4],
  mel:['7---6---4---3-4-','2---------------','7---9---8---7-6-','4---------------'],
  L:[{i:'saw',r:'arp16',v:.1},{i:'bell',r:'mel',o:12,v:.22},{i:'superpad',r:'pad',v:.1},{i:'synbass',r:'bass',p:'x.xx.xx.x.xx.xx.',v:.34},
     {i:'kick',p:'x...x...x...x...',v:.55},{i:'clap',p:'....x.......x...',v:.22},{i:'hat',p:'.xx..xx..xx..xxx',v:.08},{i:'zap',p:'...............x',v:.08}]},
 map:{name:'Over the Horizon',bpm:104,key:62,sc:'min',bar:16,ms:8,chords:[0,5,2,6, 0,3,4,4],
  mel:['0-4-7---6-5-4---','3-4-5-4-2-------','0-4-7-8-9-8-7-6-','5-4-2-1-0-------'],
  L:[{i:'strings',r:'ost',p:'x.x.x.x.x.x.x.x.',v:.13},{i:'brass',r:'mel',o:0,v:.22},{i:'pad',r:'pad',v:.07},{i:'bass',r:'bass',p:'x..x..x.x..x..x.',v:.38},
     {i:'tom',p:'x..x..x.....x.x.',v:.3},{i:'kick',p:'x.......x.......',v:.4},{i:'shaker',p:'.x.x.x.x.x.x.x.x',v:.06}]},
 shop:{name:'Glossy Boutique',bpm:100,key:58,sc:'maj',bar:16,ms:8,chords:[0,1,4,0, 3,2,1,4],sev:1,
  mel:['4-6-5-4-2---1---','2-4-3-2-0-------','4-6-7-9-8-7-6---','5-4-3-1-0-------'],
  L:[{i:'epiano',r:'stab',p:'x..x..x...x..x..',v:.17},{i:'vibes',r:'mel',o:12,v:.28},{i:'bass',r:'bass',p:'x..x..x...x..x..',v:.38},
     {i:'shaker',p:'x.xxx.xxx.xxx.xx',v:.07},{i:'rim',p:'...x..x....x..x.',v:.16},{i:'kick',p:'x.......x.......',v:.3}]},
 tavern:{name:'Merry Jig',bpm:126,key:55,sc:'maj',bar:12,ms:6,chords:[0,0,4,4, 0,3,4,0],
  mel:['0-24-5','4-20-1','2-31-2','4-2--.','0-24-5','7-64-5','4-21-6','0-----'],
  L:[{i:'fiddle',r:'mel',o:12,v:.22},{i:'lute',r:'arp',p:'x.xx.xx.xx.x',v:.18},{i:'bass',r:'bass',p:'x.....x.....',v:.38},
     {i:'frame',p:'x..x..x..x.x',v:.3},{i:'tamb',p:'..x..x..x..x',v:.1}]},
 party:{name:'Sun Festival',bpm:128,key:60,sc:'maj',bar:16,ms:8,chords:[0,3,4,0, 5,3,4,4],
  mel:['0-2-4-7-6-4-5---','4-5-4-2-1-------','7-7-6-4-5-5-4-2-','4-2-1-6-0-------'],
  L:[{i:'brass',r:'mel',o:12,v:.18},{i:'bell',r:'arp',p:'x...x...x...x...',o:12,v:.08},{i:'marimba',r:'arp',p:'.x.x.x.x.x.x.x.x',o:12,v:.18},{i:'bass',r:'bass',p:'x..x..x.x..x..x.',v:.38},
     {i:'kick',p:'x...x...x...x...',v:.45},{i:'clap',p:'....x.......x...',v:.22},{i:'conga',p:'..x..x....x.xx..',v:.25},{i:'hat',p:'..x...x...x...x.',v:.08}]},
};
const Audio2={ctx:null,music:null,sfx:null,master:null,started:false,timer:null,mv:.6,sv:.8,era:1,cur:null,players:[],want:'menu',
 init(){ if(this.ctx) return; const AC=window.AudioContext||window.webkitAudioContext; if(!AC) return;
  try{ if(navigator.audioSession) navigator.audioSession.type='playback'; }catch(e){}
  this.ctx=new AC(); const c=this.ctx;
  this.master=c.createGain(); const comp=c.createDynamicsCompressor(); comp.threshold.value=-12; comp.ratio.value=3; comp.attack.value=.01; comp.release.value=.2;
  this.master.connect(comp); comp.connect(c.destination);
  this.music=c.createGain(); this.music.gain.value=this.mv*0.55; this.music.connect(this.master);
  this.sfx=c.createGain(); this.sfx.gain.value=this.sv; this.sfx.connect(this.master);
  // reverb (generated impulse) + tempo delay for music
  const len=c.sampleRate*2.2, ir=c.createBuffer(2,len,c.sampleRate);
  for(let ch=0;ch<2;ch++){ const d=ir.getChannelData(ch); for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.2); }
  this.rev=c.createConvolver(); this.rev.buffer=ir; const rw=c.createGain(); rw.gain.value=.28; this.rev.connect(rw); rw.connect(this.master);
  this.revIn=c.createGain(); this.revIn.gain.value=1; this.revIn.connect(this.rev);
  this.dly=c.createDelay(1); this.dly.delayTime.value=.36; const fb=c.createGain(); fb.gain.value=.25; const lp=c.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=2600;
  this.dly.connect(lp); lp.connect(fb); fb.connect(this.dly); const dw=c.createGain(); dw.gain.value=.16; lp.connect(dw); dw.connect(this.master);
  this.music.connect(this.revIn); this.music.connect(this.dly);
  const sr=c.createGain(); sr.gain.value=.35; this.sfx.connect(sr); sr.connect(this.rev);
  this.noise=c.createBuffer(1,c.sampleRate,c.sampleRate); const nd=this.noise.getChannelData(0); for(let i=0;i<nd.length;i++) nd[i]=Math.random()*2-1;
 },
 unlock(){ this.init(); if(!this.ctx) return; if(this.ctx.state!=='running') this.ctx.resume();
  try{const b=this.ctx.createBuffer(1,1,22050),s=this.ctx.createBufferSource();s.buffer=b;s.connect(this.ctx.destination);s.start(0);}catch(e){}
  if(!this.started){ this.started=true; this.timer=setInterval(()=>this.sched(),60); this.track(this.want,true); } },
 setVol(mv,sv){ this.mv=mv; this.sv=sv; if(!this.ctx) return; const t=this.ctx.currentTime;
  this.music.gain.setTargetAtTime(mv*0.55,t,0.05); this.sfx.gain.setTargetAtTime(sv,t,0.05); },
 suspend(){ if(this.ctx&&this.ctx.state==='running') this.ctx.suspend(); },
 resume(){ if(this.ctx&&this.ctx.state!=='running') this.ctx.resume(); },
 trackName(n){ const d=TRACKS[n||this.cur]; return d?d.name:''; },
 // ---- track switching with 2s crossfade
 track(name,force){ if(!TRACKS[name]) name='menu'; this.want=name; if(!this.ctx||!this.started) return; if(name===this.cur&&!force) return;
  const c=this.ctx, t=c.currentTime; this.cur=name;
  this.players.forEach(p=>{ if(p.stopAt==null){ p.g.gain.cancelScheduledValues(t); p.g.gain.setValueAtTime(p.g.gain.value,t); p.g.gain.linearRampToValueAtTime(0.0001,t+2); p.stopAt=t+2.1; } });
  const g=c.createGain(); g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(1,t+2); g.connect(this.music);
  this.players.push({d:TRACKS[name],g,step:0,nt:t+0.08,stopAt:null}); },
 sched(){ if(!this.ctx||this.ctx.state!=='running') return; const c=this.ctx, ahead=c.currentTime+0.25;
  this.players=this.players.filter(p=>{ if(p.stopAt!=null&&c.currentTime>p.stopAt){ try{p.g.disconnect();}catch(e){} return false; } return true; });
  this.players.forEach(p=>{ const d=p.d, spb=60/d.bpm/(d.bar===12?2:4);
   while(p.nt<ahead){ if(p.stopAt==null||p.nt<p.stopAt) this.stepT(p,p.nt); let dur=spb; if(d.swing) dur=spb*(p.step%2===0?1+d.swing:1-d.swing); p.nt+=dur; p.step++; } }); },
 deg(d,k,o){ const sc=SCALES[d.sc], n=sc.length, oc=Math.floor(k/n), i=((k%n)+n)%n; const span=d.sc.indexOf('pent')>=0?12:12; return d.key+o+sc[i]+oc*span; },
 chordTones(d,root){ return [root,root+2,root+4].concat(d.sev?[root+6]:[]); },
 stepT(p,t){ const d=p.d, bar=Math.floor(p.step/d.bar), sib=p.step%d.bar, nb=d.chords.length, cr=d.chords[bar%nb], dst=p.g;
  const spb=60/d.bpm/(d.bar===12?2:4);
  d.L.forEach(l=>{ const vel=l.v, o=l.o||0;
   if(l.r==='mel'||l.r==='mel2'){ const phr=d.mel[bar%d.mel.length], per=d.bar/phr.length; if(sib%per) return; const mi=sib/per; if(l.r==='mel2'&&bar%4<2) return;
    const ch=phr[mi]; if(!ch||ch==='-'||ch==='.') return; let len=1; while(phr[mi+len]==='-') len++;
    const k=parseInt(ch,36); this.inst(l.i,dst,t,this.mf(this.deg(d,k,o)),len*per*spb*0.95,vel); return; }
   if(l.r==='pad'){ if(sib) return; this.chordTones(d,cr).forEach((k,j)=>this.inst(l.i,dst,t,this.mf(this.deg(d,k,-12)),d.bar*spb*1.02,vel*(j?0.8:1))); return; }
   const pat=l.p; if(l.r==='arp16'){ const tones=this.chordTones(d,cr).concat([cr+7,cr+4+7]); const k=tones[sib%tones.length]; this.inst(l.i,dst,t,this.mf(this.deg(d,k,o)),spb*0.9,vel*(sib%4===0?1.3:1)); return; }
   if(!pat||pat[sib]!=='x') return;
   if(l.r==='bass'){ const k=(sib>=d.bar/2&&sib%4===2)?cr+4:cr; this.inst(l.i,dst,t,this.mf(this.deg(d,k,-24)),spb*1.8,vel); return; }
   if(l.r==='walk'){ const steps=[0,2,4,5]; const k=cr+steps[(sib/4)|0]; this.inst(l.i,dst,t,this.mf(this.deg(d,k,-24)),spb*3.5,vel); return; }
   if(l.r==='arp'||l.r==='ost'){ const tones=this.chordTones(d,cr).concat([cr+7]); const cnt=pat.slice(0,sib).split('x').length-1; const k=l.r==='ost'?(cnt%2?cr+4:cr):tones[cnt%tones.length];
    this.inst(l.i,dst,t,this.mf(this.deg(d,k,o)),spb*(l.r==='ost'?1.6:2.5),vel); return; }
   if(l.r==='stab'){ this.chordTones(d,cr).forEach(k=>this.inst(l.i,dst,t,this.mf(this.deg(d,k,0)),spb*1.5,vel*0.7)); return; }
   this.drum(l.i,dst,t,vel); }); },
 mf(m){ return 440*Math.pow(2,(m-69)/12); },
 // ---- instrument primitives
 osc(dst,t,f,dur,type,vol,att=0.005,rel=null,det=0){ const c=this.ctx,o=c.createOscillator(),g=c.createGain();
  o.type=type; o.frequency.value=f; o.detune.value=det; g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(Math.max(vol,0.0002),t+att);
  g.gain.exponentialRampToValueAtTime(0.0001,t+dur); o.connect(g); g.connect(dst); o.start(t); o.stop(t+dur+0.05); return o; },
 filt(dst,type,f,q=1){ const b=this.ctx.createBiquadFilter(); b.type=type; b.frequency.value=f; b.Q.value=q; b.connect(dst); return b; },
 nz(dst,t,dur,vol,type,f,q=1,att=0.002){ const c=this.ctx,s=c.createBufferSource(),g=c.createGain(); s.buffer=this.noise; const b=this.filt(g,type,f,q);
  s.connect(b); g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(vol,t+att); g.gain.exponentialRampToValueAtTime(0.0001,t+dur); g.connect(dst);
  s.start(t,Math.random()*0.5); s.stop(t+dur+0.05); return b; },
 inst(n,dst,t,f,dur,v){ const c=this.ctx;
  switch(n){
   case 'marimba': this.osc(dst,t,f,Math.min(dur,0.5)+0.15,'sine',v,0.003); this.osc(dst,t,f*4,0.08,'sine',v*0.25,0.002); this.osc(dst,t,f*10,0.03,'sine',v*0.06,0.001); break;
   case 'kal': this.osc(dst,t,f,0.9,'sine',v,0.002); this.osc(dst,t,f*5.4,0.12,'sine',v*0.18,0.001); this.osc(dst,t,f*2,0.3,'triangle',v*0.12,0.002); break;
   case 'logdrum': { const o=this.osc(dst,t,f,0.35,'sine',v,0.002); o.frequency.setValueAtTime(f*1.3,t); o.frequency.exponentialRampToValueAtTime(f,t+0.04); break; }
   case 'vibes': { const o=this.osc(dst,t,f,1.2,'sine',v,0.003); const tr=c.createGain(); this.osc(dst,t,f*4,0.25,'sine',v*0.1,0.002); break; }
   case 'harp': case 'lute': { const lp=this.filt(dst,'lowpass',n==='lute'?2200:3200,0.7); this.osc(lp,t,f,n==='lute'?0.55:1.1,'triangle',v,0.002); this.osc(lp,t,f*2,0.2,'sawtooth',v*0.12,0.002); break; }
   case 'pluck': { const lp=this.filt(dst,'lowpass',f*6,2); lp.frequency.setValueAtTime(f*8,t); lp.frequency.exponentialRampToValueAtTime(f*1.5,t+0.3); this.osc(lp,t,f,Math.min(dur+0.2,0.6),'sawtooth',v*0.6,0.003); this.osc(lp,t,f,Math.min(dur+0.2,0.6),'square',v*0.3,0.003,null,7); break; }
   case 'flute': { const lp=this.filt(dst,'lowpass',f*4,0.5); const o=this.osc(lp,t,f,dur+0.1,'sine',v,0.06); const lfo=c.createOscillator(),lg=c.createGain(); lfo.frequency.value=5.2; lg.gain.value=f*0.006; lfo.connect(lg); lg.connect(o.frequency); lfo.start(t+0.15); lfo.stop(t+dur+0.2);
     this.osc(lp,t,f*2,dur+0.1,'sine',v*0.12,0.08); this.nz(dst,t,0.12,v*0.08,'bandpass',f*2,2,0.02); break; }
   case 'fiddle': { const lp=this.filt(dst,'lowpass',3000,1); const o=this.osc(lp,t,f,dur+0.08,'sawtooth',v*0.55,0.03); const lfo=c.createOscillator(),lg=c.createGain(); lfo.frequency.value=6; lg.gain.value=f*0.008; lfo.connect(lg); lg.connect(o.frequency); lfo.start(t+0.08); lfo.stop(t+dur+0.2); break; }
   case 'pad': case 'superpad': case 'organ': case 'strings': {
     const lp=this.filt(dst,'lowpass',n==='superpad'?1600:n==='organ'?2400:1200,0.6); const g=c.createGain(); g.connect(lp); const att=n==='organ'?0.04:n==='strings'?0.12:0.6;
     g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(v,t+Math.min(att,dur*0.4)); g.gain.setValueAtTime(v,t+Math.max(att,dur-0.3)); g.gain.exponentialRampToValueAtTime(0.0001,t+dur+0.4);
     const types=n==='organ'?[['sine',1,1],['sine',2,0.5],['sine',3,0.3],['sine',4,0.15]]:n==='strings'?[['sawtooth',1,0.5],['sawtooth',1.003,0.5]]:n==='superpad'?[['sawtooth',1,0.35],['sawtooth',1.006,0.35],['sawtooth',0.994,0.35],['square',0.5,0.2]]:[['sawtooth',1,0.35],['triangle',1.004,0.6],['sine',2,0.15]];
     types.forEach(([ty,m,a])=>{ const o=c.createOscillator(),og=c.createGain(); o.type=ty; o.frequency.value=f*m; og.gain.value=a; o.connect(og); og.connect(g); o.start(t); o.stop(t+dur+0.5); });
     if(n==='superpad'){ const lfo=c.createOscillator(),lg=c.createGain(); lfo.frequency.value=0.25; lg.gain.value=700; lfo.connect(lg); lg.connect(lp.frequency); lfo.start(t); lfo.stop(t+dur+0.5); }
     break; }
   case 'bell': { const o=c.createOscillator(),m=c.createOscillator(),mg=c.createGain(),g=c.createGain(); o.frequency.value=f; m.frequency.value=f*3.5; mg.gain.setValueAtTime(f*2.2,t); mg.gain.exponentialRampToValueAtTime(f*0.05,t+1.2);
     m.connect(mg); mg.connect(o.frequency); o.connect(g); g.connect(dst); g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(v,t+0.004); g.gain.exponentialRampToValueAtTime(0.0001,t+1.6); o.start(t); m.start(t); o.stop(t+1.7); m.stop(t+1.7); break; }
   case 'epiano': { const o=c.createOscillator(),m=c.createOscillator(),mg=c.createGain(),g=c.createGain(); o.frequency.value=f; m.frequency.value=f; mg.gain.setValueAtTime(f*1.2,t); mg.gain.exponentialRampToValueAtTime(f*0.1,t+0.5);
     m.connect(mg); mg.connect(o.frequency); o.connect(g); g.connect(dst); g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(v,t+0.005); g.gain.exponentialRampToValueAtTime(0.0001,t+Math.max(0.5,dur)+0.4); o.start(t); m.start(t); o.stop(t+dur+1); m.stop(t+dur+1); break; }
   case 'brass': { const lp=this.filt(dst,'lowpass',f*2,2); lp.frequency.setValueAtTime(f*1.2,t); lp.frequency.linearRampToValueAtTime(f*5,t+0.06); lp.frequency.exponentialRampToValueAtTime(f*2.5,t+dur);
     this.osc(lp,t,f,dur+0.08,'sawtooth',v*0.6,0.03); this.osc(lp,t,f,dur+0.08,'sawtooth',v*0.4,0.035,null,9); break; }
   case 'saw': { const lp=this.filt(dst,'lowpass',f*5,4); lp.frequency.setValueAtTime(f*9,t); lp.frequency.exponentialRampToValueAtTime(f*1.3,t+0.18); this.osc(lp,t,f,0.22,'sawtooth',v,0.002); this.osc(lp,t,f*1.005,0.22,'sawtooth',v*0.7,0.002); break; }
   case 'bass': { const lp=this.filt(dst,'lowpass',600,1); this.osc(lp,t,f,Math.min(dur,0.7)+0.1,'triangle',v,0.006); this.osc(lp,t,f,Math.min(dur,0.5),'sine',v*0.8,0.006); break; }
   case 'synbass': { const lp=this.filt(dst,'lowpass',300,6); lp.frequency.setValueAtTime(1400,t); lp.frequency.exponentialRampToValueAtTime(220,t+0.15); this.osc(lp,t,f,Math.min(dur,0.35)+0.05,'sawtooth',v*0.8,0.004); this.osc(dst,t,f/2,Math.min(dur,0.35),'sine',v*0.6,0.004); break; }
   default: this.osc(dst,t,f,dur,'triangle',v);
  } },
 drum(n,dst,t,v){
  switch(n){
   case 'kick': { const o=this.osc(dst,t,55,0.35,'sine',v*1.4,0.002); o.frequency.setValueAtTime(150,t); o.frequency.exponentialRampToValueAtTime(48,t+0.12); break; }
   case 'snare': this.nz(dst,t,0.16,v,'highpass',1500); this.osc(dst,t,190,0.08,'triangle',v*0.5); break;
   case 'clap': [0,0.012,0.024].forEach(d=>this.nz(dst,t+d,0.12,v*0.7,'bandpass',1300,1.2)); break;
   case 'hat': this.nz(dst,t,0.04,v,'highpass',8000); break;
   case 'shaker': this.nz(dst,t,0.06,v,'bandpass',6500,1.5,0.012); break;
   case 'tamb': this.nz(dst,t,0.12,v,'highpass',7000); this.osc(dst,t,5200,0.05,'square',v*0.05); break;
   case 'rim': this.osc(dst,t,1700,0.03,'square',v*0.4); this.nz(dst,t,0.02,v*0.5,'bandpass',3000,2); break;
   case 'conga': { const f=280+Math.random()*60; const o=this.osc(dst,t,f,0.22,'sine',v,0.002); o.frequency.setValueAtTime(f*1.4,t); o.frequency.exponentialRampToValueAtTime(f,t+0.03); break; }
   case 'tom': { const o=this.osc(dst,t,110,0.4,'sine',v,0.002); o.frequency.setValueAtTime(170,t); o.frequency.exponentialRampToValueAtTime(90,t+0.25); this.nz(dst,t,0.05,v*0.2,'lowpass',800); break; }
   case 'frame': { const o=this.osc(dst,t,90,0.3,'sine',v,0.002); o.frequency.setValueAtTime(130,t); o.frequency.exponentialRampToValueAtTime(80,t+0.1); this.nz(dst,t,0.06,v*0.25,'bandpass',900,1); break; }
   case 'zap': { const o=this.osc(dst,t,2000,0.2,'sawtooth',v,0.002); o.frequency.exponentialRampToValueAtTime(120,t+0.2); break; }
  } },
 // ---- SFX
 play(name){ if(!this.ctx||this.ctx.state!=='running') return; const c=this.ctx, t=c.currentTime+0.005, D=this.sfx, f=m=>this.mf(m);
  const arp=(notes,step,inst,v,d)=>notes.forEach((m,i)=>this.inst(inst,D,t+i*step,f(m),d||0.3,v));
  switch(name){
   case 'tap': this.osc(D,t,f(84),0.06,'sine',0.25,0.002); this.osc(D,t,f(96),0.03,'sine',0.08,0.001); break;
   case 'open': { const o=this.osc(D,t,f(72),0.16,'sine',0.25,0.004); o.frequency.exponentialRampToValueAtTime(f(84),t+0.1); this.nz(D,t,0.1,0.05,'bandpass',3000,1.5,0.03); break; }
   case 'close': { const o=this.osc(D,t,f(79),0.14,'sine',0.2,0.004); o.frequency.exponentialRampToValueAtTime(f(67),t+0.1); break; }
   case 'coin': this.osc(D,t,f(88),0.08,'square',0.09); this.osc(D,t+0.07,f(95),0.28,'square',0.09); this.osc(D,t+0.07,f(95),0.28,'sine',0.15); break;
   case 'collect': arp([76,83],0.06,'marimba',0.4); break;
   case 'wood': for(let i=0;i<2;i++){ const o=this.osc(D,t+i*0.09,f(57+i*5),0.12,'triangle',0.35,0.002); this.nz(D,t+i*0.09,0.05,0.18,'bandpass',1200,3); } break;
   case 'stone': this.nz(D,t,0.18,0.35,'lowpass',700,1); this.osc(D,t,f(45),0.15,'sine',0.35); this.nz(D,t+0.07,0.1,0.15,'bandpass',2500,3); break;
   case 'food': { const o=this.osc(D,t,f(72),0.12,'sine',0.3,0.003); o.frequency.exponentialRampToValueAtTime(f(84),t+0.08); this.osc(D,t+0.1,f(79),0.18,'sine',0.25); break; }
   case 'gems': arp([88,92,95,100],0.045,'bell',0.12); break;
   case 'books': this.nz(D,t,0.08,0.2,'highpass',2500); this.nz(D,t+0.08,0.1,0.18,'highpass',2000); this.osc(D,t+0.1,f(79),0.2,'sine',0.15); break;
   case 'shards': arp([91,98,103],0.06,'bell',0.11); this.nz(D,t,0.4,0.05,'highpass',9000,1,0.1); break;
   case 'tickets': arp([79,84],0.08,'epiano',0.25); break;
   case 'build': [0,0.16,0.32].forEach((d,i)=>{ this.osc(D,t+d,f(50+i*2),0.1,'square',0.12,0.001); this.nz(D,t+d,0.07,0.32,'bandpass',1800,2); }); break;
   case 'upgrade': arp([60,64,67,72,76],0.06,'pluck',0.3,0.4); this.nz(D,t,0.5,0.06,'highpass',6000,1,0.3); break;
   case 'done': arp([72,76,79,84],0.08,'marimba',0.45); break;
   case 'levelup': arp([67,72,76,79,84,88],0.07,'bell',0.16); arp([60,67,72],0.0,'brass',0.18,0.7); break;
   case 'fanfare': { [[60,64,67],[60,64,67],[65,69,72],[67,71,74],[72,76,79,84]].forEach((ch,i)=>ch.forEach(m=>this.inst('brass',D,t+[0,0.15,0.3,0.6,0.9][i],f(m),i===4?1.4:0.14,0.12)));
     this.drum('tom',D,t+0.9,0.5); this.drum('kick',D,t+0.9,0.5); arp([84,88,91,96],0.08,'bell',0.1); break; }
   case 'error': this.osc(D,t,f(52),0.18,'square',0.1); this.osc(D,t+0.1,f(47),0.22,'square',0.1); break;
   case 'whoosh': { const b=this.nz(D,t,0.5,0.35,'bandpass',400,1.5,0.15); b.frequency.setValueAtTime(300,t); b.frequency.exponentialRampToValueAtTime(3000,t+0.45); break; }
   case 'buy': this.osc(D,t,f(83),0.08,'square',0.08); arp([88,91],0.08,'bell',0.13); this.nz(D,t,0.05,0.15,'highpass',5000); break;
   case 'sparkle': arp([96,100,103,108],0.035,'bell',0.07); break;
   case 'recruit': arp([67,71,74,79,83,86],0.06,'vibes',0.3); arp([55,62],0.0,'pad',0.08,1.2); break;
   case 'outfit': { const b=this.nz(D,t,0.35,0.25,'bandpass',1200,1,0.1); b.frequency.exponentialRampToValueAtTime(5000,t+0.3); arp([88,91,95,100],0.05,'bell',0.08); break; }
   case 'quest': arp([72,79,84],0.1,'brass',0.18,0.25); arp([84,88,91],0.1,'bell',0.1); break;
   case 'chest': this.drum('tom',D,t,0.4); arp([72,76,79,84,88,91],0.05,'marimba',0.35); this.nz(D,t+0.1,0.6,0.08,'highpass',7000,1,0.2); break;
   case 'pop': { const o=this.osc(D,t,f(70),0.09,'sine',0.35,0.002); o.frequency.exponentialRampToValueAtTime(f(90),t+0.06); break; }
   case 'place': this.drum('frame',D,t,0.5); this.osc(D,t+0.04,f(76),0.15,'sine',0.2); break;
   case 'achievement': arp([76,79,84,88],0.09,'vibes',0.35); arp([96,100],0.09,'bell',0.1); break;
   case 'swipe': { const b=this.nz(D,t,0.18,0.15,'bandpass',1800,2,0.05); b.frequency.exponentialRampToValueAtTime(600,t+0.15); break; }
  } },
};
