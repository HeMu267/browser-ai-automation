import { chromium } from "playwright";


const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();
await page.goto("https://ui.chaicode.com/",{waitUntil:"domcontentloaded"});
await browser.close();
