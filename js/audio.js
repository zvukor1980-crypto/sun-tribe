'use strict';
// ===== Procedural audio (WebAudio): looping tropical music + synthesized SFX, separate volumes =====
const Audio2={ctx:null,music:null,sfx:null,master:null,started:false,nextT:0,step:0,timer:null,mv:.6,sv:.8,era:1,
 init(){ if(this.ctx) return;
  const AC=window.AudioContext||window.webkitAudioContext; if(!AC) return;
  try{ if(navigator.audioSession) navigator.audioSession.type='playback'; }catch(e){}
  this.ctx=new AC(); const c=this.ctx;
  this.master=c.createGain(); this.master.gain.value=1;
  const comp=c.createDynamicsCompressor(); comp.threshold.value=-14; comp.ratio.value=3;
  this.master.connect(comp); comp.connect(c.destination);
  this.music=c.createGain(); this.music.gain.value=this.mv*0.5; this.music.connect(this.master);
  this.sfx=c.createGain(); this.sfx.gain.value=this.sv; this.sfx.connect(this.master);
  // small reverb-ish delay for music
  const d=c.createDelay(); d.delayTime.value=0.27; const fb=c.createGain(); fb.gain.value=0.22; const wet=c.createGain(); wet.gain.value=0.25;
  this.music.connect(d); d.connect(fb); fb.connect(d); d.connect(wet); wet.connect(this.master);
  this.noise=c.createBuffer(1,c.sampleRate,c.sampleRate); const ch=this.noise.getChannelData(0); for(let i=0;i<ch.length;i++) ch[i]=Math.random()*2-1;
 },
 unlock(){ this.init(); if(!this.ctx) return; if(this.ctx.state!=='running') this.ctx.resume();
  // play silent buffer (iOS unlock)
  try{const b=this.ctx.createBuffer(1,1,22050),s=this.ctx.createBufferSource();s.buffer=b;s.connect(this.ctx.destination);s.start(0);}catch(e){}
  if(!this.started){ this.started=true; this.nextT=this.ctx.currentTime+0.1; this.timer=setInterval(()=>this.sched(),90); }
 },
 setVol(mv,sv){ this.mv=mv; this.sv=sv; if(!this.ctx) return; const t=this.ctx.currentTime;
  this.music.gain.setTargetAtTime(mv*0.5,t,0.05); this.sfx.gain.setTargetAtTime(sv,t,0.05); },
 suspend(){ if(this.ctx&&this.ctx.state==='running') this.ctx.suspend(); },
 resume(){ if(this.ctx&&this.ctx.state!=='running') this.ctx.resume(); },
 // --- instruments
 tone(dst,t,f,dur,type,vol,att=0.005,detune=0){ const c=this.ctx,o=c.createOscillator(),g=c.createGain();
  o.type=type; o.frequency.value=f; o.detune.value=detune; g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(vol,t+att);
  g.gain.exponentialRampToValueAtTime(0.0001,t+dur); o.connect(g); g.connect(dst); o.start(t); o.stop(t+dur+0.05); return o; },
 marimba(t,f,v=0.25){ this.tone(this.music,t,f,0.5,'sine',v); this.tone(this.music,t,f*4,0.12,'sine',v*0.25); },
 noiseHit(dst,t,dur,vol,freq,q=1,type='highpass'){ const c=this.ctx,s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();
  s.buffer=this.noise; f.type=type; f.frequency.value=freq; f.Q.value=q; g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  s.connect(f); f.connect(g); g.connect(dst); s.start(t,Math.random()*0.5); s.stop(t+dur+0.02); },
 // --- music scheduler: 16th-note grid, 4 chords x 16 steps, key shifts by era
 sched(){ const c=this.ctx; if(!c||c.state!=='running'||this.mv<=0.001){ if(c) this.nextT=Math.max(this.nextT,c.currentTime+0.05); return; }
  const spb=60/104/4; // 16th
  while(this.nextT<c.currentTime+0.25){ this.playStep(this.step,this.nextT); this.nextT+=spb; this.step=(this.step+1)%128; } },
 playStep(s,t){ const key=[0,2,-3,5][(this.era-1)%4]; const base=261.63*Math.pow(2,key/12);
  const prog=[[0,4,7],[-3,0,4],[5,9,12],[7,11,14],[0,4,7],[-3,0,4],[-7,-3,0],[7,11,14]];
  const bar=Math.floor(s/16)%8, st=s%16, ch=prog[bar]; const n=x=>base*Math.pow(2,x/12);
  // bass
  if(st===0||st===6||st===10) this.tone(this.music,t,n(ch[0]-24),0.35,'triangle',0.32);
  // marimba arpeggio pattern (pentatonic-ish)
  const pat=[0,null,1,2,null,1,0,null,2,null,1,null,0,2,null,1];
  if(pat[st]!==null){ const iv=ch[pat[st]]+(st>=8&&bar%2?12:0); this.marimba(t,n(iv),0.16); }
  // melody every 2 bars
  const mel=[[12,null,null,14,null,16,null,null,19,null,16,null,14,null,12,null],[16,null,14,null,12,null,9,null,12,null,null,null,null,null,null,null]];
  const m=mel[bar%2][st]; if(m!==null&&bar>=2) this.tone(this.music,t,n(m),0.4,'square',0.035,0.01);
  // shaker + kick
  this.noiseHit(this.music,t,0.04,st%2?0.05:0.09,6000);
  if(st%8===0) { const o=this.tone(this.music,t,110,0.18,'sine',0.5); o.frequency.exponentialRampToValueAtTime(45,t+0.15); }
  if(st===4||st===12) this.noiseHit(this.music,t,0.12,0.12,1800,0.8,'bandpass');
 },
 // --- SFX
 play(name){ if(!this.ctx||this.ctx.state!=='running'||this.sv<=0.001) return; const t=this.ctx.currentTime+0.01, d=this.sfx;
  const T=(f,dur,type,v,dt=0)=>this.tone(d,t+dt,f,dur,type,v);
  switch(name){
   case 'tap': T(880,0.08,'sine',0.25); break;
   case 'open': T(520,0.1,'sine',0.2); T(780,0.12,'sine',0.18,0.05); break;
   case 'close': T(700,0.08,'sine',0.18); T(470,0.1,'sine',0.15,0.04); break;
   case 'coin': T(1318,0.12,'square',0.08); T(1760,0.25,'square',0.08,0.06); break;
   case 'collect': [784,988,1175,1568].forEach((f,i)=>T(f,0.18,'triangle',0.22,i*0.045)); break;
   case 'build': for(let i=0;i<3;i++){ this.noiseHit(d,t+i*0.16,0.07,0.5,900,2,'bandpass'); T(180,0.08,'square',0.12,i*0.16);} break;
   case 'done': [523,659,784,1047].forEach((f,i)=>T(f,0.3,'triangle',0.25,i*0.09)); T(1047,0.6,'sine',0.2,0.36); break;
   case 'levelup': [392,523,659,784,1047,1319].forEach((f,i)=>T(f,0.35,'square',0.09,i*0.08)); [523,659,784].forEach(f=>T(f,0.9,'triangle',0.15,0.5)); break;
   case 'error': T(200,0.18,'sawtooth',0.12); T(150,0.25,'sawtooth',0.12,0.1); break;
   case 'whoosh': this.noiseHit(d,t,0.35,0.3,1200,0.7,'bandpass'); break;
   case 'buy': T(988,0.1,'sine',0.25); T(1319,0.25,'sine',0.25,0.08); this.noiseHit(d,t,0.2,0.1,8000); break;
   case 'sparkle': for(let i=0;i<6;i++) T(1500+Math.random()*1500,0.15,'sine',0.08,i*0.05); break;
  }
 }
};
