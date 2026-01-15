/************************************************************
 * 🇯🇴 ELITE JORDAN PAC – FINAL GOD-TIER (NO DIRECT)
 * 🎮 Game: Single Proxy Lock (lowest jitter)
 * 🧩 Lobby/Recruit: Multi-Proxy Rotation + Pressure Window
 * 🎧 Voice: Isolation Proxy (STUN/RTC stability)
 * 🚫 NO DIRECT ANYWHERE
 ************************************************************/

/* =========================================================
   1️⃣ PROXIES (Jordan)
   ملاحظة: 443 و 3478 ظاهرين كـ open ports في فحوصاتك.
   ========================================================= */

// 🎮 مباراة: بروكسي واحد + بورت واحد (ثبات وبنق)
var GAME_PROXY  = "PROXY 212.35.66.45:443";  // 443 open  [oai_citation:2‡Port Scan.pdf](sediment://file_0000000042d871f5af395867f407cf98)

/* 🎧 صوت: عزل كامل للصوت (RTC/STUN) */
var VOICE_PROXY = "PROXY 82.212.84.33:3478"; // 3478 open  [oai_citation:3‡82.212.84.33-1.pdf](sediment://file_00000000d018722f887e5d786e05efeb)

/* 🧩 لوبي/تجنيد: Rotations (Fingerprint Rotation داخل الأردن) */
var ROT_A = "PROXY 82.212.84.33:443; PROXY 46.32.102.152:443; PROXY 212.35.66.45:443";
var ROT_B = "PROXY 46.32.102.152:443; PROXY 212.35.66.45:443; PROXY 82.212.84.33:443";
var ROT_C = "PROXY 212.35.66.45:443; PROXY 82.212.84.33:443; PROXY 46.32.102.152:443";

/* 🔒 وضع سكريم/رانكد */
var SCRIM_MODE = false; 
// true  = سكريم: أقل تغيير (لوبي أخف)
// false = رانكد: Lobby Boost أقوى (زيادة احتمالية أردنيين)

/* =========================================================
   2️⃣ MAX EXPANDED DEEP PATTERNS (Safe Expansion)
   ========================================================= */
var DEEP_PATTERNS = {

  // 🧩 Lobby / Matchmaking / Recruitment (أوسع حد آمن)
  PHASE_PRE_GAME: {
    weight: 100,
    domains: [
      "lobby","room","queue","waiting","matchmaking","mm","match",
      "recruit","find","join","party","squad","team","teamup",
      "invite","ready","pre","gather","assemble","entry"
    ],
    paths: [
      "/lobby/","/room/","/queue/","/wait/","/mm/","/matchmake/",
      "/findmatch/","/recruit/","/join/","/party/","/squad/",
      "/team/","/teamup/","/invite/","/ready/","/pre/",
      "/gather/","/assemble/","/entry/"
    ],
    hostPatterns: [
      "lobby","match","queue","mm","party","room","team","entry"
    ],
    strategy: "HYPER_MATCHMAKING"
  },

  // ⏳ Loading / Session / Spawn
  PHASE_LOADING: {
    weight: 95,
    domains: [
      "loading","load","init","prepare","spawn","boot",
      "session","handshake","allocate","setup","warmup"
    ],
    paths: [
      "/loading/","/load/","/init/","/prepare/","/spawn/",
      "/boot/","/session/","/handshake/","/allocate/",
      "/setup/","/warmup/"
    ],
    hostPatterns: ["loading","init","spawn","session","setup"],
    strategy: "FAST_LOADING"
  },

  // 🎮 Active Game / Real-Time Sync (قفل مباراة)
  PHASE_ACTIVE_GAME: {
    weight: 100,
    domains: [
      "game","play","battle","combat","pvp","fight","action",
      "server","sync","state","movement","pos","move",
      "fire","hit","damage","physics","tick","frame"
    ],
    paths: [
      "/game/","/play/","/battle/","/combat/","/sync/",
      "/state/","/pos/","/move/","/movement/",
      "/action/","/fire/","/hit/","/damage/",
      "/physics/","/tick/","/frame/"
    ],
    hostPatterns: ["game","play","battle","server","gs","node"],
    strategy: "ZERO_JITTER_ULTRA"
  },

  // 🎧 Voice / RTC / Audio
  PHASE_VOICE: {
    weight: 100,
    domains: [
      "voice","rtc","audio","voip","call","mic","speaker",
      "gvoice","webrtc","sound","talk","comm","channel"
    ],
    paths: [
      "/voice/","/rtc/","/audio/","/webrtc/",
      "/voip/","/call/","/mic/","/speak/",
      "/talk/","/comm/","/channel/"
    ],
    hostPatterns: ["voice","rtc","audio","gvoice","comm"],
    strategy: "ZERO_LATENCY_VOICE_ULTRA"
  },

  // 🏁 Post-Game
  PHASE_POST_GAME: {
    weight: 65,
    domains: [
      "result","stats","reward","achievement","rank",
      "score","exp","summary","history","progress","report"
    ],
    paths: [
      "/result/","/stats/","/reward/","/rank/",
      "/score/","/achievement/","/exp/",
      "/summary/","/history/","/progress/","/report/"
    ],
    hostPatterns: ["result","stats","reward","rank","report"],
    strategy: "BALANCED_FAST"
  },

  // 📦 CDN / Assets (عادة الأفضل يكون مباشر… بس أنت بدك NO DIRECT)
  PHASE_RESOURCES: {
    weight: 20,
    domains: [
      "resource","asset","cdn","static","download","update",
      "patch","bundle","res","content","media"
    ],
    paths: [
      "/resource/","/asset/","/download/","/update/",
      "/patch/","/cdn/","/static/","/bundle/",
      "/res/","/content/","/media/"
    ],
    hostPatterns: ["cdn","static","resource","asset","content"],
    strategy: "CDN_TURBO"
  },

  // 💬 Social
  PHASE_SOCIAL: {
    weight: 55,
    domains: [
      "friend","chat","social","team","clan","guild",
      "message","dm","whisper","presence","status"
    ],
    paths: [
      "/friend/","/chat/","/social/","/team/",
      "/clan/","/guild/","/message/","/dm/",
      "/whisper/","/presence/","/status/"
    ],
    hostPatterns: ["friend","chat","social","clan","guild","presence"],
    strategy: "BALANCED_FAST"
  }
};

/* =========================================================
   3️⃣ HELPERS (Fast)
   ========================================================= */
function _hostHasPattern(host, patterns) {
  if (!host) return false;
  for (var i=0;i<patterns.length;i++) {
    if (host.indexOf(patterns[i]) !== -1) return true;
  }
  return false;
}
function _urlHasPattern(url, patterns) {
  if (!url) return false;
  for (var i=0;i<patterns.length;i++) {
    if (url.indexOf(patterns[i]) !== -1) return true;
  }
  return false;
}
function _deepDetectPhase(url, host) {
  var best = null, max = 0;
  for (var k in DEEP_PATTERNS) {
    var p = DEEP_PATTERNS[k];
    var score = 0;
    if (_hostHasPattern(host, p.domains)) score += 40;
    if (_urlHasPattern(url, p.paths)) score += 40;
    if (_hostHasPattern(host, p.hostPatterns)) score += 20;
    score *= (p.weight / 100);
    if (score > max) { max = score; best = p; }
  }
  return best;
}

/* =========================================================
   4️⃣ ROTATION SELECTOR (بدون Random)
   - نستخدم أيام الأسبوع لتغيير بصمة اللوبي تلقائيًا
   ========================================================= */
function _pickLobbyRotationByDay() {
  // Mon/Tue/Wed = ROT_A | Thu/Fri = ROT_B | Sat/Sun = ROT_C
  if (weekdayRange("MON","WED")) return ROT_A;
  if (weekdayRange("THU","FRI")) return ROT_B;
  return ROT_C;
}

/* =========================================================
   5️⃣ MAIN ENGINE (NO DIRECT)
   ========================================================= */
function FindProxyForURL(url, host) {
  host = (host || "").toLowerCase();
  url  = (url  || "").toLowerCase();

  var phase = _deepDetectPhase(url, host);

  /* ============================
     🎧 Voice Isolation (أولوية 1)
     ============================ */
  if (phase && phase.strategy === "ZERO_LATENCY_VOICE_ULTRA") {
    return VOICE_PROXY;
  }

  /* ==========================================
     🎮 Anti-Match Drift (أولوية 2)
     أي real-time packet يقفل على GAME_PROXY فورًا
     ========================================== */
  if (phase && phase.strategy === "ZERO_JITTER_ULTRA") {
    return GAME_PROXY;
  }
  // قفل إضافي لو صار URL داخل real-time حتى لو phase ما التقطه
  if (_urlHasPattern(url, ["/state/","/pos/","/move/","/sync/","/battle/","/game/","/fire/","/hit/"])) {
    return GAME_PROXY;
  }

  /* ==========================================
     🧬 Matchmaking Pressure Window (أولوية 3)
     أول طلبات التجنيد: ضغط قوي بروتيشن مختلف
     ========================================== */
  if (_urlHasPattern(url, ["/matchmake","/findmatch"])) {
    // أقوى ضغط أول التجنيد
    return ROT_A;
  }

  /* ==========================================
     🧩 Lobby / Queue / Room / Recruitment (أولوية 4)
     - Ranked: Rotation متغير حسب اليوم (Fingerprint Rotation)
     - Scrim : تثبيت أخف لتقليل تغيّر البصمة
     ========================================== */
  if (phase && phase.strategy === "HYPER_MATCHMAKING") {
    return SCRIM_MODE ? ROT_C : _pickLobbyRotationByDay();
  }

  // Queue/Lobby explicit (إذا phase ما التقط)
  if (_urlHasPattern(url, ["/queue","/lobby","/room","/party","/squad","/invite","/ready"])) {
    return SCRIM_MODE ? ROT_C : _pickLobbyRotationByDay();
  }

  /* ==========================================
     📦 Resources / CDN (أولوية 5)
     أنت طلبت NO DIRECT، فنمررها عبر Rotation خفيف
     ========================================== */
  if (phase && phase.strategy === "CDN_TURBO") {
    return ROT_C;
  }

  /* ==========================================
     ✅ FALLBACK (ولا DIRECT)
     أي شيء ما انمسك: نوديه على GAME_PROXY (Hard Lock)
     ========================================== */
  return GAME_PROXY;
}
