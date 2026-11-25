import { HOME, homeUrl, waitForDirectory } from "./helpers";
import {
  expect,
  expectNoSeriousA11yViolations,
  test,
} from "./fixtures";

test.describe("accessibility", () => {
  test("home page has no critical or serious axe violations", async ({
    page,
  }) => {
    await page.goto(HOME);
    await waitForDirectory(page);
    await expectNoSeriousA11yViolations(page);
  });

  test("open resource drawer has no critical or serious axe violations", async ({
    page,
  }) => {
    await page.goto(homeUrl("r=python-documentation"));
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.waitForTimeout(400);
    await expectNoSeriousA11yViolations(page);
  });

  test("mobile drawer has no critical or serious axe violations", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto(homeUrl("r=python-documentation"));
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.waitForTimeout(400);
    await expectNoSeriousA11yViolations(page);
  });

  test("grouped YouTube view has no critical or serious axe violations", async ({
    page,
  }) => {
    await page.goto(HOME);
    await waitForDirectory(page);
    await page.getByRole("button", { name: "YouTube", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Core Python Playlists" }),
    ).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });
});

const viewports = [
  { width: 360, height: 740 },
  { width: 768, height: 1024 },
  { width: 1280, height: 900 },
] as const;

test.describe("responsive overflow", () => {
  for (const viewport of viewports) {
    test(`no horizontal overflow at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(HOME);
      await waitForDirectory(page);

      const pageOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(pageOverflow).toBeLessThanOrEqual(0);

      await page.locator('[data-slot="resource-cell"]').first().click();
      await expect(page.getByRole("dialog")).toBeVisible();

      const drawerOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(drawerOverflow).toBeLessThanOrEqual(0);
    });
  }
});
