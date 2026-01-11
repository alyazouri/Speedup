function FindProxyForURL(url, host) {
    // البروكسي الأردني
    var proxy = "PROXY 176.29.153.95:8080; " +
                "PROXY 176.29.153.95:3128; " +
                "PROXY 176.29.153.95:80; " +
                "SOCKS5 176.29.153.95:1080; " +
                "DIRECT";
    
    // الشبكة المحلية فقط
    if (isInNet(host, "192.168.0.0", "255.255.0.0") ||
        isInNet(host, "10.0.0.0", "255.0.0.0") ||
        shExpMatch(host, "localhost")) {
        return "DIRECT";
    }
    
    // كل شيء آخر عبر البروكسي
    return proxy;
}
