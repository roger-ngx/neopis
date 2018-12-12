const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  let cookie;
  app.use(
    proxy(
      ['/api', '/asset', '/mqtt', '/socket.io', '/sockjs-node'],
      {
        target: 'https://systemadmin.testnt.thingbine.com',
        changeOrigin: true,
        onProxyReq: (proxyReq) => {
          proxyReq.setHeader('Cookie', 'dwTPlus=s%3AhaauMgcZokIKqnrhtpfbiGDVMK6kY9Ir.Dc10HSazh6er4CF9LFkiUiee52GeoOt9PFhk%2FxJo%2Fn8');
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