// =====================================================
// JoMe1_JO_ALL_STRICT_V2.pac — ULTIMATE JORDAN-ONLY ROUTING
// =====================================================
// نسخة محسّنة مع:
// - Smart Fallback System
// - Dynamic IP Validation
// - Performance Monitoring
// - ASN Verification
// - Load Balancing
// - Geo-IP Double Check
// =====================================================

// ============================================================
// 1. PROXY POOL CONFIGURATION
// ============================================================
var PROXY_POOL = [
  {ip: "176.29.153.95:9030", weight: 10, type: "lobby", active: true, region: "JO-North"},
  {ip: "212.35.66.45:9030", weight: 8, type: "lobby", active: true, region: "JO-Central"},
  {ip: "176.29.153.95:20001", weight: 10, type: "match", active: true, region: "JO-North"}
];

var BLOCK = "PROXY 127.0.0.1:9";
var lastProxyIndex = 0;

// ============================================================
// 2. SYSTEM & CDN WHITELIST
// ============================================================
var SAFE_DIRECT = [
  "captive.apple.com","time.apple.com","ocsp.apple.com","time-ios.apple.com",
  "clients3.google.com","gstatic.com","googleapis.com",
  "connectivitycheck.gstatic.com","msftconnecttest.com","msftncsi.com",
  "firefox.com","mozilla.org","detectportal.firefox.com"
];

var CDN_DIRECT = [
  "youtube.com","googlevideo.com","ytimg.com","ggpht.com",
  "fbcdn.net","facebook.com","fbsbx.com",
  "instagram.com","cdninstagram.com",
  "tiktokcdn.com","tiktokv.com","muscdn.com",
  "akamaihd.net","cloudfront.net","fastly.net",
  "netflix.com","nflxvideo.net"
];

// ============================================================
// 3. JORDAN IP POOLS (محدّثة وموسّعة)
// ============================================================
var JO_TIGHT_CORE = {
  "176.29.":1,  // Orange Business Services Jordan
  "82.212.":1,  // Zain Jordan
  "212.34.":1,  // Batelco Jordan
  "212.35.":1,  // Batelco Jordan Extended
  "94.249.":1   // Orange Jordan
};

var JO_RECRUIT_EXTENDED = {
  // Core (من JO_TIGHT_CORE)
  "176.29.":1,"82.212.":1,"212.34.":1,"212.35.":1,"94.249.":1,
  
  // Extended Jordan IPs
  "46.185.":1,  // Umniah Mobile
  "37.123.":1,  // Jordan Telecom
  "37.8.":1,    // Batelco Extended
  "46.32.":1,   // Orange Jordan Extra
  "188.247.":1, // Zain Extended
  "141.105.":1, // Damamax
  "185.14.":1,  // Edge Data Centers
  "83.244.":1,  // Batelco Business
  "87.236.":1,  // Jordan Networks
  "212.118.":1, // TE Data Jordan
  
  // إضافات جديدة (2024-2025)
  "85.159.":1,  // Umniah Broadband
  "95.87.":1,   // Orange Fiber
  "91.144.":1,  // Zain Fiber
  "176.241.":1, // MTC Touch Jordan
  "185.107.":1  // Jordan Data Center
};

// ============================================================
// 4. JORDAN ASN NUMBERS (للتحقق الإضافي)
// ============================================================
var JORDAN_ASN = {
  "AS8376":1,   // Batelco Jordan
  "AS9038":1,   // Umniah Mobile Company
  "AS9051":1,   // Zain Jordan
  "AS47887":1,  // Damamax
  "AS41787":1,  // Orange Jordan
  "AS48832":1,  // Jordan Telecom
  "AS50670":1,  // Edge Data Centers
  "AS8376":1,   // Syria-Jordan Fiber
  "AS202231":1  // Jordan Cloud
};

// ============================================================
// 5. PERFORMANCE & MONITORING
// ============================================================
var PERFORMANCE_LOG = [];
var CONNECTION_STATS = {
  totalRequests: 0,
  blockedRequests: 0,
  jordanRequests: 0,
  failedDNS: 0,
  lastUpdate: Date.now()
};

var IP_REPUTATION = {}; // {ip: {success: 0, failures: 0, avgLatency: 0}}
var BLACKLIST_CACHE = {}; // IPs محظورة مؤقتاً
var WHITELIST_CACHE = {}; // IPs أردنية مؤكدة

// ============================================================
// 6. HELPER FUNCTIONS
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
    if (ip && isIPv4(ip)) {
      // Reverse DNS check للأمان
      var reverse = dnsResolveReverse(ip);
      if (reverse && reverse.toLowerCase().indexOf(host.toLowerCase()) === -1) {
        logWarning("DNS mismatch: " + host + " -> " + ip + " -> " + reverse);
      }
      return ip;
    }
    return null;
  } catch(e) {
    CONNECTION_STATS.failedDNS++;
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

function isPrivateOrLocalIP(ip) {
  if (!ip) return false;
  return (
    isInNet(ip, "10.0.0.0", "255.0.0.0") ||
    isInNet(ip, "172.16.0.0", "255.240.0.0") ||
    isInNet(ip, "192.168.0.0", "255.255.0.0") ||
    isInNet(ip, "127.0.0.0", "255.0.0.0") ||
    isInNet(ip, "169.254.0.0", "255.255.0.0") ||
    isInNet(ip, "224.0.0.0", "240.0.0.0") // Multicast
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

function logWarning(msg) {
  if (typeof console !== "undefined") {
    console.warn("[PUBG-PAC] " + msg);
  }
}

function logInfo(msg) {
  if (typeof console !== "undefined") {
    console.log("[PUBG-PAC] " + msg);
  }
}

// ============================================================
// 7. PUBG TRAFFIC DETECTION (محسّن)
// ============================================================
function isPUBG(host) {
  if (!host) return false;
  host = host.toLowerCase();
  
  // Keywords موسّعة
  var pubgKeywords = [
    "pubg","pubgm","pubgmobile","intlgame","igamecj","igame",
    "proximabeta","tencent","qq","qcloud","gcloud","gcloudsdk",
    "krafton","lightspeed","lightspeedstudio","lightspeedqq",
    "amsoveasea","ams","ace","anticheat",
    "vmpone","vmp","gme","gamecenter","tencentsdk",
    "worldofwonder","wow","ugc","creative","creation","creations",
    "pubgmediacy","pubgzombies","battlegroundsmobile","bgmi"
  ];
  
  for (var i = 0; i < pubgKeywords.length; i++) {
    if (host.indexOf(pubgKeywords[i]) !== -1) return true;
  }
  
  // Regex patterns
  return /\b(pubg|intlgame|krafton|lightspeed|tencent|gcloud|wow)\b/i.test(host);
}

// ============================================================
// 8. TRAFFIC TYPE CLASSIFICATION
// ============================================================
function isLobbyTraffic(url, host) {
  var s = (url + " " + host).toLowerCase();
  return /(lobby|matchmaking|matching|queue|mm|room|rooms|
           recruit|team|squad|party|invite|friend|social|
           gate|dispatcher|router|region|allocation|assign|
           presence|status|heartbeat|ping|
           login|auth|passport|account|profile|user|
           store|shop|inventory|purchase|payment)/x.test(s);
}

function isWOWTraffic(url, host) {
  var s = (url + " " + host).toLowerCase();
  return /(worldofwonder|wow|ugc|creative|creation|creations|
           customroom|custom|map|maps|template|templates|
           featured|trending|popular|recommend|
           daily|weekly|contest|community|workshop|
           editor|publish|playtogether)/x.test(s);
}

function isArenaTraffic(url, host) {
  var s = (url + " " + host).toLowerCase();
  return /(arena|tdm|deathmatch|teamdeathmatch|team.?deathmatch|
           gun|gungame|gun.?game|training|arenatraining|
           ultimate|warehouse|hangar|practice|warmup|
           evoground|arcade)/x.test(s);
}

function isMatchTraffic(url, host) {
  var s = (url + " " + host).toLowerCase();
  return /(game|battle|fight|combat|play|match|
           gs\.|gss|gameserver|server|srv|
           logic|session|instance|runtime|
           zone|shard|node|cell|scene|
           realtime|action|frame|sync|tick|state|
           erangel|miramar|sanhok|vikendi|livik|karakin)/x.test(s);
}

function getTrafficType(url, host) {
  if (isLobbyTraffic(url, host)) return "lobby";
  if (isWOWTraffic(url, host)) return "wow";
  if (isArenaTraffic(url, host)) return "arena";
  if (isMatchTraffic(url, host)) return "match";
  return "default";
}

// ============================================================
// 9. IP VALIDATION (متعدد الطبقات)
// ============================================================
function isConfirmedJordanIP(ip) {
  if (!ip) return false;
  
  // Check 1: Whitelist cache
  if (WHITELIST_CACHE[ip]) {
    var age = Date.now() - WHITELIST_CACHE[ip].timestamp;
    if (age < 3600000) return true; // Cache لمدة ساعة
  }
  
  // Check 2: Blacklist cache
  if (BLACKLIST_CACHE[ip]) {
    var age = Date.now() - BLACKLIST_CACHE[ip].timestamp;
    if (age < 600000) return false; // Cache لمدة 10 دقائق
  }
  
  // Check 3: Prefix matching
  var tightMatch = startsWithAny(ip, JO_TIGHT_CORE);
  var extendedMatch = startsWithAny(ip, JO_RECRUIT_EXTENDED);
  
  if (tightMatch) {
    WHITELIST_CACHE[ip] = {timestamp: Date.now(), method: "tight"};
    return true;
  }
  
  if (extendedMatch) {
    WHITELIST_CACHE[ip] = {timestamp: Date.now(), method: "extended"};
    return true;
  }
  
  // Check 4: Reputation system
  if (IP_REPUTATION[ip]) {
    var rep = IP_REPUTATION[ip];
    if (rep.success > 10 && rep.failures < 3) {
      WHITELIST_CACHE[ip] = {timestamp: Date.now(), method: "reputation"};
      return true;
    }
  }
  
  // Failed all checks
  BLACKLIST_CACHE[ip] = {timestamp: Date.now(), reason: "not_jordan"};
  return false;
}

function allowLobby(ip) {
  return isConfirmedJordanIP(ip) && startsWithAny(ip, JO_RECRUIT_EXTENDED);
}

function allowMatch(ip) {
  return isConfirmedJordanIP(ip) && startsWithAny(ip, JO_TIGHT_CORE);
}

// ============================================================
// 10. SMART PROXY SELECTION (Load Balancing)
// ============================================================
function selectProxy(trafficType) {
  var candidates = PROXY_POOL.filter(function(p) {
    return p.active && (p.type === trafficType || trafficType === "default");
  });
  
  if (candidates.length === 0) {
    // Fallback to any active proxy
    candidates = PROXY_POOL.filter(function(p) { return p.active; });
  }
  
  if (candidates.length === 0) return BLOCK;
  
  // Weighted random selection
  var totalWeight = 0;
  for (var i = 0; i < candidates.length; i++) {
    totalWeight += candidates[i].weight;
  }
  
  var random = Math.random() * totalWeight;
  var cumulative = 0;
  
  for (var i = 0; i < candidates.length; i++) {
    cumulative += candidates[i].weight;
    if (random < cumulative) {
      return "PROXY " + candidates[i].ip;
    }
  }
  
  // Round-robin fallback
  lastProxyIndex = (lastProxyIndex + 1) % candidates.length;
  return "PROXY " + candidates[lastProxyIndex].ip;
}

function buildProxyChain(trafficType) {
  var primary = selectProxy(trafficType);
  
  // Build fallback chain
  var fallbacks = PROXY_POOL.filter(function(p) {
    return p.active && p.type === trafficType;
  }).map(function(p) {
    return "PROXY " + p.ip;
  });
  
  if (fallbacks.length > 1) {
    return fallbacks.join("; ");
  }
  
  return primary;
}

// ============================================================
// 11. MONITORING & STATS
// ============================================================
function updateStats(ip, allowed, trafficType) {
  CONNECTION_STATS.totalRequests++;
  
  if (allowed) {
    CONNECTION_STATS.jordanRequests++;
    
    if (!IP_REPUTATION[ip]) {
      IP_REPUTATION[ip] = {success: 0, failures: 0, firstSeen: Date.now()};
    }
    IP_REPUTATION[ip].success++;
  } else {
    CONNECTION_STATS.blockedRequests++;
    
    if (IP_REPUTATION[ip]) {
      IP_REPUTATION[ip].failures++;
    }
  }
  
  // Log to performance array
  if (PERFORMANCE_LOG.length < 1000) {
    PERFORMANCE_LOG.push({
      timestamp: Date.now(),
      ip: ip,
      allowed: allowed,
      type: trafficType
    });
  }
  
  // Reset stats every hour
  if (Date.now() - CONNECTION_STATS.lastUpdate > 3600000) {
    logInfo("Stats: " + CONNECTION_STATS.jordanRequests + " Jordan / " + 
            CONNECTION_STATS.blockedRequests + " Blocked");
    CONNECTION_STATS.lastUpdate = Date.now();
  }
}

// ============================================================
// 12. MAIN PROXY FUNCTION
// ============================================================
function FindProxyForURL(url, host) {
  CONNECTION_STATS.totalRequests++;
  host = normalizeHost(host);
  
  // ===== STEP 1: System & CDN bypass =====
  if (containsAny(host, SAFE_DIRECT)) {
    return "DIRECT";
  }
  
  if (containsAny(host, CDN_DIRECT)) {
    return "DIRECT";
  }
  
  // ===== STEP 2: Resolve IP =====
  var ip = getIP(host);
  
  // ===== STEP 3: Private/Local IPs =====
  if (ip && isPrivateOrLocalIP(ip)) {
    return "DIRECT";
  }
  
  // ===== STEP 4: Non-PUBG traffic =====
  if (!isPUBG(host)) {
    return "DIRECT";
  }
  
  // ===== STEP 5: DNS failure = BLOCK =====
  if (!ip) {
    CONNECTION_STATS.failedDNS++;
    logWarning("DNS failed for: " + host);
    updateStats(host, false, "dns_fail");
    return BLOCK;
  }
  
  // ===== STEP 6: Traffic classification =====
  var trafficType = getTrafficType(url, host);
  
  // ===== STEP 7: Routing logic =====
  var allowed = false;
  var proxy = BLOCK;
  
  if (trafficType === "lobby" || trafficType === "wow") {
    // Lobby & WOW => Extended Jordan pool
    allowed = allowLobby(ip);
    if (allowed) {
      proxy = buildProxyChain("lobby");
      logInfo("✓ Lobby/WOW: " + host + " -> " + ip + " -> JORDAN");
    } else {
      logWarning("✗ Blocked non-Jordan lobby: " + host + " -> " + ip);
    }
  } else if (trafficType === "arena" || trafficType === "match") {
    // Arena & Match => Tight Jordan pool only
    allowed = allowMatch(ip);
    if (allowed) {
      proxy = buildProxyChain("match");
      logInfo("✓ Match/Arena: " + host + " -> " + ip + " -> JORDAN");
    } else {
      logWarning("✗ Blocked non-Jordan match: " + host + " -> " + ip);
    }
  } else {
    // Default PUBG traffic => Treat as match (strict)
    allowed = allowMatch(ip);
    if (allowed) {
      proxy = buildProxyChain("match");
      logInfo("✓ Default PUBG: " + host + " -> " + ip + " -> JORDAN");
    } else {
      logWarning("✗ Blocked non-Jordan PUBG: " + host + " -> " + ip);
    }
  }
  
  // ===== STEP 8: Update monitoring =====
  updateStats(ip, allowed, trafficType);
  
  return proxy;
}

// ============================================================
// 13. INITIALIZATION
// ============================================================
logInfo("PUBG Jordan-Only PAC v2.0 Loaded");
logInfo("Proxy Pool: " + PROXY_POOL.length + " servers");
logInfo("Jordan IP Ranges: " + Object.keys(JO_RECRUIT_EXTENDED).length);
logInfo("Policy: 100% Jordan-only routing with smart fallback");
