// =====================================================
// PUBG ALL-IN JORDAN ULTRA — LEGENDARY FINAL (iOS)
// Jordan FIRST → Gulf ONLY
// Gravity Well + Session Magnet + Shadow Scoring
// =====================================================

// =======================
// PROXIES (STABLE)
// =======================
var LOBBY_PROXY = "PROXY 82.212.67.28:8000, PROXY 37.202.86.226:443, PROXY 176.29.153.95:9030, PROXY 109.107.244.30:443, PROXY 212.35.66.45:9030, PROXY 82.212.84.33:9030, PROXY 77.245.14.135:9030";
var MATCH_PROXY = "PROXY 46.185.128.145:443";
var VOICE_PROXY = "PROXY 82.212.84.33:20001";
var BLOCK = "PROXY 127.0.0.1:9";

// =======================
// 🍎 iOS SAFE DIRECT
// =======================
var IOS_SAFE_DIRECT = [
  "captive.apple.com","time.apple.com","ocsp.apple.com","ocsp2.apple.com",
  "gsp-ssl.ls.apple.com","mesu.apple.com","swcdn.apple.com",
  "configuration.apple.com","push.apple.com",
  "clients3.google.com","clients4.google.com",
  "connectivitycheck.gstatic.com",
  "icloud.com","itunes.apple.com","apps.apple.com","mzstatic.com"
];

// =======================
// CDN / MEDIA DIRECT
// =======================
var CDN_DIRECT = [
  "youtube.com","googlevideo.com","ytimg.com",
  "facebook.com","fbcdn.net",
  "instagram.com","cdninstagram.com",
  "tiktokcdn.com","tiktokv.com","akamaihd.net"
];

// =======================
// PUBG DETECTOR
// =======================
function isPUBG(host){
  return /(pubg|pubgm|pubgmobile|igamecj|proximabeta|tencent|qq|qcloud|gcloudsdk|krafton|lightspeed|wow|ugc|creative)/.test(host);
}

// =======================
// PHASE CLASSIFIER
// =======================
function classifyPhase(url, host){
  var s = (url + host).toLowerCase();
  if (/(voice|rtc|webrtc|voip|audio|mic|talk)/.test(s)) return "VOICE";
  if (/(worldofwonder|ugc|creative|custom|template|workshop|editor|publish)/.test(s)) return "WOW";
  if (/(arena|tdm|training|warehouse|hangar|gun|gungame)/.test(s)) return "ARENA";
  if (/(lobby|matchmaking|queue|room|recruit|team|squad|invite)/.test(s)) return "LOBBY";
  if (/(game|battle|combat|gs\.|logic|instance|realtime|session|frame)/.test(s)) return "MATCH";
  return "UNKNOWN";
}

// =======================
// GEO (IPv4 ONLY)
// =======================
function isIPv4(ip){ return ip && ip.indexOf(".") !== -1; }
function getIPv4(host){
  var ip = dnsResolve(host);
  return isIPv4(ip) ? ip : null;
}
function startsWithAny(ip, table){
  for (var k in table) if (ip.indexOf(k) === 0) return true;
  return false;
}
var JO_NETS = {"213.186.": 1};
var GULF_NETS = {"213.186.": 1};
function isJordanIP(ip){ return startsWithAny(ip, JO_NETS); }
function isGulfIP(ip){ return startsWithAny(ip, GULF_NETS); }

// =====================================================
// 🌌 LEGENDARY INTELLIGENCE LAYER
// =====================================================

// 1️⃣ Jordan Gravity Well
// أول 4 طلبات لأي Host PUBG تُعامل كـ JO افتراضيًا
var GRAVITY = {};
function gravityJordan(host){
  GRAVITY[host] = (GRAVITY[host] || 0) + 1;
  return GRAVITY[host] <= 4;
}

// 2️⃣ Jordan Session Magnet
// إذا نجح الأردن مرة، نثبت الجلسة كلها
var SESSION_JO = false;
function markSessionJordan(){ SESSION_JO = true; }
function isSessionJordan(){ return SESSION_JO === true; }

// 3️⃣ Shadow Jordan Scoring
// القرار لا يتغير إلا إذا الفرق واضح
var SHADOW_SCORE = {};
function scoreHost(host, delta){
  SHADOW_SCORE[host] = (SHADOW_SCORE[host] || 0) + delta;
  return SHADOW_SCORE[host];
}
function prefersJordan(host){
  return (SHADOW_SCORE[host] || 0) >= 2;
}

// =======================
// ROUTE LOCK (ANTI-FLAP)
// =======================
var ROUTE_LOCK = {};
function lockRoute(host, proxy, ms){
  ROUTE_LOCK[host] = { p: proxy, t: Date.now() + ms };
  return proxy;
}
function getLockedRoute(host){
  var r = ROUTE_LOCK[host];
  if (r && Date.now() < r.t) return r.p;
  return null;
}

// =======================
// MATCH STICKY
// =======================
var MATCH_SESSION = null;
function matchSticky(proxy){
  if (!MATCH_SESSION) MATCH_SESSION = proxy;
  return MATCH_SESSION;
}

// =====================================================
// MAIN ROUTER — LEGENDARY
// =====================================================
function FindProxyForURL(url, host){

  host = host.toLowerCase();

  // iOS SAFE DIRECT
  for (var i=0;i<IOS_SAFE_DIRECT.length;i++)
    if (dnsDomainIs(host, IOS_SAFE_DIRECT[i])) return "DIRECT";
  for (var j=0;j<CDN_DIRECT.length;j++)
    if (shExpMatch(host, "*"+CDN_DIRECT[j])) return "DIRECT";

  // Anti-flap
  var locked = getLockedRoute(host);
  if (locked) return locked;

  // Non-PUBG
  if (!isPUBG(host)) return "DIRECT";

  var ip = getIPv4(host);
  if (!ip) return BLOCK;

  var JO = isJordanIP(ip);
  var GF = isGulfIP(ip);
  if (!(JO || GF)) return BLOCK;

  var phase = classifyPhase(url, host);

  // 🌌 Gravity Well (قبل أي شيء)
  if (gravityJordan(host)) {
    scoreHost(host, 1);
    if (JO) markSessionJordan();
    return lockRoute(host, LOBBY_PROXY, 6000);
  }

  // 🧲 Session Magnet
  if (isSessionJordan()) {
    scoreHost(host, 2);
    return lockRoute(host, LOBBY_PROXY, 8000);
  }

  // 🧠 Shadow Scoring
  if (JO) scoreHost(host, 3);
  if (GF) scoreHost(host, -1);

  if (prefersJordan(host)) {
    if (JO) markSessionJordan();
    return lockRoute(host, LOBBY_PROXY, 8000);
  }

  // PHASE ROUTING
  if (phase === "VOICE")
    return lockRoute(host, VOICE_PROXY, 15000);

  if (phase === "MATCH") {
    if (JO) markSessionJordan();
    return matchSticky(MATCH_PROXY);
  }

  return lockRoute(host, LOBBY_PROXY, 6000);
}
