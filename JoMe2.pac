// =====================================================
// JoMe1_GOLD_JO_GULF_NO_EU.pac
// Lobby = Match logic | Jordan first | Gulf second | Europe blocked
// =====================================================


// =======================
// PROXIES (Jordan)
// =======================
var LOBBY_PROXY =
  "PROXY 176.29.153.95:9030; " +
  "PROXY 212.35.66.45:9030";

var MATCH_PROXY =
  "PROXY 176.29.153.95:20001";

var BLOCK = "PROXY 127.0.0.1:9";


// =======================
// SAFE DIRECT (System / CDN فقط)
// =======================
var SAFE_DIRECT = [
  "captive.apple.com","time.apple.com","ocsp.apple.com",
  "clients3.google.com","gstatic.com","googleapis.com",
  "connectivitycheck.gstatic.com","msftconnecttest.com","msftncsi.com"
];

var CDN_DIRECT = [
  "youtube.com","googlevideo.com","ytimg.com",
  "fbcdn.net","facebook.com",
  "instagram.com","cdninstagram.com",
  "tiktokcdn.com","tiktokv.com",
  "akamaihd.net"
];


// =======================
// PUBG DETECTION
// =======================
var PUBG_HINT = [
  "pubg","proximabeta","tencent","gcloud",
  "lightspeed","igame","gss","gameserver"
];


// =======================
// GEO TABLES
// =======================

// الأردن — Tight
var JO_TIGHT = {
  "176.29.":1,
  "82.212.":1,
  "212.34.":1,
  "212.35.":1,
  "94.249.":1
};

// أوروبا — BLOCK
var EUROPE = {
  "5.":1,"31.":1,"37.":1,"46.":1,"51.":1,"62.":1,"77.":1,"78.":1,
  "80.":1,"81.":1,"82.":1,"83.":1,"84.":1,"85.":1,"86.":1,
  "87.":1,"88.":1,"89.":1,"90.":1,"91.":1,"92.":1,"93.":1,
  "94.":1,"95.":1,"109.":1,"141.":1,"145.":1,"151.":1,
  "176.":1,"178.":1,"185.":1,"188.":1,"193.":1,"194.":1,
  "195.":1,"212.":1
};

// الخليج — ضيق جدًا (≈ 2%)
var GULF_NETS = {
  // قطر
  "37.210.":1,

  // السعودية
  "159.0.":1,
  "176.47.":1,
  "188.51.":1
};


// =======================
// HELPERS
// =======================
function normalizeHost(h){
  var i = h.indexOf(":");
  return (i !== -1) ? h.substring(0,i) : h;
}

function containsAny(s, list){
  s = s.toLowerCase();
  for (var i=0;i<list.length;i++)
    if (s.indexOf(list[i]) !== -1) return true;
  return false;
}

function isIPv4(ip){ return ip && ip.indexOf(".") !== -1; }

function getIP(host){
  var ip = dnsResolve(host);
  return (ip && isIPv4(ip)) ? ip : null;
}

function startsWithAny(ip, table){
  for (var k in table)
    if (ip.indexOf(k) === 0) return true;
  return false;
}

function isPrivateOrLocalIP(ip){
  return ip &&
    (isInNet(ip,"10.0.0.0","255.0.0.0") ||
     isInNet(ip,"172.16.0.0","255.240.0.0") ||
     isInNet(ip,"192.168.0.0","255.255.0.0") ||
     isInNet(ip,"127.0.0.0","255.0.0.0"));
}

function isPUBG(host){
  return containsAny(host, PUBG_HINT);
}


// =======================
// TRAFFIC TYPES
// =======================
function isLobby(url, host){
  return /(matchmaking|queue|presence|party|invite|team|
            lobby|login|auth|passport|account|profile|
            inventory|store|shop|mission|event|
            rank|leaderboard|friends|social|clan|guild|ugc|wow)/ix
            .test(url+host);
}

function isMatch(url, host){
  return /(match|game|battle|gameserver|session|
            arena|classic|ranked|realtime|
            shard|node|cell|scene)/ix
            .test(url+host);
}


// =======================
// MAIN (Lobby = Match Logic)
// =======================
function FindProxyForURL(url, host){
  host = normalizeHost(host);

  // System/CDN
  if (containsAny(host, SAFE_DIRECT)) return "DIRECT";
  if (containsAny(host, CDN_DIRECT))  return "DIRECT";

  var ip = getIP(host);

  // Local
  if (ip && isPrivateOrLocalIP(ip)) return "DIRECT";

  // Non PUBG
  if (!isPUBG(host)) return "DIRECT";

  // DNS fail = BLOCK (حتى ما يهرب)
  if (!ip) return BLOCK;

  // Europe always BLOCK
  if (startsWithAny(ip, EUROPE)) return BLOCK;

  // ===== LOBBY = MATCH POLICY =====
  if (isLobby(url, host) || isMatch(url, host)) {
    if (startsWithAny(ip, JO_TIGHT)) return MATCH_PROXY;
    if (startsWithAny(ip, GULF_NETS)) return MATCH_PROXY;
    return BLOCK;
  }

  // Default PUBG
  if (startsWithAny(ip, JO_TIGHT)) return MATCH_PROXY;
  if (startsWithAny(ip, GULF_NETS)) return MATCH_PROXY;
  return BLOCK;
}
