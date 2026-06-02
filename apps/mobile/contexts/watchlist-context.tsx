// ─────────────────────────────────────────────────────────────────────────────
// FILE        : watchlist-context.tsx
// PROJECT     : PoliTickIt Mobile
// LAYER       : Context → Watchlist State
// PURPOSE     : Shared React context holding the set of currently watched snap
//               IDs. Eliminates the dual-path state inconsistency between
//               polisnap-renderer.tsx (bookmark icon) and action-card.tsx.
//               Both consumers subscribe here; toggling from either path
//               updates the single source of truth.
// ─────────────────────────────────────────────────────────────────────────────

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { useServices } from "./service-provider";

interface WatchlistContextType {
  /** Set of snap IDs currently on the watchlist. */
  watchedIds: Set<string>;
  /** Returns true if the given snap is being watched. */
  isWatched: (snapId: string) => boolean;
  /** Add a snap to the watchlist. Returns true on success. */
  addToWatchlist: (snapId: string) => Promise<boolean>;
  /** Remove a snap from the watchlist. Returns true on success. */
  removeFromWatchlist: (snapId: string) => Promise<boolean>;
  /** Toggle watch state. Returns the new isWatched value. */
  toggle: (snapId: string) => Promise<boolean>;
  /** Force a full reload from the service (called after navigation, sync, etc). */
  reload: () => Promise<void>;
}

const WatchlistContext = createContext<WatchlistContextType | null>(null);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const { watchlistService } = useServices();
  const [watchedIds, setWatchedIds] = useState<Set<string>>(new Set());

  const reload = useCallback(async () => {
    try {
      const ids = await watchlistService.getWatchedIds();
      setWatchedIds(new Set(ids));
    } catch (err) {
      console.warn("[WatchlistContext] reload failed:", err);
    }
  }, [watchlistService]);

  // Seed from SQLite on mount, then sync with server
  useEffect(() => {
    reload().then(() => {
      watchlistService
        .syncToCloud()
        .then(() => reload())
        .catch((err) =>
          console.warn("[WatchlistContext] initial sync failed:", err?.message),
        );
    });
  }, [reload, watchlistService]);

  const isWatched = useCallback(
    (snapId: string) => watchedIds.has(snapId),
    [watchedIds],
  );

  const addToWatchlist = useCallback(
    async (snapId: string): Promise<boolean> => {
      const ok = await watchlistService.addToWatchlist(snapId);
      if (ok) {
        setWatchedIds((prev) => new Set([...prev, snapId]));
        watchlistService
          .syncToCloud()
          .catch((err) =>
            console.warn(
              "[WatchlistContext] post-add sync failed:",
              err?.message,
            ),
          );
      }
      return ok;
    },
    [watchlistService],
  );

  const removeFromWatchlist = useCallback(
    async (snapId: string): Promise<boolean> => {
      const ok = await watchlistService.removeFromWatchlist(snapId);
      if (ok) {
        setWatchedIds((prev) => {
          const next = new Set(prev);
          next.delete(snapId);
          return next;
        });
        watchlistService
          .syncToCloud()
          .catch((err) =>
            console.warn(
              "[WatchlistContext] post-remove sync failed:",
              err?.message,
            ),
          );
      }
      return ok;
    },
    [watchlistService],
  );

  const toggle = useCallback(
    async (snapId: string): Promise<boolean> => {
      if (watchedIds.has(snapId)) {
        await removeFromWatchlist(snapId);
        return false;
      } else {
        await addToWatchlist(snapId);
        return true;
      }
    },
    [watchedIds, addToWatchlist, removeFromWatchlist],
  );

  return (
    <WatchlistContext.Provider
      value={{
        watchedIds,
        isWatched,
        addToWatchlist,
        removeFromWatchlist,
        toggle,
        reload,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist(): WatchlistContextType {
  const ctx = useContext(WatchlistContext);
  if (!ctx) {
    throw new Error("useWatchlist must be used inside WatchlistProvider");
  }
  return ctx;
}
