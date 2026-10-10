import React, { useState } from 'react';
import {
  Compass,
  Plus,
  Trash2,
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Clock,
  Briefcase,
  Layers,
  ChevronDown,
  ChevronUp,
  Loader2,
  FolderGit2,
  GraduationCap,
  Copy,
  Check,
} from 'lucide-react';
import { CompletedTraining, RoadmapAnalysis } from '../types';
import { SAMPLE_COMPLETED_TRAININGS } from '../data/mockTemplates';

export const LearningRoadmapView: React.FC = () => {
  const [targetCareerGoal, setTargetCareerGoal] = useState('Senior Machine Learning & AI Engineer');
  const [currentLevel, setCurrentLevel] = useState('Orta Düzey (Mid-Level)');
  const [trainings, setTrainings] = useState<CompletedTraining[]>(SAMPLE_COMPLETED_TRAININGS);

  // New Training Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newProvider, setNewProvider] = useState('');
  const [newContents, setNewContents] = useState('');

  // Results
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [roadmap, setRoadmap] = useState<RoadmapAnalysis | null>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(1);
  const [copiedTips, setCopiedTips] = useState(false);

  const handleAddTraining = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContents.trim()) return;

    const newTraining: CompletedTraining = {
      id: `training-${Date.now()}`,
      title: newTitle.trim(),
      provider: newProvider.trim() || 'Kişisel / Çevrimiçi Eğitim',
      contents: newContents.trim(),
    };

    setTrainings((prev) => [...prev, newTraining]);
    setNewTitle('');
    setNewProvider('');
    setNewContents('');
    setShowAddForm(false);
  };

  const handleRemoveTraining = (id: string) => {
    setTrainings((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLoadSampleTrainings = () => {
    setTrainings(SAMPLE_COMPLETED_TRAININGS);
  };

  const handleAnalyzeRoadmap = async () => {
    if (!targetCareerGoal.trim() || trainings.length === 0) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetCareerGoal,
          currentLevel,
          trainings,
        }),
      });

      if (!response.ok) {
        throw new Error('Yol haritası oluşturulurken hata oluştu.');
      }

      const data = await response.json();
      setRoadmap(data);
      setExpandedStep(1);
    } catch (error) {
      console.error(error);
      alert('Eğitim içerikleri analiz edilirken bir sorun oluştu.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyRoadmap = () => {
    if (!roadmap) return;
    const text = `HEDEF: ${targetCareerGoal}\n\nÖZET:\n${roadmap.analysisSummary}\n\nADIMLAR:\n${roadmap.roadmapSteps
      .map((s) => `${s.title} (${s.durationEstimate})\n- Konular: ${s.coreTopics.join(', ')}\n- Proje: ${s.handsOnProject.name}`)
      .join('\n\n')}`;
    navigator.clipboard.writeText(text);
    setCopiedTips(true);
    setTimeout(() => setCopiedTips(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Target Goal & Completed Trainings Configuration */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-8 space-y-6">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-2">
            <span>EĞİTİM İÇERİĞİ VE BECERİ AÇIĞI ANALİZİ</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
            Katıldığınız Eğitimlerden Sonraki Adım Eğitim Yol Haritası
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Daha önce tamamladığınız kurs, sertifika ve bootcamp içeriklerini girdiğinizde; yapay zeka ajanımız
            zaten bildiğiniz konuları eler, hedef unvan için eksik kalan beceri açıklarını tespit eder ve sonraki
            seviye için adım adım somut müfredat ve proje önerileri hazırlar.
          </p>
        </div>

        {/* Career Target & Level Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Ulaşmak İstediğiniz Hedef Unvan / Rol
            </label>
            <input
              type="text"
              value={targetCareerGoal}
              onChange={(e) => setTargetCareerGoal(e.target.value)}
              placeholder="Örn: Senior Machine Learning & AI Engineer"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Mevcut Yetkinlik Seviyeniz
            </label>
            <select
              value={currentLevel}
              onChange={(e) => setCurrentLevel(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            >
              <option value="Giriş / Temel (Junior)">Giriş / Temel (Junior)</option>
              <option value="Orta Düzey (Mid-Level)">Orta Düzey (Mid-Level)</option>
              <option value="Kıdemli / Uzman (Senior)">Kıdemli / Uzman (Senior)</option>
              <option value="Lider / Staff">Lider / Staff Seviyesi</option>
            </select>
          </div>
        </div>

        {/* Trainings List Header */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Tamamladığınız Eğitimler & Müfredatları ({trainings.length})
              </h3>
              <p className="text-xs text-slate-500">
                Ne kadar detaylı içerik eklerseniz, analiz o kadar nokta atışı olacaktır.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {trainings.length === 0 && (
                <button
                  type="button"
                  onClick={handleLoadSampleTrainings}
                  className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
                >
                  Örnek Eğitimleri Yükle
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddForm ? 'Vazgeç' : 'Eğitim Ekle'}</span>
              </button>
            </div>
          </div>

          {/* Add Training Inline Form */}
          {showAddForm && (
            <form
              onSubmit={handleAddTraining}
              className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-5 mb-5 space-y-4"
            >
              <div className="text-xs font-bold text-indigo-900">Yeni Tamamlanan Eğitim Bilgisi:</div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Eğitim Başlığı *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Örn: Docker & Kubernetes Temelleri"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Sağlayıcı / Kurum
                  </label>
                  <input
                    type="text"
                    value={newProvider}
                    onChange={(e) => setNewProvider(e.target.value)}
                    placeholder="Örn: Udemy, BTK Akademi, Coursera"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Eğitimin İçeriği / Müfredat & Kazanımlar *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newContents}
                  onChange={(e) => setNewContents(e.target.value)}
                  placeholder="Bu eğitimde hangi konular işlendi? Örneğin: Konteyner mimarisi, Dockerfile optimizasyonu, Docker Compose ile çoklu servis yönetimi, pod kavramı..."
                  className="w-full p-3 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-2xs"
                >
                  Listeye Kaydet
                </button>
              </div>
            </form>
          )}

          {/* Trainings Cards Grid */}
          {trainings.length === 0 ? (
            <div className="text-center py-8 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <GraduationCap className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-600 font-medium">
                Henüz eğitim eklenmedi. Analiz yapabilmek için en az bir eğitim ekleyin veya hazır örnekleri yükleyin.
              </p>
              <button
                type="button"
                onClick={handleLoadSampleTrainings}
                className="mt-3 px-3.5 py-1.5 text-xs font-bold text-indigo-700 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 shadow-2xs transition-colors"
              >
                Hazır 3 Örnek Eğitimi Yükle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trainings.map((t, idx) => (
                <div
                  key={t.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-2xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-bold text-indigo-600 truncate">
                        {t.provider}
                      </span>
                      <button
                        onClick={() => handleRemoveTraining(t.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title="Eğitimi kaldır"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mb-2 line-clamp-1">
                      {t.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 line-clamp-4 leading-relaxed">
                      {t.contents}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Eğitim #{idx + 1}</span>
                    <span className="text-emerald-600 font-semibold">İçerik Girildi</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Generate Roadmap Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleAnalyzeRoadmap}
            disabled={isAnalyzing || trainings.length === 0 || !targetCareerGoal.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Müfredat Analiz Ediliyor & Yol Haritası Çıkarılıyor...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Sonraki Adım Eğitim Yol Haritasını Oluştur</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results Display */}
      {roadmap && (
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span className="font-bold text-indigo-600">Yol Haritası Analiz Raporu</span>
                  <span aria-hidden="true">·</span>
                  <span>Hedef: {targetCareerGoal}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Mevcut Yetkinlik Durumu & Sonraki Adım Stratejisi
                </h3>
              </div>

              <button
                onClick={handleCopyRoadmap}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors self-start shrink-0"
              >
                {copiedTips ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Kopyalandı</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Haritayı Kopyala</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              {roadmap.analysisSummary}
            </p>
          </div>

          {/* Competency Audit 3-Column Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Mastered Skills */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Kazanılmış Yetkinlikler (Zaman Kaybetmeyin)</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Bu konuları mevcut eğitimlerinizde zaten tamamladınız; temel seviye eğitimlerle vakit kaybetmeyin.
              </p>
              <div className="space-y-2.5">
                {roadmap.competencyAudit.masteredSkills.map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs">
                    <div className="font-bold text-slate-900">{item.skill}</div>
                    {item.evidence && (
                      <div className="text-[11px] text-slate-600 mt-1">{item.evidence}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Partial Skills */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Kısmen Kazanılmış / Pekiştirilecekler</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Temelleriniz var ancak ileri seviye kullanım ve production tecrübesi geliştirilmeli.
              </p>
              <div className="space-y-2.5">
                {roadmap.competencyAudit.partialSkills.map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 text-xs">
                    <div className="font-bold text-slate-900">{item.skill}</div>
                    {item.gap && (
                      <div className="text-[11px] text-slate-600 mt-1">{item.gap}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Critical Gaps */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-700 mb-3">
                <Layers className="w-4 h-4 text-rose-600" />
                <span>Kritik Beceri Açıkları (Sonraki Adım)</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Hedeflediğiniz {targetCareerGoal} unvanı için işverenlerin mülakatlarda aradığı kritik eksikler.
              </p>
              <div className="space-y-2.5">
                {roadmap.competencyAudit.criticalGaps.map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 text-xs">
                    <div className="font-bold text-slate-900">{item.skill}</div>
                    {item.importance && (
                      <div className="text-[11px] text-slate-600 mt-1">{item.importance}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step-by-Step Tiered Roadmap */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Adım Adım Önerilen Eğitim & Gelişim Yol Haritası
                </h3>
                <p className="text-xs text-slate-500">
                  Her aşama teorik derslerden ziyade doğrudan portföy ve mülakat başarısı odaklıdır.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {roadmap.roadmapSteps.map((step) => {
                const isExpanded = expandedStep === step.stepNumber;
                return (
                  <div
                    key={step.stepNumber}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
                  >
                    {/* Step Card Header */}
                    <div
                      onClick={() => setExpandedStep(isExpanded ? null : step.stepNumber)}
                      className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                          {step.stepNumber}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
                            <span className="font-semibold text-indigo-600">{step.level}</span>
                            <span aria-hidden="true">·</span>
                            <span className="flex items-center gap-1 tabular-nums font-medium text-slate-700">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {step.durationEstimate}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-slate-900">
                            {step.title}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-indigo-600 font-semibold hidden sm:inline">
                          {isExpanded ? 'Detayları Kapat' : 'İçerik & Projeyi Gör'}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Step Content */}
                    {isExpanded && (
                      <div className="px-5 pb-6 pt-2 border-t border-slate-100 space-y-5 bg-white">
                        {/* Core Topics */}
                        <div>
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                            Bu Aşamada Odaklanılacak Müfredat Konuları:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {step.coreTopics.map((topic, i) => (
                              <div
                                key={i}
                                className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 text-xs text-slate-700 font-medium flex items-center gap-2"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                                <span>{topic}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Hands-on Project Box */}
                        <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                          <div className="flex items-center gap-2 text-xs font-bold text-indigo-950">
                            <FolderGit2 className="w-4 h-4 text-indigo-600" />
                            <span>Önerilen Uygulamalı Portföy Projesi:</span>
                            <span className="font-extrabold text-indigo-700">"{step.handsOnProject.name}"</span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed">
                            {step.handsOnProject.description}
                          </p>
                          <div className="pt-1 flex items-center gap-2 text-[11px] text-indigo-900">
                            <strong>Çıktı & Teslimat:</strong>
                            <span className="font-medium">{step.handsOnProject.deliverable}</span>
                          </div>
                        </div>

                        {/* Recommended Courses & Formats */}
                        <div>
                          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                            Tavsiye Edilen Eğitim & Kaynak Formatları:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {step.recommendedCourseTypes.map((course, i) => (
                              <span
                                key={i}
                                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200/60"
                              >
                                📚 {course}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interview Readiness Tips Box */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Koçun Notu: Bu Eğitimleri Mülakatlarda Nasıl Avantaja Çevirirsiniz?</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              {roadmap.interviewReadinessTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="font-bold text-indigo-600 mt-0.5">·</span>
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
