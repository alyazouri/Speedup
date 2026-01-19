// PUBG Jordan Mobile Ultra Strict v9.9 – 2026
// توسيع Helpers لكل وظائف PUBG بشكل كامل (lobby/match/arena/wow/voice/friends/recruit/search/clan/etc.)
// كشف Packet Loss + Jitter محسن + Ping Cache + Rotation + Zain Pref
// استثناء تويتر وسناب • فقط Zain/Umniah/Orange mobile • Ping ~3-8 ms عمان

var J_LOBBY  = "PROXY 176.29.153.95:9030; PROXY 212.35.66.45:9030";
var J_MATCH  = "PROXY 176.29.153.95:20001";
var J_VOICE  = "PROXY 82.212.84.33:20001";
var BLOCK    = "PROXY 127.0.0.1:9";

// قوائم محدثة 2026
var JO_MOBILE = [
  "46.32.","46.185.","188.247.","92.253.",     // Zain
  "5.45.","46.23.","212.34.","86.108.",
  "176.29."                          // Jordan Data mobile Amman
];

var ZAIN_PREF = ["5.45.","46.23.","212.34.","176.29."];

var BLOCK_LIST = [
  "37.115.","46.96.","78.160.","79.127.","95.177.","109.104.","188.113.",
  "185.19.","185.86.","5.149.","37.17.","37.77.","62.201.","81.90.","82.199.",
  "3.","13.","15.","16.","18.","52.","34.","35.","104.","20.","40.",
  "5.39.","51.","91.134.","95.216.","135.181.","45.32.","45.76."
];

// Helpers محسنة وموسعة لكل وظائف PUBG بشكل كامل (بالاعتماد على regex شاملة)
function isPUBG(h){return/(pubg|pubgm|pubgmobile|intlgame|igamecj|igamepubg|proximabeta|tencent|qq\.com|qcloud|tencentyun|gcloudsdk|krafton|lightspeed|vmpone|vmp|gme|gss|amsoveasea)/i.test(h);}
function isLobby(u,h){var s=(u+h).toLowerCase();return/(lobby|matchmaking|matching|queue|waiting|recruit|recruiting|recruitment|room|rooms|team|squad|party|crew|invite|join|joining|gate|gateway|entrance|dispatcher|router|region|allocation|select|choose|selection)/.test(s);}
function isMatch(u,h){var s=(u+h).toLowerCase();return/(game|battle|combat|fight|play|gs\.|gss|gameserver|matchserver|logic|session|instance|zone|shard|node|cell|realtime|frame|tick|sync|classic|ranked|br)/.test(s);}
function isArena(u,h){var s=(u+h).toLowerCase();return/(arena|tdm|deathmatch|teamdeathmatch|evo|evoground|training|arenatraining|warehouse|hangar|gun|gungame|gun\-game|ultimate|ultimatearena)/.test(s);}
function isWOW(u,h){var s=(u+h).toLowerCase();return/(wow|worldofwonder|ugc|ugccontent|creative|creation|creations|room|rooms|customroom|custom\-room|map|maps|template|templates|publish|published|community|workshop|featured|trending|popular|recommend|recommended)/.test(s);}
function isVoice(u,h){var s=(u+h).toLowerCase();return/(mic|microphone|audio|voice|talk|speak|speaking|voip|rtc|webrtc|teamvoice|partyvoice|squadvoice|voicechannel|audiochannel|audiostream|voicestream)/.test(s);}
function isSocial(u,h){var s=(u+h).toLowerCase();return/(friend|friends|addfriend|add\-friend|recommend|suggest|search|profile|people|player|userid|uid|follow|follower|fans|social|relation|contacts|clan|guild|group|nearby|invitation|invite)/.test(s);}

// دوران proxies كل 5 دقايق
var PROXIES = [J_LOBBY, J_MATCH, J_VOICE];
var CUR_PROXY = 0;
var LAST_ROT = Date.now();
function getProxy() {
  if (Date.now() - LAST_ROT > 300000) {
    CUR_PROXY = (CUR_PROXY + 1) % PROXIES.length;
    LAST_ROT = Date.now();
  }
  return PROXIES[CUR_PROXY];
}

// cache للـ IPs الجيدة (مع ping, jitter, loss)
var GOOD_IPS = {};

// تقدير ping + jitter + packet loss محسن
function measureNetwork(ip) {
  var attempts = 6;
  var success = 0;
  var totalTime = 0;
  var pings = [];
  
  for (var i = 0; i < attempts; i++) {
    var t = Date.now();
    try {
      dnsResolve(ip);
      var latency = Date.now() - t;
      pings.push(latency);
      success++;
      totalTime += latency;
    } catch (e) {}
  }
  
  var lossRate = (attempts - success) / attempts;
  var avg = success > 0 ? totalTime / success : 999;
  
  // Jitter (std dev)
  var stdDev = 999;
  if (pings.length > 1) {
    var mean = avg;
    var variance = pings.reduce((a,b)=>a + Math.pow(b - mean, 2), 0) / pings.length;
    stdDev = Math.sqrt(variance);
  }
  
  // نسبي
  var maxDev = pings.length > 0 ? Math.max(...pings) - Math.min(...pings) : 0;
  var relativeJitter = avg > 0 ? maxDev / avg : 999;
  
  return {lossRate: lossRate, avg: avg, jitterStd: stdDev, jitterRel: relativeJitter};
}

var START = Date.now();

function FindProxyForURL(url,host){
  host = (host||"").toLowerCase().split(":")[0];

  // استثناء تويتر وسناب شات كامل
  if (host.includes("x.com") || host.includes("twitter.com") || 
      host.includes("snapchat.com") || host.includes("sc-cdn.net") || 
      host.includes("snap-dev.net") || host.includes("snapkit.co")) {
    return "DIRECT";
  }

  // Safe & CDN
  if (host.includes("apple.com") || host.includes("google.com") || 
      host.includes("youtube") || host.includes("facebook") || host.includes("instagram")) {
    return "DIRECT";
  }

  if (!isPUBG(host)) return "DIRECT";

  var ip = dnsResolve(host);
  if (!ip) return BLOCK;

  // حظر فوري للعراق والـ VPN/Cloud
  if (startsWithAny(ip, BLOCK_LIST)) return BLOCK;

  // فقط JO mobile
  if (!startsWithAny(ip, JO_MOBILE)) return BLOCK;

  // قياس ping + jitter + packet loss
  var data = measureNetwork(ip);
  
  // رفض إذا loss أو ping أو jitter عالي
  var maxPing = (new Date().getHours() + 3 >= 19 && new Date().getHours() + 3 <= 23) ? 10 : 15;
  if (data.lossRate > 0.25 || data.avg > maxPing || data.jitterStd > 6.5 || data.jitterRel > 0.35) {
    return BLOCK;
  }

  // مقارنة مع cache (إذا كان الـ IP جيد سابقاً)
  if (GOOD_IPS[ip]) {
    var oldLoss = 1 - GOOD_IPS[ip].successRate;
    if (data.lossRate > oldLoss + 0.15) {  // زاد الـ loss كثير → رفض
      return BLOCK;
    }
  }

  // حفظ IP جيد في cache
  if (data.lossRate < 0.1 && data.avg < 10 && data.jitterStd < 5) {
    GOOD_IPS[ip] = {successRate: 1 - data.lossRate};
  }

  var elapsed = Date.now() - START;
  var strict  = elapsed < 30000;

  var proxy = GOOD_IPS[ip] ? J_MATCH : (isZain(ip) ? J_MATCH : getProxy());

  if (isVoice(url,host))   return J_VOICE;
  if (isSocial(url,host))  return J_LOBBY;
  if (isGame(url,host))    return strict ? J_MATCH : J_LOBBY;

  return proxy;
}
