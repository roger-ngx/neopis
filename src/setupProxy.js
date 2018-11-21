const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  let cookie;
  app.use(
    proxy(
      ['/api', '/asset'],
      {
        target: 'https://sfactory.testnt.thingbine.com',
        changeOrigin: true,
        secure: false,
        https: true,
        onProxyReq: (proxyReq) => {
          proxyReq.setHeader('Cookie', 'dwTPlus=s%3AKDt_Y9CRmMi013omEfrLpcr4r30ylbAW.SYAec8z3b1L19GRLwTrTLisO0yURT0ZWPBaY7oc3OXk');
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