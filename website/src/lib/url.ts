export type DirectoryParamValue =
  | string
  | number
  | boolean
  | readonly string[]
  | null
  | undefined;

export type DirectoryParams = Record<string, DirectoryParamValue>;

export type DirectoryLocationLike = {
  pathname: string;
  search: string;
  hash: string;
};

export type DirectoryHistoryLike = {
  state: unknown;
  replaceState(data: unknown, unused: string, url?: string | URL | null): void;
  pushState(data: unknown, unused: string, url?: string | URL | null): void;
};

export type DirectoryWindowLike = {
  location: DirectoryLocationLike;
  history: DirectoryHistoryLike;
};

function getDirectoryWindow(): DirectoryWindowLike | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window as unknown as DirectoryWindowLike;
}

/**
 * Serialize directory state into a stable query string.
 *
 * - Empty strings, false and nullish values are omitted.
 * - Boolean true becomes `1`.
 * - Arrays are deduped, sorted and comma-joined.
 * - Keys are sorted so the same state always produces the same URL.
 */
export function buildDirectorySearch(params: DirectoryParams): string {
  const search = new URLSearchParams();
  const keys = Object.keys(params).sort();

  for (const key of keys) {
    const value = params[key];

    if (value === null || value === undefined || value === false || value === "") {
      continue;
    }

    if (Array.isArray(value)) {
      const values = [...new Set(value.map((item) => item.trim()).filter(Boolean))].sort();

      if (values.length > 0) {
        search.set(key, values.join(","));
      }

      continue;
    }

    search.set(key, value === true ? "1" : String(value));
  }

  return search.toString();
}

/**
 * Build a same-origin URL without touching the current pathname.
 *
 * On GitHub Pages the pathname is `/learnpython/`; preserving it verbatim is
 * what keeps history updates inside the deployed base path.
 */
export function buildDirectoryUrl(
  params: DirectoryParams,
  location: DirectoryLocationLike,
): string {
  const search = buildDirectorySearch(params);

  return `${location.pathname}${search ? `?${search}` : ""}${location.hash}`;
}

export type DirectoryHistoryMode = "replace" | "push";

export function writeDirectoryState(
  params: DirectoryParams,
  mode: DirectoryHistoryMode = "replace",
  win: DirectoryWindowLike | null = getDirectoryWindow(),
): void {
  if (!win) {
    return;
  }

  const url = buildDirectoryUrl(params, win.location);

  if (mode === "push") {
    win.history.pushState(win.history.state, "", url);
    return;
  }

  win.history.replaceState(win.history.state, "", url);
}

export function replaceDirectoryState(
  params: DirectoryParams,
  win?: DirectoryWindowLike | null,
): void {
  writeDirectoryState(params, "replace", win ?? getDirectoryWindow());
}

export function pushDirectoryState(
  params: DirectoryParams,
  win?: DirectoryWindowLike | null,
): void {
  writeDirectoryState(params, "push", win ?? getDirectoryWindow());
}

export function readDirectoryParams(
  win: DirectoryWindowLike | null = getDirectoryWindow(),
): URLSearchParams {
  return new URLSearchParams(win?.location.search ?? "");
}
