// =====================================================
// PUBG MOBILE – FINAL COMPLETE LONG-TERM PAC
// Lobby (WIDE JO ASN)   → PROXY :9030
// Match (JO + US-ARAB)  → PROXY :20001
// iPad system + Media  → DIRECT
// Europe / Aruba EXCLUDED
// =====================================================

// ---------- PROXIES ----------
var LOBBY_PROXY  = "PROXY 176.29.153.95:9030";
var MATCH_PROXY  = "PROXY 176.29.153.95:20001";
var DIRECT_PROXY = "DIRECT";

// ---------- BASIC UTILS ----------
function normalizeHost(h){var i=h.indexOf(":");return i!=-1?h.substring(0,i):h;}
function isIPv4(i){return i&&i.indexOf(".")!==-1;}
function isIPv6(i){return i&&i.indexOf(":")!==-1;}
function getIP(h){try{var i=dnsResolve(h);return(isIPv4(i)||isIPv6(i))?i:null;}catch(e){return null;}}

// ---------- EXCLUSIONS (DIRECT) ----------
function isAppleSystem(h){
  return /(apple\.com|icloud\.com|itunes\.apple\.com|push\.apple\.com|mzstatic\.com|akadns\.net)/i.test(h);
}
function isMedia(h){
  return /(youtube|googlevideo|ytimg|netflix|fbcdn|instagram|tiktok|snapchat|imgur|images|video)/i.test(h);
}

// ---------- PUBG CHECK ----------
function isPUBG(h){
  return /(pubg|pubgm|tencent|krafton|lightspeed|gcloud|qcloud)/i.test(h);
}

// ---------- TRAFFIC TYPES ----------
function isLobby(u,h){
  return /(lobby|login|auth|account|queue|matchmaking|store|shop|wallet|config|cloud|social|presence|chat|profile)/i.test(u+h);
}
function isRecruit(u,h){
  return /(recruit|team|squad|party|lfg|join|invite|roomlist|teammate|friend)/i.test(u+h);
}
function isWOW(u,h){
  return /(worldofwonder|wow|ugc|creative|custom|sandbox|editor|arena)/i.test(u+h);
}
function isMatch(u,h){
  return /(battle|game|gs\.|gameserver|realtime|session|tick|rank|match|udp)/i.test(u+h);
}

// ---------- LONG-TERM ASN RANGES ----------

// 🇯🇴 JORDAN – WIDE (LOBBY / RECRUIT)
var JO_LOBBY_V4 = [
  "176.29.","82.212.",
  "212.34.","212.35.",
  "94.249.","185.60.","37.123."
];
var JO_LOBBY_V6 = [
  "2a02:8a00","2a02:ce80","2a02:8a40"
];

// 🇯🇴 JORDAN – STABLE (MATCH)
var JO_MATCH_V4 = [
  "176.29.","212.34.","94.249."
];
var JO_MATCH_V6 = [
  "2a02:8a00","2a02:ce80"
];

// 🇺🇸 US – ARAB DENSITY REGIONS ONLY (EAST / CENTRAL)
var US_MATCH_V4 = [
  "3.","13.52.","18.","34.192.","35.168.","52.","54.144."
];
var US_MATCH_V6 = [
  "2600:1f00","2600:9000"
];

// ---------- MATCHERS ----------
function matchPrefix(ip,list){
  for(var i=0;i<list.length;i++)
    if(ip.indexOf(list[i])===0) return true;
  return false;
}

// ---------- MAIN ----------
function FindProxyForURL(url, host){

  host = normalizeHost(host);

  // DIRECT exclusions
  if(isAppleSystem(host) || isMedia(host))
    return DIRECT_PROXY;

  // Non-PUBG
  if(!isPUBG(host))
    return DIRECT_PROXY;

  var ip = getIP(host);
  if(!ip)
    return LOBBY_PROXY;

  // Lobby / Recruit / WOW (WIDE JO)
  if(isLobby(url,host) || isRecruit(url,host) || isWOW(url,host)){
    if(
      (isIPv4(ip) && matchPrefix(ip,JO_LOBBY_V4)) ||
      (isIPv6(ip) && matchPrefix(ip,JO_LOBBY_V6))
    )
      return LOBBY_PROXY;
    return LOBBY_PROXY;
  }

  // Match – Jordan first
  if(isMatch(url,host)){
    if(
      (isIPv4(ip) && matchPrefix(ip,JO_MATCH_V4)) ||
      (isIPv6(ip) && matchPrefix(ip,JO_MATCH_V6))
    )
      return MATCH_PROXY;

    // US Arab fallback only
    if(
      (isIPv4(ip) && matchPrefix(ip,US_MATCH_V4)) ||
      (isIPv6(ip) && matchPrefix(ip,US_MATCH_V6))
    )
      return MATCH_PROXY;
  }

  return LOBBY_PROXY;
}
