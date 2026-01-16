// =====================================================
// JoMe1_LOW_PING_ULTRA_V6.pac - PART 1
// =====================================================
// 🎯 ULTRA LOW PING - JORDAN ONLY
// - تحسينات خاصة لتقليل البينج
// - اختيار ذكي لأقرب Proxy
// - تقليل Hops والـ Chain
// - فلترة فائقة السرعة
// =====================================================

// ============================================================
// 1. ULTRA-FAST PROXY CONFIG (بينج أقل)
// ============================================================

// MATCH: Direct to fastest (NO CHAIN)
var MATCH_DIRECT = “PROXY 176.29.153.95:20001”;

// LOBBY: Minimal chain (2 max)
var LOBBY_FAST = “PROXY 176.29.153.95:9030; PROXY 212.35.66.45:9030”;

// BLOCK
var BLOCK = “PROXY 127.0.0.1:9”;

// ============================================================
// 2. JORDAN IP DATABASE (محسّن للسرعة)
// ============================================================

// TIER-S: أفضل IPs (بينج 10-15ms)
var JO_ULTRA = {
“176.29.153.”:1,
“176.29.154.”:1,
“212.35.66.”:1,
“212.35.67.”:1,
“82.212.100.”:1,
“94.249.50.”:1
};

// TIER-A: Premium (بينج 15-25ms)
var JO_PREMIUM = {
“176.29.”:1,
“176.30.”:1,
“82.212.”:1,
“212.34.”:1,
“212.35.”:1,
“212.36.”:1,
“94.249.”:1,
“94.250.”:1
};

// TIER-B: Standard (بينج 25-40ms)
var JO_STANDARD = {
// Orange
“46.32.”:1, “46.33.”:1, “95.87.”:1, “95.88.”:1,
“37.48.”:1, “188.161.”:1, “176.241.”:1,

// Zain
“188.247.”:1, “188.248.”:1, “91.144.”:1, “91.145.”:1,
“195.229.”:1, “31.186.”:1, “109.224.”:1,

// Umniah
“46.185.”:1, “46.186.”:1, “85.159.”:1, “85.160.”:1,
“178.18.”:1, “5.11.”:1, “193.188.”:1,

// Batelco
“37.8.”:1, “37.9.”:1, “83.244.”:1, “91.185.”:1, “195.106.”:1
};

// TIER-C: Extended (بينج 40-60ms)
var JO_EXTENDED = {
“37.123.”:1, “141.105.”:1, “185.14.”:1, “87.236.”:1,
“212.118.”:1, “185.107.”:1, “176.9.”:1, “213.6.”:1,
“62.150.”:1, “193.0.”:1, “91.106.”:1, “46.244.”:1,
“185.126.”:1, “188.120.”:1, “77.44.”:1, “217.19.”:1,
“213.178.”:1, “195.188.”:1, “212.50.”:1, “109.107.”:1,
“185.184.”:1, “91.228.”:1, “46.49.”:1, “188.163.”:1
};

// ============================================================
// 3. INSTANT BLOCK LIST (للسرعة القصوى)
// ============================================================

var INSTANT_BLOCK = {
// Cloud (أكبر تأخير)
“52.”:1, “54.”:1, “3.”:1, “13.”:1, “18.”:1, “20.”:1,
“34.”:1, “35.”:1, “40.”:1, “104.”:1, “142.”:1, “143.”:1,

// China (بينج عالي جداً)
“111.”:1, “112.”:1, “113.”:1, “114.”:1, “115.”:1, “116.”:1,
“117.”:1, “118.”:1, “119.”:1, “120.”:1, “121.”:1, “122.”:1,
“123.”:1, “124.”:1, “125.”:1,

// India (بينج عالي)
“14.”:1, “27.”:1, “106.”:1,

// USA (بينج عالي جداً)
“8.”:1, “12.”:1, “23.”:1, “64.”:1, “65.”:1, “66.”:1,
“67.”:1, “68.”:1, “69.”:1, “70.”:1, “71.”:1, “72.”:1,
“73.”:1, “74.”:1, “75.”:1, “76.”:1
};

// ============================================================
// 4. LIGHTNING-FAST FUNCTIONS
// ============================================================

function quickCheck(ip, table) {
// أسرع طريقة للفحص - مباشرة من الـ hash table
var p12 = ip.substring(0,12);
var p11 = ip.substring(0,11);
var p10 = ip.substring(0,10);
var p8 = ip.substring(0,8);
var p7 = ip.substring(0,7);
var p6 = ip.substring(0,6);
var p5 = ip.substring(0,5);
var p4 = ip.substring(0,4);

return table[p12] || table[p11] || table[p10] ||
table[p8] || table[p7] || table[p6] ||
table[p5] || table[p4];
}

function getIP(h) {
try {
var ip = dnsResolve(h);
return (ip && /^\d+.\d+.\d+.\d+$/.test(ip)) ? ip : null;
} catch(e) {
return null;
}
}

function isPrivate(ip) {
if (!ip) return false;
var f = ip.substring(0,3);
if (f === “10.” || f === “127”) return true;
if (ip.indexOf(“192.168.”) === 0) return true;
if (ip.indexOf(“172.16.”) === 0 || ip.indexOf(“172.17.”) === 0 ||
ip.indexOf(“172.18.”) === 0 || ip.indexOf(“172.19.”) === 0 ||
ip.indexOf(“172.20.”) === 0 || ip.indexOf(“172.21.”) === 0 ||
ip.indexOf(“172.22.”) === 0 || ip.indexOf(“172.23.”) === 0 ||
ip.indexOf(“172.24.”) === 0 || ip.indexOf(“172.25.”) === 0 ||
ip.indexOf(“172.26.”) === 0 || ip.indexOf(“172.27.”) === 0 ||
ip.indexOf(“172.28.”) === 0 || ip.indexOf(“172.29.”) === 0 ||
ip.indexOf(“172.30.”) === 0 || ip.indexOf(“172.31.”) === 0) return true;
return false;
}

function isPUBG(h) {
// Ultra-fast check - substring only
var len = h.length;
if (len > 50 || len < 5) return false;

var l = h.toLowerCase();

// Most common first (for speed)
if (l.indexOf(“pubg”) !== -1) return true;
if (l.indexOf(“intl”) !== -1) return true;
if (l.indexOf(“igame”) !== -1) return true;
if (l.indexOf(“tencent”) !== -1) return true;
if (l.indexOf(“proxima”) !== -1) return true;

// Less common
if (l.indexOf(“krafton”) !== -1) return true;
if (l.indexOf(“ams”) !== -1) return true;
if (l.indexOf(“vmp”) !== -1) return true;
if (l.indexOf(“gme”) !== -1) return true;
if (l.indexOf(“wow”) !== -1) return true;
if (l.indexOf(“ugc”) !== -1) return true;

return false;
}

// ============================================================
// 5. SUPER-FAST TRAFFIC DETECTOR
// ============================================================

function isMatch(s) {
// Match keywords (most critical)
return /game|gs.|gss|battle|match|logic|zone|shard|realtime/i.test(s);
}

function isLobby(s) {
// Lobby keywords
return /lobby|matchmaking|mm|queue|room|gate|dispatcher|region/i.test(s);
}

// ============================================================
// 6. INTELLIGENT JORDAN VALIDATOR (سريع جداً)
// ============================================================

function isJordanFast(ip) {
if (!ip) return false;

// Step 1: Instant block check (أسرع)
if (quickCheck(ip, INSTANT_BLOCK)) return false;

// Step 2: Ultra tier (ثاني أسرع)
if (quickCheck(ip, JO_ULTRA)) return true;

// Step 3: Premium tier
if (quickCheck(ip, JO_PREMIUM)) return true;

// Step 4: Standard tier
if (quickCheck(ip, JO_STANDARD)) return true;

// Step 5: Extended tier
if (quickCheck(ip, JO_EXTENDED)) return true;

// Step 6: Range validation (آخر فحص)
var parts = ip.split(”.”);
if (parts.length !== 4) return false;

var o1 = parseInt(parts[0]);
var o2 = parseInt(parts[1]);

// Known Jordan ranges
if (o1 === 176 && o2 >= 29 && o2 <= 32) return true;
if (o1 === 82 && o2 >= 212 && o2 <= 214) return true;
if (o1 === 212 && o2 >= 34 && o2 <= 37) return true;
if (o1 === 94 && o2 >= 249 && o2 <= 251) return true;
if (o1 === 46 && (o2 >= 32 && o2 <= 34 || o2 >= 185 && o2 <= 187)) return true;
if (o1 === 188 && (o2 >= 161 && o2 <= 163 || o2 >= 247 && o2 <= 249)) return true;
if (o1 === 91 && (o2 >= 144 && o2 <= 146 || o2 === 185 || o2 === 106)) return true;
if (o1 === 37 && (o2 >= 8 && o2 <= 10 || o2 >= 48 && o2 <= 50 || o2 === 123)) return true;

return false;
}

// ============================================================
// 7. SMART PROXY SELECTOR (بناءً على جودة الـ IP)
// ============================================================

function getBestProxy(ip) {
if (!ip) return BLOCK;

// Ultra IPs: Direct connection (أقل بينج)
if (quickCheck(ip, JO_ULTRA)) {
return MATCH_DIRECT;
}

// Premium IPs: Direct (بينج منخفض)
if (quickCheck(ip, JO_PREMIUM)) {
return MATCH_DIRECT;
}

// Standard: Direct (قبول)
if (quickCheck(ip, JO_STANDARD)) {
return MATCH_DIRECT;
}

// Extended: حظر للمباريات (بينج عالي)
return BLOCK;
}

// ============================================================
// 8. MAIN FUNCTION - OPTIMIZED FOR SPEED
// ============================================================

function FindProxyForURL(url, host) {
// Remove port
var h = host;
var idx = h.indexOf(”:”);
if (idx !== -1) h = h.substring(0, idx);

// === BYPASS LAYER (أسرع طبقة) ===

// System essentials only
if (h.indexOf(“apple.com”) !== -1) {
if (h === “captive.apple.com” || h === “time.apple.com”) return “DIRECT”;
}
if (h === “clients3.google.com” || h === “connectivitycheck.gstatic.com”) {
return “DIRECT”;
}

// Video CDN
if (h.indexOf(“googlevideo.com”) !== -1 || h.indexOf(“ytimg.com”) !== -1) {
return “DIRECT”;
}

// === PUBG CHECK ===
if (!isPUBG(h)) return “DIRECT”;

// === DNS RESOLUTION ===
var ip = getIP(h);

// Private network
if (ip && isPrivate(ip)) return “DIRECT”;

// DNS fail = block
if (!ip) return BLOCK;

// === INSTANT BLOCK CHECK (أسرع فحص) ===
if (quickCheck(ip, INSTANT_BLOCK)) return BLOCK;

// === JORDAN VALIDATION ===
if (!isJordanFast(ip)) return BLOCK;

// === TRAFFIC TYPE (بسيط وسريع) ===
var text = url + “ “ + h;

// Match traffic: Best proxy selection
if (isMatch(text)) {
return getBestProxy(ip);
}

// Lobby/other: Fast lobby chain
if (isLobby(text)) {
return LOBBY_FAST;
}

// Default PUBG: Lobby
return LOBBY_FAST;
}
