"use strict";

/**
 * lucithinx marketing site — translation dictionary.
 *
 * Colocated as its own file (not inline in app.js) because it is data, not
 * behavior: it grows independently of the interaction logic and a
 * translator/copywriter should be able to edit this file without touching
 * any function. See app.js for how `translations` is consumed.
 *
 * Every key used by `data-i18n` / `data-i18n-attr` in index.html MUST exist
 * in both `tr` and `en` — verified by the self-QA parity check described in
 * README.md.
 *
 * To add a new string: add the key under both locales below, then reference
 * it from HTML with `data-i18n="your.key"` (text content) or
 * `data-i18n-attr="attributeName:your.key"` (attribute value).
 */
const translations = {
  tr: {
    "meta.title": "lucithinx — Çağrı operasyonunuzu yöneten AI",
    "meta.description":
      "lucithinx gelen ve giden çağrılarınızı AI ile karşılar, konuşmanın altındaki niyeti ve duyguyu okur, CRM ve destek kayıtlarınızı kendisi günceller. Kararı hep ekibiniz verir. Tek bir çağrı akışıyla başlayan pilotla deneyin.",

    "a11y.skipToContent": "İçeriğe geç",

    "nav.toggle": "Menüyü aç",
    "nav.howItWorks": "Nasıl çalışır",
    "nav.capabilities": "Yetenekler",
    "nav.control": "İnsan kontrolü",
    "nav.integrations": "Entegrasyonlar",
    "nav.faq": "SSS",
    "nav.cta": "Pilotu başlat",
    "nav.login": "Giriş",

    "hero.eyebrow": "AI çağrı operasyonu",
    "hero.heading": "Her çağrı yönetilir. Hiçbiri kaybolmaz.",
    "hero.sub":
      "lucithinx'in yapay zekâ asistanı Luci, gelen ve giden çağrılarınızı karşılar, konuşmanın altındaki niyeti ve duyguyu okur, CRM ile destek kayıtlarınızı kendisi günceller. Ekibiniz baştan sona görür ve istediği an devralır.",
    "hero.ctaPrimary": "Pilotu başlat",
    "hero.ctaSecondary": "Nasıl çalıştığını gör",
    "hero.note": "Tek bir akışta kanıtlayın, sonra tüm operasyona ölçekleyin. Kontrol baştan sona sizde.",

    "problem.eyebrow": "Operasyonel baskı",
    "problem.heading": "Hacim büyür, eski operasyon dayanmaz",
    "problem.lead":
      "Aynı ekip, aynı mesai içinde daha fazla çağrıya yetişmeye çalışıyor. Sonuç bellidir: bekleyen hatlar, birbirini tutmayan notlar, arada kaynayan taleplerdir.",
    "problem.card1.title": "Dağınık kayıtlar",
    "problem.card1.body":
      "Herkes notunu kendince tutar. Konuşmanın özü sisteme aynı dille, aynı yerde bir türlü düşmez.",
    "problem.card2.title": "Büyümenin faturası",
    "problem.card2.body":
      "Daha çok çağrının tek cevabı daha çok kişi almak gibi görünür. Oysa bu yol bir yerden sonra tıkanır.",
    "problem.card3.title": "Kör noktalar",
    "problem.card3.body":
      "Hangi çağrı öfkeye döndü, hangi talep aslında acildi? Bu sinyaller çoğu zaman kimse görmeden geçip gider.",

    "how.eyebrow": "Nasıl çalışır",
    "how.heading": "Çağrıdan eyleme, dört adımda",
    "how.step1.title": "Çağrı gelir",
    "how.step1.body":
      "Gelen ya da giden çağrıyı Luci karşılar. Karşıdaki kişi robotla değil, doğal konuşan biriyle konuşur.",
    "how.step2.title": "Luci dinler ve anlar",
    "how.step2.body":
      "Luci konuşmayı anında çözümler. Talep, niyet ve ses tonundaki duygu ayrı ayrı ortaya çıkar.",
    "how.step3.title": "Harekete geçer",
    "how.step3.body": "CRM ve destek kaydı güncellenir, açılması gereken görevler kendiliğinden oluşur.",
    "how.step4.title": "Gerektiğinde devreder",
    "how.step4.body":
      "Sizin koyduğunuz sınır aşıldığında Luci görüşmeyi, tüm bağlamıyla birlikte bir yetkiliye geçirir.",

    "capabilities.eyebrow": "Ürün yetenekleri",
    "capabilities.heading": "Ciddi bir çağrı operasyonunun gerektirdiği her katman",
    "capabilities.card1.title": "Ses akışları",
    "capabilities.card1.body":
      "Hattan gelen sesi gecikmesiz işler, karşılıklı akan doğal bir konuşmaya çevirir.",
    "capabilities.card2.title": "Bağlam katmanı",
    "capabilities.card2.body":
      "Luci, müşterinin geçmişini ve önceki görüşmeleri konuşma sürerken hatırlar. Aynı şeyi iki kez sordurmaz.",
    "capabilities.card3.title": "Görüşme zekâsı",
    "capabilities.card3.body":
      "Luci konuşmanın nereye gittiğini izler; konu değişimini ve cevapsız kalan soruyu kaçırmaz.",
    "capabilities.card4.title": "Duygu ve niyet okuma",
    "capabilities.card4.body":
      "Luci, ses tonundan memnuniyeti, tedirginliği ya da aciliyeti daha kelimeler bitmeden yakalar.",
    "capabilities.card5.title": "Operasyon kontrolü",
    "capabilities.card5.body":
      "Kurallar, sınırlar ve devir noktaları sizin elinizde kalır. Hepsi ayarlanabilir, hepsi izlenebilir.",

    "control.eyebrow": "İnsan kontrolü",
    "control.heading": "İşi AI yapar, kararı siz verirsiniz",
    "control.lead":
      "Otomasyon, denetimi elinizden almak için değil. lucithinx baştan; ekibinizin içini görebildiği, dilediği an durdurabildiği ve devralabildiği bir sistem olarak kuruldu.",
    "control.card1.title": "Devir kuralları",
    "control.card1.body":
      "Bir görüşme hangi durumda insana geçer? Bunu siz tanımlarsınız, sınırları kendi operasyonunuza göre çizersiniz.",
    "control.card2.title": "Onay noktaları",
    "control.card2.body":
      "Kritik bir adımın önüne onay koyabilirsiniz. Luci arkanızdan, siz görmeden karar vermez.",
    "control.card3.title": "Canlı izleme",
    "control.card3.body":
      "Süren görüşmeler ve açılan görevler panelinizde anlık akar. Ne olduğunu sonradan değil, o an görürsünüz.",
    "control.card4.title": "Denetlenebilirlik",
    "control.card4.body": "Her kararın neden verildiğini geriye dönüp izleyebilirsiniz. Ortada kara kutu yok.",

    "integrations.eyebrow": "Entegrasyonlar",
    "integrations.heading": "Kurulu düzeninizin üzerine oturur, yerine geçmez",
    "integrations.lead": "lucithinx, kaydınızı tuttuğunuz ve konuştuğunuz araçlarla aynı dili konuşur.",
    "integrations.card1.title": "CRM sistemleri",
    "integrations.card1.body": "Müşteri kaydı, fırsat ve notlar siz uğraşmadan güncel kalır.",
    "integrations.card2.title": "Destek / talep sistemleri",
    "integrations.card2.body":
      "Görüşme biter bitmez talep açılır ya da güncellenir, önceliği de etiketiyle birlikte gelir.",
    "integrations.card3.title": "İletişim kanalları",
    "integrations.card3.body": "Telefon hattınızla ve ekibin haberleştiği bildirim araçlarıyla birlikte çalışır.",

    "transparency.eyebrow": "Şeffaflık",
    "transparency.heading": "Her görüşmenin tam kaydı, istediğiniz an önünüzde",
    "transparency.card1.title": "Çağrı kayıtları",
    "transparency.card1.body":
      "Sesin kendisi ve metin dökümü, aradığınız an tek tıkla önünüze gelecek şekilde saklanır.",
    "transparency.card2.title": "Denetim izi",
    "transparency.card2.body": "Hangi adım ne zaman, hangi gerekçeyle atıldı? Hepsi tek tek kayıtlıdır.",
    "transparency.card3.title": "Kalite gözden geçirme",
    "transparency.card3.body":
      "Örneklenen görüşmeler düzenli gözden geçirilir. Sistem, bu geri bildirimle her defasında biraz daha keskinleşir.",

    "faq.eyebrow": "Sık sorulanlar",
    "faq.heading": "Karar vermeden önce netleşmesi gerekenler",
    "faq.q1.question": "Pilot ne kadar sürer?",
    "faq.q1.answer":
      "Tek bir çağrı akışıyla, kısa tutarak başlarız. Kapsamı da süreyi de birlikte kararlaştırırız.",
    "faq.q2.question": "Mevcut telefon altyapımızla çalışır mı?",
    "faq.q2.answer":
      "Evet. Kullandığınız hat ve santral yapısının üzerine kurulur; altyapınızı değiştirmenize gerek kalmaz.",
    "faq.q3.question": "Luci yanlış bir şey söylerse ne olur?",
    "faq.q3.answer":
      "Sizin koyduğunuz sınır aşılır aşılmaz Luci görüşmeyi bir yetkiliye devreder. Dilerseniz her an kendiniz de araya girersiniz.",
    "faq.q4.question": "Verilerimiz nerede saklanır?",
    "faq.q4.answer":
      "Saklama süresini ve yerini, pilot kapsamını konuşurken kurumunuzun kendi politikalarına göre netleştiririz.",
    "faq.q5.question": "Ekibimizin yeni bir şey öğrenmesi gerekir mi?",
    "faq.q5.answer":
      "Kurulumu ve devir kurallarını birlikte tanımlarız. Amacımız, ekibinizin günlük işine tek bir yük bile eklememek.",

    "pilot.eyebrow": "Pilot programı",
    "pilot.heading": "Tek akışta kanıtlayalım, sonra ölçekleyelim",
    "pilot.lead":
      "Operasyonunuzdan tek bir çağrı akışı seçin; lucithinx'i orada, düşük riskle kanıta çevirelim. Birkaç satır bilgi bırakın, size dönelim.",
    "pilot.form.name": "Ad Soyad",
    "pilot.form.company": "Şirket",
    "pilot.form.email": "E-posta",
    "pilot.form.volume": "Aylık çağrı hacmi (yaklaşık)",
    "pilot.form.volumePlaceholder": "Seçin",
    "pilot.form.volume1": "500'den az",
    "pilot.form.volume2": "500 – 2.000",
    "pilot.form.volume3": "2.000 – 10.000",
    "pilot.form.volume4": "10.000'den fazla",
    "pilot.form.message": "Mesajınız (opsiyonel)",
    "pilot.form.submit": "Pilotu başlat",
    "pilot.form.success": "Teşekkürler! Talebiniz alındı, ekibimiz kısa süre içinde size dönecek.",
    "pilot.form.error": "Lütfen zorunlu alanları (ad, şirket, e-posta, çağrı hacmi) eksiksiz doldurun.",
    "pilot.form.errorEmail": "Lütfen geçerli bir e-posta adresi girin (ör. ad@sirket.com).",
    "pilot.form.errorSubmit": "Gönderim başarısız oldu. Lütfen tekrar deneyin.",

    "footer.tagline": "Çağrı operasyonunuzu yöneten AI.",
    "footer.copyright": "© 2026 lucithinx. Tüm hakları saklıdır.",
  },

  en: {
    "meta.title": "lucithinx — The AI that runs your call operation",
    "meta.description":
      "lucithinx answers your inbound and outbound calls with AI, reads the intent and emotion under the words, and updates your CRM and support records on its own. Your team always makes the call. Try it with a pilot that starts on a single call flow.",

    "a11y.skipToContent": "Skip to content",

    "nav.toggle": "Open menu",
    "nav.howItWorks": "How it works",
    "nav.capabilities": "Capabilities",
    "nav.control": "Human control",
    "nav.integrations": "Integrations",
    "nav.faq": "FAQ",
    "nav.cta": "Start a pilot",
    "nav.login": "Sign in",

    "hero.eyebrow": "AI call operations",
    "hero.heading": "Every call handled. Nothing lost.",
    "hero.sub":
      "Luci, the AI assistant inside lucithinx, answers your inbound and outbound calls, reads the intent and emotion under the words, and updates your CRM and support records itself. Your team sees all of it and steps in whenever it wants.",
    "hero.ctaPrimary": "Start a pilot",
    "hero.ctaSecondary": "See how it works",
    "hero.note": "Prove it on one flow, then scale across the operation. You hold control the whole way.",

    "problem.eyebrow": "Operational pressure",
    "problem.heading": "Volume climbs, the old operation buckles",
    "problem.lead":
      "The same team is trying to cover more calls in the same hours. You know how it ends: lines left on hold, notes that don't match, requests that quietly fall through.",
    "problem.card1.title": "Scattered records",
    "problem.card1.body":
      "Everyone takes notes their own way. The heart of a conversation never lands in one place, in one voice.",
    "problem.card2.title": "The cost of growth",
    "problem.card2.body":
      "More calls look like they need more people. But past a point, that road simply runs out.",
    "problem.card3.title": "Blind spots",
    "problem.card3.body":
      "Which call turned angry, which request was actually urgent? Those signals slip by before anyone catches them.",

    "how.eyebrow": "How it works",
    "how.heading": "From call to action, in four steps",
    "how.step1.title": "The call comes in",
    "how.step1.body":
      "Luci picks up the inbound or outbound call. The caller talks to someone who sounds human, not a bot.",
    "how.step2.title": "Luci listens and understands",
    "how.step2.body":
      "Luci reads the conversation as it happens. Request, intent, and the emotion in the voice come apart cleanly.",
    "how.step3.title": "It acts",
    "how.step3.body": "CRM and support records update, and the tasks that should exist open on their own.",
    "how.step4.title": "It hands off when it should",
    "how.step4.body":
      "The moment your limit is crossed, Luci moves the call to a person — with the full context attached.",

    "capabilities.eyebrow": "Product capabilities",
    "capabilities.heading": "Every layer a serious call operation demands",
    "capabilities.card1.title": "Voice pipelines",
    "capabilities.card1.body":
      "Handles audio off the line with no lag and turns it into a real, back-and-forth conversation.",
    "capabilities.card2.title": "Context layer",
    "capabilities.card2.body":
      "Luci recalls the customer's history and past calls while the conversation runs — so no one repeats themselves.",
    "capabilities.card3.title": "Conversation intelligence",
    "capabilities.card3.body":
      "Luci tracks where the conversation is heading, and never loses a topic shift or a question left unanswered.",
    "capabilities.card4.title": "Emotion & intent reading",
    "capabilities.card4.body":
      "Luci hears satisfaction, hesitation, or urgency in the tone — before the sentence is even finished.",
    "capabilities.card5.title": "Operations control",
    "capabilities.card5.body":
      "Rules, limits, and hand-off points stay in your hands. Every one of them adjustable, every one auditable.",

    "control.eyebrow": "Human control",
    "control.heading": "The AI does the work, you make the decisions",
    "control.lead":
      "Automation isn't here to take oversight away from you. lucithinx is built from the start as a system your team can see into, stop on a dime, and take over whenever it wants.",
    "control.card1.title": "Hand-off rules",
    "control.card1.body":
      "When does a call move to a human? You decide that, and draw the lines around your own operation.",
    "control.card2.title": "Approval checkpoints",
    "control.card2.body":
      "Put an approval step in front of any critical action. Luci never decides behind your back.",
    "control.card3.title": "Live monitoring",
    "control.card3.body":
      "Live calls and freshly opened tasks stream into your dashboard. You watch it happen, not read about it later.",
    "control.card4.title": "Auditability",
    "control.card4.body": "You can trace back why any decision was made. There's no black box in the way.",

    "integrations.eyebrow": "Integrations",
    "integrations.heading": "It sits on top of your setup, not in place of it",
    "integrations.lead": "lucithinx speaks the same language as the tools you already keep records and talk in.",
    "integrations.card1.title": "CRM systems",
    "integrations.card1.body": "Customer records, deals, and notes stay current without you touching them.",
    "integrations.card2.title": "Support / ticketing systems",
    "integrations.card2.body":
      "The moment a call ends, a ticket opens or updates — priority tagged and ready.",
    "integrations.card3.title": "Communication channels",
    "integrations.card3.body": "Works alongside your phone line and the notification tools your team lives in.",

    "transparency.eyebrow": "Transparency",
    "transparency.heading": "The full record of every call, the moment you want it",
    "transparency.card1.title": "Call records",
    "transparency.card1.body":
      "The audio itself and the transcript are kept so they're one click away the moment you need them.",
    "transparency.card2.title": "Audit trail",
    "transparency.card2.body": "Which step was taken, when, and on what grounds — all of it logged, one by one.",
    "transparency.card3.title": "Quality review",
    "transparency.card3.body":
      "Sampled conversations get reviewed on a schedule, and the system sharpens a little more each time.",

    "faq.eyebrow": "Frequently asked",
    "faq.heading": "What to settle before you decide",
    "faq.q1.question": "How long does the pilot run?",
    "faq.q1.answer":
      "We start on a single call flow and keep it short. Scope and length are things we settle together.",
    "faq.q2.question": "Will it work with our existing phone infrastructure?",
    "faq.q2.answer":
      "Yes. It sits on top of the lines and switchboard you already run, so nothing about your infrastructure has to change.",
    "faq.q3.question": "What happens if Luci gets something wrong?",
    "faq.q3.answer":
      "The moment your limit is crossed, Luci hands the call to a person. And you can step in yourself at any time you like.",
    "faq.q4.question": "Where is our data stored?",
    "faq.q4.answer":
      "We settle retention and location against your own organization's policies while we scope the pilot.",
    "faq.q5.question": "Does our team have to learn anything new?",
    "faq.q5.answer":
      "We set the rules and hand-offs up together. The aim is to add nothing — not one extra step — to your team's day.",

    "pilot.eyebrow": "Pilot program",
    "pilot.heading": "Prove it on one flow, then scale",
    "pilot.lead":
      "Pick one call flow from your operation and we'll turn lucithinx into proof there — at low risk. Leave a few details and we'll come back to you.",
    "pilot.form.name": "Full name",
    "pilot.form.company": "Company",
    "pilot.form.email": "Email",
    "pilot.form.volume": "Approximate monthly call volume",
    "pilot.form.volumePlaceholder": "Select",
    "pilot.form.volume1": "Under 500",
    "pilot.form.volume2": "500 – 2,000",
    "pilot.form.volume3": "2,000 – 10,000",
    "pilot.form.volume4": "Over 10,000",
    "pilot.form.message": "Message (optional)",
    "pilot.form.submit": "Start a pilot",
    "pilot.form.success": "Thank you! We've received your request and will get back to you shortly.",
    "pilot.form.error": "Please fill in all required fields (name, company, email, call volume).",
    "pilot.form.errorEmail": "Please enter a valid email address (e.g. name@company.com).",
    "pilot.form.errorSubmit": "Submission failed. Please try again.",

    "footer.tagline": "The AI that runs your call operation.",
    "footer.copyright": "© 2026 lucithinx. All rights reserved.",
  },
};
