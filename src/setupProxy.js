const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/ndzy',
    createProxyMiddleware({
      target: 'https://www.yuque.com',
      changeOrigin: true,
      pathRewrite: { '/ndzy': '' },
    }),
  );
};
