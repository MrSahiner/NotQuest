// Slayt metnini Gemini'ye gönderip ünitelere ayrılmış bir konu haritası alır.
// Anahtar Vercel'deki GEMINI_API_KEY ortam değişkeninden gelir, tarayıcıya hiç gitmez.

export const maxDuration = 60;

const MODEL = process.env.GEMINI_MODEL ?? "gemini-3.5-flash-lite";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
const MAX_CHARS = 400_000;

const SCHEMA = {
  type: "object",
  properties: {
    ders: { type: "string" },
    ozet: { type: "string" },
    uniteler: {
      type: "array",
      items: {
        type: "object",
        properties: {
          baslik: { type: "string" },
          sayfalar: { type: "string" },
          konular: { type: "array", items: { type: "string" } },
          canavar: { type: "string" },
        },
        required: ["baslik", "sayfalar", "konular", "canavar"],
      },
    },
  },
  required: ["ders", "ozet", "uniteler"],
};

const PROMPT = `Aşağıda bir üniversite dersinin slaytlarından ya da notlarından çıkarılmış metin var. [s.N] işaretleri sayfa numarasını gösterir.

Görevin bu dersi öğrenciler için bir konu haritasına ayırmak:
- ders: dersin adı (metinden çıkar, bulamazsan konuya uygun kısa bir ad yaz)
- ozet: dersin tamamını anlatan tek cümle, en fazla 15 kelime
- uniteler: dersin akışına göre 4 ile 8 arası bölüm. Her bölüm için:
  - baslik: en fazla 4 kelime
  - sayfalar: bölümün kapsadığı sayfa aralığı, örneğin "1–12"
  - konular: 3 ile 6 arası alt konu, her biri en fazla 5 kelime
  - canavar: bölümün konusuna gönderme yapan, tek ya da iki kelimelik eğlenceli bir canavar adı

Kurallar: her şey Türkçe ve küçük harfle yazılsın. Sadece metinde geçen konuları kullan, metinde olmayan bilgi ekleme. Sadece JSON döndür.`;

type Unit = { baslik: string; sayfalar: string; konular: string[]; canavar: string };
type MapOut = { ders: string; ozet: string; uniteler: Unit[] };

// Gemini'nin yapılandırılmış çıktı ayarı sürümler arasında değişti; sırayla deniyoruz.
const CONFIGS: Array<Record<string, unknown> | undefined> = [
  { responseFormat: { text: { mimeType: "application/json", schema: SCHEMA } } },
  { responseMimeType: "application/json", responseJsonSchema: SCHEMA },
  undefined,
];

async function callGemini(key: string, text: string): Promise<string> {
  let lastError = "";
  for (const generationConfig of CONFIGS) {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: `${PROMPT}\n\n---\n${text}` }] }],
        ...(generationConfig ? { generationConfig } : {}),
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const parts: Array<{ text?: string }> = data?.candidates?.[0]?.content?.parts ?? [];
      return parts.map((p) => p.text ?? "").join("");
    }
    lastError = `${res.status} ${(await res.text()).slice(0, 300)}`;
    // 400 = istek biçimi kabul edilmedi → bir sonraki ayarla dene. Diğer hatalarda dur.
    if (res.status !== 400) break;
  }
  throw new Error(lastError);
}

function parse(raw: string): MapOut | null {
  const s = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start < 0 || end < 0) return null;
  try {
    const obj = JSON.parse(s.slice(start, end + 1));
    const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
    const uniteler: Unit[] = (Array.isArray(obj.uniteler) ? obj.uniteler : [])
      .map((u: Record<string, unknown>) => ({
        baslik: str(u.baslik, 60),
        sayfalar: str(u.sayfalar, 20),
        konular: (Array.isArray(u.konular) ? u.konular : []).map((k: unknown) => str(k, 60)).filter(Boolean).slice(0, 6),
        canavar: str(u.canavar, 30),
      }))
      .filter((u: Unit) => u.baslik)
      .slice(0, 8);
    if (uniteler.length === 0) return null;
    return { ders: str(obj.ders, 80) || "dersim", ozet: str(obj.ozet, 160), uniteler };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return Response.json({ error: "sunucuda yapay zeka anahtarı ayarlı değil." }, { status: 500 });
  }

  let body: { text?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "istek okunamadı." }, { status: 400 });
  }
  const text = typeof body.text === "string" ? body.text.slice(0, MAX_CHARS) : "";
  if (text.replace(/\[s\.\d+\]/g, "").trim().length < 200) {
    return Response.json({ error: "dosyada yeterli metin yok." }, { status: 400 });
  }

  try {
    const raw = await callGemini(key, text);
    const map = parse(raw);
    if (!map) {
      return Response.json({ error: "yapay zeka haritayı çıkaramadı, bir daha dene." }, { status: 502 });
    }
    return Response.json(map);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("gemini hatası:", msg);
    const busy = msg.startsWith("429");
    return Response.json(
      { error: busy ? "çok yoğunuz, biraz sonra tekrar dene." : "yapay zekaya ulaşılamadı, bir daha dene." },
      { status: busy ? 429 : 502 },
    );
  }
}
