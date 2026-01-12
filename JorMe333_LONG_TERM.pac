// =====================================================
// PUBG LONG-TERM — JO Priority (Low-Maintenance)
// هدف النسخة:
// - أقل تعديل ممكن على المدى البعيد
// - قواعد بسيطة + Whitelist suffix (أكثر شيء ثابت عبر الزمن)
// - Lobby = 2 Proxies + DIRECT fallback
// - Match = 1 Proxy + DIRECT fallback
// - بدون أي منطق صوت (Voice)
// =====================================================
//
// ملاحظة مهمة (واقعية):
// - PAC لا يقدر "يضمن" ماتش أردني إذا ما فيه ماتش أردني فعليًا.
// - بما أنك ما عندك بروكسي خليجي مستقل، ما نقدر نعمل توجيه خليجي حقيقي.
//   الأفضل للمدى البعيد: توجيه PUBG عبر بروكسيات الأردن مع DIRECT كاحتياط.
// - إذا بدك "خليج fallback" فعليًا، لازم بروكسي خليجي ثاني.
//
// =====================================================


// =======================
// PROXIES (Stable)
// =======================
// Lobby: بروكسيين + DIRECT احتياط (لو البروكسيات تعطلت ما تنقطع اللعبة/المتجر)
var LOBBY_PROXY = "PROXY 176.29.153.95:9030; PROXY 212.35.66.45:9030; DIRECT";

// Match: بروكسي واحد + DIRECT احتياط
var MATCH_PROXY = "PROXY 176.29.153.95:20001; DIRECT";

// Block (اختياري — غير مستخدم افتراضيًا في نسخة long-term لتجنب كسر اللعبة)
var BLOCK = "PROXY 127.0.0.1:9";


// =======================
// DIRECT (System / CDN)
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
// PUBG DOMAIN WHITELIST (Suffix-based = أكثر ثبات)
// =======================
var PUBG_SUFFIX_ALLOW = [
  // PUBG / Tencent ecosystem (common, long-lived)
  "proximabeta.com",
  "pubgmobile.com",
  "tencent.com",
  "qq.com",
  "qcloud.com",
  "tencent-cloud.com",

  // GCloud services used by PUBG Mobile
  "gcloudcs.com",
  "gcloudsdk.com"
];

// Fallback كلمات (خفيفة) — فقط لو ظهر دومين جديد خارج suffix
var PUBG_HINT = [
  "pubg","proximabeta","tencent","gcloud","lightspeed","igame","gss","gameserver"
];


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

function isPUBG(host){
  if (inList(host, PUBG_SUFFIX_ALLOW)) return true;
  return containsAny(host, PUBG_HINT);
}

// Lobby / Recruit traffic
function isLobbyTraffic(url, host){
  var s = (url + host).toLowerCase();
  // خليها واسعة شوي لكنها ثابتة
  return /(lobby|login|auth|passport|account|rank|leaderboard|room|rooms|ugc|wow|social|friends|clan|guild|team|invite|party|matchmaking|mm|queue|presence|store|shop|inventory)/.test(s);
}

// Match traffic
function isMatchTraffic(url, host){
  var s = (url + host).toLowerCase();
  return /(match|game|battle|gameserver|session|arena|classic|ranked|realtime|shard|node|cell|scene)/.test(s);
}


// =======================
// MAIN
// =======================
function FindProxyForURL(url, host){
  host = normalizeHost(host);

  // System/CDN direct always
  if (inList(host, SAFE_DIRECT)) return "DIRECT";
  if (inList(host, CDN_DIRECT)) return "DIRECT";

  // Local/private direct
  var ip = getRealIPv4(host);
  if (ip && isPrivateOrLocalIP(ip)) return "DIRECT";

  // Not PUBG -> DIRECT (keep browsing normal)
  if (!isPUBG(host)) return "DIRECT";

  // PUBG routing (simple + long-term)
  if (isLobbyTraffic(url, host)) return LOBBY_PROXY;
  if (isMatchTraffic(url, host)) return MATCH_PROXY;

  // Default PUBG
  return MATCH_PROXY;
}
