// =====================================================
// GOLDEN_GENERIC_PAC_COMPLETE.pac - ULTIMATE EDITION
// =====================================================


// =====================================================
// 0. SAFE DIRECT DOMAINS
// =====================================================
var SAFE_DIRECT = [
  "captive.apple.com",
  "time.apple.com",
  "ocsp.apple.com",
  "clients3.google.com",
  "connectivitycheck.gstatic.com"
];


// =====================================================
// 1. ROUTES (USER PROXIES ONLY – NO OTHER CHANGES)
// =====================================================

// 🎮 بروكسي واحد ثابت للمباريات (القتال)
var ROUTE_COMBAT = "PROXY 176.29.153.95:20001";

// 👥 بروكسيات اللوبي + التجنيد (كما طلبت)
var ROUTE_SOCIAL =
  "PROXY 176.29.153.95:9030; " +
  "PROXY 212.35.66.45:9030; " +
  "PROXY 46.32.102.152:9030; " +
  "PROXY 77.245.9.11:9030";

// 🧱 الأساس (Bootstrap / Auth / Presence) — نفس بروكسيات اللوبي
var ROUTE_CORE =
  "PROXY 176.29.153.95:9030; " +
  "PROXY 212.35.66.45:9030; " +
  "PROXY 46.32.102.152:9030; " +
  "PROXY 77.245.9.11:9030";

// 🧾 ميتا / غير مؤثر
var ROUTE_META =
  "PROXY 176.29.153.95:9030; " +
  "PROXY 212.35.66.45:9030";

var BLOCK = "PROXY 127.0.0.1:9";


// =====================================================
// 2. UNIFIED IP RANGES
// =====================================================

// 🌍 النطاقات المسموحة للوبي والتجنيد (أردن + سعودية + لبنان)
var ALLOWED_RANGES = {
  // ---- 🇯🇴 الأردن (الأولوية الأولى) ----
  
  // Orange Jordan
  "176.29.": 1,
  "212.34.": 1,
  "212.35.": 1,
  "46.32.": 1,
  "77.245.": 1,
  "188.161.": 1,
  "185.88.": 1,
  "185.117.": 1,
  
  // Zain Jordan
  "37.48.": 1,
  "37.252.": 1,
  "94.126.": 1,
  "94.249.": 1,
  "185.20.": 1,
  "185.107.": 1,
  
  // Umniah
  "82.212.": 1,
  "185.34.": 1,
  "185.91.": 1,
  "91.106.": 1,
  
  // Batelco Jordan
  "195.229.": 1,
  "213.178.": 1,
  
  // نطاقات أردنية إضافية
  "46.244.": 1,
  "87.236.": 1,
  "188.247.": 1,
  "193.188.": 1,
  
  
  // ---- 🇸🇦 السعودية (الأولوية الثانية) ----
  
  // STC
  "213.150.": 1,
  "213.151.": 1,
  "82.178.": 1,
  "188.245.": 1,
  "5.35.": 1,
  
  // Mobily
  "31.170.": 1,
  "31.186.": 1,
  "37.238.": 1,
  
  // Zain KSA
  "185.24.": 1,
  "185.77.": 1,
  
  // نطاقات سعودية إضافية
  "46.187.": 1,
  "78.93.": 1,
  "212.26.": 1,
  "212.71.": 1,
  
  
  // ---- 🇱🇧 لبنان (الأولوية الثالثة) ----
  
  // Ogero
  "178.135.": 1,
  "185.58.": 1,
  "46.53.": 1,
  
  // Touch Lebanon
  "212.98.": 1,
  "212.99.": 1,
  "91.184.": 1,
  
  // Alfa Lebanon
  "37.224.": 1,
  "185.71.": 1,
  
  // IDM (Internet Direct)
  "212.14.": 1,
  "212.16.": 1,
  
  // نطاقات لبنانية إضافية
  "195.43.": 1,
  "62.216.": 1,
  "77.42.": 1,
  "82.137.": 1
};


// 🎮 نطاقات المباريات فقط (منفصلة)
var RANGE_COMBAT = {
  "176.29.": 1,
  "82.212.": 1,
  "212.34.": 1,
  "212.35.": 1,
  "94.249.": 1
};


// =====================================================
// 2.5 WORLD IP BLOCKING - منع عناوين العالم
// =====================================================

// 🚫 نطاقات دول العالم المحظورة (كل شي ما عدا أردن/سعودية/لبنان)
var BLOCKED_WORLD_RANGES = {
  // 🇺🇸 أمريكا
  "3.": 1, "4.": 1, "8.": 1, "13.": 1, "15.": 1,
  "18.": 1, "23.": 1, "34.": 1, "35.": 1, "44.": 1,
  "52.": 1, "54.": 1, "64.": 1, "65.": 1, "66.": 1,
  "67.": 1, "69.": 1, "72.": 1, "74.": 1, "75.": 1,
  "96.": 1, "97.": 1, "98.": 1, "99.": 1, "104.": 1,
  "107.": 1, "142.": 1, "172.": 1, "192.": 1, "198.": 1,
  
  // 🇬🇧 بريطانيا
  "2.16.": 1, "2.17.": 1, "5.6.": 1, "5.62.": 1,
  "31.25.": 1, "80.87.": 1, "81.107.": 1, "86.0.": 1,
  
  // 🇩🇪 ألمانيا
  "5.9.": 1, "46.4.": 1, "78.46.": 1, "88.99.": 1,
  "136.243.": 1, "144.76.": 1, "148.251.": 1,
  
  // 🇫🇷 فرنسا
  "51.15.": 1, "51.68.": 1, "51.75.": 1, "51.77.": 1,
  "62.210.": 1, "87.98.": 1, "91.121.": 1,
  
  // 🇳🇱 هولندا
  "31.13.": 1, "46.19.": 1, "62.212.": 1, "77.79.": 1,
  "85.17.": 1, "93.184.": 1, "94.142.": 1,
  
  // 🇨🇳 الصين
  "1.": 1, "14.": 1, "27.": 1, "36.": 1, "42.": 1,
  "58.": 1, "59.": 1, "60.": 1, "61.": 1, "106.": 1,
  "110.": 1, "111.": 1, "112.": 1, "113.": 1, "114.": 1,
  "115.": 1, "116.": 1, "117.": 1, "118.": 1, "119.": 1,
  "120.": 1, "121.": 1, "122.": 1, "123.": 1, "124.": 1,
  
  // 🇮🇳 الهند
  "103.": 1, "14.139.": 1, "27.34.": 1, "49.205.": 1,
  
  // 🇧🇷 البرازيل
  "177.": 1, "179.": 1, "186.": 1, "189.": 1, "191.": 1,
  "200.": 1, "201.": 1,
  
  // 🇷🇺 روسيا
  "5.3.": 1, "31.173.": 1, "37.140.": 1, "46.17.": 1,
  "77.88.": 1, "78.108.": 1, "79.137.": 1, "85.140.": 1,
  "87.240.": 1, "91.105.": 1, "95.108.": 1,
  
  // 🇯🇵 اليابان
  "27.": 1, "49.": 1, "126.": 1, "133.": 1,
  "153.": 1, "180.": 1, "202.": 1, "210.": 1, "211.": 1,
  
  // 🇦🇪 الإمارات
  "5.62.": 1, "31.179.": 1, "78.109.": 1,
  "82.199.": 1, "85.255.": 1, "213.42.": 1,
  
  // 🇪🇬 مصر
  "41.32.": 1, "41.65.": 1, "41.128.": 1, "41.176.": 1,
  "41.196.": 1, "41.232.": 1, "156.160.": 1, "197.32.": 1,
  
  // 🇹🇷 تركيا
  "78.186.": 1, "85.111.": 1, "88.230.": 1, "94.54.": 1,
  "176.88.": 1, "185.125.": 1, "212.174.": 1,
  
  // 🇮🇶 العراق
  "37.236.": 1, "185.15.": 1, "212.126.": 1,
  
  // 🇸🇬 سنغافورة
  "128.199.": 1,
  
  // دول أخرى
  "6.": 1, "7.": 1, "9.": 1, "11.": 1, "12.": 1,
  "16.": 1, "17.": 1, "19.": 1, "20.": 1, "21.": 1,
  "22.": 1, "24.": 1, "25.": 1, "26.": 1, "28.": 1
};


// =====================================================
// 3. DNS CACHE SYSTEM - نظام تخزين DNS
// =====================================================

var DNS_CACHE = {};
var DNS_CACHE_TTL = 300000; // 5 دقائق بالميلي ثانية
var DNS_CACHE_MAX_SIZE = 100; // حد أقصى 100 إدخال

function getCachedDNS(host) {
  var now = new Date().getTime();
  var cached = DNS_CACHE[host];
  
  if (cached && (now - cached.timestamp) < DNS_CACHE_TTL) {
    return cached.ip;
  }
  
  return null;
}

function setCachedDNS(host, ip) {
  // تنظيف الكاش إذا امتلأ
  var keys = [];
  for (var k in DNS_CACHE) {
    keys.push(k);
  }
  
  if (keys.length >= DNS_CACHE_MAX_SIZE) {
    // حذف أقدم إدخال
    var oldest = keys[0];
    var oldestTime = DNS_CACHE[oldest].timestamp;
    
    for (var i = 1; i < keys.length; i++) {
      if (DNS_CACHE[keys[i]].timestamp < oldestTime) {
        oldest = keys[i];
        oldestTime = DNS_CACHE[oldest].timestamp;
      }
    }
    delete DNS_CACHE[oldest];
  }
  
  DNS_CACHE[host] = {
    ip: ip,
    timestamp: new Date().getTime()
  };
}


// =====================================================
// 4. SESSION PERSISTENCE - ثبات الجلسة
// =====================================================

var SESSION = {
  warmedUp: false,
  presenceCount: 0,
  discoveryCount: 0,
  
  // تثبيت مسار القتال
  combatLocked: false,
  combatRoute: null,
  
  // ثبات الشبكة
  subnet: null,
  
  // تتبع البروكسي المستخدم
  lastProxy: null,
  proxyStartTime: 0,
  proxySessionDuration: 600000, // 10 دقائق ثبات
  
  // حالة الاتصال
  connectionQuality: 100,
  lastFailedProxy: null,
  failCount: 0
};


// =====================================================
// 5. TRAFFIC SHAPING (QoS) - تشكيل الترافيك
// =====================================================

var TRAFFIC_PRIORITY = {
  CRITICAL: 1,    // Combat, Realtime
  HIGH: 2,        // Auth, Presence, Session
  MEDIUM: 3,      // Social, Discovery
  LOW: 4          // Meta, Analytics
};

function getTrafficPriority(url, host) {
  // 🔥 أولوية قصوى للمباريات
  if (isRealtime(url, host)) return TRAFFIC_PRIORITY.CRITICAL;
  
  // ⚡ أولوية عالية للأساسيات
  if (isAuth(url, host) || isPresence(url, host) || isSession(url, host)) {
    return TRAFFIC_PRIORITY.HIGH;
  }
  
  // 📊 أولوية متوسطة للاجتماعيات
  if (isSocial(url, host) || isDiscovery(url, host)) {
    return TRAFFIC_PRIORITY.MEDIUM;
  }
  
  // 📉 أولوية منخفضة للباقي
  return TRAFFIC_PRIORITY.LOW;
}


// =====================================================
// 6. HELPERS
// =====================================================

function normalizeHost(h){
  var i = h.indexOf(":");
  return (i > -1) ? h.substring(0,i) : h;
}

function resolveIP(h){
  // فحص الكاش أولاً
  var cached = getCachedDNS(h);
  if (cached) return cached;
  
  // إذا مو موجود، نحل DNS ونخزنه
  try {
    var ip = dnsResolve(h);
    if (ip) {
      setCachedDNS(h, ip);
    }
    return ip;
  } catch(e) {
    return null;
  }
}

function startsWithAny(ip, table){
  for (var p in table){
    if (ip.indexOf(p) === 0) return true;
  }
  return false;
}

function sameSubnet(ip){
  var parts = ip.split(".");
  if (parts.length < 2) return false;
  var sub = parts[0] + "." + parts[1];
  if (SESSION.subnet && SESSION.subnet !== sub) return false;
  SESSION.subnet = sub;
  return true;
}

// ✅ فحص SAFE_DIRECT
function isSafeDirect(host){
  for (var i = 0; i < SAFE_DIRECT.length; i++){
    if (host === SAFE_DIRECT[i] || host.indexOf("." + SAFE_DIRECT[i]) > -1){
      return true;
    }
  }
  return false;
}

// ✅ فحص إذا IP من دولة مسموحة
function isAllowedCountry(ip){
  if (!ip) return false;
  return startsWithAny(ip, ALLOWED_RANGES);
}

// 🚫 فحص إذا IP من دولة محظورة عالمياً
function isBlockedWorldIP(ip){
  if (!ip) return false;
  return startsWithAny(ip, BLOCKED_WORLD_RANGES);
}


// =====================================================
// 7. TRAFFIC PHASES (NO CHANGE)
// =====================================================

function isBootstrap(u,h){
  return /(bootstrap|init|preconnect|discover|handshake|hello)/i.test(u+h);
}
function isAuth(u,h){
  return /(login|auth|token|passport|identity|account)/i.test(u+h);
}
function isPresence(u,h){
  return /(presence|heartbeat|status|keepalive|online)/i.test(u+h);
}
function isSocial(u,h){
  return /(friend|social|party|squad|team|invite|chat|voice|signal)/i.test(u+h);
}
function isDiscovery(u,h){
  return /(matchmaking|matching|queue|search|allocate|dispatcher|region)/i.test(u+h);
}
function isSession(u,h){
  return /(session|join|leave|room|lobby|shard|zone|instance)/i.test(u+h);
}
function isRealtime(u,h){
  return /(realtime|sync|tick|state|update|combat|fire|shoot|hit|damage|physics|frame|snapshot|delta)/i.test(u+h);
}
function isMeta(u,h){
  return /(rank|tier|stats|progress|profile|inventory|item|loadout|store|shop|purchase|event|news|ugc|analytics)/i.test(u+h);
}


// =====================================================
// 8. COMBAT ROUTE PINNING (NO CHANGE)
// =====================================================

function lockCombatRoute(){
  if (!SESSION.combatLocked) {
    SESSION.combatLocked = true;
    SESSION.combatRoute = ROUTE_COMBAT;
  }
}


// =====================================================
// 9. SESSION PERSISTENCE LOGIC
// =====================================================

function maintainProxySession(route) {
  var now = new Date().getTime();
  
  // إذا في بروكسي نشط وما انتهت مدته
  if (SESSION.lastProxy && 
      (now - SESSION.proxyStartTime) < SESSION.proxySessionDuration) {
    return SESSION.lastProxy;
  }
  
  // تحديث البروكسي الحالي
  SESSION.lastProxy = route;
  SESSION.proxyStartTime = now;
  
  return route;
}


// =====================================================
// 10. FINAL ROUTING LOGIC - ULTIMATE VERSION
// =====================================================

function FindProxyForURL(url, host){
  host = normalizeHost(host.toLowerCase());
  
  // ✅ السماح لنطاقات SAFE_DIRECT بالاتصال المباشر
  if (isSafeDirect(host)) {
    return "DIRECT";
  }
  
  var ip = resolveIP(host);
  
  // 🚫 حظر عناوين العالم المحظورة
  if (ip && isBlockedWorldIP(ip)) {
    return BLOCK;
  }
  
  // 🚫 حظر جميع الدول ما عدا (الأردن + السعودية + لبنان)
  if (ip && !isAllowedCountry(ip)) {
    return BLOCK;
  }

  // ---- FOUNDATION ----
  if (isBootstrap(url,host) || isAuth(url,host) || isPresence(url,host)) {
    SESSION.warmedUp = true;
    SESSION.presenceCount++;

    if (!ip || !startsWithAny(ip, ALLOWED_RANGES)) return BLOCK;
    if (!sameSubnet(ip)) return BLOCK;

    return maintainProxySession(ROUTE_CORE);
  }

  // ---- SOCIAL / DISCOVERY ----
  if (isSocial(url,host) || isDiscovery(url,host)) {
    SESSION.discoveryCount++;

    if (!ip || !startsWithAny(ip, ALLOWED_RANGES)) return BLOCK;
    if (!sameSubnet(ip)) return BLOCK;

    return maintainProxySession(ROUTE_SOCIAL);
  }

  // ---- SESSION CONTROL ----
  if (isSession(url,host)) {
    if (!ip || !startsWithAny(ip, ALLOWED_RANGES)) return BLOCK;
    return maintainProxySession(ROUTE_CORE);
  }

  // ---- REALTIME / COMBAT (أعلى أولوية) ----
  if (isRealtime(url,host)) {

    if (!SESSION.warmedUp || SESSION.presenceCount < 3) {
      return BLOCK;
    }

    if (!ip || !startsWithAny(ip, RANGE_COMBAT)) return BLOCK;

    lockCombatRoute();
    return SESSION.combatRoute;
  }

  // ---- META ----
  if (isMeta(url,host)) {
    if (!ip || !startsWithAny(ip, ALLOWED_RANGES)) return BLOCK;
    return maintainProxySession(ROUTE_META);
  }

  return BLOCK;
}
