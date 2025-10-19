const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    message: 'Railway test server is working',
    path: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  }));
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running on port ${PORT}`);
});