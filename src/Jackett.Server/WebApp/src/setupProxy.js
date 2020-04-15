const { createProxyMiddleware } = require('http-proxy-middleware');

const loginUrl = "/UI/Login";
const onProxyRes = function (proxyRes, req, res) {
    // replace redirect URL to avoid CORS and skip login if there is not admin pass
    if (proxyRes.headers.location && proxyRes.headers.location.includes(loginUrl)) {
        proxyRes.headers.location = loginUrl + "?ReturnUrl=%2F";
    }
    // change the cookie to alter secure, same-site and path
    if (proxyRes.headers['set-cookie']) {
        proxyRes.headers['set-cookie'] = proxyRes.headers['set-cookie'].map(cookie => {
            const cookieParts = cookie.split(";");
            // cookie + expires + path
            return cookieParts[0] + ";" + cookieParts[1] + "; path=/"
        });
    }
};

// TODO: remove my url
module.exports = function(app) {
    app.use(['/api', '/UI'],
        createProxyMiddleware({
            target: 'https://nexthop.duckdns.org/jackett/',
            changeOrigin: true,
            onProxyRes: onProxyRes
        })
    );
};
