// =====================================================
// JoMe1_JO_MATCH_LAN_ONLY_FULL.pac
// =====================================================
// FULL MATCH-ONLY VERSION
// =====================================================

var MATCH_PROXY = "PROXY 176.29.153.95:20001";
var BLOCK = "PROXY 127.0.0.1:9";

function normalizeHost(h){var i=h.indexOf(":");return i!=-1?h.substring(0,i):h;}
function isIPv4(i){return i&&/^\d+\.\d+\.\d+\.\d+$/.test(i);}
function getIP(h){try{var i=dnsResolve(h);return isIPv4(i)?i:null;}catch(e){return null;}}

function isPUBG(h){return /(pubg|pubgm|tencent|krafton|lightspeed|gcloud|qcloud)/i.test(h);}
function isMatch(u,h){return /(battle|game|gs\.|gameserver|realtime|session|tick)/i.test(u+h);}

function isJordanMatch(ip){
  return ip &&
    (ip.indexOf("176.29.")===0 ||
     ip.indexOf("82.212.")===0 ||
     ip.indexOf("212.34.")===0 ||
     ip.indexOf("212.35.")===0 ||
     ip.indexOf("94.249.")===0);
}

function FindProxyForURL(url, host){
  host=normalizeHost(host);
  if(!isPUBG(host)) return "DIRECT";

  var ip=getIP(host);
  if(!ip) return BLOCK;

  if(isMatch(url,host)&&isJordanMatch(ip)) return MATCH_PROXY;
  return BLOCK;
}
