// Note: Save this file as server-proxy.cjs for CommonJS support
import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the React app build directory in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
}

// Proxy API requests to Deezer
app.use('/api/deezer', createProxyMiddleware({
  target: 'https://api.deezer.com',
  changeOrigin: true,
  secure: false, // Disable SSL certificate verification (development only!)
  pathRewrite: {
    '^/api/deezer': '', // remove /api/deezer from the URL
  },
  onProxyRes: function (proxyRes, req, res) {
    // Add CORS headers to proxied response
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  },
  onError: (err, req, res) => {
    console.error('Proxy Error:', err);
    res.status(500).send('Proxy Error');
  },
  logLevel: 'debug' // Add more detailed logging
}));

// Handle React routing in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Proxy endpoint: http://localhost:${PORT}/api/deezer`);
});
