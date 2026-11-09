# lucithinx — marketing site

Statik, iki dilli (TR + EN) B2B SaaS pazarlama sitesi. lucithinx; gelen/giden
telefon çağrılarını AI ile karşılayan, konuşmadan niyet ve duygu çıkaran,
CRM/destek kayıtlarını güncelleyen ve insan denetimini koruyan bir AI çağrı
operasyonu ürünüdür. Bu site, ürünü pilot programa dönüştürmek için tasarlandı.

TR ve EN içerik artık **iki ayrı, gerçek, indekslenebilir URL**'de yaşar:
`/` (TR) ve `/en/` (EN) — her biri kendi `<html lang>`, canonical, hreflang
ve JSON-LD'siyle sunucu tarafında (build zamanında) baked. Bkz. "Build nasıl
çalışır" bölümü.

## Build nasıl çalışır (ÖNEMLİ — dağıtmadan önce çalıştırın)

**`index.html` ve `en/index.html` artık üretilmiş (generated) dosyalardır.**
Elle düzenlemeyin — bir sonraki build'de üzerine yazılırlar. Tek kaynak:

- **`template.html`** — sayfa markup'ının tamamı (data-i18n anahtarları,
  head placeholder'ları: `__LANG__`, `__HEAD_SEO__`, `__JSONLD__`).
- **`i18n.js`** — TR/EN metin sözlüğü (`translations = { tr: {...}, en: {...} }`).

`scripts/build.mjs` (sıfır bağımlılık, saf Node) bu ikisini okuyup şunları
üretir:

```bash
cd /Users/egeusluer/Documents/lucithinx-site
node scripts/build.mjs
```

- **`index.html`** — TR metni HTML'e baked, `<html lang="tr">`, canonical
  `https://lucithinx.com/`.
- **`en/index.html`** — EN metni HTML'e baked, `<html lang="en">`, canonical
  `https://lucithinx.com/en/`. Her iki dosya da kök-mutlak asset yolları
  kullanır (`/styles.css`, `/app.js`, `/i18n.js`) — `<base href>` yok, bu
  sayede aynı markup hem `/` hem `/en/`'den bozulmadan çalışır.
- Her iki sayfaya karşılıklı `hreflang` bloğu (tr/en/x-default), `og:locale`
  (+alternate), `robots: index,follow`, ve o sayfanın dilinde 3 adet
  `application/ld+json` bloğu (Organization, SoftwareApplication, FAQPage —
  `i18n.js`'teki gerçek SSS verisinden üretilir, uydurma rating/price yok).
- **`netlify.toml`**'daki CSP `script-src` satırını da otomatik günceller:
  ürettiği her inline JSON-LD script'inin sha256 hash'ini hesaplayıp
  allowlist'e ekler (`'unsafe-inline'` KULLANILMAZ — politika sıkı kalır).
  Bu adım idempotent'tir: build'i art arda çalıştırmak hash listesini
  büyütmez, aynı 6 hash'i (3 blok × 2 dil) üretir.

`data-i18n` / `data-i18n-attr` öznitelikleri çıktı HTML'inde bilinçli olarak
kalır — hangi düğümün hangi çeviri anahtarına karşılık geldiğini gösteren
kalıcı, greplenebilir bir işaret olarak (gelecekteki tooling ve TR/EN
diff'leme için). `app.js` bunları runtime'da artık OKUMAZ: dil artık URL'e
sabit, sayfa içi anlık dil değiştirme yok (bkz. aşağıdaki "Dil değiştirici").

**Deploy öncesi kontrol listesi:**
```bash
node scripts/build.mjs                    # index.html + en/index.html üret
node scripts/check-i18n-parity.mjs        # TR/EN anahtar paritesi
node --check app.js i18n.js scripts/build.mjs   # sözdizimi
```

## Dil değiştirici (SEO doğruluğu)

Dil artık URL'e sabittir: `/` = TR, `/en/` = EN. Header/footer'daki dil
düğmeleri artık gerçek `<a href="/en/">` bağlantılarıdır — JS ile DOM'da
metni anında değiştiren eski "toggle" davranışı kasıtlı olarak kaldırıldı,
çünkü bu davranış URL'i sayfanın gerçek dilinden ayrıştırıp arama motorlarını
yanıltıyordu. `app.js`, sayfa yüklendiğinde yalnızca dil düğmesinin
`aria-pressed` durumunu o sayfanın kendi diliyle senkronlar ve tercihi
`localStorage`'da bir sonraki ziyaret için saklar — otomatik yönlendirme
YAPMAZ (kullanıcı zaten bir linke tıklamış ya da bir URL'i açmış olabilir;
otomatik yönlendirme şaşırtma/döngü riski taşır).

## Nasıl açılır

Build adımı hariç bağımlılık **yoktur** (build sadece Node built-in'leri
kullanır). Build'i çalıştırdıktan sonra:

1. **Doğrudan aç:** `index.html` dosyasına çift tıklayın veya tarayıcıya
   sürükleyin. Site tamamen `file://` protokolüyle, internet bağlantısı
   olmadan çalışır (harici font/CDN/analytics isteği yoktur). Not: `file://`
   üzerinden `/en/` linkine tıklamak dosya sisteminde `en/index.html`'i
   açar — bu çalışır, ama gerçek yol testleri için yerel sunucu tercih edin.
2. **Yerel sunucu (önerilen — kök-mutlak yollar ve `/en/` route'u için):**
   ```bash
   cd /Users/egeusluer/Documents/lucithinx-site
   python3 -m http.server 8080
   ```
   Ardından `http://localhost:8080` adresini açın.

## Deploy

Site build sonrası tamamen statik — herhangi bir statik host'a doğrudan
yüklenebilir. **Deploy'dan önce mutlaka `node scripts/build.mjs` çalıştırın**
(`index.html` / `en/index.html` / `netlify.toml` CSP'sinin güncel olduğundan
emin olun — bkz. yukarıdaki "Build nasıl çalışır"). **Netlify birincil
hedeftir** çünkü pilot formu (`#pilot-form`) Netlify Forms'a bağlıdır (bkz.
yukarıdaki "Form — Netlify Forms" bölümü).

### Netlify (önerilen, form dahil çalışır)

```bash
cd /Users/egeusluer/Documents/lucithinx-site
node scripts/build.mjs
npx netlify-cli deploy --prod
```

İlk çalıştırmada CLI, Netlify hesabınıza giriş yapmanızı ve bir site
(ya da mevcut bir site) seçmenizi ister. `netlify.toml` publish dizinini
(`.`, yani repo kökü), güvenlik başlıklarını ve `/404.html` yönlendirmesini
otomatik uygular; Netlify Forms taraması ayrı bir konfigürasyon istemez.

Alternatif (CLI kurmadan): [app.netlify.com](https://app.netlify.com) üzerinde
"Deploys" → proje klasörünü drag-drop. Form yine otomatik algılanır.

### Diğer host'lar (Vercel, GitHub Pages, herhangi bir statik host)

Site kendisi (`index.html`, `en/index.html`, `styles.css`, `app.js`,
`i18n.js`, `assets/` — build alındıktan sonra) bağımsız çalışır ve herhangi
bir statik host'a taşınabilir — **ancak**
`netlify.toml`'daki güvenlik başlıkları ve yönlendirme Netlify dışında
otomatik uygulanmaz; hedef host'un kendi header/redirect mekanizmasıyla
(ör. Vercel `vercel.json`, GitHub Pages için bir CDN katmanı) yeniden
kurulması gerekir. **Form için**: Netlify Forms yalnızca Netlify'da çalışır;
başka bir host'ta pilot formunu canlı tutmak isterseniz `index.html`'deki
`<form>` etiketine `action="https://formspree.io/f/..."` gibi üçüncü taraf
bir form servisinin endpoint'ini eklemeniz ve `app.js`'teki
`submitToNetlify` fetch hedefini o servise göre güncellemeniz gerekir.

## Dosya yapısı

```
lucithinx-site/
├── template.html                 # TEK KAYNAK markup — data-i18n anahtarları + head placeholder'ları
├── index.html                    # ÜRETİLMİŞ — TR, baked (node scripts/build.mjs ile üretilir)
├── en/
│   └── index.html                # ÜRETİLMİŞ — EN, baked (aynı build ile üretilir)
├── 404.html                      # Markalı "sayfa bulunamadı" — dış istek yok, elle düzenlenir
├── styles.css                    # Tasarım token'ları (CSS custom properties) + tüm görsel dil
├── i18n.js                       # TR/EN çeviri sözlüğü (translations = { tr: {...}, en: {...} })
├── app.js                        # Davranış: dil düğmesi senkronu, mobil nav, accordion, form
├── netlify.toml                  # Publish dir, güvenlik başlıkları (CSP + JSON-LD hash), 404 yönlendirmesi
├── robots.txt                    # Sitemap referansı
├── sitemap.xml                   # İki URL (/ ve /en/), karşılıklı xhtml:hreflang alternate'leriyle
├── scripts/
│   ├── build.mjs                 # template.html + i18n.js → index.html + en/index.html + CSP hash
│   └── check-i18n-parity.mjs     # Self-QA: TR/EN anahtar paritesini ve template.html referanslarını doğrular
├── assets/
│   └── og-image.svg              # 1200×630 OG/Twitter kartı (prod'da PNG'ye çevrilmeli, bkz. aşağı)
└── README.md
```

**`index.html` ve `en/index.html` üretilmiş dosyalardır — elle düzenlemeyin.**
Markup değişikliği için `template.html`'i, metin değişikliği için `i18n.js`'i
düzenleyin, sonra `node scripts/build.mjs` çalıştırın.

Neden `i18n.js` ayrı bir dosya: çeviri sözlüğü **veri**dir, davranış değil.
`app.js`'i tek bakışta anlaşılır tutmak için (Atlas okunabilirlik standardı —
dosya boyutu sınırı) sözlük ayrıştırıldı. Bu aynı zamanda bir çevirmenin/metin
yazarının `app.js`'teki mantığa dokunmadan yalnızca `i18n.js`'i
düzenleyebilmesini sağlar.

## i18n nasıl genişletilir

1. Yeni bir metin eklemeniz gerekiyorsa, `i18n.js` içinde **hem `tr` hem `en`**
   bloğuna aynı anahtarla bir satır ekleyin:
   ```js
   "pilot.form.phone": "Telefon",   // tr bloğunda
   "pilot.form.phone": "Phone",     // en bloğunda
   ```
2. `template.html` tarafında, metin içeriği için `data-i18n="pilot.form.phone"`,
   bir öznitelik (ör. `content`, `placeholder`) çevirisi için
   `data-i18n-attr="content:meta.description"` gibi `öznitelik:anahtar`
   formatını kullanın.
3. Yeni bir dil eklemek isterseniz (üçüncü bir URL, ör. `/de/`) hem
   `i18n.js`'e üçüncü bir üst-seviye anahtar (`de: { ... }`) hem
   `scripts/build.mjs`'teki `LOCALES` nesnesine yeni bir giriş eklemeniz,
   `template.html`'deki `.lang-switch` bloklarına yeni bir
   `<a data-lang="de" href="/de/">DE</a>` koymanız gerekir.
4. Değişiklikten sonra sırayla çalıştırın:
   ```bash
   node scripts/build.mjs               # index.html + en/index.html'i yeniden üret
   node scripts/check-i18n-parity.mjs   # tr/en anahtar paritesini ve template.html referanslarını doğrula
   ```
   Parite script'i hem `tr`/`en` sözlükleri arasındaki anahtar farkını, hem de
   `template.html`'de kullanılan ama sözlükte bulunmayan anahtarları raporlar.

Varsayılan dil **TR**'dir (kök `/`). Dil artık URL'e sabittir — bkz. yukarıdaki
"Dil değiştirici (SEO doğruluğu)" bölümü. Ziyaretçinin son tercihi
`localStorage` anahtarı `lucithinx:lang` altında saklanır (yalnızca hatırlama
amaçlı, otomatik yönlendirme tetiklemez).

## Form — Netlify Forms

`#pilot-form` (Pilot CTA bölümü) **Netlify Forms** ile çalışır — ayrı bir
backend/sunucu kodu gerekmez. Netlify, deploy sırasında HTML'i tarayıp
`data-netlify="true"` taşıyan formu otomatik olarak algılar ve bir form
handler'a bağlar; gönderilen kayıtlar Netlify dashboard'unda (Forms sekmesi)
birikir, isteğe bağlı e-posta bildirimi kurulabilir.

Nasıl çalışır (bkz. `index.html` form üstü yorum + `app.js` →
`handlePilotFormSubmit` / `submitToNetlify`):

1. Mevcut istemci tarafı doğrulama aynen korunur: zorunlu alanlar (ad,
   şirket, e-posta, çağrı hacmi) + `isValidEmail` biçim kontrolü.
2. Doğrulama geçerse form verisi `fetch(POST, application/x-www-form-urlencoded)`
   ile kendi origin'ine gönderilir (Netlify Forms bu isteği yakalar).
3. Başarıda mevcut `aria-live` başarı mesajı gösterilir, form resetlenir.
4. Ağ/host hatasında (`pilot.form.errorSubmit` i18n anahtarı) kullanıcıya
   nazik bir hata mesajı gösterilir — sayfa çökmez.
5. Spam koruması: gizli `bot-field` honeypot input'u (`netlify-honeypot`
   ile eşleştirilmiş, `.sr-only` ile görsel olarak gizli) — botlar dolduruyor,
   insanlar görmüyor, Netlify bu gönderimleri otomatik eler.

**Yerelde (file:// veya `python3 -m http.server`) Netlify'ın form endpoint'i
yoktur** — bu durumda adım 2'deki `fetch` beklenen şekilde başarısız olur ve
adım 4'teki hata mesajı görünür. Bu, kodun kırıldığı anlamına gelmez; sadece
yerel geliştirmede gerçek bir Netlify backend'i olmadığının kanıtıdır.

`mailto:` formu kasıtlı olarak kullanılmadı (spam/header-injection riski).

## SEO / Open Graph

- **İki indekslenebilir URL:** `/` (TR) ve `/en/` (EN), her biri kendi
  `<html lang>`, `<link rel="canonical">`, karşılıklı `hreflang` bloğu
  (tr/en/x-default), `og:locale` (+alternate) ve `robots: index,follow`
  ile. Kaynak `template.html` + `scripts/build.mjs` — bkz. "Build nasıl
  çalışır" bölümü. Elle senkron tutulacak iki ayrı HTML dosyası YOK.
- **JSON-LD (structured data):** her sayfada, o sayfanın dilinde, 3 blok —
  `Organization`, `SoftwareApplication`, `FAQPage` (5 SSS sorusu/cevabı,
  `i18n.js`'teki gerçek metinden). Uydurma rating/review/price/sameAs
  YOK — build script yalnızca gerçekten var olan veriden üretir.
- `<link rel="canonical">`, `og:url`, `og:image`, `twitter:image` şu an
  **placeholder domain** `https://lucithinx.com` kullanıyor. Gerçek domain
  belirlendiğinde `scripts/build.mjs`'teki `SITE_ORIGIN` sabitini tek
  seferde güncelleyip `node scripts/build.mjs`'i yeniden çalıştırın —
  hem `index.html` hem `en/index.html` hem `sitemap.xml`'i (elle) hem
  `robots.txt`'i (elle) bu domaine göre güncellemeniz gerekir.
- `og:image` bugün `assets/og-image.svg` (1200×630, harici font/istek yok).
  **Prod öncesi PNG'ye çevirin** — bazı kırpıcılar (LinkedIn, bazı Slack/Teams
  önizlemeleri) `og:image` için SVG'yi güvenilir şekilde render etmez.
  Öneri: `npx sharp-cli assets/og-image.svg -o assets/og-image.png --width 1200`
  veya tarayıcıda açıp ekran görüntüsü alıp 1200×630'a kırpın; sonra
  `scripts/build.mjs`'teki `og-image.svg` referanslarını `og-image.png`'ye
  çevirip yeniden build alın.
- `robots.txt` ve `sitemap.xml` de placeholder domaine referans verir; domain
  değişince ikisini de (elle) güncelleyin.
- **CSP ve inline JSON-LD:** `netlify.toml`'daki `script-src` direktifi
  `'self'` yanında birkaç `'sha256-...'` girdisi taşır — bunlar
  `build.mjs`'in ürettiği inline `application/ld+json` bloklarının tam
  içeriğinin hash'idir, `'unsafe-inline'` DEĞİL. Build her çalıştığında bu
  liste otomatik yeniden hesaplanır ve yazılır; elle dokunmayın.

## Tasarım kararları (özet)

- **Işık-öncelikli palet:** sıcak kâğıt zemin (`#FBFAF7`) + ink (`#171423`),
  birincil menekşe (`#6D3AF0`) ve sinyal mercan (`#FF6A45`). Kategorideki
  koyu/tek-cyan-accent kalıbından bilinçli olarak ayrışır. Tek koyu bölüm
  ("İnsan kontrolü") kontrast için var, genel dil aydınlık kalır.
- **Tipografi:** harici font yok; `-apple-system, Segoe UI, system-ui, Roboto`
  yığını, ağırlık + letter-spacing ile karakter kuruldu.
- **Logotype/mark:** özgün, inline SVG "ışık düğümü" motifi (soundwave değil);
  brief'teki "ses→node/ışık" fikrinin özgün yorumu.
- **Tüm ikon ve hero görseli inline SVG** — harici istek sıfır, `assets/`
  klasörü bu nedenle boş kalabilir (gelecekte gerçek görsel/ekran görüntüsü
  eklenmek istenirse oraya konur).

Kararların tam gerekçesi ve erişilebilirlik/performans önlemleri için teslim
özetine bakınız (Atlas Frontend Engineer teslim notu).
