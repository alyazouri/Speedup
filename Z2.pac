// =====================================================
// PUBG ALL-IN JORDAN ULTRA — LEGENDARY FINAL (iOS)
// DUAL-MODE (HARDCORE UI ↔ STABLE GAMEPLAY)
// =====================================================

// ===== MODE SWITCH =====
// true  = Hardcore UI Jordan Boost (وقت Add Friend)
// false = Stable Gameplay (قبل اللعب)
var HARDCORE_UI_MODE = true;

// =======================
// PROXIES
// =======================
var LOBBY_PROXY = "PROXY 176.29.153.95:9030; PROXY 212.35.66.45:9030";
var MATCH_PROXY = "PROXY 176.29.153.95:20001";
var VOICE_PROXY = "PROXY 82.212.84.33:20001; PROXY 212.35.66.45:10012";
var BLOCK = "PROXY 127.0.0.1:9";

// =======================
// iOS SAFE DIRECT
// =======================
var IOS_SAFE_DIRECT = [
  "captive.apple.com","time.apple.com","ocsp.apple.com","ocsp2.apple.com",
  "gsp-ssl.ls.apple.com","mesu.apple.com","configuration.apple.com",
  "clients3.google.com","clients4.google.com","connectivitycheck.gstatic.com",
  "icloud.com","itunes.apple.com","apps.apple.com","mzstatic.com"
];

// =======================
// CDN DIRECT
// =======================
var CDN_DIRECT = [
  "youtube.com","googlevideo.com","ytimg.com",
  "facebook.com","fbcdn.net",
  "instagram.com","cdninstagram.com",
  "tiktokcdn.com","tiktokv.com","akamaihd.net"
];

// =======================
// DETECTORS
// =======================
function isPUBG(h){
  return /(pubg|pubgm|pubgmobile|igamecj|proximabeta|tencent|qq|qcloud|gcloudsdk|krafton|lightspeed|wow|ugc|creative)/.test(h);
}
function isFriendUI(u,h){
  return /(friend|addfriend|recommend|suggest|search|lookup|profile|nearby|people|userlist)/.test((u+h).toLowerCase());
}
function isSocialHeavy(u,h){
  return /(team|squad|party|mutual|online|recommend)/.test((u+h).toLowerCase());
}
function classifyPhase(u,h){
  var s=(u+h).toLowerCase();
  if(/(voice|rtc|webrtc|voip|audio)/.test(s))return"VOICE";
  if(/(worldofwonder|ugc|creative)/.test(s))return"WOW";
  if(/(arena|tdm|training|warehouse|gun)/.test(s))return"ARENA";
  if(/(lobby|matchmaking|queue|room|team|squad)/.test(s))return"LOBBY";
  if(/(game|battle|combat|session|frame|logic)/.test(s))return"MATCH";
  return"UNKNOWN";
}

// =======================
// GEO
// =======================
function isIPv4(ip){return ip&&ip.indexOf(".")!==-1;}
function getIPv4(h){var ip=dnsResolve(h);return isIPv4(ip)?ip:null;}
function startsWithAny(ip,t){for(var k in t)if(ip.indexOf(k)===0)return true;return false;}
var JO_NETS={"176.29.":1,"82.212.":1,"212.35.":1,"91.106.":1,"46.185.":1,"95.87.":1,"91.144.":1,"5.11.":1};
var GULF_NETS={"212.71.":1,"94.26.":1,"5.36.":1,"37.210.":1};
function isJordanIP(ip){return startsWithAny(ip,JO_NETS);}
function isGulfIP(ip){return startsWithAny(ip,GULF_NETS);}

// =======================
// LEGENDARY INTELLIGENCE
// =======================
var GRAVITY={}, SESSION_JO=false, UI_SESSION_JO=false, MATCH_SESSION=null, ROUTE_LOCK={};

function gravityJordan(h){GRAVITY[h]=(GRAVITY[h]||0)+1;return GRAVITY[h]<=4;}
function markSessionJordan(){SESSION_JO=true;}
function isSessionJordan(){return SESSION_JO;}
function uiSessionLock(JO){if(JO)UI_SESSION_JO=true;return UI_SESSION_JO;}
function matchSticky(p){if(!MATCH_SESSION)MATCH_SESSION=p;return MATCH_SESSION;}
function lockRoute(h,p,ms){ROUTE_LOCK[h]={p:p,t:Date.now()+ms};return p;}
function getLockedRoute(h){var r=ROUTE_LOCK[h];if(r&&Date.now()<r.t)return r.p;return null;}
function softDelay(){return "PROXY 127.0.0.1:65535";}

// =======================
// MAIN
// =======================
function FindProxyForURL(url,host){
  host=host.toLowerCase();

  // iOS safe direct
  for(var i=0;i<IOS_SAFE_DIRECT.length;i++) if(dnsDomainIs(host,IOS_SAFE_DIRECT[i])) return "DIRECT";
  for(var j=0;j<CDN_DIRECT.length;j++) if(shExpMatch(host,"*"+CDN_DIRECT[j])) return "DIRECT";

  var locked=getLockedRoute(host); if(locked) return locked;

  if(!isPUBG(host)) return "DIRECT";

  var ip=getIPv4(host); if(!ip) return BLOCK;
  var JO=isJordanIP(ip), GF=isGulfIP(ip);
  if(!(JO||GF)) return BLOCK;

  // HARDCORE UI (conditional)
  if(HARDCORE_UI_MODE && isFriendUI(url,host)){
    if(uiSessionLock(JO)) return lockRoute(host,LOBBY_PROXY,10000);
    if(gravityJordan(host)) return lockRoute(host,LOBBY_PROXY,7000);
    if(isSocialHeavy(url,host)){
      if(JO) return lockRoute(host,LOBBY_PROXY,8000);
      return softDelay();
    }
    if(!JO) return softDelay();
    return lockRoute(host,LOBBY_PROXY,6000);
  }

  // Stable gameplay
  if(isSessionJordan()) return lockRoute(host,LOBBY_PROXY,6000);

  var phase=classifyPhase(url,host);
  if(phase==="VOICE") return lockRoute(host,VOICE_PROXY,15000);
  if(phase==="MATCH"){ if(JO) markSessionJordan(); return matchSticky(MATCH_PROXY); }

  return lockRoute(host,LOBBY_PROXY,5000);
}
