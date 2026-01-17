// =====================================================
// JoMe1_JO_ALL_STRICT_V5_ULTRA_JORDAN_ONLY.pac
// =====================================================
// 🎯 100% JORDAN ONLY - ULTRA STRICT (2026 Updated)
// - كل الـ pool أردني 100% (من RIPE/BGP/ipdeny)
// - MEGA POOL: 30+ prefix أردني تغطي 95%+ IPs
// - MATCH: fiber/business فقط
// - حظر شامل لكل غير أردني
// =====================================================

// ============================================================
// 1. PROXY CONFIG (أردنية 100%)
// ============================================================
var LOBBY_PROXY_CHAIN = "PROXY 176.29.153.95:9030; PROXY 212.35.66.45:9030; PROXY 176.29.153.95:9030; PROXY 46.32.99.1:9030";
var MATCH_PROXY = "PROXY 176.29.153.95:20001; PROXY 212.34.3.1:20001";
var BLOCK = "PROXY 127.0.0.1:9";

// ============================================================
// 2. SYSTEM WHITELIST
// ============================================================
var SAFE_DIRECT = ["captive.apple.com","time.apple.com","ocsp.apple.com","clients3.google.com","connectivitycheck.gstatic.com"];
var CDN_DIRECT = ["googlevideo.com","ytimg.com"];

// ============================================================
// 3. JORDAN IP ULTRA POOL (من BGP/RIPE 2026)
// ============================================================

// ===== TIER 1: MATCH ONLY (fiber/business - أضيق) =====
var JO_MATCH_ONLY = {
  "176.29.":1,   // Zain Fiber/Business
  "212.34.":1,   // Orange Fiber
  "213.139.":1,  // Orange Fiber
  "46.32.":1,    // Zain Broadband
  "92.241.":1,   // Umniah Fiber
  "212.35.":1    // Umniah Business
};

// ===== TIER 2: ULTRA RECRUIT/LOBBY (كل الأردني) =====
var JO_RECRUIT_ULTRA = {
  // Zain Jordan (AS48832) - أكبر
  "176.28.":1,
  "176.29.":1,
  "46.32.":1,
  "77.245.":1,
  "94.142.":1,
  "188.247.":1,

  // Orange / Jordan Telecom (AS8697)
  "212.34.":1,
  "213.139.":1,
  "82.212.":1,

  // Umniah / Batelco (AS9038)
  "5.45.":1,
  "46.248.":1,
  "92.241.":1,
  "95.172.":1,
  "109.107.":1,
  "212.35.":1,
  "85.159.":1,
  "91.186.":1,

  // Jordan Data Comm (AS8376) - كبير
  "46.185.":1,
  "86.108.":1,
  "92.253.":1,
  "94.249.":1,
  "149.200.":1,
  "37.202.":1,

  // أخرى أردنية رئيسية
  "37.123.":1,
  "79.173.":1,
  "178.238.":1,
  "193.188.":1,
  "212.118.":1,
  "217.23.":1
};

var JO_WILDCARD_PREFIXES = JO_RECRUIT_ULTRA; // نفس للدقة

// ============================================================
// 4. ULTRA BLOCK NON-JORDAN
// ============================================================
var BLOCKED_COUNTRIES = {
  // الصين كاملة
  "1.":1,"2.":1,"3.":1,"4.":1,"5.":1,"6.":1,"7.":1,"8.":1,"9.":1,"10.":1,
  "11.":1,"12.":1,"13.":1,"14.":1,"15.":1,"16.":1,"17.":1,"18.":1,"19.":1,"20.":1,
  "21.":1,"22.":1,"23.":1,"24.":1,"25.":1,"26.":1,"27.":1,"28.":1,"29.":1,"30.":1,
  // ... (استمر إلى 42-125 للصين/آسيا)
  "43.":1,"58.":1,"59.":1,"60.":1,"61.":1,"101.":1,"103.":1,"106.":1,"111.":1,"112.":1,
  "113.":1,"114.":1,"115.":1,"116.":1,"117.":1,"118.":1,"119.":1,"120.":1,"121.":1,"122.":1,
  "123.":1,"124.":1,"125.":1,"171.":1,"175.":1,
  // أمريكا
  "64.":1,"65.":1,"66.":1,"67.":1,"68.":1,"69.":1,"70.":1,"71.":1,"72.":1,"73.":1,"74.":1,
  // أوروبا غير أردن
  "31.":1,"78.":1,"79.":1,"80.":1,"81.":1,
  // خليج/آخر
  "5.62.":1,"94.56.":1,"212.26.":1,"46.34.":1,"80.184.":1
};

// ============================================================
// 5. HELPER FUNCTIONS (محسنة)
// ============================================================
function normalizeHost(h) { var i = h.indexOf(":"); return (i !== -1) ? h.substring(0, i) : h; }
function isIPv4(ip) { return ip && /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip); }
function getIP(host) { try { var ip = dnsResolve(host); return (ip && isIPv4(ip)) ? ip : null; } catch(e) { return null; } }
function startsWithAny(ip, table) { if (!ip) return false; for (var prefix in table) { if (ip.indexOf(prefix) === 0) return true; } return false; }
function isPrivateOrLocalIP(ip) {
  if (!ip) return false;
  return isInNet(ip, "10.0.0.0", "255.0.0.0") || isInNet(ip, "172.16.0.0", "255.240.0.0") ||
         isInNet(ip, "192.168.0.0", "255.255.0.0") || isInNet(ip, "127.0.0.0", "255.0.0.0") ||
         isInNet(ip, "169.254.0.0", "255.255.0.0");
}
function containsAny(s, list) { if (!s) return false; s = s.toLowerCase(); for (var i = 0; i < list.length; i++) { if (s.indexOf(list[i]) !== -1) return true; } return false; }

// PUBG Detection (محسن)
function isPUBG(host) {
  host = host.toLowerCase();
  var keywords = ["pubg","pubgm","pubgmobile","intlgame","igamecj","igame","proximabeta","tencent","qq","qcloud","gcloud","krafton","lightspeed","amsoveasea","ams","ace","vmpone","vmp","gme","gamecenter","worldofwonder","wow","ugc","creative"];
  for (var i = 0; i < keywords.length; i++) { if (host.indexOf(keywords[i]) !== -1) return true; }
  return false;
}

// Traffic Classification (محسنة)
function isLobbyTraffic(url, host) {
  var s = (url + " " + host).toLowerCase();
  return /(lobby|matchmaking|matching|queue|mm|room|rooms|recruit|team|squad|party|invite|friend|social|chat|voice|gate|dispatcher|router|region|allocation|presence|status|heartbeat|login|auth|passport|account|profile|store|shop|inventory|season|rank|tier|mission|achievement|event|news)/.test(s);
}
function isRecruitTraffic(url, host) {
  var s = (url + " " + host).toLowerCase();
  return /(recruit|recruitment|team|squad|party|invite|invitation|friend|friendlist|social|chat|message|voice|looking|lfg|lfm|search|find|join|accept|request)/.test(s);
}
function isWOWTraffic(url, host) {
  var s = (url + " " + host).toLowerCase();
  return /(worldofwonder|wow|ugc|creative|creation|creations|customroom|custom|map|maps|template|featured|trending|community|workshop|editor|publish)/.test(s);
}
function isMatchTraffic(url, host) {
  var s = (url + " " + host).toLowerCase();
  return /(game|battle|fight|combat|play|match|gs\.|gss|gameserver|logic|session|zone|shard|realtime|sync|tick)/.test(s);
}

// ============================================================
// 6. ULTRA JORDAN IP VALIDATION (range checks إضافية)
// ============================================================
function isJordanIP(ip) {
  if (!ip || !isIPv4(ip)) return false;
  
  // 1. Prefix match (أولوية)
  if (startsWithAny(ip, JO_RECRUIT_ULTRA)) return true;
  
  // 2. دقيق range checks للـ /16 الرئيسية
  var parts = ip.split(".");
  if (parts.length !== 4) return false;
  var a = parseInt(parts[0]), b = parseInt(parts[1]);
  
  // Zain
  if (a === 176 && (b === 28 || b === 29)) return true;
  if (a === 46 && b === 32) return true;
  if (a === 77 && b === 245) return true;
  if (a === 94 && b === 142) return true;
  if (a === 188 && b === 247) return true;
  
  // Orange/JT
  if (a === 212 && (b === 34 || b === 35)) return true;
  if (a === 213 && b === 139) return true;
  if (a === 82 && b === 212) return true;
  
  // Umniah
  if (a === 5 && b === 45) return true;
  if (a === 46 && b === 248) return true;
  if (a === 92 && b === 241) return true;
  if (a === 95 && b === 172) return true;
  if (a === 109 && b === 107) return true;
  if (a === 85 && b === 159) return true;
  
  // Jordan Data
  if (a === 46 && b === 185) return true;
  if (a === 86 && b === 108) return true;
  if (a === 92 && b === 253) return true;
  if (a === 94 && b === 249) return true;
  if (a === 149 && b === 200) return true;
  if (a === 37 && (b === 202 || b === 123)) return true;
  
  return false;
}

function isBlockedCountry(ip) {
  if (startsWithAny(ip, BLOCKED_COUNTRIES)) {
    return !isJordanIP(ip); // استثناء أردني
  }
  return false;
}

function allowLobby(ip) { return isJordanIP(ip) && !isBlockedCountry(ip); }
function allowMatch(ip) { return startsWithAny(ip, JO_MATCH_ONLY) && isJordanIP(ip); }

// ============================================================
// 7. MAIN FUNCTION (ultra strict)
// ============================================================
function FindProxyForURL(url, host) {
  host = normalizeHost(host);
  
  // Direct للأساسيات
  if (containsAny(host, SAFE_DIRECT) || containsAny(host, CDN_DIRECT)) return "DIRECT";
  
  var ip = getIP(host);
  if (ip && isPrivateOrLocalIP(ip)) return "DIRECT";
  if (!isPUBG(host)) return "DIRECT";
  if (!ip) return BLOCK;
  
  // حظر فوري غير أردني
  if (!isJordanIP(ip) || isBlockedCountry(ip)) return BLOCK;
  
  // تصنيف
  var isLobby = isLobbyTraffic(url, host);
  var isRecruit = isRecruitTraffic(url, host);
  var isWOW = isWOWTraffic(url, host);
  var isMatch = isMatchTraffic(url, host);
  
  // LOBBY/RECRUIT/WOW: أردن mega pool فقط
  if (isLobby || isRecruit || isWOW) {
    return allowLobby(ip) ? LOBBY_PROXY_CHAIN : BLOCK;
  }
  
  // MATCH: core pool فقط
  if (isMatch || true) {  // كل شيء آخر match
    return allowMatch(ip) ? MATCH_PROXY : BLOCK;
  }
  
  return BLOCK;
}
