"use client";

import { useSyncExternalStore } from "react";

// İlerleme şimdilik sadece bu cihazda (localStorage). Hesap sistemi sonra.
const KEY = "fb-progress-v1";
const EVENT = "fb-progress";

function read(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function parse(raw: string | null): string[] {
  try {
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVENT, cb);
  };
}

/** Temizlenen bölümlerin listesi. Sunucuda null döner. */
export function useCleared(): string[] | null {
  const raw = useSyncExternalStore(subscribe, read, () => undefined as unknown as string | null);
  return raw === undefined ? null : parse(raw);
}

function write(list: string[] | null) {
  try {
    if (list) localStorage.setItem(KEY, JSON.stringify(list));
    else localStorage.removeItem(KEY);
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // depolama kapalıysa sessizce geç
  }
}

export function markCleared(unitId: string) {
  const set = new Set(parse(read()));
  set.add(unitId);
  write([...set]);
}

export function resetProgress() {
  write(null);
}
