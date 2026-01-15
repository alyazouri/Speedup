// =====================================================
// JoMe1_JO_ALL_STRICT_V3_HYPER_RECRUIT.pac
// =====================================================
// 🎯 ULTRA AGGRESSIVE JORDAN RECRUITMENT
// - المباريات: أردن فقط ✅
// - التجنيد واللوبي: أردن 200%+ 🚀
// - توسيع شامل لكل IPs الأردنية
// - فلترة مشددة للدول الأخرى
// =====================================================

// ============================================================
// 1. PROXY CONFIGURATION
// ============================================================
var LOBBY_PROXY_CHAIN = "PROXY 176.29.153.95:9030; PROXY 212.35.66.45:9030; PROXY 176.29.153.95:9030";
var MATCH_PROXY = "PROXY 176.29.153.95:20001";
var BLOCK = "PROXY 127.0.0.1:9";

// ============================================================
// 2. SYSTEM WHITELIST (محدود جداً)
// ============================================================
var SAFE_DIRECT = [
  "captive.apple.com","time.apple.com","ocsp.apple.com",
  "clients3.google.com","connectivitycheck.gstatic.com"
];

// CDN محدودة فقط للضروريات
var CDN_DIRECT = [
  "googlevideo.com","ytimg.com" // فقط للفيديوهات
];

// ============================================================
// 3. JORDAN IP MEGA POOL (موسّع × 3)
// ============================================================

// ===== TIER 1: Core Match IPs (المباريات فقط) =====
var JO_MATCH_ONLY = {
  "176.29.":1,
  "82.212.":1,
  "212.34.":1,
  "212.35.":1,
  "94.249.":1
};

// ===== TIER 2: MEGA RECRUIT POOL (للوبي والتجنيد) =====
var JO_RECRUIT_MEGA = {
  // كل IPs المباريات
  "176.29.":1, "82.212.":1, "212.34.":1, "212.35.":1, "94.249.":1,
  
  // === Orange Jordan (موسّع) ===
  "46.32.":1,   // Orange Mobile
  "95.87.":1,   // Orange Fiber
  "176.241.":1, // Orange Business
  "37.48.":1,   // Orange ADSL
  "188.161.":1, // Orange WiFi
  
  // === Zain Jordan (موسّع) ===
  "188.247.":1, // Zain Mobile
  "91.144.":1,  // Zain Fiber
  "195.229.":1, // Zain Data
  "31.186.":1,  // Zain Business
  "109.224.":1, // Zain 4G
  
  // === Umniah (موسّع) ===
  "46.185.":1,  // Umniah Mobile
  "85.159.":1,  // Umniah Broadband
  "178.18.":1,  // Umniah LTE
  "5.11.":1,    // Umniah Fiber
  "193.188.":1, // Umniah Business
  
  // === Batelco Jordan (موسّع) ===
  "37.8.":1,    // Batelco Residential
  "83.244.":1,  // Batelco Business
  "91.185.":1,  // Batelco Enterprise
  "195.106.":1, // Batelco Data Center
  
  // === Jordan Telecom & Others ===
  "37.123.":1,  // Jordan Telecom
  "141.105.":1, // Damamax
  "185.14.":1,  // Edge Data Centers
  "87.236.":1,  // Jordan Networks
  "212.118.":1, // TE Data Jordan
  "185.107.":1, // Jordan Cloud
  
  // === NEW: IPs إضافية من البحث العميق ===
  "176.9.":1,   // Hetzner Jordan Nodes
  "213.6.":1,   // Jordan Education Network
  "62.150.":1,  // Petra University Network
  "193.0.":1,   // RIPE Jordan
  "91.106.":1,  // Jordan ISP Alliance
  "46.244.":1,  // Local Jordan Providers
  "185.126.":1, // Jordan Gaming Networks
  "188.120.":1, // Jordan Mobile Extra
  "77.44.":1,   // Jordan ADSL
  "217.19.":1,  // Jordan Corporate
  
  // === شبكات حكومية وجامعية ===
  "213.178.":1, // Jordan Gov Network
  "195.188.":1, // Universities Network
  "212.50.":1,  // Jordan Research Network
  
  // === مزودين صغار ===
  "109.107.":1, // Small ISP JO-1
  "185.184.":1, // Small ISP JO-2
  "91.228.":1,  // Small ISP JO-3
  "46.49.":1,   // Small ISP JO-4
  "188.163.":1  // Small ISP JO-5
};

// ===== TIER 3: WILDCARD PATTERNS (أنماط واسعة) =====
var JO_WILDCARD_PREFIXES = [
  "176.29", "82.212", "212.34", "212.35", "94.249",
  "46.185", "85.159", "37.123", "37.8", "46.32",
  "188.247", "91.144", "141.105", "185.14", "83.244",
  "87.236", "212.118", "95.87", "176.241", "91.185",
  "195.106", "178.18", "5.11", "193.188", "31.186",
  "109.224", "195.229", "37.48", "188.161", "185.107",
  "176.9", "213.6", "62.150", "193.0", "91.106",
  "46.244", "185.126", "188.120", "77.44", "217.19",
  "213.178", "195.188", "212.50", "109.107", "185.184",
  "91.228", "46.49", "188.163"
];

// ============================================================
// 4. AGGRESSIVE NON-JORDAN BLOCKING
// ============================================================

// دول تُحظر تماماً في اللوبي والتجنيد
var BLOCKED_COUNTRIES = {
  // آسيا
  "43.":1,    // China Telecom
  "58.":1,    // China Mobile
  "111.":1,   // China Unicom
  "112.":1,   // China Networks
  "113.":1,   // China
  "114.":1,   // China
  "115.":1,   // China
  "116.":1,   // China
  "117.":1,   // China
  "118.":1,   // China
  "119.":1,   // China
  "120.":1,   // China
  "121.":1,   // China
  "122.":1,   // China
  "123.":1,   // China
  "124.":1,   // China
  "125.":1,   // China
  
  // الهند
  "14.":1,    // BSNL India
  "27.":1,    // Jio India
  "103.":1,   // Indian ISPs
  "106.":1,   // Airtel India
  "117.":1,   // Vodafone India
  
  // جنوب شرق آسيا
  "1.":1,     // Thailand/Singapore
  "101.":1,   // Singapore
  "103.":1,   // Malaysia
  "171.":1,   // Thailand
  "175.":1,   // Vietnam
  
  // أوروبا (غير الأردنية)
  "2.":1,     // EU Generic
  "5.":1,     // EU Generic (ماعدا 5.11 الأردنية)
  "31.":1,    // EU Generic (ماعدا 31.186 الأردنية)
  "78.":1,    // EU Generic
  "79.":1,    // EU Generic
  "80.":1,    // EU Generic
  "81.":1,    // EU Generic
  
  // أمريكا
  "8.":1,     // Level3 USA
  "12.":1,    // AT&T USA
  "23.":1,    // Akamai USA
  "64.":1,    // USA Generic
  "65.":1,    // USA Generic
  "66.":1,    // USA Generic
  "67.":1,    // USA Generic
  "68.":1,    // USA Generic
  "69.":1,    // USA Generic
  "70.":1,    // USA Generic
  "71.":1,    // USA Generic
  "72.":1,    // USA Generic
  "73.":1,    // USA Generic
  "74.":1,    // USA Generic
  
  // خليجية (غير أردنية)
  "5.62.":1,   // UAE
  "94.56.":1,  // UAE
  "212.26.":1, // Saudi
  "46.34.":1,  // Saudi
  "80.184.":1  // Kuwait
};

// ============================================================
// 5. HELPER FUNCTIONS
// ============================================================
function normalizeHost(h) {
  var i = h.indexOf(":");
  return (i !== -1) ? h.substring(0, i) : h;
}

function isIPv4(ip) {
  return ip && /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip);
}

function getIP(host) {
  try {
    var ip = dnsResolve(host);
    return (ip && isIPv4(ip)) ? ip : null;
  } catch(e) {
    return null;
  }
}

function startsWithAny(ip, table) {
  if (!ip) return false;
  for (var prefix in table) {
    if (ip.indexOf(prefix) === 0) return true;
  }
  return false;
}

function startsWithList(ip, list) {
  if (!ip) return false;
  for (var i = 0; i < list.length; i++) {
    if (ip.indexOf(list[i]) === 0) return true;
  }
  return false;
}

function isPrivateOrLocalIP(ip) {
  if (!ip) return false;
  return (
    isInNet(ip, "10.0.0.0", "255.0.0.0") ||
    isInNet(ip, "172.16.0.0", "255.240.0.0") ||
    isInNet(ip, "192.168.0.0", "255.255.0.0") ||
    isInNet(ip, "127.0.0.0", "255.0.0.0") ||
    isInNet(ip, "169.254.0.0", "255.255.0.0")
  );
}

function containsAny(s, list) {
  if (!s) return false;
  s = s.toLowerCase();
  for (var i = 0; i < list.length; i++) {
    if (s.indexOf(list[i]) !== -1) return true;
  }
  return false;
}

// ============================================================
// 6. PUBG DETECTION
// ============================================================
function isPUBG(host) {
  if (!host) return false;
  host = host.toLowerCase();
  
  var keywords = [
    "pubg","pubgm","pubgmobile","intlgame","igamecj","igame",
    "proximabeta","tencent","qq","qcloud","gcloud",
    "krafton","lightspeed",
    "amsoveasea","ams","ace",
    "vmpone","vmp","gme","gamecenter",
    "worldofwonder","wow","ugc","creative"
  ];
  
  for (var i = 0; i < keywords.length; i++) {
    if (host.indexOf(keywords[i]) !== -1) return true;
  }
  return false;
}

// ============================================================
// 7. TRAFFIC CLASSIFICATION
// ============================================================
function isLobbyTraffic(url, host) {
  var s = (url + " " + host).toLowerCase();
  return /(lobby|matchmaking|matching|queue|mm|
           room|rooms|recruit|team|squad|party|invite|
           friend|social|chat|voice|
           gate|dispatcher|router|region|allocation|
           presence|status|heartbeat|
           login|auth|passport|account|profile|
           store|shop|inventory|season|rank|tier|
           mission|achievement|event|news)/x.test(s);
}

function isRecruitTraffic(url, host) {
  var s = (url + " " + host).toLowerCase();
  return /(recruit|recruitment|team|squad|party|
           invite|invitation|friend|friendlist|
           social|chat|message|voice|
           looking|lfg|lfm|search|find|
           join|accept|request)/x.test(s);
}

function isWOWTraffic(url, host) {
  var s = (url + " " + host).toLowerCase();
  return /(worldofwonder|wow|ugc|creative|
           creation|creations|customroom|custom|
           map|maps|template|featured|trending|
           community|workshop|editor|publish)/x.test(s);
}

function isMatchTraffic(url, host) {
  var s = (url + " " + host).toLowerCase();
  return /(game|battle|fight|combat|play|match|
           gs\.|gss|gameserver|logic|session|
           zone|shard|realtime|sync|tick)/x.test(s);
}

// ============================================================
// 8. ENHANCED JORDAN IP VALIDATION
// ============================================================
function isJordanIP(ip) {
  if (!ip) return false;
  
  // Check 1: Exact prefix match (MEGA POOL)
  if (startsWithAny(ip, JO_RECRUIT_MEGA)) {
    return true;
  }
  
  // Check 2: Wildcard patterns
  if (startsWithList(ip, JO_WILDCARD_PREFIXES)) {
    return true;
  }
  
  // Check 3: Range-based detection
  // مثال: 176.29.0.0 - 176.29.255.255
  var parts = ip.split(".");
  if (parts.length === 4) {
    var first = parseInt(parts[0]);
    var second = parseInt(parts[1]);
    
    // 176.29.x.x - 176.30.x.x
    if (first === 176 && second >= 29 && second <= 30) return true;
    
    // 82.212.x.x - 82.213.x.x
    if (first === 82 && second >= 212 && second <= 213) return true;
    
    // 212.34.x.x - 212.36.x.x
    if (first === 212 && second >= 34 && second <= 36) return true;
    
    // 94.249.x.x - 94.250.x.x
    if (first === 94 && second >= 249 && second <= 250) return true;
    
    // 46.185.x.x - 46.186.x.x
    if (first === 46 && second >= 185 && second <= 186) return true;
    
    // المزيد من الـ ranges...
    if (first === 188 && second >= 247 && second <= 248) return true;
    if (first === 91 && second >= 144 && second <= 145) return true;
    if (first === 85 && second >= 159 && second <= 160) return true;
  }
  
  return false;
}

function isBlockedCountry(ip) {
  if (!ip) return false;
  
  // Check exact blocks
  if (startsWithAny(ip, BLOCKED_COUNTRIES)) {
    // Exception: IPs الأردنية التي قد تشترك في البادئة
    if (isJordanIP(ip)) return false;
    return true;
  }
  
  return false;
}

function allowLobby(ip) {
  if (!ip) return false;
  
  // 1. يجب أن يكون أردني
  if (!isJordanIP(ip)) return false;
  
  // 2. ما يكون محظور
  if (isBlockedCountry(ip)) return false;
  
  return true;
}

function allowMatch(ip) {
  if (!ip) return false;
  
  // المباريات: IPs محدودة فقط
  return startsWithAny(ip, JO_MATCH_ONLY);
}

// ============================================================
// 9. MAIN PROXY FUNCTION
// ============================================================
function FindProxyForURL(url, host) {
  host = normalizeHost(host);
  
  // System bypass (محدود جداً)
  if (containsAny(host, SAFE_DIRECT)) return "DIRECT";
  if (containsAny(host, CDN_DIRECT)) return "DIRECT";
  
  // Resolve IP
  var ip = getIP(host);
  
  // Private IPs
  if (ip && isPrivateOrLocalIP(ip)) return "DIRECT";
  
  // Non-PUBG traffic
  if (!isPUBG(host)) return "DIRECT";
  
  // DNS failure = BLOCK
  if (!ip) return BLOCK;
  
  // ===== حظر فوري للدول غير الأردنية في اللوبي =====
  if (isBlockedCountry(ip)) {
    return BLOCK;
  }
  
  // ===== تصنيف الترافيك =====
  var isLobby = isLobbyTraffic(url, host);
  var isRecruit = isRecruitTraffic(url, host);
  var isWOW = isWOWTraffic(url, host);
  var isMatch = isMatchTraffic(url, host);
  
  // ===== LOBBY & RECRUIT: أردن فقط (MEGA POOL) =====
  if (isLobby || isRecruit || isWOW) {
    if (allowLobby(ip)) {
      return LOBBY_PROXY_CHAIN;
    }
    // حظر أي شيء غير أردني في اللوبي
    return BLOCK;
  }
  
  // ===== MATCH: أردن فقط (CORE POOL) =====
  if (isMatch) {
    if (allowMatch(ip)) {
      return MATCH_PROXY;
    }
    return BLOCK;
  }
  
  // ===== DEFAULT: معاملة كـ Match =====
  if (allowMatch(ip)) {
    return MATCH_PROXY;
  }
  
  // كل شيء آخر = BLOCK
  return BLOCK;
}
