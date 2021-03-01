const responseCache: { [key: string]: any } = new Map();

const cacheKey = (path: string, method: string): string => `${method}_${path}`;

export const setToCache = (path: string, method: string, data: string): void =>
  responseCache.set(cacheKey(path, method), data);

export const getFromCache = (path: string, method: string): string | void =>
  responseCache.get(cacheKey(path, method));
