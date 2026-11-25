import type { Page } from "@playwright/test";

export const HOME = "/learnpython/";

export function homeUrl(query?: string) {
  return query ? `${HOME}?${query}` : HOME;
}

export type LayoutShiftWindow = Window & { __cls?: number };

/**
 * Starts a Cumulative Layout Shift observer before the page loads. Call
 * `resetCls` once the initial render settles, then read it after interactions.
 */
export async function installClsObserver(page: Page) {
  await page.addInitScript(() => {
    const target = window as LayoutShiftWindow;
    target.__cls = 0;

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const shift = entry as PerformanceEntry & {
          value?: number;
          hadRecentInput?: boolean;
        };

        if (shift.hadRecentInput) {
          continue;
        }

        target.__cls = (target.__cls ?? 0) + (shift.value ?? 0);
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
}

export async function resetCls(page: Page) {
  await page.evaluate(() => {
    (window as LayoutShiftWindow).__cls = 0;
  });
}

export async function readCls(page: Page) {
  return page.evaluate(() => (window as LayoutShiftWindow).__cls ?? 0);
}

export async function pressSearchShortcut(page: Page) {
  await page.keyboard.press(
    process.platform === "darwin" ? "Meta+K" : "Control+K",
  );
}

export async function waitForDirectory(page: Page) {
  await page
    .locator('[data-slot="resource-cell"], [data-slot="resource-row"]')
    .first()
    .waitFor({ state: "visible" });
}

export function resourceIdFromOption(optionId: string | null) {
  return optionId?.replace(/^resource-search-option-/, "") ?? "";
}
