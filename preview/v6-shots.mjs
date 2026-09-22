import { chromium } from "/tmp/node_modules/playwright-core/index.mjs";

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--use-angle=swiftshader", "--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3210/", { waitUntil: "networkidle" });
await page.waitForTimeout(4000);
await page.screenshot({ path: "preview/v6-hero.png" });

// 点击缎带 → 涟漪
await page.mouse.click(500, 300);
await page.waitForTimeout(500);
await page.screenshot({ path: "preview/v6-ripple-a.png" });
await page.waitForTimeout(700);
await page.screenshot({ path: "preview/v6-ripple-b.png" });

// 灵敏度测试：滚到 About 内容中部，小滚动应自由浏览、不跳 section
await page.evaluate(() => document.querySelector("#about")?.scrollIntoView());
await page.waitForTimeout(600);
const aboutTop = await page.evaluate(() => window.scrollY);
await page.mouse.move(720, 450);
await page.mouse.wheel(0, 100); // 小滚轮 tick：不应吸附
await page.waitForTimeout(900);
const afterTick = await page.evaluate(() => window.scrollY);
const freeScroll = afterTick > aboutTop + 40 && afterTick < aboutTop + 300;

// 连续慢慢滚过 About 底部 → 越界后吸附到 Members 顶
for (let i = 0; i < 14; i++) {
  await page.mouse.wheel(0, 100);
  await page.waitForTimeout(180);
}
await page.waitForTimeout(1400);
const landed = await page.evaluate(() => {
  const members = document.querySelector("#members");
  return Math.abs(window.scrollY - members.offsetTop) < 40 ? "members-top" : `other:${window.scrollY}`;
});
await page.screenshot({ path: "preview/v6-snap-members.png" });

console.log(JSON.stringify({ aboutTop, afterTick, freeScroll, landed }));
await browser.close();
