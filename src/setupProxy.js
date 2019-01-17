const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  let cookie;
  app.use(
    proxy(
      ['/api', '/asset', '/mqtt', '/socket.io', '/sockjs-node'],
      {
        target: 'https://neopis.thingplus.net',
        changeOrigin: true,
        onProxyReq: (proxyReq) => {
          proxyReq.setHeader('Cookie', 'dwTPlus=s%3ANeYkNkXmAu055wx5kA5kvsxPFxMX9v8G.SS4i8pmrYB5VChU5%2B7kFx3CT6COSdDNKpT5BEvkunv0');
        },
        onProxyRes: (proxyRes) => {
          Object.keys(proxyRes.headers).forEach((key) => {
            if (key === 'set-cookie' && proxyRes.headers[key]) {
              const cookieTokens = proxyRes.headers[key];
              cookie = cookieTokens.filter(element => element.includes('dwTPlus')).join('');
            }
          });
        }
      },
    )
  );
};