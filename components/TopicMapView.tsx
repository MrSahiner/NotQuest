"use client";

import { useEffect, useState } from "react";
import Boss from "@/components/Boss";
import { UNIT_COLORS, type MapUnit, type TopicMap } from "@/lib/topicMap";

// Yapay zekanın çıkardığı konu haritası: her bölüm bir durak, sonunda vize.
// Bölüme dokununca ayrıntısı alttan açılır.
export default function TopicMapView({ map, label = "konu haritası" }: { map: TopicMap; label?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const topicCount = map.uniteler.reduce((n, u) => n + u.konular.length, 0);

  return (
    <section>
      <p className="truncate font-mono text-xs text-dim">
        {label} · {map.dosya}
      </p>
      <h2 className="pop mt-2 text-3xl leading-tight font-bold tracking-tight">
        <span className="hl box-decoration-clone">{map.ders}</span>
      </h2>
      {map.ozet && <p className="mt-3 text-dim">{map.ozet}</p>}

      <div className="mt-5 grid grid-cols-3 border-[3px] border-line bg-panel text-center">
        {[
          [map.sayfa, "sayfa"],
          [map.uniteler.length, "bölüm"],
          [topicCount, "konu"],
        ].map(([n, l], i) => (
          <div key={l} className={`py-3 ${i > 0 ? "border-l-[3px] border-line" : ""}`}>
            <p className="text-2xl font-bold">{n}</p>
            <p className="font-mono text-[11px] text-dim">{l}</p>
          </div>
        ))}
      </div>

      <ol className="relative mt-6">
        <div className="absolute top-8 bottom-8 left-[27px] w-[3px] bg-line" aria-hidden />
        {map.uniteler.map((u, i) => (
          <li key={i} className="pop relative py-3" style={{ animationDelay: `${150 + i * 120}ms` }}>
            <button onClick={() => setOpen(i)} className="flex w-full gap-4 text-left">
              <div className="relative z-10 grid h-14 w-14 shrink-0 place-items-center border-[3px] border-line bg-bg">
                <Boss color={UNIT_COLORS[i % UNIT_COLORS.length]} size={32} />
              </div>
              <div className="min-w-0 flex-1 border-[3px] border-line bg-panel p-3 active:border-hl">
                <p className="font-mono text-[11px] text-dim">
                  bölüm {i + 1}
                  {u.sayfalar ? ` · s. ${u.sayfalar}` : ""}
                  {u.canavar ? ` · ${u.canavar}` : ""}
                </p>
                <p className="mt-0.5 text-lg leading-snug font-bold">{u.baslik}</p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {u.konular.map((k) => (
                    <li key={k} className="border-2 border-line px-2 py-0.5 font-mono text-[11px] text-ink/85">
                      {k}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-right font-mono text-[11px] text-hl">detay ▸</p>
              </div>
            </button>
          </li>
        ))}
        <li
          className="pop relative flex items-center gap-4 py-3"
          style={{ animationDelay: `${150 + map.uniteler.length * 120}ms` }}
        >
          <div className="relative z-10 grid h-14 w-14 shrink-0 place-items-center border-[3px] border-hl bg-bg">
            <Boss color="#b15cff" size={40} className="bob" />
          </div>
          <div>
            <p className="font-mono text-[11px] text-dim">final boss · tüm bölümler</p>
            <p className="text-lg font-bold text-hl">final</p>
          </div>
        </li>
      </ol>

      {open !== null && map.uniteler[open] && (
        <UnitSheet unit={map.uniteler[open]} index={open} onClose={() => setOpen(null)} />
      )}
    </section>
  );
}

function UnitSheet({ unit, index, onClose }: { unit: MapUnit; index: number; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/70" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={unit.baslik}
        onClick={(e) => e.stopPropagation()}
        className="pop max-h-[85dvh] w-full max-w-md overflow-y-auto border-t-[3px] border-ink bg-panel px-5 pt-5 pb-[max(env(safe-area-inset-bottom),1.25rem)]"
      >
        <div className="flex items-start gap-4">
          <div className="grid h-20 w-20 shrink-0 place-items-center border-[3px] border-line bg-bg">
            <Boss color={UNIT_COLORS[index % UNIT_COLORS.length]} size={52} className="bob" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[11px] text-dim">
              bölüm {index + 1}
              {unit.sayfalar ? ` · s. ${unit.sayfalar}` : ""}
            </p>
            <h3 className="mt-0.5 text-2xl leading-tight font-bold">{unit.baslik}</h3>
            {unit.canavar && <p className="mt-1 font-mono text-xs text-hl">boss: {unit.canavar}</p>}
          </div>
          <button onClick={onClose} aria-label="kapat" className="-mt-1 -mr-1 p-2 font-mono text-lg text-dim">
            ✕
          </button>
        </div>

        {unit.ozet && <p className="mt-4 leading-relaxed">{unit.ozet}</p>}

        <p className="mt-5 font-mono text-xs text-dim">bu bölümdeki konular</p>
        <ol className="mt-2 border-[3px] border-line bg-bg">
          {unit.konular.map((k, i) => (
            <li key={k} className={`flex gap-3 px-3 py-2.5 ${i > 0 ? "border-t-2 border-line" : ""}`}>
              <span className="font-mono text-xs leading-6 text-dim">{String(i + 1).padStart(2, "0")}</span>
              <span className="leading-6">{k}</span>
            </li>
          ))}
        </ol>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button disabled className="px-btn bg-line py-3 font-bold text-dim">
            savaş
          </button>
          <button disabled className="px-btn bg-line py-3 font-bold text-dim">
            not çıkar
          </button>
        </div>
        <p className="mt-2 text-center font-mono text-xs text-dim">savaş ve not yakında geliyor.</p>
      </div>
    </div>
  );
}
