# Kariyer ve Mülakat Koçu (Interview & Career Coach Agent)

Yazılım geliştirme, veri bilimi ve yapay zeka alanında kariyer hedeflerine hazırlanan adaylar için; mülakatçının unvanına (title) göre özelleştirilmiş interaktif mülakat simülasyonu sunan ve tamamlanan eğitim içeriklerini analiz ederek kişiselleştirilmiş bir sonraki adım eğitim yol haritası çıkaran yapay zeka destekli kariyer koçluğu platformu.

## User Review & Critical Decisions

> [!IMPORTANT]
> Kullanıcı yanıtlarıyla netleşen mimari ve deneyim tercihleri aşağıda özetlenmiştir. İnşa aşamasına geçmeden önce planı inceleyip onaylayabilirsiniz.

- **Confirmed Decision 1 (Odak Alanı)**: Yazılım Geliştirme, Veri Bilimi ve Yapay Zeka (Frontend, Backend, Full-stack, Data Scientist, ML Engineer, Data Engineer, Tech Lead vb.) rolleri merkeze alınacak; adaya istediği özel unvan ve seviyeyi özelleştirme imkanı sunulacak.
- **Confirmed Decision 2 (Mülakat Deneyimi)**: Yalnızca statik soru listesi değil; mülakatçının unvanına göre (örn. *Engineering Manager*, *Senior Data Scientist*, *HR Director*, *VP of Engineering*, *Staff Backend Engineer*) dinamik soru üretimi, adayın yanıt verebileceği interaktif simülatör, STAR tekniğine göre yapay zeka analizi ve puanlanmış geri bildirim paneli uygulanacak.
- **Confirmed Decision 3 (Eğitim & Kariyer Yol Haritası)**: Kullanıcının aldığı eğitimlerin başlıklarını, içeriklerini ve kazanımlarını girmesiyle; hedef unvanla karşılaştırmalı **Beceri Açığı Analizi (Skill Gap Analysis)** ve 3 kademeli (Temel Pekiştirme, İleri Seviye Uzmanlaşma, Portföy & Sistem Tasarımı) **Adım Adım Eğitim Yol Haritası** oluşturulacak.
- **Recommended Default (AI & Güvenlik)**: Tüm yapay zeka operasyonları `@google/genai` SDK'sı (`gemini-3.8-flash`) ile sunucu tarafında (`/api/*` endpoint'leri) yürütülecek; API anahtarı istemciye sızdırılmayacak.

---

## 1. Overview & Core Concept

- **What It Does**:
  1. **Mülakatçı Unvanına Özel Soru & Simülasyon**: Kullanıcı mülakat yapacak kişinin unvanını (örn. *Talent Acquisition Specialist*, *Engineering Manager*, *Lead ML Architect*, *CTO*) ve kendi başvurduğu pozisyonu seçer/yazar. Ajan, o mülakatçının bakış açısı, teknik derinliği ve karar kriterleriyle odaklanan gerçekçi sorular üretir. Aday her soruya yanıt verir; ajan STAR (Situation, Task, Action, Result) metodolojisiyle yanıtı analiz edip geliştirme önerileri ve örnek ideal yanıt sunar.
  2. **Tamamlanan Eğitimlerin Analizi & Sonraki Adım Yol Haritası**: Kullanıcı daha önce katıldığı eğitim, bootcamp, sertifika veya ders içeriklerini (müfredat, öğrenilen konular, araçlar) ekler. Ajan, bu kazanımları hedef unvanın güncel sektör beklentileriyle eşleştirerek eksik kalan yetkinlikleri belirler ve sonraki adım için spesifik eğitim modülleri, proje fikirleri ve kaynak önerileri üretir.
- **Target Audience / Persona**: Yazılım ve veri/yapay zeka alanında iş arayan, terfi hedefleyen veya mülakatlara hazırlanan geliştiriciler, veri bilimciler ve yeni mezunlar.
- **Key Value**: Adayın karşısındaki mülakatçının psikolojisini ve beklentisini anlamasını sağlamak, mülakat stresini simülasyonla azaltmak ve rastgele eğitim almak yerine nokta atışı kariyer yol haritasıyla zaman kazanmak.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Ana Çalışma Alanı & Mod Seçimi**:
   - Üst sekmede iki temel mod:
     - 🎙️ **Mülakat Koçu & Simülatör (Interview Simulator)**
     - 🎓 **Eğitim Analizi & Kariyer Yol Haritası (Learning Roadmap)**
   - Hızlı başlangıç için hazır roller ve mülakatçı unvanı şablonları (Engineering Manager, HR Partner, Senior ML Lead vb.).
2. **Mülakatçı Odaklı Simülasyon Akışı**:
   - Aday başvurduğu rolü ve mülakatçının unvanını girer (örn. "Senior Backend Developer" mülakatında görüşmeci "VP of Engineering").
   - Ajan mülakatçının profil analizini özetler: Bu unvan neye dikkat eder? (Kültür uyumu mu, ölçeklenebilirlik mi, takım liderliği mi?).
   - Aday simülasyonu başlatır. Soru soru ilerleyen interaktif bir görüşme odasında aday cevabını yazar (veya mikrofondan konuşarak metne dönüştürür).
   - "Koçtan Değerlendirme Al" butonuna tıklandığında anında yapay zeka geri bildirimi açılır: Güçlü yönler, STAR uyumu, kaçırılan teknik noktalar ve örnek alternatif cevap.
3. **Eğitim İçeriği Analizi & Yol Haritası Akışı**:
   - Kullanıcı aldığı eğitimleri kartlar halinde ekler (Eğitim adı, kurum, içerik/müfredat metni, öğrenilen teknolojiler). Örnek veri yükleme butonu mevcuttur.
   - Hedef unvan seçilir (örn. "Senior Machine Learning Engineer").
   - "Yol Haritası Oluştur" tıklandığında derinlemesine analiz üretilir:
     - **Yetkinlik Matrisi**: Kazanılmış beceriler vs. Geliştirilmesi gerekenler.
     - **Adım Adım Eğitim Tavsiyesi**: Seviyelendirilmiş modüller (Süre, öncelik, odak konuları, önerilen pratik projeler, tavsiye edilen kurs tipi).
     - **Kariyer Tavsiyesi Notu**: Mülakatlarda bu eğitimlerin nasıl anlatılması gerektiğine dair ipuçları.

### Visual Identity & Theme

- **Aesthetic Direction**: Temiz, modern, profesyonel SaaS kariyer stüdyosu. Gereksiz yapay süslemelerden uzak, odaklanmayı artıran sofistike ve güven veren arayüz.
- **Color Palette & Mood**:
  - Arka plan: Nötr açık tuval (`#F8FAFC` / `bg-slate-50`), karanlık mod desteğiyle uyumlu temiz zemin.
  - Yüzeyler: Temiz kartlar, 1px zarif sınırlar (`border-slate-200 dark:border-slate-800`).
  - Vurgu Rengi: Güven veren derin lacivert/kobalt mavisi (`#2563EB` / `#1D4ED8`) ve mülakat başarı durumları için zümrüt yeşili (`#059669`).
  - Tipografi: Başlıklarda modern ve net `Plus Jakarta Sans`, veri ve süre göstergelerinde `tabular-nums` ile dengeli hiyerarşi.
- **Anti-Slop Restraint**:
  - Sahte hap/hapçık kirliliği yok; kategoriler ve tarihler temiz metin ayraçlarıyla (`·`, `/`) sunulur.
  - Sahte skor tahtaları veya uydurma telemetri sayaçları yok; gerçekçi, eyleme dökülebilir geri bildirimler yer alır.
  - Tek satırlı anlaşılır buton etiketleri ("Soruyu Yanıtla", "Yol Haritasını Çıkar", "Simülasyonu Sıfırla").

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Mülakatçı Rolü Modellemesi (Title-Specific Persona)**
  - *Chosen Approach*: Prompt mühendisliğinde mülakatçının unvanı ve organizasyondaki seviyesi sistem talimatına doğrudan enjekte edilir. İK yöneticisi davranışsal/kültür/STAR soruları sorarken, Tech Lead kod kalitesi ve mimari kararları, CTO ise iş etkisi ve teknoloji vizyonunu sorar.
  - *Why*: Adayların mülakatlarda en sık yaşadığı sorun, teknik lidere konuşur gibi İK'ya konuşmak ya da tam tersidir. Bu ayrım adaya gerçek dünyada doğrudan avantaj sağlar.
- **Decision 2: Eğitim İçeriklerinin Vektörel/Semantik Analizi ve Yol Haritası**
  - *Chosen Approach*: Kullanıcının girdiği eğitim içerikleri yapılandırılmış bir JSON şemasıyla Gemini 3.8 Flash modeline iletilir. Model, hedef unvanın gereksinimleriyle boşluk analizi yapar ve çıktı olarak yapılandırılmış eğitim kartları (Öncelik, Süre, Konu Özeti, Tavsiye Edilen Format, Portföy Projesi) döndürür.
  - *Why*: Genel geçer "Python öğren" tavsiyesi yerine, kullanıcının zaten aldığı "Temel Python ve Pandas" içeriğini görüp "İleri Seviye Dağıtık Sistemlerde PySpark ve MLflow ile Model Dağıtımı" gibi bir sonraki seviye tavsiyesi verilmesini sağlar.
- **Decision 3: Sunucu Tarafı API ve Güvenlik**
  - *Chosen Approach*: Tüm Gemini API çağrıları Express sunucu katmanında (`server.ts` ve Vite development proxy) `/api/interview/generate`, `/api/interview/evaluate`, `/api/roadmap/generate` uç noktaları üzerinden çalıştırılır.
  - *Why*: API anahtarının istemciye sızması engellenir, yanıt şemaları sunucu tarafında doğrulanır.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Frontend (React 19 + Vite)                     │
│                                                                        │
│  ┌───────────────────────┐             ┌────────────────────────────┐  │
│  │ Interview Coach View  │             │ Learning Roadmap View      │  │
│  │ - Title & Role Picker │             │ - Completed Courses Input  │  │
│  │ - Persona Brief Card  │             │ - Target Role Selector     │  │
│  │ - Interactive Sim Q&A │             │ - Skill Gap Matrix         │  │
│  │ - STAR Feedback Modal │             │ - Tiered Learning Steps    │  │
│  └───────────┬───────────┘             └─────────────┬──────────────┘  │
│              │                                       │                 │
│              └───────────────────┬───────────────────┘                 │
│                                  │ (fetch /api/*)                      │
└──────────────────────────────────┼─────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────────────┐
│                   Server API Layer (Node.js / Express)                 │
│                                                                        │
│   POST /api/interview/generate  ───► Persona-tailored Question Builder  │
│   POST /api/interview/evaluate  ───► STAR Evaluation & Sample Answers   │
│   POST /api/roadmap/generate    ───► Gap Analysis & Roadmap Generator  │
│                                  │                                     │
│   Shared Gemini Client ──────────┴─────────────────┐                   │
│   (GoogleGenAI: model "gemini-3.8-flash")          │                   │
└────────────────────────────────────────────────────┼───────────────────┘
                                                     ▼
                                      Google Gemini API (Server-Side)
```

### Data Model & State

- **InterviewSession**:
  - `targetRole`: string (örn. "Senior Frontend Developer")
  - `interviewerTitle`: string (örn. "Director of Engineering")
  - `interviewerPersona`: `{ focus: string, criteria: string[], style: string }`
  - `questions`: Array of `{ id: string, question: string, category: string, difficulty: string, rationale: string }`
  - `answers`: Record of `{ questionId: { candidateAnswer: string, feedback: FeedbackResult } }`
- **FeedbackResult**:
  - `score`: number (1-10)
  - `strengths`: string[]
  - `improvements`: string[]
  - `starCompliance`: `{ situation: boolean, task: boolean, action: boolean, result: boolean, notes: string }`
  - `suggestedAnswer`: string
- **LearningProfile**:
  - `completedTrainings`: Array of `{ id: string, title: string, provider: string, contents: string, keySkills: string[] }`
  - `targetCareerGoal`: string
- **RoadmapResult**:
  - `masteredSkills`: string[]
  - `missingSkills`: string[]
  - `nextSteps`: Array of `{ stepNumber: number, title: string, level: string, durationEstimate: string, curriculumOutline: string[], portfolioProject: string, recommendedFormat: string }`
  - `coachingAdvice`: string

---

## 5. Implementation Stages (Planned)

1. **Backend API Kurulumu**: Express sunucu ve Vite yapılandırması; Gemini 3.8 Flash entegrasyonu (`/api/interview/generate`, `/api/interview/evaluate`, `/api/roadmap/generate`).
2. **Kariyer ve Mülakat Koçu Arayüzü**:
   - Modern çift modlu stüdyo düzeni (Navbar, Mod Değiştirici).
   - Mülakatçı seçici ve soru simülasyon odası (mikrofon/yazı girişi, STAR geri bildirim kartı).
   - Eğitim analiz formu ve seviyelendirilmiş adım adım kariyer yol haritası sunumu.
   - Hızlı deneme için gerçekçi yazılım/veri bilimi şablon verileri (Mock datasets).
3. **Doğrulama & Test**: Derleme testi (`compile_applet`) ve akış testleri.
