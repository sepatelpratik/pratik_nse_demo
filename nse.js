import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import axios from "axios";
import { optionData, convertToText } from "./cal.js";
import { saveDataToFile } from "./ip.js";

async function getNseOptionChain(symbol = "RELIANCE") {
  const jar = new CookieJar();
  const client = wrapper(axios.create({ jar }));

  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    Accept: "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    Referer: `https://www.nseindia.com/get-quotes/derivatives?symbol=${symbol}`,
    "X-Requested-With": "XMLHttpRequest",
  };

  try {
    await client.get("https://www.nseindia.com/", { headers });
    await client.get(
      `https://www.nseindia.com/get-quotes/derivatives?symbol=${symbol}`,
      { headers }
    );
    const response = await client.get(
      `https://www.nseindia.com/api/quote-derivative?symbol=${symbol}`,
      { headers }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to fetch data: ${error.response?.status || error.message}`
    );
  }
}

async function saveOptionsCron(symbol = "RELIANCE") {
  // const getYearMonthStrObj = getYearMonthStr(); 
   let nseData = await getNseOptionChain(symbol);
  saveDataToFile({ symbol, timestamp:Date.now(), dateLocal: new Date().toLocaleTimeString(),date: new Date(),data:nseData }, symbol);
}

async function getData(symbol = "RELIANCE", strikePrice = 1200) {
  try {
    let getNse = await getNseOptionChain(symbol);

    const filtered = optionData(getNse);
    // saveMultipleData(filtered);
    return {
      success: true,
      data: filtered,
      timestamp: new Date().toISOString(),
      symbol,
      isOK: filtered.isOK
    };
  } catch (err) {
    console.error("Error in getData:", err);
    return {
      success: false,
      error: err.message,
      timestamp: new Date().toISOString(),
    };
  }
}

async function getNiftyData() {
  const jar = new CookieJar();
  const client = wrapper(axios.create({ jar }));

  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    Accept: "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    Referer: `https://www.nseindia.com/api/marketStatus`,
    "X-Requested-With": "XMLHttpRequest",
  };

  try {
    await client.get("https://www.nseindia.com/", { headers });

    const response = await client.get(
      `https://www.nseindia.com/api/marketStatus`,
      { headers }
    );
    const toText = convertToText(response.data);
    return toText;
  } catch (error) {
    throw new Error(
      `Failed to fetch data: ${error.response?.status || error.message}`
    );
  }
}

export { getData, getNiftyData,saveOptionsCron };
