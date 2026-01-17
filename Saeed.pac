// =====================================================
// PUBG MOBILE – iOS / iPad
// PERFORMANCE-TUNED PAC (LOW PING • STABLE)
// ALL VIA PAC ONLY
// =====================================================

var MATCH_PROXY  = "PROXY 176.29.153.95:20001";
var DIRECT_PROXY = "DIRECT";

// -------------------- FAST SAFETY --------------------
function isPlainHostName(h){ return h.indexOf('.') === -1; }

function isPrivateIP(ip){
  return (
    /^10\./.test(ip) ||
    /^192\.168\./.test(ip) ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip) ||
    /^127\./.test(ip) ||
    ip === "::1"
  );
}

// -------------------- LIGHT UTILS --------------------
function normalizeHost(h){
  var i=h.indexOf(":");
  return i!=-1?h.substring(0,i):h;
}

function isIPv4(i){ return i && i.indexOf(".")!==-1; }
function isIPv6(i){ return i && i.indexOf(":")!==-1; }

// IPv4-first resolve (key for stability)
function getIP(h){
  try{
    var i=dnsResolve(h);
    if(isIPv4(i)) return i;
    if(isIPv6(i)) return i; // fallback only
    return null;
  }catch(e){
    return null;
  }
}

// -------------------- PUBG FAST CHECK --------------------
function isPUBG(h){
  return /pubg|pubgm|tencent|krafton|lightspeed|gcloud|qcloud/i.test(h);
}

// -------------------- TRAFFIC (LIGHT REGEX) --------------------
function isLobby(u,h){
  return /lobby|login|auth|queue|matchmaking|store|chat|social/i.test(u+h);
}
function isRecruit(u,h){
  return /recruit|squad|party|invite|team/i.test(u+h);
}
function isWOW(u,h){
  return /worldofwonder|wow|ugc|arena|creative/i.test(u+h);
}
function isMatch(u,h){
  return /battle|game|gs\.|realtime|tick|match/i.test(u+h);
}

// -------------------- NARROW JORDAN RANGES --------------------

// Lobby / Recruit / WOW (NARROW)
var JO_LOBBY_IPV4 = [
  "176.29.144.","176.29.145.","176.29.146.","176.29.147.",
  "176.29.160.","176.29.161.",
  "82.212.64.","82.212.65.",
  "212.34.96.","212.34.97.",
  "212.35.64.","212.35.65.",
  "94.249.128.","94.249.129."
];

var JO_LOBBY_IPV6 = [
  "2a02:8a00",
  "2a02:ce80",
  "2a02:8a40"
];

// Match (ULTRA NARROW – PRIORITY ORANGE)
var JO_MATCH_IPV4 = [
  "176.29.150.","176.29.151.","176.29.152.","176.29.153.",
  "212.34.240.","212.34.241.",
  "94.249.200.","94.249.201."
];

var JO_MATCH_IPV6 = [
  "2a02:8a00:150",
  "2a02:ce80:240"
];

// -------------------- PREFIX MATCH (FAST) --------------------
function matchPrefix(ip,list){
  for(var i=0;i<list.length;i++){
    if(ip.indexOf(list[i])===0) return true;
  }
  return false;
}

function isLobbyIP(ip){
  if(isIPv4(ip)) return matchPrefix(ip,JO_LOBBY_IPV4);
  if(isIPv6(ip)) return matchPrefix(ip,JO_LOBBY_IPV6);
  return false;
}
function isMatchIP(ip){
  if(isIPv4(ip)) return matchPrefix(ip,JO_MATCH_IPV4);
  if(isIPv6(ip)) return matchPrefix(ip,JO_MATCH_IPV6);
  return false;
}

// -------------------- MAIN (OPTIMIZED ORDER) --------------------
function FindProxyForURL(url, host){

  host=normalizeHost(host);

  // ultra-fast exits
  if(isPlainHostName(host)) return DIRECT_PROXY;
  if(!isPUBG(host)) return DIRECT_PROXY;

  var ip=getIP(host);
  if(!ip||isPrivateIP(ip)) return DIRECT_PROXY;

  // Lobby / Recruit / WOW → DIRECT (narrow only)
  if((isLobby(url,host)||isRecruit(url,host)||isWOW(url,host)) && isLobbyIP(ip))
    return DIRECT_PROXY;

  // Match → PROXY (narrow, IPv4-first behavior)
  if(isMatch(url,host) && isMatchIP(ip))
    return MATCH_PROXY;

  return DIRECT_PROXY;
}
