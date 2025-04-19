const { Builder, By } = require('selenium-webdriver');

async function getData() {
  let driver = await new Builder().forBrowser('chrome').build();

  let a = []

  try {
    await driver.get('https://www.nseindia.com/');
    await driver.sleep(1000);
    // Navigate to NSE India Option Chain
    await driver.get('https://www.nseindia.com/api/option-chain-equities?symbol=RELIANCE');

    // Wait a few seconds for the page to load
    // await driver.sleep(1000);

    const jsonText = await driver.findElement(By.css('body')).getText();

    const data = JSON.parse(jsonText);
    // console.log('Data from page:', data);

    if(data.records.data){
        data.records.data.forEach(element => {
            if(element.strikePrice === 1200){
                // console.log(element);y
                a.push(element)
            }
        });
    }
    console.log(a.length);
    
    return a
    // console.log()
    // Get all cookies
    // const cookies = await driver.manage().getCookies();
    // console.log('Cookies:', cookies);

    // // Optionally format them as a cookie header string
    // const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');
    // console.log('\nCookie Header:\n', cookieHeader);

  } catch (err) {
    console.error('Error:', err.message);
    throw err
  } finally {
    await driver.quit();
    return a
  }
};
// getData()
module.exports = { getData }