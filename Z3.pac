// =====================================================
// PUBG ALL-IN JORDAN ULTRA — HARD JORDAN FINAL (iOS)
// Jordan ONLY | No Gulf | No Global | Max Local Pressure
// =====================================================

// ======================= PROXY =======================
var MATCH_PROXY = "PROXY 176.29.153.95:20001";
var BLOCK = "PROXY 127.0.0.1:9";

// ======================= JORDAN NETS (TIGHT) =======================
var JO_MATCH_NETS = {
  "176.29.":1,   // Orange / Zain
  "82.212.":1,   // Umniah
  "212.35.":1,   // JO Datacenter
  "91.106.":1,   // Fiber
  "46.185.":1,   // LTE
  "149.200.":1   // Extra
};

// ======================= SESSION LOCK =======================
var LOCKED = {};

function lock(host, proxy, ms){
  LOCKED[host] = { p: proxy, e: Date.now() + ms };
  return proxy;
}
function locked(host){
  var x = LOCKED[host];
  if (x && x.e > Date.now()) return x.p;
  delete LOCKED[host];
  return null;
}

// ======================= HELPERS =======================
function startsWithAny(ip, table){
  for (var k in table)
    if (ip.indexOf(k) === 0) return true;
  return false;
}
function getIPv4(host){
  var ip = dnsResolve(host);
  return (ip && ip.indexOf(".") !== -1) ? ip : null;
}

// ======================= CONTEXT DETECTION =======================

// 🎮 PUBG Core
function isPUBG(h){
  h = h.toLowerCase();
  return /(pubg|pubgm|pubgmobile|intlgame|igamecj|igamepubg|
           proximabeta|tencent|qq\.com|qcloud|tencentyun|
           gcloudsdk|krafton|lightspeed|vmpone|vmp|gme|
           gss|wow|ugc|creative)/.test(h);
}

// 👥 Friend / Social
function isFriendUI(u,h){
  var s = (u+h).toLowerCase();
  return /(friend|friends|addfriend|add\-friend|recommend|suggest|
           search|profile|people|player|userid|uid|
           follow|follower|fans|social|relation|contacts)/.test(s);
}

// 🏠 Lobby / Recruit
function isLobby(u,h){
  var s = (u+h).toLowerCase();
  return /(lobby|matchmaking|matching|queue|waiting|
           room|rooms|recruit|recruiting|
           team|squad|party|invite|join|
           gate|gateway|dispatcher|router|
           region|allocation|select|choose)/.test(s);
}

// 🎯 Match / Classic / Ranked
function isMatch(u,h){
  var s = (u+h).toLowerCase();
  return /(game|battle|combat|fight|play|
           gs\.|gss|gameserver|logic|session|
           instance|zone|shard|node|cell|
           realtime|frame|tick|sync|action|
           classic|ranked|br)/.test(s);
}

// ⚔️ Arena
function isArena(u,h){
  var s = (u+h).toLowerCase();
  return /(arena|tdm|deathmatch|teamdeathmatch|
           training|arenatraining|
           warehouse|hangar|
           gun|gungame|gun\-game|
           ultimate|ultimatearena|
           evo|evoground)/.test(s);
}

// 🌍 WOW / UGC
function isWOW(u,h){
  var s = (u+h).toLowerCase();
  return /(wow|worldofwonder|
           ugc|ugccontent|
           creative|creation|creations|
           room|rooms|customroom|custom\-room|
           map|maps|template|templates|
           publish|published|
           community|workshop|
           featured|trending|popular|
           recommend|recommended)/.test(s);
}

// 🎤 Voice
function isVoice(u,h){
  var s = (u+h).toLowerCase();
  return /(voice|rtc|webrtc|voip|audio|
           mic|microphone|talk|speak|
           channel|stream|sound|
           teamvoice|partyvoice)/.test(s);
}

// ======================= MAIN ROUTER =======================
function FindProxyForURL(url, host){
  host = host.toLowerCase();

  // Session lock
  var L = locked(host);
  if (L) return L;

  // Non-PUBG = DIRECT
  if (!isPUBG(host)) return "DIRECT";

  var ip = getIPv4(host);
  if (!ip) return BLOCK;

  // 👥 Friend / Social (Jordan only)
  if (isFriendUI(url,host)){
    if (startsWithAny(ip, JO_MATCH_NETS))
      return lock(host, MATCH_PROXY, 15000);
    return BLOCK;
  }

  // 🏠 Lobby / Recruit (Jordan only)
  if (isLobby(url,host)){
    if (startsWithAny(ip, JO_MATCH_NETS))
      return lock(host, MATCH_PROXY, 20000);
    return BLOCK;
  }

  // 🎤 Voice (Jordan only)
  if (isVoice(url,host)){
    if (startsWithAny(ip, JO_MATCH_NETS))
      return lock(host, MATCH_PROXY, 25000);
    return BLOCK;
  }

  // ⚔️ Arena / WOW / Match — HARD JORDAN
  if (isArena(url,host) || isWOW(url,host) || isMatch(url,host)){
    if (startsWithAny(ip, JO_MATCH_NETS))
      return lock(host, MATCH_PROXY, 30000);
    return BLOCK;
  }

  return BLOCK;
}
