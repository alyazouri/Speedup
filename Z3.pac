// ===================================================================
// PUBG ALL-IN JORDAN ULTRA — SINGULARITY MAX ABSOLUTE FINAL (iOS)
// Jordan First (MAX) • Gulf Fallback • Ultra Stable • NO IQ
// ===================================================================

// ======================= PROXIES ==========================
var LOBBY_PROXY = "PROXY 176.29.153.95:9030; PROXY 212.35.66.45:9030";
var MATCH_PROXY = "PROXY 176.29.153.95:20001";
var VOICE_PROXY = "PROXY 82.212.84.33:20001; PROXY 82.212.84.33:10012";
var BLOCK = "PROXY 127.0.0.1:9";

// ======================= SAFE DIRECT ======================
var SAFE_DIRECT = [
  "captive.apple.com","time.apple.com","ocsp.apple.com","ocsp2.apple.com",
  "clients3.google.com","clients4.google.com",
  "connectivitycheck.gstatic.com",
  "icloud.com","itunes.apple.com","apps.apple.com","mzstatic.com"
];

// ======================= CDN DIRECT =======================
var CDN_DIRECT = [
  "youtube.com","googlevideo.com","ytimg.com",
  "facebook.com","fbcdn.net","instagram.com","cdninstagram.com"
];

// ======================= HELPERS ==========================
function dnsSafe(h){ try{ return dnsResolve(h);}catch(e){return null;} }
function isIPv4(ip){ return ip && ip.indexOf(".")!==-1; }
function getIPv4(h){ var ip=dnsSafe(h); return isIPv4(ip)?ip:null; }
function normalizeHost(h){ var i=h.indexOf(":"); return i!==-1?h.substring(0,i):h; }
function startsWithAny(ip,t){ for(var k in t) if(ip.indexOf(k)===0) return true; return false; }

// ======================= REGIONS ==========================
var JO_NETS={"46.32.":1,"46.185.":1,"188.247.":1,"109.224.":1,"178.18.":1,"188.120.":1,"176.29.":1,
"95.87.":1,"91.144.":1,"5.11.":1,"37.48.":1,"77.44.":1,"212.34.":1,"212.35.":1,
"188.161.":1,"85.159.":1,"82.212.":1,"149.200.":1,"46.244.":1,"217.19.":1};
var GF_NETS={"212.71.":1,"94.26.":1,"5.36.":1,"37.210.":1,"31.193.":1};

function isJO(ip){ return startsWithAny(ip,JO_NETS); }
function isGF(ip){ return startsWithAny(ip,GF_NETS); }

// ======================= CONTEXT ==========================
function isPUBG(h){
  return /(pubg|pubgm|pubgmobile|igamecj|proximabeta|tencent|qcloud|gcloudsdk|krafton|lightspeed|wow|ugc|creative)/.test(h);
}
function isFriendUI(u,h){
  return /(friend|addfriend|recommend|search|profile|people)/.test((u+h).toLowerCase());
}
function isLobby(u,h){
  return /(lobby|matchmaking|queue|room|team|squad|party|invite|dispatcher|region)/.test((u+h).toLowerCase());
}
function isMatch(u,h){
  return /(game|battle|play|gs\.|gameserver|session|instance|realtime|action)/.test((u+h).toLowerCase());
}
function isVoice(u,h){
  return /(voice|rtc|webrtc|voip|audio|mic|talk)/.test((u+h).toLowerCase());
}
function isArena(u,h){
  return /(arena|tdm|deathmatch|training|warehouse|hangar|gun|gungame|ultimate)/.test((u+h).toLowerCase());
}

// ======================= PSYCHOLOGY CORE ==================
var SESSION_START = Date.now();
var WARMUP_MS = 150000;        // 2.5 دقائق أردني فقط
var LOBBY_LOCK_MS = 480000;   // 8 دقائق تثبيت لوبي
var ARENA_JO_ONLY_MS = 105000;// 105 ثانية ضغط أرينا
var ARENA_LOCK_MS = 180000;   // 3 دقائق تثبيت

var RECRUIT_COUNT = 0;
var RECRUIT_COLD_LIMIT = 8;

var ARENA_STATE = { lastJO:0, locked:false };
var MEMORY = { joScore:0 };
function jordanStrong(){ return MEMORY.joScore >= 4; }

// ---- Lock Engine ----
var LOCK={};
function lock(h,p,ms){ LOCK[h]={p:p,t:Date.now()+ms}; return p; }
function getLock(h){ var r=LOCK[h]; if(r && Date.now()<r.t) return r.p; return null; }

// ======================= ROUTER ===========================
function FindProxyForURL(url, host){
  host = normalizeHost((host||"").toLowerCase());

  for(var i=0;i<SAFE_DIRECT.length;i++)
    if(dnsDomainIs(host, SAFE_DIRECT[i])) return "DIRECT";
  for(var j=0;j<CDN_DIRECT.length;j++)
    if(shExpMatch(host,"*"+CDN_DIRECT[j])) return "DIRECT";

  var lk=getLock(host); if(lk) return lk;
  if(!isPUBG(host)) return "DIRECT";

  var ip=getIPv4(host);
  if(!ip) return BLOCK;

  var JO=isJO(ip), GF=isGF(ip);
  if(!(JO||GF)) return BLOCK;

  // ---------- WARMUP ----------
  if(Date.now()-SESSION_START < WARMUP_MS){
    if(JO){
      MEMORY.joScore+=3;
      return lock(host, LOBBY_PROXY, 15000);
    }
    return BLOCK;
  }

  // ---------- VOICE ----------
  if(isVoice(url,host))
    return lock(host, VOICE_PROXY, 15000);

  // ---------- ADD FRIEND ----------
  if(isFriendUI(url,host)){
    RECRUIT_COUNT++;
    if(JO){
      MEMORY.joScore+=3;
      return lock(host, LOBBY_PROXY, 12000);
    }
    if(RECRUIT_COUNT <= RECRUIT_COLD_LIMIT) return BLOCK;
    if(GF) return lock(host, LOBBY_PROXY, 7000);
    return BLOCK;
  }

  // ---------- LOBBY ----------
  if(isLobby(url,host)){
    if(jordanStrong())
      return lock(host, LOBBY_PROXY, 15000);
    if(JO){
      MEMORY.joScore+=3;
      return lock(host, LOBBY_PROXY, 15000);
    }
    if(GF) return lock(host, LOBBY_PROXY, 7000);
    return BLOCK;
  }

  // ---------- ARENA ----------
  if(isArena(url,host)){
    if(ARENA_STATE.locked && (Date.now()-ARENA_STATE.lastJO)<ARENA_LOCK_MS)
      return lock(host, MATCH_PROXY, 17000);

    if((Date.now()-SESSION_START)<ARENA_JO_ONLY_MS){
      if(JO){
        ARENA_STATE.lastJO=Date.now();
        ARENA_STATE.locked=true;
        MEMORY.joScore+=3;
        return lock(host, MATCH_PROXY, 17000);
      }
      return BLOCK;
    }

    if(jordanStrong() && !JO) return BLOCK;

    if(JO){
      ARENA_STATE.lastJO=Date.now();
      ARENA_STATE.locked=true;
      MEMORY.joScore+=3;
      return lock(host, MATCH_PROXY, 17000);
    }

    if(GF) return lock(host, MATCH_PROXY, 13000);
    return BLOCK;
  }

  // ---------- MATCH ----------
  if(isMatch(url,host)){
    if(JO){
      MEMORY.joScore+=3;
      return lock(host, MATCH_PROXY, 17000);
    }
    if(GF) return lock(host, MATCH_PROXY, 13000);
    return BLOCK;
  }

  return lock(host, MATCH_PROXY, 10000);
}
