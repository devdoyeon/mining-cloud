const { createProxyMiddleware } = require("http-proxy-middleware");

const dummy = "http://192.168.0.102:8110/"; //마이닝 더미 데이터

module.exports = (app) => {
    app.use(
        "/api",
        createProxyMiddleware({
            target: dummy,
            changeOrigin: true,
            pathRewrite: {
                "^/api": "",
            },
        })
    );
};
