import { APP_NAME } from "@/lib/config";
import { DEMO_COURSE } from "@/lib/demo";
import CourseMap from "./CourseMap";
import HomeMaps from "./HomeMaps";

export default function Home() {
  return (
    <>
      <header className="mb-8">
        <p className="font-mono text-xs text-dim">sezon 1</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">{APP_NAME}</h1>
        <p className="mt-3 text-lg text-dim">
          her ünite bir bölüm. <span className="hl">son durak vize.</span>
        </p>
      </header>

      <HomeMaps />

      <section className="mt-12 border-[3px] border-line bg-panel p-4">
        <p className="font-mono text-xs text-dim">örnek ders · oynanabilir</p>
        <div className="mt-1 flex items-baseline justify-between">
          <h2 className="text-2xl font-bold">{DEMO_COURSE.title}</h2>
          <span className="font-mono text-xs text-dim">{DEMO_COURSE.units.length - 1} ünite</span>
        </div>
        <CourseMap />
      </section>
    </>
  );
}
