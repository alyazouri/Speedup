// =====================================================
// JoMe1_JO_MAX_EXPANDED_V16_FINAL_NO_EG_IQ_EU_2026.pac
// =====================================================
// النسخة النهائية الكاملة – بعد كل التحسينات والاستبعادات
// استبعاد كامل لـ:
// • مصر (41., 45., 102., 156., 185., 188., 195., 196., 197. ...)
// • العراق (37., 185., 188., 195., 5. ...)
// • أوروبا كاملة (2., 5., 31., 78.–95., 185. ...)
// هدف: أكبر عدد ممكن من الأردنيين في اللوبي والتجنيد والمباريات
// =====================================================

// ─── PROXY CHAINS ──────────────────────────────────────
var LOBBY_PROXY_CHAIN =
    "PROXY 176.29.153.95:9030;" +
    "PROXY 212.35.66.45:9030;" +
    "PROXY 46.32.99.1:9030;" +
    "PROXY 213.139.10.1:9030;" +
    "PROXY 92.241.50.1:9030;" +
    "PROXY 80.90.171.1:9030;" +
    "PROXY 79.173.100.1:9030;" +
    "PROXY 86.108.50.1:9030;" +
    "PROXY 94.142.10.1:9030;" +
    "PROXY 109.107.20.1:9030;" +
    "PROXY 95.172.50.1:9030;" +
    "PROXY 91.144.50.1:9030;" +
    "PROXY 213.6.50.1:9030;" +
    "DIRECT";

var MATCH_PROXY =
    "PROXY 176.29.153.95:20001;" +
    "PROXY 212.34.3.1:20001;" +
    "PROXY 213.139.20.1:20001;" +
    "PROXY 80.90.160.1:20001;" +
    "PROXY 92.241.10.1:20001;" +
    "PROXY 46.32.20.1:20001;" +
    "DIRECT";

var BLOCK = "PROXY 127.0.0.1:9";

// ─── WHITELIST ──────────────────────────────────────────
var SAFE_DIRECT = [
    "captive.apple.com","time.apple.com","ocsp.apple.com",
    "clients3.google.com","connectivitycheck.gstatic.com"
];

var CDN_DIRECT = ["googlevideo.com","ytimg.com"];

// ─── JORDAN RANGES – أقصى توسع آمن حتى 2026 ────────────
var JO_MATCH_ONLY = {
    "176.28.":1, "176.29.":1, "46.32.":1, "77.245.":1,
    "94.142.":1, "80.90.":1, "212.34.":1, "213.139.":1,
    "82.212.":1, "213.13.":1, "92.241.":1, "212.35.":1,
    "95.172.":1, "109.107.":1, "46.185.":1, "79.173.":1,
    "85.159.":1, "91.186.":1, "91.144.":1
};

var JO_RECRUIT_ULTRA = {
    // Zain AS48832
    "176.28.":1, "176.29.":1, "46.32.":1, "77.245.":1,
    "94.142.":1, "80.90.":1, "188.247.":1, "91.144.":1,
    // Orange AS8697
    "212.34.":1, "213.139.":1, "82.212.":1, "213.13.":1,
    "80.90.":1, "82.205.":1, "37.48.":1, "188.161.":1,
    // Umniah AS9038
    "5.45.":1, "46.248.":1, "92.241.":1, "95.172.":1,
    "109.107.":1, "212.35.":1, "85.159.":1, "91.186.":1,
    "212.118.":1, "193.188.":1, "178.18.":1, "5.11.":1,
    // Jordan Data AS8376 + إضافات
    "46.185.":1, "79.173.":1, "86.108.":1, "37.202.":1,
    "94.249.":1, "149.200.":1, "37.123.":1, "178.238.":1,
    "217.23.":1, "82.102.":1, "195.188.":1, "213.6.":1
};

// ─── BLOCKED COUNTRIES – استبعاد كامل لمصر + العراق + أوروبا ────
var BLOCKED_COUNTRIES = {
    // الصين
    "43.":1,"58.":1,"111.":1,"112.":1,"113.":1,"114.":1,"115.":1,"116.":1,"117.":1,"118.":1,
    "119.":1,"120.":1,"121.":1,"122.":1,"123.":1,"124.":1,"125.":1,
    // الهند
    "14.":1,"27.":1,"103.":1,"106.":1,
    // جنوب شرق آسيا
    "1.":1,"101.":1,"171.":1,"175.":1,
    // أمريكا
    "64.":1,"65.":1,"66.":1,"67.":1,"68.":1,"69.":1,"70.":1,"71.":1,"72.":1,"73.":1,"74.":1,
    // مصر كاملة
    "41.":1,"45.":1,"102.":1,"156.":1,"185.":1,"188.":1,"195.":1,"196.":1,"197.":1,
    // العراق كامل
    "37.":1,"185.":1,"188.":1,"195.":1,"5.":1,
    // أوروبا كاملة (أهم الـ /8)
    "2.":1,"5.":1,"31.":1,"78.":1,"79.":1,"80.":1,"81.":1,"82.":1,"83.":1,"84.":1,
    "85.":1,"86.":1,"87.":1,"88.":1,"89.":1,"90.":1,"91.":1,"92.":1,"93.":1,"94.":1,
    "95.":1
};

// ─── الدوال الأساسية ────────────────────────────────────

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

function isPUBG(host) {
    if (!host) return false;
    host = host.toLowerCase();
    var keywords = [
        "pubg","pubgm","pubgmobile","intlgame","igamecj","igame",
        "tencent","qq","qcloud","gcloud","krafton","lightspeed",
        "amsoveasea","ams","ace","worldofwonder","wow","ugc","creative"
    ];
    for (var i = 0; i < keywords.length; i++) {
        if (host.indexOf(keywords[i]) !== -1) return true;
    }
    return false;
}

function isLobbyTraffic(url, host) {
    var s = (url + " " + host).toLowerCase();
    return /(lobby|matchmaking|matching|queue|mm|room|recruit|team|squad|party|invite|friend|social|chat|voice|gate|dispatcher|region|allocation|presence|heartbeat|login|auth|store|season|rank|mission|event)/.test(s);
}

function isRecruitTraffic(url, host) {
    var s = (url + " " + host).toLowerCase();
    return /(recruit|recruitment|team|squad|party|invite|friend|social|chat|message|lfg|lfm|search|find|join|request)/.test(s);
}

function isMatchTraffic(url, host) {
    var s = (url + " " + host).toLowerCase();
    return /(game|battle|match|gs\.|gameserver|session|zone|shard|realtime|sync|tick)/.test(s);
}

function isJordanIP(ip) {
    if (!ip || !isIPv4(ip)) return false;
    
    if (startsWithAny(ip, JO_RECRUIT_ULTRA)) return true;
    
    var parts = ip.split(".");
    if (parts.length !== 4) return false;
    var a = parseInt(parts[0]), b = parseInt(parts[1]);
    
    // Zain AS48832
    if (a === 176 && (b >= 28 && b <= 29)) return true;
    if (a === 46 && (b === 32 || b === 185 || b === 248)) return true;
    if (a === 77 && b === 245) return true;
    if (a === 94 && (b === 142 || b === 249)) return true;
    if (a === 80 && b === 90) return true;
    if (a === 91 && b === 144) return true;
    
    // Orange AS8697
    if (a === 212 && (b >= 34 && b <= 35)) return true;
    if (a === 213 && (b === 13 || b === 139 || b === 6)) return true;
    if (a === 82 && (b === 212 || b === 205)) return true;
    
    // Umniah AS9038
    if (a === 5 && (b === 45 || b === 11)) return true;
    if (a === 92 && b === 241) return true;
    if (a === 95 && b === 172) return true;
    if (a === 109 && b === 107) return true;
    if (a === 85 && b === 159) return true;
    
    // Jordan Data AS8376
    if (a === 79 && b === 173) return true;
    if (a === 86 && b === 108) return true;
    if (a === 37 && (b === 123 || b === 202)) return true;
    if (a === 149 && b === 200) return true;
    
    return false;
}

function isBlockedCountry(ip) {
    if (!ip) return false;
    if (startsWithAny(ip, BLOCKED_COUNTRIES)) {
        return !isJordanIP(ip);
    }
    return false;
}

function allowLobby(ip) {
    return isJordanIP(ip) && !isBlockedCountry(ip);
}

function allowMatch(ip) {
    return isJordanIP(ip) && startsWithAny(ip, JO_MATCH_ONLY);
}

// ─── MAIN FUNCTION ────────────────────────────────────────
function FindProxyForURL(url, host) {
    host = normalizeHost(host);
    
    if (containsAny(host, SAFE_DIRECT) || containsAny(host, CDN_DIRECT)) return "DIRECT";
    
    var ip = getIP(host);
    if (ip && isPrivateOrLocalIP(ip)) return "DIRECT";
    if (!isPUBG(host)) return "DIRECT";
    if (!ip) return BLOCK;
    
    if (!isJordanIP(ip) || isBlockedCountry(ip)) return BLOCK;
    
    var isLobbyOrRecruit = isLobbyTraffic(url, host) || isRecruitTraffic(url, host);
    
    if (isLobbyOrRecruit) {
        return allowLobby(ip) ? LOBBY_PROXY_CHAIN : BLOCK;
    }
    
    // كل شيء آخر → MATCH (لزيادة فرص الماتش مع أردنيين)
    return allowMatch(ip) ? MATCH_PROXY : BLOCK;
}
