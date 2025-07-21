import os from 'os';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
let relianceFile = 'D:/Project/pratik_nse_demo/db/reliance/2025/07/20/RELIANCE-1753023050406.json';
let niftyFile = 'D:/Project/pratik_nse_demo/db/nifty/2025/07/20/NIFTY-1753023050406.json';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const nowDate = new Date();
console.log(
  nowDate.getDate() +
    '-' +
    nowDate.getHours() +
    '-' +
    nowDate.getMinutes() +
    '-' +
    nowDate.getSeconds(),
);
const DATA_FILE = path.join(__dirname, 'data.json');

function getDateStr() {
  const now = new Date();
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const time = `${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
  return `${date}-${time}`;
}

function getYearMonthStr() {
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  return {
    year: now.getFullYear(),
    month: String(now.getMonth() + 1).padStart(2, '0'),
    dateStr: dateStr,
    date: now.getDate(),
    hours: now.getHours(),
    minutes: now.getMinutes(),
    seconds: now.getSeconds(),
  };
}

function getCurrentIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'IP not found';
}

async function readDataFromFile() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    throw new Error('Error reading file: ' + err.message);
  }
}
async function saveDataToFile(data, name = 'reliance') {
  try {
    const getYearMonthStrObj = getYearMonthStr();
    const dir = path.resolve(
      __dirname,
      `db/${name}/${getYearMonthStrObj.year}/${getYearMonthStrObj.month}/${getYearMonthStrObj.date}`,
    );
    const fileName = `${name}-${Date.now()}.json`;
    const filePath = path.join(dir, fileName);

    await fs.mkdir(dir, { recursive: true }); // create directory if not exists
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');

    if (name === 'reliance') {
      relianceFile = filePath;
    } else if (name === 'nifty') {
      niftyFile = filePath;
    }
    console.log(`✅ File saved: ${filePath}`);
  } catch (err) {
    console.error('❌ Error writing file:', err.message);
  }
}

function getFilePath(name = 'reliance') {
  if (name === 'RELIANCE' || name === 'reliance') {
    return relianceFile;
  } else {
    return niftyFile;
  }
}
async function readLastFile(name = 'reliance') {
  try {
    const filePath = getFilePath(name);

    if (!filePath) {
      throw new Error(`No file path found for ${name}`);
    }
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data).data;
  } catch (err) {
    throw new Error('Error reading file: ' + err.message);
  }
}
console.log('Your IP Address is:', getCurrentIP());
export { getCurrentIP, readDataFromFile, saveDataToFile, getFilePath, readLastFile };
