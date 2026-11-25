import { HOME, waitForDirectory } from "./helpers";
import { expect, test } from "./fixtures";

test.describe("quick navigation and ledger views", () => {
  test("Official Documentation activates the chip, scrolls the feed, and toggles views", async ({
    page,
  }) => {
    await page.goto(HOME);
    await waitForDirectory(page);

    await page
      .getByRole("button", { name: /^Official Documentation/ })
      .click();

    const chip = page.getByRole("button", {
      name: "Clear collection filter: Official Documentation",
    });
    await expect(chip).toBeVisible();
    await expect(chip).toContainText("Collection: Official Documentation");
    await expect(page).toHaveURL(/[?&]quick=official(?:&|$)/);

    const feed = page.locator("#directory-feed");
    await expect(feed).toBeInViewport();

    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(0);

    const stickyBarBottom = await page
      .locator('[data-slot="filter-bar"]')
      .evaluate((bar) => bar.getBoundingClientRect().height + 56);

    await expect
      .poll(() => feed.evaluate((node) => node.getBoundingClientRect().top))
      .toBeGreaterThanOrEqual(stickyBarBottom - 2);

    await page.getByRole("button", { name: "Compact list view" }).click();
    await expect(page.locator('[data-slot="resource-row"]').first()).toBeVisible();
    await expect(page.locator('[data-slot="resource-cell"]')).toHaveCount(0);

    await page.getByRole("button", { name: "Grid view" }).click();
    await expect(page.locator('[data-slot="resource-cell"]').first()).toBeVisible();
    await expect(page.locator('[data-slot="resource-row"]')).toHaveCount(0);
  });
});
