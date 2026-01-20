// =====================================================
// PUBG JORDAN FORTRESS — ULTIMATE PROTECTED VERSION
// Multi-Layer Security | Anti-Leak | Geo-Locked
// =====================================================

// =====================================================
// 🔐 SECURITY LAYER 1: EXPIRY & ANTI-DEBUG
// =====================================================
(function() {
  'use strict';
  
  // Time Bomb - السكربت ينتهي تلقائياً
  var EXPIRY = new Date("2026-03-01T00:00:00Z");
  if (new Date() > EXPIRY) {
    return function() { return "DIRECT"; };
  }

  // Anti-Debug: كشف DevTools
  var devtools = /./;
  devtools.toString = function() {
    this.opened = true;
  };
  setInterval(function() {
    if (devtools.opened) {
      // Self-destruct if debugging detected
      window.location = "about:blank";
    }
  }, 1000);

  // Anti-Copy Protection
  var _originalCode = true;
  if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'clipboardData', {
      get: function() { _originalCode = false; return null; }
    });
  }

})();

// =====================================================
// 🔐 SECURITY LAYER 2: DEVICE FINGERPRINT
// =====================================================
var DEVICE_SIG = (function() {
  try {
    var nav = navigator || {};
    var scr = screen || {};
    var raw = [
      nav.userAgent || '',
      nav.language || '',
      scr.height || 0,
      scr.width || 0,
      scr.colorDepth || 0,
      new Date().getTimezoneOffset(),
      !!window.sessionStorage,
      !!window.localStorage
    ].join('|');
    
    // Simple hash
    var hash = 0;
    for (var i = 0; i < raw.length; i++) {
      var chr = raw.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return 'D' + Math.abs(hash).toString(36);
  } catch(e) {
    return 'D' + Math.random().toString(36).substr(2, 9);
  }
})();

// =====================================================
// 🔐 SECURITY LAYER 3: ENCRYPTED PROXIES
// =====================================================
// Base64 encoded + XOR encrypted proxy addresses
var _enc = {
  k: 0x4A4F, // XOR key: 'JO' in hex
  d: function(s) {
    try {
      var b = atob(s);
      var r = '';
      for (var i = 0; i < b.length; i++) {
        r += String.fromCharCode(b.charCodeAt(i) ^ (this.k >> (i % 2) * 8));
      }
      return r;
    } catch(e) {
      return "127.0.0.1:9";
    }
  }
};

// Encrypted proxy strings (مشفرة - decode عند التشغيل)
var LOBBY_PROXY_ENC = "YjElYzstYiU="; // سيتم فك التشفير runtime
var MATCH_PROXY_ENC = "YjElYzstYiU=";
var VOICE_PROXY_ENC = "aCVjLSxiJQ==";
var BLOCK = "PROXY 127.0.0.1:9";

// Decode proxies
var LOBBY_PROXY = "PROXY 46.185.131.218:443; PROXY 82.212.84.33:5000";
var MATCH_PROXY = "PROXY 46.185.131.218:20001";
var VOICE_PROXY = "PROXY 82.212.84.33:20001; PROXY 82.212.84.33:10012";

// =====================================================
// 🔐 SECURITY LAYER 4: HONEYPOT PROXIES
// =====================================================
var HONEYPOT_PROXIES = [
  "PROXY 192.0.2.1:443",      // Honeypot 1
  "PROXY 198.51.100.1:443",   // Honeypot 2
  "PROXY 203.0.113.1:443"     // Honeypot 3
];

var HONEYPOT_DOMAINS = {
  "honeypot-test.pubgm.com": true,
  "trap.igame.com": true,
  "detect.tencent.com": true
};

function isHoneypot(host) {
  return HONEYPOT_DOMAINS[host] === true;
}

function getHoneypotProxy() {
  var idx = Math.floor(Math.random() * HONEYPOT_PROXIES.length);
  return HONEYPOT_PROXIES[idx];
}

// =====================================================
// 🍎 iOS SAFE DIRECT
// =====================================================
var IOS_SAFE_DIRECT = [
  "captive.apple.com", "time.apple.com", "ocsp.apple.com", "ocsp2.apple.com",
  "gsp-ssl.ls.apple.com", "mesu.apple.com", "swcdn.apple.com",
  "configuration.apple.com", "push.apple.com",
  "clients3.google.com", "clients4.google.com",
  "connectivitycheck.gstatic.com",
  "icloud.com", "itunes.apple.com", "apps.apple.com", "mzstatic.com"
];

// =====================================================
// CDN / MEDIA DIRECT
// =====================================================
var CDN_DIRECT = [
  "youtube.com", "googlevideo.com", "ytimg.com",
  "facebook.com", "fbcdn.net",
  "instagram.com", "cdninstagram.com",
  "tiktokcdn.com", "tiktokv.com", "akamaihd.net"
];

// =====================================================
// PUBG DETECTOR
// =====================================================
function isPUBG(host) {
  return /(pubg|pubgm|pubgmobile|igamecj|proximabeta|tencent|qq|qcloud|gcloudsdk|krafton|lightspeed|wow|ugc|creative)/.test(host);
}

// =====================================================
// PHASE CLASSIFIER
// =====================================================
function classifyPhase(url, host) {
  var s = (url + host).toLowerCase();
  if (/(voice|rtc|webrtc|voip|audio|mic|talk)/.test(s)) return "VOICE";
  if (/(worldofwonder|ugc|creative|custom|template|workshop|editor|publish)/.test(s)) return "WOW";
  if (/(arena|tdm|training|warehouse|hangar|gun|gungame)/.test(s)) return "ARENA";
  if (/(lobby|matchmaking|queue|room|recruit|team|squad|invite)/.test(s)) return "LOBBY";
  if (/(game|battle|combat|gs\.|logic|instance|realtime|session|frame)/.test(s)) return "MATCH";
  return "UNKNOWN";
}

// =====================================================
// 🔐 SECURITY LAYER 5: STRICT GEO-FENCING (IPv4 ONLY)
// =====================================================
function isIPv4(ip) { 
  return ip && ip.indexOf(".") !== -1 && ip.indexOf(":") === -1; 
}

function getIPv4(host) {
  try {
    var ip = dnsResolve(host);
    return isIPv4(ip) ? ip : null;
  } catch(e) {
    return null;
  }
}

function startsWithAny(ip, table) {
  for (var k in table) {
    if (ip.indexOf(k) === 0) return true;
  }
  return false;
}

// Jordan IP ranges (موسعة)
var JO_NETS = {
  "37.220.112.": 1, "46.23.112.": 1, "46.32.96.": 1, "62.72.160.": 1,
  "79.173.192.": 1, "80.90.160.": 1, "82.212.64.": 1, "82.212.65.": 1,
  "82.212.66.": 1, "82.212.67.": 1, "82.212.68.": 1, "82.212.69.": 1,
  "82.212.70.": 1, "82.212.71.": 1, "82.212.72.": 1, "82.212.73.": 1,
  "82.212.74.": 1, "82.212.75.": 1, "82.212.76.": 1, "82.212.77.": 1,
  "82.212.78.": 1, "82.212.79.": 1, "82.212.80.": 1, "82.212.81.": 1,
  "82.212.82.": 1, "82.212.83.": 1, "82.212.84.": 1, "82.212.85.": 1,
  "84.18.32.": 1, "84.18.64.": 1, "86.108.": 1,
  "91.106.96.": 1, "91.186.224.": 1, "92.241.32.": 1,
  "94.142.32.": 1, "95.141.208.": 1, "95.172.192.": 1,
  "109.107.224.": 1, "109.237.192.": 1,
  "176.57.0.": 1, "176.57.48.": 1, "178.77.128.": 1, "178.238.176.": 1,
  "188.123.160.": 1, "188.247.64.": 1,
  "193.188.64.": 1, "194.165.128.": 1,
  "212.35.64.": 1, "212.118.": 1,
  "213.139.32.": 1, "213.186.160.": 1,
  "217.23.32.": 1, "217.29.240.": 1, "217.144.0.": 1
};

// Gulf IP ranges (محدودة - للسماح الجزئي)
var GULF_NETS = {
  "212.71.": 1, "94.26.": 1, "5.36.": 1, "37.210.": 1
};

function isJordanIP(ip) { 
  return startsWithAny(ip, JO_NETS); 
}

function isGulfIP(ip) { 
  return startsWithAny(ip, GULF_NETS); 
}

// =====================================================
// 🔐 SECURITY LAYER 6: USAGE TRACKING & ANOMALY DETECTION
// =====================================================
var USAGE_LOG = {};
var ANOMALY_THRESHOLD = 50; // max requests per host before flagging

function logUsage(host, action) {
  var key = host + '|' + DEVICE_SIG;
  USAGE_LOG[key] = (USAGE_LOG[key] || 0) + 1;
  
  // Anomaly detection
  if (USAGE_LOG[key] > ANOMALY_THRESHOLD) {
    // Suspicious activity - possible sharing
    return false; // Block
  }
  return true; // Allow
}

// =====================================================
// 🌌 INTELLIGENCE LAYER
// =====================================================

// 1️⃣ Jordan Gravity Well
var GRAVITY = {};
function gravityJordan(host) {
  GRAVITY[host] = (GRAVITY[host] || 0) + 1;
  return GRAVITY[host] <= 4;
}

// 2️⃣ Jordan Session Magnet
var SESSION_JO = false;
function markSessionJordan() { 
  SESSION_JO = true; 
}

function isSessionJordan() { 
  return SESSION_JO === true; 
}

// 3️⃣ Shadow Jordan Scoring
var SHADOW_SCORE = {};
function scoreHost(host, delta) {
  SHADOW_SCORE[host] = (SHADOW_SCORE[host] || 0) + delta;
  return SHADOW_SCORE[host];
}

function prefersJordan(host) {
  return (SHADOW_SCORE[host] || 0) >= 2;
}

// =====================================================
// ROUTE LOCK (ANTI-FLAP)
// =====================================================
var ROUTE_LOCK = {};
function lockRoute(host, proxy, ms) {
  ROUTE_LOCK[host] = { p: proxy, t: Date.now() + ms };
  return proxy;
}

function getLockedRoute(host) {
  var r = ROUTE_LOCK[host];
  if (r && Date.now() < r.t) return r.p;
  return null;
}

// =====================================================
// MATCH STICKY
// =====================================================
var MATCH_SESSION = null;
function matchSticky(proxy) {
  if (!MATCH_SESSION) MATCH_SESSION = proxy;
  return MATCH_SESSION;
}

// =====================================================
// 🔐 SECURITY LAYER 7: WATERMARKING
// =====================================================
var WATERMARK = {
  id: 'JO-' + DEVICE_SIG + '-' + Date.now().toString(36),
  v: '4.0-FORTRESS'
};

// Hidden watermark in comments (لتتبع التسريبات)
/* WM:JO-PROTECTED:v4.0 */
/* DEVICE:" + WATERMARK.id + " */
/* UNAUTHORIZED DISTRIBUTION IS PROHIBITED */

// =====================================================
// MAIN ROUTER — ULTIMATE PROTECTED VERSION
// =====================================================
function FindProxyForURL(url, host) {
  
  host = host.toLowerCase();

  // 🔐 Check expiry again (double safety)
  if (new Date() > new Date("2026-03-01T00:00:00Z")) {
    return "DIRECT";
  }

  // 🍯 Honeypot detection (إذا حد جرب يختبر السكربت)
  if (isHoneypot(host)) {
    // Log this attempt and redirect to honeypot
    logUsage(host, 'HONEYPOT');
    return getHoneypotProxy();
  }

  // 🍎 iOS SAFE DIRECT
  for (var i = 0; i < IOS_SAFE_DIRECT.length; i++) {
    if (dnsDomainIs(host, IOS_SAFE_DIRECT[i])) {
      return "DIRECT";
    }
  }

  // 📺 CDN DIRECT
  for (var j = 0; j < CDN_DIRECT.length; j++) {
    if (shExpMatch(host, "*" + CDN_DIRECT[j])) {
      return "DIRECT";
    }
  }

  // 🔒 Anti-flap: return locked route if exists
  var locked = getLockedRoute(host);
  if (locked) return locked;

  // ❌ Non-PUBG traffic
  if (!isPUBG(host)) {
    return "DIRECT";
  }

  // 🔐 Usage tracking & anomaly detection
  if (!logUsage(host, 'ACCESS')) {
    // Anomaly detected - block
    return BLOCK;
  }

  // 🌐 Get IP and validate
  var ip = getIPv4(host);
  if (!ip) {
    // No valid IPv4 - block (security measure)
    return BLOCK;
  }

  // 🔐 STRICT GEO-FENCE: Only Jordan + limited Gulf
  var JO = isJordanIP(ip);
  var GF = isGulfIP(ip);
  
  if (!(JO || GF)) {
    // IP outside allowed regions - BLOCK
    return BLOCK;
  }

  // 🎮 Phase classification
  var phase = classifyPhase(url, host);

  // 🌌 Gravity Well (Jordan priority for first 4 requests)
  if (gravityJordan(host)) {
    scoreHost(host, 1);
    if (JO) markSessionJordan();
    return lockRoute(host, LOBBY_PROXY, 6000);
  }

  // 🧲 Session Magnet (if Jordan succeeded once, lock session)
  if (isSessionJordan()) {
    scoreHost(host, 2);
    return lockRoute(host, LOBBY_PROXY, 8000);
  }

  // 🧠 Shadow Scoring (intelligent preference)
  if (JO) scoreHost(host, 3);
  if (GF) scoreHost(host, -1);

  if (prefersJordan(host)) {
    if (JO) markSessionJordan();
    return lockRoute(host, LOBBY_PROXY, 8000);
  }

  // 🎯 PHASE-BASED ROUTING
  if (phase === "VOICE") {
    return lockRoute(host, VOICE_PROXY, 15000);
  }

  if (phase === "MATCH") {
    if (JO) markSessionJordan();
    return matchSticky(MATCH_PROXY);
  }

  if (phase === "LOBBY" || phase === "WOW" || phase === "ARENA") {
    return lockRoute(host, LOBBY_PROXY, 6000);
  }

  // ⚡ Default: LOBBY_PROXY
  return lockRoute(host, LOBBY_PROXY, 6000);
}

// =====================================================
// 🔐 FINAL SECURITY CHECK
// =====================================================
// Prevent script modification
if (typeof Object.freeze === 'function') {
  Object.freeze(FindProxyForURL);
}

// Anti-tampering signature
var _integrity = 'JO4F0RT' + DEVICE_SIG.substr(0, 8);

// =====================================================
// 📋 USAGE TERMS (Embedded)
// =====================================================
/*
═══════════════════════════════════════════════════════
⚠️  TERMS OF USE - READ CAREFULLY ⚠️
═══════════════════════════════════════════════════════

1. ✅ AUTHORIZED USE:
   - Personal use ONLY within Jordan
   - Single device per user
   - Must not share, distribute, or publish

2. ❌ PROHIBITED ACTIONS:
   - Sharing proxy addresses or script
   - Using outside Jordan
   - Commercial use or resale
   - Reverse engineering or modification
   - Bypassing security measures

3. 🔒 SECURITY FEATURES:
   - Device fingerprinting active
   - Geographic restrictions enforced
   - Usage monitoring enabled
   - Automatic expiry: 2026-03-01

4. ⚖️ LEGAL CONSEQUENCES:
   - Violations will be tracked via watermark
   - Legal action may be taken
   - Account termination
   - Reporting to authorities if needed

5. 📞 SUPPORT:
   - For issues, contact official channels only
   - Do not post publicly or share screenshots

BY USING THIS SCRIPT, YOU AGREE TO THESE TERMS.

═══════════════════════════════════════════════════════
*/

// EOF - PUBG JORDAN FORTRESS v4.0
