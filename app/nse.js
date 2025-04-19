const puppeteer = require('puppeteer');

async function getData(symbol = 'RELIANCE', strikePrice = 1200) {
  console.log(`Fetching data for ${symbol} with strike price ${strikePrice}`);
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-sandbox',
      '--single-process',
      '--no-zygote'
    ],
    executablePath: process.env.CHROMIUM_PATH || undefined
  });

  try {
    const page = await browser.newPage();
    
    // Configure timeouts
    await page.setDefaultNavigationTimeout(60000);
    await page.setDefaultTimeout(30000);
    
    // Set realistic browser headers
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36'
    );
    
    await page.setExtraHTTPHeaders({
      'accept-language': 'en-US,en;q=0.9',
      'accept-encoding': 'gzip, deflate, br',
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    });

    console.log("Navigating to NSE option chain...");
    
    await page.goto('https://www.nseindia.com/option-chain', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    // Wait for selector without expect-puppeteer
    await page.waitForSelector('#equity-option-chain', { 
      visible: true, 
      timeout: 30000 
    });
    
    console.log("Fetching JSON data from API...");
    
    const jsonData = await page.evaluate(async (symbol) => {
      try {
        const response = await fetch(
          `https://www.nseindia.com/api/option-chain-equities?symbol=${symbol}`,
          {
            headers: {
              'Accept': 'application/json',
              'Referer': 'https://www.nseindia.com/option-chain',
              'X-Requested-With': 'XMLHttpRequest'
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
    }, symbol);

    console.log("Processing data...");
    
    const filtered = jsonData?.records?.data?.filter(item => 
      item.strikePrice === strikePrice
    ) || [];

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
  } finally {
    console.log("Closing browser...");
    await browser.close().catch(err => console.error('Error closing browser:', err));
  }
}

module.exports = { getData };