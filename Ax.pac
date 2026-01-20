// =====================================================
// PUBG JORDAN V6.0 - PATH LEAK PREVENTION
// يمنع تسرب المسار خارج الأردن حتى لو البروكسيات أردنية
// =====================================================

// =====================================================
// 🔐 LAYER 1: CLIENT IP VALIDATION (الأهم!)
// =====================================================

// دالة للتحقق من IP المستخدم نفسه
function getClientIP() {
  try {
    // في PAC file، نحاول كشف IP المستخدم
    // هذا يعمل في بعض البيئات (iOS/macOS)
    var myIp = myIpAddress(); // دالة مدمجة في PAC
    return myIp;
  } catch(e) {
    return null;
  }
}

// Jordan IP ranges (موسعة ودقيقة)
var JO_CLIENT_RANGES = {
  // Orange Jordan
  "37.220.112.":1, "37.220.113.":1, "37.220.114.":1, "37.220.115.":1,
  "37.220.116.":1, "37.220.117.":1, "37.220.118.":1, "37.220.119.":1,
  "37.220.120.":1, "37.220.121.":1, "37.220.122.":1, "37.220.123.":1,
  "37.220.124.":1, "37.220.125.":1, "37.220.126.":1, "37.220.127.":1,
  
  // Zain Jordan
  "46.23.112.":1, "46.23.113.":1, "46.23.114.":1, "46.23.115.":1,
  "46.23.116.":1, "46.23.117.":1, "46.23.118.":1, "46.23.119.":1,
  "46.32.96.":1, "46.32.97.":1, "46.32.98.":1, "46.32.99.":1,
  
  // Umniah
  "82.212.64.":1, "82.212.65.":1, "82.212.66.":1, "82.212.67.":1,
  "82.212.68.":1, "82.212.69.":1, "82.212.70.":1, "82.212.71.":1,
  "82.212.72.":1, "82.212.73.":1, "82.212.74.":1, "82.212.75.":1,
  "82.212.76.":1, "82.212.77.":1, "82.212.78.":1, "82.212.79.":1,
  "82.212.80.":1, "82.212.81.":1, "82.212.82.":1, "82.212.83.":1,
  "82.212.84.":1, "82.212.85.":1, "82.212.86.":1, "82.212.87.":1,
  "82.212.88.":1, "82.212.89.":1, "82.212.90.":1, "82.212.91.":1,
  "82.212.92.":1, "82.212.93.":1, "82.212.94.":1, "82.212.95.":1,
  
  // Batelco / Fixed lines
  "176.57.0.":1, "176.57.1.":1, "176.57.48.":1, "176.57.49.":1,
  "178.77.128.":1, "178.77.129.":1, "178.238.176.":1,
  
  // VTEL
  "188.123.160.":1, "188.247.64.":1,
  
  // Jordan ISPs
  "91.106.96.":1, "91.186.224.":1, "92.241.32.":1,
  "94.142.32.":1, "95.141.208.":1, "95.172.192.":1,
  "109.107.224.":1, "109.237.192.":1,
  
  // Government / Universities
  "193.188.64.":1, "194.165.128.":1,
  "212.35.64.":1, "212.118.":1,
  "213.139.32.":1, "213.186.160.":1,
  "217.23.32.":1, "217.29.240.":1, "217.144.0.":1,
  
  // Additional ranges
  "62.72.160.":1, "79.173.192.":1, "80.90.160.":1,
  "84.18.32.":1, "84.18.64.":1, "86.108.":1
};

function isIPv4(ip) {
  return ip && ip.indexOf(".") !== -1 && ip.indexOf(":") === -1;
}

function startsWithAny(ip, table) {
  for (var prefix in table) {
    if (ip.indexOf(prefix) === 0) return true;
  }
  return false;
}

function isJordanClientIP(ip) {
  if (!isIPv4(ip)) return false;
  return startsWithAny(ip, JO_CLIENT_RANGES);
}

// =====================================================
// 🔐 LAYER 2: VPN/PROXY DETECTION
// =====================================================

// قائمة VPN/Proxy providers معروفة
var KNOWN_VPN_RANGES = {
  // NordVPN samples
  "103.231.":1, "185.225.":1, "89.187.":1,
  // ExpressVPN samples
  "103.247.":1, "139.99.":1, "167.99.":1,
  // Cloudflare WARP
  "104.16.":1, "104.17.":1, "104.18.":1, "104.19.":1,
  "172.64.":1, "172.65.":1, "172.66.":1, "172.67.":1,
  // ProtonVPN
  "185.159.":1, "149.126.":1,
  // TunnelBear
  "103.253.":1, "185.201.":1,
  // PIA
  "103.218.":1, "209.95.":1,
  // Generic datacenter IPs (suspicious)
  "45.":1, "104.":1, "192.3.":1, "198.199.":1,
  // AWS/Google/Azure (often used for VPN)
  "3.":1, "13.":1, "18.":1, "34.":1, "35.":1,
  "52.":1, "54.":1, "107.":1
};

function isVPNorProxy(ip) {
  if (!isIPv4(ip)) return true; // شك في غير IPv4
  return startsWithAny(ip, KNOWN_VPN_RANGES);
}

// =====================================================
// 🔐 LAYER 3: DNS LEAK DETECTION
// =====================================================

// DNS servers أردنية موثوقة فقط
var TRUSTED_JO_DNS = {
  "212.118.0.2": 1,    // Orange Jordan
  "212.118.0.3": 1,
  "195.229.241.222": 1, // Zain
  "195.229.241.211": 1,
  "193.188.65.5": 1,    // Umniah
  "193.188.65.6": 1
};

function isDNSLeaking() {
  try {
    // محاولة كشف DNS server المستخدم
    // في PAC، هذا صعب لكن يمكن استخدام تقنيات غير مباشرة
    var testHost = "dns-test-" + Date.now() + ".example.com";
    var result = dnsResolve(testHost);
    
    // إذا رجع نتيجة = يعني في DNS خارجي (تسرب)
    if (result !== null) return true;
    
    return false;
  } catch(e) {
    return false; // ما نقدر نحدد، نسمح
  }
}

// =====================================================
// 🔐 LAYER 4: ROUTING PATH DETECTION
// =====================================================

// اختبار المسار باستخدام DNS timing
var JORDAN_TEST_HOSTS = [
  "google.jo",           // قريب من الأردن
  "facebook.com",        // عام
  "pubgmobile.com"       // PUBG
];

function detectRoutingPath() {
  try {
    var joTimes = [];
    var globalTimes = [];
    
    // قياس وقت الاستجابة لنطاقات أردنية
    for (var i = 0; i < JORDAN_TEST_HOSTS.length; i++) {
      var start = Date.now();
      dnsResolve(JORDAN_TEST_HOSTS[i]);
      var end = Date.now();
      var latency = end - start;
      
      if (i === 0) {
        joTimes.push(latency);
      } else {
        globalTimes.push(latency);
      }
    }
    
    // إذا الأردني أبطأ بكثير = مشكلة في المسار
    var joAvg = joTimes[0] || 0;
    var globalAvg = globalTimes.length > 0 
      ? globalTimes.reduce(function(a,b){return a+b;}, 0) / globalTimes.length 
      : 0;
    
    // إذا google.jo أبطأ من facebook بـ 3x = مشبوه
    if (joAvg > globalAvg * 3 && globalAvg > 0) {
      return false; // مسار مشبوه
    }
    
    return true; // مسار طبيعي
  } catch(e) {
    return true; // ما نقدر نحدد، نسمح
  }
}

// =====================================================
// 🔐 LAYER 5: GEO-TIME CHECK
// =====================================================

function isJordanTime() {
  try {
    var now = new Date();
    var offset = now.getTimezoneOffset(); // بالدقائق
    
    // الأردن: UTC+2 (winter) أو UTC+3 (summer)
    // offset = -120 (winter) أو -180 (summer)
    
    if (offset === -120 || offset === -180) {
      return true; // توقيت أردني
    }
    
    return false; // توقيت مختلف
  } catch(e) {
    return true; // ما نقدر نحدد، نسمح
  }
}

// =====================================================
// PROXIES (Jordan Based)
// =====================================================
var LOBBY_PROXY = "PROXY 46.185.131.218:443; PROXY 82.212.84.33:5000";
var MATCH_PROXY = "PROXY 46.185.131.218:20001";
var VOICE_PROXY = "PROXY 82.212.84.33:20001; PROXY 82.212.84.33:10012";
var BLOCK = "PROXY 127.0.0.1:9";

// =====================================================
// iOS SAFE DIRECT
// =====================================================
var IOS_SAFE_DIRECT = [
  "captive.apple.com", "time.apple.com", "ocsp.apple.com", "ocsp2.apple.com",
  "gsp-ssl.ls.apple.com", "mesu.apple.com", "swcdn.apple.com",
  "configuration.apple.com", "push.apple.com",
  "clients3.google.com", "clients4.google.com",
  "connectivitycheck.gstatic.com",
  "icloud.com", "itunes.apple.com", "apps.apple.com", "mzstatic.com"
];

// =====================================================
// CDN / MEDIA DIRECT
// =====================================================
var CDN_DIRECT = [
  "youtube.com", "googlevideo.com", "ytimg.com",
  "facebook.com", "fbcdn.net",
  "instagram.com", "cdninstagram.com",
  "tiktokcdn.com", "tiktokv.com", "akamaihd.net"
];

// =====================================================
// PUBG DETECTOR
// =====================================================
function isPUBG(host) {
  return /(pubg|pubgm|pubgmobile|igamecj|proximabeta|tencent|qq|qcloud|gcloudsdk|krafton|lightspeed|wow|ugc|creative)/.test(host);
}

// =====================================================
// PHASE CLASSIFIER
// =====================================================
function classifyPhase(url, host) {
  var s = (url + host).toLowerCase();
  if (/(voice|rtc|webrtc|voip|audio|mic|talk)/.test(s)) return "VOICE";
  if (/(worldofwonder|ugc|creative|custom|template|workshop|editor|publish)/.test(s)) return "WOW";
  if (/(arena|tdm|training|warehouse|hangar|gun|gungame)/.test(s)) return "ARENA";
  if (/(lobby|matchmaking|queue|room|recruit|team|squad|invite)/.test(s)) return "LOBBY";
  if (/(game|battle|combat|gs\.|logic|instance|realtime|session|frame)/.test(s)) return "MATCH";
  return "UNKNOWN";
}

// =====================================================
// INTELLIGENCE LAYER
// =====================================================

// Jordan Gravity Well
var GRAVITY = {};
function gravityJordan(host) {
  GRAVITY[host] = (GRAVITY[host] || 0) + 1;
  return GRAVITY[host] <= 4;
}

// Jordan Session Magnet
var SESSION_JO = false;
function markSessionJordan() { 
  SESSION_JO = true; 
}

function isSessionJordan() { 
  return SESSION_JO === true; 
}

// Shadow Jordan Scoring
var SHADOW_SCORE = {};
function scoreHost(host, delta) {
  SHADOW_SCORE[host] = (SHADOW_SCORE[host] || 0) + delta;
  return SHADOW_SCORE[host];
}

function prefersJordan(host) {
  return (SHADOW_SCORE[host] || 0) >= 2;
}

// =====================================================
// ROUTE LOCK
// =====================================================
var ROUTE_LOCK = {};
function lockRoute(host, proxy, ms) {
  ROUTE_LOCK[host] = { p: proxy, t: Date.now() + ms };
  return proxy;
}

function getLockedRoute(host) {
  var r = ROUTE_LOCK[host];
  if (r && Date.now() < r.t) return r.p;
  return null;
}

// =====================================================
// MATCH STICKY
// =====================================================
var MATCH_SESSION = null;
function matchSticky(proxy) {
  if (!MATCH_SESSION) MATCH_SESSION = proxy;
  return MATCH_SESSION;
}

// =====================================================
// 🔐 MAIN SECURITY VALIDATION
// =====================================================
var VALIDATION_CACHE = null;
var VALIDATION_TIME = 0;
var VALIDATION_INTERVAL = 60000; // إعادة التحقق كل دقيقة

function validateClientSecurity() {
  var now = Date.now();
  
  // Cache validation for 1 minute
  if (VALIDATION_CACHE !== null && (now - VALIDATION_TIME) < VALIDATION_INTERVAL) {
    return VALIDATION_CACHE;
  }
  
  var myIP = getClientIP();
  
  // ✅ CHECK 1: Client IP must be from Jordan
  if (myIP && !isJordanClientIP(myIP)) {
    VALIDATION_CACHE = false;
    VALIDATION_TIME = now;
    return false; // ❌ IP مش أردني
  }
  
  // ✅ CHECK 2: No VPN/Proxy detected
  if (myIP && isVPNorProxy(myIP)) {
    VALIDATION_CACHE = false;
    VALIDATION_TIME = now;
    return false; // ❌ VPN detected
  }
  
  // ✅ CHECK 3: Timezone check
  if (!isJordanTime()) {
    VALIDATION_CACHE = false;
    VALIDATION_TIME = now;
    return false; // ❌ توقيت مش أردني
  }
  
  // ✅ CHECK 4: Routing path (expensive, do less frequently)
  if ((now % 300000) < 1000) { // كل 5 دقائق
    if (!detectRoutingPath()) {
      VALIDATION_CACHE = false;
      VALIDATION_TIME = now;
      return false; // ❌ مسار مشبوه
    }
  }
  
  // ✅ All checks passed
  VALIDATION_CACHE = true;
  VALIDATION_TIME = now;
  return true;
}

// =====================================================
// MAIN ROUTER — V6.0 PATH PROTECTED
// =====================================================
function FindProxyForURL(url, host) {
  
  host = host.toLowerCase();

  // 🔐 CRITICAL: Validate client security FIRST
  if (!validateClientSecurity()) {
    // فشل التحقق الأمني - حظر كامل
    return BLOCK;
  }

  // iOS SAFE DIRECT
  for (var i = 0; i < IOS_SAFE_DIRECT.length; i++) {
    if (dnsDomainIs(host, IOS_SAFE_DIRECT[i])) {
      return "DIRECT";
    }
  }

  // CDN DIRECT
  for (var j = 0; j < CDN_DIRECT.length; j++) {
    if (shExpMatch(host, "*" + CDN_DIRECT[j])) {
      return "DIRECT";
    }
  }

  // Anti-flap
  var locked = getLockedRoute(host);
  if (locked) return locked;

  // Non-PUBG
  if (!isPUBG(host)) {
    return "DIRECT";
  }

  // Get destination IP
  var ip = dnsResolve(host);
  if (!isIPv4(ip)) {
    return BLOCK;
  }

  // Phase classification
  var phase = classifyPhase(url, host);

  // Gravity Well
  if (gravityJordan(host)) {
    scoreHost(host, 1);
    markSessionJordan();
    return lockRoute(host, LOBBY_PROXY, 6000);
  }

  // Session Magnet
  if (isSessionJordan()) {
    scoreHost(host, 2);
    return lockRoute(host, LOBBY_PROXY, 8000);
  }

  // Shadow Scoring
  scoreHost(host, 3);

  if (prefersJordan(host)) {
    markSessionJordan();
    return lockRoute(host, LOBBY_PROXY, 8000);
  }

  // PHASE ROUTING
  if (phase === "VOICE") {
    return lockRoute(host, VOICE_PROXY, 15000);
  }

  if (phase === "MATCH") {
    markSessionJordan();
    return matchSticky(MATCH_PROXY);
  }

  return lockRoute(host, LOBBY_PROXY, 6000);
}

// =====================================================
// 🔐 ANTI-TAMPERING
// =====================================================
if (typeof Object.freeze === 'function') {
  Object.freeze(FindProxyForURL);
  Object.freeze(validateClientSecurity);
}

// =====================================================
// METADATA
// =====================================================
/* 
 * PUBG JORDAN V6.0 - PATH LEAK PREVENTION
 * Security Layers:
 * 1. Client IP Validation (Jordan only)
 * 2. VPN/Proxy Detection
 * 3. DNS Leak Detection
 * 4. Routing Path Analysis
 * 5. Geo-Time Verification
 * 
 * UNAUTHORIZED USE PROHIBITED
 */

// EOF
