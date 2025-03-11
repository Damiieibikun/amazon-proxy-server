// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// Enable CORS for all routes
app.use(cors());
require('dotenv').config()
// Proxy middleware
app.use('/api', async (req, res) => {
  try {
    const targetURL = process.env.REACT_APP_BASEURL + req.url.replace('/api', '');
    const response = await axios({
      method: req.method,
      url: targetURL,
      data: req.body,
      headers: {
        ...req.headers,
        host: process.env.REACT_APP_HOST // Override host if needed
      }
    });
    res.send(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).send(error.message);
  }
});

app.options('*', cors());

const PORT = process.env.REACT_APP_PORT;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));

