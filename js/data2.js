'use strict';
// ===== v2 data: outfits/themes, eras, decor, daily, events, achievements, quests, i18n =====
const ERAS=6;
const THEMES=['gala','royal','space','party','winter','tropic'];
const TH_ICON={gala:'💃',royal:'👑',space:'🚀',party:'🎉',winter:'❄️',tropic:'🌴'};
// effect of each theme while worn
const TH_FX={gala:{ch:14},royal:{ch:8,res:10},space:{ch:10,exp:6},party:{ch:8,hap:2},winter:{ch:8,build:4},tropic:{ch:8,loot:10}};
const OLD_OUT={ // v1 outfit ids -> theme
 guide:{gown:'gala',tribal:'tropic',space:'space',trench:'winter',beach:'party'},
 chief:{gown:'gala',suit:'royal'}, huntress:{violet:'party',trench:'winter'},
 trader:{gold:'gala',emerald:'royal'}, captain:{sailor:'tropic',coat:'winter'}};
const OLD_IMG={guide:{gown:2,tribal:3,space:4,trench:5,beach:6},chief:{gown:2,suit:3},huntress:{violet:2,trench:3},trader:{gold:2,emerald:3},captain:{sailor:2,coat:3}};
const OLD_P={chief:{gown:{gems:25},suit:{coins:3000}},huntress:{violet:{coins:1800},trench:{gems:25}},trader:{gold:{coins:2000},emerald:{gems:25}},
 captain:{sailor:{coins:2200},coat:{gems:30}},guide:{gown:{gems:25},tribal:{coins:1500},space:{hall:10},trench:{coins:2600},beach:{petals:40}}};
const NEW_OUT={architect:['gala','party','royal','space','winter'],astronaut:['gala','party','royal','tropic','winter'],captain:['gala','party','space'],
 chief:['party','space','tropic'],huntress:['gala','royal','tropic'],inventor:['gala','party','royal','space','winter'],knight:['gala','royal','space','tropic','winter'],
 mayor:['gala','royal','space','tropic','winter'],musician:['gala','party','royal','space','winter'],pilot:['gala','party','royal','space','tropic'],
 sailor:['gala','party','royal','tropic','winter'],trader:['party','space','winter'],guide:[]};
function themePrice(th,k,hasTropic){ const m=1+0.12*HER.findIndex(h=>h.k===k);
 switch(th){ case 'gala': return {gems:Math.round(25*m/5)*5}; case 'royal': return {coins:Math.round(4000*m/100)*100};
  case 'party': return {petals:40}; case 'winter': return hasTropic?{coins:Math.round(3000*m/100)*100}:{ach:6};
  case 'tropic': return {quest:15}; case 'space': return {hall:10}; } }
const OUT={};
HER.forEach(h=>{ const k=h.k, L=[{id:'base',th:null,img:'a/h/'+k+'.webp',tn:'a/o/t/'+k+'.webp',m:k,ch:2,p:null}];
 const old=OLD_OUT[k]||{}; const ths=Object.values(old).concat(NEW_OUT[k]); const hasTr=ths.includes('tropic');
 for(const id in old){ const th=old[id], n=OLD_IMG[k][id]; L.push({id,th,img:`a/o/${k}_${n}.webp`,tn:`a/o/t/${k}_${n}.webp`,m:`${k}_${n}`,ch:TH_FX[th].ch,p:OLD_P[k][id]}); }
 NEW_OUT[k].forEach(th=>L.push({id:th,th,img:`a/o/${k}_${th}.webp`,tn:`a/o/t/${k}_${th}.webp`,m:`${k}_${th}`,ch:TH_FX[th].ch,p:themePrice(th,k,hasTr)}));
 const ord=[null].concat(THEMES); L.sort((a,b)=>ord.indexOf(a.th)-ord.indexOf(b.th)); OUT[k]=L; });
const MASKH={"architect": null, "astronaut": 275, "captain": 225, "chief": 5, "guide": 335, "huntress": 125, "inventor": 5, "knight": 215, "mayor": null, "musician": 345, "pilot": 55, "sailor": 225, "trader": 185, "architect_gala": 185, "architect_party": 275, "architect_royal": 225, "architect_space": null, "architect_winter": 345, "astronaut_gala": 275, "astronaut_party": 335, "astronaut_royal": 35, "astronaut_tropic": 5, "astronaut_winter": 195, "captain_2": 225, "captain_3": 5, "captain_gala": 5, "captain_party": 335, "captain_space": 195, "chief_2": null, "chief_3": null, "chief_party": 335, "chief_space": 35, "chief_tropic": null, "guide_1": 335, "guide_2": null, "guide_3": 5, "guide_4": 55, "guide_5": 355, "guide_6": 55, "huntress_2": 275, "huntress_3": 5, "huntress_gala": 125, "huntress_royal": 5, "huntress_tropic": 175, "inventor_gala": 355, "inventor_party": 195, "inventor_royal": 295, "inventor_space": 75, "inventor_winter": null, "knight_gala": 225, "knight_royal": 275, "knight_space": 195, "knight_tropic": 75, "knight_winter": 355, "mayor_gala": 35, "mayor_royal": 285, "mayor_space": 185, "mayor_tropic": 125, "mayor_winter": 5, "musician_gala": 295, "musician_party": 35, "musician_royal": 135, "musician_space": 335, "musician_winter": 355, "pilot_gala": 55, "pilot_party": null, "pilot_royal": 5, "pilot_space": 215, "pilot_tropic": 185, "sailor_gala": 5, "sailor_party": 335, "sailor_royal": 225, "sailor_tropic": 35, "sailor_winter": 185, "trader_2": 35, "trader_3": 155, "trader_party": 335, "trader_space": 265, "trader_winter": 225};

// decor: hap = +% happiness (production bonus)
const DECOR=[
 {k:'flowers',  hap:1,   p:{coins:400},             hall:1},
 {k:'balloons', hap:2,   p:{petals:30},             hall:1},
 {k:'lantern',  hap:1.5, p:{coins:900,wood:300},    hall:2},
 {k:'totem',    hap:2,   p:{wood:800,stone:300},    hall:3},
 {k:'arch',     hap:3,   p:{petals:60},             hall:4},
 {k:'fountain', hap:3,   p:{coins:3000,stone:1200}, hall:5},
 {k:'gazebo',   hap:3,   p:{coins:2000,wood:3000},  hall:6},
 {k:'sunstatue',hap:4,   p:{gems:40},               hall:7},
 {k:'obelisk',  hap:4,   p:{coins:5000,stone:6000}, hall:9},
 {k:'crystal',  hap:5,   p:{gems:60,petals:40},     hall:13},
];
const DECOR_SPOTS=[[575,632],[715,668],[372,612],[540,770],[730,768],[555,930],[705,935],[1060,800],[545,1110],[760,1095],[440,1072],[1065,635]];

const LOGIN=[{coins:300},{wood:300,food:300},{gems:10},{tickets:1},{petals:25},{shards:10},{gems:30,petals:30}];
const EVENTS=[{k:'ev_wood',res:'wood',m:1.5},{k:'ev_harvest',res:'food',m:1.5},{k:'ev_gold',res:'coins',m:1.5},{k:'ev_stone',res:'stone',m:1.5},
 {k:'ev_fashion',disc:0.3},{k:'ev_voyage',exp:0.3},{k:'ev_builders',build:0.25},{k:'ev_festival',hap:10}];
const DTASKS=[{k:'coll',n:15},{k:'upg',n:2},{k:'exp',n:1},{k:'train',n:3},{k:'color',n:1},{k:'gift',n:1},{k:'collall',n:2},{k:'wear',n:2}];
const ACH=[
 {k:'coll100',m:'coll',n:100,g:10},{k:'coll1000',m:'coll',n:1000,g:30},{k:'build10',m:'builds',n:10,g:10},{k:'build60',m:'builds',n:60,g:30},
 {k:'hall5',m:'hall',n:5,g:15},{k:'hall10',m:'hall',n:10,g:30},{k:'hall16',m:'hall',n:16,g:80},
 {k:'her5',m:'her',n:5,g:15},{k:'her13',m:'her',n:13,g:60},{k:'out5',m:'outs',n:5,g:15},{k:'out20',m:'outs',n:20,g:40},{k:'out50',m:'outs',n:50,g:100},
 {k:'color10',m:'colors',n:10,g:15},{k:'exp3',m:'explored',n:3,g:15},{k:'exp9',m:'explored',n:9,g:40},{k:'lv10',m:'lv',n:10,g:15},{k:'lv25',m:'lv',n:25,g:40},
 {k:'star5',m:'star',n:5,g:50},{k:'decor5',m:'decor',n:5,g:20},{k:'login7',m:'logins',n:7,g:25},{k:'quest40',m:'quests',n:40,g:40},{k:'parade',m:'parade',n:1,g:30},
 {k:'petals300',m:'petals',n:300,g:25},{k:'chest10',m:'chests',n:10,g:20}];

// quest chain (v1's 27 kept in order, new ones inserted)
const Q=(ty,a,n,r)=>({g:[ty,a,n],r});
QUESTS.push(
 Q('build','sawmill',1,{coins:60,xp:20}), Q('collect','wood',20,{coins:40,xp:20}), Q('build','house',1,{wood:30,xp:25}), Q('collect','coins',60,{wood:40,xp:25}),
 Q('build','farm',1,{coins:80,xp:30}), Q('assign',null,1,{gems:5,xp:30}), Q('upgrade','hall',2,{coins:150,xp:40}),
 Q('daily',null,1,{petals:10,xp:30}),
 Q('build','quarry',1,{wood:80,xp:40}), Q('build','tower',1,{stone:60,xp:50}), Q('build','tavern',1,{tickets:1,xp:50}), Q('own',null,2,{gems:10,xp:60}),
 Q('collall',null,1,{coins:200,xp:40}),
 Q('herolvl',null,2,{food:150,xp:60}), Q('explore',null,1,{gems:10,xp:70}), Q('upgrade','hall',3,{coins:400,xp:80}),
 Q('decor',null,1,{petals:20,xp:60}),
 Q('build','market',1,{wood:150,stone:80,xp:80}), Q('color',null,1,{gems:10,xp:60}), Q('build','boutique',1,{coins:600,xp:90}), Q('outfit',null,1,{tickets:1,xp:100}),
 Q('move',null,1,{gems:5,xp:60}),
 Q('collect','coins',3000,{gems:15,xp:100}), Q('upgrade','hall',4,{stone:300,xp:120}),
 Q('chest',null,1,{petals:15,xp:80}),
 Q('build','workshop',1,{books:5,xp:120}), Q('bldlvl',null,5,{gems:20,xp:150}),
 Q('decor',null,3,{petals:30,xp:120}),
 Q('upgrade','hall',5,{gems:30,shards:10,xp:200}), Q('own',null,4,{gems:20,xp:200}),
 Q('outfits',null,3,{petals:30,xp:150}),
 Q('explore',null,3,{tickets:2,xp:250}), Q('herostar',null,2,{gems:30,xp:250}),
 Q('ach',null,3,{gems:20,xp:200}), Q('upgrade','hall',6,{coins:5000,xp:300}), Q('build','house',3,{wood:2000,xp:250}), Q('collect','food',3000,{gems:20,xp:250}),
 Q('upgrade','hall',7,{stone:3000,xp:350}), Q('outfits',null,6,{petals:40,gems:20,xp:300}), Q('explore',null,5,{tickets:2,xp:350}), Q('own',null,6,{gems:30,xp:350}),
 Q('upgrade','hall',8,{gems:40,xp:400}), Q('decor',null,6,{petals:40,xp:350}), Q('herolvl',null,15,{books:15,xp:400}), Q('upgrade','hall',9,{shards:20,xp:450}),
 Q('bldlvl',null,12,{gems:40,xp:450}), Q('ach',null,8,{gems:30,xp:400}),
 Q('upgrade','hall',10,{gems:80,shards:30,xp:600}),
 Q('outfits',null,10,{petals:60,xp:500}), Q('explore',null,7,{tickets:3,xp:550}), Q('upgrade','hall',12,{gems:60,xp:700}), Q('own',null,9,{gems:40,xp:650}),
 Q('upgrade','hall',13,{gems:80,shards:30,xp:800}), Q('outfits',null,15,{petals:80,gems:30,xp:700}), Q('herostar',null,4,{gems:60,xp:800}),
 Q('upgrade','hall',16,{gems:150,shards:60,xp:1500}), Q('own',null,13,{gems:100,xp:1200})
);
const OLDQ=[0,1,2,3,4,5,6,8,9,10,11,13,14,15,17,18,19,20,22,23,25,26,28,29,31,32,47]; // v1 quest index -> v2 index

const L2={
ru:{era1:'Каменный век',era2:'Античность',era3:'Средневековье',era4:'Индустриальная эра',era5:'Современность',era6:'Будущее',
 th_gala:'Гала',th_royal:'Королевский',th_space:'Космос',th_party:'Вечеринка',th_winter:'Зима',th_tropic:'Тропики',
 o_gala:'Гала-лак',o_royal:'Королевский лак',o_party:'Лак для вечеринки',o_winter:'Зимний лак',o_tropic:'Тропический лак',
 fx_ch:'💖 Обаяние +{v}',fx_res:'⛏️ Бонус героини +{v}%',fx_exp:'🗺️ Экспедиции −{v}%',fx_hap:'😊 Счастье +{v}%',fx_build:'🔨 Стройка −{v}%',fx_loot:'🎁 Добыча экспедиций +{v}%',
 setb:'Коллекция',set3:'3 наряда: +5% к бонусу',set6:'Все 6: +15% к бонусу и 💖+5',parade:'Парад «{t}»: 3+ героини в одной теме → +10% ко всему производству',parade_on:'🎊 Парад «{t}» активен: +10% производство',
 un_quest:'Задание №{n}',un_ach:'Достижений: {n}',un_hall:'Ратуша ур. {n}',
 decor:'Декор',decor_h:'Украшения повышают счастье племени (+% к производству). Нажмите на предмет, затем на свободное место ✨.',place:'Поставить',placing:'Выберите место для украшения',stash:'Убрать',instock:'на складе: {n}',nospot:'Нет свободных мест',
 daily:'Награда дня',day:'День {n}',claim_d:'Забрать',come_back:'Возвращайтесь завтра!',streak:'Серия входов: {n}',
 chest:'Сундук',chest_open:'Открыть сундук',chest_in:'Сундук через {t}',
 events:'События',event_today:'Событие дня',dtasks:'Задания дня',dall:'Все 3 задания: 💎10 🌸20',petals:'Лепестки',petals_h:'🌸 Лепестки — валюта событий: наряды и декор.',
 ev_wood:'Лесной праздник: 🪵 +50%',ev_harvest:'Праздник урожая: 🍖 +50%',ev_gold:'Золотая лихорадка: 🪙 +50%',ev_stone:'День каменщика: 🪨 +50%',
 ev_fashion:'Неделя моды: наряды −30%',ev_voyage:'Попутный ветер: экспедиции −30% времени',ev_builders:'День строителя: стройка −25% времени',ev_festival:'Фестиваль: счастье +10%',
 dt_coll:'Соберите урожай {n} раз',dt_upg:'Начните стройку/улучшение {n} раз',dt_exp:'Отправьте экспедицию',dt_train:'Потренируйте героинь {n} раз',dt_color:'Перекрасьте наряд',
 dt_gift:'Заберите подарок в магазине',dt_collall:'Используйте «Собрать всё» {n} раза',dt_wear:'Смените наряд {n} раза',
 ach:'Достижения',ach_n:'{a}/{b}',
 a_coll100:'Сборщица: 100 сборов',a_coll1000:'Мастер урожая: 1000 сборов',a_build10:'Строитель: 10 построек',a_build60:'Архитектор мечты: 60 построек',
 a_hall5:'Ратуша ур. 5',a_hall10:'Ратуша ур. 10',a_hall16:'Город будущего',a_her5:'5 героинь в племени',a_her13:'Все 13 героинь',
 a_out5:'Модница: 5 нарядов',a_out20:'Икона стиля: 20 нарядов',a_out50:'Королева гардероба: 50 нарядов',a_color10:'Колористка: 10 перекрасок',
 a_exp3:'Открыть 3 региона',a_exp9:'Вся карта',a_lv10:'Уровень 10',a_lv25:'Уровень 25',a_star5:'Героиня 5★',a_decor5:'5 украшений',
 a_login7:'7 дней в игре',a_quest40:'40 заданий',a_parade:'Устроить парад нарядов',a_petals300:'300 лепестков',a_chest10:'10 сундуков',
 collall:'Собрать всё',collall_n:'Собрано: {s}',nothing:'Пока нечего собирать',
 move:'Переместить',flip:'Отразить',movehint:'Нажмите на свободный участок, чтобы переместить здание',cancel:'Отмена',
 offline_t:'С возвращением!',offline_away:'Вас не было: {t}',offline_built:'Построено: {n}',offline_res:'Накопилось на складах:',offline_exp:'Экспедиции вернулись: {n}',
 nowplay:'Сейчас играет',track:'Мелодия',musicoff:'Музыка выключена',
 tut2:'Отлично! Собирайте ресурсы — нажмите на здание с пузырьком. Или кнопку 🧺 «Собрать всё».',tut3:'Задания внизу ведут вас. Нажмите «Вперёд», и я покажу, что делать!',
 tut4:'Пригласите новых героинь в Таверне 🍹, а в Гардеробе 👗 подберите им наряды — наряды дают бонусы!',go:'Вперёд',
 exps:'Экспедиции {a}/{b}',expslots:'Слоты экспедиций растут с уровнем Башни (ур. 4 и 8)',noslot:'Все экспедиционные слоты заняты',
 q_daily:'Заберите награду дня',q_collall:'Нажмите «Собрать всё»',q_decor:'Поставьте украшений: {n}',q_move:'Переместите здание',q_chest:'Откройте сундук',
 q_outfits:'Купите нарядов (всего): {n}',q_ach:'Получите достижений: {n}',
 d_flowers:'Клумба',d_balloons:'Шары',d_lantern:'Фонарь',d_totem:'Тотем',d_arch:'Цветочная арка',d_fountain:'Фонтан',d_gazebo:'Беседка',d_sunstatue:'Статуя Солнца',d_obelisk:'Обелиск',d_crystal:'Кристалл',
 newera_s:'Здания обрели новый облик!',hap:'Счастье',owned_out:'Нарядов: {n}',theme:'Тема',lockedby:'Открывается: {x}'},
en:{era1:'Stone Age',era2:'Antiquity',era3:'Middle Ages',era4:'Industrial Age',era5:'Modern Age',era6:'Future',
 th_gala:'Gala',th_royal:'Royal',th_space:'Space',th_party:'Party',th_winter:'Winter',th_tropic:'Tropic',
 o_gala:'Gala lacquer',o_royal:'Royal lacquer',o_party:'Party lacquer',o_winter:'Winter lacquer',o_tropic:'Tropic lacquer',
 fx_ch:'💖 Charm +{v}',fx_res:'⛏️ Heroine bonus +{v}%',fx_exp:'🗺️ Expeditions −{v}%',fx_hap:'😊 Happiness +{v}%',fx_build:'🔨 Build time −{v}%',fx_loot:'🎁 Expedition loot +{v}%',
 setb:'Collection',set3:'3 outfits: +5% bonus',set6:'All 6: +15% bonus and 💖+5',parade:'“{t}” parade: 3+ heroines in one theme → +10% all production',parade_on:'🎊 “{t}” parade active: +10% production',
 un_quest:'Quest #{n}',un_ach:'Achievements: {n}',un_hall:'Town Hall Lv. {n}',
 decor:'Decor',decor_h:'Decorations raise tribe happiness (+% production). Tap an item, then a free spot ✨.',place:'Place',placing:'Choose a spot for the decoration',stash:'Remove',instock:'in stock: {n}',nospot:'No free spots',
 daily:'Daily reward',day:'Day {n}',claim_d:'Claim',come_back:'Come back tomorrow!',streak:'Login streak: {n}',
 chest:'Chest',chest_open:'Open chest',chest_in:'Chest in {t}',
 events:'Events',event_today:'Event of the day',dtasks:'Daily tasks',dall:'All 3 tasks: 💎10 🌸20',petals:'Petals',petals_h:'🌸 Petals are the event currency: outfits and decor.',
 ev_wood:'Forest festival: 🪵 +50%',ev_harvest:'Harvest festival: 🍖 +50%',ev_gold:'Gold rush: 🪙 +50%',ev_stone:'Masons’ day: 🪨 +50%',
 ev_fashion:'Fashion week: outfits −30%',ev_voyage:'Fair wind: expeditions −30% time',ev_builders:'Builders’ day: build −25% time',ev_festival:'Festival: happiness +10%',
 dt_coll:'Collect {n} times',dt_upg:'Start building/upgrading {n} times',dt_exp:'Send an expedition',dt_train:'Train heroines {n} times',dt_color:'Recolor an outfit',
 dt_gift:'Claim the shop gift',dt_collall:'Use “Collect all” {n} times',dt_wear:'Change outfits {n} times',
 ach:'Achievements',ach_n:'{a}/{b}',
 a_coll100:'Gatherer: 100 collections',a_coll1000:'Harvest master: 1000 collections',a_build10:'Builder: 10 constructions',a_build60:'Dream architect: 60 constructions',
 a_hall5:'Town Hall Lv. 5',a_hall10:'Town Hall Lv. 10',a_hall16:'City of the Future',a_her5:'5 heroines in the tribe',a_her13:'All 13 heroines',
 a_out5:'Fashionista: 5 outfits',a_out20:'Style icon: 20 outfits',a_out50:'Wardrobe queen: 50 outfits',a_color10:'Colorist: 10 recolors',
 a_exp3:'Explore 3 regions',a_exp9:'Whole map',a_lv10:'Level 10',a_lv25:'Level 25',a_star5:'A 5★ heroine',a_decor5:'5 decorations',
 a_login7:'7 days of play',a_quest40:'40 quests',a_parade:'Hold an outfit parade',a_petals300:'300 petals',a_chest10:'10 chests',
 collall:'Collect all',collall_n:'Collected: {s}',nothing:'Nothing to collect yet',
 move:'Move',flip:'Flip',movehint:'Tap a free plot to move the building',cancel:'Cancel',
 offline_t:'Welcome back!',offline_away:'You were away: {t}',offline_built:'Finished: {n}',offline_res:'Waiting in storage:',offline_exp:'Expeditions returned: {n}',
 nowplay:'Now playing',track:'Tune',musicoff:'Music is off',
 tut2:'Great! Collect resources — tap a building with a bubble. Or the 🧺 “Collect all” button.',tut3:'Quests at the bottom guide you. Tap “Go” and I’ll show you what to do!',
 tut4:'Invite new heroines in the Tavern 🍹 and pick outfits in the Wardrobe 👗 — outfits give bonuses!',go:'Go',
 exps:'Expeditions {a}/{b}',expslots:'Expedition slots grow with Tower level (Lv. 4 and 8)',noslot:'All expedition slots are busy',
 q_daily:'Claim the daily reward',q_collall:'Tap “Collect all”',q_decor:'Place decorations: {n}',q_move:'Move a building',q_chest:'Open the chest',
 q_outfits:'Buy outfits (total): {n}',q_ach:'Earn achievements: {n}',
 d_flowers:'Flower bed',d_balloons:'Balloons',d_lantern:'Lantern',d_totem:'Totem',d_arch:'Flower arch',d_fountain:'Fountain',d_gazebo:'Gazebo',d_sunstatue:'Sun statue',d_obelisk:'Obelisk',d_crystal:'Crystal',
 newera_s:'Buildings got a new look!',hap:'Happiness',owned_out:'Outfits: {n}',theme:'Theme',lockedby:'Unlocks: {x}'},
he:{era1:'תקופת האבן',era2:'העת העתיקה',era3:'ימי הביניים',era4:'העידן התעשייתי',era5:'העידן המודרני',era6:'העתיד',
 th_gala:'גאלה',th_royal:'מלכותי',th_space:'חלל',th_party:'מסיבה',th_winter:'חורף',th_tropic:'טרופי',
 o_gala:'לכת גאלה',o_royal:'לכה מלכותית',o_party:'לכת מסיבה',o_winter:'לכת חורף',o_tropic:'לכה טרופית',
 fx_ch:'💖 קסם +{v}',fx_res:'⛏️ בונוס גיבורה +{v}%',fx_exp:'🗺️ משלחות −{v}%',fx_hap:'😊 אושר +{v}%',fx_build:'🔨 זמן בנייה −{v}%',fx_loot:'🎁 שלל משלחות +{v}%',
 setb:'אוסף',set3:'3 תלבושות: ‎+5% בונוס',set6:'כל 6: ‎+15% בונוס ו־💖+5',parade:'מצעד „{t}”: 3+ גיבורות באותו נושא → ‎+10% לכל הייצור',parade_on:'🎊 מצעד „{t}” פעיל: ‎+10% ייצור',
 un_quest:'משימה #{n}',un_ach:'הישגים: {n}',un_hall:'בניין עירייה רמה {n}',
 decor:'קישוטים',decor_h:'קישוטים מעלים את אושר השבט (‎+% ייצור). הקישו על פריט ואז על מקום פנוי ✨.',place:'הצבה',placing:'בחרו מקום לקישוט',stash:'הסרה',instock:'במחסן: {n}',nospot:'אין מקומות פנויים',
 daily:'פרס יומי',day:'יום {n}',claim_d:'לקבל',come_back:'חזרו מחר!',streak:'רצף כניסות: {n}',
 chest:'תיבה',chest_open:'לפתוח תיבה',chest_in:'תיבה בעוד {t}',
 events:'אירועים',event_today:'אירוע היום',dtasks:'משימות יומיות',dall:'כל 3 המשימות: 💎10 🌸20',petals:'עלי כותרת',petals_h:'🌸 עלי כותרת — מטבע אירועים: תלבושות וקישוטים.',
 ev_wood:'חג היער: 🪵 ‎+50%',ev_harvest:'חג הקציר: 🍖 ‎+50%',ev_gold:'בהלת זהב: 🪙 ‎+50%',ev_stone:'יום הבנאים באבן: 🪨 ‎+50%',
 ev_fashion:'שבוע אופנה: תלבושות −30%',ev_voyage:'רוח גבית: משלחות −30% זמן',ev_builders:'יום הבנאי: בנייה −25% זמן',ev_festival:'פסטיבל: אושר ‎+10%',
 dt_coll:'אספו {n} פעמים',dt_upg:'התחילו בנייה/שדרוג {n} פעמים',dt_exp:'שלחו משלחת',dt_train:'אמנו גיבורות {n} פעמים',dt_color:'צבעו תלבושת',
 dt_gift:'קחו את המתנה בחנות',dt_collall:'השתמשו ב„אסוף הכול” {n} פעמים',dt_wear:'החליפו תלבושת {n} פעמים',
 ach:'הישגים',ach_n:'{a}/{b}',
 a_coll100:'אוספת: 100 איסופים',a_coll1000:'אלופת הקציר: 1000 איסופים',a_build10:'בונה: 10 בניות',a_build60:'אדריכלית חלומות: 60 בניות',
 a_hall5:'עירייה רמה 5',a_hall10:'עירייה רמה 10',a_hall16:'עיר העתיד',a_her5:'5 גיבורות בשבט',a_her13:'כל 13 הגיבורות',
 a_out5:'פאשניסטה: 5 תלבושות',a_out20:'אייקון סטייל: 20 תלבושות',a_out50:'מלכת הארון: 50 תלבושות',a_color10:'צבעית: 10 צביעות',
 a_exp3:'לגלות 3 אזורים',a_exp9:'כל המפה',a_lv10:'רמה 10',a_lv25:'רמה 25',a_star5:'גיבורה 5★',a_decor5:'5 קישוטים',
 a_login7:'7 ימי משחק',a_quest40:'40 משימות',a_parade:'לערוך מצעד תלבושות',a_petals300:'300 עלי כותרת',a_chest10:'10 תיבות',
 collall:'אסוף הכול',collall_n:'נאסף: {s}',nothing:'עדיין אין מה לאסוף',
 move:'הזזה',flip:'היפוך',movehint:'הקישו על מגרש פנוי כדי להזיז את המבנה',cancel:'ביטול',
 offline_t:'ברוכים השבים!',offline_away:'לא הייתם: {t}',offline_built:'הושלמו: {n}',offline_res:'ממתין במחסנים:',offline_exp:'משלחות חזרו: {n}',
 nowplay:'מתנגן עכשיו',track:'מנגינה',musicoff:'המוזיקה כבויה',
 tut2:'מצוין! אספו משאבים — הקישו על מבנה עם בועה. או על כפתור 🧺 „אסוף הכול”.',tut3:'המשימות למטה מובילות אתכם. הקישו „קדימה” ואראה מה לעשות!',
 tut4:'הזמינו גיבורות חדשות בטברנה 🍹 ובחרו תלבושות בארון 👗 — תלבושות נותנות בונוסים!',go:'קדימה',
 exps:'משלחות {a}/{b}',expslots:'משבצות משלחת גדלות עם רמת המגדל (רמה 4 ו־8)',noslot:'כל משבצות המשלחת תפוסות',
 q_daily:'קחו את הפרס היומי',q_collall:'הקישו „אסוף הכול”',q_decor:'הציבו קישוטים: {n}',q_move:'הזיזו מבנה',q_chest:'פתחו את התיבה',
 q_outfits:'קנו תלבושות (סה״כ): {n}',q_ach:'השיגו הישגים: {n}',
 d_flowers:'ערוגה',d_balloons:'בלונים',d_lantern:'פנס',d_totem:'טוטם',d_arch:'קשת פרחים',d_fountain:'מזרקה',d_gazebo:'ביתן',d_sunstatue:'פסל השמש',d_obelisk:'אובליסק',d_crystal:'קריסטל',
 newera_s:'המבנים קיבלו מראה חדש!',hap:'אושר',owned_out:'תלבושות: {n}',theme:'נושא',lockedby:'נפתח: {x}'}};
for(const l in L2) Object.assign(L[l],L2[l]);
