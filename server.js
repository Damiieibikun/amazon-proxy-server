const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(cors());
require("dotenv").config();
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
});

app.use(
  "/api",
  createProxyMiddleware({
    target: process.env.BASEURL, 
    changeOrigin: true,
    secure: false,
    pathRewrite: { "^/api": "/v2" },
    timeout: 60000, // 60 seconds timeout
    proxyTimeout: 60000,
    headers: { "Connection": "keep-alive" },
    logLevel: "debug", // ✅ Enable Debugging

    // ✅ Log Proxy Errors
    onError: (err, req, res) => {
      console.error("Proxy Error:", err);
      res.status(500).json({ error: "Proxy failed to connect to target API" });
    },

    // ✅ Log Proxy Requests
    onProxyReq: (proxyReq, req, res) => {
      console.log(`🔁 Forwarding request to: ${process.env.REACT_APP_BASEURL}${req.url}`);
    },

    // ✅ Log Proxy Responses
    onProxyRes: (proxyRes, req, res) => {
      console.log(`✅ Response received from target API: ${proxyRes.statusCode}`);
    },
  })
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
