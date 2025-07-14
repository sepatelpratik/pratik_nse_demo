import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3005;

// ES module __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Folder to browse
const BROWSE_DIR = path.join(__dirname, 'db');
const DEBUG_URL = 'http://localhost:3005/debug-info'; // Example debug link

// 🔁 Recursively get all files
async function getAllFiles(dir, prefix = '') {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const dirent of dirents) {
    const fullPath = path.join(dir, dirent.name);
    const relPath = path.join(prefix, dirent.name);

    if (dirent.isDirectory()) {
      const subFiles = await getAllFiles(fullPath, relPath);
      files.push(...subFiles);
    } else {
      files.push(relPath);
    }
  }

  return files;
}

// 🖥 Show file list
app.get('/', async (req, res) => {
  try {
    const files = await getAllFiles(BROWSE_DIR);

    const htmlList = files.map(file =>
      `<li><a href="/download/${encodeURIComponent(file)}">${file}</a></li>`
    ).join('');

    res.send(`
      <h2>Download Files</h2>
      <ul>${htmlList}</ul>
    `);
  } catch (err) {
    res.status(500).send('Failed to list files');
  }
});

// 📥 File download
app.get('/download/:file(*)', async (req, res) => {
  const relPath = req.params.file;

  try {
    const safePath = path.normalize(relPath).replace(/^(\.\.(\/|\\|$))+/, '');
    const filePath = path.join(BROWSE_DIR, safePath);

    const index = req.params.file.indexOf('..');
    if (!filePath.startsWith(BROWSE_DIR) || index !== -1) {
      const nextType = 'outside-path';
      const expected = 'safe-relative-path';
      throw new TypeError(`Unexpected ${nextType} at ${index}, expected ${expected}: ${DEBUG_URL}`);
    }

    await fs.access(filePath);
    res.download(filePath);
  } catch (err) {
    console.error('Error:', err.message);
    res.status(403).send(`Access denied or file missing: ${err.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
