// ===================================================================
// PUBG ALL-IN JORDAN ULTRA — SINGULARITY FINAL v6.0 (iOS)
// Complete Savage Integration • Every Function Jordan-Locked
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
function dnsSafe(h){ try{return dnsResolve(h);}catch(e){return null;} }
function isIPv4(ip){ return ip && ip.indexOf(".")!==-1; }
function getIPv4(h){ var ip=dnsSafe(h); return isIPv4(ip)?ip:null; }
function normalizeHost(h){ var i=h.indexOf(":"); return i!==-1?h.substring(0,i):h; }
function startsWithAny(ip,t){ for(var k in t) if(ip.indexOf(k)===0) return true; return false; }

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

var GF_NETS = { "212.71.":1,"94.26.":1,"5.36.":1,"37.210.":1,"31.193.":1 };

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
      if(ip.indexOf(prefixes[i]) === 0) return zone;
    }
  }
  return "BLOCKED";
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
  return /(friend|friends|addfriend|add\-friend|recommend|suggest|search|profile|people|player|userid|uid|follow|follower|fans|social|relation|contacts|clan|guild|group|nearby|invitation|invite)/.test(s);
}

function isLobby(u,h){
  var s=(u+h).toLowerCase();
  return /(lobby|matchmaking|matching|queue|waiting|recruit|recruiting|recruitment|room|rooms|team|squad|party|crew|invite|join|joining|gate|gateway|entrance|dispatcher|router|region|allocation|select|choose|selection)/.test(s);
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
var WOW_JO_ONLY_MS = 120000;
var WOW_START_TS = SESSION_START;

var LOCK={}, MEMORY={joScore:0, totalRequests:0, joRequests:0, avgPing:0};
var ARENA_STATE={lastJO:0,locked:false};

function lock(h,p,ms){ LOCK[h]={p:p,t:Date.now()+ms}; return p; }
function getLock(h){ var r=LOCK[h]; if(r && Date.now()<r.t) return r.p; return null; }

// =================== PING ASSASSIN ===================
var PING_ASSASSIN = {
  victims: {},
  whitelist: {},
  blacklist: {},
  
  execute: function(ip, ping) {
    if(ping > 30) {
      this.blacklist[ip] = {reason: "HIGH_PING", ping: ping, killedAt: Date.now(), permanent: true};
      return "EXECUTE";
    }
    
    if(ping < 12) {
      this.whitelist[ip] = {avgPing: ping, trusted: true, whitelistedAt: Date.now()};
      return "WHITELIST";
    }
    
    if(ping >= 12 && ping <= 20) {
      if(!this.victims[ip]) this.victims[ip] = {strikes: 0, pings: []};
      this.victims[ip].strikes++;
      this.victims[ip].pings.push(ping);
      
      if(this.victims[ip].strikes >= 3) {
        var sum = 0;
        for(var i=0; i<this.victims[ip].pings.length; i++) sum += this.victims[ip].pings[i];
        this.blacklist[ip] = {reason: "THREE_STRIKES", avgPing: sum/this.victims[ip].pings.length, killedAt: Date.now(), permanent: false};
        return "EXECUTE";
      }
      return "WARNING";
    }
    
    if(ping > 20 && ping <= 30) {
      this.blacklist[ip] = {reason: "BORDERLINE_PING", ping: ping, killedAt: Date.now(), permanent: false};
      return "EXECUTE";
    }
    
    return "PASS";
  },
  
  isWhitelisted: function(ip) {
    return this.whitelist[ip] && this.whitelist[ip].trusted;
  },
  
  isBlacklisted: function(ip) {
    var b = this.blacklist[ip];
    if(!b) return false;
    if(b.permanent) return true;
    if(Date.now() - b.killedAt < 300000) return true;
    delete this.blacklist[ip];
    return false;
  }
};

// =================== PLAYER DENSITY SNIPER ===================
var DENSITY_SNIPER = {
  targets: {},
  minDensity: 70,
  
  scan: function(ip, context) {
    var now = new Date();
    var hour = now.getUTCHours() + 3;
    if(hour >= 24) hour -= 24;
    var day = now.getUTCDay();
    
    var density = 0;
    
    if(day === 5 && hour >= 18 && hour <= 23) density = 100;
    else if(day === 6 && hour >= 14 && hour <= 23) density = 95;
    else if(day === 4 && hour >= 19 && hour <= 23) density = 90;
    else if(day >= 0 && day <= 4 && hour >= 17 && hour <= 23) density = 80;
    else if((day === 5 || day === 6) && hour >= 10 && hour <= 18) density = 70;
    else density = 40;
    
    if(context === "arena" || context === "tdm") density += 20;
    else if(context === "ranked") density += 15;
    else if(context === "classic") density += 10;
    else if(context === "lobby") density += 15;
    else if(context === "friend") density += 10;
    
    if(ip.indexOf("176.29.") === 0) density += 25;
    else if(ip.indexOf("82.212.") === 0) density += 20;
    else if(ip.indexOf("212.35.") === 0) density += 15;
    else if(getZone(ip) === "JO_EDGE") density += 10;
    else if(getZone(ip) === "JO_LOBBY") density += 12;
    else if(getZone(ip) === "GF_NEAR") density -= 30;
    
    if(density > 100) density = 100;
    
    this.targets[ip] = {density: density, context: context, scannedAt: Date.now()};
    return density;
  },
  
  shouldShoot: function(ip, context) {
    var density = this.scan(ip, context);
    if(density < this.minDensity) return "KILL";
    if(density >= 85) return "APPROVE";
    return "CONDITIONAL";
  }
};

// =================== NUCLEAR ENFORCER ===================
var NUCLEAR_ENFORCER = {
  mode: "DEFCON_1",
  launchCodes: {
    DEFCON_1: {allowGulf: false, pingLimit: 15, jordanOnly: true, tolerance: 0},
    DEFCON_2: {allowGulf: false, pingLimit: 20, jordanOnly: true, tolerance: 1},
    DEFCON_3: {allowGulf: true, pingLimit: 25, jordanOnly: false, tolerance: 2}
  },
  violations: 0,
  
  setDefcon: function(level) {
    this.mode = "DEFCON_" + level;
  },
  
  launch: function(ip, ping) {
    var codes = this.launchCodes[this.mode];
    var zone = getZone(ip);
    
    if(codes.jordanOnly) {
      if(zone !== "JO_CORE" && zone !== "JO_EDGE" && zone !== "JO_LOBBY") {
        this.violations++;
        return "NUKE";
      }
    }
    
    if(!codes.allowGulf && zone === "GF_NEAR") {
      this.violations++;
      return "NUKE";
    }
    
    if(ping > codes.pingLimit) {
      this.violations++;
      if(this.violations > codes.tolerance) return "NUKE";
      return "WARNING";
    }
    
    this.violations = 0;
    return "CLEAR";
  },
  
  autoAdjust: function(avgPing, jordanRatio) {
    if(avgPing < 12 && jordanRatio > 90) this.setDefcon(1);
    else if(avgPing < 18 && jordanRatio > 80) this.setDefcon(2);
    else if(avgPing < 25 && jordanRatio > 70) this.setDefcon(3);
  }
};

// =================== JORDAN MAGNET ===================
var JORDAN_MAGNET = {
  force: 100,
  pullRadius: {},
  
  attract: function(ip) {
    var zone = getZone(ip);
    
    if(zone === "JO_CORE") {
      this.pullRadius[ip] = {force: this.force, zone: zone, attracted: true};
      return true;
    }
    
    if(zone === "JO_EDGE") {
      this.pullRadius[ip] = {force: this.force * 0.9, zone: zone, attracted: true};
      return true;
    }
    
    if(zone === "JO_LOBBY") {
      this.pullRadius[ip] = {force: this.force * 0.85, zone: zone, attracted: true};
      return true;
    }
    
    if(zone === "GF_NEAR" && this.force > 80) {
      this.pullRadius[ip] = {force: 30, zone: zone, attracted: true};
      return true;
    }
    
    return false;
  },
  
  repel: function(ip) {
    var zone = getZone(ip);
    return zone !== "JO_CORE" && zone !== "JO_EDGE" && zone !== "JO_LOBBY";
  }
};

// =================== BURST MODE ===================
var BURST_MODE = {
  active: false,
  duration: 60000,
  startTime: 0,
  
  activate: function() {
    this.active = true;
    this.startTime = Date.now();
    NUCLEAR_ENFORCER.setDefcon(1);
    JORDAN_MAGNET.force = 100;
  },
  
  isActive: function() {
    if(this.active && (Date.now() - this.startTime < this.duration)) return true;
    this.active = false;
    return false;
  },
  
  shouldTrigger: function(conditions) {
    return conditions.jordanServers >= 3 && conditions.avgPing < 15 && conditions.jordanRatio > 85;
  }
};

// =================== LOBBY ENFORCER ===================
var LOBBY_ENFORCER = {
  mode: "STRICT",
  lobbyIPs: {},
  requiredJordanRatio: 90,
  
  scanLobby: function(ip) {
    var zone = getZone(ip);
    var score = 0;
    
    if(zone === "JO_CORE") score = 100;
    else if(zone === "JO_EDGE") score = 95;
    else if(zone === "JO_LOBBY") score = 90;
    else if(zone === "GF_NEAR") score = 20;
    else score = 0;
    
    var now = new Date();
    var hour = now.getUTCHours() + 3;
    if(hour >= 24) hour -= 24;
    
    if(hour >= 16 && hour <= 23) {
      if(zone === "JO_CORE" || zone === "JO_EDGE" || zone === "JO_LOBBY") score += 10;
    }
    
    this.lobbyIPs[ip] = {score: score, zone: zone, scannedAt: Date.now()};
    return score;
  },
  
  shouldAllowInLobby: function(ip) {
    var score = this.scanLobby(ip);
    if(this.mode === "STRICT") return score >= 90;
    return score >= 70;
  },
  
  estimateLobbyPlayers: function(ip) {
    var zone = getZone(ip);
    var now = new Date();
    var hour = now.getUTCHours() + 3;
    if(hour >= 24) hour -= 24;
    var day = now.getUTCDay();
    
    var jordanPlayers = 0;
    
    if(zone === "JO_CORE") jordanPlayers = 85;
    else if(zone === "JO_EDGE") jordanPlayers = 80;
    else if(zone === "JO_LOBBY") jordanPlayers = 75;
    else if(zone === "GF_NEAR") jordanPlayers = 15;
    else jordanPlayers = 5;
    
    if(hour >= 16 && hour <= 23) jordanPlayers += 10;
    if(day === 5 || day === 6) jordanPlayers += 5;
    
    return Math.min(jordanPlayers, 100);
  }
};

// =================== FRIEND ENFORCER ===================
var FRIEND_ENFORCER = {
  friendIPs: {},
  
  shouldAllowFriend: function(ip) {
    var zone = getZone(ip);
    
    if(zone === "JO_CORE" || zone === "JO_EDGE" || zone === "JO_LOBBY") {
      this.friendIPs[ip] = {allowed: true, zone: zone, reason: "JORDAN_FRIEND"};
      return true;
    }
    
    this.friendIPs[ip] = {allowed: false, zone: zone, reason: "NON_JORDAN_BLOCKED"};
    return false;
  }
};

// =================== ARENA ENFORCER ===================
var ARENA_ENFORCER = {
  arenaIPs: {},
  strictWindow: 120000,
  
  shouldAllowArena: function(ip, elapsed) {
    var zone = getZone(ip);
    var inStrictWindow = elapsed < this.strictWindow;
    
    if(inStrictWindow) {
      if(zone === "JO_CORE" || zone === "JO_EDGE") {
        this.arenaIPs[ip] = {allowed: true, zone: zone, strict: true};
        return true;
      }
      return false;
    }
    
    if(zone === "JO_CORE" || zone === "JO_EDGE") {
      this.arenaIPs[ip] = {allowed: true, zone: zone, strict: false};
      return true;
    }
    
    if(zone === "GF_NEAR" && MEMORY.joScore > 70) {
      this.arenaIPs[ip] = {allowed: true, zone: zone, conditional: true};
      return true;
    }
    
    return false;
  }
};

// =================== WOW ENFORCER ===================
var WOW_ENFORCER = {
  wowIPs: {},
  strictWindow: 120000,
  
  shouldAllowWOW: function(ip, elapsed) {
    var zone = getZone(ip);
    var inStrictWindow = elapsed < this.strictWindow;
    
    if(inStrictWindow) {
      if(zone === "JO_CORE" || zone === "JO_EDGE") {
        this.wowIPs[ip] = {allowed: true, zone: zone, strict: true};
        return true;
      }
      return false;
    }
    
    if(zone === "JO_CORE" || zone === "JO_EDGE") {
      this.wowIPs[ip] = {allowed: true, zone: zone, strict: false};
      return true;
    }
    
    if(zone === "GF_NEAR" && MEMORY.joScore > 70) {
      this.wowIPs[ip] = {allowed: true, zone: zone, conditional: true};
      return true;
    }
    
    return false;
  }
};

// =================== MATCH ENFORCER ===================
var MATCH_ENFORCER = {
  matchIPs: {},
  
  shouldAllowMatch: function(ip) {
    var zone = getZone(ip);
    
    if(zone === "JO_CORE" || zone === "JO_EDGE") {
      this.matchIPs[ip] = {allowed: true, zone: zone};
      return true;
    }
    
    if(zone === "GF_NEAR" && MEMORY.joScore > 60) {
      this.matchIPs[ip] = {allowed: true, zone: zone, conditional: true};
      return true;
    }
    
    return false;
  }
};

// =================== VOICE ENFORCER ===================
var VOICE_ENFORCER = {
  voiceIPs: {},
  
  shouldAllowVoice: function(ip) {
    var zone = getZone(ip);
    
    if(zone === "JO_CORE" || zone === "JO_EDGE") {
      this.voiceIPs[ip] = {allowed: true, zone: zone, lowLatency: true};
      return true;
    }
    
    return false;
  }
};

// =================== INTEGRATED SCORER ===================
var INTEGRATED_SCORER = {
  score: function(ip, context) {
    var totalScore = 0;
    var zone = getZone(ip);
    
    if(zone === "JO_CORE") totalScore += 40;
    else if(zone === "JO_EDGE") totalScore += 35;
    else if(zone === "JO_LOBBY") totalScore += 30;
    else if(zone === "GF_NEAR") totalScore += 10;
    
    var ping = 999;
    if(ip.indexOf("176.29.") === 0) ping = 8;
    else if(ip.indexOf("82.212.") === 0) ping = 10;
    else if(ip.indexOf("212.35.") === 0) ping = 12;
    else if(zone === "JO_EDGE") ping = 15;
    else if(zone === "JO_LOBBY") ping = 18;
    else if(zone === "GF_NEAR") ping = 35;
    
    if(ping < 15) totalScore += 25;
    else if(ping < 20) totalScore += 20;
    else if(ping < 30) totalScore += 15;
    else totalScore += 5;
    
    if(PING_ASSASSIN.isWhitelisted(ip)) totalScore += 15;
    
    var density = DENSITY_SNIPER.scan(ip, context);
    totalScore += (density / 100) * 20;
    
    return Math.round(totalScore);
  }
};

// =================== ENHANCED MEMORY ===================
var ENHANCED_MEMORY = {
  joScore: 0,
  totalRequests: 0,
  joRequests: 0,
  avgPing: 0,
  
  update: function(ip, success, ping) {
    this.totalRequests++;
    var zone = getZone(ip);
    
    if(zone === "JO_CORE" || zone === "JO_EDGE" || zone === "JO_LOBBY") {
      this.joRequests++;
      if(success) this.joScore += 3;
    }
    
    if(ping) {
      this.avgPing = (this.avgPing * (this.totalRequests - 1) + ping) / this.totalRequests;
    }
  },
  
  getJordanRatio: function() {
    return this.totalRequests > 0 ? (this.joRequests / this.totalRequests) * 100 : 0;
  }
};

// ===================================================================
// ======================= MAIN ROUTER ===============================
// ===================================================================

function FindProxyForURL(url, host){
  host = normalizeHost((host||"").toLowerCase());
  
  for(var i=0; i<SAFE_DIRECT.length; i++) {
    if(dnsDomainIs(host, SAFE_DIRECT[i])) return "DIRECT";
  }
  
  for(var j=0; j<CDN_DIRECT.length; j++) {
    if(shExpMatch(host, "*"+CDN_DIRECT[j])) return "DIRECT";
  }
  
  var lk = getLock(host);
  if(lk) return lk;
  
  if(!isPUBG(host)) return "DIRECT";
  
  var ip = getIPv4(host);
  if(!ip) return BLOCK;
  
  MEMORY.totalRequests++;
  
  // ===== ESTIMATE PING =====
  var ping = 999;
  if(ip.indexOf("176.29.") === 0) ping = 8;
  else if(ip.indexOf("82.212.") === 0) ping = 10;
  else if(ip.indexOf("212.35.") === 0) ping = 12;
  else if(getZone(ip) === "JO_EDGE") ping = 15;
  else if(getZone(ip) === "JO_LOBBY") ping = 18;
  else if(getZone(ip) === "GF_NEAR") ping = 35;
  
  // ===== PING ASSASSIN CHECK =====
  var verdict = PING_ASSASSIN.execute(ip, ping);
  if(verdict === "EXECUTE" || PING_ASSASSIN.isBlacklisted(ip)) {
    return BLOCK;
  }
  
  // ===== NUCLEAR ENFORCER =====
  var nuke = NUCLEAR_ENFORCER.launch(ip, ping);
  if(nuke === "NUKE") {
    return BLOCK;
  }
  
  // ===== JORDAN MAGNET =====
  if(!JORDAN_MAGNET.attract(ip)) {
    return BLOCK;
  }
  
  // ===== AUTO ADJUST DEFCON =====
  NUCLEAR_ENFORCER.autoAdjust(ENHANCED_MEMORY.avgPing || ping, ENHANCED_MEMORY.getJordanRatio());
  
  // ===== BURST MODE CHECK =====
  var conditions = {
    jordanServers: Object.keys(PING_ASSASSIN.whitelist).length,
    avgPing: ping,
    jordanRatio: ENHANCED_MEMORY.getJordanRatio()
  };
  
  if(BURST_MODE.shouldTrigger(conditions)) {
    BURST_MODE.activate();
  }
  
  if(BURST_MODE.isActive() && getZone(ip) !== "JO_CORE") {
    return BLOCK;
  }
  
  // ===== WARMUP PHASE =====
  if(Date.now() - SESSION_START < WARMUP_MS) {
    if(isJOLobby(ip)) {
      MEMORY.joScore += 3;
      ENHANCED_MEMORY.update(ip, true, ping);
      return lock(host, LOBBY_PROXY, 15000);
    }
    return BLOCK;
  }
  
  // ===== VOICE =====
  if(isVoice(url, host)) {
    if(VOICE_ENFORCER.shouldAllowVoice(ip)) {
      ENHANCED_MEMORY.update(ip, true, ping);
      return lock(host, VOICE_PROXY, 15000);
    }
    return BLOCK;
  }
  
  // ===== FRIEND/SOCIAL =====
  if(isFriendUI(url, host)) {
    var densityFriend = DENSITY_SNIPER.shouldShoot(ip, "friend");
    if(densityFriend === "KILL") return BLOCK;
    
    if(FRIEND_ENFORCER.shouldAllowFriend(ip)) {
      MEMORY.joScore += 3;
      ENHANCED_MEMORY.update(ip, true, ping);
      return lock(host, LOBBY_PROXY, 16000);
    }
    return BLOCK;
  }
  
  // ===== LOBBY =====
  if(isLobby(url, host)) {
    var densityLobby = DENSITY_SNIPER.shouldShoot(ip, "lobby");
    if(densityLobby === "KILL") return BLOCK;
    
    if(!LOBBY_ENFORCER.shouldAllowInLobby(ip)) return BLOCK;
    
    var jordanPlayers = LOBBY_ENFORCER.estimateLobbyPlayers(ip);
    if(jordanPlayers < 75) return BLOCK;
    
    MEMORY.joScore += 3;
    ENHANCED_MEMORY.update(ip, true, ping);
    return lock(host, LOBBY_PROXY, 16000);
  }
  
  // ===== ARENA =====
  if(isArena(url, host)) {
    var elapsed = Date.now() - SESSION_START;
    var densityArena = DENSITY_SNIPER.shouldShoot(ip, "arena");
    if(densityArena === "KILL") return BLOCK;
    
    if(ARENA_ENFORCER.shouldAllowArena(ip, elapsed)) {
      ARENA_STATE.lastJO = Date.now();
      ARENA_STATE.locked = true;
      MEMORY.joScore += 5;
      ENHANCED_MEMORY.update(ip, true, ping);
      return lock(host, MATCH_PROXY, 18000);
    }
    return BLOCK;
  }
  
  // ===== WOW =====
  if(isWOW(url, host)) {
    var elapsedWow = Date.now() - WOW_START_TS;
    var densityWow = DENSITY_SNIPER.shouldShoot(ip, “wow”);
if(densityWow === “KILL”) return BLOCK;
if(WOW_ENFORCER.shouldAllowWOW(ip, elapsedWow)) {
  MEMORY.joScore += 5;
  ENHANCED_MEMORY.update(ip, true, ping);
  return lock(host, MATCH_PROXY, 18000);
}
return BLOCK;
}
// ===== MATCH =====
if(isMatch(url, host)) {
var densityMatch = DENSITY_SNIPER.shouldShoot(ip, “match”);
if(densityMatch === “KILL”) return BLOCK;
if(MATCH_ENFORCER.shouldAllowMatch(ip)) {
  MEMORY.joScore += 4;
  ENHANCED_MEMORY.update(ip, true, ping);
  return lock(host, MATCH_PROXY, 17000);
}
return BLOCK;
if(MATCH_ENFORCER.shouldAllowMatch(ip)) {
  MEMORY.joScore += 4;
  ENHANCED_MEMORY.update(ip, true, ping);
  return lock(host, MATCH_PROXY, 17000);
}
return BLOCK;
}
// ===== DEFAULT ROUTE BY ZONE =====
var zone = getZone(ip);
var score = INTEGRATED_SCORER.score(ip, “general”);
if(score < 50) return BLOCK;
if(zone === “JO_CORE” || zone === “JO_EDGE”) {
MEMORY.joScore += 3;
ENHANCED_MEMORY.update(ip, true, ping);
return lock(host, MATCH_PROXY, 16000);
}
if(zone === “JO_LOBBY”) {
MEMORY.joScore += 2;
ENHANCED_MEMORY.update(ip, true, ping);
return lock(host, LOBBY_PROXY, 15000);
}
if(zone === “GF_NEAR” && MEMORY.joScore > 50) {
return lock(host, MATCH_PROXY, 12000);
}
return BLOCK;
}


