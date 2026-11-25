import { HOME } from "./helpers";
import { expect, test } from "./fixtures";

const siteBase = "https://thegeekyb0y.github.io/learnpython";

test.describe("metadata and static assets", () => {
  test("Open Graph, Twitter, canonical, and icons resolve under the base path", async ({
    page,
    request,
  }) => {
    await page.goto(HOME);

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${siteBase}/`,
    );
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute(
      "href",
      "/learnpython/icon.svg",
    );

    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      "Curated Python Resources",
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      `${siteBase}/`,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      `${siteBase}/og-image.png`,
    );
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute(
      "content",
      "1200",
    );
    await expect(
      page.locator('meta[property="og:image:height"]'),
    ).toHaveAttribute("content", "630");

    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
      "content",
      `${siteBase}/og-image.png`,
    );

    const html = await page.content();
    expect(html).not.toContain("/learnpython/learnpython");

    const ogImage = await request.get("/learnpython/og-image.png");
    expect(ogImage.status()).toBe(200);

    const ogBody = await ogImage.body();
    expect(ogBody.subarray(1, 4).toString("ascii")).toBe("PNG");
    expect(ogBody.readUInt32BE(16)).toBe(1200);
    expect(ogBody.readUInt32BE(20)).toBe(630);

    const icon = await request.get("/learnpython/icon.svg");
    expect(icon.status()).toBe(200);
    expect(await icon.text()).toContain("<svg");

    const logo = await request.get("/learnpython/assets/python-logo.png");
    expect(logo.status()).toBe(200);

    const heroLogo = page.locator('[data-slot="python-logo-image"]');
    await expect(heroLogo).toBeVisible();
    expect(
      await heroLogo.evaluate((image) => (image as HTMLImageElement).naturalWidth),
    ).toBeGreaterThan(0);
  });
});

test.describe("hero logo fallback", () => {
  test.use({
    consoleErrorAllowlist: [
      "assets/python-logo.png",
      "Failed to load resource",
    ],
  });

  test("renders the branded fallback instead of a broken image", async ({
    page,
  }) => {
    await page.route("**/assets/python-logo.png", (route) => route.abort());
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(HOME);

    const fallback = page.locator('[data-slot="python-logo-fallback"]');
    await expect(fallback).toBeVisible();
    await expect(fallback).toHaveText("py");
    await expect(page.locator('[data-slot="hero-visual"] img')).toHaveCount(0);
  });
});
