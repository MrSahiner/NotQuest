import Boss from "@/components/Boss";
import { UNIT_COLORS, type TopicMap } from "@/lib/topicMap";

// Yapay zekanın çıkardığı konu haritası: her bölüm bir durak, sonunda vize.
export default function TopicMapView({ map }: { map: TopicMap }) {
  const topicCount = map.uniteler.reduce((n, u) => n + u.konular.length, 0);

  return (
    <section>
      <p className="font-mono text-xs text-dim">konu haritası · {map.dosya}</p>
      <h2 className="pop mt-2 text-3xl leading-tight font-bold tracking-tight">
        <span className="hl">{map.ders}</span>
      </h2>
      {map.ozet && <p className="mt-3 text-dim">{map.ozet}</p>}

      <div className="mt-5 grid grid-cols-3 border-[3px] border-line bg-panel text-center">
        {[
          [map.sayfa, "sayfa"],
          [map.uniteler.length, "bölüm"],
          [topicCount, "konu"],
        ].map(([n, label], i) => (
          <div key={label} className={`py-3 ${i > 0 ? "border-l-[3px] border-line" : ""}`}>
            <p className="text-2xl font-bold">{n}</p>
            <p className="font-mono text-[11px] text-dim">{label}</p>
          </div>
        ))}
      </div>

      <ol className="relative mt-6">
        <div className="absolute top-8 bottom-8 left-[27px] w-[3px] bg-line" aria-hidden />
        {map.uniteler.map((u, i) => (
          <li
            key={i}
            className="pop relative flex gap-4 py-3"
            style={{ animationDelay: `${150 + i * 120}ms` }}
          >
            <div className="relative z-10 grid h-14 w-14 shrink-0 place-items-center border-[3px] border-line bg-bg">
              <Boss color={UNIT_COLORS[i % UNIT_COLORS.length]} size={32} />
            </div>
            <div className="min-w-0 flex-1 border-[3px] border-line bg-panel p-3">
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
            </div>
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
            <p className="font-mono text-[11px] text-dim">final · final boss</p>
            <p className="text-lg font-bold text-hl">vize</p>
          </div>
        </li>
      </ol>
    </section>
  );
}
