import AxeBuilder from "@axe-core/playwright";
import { test as base, expect, type Page } from "@playwright/test";

export { expect };

type Fixtures = {
  consoleErrors: string[];
  consoleErrorAllowlist: string[];
};

/**
 * Every E2E test fails if the page logs a console error, a request fails, or an
 * uncaught exception is thrown. Tests that intentionally break a request can
 * opt specific messages out via `test.use({ consoleErrorAllowlist: [...] })`.
 */
export const test = base.extend<Fixtures>({
  consoleErrorAllowlist: [[], { option: true }],
  consoleErrors: [
    async ({ page, consoleErrorAllowlist }, use) => {
      const errors: string[] = [];
      const isAllowed = (message: string) =>
        consoleErrorAllowlist.some((pattern) => message.includes(pattern));

      page.on("console", (message) => {
        if (message.type() === "error" && !isAllowed(message.text())) {
          errors.push(message.text());
        }
      });
      page.on("pageerror", (error) => {
        errors.push(error.message);
      });
      page.on("requestfailed", (request) => {
        const message = `request failed: ${request.url()} (${
          request.failure()?.errorText ?? "unknown"
        })`;

        if (!isAllowed(message)) {
          errors.push(message);
        }
      });

      await use(errors);

      expect(errors, "browser console errors").toEqual([]);
    },
    { auto: true },
  ],
});

export async function expectNoSeriousA11yViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  const blocking = results.violations
    .filter(
      (violation) =>
        violation.impact === "critical" || violation.impact === "serious",
    )
    .map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      help: violation.help,
      nodes: violation.nodes.map((node) => node.target.join(" ")),
    }));

  expect(blocking, "critical or serious axe violations").toEqual([]);
}
