// =====================================================
// JoMe1_GOLD.pac — GOLD STANDARD (JorMe Style) — WIDE LOBBY, NO DIRECT IN PROXIES
// =====================================================
// تغييرات حسب طلبك:
// 1) توسعة نطاقات/منطق اللوبي (Recruit + Lobby flows) ✅
// 2) إزالة DIRECT من سلاسل البروكسي (LOBBY/MATCH) ✅
//
// ملاحظة:
// - إزالة DIRECT تعني: إذا البروكسيات توقفت/ضعفت، ممكن اللعبة تتعطل بدل ما تكمل مباشرة.
// =====================================================


// =======================
// PROXIES (Jordan) — NO DIRECT
// =======================
// Lobby = 2 Proxy (Jordan) فقط
var LOBBY_PROXY = "PROXY 176.29.153.95:9030; PROXY 212.35.66.45:9030";

// Match = 1 Proxy (Jordan) فقط
var MATCH_PROXY = "PROXY 176.29.153.95:20001";

// Optional block (غير مستخدم افتراضيًا)
var BLOCK = "PROXY 127.0.0.1:9";


// =======================
// SAFE DIRECT (System/CDN)
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
// PUBG DETECTION (Suffix-First = Long-Term)
// =======================
var PUBG_SUFFIX_ALLOW = [
  "proximabeta.com",
  "pubgmobile.com",
  "tencent.com",
  "qq.com",
  "qcloud.com",
  "tencent-cloud.com",
  "gcloudcs.com",
  "gcloudsdk.com"
];

// Fallback hints (خفيفة) لو ظهر نطاق جديد غير متوقع
var PUBG_HINT = [
  "pubg","proximabeta","tencent","gcloud","lightspeed","igame","gss","gameserver"
];


// =======================
// JORDAN IP TABLES (Classic JorMe Style)
// =======================
// Tight (للعب/الماتش) — أردن مؤكد
var JO_TIGHT = {
  "176.29.":1,
  "82.212.":1,
  "212.34.":1,
  "212.35.":1,
  "94.249.":1
};

// Recruit Wide (للّوبي فقط) — توسعة للّوبي/التجنيد
// ⚠ لا يوجد ضمان 100% أنها "كلها أردنية" بدون ASN، لكن هذه نطاقات استخدمتها سابقًا.
// إذا لاحظت Prefix يجيب نتائج غير مرغوبة، احذفه هنا.
var JO_RECRUIT = {
  // Tight
  "176.29.":1,
  "82.212.":1,
  "212.34.":1,
  "212.35.":1,
  "94.249.":1,

  // توسعة قديمة من نمط سكربتك الأساسي
  "46.185.":1,
  "37.123.":1,
  "37.8.":1
};


// =======================
// HELPERS (Classic JorMe Style)
// =======================
function normalizeHost(h){
  var i = h.indexOf(":");
  return (i !== -1) ? h.substring(0,i) : h;
}

function hostEndsWith(host, sfx){
  host = host.toLowerCase();
  sfx  = sfx.toLowerCase();
  return host === sfx || host.endsWith("." + sfx);
}

function inList(host, list){
  for (var i=0;i<list.length;i++){
    if (hostEndsWith(host, list[i])) return true;
  }
  return false;
}

function containsAny(s, list){
  s = s.toLowerCase();
  for (var i=0;i<list.length;i++){
    if (s.indexOf(list[i]) !== -1) return true;
  }
  return false;
}

function isIPv4(ip){ return ip && ip.indexOf(".") !== -1; }

function getIP(host){
  var ip = dnsResolve(host);
  return (ip && isIPv4(ip)) ? ip : null;
}

function startsWithAny(ip, table){
  for (var k in table){
    if (ip.indexOf(k) === 0) return true;
  }
  return false;
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

// PUBG recognition
function isPUBG(host){
  if (inList(host, PUBG_SUFFIX_ALLOW)) return true;
  return containsAny(host, PUBG_HINT);
}

// =======================
// WIDE LOBBY / RECRUIT DETECTION (Expanded)
// =======================
// توسعة كبيرة لتغطي كل ما قبل الماتش: لوبي + تجميع + اجتماعي + متجر + ملفات اللاعب + أحداث
function isLobbyOrRecruitTraffic(url, host){
  var s = (url + host).toLowerCase();

  // كلمات/مسارات شائعة قبل الماتش
  if (/(matchmaking|queue|presence|party|invite|team|squad|crew|group|room|rooms|lobby|login|auth|passport|account|profile|inventory|loadout|cosmetic|skin|outfit|item|store|shop|purchase|order|payment|wallet|mission|quest|task|event|season|rank|leaderboard|achievement|friends|social|chat|message|clan|guild|report|ban|security|anticheat|update|patch)/.test(s))
    return true;

  // بعض الدومينات/الخدمات اللي تطلع أحيانًا للّوبي (fallback hints)
  // (بدون صوت)
  if (containsAny(s, ["lobby", "matchmaking", "presence", "friends", "social", "store", "inventory", "rank"]))
    return true;

  return false;
}

// Match traffic (keep tight)
function isMatchTraffic(url, host){
  var s = (url + host).toLowerCase();
  return /(match|game|battle|gameserver|session|arena|classic|ranked|realtime|shard|node|cell|scene)/.test(s);
}


// =======================
// MAIN
// =======================
function FindProxyForURL(url, host){
  host = normalizeHost(host);

  // Always DIRECT for system/cdn
  if (inList(host, SAFE_DIRECT)) return "DIRECT";
  if (inList(host, CDN_DIRECT))  return "DIRECT";

  // Local/private DIRECT
  var ip = getIP(host);
  if (ip && isPrivateOrLocalIP(ip)) return "DIRECT";

  // Non-PUBG traffic stays normal
  if (!isPUBG(host)) return "DIRECT";

  // Lobby / Recruit expanded: prefer Lobby proxies (2)
  if (isLobbyOrRecruitTraffic(url, host)) {
    // Classic style: if we can resolve IP and it's in Jordan recruit table, still lobby proxy
    // If IP unknown or not matched, STILL use lobby proxy (Jordan gravity)
    return LOBBY_PROXY;
  }

  // Match: keep one stable proxy
  if (isMatchTraffic(url, host)) {
    // Classic style: no blocking; one stable path
    return MATCH_PROXY;
  }

  // Default PUBG: match path
  return MATCH_PROXY;
}
