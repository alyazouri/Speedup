// =====================================================
// PUBG ALL-IN JORDAN ULTRA — HARD JORDAN ABSOLUTE (iOS)
// Jordan ONLY | No Gulf | No Global | Wait Forever
// =====================================================

// ======================= PROXY =======================
var MATCH_PROXY = "PROXY 176.29.153.95:20001";
var BLOCK = "PROXY 127.0.0.1:9";

// ======================= JORDAN ONLY NETS =======================
var JO_MATCH_NETS = {
  "176.29.":1,   // Orange / Zain
  "82.212.":1,   // Umniah
  "212.35.":1,   // Jordan DC (أفضل)
  "91.106.":1,   // Fiber
  "46.185.":1,   // LTE
  "149.200.":1   // Extra
};

// ======================= SESSION LOCK =======================
var LOCKED = {};

function lock(h,p,ms){
  LOCKED[h]={p:p,e:Date.now()+ms};
  return p;
}
function locked(h){
  var x=LOCKED[h];
  if(x && x.e>Date.now()) return x.p;
  delete LOCKED[h];
  return null;
}

// ======================= HELPERS =======================
function startsWithAny(ip,table){
  for(var k in table)
    if(ip.indexOf(k)===0) return true;
  return false;
}
function getIPv4(h){
  var ip=dnsResolve(h);
  return (ip && ip.indexOf(".")!==-1)?ip:null;
}

// ======================= CONTEXT DETECTION =======================

// 🎮 PUBG Core
function isPUBG(h){
  h=h.toLowerCase();
  return /(pubg|pubgm|pubgmobile|intlgame|igamecj|igamepubg|
           proximabeta|tencent|qq\.com|qcloud|tencentyun|
           gcloudsdk|krafton|lightspeed|
           wow|ugc|creative)/.test(h);
}

// 👥 Friend / Social
function isFriendUI(u,h){
  return /(friend|friends|addfriend|recommend|search|
           profile|people|player|uid|userid|
           follow|fans|social|relation)/.test((u+h).toLowerCase());
}

// 🏠 Lobby / Recruit
function isLobby(u,h){
  return /(lobby|matchmaking|matching|queue|waiting|
           room|rooms|recruit|
           team|squad|party|invite|
           gate|dispatcher|region)/.test((u+h).toLowerCase());
}

// 🎯 Match / Classic / Ranked
function isMatch(u,h){
  return /(game|battle|combat|fight|play|
           gs\.|gss|gameserver|
           session|instance|zone|
           realtime|action|
           classic|ranked|br)/.test((u+h).toLowerCase());
}

// ⚔️ Arena
function isArena(u,h){
  return /(arena|tdm|deathmatch|
           training|warehouse|hangar|
           gun|gungame|
           ultimate|evo)/.test((u+h).toLowerCase());
}

// 🌍 WOW / UGC
function isWOW(u,h){
  return /(wow|worldofwonder|
           ugc|creative|
           room|rooms|customroom|
           map|maps|template|
           publish|community)/.test((u+h).toLowerCase());
}

// 🎤 Voice
function isVoice(u,h){
  return /(voice|rtc|webrtc|voip|audio|
           mic|microphone|talk|speak|
           channel|stream|sound|
           teamvoice|partyvoice)/.test((u+h).toLowerCase());
}

// ======================= HARD JORDAN ROUTER =======================
function FindProxyForURL(url, host){

  host = host.toLowerCase();

  // Session lock
  var L = locked(host);
  if(L) return L;

  // Non-PUBG = DIRECT
  if(!isPUBG(host)) return "DIRECT";

  var ip = getIPv4(host);
  if(!ip) return BLOCK;

  // 👥 Friends / Social — Jordan ONLY
  if(isFriendUI(url,host)){
    if(startsWithAny(ip,JO_MATCH_NETS))
      return lock(host,MATCH_PROXY,20000);
    return BLOCK;
  }

  // 🏠 Lobby / Recruit — Jordan ONLY
  if(isLobby(url,host)){
    if(startsWithAny(ip,JO_MATCH_NETS))
      return lock(host,MATCH_PROXY,25000);
    return BLOCK;
  }

  // 🎤 Voice — Jordan ONLY
  if(isVoice(url,host)){
    if(startsWithAny(ip,JO_MATCH_NETS))
      return lock(host,MATCH_PROXY,30000);
    return BLOCK;
  }

  // ⚔️ ARENA / WOW / MATCH — ABSOLUTE HARD
  if(isArena(url,host) || isWOW(url,host) || isMatch(url,host)){
    if(startsWithAny(ip,JO_MATCH_NETS))
      return lock(host,MATCH_PROXY,40000);

    // ❌ لا دخول مهما طال الانتظار
    return BLOCK;
  }

  // Anything else PUBG
  return BLOCK;
}
