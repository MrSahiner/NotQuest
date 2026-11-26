"use client";

import { useEffect, useRef, useState } from "react";
import TopicMapView from "@/components/TopicMapView";
import { extractPdfText } from "@/lib/pdf";
import { deleteMap, saveMap, useMaps, type TopicMap } from "@/lib/topicMap";

const MAX_MB = 25;

type Step =
  | { kind: "idle" }
  | { kind: "reading"; done: number; total: number }
  | { kind: "thinking"; pages: number }
  | { kind: "error"; message: string };

const THINKING = ["konular ayrılıyor", "bölümler sıralanıyor", "canavarlar uyanıyor", "harita çiziliyor"];

export default function UploadPage() {
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pickError, setPickError] = useState("");
  const [drag, setDrag] = useState(false);
  const [step, setStep] = useState<Step>({ kind: "idle" });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const maps = useMaps();
  const active = maps.find((m) => m.id === activeId) ?? null;

  const busy = step.kind === "reading" || step.kind === "thinking";

  // "düşünüyor" ekranında mesajlar sırayla değişsin
  useEffect(() => {
    if (step.kind !== "thinking") return;
    const t = setInterval(() => setTick((n) => n + 1), 1400);
    return () => clearInterval(t);
  }, [step.kind]);

  function pick(f: File | undefined) {
    setPickError("");
    setStep({ kind: "idle" });
    if (!f) return;
    if (f.type !== "application/pdf") return setPickError("şimdilik sadece pdf. fotoğraf desteği yakında.");
    if (f.size > MAX_MB * 1024 * 1024) return setPickError(`dosya ${MAX_MB} mb'tan büyük.`);
    setFile(f);
  }

  async function build() {
    if (!file || busy) return;
    try {
      setStep({ kind: "reading", done: 0, total: 0 });
      const pdf = await extractPdfText(file, (done, total) => setStep({ kind: "reading", done, total }));
      if (pdf.chars < 300) {
        return setStep({
          kind: "error",
          message: "bu pdf'te okunacak metin yok, taranmış olabilir. şimdilik metinli pdf'ler çalışıyor.",
        });
      }

      setTick(0);
      setStep({ kind: "thinking", pages: pdf.pages });
      const res = await fetch("/api/harita", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: pdf.text }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return setStep({ kind: "error", message: data.error ?? "bir şeyler ters gitti." });

      const map: TopicMap = {
        id: crypto.randomUUID(),
        dosya: file.name.replace(/\.pdf$/i, ""),
        sayfa: pdf.pages,
        ders: data.ders,
        ozet: data.ozet,
        uniteler: data.uniteler,
        tarih: new Date().toISOString(),
      };
      saveMap(map);
      setActiveId(map.id);
      setFile(null);
      setStep({ kind: "idle" });
      window.scrollTo({ top: 0 });
    } catch {
      setStep({ kind: "error", message: "pdf açılamadı. dosya bozuk ya da şifreli olabilir." });
    }
  }

  if (active) {
    return (
      <>
        <TopicMapView map={active} />
        <button disabled className="px-btn mt-6 w-full bg-line py-3 font-bold text-dim">
          bölümleri oyuna çevir
        </button>
        <p className="mt-2 text-center font-mono text-xs text-dim">soru üretme yakında geliyor.</p>
        <button
          onClick={() => setActiveId(null)}
          className="mt-6 w-full font-mono text-sm text-dim underline underline-offset-4"
        >
          başka not yükle
        </button>
      </>
    );
  }

  return (
    <>
      <header className="mb-8">
        <p className="font-mono text-xs text-dim">not yükle</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          notunu at,
          <br />
          <span className="hl">gerisini bırak.</span>
        </h1>
      </header>

      <button
        type="button"
        disabled={busy}
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          pick(e.dataTransfer.files[0]);
        }}
        className={`flex w-full flex-col items-center justify-center gap-3 border-[3px] border-dashed px-6 py-14 text-center ${
          drag ? "border-hl bg-hl/5" : "border-line bg-panel"
        }`}
      >
        <span className="text-5xl leading-none">＋</span>
        <span className="text-lg font-bold">slayt ya da ders notu (pdf)</span>
        <span className="font-mono text-xs text-dim">en fazla {MAX_MB} mb</span>
      </button>
      <input
        ref={input}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          pick(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {pickError && <p className="mt-4 font-mono text-sm text-red">{pickError}</p>}

      {file && (
        <div className="pop mt-6 border-[3px] border-line bg-panel p-4">
          <p className="font-mono text-xs text-dim">seçilen dosya</p>
          <p className="mt-1 truncate text-lg font-bold">{file.name}</p>
          <p className="font-mono text-xs text-dim">{(file.size / 1024 / 1024).toFixed(1)} mb</p>

          {step.kind === "idle" || step.kind === "error" ? (
            <button onClick={build} className="px-btn mt-4 w-full bg-hl py-3 font-bold text-bg">
              konu haritası çıkar
            </button>
          ) : (
            <Progress step={step} tick={tick} />
          )}

          {step.kind === "error" && <p className="mt-3 font-mono text-sm text-red">{step.message}</p>}
        </div>
      )}

      {!file && maps.length > 0 && (
        <section className="mt-10">
          <p className="font-mono text-xs text-dim">haritaların</p>
          <ul className="mt-2 divide-y-[3px] divide-line border-[3px] border-line bg-panel">
            {maps.map((m) => (
              <li key={m.id} className="flex items-center">
                <button onClick={() => setActiveId(m.id)} className="min-w-0 flex-1 px-4 py-3 text-left">
                  <p className="truncate font-bold">{m.ders}</p>
                  <p className="font-mono text-[11px] text-dim">
                    {m.sayfa} sayfa · {m.uniteler.length} bölüm
                  </p>
                </button>
                <button
                  onClick={() => deleteMap(m.id)}
                  aria-label={`${m.ders} haritasını sil`}
                  className="px-4 py-3 font-mono text-xs text-dim"
                >
                  sil
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

function Progress({ step, tick }: { step: Step; tick: number }) {
  const reading = step.kind === "reading";
  const pct = reading && step.total > 0 ? Math.round((step.done / step.total) * 100) : 0;
  return (
    <div className="mt-4" aria-live="polite">
      <div className="h-4 overflow-hidden border-[3px] border-ink bg-bg">
        {reading ? (
          <div className="h-full bg-hl transition-[width] duration-150" style={{ width: `${pct}%` }} />
        ) : (
          <div className="scan h-full w-1/3 bg-boss" />
        )}
      </div>
      <p className="mt-3 font-mono text-sm">
        {reading
          ? step.total > 0
            ? `sayfalar okunuyor · ${step.done}/${step.total}`
            : "pdf açılıyor"
          : `${THINKING[tick % THINKING.length]}…`}
      </p>
      {step.kind === "thinking" && (
        <p className="mt-1 font-mono text-xs text-dim">{step.pages} sayfa yapay zekada</p>
      )}
    </div>
  );
}
