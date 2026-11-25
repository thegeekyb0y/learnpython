import type { Page } from "@playwright/test";

import { HOME, homeUrl, waitForDirectory } from "./helpers";
import { expect, test } from "./fixtures";

async function openYoutube(page: Page) {
  await page.goto(HOME);
  await waitForDirectory(page);
  await page
    .getByRole("button", { name: "YouTube", exact: true })
    .click();
  await expect(
    page.getByRole("group", { name: "Filter by sub-section" }),
  ).toBeVisible();
}

test.describe("sub-section views", () => {
  test("YouTube groups cards and filters by sub-section with history", async ({
    page,
  }) => {
    await openYoutube(page);

    await expect(
      page.getByRole("group", { name: "Filter by category" }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "All 30" }),
    ).toBeVisible();

    for (const title of [
      "Core Python Playlists",
      "AI & ML Playlists",
      "Top Python Creators",
    ]) {
      await expect(page.getByRole("heading", { name: title })).toBeVisible();
    }

    await expect(
      page.getByText("AI & ML Playlist · Video").first(),
    ).toBeVisible();

    await page
      .getByRole("button", { name: "AI & ML Playlists 7" })
      .click();

    await expect(page).toHaveURL(/[?&]section=ai-ml-playlists(?:&|$)/);
    await expect(
      page.getByRole("heading", { name: "AI & ML Playlists" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Core Python Playlists" }),
    ).toHaveCount(0);

    await page.goBack();

    await expect(page).not.toHaveURL(/[?&]section=/);
    await expect(
      page.getByRole("heading", { name: "Core Python Playlists" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Top Python Creators" }),
    ).toBeVisible();
  });

  test("Data & AI shows domain sub-sections in place of category tabs", async ({
    page,
  }) => {
    await page.goto(HOME);
    await waitForDirectory(page);

    await page.getByRole("button", { name: /^Data & AI/ }).click();

    await expect(
      page.getByRole("group", { name: "Filter by sub-section" }),
    ).toBeVisible();
    await expect(
      page.getByRole("group", { name: "Filter by category" }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "All 64" }),
    ).toBeVisible();

    for (const title of [
      "Generative AI & LLMs",
      "Building AI Agents",
      "Vector Databases & RAG",
      "Model Context Protocol (MCP)",
      "Fine-Tuning LLMs",
      "Build an LLM From Scratch",
      "Modern ML Frameworks",
      "Evaluating & Testing LLM Apps",
      "Local & Open-Source LLMs",
      "Domain Applications",
    ]) {
      await expect(page.getByRole("heading", { name: title })).toBeVisible();
    }

    await page
      .getByRole("button", { name: "Generative AI & LLMs 8" })
      .click();
    await expect(page).toHaveURL(/[?&]section=generative-ai-llms(?:&|$)/);
    await expect(
      page.getByRole("heading", { name: "Building AI Agents" }),
    ).toHaveCount(0);
  });

  test("Official Documentation splits into core, AI, and ecosystem docs", async ({
    page,
  }) => {
    await page.goto(HOME);
    await waitForDirectory(page);

    await page
      .getByRole("button", { name: /^Official Documentation/ })
      .click();

    await expect(
      page.getByRole("button", { name: "All 19" }),
    ).toBeVisible();

    for (const title of [
      "Core Python Docs & PEPs",
      "AI & ML Framework Docs",
      "Ecosystem References",
    ]) {
      await expect(page.getByRole("heading", { name: title })).toBeVisible();
    }
  });

  test("A–Z sort and search switch to a unified ledger", async ({ page }) => {
    await page.goto(homeUrl("quick=youtube&sort=az"));
    await waitForDirectory(page);

    await expect(
      page.getByRole("heading", { name: "Core Python Playlists" }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("group", { name: "Filter by sub-section" }),
    ).toBeVisible();
    await expect(page.locator('[data-slot="resource-cell"]')).toHaveCount(30);

    await page
      .getByRole("combobox", { name: "Search resources" })
      .fill("python");

    await expect(
      page.getByRole("heading", { name: "Core Python Playlists" }),
    ).toHaveCount(0);
  });
});

test.describe("sub-section responsive layout", () => {
  for (const viewport of [
    { width: 360, height: 740 },
    { width: 768, height: 1024 },
    { width: 1280, height: 900 },
  ] as const) {
    test(`grouped views fit at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await openYoutube(page);

      await expect(
        page.getByRole("heading", { name: "Core Python Playlists" }),
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        ),
      ).toBeLessThanOrEqual(0);

      await page.goto(HOME);
      await waitForDirectory(page);
      await page.getByRole("button", { name: /^Data & AI/ }).click();
      await expect(
        page.getByRole("heading", { name: "Generative AI & LLMs" }),
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        ),
      ).toBeLessThanOrEqual(0);
    });
  }
});
