// =====================================================
// PUBG ALL-IN JORDAN ULTRA — FINAL COMPLETE (LONG-TERM)
// Priority: Jordan FIRST -> Gulf ONLY (NO EUROPE/ASIA/AMERICAS)
// WOW/UGC/Rooms forced to Lobby Proxy 9030 (JO→Gulf)
// Stable low ping: fixed proxies, no rotation
// =====================================================

// =======================
// PROXIES (STABLE)
// =======================
var LOBBY_PROXY = "PROXY 176.29.153.95:9030; " +
                  "PROXY 212.35.66.45:9030";

var MATCH_PROXY = "PROXY 176.29.153.95:20001";

var VOICE_PROXY = "PROXY 82.212.84.33:20001; " +
                  "PROXY 82.212.84.33:10012";

var BLOCK = "PROXY 127.0.0.1:9";

// =======================
// SAFE DIRECT (SYSTEM)
// =======================
var SAFE_DIRECT = [
  "captive.apple.com",
  "time.apple.com",
  "ocsp.apple.com",
  "clients3.google.com",
  "gstatic.com",
  "googleapis.com"
];

// =======================
// CDN / MEDIA DIRECT (keeps browsing stable)
// =======================
var CDN_DIRECT = [
  "youtube.com","googlevideo.com","ytimg.com",
  "fbcdn.net","facebook.com",
  "instagram.com","cdninstagram.com",
  "tiktokcdn.com","tiktokv.com",
  "akamaihd.net"
];

// =======================
// GEO CONFIG
// =======================
var CFG = {
  GEO_MODE: "JO_GULF_ONLY" // allow: Jordan or Gulf only, block everything else
};

// =======================
// JORDAN — PREFIX TABLES (expanded, same style)
// "82.212.64.0/18","188.123.160.0/19", "37.202.64.0/19",
// =======================
var JO_TIGHT = {
  // Core JO (very common)
"82.212.":1,
"188.123.":1,
"37.202.":1,
"212.35.":1,
"176.29.":1,
"91.106.":1,
"46.32.":1,
"46.185.":1,
"86.108.":1,
"92.253.":1,
"94.249.":1,
"188.247.":1,
"149.200.":1
};

var JO_FULL = {
  // Extra JO common ranges
  "78.135.":1, "78.138.":1,
  "37.48.":1, "37.49.":1, "37.50.":1, "37.51.":1,
  "37.75.":1, "37.202.":1,
  "79.134.":1, "79.173.":1,
  "81.21.":1, "81.28.":1, "80.90.":1,
  "62.72.":1, "62.150.":1, "62.251.":1,
  "85.159.":1,
  "109.107.":1, "109.237.":1,
  "188.161.":1,
  "193.188.":1, "193.227.":1,
  "195.135.":1, "195.170.":1, "195.228.":1, "195.229.":1,
  "213.6.":1, "213.42.":1, "213.139.":1, "213.186.":1,
  "217.23.":1, "217.29.":1, "217.144.":1, "217.171.":1,
  "5.45.":1, "5.198.":1, "5.199.":1,

  // Added (expanded JO ranges)
  "2.59.":1, "37.17.":1, "37.44.":1, "37.123.":1, "37.152.":1,
  "37.220.":1, "37.221.":1, "37.222.":1, "45.142.":1, "45.144.":1,
  "45.145.":1, "46.23.":1, "46.248.":1, "77.245.":1, "80.10.":1,
  "80.244.":1, "81.52.":1, "89.28.":1, "185.98.":1, "185.99.":1,
  "185.100.":1, "185.101.":1, "193.189.":1, "193.194.":1
};

// =======================
// GULF — EXPANDED BIG (same style, anti-east drift)
// =======================
var GULF_NETS = {
  // Bahrain (closest, best fallback)
  "185.125.":1, "46.183.":1, "37.131.":1, "80.241.":1, "84.235.":1,

  // Saudi Arabia (big coverage)
  "212.71.":1, "185.193.":1, "185.194.":1, "185.195.":1, "185.196.":1,
  "94.26.":1, "95.177.":1, "46.152.":1, "37.224.":1,

  // UAE (big)
  "5.62.":1, "31.192.":1, "31.193.":1, "86.96.":1,
  "94.200.":1, "94.201.":1, "94.202.":1, "217.164.":1,

  // Kuwait
  "62.84.":1, "82.178.":1, "91.140.":1, "94.128.":1,

  // Qatar
  "37.210.":1, "89.211.":1,

  // Oman
  "185.64.":1, "5.36.":1
};

// =======================
// AFGHANISTAN — HARD BLOCK (prefix + CIDR confirm)
// (Stops AF endpoints even if they look "Asia-ish")
// =======================
var AF_HINT = { "58.147.":1, "59.153.":1, "61.5.":1, "91.109.":1, "103.":1, "45.":1 };

// =======================
// FAR-REGION QUICK BLOCKS (extra safety)
// =======================
var BLOCKED = [
  // Asia Pacific (common cloud edges)
  "8.222.","47.245.","43.132.","18.163.","13.228.","13.229.",
  "13.250.","52.220.","54.169.","54.251.","175.41.","119.81.",
  "103.28.","103.29.","203.104.","210.16.","52.74.","52.77.",
  "8.210.","47.74.","47.88.","120.76.","121.40.","139.224.",
  // Europe
  "18.185.","3.120.","52.58.","35.156.","52.28.","52.29.",
  "18.194.","3.64.","3.65.","3.66.","52.30.","18.196.",
  "52.59.","18.157.","3.121.","3.122.","3.123.",
  // Americas
  "54.218.","52.88.","34.208.","18.237.","52.36.","54.244.",
  "35.162.","44.228.","34.220.","54.200.","52.24.","18.232.",
  "54.85.","34.192.","52.90.","34.224."
];

// =====================================================
// HELPERS — COMPLETE
// =====================================================

// ✅ PUBG DETECTION — EXPANDED (LONG-TERM)
function isPUBG(host){
  host = host.toLowerCase();
  return /(pubg|pubgm|pubgmobile|intlgame|igamecj|proximabeta|tencent|qq|qcloud|gcloudsdk|krafton|lightspeed|amsoveasea|lightspeed|vmpone|vmp|gme|gamecenter|wow|worldofwonder|ugc|creative|creation|creations)/.test(host);
}

// Lobby / Recruit / Queue
function isLobbyTraffic(url, host){
  var s = (url + host).toLowerCase();
  return /(lobby|matchmaking|matching|queue|room|recruit|team|squad|party|invite|gate|dispatcher|router|region|allocation)/.test(s);
}

// ✅ WOW detector (NOT relying on "wow" only)
function isWOWTraffic(url, host){
  var s = (url + host).toLowerCase();
  return /(worldofwonder|wow|ugc|creative|creation|creations|room|rooms|customroom|custom-room|map|maps|template|templates|featured|trending|popular|recommend|recommended|daily|weekly|newcreations|new-creations|contests|contest|community|workshop|editor|publish|published|playtogether|play-together)/.test(s);
}

// Arena helper (TDM etc.)
function isArenaTraffic(url, host){
  var s = (url + host).toLowerCase();
  return /(arena|tdm|deathmatch|teamdeathmatch|team[_-]?deathmatch|gun|gungame|gun[_-]?game|training|arenatraining|arena[_-]?training|ultimate|ultimatearena|ultimate[_-]?arena|warehouse|hangar|wow)/.test(s);
}

// Match / gameplay
function isMatchTraffic(url, host){
  var s = (url + host).toLowerCase();
  return /(game|battle|fight|combat|play|gs\.|gss|gameserver|logic|session|instance|zone|shard|node|cell|scene|realtime|action|frame)/.test(s);
}

// Voice
function isVoiceTraffic(url, host){
  var s = (url + host).toLowerCase();
  return /(voice|rtc|webrtc|voip|audio|mic|talk|channel|stream|speech|sound)/.test(s);
}

function startsWithAny(ip, table){
  for (var k in table)
    if (ip.indexOf(k) === 0) return true;
  return false;
}

// PAC completeness helpers
function normalizeHost(host){
  var i = host.indexOf(":");
  if (i !== -1) return host.substring(0, i);
  return host;
}

function isIPv4(ip){
  return ip && ip.indexOf(".") !== -1;
}

function isPrivateOrLocalIP(ip){
  if (!isIPv4(ip)) return false;
  return (
    isInNet(ip, "10.0.0.0", "255.0.0.0") ||
    isInNet(ip, "172.16.0.0", "255.240.0.0") ||
    isInNet(ip, "192.168.0.0", "255.255.0.0") ||
    isInNet(ip, "127.0.0.0", "255.0.0.0") ||
    isInNet(ip, "169.254.0.0", "255.255.0.0")
  );
}

// REAL IPv4 only: if IPv6/NULL => null
function getRealIPv4(host){
  var ip = dnsResolve(host);
  if (isIPv4(ip)) return ip;
  return null;
}

// =======================
// GEO CHECKS — COMPLETE
// =======================
function isAfghanistanIP(ip){
  if (!ip) return false;

  // quick hint gate
  var maybe =
    ip.indexOf("58.147.")===0 || ip.indexOf("59.153.")===0 ||
    ip.indexOf("61.5.")===0   || ip.indexOf("91.109.")===0 ||
    ip.indexOf("103.")===0    || ip.indexOf("45.")===0;

  if (!maybe) return false;

  // confirmers (tight)
  if (isInNet(ip, "58.147.128.0", "255.255.224.0")) return true; // /19
  if (isInNet(ip, "59.153.124.0", "255.255.252.0")) return true; // /22
  if (isInNet(ip, "61.5.192.0",   "255.255.240.0")) return true; // /20
  if (isInNet(ip, "91.109.216.0", "255.255.248.0")) return true; // /21

  // AF heavy 103.* (tight)
  if (isInNet(ip, "103.5.172.0",  "255.255.252.0")) return true; // /22
  if (isInNet(ip, "103.13.64.0",  "255.255.252.0")) return true; // /22
  if (isInNet(ip, "103.17.60.0",  "255.255.252.0")) return true; // /22
  if (isInNet(ip, "103.18.160.0", "255.255.252.0")) return true; // /22
  if (isInNet(ip, "103.23.36.0",  "255.255.252.0")) return true; // /22
  if (isInNet(ip, "103.28.132.0", "255.255.252.0")) return true; // /22

  // AF 45.* (tight)
  if (isInNet(ip, "45.65.56.0",   "255.255.252.0")) return true; // /22
  if (isInNet(ip, "45.116.128.0", "255.255.254.0")) return true; // /23

  return false;
}

function isJordanIP(ip){
  if (!ip) return false;
  if (startsWithAny(ip, JO_TIGHT) || startsWithAny(ip, JO_FULL)) return true;

  // Big JO confirmers
  if (isInNet(ip, "176.28.128.0", "255.255.128.0")) return true; // /17
  if (isInNet(ip, "176.29.0.0",   "255.255.0.0"))   return true; // /16
  if (isInNet(ip, "46.185.128.0", "255.255.128.0")) return true; // /17
  if (isInNet(ip, "86.108.0.0",   "255.255.128.0")) return true; // /17
  if (isInNet(ip, "92.253.0.0",   "255.255.128.0")) return true; // /17
  if (isInNet(ip, "94.249.0.0",   "255.255.128.0")) return true; // /17
  if (isInNet(ip, "212.35.64.0",  "255.255.224.0")) return true; // /19
  if (isInNet(ip, "188.247.64.0", "255.255.224.0")) return true; // /19
  if (isInNet(ip, "91.106.0.0",   "255.255.0.0"))   return true; // /16
  if (isInNet(ip, "82.212.64.0",  "255.255.192.0")) return true; // /18
  if (isInNet(ip, "149.200.128.0","255.255.128.0")) return true; // /17

  return false;
}

function isGulfIP(ip){
  if (!ip) return false;
  if (startsWithAny(ip, GULF_NETS)) return true;

  // Bahrain
  if (isInNet(ip, "185.125.188.0", "255.255.252.0")) return true; // /22
  if (isInNet(ip, "185.125.190.0", "255.255.254.0")) return true; // /23
  if (isInNet(ip, "46.183.216.0",  "255.255.252.0")) return true; // /22

  // Saudi (bigger)
  if (isInNet(ip, "212.71.0.0",    "255.255.0.0"))   return true; // /16
  if (isInNet(ip, "185.193.64.0",  "255.255.192.0")) return true; // /18
  if (isInNet(ip, "185.194.0.0",   "255.254.0.0"))   return true; // /15
  if (isInNet(ip, "94.26.0.0",     "255.255.0.0"))   return true; // /16
  if (isInNet(ip, "95.177.0.0",    "255.255.0.0"))   return true; // /16

  // UAE
  if (isInNet(ip, "5.62.60.0",     "255.255.252.0")) return true; // /22
  if (isInNet(ip, "31.192.0.0",    "255.255.0.0"))   return true; // /16
  if (isInNet(ip, "31.193.0.0",    "255.255.0.0"))   return true; // /16
  if (isInNet(ip, "86.96.0.0",     "255.255.0.0"))   return true; // /16

  // Kuwait
  if (isInNet(ip, "62.84.0.0",     "255.255.0.0"))   return true; // /16
  if (isInNet(ip, "82.178.0.0",    "255.255.0.0"))   return true; // /16
  if (isInNet(ip, "91.140.0.0",    "255.255.0.0"))   return true; // /16

  // Qatar
  if (isInNet(ip, "37.210.0.0",    "255.255.0.0"))   return true; // /16
  if (isInNet(ip, "89.211.0.0",    "255.255.0.0"))   return true; // /16

  // Oman
  if (isInNet(ip, "185.64.0.0",    "255.255.0.0"))   return true; // /16
  if (isInNet(ip, "5.36.0.0",      "255.255.0.0"))   return true; // /16

  return false;
}

// =====================================================
// TIMING PRESSURE — increases Jordan chance (longer search)
// =====================================================
var RECRUIT_JO_ONLY_MS = 90000; // 90s: push Jordan harder
var RECRUIT_START_TS = Date.now();
function recruitJOOnly(){
  return (Date.now() - RECRUIT_START_TS) < RECRUIT_JO_ONLY_MS;
}

var ARENA_JO_ONLY_MS = 45000;   // 45s JO-only in arena
var ARENA_GULF_ONLY_MS = 180000; // then JO/Gulf (still no Europe)
var ARENA_START_TS = Date.now();
function arenaPhase(){
  var dt = Date.now() - ARENA_START_TS;
  if (dt < ARENA_JO_ONLY_MS) return "JO_ONLY";
  if (dt < ARENA_GULF_ONLY_MS) return "JO_OR_GULF";
  return "AFTER";
}

// WOW timing (optional pressure: Jordan first then Gulf)
var WOW_JO_ONLY_MS = 60000; // 60s JO-only in WOW rooms/ugc
var WOW_START_TS = Date.now();
function wowJOOnly(){
  return (Date.now() - WOW_START_TS) < WOW_JO_ONLY_MS;
}

// =====================================================
// MAIN ROUTING ENGINE — FINAL COMPLETE
// =====================================================
function FindProxyForURL(url, host){

  host = normalizeHost(host.toLowerCase());

  // SAFE DIRECT
  for (var i=0;i<SAFE_DIRECT.length;i++)
    if (dnsDomainIs(host, SAFE_DIRECT[i])) return "DIRECT";

  for (var j=0;j<CDN_DIRECT.length;j++)
    if (shExpMatch(host, "*"+CDN_DIRECT[j])) return "DIRECT";

  if (isPlainHostName(host)) return BLOCK;

  // Non-PUBG direct
  if (!isPUBG(host)) return "DIRECT";

  // Resolve IPv4 only
  var ip = getRealIPv4(host);
  if (!ip) return BLOCK;
  if (isPrivateOrLocalIP(ip)) return "DIRECT";

  // HARD BLOCK Afghanistan
  if (isAfghanistanIP(ip)) return BLOCK;

  // Quick far-region blocks
  for (var b=0;b<BLOCKED.length;b++)
    if (ip.indexOf(BLOCKED[b])===0) return BLOCK;

  var JO = isJordanIP(ip);
  var GF = isGulfIP(ip);

  // Enforce mode: Jordan/Gulf only
  if (CFG.GEO_MODE === "JO_GULF_ONLY" && !(JO || GF)) return BLOCK;

  // =======================
  // WOW / UGC / Rooms forced to lobby proxy 9030
  // =======================
  if (isWOWTraffic(url, host)) {
    if (wowJOOnly()) {
      if (JO) return LOBBY_PROXY;
      return BLOCK; // keep searching Jordan
    }
    // after pressure: allow JO or Gulf (still no Europe)
    if (JO || GF) return LOBBY_PROXY;
    return BLOCK;
  }

  // =======================
  // ARENA (TDM/Gun/Training/Ultimate/Warehouse/Hangar)
  // =======================
  if (isArenaTraffic(url, host)) {
    var phase = arenaPhase();

    if (phase === "JO_ONLY") {
      if (JO) return LOBBY_PROXY;
      return BLOCK;
    }

    if (phase === "JO_OR_GULF") {
      if (JO || GF) return LOBBY_PROXY;
      return BLOCK;
    }

    if (JO || GF) return LOBBY_PROXY;
    return BLOCK;
  }

  // =======================
  // RECRUIT / LOBBY
  // =======================
  if (isLobbyTraffic(url, host)) {
    if (recruitJOOnly()) {
      if (JO) return LOBBY_PROXY;
      return BLOCK; // push Jordan harder
    }
    if (JO || GF) return LOBBY_PROXY;
    return BLOCK;
  }

  // =======================
  // VOICE
  // =======================
  if (isVoiceTraffic(url, host))
    return VOICE_PROXY;

  // =======================
  // MATCH (Classic/Ranked)
  // =======================
  if (isMatchTraffic(url, host))
    return MATCH_PROXY;

  // Default PUBG
  return MATCH_PROXY;
}
