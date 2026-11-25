"use client";

import { useRef, useState } from "react";

const MAX_MB = 25;

export default function UploadPage() {
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);

  function pick(f: File | undefined) {
    setError("");
    if (!f) return;
    const okType = f.type === "application/pdf" || f.type.startsWith("image/");
    if (!okType) return setError("şimdilik sadece pdf ya da fotoğraf.");
    if (f.size > MAX_MB * 1024 * 1024) return setError(`dosya ${MAX_MB} mb'tan büyük.`);
    setFile(f);
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
        <span className="text-lg font-bold">slayt, pdf ya da defter fotoğrafı</span>
        <span className="font-mono text-xs text-dim">en fazla {MAX_MB} mb</span>
      </button>
      <input
        ref={input}
        type="file"
        accept="application/pdf,image/*"
        className="hidden"
        onChange={(e) => pick(e.target.files?.[0])}
      />

      {error && <p className="mt-4 font-mono text-sm text-red">{error}</p>}

      {file && (
        <div className="pop mt-6 border-[3px] border-line bg-panel p-4">
          <p className="font-mono text-xs text-dim">seçilen dosya</p>
          <p className="mt-1 truncate text-lg font-bold">{file.name}</p>
          <p className="font-mono text-xs text-dim">{(file.size / 1024 / 1024).toFixed(1)} mb</p>
          <button disabled className="px-btn mt-4 w-full bg-line py-3 font-bold text-dim">
            konu haritası çıkar
          </button>
          <p className="mt-3 font-mono text-xs text-dim">bu kısım yapım aşamasında. gün 4&apos;te geliyor.</p>
        </div>
      )}
    </>
  );
}
