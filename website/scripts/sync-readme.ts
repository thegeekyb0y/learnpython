import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { categories } from "../src/data/categories";
import { resources } from "../src/data/resources";
import { formatLabels } from "../src/lib/directory";

const START_MARKER = "<!-- CATALOG:START -->";
const END_MARKER = "<!-- CATALOG:END -->";
const SITE_URL = "https://thegeekyb0y.github.io/learnpython";
const readmePath = path.resolve(__dirname, "../../README.md");

function escapeCell(value: string) {
  return value.replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
}

function escapeLinkText(value: string) {
  return value.replace(/\[/g, "\\[").replace(/\]/g, "\\]");
}

function renderCatalog() {
  const lines: string[] = [];

  for (const category of categories) {
    const entries = resources.filter(
      (resource) => resource.category === category.id,
    );

    lines.push(`### ${category.label} (${entries.length})`, "");

    if (entries.length === 0) {
      lines.push("_No resources yet._", "");
      continue;
    }

    const subcategories = [...new Set(entries.map((entry) => entry.subcategory))]
      .sort((a, b) => a.localeCompare(b, "en"));

    for (const subcategory of subcategories) {
      const rows = entries.filter(
        (entry) => entry.subcategory === subcategory,
      );

      lines.push(`#### ${subcategory} (${rows.length})`, "");
      lines.push("| Resource | Provider | Format | Details |");
      lines.push("| --- | --- | --- | --- |");

      for (const resource of rows) {
        const title = escapeLinkText(resource.title);
        const provider = resource.provider
          ? escapeCell(resource.provider)
          : "—";
        const details = `${SITE_URL}/?r=${encodeURIComponent(resource.id)}`;

        lines.push(
          `| [${title}](${resource.url}) | ${provider} | ${formatLabels[resource.format]} | [Open drawer](${details}) |`,
        );
      }

      lines.push("");
    }
  }

  return lines.join("\n").trim();
}

async function main() {
  const readme = await readFile(readmePath, "utf8");
  const startIndex = readme.indexOf(START_MARKER);
  const endIndex = readme.indexOf(END_MARKER, startIndex + START_MARKER.length);

  if (startIndex === -1 || endIndex === -1) {
    console.error(
      `Could not find ${START_MARKER} / ${END_MARKER} in ${readmePath}.`,
    );
    process.exitCode = 1;
    return;
  }

  const before = readme.slice(0, startIndex + START_MARKER.length);
  const after = readme.slice(endIndex);
  const nextReadme = `${before}\n\n${renderCatalog()}\n\n${after}`;
  const checkOnly = process.argv.includes("--check");

  if (nextReadme === readme) {
    console.log(
      `README catalog is up to date (${resources.length} resources).`,
    );
    return;
  }

  if (checkOnly) {
    console.error(
      "README catalog is out of date. Run `npm run sync:readme` and commit the result.",
    );
    process.exitCode = 1;
    return;
  }

  await writeFile(readmePath, nextReadme, "utf8");
  console.log(
    `Updated README.md with ${resources.length} resources across ${categories.length} categories.`,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
