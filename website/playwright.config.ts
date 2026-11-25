import { defineConfig, devices } from "@playwright/test";

const port = 4183;
const basePath = "/learnpython";

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } },
    },
  ],
  webServer: {
    command: "npm run build:pages && node tests/e2e/server.mjs",
    url: `http://127.0.0.1:${port}${basePath}/`,
    timeout: 240_000,
    reuseExistingServer: !process.env.CI,
  },
});
