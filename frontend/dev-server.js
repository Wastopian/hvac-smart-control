const fs = require('fs');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const PORT = 3002;
const WS_PORT = 3002;

// Simple file watcher
function watchFiles(directory, callback) {
  const watcher = fs.watch(directory, { recursive: true }, (eventType, filename) => {
    if (filename && (filename.endsWith('.tsx') || filename.endsWith('.ts') || filename.endsWith('.css'))) {
      console.log(`File changed: ${filename}`);
      callback(filename);
    }
  });
  return watcher;
}

// WebSocket server for hot reload
const wss = new WebSocket.Server({ port: WS_PORT });

wss.on('connection', (ws) => {
  console.log('Client connected for hot reload');
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

function broadcast(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// HTTP server
const server = http.createServer((req, res) => {
  const url = req.url === '/' ? '/index.html' : req.url;
  let filePath = path.join(__dirname, url);
  
  // Handle static files
  if (url.startsWith('/src/') || url.startsWith('/public/')) {
    filePath = path.join(__dirname, url);
  }
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('File not found');
    return;
  }
  
  // Set content type
  const ext = path.extname(filePath);
  const contentTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon'
  };
  
  const contentType = contentTypes[ext] || 'text/plain';
  res.setHeader('Content-Type', contentType);
  
  // Inject hot reload script into HTML
  if (ext === '.html') {
    let content = fs.readFileSync(filePath, 'utf8');
    const hotReloadScript = `
      <script>
        const ws = new WebSocket('ws://localhost:${WS_PORT}');
        ws.onmessage = function(event) {
          const data = JSON.parse(event.data);
          if (data.type === 'reload') {
            window.location.reload();
          }
        };
        ws.onopen = function() {
          console.log('Hot reload connected');
        };
        ws.onerror = function(error) {
          console.log('Hot reload error:', error);
        };
      </script>
    `;
    content = content.replace('</body>', hotReloadScript + '</body>');
    res.end(content);
  } else {
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }
});

// Start file watcher
watchFiles('./src', (filename) => {
  broadcast({ type: 'reload', file: filename });
});

server.listen(PORT, () => {
  console.log(`Development server running at http://localhost:${PORT}`);
  console.log(`Hot reload WebSocket server running on port ${WS_PORT}`);
  console.log('Watching for file changes...');
}); 