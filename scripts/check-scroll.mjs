import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://localhost:3000/partners", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

const info = await page.evaluate(() => ({
  htmlClass: document.documentElement.className,
  bodyClass: document.body.className,
  htmlOverflow: getComputedStyle(document.documentElement).overflow,
  bodyOverflow: getComputedStyle(document.body).overflow,
  htmlHeight: getComputedStyle(document.documentElement).height,
  bodyHeight: getComputedStyle(document.body).height,
  scrollHeight: document.documentElement.scrollHeight,
  clientHeight: document.documentElement.clientHeight,
  bodyScrollHeight: document.body.scrollHeight,
  bodyClientHeight: document.body.clientHeight,
}));

console.log(JSON.stringify(info, null, 2));
await browser.close();
