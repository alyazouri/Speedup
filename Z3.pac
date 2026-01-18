// ===================================================================
// PUBG ALL-IN JORDAN ULTRA — SINGULARITY FINAL (iOS)
// ===================================================================

// ======================= PROXIES (STABLE) ==========================
var LOBBY_PROXY = "PROXY 176.29.153.95:9030; PROXY 212.35.66.45:9030";
var MATCH_PROXY = "PROXY 176.29.153.95:20001";
var VOICE_PROXY = "PROXY 82.212.84.33:20001; PROXY 82.212.84.33:10012";
var BLOCK = "PROXY 127.0.0.1:9";

// ======================= SAFE DIRECT ===============================
var SAFE_DIRECT = [
  "captive.apple.com","time.apple.com","ocsp.apple.com","ocsp2.apple.com",
  "clients3.google.com","clients4.google.com","connectivitycheck.gstatic.com",
  "icloud.com","itunes.apple.com","apps.apple.com","mzstatic.com"
];

// ======================= CDN DIRECT ================================
var CDN_DIRECT = [
  "youtube.com","googlevideo.com","ytimg.com",
  "facebook.com","fbcdn.net","instagram.com","cdninstagram.com"
];

// ======================= BASIC HELPERS =============================
function dnsSafe(host){
  try{ return dnsResolve(host); }catch(e){ return null; }
}
function isIPv4(ip){ return ip && ip.indexOf(".")!==-1; }
function getIPv4(host){ var ip=dnsSafe(host); return isIPv4(ip)?ip:null; }
function startsWithAny(ip,table){ for(var k in table) if(ip.indexOf(k)===0) return true; return false; }
function normalizeHost(h){ var i=h.indexOf(":"); return i!==-1?h.substring(0,i):h; }

// ======================= REGION TABLES =============================
var JO_NETS = {"95.87.":1,"176.241.":1,"46.32.":1,"37.48.":1,"188.161.":1,"91.144.":1,"31.186.":1,"109.224.":1,"188.247.":1,"5.11.":1,"193.188.":1,"178.18.":1,"46.185.":1,"85.159.":1,"195.106.":1,"91.185.":1,"83.244.":1,"212.34.":1,"212.35.":1,"212.118.":1,"37.123.":1,"213.178.":1,"213.6.":1,"195.188.":1,"212.50.":1,"176.29.":1,"82.212.":1,"91.106.":1,"149.200.":1,"46.244.":1,"217.19.":1,"77.44.":1};
var GF_NETS = {"212.71.":1,"94.26.":1,"5.36.":1,"37.210.":1,"31.193.":1};

function isJO(ip){ return startsWithAny(ip,JO_NETS); }
function isGF(ip){ return startsWithAny(ip,GF_NETS); }

// ======================= PUBG / CONTEXT DETECTORS ==================
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

// ======================= SINGULARITY CORE ==========================

// ---- Probabilistic Gravity Field ----
var GRAVITY = {
  base: 0.45,      // البداية
  step: 0.15,      // الزيادة عند الفشل
  max: 0.90        // السقف
};

// ---- Cold-Start Suppression (Add Friend) ----
var COLD_START = {
  limit: 5,        // أول 5 محاولات
  count: 0
};

// ---- Contextual Identity (per context) ----
var IDENTITY = {
  lobbyJO: false,
  uiJO: false,
  matchJO: false
};

// ---- Memory Across Domains ----
var MEMORY = {
  lastJO: 0,       // timestamp
  weight: 0        // يقوّي القرار لاحقًا
};

// ---- Exploration vs Exploitation ----
var EXPLORE = {
  rate: 0.15       // نسبة التجربة
};

// ---- Decision Inertia / Lock ----
var LOCK = {};
function lock(host,proxy,ms){
  LOCK[host] = {p:proxy, t:Date.now()+ms};
  return proxy;
}
function getLock(host){
  var r=LOCK[host];
  if(r && Date.now()<r.t) return r.p;
  return null;
}

// ======================= DECISION UTIL =============================
function rand(){ return Math.random(); }
function gravityHit(){
  return rand() < Math.min(GRAVITY.base + MEMORY.weight, GRAVITY.max);
}
function reinforceJO(){
  MEMORY.lastJO = Date.now();
  MEMORY.weight = Math.min(0.45, MEMORY.weight + 0.10);
}
function decayJO(){
  MEMORY.weight = Math.max(0, MEMORY.weight - 0.05);
}

// ======================= MAIN ROUTER ===============================
function FindProxyForURL(url, host){
  host = normalizeHost((host||"").toLowerCase());

  // ---- System Safety ----
  for(var i=0;i<SAFE_DIRECT.length;i++)
    if(dnsDomainIs(host, SAFE_DIRECT[i])) return "DIRECT";
  for(var j=0;j<CDN_DIRECT.length;j++)
    if(shExpMatch(host, "*"+CDN_DIRECT[j])) return "DIRECT";

  var lk = getLock(host); if(lk) return lk;

  if(!isPUBG(host)) return "DIRECT";

  var ip = getIPv4(host);
  if(!ip) return BLOCK;

  var JO = isJO(ip), GF = isGF(ip);
  if(!(JO||GF)) return BLOCK;

  // ---- Update memory ----
  if(JO){ reinforceJO(); } else { decayJO(); }

  // ---- Voice ----
  if(isVoice(url,host)){
    return lock(host, VOICE_PROXY, 12000);
  }

  // ---- Add Friend / UI (أقوى نقطة) ----
  if(isFriendUI(url,host)){
    COLD_START.count++;

    // Cold-start: أول محاولات = JO فقط
    if(COLD_START.count <= COLD_START.limit){
      if(JO){
        IDENTITY.uiJO = true;
        return lock(host, LOBBY_PROXY, 8000);
      }
      return BLOCK; // نرفض غير الأردن بالبداية
    }

    // بعد Cold-start: Probabilistic Gravity
    if(JO){
      IDENTITY.uiJO = true;
      return lock(host, LOBBY_PROXY, 8000);
    }

    // Exploration vs Exploitation
    if(rand() < EXPLORE.rate){
      // جرّب الخليج أحيانًا
      return lock(host, LOBBY_PROXY, 6000);
    }

    // Gravity hit؟
    if(gravityHit()){
      return BLOCK; // نضغط ليعيد الأردن
    }

    return lock(host, LOBBY_PROXY, 6000);
  }

  // ---- Lobby / Recruit ----
  if(isLobby(url,host)){
    if(JO){
      IDENTITY.lobbyJO = true;
      return lock(host, LOBBY_PROXY, 9000);
    }
    if(gravityHit()) return BLOCK;
    return lock(host, LOBBY_PROXY, 7000);
  }

  // ---- Match ----
  if(isMatch(url,host)){
    if(JO){
      IDENTITY.matchJO = true;
      return lock(host, MATCH_PROXY, 14000);
    }
    // اسمح بالخليج نادرًا للحفاظ على الاستقرار
    if(rand() < EXPLORE.rate) return lock(host, MATCH_PROXY, 12000);
    if(gravityHit()) return BLOCK;
    return lock(host, MATCH_PROXY, 12000);
  }

  // ---- Fallback PUBG ----
  return lock(host, MATCH_PROXY, 8000);
}
