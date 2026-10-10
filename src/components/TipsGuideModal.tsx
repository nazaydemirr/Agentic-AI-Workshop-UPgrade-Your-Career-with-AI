import React from 'react';
import {
  Lightbulb,
  CheckCircle2,
  HelpCircle,
  Award,
  Users,
  Compass,
  ArrowRight,
} from 'lucide-react';

interface TipsGuideModalProps {
  onGoToInterview: () => void;
  onGoToRoadmap: () => void;
}

export const TipsGuideModal: React.FC<TipsGuideModalProps> = ({
  onGoToInterview,
  onGoToRoadmap,
}) => {
  return (
    <div className="space-y-8">
      {/* Intro Hero */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 mb-2">
            <span>STRATEJİK MÜLAKAT VE KARİYER METODOLOJİSİ</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
            Mülakatçının Unvanını Okuma & Eğitimleri Kariyer Sinyaline Dönüştürme
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Teknoloji mülakatlarında başarısız olan adayların %70'i teknik eksiklikten değil; karşılarındaki
            mülakatçının beklentisine yanlış dille yanıt vermekten ve aldıkları eğitimleri bir mühendis gibi değil
            bir öğrenci gibi anlatmaktan elenir. İşte profesyonel koçluk taktikleri:
          </p>
        </div>
      </div>

      {/* Guide Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: Reading Interviewer Personas */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                1. Mülakatçının Unvanına Göre Dili Ayarlama
              </h3>
              <span className="text-xs text-slate-500">Kime ne anlatmalısınız?</span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <strong className="text-blue-900 block mb-1">
                Engineering Manager (EM) & Takım Liderleri:
              </strong>
              Sizinle çalışmanın nasıl olacağını anlamak isterler. Kodunuzun mükemmelliğinden ziyade; zamanında teslimat, teknik borçla uzlaşma, çatışma çözümü ve diğer geliştiricilere mentorluk yeteneğinizi ölçerler.
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <strong className="text-violet-900 block mb-1">
                Tech Lead & Staff / Principal Engineer:
              </strong>
              Teknik trade-off'lara odaklanırlar. "Neden Redis seçtin?", "Database lock'larını nasıl yönettin?", "Sistemin darboğazı neresi?" sorularını sorarlar. Burada yüzeysel cevap vermemeli, teknik derinliği göstermelisiniz.
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <strong className="text-amber-900 block mb-1">
                CTO / VP of Engineering:
              </strong>
              İş etkisi (Business Impact) ve vizyon ararlar. "Bu teknik seçim şirkete ne kazandırdı?", "Mimari 10 kat büyürse ne olur?" gibi maliyet ve ölçeklenebilirlik soruları gelir.
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <strong className="text-emerald-900 block mb-1">
                İnsan Kaynakları (İK) ve Talent Partner:
              </strong>
              STAR metodolojisinin sadık uygulayıcılarıdır. Takım uyumu, geri bildirim kültürü ve şirkette uzun vadeli kalma motivasyonunuzu test ederler.
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onGoToInterview}
              className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              <span>Mülakat Simülatöründe Bu Unvanları Deneyin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Pillar 2: Training to Hiring Signal */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                2. Eğitimleri Portföye ve İşe Alım Sinyaline Dönüştürme
              </h3>
              <span className="text-xs text-slate-500">"Kurs aldım" demek yerine ne demelisiniz?</span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <strong className="text-rose-900 block mb-1">
                ❌ Hata: Sertifika Koleksiyoncusu Tuzağı
              </strong>
              "Coursera'dan 10 tane sertifika aldım" demek işe alımcıya hiçbir güven vermez. Çünkü herkes video izleyip sertifika alabilir.
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <strong className="text-emerald-900 block mb-1">
                ✅ Çözüm: Proje & Problem Odaklı Çerçeveleme
              </strong>
              "Coursera'daki Dağıtık Sistemler eğitiminin ardından; öğrendiğim mimariyi test etmek için saniyede 1500 isteği Kafka kuyruğuna atan bir açık kaynak servis yazdım ve bunu Docker ile deploy ettim."
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <strong className="text-indigo-900 block mb-1">
                🎯 Boşluk Analizinin Önemi
              </strong>
              Geliştiricilerin yaptığı en yaygın zaman kaybı, zaten bildikleri Python/JS temellerini anlatan 5 farklı kursu art arda bitirmektir. Bunun yerine bir sonraki kademedeki (MLOps, Kubernetes, System Design) eksiklikleri hedeflemelisiniz.
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onGoToRoadmap}
              className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <span>Eğitimlerinizi Ekleyin & Yol Haritanızı Çıkarın</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* STAR Method Golden Formula */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <Award className="w-4 h-4 text-amber-500" />
          <span>STAR Metodolojisi ile Mülakat Cevabı Formülü</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 text-xs space-y-1.5">
            <div className="font-extrabold text-blue-900 text-sm">S - Situation (Durum)</div>
            <p className="text-slate-600 leading-normal">
              Olay hangi şirkette, hangi proje aşamasında ve hangi problem ortamında gerçekleşti? (15-20 saniye)
            </p>
          </div>

          <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 text-xs space-y-1.5">
            <div className="font-extrabold text-indigo-900 text-sm">T - Task (Görev)</div>
            <p className="text-slate-600 leading-normal">
              Sizin kişisel olarak çözmeniz veya ekiple başarmanız gereken spesifik hedef neydi?
            </p>
          </div>

          <div className="p-4 rounded-xl border border-violet-200 bg-violet-50/40 text-xs space-y-1.5">
            <div className="font-extrabold text-violet-900 text-sm">A - Action (Eylem)</div>
            <p className="text-slate-600 leading-normal">
              Hangi teknik kararları aldınız, hangi kütüphaneleri kullandınız, hangi zorlukları aştınız?
            </p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 text-xs space-y-1.5">
            <div className="font-extrabold text-emerald-900 text-sm">R - Result (Sonuç)</div>
            <p className="text-slate-600 leading-normal">
              Ölçülebilir metrik (%40 performans artışı, 0 kesinti, 2 hafta erken teslimat).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
