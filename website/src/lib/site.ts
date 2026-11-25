export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const repoUrl = "https://github.com/thegeekyb0y/learnpython";

export const submitResourceUrl = `${repoUrl}/issues/new?template=resource.yml&title=Add%20resource%3A%20&labels=resource`;

/**
 * Prefix a root-relative public asset with the deployment base path.
 *
 * Next's `<Link>` and `_next` assets already respect `basePath`; this helper is
 * for hand-written URLs such as the hero logo, metadata icons, and OG images.
 * The input is expected to be root-relative so the result is never
 * double-prefixed, even when called with an already-absolute site URL.
 */
export function assetPath(path: string) {
  if (!path.startsWith("/") || !basePath) {
    return path;
  }

  return `${basePath}${path}`;
}
