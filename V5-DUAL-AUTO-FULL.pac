// =====================================================
// JoMe1_JO_ALL_STRICT_V5_DUAL_AUTO_MODE_FULL.pac
// =====================================================
// FULL VERSION – مطابق للسكريبت المشروح سابقاً
// =====================================================

var LOBBY_PROXY_CHAIN =
  "PROXY 176.29.153.95:9030; PROXY 212.35.66.45:9030";

var MATCH_PROXY = "PROXY 176.29.153.95:20001";
var BLOCK = "PROXY 127.0.0.1:9";

var SAFE_DIRECT = [
  "captive.apple.com","time.apple.com",
  "clients3.google.com","connectivitycheck.gstatic.com"
];

var JO_MATCH_ONLY = {
  "176.29.":1,"82.212.":1,"212.34.":1,"212.35.":1,"94.249.":1
};

var JO_RECRUIT_MEGA = {
  "176.29.":1,"82.212.":1,"212.34.":1,"212.35.":1,"94.249.":1,
  "46.32.":1,"188.247.":1,"46.185.":1,"85.159.":1,
  "176.241.":1,"95.87.":1,"31.186.":1,"109.224.":1
};

var JO_WILDCARD = [
  "176.29","82.212","212.34","212.35","94.249",
  "46.32","188.247","46.185","85.159"
];

var JO_DENSITY = [
  "176.29.","82.212.","46.32.","188.247.","46.185."
];

function normalizeHost(h){var i=h.indexOf(":");return i!=-1?h.substring(0,i):h;}
function isIPv4(i){return i&&/^\d+\.\d+\.\d+\.\d+$/.test(i);}
function getIP(h){try{var i=dnsResolve(h);return isIPv4(i)?i:null;}catch(e){return null;}}
function startsWithAny(ip,t){for(var p in t){if(ip.indexOf(p)===0)return true;}return false;}
function startsWithList(ip,l){for(var i=0;i<l.length;i++){if(ip.indexOf(l[i])===0)return true;}return false;}
function isPrivate(ip){
  return isInNet(ip,"10.0.0.0","255.0.0.0")||
         isInNet(ip,"172.16.0.0","255.240.0.0")||
         isInNet(ip,"192.168.0.0","255.255.0.0")||
         isInNet(ip,"127.0.0.0","255.0.0.0");
}
function containsAny(s,l){s=s.toLowerCase();for(var i=0;i<l.length;i++){if(s.indexOf(l[i])!=-1)return true;}return false;}

function isPUBG(h){
  return /(pubg|pubgm|tencent|krafton|lightspeed|gcloud|qcloud|wow|ugc)/i.test(h);
}

function isLobby(u,h){return /(lobby|matchmaking|queue|invite|friend|chat|login|auth)/i.test(u+h);}
function isRecruit(u,h){return /(recruit|team|squad|party|lfg|join)/i.test(u+h);}
function isWOW(u,h){return /(worldofwonder|wow|ugc|creative|custom)/i.test(u+h);}
function isMatch(u,h){return /(battle|game|gs\.|gameserver|realtime|session|tick)/i.test(u+h);}

function looksJordan(h,ip){
  h=h.toLowerCase();
  if(h.indexOf(".jo")!=-1) return true;
  if(h.indexOf("amman")!=-1) return true;
  if(h.indexOf("zain")!=-1||h.indexOf("orange")!=-1||h.indexOf("umniah")!=-1) return true;
  if(ip.startsWith("176.")||ip.startsWith("82.")) return true;
  return false;
}

function nearJordan(ip){
  var p=ip.split(".");
  if(p[0]==176&&(p[1]==28||p[1]==31)) return true;
  if(p[0]==212&&(p[1]==33||p[1]==37)) return true;
  return false;
}

function denseJordan(ip){
  for(var i=0;i<JO_DENSITY.length;i++)
    if(ip.indexOf(JO_DENSITY[i])===0) return true;
  return false;
}

function isJordan(ip,host){
  if(startsWithAny(ip,JO_RECRUIT_MEGA)) return true;
  if(startsWithList(ip,JO_WILDCARD)) return true;
  if(nearJordan(ip)) return true;
  if(denseJordan(ip)) return true;
  if(looksJordan(host,ip)) return true;
  return false;
}

function FindProxyForURL(url, host){
  host=normalizeHost(host);
  if(containsAny(host,SAFE_DIRECT)) return "DIRECT";

  var ip=getIP(host);
  if(!isPUBG(host)) return "DIRECT";
  if(!ip) return BLOCK;
  if(isPrivate(ip)) return "DIRECT";

  var lobby=isLobby(url,host),
      recruit=isRecruit(url,host),
      wow=isWOW(url,host),
      match=isMatch(url,host);

  if(match){
    if(startsWithAny(ip,JO_MATCH_ONLY)) return MATCH_PROXY;
    return BLOCK;
  }

  if(lobby||recruit||wow){
    if(isJordan(ip,host)) return LOBBY_PROXY_CHAIN;
    return BLOCK;
  }

  return BLOCK;
}
