// ===================================================================
// PUBG ALL-IN JORDAN ULTRA — SINGULARITY FINAL (iOS)
// Context-Aware PAC • Jordan First • Split IPv4 Pools • Ultra Stable
// ===================================================================

// ======================= PROXIES ==========================
var LOBBY_PROXY = "PROXY 176.29.153.95:9030; PROXY 212.35.66.45:9030";
var MATCH_PROXY = "PROXY 176.29.153.95:20001";
var VOICE_PROXY = "PROXY 82.212.84.33:20001; PROXY 82.212.84.33:10012";
var BLOCK = "PROXY 127.0.0.1:9";

// ======================= SAFE DIRECT ======================
var SAFE_DIRECT = [
  "captive.apple.com","time.apple.com","ocsp.apple.com","ocsp2.apple.com",
  "clients3.google.com","clients4.google.com",
  "connectivitycheck.gstatic.com",
  "icloud.com","itunes.apple.com","apps.apple.com","mzstatic.com"
];

// ======================= CDN DIRECT =======================
var CDN_DIRECT = [
  "youtube.com","googlevideo.com","ytimg.com",
  "facebook.com","fbcdn.net","instagram.com","cdninstagram.com"
];

// ======================= HELPERS ==========================
function dnsSafe(h){ try{return dnsResolve(h);}catch(e){return null;} }
function isIPv4(ip){ return ip && ip.indexOf(".")!==-1; }
function getIPv4(h){ var ip=dnsSafe(h); return isIPv4(ip)?ip:null; }
function normalizeHost(h){ var i=h.indexOf(":"); return i!==-1?h.substring(0,i):h; }
function startsWithAny(ip,t){ for(var k in t) if(ip.indexOf(k)===0) return true; return false; }

// ======================= IPV4 POOLS =======================
// 🎮 Match / Arena / WOW — Lowest Ping (JO Tight)
var JO_MATCH_NETS = {
  "176.29.":1,"82.212.":1,"212.35.":1,"91.106.":1,"46.185.":1,"149.200.":1,
  "95.87.":1,"176.241.":1,"91.144.":1,"5.11.":1,"195.106.":1
};

// 👥 Lobby / Recruit / Friend — Wider JO
var JO_LOBBY_NETS = {
  "46.32.":1,"46.185.":1,"188.247.":1,"109.224.":1,"178.18.":1,"188.120.":1,
  "176.29.":1,"212.34.":1,"212.35.":1,"188.161.":1,"85.159.":1,"82.212.":1,
  "149.200.":1,"46.244.":1,"217.19.":1,
  "95.87.":1,"176.241.":1,"91.144.":1,"5.11.":1,"195.106.":1
};

// 🌍 Gulf fallback (close only)
var GF_NETS = { "212.71.":1,"94.26.":1,"5.36.":1,"37.210.":1,"31.193.":1 };

// ======================= CHECKERS =========================
function isJOMatch(ip){ return startsWithAny(ip, JO_MATCH_NETS); }
function isJOLobby(ip){ return startsWithAny(ip, JO_LOBBY_NETS); }
function isGF(ip){ return startsWithAny(ip, GF_NETS); }

// ======================= CONTEXT DETECTION =================

// 🎮 PUBG Core
function isPUBG(h){
  h=h.toLowerCase();
  return /(pubg|pubgm|pubgmobile|intlgame|igamecj|igamepubg|proximabeta|
           tencent|qq\.com|qcloud|tencentyun|gcloudsdk|
           krafton|lightspeed|vmpone|vmp|gme|gss|
           amsoveasea)/.test(h);
}

// 👥 Friend / Social
function isFriendUI(u,h){
  var s=(u+h).toLowerCase();
  return /(friend|friends|addfriend|add\-friend|recommend|suggest|
           search|profile|people|player|userid|uid|
           follow|follower|fans|social|relation|contacts)/.test(s);
}

// 🏠 Lobby / Recruit
function isLobby(u,h){
  var s=(u+h).toLowerCase();
  return /(lobby|matchmaking|matching|queue|waiting|
           room|rooms|recruit|recruiting|
           team|squad|party|invite|join|
           gate|gateway|dispatcher|router|
           region|allocation|select|choose)/.test(s);
}

// 🎯 Match / Classic / Ranked
function isMatch(u,h){
  var s=(u+h).toLowerCase();
  return /(game|battle|combat|fight|play|
           gs\.|gss|gameserver|logic|session|
           instance|zone|shard|node|cell|
           realtime|frame|tick|sync|action|
           classic|ranked|br)/.test(s);
}

// ⚔️ Arena
function isArena(u,h){
  var s=(u+h).toLowerCase();
  return /(arena|tdm|deathmatch|teamdeathmatch|
           training|arenatraining|
           warehouse|hangar|
           gun|gungame|gun\-game|
           ultimate|ultimatearena|
           evo|evoground)/.test(s);
}

// 🌍 WOW / UGC
function isWOW(u,h){
  var s=(u+h).toLowerCase();
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
  var s=(u+h).toLowerCase();
  return /(voice|rtc|webrtc|voip|audio|
           mic|microphone|talk|speak|
           channel|stream|sound|
           teamvoice|partyvoice)/.test(s);
}

// ======================= MEMORY & LOCK ====================
var SESSION_START=Date.now();
var WARMUP_MS=150000;          // 2.5 min Jordan bias
var ARENA_JO_ONLY_MS=105000;  // Arena JO pressure
var ARENA_LOCK_MS=180000;

var LOCK={}, ARENA_STATE={lastJO:0,locked:false}, MEMORY={joScore:0};

function lock(h,p,ms){ LOCK[h]={p:p,t:Date.now()+ms}; return p; }
function getLock(h){ var r=LOCK[h]; if(r && Date.now()<r.t) return r.p; return null; }

// ======================= ROUTER ===========================
function FindProxyForURL(url, host){
  host=normalizeHost((host||"").toLowerCase());

  // System safety
  for(var i=0;i<SAFE_DIRECT.length;i++)
    if(dnsDomainIs(host,SAFE_DIRECT[i])) return "DIRECT";
  for(var j=0;j<CDN_DIRECT.length;j++)
    if(shExpMatch(host,"*"+CDN_DIRECT[j])) return "DIRECT";

  var lk=getLock(host); if(lk) return lk;
  if(!isPUBG(host)) return "DIRECT";

  var ip=getIPv4(host);
  if(!ip) return BLOCK;

  // Warm-up: Lobby Jordan only
  if(Date.now()-SESSION_START < WARMUP_MS){
    if(isJOLobby(ip)){ MEMORY.joScore+=3; return lock(host,LOBBY_PROXY,15000); }
    return BLOCK;
  }

  // Voice
  if(isVoice(url,host))
    return lock(host,VOICE_PROXY,15000);

  // Match / Arena / WOW
  if(isMatch(url,host)||isArena(url,host)||isWOW(url,host)){

    if(isArena(url,host) && ARENA_STATE.locked &&
       (Date.now()-ARENA_STATE.lastJO)<ARENA_LOCK_MS)
      return lock(host,MATCH_PROXY,17000);

    if(isArena(url,host) && (Date.now()-SESSION_START)<ARENA_JO_ONLY_MS){
      if(isJOMatch(ip)){
        ARENA_STATE.lastJO=Date.now();
        ARENA_STATE.locked=true;
        MEMORY.joScore+=3;
        return lock(host,MATCH_PROXY,17000);
      }
      return BLOCK;
    }

    if(isJOMatch(ip)){
      ARENA_STATE.lastJO=Date.now();
      ARENA_STATE.locked=true;
      MEMORY.joScore+=3;
      return lock(host,MATCH_PROXY,17000);
    }

    if(isGF(ip))
      return lock(host,MATCH_PROXY,13000);

    return BLOCK;
  }

  // Lobby / Friend / Recruit
  if(isLobby(url,host)||isFriendUI(url,host)){
    if(isJOLobby(ip)){
      MEMORY.joScore+=2;
      return lock(host,LOBBY_PROXY,15000);
    }
    if(isGF(ip))
      return lock(host,LOBBY_PROXY,8000);
    return BLOCK;
  }

  return lock(host,MATCH_PROXY,10000);
}
