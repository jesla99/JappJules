/**
 * Version 1.0
 * Servidor que lanza la aplicación (carpeta dist) y que no se actualzia de forma automática
 *  se lanza desde (node w2 web) o manualmente (node run.js) 
 * 
 */

const http = require('http');
const fs = require('fs').promises; // Usamos la versión de promesas
const path = require('path');
const url = require('url');

const port = 5500;
// Serviremos archivos desde una carpeta 'public' en el mismo directorio
const rootDir = path.join(process.cwd(), 'dist');

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
};

// --- Función para servir un archivo ---
async function serveFile(filePath, res) {
  try {
    const fileContent = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(fileContent);
  } catch (err) {
    console.error(err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 Internal Server Error');
  }
}

// --- Función para servir un listado de directorio ---
async function serveDirectory(dirPath, reqPath, res) {
  try {
    // 1. Lee las entradas del directorio (archivos y carpetas)
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    let html = `<html><head><title>Index of ${reqPath}</title></head><body>`;
    html += `<h1>Index of ${reqPath}</h1><ul>`;

    // 2. Agrega un enlace para "subir" (../) si no estamos en la raíz
    if (reqPath !== '/') {
      const parentPath = path.join(reqPath, '..').replace(/\\/g, '/');
      html += `<li><a href="${parentPath}">../</a></li>`;
    }

    // 3. Genera un <li> por cada archivo y carpeta
    for (const entry of entries) {
      const entryPath = path.join(reqPath, entry.name).replace(/\\/g, '/');
      const entryName = entry.name + (entry.isDirectory() ? '/' : '');
      const entryLink = entry.isDirectory() ? `${entryPath}/` : entryPath;
      
      html += `<li><a href="${entryLink}">${entryName}</a></li>`;
    }

    html += '</ul></body></html>';
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  } catch (err) {
    console.error(err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 Internal Server Error');
  }
}

// --- Creación del Servidor Principal ---
const server = http.createServer(async (req, res) => {
  try {
    // 1. Obtiene la ruta solicitada y decodifica (ej. "mi%20archivo.txt" -> "mi archivo.txt")
    const reqPath = decodeURIComponent(url.parse(req.url).pathname);
    
    // 2. Crea la ruta completa en el sistema de archivos
    const filePath = path.join(rootDir, reqPath);

    // 3. (Seguridad) Evita que se acceda a archivos fuera de 'rootDir'
    if (!filePath.startsWith(rootDir)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('403 Forbidden');
      return;
    }

    // 4. Obtiene estadísticas del archivo/carpeta
    const stats = await fs.stat(filePath);

    if (stats.isDirectory()) {
      // --- ES UNA CARPETA ---

      // 4a. Si es una carpeta y la URL no termina en '/', redirige
      if (!reqPath.endsWith('/')) {
        res.writeHead(301, { 'Location': reqPath + '/' });
        res.end();
        return;
      }
      
      // 4b. Busca un 'index.html' dentro de la carpeta
      const indexPath = path.join(filePath, 'index.html');
      try {
        await fs.stat(indexPath);
        // Si 'index.html' existe, sírvelo
        await serveFile(indexPath, res);
      } catch (e) {
        // Si 'index.html' NO existe, muestra el listado
        await serveDirectory(filePath, reqPath, res);
      }
    } else if (stats.isFile()) {
      // --- ES UN ARCHIVO ---
      await serveFile(filePath, res);
    }

  } catch (err) {
    if (err.code === 'ENOENT') {
      // ENOENT = Error NO ENTry (No encontrado)
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    } else {
      console.error(err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
    }
  }
});

// Inicia el servidor
server.listen(port, () => {
  console.log(`JappN ejecutandose en http://localhost:${port}`);
  //console.log(`Sirviendo archivos desde: ${rootDir}`);
});