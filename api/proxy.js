const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (req, res) => {
  let target = '';

  if (req.url.startsWith('/ndzy')) {
    target = 'https://www.yuque.com';
  }

  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      '/ndzy': '',
    },
  })(req, res);
};
