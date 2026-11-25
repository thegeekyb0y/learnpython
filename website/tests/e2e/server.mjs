/**
 * Minimal static server for Playwright.
 *
 * Serves the Next.js static export from `out/` under the GitHub Pages base path
 * (`/learnpython`) so E2E tests exercise the same URLs as production.
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(process.cwd(), "out");
const prefix = "/learnpython";
const port = Number(process.env.PORT ?? 4183);
const host = "127.0.0.1";

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".webp", "image/webp"],
  [".avif", "image/avif"],
  [".ico", "image/x-icon"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
  [".txt", "text/plain; charset=utf-8"],
]);

function isInsideRoot(filePath) {
  return filePath === root || filePath.startsWith(`${root}${path.sep}`);
}

async function resolveFile(pathname) {
  if (pathname === prefix) {
    return path.join(root, "index.html");
  }

  if (!pathname.startsWith(`${prefix}/`)) {
    return null;
  }

  const decoded = decodeURIComponent(pathname.slice(prefix.length));
  const filePath = path.resolve(root, `.${decoded}`);

  if (!isInsideRoot(filePath)) {
    return null;
  }

  try {
    const info = await stat(filePath);

    if (info.isDirectory()) {
      const indexPath = path.join(filePath, "index.html");
      await stat(indexPath);
      return indexPath;
    }

    return filePath;
  } catch {
    try {
      const indexPath = path.join(filePath, "index.html");
      await stat(indexPath);
      return indexPath;
    } catch {
      return null;
    }
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${host}:${port}`);
  const pathname = url.pathname;

  if (pathname === "/") {
    response.writeHead(302, { Location: `${prefix}/` });
    response.end();
    return;
  }

  if (pathname === prefix) {
    response.writeHead(301, { Location: `${prefix}/` });
    response.end();
    return;
  }

  const filePath = await resolveFile(pathname);

  if (!filePath) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(`Not found: ${pathname}`);
    return;
  }

  try {
    const body = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type":
        mimeTypes.get(path.extname(filePath).toLowerCase()) ??
        "application/octet-stream",
      "Content-Length": body.byteLength,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    response.end(body);
  } catch {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(`Could not read ${pathname}`);
  }
});

server.listen(port, host, () => {
  console.log(`Static export served at http://${host}:${port}${prefix}/`);
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
