const puppeteer = require('puppeteer');

async function getData() {
  const browser = await puppeteer.launch({ headless: 'new' }); // or `true` for older versions
  const page = await browser.newPage();

  // Set necessary headers to avoid 403
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36'
  );

  await page.setExtraHTTPHeaders({
    'accept-language': 'en-US,en;q=0.9',
  });

  try {
    // First, load the main page to set cookies/session
    await page.goto('https://www.nseindia.com/option-chain', {
      waitUntil: 'domcontentloaded',
    });

    // Wait briefly to ensure session cookies are stored
    // await page.waitForTimeout(1500);

    // Now fetch the JSON using fetch in browser context
    const jsonData = await page.evaluate(async () => {
      const response = await fetch(
        'https://www.nseindia.com/api/option-chain-equities?symbol=RELIANCE',
        {
          headers: {
            'Accept': 'application/json',
            'Referer': 'https://www.nseindia.com/option-chain',
          },
        }
      );
      return await response.json();
    });

    // Filter by strikePrice
    const filtered = [];
    if (jsonData.records && jsonData.records.data) {
      jsonData.records.data.forEach((item) => {
        if (item.strikePrice === 1200) {
          filtered.push(item);
        }
      });
    }

    console.log(`Found ${filtered.length} entries.`);
    return filtered;

  } catch (err) {
    console.error('Error:', err.message);
    return [];
  } finally {
    await browser.close();
  }
}

// getData();
module.exports = { getData };
