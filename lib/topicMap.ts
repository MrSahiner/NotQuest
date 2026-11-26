// Yapay zekanın çıkardığı konu haritası ve tarayıcıda saklanması.
import { useSyncExternalStore } from "react";

export type MapUnit = {
  baslik: string; // bölüm başlığı
  sayfalar: string; // "1–12" gibi
  konular: string[]; // alt konular
  canavar: string; // bölümün boss'u
};

export type TopicMap = {
  id: string;
  dosya: string; // yüklenen dosyanın adı
  sayfa: number; // pdf'in sayfa sayısı
  ders: string;
  ozet: string;
  uniteler: MapUnit[];
  tarih: string;
};

// Bölüm canavarlarının renkleri (haritadaki sırayla)
export const UNIT_COLORS = ["#5ad17a", "#4fa3ff", "#ff9f43", "#ff5ca8", "#4fd1c5", "#ffd166", "#9f7aea", "#f56565"];

const KEY = "fb-maps-v1";
const listeners = new Set<() => void>();
let cache: { raw: string | null; maps: TopicMap[] } = { raw: null, maps: [] };

function read(): TopicMap[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return cache.maps;
  }
  if (raw === cache.raw) return cache.maps;
  let maps: TopicMap[] = [];
  try {
    maps = raw ? JSON.parse(raw) : [];
  } catch {
    maps = [];
  }
  cache = { raw, maps };
  return maps;
}

function write(maps: TopicMap[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(maps));
  } catch {
    // depolama doluysa ya da kapalıysa harita sadece bu oturumda kalır
    cache = { raw: cache.raw, maps };
  }
  listeners.forEach((l) => l());
}

export function saveMap(map: TopicMap) {
  write([map, ...read().filter((m) => m.id !== map.id)].slice(0, 10));
}

export function deleteMap(id: string) {
  write(read().filter((m) => m.id !== id));
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => e.key === KEY && cb();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

const EMPTY: TopicMap[] = [];

/** Kayıtlı haritalar, en yenisi başta. Sunucuda boş liste. */
export function useMaps(): TopicMap[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}
