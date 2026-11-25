"use client";

import {
  useDeferredValue,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";

import { useDirectoryUrl } from "@/hooks/use-directory-url";
import { collectionFilters } from "@/data/collections";
import {
  defaultDirectoryFilters,
  filterResources,
  getAccessFacetCounts,
  getCategoryFacetCounts,
  getLevelFacetCounts,
  getRelatedResources,
  getSectionView,
  hasActiveFilters,
  parseDirectoryParams,
  serializeDirectoryFilters,
  sortResources,
  type DirectoryAccessFilter,
  type DirectoryFilters,
  type CollectionId,
  type SortKey,
  type ViewMode,
} from "@/lib/directory";
import type { Difficulty, Resource } from "@/lib/schema";
import {
  pushDirectoryState,
  replaceDirectoryState,
} from "@/lib/url";

type DirectoryState = DirectoryFilters & {
  selectedId: string | null;
};

type DirectoryAction =
  | { type: "hydrate"; filters: DirectoryFilters; selectedId: string | null }
  | { type: "setQuery"; query: string }
  | { type: "setCategory"; category: DirectoryFilters["category"] }
  | { type: "setCollection"; collection: CollectionId }
  | { type: "clearCollection" }
  | { type: "setSection"; section: string | null }
  | { type: "toggleLevel"; level: Difficulty }
  | { type: "toggleAccess"; access: DirectoryAccessFilter }
  | { type: "setSort"; sort: SortKey }
  | { type: "setView"; view: ViewMode }
  | { type: "clearLevels" }
  | { type: "resetFilters" }
  | { type: "select"; id: string }
  | { type: "closeSelection" };

const initialState: DirectoryState = {
  ...defaultDirectoryFilters,
  selectedId: null,
};

function reducer(state: DirectoryState, action: DirectoryAction): DirectoryState {
  switch (action.type) {
    case "hydrate":
      return { ...action.filters, selectedId: action.selectedId };
    case "setQuery":
      return { ...state, query: action.query };
    case "setCategory":
      return { ...state, category: action.category, collection: null, section: null };
    case "setCollection": {
      if (state.collection === action.collection) {
        return { ...state, collection: null, category: "all", section: null };
      }

      const collection = collectionFilters[action.collection];

      return {
        ...state,
        collection: action.collection,
        category:
          collection.kind === "category"
            ? (collection.value as DirectoryFilters["category"])
            : "all",
        section: null,
        query: "",
        levels: [],
        access: [],
      };
    }
    case "clearCollection":
      return { ...state, collection: null, category: "all", section: null };
    case "setSection":
      return { ...state, section: action.section };
    case "toggleLevel":
      return {
        ...state,
        levels: state.levels.includes(action.level)
          ? state.levels.filter((level) => level !== action.level)
          : [...state.levels, action.level],
      };
    case "toggleAccess":
      return {
        ...state,
        access: state.access.includes(action.access)
          ? state.access.filter((access) => access !== action.access)
          : [...state.access, action.access],
      };
    case "setSort":
      return { ...state, sort: action.sort };
    case "setView":
      return { ...state, view: action.view };
    case "clearLevels":
      return { ...state, levels: [] };
    case "resetFilters":
      return {
        ...defaultDirectoryFilters,
        view: state.view,
        selectedId: null,
      };
    case "select":
      return { ...state, selectedId: action.id };
    case "closeSelection":
      return { ...state, selectedId: null };
    default:
      return state;
  }
}

function focusResourceCard(id: string) {
  window.requestAnimationFrame(() => {
    document
      .querySelector<HTMLElement>(`[data-resource-id="${CSS.escape(id)}"]`)
      ?.focus();
  });
}

export function useDirectoryState(resources: readonly Resource[]) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const hydratedRef = useRef(false);
  const selectedRef = useRef<string | null>(null);
  const pushedSelectionRef = useRef(false);
  const deferredQuery = useDeferredValue(state.query);

  const filters = useMemo<DirectoryFilters>(
    () => ({
      query: deferredQuery,
      category: state.category,
      levels: state.levels,
      access: state.access,
      collection: state.collection,
      section: state.section,
      sort: state.sort,
      view: state.view,
    }),
    [
      deferredQuery,
      state.category,
      state.levels,
      state.access,
      state.collection,
      state.section,
      state.sort,
      state.view,
    ],
  );

  const hydrateFromUrl = (params: URLSearchParams) => {
    const parsed = parseDirectoryParams(params, resources);
    const previouslySelected = selectedRef.current;

    dispatch({
      type: "hydrate",
      filters: parsed.filters,
      selectedId: parsed.selectedId,
    });

    selectedRef.current = parsed.selectedId;
    pushedSelectionRef.current = false;
    hydratedRef.current = true;

    if (!parsed.selectedId && previouslySelected) {
      focusResourceCard(previouslySelected);
    }
  };

  useDirectoryUrl(hydrateFromUrl);

  useEffect(() => {
    if (!hydratedRef.current) {
      return;
    }

    const write = () => {
      const params = serializeDirectoryFilters({
        ...filters,
        query: state.query,
      });

      if (selectedRef.current) {
        params.r = selectedRef.current;
      }

      replaceDirectoryState(params);
    };

    const timeout = window.setTimeout(write, state.query ? 250 : 0);

    return () => window.clearTimeout(timeout);
  }, [filters, state.query]);

  const filteredResources = useMemo(
    () => sortResources(filterResources(resources, filters), filters.sort),
    [filters, resources],
  );

  const searchFilters = useMemo<DirectoryFilters>(
    () => ({ ...filters, query: state.query }),
    [filters, state.query],
  );

  const searchResults = useMemo(
    () =>
      sortResources(
        filterResources(resources, searchFilters),
        searchFilters.sort,
      ),
    [resources, searchFilters],
  );

  const categoryCounts = useMemo(
    () => getCategoryFacetCounts(resources, filters),
    [filters, resources],
  );

  const levelCounts = useMemo(
    () => getLevelFacetCounts(resources, filters),
    [filters, resources],
  );

  const accessCounts = useMemo(
    () => getAccessFacetCounts(resources, filters),
    [filters, resources],
  );

  const sectionView = useMemo(
    () => getSectionView(resources, filters),
    [filters, resources],
  );

  const selectedResource = useMemo(
    () =>
      state.selectedId
        ? resources.find((resource) => resource.id === state.selectedId) ?? null
        : null,
    [resources, state.selectedId],
  );

  const relatedResources = useMemo(
    () =>
      selectedResource
        ? getRelatedResources(resources, selectedResource.id)
        : [],
    [resources, selectedResource],
  );

  const openResource = (id: string) => {
    if (!resources.some((resource) => resource.id === id)) {
      return;
    }

    dispatch({ type: "select", id });
    selectedRef.current = id;
    pushedSelectionRef.current = true;

    const params = serializeDirectoryFilters({
      ...filters,
      query: state.query,
    });
    params.r = id;
    pushDirectoryState(params);
  };

  const openRelatedResource = (id: string) => {
    if (!resources.some((resource) => resource.id === id)) {
      return;
    }

    dispatch({ type: "select", id });
    selectedRef.current = id;

    const params = serializeDirectoryFilters({
      ...filters,
      query: state.query,
    });
    params.r = id;
    replaceDirectoryState(params);
  };

  const closeResource = () => {
    const closingId = selectedRef.current;
    dispatch({ type: "closeSelection" });
    selectedRef.current = null;

    if (closingId) {
      focusResourceCard(closingId);
    }

    if (pushedSelectionRef.current) {
      pushedSelectionRef.current = false;
      window.history.back();
      return;
    }

    replaceDirectoryState(
      serializeDirectoryFilters({ ...filters, query: state.query }),
    );
  };

  const setSection = (section: string | null) => {
    if (state.section === section) {
      return;
    }

    dispatch({ type: "setSection", section });
    pushDirectoryState(
      serializeDirectoryFilters({
        ...filters,
        query: state.query,
        section,
      }),
    );
  };

  return {
    state,
    filters,
    filteredResources,
    searchResults,
    categoryCounts,
    levelCounts,
    accessCounts,
    sectionView,
    selectedResource,
    relatedResources,
    hasFilters: hasActiveFilters(filters),
    totalResources: resources.length,
    setQuery: (query: string) => dispatch({ type: "setQuery", query }),
    setCategory: (category: DirectoryFilters["category"]) =>
      dispatch({ type: "setCategory", category }),
    setCollection: (collection: CollectionId) =>
      dispatch({ type: "setCollection", collection }),
    clearCollection: () => dispatch({ type: "clearCollection" }),
    setSection,
    toggleLevel: (level: Difficulty) =>
      dispatch({ type: "toggleLevel", level }),
    toggleAccess: (access: DirectoryAccessFilter) =>
      dispatch({ type: "toggleAccess", access }),
    setSort: (sort: SortKey) => dispatch({ type: "setSort", sort }),
    setView: (view: ViewMode) => dispatch({ type: "setView", view }),
    clearLevels: () => dispatch({ type: "clearLevels" }),
    resetFilters: () => dispatch({ type: "resetFilters" }),
    openResource,
    openRelatedResource,
    closeResource,
  };
}
