// PDF'in metnini tarayıcıda çıkarıyoruz: dosyanın kendisi sunucuya gitmiyor,
// sadece metni gidiyor. Hem hızlı hem de hocanın slaytı hiçbir yere yüklenmiyor.

export type PdfText = { pages: number; text: string; chars: number };

// Yapay zekaya giden metnin üst sınırı (~50 bin token). Uzun kitaplarda baştan kırpılır.
export const MAX_CHARS = 200_000;

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
  const parts: string[] = [];
  let total = 0;

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    let line = "";
    for (const item of content.items) {
      if (!("str" in item)) continue;
      line += item.str + (item.hasEOL ? "\n" : " ");
    }
    const clean = line.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
    if (clean && total < MAX_CHARS) {
      const chunk = `[s.${i}]\n${clean}\n`;
      parts.push(chunk);
      total += chunk.length;
    }
    onPage?.(i, doc.numPages);
  }

  const pages = doc.numPages;
  await task.destroy();
  const text = parts.join("\n").slice(0, MAX_CHARS);
  return { pages, text, chars: text.length };
}
