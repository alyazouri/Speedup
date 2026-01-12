// =====================================================
// PUBG PRO+ — JO FIRST then GULF (Fallback) — Lobby = 2 Proxies
// طلبك:
// 1) اللوبي = 2 Proxy ✅
// 2) توسعة نطاقات اللوبي (Recruit) لكن تكون أردنية فقط (4G/5G + Viper) ✅ قدر الإمكان
//
// ملاحظة مهمة:
// - PAC ما يقدر يميّز "4G/5G/Viper" بشكل مباشر. اللي نقدر نعمله: نوسع نطاقات IP المعروفة لمزوّدات أردنية
// - ضفت Prefixes مبنية على نطاقات منشورة لزَين (46.32.* و 188.247.*) + أمثلة IP لأمنية (AS9038) (141.105.* و 185.14.*).
//   راجع المصادر بالأسفل.
// =====================================================


// =======================
// MODE
// =======================
var CFG = {
  MODE: "JO_FIRST_THEN_GULF",
  DNS_FAIL_POLICY: "SAFE"
};


// =======================
// PROXIES
// =======================
// الأردن (Primary)
var JO_LOBBY_PROXY = "PROXY 176.29.153.95:9030; PROXY 212.35.66.45:9030"; // ✅ لوبي = بروكسيين
var JO_MATCH_PROXY = "PROXY 176.29.153.95:20001"; // ✅ بروكسي واحد للماتش

// بما إنك ما عندك بروكسي خليجي، نخلي الـ fallback يرجع لنفس بروكسي الأردن (بدون حظر)
var GULF_LOBBY_PROXY = JO_LOBBY_PROXY;
var GULF_MATCH_PROXY = JO_MATCH_PROXY;

var BLOCK = "PROXY 127.0.0.1:9";


// =======================
// DIRECT (SYSTEM / CDN)
// =======================
var SAFE_DIRECT = [
  "captive.apple.com","time.apple.com","ocsp.apple.com",
  "clients3.google.com","gstatic.com","googleapis.com",
  "connectivitycheck.gstatic.com",
  "msftconnecttest.com","msftncsi.com"
];

var CDN_DIRECT = [
  "youtube.com","googlevideo.com","ytimg.com",
  "fbcdn.net","facebook.com",
  "instagram.com","cdninstagram.com",
  "tiktokcdn.com","tiktokv.com",
  "akamaihd.net"
];


// =======================
// PUBG DOMAIN WHITELIST
// =======================
var PUBG_SUFFIX_ALLOW = [
  "proximabeta.com",
  "pubgmobile.com",
  "tencent.com",
  "qq.com",
  "gcloudcs.com",
  "gcloudsdk.com",
  "qcloud.com",
  "tencent-cloud.com"
];

var PUBG_HINT = [
  "pubg","proximabeta","tencent",
  "gcloud","lightspeed","igame",
  "gss","gameserver"
];


// =======================
// IP PREFIX TABLES
// =======================
// الأردن — Tight (مؤكد)
var JO_TIGHT = {
  "176.29.": 1,
  "82.212.": 1,
  "212.34.": 1,
  "212.35.": 1,
  "94.249.": 1
};

// الأردن — Recruit Wide (للّوبي فقط) — توسعة "أردنية" قدر الإمكان
// - أضفنا Prefixes ظاهرة ضمن شبكات زَين (46.32.* و 188.247.*)
// - وأضفنا Prefixes من أمثلة IP لأمنية (141.105.* و 185.14.*)
// إذا لاحظت Prefix يسبب دخول لاعبين غير أردنيين بشكل واضح، احذفه.
var JO_RECRUIT_WIDE = {
  // Tight
  "176.29.": 1,
  "82.212.": 1,
  "212.34.": 1,
  "212.35.": 1,
  "94.249.": 1,

  // إضافات من زَين Data-Jordan (قائمة شبكات تتضمن 46.32.* و 188.247.*)
  "46.32.": 1,
  "188.247.": 1,

  // إضافات من أمثلة IP لأمنية (AS9038)
  "141.105.": 1,
  "185.14.": 1,

  // إضافات قديمة كانت عندك
  "46.185.": 1,
  "37.123.": 1,
  "37.8.": 1
};


// =======================
// HELPERS
// =======================
function hostEndsWith(host, sfx){
  host = host.toLowerCase();
  sfx = sfx.toLowerCase();
  return host === sfx || host.endsWith("." + sfx);
}

function inList(host, list){
  for (var i = 0; i < list.length; i++){
    if (hostEndsWith(host, list[i])) return true;
  }
  return false;
}

function containsAny(s, list){
  s = s.toLowerCase();
  for (var i = 0; i < list.length; i++){
    if (s.indexOf(list[i]) !== -1) return true;
  }
  return false;
}

function normalizeHost(host){
  var i = host.indexOf(":");
  if (i !== -1) return host.substring(0, i);
  return host;
}

function isIPv4(ip){ return ip && ip.indexOf(".") !== -1; }

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

function getRealIPv4(host){
  var ip = dnsResolve(host);
  if (!ip || !isIPv4(ip)) return null;
  return ip;
}

function startsWithAny(ip, table){
  for (var k in table) if (ip.indexOf(k) === 0) return true;
  return false;
}

function isJordanTight(ip){ return ip && startsWithAny(ip, JO_TIGHT); }
function isJordanRecruit(ip){ return ip && startsWithAny(ip, JO_RECRUIT_WIDE); }

function mode(){ return (CFG && CFG.MODE) ? CFG.MODE : "JO_FIRST_THEN_GULF"; }
function dnsFailPolicy(){ return (CFG && CFG.DNS_FAIL_POLICY) ? CFG.DNS_FAIL_POLICY : "SAFE"; }

function isPUBG(host){
  if (inList(host, PUBG_SUFFIX_ALLOW)) return true;
  return containsAny(host, PUBG_HINT);
}

// Lobby / Recruit traffic
function isLobbyTraffic(url, host){
  var s = (url + host).toLowerCase();
  return /(lobby|login|auth|passport|account|rank|leaderboard|room|rooms|ugc|wow|social|friends|clan|guild|team|invite|party|matchmaking|mm|queue|presence)/.test(s);
}

// Match traffic
function isMatchTraffic(url, host){
  var s = (url + host).toLowerCase();
  return /(match|game|battle|gameserver|session|arena|classic|ranked|realtime|action|frame|shard|node|cell|scene)/.test(s);
}

function pickLobbyProxy(ip){
  // الأردن أولاً (Recruit Wide للّوبي)
  if (ip && isJordanRecruit(ip)) return JO_LOBBY_PROXY;

  // fallback: بما إن ما في بروكسي خليجي، ما نحظر — نخلي اللعبة تكمل
  if (mode() === "JO_ONLY") return BLOCK;
  return GULF_LOBBY_PROXY;
}

function pickMatchProxy(ip){
  // الأردن أولاً (Tight للماتش)
  if (ip && isJordanTight(ip)) return JO_MATCH_PROXY;

  // fallback: ما نحظر (بدون بروكسي خليجي)
  if (mode() === "JO_ONLY") return BLOCK;
  return GULF_MATCH_PROXY;
}


// =======================
// MAIN
// =======================
function FindProxyForURL(url, host){
  host = normalizeHost(host);

  if (inList(host, SAFE_DIRECT)) return "DIRECT";
  if (inList(host, CDN_DIRECT)) return "DIRECT";

  var ip = getRealIPv4(host);
  if (ip && isPrivateOrLocalIP(ip)) return "DIRECT";

  if (!isPUBG(host)) return "DIRECT";

  // DNS fail
  if (!ip){
    if (dnsFailPolicy() === "BLOCK") return BLOCK;
    // SAFE: حاول الأردن أولاً ثم fallback
    if (isLobbyTraffic(url, host)) return JO_LOBBY_PROXY + "; " + GULF_LOBBY_PROXY;
    return JO_MATCH_PROXY + "; " + GULF_MATCH_PROXY;
  }

  if (isLobbyTraffic(url, host)) return pickLobbyProxy(ip);
  if (isMatchTraffic(url, host)) return pickMatchProxy(ip);

  return pickMatchProxy(ip);
}
