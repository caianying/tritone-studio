import { chromium } from "/tmp/node_modules/playwright-core/index.mjs";

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--use-angle=swiftshader", "--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3210/", { waitUntil: "networkidle" });
await page.waitForTimeout(3500);

await page.screenshot({ path: "preview/v2-hero.png" });
await page.evaluate(() => document.querySelector("#about")?.scrollIntoView());
await page.waitForTimeout(1800);
await page.screenshot({ path: "preview/v2-about.png" });
await page.evaluate(() => document.querySelector("#members")?.scrollIntoView());
await page.waitForTimeout(1800);
await page.screenshot({ path: "preview/v2-members.png" });
await page.evaluate(() => document.querySelector("#works")?.scrollIntoView());
await page.waitForTimeout(1800);
await page.screenshot({ path: "preview/v2-works.png" });

// 移动端 + 汉堡菜单
await page.setViewportSize({ width: 390, height: 844 });
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(1500);
await page.screenshot({ path: "preview/v2-mobile-hero.png" });
const burger = await page.$(".burger, [class*=burger]");
if (burger) {
  await burger.click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: "preview/v2-mobile-menu.png" });
} else {
  console.log("NO BURGER FOUND");
}
await browser.close();
console.log("done");
