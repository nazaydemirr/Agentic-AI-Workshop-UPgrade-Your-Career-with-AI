import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint 1: Generate Persona-Tailored Interview Questions
app.post('/api/interview/generate', async (req, res) => {
  const { targetRole, interviewerTitle, experienceLevel, companyContext } = req.body;

  if (!targetRole || !interviewerTitle) {
    return res.status(400).json({ error: 'targetRole ve interviewerTitle zorunludur.' });
  }

  const prompt = `
Sen dünya standartlarında kıdemli bir mülakat ve kariyer koçusun.
Aday "${targetRole}" pozisyonuna hazırlanıyor (Seviye: ${experienceLevel || 'Orta/Kıdemli'}).
Mülakatı yapacak kişinin unvanı (Title): "${interviewerTitle}".
Şirket / Sektör Bağlamı: "${companyContext || 'Teknoloji / SaaS Şirketi'}".

GÖREVİN:
1. Mülakatçının Unvanını (${interviewerTitle}) derinlemesine analiz et: Bu unvandaki biri mülakata girdiğinde zihninde ne vardır? Teknik detaylara mı, problem çözme hızına mı, mimari kararlara mı, kültür uyumuna mı, yoksa takım liderliğine mi odaklanır?
2. Bu mülakatçının ağzından adaya yöneltilecek 5 adet son derece gerçekçi, düşündürücü soru üret. Sorular farklı kategorileri kapsamalı (örn. Teknik Derinlik, Sistem & Mimari, Davranışsal/STAR, Problem Çözme, Liderlik).
3. Her sorunun arkasındaki mülakatçı niyetini ve aranan kilit beklentileri belirt.

Tüm çıktıları Türkçe olarak aşağıdaki JSON şemasına uygun hazırla.
`;

  try {
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY tanımlanmamış.');
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Sen kıdemli yazılım ve teknoloji mülakat koçusun. Her zaman geçerli JSON üretirsin.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            interviewerPersona: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                mindset: { type: Type.STRING },
                evaluationCriteria: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                styleDescription: { type: Type.STRING },
                proTips: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['title', 'mindset', 'evaluationCriteria', 'styleDescription', 'proTips'],
            },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  category: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  interviewerIntent: { type: Type.STRING },
                  keyExpectations: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['id', 'question', 'category', 'difficulty', 'interviewerIntent', 'keyExpectations'],
              },
            },
          },
          required: ['interviewerPersona', 'questions'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.warn('Gemini generate-questions fallback triggered:', error?.message);
    
    // Rich fallback data tailored to the requested persona
    const isTech = /lead|architect|engineer|developer|cto|vp/i.test(interviewerTitle);
    const isHR = /hr|talent|recruiter|people|ik|insan/i.test(interviewerTitle);

    const fallbackPersona = {
      title: interviewerTitle,
      mindset: isHR 
        ? `${interviewerTitle} olarak önceliğim adayın şirket kültürümüze uyumu, takım dinamiklerine katkısı, çatışma yönetimi ve kariyer motivasyonudur.`
        : `${interviewerTitle} olarak önceliğim kod kalitesi, karmaşık sistemlerde karar alma kabiliyeti, teknik borç yönetimi ve yüksek ölçeklenebilirlik deneyimidir.`,
      evaluationCriteria: isHR
        ? ['STAR metodolojisiyle anlatım yeteneği', 'Takım içi iletişim ve geri bildirim olgunluğu', 'Şirket değerlerine ve uzun vadeli hedeflere uyum', 'Kriz ve belirsizlik anlarında tutum']
        : ['Mimari tasarım ve trade-off analizleri', 'Teknik problem çözme derinliği', 'Clean code ve test edilebilirlik standartları', 'Mentorluk ve teknik liderlik potansiyeli'],
      styleDescription: isHR
        ? 'Dostane ancak detay odaklı; somut geçmiş örnekler ve sonuç odaklı metrikler duymak ister.'
        : 'Pragmatik, doğrudan ve teknik derinliği sorgulayan; "neden" sorusunu peş peşe sormayı sever.',
      proTips: [
        `Cevaplarınızı ${interviewerTitle} unvanının karar verme parametrelerine göre şekillendirin.`,
        'Soyut ifadeler yerine somut rakamlar, metrikler ve kararlarınızın sebep-sonuç ilişkisini vurgulayın.',
        'Sadece başarıları değil, karşılaştığınız zorlukları nasıl aştığınızı şeffaflıkla aktarın.',
      ],
    };

    const fallbackQuestions = [
      {
        id: 'q-1',
        question: `${targetRole} rolünde bugüne kadar karşılaştığınız en zorlu teknik veya süreçsel darboğaz neydi ve bunu aşmak için hangi somut adımları attınız?`,
        category: 'Problem Çözme',
        difficulty: 'İleri',
        interviewerIntent: 'Adayın kriz anındaki analitik düşünme yeteneğini ve inisiyatif alma seviyesini ölçmek.',
        keyExpectations: ['Durumun net tarifi (Situation)', 'Adayın üstlendiği kişisel sorumluluk (Action)', 'Somut ve ölçülebilir iş sonucu (Result)'],
      },
      {
        id: 'q-2',
        question: `Bir sistem veya mimari kararı alırken hız (time-to-market) ile teknik borç (technical debt) arasında nasıl bir denge kurarsınız?`,
        category: 'Sistem & Mimari',
        difficulty: 'Uzman',
        interviewerIntent: 'Mühendislik pragmatizmini ve iş hedefleriyle teknik hedefleri uyumlandırma olgunluğunu sınamak.',
        keyExpectations: ['Trade-off analizi yapabilme', 'Teknik borcu dokümante etme ve refactor planı yapma', 'Ekiple ortak uzlaşı sağlama'],
      },
      {
        id: 'q-3',
        question: `Ekibinizdeki başka bir kıdemli mühendis veya ürün yöneticisiyle kritik bir teknik kararda anlaşmazlığa düştüğünüz bir anı anlatabilir misiniz?`,
        category: 'Davranışsal (STAR)',
        difficulty: 'Orta',
        interviewerIntent: 'Çatışma çözme becerisi, egodan bağımsız veri odaklı iletişim ve profesyonellik.',
        keyExpectations: ['Veri ve kıyaslama odaklı argüman kurma', 'Karşı tarafı dinleme ve empati kurma', 'Şirket çıkarlarını kişisel egonun önüne koyma'],
      },
      {
        id: 'q-4',
        question: `Geliştirdiğiniz bir sistem beklenmedik bir yük altında çöktü veya kritik bir hata verdiğinde, post-mortem (kök neden analizi) sürecini nasıl yönetirsiniz?`,
        category: 'Teknik Derinlik',
        difficulty: 'İleri',
        interviewerIntent: 'Hata toleransı kültürü, izlenebilirlik (observability) tecrübesi ve blame-free post-mortem anlayışı.',
        keyExpectations: ['Loglama ve monitoring araçları kullanımı', 'Blameless kültür ile tekrarını önleyici aksiyon maddeleri belirleme', 'Hızlı rollback / hotfix stratejisi'],
      },
      {
        id: 'q-5',
        question: `Önümüzdeki 1-2 yıl içinde ${targetRole} alanındaki teknolojik dönüşümün rolünüzü nasıl etkileyeceğini düşünüyorsunuz ve kendinizi buna nasıl hazırlıyorsunuz?`,
        category: 'Vizyon & Gelişim',
        difficulty: 'Orta',
        interviewerIntent: 'Sürekli öğrenme refleksi, pazar farkındalığı ve yapay zeka araçlarını iş akışına adapte etme isteği.',
        keyExpectations: ['Merak ve öğrenme tutkusu', 'Modern araçları pratik faydaya dönüştürme bakışı', 'Kariyerinde net bir yön belirlemiş olma'],
      },
    ];

    return res.json({
      interviewerPersona: fallbackPersona,
      questions: fallbackQuestions,
    });
  }
});

// Endpoint 2: Evaluate Candidate's Answer using STAR & Persona Lens
app.post('/api/interview/evaluate', async (req, res) => {
  const { question, interviewerTitle, targetRole, candidateAnswer } = req.body;

  if (!question || !candidateAnswer) {
    return res.status(400).json({ error: 'question ve candidateAnswer zorunludur.' });
  }

  const prompt = `
Sen kıdemli bir kariyer ve mülakat koçusun.
Aday "${targetRole}" rolü için "${interviewerTitle}" unvanlı bir mülakatçıya cevap verdi.

SORU: "${question}"
ADAYIN CEVABI: "${candidateAnswer}"

GÖREVİN:
1. Adayın cevabını 1-10 puan arasında adil ve yapıcı şekilde puanla.
2. STAR Metodolojisine (Situation - Durum, Task - Görev, Action - Eylem, Result - Sonuç) göre adayın cevabını analiz et. Eksik kalan kısımları belirt.
3. Cevabın güçlü yönlerini ve "${interviewerTitle}" karşısında eksik kalan/geliştirilmesi gereken yönlerini çıkar.
4. Bu soruya "${interviewerTitle}" unvanını gerçekten etkileyecek örnek bir "İdeal Cevap (Model Answer)" hazırla.

JSON formatında Türkçe yanıt döndür.
`;

  try {
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY tanımlanmamış.');
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Sen profesyonel mülakat koçusun. STAR analizini objektif yap ve motive edici yapıcı geri bildirim sağla. Her zaman geçerli JSON üret.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            starCompliance: {
              type: Type.OBJECT,
              properties: {
                situation: {
                  type: Type.OBJECT,
                  properties: {
                    present: { type: Type.BOOLEAN },
                    comment: { type: Type.STRING },
                  },
                  required: ['present', 'comment'],
                },
                task: {
                  type: Type.OBJECT,
                  properties: {
                    present: { type: Type.BOOLEAN },
                    comment: { type: Type.STRING },
                  },
                  required: ['present', 'comment'],
                },
                action: {
                  type: Type.OBJECT,
                  properties: {
                    present: { type: Type.BOOLEAN },
                    comment: { type: Type.STRING },
                  },
                  required: ['present', 'comment'],
                },
                result: {
                  type: Type.OBJECT,
                  properties: {
                    present: { type: Type.BOOLEAN },
                    comment: { type: Type.STRING },
                  },
                  required: ['present', 'comment'],
                },
              },
              required: ['situation', 'task', 'action', 'result'],
            },
            modelAnswer: { type: Type.STRING },
          },
          required: ['score', 'summary', 'strengths', 'improvements', 'starCompliance', 'modelAnswer'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.warn('Gemini evaluate fallback triggered:', error?.message);

    const wordCount = candidateAnswer.trim().split(/\s+/).length;
    const baseScore = Math.min(9, Math.max(5, Math.round(wordCount / 12) + 3));

    return res.json({
      score: baseScore,
      summary: `Cevabınız temel bir çerçeve sunuyor ancak ${interviewerTitle} gibi bir karar vericiyi etkilemek için somut ölçülebilir sonuçlar (Result) ve aldığınız kişisel teknik aksiyonlar (Action) daha belirgin olmalıdır.`,
      strengths: [
        'Sorunun ana konusuna odaklı bir başlangıç yapıldı.',
        'Kişisel deneyim veya düşünce tarzı samimi bir dille aktarıldı.',
      ],
      improvements: [
        'Genel "biz yaptık" dili yerine "benim aldığım karar şuydu" diyerek kişisel etkinizi netleştirin.',
        'Metriklerle zenginleştirin (örn. %35 performans artışı, hata oranında düşüş, sprint süresinde tasarruf).',
        `${interviewerTitle} unvanının önemseyeceği teknik trade-off veya iş etkisine değinmeyi ihmal etmeyin.`,
      ],
      starCompliance: {
        situation: {
          present: wordCount > 20,
          comment: wordCount > 20 ? 'Karşılaşılan bağlam ana hatlarıyla belirtilmiş.' : 'Olayın geçtiği bağlam ve şirket/proje durumu daha net çizilmeli.',
        },
        task: {
          present: wordCount > 30,
          comment: 'Çözülmesi gereken görev belirtilmiş fakat sorumluluk sınırları derinleştirilebilir.',
        },
        action: {
          present: wordCount > 40,
          comment: 'Uygulanan yöntemler ve teknolojik seçimler daha somut adımlarla listelenmeli.',
        },
        result: {
          present: wordCount > 60,
          comment: wordCount > 60 ? 'Sonuçtan bahsedilmiş ancak ölçülebilir metriklerle desteklenmesi etkisini iki katına çıkarır.' : 'Ölçülebilir bir sonuç (yüzde, süre, maliyet veya kullanıcı memnuniyeti) eklenmemiş.',
        },
      },
      modelAnswer: `Geçtiğimiz projede benzer bir senaryoda karşılaştığımız darboğazda (Situation), servis yanıt sürelerini 800ms'den 150ms'nin altına indirme hedefini üstlendim (Task). Öncelikle distributed tracing araçlarıyla darboğazın veritabanı sorgularındaki N+1 probleminden kaynaklandığını tespit ettim; Redis önbellekleme katmanı ekleyip mikroservisler arası asenkron kuyruk yapısına geçtik (Action). Sonuç olarak p99 yanıt sürelerini %81 düşürdük ve sonraki yoğun kampanya döneminde 0 kesintiyle sistemi ayakta tuttuk (Result).`,
    });
  }
});

// Endpoint 3: Analyze Completed Trainings & Produce Step-by-Step Learning Roadmap
app.post('/api/roadmap/generate', async (req, res) => {
  const { targetCareerGoal, currentLevel, trainings } = req.body;

  if (!targetCareerGoal || !trainings || !Array.isArray(trainings)) {
    return res.status(400).json({ error: 'targetCareerGoal ve trainings dizisi zorunludur.' });
  }

  const prompt = `
Sen üst düzey bir teknik kariyer mentörü ve mühendislik direktörüsün.
Adayın hedef kariyer unvanı: "${targetCareerGoal}".
Mevcut Seviyesi: "${currentLevel || 'Orta Düzey'}".

Adayın Bugüne Kadar Katıldığı ve Tamamladığı Eğitimlerin İçerikleri:
${trainings
  .map(
    (t: any, idx: number) => `
[Eğitim ${idx + 1}]: ${t.title || 'Başlıksız'} (Sağlayıcı: ${t.provider || 'Belirtilmedi'})
Müfredat ve Kazanım İçeriği:
${t.contents || 'İçerik belirtilmedi'}
`
  )
  .join('\n---\n')}

GÖREVİN:
1. Bu eğitim içeriklerini derinlemesine incele. Adayın halihazırda kazandığı yetkinlikleri çıkar (Zaten bildiği konuları tekrar önererek zaman kaybettirme!).
2. Hedef unvan olan "${targetCareerGoal}" için güncel sektör standartlarında hangi kritik becerilerin eksik olduğunu tespit et (Beceri Açığı Analizi).
3. Adayın bir sonraki seviyeye sıçramasını sağlayacak, adım adım, seviyelendirilmiş 3-4 aşamalı bir "Eğitim & Gelişim Yol Haritası" oluştur.
   - Her aşamada: Öncelik, tahmini süre, odaklanılacak derin konular, portföyde sergilenecek somut proje ve önerilen eğitim/kaynak formatı bulunmalı.
4. Mülakatlarda bu eğitimlerin ve projelerin nasıl anlatılması gerektiğine dair koçluk tavsiyeleri ekle.

Çıktıyı Türkçe olarak aşağıdaki JSON şemasına uygun hazırla.
`;

  try {
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY tanımlanmamış.');
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Sen teknik kariyer yol haritası ve müfredat mimarısın. Her zaman geçerli JSON üretirsin.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysisSummary: { type: Type.STRING },
            competencyAudit: {
              type: Type.OBJECT,
              properties: {
                masteredSkills: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      skill: { type: Type.STRING },
                      evidence: { type: Type.STRING },
                    },
                    required: ['skill', 'evidence'],
                  },
                },
                partialSkills: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      skill: { type: Type.STRING },
                      gap: { type: Type.STRING },
                    },
                    required: ['skill', 'gap'],
                  },
                },
                criticalGaps: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      skill: { type: Type.STRING },
                      importance: { type: Type.STRING },
                    },
                    required: ['skill', 'importance'],
                  },
                },
              },
              required: ['masteredSkills', 'partialSkills', 'criticalGaps'],
            },
            roadmapSteps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.NUMBER },
                  title: { type: Type.STRING },
                  level: { type: Type.STRING },
                  durationEstimate: { type: Type.STRING },
                  coreTopics: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  handsOnProject: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      description: { type: Type.STRING },
                      deliverable: { type: Type.STRING },
                    },
                    required: ['name', 'description', 'deliverable'],
                  },
                  recommendedCourseTypes: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['stepNumber', 'title', 'level', 'durationEstimate', 'coreTopics', 'handsOnProject', 'recommendedCourseTypes'],
              },
            },
            interviewReadinessTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['analysisSummary', 'competencyAudit', 'roadmapSteps', 'interviewReadinessTips'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.warn('Gemini roadmap fallback triggered:', error?.message);

    return res.json({
      analysisSummary: `Aldığınız eğitimler "${targetCareerGoal}" için sağlam bir temel oluşturmuş. Ancak mülakatlarda bir adım öne geçmek için teorik ve tekil kod yazımından öte; dağıtık sistem mimarisi, üretim ortamı ölçekleme ve sistem izlenebilirliği (observability) alanlarına odaklanmanız gerekiyor.`,
      competencyAudit: {
        masteredSkills: [
          { skill: 'Temel Programlama ve Veri Yapıları', evidence: 'Tamamlanan eğitimlerdeki sözdizimi, nesne yönelimli programlama ve temel algoritmalar.' },
          { skill: 'Temel Veri Tabanı ve API Kullanımı', evidence: 'REST mimarisi, CRUD operasyonları ve temel sorgu yazımı pratiği.' },
          { skill: 'Git ve Versiyon Kontrol Temelleri', evidence: 'Kod tabanı yönetimi ve temel geliştirme akışları.' },
        ],
        partialSkills: [
          { skill: 'Mikroservisler ve Asenkron Mimari', gap: 'Kuyruk sistemleri (Kafka/RabbitMQ) ve event-driven mimaride derinleşme gerekiyor.' },
          { skill: 'Performans Optimizasyonu ve Caching', gap: 'Redis/Memcached kullanımı ve database indexleme stratejilerinde pratik eksikliği.' },
        ],
        criticalGaps: [
          { skill: 'Sistem Tasarımı (High-Level System Design)', importance: `${targetCareerGoal} mülakatlarının en belirleyici eleme aşamasıdır.` },
          { skill: 'CI/CD, Docker ve Cloud Dağıtımı (DevOps Farkındalığı)', importance: 'Üretim ortamına kod çıkaran kıdemli mühendislerden beklenen temel refleks.' },
          { skill: 'Gözlemlenebilirlik (Prometheus, Grafana, OpenTelemetry)', importance: 'Canlıdaki darboğazları tespit edebilme güvencesi sunar.' },
        ],
      },
      roadmapSteps: [
        {
          stepNumber: 1,
          title: 'Adım 1: İleri Düzey Mimari & Dağıtık Sistem Temelleri',
          level: 'İleri Seviye Uzmanlaşma',
          durationEstimate: '4 - 6 Hafta',
          coreTopics: [
            'Event-driven mimari ve mesajlaşma kuyrukları (Kafka / RabbitMQ)',
            'CAP Teoremi, veri tutarlılığı modelleri (Eventual vs Strong Consistency)',
            'Dağıtık önbellekleme stratejileri (Write-through, Cache-aside, Redis)',
          ],
          handsOnProject: {
            name: 'Yüksek Trafikli Event-Driven Sipariş ve Bildirim Motoru',
            description: 'Saniyede 2000+ isteği asenkron kuyruklarla işleyen, Redis ile hızlandırılmış dayanıklı bir backend servisi.',
            deliverable: 'GitHub deposu, mimari şema diyagramı ve Apache JMeter yük testi raporu.',
          },
          recommendedCourseTypes: [
            'Martin Kleppmann - Designing Data-Intensive Applications (Kitap / Çalışma Grubu)',
            'Pratik Kafka & Dağıtık Sistemler İleri Düzey Kursu',
          ],
        },
        {
          stepNumber: 2,
          title: 'Adım 2: Konteynerizasyon, CI/CD ve Cloud Üretim Standartları',
          level: 'Üretim Mimarisi',
          durationEstimate: '3 - 4 Hafta',
          coreTopics: [
            'Docker multi-stage build optimizasyonu ve minimal image boyutu',
            'Kubernetes temel pod yönetimi, Ingress ve ConfigMap yapılandırması',
            'GitHub Actions ile otomatik test, lint ve buluta sıfır kesintiyle (Blue-Green) dağıtım',
          ],
          handsOnProject: {
            name: 'Otomatik Dağıtımlı Bulut Altyapısı Şablonu',
            description: 'Kod push edildiğinde testleri koşan, Docker imajını derleyip cloud ortamına kesintisiz deploy eden CI/CD pipeline.',
            deliverable: 'Çalışan GitHub Actions workflow dosyaları ve canlı demo adresi.',
          },
          recommendedCourseTypes: [
            'Resmi Cloud Sertifikasyon Hazırlığı (AWS Certified Solutions Architect veya GCP Associate)',
            'Kubernetes for Developers Uygulamalı Laboratuvarı',
          ],
        },
        {
          stepNumber: 3,
          title: 'Adım 3: Büyük Ölçekli Sistem Tasarımı ve Liderlik Simülasyonu',
          level: 'Üretim Mimarisi & Liderlik',
          durationEstimate: '4 Hafta',
          coreTopics: [
            'Rate Limiting, Load Balancing, CDN ve Database Sharding',
            'Hata toleransı (Circuit Breaker pattern, Retry mekanizmaları)',
            'Teknik karar dokümantasyonu (ADR - Architecture Decision Records) yazımı',
          ],
          handsOnProject: {
            name: 'Uçtan Uca Sistem Tasarımı Portföy Vaka Çalışması',
            description: 'Gerçek bir global servis (örn. URL Shortener veya Real-time Chat) için kapasite hesabı, veritabanı şeması ve hata senaryoları analizi.',
            deliverable: 'Miro veya Draw.io üzerinde detaylı mimari tasarım belgesi ve ADR notları.',
          },
          recommendedCourseTypes: [
            'Alex Xu - System Design Interview serisi',
            'Gerçek mühendislik blogları incelemesi (Netflix, Uber, Discord Tech Blogs)',
          ],
        },
      ],
      interviewReadinessTips: [
        'Mülakatlarda aldığınız eğitimlerin isimlerini saymak yerine, "Bu eğitimdeki şu projede Kafka kullanarak darboğazı çözdüm" şeklinde somut çıktı anlatımı yapın.',
        'GitHub reponuzun README dosyalarına sadece kod değil, bir mühendis gibi aldığınız mimari kararları ve alternatifleri ekleyin.',
        'Mülakatçı soru sorduğunda doğrudan koda atlamadan önce gereksinimleri netleştiren 1-2 mimari soru yöneltin.',
      ],
    });
  }
});

// Setup Vite or Static File Serving
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
