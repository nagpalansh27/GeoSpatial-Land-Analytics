/**
 * CORS Proxy Server for Bhuvan WMS
 * 
 * This server proxies requests to ISRO Bhuvan WMS
 * and adds CORS headers so the browser can load cadastral tiles.
 * 
 * Run: npm start
 * Access: http://localhost:3001
 */

const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = 3001;

// Enable CORS for all origins
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve static files from current directory
app.use(express.static(path.join(__dirname)));

// Proxy for Bhuvan WMS
app.use('/bhuvan', createProxyMiddleware({
    target: 'https://bhuvan-vec2.nrsc.gov.in',
    changeOrigin: true,
    pathRewrite: {
        '^/bhuvan': '/bhuvan'
    },
    onProxyRes: function (proxyRes, req, res) {
        // Add CORS headers to response
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    },
    onError: function (err, req, res) {
        console.error('Proxy error:', err.message);
        res.status(500).json({ error: 'Proxy error', message: err.message });
    }
}));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', proxy: 'active' });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║   Maharashtra Real Estate Map - CORS Proxy Server         ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║   🌐 Proxy running at: http://localhost:${PORT}              ║
║   📍 Bhuvan WMS proxy: http://localhost:${PORT}/bhuvan/wms   ║
║                                                           ║
║   Open the app at: http://localhost:${PORT}/index.html       ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);
});
