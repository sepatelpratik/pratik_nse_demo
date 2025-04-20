import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import axios from 'axios';
import {optionData} from "./data"
// __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, 'data.json');

async function getNseOptionChain(symbol = 'RELIANCE') {
  const jar = new CookieJar();
  const client = wrapper(axios.create({ jar }));

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': `https://www.nseindia.com/get-quotes/derivatives?symbol=${symbol}`,
    'X-Requested-With': 'XMLHttpRequest'
  };

  try {
    await client.get('https://www.nseindia.com/', { headers });
    await client.get(`https://www.nseindia.com/get-quotes/derivatives?symbol=${symbol}`, { headers });
    const response = await client.get(
      `https://www.nseindia.com/api/option-chain-equities?symbol=${symbol}`,
      { headers }
    );

    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch data: ${error.response?.status || error.message}`);
  }
}

async function getNseData(symbol) {
  try {
    let data = await readDataFromFile();
    if (!data.cookie) throw new Error(`cookie not found`);

    const response = await fetch(
      `https://www.nseindia.com/api/option-chain-equities?symbol=${symbol}`,
      {
        headers: {
          'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'accept-language': 'en-US,en;q=0.9',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
          'cookie': data.cookie
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

async function readDataFromFile() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    throw new Error('Error reading file: ' + err.message);
  }
}

async function getData(symbol = 'RELIANCE', strikePrice = 1200) {
  console.log(`Fetching data for ${symbol} with strike price ${strikePrice}`);
  try {
    let getNse = await getNseOptionChain(symbol);

    console.log("Processing data...");

    const filtered = optionData(getNse)

    console.log(`Found ${filtered.length} entries for strike price ${strikePrice}.`);
    return {
      success: true,
      data: filtered,
      timestamp: new Date().toISOString(),
      symbol,
      strikePrice
    };

  } catch (err) {
    console.error('Error in getData:', err);
    return {
      success: false,
      error: err.message,
      timestamp: new Date().toISOString()
    };
  }
}

async function saveDataToFile(data) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    throw new Error('Error writing file: ' + err.message);
  }
}

export { getData, saveDataToFile };