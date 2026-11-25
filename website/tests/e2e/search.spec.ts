import {
  HOME,
  installClsObserver,
  pressSearchShortcut,
  readCls,
  resetCls,
  resourceIdFromOption,
  waitForDirectory,
} from "./helpers";
import { expect, test } from "./fixtures";

test.describe("instant search", () => {
  test("Ctrl+K opens search, filters without CLS, and ArrowDown + Enter opens the drawer", async ({
    page,
  }) => {
    await installClsObserver(page);
    await page.goto(HOME);
    await waitForDirectory(page);
    await page.waitForTimeout(500);
    await resetCls(page);

    await pressSearchShortcut(page);

    const input = page.getByRole("combobox", { name: "Search resources" });
    await expect(input).toBeFocused();
    await expect(
      page.getByRole("listbox", { name: "Search results" }),
    ).toBeVisible();

    await input.fill("python");

    const options = page.getByRole("option");
    await expect(options.first()).toBeVisible();
    await expect(options.first()).toContainText(/python/i);

    const cls = await readCls(page);
    // CLS is effectively zero; allow sub-pixel rounding noise from the
    // browser's layout-shift scoring (0.0001 is invisible to users).
    expect(cls).toBeLessThan(0.001);

    const initialActive = await input.getAttribute("aria-activedescendant");

    await page.keyboard.press("ArrowDown");
    await expect(input).not.toHaveAttribute(
      "aria-activedescendant",
      initialActive ?? "",
    );

    const activeOptionId = await input.getAttribute("aria-activedescendant");
    const resourceId = resourceIdFromOption(activeOptionId);
    expect(resourceId).not.toBe("");

    await page.keyboard.press("Enter");

    const drawer = page.getByRole("dialog");
    await expect(drawer).toBeVisible();
    await expect(drawer).toContainText("Open Resource");
    await expect(page).toHaveURL(
      new RegExp(`[?&]r=${resourceId}(?:&|$)`),
    );

    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
    await expect(page).not.toHaveURL(/[?&]r=/);
  });
});
