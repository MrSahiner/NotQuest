// PDF'in metnini tarayıcıda çıkarıyoruz: dosyanın kendisi sunucuya gitmiyor,
// sadece metni gidiyor. Hem hızlı hem de hocanın slaytı hiçbir yere yüklenmiyor.

export type PdfText = { pages: number; text: string; chars: number };

// Yapay zekaya giden metnin üst sınırı (~100 bin token). Daha uzun notlarda her sayfanın
// başından eşit pay alınır: başlıklar sayfa başında olduğu için hiçbir bölüm kaybolmaz.
export const MAX_CHARS = 400_000;

export async function extractPdfText(
  file: File,
  onPage?: (done: number, total: number) => void,
): Promise<PdfText> {
  const pdfjs = await import("pdfjs-dist");
  // worker public/ klasöründen geliyor (pdfjs-dist sürümüyle aynı dosya)
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const data = new Uint8Array(await file.arrayBuffer());
  const task = pdfjs.getDocument({ data });
  const doc = await task.promise;
  const pageTexts: string[] = [];

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    let line = "";
    for (const item of content.items) {
      if (!("str" in item)) continue;
      line += item.str + (item.hasEOL ? "\n" : " ");
    }
    const clean = line.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
    pageTexts.push(clean);
    onPage?.(i, doc.numPages);
  }

  const pages = doc.numPages;
  await task.destroy();
  const total = pageTexts.reduce((n, t) => n + t.length + 12, 0);
  const share = total > MAX_CHARS ? Math.floor(MAX_CHARS / Math.max(1, pages)) - 12 : Infinity;
  const text = pageTexts
    .map((t, i) => (t ? `[s.${i + 1}]\n${t.slice(0, share)}\n` : ""))
    .filter(Boolean)
    .join("\n")
    .slice(0, MAX_CHARS);
  return { pages, text, chars: text.length };
}
