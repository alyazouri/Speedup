// ======================= JORDAN WIDE – NO EXIT =======================
// Any traffic inside Jordan => DIRECT
// Any traffic outside Jordan => BLOCK
// IP-based decision only (iOS safe)

// ======================= BLOCK =======================
var BLOCK = "PROXY 127.0.0.1:9";

// ======================= LAN =======================
function isLAN(ip){
  return (
    isInNet(ip, "10.0.0.0", "255.0.0.0") ||
    isInNet(ip, "172.16.0.0", "255.240.0.0") ||
    isInNet(ip, "192.168.0.0", "255.255.0.0") ||
    isInNet(ip, "127.0.0.0", "255.255.255.0")
  );
}

// ======================= JORDAN WIDE BACKBONE =======================
function isJordanIP(ip){
  return (
    // ORANGE
    isInNet(ip, "109.104.0.0", "255.248.0.0") ||   // 109.104–109.111
    isInNet(ip, "176.28.0.0",  "255.252.0.0") ||   // 176.28–176.31

    // UMNIAH
    isInNet(ip, "82.212.0.0",  "255.255.0.0") ||
    isInNet(ip, "185.60.0.0",  "255.255.0.0") ||

    // ZAIN
    isInNet(ip, "46.185.0.0",  "255.255.0.0") ||

    // GOVERNMENT / MIXED
    isInNet(ip, "212.35.64.0", "255.255.192.0") ||

    // ADDITIONAL JO POOLS
    isInNet(ip, "37.75.0.0",   "255.255.0.0") ||
    isInNet(ip, "87.236.232.0","255.255.248.0")
  );
}

// ======================= MAIN =======================
function FindProxyForURL(url, host){

  // 1) IP literal (fast path)
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host)){
    if (isLAN(host)) return "DIRECT";
    if (isJordanIP(host)) return "DIRECT";
    return BLOCK;
  }

  // 2) Resolve once
  var ip = dnsResolve(host);
  if (!ip) return BLOCK;

  // 3) LAN
  if (isLAN(ip)) return "DIRECT";

  // 4) JORDAN ONLY
  if (isJordanIP(ip)) return "DIRECT";

  // 5) NO EXIT
  return BLOCK;
}
