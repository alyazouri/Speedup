// =====================================================
// JoMe1.pac — JORDAN PURE (Long-Term, Low-Maintenance)
// Built on: (3) Recruit Expansion ONLY + (5) Suffix-First + (6) No-Voice
//          + (8) Latency Preservation + (10) Jordan-First Signals
//
// ✅ Goals
// - Jordan-first behavior WITHOUT hard geo-blocking (to avoid long queues)
// - Lobby/Recruit traffic is "Jordan-gravity" (strong preference)
// - Match traffic uses one stable proxy (as requested) with DIRECT fallback
// - No voice logic at all
// - Long-term: relies on stable domain suffixes more than IP tables
//
// ⚠ Notes
// - PAC cannot guarantee "Jordan-only matches" if the game has no JO match pool.
// - Since you only have Jordan proxies, "Gulf fallback" becomes DIRECT fallback.
// =====================================================


// =======================
// PROXIES (Stable)
// =======================
// Lobby: 2 proxies (Jordan) + DIRECT fallback (keeps game/store working if proxies fail)
var LOBBY_PROXY = "PROXY 176.29.153.95:9030; PROXY 212.35.66.45:9030; DIRECT";

// Match: ONE proxy (Jordan) + DIRECT fallback
var MATCH_PROXY = "PROXY 176.29.153.95:20001; DIRECT";

// Optional block (not used by default in this long-term profile)
var BLOCK = "PROXY 127.0.0.1:9";


// =======================
// DIRECT (System / CDN)
// =======================
var SAFE_DIRECT = [
  "captive.apple.com","time.apple.com","ocsp.apple.com",
  "clients3.google.com","gstatic.com","googleapis.com",
  "connectivitycheck.gstatic.com",
  "msftconnecttest.com","msftncsi.com"
];

var CDN_DIRECT = [
  "youtube.com","googlevideo.com","ytimg.com",
  "fbcdn.net","facebook.com",
  "instagram.com","cdninstagram.com",
  "tiktokcdn.com","tiktokv.com",
  "akamaihd.net"
];


// =======================
// PUBG DOMAIN WHITELIST (Suffix-based = long-term stable)
// =======================
var PUBG_SUFFIX_ALLOW = [
  // PUBG / Tencent ecosystem
  "proximabeta.com",
  "pubgmobile.com",
  "tencent.com",
  "qq.com",
  "qcloud.com",
  "tencent-cloud.com",
  // GCloud services
  "gcloudcs.com",
  "gcloudsdk.com"
];

// Lightweight fallback hints (only if PUBG uses a new suffix unexpectedly)
var PUBG_HINT = [
  "pubg","proximabeta","tencent","gcloud","lightspeed","igame","gss","gameserver"
];


// =======================
// JORDAN GRAVITY (Recruit Expansion ONLY)
// - We intentionally keep this minimal to avoid maintenance.
// - If you later get confirmed Jordan-only prefixes for your providers, add them here.
// =======================
var JO_RECRUIT_HINT = [
  // Keywords that usually appear in early-stage "recruit/decision" flows
  "matchmaking","queue","mm","presence","party","invite","team",
  "lobby","login","auth","passport","account",
  "room","rooms","ugc","wow","social","friends","clan","guild",
  "rank","leaderboard"
];


// =======================
// HELPERS
// =======================
function hostEndsWith(host, sfx){
  host = host.toLowerCase();
  sfx = sfx.toLowerCase();
  return host === sfx || host.endsWith("." + sfx);
}

function inList(host, list){
  for (var i = 0; i < list.length; i++){
    if (hostEndsWith(host, list[i])) return true;
  }
  return false;
}

function containsAny(s, list){
  s = s.toLowerCase();
  for (var i = 0; i < list.length; i++){
    if (s.indexOf(list[i]) !== -1) return true;
  }
  return false;
}

function normalizeHost(host){
  var i = host.indexOf(":");
  if (i !== -1) return host.substring(0, i);
  return host;
}

function isIPv4(ip){ return ip && ip.indexOf(".") !== -1; }

function isPrivateOrLocalIP(ip){
  if (!isIPv4(ip)) return false;
  return (
    isInNet(ip, "10.0.0.0", "255.0.0.0") ||
    isInNet(ip, "172.16.0.0", "255.240.0.0") ||
    isInNet(ip, "192.168.0.0", "255.255.0.0") ||
    isInNet(ip, "127.0.0.0", "255.0.0.0") ||
    isInNet(ip, "169.254.0.0", "255.255.0.0")
  );
}

function getRealIPv4(host){
  var ip = dnsResolve(host);
  if (!ip || !isIPv4(ip)) return null;
  return ip;
}

// PUBG detection (suffix-first)
function isPUBG(host){
  if (inList(host, PUBG_SUFFIX_ALLOW)) return true;
  return containsAny(host, PUBG_HINT);
}

// Recruit / Lobby traffic (Jordan gravity)
// NOTE: No voice logic at all.
function isRecruitTraffic(url, host){
  var s = (url + host).toLowerCase();
  return containsAny(s, JO_RECRUIT_HINT);
}

// Match traffic (keep it tight to preserve latency)
function isMatchTraffic(url, host){
  var s = (url + host).toLowerCase();
  return /(match|game|battle|gameserver|session|arena|classic|ranked|realtime|shard|node|cell|scene)/.test(s);
}


// =======================
// MAIN
// =======================
function FindProxyForURL(url, host){
  host = normalizeHost(host);

  // Always direct for system / cdn
  if (inList(host, SAFE_DIRECT)) return "DIRECT";
  if (inList(host, CDN_DIRECT)) return "DIRECT";

  // Local/private direct
  var ip = getRealIPv4(host);
  if (ip && isPrivateOrLocalIP(ip)) return "DIRECT";

  // Non-PUBG browsing stays normal
  if (!isPUBG(host)) return "DIRECT";

  // Jordan-first signals:
  // 1) Recruit/Lobby flows -> 2 lobby proxies (Jordan) + DIRECT fallback
  if (isRecruitTraffic(url, host)) return LOBBY_PROXY;

  // 2) Match flows -> one stable proxy + DIRECT fallback
  if (isMatchTraffic(url, host)) return MATCH_PROXY;

  // Default for PUBG: keep it on match path (preserves latency)
  return MATCH_PROXY;
}
