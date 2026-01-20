// =====================================================
// PUBG Jordan Zero Leak Final 2026 – saeed Edition
// هدف: أردن فقط 100% قدر الإمكان | يمني/عراقي/أفغاني/أجانب BLOCK
// محدث يناير 2026 – Zain/Umniah/Orange + foreign bad IPs
// =====================================================

// =======================
// PROXIES
// =======================
var LOBBY_PROXY  = "PROXY 46.185.131.218:443; PROXY 82.212.84.33:5000";
var MATCH_PROXY  = "PROXY 46.185.131.218:20001";
var VOICE_PROXY  = "PROXY 82.212.84.33:20001; PROXY 82.212.84.33:10012";
var BLOCK        = "PROXY 127.0.0.1:9";

// =======================
// SAFE DIRECT
// =======================
var IOS_SAFE_DIRECT = [
  "captive.apple.com","time.apple.com","ocsp.apple.com","ocsp2.apple.com",
  "gsp-ssl.ls.apple.com","mesu.apple.com","swcdn.apple.com",
  "configuration.apple.com","push.apple.com",
  "clients3.google.com","clients4.google.com",
  "connectivitycheck.gstatic.com",
  "icloud.com","itunes.apple.com","apps.apple.com","mzstatic.com"
];

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
// GEO + BAD FOREIGN
// =======================
function isIPv4(ip){ return ip && ip.indexOf(".") !== -1 && !ip.includes(":"); }
function getIPv4(host){ var ip = dnsResolve(host); return isIPv4(ip) ? ip : null; }
function startsWithAny(ip, table){ for (var k in table) if (ip.indexOf(k) === 0) return true; return false; }

// JO_NETS – Ultra Strict 2026 (Zain + Umniah + Orange)
var JO_NETS = {
  // Zain (AS48832) – أكبر
  "46.32."   :1, "46.185."  :1, "77.245."  :1, "176.28."  :1, "176.29."  :1, "217.23."  :1,
  // Umniah (AS9038)
  "5.45."    :1, "37.220."  :1, "46.23."   :1, "46.248."  :1, "85.159."  :1, "91.186."  :1,
  "95.172."  :1, "109.107." :1,
  // Orange (AS8376)
  "92.253."  :1, "94.249."  :1, "212.34."  :1, "212.118." :1, "86.108."  :1, "194.165." :1
};

var FOREIGN_BAD = {
  // Yemen شائع في PUBG proxies
  "5.62."   :1, "77.247."  :1, "82.114."  :1, "185.96."  :1, "195.114." :1,
  // Iraq
  "5.43."   :1, "37.236."  :1, "45.153."  :1, "45.156."  :1, "82.199."  :1, "185.53."  :1, "217.169." :1,
  // Afghanistan + بعض Pak/India leaks
  "103.28." :1, "103.124." :1, "115.186." :1, "117.55."  :1, "180.94."  :1, "103."    :1, "115."    :1, "117."    :1
};

var DC_PATTERNS = {
  "3." :1, "4." :1, "5." :1, "13." :1, "18." :1, "23." :1, "35." :1, "45." :1, "51." :1,
  "52." :1, "54." :1, "104." :1, "129." :1, "134." :1, "141." :1, "167." :1, "172." :1,
  "185." :1, "188." :1, "103." :1
};

function isJordanIP(ip){ return startsWithAny(ip, JO_NETS); }
function isForeignBad(ip){ return startsWithAny(ip, FOREIGN_BAD); }
function isSuspectDC(ip){ return startsWithAny(ip, DC_PATTERNS); }

// =======================
// INTELLIGENCE
// =======================
var GRAVITY = {};
var SESSION_JO = false;
var ROUTE_LOCK = {};
var SHADOW_SCORE = {};

function gravityJordan(host){ GRAVITY[host] = (GRAVITY[host]||0)+1; return GRAVITY[host] <=5; }
function markSessionJordan(){ SESSION_JO = true; }
function isSessionJordan(){ return SESSION_JO; }
function scoreHost(host, delta){ SHADOW_SCORE[host] = (SHADOW_SCORE[host]||0) + delta; return SHADOW_SCORE[host]; }
function lockRoute(host, proxy, ms){ ROUTE_LOCK[host] = {p:proxy, t:Date.now()+ms}; return proxy; }
function getLockedRoute(host){ var r=ROUTE_LOCK[host]; return (r && Date.now()<r.t)?r.p:null; }

var MATCH_SESSION = null;
function matchSticky(proxy){ if (!MATCH_SESSION) MATCH_SESSION = proxy; return MATCH_SESSION; }

// =====================================================
// MAIN ROUTER – ZERO LEAK
// =====================================================
function FindProxyForURL(url, host){

  host = host.toLowerCase();

  // Safe direct
  for (var i=0; i<IOS_SAFE_DIRECT.length; i++)
    if (dnsDomainIs(host, IOS_SAFE_DIRECT[i])) return "DIRECT";
  for (var j=0; j<CDN_DIRECT.length; j++)
    if (shExpMatch(host, "*"+CDN_DIRECT[j])) return "DIRECT";

  var locked = getLockedRoute(host);
  if (locked) return locked;

  if (!isPUBG(host)) return "DIRECT";

  var ip = getIPv4(host);
  if (!ip) return BLOCK;

  // فلاتر قاسية أولاً
  if (isSuspectDC(ip) || isForeignBad(ip) || !isJordanIP(ip)) return BLOCK;

  var isJO = true; // بعد الفلتر → كل اللي وصل هنا أردني
  var phase = classifyPhase(url, host);

  // Gravity Well
  if (gravityJordan(host)) {
    markSessionJordan();
    scoreHost(host, 6);
    return lockRoute(host, LOBBY_PROXY, 180000); // 3 min
  }

  // Session Magnet – قفل طويل
  if (isSessionJordan()) {
    scoreHost(host, 10);
    return lockRoute(host, LOBBY_PROXY, 1800000); // 30 دقيقة !!
  }

  // Shadow scoring (احتياطي)
  scoreHost(host, 5);

  if (scoreHost(host, 0) >= 8) {
    markSessionJordan();
    return lockRoute(host, LOBBY_PROXY, 1200000); // 20 min
  }

  // Phase
  if (phase === "VOICE")
    return lockRoute(host, VOICE_PROXY, 900000);

  if (phase === "MATCH") {
    markSessionJordan();
    return matchSticky(MATCH_PROXY);
  }

  // Default أردني فقط
  return lockRoute(host, LOBBY_PROXY, 600000); // 10 min
}
