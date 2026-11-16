import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, parse } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import chokidar from 'chokidar';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Project root is two levels up: static-app/build-scripts/ → project root
const rootDir = join(__dirname, '..', '..');

const PORT = 3000;
const distDir = join(rootDir, 'dist');

// MIME types for static files
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
};

// Build the site on startup
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Import build function - we need to refactor build.mjs to export a build function
// For now, we'll execute it as a child process
import { execSync } from 'child_process';

function build() {
  try {
    execSync('node static-app/build-scripts/build.mjs', { cwd: rootDir, stdio: 'inherit' });
    console.log('✓ Build completed successfully');
  } catch (error) {
    console.error('✗ Build failed:', error.message);
  }
}

// Initial build
console.log('Building site...');
build();

// Create HTTP server
const server = createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  let filePath = join(distDir, parsedUrl.pathname);
  
  // Handle directory index
  if (parsedUrl.pathname === '/' || parsedUrl.pathname === '/index.html') {
    filePath = join(distDir, 'index.html');
  }
  
  // Check if file exists
  if (!existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
    return;
  }
  
  // Read and serve file
  const ext = parse(filePath).ext;
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  
  try {
    const content = readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 Internal Server Error');
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`\n🚀 Development server running at http://localhost:${PORT}`);
  console.log('Watching for changes in cv/ and static-app/ directories...\n');
});

// Set up file watcher
const watcher = chokidar.watch(
  [join(rootDir, 'cv'), join(rootDir, 'static-app')],
  {
    ignored: /(^|[\/\\])\../, // ignore dot files
    persistent: true,
  }
);

let rebuildTimeout;
watcher
  .on('change', (path) => {
    console.log(`📝 File changed: ${path}`);
    
    // Debounce rebuilds to avoid multiple rebuilds for rapid changes
    clearTimeout(rebuildTimeout);
    rebuildTimeout = setTimeout(() => {
      console.log('Rebuilding...');
      build();
    }, 300);
  })
  .on('add', (path) => {
    console.log(`📄 File added: ${path}`);
    
    clearTimeout(rebuildTimeout);
    rebuildTimeout = setTimeout(() => {
      console.log('Rebuilding...');
      build();
    }, 300);
  })
  .on('unlink', (path) => {
    console.log(`🗑️  File removed: ${path}`);
    
    clearTimeout(rebuildTimeout);
    rebuildTimeout = setTimeout(() => {
      console.log('Rebuilding...');
      build();
    }, 300);
  })
  .on('error', (error) => {
    console.error('Watcher error:', error);
  });

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  watcher.close();
  server.close();
  process.exit(0);
});
