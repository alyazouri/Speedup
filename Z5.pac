// ===================================================================
// PUBG Jordan Anti-VPN Lock v7.3 FINAL — Anti-Iraq/VPN 2026 (Shadowrocket PAC)
// يحظر VPN/Datacenter/Iraq تماماً → لاعبين أردنيين locals فقط
// JO_MOBILE_ONLY: Zain/Umniah/Orange mobile prefixes (anti-VPN)
// Blocks: Iraq + AWS/GCP/Azure/Hetzner/OVH/DO/Vultr + common VPN
// ===================================================================

// ======================= PROXIES (Residential JO Mobile فقط) ======================
var JORDAN_LOBBY_PROXY = "PROXY 176.29.153.95:9030; PROXY 212.35.66.45:9030";
var JORDAN_MATCH_PROXY = "PROXY 176.29.153.95:20001; PROXY 82.212.84.33:20001";
var VOICE_PROXY        = "PROXY 82.212.84.33:20001; PROXY 82.212.84.33:10012";
var BLOCK              = "PROXY 127.0.0.1:9";

// ======================= SAFE / CDN DIRECT ======================
var SAFE_DIRECT = [
  "captive.apple.com", "time.apple.com", "ocsp.apple.com", "ocsp2.apple.com",
  "clients3.google.com", "clients4.google.com", "connectivitycheck.gstatic.com",
  "icloud.com", "itunes.apple.com", "apps.apple.com", "mzstatic.com"
];
var CDN_DIRECT = [
  "youtube.com", "googlevideo.com", "ytimg.com",
  "facebook.com", "fbcdn.net", "instagram.com", "cdninstagram.com"
];

// ======================= HELPERS ==========================
function dnsSafe(h) { try { return dnsResolve(h); } catch (e) { return null; } }
function normalizeHost(h) { var i = h.indexOf(":"); return i !== -1 ? h.substring(0, i) : h; }
function startsWithAny(ip, arr) {
  for (var i = 0; i < arr.length; i++) if (ip.startsWith(arr[i])) return true;
  return false;
}

// ======================= JO_MOBILE_ONLY (Zain/Umniah/Orange Mobile – Anti-VPN) =======================
var JO_MOBILE_PREFIXES = [
  // Zain JO Mobile (AS48832 – locals ADSL/Mobile)
  "46.32.", "46.185.", "188.247.", "92.253.",
  
  // Umniah Mobile (AS9038)
  "5.45.", "46.23.", "46.248.", "37.220.", "95.172.", "109.107.",
  
  // Orange JO Mobile/Fixed (AS8697)
  "212.34.", "213.139.", "212.118.",
  
  // Jordan Data Mobile/ADSL Amman (AS8376)
  "176.29.", "82.212.", "86.108.", "37.202."
];

// ======================= BLOCKLISTS (Iraq + Datacenter/VPN) =======================
var IRAQ_BLOCK_PREFIXES = [  // Iraq IPs – حظر كامل
  "37.115.", "46.96.", "78.160.", "79.127.", "95.177.", "109.104.", "188.113.",
  "185.19.", "185.86.", "5.153.", "31.170.", "95.180.", "81.21.", "94.100."
];

var DATACENTER_VPN_BLOCKS = [  // AWS/GCP/Azure/OVH/Hetzner/DO/Vultr
  // AWS
  "3.", "13.", "15.", "16.", "18.", "52.", "54.", "99.", "108.136.", "150.222.",
  // GCP
  "34.", "35.", "104.",
  // Azure
  "20.", "40.", "52.112-52.119.", "64.4.", "104.40-104.47.",
  // OVH
  "5.39.", "51.68-51.89.", "91.134.", "141.95.", "142.4.", "142.44.", "144.91.",
  "145.239.", "149.202.", "151.80.", "157.180.", "167.114.", "178.32-178.33.",
  "185.98.", "188.165.", "192.99.", "198.245.", "212.83.", "51.195.",
  // Hetzner
  "95.216.", "135.181.", "157.90.", "162.55.", "176.9.", "188.34.", "213.133.", "213.239.",
  // DigitalOcean
  "104.131.", "134.209.", "159.65.", "159.203.", "167.99.", "165.22.", "165.227.",
  // Vultr
  "45.32-45.63.", "108.61.", "139.180.", "174.138.", "45.76-45.79."
];

var ALL_BLOCK_PREFIXES = IRAQ_BLOCK_PREFIXES.concat(DATACENTER_VPN_BLOCKS);

function isJordanMobile(ip) { return startsWithAny(ip, JO_MOBILE_PREFIXES); }
function isBlockedIP(ip) { return startsWithAny(ip, ALL_BLOCK_PREFIXES); }

var NEAR_PREFIXES = [];  // ألغينا Near – صرامة كاملة ضد VPN

// ======================= CONTEXT DETECTION ======================
function isPUBG(h) {
  h = h.toLowerCase();
  return /(pubg|pubgm|pubgmobile|intlgame|igamecj|proximabeta|tencent|qq\.com|krafton|lightspeed)/.test(h);
}
function isFriendUI(u, h) { var s=(u+h).toLowerCase(); return /(friend|addfriend|search|profile|uid|social|clan|invite)/.test(s); }
function isLobby(u, h) { var s=(u+h).toLowerCase(); return /(lobby|matchmaking|queue|room|squad|party|dispatcher)/.test(s); }
function isMatch(u, h) { var s=(u+h).toLowerCase(); return /(game|battle|gs\.|gameserver|matchserver|classic|ranked)/.test(s); }
function isArena(u, h) { var s=(u+h).toLowerCase(); return /(arena|tdm|deathmatch|evo|training)/.test(s); }
function isWOW(u, h) { var s=(u+h).toLowerCase(); return /(wow|worldofwonder|ugc|creative|customroom)/.test(s); }
function isVoice(u, h) { var s=(u+h).toLowerCase(); return /(voice|voip|rtc|webrtc|audio)/.test(s); }

// ======================= SESSION ======================
var SESSION_START = Date.now();

// ======================= MAIN ROUTER (Anti-VPN Strict) =======================
function FindProxyForURL(url, host) {
  host = normalizeHost((host || "").toLowerCase());

  // Safe/CDN Direct
  for (var i = 0; i < SAFE_DIRECT.length; i++) if (dnsDomainIs(host, SAFE_DIRECT[i])) return "DIRECT";
  for (var j = 0; j < CDN_DIRECT.length; j++) if (shExpMatch(host, "*." + CDN_DIRECT[j]) || shExpMatch(host, CDN_DIRECT[j])) return "DIRECT";

  if (!isPUBG(host)) return "DIRECT";

  var ip = dnsSafe(host);
  if (!ip) return BLOCK;

  // حظر فوري لـ Iraq/VPN/Datacenter
  if (isBlockedIP(ip)) return BLOCK;

  var isJO = isJordanMobile(ip);
  var elapsed = Date.now() - SESSION_START;
  var strict = elapsed < 120000;

  // Voice: JO Mobile فقط
  if (isVoice(url, host)) return isJO ? VOICE_PROXY : BLOCK;

  // Friends: JO Mobile
  if (isFriendUI(url, host)) return isJO ? JORDAN_LOBBY_PROXY : BLOCK;

  // Lobby: JO Mobile فقط
  if (isLobby(url, host)) return isJO ? JORDAN_LOBBY_PROXY : BLOCK;

  // Arena/WoW: JO Mobile
  if (isArena(url, host) || isWOW(url, host)) return isJO ? JORDAN_MATCH_PROXY : BLOCK;

  // Match: JO Mobile
  if (isMatch(url, host)) return isJO ? JORDAN_MATCH_PROXY : BLOCK;

  // Default PUBG: JO Mobile فقط
  return isJO ? JORDAN_MATCH_PROXY : BLOCK;
}
