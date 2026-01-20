// =====================================================
// PUBG JORDAN SOVEREIGN MODE — FINAL STRICT EDITION (iOS)
// ZERO-TRUST • GEO-FENCED • SESSION-LOCKED
// =====================================================

// =======================
// PROXIES (JORDAN ONLY)
// =======================
var JORDAN_PROXY =
  "PROXY 46.185.131.218:443; PROXY 82.212.84.33:5000";
var JORDAN_MATCH = "PROXY 46.185.131.218:20001";
var JORDAN_VOICE =
  "PROXY 82.212.84.33:20001; PROXY 82.212.84.33:10012";
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
// NON-GAME CDN DIRECT
// =======================
var CDN_DIRECT = [
  "youtube.com","googlevideo.com","ytimg.com",
  "facebook.com","fbcdn.net",
  "instagram.com","cdninstagram.com",
  "tiktokcdn.com","tiktokv.com","akamaihd.net"
];

// =======================
// PUBG DETECTOR (STRICT)
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
// GEO — JORDAN ONLY (IPv4)
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
var JO_NETS = {
  "37.220.112.":1,"46.23.112.":1,"46.32.96.":1,"62.72.160.":1,
  "79.173.192.":1,"80.90.160.":1,"82.212.64.":1,"84.18.32.":1,
  "84.18.64.":1,"86.108.":1,"91.106.96.":1,"91.186.224.":1,
  "92.241.32.":1,"94.142.32.":1,"95.141.208.":1,"95.172.192.":1,
  "109.107.224.":1,"109.237.192.":1,"176.57.0.":1,"176.57.48.":1,
  "178.77.128.":1,"178.238.176.":1,"188.123.160.":1,
  "188.247.64.":1,"193.188.64.":1,"194.165.128.":1,
  "212.35.64.":1,"212.118.":1,"213.139.32.":1,
  "213.186.160.":1,"217.23.32.":1,"217.29.240.":1,"217.144.0.":1
};
function isJordanIP(ip){ return startsWithAny(ip, JO_NETS); }

// =======================
// SESSION SOVEREIGNTY
// =======================
var SESSION_LOCKED = false;
function lockSession(){ SESSION_LOCKED = true; }
function isLocked(){ return SESSION_LOCKED === true; }

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
// MATCH STICKY (JORDAN ONLY)
// =======================
var MATCH_SESSION = null;
function matchSticky(){
  if (!MATCH_SESSION) MATCH_SESSION = JORDAN_MATCH;
  return MATCH_SESSION;
}

// =====================================================
// MAIN ROUTER — SOVEREIGN
// =====================================================
function FindProxyForURL(url, host){

  host = host.toLowerCase();

  // iOS SAFE
  for (var i=0;i<IOS_SAFE_DIRECT.length;i++)
    if (dnsDomainIs(host, IOS_SAFE_DIRECT[i])) return "DIRECT";

  // NON-GAME CDN
  for (var j=0;j<CDN_DIRECT.length;j++)
    if (shExpMatch(host, "*"+CDN_DIRECT[j])) return "DIRECT";

  // Non-PUBG traffic
  if (!isPUBG(host)) return "DIRECT";

  // Anti-flap
  var locked = getLockedRoute(host);
  if (locked) return locked;

  // DNS resolve
  var ip = getIPv4(host);
  if (!ip) return BLOCK;

  // 🚨 HARD GEO FENCE
  if (!isJordanIP(ip)) return BLOCK;

  // Once Jordan → session locked forever
  lockSession();

  var phase = classifyPhase(url, host);

  // 🔒 SESSION SOVEREIGNTY
  if (isLocked()) {
    if (phase === "VOICE")
      return lockRoute(host, JORDAN_VOICE, 15000);

    if (phase === "MATCH")
      return matchSticky();

    return lockRoute(host, JORDAN_PROXY, 8000);
  }

  return BLOCK;
}
