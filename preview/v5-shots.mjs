import { chromium } from "/tmp/node_modules/playwright-core/index.mjs";

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--use-angle=swiftshader", "--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3210/", { waitUntil: "networkidle" });
await page.waitForTimeout(4000);
await page.screenshot({ path: "preview/v5-hero.png" });

// 鼠标顶起交互：移到右侧，缎带应隆起
await page.mouse.move(1150, 330);
await page.waitForTimeout(1500);
await page.screenshot({ path: "preview/v5-hero-push.png" });

// 小滚动（100 < 130 阈值）：应正常滚动到 About 内部而不是跳 section
await page.mouse.move(720, 450);
await page.mouse.wheel(0, 100);
await page.waitForTimeout(1200);
const small = await page.evaluate(() => window.scrollY);

// 滚到 About 底部边缘再滚 → 吸附到 Members
await page.evaluate(() => {
  const about = document.querySelector("#about");
  window.scrollTo(0, about.offsetTop + about.offsetHeight - window.innerHeight - 20);
});
await page.waitForTimeout(400);
await page.mouse.wheel(0, 100);
await page.waitForTimeout(1500);
const afterEdge = await page.evaluate(() => {
  const members = document.querySelector("#members");
  return Math.abs(window.scrollY - members.offsetTop) < 30 ? "members-top" : `other:${window.scrollY}`;
});
await page.screenshot({ path: "preview/v5-snap-members.png" });

// 猛划（300）→ 直接切到 Works
await page.mouse.wheel(0, 300);
await page.waitForTimeout(1500);
const afterFlick = await page.evaluate(() => {
  const works = document.querySelector("#works");
  return Math.abs(window.scrollY - works.offsetTop) < 30 ? "works-top" : `other:${window.scrollY}`;
});

console.log(JSON.stringify({ small, afterEdge, afterFlick }));
await browser.close();
