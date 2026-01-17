// JoMe1_JO_ALL_STRICT_V5_DUAL_AUTO_MODE.pac
var LOBBY_PROXY_CHAIN = "PROXY 176.29.153.95:9030; PROXY 212.35.66.45:9030";
var MATCH_PROXY = "PROXY 176.29.153.95:20001";
var BLOCK = "PROXY 127.0.0.1:9";

function nH(h){var i=h.indexOf(":");return i!=-1?h.substring(0,i):h;}
function ip4(i){return i&&/^\d+\.\d+\.\d+\.\d+$/.test(i);}
function rIP(h){try{var i=dnsResolve(h);return ip4(i)?i:null;}catch(e){return null;}}
function isPUBG(h){return /(pubg|pubgm|tencent|krafton|lightspeed|gcloud|qcloud|wow|ugc)/i.test(h);}
function isMatch(u,h){return /(battle|game|gs\.|gameserver|realtime|session|tick)/i.test(u+h);}
function isLobby(u,h){return /(lobby|matchmaking|queue|invite|friend|chat|login|auth|recruit|team|squad|party)/i.test(u+h);}
function isJordan(ip){
  return ip &&
    (ip.indexOf("176.29.")===0 ||
     ip.indexOf("82.212.")===0 ||
     ip.indexOf("212.34.")===0 ||
     ip.indexOf("212.35.")===0 ||
     ip.indexOf("94.249.")===0 ||
     ip.indexOf("46.32.")===0 ||
     ip.indexOf("188.247.")===0 ||
     ip.indexOf("46.185.")===0);
}

function FindProxyForURL(url, host){
  host=nH(host);
  if(!isPUBG(host)) return "DIRECT";
  var ip=rIP(host);
  if(!ip) return BLOCK;

  if(isMatch(url,host)){
    if(isJordan(ip)) return MATCH_PROXY;
    return BLOCK;
  }

  if(isLobby(url,host)){
    if(isJordan(ip)) return LOBBY_PROXY_CHAIN;
    return BLOCK;
  }

  return BLOCK;
}
