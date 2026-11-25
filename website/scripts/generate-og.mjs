/**
 * Generates the static Open Graph image checked into `public/og-image.png`.
 *
 * The GitHub Pages build is a static export, so the social card must exist as
 * a file at build time. Run `npm run generate:og` after changing the design.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { chromium } from "@playwright/test";

const WIDTH = 1200;
const HEIGHT = 630;
const root = process.cwd();

const logo = await readFile(path.join(root, "public/assets/python-logo.png"));
const logoDataUrl = `data:image/png;base64,${logo.toString("base64")}`;

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <style>
      * { box-sizing: border-box; }
      html, body {
        margin: 0;
        width: ${WIDTH}px;
        height: ${HEIGHT}px;
        overflow: hidden;
        background: #f4f5f7;
        color: #161d24;
        font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      .grid {
        position: absolute;
        inset: 0;
        background-image:
          linear-gradient(#e4e6ea 1px, transparent 1px),
          linear-gradient(90deg, #e4e6ea 1px, transparent 1px);
        background-size: 48px 48px;
        opacity: 0.55;
      }
      .glow {
        position: absolute;
        inset: 0;
        background:
          radial-gradient(760px 520px at 79% 46%, rgba(208, 205, 148, 0.5), rgba(244, 245, 247, 0) 72%),
          radial-gradient(520px 360px at 96% 92%, rgba(60, 71, 125, 0.12), rgba(244, 245, 247, 0) 70%);
      }
      .wrap {
        position: relative;
        display: flex;
        height: 100%;
        flex-direction: column;
        padding: 54px 64px 44px;
      }
      .top { display: flex; align-items: center; gap: 14px; }
      .mark {
        display: flex;
        height: 40px;
        width: 40px;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        background: #161d24;
        color: #d0cd94;
        font: 600 15px/1 "Cascadia Code", Consolas, monospace;
      }
      .brand {
        font: 500 12px/1 "Cascadia Code", Consolas, monospace;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: #667079;
      }
      .brand b { color: #161d24; font-weight: 600; }
      .main {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: space-between;
        gap: 36px;
        padding-top: 6px;
      }
      h1 {
        margin: 0;
        font-size: 72px;
        line-height: 1.02;
        font-weight: 650;
        letter-spacing: -0.045em;
      }
      h1 .accent { color: #3c477d; }
      .sub {
        margin: 22px 0 0;
        max-width: 570px;
        font-size: 22px;
        line-height: 1.45;
        color: #5b656e;
      }
      .chips { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 28px; }
      .chip {
        border: 1px solid #d9dce1;
        border-radius: 8px;
        background: #ffffff;
        padding: 8px 11px;
        font: 500 11px/1 "Cascadia Code", Consolas, monospace;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #161d24;
      }
      .chip i {
        display: inline-block;
        height: 7px;
        width: 7px;
        margin-right: 7px;
        border-radius: 99px;
        vertical-align: 1px;
      }
      .logo {
        position: relative;
        display: flex;
        height: 380px;
        width: 390px;
        flex: none;
        align-items: center;
        justify-content: center;
      }
      .logo::before {
        position: absolute;
        height: 310px;
        width: 310px;
        border-radius: 99px;
        background: rgba(255, 255, 255, 0.72);
        box-shadow: 0 40px 90px rgba(22, 29, 36, 0.1);
        content: "";
      }
      .logo img {
        position: relative;
        width: 316px;
        height: auto;
        filter: drop-shadow(0 22px 28px rgba(22, 29, 36, 0.16));
      }
      .float {
        position: absolute;
        z-index: 2;
        border: 1px solid #d9dce1;
        border-radius: 9px;
        background: #ffffff;
        padding: 9px 12px;
        font: 500 12px/1 "Cascadia Code", Consolas, monospace;
        color: #5b656e;
        box-shadow: 0 10px 24px rgba(22, 29, 36, 0.08);
      }
      .f1 { top: 26px; left: 2px; color: #3c477d; }
      .f2 { top: 106px; right: 0; }
      .f3 {
        bottom: 32px;
        left: 34px;
        border-color: #bdb97c;
        background: rgba(208, 205, 148, 0.72);
        color: #161d24;
      }
      .bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 1px solid #d9dce1;
        padding-top: 16px;
        font: 500 11px/1 "Cascadia Code", Consolas, monospace;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #667079;
      }
    </style>
  </head>
  <body>
    <div class="grid"></div>
    <div class="glow"></div>
    <div class="wrap">
      <div class="top">
        <span class="mark">py</span>
        <span class="brand"><b>learn-python</b> / curated-resources</span>
      </div>
      <div class="main">
        <div>
          <h1><span class="accent">Python</span> resources<br />for everyone.</h1>
          <p class="sub">
            Official docs, books, videos, tools, and communities — curated and
            maintained for every stage of the journey.
          </p>
          <div class="chips">
            <span class="chip"><i style="background:#4cb33d"></i>Official docs</span>
            <span class="chip"><i style="background:#3c477d"></i>Books</span>
            <span class="chip"><i style="background:#c77d4a"></i>Videos</span>
            <span class="chip"><i style="background:#d0cd94"></i>Tools</span>
          </div>
        </div>
        <div class="logo">
          <img src="${logoDataUrl}" alt="" />
          <span class="float f1">&gt;&gt;&gt;</span>
          <span class="float f2">def main():</span>
          <span class="float f3">.py</span>
        </div>
      </div>
      <div class="bottom">
        <span>56 curated resources</span>
        <span>thegeekyb0y.github.io/learnpython</span>
      </div>
    </div>
  </body>
</html>`;

const browser = await chromium.launch();

try {
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });

  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images).map((image) => image.decode()),
    );
  });

  const png = await page.screenshot({
    type: "png",
    clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
  });

  await writeFile(path.join(root, "public/og-image.png"), png);
  console.log(`Wrote public/og-image.png (${WIDTH}x${HEIGHT}, ${png.length} bytes)`);
} finally {
  await browser.close();
}
