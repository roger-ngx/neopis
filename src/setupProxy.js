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
          proxyReq.setHeader('Cookie', 'dwTPlus=s%3AcXb70dqPsOlFgnwZI7jWOjXHTbDwYN8M.mB1piukLpS7s90XkrbKwX0D%2F9%2BXbDqPqHcDpt2IL7y8');
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