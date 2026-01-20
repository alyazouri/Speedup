// =====================================================
// PUBG Jordan Ultra Strict 2026 – Zero Leak Edition
// هدف: منع أي تسريب خارج الأردن 100% قدر الإمكان داخل PAC
// محدث يناير 2026 – Zain / Umniah / Orange
// =====================================================

// =======================
// PROXIES (STABLE)
// =======================
var LOBBY_PROXY  = "PROXY 46.185.131.218:443; PROXY 82.212.84.33:5000";
var MATCH_PROXY  = "PROXY 46.185.131.218:20001";
var VOICE_PROXY  = "PROXY 82.212.84.33:20001; PROXY 82.212.84.33:10012";
var BLOCK        = "PROXY 127.0.0.1:9";

// =======================
// iOS & CDN SAFE DIRECT
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
// GEO CHECK (IPv4)
// =======================
function isIPv4(ip){ return ip && ip.indexOf(".") !== -1 && !ip.includes(":"); }
function getIPv4(host){
  var ip = dnsResolve(host);
  return isIPv4(ip) ? ip : null;
}
function startsWithAny(ip, table){
  for (var k in table) if (ip.indexOf(k) === 0) return true;
  return false;
}

// JO_NETS – محدثة 2026 (Zain + Umniah + Orange + أخرى شائعة)
var JO_NETS = {
  // Zain Jordan (AS48832) – أكبر حصة
  "46.32."     :1,  // 46.32.96.0 – 46.32.127.255
  "46.185."    :1,  // Zain mobile & broadband
  "77.245."    :1,
  "176.28."    :1,  // 176.28.128.0+
  "176.29."    :1,
  "217.23."    :1,  // جزء من Zain

  // Umniah (Batelco Jordan – AS9038 / AS9079)
  "5.45."      :1,
  "37.220."    :1,  // 37.220.112.0/20
  "46.23."     :1,  // 46.23.112.0/20
  "46.248."    :1,  // 46.248.192.0/19
  "91.186."    :1,
  "95.172."    :1,  // 95.172.192.0/19
  "109.107."   :1,  // 109.107.224.0/19

  // Orange Jordan (AS8376 / Jordan Telecom)
  "92.253."    :1,  // 92.253.0.0 – 92.253.127.255
  "94.249."    :1,  // 94.249.0.0+
  "212.34."    :1,  // 212.34.0.0+
  "212.118."   :1,  // 212.118.0.0/20 شائع
  "194.165."   :1   // جزء من Orange
};

var GULF_NETS = {
  "212.71." :1, "94.26." :1, "5.36."  :1, "37.210." :1  // UAE/SA/KW/OM شائع
};

// Datacenter / VPN / Cloud patterns (block مبكر)
var DC_PATTERNS = {
  "3."    :1, "4."   :1, "5."   :1, "13."  :1, "18."  :1,
  "23."   :1, "35."  :1, "52."  :1, "54."  :1, "104." :1,
  "129."  :1, "134." :1, "141." :1, "167." :1, "172." :1,
  "185."  :1, "188." :1, "45."  :1, "51."  :1
};

function isJordanIP(ip){ return startsWithAny(ip, JO_NETS); }
function isGulfIP(ip)  { return startsWithAny(ip, GULF_NETS); }
function isSuspectDC(ip){ return startsWithAny(ip, DC_PATTERNS); }

// =======================
// INTELLIGENCE LAYER
// =======================
var GRAVITY = {};
var SESSION_JO = false;
var ROUTE_LOCK = {};
var SHADOW_SCORE = {};

function gravityJordan(host){
  GRAVITY[host] = (GRAVITY[host] || 0) + 1;
  return GRAVITY[host] <= 5;  // أول 5 طلبات أردنية افتراضيًا
}

function markSessionJordan(){ SESSION_JO = true; }
function isSessionJordan(){ return SESSION_JO === true; }

function scoreHost(host, delta){
  SHADOW_SCORE[host] = (SHADOW_SCORE[host] || 0) + delta;
  return SHADOW_SCORE[host];
}

function lockRoute(host, proxy, ms){
  ROUTE_LOCK[host] = { p: proxy, t: Date.now() + ms };
  return proxy;
}

function getLockedRoute(host){
  var r = ROUTE_LOCK[host];
  if (r && Date.now() < r.t) return r.p;
  return null;
}

var MATCH_SESSION = null;
function matchSticky(proxy){
  if (!MATCH_SESSION) MATCH_SESSION = proxy;
  return MATCH_SESSION;
}

// =====================================================
// MAIN ROUTER – ZERO LEAK MODE
// =====================================================
function FindProxyForURL(url, host){

  host = host.toLowerCase();

  // Safe direct – iOS & popular CDN
  for (var i = 0; i < IOS_SAFE_DIRECT.length; i++)
    if (dnsDomainIs(host, IOS_SAFE_DIRECT[i])) return "DIRECT";

  for (var j = 0; j < CDN_DIRECT.length; j++)
    if (shExpMatch(host, "*." + CDN_DIRECT[j]) || shExpMatch(host, CDN_DIRECT[j])) return "DIRECT";

  // Anti-flap lock
  var locked = getLockedRoute(host);
  if (locked) return locked;

  // Non-PUBG → DIRECT
  if (!isPUBG(host)) return "DIRECT";

  var ip = getIPv4(host);
  if (!ip) return BLOCK;

  // فلاتر أولية قاسية
  if (isSuspectDC(ip)) return BLOCK;
  if (!isJordanIP(ip) && !isGulfIP(ip)) return BLOCK;

  var isJO = isJordanIP(ip);
  var phase = classifyPhase(url, host);

  // 1. Gravity Well – أولوية أردنية قوية أول 5 طلبات
  if (gravityJordan(host)) {
    if (isJO) markSessionJordan();
    scoreHost(host, 5);
    return lockRoute(host, LOBBY_PROXY, 180000); // 3 دقائق
  }

  // 2. Session Magnet – إذا نجح أردني → قفل طويل جدًا
  if (isSessionJordan()) {
    scoreHost(host, 8);  // وزن عالي جدًا
    return lockRoute(host, LOBBY_PROXY, 1200000); // 20 دقيقة
  }

  // 3. عقاب الخليج / غير أردني
  if (!isJO) {
    scoreHost(host, -10);
    if (scoreHost(host, 0) <= -6) return BLOCK;  // بعد عقابين → حظر دائم لهذا الهوست
  }

  // 4. تفضيل واضح للأردن
  if (scoreHost(host, 0) >= 8) {
    if (isJO) markSessionJordan();
    return lockRoute(host, LOBBY_PROXY, 900000); // 15 دقيقة
  }

  // 5. Phase routing مع حماية
  if (phase === "VOICE")
    return lockRoute(host, VOICE_PROXY, 900000);

  if (phase === "MATCH") {
    if (isJO) markSessionJordan();
    return matchSticky(MATCH_PROXY);
  }

  // Default: أردني فقط، وإلا BLOCK
  if (isJO) {
    scoreHost(host, 4);
    return lockRoute(host, LOBBY_PROXY, 300000); // 5 دقائق
  }

  return BLOCK;
}
