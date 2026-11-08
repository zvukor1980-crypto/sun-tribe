const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const storage=new Map();
const ctx=vm.createContext({console,Date,Math,URL,setTimeout:()=>0,clearTimeout(){},setInterval(){},requestAnimationFrame:()=>0,cancelAnimationFrame(){},navigator:{},window:{addEventListener(){}},document:{addEventListener(){},querySelector(){return null}},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},fetch:()=>Promise.reject(Error('offline'))});
for(const f of ['data','data2','audio','game','v3','v3b','v3c'])vm.runInContext(fs.readFileSync(`js/${f}.js`,'utf8'),ctx,{filename:f});
const run=s=>vm.runInContext(s,ctx);
run('S=newState("ru");newHero(STARTERS[0]);S.leader=STARTERS[0];S.started=true');
assert(run('save()'));assert.equal(run('load().leader'),run('STARTERS[0]'));
assert(run('migrate({...S,b:null,h:{...S.h,obsolete:{}}}).b.length===0'));
assert(run('!migrate({...S,h:{...S.h,obsolete:{}}}).h.obsolete'));
assert(run('Object.values(migrate({...S,h:{[S.leader]:{owned:"invalid",o:"missing"}}}).h)[0].owned.includes("base")'));
storage.set('suntribe_album','{}');assert.equal(run('albumGet().length'),0);
run('toast=()=>{};localStorage.setItem=()=>{throw Error("quota")};lastSave=0');assert.equal(run('save()'),false);assert.equal(run('lastSave'),0);
const sw=fs.readFileSync('sw.js','utf8'), assets=vm.runInNewContext(sw.match(/const ASSETS=(\[.*\]);/)[1]);
for(const a of assets)assert(fs.existsSync(a),a);
for(const f of run('Object.values(OUT).flatMap(a=>a.flatMap(o=>[o.img,o.tn].filter(Boolean)))'))assert(fs.existsSync(f),f);
assert(sw.includes("k.startsWith('suntribe-')&&k!==CACHE"));
console.log('PASS: all scripts load, save roundtrip, malformed hero/building recovery, album recovery, quota failure, precache and outfit assets');

run('S=newState("ru")');
for(const k of ['dj','florist']){assert(run(`recruitHero('${k}')`));run(`S.h['${k}'].lvl=4`);assert.equal(run(`recruitHero('${k}')`),false);assert.equal(run(`S.h['${k}'].lvl`),4);}
assert.equal(run('S.r.evn+S.r.evc'),0);assert.equal(run('S.r.coins'),150);assert.equal(run('S.b.length'),0);
assert(run('migrate(JSON.parse(JSON.stringify(S))).h.dj.lvl===4'));
assert.equal(run('recruitHero("carnival")'),false);
console.log('PASS: Luna and Lil recruit without currency or tavern, duplicates preserve progress, save migration preserves ownership');
