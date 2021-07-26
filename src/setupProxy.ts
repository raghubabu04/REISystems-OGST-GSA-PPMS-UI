const { createProxyMiddleware } = require("http-proxy-middleware");
import { Environment } from "./environments/environment";

module.exports = function (app) {
  app.use(
    "/ppms/api/v1/auth*",
    createProxyMiddleware({
      target: Environment.AUTH_URL,
      changeOrigin: true,
    })
  );

  app.use(
    "/ppms/api/v1/user*",
    createProxyMiddleware({
      target: Environment.USER_URL,
      changeOrigin: true,
    })
  );

  app.use(
    "/ppms/api/v1/state*",
    createProxyMiddleware({
      target: Environment.COMMON_URL,
      changeOrigin: true,
    })
  );
};
