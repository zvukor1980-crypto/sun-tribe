'use strict';
// ===== Static game data: buildings, heroines, outfits, regions, quests, shop, i18n =====
const VERSION='3.0.0';
const RES=['coins','wood','stone','food','gems','tickets','books','shards','petals'];
const RI={coins:'🪙',wood:'🪵',stone:'🪨',food:'🍖',gems:'💎',tickets:'🎟️',books:'📕',shards:'⭐',petals:'🌸',xp:'✨',charm:'💖'};
// res: produced resource, rate: per minute at L1, cost at L1, time sec at L1, hall: unlock hall level, max: count
const BLD={
 hall:    {res:'coins', rate:2,   cost:{coins:120,wood:60,stone:30}, time:20, hall:0, max:1, slots:1},
 house:   {res:'coins', rate:4,   cost:{coins:40,wood:20},           time:10, hall:1, max:4},
 sawmill: {res:'wood',  rate:3,   cost:{coins:30},                   time:10, hall:1, max:2},
 farm:    {res:'food',  rate:3,   cost:{coins:50,wood:20},           time:15, hall:1, max:3},
 quarry:  {res:'stone', rate:2,   cost:{coins:80,wood:40},           time:25, hall:2, max:2},
 tower:   {res:'shards',rate:0.06,cost:{coins:150,wood:80,stone:30}, time:40, hall:2, max:1},
 tavern:  {res:'tickets',rate:1/240,cost:{coins:200,wood:90,stone:40},time:45, hall:2, max:1},
 market:  {res:'coins', rate:9,   cost:{coins:180,wood:70,stone:40}, time:60, hall:3, max:2},
 boutique:{res:'gems',  rate:0.04,cost:{coins:260,wood:100,stone:80},time:60, hall:3, max:1},
 workshop:{res:'books', rate:0.25,cost:{coins:300,wood:120,stone:100},time:90,hall:4, max:1},
};
const BORDER=['hall','house','sawmill','farm','quarry','tower','tavern','market','boutique','workshop'];
// plot positions (center of tile) on 1200x1200 island
const PLOTS=[[640,700],[470,600],[800,610],[440,790],[630,840],[820,800],[560,500],[300,700],
             [470,960],[790,970],[960,700],[310,880],[640,1060],[930,880],[180,800],[1000,560]];
const BASE_PLOTS=8;

const HER=[
 {k:'chief',    res:'wood',  base:10, perk:'build', pv:15, st:1, c:'#B03A2E', rec:null},
 {k:'guide',    res:'books', base:10, perk:'xp',    pv:15, st:1, c:'#E8418E', rec:null},
 {k:'huntress', res:'food',  base:15, perk:null,    pv:0,  st:1, c:'#1E8A4C', rec:null},
 {k:'trader',   res:'coins', base:15, perk:null,    pv:0,  st:1, c:'#14A8A0', rec:null},
 {k:'captain',  res:'coins', base:8,  perk:'exp',   pv:20, st:1, c:'#1D3F8F', rec:null},
 {k:'knight',   res:'stone', base:15, perk:null,    pv:0,  c:'#3A62C2', rec:{t:'tickets',v:1}},
 {k:'sailor',   res:'food',  base:10, perk:'exp',   pv:15, c:'#1D5FB8', rec:{t:'tickets',v:1}},
 {k:'musician', res:'coins', base:10, perk:'charm', pv:20, c:'#C2187A', rec:{t:'coins',v:2500}},
 {k:'architect',res:'stone', base:8,  perk:'cost',  pv:15, c:'#14A89A', rec:{t:'hall',v:4}},
 {k:'pilot',    res:'wood',  base:10, perk:'loot',  pv:25, c:'#5E7A2E', rec:{t:'tickets',v:2}},
 {k:'inventor', res:'books', base:15, perk:null,    pv:0,  c:'#8A1F2E', rec:{t:'hall',v:5}},
 {k:'astronaut',res:'all',   base:5,  perk:null,    pv:0,  c:'#6A3FD8', rec:{t:'hall',v:10}},
 {k:'mayor',    res:'all',   base:8,  perk:'cost',  pv:10, c:'#B8892A', rec:{t:'hall',v:8}},
];
const STARTERS=['chief','guide','huntress','trader','captain'];
const SYNERGY=[['huntress','sailor'],['trader','musician'],['chief','architect'],['knight','architect'],['captain','pilot'],['guide','inventor']];
// outfits: id, img, charm, price
const HUES=[null,330,0,25,48,135,180,215,275];

// map regions: % position on map, tower level req, food cost, minutes, rewards
const REG=[
 {k:'home',  x:24.8,y:51.4, tw:0, food:0,   min:0},
 {k:'jungle',x:33.8,y:26.3, tw:1, food:80,  min:2,  rw:{gems:15,shards:5,tickets:1}, bon:'wood'},
 {k:'volcano',x:49.9,y:32,  tw:2, food:250, min:5,  rw:{gems:20,shards:8,books:3}, bon:'stone'},
 {k:'pyramids',x:60.8,y:50.3,tw:3,food:600, min:12, rw:{gems:30,shards:10,tickets:1}, bon:'coins'},
 {k:'castle',x:62.8,y:68.6, tw:5, food:1500,min:25, rw:{gems:40,shards:15,books:8}, bon:'food'},
 {k:'glacier',x:63.4,y:30.9,tw:6, food:3000,min:45, rw:{gems:50,shards:20,tickets:2}, bon:'books'},
 {k:'factory',x:75.6,y:60.6,tw:8, food:6000,min:75, rw:{gems:60,shards:25,books:15}, bon:'stone'},
 {k:'city',  x:76.3,y:40,   tw:10,food:12000,min:120,rw:{gems:80,shards:30,tickets:3}, bon:'coins'},
 {k:'dome',  x:90.4,y:56.1, tw:12,food:25000,min:180,rw:{gems:120,shards:50,tickets:5}, bon:'all'},
];
// quests: g=[type, arg, n], r=reward
const QUESTS=[];
function genQuest(i){ // endless quests after the chain
 const n=i-QUESTS.length, c=n%5, k=Math.floor(n/5);
 if(c===0) return {g:['upgrade','hall',17+k],r:{gems:30+5*k,xp:500+100*k}};
 if(c===1) return {g:['bldlvl',null,20+2*k],r:{shards:10+2*k,xp:300+60*k}};
 if(c===2) return {g:['collect','coins',Math.round(20000*Math.pow(1.4,k))],r:{gems:20+3*k,xp:300+60*k}};
 if(c===3) return {g:['herolvl',null,20+3*k],r:{books:10+3*k,tickets:1,xp:300+60*k}};
 return {g:['explore',null,REG.length+k],r:{gems:25+4*k,shards:10,xp:300+60*k}};
}
const SHOP=[
 {id:'gift',  give:{coins:300,food:100},price:null,free:4*3600e3},
 {id:'coins1',give:{coins:2000},price:{gems:10}},
 {id:'wood1', give:{wood:600},  price:{gems:10}},
 {id:'stone1',give:{stone:400}, price:{gems:12}},
 {id:'food1', give:{food:800},  price:{gems:10}},
 {id:'ticket',give:{tickets:1}, price:{gems:30}},
 {id:'books', give:{books:10},  price:{gems:20}},
 {id:'shards',give:{shards:10}, price:{gems:25}},
 {id:'gems1', give:{gems:20},   price:{coins:5000}},
 {id:'builder',give:{builder:1},price:{gems:60},once:true},
];

const L={
ru:{title:'Племя Солнца',tap:'Нажмите, чтобы начать',lang:'Язык',story1:'Буря разбила наш корабль… Мы на пустом острове!',story2:'Выберите героиню, которая возглавит племя. Остальных позовёте позже в таверне.',choose:'Выбрать',startw:'Начать игру',
 village:'Деревня',heroes:'Героини',wardrobe:'Гардероб',map:'Карта',shop:'Магазин',quests:'Задания',settings:'Настройки',team:'Команда',tavern:'Таверна',
 lvl:'Ур.',level:'Уровень',build:'Построить',upgrade:'Улучшить',collect:'Собрать',speed:'Ускорить',close:'Закрыть',buy:'Купить',free:'Бесплатно',wear:'Надеть',worn:'Надето',owned:'Есть',locked:'Закрыто',
 needhall:'Нужна Ратуша ур. {n}',needlvl:'Нужен уровень игрока {n}',maxcount:'Достигнут лимит',nores:'Не хватает ресурсов',busy:'Все строители заняты',building:'Строится',upgrading:'Улучшается',
 prod:'Производство',per_h:'/ч',stored:'Склад',slots:'Героини в здании',empty:'пусто',assign:'Назначить',remove:'Убрать',auto:'✨ Авто-расстановка',bonus:'Бонус',
 xp:'Опыт',stars:'Звёзды',skills:'Навыки',sp:'очков',lvlup:'Повысить уровень',starup:'★ Звезда',train:'Тренировка',trainx:'🍖 → +опыт',cap:'Макс. уровень для звёзд',
 br_res:'Добыча',br_build:'Стройка',br_charm:'Обаяние',perk:'Особый навык',in_bld:'Работает',not_assigned:'Свободна',
 outfits:'Наряды',colors:'Цвет лака',orig:'Ориг.',nocolor:'Этот наряд не перекрашивается',needbout:'Постройте Бутик, чтобы покупать наряды',charm:'Обаяние',happiness:'Счастье',
 recruit:'Пригласить',recruited:'В племени',freeticket:'Бесплатный билет через',getfree:'🎟️ Забрать билет',needtav:'Постройте Таверну, чтобы приглашать героинь',
 explore:'Экспедиция',exploring:'В пути',explored:'Открыто',needtower:'Нужна Башня ур. {n}',reward:'Награда',plots:'+2 участка',endless:'Дальние острова',
 settings_music:'Музыка',settings_sfx:'Звуки',vib:'Вибрация',reset:'Сбросить прогресс',resetq:'Точно стереть всё и начать заново?',yes:'Да',no:'Нет',
 qdone:'Задание выполнено!',claim:'Забрать',newera:'Новая эпоха!',levelup:'Новый уровень!',done:'Готово!',offline:'Пока вас не было',
 shopnote:'Всё в магазине — за игровую валюту. Настоящих денег нет.',builders:'Строители',plotlock:'Откройте регион на карте',
 era1:'Каменный век',era2:'Средневековье',era3:'Современность',era4:'Будущее',
 b_hall:'Ратуша',b_house:'Хижина',b_sawmill:'Лесопилка',b_farm:'Ферма',b_quarry:'Каменоломня',b_tower:'Башня',b_tavern:'Таверна',b_market:'Рынок',b_boutique:'Бутик',b_workshop:'Мастерская',
 r_coins:'Монеты',r_wood:'Дерево',r_stone:'Камень',r_food:'Еда',r_gems:'Кристаллы',r_tickets:'Билеты',r_books:'Книги',r_shards:'Осколки',r_all:'всё',
 p_build:'−{v}% время стройки',p_xp:'+{v}% опыта',p_exp:'−{v}% время экспедиций',p_charm:'+{v}% обаяния',p_cost:'−{v}% цены улучшений',p_loot:'+{v}% добычи экспедиций',
 h_chief:'Вождь Тамира',h_guide:'Проводница Мира',h_huntress:'Охотница Кая',h_trader:'Торговка Зули',h_captain:'Капитан Марина',h_knight:'Рыцарь Эльза',h_sailor:'Морячка Тиа',h_musician:'Музыкант Рио',h_architect:'Архитектор Софи',h_pilot:'Пилот Зоя',h_inventor:'Изобретательница Ада',h_astronaut:'Космонавт Нова',h_mayor:'Мэр Грейс',
 ro_chief:'Лидер · стройка',ro_guide:'Обучение · опыт',ro_huntress:'Еда · охота',ro_trader:'Монеты · рынок',ro_captain:'Экспедиции',ro_knight:'Камень · защита',ro_sailor:'Еда · море',ro_musician:'Праздники · обаяние',ro_architect:'Стройка · камень',ro_pilot:'Разведка',ro_inventor:'Наука',ro_astronaut:'Всё производство',ro_mayor:'Престиж',
 o_base:'Фирменный лак',o_gown:'Вечернее платье',o_suit:'Белый костюм',o_violet:'Фиолетовый лак',o_trench:'Красный тренч',o_gold:'Золотой комбинезон',o_emerald:'Изумрудное платье',o_sailor:'Морской лак',o_coat:'Алый сюртук',o_tribal:'Наряд вождя',o_space:'Космо-костюм',o_beach:'Пляжный лак',
 g_reg_home:'Родной остров',g_reg_jungle:'Храм джунглей',g_reg_volcano:'Вулкан',g_reg_pyramids:'Пирамиды',g_reg_castle:'Замок',g_reg_glacier:'Ледник',g_reg_factory:'Остров заводов',g_reg_city:'Город',g_reg_dome:'Купол будущего',
 q_build:'Постройте: {a}',q_collect:'Соберите {n} {a}',q_assign:'Назначьте героиню в здание',q_upgrade:'Улучшите {a} до ур. {n}',q_own:'Соберите {n} героинь в племени',q_herolvl:'Прокачайте героиню до ур. {n}',
 q_explore:'Откройте регионов на карте: {n}',q_color:'Перекрасьте наряд в Гардеробе',q_outfit:'Купите новый наряд',q_bldlvl:'Улучшите любое здание до ур. {n}',q_herostar:'Получите героиню {n}★',
 s_gift:'Подарок племени',s_coins1:'Мешок монет',s_wood1:'Связка брёвен',s_stone1:'Груда камня',s_food1:'Корзина еды',s_ticket:'Билет в таверну',s_books:'Стопка книг',s_shards:'Звёздные осколки',s_gems1:'Горсть кристаллов',s_builder:'Второй строитель',
 tut1:'Привет! Я {h}. Давайте построим лагерь. Нажмите на пустой участок с «+», чтобы строить.',tut_collect:'Нажмите на здание с пузырём, чтобы собрать ресурсы!',
 sync:'Синергия',version:'Версия',mute:'Звук выкл.',tapcollect:'Нажмите на здание, чтобы собрать',buildmenu:'Что построить?',hint_offline:'Таймеры идут, даже когда игра закрыта.',
 speedfree:'Бесплатно (<30с)',confirm:'Подтвердить',cost:'Цена',time:'Время',owned_n:'В племени: {n}',star_need:'Осколков: {a}/{b}',assign_to:'Куда отправить?',none:'Никто',stats:'Характеристики',heroxp:'опыт героини',playerxp:'опыт игрока'},
en:{title:'Sun Tribe',tap:'Tap to start',lang:'Language',story1:'A storm wrecked our ship… We are on an empty island!',story2:'Choose a heroine to lead the tribe. Invite the others later in the tavern.',choose:'Choose',startw:'Start game',
 village:'Village',heroes:'Heroines',wardrobe:'Wardrobe',map:'Map',shop:'Shop',quests:'Quests',settings:'Settings',team:'Team',tavern:'Tavern',
 lvl:'Lv.',level:'Level',build:'Build',upgrade:'Upgrade',collect:'Collect',speed:'Speed up',close:'Close',buy:'Buy',free:'Free',wear:'Wear',worn:'Worn',owned:'Owned',locked:'Locked',
 needhall:'Needs Town Hall Lv. {n}',needlvl:'Needs player level {n}',maxcount:'Limit reached',nores:'Not enough resources',busy:'All builders are busy',building:'Building',upgrading:'Upgrading',
 prod:'Production',per_h:'/h',stored:'Stored',slots:'Heroines here',empty:'empty',assign:'Assign',remove:'Remove',auto:'✨ Auto-assign',bonus:'Bonus',
 xp:'XP',stars:'Stars',skills:'Skills',sp:'points',lvlup:'Level up',starup:'★ Star up',train:'Train',trainx:'🍖 → +XP',cap:'Max level for stars',
 br_res:'Gathering',br_build:'Building',br_charm:'Charm',perk:'Special perk',in_bld:'Working at',not_assigned:'Free',
 outfits:'Outfits',colors:'Lacquer color',orig:'Orig.',nocolor:'This outfit can’t be recolored',needbout:'Build a Boutique to buy outfits',charm:'Charm',happiness:'Happiness',
 recruit:'Invite',recruited:'In tribe',freeticket:'Free ticket in',getfree:'🎟️ Claim ticket',needtav:'Build a Tavern to invite heroines',
 explore:'Expedition',exploring:'Traveling',explored:'Explored',needtower:'Needs Tower Lv. {n}',reward:'Reward',plots:'+2 plots',endless:'Far islands',
 settings_music:'Music',settings_sfx:'Sound effects',vib:'Vibration',reset:'Reset progress',resetq:'Really erase everything and start over?',yes:'Yes',no:'No',
 qdone:'Quest complete!',claim:'Claim',newera:'New era!',levelup:'Level up!',done:'Done!',offline:'While you were away',
 shopnote:'Everything here costs in-game currency only. No real money.',builders:'Builders',plotlock:'Explore a region on the map',
 era1:'Stone Age',era2:'Middle Ages',era3:'Modern',era4:'Future',
 b_hall:'Town Hall',b_house:'Hut',b_sawmill:'Sawmill',b_farm:'Farm',b_quarry:'Quarry',b_tower:'Tower',b_tavern:'Tavern',b_market:'Market',b_boutique:'Boutique',b_workshop:'Workshop',
 r_coins:'Coins',r_wood:'Wood',r_stone:'Stone',r_food:'Food',r_gems:'Gems',r_tickets:'Tickets',r_books:'Books',r_shards:'Shards',r_all:'all',
 p_build:'−{v}% build time',p_xp:'+{v}% XP',p_exp:'−{v}% expedition time',p_charm:'+{v}% charm',p_cost:'−{v}% upgrade cost',p_loot:'+{v}% expedition loot',
 h_chief:'Chief Tamira',h_guide:'Mira the Guide',h_huntress:'Kaya the Huntress',h_trader:'Zuli the Trader',h_captain:'Captain Marina',h_knight:'Elsa the Knight',h_sailor:'Tia the Sailor',h_musician:'Rio the Musician',h_architect:'Sophie the Architect',h_pilot:'Zoya the Pilot',h_inventor:'Ada the Inventor',h_astronaut:'Nova the Astronaut',h_mayor:'Mayor Grace',
 ro_chief:'Leader · building',ro_guide:'Tutor · XP',ro_huntress:'Food · hunting',ro_trader:'Coins · market',ro_captain:'Expeditions',ro_knight:'Stone · defense',ro_sailor:'Food · sea',ro_musician:'Festivals · charm',ro_architect:'Building · stone',ro_pilot:'Scouting',ro_inventor:'Science',ro_astronaut:'All production',ro_mayor:'Prestige',
 o_base:'Signature lacquer',o_gown:'Evening gown',o_suit:'White suit',o_violet:'Violet lacquer',o_trench:'Red trench',o_gold:'Golden jumpsuit',o_emerald:'Emerald gown',o_sailor:'Sailor lacquer',o_coat:'Scarlet coat',o_tribal:'Chief’s attire',o_space:'Space suit',o_beach:'Beach lacquer',
 g_reg_home:'Home island',g_reg_jungle:'Jungle temple',g_reg_volcano:'Volcano',g_reg_pyramids:'Pyramids',g_reg_castle:'Castle',g_reg_glacier:'Glacier',g_reg_factory:'Factory isle',g_reg_city:'City',g_reg_dome:'Future dome',
 q_build:'Build: {a}',q_collect:'Collect {n} {a}',q_assign:'Assign a heroine to a building',q_upgrade:'Upgrade {a} to Lv. {n}',q_own:'Have {n} heroines in the tribe',q_herolvl:'Level a heroine to Lv. {n}',
 q_explore:'Explore map regions: {n}',q_color:'Recolor an outfit in the Wardrobe',q_outfit:'Buy a new outfit',q_bldlvl:'Upgrade any building to Lv. {n}',q_herostar:'Get a {n}★ heroine',
 s_gift:'Tribe gift',s_coins1:'Bag of coins',s_wood1:'Log bundle',s_stone1:'Stone pile',s_food1:'Food basket',s_ticket:'Tavern ticket',s_books:'Book stack',s_shards:'Star shards',s_gems1:'Handful of gems',s_builder:'Second builder',
 tut1:'Hi! I’m {h}. Let’s set up camp. Tap an empty plot with “+” to build.',tut_collect:'Tap a building with a bubble to collect!',
 sync:'Synergy',version:'Version',mute:'Muted',tapcollect:'Tap a building to collect',buildmenu:'What to build?',hint_offline:'Timers keep running while the game is closed.',
 speedfree:'Free (<30s)',confirm:'Confirm',cost:'Cost',time:'Time',owned_n:'In tribe: {n}',star_need:'Shards: {a}/{b}',assign_to:'Send where?',none:'Nobody',stats:'Stats',heroxp:'heroine XP',playerxp:'player XP'},
he:{title:'שבט השמש',tap:'הקישו כדי להתחיל',lang:'שפה',story1:'סערה ניפצה את הספינה שלנו… אנחנו על אי ריק!',story2:'בחרו גיבורה שתוביל את השבט. את האחרות תזמינו אחר כך בטברנה.',choose:'בחירה',startw:'התחלת משחק',
 village:'כפר',heroes:'גיבורות',wardrobe:'ארון בגדים',map:'מפה',shop:'חנות',quests:'משימות',settings:'הגדרות',team:'צוות',tavern:'טברנה',
 lvl:'רמה',level:'רמה',build:'בנייה',upgrade:'שדרוג',collect:'איסוף',speed:'האצה',close:'סגירה',buy:'קנייה',free:'חינם',wear:'ללבוש',worn:'לבוש',owned:'יש',locked:'נעול',
 needhall:'נדרשת עירייה רמה {n}',needlvl:'נדרשת רמת שחקן {n}',maxcount:'הגעתם למגבלה',nores:'אין מספיק משאבים',busy:'כל הבנאים עסוקים',building:'בבנייה',upgrading:'בשדרוג',
 prod:'ייצור',per_h:'/שעה',stored:'מחסן',slots:'גיבורות במבנה',empty:'ריק',assign:'שיבוץ',remove:'הסרה',auto:'✨ שיבוץ אוטומטי',bonus:'בונוס',
 xp:'ניסיון',stars:'כוכבים',skills:'כישורים',sp:'נקודות',lvlup:'העלאת רמה',starup:'★ כוכב',train:'אימון',trainx:'🍖 → +ניסיון',cap:'רמה מרבית לכוכבים',
 br_res:'איסוף',br_build:'בנייה',br_charm:'קסם',perk:'כישרון מיוחד',in_bld:'עובדת ב',not_assigned:'פנויה',
 outfits:'תלבושות',colors:'צבע לכה',orig:'מקור',nocolor:'אי אפשר לצבוע תלבושת זו',needbout:'בנו בוטיק כדי לקנות תלבושות',charm:'קסם',happiness:'אושר',
 recruit:'הזמנה',recruited:'בשבט',freeticket:'כרטיס חינם בעוד',getfree:'🎟️ קבלת כרטיס',needtav:'בנו טברנה כדי להזמין גיבורות',
 explore:'משלחת',exploring:'בדרך',explored:'נחקר',needtower:'נדרש מגדל רמה {n}',reward:'פרס',plots:'+2 מגרשים',endless:'איים רחוקים',
 settings_music:'מוזיקה',settings_sfx:'צלילים',vib:'רטט',reset:'איפוס התקדמות',resetq:'למחוק הכול ולהתחיל מחדש?',yes:'כן',no:'לא',
 qdone:'המשימה הושלמה!',claim:'קבלה',newera:'עידן חדש!',levelup:'רמה חדשה!',done:'מוכן!',offline:'בזמן שלא הייתם',
 shopnote:'הכול כאן במטבע המשחק בלבד. בלי כסף אמיתי.',builders:'בנאים',plotlock:'גלו אזור במפה',
 era1:'תקופת האבן',era2:'ימי הביניים',era3:'העת המודרנית',era4:'העתיד',
 b_hall:'עירייה',b_house:'בקתה',b_sawmill:'מנסרה',b_farm:'חווה',b_quarry:'מחצבה',b_tower:'מגדל',b_tavern:'טברנה',b_market:'שוק',b_boutique:'בוטיק',b_workshop:'סדנה',
 r_coins:'מטבעות',r_wood:'עץ',r_stone:'אבן',r_food:'אוכל',r_gems:'יהלומים',r_tickets:'כרטיסים',r_books:'ספרים',r_shards:'רסיסים',r_all:'הכול',
 p_build:'−{v}% זמן בנייה',p_xp:'+{v}% ניסיון',p_exp:'−{v}% זמן משלחות',p_charm:'+{v}% קסם',p_cost:'−{v}% מחיר שדרוג',p_loot:'+{v}% שלל משלחות',
 h_chief:'המנהיגה תמירה',h_guide:'מירה המדריכה',h_huntress:'קאיה הציידת',h_trader:'זולי הסוחרת',h_captain:'קפטן מרינה',h_knight:'אלזה האבירה',h_sailor:'טיה המלחית',h_musician:'ריו המוזיקאית',h_architect:'סופי האדריכלית',h_pilot:'זויה הטייסת',h_inventor:'עדה הממציאה',h_astronaut:'נובה האסטרונאוטית',h_mayor:'ראש העיר גרייס',
 ro_chief:'מנהיגה · בנייה',ro_guide:'הדרכה · ניסיון',ro_huntress:'אוכל · ציד',ro_trader:'מטבעות · שוק',ro_captain:'משלחות',ro_knight:'אבן · הגנה',ro_sailor:'אוכל · ים',ro_musician:'חגיגות · קסם',ro_architect:'בנייה · אבן',ro_pilot:'סיור',ro_inventor:'מדע',ro_astronaut:'כל הייצור',ro_mayor:'יוקרה',
 o_base:'לכה אישית',o_gown:'שמלת ערב',o_suit:'חליפה לבנה',o_violet:'לכה סגולה',o_trench:'מעיל אדום',o_gold:'אוברול זהב',o_emerald:'שמלת אמרלד',o_sailor:'לכה ימית',o_coat:'מעיל ארגמן',o_tribal:'תלבושת מנהיגה',o_space:'חליפת חלל',o_beach:'לכת חוף',
 g_reg_home:'אי הבית',g_reg_jungle:'מקדש הג׳ונגל',g_reg_volcano:'הר געש',g_reg_pyramids:'פירמידות',g_reg_castle:'טירה',g_reg_glacier:'קרחון',g_reg_factory:'אי המפעלים',g_reg_city:'עיר',g_reg_dome:'כיפת העתיד',
 q_build:'בנו: {a}',q_collect:'אספו {n} {a}',q_assign:'שבצו גיבורה במבנה',q_upgrade:'שדרגו {a} לרמה {n}',q_own:'{n} גיבורות בשבט',q_herolvl:'העלו גיבורה לרמה {n}',
 q_explore:'גלו אזורים במפה: {n}',q_color:'צבעו תלבושת בארון',q_outfit:'קנו תלבושת חדשה',q_bldlvl:'שדרגו מבנה כלשהו לרמה {n}',q_herostar:'השיגו גיבורה {n}★',
 s_gift:'מתנת השבט',s_coins1:'שק מטבעות',s_wood1:'צרור בולי עץ',s_stone1:'ערימת אבנים',s_food1:'סל אוכל',s_ticket:'כרטיס לטברנה',s_books:'ערימת ספרים',s_shards:'רסיסי כוכבים',s_gems1:'חופן יהלומים',s_builder:'בנאי שני',
 tut1:'היי! אני {h}. בואו נקים מחנה. הקישו על מגרש ריק עם „+” כדי לבנות.',tut_collect:'הקישו על מבנה עם בועה כדי לאסוף!',
 sync:'סינרגיה',version:'גרסה',mute:'מושתק',tapcollect:'הקישו על מבנה כדי לאסוף',buildmenu:'מה לבנות?',hint_offline:'הטיימרים ממשיכים גם כשהמשחק סגור.',
 speedfree:'חינם (<30 שנ׳)',confirm:'אישור',cost:'מחיר',time:'זמן',owned_n:'בשבט: {n}',star_need:'רסיסים: {a}/{b}',assign_to:'לאן לשלוח?',none:'אף אחת',stats:'נתונים',heroxp:'ניסיון גיבורה',playerxp:'ניסיון שחקן'}
};
