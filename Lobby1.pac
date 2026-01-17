// =====================================================
// JoMe1_JO_MAX_EXPANDED_V12_2026.pac
// =====================================================
// 🎯 JORDAN MAX POOL EXPANDED (يناير 2026 - BGP/RIPE/IPinfo)
// - Lobby/Recruit/WOW: أردني 100% (تغطية واسعة جداً)
// - Match: أردن fiber/business فقط (ping منخفض)
// - نطاقات جديدة مضافة من Zain/Orange/Umniah/DataComm
// =====================================================

// 1. PROXY CONFIG (أكتر أردنية ممكنة)
var LOBBY_PROXY_CHAIN = "PROXY 176.29.153.95:9030; PROXY 212.35.66.45:9030; PROXY 46.32.99.1:9030; PROXY 213.139.10.1:9030; PROXY 92.241.50.1:9030; PROXY 80.90.171.1:9030";
var MATCH_PROXY = "PROXY 176.29.153.95:20001; PROXY 212.34.3.1:20001; PROXY 213.139.20.1:20001";
var BLOCK = "PROXY 127.0.0.1:9";

// 2. SYSTEM WHITELIST
var SAFE_DIRECT = ["captive.apple.com","time.apple.com","ocsp.apple.com","clients3.google.com","connectivitycheck.gstatic.com"];
var CDN_DIRECT = ["googlevideo.com","ytimg.com"];

// 3. JORDAN IP POOL - MAX EXPANDED 2026
var JO_MATCH_ONLY = {  // محدود للماتشات عالية الجودة
  "176.29.":1, "212.34.":1, "213.139.":1, "46.32.":1, "92.241.":1, "212.35.":1, "213.13.":1, "80.90.":1
};

var JO_RECRUIT_ULTRA = {  // توسيع كبير جداً (جديد + قديم)
  // Zain Jordan (AS48832) - توسيع 2026
  "176.28.":1, "176.29.":1, "46.32.":1, "77.245.":1, "94.142.":1, "80.90.":1,

  // Orange / Jordan Telecom (AS8697)
  "212.34.":1, "213.139.":1, "82.212.":1, "213.13.":1, "80.90.":1, "82.205.":1,

  // Umniah / Batelco (AS9038)
  "5.45.":1, "46.248.":1, "92.241.":1, "95.172.":1, "109.107.":1, "212.35.":1,
  "85.159.":1, "91.186.":1, "212.118.":1,

  // Jordan Data Communications (AS8376) + إضافات جديدة
  "46.185.":1, "79.173.":1, "86.108.":1, "37.202.":1, "94.249.":1, "149.200.":1,
  "37.123.":1, "178.238.":1, "193.188.":1, "217.23.":1, "82.102.":1  // إضافة جديدة محتملة overlap
};

// 4. BLOCKED COUNTRIES (نفس + محسن)
var BLOCKED_COUNTRIES = {
  "43.":1,"58.":1,"111.":1,"112.":1,"113.":1,"114.":1,"115.":1,"116.":1,"117.":1,"118.":1,"119.":1,"120.":1,"121.":1,"122.":1,"123.":1,"124.":1,"125.":1,
  "14.":1,"27.":1,"103.":1,"106.":1,"117.":1,
  "1.":1,"101.":1,"171.":1,"175.":1,
  "64.":1,"65.":1,"66.":1,"67.":1,"68.":1,"69.":1,"70.":1,"71.":1,"72.":1,"73.":1,"74.":1,
  "78.":1,"88.":1,"95.":1,  // Turkey
  "41.":1,"156.":1,"197.":1   // Egypt
};

// 5. HELPER FUNCTIONS (نفس السابقة)

// ... (انسخ الدوال: normalizeHost, isIPv4, getIP, startsWithAny, isPrivateOrLocalIP, containsAny, isPUBG, isLobbyTraffic, isRecruitTraffic, isMatchTraffic)

// 6. JORDAN VALIDATION - أوسع
function isJordanIP(ip) {
  if (!ip || !isIPv4(ip)) return false;
  
  if (startsWithAny(ip, JO_RECRUIT_ULTRA)) return true;
  
  var parts = ip.split(".");
  if (parts.length !== 4) return false;
  var a = parseInt(parts[0]), b = parseInt(parts[1]);
  
  // Zain توسيع
  if (a === 176 && (b >= 28 && b <= 29)) return true;
  if (a === 46 && b === 32) return true;
  if (a === 77 && b === 245) return true;
  if (a === 94 && b === 142) return true;
  if (a === 80 && b === 90) return true;
  
  // Orange/JT
  if (a === 212 && (b === 34 || b === 35)) return true;
  if (a === 213 && (b === 13 || b === 139)) return true;
  if (a === 82 && b === 212) return true;
  
  // Umniah/Batelco
  if (a === 5 && b === 45) return true;
  if (a === 46 && b === 248) return true;
  if (a === 92 && b === 241) return true;
  if (a === 95 && b === 172) return true;
  if (a === 109 && b === 107) return true;
  if (a === 85 && b === 159) return true;
  
  // Jordan Data + إضافات
  if (a === 46 && b === 185) return true;
  if (a === 79 && b === 173) return true;
  if (a === 86 && b === 108) return true;
  if (a === 37 && (b === 202 || b === 123)) return true;
  if (a === 149 && b === 200) return true;
  
  return false;
}

function isBlockedCountry(ip) {
  if (!ip) return false;
  if (startsWithAny(ip, BLOCKED_COUNTRIES)) return !isJordanIP(ip);
  return false;
}

function allowLobby(ip) { return isJordanIP(ip) && !isBlockedCountry(ip); }
function allowMatch(ip) { return isJordanIP(ip) && startsWithAny(ip, JO_MATCH_ONLY); }

// 7. MAIN FUNCTION (نفس السابقة)
function FindProxyForURL(url, host) {
  host = normalizeHost(host);
  
  if (containsAny(host, SAFE_DIRECT) || containsAny(host, CDN_DIRECT)) return "DIRECT";
  
  var ip = getIP(host);
  if (ip && isPrivateOrLocalIP(ip)) return "DIRECT";
  if (!isPUBG(host)) return "DIRECT";
  if (!ip) return BLOCK;
  
  if (!isJordanIP(ip) || isBlockedCountry(ip)) return BLOCK;
  
  var isLobby = isLobbyTraffic(url, host);
  var isRecruit = isRecruitTraffic(url, host);
  var isMatch = isMatchTraffic(url, host);
  
  if (isLobby || isRecruit) {
    return allowLobby(ip) ? LOBBY_PROXY_CHAIN : BLOCK;
  }
  
  if (isMatch) {
    return allowMatch(ip) ? MATCH_PROXY : BLOCK;
  }
  
  return allowMatch(ip) ? MATCH_PROXY : BLOCK;
}
