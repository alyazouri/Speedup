// ===================================================================
// PUBG Jordan Lock v7.2 FINAL — Best PAC 2026 (iOS Shadowrocket/Quantumult)
// تم إلغاء DIRECT تماماً في كل مكان متعلق بـ PUBG
// فقط JO أو NEAR → PROXY، والباقي BLOCK صارم
// JO_PREFIXES كاملة 175+ من IP2Location 2026
// ===================================================================

// ======================= PROXIES (Residential JO فقط – ضروري) ======================
var JORDAN_LOBBY_PROXY = "PROXY 176.29.153.95:9030; PROXY 212.35.66.45:9030";
var JORDAN_MATCH_PROXY = "PROXY 176.29.153.95:20001";
var VOICE_PROXY        = "PROXY 82.212.84.33:20001; PROXY 82.212.84.33:10012";
var BLOCK              = "PROXY 127.0.0.1:9";

// ======================= SAFE / CDN DIRECT (باقي DIRECT فقط للخدمات الآمنة) ======================
var SAFE_DIRECT = [
  "captive.apple.com", "time.apple.com", "ocsp.apple.com", "ocsp2.apple.com",
  "clients3.google.com", "clients4.google.com", "connectivitycheck.gstatic.com",
  "icloud.com", "itunes.apple.com", "apps.apple.com", "mzstatic.com"
];
var CDN_DIRECT = [
  "youtube.com", "googlevideo.com", "ytimg.com",
  "facebook.com", "fbcdn.net", "instagram.com", "cdninstagram.com"
];

// ======================= HELPERS ==========================
function dnsSafe(h) { try { return dnsResolve(h); } catch (e) { return null; } }
function normalizeHost(h) { var i = h.indexOf(":"); return i !== -1 ? h.substring(0, i) : h; }
function startsWithAny(ip, arr) {
  for (var i = 0; i < arr.length; i++) if (ip.startsWith(arr[i])) return true;
  return false;
}

// ======================= JO_PREFIXES (175+ – تغطية كاملة 2026) =======================
var JO_PREFIXES = [
  "104.122.80.", "104.23.205.", "108.165.34.", "109.107.224.", "109.237.192.", "130.41.16.", "130.41.33.", "130.41.72.",
  "134.238.220.", "134.238.58.", "140.209.238.", "141.0.", "141.105.56.", "141.98.64.", "146.19.239.", "146.19.246.",
  "149.200.128.", "151.242.83.", "151.247.67.", "154.90.129.", "155.117.93.", "157.167.84.", "164.137.103.", "164.137.63.",
  "165.85.27.", "17.119.232.", "172.69.173.", "172.69.36.", "172.71.112.", "176.118.39.", "176.241.64.", "176.28.",
  "176.57.", "176.57.51.", "178.20.184.", "178.238.176.", "178.77.128.", "185.10.216.", "185.109.120.", "185.109.192.",
  "185.12.244.", "185.135.200.", "185.139.220.", "185.14.132.", "185.159.180.", "185.160.236.", "185.163.205.", "185.173.57.",
  "185.175.248.", "185.176.44.", "185.180.80.", "185.182.136.", "185.19.112.", "185.19.228.", "185.193.176.", "185.197.176.",
  "185.200.128.", "185.24.128.", "185.241.62.", "185.253.112.", "185.27.116.", "185.27.118.", "185.30.248.", "185.33.28.",
  "185.40.19.", "185.43.146.", "185.51.212.", "185.57.120.", "185.63.118.", "185.80.104.", "185.80.24.", "185.96.68.",
  "185.98.220.", "188.123.160.", "188.247.64.", "193.108.134.", "193.111.29.", "193.17.53.", "193.188.64.", "193.189.148.",
  "193.203.24.", "194.104.95.", "194.165.128.", "195.18.9.", "2.17.24.", "208.127.14.", "212.105.132.", "212.118.",
  "212.32.83.", "212.34.", "212.35.64.", "213.139.32.", "213.186.160.", "217.144.", "217.23.32.", "217.29.240.",
  "23.202.60.", "23.230.88.", "23.230.93.", "34.103.178.", "34.103.234.", "34.124.73.", "34.99.162.", "34.99.234.",
  "37.123.64.", "37.152.", "37.17.192.", "37.202.64.", "37.220.112.", "37.252.222.", "37.44.32.", "37.75.144.",
  "37.75.148.", "43.175.96.", "45.142.196.", "45.67.60.", "46.185.128.", "46.23.112.", "46.248.192.", "46.32.96.",
  "5.198.240.", "5.199.184.", "5.45.128.", "57.188.4.", "57.83.24.", "62.72.162.", "62.72.165.", "62.72.179.",
  "62.72.184.", "75.104.75.", "77.245.", "79.134.128.", "79.173.192.", "80.10.144.", "80.10.168.", "80.10.48.",
  "80.10.8.", "80.15.248.", "80.90.160.", "81.21.", "81.21.8.", "81.253.240.", "81.253.96.", "81.28.112.",
  "81.52.144.", "81.52.224.", "82.212.64.", "84.18.32.", "84.252.106.", "85.159.216.", "86.108.", "87.236.232.",
  "87.238.128.", "89.20.49.", "89.28.216.", "89.38.152.", "90.84.64.", "91.106.96.", "91.132.100.", "91.186.224.",
  "91.212.", "91.220.195.", "91.223.202.", "92.241.32.", "92.253.", "93.115.15.", "93.115.2.", "93.191.176.",
  "93.93.144.", "93.95.200.", "94.127.208.", "94.142.32.", "94.249.", "95.141.208.", "95.172.192."
];

var NEAR_PREFIXES = [
  "212.71.", "94.26.", "5.36.", "37.210.", "31.193.", "185.140.", "45.159."
];

function isJordanIP(ip) { return startsWithAny(ip, JO_PREFIXES); }
function isNearIP(ip)    { return startsWithAny(ip, NEAR_PREFIXES); }

// ======================= CONTEXT DETECTION ======================
function isPUBG(h) {
  h = h.toLowerCase();
  return /(pubg|pubgm|pubgmobile|intlgame|igamecj|proximabeta|tencent|qq\.com|krafton|lightspeed)/.test(h);
}
function isFriendUI(u, h) { var s=(u+h).toLowerCase(); return /(friend|addfriend|search|profile|uid|social|clan|invite)/.test(s); }
function isLobby(u, h) { var s=(u+h).toLowerCase(); return /(lobby|matchmaking|queue|room|squad|party|dispatcher)/.test(s); }
function isMatch(u, h) { var s=(u+h).toLowerCase(); return /(game|battle|gs\.|gameserver|matchserver|classic|ranked)/.test(s); }
function isArena(u, h) { var s=(u+h).toLowerCase(); return /(arena|tdm|deathmatch|evo|training)/.test(s); }
function isWOW(u, h) { var s=(u+h).toLowerCase(); return /(wow|worldofwonder|ugc|creative|customroom)/.test(s); }
function isVoice(u, h) { var s=(u+h).toLowerCase(); return /(voice|voip|rtc|webrtc|audio)/.test(s); }

// ======================= SESSION ======================
var SESSION_START = Date.now();

// ======================= MAIN ROUTER =======================
function FindProxyForURL(url, host) {
  host = normalizeHost((host || "").toLowerCase());

  // Safe/CDN فقط DIRECT
  for (var i = 0; i < SAFE_DIRECT.length; i++) if (dnsDomainIs(host, SAFE_DIRECT[i])) return "DIRECT";
  for (var j = 0; j < CDN_DIRECT.length; j++) if (shExpMatch(host, "*." + CDN_DIRECT[j]) || shExpMatch(host, CDN_DIRECT[j])) return "DIRECT";

  // غير PUBG → DIRECT (مثل مواقع عادية)
  if (!isPUBG(host)) return "DIRECT";

  var ip = dnsSafe(host);
  if (!ip) return BLOCK;

  var isJO   = isJordanIP(ip);
  var isNear = isNearIP(ip);
  var elapsed = Date.now() - SESSION_START;
  var strict = elapsed < 120000;

  // Voice: JO فقط
  if (isVoice(url, host)) {
    return isJO ? VOICE_PROXY : BLOCK;
  }

  // Friends: JO أو NEAR
  if (isFriendUI(url, host)) {
    return (isJO || isNear) ? JORDAN_LOBBY_PROXY : BLOCK;
  }

  // Lobby: JO أولوية، NEAR بعد strict فقط
  if (isLobby(url, host)) {
    if (isJO) return JORDAN_LOBBY_PROXY;
    if (!strict && isNear) return JORDAN_LOBBY_PROXY;
    return BLOCK;
  }

  // Arena / WoW: JO أولوية، NEAR بعد strict
  if (isArena(url, host) || isWOW(url, host)) {
    if (isJO) return JORDAN_MATCH_PROXY;
    if (!strict && isNear) return JORDAN_MATCH_PROXY;
    return BLOCK;
  }

  // Match: JO أو NEAR
  if (isMatch(url, host)) {
    return (isJO || isNear) ? JORDAN_MATCH_PROXY : BLOCK;
  }

  // Default لأي شيء PUBG آخر: JO أو NEAR فقط
  return (isJO || isNear) ? JORDAN_MATCH_PROXY : BLOCK;
}
