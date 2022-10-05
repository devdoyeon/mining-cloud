const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = app => {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://192.168.0.102:8110/',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    })
  );
};
