// =====================================================
// JoMe1_JO_ALL_STRICT_V4_HYPER_RECRUIT.pac
// =====================================================
// 🎯 ULTRA AGGRESSIVE JORDAN RECRUITMENT V4 (2026)
// - أردن 100% فقط (محدث 2026)
// - توسيع mega لـ IPs الأردنية (Zain/Orange/Umniah)
// - فلترة مشددة + حظر دولي
// =====================================================

// ============================================================
// 1. PROXY CONFIGURATION (أضف proxies أردنية إضافية إذا عندك)
// ============================================================
var LOBBY_PROXY_CHAIN = "PROXY 176.29.153.95:9030; PROXY 212.35.66.45:9030; PROXY 176.29.153.95:9030";
var MATCH_PROXY = "PROXY 176.29.153.95:20001";
var BLOCK = "PROXY 127.0.0.1:9";

// ============================================================
// 2. SYSTEM WHITELIST
// ============================================================
var SAFE_DIRECT = [
  "captive.apple.com","time.apple.com","ocsp.apple.com",
  "clients3.google.com","connectivitycheck.gstatic.com"
];

var CDN_DIRECT = [
  "googlevideo.com","ytimg.com"
];

// ============================================================
// 3. JORDAN IP MEGA POOL (محدث 2026)
// ============================================================

// ===== TIER 1: Core Match IPs (محدود جداً للماتشات) =====
var JO_MATCH_ONLY = {
  "176.29.":1,     // Zain Jordan (شائع جداً)
  "212.34.":1,     // Orange Jordan
  "213.139.":1,    // Orange Jordan
  "46.32.":1,      // Zain Broadband
  "92.241.":1,     // Umniah
  "212.35.":1      // Umniah/Batelco
};

// ===== TIER 2: MEGA RECRUIT POOL (للوبي والتجنيد - توسيع كبير) =====
var JO_RECRUIT_MEGA = {
  // Orange Jordan
  "212.34.":1,
  "213.139.":1,

  // Zain Jordan (أكبر تغطية)
  "46.32.":1,
  "176.28.":1,
  "176.29.":1,
  "77.245.":1,
  "94.142.":1,
  "188.247.":1,

  // Umniah / Batelco
  "5.45.":1,
  "46.248.":1,
  "92.241.":1,
  "95.172.":1,
  "109.107.":1,
  "212.35.":1,

  // إضافات أخرى أردنية شائعة
  "37.123.":1,
  "185.107.":1,
  "213.6.":1,
  "195.188.":1
};

// WILDCARD = نفس MEGA للدقة
var JO_WILDCARD_PREFIXES = JO_RECRUIT_MEGA;

// ============================================================
// 4. AGGRESSIVE NON-JORDAN BLOCKING (محدث)
// ============================================================
var BLOCKED_COUNTRIES = {
  // الصين
  "43.":1,"58.":1,"111.":1,"112.":1,"113.":1,"114.":1,"115.":1,"116.":1,"117.":1,"118.":1,"119.":1,"120.":1,"121.":1,"122.":1,"123.":1,"124.":1,"125.":1,
  // الهند
  "14.":1,"27.":1,"103.":1,"106.":1,"117.":1,
  // جنوب شرق آسيا
  "1.":1,"101.":1,"171.":1,"175.":1,
  // أوروبا
  "2.":1,"5.":1,"31.":1,"78.":1,"79.":1,"80.":1,"81.":1,
  // أمريكا
  "8.":1,"12.":1,"23.":1,"64.":1,"65.":1,"66.":1,"67.":1,"68.":1,"69.":1,"70.":1,"71.":1,"72.":1,"73.":1,"74.":1,
  // خليج
  "5.62.":1,"94.56.":1,"212.26.":1,"46.34.":1,"80.184.":1
};

// ============================================================
// 5-8. الدوال الأساسية (نفسها مع تحسين isJordanIP)
// ============================================================
function normalizeHost(h) { var i = h.indexOf(":"); return (i !== -1) ? h.substring(0, i) : h; }
function isIPv4(ip) { return ip && /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip); }
function getIP(host) { try { var ip = dnsResolve(host); return (ip && isIPv4(ip)) ? ip : null; } catch(e) { return null; } }
function startsWithAny(ip, table) { if (!ip) return false; for (var prefix in table) { if (ip.indexOf(prefix) === 0) return true; } return false; }
function startsWithList(ip, list) { if (!ip) return false; for (var i = 0; i < list.length; i++) { if (ip.indexOf(list[i]) === 0) return true; } return false; }
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
function containsAny(s, list) { if (!s) return false; s = s.toLowerCase(); for (var i = 0; i < list.length; i++) { if (s.indexOf(list[i]) !== -1) return true; } return false; }

function isPUBG(host) {
  if (!host) return false;
  host = host.toLowerCase();
  var keywords = ["pubg","pubgm","pubgmobile","intlgame","igame","tencent","qcloud","krafton","lightspeed","amsoveasea","wow","ugc"];
  for (var i = 0; i < keywords.length; i++) { if (host.indexOf(keywords[i]) !== -1) return true; }
  return false;
}

function isLobbyTraffic(url, host) {
  var s = (url + " " + host).toLowerCase();
  return /(lobby|matchmaking|matching|queue|room|recruit|team|squad|party|invite|friend|social|chat|voice|gate|dispatcher|region|allocation|presence|heartbeat|login|auth|store|shop|season|rank|mission|event)/x.test(s);
}

function isRecruitTraffic(url, host) {
  var s = (url + " " + host).toLowerCase();
  return /(recruit|team|squad|party|invite|friend|social|chat|message|looking|lfg|join|request)/x.test(s);
}

function isWOWTraffic(url, host) {
  var s = (url + " " + host).toLowerCase();
  return /(worldofwonder|wow|ugc|creative|creation|map|community|workshop)/x.test(s);
}

function isMatchTraffic(url, host) {
  var s = (url + " " + host).toLowerCase();
  return /(game|battle|match|gs\.|gameserver|session|zone|shard|realtime|sync)/x.test(s);
}

function isJordanIP(ip) {
  if (!ip) return false;
  
  if (startsWithAny(ip, JO_RECRUIT_MEGA)) return true;
  
  var parts = ip.split(".");
  if (parts.length !== 4) return false;
  var a = parseInt(parts[0]), b = parseInt(parts[1]);
  
  // Zain: 176.28-29, 46.32, 77.245, 94.142, 188.247
  if (a === 176 && (b === 28 || b === 29)) return true;
  if (a === 46 && b === 32) return true;
  if (a === 77 && b === 245) return true;
  if (a === 94 && b === 142) return true;
  if (a === 188 && b === 247) return true;
  
  // Orange: 212.34, 213.139
  if (a === 212 && b === 34) return true;
  if (a === 213 && b === 139) return true;
  
  // Umniah/Batelco: 5.45, 46.248, 92.241, 95.172, 109.107, 212.35
  if (a === 5 && b === 45) return true;
  if (a === 46 && b === 248) return true;
  if (a === 92 && b === 241) return true;
  if (a === 95 && b === 172) return true;
  if (a === 109 && b === 107) return true;
  if (a === 212 && b === 35) return true;
  
  return false;
}

function isBlockedCountry(ip) {
  if (!ip) return false;
  if (startsWithAny(ip, BLOCKED_COUNTRIES)) {
    if (isJordanIP(ip)) return false;
    return true;
  }
  return false;
}

function allowLobby(ip) { return ip && isJordanIP(ip) && !isBlockedCountry(ip); }
function allowMatch(ip) { return ip && startsWithAny(ip, JO_MATCH_ONLY); }

// ============================================================
// 9. MAIN FUNCTION
// ============================================================
function FindProxyForURL(url, host) {
  host = normalizeHost(host);
  
  if (containsAny(host, SAFE_DIRECT) || containsAny(host, CDN_DIRECT)) return "DIRECT";
  
  var ip = getIP(host);
  if (ip && isPrivateOrLocalIP(ip)) return "DIRECT";
  if (!isPUBG(host)) return "DIRECT";
  if (!ip) return BLOCK;
  
  if (isBlockedCountry(ip)) return BLOCK;
  
  var isLobby = isLobbyTraffic(url, host);
  var isRecruit = isRecruitTraffic(url, host);
  var isWOW = isWOWTraffic(url, host);
  var isMatch = isMatchTraffic(url, host);
  
  if (isLobby || isRecruit || isWOW) {
    return allowLobby(ip) ? LOBBY_PROXY_CHAIN : BLOCK;
  }
  
  if (isMatch) {
    return allowMatch(ip) ? MATCH_PROXY : BLOCK;
  }
  
  return allowMatch(ip) ? MATCH_PROXY : BLOCK;
}
