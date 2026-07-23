import { revalidateTag, revalidatePath } from 'next/cache';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class InMemoryCache {
  private store = new Map<string, CacheEntry<any>>();
  private maxEntries: number;

  constructor(maxEntries: number = 500) {
    this.maxEntries = maxEntries;
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlSeconds: number = 300): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;

    if (this.store.size >= this.maxEntries && !this.store.has(key)) {
      const oldestKey = this.store.keys().next().value;
      if (oldestKey) {
        this.store.delete(oldestKey);
      }
    }

    this.store.set(key, { data, expiresAt });
  }

  invalidateByPrefix(prefix: string): void {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }

  clear(): void {
    this.store.clear();
  }
}

declare global {
  // eslint-disable-next-line no-var
  var globalCache: InMemoryCache | undefined;
}

const cache = global.globalCache || new InMemoryCache(500);
if (process.env.NODE_ENV !== 'production') {
  global.globalCache = cache;
}

export function getCache<T>(key: string): T | null {
  return cache.get<T>(key);
}

export function setCache<T>(key: string, data: T, ttlSeconds?: number): void {
  cache.set(key, data, ttlSeconds);
}

export function invalidateTimetableCache(): void {
  // 1. Purge local in-memory Map
  cache.invalidateByPrefix('tt:');

  // 2. Purge Vercel / Next.js global Data Cache across all serverless nodes
  try {
    revalidateTag('timetable', 'max');
    revalidatePath('/', 'layout');
  } catch (e) {
    // Ignore error if invoked outside request context
  }
}
