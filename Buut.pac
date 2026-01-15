// =====================================================
// JoMe1_ASIA_EAST_ROUTER.pac
// =====================================================
// 🎯 الهدف: توجيه لسيرفرات اليابان وكوريا الجنوبية
// - أولوية: اليابان (Tokyo)
// - ثانوي: كوريا الجنوبية (Seoul)
// - احتياطي: سنغافورة / هونغ كونغ
// =====================================================

// ============================================================
// 1. PROXY CONFIGURATION - ASIA EAST
// ============================================================

// البروكسيات اليابانية (طوكيو)
var JAPAN_PROXIES = [
  "PROXY jp-tokyo-1.proxy.com:8080",      // Tokyo Primary
  "PROXY jp-tokyo-2.proxy.com:8080",      // Tokyo Secondary
  "PROXY jp-osaka.proxy.com:8080"         // Osaka Backup
];

// البروكسيات الكورية (سيول)
var KOREA_PROXIES = [
  "PROXY kr-seoul-1.proxy.com:8080",      // Seoul Primary
  "PROXY kr-seoul-2.proxy.com:8080",      // Seoul Secondary
  "PROXY kr-busan.proxy.com:8080"         // Busan Backup
];

// بروكسيات احتياطية (آسيا)
var ASIA_BACKUP_PROXIES = [
  "PROXY sg-singapore.proxy.com:8080",    // Singapore
  "PROXY hk-hongkong.proxy.com:8080",     // Hong Kong
  "PROXY tw-taipei.proxy.com:8080"        // Taiwan
];

// ============================================================
// 🔥 خيارات بروكسيات حقيقية مجانية/مدفوعة
// ============================================================
// استخدم واحد من هذه الخدمات:

// OPTION 1: Bright Data (مدفوع - الأفضل)
// https://brightdata.com
// var JAPAN_PROXIES = ["PROXY brd.superproxy.io:22225"];

// OPTION 2: Smartproxy (مدفوع)
// https://smartproxy.com
// var JAPAN_PROXIES = ["PROXY gate.smartproxy.com:7000"];

// OPTION 3: ProxyRack (رخيص)
// https://www.proxyrack.com
// var JAPAN_PROXIES = ["PROXY mega.proxyrack.net:9090"];

// OPTION 4: Free Proxy Lists (مجاني - غير مستقر)
// https://www.proxynova.com/proxy-server-list/country-jp/
// مثال IPs يابانية مجانية (تتغير دائماً):
var JAPAN_FREE_SAMPLE = [
  "PROXY 210.140.92.183:8080",
  "PROXY 153.122.86.46:8080",
  "PROXY 160.16.233.90:3128"
];

var KOREA_FREE_SAMPLE = [
  "PROXY 222.110.147.50:3128",
  "PROXY 175.214.114.40:8080",
  "PROXY 121.134.198.244:8080"
];

// ============================================================
// اختر أي من الأعلى واستبدل هنا:
// ============================================================
var JAPAN_PRIMARY = JAPAN_FREE_SAMPLE.join("; ");
var KOREA_PRIMARY = KOREA_FREE_SAMPLE.join("; ");
var ASIA_FALLBACK = "PROXY 128.199.202.122:8080"; // Singapore fallback

var BLOCK = "PROXY 127.0.0.1:9";

// ============================================================
// 2. PUBG ASIA EAST SERVER IPs
// ============================================================

// Japan Server Ranges (PUBG Mobile)
var JAPAN_SERVERS = {
  // Tokyo AWS
  "52.68.":1,      // ap-northeast-1 (Tokyo)
  "52.69.":1,
  "52.192.":1,
  "52.193.":1,
  "52.194.":1,
  "52.195.":1,
  "52.196.":1,
  "52.197.":1,
  "52.198.":1,
  "52.199.":1,
  "54.64.":1,
  "54.65.":1,
  "54.92.":1,
  "54.95.":1,
  "54.150.":1,
  "54.168.":1,
  "54.178.":1,
  "54.199.":1,
  "54.238.":1,
  "54.248.":1,
  "54.249.":1,
  "54.250.":1,
  
  // Tencent Cloud Japan
  "119.28.":1,
  "129.226.":1,
  "150.109.":1,
  "175.24.":1,
  
  // NTT/IIJ Japan
  "202.239.":1,
  "203.104.":1,
  "210.196.":1,
  "211.14.":1,
  "61.115.":1
};

// South Korea Server Ranges
var KOREA_SERVERS = {
  // AWS Seoul (ap-northeast-2)
  "52.78.":1,
  "52.79.":1,
  "13.124.":1,
  "13.125.":1,
  "15.164.":1,
  "15.165.":1,
  "3.34.":1,
  "3.35.":1,
  "3.36.":1,
  "3.37.":1,
  "3.38.":1,
  "3.39.":1,
  
  // Tencent Cloud Korea
  "119.29.":1,
  "129.28.":1,
  "150.109.":1,
  
  // KT/SK Korea
  "211.174.":1,
  "211.234.":1,
  "218.38.":1,
  "121.254.":1,
  "175.125.":1
};

// Other East Asia (Backup)
var ASIA_EAST_BACKUP = {
  // Singapore
  "13.212.":1,     // AWS Singapore
  "13.229.":1,
  "18.136.":1,
  "18.138.":1,
  "18.139.":1,
  "52.74.":1,
  "52.76.":1,
  "54.169.":1,
  "54.179.":1,
  "54.251.":1,
  
  // Hong Kong
  "18.162.":1,     // AWS HK
  "18.163.":1,
  "43.198.":1,
  "16.162.":1,
  "203.88.":1,
  
  // Taiwan
  "203.74.":1,
  "61.216.":1,
  "111.235.":1
};

// ============================================================
// 3. SYSTEM WHITELIST
// ============================================================
var SAFE_DIRECT = [
  "captive.apple.com","time.apple.com","ocsp.apple.com",
  "clients3.google.com","connectivitycheck.gstatic.com",
  "msftconnecttest.com","msftncsi.com"
];

var CDN_DIRECT = [
  "googlevideo.com","ytimg.com","ggpht.com",
  "fbcdn.net","cdninstagram.com",
  "cloudfront.net","akamaihd.net"
];

// ============================================================
// 4. HELPER FUNCTIONS
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
// 5. PUBG DETECTION
// ============================================================
function isPUBG(host) {
  if (!host) return false;
  host = host.toLowerCase();
  
  var keywords = [
    "pubg","pubgm","pubgmobile","intlgame","igamecj","igame",
    "proximabeta","tencent","qq","qcloud","gcloud",
    "krafton","lightspeed","amsoveasea","ams","ace",
    "vmpone","vmp","gme","gamecenter","worldofwonder","wow"
  ];
  
  for (var i = 0; i < keywords.length; i++) {
    if (host.indexOf(keywords[i]) !== -1) return true;
  }
  return false;
}

// ============================================================
// 6. TRAFFIC CLASSIFICATION
// ============================================================
function isMatchmakingTraffic(url, host) {
  var s = (url + " " + host).toLowerCase();
  return /(matchmaking|matching|queue|mm|search|
           allocation|assign|region|dispatcher|gate)/x.test(s);
}

function isLobbyTraffic(url, host) {
  var s = (url + " " + host).toLowerCase();
  return /(lobby|room|recruit|team|squad|party|
           invite|friend|social|presence)/x.test(s);
}

function isMatchTraffic(url, host) {
  var s = (url + " " + host).toLowerCase();
  return /(game|battle|gs\.|gss|gameserver|
           logic|session|zone|realtime|sync)/x.test(s);
}

// ============================================================
// 7. REGION DETECTION
// ============================================================
function getServerRegion(ip) {
  if (!ip) return "UNKNOWN";
  
  if (startsWithAny(ip, JAPAN_SERVERS)) return "JAPAN";
  if (startsWithAny(ip, KOREA_SERVERS)) return "KOREA";
  if (startsWithAny(ip, ASIA_EAST_BACKUP)) return "ASIA_BACKUP";
  
  // Auto-detect by IP range
  var firstOctet = parseInt(ip.split(".")[0]);
  
  // Japan common ranges
  if ((firstOctet >= 52 && firstOctet <= 54) || 
      firstOctet === 202 || firstOctet === 203 || 
      firstOctet === 210 || firstOctet === 211) {
    return "JAPAN_AUTO";
  }
  
  // Korea common ranges
  if (firstOctet === 175 || firstOctet === 218 || 
      firstOctet === 121 || firstOctet === 211) {
    return "KOREA_AUTO";
  }
  
  return "OTHER";
}

// ============================================================
// 8. SMART PROXY SELECTION
// ============================================================
function selectProxyByRegion(region, trafficType) {
  // Match traffic: أولوية قصوى للسرعة
  if (trafficType === "match") {
    if (region === "JAPAN" || region === "JAPAN_AUTO") {
      return JAPAN_PRIMARY;
    }
    if (region === "KOREA" || region === "KOREA_AUTO") {
      return KOREA_PRIMARY;
    }
    if (region === "ASIA_BACKUP") {
      return ASIA_FALLBACK;
    }
  }
  
  // Lobby/Matchmaking: جرب اليابان أولاً ثم كوريا
  if (trafficType === "lobby" || trafficType === "matchmaking") {
    return JAPAN_PRIMARY + "; " + KOREA_PRIMARY + "; " + ASIA_FALLBACK;
  }
  
  // Default: اليابان
  return JAPAN_PRIMARY + "; " + KOREA_PRIMARY;
}

// ============================================================
// 9. LATENCY OPTIMIZATION
// ============================================================
var CONNECTION_STATS = {
  japanSuccess: 0,
  koreaSuccess: 0,
  asiaSuccess: 0,
  lastUpdate: Date.now()
};

function updateStats(region, success) {
  if (success) {
    if (region === "JAPAN" || region === "JAPAN_AUTO") {
      CONNECTION_STATS.japanSuccess++;
    } else if (region === "KOREA" || region === "KOREA_AUTO") {
      CONNECTION_STATS.koreaSuccess++;
    } else {
      CONNECTION_STATS.asiaSuccess++;
    }
  }
}

function getBestProxy() {
  var stats = CONNECTION_STATS;
  
  // اختر الأفضل أداءً
  if (stats.japanSuccess >= stats.koreaSuccess) {
    return JAPAN_PRIMARY;
  } else {
    return KOREA_PRIMARY;
  }
}

// ============================================================
// 10. MAIN PROXY FUNCTION
// ============================================================
function FindProxyForURL(url, host) {
  host = normalizeHost(host);
  
  // ===== STEP 1: System bypass =====
  if (containsAny(host, SAFE_DIRECT)) return "DIRECT";
  if (containsAny(host, CDN_DIRECT)) return "DIRECT";
  
  // ===== STEP 2: Resolve IP =====
  var ip = getIP(host);
  
  // ===== STEP 3: Private IPs =====
  if (ip && isPrivateOrLocalIP(ip)) return "DIRECT";
  
  // ===== STEP 4: Non-PUBG =====
  if (!isPUBG(host)) return "DIRECT";
  
  // ===== STEP 5: DNS failure =====
  if (!ip) {
    // حتى لو فشل DNS، جرب اليابان
    return JAPAN_PRIMARY + "; " + KOREA_PRIMARY;
  }
  
  // ===== STEP 6: Detect region =====
  var region = getServerRegion(ip);
  
  // ===== STEP 7: Traffic classification =====
  var trafficType = "default";
  if (isMatchTraffic(url, host)) {
    trafficType = "match";
  } else if (isMatchmakingTraffic(url, host)) {
    trafficType = "matchmaking";
  } else if (isLobbyTraffic(url, host)) {
    trafficType = "lobby";
  }
  
  // ===== STEP 8: Select proxy =====
  var proxy = selectProxyByRegion(region, trafficType);
  
  // ===== STEP 9: Update stats =====
  updateStats(region, true);
  
  // ===== STEP 10: Log (optional) =====
  if (typeof console !== "undefined") {
    console.log("[ASIA-EAST] " + host + " → " + ip + " → " + region + " → " + trafficType);
  }
  
  return proxy;
}

// ============================================================
// 11. INITIALIZATION
// ============================================================
if (typeof console !== "undefined") {
  console.log("╔════════════════════════════════════════════╗");
  console.log("║  PUBG Asia East Router (JP/KR)            ║");
  console.log("║  Priority: Japan → Korea → Singapore      ║");
  console.log("║  Status: Active                           ║");
  console.log("╚════════════════════════════════════════════╝");
  console.log("");
  console.log("⚠️  IMPORTANT: Update proxy IPs at lines 17-35");
  console.log("📝 Free proxies: https://www.proxynova.com");
  console.log("💰 Paid proxies: Bright Data, Smartproxy");
}
