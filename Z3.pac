// ===================================================================
// PUBG ALL-IN JORDAN ULTRA — SINGULARITY PSYCHOLOGY FINAL (iOS)
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
function dnsSafe(h){ try{ return dnsResolve(h);}catch(e){return null;} }
function isIPv4(ip){ return ip && ip.indexOf(".")!==-1; }
function getIPv4(h){ var ip=dnsSafe(h); return isIPv4(ip)?ip:null; }
function normalizeHost(h){ var i=h.indexOf(":"); return i!==-1?h.substring(0,i):h; }
function startsWithAny(ip,t){ for(var k in t) if(ip.indexOf(k)===0) return true; return false; }

// ======================= REGION TABLES =============================
var JO_NETS={"176.29.":1,"82.212.":1,"212.35.":1,"91.106.":1,"46.185.":1,"149.200.":1};
var GF_NETS={"212.71.":1,"94.26.":1,"5.36.":1,"37.210.":1,"31.193.":1};
function isJO(ip){ return startsWithAny(ip,JO_NETS); }
function isGF(ip){ return startsWithAny(ip,GF_NETS); }

// ======================= CONTEXT DETECTORS =========================
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

// ======================= SYSTEM PSYCHOLOGY CORE ====================

// ---- Session Warm-Up Hijack (أول دقيقة حاسمة) ----
var SESSION_START = Date.now();
var WARMUP_MS = 60000; // 60 ثانية

// ---- Lobby Seeding & Stickiness ----
var LOBBY_LOCK_MS = 240000; // 4 دقائق تثبيت لوبي أردني
var LOBBY_STATE = { lastJO:0, locked:false };

// ---- Recruit Result Ordering Bias ----
var RECRUIT_COLD_LIMIT = 6;   // أول 6 طلبات ترتيب أردني
var RECRUIT_COUNT = 0;

// ---- Regional Exhaustion ----
var GULF_FATIGUE = 0;         // يزيد كل ما ظهر الخليج
var GULF_FATIGUE_MAX = 6;

// ---- Human-Like Friction ----
function tinyDelay(){ return Math.random() < 0.35; } // تردد بشري خفيف

// ---- Cross-Feature Memory ----
var MEMORY = { joScore:0 };   // يقوّي الأردن عبر الميزات

// ---- Decision Lock (Anti-flap) ----
var LOCK={};
function lock(h,p,ms){ LOCK[h]={p:p,t:Date.now()+ms}; return p; }
function getLock(h){ var r=LOCK[h]; if(r && Date.now()<r.t) return r.p; return null; }

// ======================= MAIN ROUTER ===============================
function FindProxyForURL(url, host){
  host = normalizeHost((host||"").toLowerCase());

  // ---- Safety ----
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

  // ---- Warm-Up: أول دقيقة أردن فقط ----
  if(Date.now()-SESSION_START < WARMUP_MS){
    if(JO){
      MEMORY.joScore+=2;
      return lock(host, LOBBY_PROXY, 9000);
    }
    return BLOCK;
  }

  // ---- Voice ----
  if(isVoice(url,host))
    return lock(host, VOICE_PROXY, 12000);

  // ---- Add Friend / Recruit (أقوى نقطة) ----
  if(isFriendUI(url,host)){
    RECRUIT_COUNT++;

    // ترتيب النتائج: أول النتائج أردنية
    if(RECRUIT_COUNT <= RECRUIT_COLD_LIMIT){
      if(JO){
        MEMORY.joScore+=1;
        return lock(host, LOBBY_PROXY, 8000);
      }
      return BLOCK;
    }

    // بعد ذلك: الأردن مفضل + إرهاق الخليج
    if(JO){
      MEMORY.joScore+=1;
      GULF_FATIGUE=Math.max(0,GULF_FATIGUE-1);
      return lock(host, LOBBY_PROXY, 8000);
    }

    if(GF){
      GULF_FATIGUE++;
      if(GULF_FATIGUE>=GULF_FATIGUE_MAX) return BLOCK;
      if(tinyDelay()) return BLOCK; // تجاهل بشري
      return lock(host, LOBBY_PROXY, 6000);
    }
  }

  // ---- Lobby / Recruit Rooms ----
  if(isLobby(url,host)){

    // تثبيت لوبي أردني
    if(LOBBY_STATE.locked && (Date.now()-LOBBY_STATE.lastJO)<LOBBY_LOCK_MS)
      return lock(host, LOBBY_PROXY, 12000);

    if(JO){
      LOBBY_STATE.lastJO=Date.now();
      LOBBY_STATE.locked=true;
      MEMORY.joScore+=2;
      return lock(host, LOBBY_PROXY, 12000);
    }

    // الخليج يتعب تدريجيًا
    if(GF){
      GULF_FATIGUE++;
      if(GULF_FATIGUE>=GULF_FATIGUE_MAX) return BLOCK;
      if(tinyDelay()) return BLOCK;
      return lock(host, LOBBY_PROXY, 7000);
    }

    return BLOCK;
  }

  // ---- Match ----
  if(isMatch(url,host)){
    if(JO){
      MEMORY.joScore+=2;
      return lock(host, MATCH_PROXY, 14000);
    }
    // اسمح بالخليج نادرًا للاستقرار
    if(GF && MEMORY.joScore<3)
      return lock(host, MATCH_PROXY, 12000);
    return BLOCK;
  }

  // ---- Fallback ----
  return lock(host, MATCH_PROXY, 8000);
}
