const { chromium } = require("playwright");

async function timeScraper() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: undefined,
  });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://www.timeanddate.com/", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector('a[href="/worldclock/"]');
    await page.click('a[href="/worldclock/"]');
    await page.waitForSelector('a[href="/worldclock/japan/tokyo"]');
    await page.click('a[href="/worldclock/japan/tokyo"]');
    await page.waitForSelector("#ct", { timeout: 5000 });
    const elementText = await page.locator("#ct").textContent();
    if (!elementText) {
      throw new Error("element not found");
    }
    return elementText.trim();
  } catch (error) {
    console.log("Scraping failed: ", error);
    throw error;
  } finally {
    await browser.close();
  }
}

module.exports = timeScraper;
