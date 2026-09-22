import { chromium } from "/tmp/node_modules/playwright-core/index.mjs";

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--use-angle=swiftshader", "--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3210/", { waitUntil: "networkidle" });
await page.waitForTimeout(4000);
await page.screenshot({ path: "preview/v4-hero.png" });

// 模拟滚轮“划一下”，应吸附到 About
await page.mouse.move(720, 450);
await page.mouse.wheel(0, 320);
await page.waitForTimeout(1600);
const y1 = await page.evaluate(() => window.scrollY);
await page.screenshot({ path: "preview/v4-snap-about.png" });

// 再划一下 → Members
await page.mouse.wheel(0, 320);
await page.waitForTimeout(1600);
const y2 = await page.evaluate(() => window.scrollY);
await page.screenshot({ path: "preview/v4-snap-members.png" });

// 再划一下 → Works
await page.mouse.wheel(0, 320);
await page.waitForTimeout(1600);
const y3 = await page.evaluate(() => window.scrollY);
await page.screenshot({ path: "preview/v4-snap-works.png" });

// 往上划回 Members
await page.mouse.wheel(0, -320);
await page.waitForTimeout(1600);
const y4 = await page.evaluate(() => window.scrollY);

console.log(JSON.stringify({ y1, y2, y3, y4 }));
await browser.close();
