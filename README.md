# NotQuest

Notlarını oyuna çeviren çalışma uygulaması. İsmi takipçiler seçti: anketi "başka" kazandı, yorumlardaki öneri NotQuest'ti. [@mrsahiner.dev](https://instagram.com/mrsahiner.dev)'de 30 günde herkesle birlikte yapılıyor.

## Çalıştırma

```bash
npm install
npm run dev
```

http://localhost:3000 adresinde açılır.

## Yapı

- `app/page.tsx`: harita (dersin bölümleri, son durak final boss)
- `app/oyun/[unit]`: boss savaşı
- `app/yukle`: not yükleme (yapay zeka kısmı gün 4'te)
- `lib/config.ts`: uygulamanın adı, tek yerden değişir
- `lib/demo.ts`: örnek ders (bulut bilişim)
- `app/manifest.ts`, `public/sw.js`: ana ekrana eklenebilir uygulama (PWA)

## Yol haritası

- [x] iskelet, harita, örnek boss savaşı (gün 2)
- [ ] pdf yükleme + konu haritası (gün 4)
- [ ] notlardan doğru/yanlış cümle üretimi (gün 6)
- [ ] kaydırma oyunu (gün 7)
- [ ] herkese açık ilk sürüm (gün 10)
