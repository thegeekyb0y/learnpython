import { HOME, homeUrl, waitForDirectory } from "./helpers";
import { expect, test } from "./fixtures";

test.describe("deep links and browser history", () => {
  test("opening a resource updates ?r= and goBack closes the drawer", async ({
    page,
  }) => {
    await page.goto(HOME);
    await waitForDirectory(page);

    const cell = page.locator('[data-slot="resource-cell"]').first();
    const resourceId = await cell.getAttribute("data-resource-id");
    expect(resourceId).toBeTruthy();

    await cell.click();

    const drawer = page.getByRole("dialog");
    await expect(drawer).toBeVisible();
    await expect(page).toHaveURL(
      new RegExp(`[?&]r=${resourceId}(?:&|$)`),
    );

    await page.goBack();

    await expect(drawer).toBeHidden();
    await expect(page).not.toHaveURL(/[?&]r=/);
  });

  test("cold-loading ?r=<id> opens that resource immediately", async ({
    page,
  }) => {
    await page.goto(homeUrl("r=python-documentation"));

    const drawer = page.getByRole("dialog");
    await expect(drawer).toBeVisible();
    await expect(
      drawer.getByRole("heading", { name: "Python Documentation" }),
    ).toBeVisible();
    await expect(page).toHaveURL(/[?&]r=python-documentation(?:&|$)/);
  });
});
