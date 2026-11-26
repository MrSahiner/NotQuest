"use client";

import Link from "next/link";
import { useState } from "react";
import TopicMapView from "@/components/TopicMapView";
import { useMaps } from "@/lib/topicMap";

// Ana sayfa: kullanıcının yüklediği haritalar. Hiç yoksa yükleme çağrısı.
export default function HomeMaps() {
  const maps = useMaps();
  const [selected, setSelected] = useState<string | null>(null);
  const active = maps.find((m) => m.id === selected) ?? maps[0];

  if (!active) {
    return (
      <Link href="/yukle" className="px-btn block bg-hl py-4 text-center text-lg font-bold text-bg">
        ilk notunu yükle ▸
      </Link>
    );
  }

  return (
    <>
      {maps.length > 1 && (
        <div className="-mx-5 mb-6 flex gap-2 overflow-x-auto px-5 pb-1">
          {maps.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelected(m.id)}
              className={`shrink-0 border-[3px] px-3 py-1.5 font-mono text-xs ${
                m.id === active.id ? "border-hl text-hl" : "border-line text-dim"
              }`}
            >
              {m.ders}
            </button>
          ))}
        </div>
      )}
      <TopicMapView key={active.id} map={active} label="dersim" />
    </>
  );
}
