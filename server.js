import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';

const staticRoot = resolve('dist');
const port = Number(process.env.PORT || 8080);
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

createServer((request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url || '/', 'http://localhost').pathname);
  } catch {
    response.writeHead(400).end();
    return;
  }

  if (pathname === '/app-config.js') {
    const clientConfig = JSON.stringify({
      applicationInsightsConnectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || ''
    });
    response.writeHead(200, {
      'Cache-Control': 'no-store',
      'Content-Type': 'text/javascript; charset=utf-8'
    });
    response.end(`window.APP_CONFIG = ${clientConfig};`);
    return;
  }

  const requestedFile = resolve(staticRoot, `.${pathname}`);
  if (requestedFile !== staticRoot && !requestedFile.startsWith(`${staticRoot}${sep}`)) {
    response.writeHead(404).end();
    return;
  }

  const filePath = existsSync(requestedFile) && statSync(requestedFile).isFile()
    ? requestedFile
    : resolve(staticRoot, 'index.html');

  response.writeHead(200, {
    'Cache-Control': filePath.endsWith('.html') ? 'no-cache' : 'public, max-age=31536000, immutable',
    'Content-Type': contentTypes[extname(filePath).toLowerCase()] || 'application/octet-stream'
  });

  if (request.method === 'HEAD') {
    response.end();
    return;
  }

  createReadStream(filePath).pipe(response);
}).listen(port, '0.0.0.0', () => {
  console.log(`Serving built app on port ${port}`);
});
