// =====================================================
// JoMe1_JO_STRICT_ONLY_JORDAN_V18_UPDATED_2026.pac
// =====================================================
// النسخة الكاملة المحدثة – أردني 100% فقط
// • فقط النطاقات الأردنية القوية والمؤكدة (Zain + Orange + Umniah الأساسية)
// • أي IP خارجها يُحظر فوراً (BLOCK)
// • بدون أي نطاقات ضعيفة أو مشكوك فيها أو تداخل مع دول أخرى
// • تحديث: proxy chains بدون DIRECT تماماً، وكل fallback يروح على بروكسي أردني قوي
// • كفاءة عالية: مصفوفة نطاقات واحدة، حلقات أقل، بلوك فوري
// =====================================================

// ─── PROXY CHAINS (بدون DIRECT نهائياً – كل شيء بروكسي أردني) ───
var LOBBY_PROXY_CHAIN =
    "PROXY 176.29.153.95:9030;" +   // Zain – الأكثر شيوعاً
    "PROXY 212.34.3.1:9030;" +      // Orange Fiber
    "PROXY 213.139.10.1:9030;" +    // Orange
    "PROXY 46.32.99.1:9030;" +      // Zain
    "PROXY 92.241.50.1:9030;" +     // Umniah
    "PROXY 80.90.171.1:9030;" +     // Orange/Zain overlap قوي
    "PROXY 176.29.153.95:9030";     // fallback أردني قوي

var MATCH_PROXY =
    "PROXY 176.29.153.95:20001;" +
    "PROXY 212.34.3.1:20001;" +
    "PROXY 213.139.20.1:20001;" +
    "PROXY 80.90.160.1:20001;" +
    "PROXY 92.241.10.1:20001;" +
    "PROXY 176.29.153.95:20001";    // كل شيء يروح على بروكسي أردني – بدون DIRECT

var BLOCK = "PROXY 127.0.0.1:9";

// ─── WHITELIST ──────────────────────────────────────────
var SAFE_DIRECT = [
    "captive.apple.com","time.apple.com","ocsp.apple.com",
    "clients3.google.com","connectivitycheck.gstatic.com"
];

var CDN_DIRECT = ["googlevideo.com","ytimg.com"];

// ─── JORDAN RANGES – فقط القوية والمؤكدة 100% ────────────
var JO_RANGES = [
    "176.28.", "176.29.",   // Zain – الأقوى والأكثر انتشاراً
    "212.34.",              // Orange Fiber
    "213.139.",             // Orange
    "46.32.",               // Zain
    "92.241.",              // Umniah
    "80.90."                // Orange/Zain overlap قوي
];

// ─── BLOCK كل شيء خارج النطاقات الأردنية القوية ────────
// لا استثناءات – أي IP غير موجود في JO_RANGES يُحظر مباشرة
function isJordanIP(ip) {
    if (!ip || !isIPv4(ip)) return false;
    return JO_RANGES.some(prefix => ip.indexOf(prefix) === 0);
}

function allowLobby(ip) {
    return isJordanIP(ip);
}

function allowMatch(ip) {
    return isJordanIP(ip);
}

// ─── MAIN FUNCTION – كل شيء يعتمد على النطاقات الأردنية فقط ───
function FindProxyForURL(url, host) {
    host = normalizeHost(host);
    
    if (containsAny(host, SAFE_DIRECT) || containsAny(host, CDN_DIRECT)) return "DIRECT";
    
    var ip = getIP(host);
    if (ip && isPrivateOrLocalIP(ip)) return "DIRECT";
    
    // غير PUBG → DIRECT (لا نتحكم فيه)
    if (!isPUBG(host)) return "DIRECT";
    
    // بدون IP → بلوك
    if (!ip) return BLOCK;
    
    // أي IP خارج النطاقات الأردنية القوية → بلوك فوري
    if (!isJordanIP(ip)) return BLOCK;
    
    var isLobbyOrRecruit = isLobbyTraffic(url, host) || isRecruitTraffic(url, host);
    
    if (isLobbyOrRecruit) {
        return allowLobby(ip) ? LOBBY_PROXY_CHAIN : BLOCK;
    }
    
    // كل شيء آخر (مباريات + غير مصنف) → MATCH
    return allowMatch(ip) ? MATCH_PROXY : BLOCK;
}

// ─── الدوال الأساسية (مطلوبة ليعمل السكريبت) ────────────────

function normalizeHost(h) {
    var i = h.indexOf(":");
    return i !== -1 ? h.substring(0, i) : h;
}

function isIPv4(ip) {
    return ip && /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip);
}

function getIP(host) {
    try {
        var ip = dnsResolve(host);
        return ip && isIPv4(ip) ? ip : null;
    } catch(e) {
        return null;
    }
}

function startsWithAny(ip, prefixes) {
    if (!ip) return false;
    for (var i = 0; i < prefixes.length; i++) {
        if (ip.indexOf(prefixes[i]) === 0) return true;
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
    var keywords = ["pubg","pubgm","pubgmobile","intlgame","igame","tencent","qcloud","krafton","lightspeed","amsoveasea","wow","ugc","creative"];
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
