// =====================================================
// JoMe1_GOLD_MERGED_DETECTORS.pac — UPDATED
// طلبك:
// 1) توسعة نطاقات اللوبي الأردنية (JO_RECRUIT أوسع) ✅
// 2) الماتش "أردني فقط" (JO_TIGHT فقط) ✅
//
// سياسة عامة:
// - أوروبا BLOCK
// - DNS fail BLOCK
// - لا DIRECT داخل البروكسي
// - Lobby/WOW: الأردن (Recruit wide) ثم الخليج (GULF_NETS) كـ fallback
// - Match/Arena: الأردن فقط
// =====================================================


// =======================
// PROXIES (Jordan)
// =======================
var LOBBY_PROXY =
  "PROXY 176.29.153.95:9030; " +
  "PROXY 212.35.66.45:9030";

var MATCH_PROXY =
  "PROXY 176.29.153.95:20001";

var BLOCK = "PROXY 127.0.0.1:9";


// =======================
// SAFE DIRECT (System / CDN only)
// =======================
var SAFE_DIRECT = [
  "captive.apple.com","time.apple.com","ocsp.apple.com",
  "clients3.google.com","gstatic.com","googleapis.com",
  "connectivitycheck.gstatic.com","msftconnecttest.com","msftncsi.com"
];

var CDN_DIRECT = [
  "youtube.com","googlevideo.com","ytimg.com",
  "fbcdn.net","facebook.com",
  "instagram.com","cdninstagram.com",
  "tiktokcdn.com","tiktokv.com",
  "akamaihd.net"
];


// =======================
// GEO TABLES
// =======================

// الأردن — Tight (ماتش فقط)
var JO_TIGHT = {
  "176.29.":1,
  "82.212.":1,
  "212.34.":1,
  "212.35.":1,
  "94.249.":1
};

// الأردن — Recruit Wide (للّوبي فقط) — توسعة أردنية
var JO_RECRUIT = {
  // Tight
  "176.29.":1,
  "82.212.":1,
  "212.34.":1,
  "212.35.":1,
  "94.249.":1,

  // توسعات كانت عندك
  "46.185.":1,
  "37.123.":1,
  "37.8.":1,

  // إضافات أردنية شائعة من نسخك السابقة
  "46.32.":1,
  "188.247.":1,
  "141.105.":1,
  "185.14.":1,
  "83.244.":1,
  "87.236.":1,
  "212.118.":1
};

// أوروبا — BLOCK (broad)
var EUROPE = {
  "5.":1,"31.":1,"37.":1,"46.":1,"51.":1,"62.":1,"77.":1,"78.":1,
  "80.":1,"81.":1,"82.":1,"83.":1,"84.":1,"85.":1,"86.":1,
  "87.":1,"88.":1,"89.":1,"90.":1,"91.":1,"92.":1,"93.":1,
  "94.":1,"95.":1,"109.":1,"141.":1,"145.":1,"151.":1,
  "176.":1,"178.":1,"185.":1,"188.":1,"193.":1,"194.":1,
  "195.":1,"212.":1
};

// الخليج — ضيق جدًا
var GULF_NETS = {
  "37.210.":1, // QA
  "159.0.":1,  // SA
  "176.47.":1, // SA
  "188.51.":1  // SA
};


// =======================
// HELPERS
// =======================
function normalizeHost(h){
  var i = h.indexOf(":");
  return (i !== -1) ? h.substring(0,i) : h;
}

function isIPv4(ip){ return ip && ip.indexOf(".") !== -1; }

function getIP(host){
  var ip = dnsResolve(host);
  return (ip && isIPv4(ip)) ? ip : null;
}

function startsWithAny(ip, table){
  for (var k in table)
    if (ip.indexOf(k) === 0) return true;
  return false;
}

function isPrivateOrLocalIP(ip){
  return ip &&
    (isInNet(ip,"10.0.0.0","255.0.0.0") ||
     isInNet(ip,"172.16.0.0","255.240.0.0") ||
     isInNet(ip,"192.168.0.0","255.255.0.0") ||
     isInNet(ip,"127.0.0.0","255.0.0.0") ||
     isInNet(ip,"169.254.0.0","255.255.0.0"));
}

function containsAny(s, list){
  s = s.toLowerCase();
  for (var i=0;i<list.length;i++)
    if (s.indexOf(list[i]) !== -1) return true;
  return false;
}


// =======================
// 🔵 DETECTORS (Merged)
// =======================

/**
 * PUBG CORE DETECTOR
 */
function isPUBG(host){
  host = host.toLowerCase();
  return /(pubg|pubgm|pubgmobile|intlgame|igamecj|igame|
           proximabeta|tencent|qq|qcloud|gcloud|gcloudsdk|
           krafton|lightspeed|lightspeedstudio|
           amsoveasea|ams|ace|
           vmpone|vmp|gme|gamecenter|
           wow|worldofwonder|ugc|creative|creation|creations)/ix
           .test(host);
}

/**
 * Lobby / Recruit / Queue (Decision phase)
 */
function isLobbyTraffic(url, host){
  var s = (url + host).toLowerCase();
  return /(lobby|matchmaking|matching|queue|mm|
           room|rooms|recruit|team|squad|party|invite|
           gate|dispatcher|router|region|allocation|assign|
           presence|status|heartbeat|
           login|auth|passport|account)/ix
           .test(s);
}

/**
 * WOW / World of Wonder / UGC
 */
function isWOWTraffic(url, host){
  var s = (url + host).toLowerCase();
  return /(worldofwonder|wow|
           ugc|creative|
           creation|creations|
           customroom|custom-room|
           map|maps|template|templates|
           featured|trending|popular|
           recommend|recommended|
           daily|weekly|
           newcreations|new-creations|
           contest|contests|
           community|workshop|
           editor|publish|published|
           playtogether|play-together)/ix
           .test(s);
}

/**
 * Arena / TDM / Training
 */
function isArenaTraffic(url, host){
  var s = (url + host).toLowerCase();
  return /(arena|tdm|deathmatch|
           teamdeathmatch|team[_-]?deathmatch|
           gun|gungame|gun[_-]?game|
           training|arenatraining|arena[_-]?training|
           ultimate|ultimatearena|ultimate[_-]?arena|
           warehouse|hangar|practice|warmup)/ix
           .test(s);
}

/**
 * Match / Gameplay
 */
function isMatchTraffic(url, host){
  var s = (url + host).toLowerCase();
  return /(game|battle|fight|combat|play|
           gs\.|gss|gameserver|
           logic|session|instance|
           zone|shard|node|cell|
           scene|realtime|action|
           frame|sync|tick|state)/ix
           .test(s);
}


// =======================
// GEO POLICY
// =======================
function isEurope(ip){ return startsWithAny(ip, EUROPE); }
function isJordanMatch(ip){ return startsWithAny(ip, JO_TIGHT); }
function isJordanLobby(ip){ return startsWithAny(ip, JO_RECRUIT); }
function isGulf(ip){ return startsWithAny(ip, GULF_NETS); }

function allowLobby(ip){
  if (!ip) return false;
  if (isEurope(ip)) return false;
  return isJordanLobby(ip) || isGulf(ip);
}

function allowMatch(ip){
  if (!ip) return false;
  if (isEurope(ip)) return false;
  return isJordanMatch(ip);
}


// =======================
// MAIN
// =======================
function FindProxyForURL(url, host){
  host = normalizeHost(host);

  // System/CDN direct
  if (containsAny(host, SAFE_DIRECT)) return "DIRECT";
  if (containsAny(host, CDN_DIRECT))  return "DIRECT";

  var ip = getIP(host);

  // Local direct
  if (ip && isPrivateOrLocalIP(ip)) return "DIRECT";

  // Only act on PUBG
  if (!isPUBG(host)) return "DIRECT";

  // DNS fail => BLOCK
  if (!ip) return BLOCK;

  // Europe always blocked
  if (isEurope(ip)) return BLOCK;

  // Lobby + WOW -> lobby proxy
  if (isLobbyTraffic(url, host) || isWOWTraffic(url, host)) {
    if (allowLobby(ip)) return LOBBY_PROXY;
    return BLOCK;
  }

  // Arena + Match -> match proxy (Jordan ONLY)
  if (isArenaTraffic(url, host) || isMatchTraffic(url, host)) {
    if (allowMatch(ip)) return MATCH_PROXY;
    return BLOCK;
  }

  // Default PUBG: treat like match (Jordan ONLY)
  if (allowMatch(ip)) return MATCH_PROXY;
  return BLOCK;
}
