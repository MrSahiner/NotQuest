"use client";

import Link from "next/link";
import Boss from "@/components/Boss";
import { DEMO_COURSE } from "@/lib/demo";
import { resetProgress, useCleared } from "@/lib/progress";

export default function CourseMap() {
  const cleared = useCleared();

  const done = cleared ?? [];
  const units = DEMO_COURSE.units;
  // sıradaki açık bölüm: temizlenmemiş ilk ünite
  const nextIdx = units.findIndex((u) => !done.includes(u.id));

  return (
    <>
      <ol className="relative mt-6">
        {/* bölümleri birleştiren yol */}
        <div className="absolute top-6 bottom-6 left-[27px] w-[3px] bg-line" aria-hidden />
        {units.map((u, i) => {
          const isDone = done.includes(u.id);
          const isNext = i === nextIdx;
          const locked = !isDone && !isNext;
          const body = (
            <div className={`relative flex items-center gap-4 py-3 ${locked ? "opacity-60" : ""}`}>
              <div
                className={`relative z-10 grid h-14 w-14 shrink-0 place-items-center border-[3px] bg-bg ${
                  isNext ? "border-hl" : isDone ? "border-green" : "border-line"
                }`}
              >
                <Boss color={u.color} size={u.final ? 40 : 32} dim={locked} className={isNext ? "bob" : ""} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[11px] text-dim">
                  {u.final ? "final" : `bölüm ${i + 1}`} · {u.boss}
                </p>
                <p className={`truncate text-lg font-bold ${u.final ? "text-hl" : ""}`}>{u.title}</p>
              </div>
              <span className="font-mono text-xs">
                {isDone ? <span className="text-green">yenildi</span> : isNext ? <span className="text-hl">savaş ▸</span> : "kilitli"}
              </span>
            </div>
          );
          return (
            <li key={u.id}>
              {locked ? body : <Link href={`/oyun/${u.id}`}>{body}</Link>}
            </li>
          );
        })}
      </ol>

      {done.length > 0 && (
        <button
          onClick={resetProgress}
          className="mt-4 font-mono text-xs text-dim underline underline-offset-4"
        >
          ilerlemeyi sıfırla
        </button>
      )}
    </>
  );
}
