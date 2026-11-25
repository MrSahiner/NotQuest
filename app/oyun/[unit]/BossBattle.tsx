"use client";

import Link from "next/link";
import { useState } from "react";
import Boss from "@/components/Boss";
import HpBar from "@/components/HpBar";
import type { Question, Unit } from "@/lib/demo";
import { markCleared } from "@/lib/progress";

const HEARTS = 3;

type Phase = "play" | "won" | "lost";

export default function BossBattle({ unit }: { unit: Unit }) {
  const maxHp = unit.questions.length;
  // yanlış bilinen soru sıranın sonuna geri döner
  const [queue, setQueue] = useState<Question[]>(unit.questions);
  const [hp, setHp] = useState(maxHp);
  const [hearts, setHearts] = useState(HEARTS);
  const [picked, setPicked] = useState<number | null>(null);
  const [hit, setHit] = useState(0); // animasyonu yeniden tetiklemek için sayaç
  const [hurt, setHurt] = useState(0);
  const [phase, setPhase] = useState<Phase>("play");

  const q = queue[0];

  function answer(i: number) {
    if (picked !== null || phase !== "play") return;
    setPicked(i);
    const correct = i === q.answer;
    if (correct) setHit((n) => n + 1);
    else setHurt((n) => n + 1);

    setTimeout(
      () => {
        setPicked(null);
        if (correct) {
          const next = hp - 1;
          setHp(next);
          setQueue((qs) => qs.slice(1));
          if (next <= 0) {
            markCleared(unit.id);
            setPhase("won");
          }
        } else {
          const left = hearts - 1;
          setHearts(left);
          setQueue((qs) => [...qs.slice(1), qs[0]]);
          if (left <= 0) setPhase("lost");
        }
      },
      correct ? 700 : 1300,
    );
  }

  function restart() {
    setQueue(unit.questions);
    setHp(maxHp);
    setHearts(HEARTS);
    setPicked(null);
    setPhase("play");
  }

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] flex-col">
      <div className="flex items-center justify-between font-mono text-xs text-dim">
        <Link href="/" className="py-2 pr-4">
          ◂ harita
        </Link>
        <span>
          {unit.final ? "final" : "bölüm"} · {unit.title}
        </span>
      </div>

      {/* canavar */}
      <div className="mt-4 flex flex-col items-center">
        <div key={`h${hit}`} className={hit ? "shake" : ""}>
          <div className={phase === "won" ? "opacity-0 transition-opacity duration-700" : "bob"}>
            <Boss color={unit.color} size={unit.final ? 168 : 136} flash={picked !== null && picked === q?.answer} />
          </div>
        </div>
        <p className="mt-3 text-xl font-bold">{unit.boss}</p>
        <div className="mt-3 w-full">
          <HpBar value={hp} max={maxHp} label="boss" />
        </div>
      </div>

      {/* oyuncunun canı */}
      <div key={`p${hurt}`} className={`mt-4 flex items-center gap-2 ${hurt ? "shake" : ""}`}>
        <span className="font-mono text-xs text-dim">sen</span>
        {Array.from({ length: HEARTS }, (_, i) => (
          <span key={i} className={`text-xl leading-none ${i < hearts ? "text-red" : "text-line"}`}>
            ♥
          </span>
        ))}
      </div>

      {phase === "play" && q && (
        <div className="mt-5 flex flex-1 flex-col">
          <p className="text-xl leading-snug font-bold">{q.q}</p>
          <div className="mt-5 grid gap-3">
            {q.options.map((opt, i) => {
              let style = "bg-panel";
              if (picked !== null) {
                if (i === q.answer) style = "bg-green text-bg border-green";
                else if (i === picked) style = "bg-red text-bg border-red";
                else style = "bg-panel opacity-50";
              }
              return (
                <button
                  key={i}
                  onClick={() => answer(i)}
                  className={`px-btn w-full px-4 py-3 text-left text-base font-medium ${style}`}
                >
                  <span className="mr-3 font-mono text-xs opacity-70">{"abcd"[i]}</span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {phase !== "play" && (
        <div className="pop mt-8 text-center">
          <p className="text-4xl font-bold">
            {phase === "won" ? <span className="hl">{unit.boss} yenildi.</span> : "canın bitti."}
          </p>
          <p className="mt-3 text-dim">
            {phase === "won"
              ? unit.final
                ? "vizeye hazırsın."
                : "sıradaki bölüm açıldı."
              : "yanlış bildiklerin bir sonraki denemede yine gelecek."}
          </p>
          <div className="mt-8 grid gap-3">
            {phase === "won" ? (
              <Link href="/" className="px-btn block bg-hl py-3 font-bold text-bg">
                haritaya dön
              </Link>
            ) : (
              <button onClick={restart} className="px-btn bg-hl py-3 font-bold text-bg">
                tekrar savaş
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
