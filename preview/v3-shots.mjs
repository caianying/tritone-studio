import { chromium } from "/tmp/node_modules/playwright-core/index.mjs";

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--use-angle=swiftshader", "--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3210/", { waitUntil: "networkidle" });
await page.waitForTimeout(4500);
await page.screenshot({ path: "preview/v3-hero.png" });
// 移动鼠标触发视差后再截一张
await page.mouse.move(1100, 250);
await page.waitForTimeout(1200);
await page.screenshot({ path: "preview/v3-hero-parallax.png" });
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(2000);
await page.screenshot({ path: "preview/v3-mobile.png" });
await browser.close();
console.log("done");
