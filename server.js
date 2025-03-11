const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Enable CORS for all requests
app.use(cors());
require('dotenv').config()
// Allow JSON body parsing
app.use(express.json());

// Proxy requests to the HTTP API
// app.use(
//   "/api",
//   createProxyMiddleware({
//     target: process.env.REACT_APP_BASEURL, // Target API
//     changeOrigin: true,
//     secure: false, // Allow HTTP
//     pathRewrite: { "^/api": "/v2" }, // Rewrite "/api" to "/v2"
//     onProxyReq: (proxyReq, req, res) => {
//       if (req.body) {
//         let bodyData = JSON.stringify(req.body);
//         proxyReq.setHeader("Content-Type", "application/json");
//         proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
//         proxyReq.write(bodyData);
//       }
//     },
//   })
// );

app.use(
    "/api",
    createProxyMiddleware({
      target: process.env.REACT_APP_BASEURL, 
      changeOrigin: true,
      secure: false,
      pathRewrite: { "^/api": "/v2" },
      timeout: 60000, // 60 seconds timeout
      proxyTimeout: 60000,
    })
  );

const PORT = process.env.REACT_APP_PORT;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});



