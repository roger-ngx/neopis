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
          proxyReq.setHeader('Cookie', 'dwTPlus=s%3A_5heqap5t-A0F9B-x5AOy4_tzzDdgyCO.gajCigFyNyvcE8oV55M0e8XW91eTX23X%2FfxfgfJnx5g');
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