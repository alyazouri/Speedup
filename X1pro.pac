// =====================================================
// JORDAN_ULTIMATE_PAC - NUCLEAR EDITION
// =====================================================
// 🇯🇴 مصمم خصيصاً لمطابقة لاعبين أردنيين فقط
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
// 1. ROUTES - البروكسيات الأردنية
// =====================================================

// 🎮 بروكسي واحد ثابت للمباريات (القتال)
var ROUTE_COMBAT = "PROXY 176.29.153.95:20001";

// 👥 بروكسيات اللوبي + التجنيد - كلها أردنية
var ROUTE_SOCIAL =
  "PROXY 176.29.153.95:9030; " +
  "PROXY 212.35.66.45:9030; " +
  "PROXY 46.32.102.152:9030; " +
  "PROXY 77.245.9.11:9030";

// 🧱 الأساس (Bootstrap / Auth / Presence)
var ROUTE_CORE =
  "PROXY 176.29.153.95:9030; " +
  "PROXY 212.35.66.45:9030; " +
  "PROXY 46.32.102.152:9030; " +
  "PROXY 77.245.9.11:9030";

// 🧾 ميتا
var ROUTE_META =
  "PROXY 176.29.153.95:9030; " +
  "PROXY 212.35.66.45:9030";

var BLOCK = "PROXY 127.0.0.1:9";


// =====================================================
// 2. JORDAN-ONLY IP RANGES - نطاقات أردنية فقط
// =====================================================

// 🇯🇴 كل النطاقات الأردنية المعروفة (موسعة)
var JORDAN_RANGES = {
  // Orange Jordan (الأكثر استخداماً)
  "176.29.": 1,
  "212.34.": 1,
  "212.35.": 1,
  "46.32.": 1,
  "77.245.": 1,
  "188.161.": 1,
  "185.88.": 1,
  "185.117.": 1,
  "213.178.": 1,
  "193.188.": 1,
  "188.247.": 1,
  
  // Zain Jordan
  "37.48.": 1,
  "37.252.": 1,
  "94.126.": 1,
  "94.249.": 1,
  "185.20.": 1,
  "185.107.": 1,
  "37.238.": 1,
  "5.34.": 1,
  "5.35.": 1,
  
  // Umniah
  "82.212.": 1,
  "185.34.": 1,
  "185.91.": 1,
  "91.106.": 1,
  "188.161.": 1,
  "46.244.": 1,
  
  // Batelco Jordan
  "195.229.": 1,
  "213.178.": 1,
  
  // Fiber Networks Jordan
  "87.236.": 1,
  "46.244.": 1,
  
  // Jordan Data Communications (JDC)
  "193.188.": 1,
  
  // نطاقات حكومية وجامعات
  "195.229.": 1,
  "212.93.": 1,
  "212.118.": 1
};

// 🎮 نطاقات المباريات (أردنية محددة)
var RANGE_COMBAT = {
  "176.29.": 1,
  "82.212.": 1,
  "212.34.": 1,
  "212.35.": 1,
  "94.249.": 1
};


// =====================================================
// 3. WORLD BLOCKING - حظر العالم كله
// =====================================================

// 🚫 نطاقات العالم المحظورة (كل شي ما عدا الأردن)
var BLOCKED_WORLD_RANGES = {
  // 🇸🇦 السعودية
  "5.35.": 1, "31.170.": 1, "31.186.": 1, "37.238.": 1,
  "46.187.": 1, "78.93.": 1, "82.178.": 1, "185.24.": 1,
  "185.77.": 1, "188.245.": 1, "212.26.": 1, "212.71.": 1,
  "213.150.": 1, "213.151.": 1,
  
  // 🇱🇧 لبنان
  "37.224.": 1, "46.53.": 1, "62.216.": 1, "77.42.": 1,
  "82.137.": 1, "91.184.": 1, "178.135.": 1, "185.58.": 1,
  "185.71.": 1, "195.43.": 1, "212.14.": 1, "212.16.": 1,
  "212.98.": 1, "212.99.": 1,
  
  // 🇦🇪 الإمارات
  "5.62.": 1, "31.179.": 1, "78.109.": 1, "82.199.": 1,
  "85.255.": 1, "213.42.": 1,
  
  // 🇪🇬 مصر
  "41.32.": 1, "41.65.": 1, "41.128.": 1, "41.176.": 1,
  "41.196.": 1, "41.232.": 1, "156.160.": 1, "197.32.": 1,
  
  // 🇹🇷 تركيا
  "78.186.": 1, "85.111.": 1, "88.230.": 1, "94.54.": 1,
  "176.88.": 1, "185.125.": 1, "212.174.": 1,
  
  // 🇮🇶 العراق
  "37.236.": 1, "185.15.": 1, "212.126.": 1,
  
  // 🇰🇼 الكويت
  "37.37.": 1, "62.215.": 1, "80.184.": 1, "185.74.": 1,
  
  // 🇴🇲 عمان
  "5.36.": 1, "37.210.": 1, "185.19.": 1,
  
  // 🇶🇦 قطر
  "37.202.": 1, "185.38.": 1, "212.77.": 1,
  
  // 🇧🇭 البحرين
  "37.131.": 1, "62.201.": 1, "185.60.": 1,
  
  // 🇵🇸 فلسطين
  "185.25.": 1, "212.47.": 1,
  
  // 🇸🇾 سوريا
  "5.0.": 1, "82.137.": 1, "185.96.": 1,
  
  // 🇾🇪 اليمن
  "185.51.": 1,
  
  // 🇺🇸 أمريكا
  "3.": 1, "4.": 1, "8.": 1, "13.": 1, "15.": 1,
  "18.": 1, "23.": 1, "34.": 1, "35.": 1, "44.": 1,
  "52.": 1, "54.": 1, "64.": 1, "65.": 1, "66.": 1,
  "67.": 1, "69.": 1, "72.": 1, "74.": 1, "75.": 1,
  "96.": 1, "97.": 1, "98.": 1, "99.": 1, "104.": 1,
  "107.": 1, "142.": 1, "172.": 1, "192.": 1, "198.": 1,
  
  // 🇬🇧 بريطانيا
  "2.16.": 1, "2.17.": 1, "5.6.": 1, "31.25.": 1,
  "80.87.": 1, "81.107.": 1, "86.0.": 1,
  
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
  "49.": 1, "126.": 1, "133.": 1, "153.": 1,
  "180.": 1, "202.": 1, "210.": 1, "211.": 1,
  
  // 🇸🇬 سنغافورة
  "128.199.": 1,
  
  // 🇮🇹 إيطاليا
  "2.32.": 1, "79.0.": 1, "151.": 1,
  
  // 🇪🇸 إسبانيا
  "2.136.": 1, "83.": 1, "88.26.": 1,
  
  // دول أفريقية
  "41.": 1, "105.": 1, "196.": 1, "197.": 1,
  
  // نطاقات عامة
  "6.": 1, "7.": 1, "9.": 1, "10.": 1, "11.": 1,
  "12.": 1, "16.": 1, "17.": 1, "19.": 1, "20.": 1,
  "21.": 1, "22.": 1, "24.": 1, "25.": 1, "26.": 1,
  "28.": 1, "29.": 1, "30.": 1, "31.": 1, "32.": 1,
  "33.": 1, "38.": 1, "39.": 1, "40.": 1, "43.": 1,
  "45.": 1, "47.": 1, "48.": 1, "50.": 1, "51.": 1,
  "53.": 1, "55.": 1, "56.": 1, "57.": 1, "62.": 1,
  "63.": 1, "68.": 1, "70.": 1, "71.": 1, "73.": 1,
  "76.": 1, "79.": 1, "80.": 1, "81.": 1, "84.": 1,
  "85.": 1, "86.": 1, "88.": 1, "89.": 1, "90.": 1,
  "92.": 1, "93.": 1, "95.": 1, "100.": 1, "101.": 1,
  "102.": 1, "108.": 1, "109.": 1, "125.": 1, "128.": 1,
  "130.": 1, "131.": 1, "132.": 1, "134.": 1, "135.": 1,
  "136.": 1, "137.": 1, "138.": 1, "139.": 1, "140.": 1,
  "141.": 1, "143.": 1, "144.": 1, "145.": 1, "146.": 1,
  "147.": 1, "148.": 1, "149.": 1, "150.": 1, "152.": 1,
  "154.": 1, "155.": 1, "157.": 1, "158.": 1, "159.": 1,
  "160.": 1, "161.": 1, "162.": 1, "163.": 1, "164.": 1,
  "165.": 1, "166.": 1, "167.": 1, "168.": 1, "169.": 1,
  "170.": 1, "171.": 1, "173.": 1, "174.": 1, "175.": 1,
  "178.": 1, "181.": 1, "182.": 1, "183.": 1, "184.": 1,
  "187.": 1, "188.": 1, "190.": 1, "193.": 1, "194.": 1,
  "195.": 1, "199.": 1, "203.": 1, "204.": 1, "205.": 1,
  "206.": 1, "207.": 1, "208.": 1, "209.": 1, "216.": 1,
  "217.": 1, "218.": 1, "219.": 1, "220.": 1, "221.": 1,
  "222.": 1, "223.": 1
};


// =====================================================
// 4. DNS CACHE SYSTEM - تسريع DNS
// =====================================================

var DNS_CACHE = {};
var DNS_CACHE_TTL = 300000; // 5 دقائق
var DNS_CACHE_MAX_SIZE = 200;

function getCachedDNS(host) {
  var now = new Date().getTime();
  var cached = DNS_CACHE[host];
  
  if (cached && (now - cached.timestamp) < DNS_CACHE_TTL) {
    return cached.ip;
  }
  
  return null;
}

function setCachedDNS(host, ip) {
  var keys = [];
  for (var k in DNS_CACHE) {
    keys.push(k);
  }
  
  if (keys.length >= DNS_CACHE_MAX_SIZE) {
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
// 5. SESSION PERSISTENCE - ثبات الجلسة
// =====================================================

var SESSION = {
  warmedUp: false,
  presenceCount: 0,
  discoveryCount: 0,
  
  combatLocked: false,
  combatRoute: null,
  
  subnet: null,
  
  lastProxy: null,
  proxyStartTime: 0,
  proxySessionDuration: 900000, // 15 دقيقة (زيادة الثبات)
  
  connectionQuality: 100,
  lastFailedProxy: null,
  failCount: 0,
  
  // 🇯🇴 تتبع الجلسات الأردنية
  jordanianSessionsFound: 0,
  lastJordanianIP: null
};


// =====================================================
// 6. TRAFFIC SHAPING (QoS) - أولوية المباريات
// =====================================================

var TRAFFIC_PRIORITY = {
  CRITICAL: 1,    // Combat
  HIGH: 2,        // Auth, Presence, Session
  MEDIUM: 3,      // Social, Discovery
  LOW: 4          // Meta
};

function getTrafficPriority(url, host) {
  if (isRealtime(url, host)) return TRAFFIC_PRIORITY.CRITICAL;
  if (isAuth(url, host) || isPresence(url, host) || isSession(url, host)) {
    return TRAFFIC_PRIORITY.HIGH;
  }
  if (isSocial(url, host) || isDiscovery(url, host)) {
    return TRAFFIC_PRIORITY.MEDIUM;
  }
  return TRAFFIC_PRIORITY.LOW;
}


// =====================================================
// 7. HELPERS
// =====================================================

function normalizeHost(h){
  var i = h.indexOf(":");
  return (i > -1) ? h.substring(0,i) : h;
}

function resolveIP(h){
  var cached = getCachedDNS(h);
  if (cached) return cached;
  
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
  
  // 🇯🇴 تثبيت على subnet أردني فقط
  if (SESSION.subnet && SESSION.subnet !== sub) {
    // السماح فقط إذا كان الـ IP الجديد أردني
    if (!startsWithAny(ip, JORDAN_RANGES)) return false;
  }
  
  SESSION.subnet = sub;
  return true;
}

function isSafeDirect(host){
  for (var i = 0; i < SAFE_DIRECT.length; i++){
    if (host === SAFE_DIRECT[i] || host.indexOf("." + SAFE_DIRECT[i]) > -1){
      return true;
    }
  }
  return false;
}

// ✅ فحص إذا IP أردني
function isJordanianIP(ip){
  if (!ip) return false;
  return startsWithAny(ip, JORDAN_RANGES);
}

// 🚫 فحص إذا IP محظور عالمياً
function isBlockedWorldIP(ip){
  if (!ip) return false;
  return startsWithAny(ip, BLOCKED_WORLD_RANGES);
}


// =====================================================
// 8. TRAFFIC PHASES
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
  return /(friend|social|party|squad|team|invite|chat|voice|signal|Ground|location|LocationInfo)/i.test(u+h);
}
function isDiscovery(u,h){
  return /(matchmaking|matching|queue|search|allocate|dispatcher|region|Ground|location|LocationInfo)/i.test(u+h);
}
function isSession(u,h){
  return /(session|join|leave|room|lobby|shard|zone|instance|Ground|location|LocationInfo)/i.test(u+h);
}
function isRealtime(u,h){
  return /(realtime|sync|tick|state|update|combat|fire|shoot|hit|damage|physics|frame|snapshot|delta|Ground|location|LocationInfo)/i.test(u+h);
}
function isMeta(u,h){
  return /(rank|tier|stats|progress|profile|inventory|item|loadout|store|shop|purchase|event|news|ugc|analytics|TDM|tdm|WOW|Ranked)/i.test(u+h);
}


// =====================================================
// 9. COMBAT ROUTE PINNING
// =====================================================

function lockCombatRoute(){
  if (!SESSION.combatLocked) {
    SESSION.combatLocked = true;
    SESSION.combatRoute = ROUTE_COMBAT;
  }
}


// =====================================================
// 10. SESSION PERSISTENCE LOGIC
// =====================================================

function maintainProxySession(route) {
  var now = new Date().getTime();
  
  // ثبات أطول للجلسة
  if (SESSION.lastProxy && 
      (now - SESSION.proxyStartTime) < SESSION.proxySessionDuration) {
    return SESSION.lastProxy;
  }
  
  SESSION.lastProxy = route;
  SESSION.proxyStartTime = now;
  
  return route;
}


// =====================================================
// 11. FINAL ROUTING LOGIC - JORDAN ONLY VERSION
// =====================================================

function FindProxyForURL(url, host){
  host = normalizeHost(host.toLowerCase());
  
  // ✅ SAFE_DIRECT
  if (isSafeDirect(host)) {
    return "DIRECT";
  }
  
  var ip = resolveIP(host);
  
  // 🚫 حظر فوري للعالم
  if (ip && isBlockedWorldIP(ip)) {
    return BLOCK;
  }
  
  // 🚫 السماح فقط للأردن
  if (ip && !isJordanianIP(ip)) {
    return BLOCK;
  }
  
  // 🇯🇴 تتبع الجلسات الأردنية
  if (ip && isJordanianIP(ip)) {
    SESSION.jordanianSessionsFound++;
    SESSION.lastJordanianIP = ip;
  }

  // ---- FOUNDATION ----
  if (isBootstrap(url,host) || isAuth(url,host) || isPresence(url,host)) {
    SESSION.warmedUp = true;
    SESSION.presenceCount++;

    if (!ip || !isJordanianIP(ip)) return BLOCK;
    if (!sameSubnet(ip)) return BLOCK;

    return maintainProxySession(ROUTE_CORE);
  }

  // ---- SOCIAL / DISCOVERY (أردني فقط) ----
  if (isSocial(url,host) || isDiscovery(url,host)) {
    SESSION.discoveryCount++;

    if (!ip || !isJordanianIP(ip)) return BLOCK;
    if (!sameSubnet(ip)) return BLOCK;

    return maintainProxySession(ROUTE_SOCIAL);
  }

  // ---- SESSION CONTROL ----
  if (isSession(url,host)) {
    if (!ip || !isJordanianIP(ip)) return BLOCK;
    if (!sameSubnet(ip)) return BLOCK;
    return maintainProxySession(ROUTE_CORE);
  }

  // ---- REALTIME / COMBAT (أردني محدد) ----
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
    if (!ip || !isJordanianIP(ip)) return BLOCK;
    return maintainProxySession(ROUTE_META);
  }

  return BLOCK;
}
