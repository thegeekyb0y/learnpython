"use client";

import { useEffect, useRef } from "react";

import { readDirectoryParams } from "@/lib/url";

/**
 * Hydrate directory state from the URL after mount.
 *
 * Static export prerenders a single HTML file, so request-time `searchParams`
 * are unavailable. We deliberately use `useEffect` instead of
 * `useLayoutEffect` to avoid SSR warnings; the full catalog is already in the
 * HTML, and filters apply on the first post-hydration effect.
 */
export function useDirectoryUrl(onChange: (params: URLSearchParams) => void) {
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const syncFromUrl = () => {
      onChangeRef.current(readDirectoryParams());
    };

    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);

    return () => {
      window.removeEventListener("popstate", syncFromUrl);
    };
  }, []);
}
