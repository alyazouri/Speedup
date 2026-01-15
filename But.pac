// =====================================================
// JoMe1_JO_PRIORITY_WITH_SCHEDULED_BOTS.pac
// =====================================================
// 🎯 الاستراتيجية:
// - من 9 صباحاً → 5 مساءً: بوتات فورية (Fast Match)
// - باقي الأوقات: لاعبين أردنيين أولاً
// =====================================================

// ============================================================
// 1. PROXY CONFIGURATION
// ============================================================
var JORDAN_PRIMARY = "PROXY 176.29.153.95:20001";
var JORDAN_FALLBACK = "PROXY 212.35.66.45:20001";
var BOT_FILLER_PROXY = "PROXY 176.29.153.95:9030"; // سيرفر بوتات
var FAST_MATCH_PROXY = "PROXY 176.29.153.50:20001"; // سيرفر سريع
var BLOCK = "PROXY 127.0.0.1:9";

// ============================================================
// 2. BOT SCHEDULE CONFIGURATION
// ============================================================
var BOT_SCHEDULE = {
  startHour: 9,   // 9 صباحاً
  endHour: 17,    // 5 مساءً (17:00)
  
  // أوقات البوتات الإضافية (اختياري)
  additionalBotHours: [
    3, 4, 5, 6, 7   // فجراً (3-7 صباحاً) أيضاً بوتات
  ],
  
  // أيام البوتات (true = كل الأيام)
  enabledDays: {
    sunday: true,    // الأحد
    monday: true,    // الاثنين
    tuesday: true,   // الثلاثاء
    wednesday: true, // الأربعاء
    thursday: true,  // الخميس
    friday: true,    // الجمعة
    saturday: true   // السبت
  }
};

// ============================================================
// 3. TIMING CONFIGURATION
// ============================================================
// أوقات البوتات: دخول فوري
var BOT_TIME_FORCE_MS = 3000;        // 3 ثواني فقط
var BOT_TIME_MAX_QUEUE_MS = 5000;    // 5 ثواني max

// أوقات اللاعبين: انتظار معقول
var PLAYER_TIME_FORCE_MS = 15000;    // 15 ثانية
var PLAYER_TIME_MAX_QUEUE_MS = 25000; // 25 ثانية max

var queueStartTime = {};
var matchAttempts = {};

// ============================================================
// 4. SYSTEM WHITELIST
// ============================================================
var SAFE_DIRECT = [
  "captive.apple.com","time.apple.com","ocsp.apple.com",
  "clients3.google.com","connectivitycheck.gstatic.com"
];

var CDN_DIRECT = ["googlevideo.com","ytimg.com"];

// ============================================================
// 5. JORDAN IP POOLS
// ============================================================

// Premium Jordan IPs (أفضل لاعبين)
var JO_PREMIUM = {
  "176.29.":1,  // Orange
  "82.212.":1,  // Zain
  "212.35.":1,  // Batelco
  "94.249.":1   // Orange Business
};

// Extended Jordan Pool
var JO_EXTENDED = {
  "176.29.":1, "82.212.":1, "212.34.":1, "212.35.":1, "94.249.":1,
  "46.185.":1, "85.159.":1, "37.123.":1, "37.8.":1, "46.32.":1,
  "188.247.":1, "91.144.":1, "141.105.":1, "185.14.":1, "83.244.":1,
  "87.236.":1, "212.118.":1, "95.87.":1, "176.241.":1, "91.185.":1,
  "195.106.":1, "178.18.":1, "5.11.":1, "193.188.":1, "31.186.":1,
  "109.224.":1, "195.229.":1, "37.48.":1, "188.161.":1, "185.107.":1,
  "176.9.":1, "213.6.":1, "62.150.":1, "193.0.":1, "91.106.":1,
  "46.244.":1, "185.126.":1, "188.120.":1, "77.44.":1, "217.19.":1
};

// Bot Servers (سيرفرات قليلة اللاعبين)
var JO_BOT_SERVERS = {
  "176.29.153.50":1,
  "212.34.100.20":1,
  "82.212.50.10":1
};

// ============================================================
// 6. TIME DETECTION & BOT SCHEDULE
// ============================================================

/**
 * تحقق: هل الوقت الحالي ضمن وقت البوتات؟
 */
function isBotTime() {
  var now = new Date();
  var hour = now.getHours();
  var day = now.getDay(); // 0=Sunday, 6=Saturday
  
  // تحقق من اليوم
  var dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  var currentDay = dayNames[day];
  
  if (!BOT_SCHEDULE.enabledDays[currentDay]) {
    return false; // اليوم مو مفعّل للبوتات
  }
  
  // تحقق من الساعة الأساسية (9 صباحاً - 5 مساءً)
  var inMainSchedule = (hour >= BOT_SCHEDULE.startHour && hour < BOT_SCHEDULE.endHour);
  
  // تحقق من الساعات الإضافية
  var inAdditionalHours = false;
  for (var i = 0; i < BOT_SCHEDULE.additionalBotHours.length; i++) {
    if (hour === BOT_SCHEDULE.additionalBotHours[i]) {
      inAdditionalHours = true;
      break;
    }
  }
  
  return inMainSchedule || inAdditionalHours;
}

/**
 * تحقق: هل وقت الذروة (كثير لاعبين)؟
 */
function isPeakPlayerTime() {
  var hour = new Date().getHours();
  var day = new Date().getDay();
  
  // أوقات الذروة خارج وقت البوتات
  return (
    (hour >= 18 && hour <= 23) ||  // مساءً 6-11
    (day === 5 && hour >= 13 && hour <= 17) // جمعة بعد الظهر
  );
}

/**
 * احصل على استراتيجية الوقت
 */
function getTimeStrategy() {
  var botTime = isBotTime();
  var peakTime = isPeakPlayerTime();
  
  return {
    isBotTime: botTime,
    isPeakTime: peakTime,
    forceBotTimeout: botTime ? BOT_TIME_FORCE_MS : PLAYER_TIME_FORCE_MS,
    maxQueueTimeout: botTime ? BOT_TIME_MAX_QUEUE_MS : PLAYER_TIME_MAX_QUEUE_MS,
    preferBots: botTime
  };
}

// ============================================================
// 7. HELPER FUNCTIONS
// ============================================================
function normalizeHost(h) {
  var i = h.indexOf(":");
  return (i !== -1) ? h.substring(0, i) : h;
}

function isIPv4(ip) {
  return ip && /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip);
}

function getIP(host) {
  try {
    var ip = dnsResolve(host);
    return (ip && isIPv4(ip)) ? ip : null;
  } catch(e) {
    return null;
  }
}

function startsWithAny(ip, table) {
  if (!ip) return false;
  for (var prefix in table) {
    if (ip.indexOf(prefix) === 0) return true;
  }
  return false;
}

function isExactMatch(ip, table) {
  return table[ip] === 1;
}

function isPrivateOrLocalIP(ip) {
  if (!ip) return false;
  return (
    isInNet(ip, "10.0.0.0", "255.0.0.0") ||
    isInNet(ip, "172.16.0.0", "255.240.0.0") ||
    isInNet(ip, "192.168.0.0", "255.255.0.0") ||
    isInNet(ip, "127.0.0.0", "255.0.0.0") ||
    isInNet(ip, "169.254.0.0", "255.255.0.0")
  );
}

function containsAny(s, list) {
  if (!s) return false;
  s = s.toLowerCase();
  for (var i = 0; i < list.length; i++) {
    if (s.indexOf(list[i]) !== -1) return true;
  }
  return false;
}

// ============================================================
// 8. PUBG DETECTION
// ============================================================
function isPUBG(host) {
  if (!host) return false;
  host = host.toLowerCase();
  
  var keywords = [
    "pubg","pubgm","pubgmobile","intlgame","igamecj","igame",
    "proximabeta","tencent","qq","qcloud","gcloud",
    "krafton","lightspeed","amsoveasea","ams","ace",
    "vmpone","vmp","gme","gamecenter","worldofwonder","wow"
  ];
  
  for (var i = 0; i < keywords.length; i++) {
    if (host.indexOf(keywords[i]) !== -1) return true;
  }
  return false;
}

// ============================================================
// 9. TRAFFIC CLASSIFICATION
// ============================================================
function isMatchmakingTraffic(url, host) {
  var s = (url + " " + host).toLowerCase();
  return /(matchmaking|matching|queue|mm|search|find|
           allocation|assign|region|dispatcher|gate)/x.test(s);
}

function isLobbyTraffic(url, host) {
  var s = (url + " " + host).toLowerCase();
  return /(lobby|room|recruit|team|squad|party|
           invite|friend|social|presence|status)/x.test(s);
}

function isMatchTraffic(url, host) {
  var s = (url + " " + host).toLowerCase();
  return /(game|battle|gs\.|gss|gameserver|
           logic|session|zone|realtime|sync)/x.test(s);
}

// ============================================================
// 10. JORDAN IP VALIDATION
// ============================================================
function isJordanIP(ip) {
  if (!ip) return false;
  
  if (startsWithAny(ip, JO_PREMIUM)) return true;
  if (startsWithAny(ip, JO_EXTENDED)) return true;
  if (isExactMatch(ip, JO_BOT_SERVERS)) return true;
  
  return false;
}

function isPremiumJordanIP(ip) {
  return ip && startsWithAny(ip, JO_PREMIUM);
}

function isBotServer(ip) {
  return ip && isExactMatch(ip, JO_BOT_SERVERS);
}

// ============================================================
// 11. QUEUE TIME MANAGEMENT
// ============================================================
function shouldForceBots(host) {
  var strategy = getTimeStrategy();
  
  if (!queueStartTime[host]) {
    queueStartTime[host] = Date.now();
    matchAttempts[host] = 0;
    return strategy.preferBots; // إذا وقت بوتات، فورية
  }
  
  var elapsed = Date.now() - queueStartTime[host];
  
  // تحقق من التايم أوت
  if (elapsed > strategy.forceBotTimeout) {
    return true;
  }
  
  if (elapsed > strategy.maxQueueTimeout) {
    return true;
  }
  
  return false;
}

function resetQueue(host) {
  delete queueStartTime[host];
  delete matchAttempts[host];
}

// ============================================================
// 12. SMART PROXY SELECTION
// ============================================================
function selectMatchProxy(ip, forceBots) {
  var strategy = getTimeStrategy();
  
  // ===== وقت البوتات (9 صباحاً - 5 مساءً) =====
  if (strategy.isBotTime || forceBots) {
    // دخول فوري بالبوتات
    return BOT_FILLER_PROXY + "; " + FAST_MATCH_PROXY;
  }
  
  // ===== وقت اللاعبين (مساءً) =====
  if (strategy.isPeakTime) {
    // أولوية للاعبين الأردنيين
    if (isPremiumJordanIP(ip)) {
      return JORDAN_PRIMARY + "; " + JORDAN_FALLBACK + "; " + BOT_FILLER_PROXY;
    }
    if (isJordanIP(ip)) {
      return JORDAN_FALLBACK + "; " + JORDAN_PRIMARY + "; " + BOT_FILLER_PROXY;
    }
  }
  
  // ===== أوقات عادية =====
  if (isJordanIP(ip)) {
    return JORDAN_PRIMARY + "; " + BOT_FILLER_PROXY;
  }
  
  return BLOCK;
}

// ============================================================
// 13. MAIN PROXY FUNCTION
// ============================================================
function FindProxyForURL(url, host) {
  host = normalizeHost(host);
  
  // ===== STEP 1: System bypass =====
  if (containsAny(host, SAFE_DIRECT)) return "DIRECT";
  if (containsAny(host, CDN_DIRECT)) return "DIRECT";
  
  // ===== STEP 2: Resolve IP =====
  var ip = getIP(host);
  
  // ===== STEP 3: Private IPs =====
  if (ip && isPrivateOrLocalIP(ip)) return "DIRECT";
  
  // ===== STEP 4: Non-PUBG =====
  if (!isPUBG(host)) return "DIRECT";
  
  // ===== STEP 5: DNS failure =====
  if (!ip) return BLOCK;
  
  // ===== STEP 6: Non-Jordan IPs =====
  if (!isJordanIP(ip)) return BLOCK;
  
  // ===== STEP 7: Get time strategy =====
  var strategy = getTimeStrategy();
  
  // ===== STEP 8: Traffic routing =====
  
  // MATCHMAKING
  if (isMatchmakingTraffic(url, host)) {
    var forceBots = shouldForceBots(host);
    
    // وقت البوتات → دخول فوري
    if (strategy.isBotTime) {
      resetQueue(host);
      return BOT_FILLER_PROXY + "; " + FAST_MATCH_PROXY;
    }
    
    // وقت اللاعبين → حاول لاعبين أولاً
    if (forceBots) {
      resetQueue(host);
      return BOT_FILLER_PROXY + "; " + FAST_MATCH_PROXY;
    }
    
    if (isPremiumJordanIP(ip)) {
      return JORDAN_PRIMARY + "; " + JORDAN_FALLBACK + "; " + BOT_FILLER_PROXY;
    }
    
    return JORDAN_FALLBACK + "; " + BOT_FILLER_PROXY;
  }
  
  // LOBBY
  if (isLobbyTraffic(url, host)) {
    if (isJordanIP(ip)) {
      return JORDAN_PRIMARY + "; " + JORDAN_FALLBACK;
    }
    return BLOCK;
  }
  
  // MATCH
  if (isMatchTraffic(url, host)) {
    var forceBots = shouldForceBots(host);
    var proxy = selectMatchProxy(ip, forceBots);
    
    if (proxy !== BLOCK) {
      resetQueue(host);
    }
    
    return proxy;
  }
  
  // ===== DEFAULT =====
  if (strategy.isBotTime && isBotServer(ip)) {
    return BOT_FILLER_PROXY;
  }
  
  if (isJordanIP(ip)) {
    return JORDAN_PRIMARY + "; " + BOT_FILLER_PROXY;
  }
  
  return BLOCK;
}

// ============================================================
// 14. AUTO-CLEANUP
// ============================================================
setInterval(function() {
  var now = Date.now();
  
  for (var host in queueStartTime) {
    if (now - queueStartTime[host] > 60000) {
      delete queueStartTime[host];
      delete matchAttempts[host];
    }
  }
}, 30000);

// ============================================================
// 15. INITIALIZATION & LOGGING
// ============================================================
if (typeof console !== "undefined") {
  var strategy = getTimeStrategy();
  var hour = new Date().getHours();
  
  console.log("╔════════════════════════════════════════════╗");
  console.log("║  PUBG Jordan + Scheduled Bot System       ║");
  console.log("║  Bot Hours: 9 AM - 5 PM (+ 3-7 AM)        ║");
  console.log("╠════════════════════════════════════════════╣");
  console.log("║  Current Time: " + hour + ":00                        ║");
  console.log("║  Mode: " + (strategy.isBotTime ? "🤖 BOT MODE (Fast)" : "👥 PLAYER MODE") + "        ║");
  console.log("║  Timeout: " + (strategy.forceBotTimeout/1000) + "s                           ║");
  console.log("╚════════════════════════════════════════════╝");
}
