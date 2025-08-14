import localforage from 'localforage';

localforage.config({ name: 'pags-mock', storeName: 'pags_store' });

export async function get<T>(key: string, fallback: T): Promise<T> {
  const v = await localforage.getItem<T>(key);
  return v ?? fallback;
}
export async function set<T>(key: string, v: T): Promise<void> {
  await localforage.setItem(key, v as any);
}
export function uuid() { return crypto.randomUUID(); }

export async function push<T>(key: string, item: T): Promise<void> {
  const arr = await get<T[]>(key, []);
  arr.push(item);
  await set(key, arr);
}

export const KEYS = {
  indicators: 'indicators',
  values: (id: string) => `indicator:${id}:values`,
  rels: 'rels',
  gate: 'gate-checks',
  packs: 'packs',
  participation: 'participation',
  debt: 'participation-debt',
  meta: 'meta-rels',
  stacks: 'gate-stacks',
  arcs: 'applied-arcs',
  applied: (itemId: string) => `applied-arcs:${itemId}`,
  metrics: 'metrics:summary',
  pilots: 'pilots',
  precedence: 'meta:precedence',
};
