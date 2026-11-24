import { describe, expect, it, vi } from "vitest";

import {
  buildDirectorySearch,
  buildDirectoryUrl,
  pushDirectoryState,
  readDirectoryParams,
  replaceDirectoryState,
  type DirectoryWindowLike,
} from "@/lib/url";

function createWindow(search = ""): {
  win: DirectoryWindowLike;
  replaceState: ReturnType<typeof vi.fn>;
  pushState: ReturnType<typeof vi.fn>;
} {
  const replaceState = vi.fn();
  const pushState = vi.fn();

  return {
    win: {
      location: {
        pathname: "/learnpython/",
        search,
        hash: "",
      },
      history: {
        state: { from: "directory" },
        replaceState,
        pushState,
      },
    },
    replaceState,
    pushState,
  };
}

describe("buildDirectorySearch", () => {
  it("omits empty values and sorts keys for a stable URL", () => {
    expect(
      buildDirectorySearch({
        view: "grid",
        q: "",
        cat: "web-apis",
        free: false,
        oss: true,
      }),
    ).toBe("cat=web-apis&oss=1&view=grid");
  });

  it("dedupes and sorts array values", () => {
    expect(
      buildDirectorySearch({
        level: ["intermediate", "beginner", "intermediate"],
        track: ["ai", "web"],
      }),
    ).toBe("level=beginner%2Cintermediate&track=ai%2Cweb");
  });
});

describe("buildDirectoryUrl", () => {
  it("preserves the GitHub Pages base path", () => {
    expect(
      buildDirectoryUrl(
        { q: "pandas", cat: "data-ml" },
        { pathname: "/learnpython/", search: "", hash: "" },
      ),
    ).toBe("/learnpython/?cat=data-ml&q=pandas");
  });

  it("preserves the current hash and clears an empty query", () => {
    expect(
      buildDirectoryUrl(
        {},
        { pathname: "/learnpython/", search: "?q=old", hash: "#ledger" },
      ),
    ).toBe("/learnpython/#ledger");
  });
});

describe("history writes", () => {
  it("replaces state without stripping the base path", () => {
    const { win, replaceState } = createWindow("?q=old");

    replaceDirectoryState({ q: "fastapi" }, win);

    expect(replaceState).toHaveBeenCalledWith(
      { from: "directory" },
      "",
      "/learnpython/?q=fastapi",
    );
  });

  it("pushes drawer state without stripping the base path", () => {
    const { win, pushState } = createWindow();

    pushDirectoryState({ r: "python-tutorial" }, win);

    expect(pushState).toHaveBeenCalledWith(
      { from: "directory" },
      "",
      "/learnpython/?r=python-tutorial",
    );
  });
});

describe("readDirectoryParams", () => {
  it("reads the current query string", () => {
    const { win } = createWindow("?cat=ai-engineering&free=1");

    expect(readDirectoryParams(win).get("cat")).toBe("ai-engineering");
    expect(readDirectoryParams(win).get("free")).toBe("1");
  });

  it("returns empty params when there is no query string", () => {
    const { win } = createWindow();

    expect(readDirectoryParams(win).toString()).toBe("");
  });
});
