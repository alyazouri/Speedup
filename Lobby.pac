// =====================================================
// JoMe1_JO_PS_ALL_STRICT_V8_ENHANCED_PS.pac
// =====================================================
// 🎯 100% JORDAN + PALESTINE (Enhanced PS 2026)
// - Lobby/Recruit/WOW: أردن + فلسطين (PALTEL/Jawwal/Hadara/Ooredoo)
// - Match: أردن fiber/business فقط
// - نطاقات فلسطينية أكثر (AS12975 + Ooredoo)
// =====================================================

// ============================================================
// 1. PROXY CONFIG
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
// 3. JORDAN IP POOL (من V7)
// ============================================================
var JO_MATCH_ONLY = {
  "176.29.":1, "212.34.":1, "213.139.":1, "46.32.":1, "92.241.":1, "212.35.":1, "213.13.":1
};

var JO_RECRUIT_ULTRA = {
  "176.28.":1, "176.29.":1, "46.32.":1, "77.245.":1, "94.142.":1, "188.247.":1,
  "212.34.":1, "213.139.":1, "82.212.":1, "213.13.":1, "80.90.":1,
  "5.45.":1, "46.248.":1, "92.241.":1, "95.172.":1, "109.107.":1, "212.35.":1,
  "85.159.":1, "91.186.":1, "212.118.":1, "46.185.":1, "86.108.":1, "92.253.":1,
  "94.249.":1, "149.200.":1, "37.202.":1, "37.123.":1, "79.173.":1, "178.238.":1,
  "193.188.":1, "217.23.":1, "82.205.":1
};

// ============================================================
// 3.1 PALESTINE IP POOL - ENHANCED (PALTEL/Jawwal/Hadara/Ooredoo 2026)
// ============================================================
var PS_RECRUIT_ULTRA = {
  "213.6.":1,     // PALTEL / Jawwal main
  "77.91.":1,     // PALTEL
  "188.161.":1,   // PALTEL
  "82.213.":1,    // PALTEL
  "83.244.":1,    // PALTEL
  "5.11.":1,      // PALTEL
  "37.8.":1,      // PALTEL
  "82.205.":1,    // PALTEL
  "82.102.":1,    // PALTEL
  "45.147.":1,    // Jawwal mobile
  "95.130.":1,    // Ooredoo Palestine
  "213.244.":1,   // Jawwal APN / proxy ranges (شائع في mobile)
  "194.165.":1,   // Hadara / PALTEL additional
  "217.66.":1     // PALTEL additional subnets
};

// ============================================================
// 4. ULTRA BLOCK NON-JO/PS
// ============================================================
var BLOCKED_COUNTRIES = {
  "1.":1,"2.":1,"3.":1,"4.":1,"5.":1,"6.":1,"7.":1,"8.":1,"9.":1,"10.":1,
  "11.":1,"12.":1,"13.":1,"14.":1,"15.":1,"16.":1,"17.":1,"18.":1,"19.":1,"20.":1,
  "21.":1,"22.":1,"23.":1,"24.":1,"25.":1,"26.":1,"27.":1,"28.":1,"29.":1,"30.":1,
  "43.":1,"58.":1,"59.":1,"60.":1,"61.":1,"101.":1,"103.":1,"106.":1,"111.":1,"112.":1,
  "113.":1,"114.":1,"115.":1,"116.":1,"117.":1,"118.":1,"119.":1,"120.":1,"121.":1,"122.":1,
  "123.":1,"124.":1,"125.":1,"171.":1,"175.":1,
  "64.":1,"65.":1,"66.":1,"67.":1,"68.":1,"69.":1,"70.":1,"71.":1,"72.":1,"73.":1,"74.":1,
  "31.":1,"78.":1,"79.":1,"80.":1,"81.":1
};

// ============================================================
// 5. HELPER FUNCTIONS (انسخ من النسخة السابقة)
// ============================================================
// normalizeHost, isIPv4, getIP, startsWithAny, isPrivateOrLocalIP, containsAny, isPUBG,
// isLobbyTraffic, isRecruitTraffic, isWOWTraffic, isMatchTraffic (نفسها بدون تغيير)

// ============================================================
// 6. JORDAN + PALESTINE VALIDATION - ENHANCED PS
// ============================================================
function isJordanOrPalestineIP(ip) {
  if (!ip || !isIPv4(ip)) return false;
  
  // Prefix match أولوية (أردن + فلسطين المحدث)
  if (startsWithAny(ip, JO_RECRUIT_ULTRA) || startsWithAny(ip, PS_RECRUIT_ULTRA)) return true;
  
  var parts = ip.split(".");
  if (parts.length !== 4) return false;
  var a = parseInt(parts[0]), b = parseInt(parts[1]);
  
  // Jordan ranges (من V7)
  if (a === 176 && (b === 28 || b === 29)) return true;
  if (a === 46 && (b === 32 || b === 248 || b === 185)) return true;
  if (a === 77 && b === 245) return true;
  if (a === 94 && (b === 142 || b === 249)) return true;
  if (a === 188 && (b === 247 || b === 161)) return true;
  if (a === 212 && (b === 34 || b === 35 || b === 118)) return true;
  if (a === 213 && (b === 139 || b === 13)) return true;
  if (a === 82 && (b === 212 || b === 213 || b === 205)) return true;
  if (a === 5 && (b === 45 || b === 11)) return true;
  if (a === 92 && (b === 241 || b === 253)) return true;
  if (a === 95 && b === 172) return true;
  if (a === 109 && b === 107) return true;
  if (a === 85 && b === 159) return true;
  if (a === 86 && b === 108) return true;
  if (a === 149 && b === 200) return true;
  if (a === 37 && (b === 202 || b === 123)) return true;
  if (a === 80 && b === 90) return true;
  if (a === 79 && b === 173) return true;
  if (a === 178 && b === 238) return true;
  
  // Palestine enhanced ranges (PALTEL/Jawwal/Ooredoo)
  if (a === 213 && (b === 6 || b === 244)) return true;
  if (a === 77 && (b === 91)) return true;
  if (a === 188 && b === 161) return true;
  if (a === 82 && (b === 213 || b === 205 || b === 102)) return true;
  if (a === 83 && b === 244) return true;
  if (a === 5 && b === 11) return true;
  if (a === 37 && b === 8) return true;
  if (a === 45 && b === 147) return true;
  if (a === 95 && b === 130) return true;
  if (a === 194 && b === 165) return true;  // Hadara additional
  if (a === 217 && b === 66) return true;   // PALTEL subnets
  
  return false;
}

function isBlockedCountry(ip) {
  if (startsWithAny(ip, BLOCKED_COUNTRIES)) {
    return !isJordanOrPalestineIP(ip);
  }
  return false;
}

function allowLobby(ip) { return isJordanOrPalestineIP(ip) && !isBlockedCountry(ip); }
function allowMatch(ip) { return startsWithAny(ip, JO_MATCH_ONLY) && isJordanOrPalestineIP(ip); }

// ============================================================
// 7. MAIN FUNCTION
// ============================================================
function FindProxyForURL(url, host) {
  host = normalizeHost(host);
  
  if (containsAny(host, SAFE_DIRECT) || containsAny(host, CDN_DIRECT)) return "DIRECT";
  
  var ip = getIP(host);
  if (ip && isPrivateOrLocalIP(ip)) return "DIRECT";
  if (!isPUBG(host)) return "DIRECT";
  if (!ip) return BLOCK;
  
  if (!isJordanOrPalestineIP(ip) || isBlockedCountry(ip)) return BLOCK;
  
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
