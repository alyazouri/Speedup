// =====================================================
// PUBG ALL-IN JORDAN ULTRA — HARD JORDAN REAL PATH ONLY
// ABSOLUTE FINAL (iOS PAC)
// Jordan TRUE PATH ONLY | No Gulf | No Global | Wait Forever
// =====================================================

// ======================= PROXY =======================
var MATCH_PROXY = "PROXY 176.29.153.95:20001";
var BLOCK       = "PROXY 127.0.0.1:9";

// ======================= JORDAN REAL NETS =======================
// نطاقات أردنية حقيقية (Low Latency + Local Routing)
var JO_REAL_NETS = {
  "176.29.":1,   // Orange / Zain
  "82.212.":1,   // Umniah
  "212.35.":1,   // Jordan DC
  "91.106.":1,   // Fiber
  "46.185.":1,   // LTE
  "149.200.":1   // Extra
};

// ======================= SESSION LOCK =======================
var LOCKED = {};
function lock(h,p,ms){ LOCKED[h]={p:p,e:Date.now()+ms}; return p; }
function locked(h){ var x=LOCKED[h]; if(x && x.e>Date.now()) return x.p; delete LOCKED[h]; return null; }

// ======================= LOW-LEVEL HELPERS =======================
function startsWithAny(ip, table){
  for(var k in table) if(ip.indexOf(k)===0) return true;
  return false;
}
function getIPv4(host){
  var ip=dnsResolve(host);
  return (ip && ip.indexOf(".")!==-1)?ip:null;
}

// ======================= CORE RULE =======================
// لا يمر إلا المسار الأردني الحقيقي (IPv4 + ليس Anycast/CDN + ضمن JO_REAL_NETS)
function isJordanRealPath(host){
  var ip=dnsResolve(host);
  if(!ip) return false;
  if(ip.indexOf(".")===-1) return false;

  // استبعاد Anycast / Cloud
  if(isInNet(ip,"8.0.0.0","255.0.0.0"))  return false; // Google
  if(isInNet(ip,"13.0.0.0","255.0.0.0")) return false; // Azure
  if(isInNet(ip,"52.0.0.0","255.0.0.0")) return false; // AWS
  if(isInNet(ip,"34.0.0.0","255.0.0.0")) return false; // GCP
  if(isInNet(ip,"18.0.0.0","255.0.0.0")) return false; // AWS legacy

  return startsWithAny(ip, JO_REAL_NETS);
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
           ultimate|evo|evoground)/.test((u+h).toLowerCase());
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

// ======================= MAIN ROUTER =======================
function FindProxyForURL(url, host){
  host=host.toLowerCase();

  // Stickiness
  var L=locked(host);
  if(L) return L;

  // Non-PUBG
  if(!isPUBG(host)) return "DIRECT";

  // ===== CORE GATE =====
  if(!isJordanRealPath(host)) return BLOCK;

  // 👥 Friends / Social
  if(isFriendUI(url,host))
    return lock(host,MATCH_PROXY,20000);

  // 🏠 Lobby / Recruit
  if(isLobby(url,host))
    return lock(host,MATCH_PROXY,25000);

  // 🎤 Voice
  if(isVoice(url,host))
    return lock(host,MATCH_PROXY,30000);

  // ⚔️ ARENA / WOW / MATCH — HARD JORDAN ABSOLUTE
  if(isArena(url,host) || isWOW(url,host) || isMatch(url,host))
    return lock(host,MATCH_PROXY,40000);

  return BLOCK;
}
