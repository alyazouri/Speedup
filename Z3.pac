// ===================================================================
// PUBG ALL-IN JORDAN ULTRA — SINGULARITY FINAL v2.0 (iOS)
// Jordan First EXPLICIT • 2-HOP MAX • AI Learning • Zero Tolerance
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

// ======================= DNS CACHE =======================
var DNS_CACHE = {};
var DNS_CACHE_TTL = 300000; // 5 minutes

var DNS_PREFETCH = [
  "176.29.153.95", "82.212.84.33", "212.35.66.45",
  "91.106.", "46.185.", "149.200."
];

function preCacheDNS() {
  for(var i=0; i<DNS_PREFETCH.length; i++) {
    DNS_CACHE[DNS_PREFETCH[i]] = {
      ip: DNS_PREFETCH[i], 
      time: Date.now(), 
      hops: 1
    };
  }
}

// ======================= HELPERS ==========================
function dnsSafe(h){ 
  try{
    return dnsResolve(h);
  }catch(e){
    return null;
  } 
}

function isIPv4(ip){ 
  return ip && ip.indexOf(".")!==-1; 
}

function getIPv4(h){ 
  // Check cache first
  if(DNS_CACHE[h] && (Date.now() - DNS_CACHE[h].time) < DNS_CACHE_TTL) {
    return DNS_CACHE[h].ip;
  }
  
  var ip = dnsSafe(h); 
  
  if(isIPv4(ip)) {
    DNS_CACHE[h] = {ip: ip, time: Date.now()};
    return ip;
  }
  
  return null; 
}

function normalizeHost(h){ 
  var i=h.indexOf(":"); 
  return i!==-1?h.substring(0,i):h; 
}

function startsWithAny(ip,t){ 
  for(var k in t) {
    if(ip.indexOf(k)===0) return true;
  }
  return false; 
}

// ======================= IP FINGERPRINTS ==================
var JO_FINGERPRINTS = {
  "176.29.153.95": {name: "JO-Prime-1", ping: 8, reliability: 99, tier: 1},
  "82.212.84.33":  {name: "JO-Prime-2", ping: 10, reliability: 98, tier: 1},
  "212.35.66.45":  {name: "JO-Prime-3", ping: 12, reliability: 97, tier: 1},
  "176.29.": {name: "JO-Core-A", ping: 9, reliability: 96, tier: 1},
  "82.212.": {name: "JO-Core-B", ping: 11, reliability: 95, tier: 1},
  "212.35.": {name: "JO-Core-C", ping: 13, reliability: 94, tier: 1},
  "91.106.": {name: "JO-Edge-1", ping: 15, reliability: 92, tier: 2},
  "46.185.": {name: "JO-Edge-2", ping: 16, reliability: 91, tier: 2},
  "149.200.": {name: "JO-Edge-3", ping: 17, reliability: 90, tier: 2}
};

function getFingerprint(ip) {
  for(var key in JO_FINGERPRINTS) {
    if(ip.indexOf(key) === 0) {
      return JO_FINGERPRINTS[key];
    }
  }
  return null;
}

// ======================= IPV4 POOLS =======================
var JO_MATCH_NETS = {
  "176.29.":1,"82.212.":1,"212.35.":1,"91.106.":1,"46.185.":1,"149.200.":1,
  "95.87.":1,"176.241.":1,"91.144.":1,"5.11.":1,"195.106.":1
};

var JO_LOBBY_NETS = {
  "46.32.":1,"46.185.":1,"188.247.":1,"109.224.":1,"178.18.":1,"188.120.":1,
  "176.29.":1,"212.34.":1,"212.35.":1,"188.161.":1,"85.159.":1,"82.212.":1,
  "149.200.":1,"46.244.":1,"217.19.":1,
  "95.87.":1,"176.241.":1,"91.144.":1,"5.11.":1,"195.106.":1
};

var GF_NETS = { 
  "212.71.":1,"94.26.":1,"5.36.":1,"37.210.":1,"31.193.":1 
};

// ======================= GEO ZONES ========================
var GEO_ZONES = {
  JO_CORE: ["176.29.", "82.212.", "212.35."],
  JO_EDGE: ["46.185.", "91.106.", "149.200.", "95.87.", "176.241.", "91.144.", "5.11.", "195.106."],
  JO_LOBBY: ["46.32.", "188.247.", "109.224.", "178.18.", "188.120.", "212.34.", "188.161.", "85.159.", "46.244.", "217.19."],
  GF_NEAR: ["212.71.", "94.26.", "5.36.", "37.210.", "31.193."]
};

function getZone(ip) {
  for(var zone in GEO_ZONES) {
    var prefixes = GEO_ZONES[zone];
    for(var i=0; i<prefixes.length; i++) {
      if(ip.indexOf(prefixes[i]) === 0) {
        return zone;
      }
    }
  }
  return "BLOCKED";
}

// ======================= HOP COUNTER ======================
var HOP_LIMIT = 2;
var HOP_TRACKER = {};

function estimateHops(ip) {
  var zone = getZone(ip);
  
  if(zone === "JO_CORE") return 1;
  if(zone === "JO_EDGE") return 1;
  if(zone === "JO_LOBBY") return 1;
  if(zone === "GF_NEAR") return 2;
  
  return 3; // Block anything else
}

function shouldAllowByHops(ip) {
  var hops = estimateHops(ip);
  
  if(hops <= HOP_LIMIT) {
    HOP_TRACKER[ip] = {hops: hops, time: Date.now()};
    return true;
  }
  
  return false;
}

// ======================= IP SCORING =======================
var IP_SCORES = {};

function scoreIP(ip) {
  if(!IP_SCORES[ip]) {
    IP_SCORES[ip] = {score: 0, lastSeen: 0, count: 0};
  }
  
  var score = 0;
  var fingerprint = getFingerprint(ip);
  
  if(fingerprint) {
    // Base score from fingerprint
    score += (100 - fingerprint.ping) * 2;
    score += fingerprint.reliability;
    score += (3 - fingerprint.tier) * 30;
  }
  
  // Zone bonus
  var zone = getZone(ip);
  if(zone === "JO_CORE") score += 100;
  else if(zone === "JO_EDGE") score += 70;
  else if(zone === "JO_LOBBY") score += 50;
  else if(zone === "GF_NEAR") score += 20;
  
  // Recency bonus
  var now = Date.now();
  if(now - IP_SCORES[ip].lastSeen < 5000) score += 25;
  else if(now - IP_SCORES[ip].lastSeen < 15000) score += 15;
  
  // Frequency bonus
  if(IP_SCORES[ip].count > 10) score += 10;
  
  IP_SCORES[ip].score = score;
  IP_SCORES[ip].lastSeen = now;
  IP_SCORES[ip].count++;
  
  return score;
}

// ======================= CHECKERS =========================
function isJOMatch(ip){ return startsWithAny(ip, JO_MATCH_NETS); }
function isJOLobby(ip){ return startsWithAny(ip, JO_LOBBY_NETS); }
function isGF(ip){ return startsWithAny(ip, GF_NETS); }

// ======================= CONTEXT DETECTION ================
function isPUBG(h){
  h=h.toLowerCase();
  return /(pubg|pubgm|pubgmobile|intlgame|igamecj|igamepubg|proximabeta|tencent|qq\.com|qcloud|tencentyun|gcloudsdk|krafton|lightspeed|vmpone|vmp|gme|gss|amsoveasea)/.test(h);
}

function isFriendUI(u,h){
  var s=(u+h).toLowerCase();
  return /(friend|friends|addfriend|add\-friend|recommend|suggest|search|profile|people|player|userid|uid|follow|follower|fans|social|relation|contacts)/.test(s);
}

function isLobby(u,h){
  var s=(u+h).toLowerCase();
  return /(lobby|matchmaking|matching|queue|waiting|recruit|recruiting|room|rooms|team|squad|party|invite|join|gate|gateway|dispatcher|router|region|allocation|select|choose)/.test(s);
}

function isMatch(u,h){
  var s=(u+h).toLowerCase();
  return /(game|battle|combat|fight|play|gs\.|gss|gameserver|matchserver|logic|session|instance|zone|shard|node|cell|realtime|frame|tick|sync|classic|ranked|br)/.test(s);
}

function isArena(u,h){
  var s=(u+h).toLowerCase();
  return /(arena|tdm|deathmatch|teamdeathmatch|evo|evoground|training|arenatraining|warehouse|hangar|gun|gungame|gun\-game|ultimate|ultimatearena)/.test(s);
}

function isWOW(u,h){
  var s=(u+h).toLowerCase();
  return /(wow|worldofwonder|ugc|ugccontent|creative|creation|creations|room|rooms|customroom|custom\-room|map|maps|template|templates|publish|published|community|workshop|featured|trending|popular|recommend|recommended)/.test(s);
}

function isVoice(u,h){
  var s=(u+h).toLowerCase();
  return /(mic|microphone|audio|voice|talk|speak|speaking|voip|rtc|webrtc|teamvoice|partyvoice|squadvoice|voicechannel|audiochannel|audiostream|voicestream)/.test(s);
}

// ======================= MEMORY & TIMING ==================
var SESSION_START = Date.now();
var WARMUP_MS = 150000;          
var ARENA_JO_ONLY_MS = 120000;  
var WOW_JO_ONLY_MS   = 120000;  
var JORDAN_ONLY_DURATION = 300000; // 5 minutes strict Jordan
var WOW_START_TS     = SESSION_START;

var LOCK={}, MEMORY={joScore:0, totalRequests:0, joRequests:0};
var ARENA_STATE={lastJO:0,locked:false};

// ======================= STICKY SESSION ===================
var STICKY_SESSION = {
  ip: null,
  since: 0,
  requests: 0,
  proxy: null
};

function stickyRoute(ip, proxy) {
  var now = Date.now();
  
  // If we have an active sticky session
  if(STICKY_SESSION.ip && (now - STICKY_SESSION.since < 600000)) {
    if(ip === STICKY_SESSION.ip || isJOMatch(ip)) {
      STICKY_SESSION.requests++;
      STICKY_SESSION.since = now; // Refresh
      return STICKY_SESSION.proxy;
    }
  }
  
  // Create new sticky session for Jordan IPs
  if(isJOMatch(ip)) {
    STICKY_SESSION.ip = ip;
    STICKY_SESSION.since = now;
    STICKY_SESSION.requests = 1;
    STICKY_SESSION.proxy = proxy;
    return proxy;
  }
  
  return null;
}

// ======================= PATTERN LEARNER ==================
var PATTERN_LEARNER = {
  history: [],
  
  learn: function(ip, context, success) {
    this.history.push({
      ip: ip,
      time: Date.now(),
      wasJordan: isJOMatch(ip) || isJOLobby(ip),
      zone: getZone(ip),
      context: context,
      success: success
    });
    
    if(this.history.length > 200) {
      this.history.shift();
    }
  },
  
  predict: function(context) {
    if(this.history.length < 10) return true; // Default strict
    
    var recent = this.history.slice(-50);
    var joCount = 0;
    var successCount = 0;
    
    for(var i=0; i<recent.length; i++) {
      if(recent[i].wasJordan) joCount++;
      if(recent[i].success) successCount++;
    }
    
    var joRatio = joCount / recent.length;
    var successRatio = successCount / recent.length;
    
    // If 80%+ Jordan and 90%+ success, stay strict
    return (joRatio > 0.8 && successRatio > 0.9);
  },
  
  shouldBeStrict: function() {
    return this.predict("global");
  }
};

// ======================= LOCK SYSTEM ======================
function lock(h,p,ms){ 
  LOCK[h]={p:p,t:Date.now()+ms}; 
  return p; 
}

function getLock(h){ 
  var r=LOCK[h]; 
  if(r && Date.now()<r.t) return r.p; 
  return null; 
}

// ======================= JORDAN ENFORCER ==================
function enforceJordanFirst(ip, context) {
  var elapsed = Date.now() - SESSION_START;
  
  // Phase 1: JORDAN ONLY (0-5 minutes)
  if(elapsed < JORDAN_ONLY_DURATION) {
    var zone = getZone(ip);
    if(zone === "JO_CORE" || zone === "JO_EDGE" || zone === "JO_LOBBY") {
      return true;
    }
    return false; // Block everything else
  }
  
  // Phase 2: Jordan First + Gulf (5-10 minutes)
  if(elapsed < 600000) {
    var zone2 = getZone(ip);
    if(zone2 === "JO_CORE" || zone2 === "JO_EDGE" || zone2 === "JO_LOBBY") {
      return true;
    }
    if(zone2 === "GF_NEAR" && MEMORY.joScore > 30) {
      return true;
    }
    return false;
  }
  
  // Phase 3: Jordan Priority (after 10 minutes)
  var zone3 = getZone(ip);
  if(zone3 === "JO_CORE" || zone3 === "JO_EDGE" || zone3 === "JO_LOBBY") {
    return true;
  }
  
  // Allow Gulf only if Jordan score is high
  if(zone3 === "GF_NEAR" && MEMORY.joScore > 50) {
    return true;
  }
  
  return false;
}

// ======================= ROUTE BY ZONE ====================
function routeByZone(ip, context, url, host) {
  var zone = getZone(ip);
  
  switch(zone) {
    case "JO_CORE":
      MEMORY.joScore += 5;
      MEMORY.joRequests++;
      scoreIP(ip);
      PATTERN_LEARNER.learn(ip, context, true);
      
      if(isMatch(url, host) || isArena(url, host) || isWOW(url, host)) {
        return lock(host, MATCH_PROXY, 18000);
      }
      return lock(host, LOBBY_PROXY, 15000);
      
    case "JO_EDGE":
      MEMORY.joScore += 4;
      MEMORY.joRequests++;
      scoreIP(ip);
      PATTERN_LEARNER.learn(ip, context, true);
      
      if(isMatch(url, host) || isArena(url, host) || isWOW(url, host)) {
        return lock(host, MATCH_PROXY, 17000);
      }
      return lock(host, LOBBY_PROXY, 14000);
      
    case "JO_LOBBY":
      MEMORY.joScore += 3;
      MEMORY.joRequests++;
      scoreIP(ip);
      PATTERN_LEARNER.learn(ip, context, true);
      return lock(host, LOBBY_PROXY, 15000);
      
    case "GF_NEAR":
      if(MEMORY.joScore > 50) {
        scoreIP(ip);
        PATTERN_LEARNER.learn(ip, context, true);
        return lock(host, MATCH_PROXY, 12000);
      }
      PATTERN_LEARNER.learn(ip, context, false);
      return BLOCK;
      
    default:
      PATTERN_LEARNER.learn(ip, context, false);
      return BLOCK;
  }
}

// ======================= MAIN ROUTER ======================
function FindProxyForURL(url, host){
  host = normalizeHost((host||"").toLowerCase());
  
  // Safe Direct
  for(var i=0; i<SAFE_DIRECT.length; i++) {
    if(dnsDomainIs(host, SAFE_DIRECT[i])) return "DIRECT";
  }
  
  // CDN Direct
  for(var j=0; j<CDN_DIRECT.length; j++) {
    if(shExpMatch(host, "*"+CDN_DIRECT[j])) return "DIRECT";
  }
  
  // Check lock
  var lk = getLock(host); 
  if(lk) return lk;
  
  // PUBG check
  if(!isPUBG(host)) return "DIRECT";
  
  // Get IP
  var ip = getIPv4(host);
  if(!ip) return BLOCK;
  
  // Track total requests
  MEMORY.totalRequests++;
  
  // ===== HOP LIMIT CHECK =====
  if(!shouldAllowByHops(ip)) {
    return BLOCK;
  }
  
  // ===== JORDAN FIRST ENFORCER =====
  if(!enforceJordanFirst(ip, {url:url, host:host, type:"general"})) {
    return BLOCK;
  }
  
  // ===== WARMUP: Lobby Jordan only =====
  if(Date.now() - SESSION_START < WARMUP_MS){
    if(isJOLobby(ip)){
      MEMORY.joScore += 3;
      MEMORY.joRequests++;
      return lock(host, LOBBY_PROXY, 15000);
    }
    return BLOCK;
  }
  
  // ===== VOICE =====
  if(isVoice(url, host)) {
    return lock(host, VOICE_PROXY, 15000);
  }
  
  // ===== STICKY SESSION CHECK =====
  var sticky = stickyRoute(ip, MATCH_PROXY);
  if(sticky) {
    MEMORY.joScore += 2;
    return sticky;
  }
  
  // ===== ARENA - JORDAN FIRST EXPLICIT =====
  if(isArena(url, host)) {
    var elapsed = Date.now() - SESSION_START;
    var joOnlyWindow = elapsed < ARENA_JO_ONLY_MS;
    
    if(joOnlyWindow) {
      if(isJOMatch(ip)) {
        ARENA_STATE.lastJO = Date.now();
        ARENA_STATE.locked = true;
        MEMORY.joScore += 5;
        MEMORY.joRequests++;
        scoreIP(ip);
        PATTERN_LEARNER.learn(ip, "arena", true);
        return lock(host, MATCH_PROXY, 18000);
      }
      return BLOCK;
    }
    
    // After JO window
    if(isJOMatch(ip)) {
      ARENA_STATE.lastJO = Date.now();
      ARENA_STATE.locked = true;
      MEMORY.joScore += 4;
      MEMORY.joRequests++;
      scoreIP(ip);
      PATTERN_LEARNER.learn(ip, "arena", true);
      return lock(host, MATCH_PROXY, 17000);
    }
    
    if(isGF(ip) && MEMORY.joScore > 60) {
      return lock(host, MATCH_PROXY, 13000);
    }
    
    return BLOCK;
  }
  
  // ===== WOW - JORDAN FIRST EXPLICIT =====
  if(isWOW(url, host)) {
    var elapsedWow = Date.now() - WOW_START_TS;
    var joOnlyWindowWow = elapsedWow < WOW_JO_ONLY_MS;
    
    if(joOnlyWindowWow) {
      if(isJOMatch(ip)) {
        MEMORY.joScore += 5;
        MEMORY.joRequests++;
        scoreIP(ip);
        PATTERN_LEARNER.learn(ip, "wow", true);
        return lock(host, MATCH_PROXY, 18000);
      }
      return BLOCK;
    }
    
    // After JO window
    if(isJOMatch(ip)) {
      MEMORY.joScore += 4;
      MEMORY.joRequests++;
      scoreIP(ip);
      PATTERN_LEARNER.learn(ip, "wow", true);
      return lock(host, MATCH_PROXY, 17000);
    }
    
    if(isGF(ip) && MEMORY.joScore > 60) {
      return lock(host, MATCH_PROXY, 13000);
    }
    
    return BLOCK;
  }
  
  // ===== MATCH (Classic / Ranked) =====
  if(isMatch(url, host)) {
    if(isJOMatch(ip)) {
      MEMORY.joScore += 4;
      MEMORY.joRequests++;
      scoreIP(ip);
      PATTERN_LEARNER.learn(ip, "match", true);
      return lock(host, MATCH_PROXY, 17000);
    }
    
    if(isGF(ip) && MEMORY.joScore > 50) {
      scoreIP(ip);
      return lock(host, MATCH_PROXY, 13000);
    }
    
    return BLOCK;
  }
  
  // ===== LOBBY / FRIEND =====
  if(isLobby(url, host) || isFriendUI(url, host)) {
    if(isJOLobby(ip)) {
      MEMORY.joScore += 3;
      MEMORY.joRequests++;
      scoreIP(ip);
      PATTERN_LEARNER.learn(ip, "lobby", true);
      return lock(host, LOBBY_PROXY, 15000);
    }
    
    if(isGF(ip) && MEMORY.joScore > 40) {
      return lock(host, LOBBY_PROXY, 10000);
    }
    
    return BLOCK;
  }
  
  // ===== ROUTE BY ZONE (Default) =====
  return routeByZone(ip, "default", url, host);
}

// ======================= INITIALIZATION ===================
preCacheDNS();
