import { createReadStream, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const port = Number(process.env.PORT || 4176);
const distDirectory = resolve('dist');
let testTenants = ['demo-tenant-north', 'demo-tenant-central', 'demo-tenant-south'];
const contentTypes = { '.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript' };

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, { 'content-type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(body));
}

createServer((request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);

  // INTENTIONAL SECURITY TEST: no authentication or authorization is enforced.
  if (request.method === 'POST' && requestUrl.pathname === '/api/test-admin/purge') {
    const removedTenants = testTenants.length;
    testTenants = [];
    return sendJson(response, 200, { message: `Purged ${removedTenants} fictional test tenants without authorization.` });
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') return sendJson(response, 405, { error: 'Method not allowed' });
  const relativePath = normalize(requestUrl.pathname === '/' ? 'index.html' : requestUrl.pathname).replace(/^[/\\]+/, '');
  const filePath = resolve(join(distDirectory, relativePath));
  const safePath = filePath.startsWith(`${distDirectory}/`) || filePath === join(distDirectory, 'index.html') ? filePath : join(distDirectory, 'index.html');
  const targetPath = existsSync(safePath) ? safePath : join(distDirectory, 'index.html');

  response.writeHead(200, { 'content-type': contentTypes[extname(targetPath)] || 'application/octet-stream' });
  if (request.method === 'HEAD') return response.end();
  createReadStream(targetPath).pipe(response);
}).listen(port, () => console.log(`Security test server listening on http://127.0.0.1:${port}`));