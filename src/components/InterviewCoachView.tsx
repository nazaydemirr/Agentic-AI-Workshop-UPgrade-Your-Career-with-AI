import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Mic,
  MicOff,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  ArrowRight,
  Loader2,
  Check,
  Copy,
  Zap,
  HelpCircle,
  Award,
} from 'lucide-react';
import {
  InterviewerPersona,
  InterviewQuestion,
  AnswerEvaluation,
} from '../types';
import {
  INTERVIEWER_TITLE_PRESETS,
  TARGET_ROLE_PRESETS,
} from '../data/mockTemplates';

export const InterviewCoachView: React.FC = () => {
  // Setup form states
  const [targetRole, setTargetRole] = useState('Senior Backend Developer');
  const [interviewerTitle, setInterviewerTitle] = useState('Engineering Manager');
  const [experienceLevel, setExperienceLevel] = useState('Senior');
  const [companyContext, setCompanyContext] = useState('B2B SaaS / Yüksek Trafikli Teknoloji Şirketi');

  // Session states
  const [isGenerating, setIsGenerating] = useState(false);
  const [persona, setPersona] = useState<InterviewerPersona | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Answering & Evaluation states
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [evaluations, setEvaluations] = useState<Record<string, AnswerEvaluation>>({});
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showStarGuide, setShowStarGuide] = useState(false);
  const [copiedAnswer, setCopiedAnswer] = useState(false);

  // Speech Recognition
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check speech recognition support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'tr-TR';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          const currentQId = questions[currentQuestionIndex]?.id;
          if (currentQId) {
            setAnswers((prev) => ({
              ...prev,
              [currentQId]: (prev[currentQId] ? prev[currentQId] + ' ' : '') + transcript,
            }));
          }
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [questions, currentQuestionIndex]);

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Mic start error:', err);
      }
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion?.id] || '' : '';
  const currentEvaluation = currentQuestion ? evaluations[currentQuestion?.id] : null;

  const handleStartSimulation = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/interview/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          interviewerTitle,
          experienceLevel,
          companyContext,
        }),
      });

      if (!response.ok) {
        throw new Error('Sorular üretilirken hata oluştu.');
      }

      const data = await response.json();
      setPersona(data.interviewerPersona);
      setQuestions(data.questions || []);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setEvaluations({});
    } catch (error) {
      console.error(error);
      alert('Simülasyon başlatılırken bir sorun oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEvaluateAnswer = async () => {
    if (!currentQuestion || !currentAnswer.trim()) return;

    setIsEvaluating(true);
    try {
      const response = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion.question,
          interviewerTitle,
          targetRole,
          candidateAnswer: currentAnswer,
        }),
      });

      if (!response.ok) {
        throw new Error('Değerlendirme alınırken hata oluştu.');
      }

      const evalData = await response.json();
      setEvaluations((prev) => ({
        ...prev,
        [currentQuestion.id]: evalData,
      }));
    } catch (error) {
      console.error(error);
      alert('Değerlendirme alınırken bir sorun oluştu.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAnswer(true);
    setTimeout(() => setCopiedAnswer(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Simulation Setup Area (Show if no questions generated or allow modifying) */}
      {!persona ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-2">
              <span>MÜLAKATÇI PROFİLİ VE ROL TANIMI</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-3">
              Mülakatçının Unvanına Özel Akıllı Soru Simülatörü
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Mülakata katılacak kişinin unvanını (Title) belirttiğinizde; o kişinin organizasyondaki rolü,
              karar kriterleri ve odak noktasına göre gerçekçi sorular üretilir. Yanıtınızı yazarak veya sesli
              aktararak STAR metodolojisine göre anında yapay zeka koçluk geri bildirimi alabilirsiniz.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Target Role Field */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Başvurduğunuz Pozisyon / Hedef Rol
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Örn: Senior Backend Engineer"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {TARGET_ROLE_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setTargetRole(preset)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all text-left ${
                      targetRole === preset
                        ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Interviewer Title Field */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Mülakatı Yapacak Kişinin Unvanı (Title)
              </label>
              <input
                type="text"
                value={interviewerTitle}
                onChange={(e) => setInterviewerTitle(e.target.value)}
                placeholder="Örn: Engineering Manager, Tech Lead, HR Director"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              <div className="space-y-1.5 pt-1">
                <span className="text-xs text-slate-400 block font-medium">Sık Karşılaşılan Mülakatçı Rolleri:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {INTERVIEWER_TITLE_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setInterviewerTitle(preset.title)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                        interviewerTitle === preset.title
                          ? 'border-blue-500 bg-blue-50/70 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg bg-gradient-to-br ${preset.avatarColor} text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5`}
                      >
                        {preset.badge}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{preset.title}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{preset.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Context Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Aday Deneyim Seviyesi
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['Junior', 'Mid-Level', 'Senior', 'Lead / Staff'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setExperienceLevel(lvl)}
                    className={`py-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                      experienceLevel === lvl
                        ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Şirket / Sektör Türü
              </label>
              <input
                type="text"
                value={companyContext}
                onChange={(e) => setCompanyContext(e.target.value)}
                placeholder="Örn: Hızlı Büyüyen Fintech Girişimi"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleStartSimulation}
              disabled={isGenerating || !targetRole || !interviewerTitle}
              className="flex items-center gap-2.5 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mülakatçı Soruları Hazırlanıyor...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Simülasyonu Başlat & Soruları Üret</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Active Simulation Workspace */
        <div className="space-y-6">
          {/* Top Persona Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 md:p-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <span className="font-semibold text-blue-600">{persona.title}</span>
                    <span aria-hidden="true">·</span>
                    <span>Mülakatçı Profili</span>
                    <span aria-hidden="true">·</span>
                    <span>{experienceLevel} Seviye Aday</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    {interviewerTitle} ile Görüşme Odası
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed italic">
                    "{persona.mindset}"
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPersona(null)}
                className="self-start text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shrink-0"
              >
                Profili Düzenle
              </button>
            </div>

            {/* Persona Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 pt-4 border-t border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Bu Unvanın En Çok Baktığı 4 Değerlendirme Kriteri:
                </span>
                <ul className="space-y-1.5">
                  {persona.evaluationCriteria.map((crit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{crit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Bu Mülakatçıya Karşı Altın Değerinde Taktikler:
                </span>
                <ul className="space-y-1.5">
                  {persona.proTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <Award className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Question Stepper Bar */}
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">SORULAR:</span>
              <div className="flex items-center gap-1.5">
                {questions.map((q, idx) => {
                  const hasAnswer = Boolean(answers[q.id]);
                  const hasEval = Boolean(evaluations[q.id]);
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                        currentQuestionIndex === idx
                          ? 'bg-blue-600 text-white shadow-xs'
                          : hasEval
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : hasAnswer
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Önceki Soru"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-slate-600 tabular-nums">
                {currentQuestionIndex + 1} / {questions.length}
              </span>
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                disabled={currentQuestionIndex === questions.length - 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Sonraki Soru"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Question Card */}
          {currentQuestion && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-8 space-y-6">
              {/* Question Metadata */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="font-bold text-blue-700">Soru {currentQuestionIndex + 1}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-slate-700">{currentQuestion.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-500">Zorluk: {currentQuestion.difficulty}</span>
                </div>
                <div className="text-xs text-slate-400">
                  Hedef Rol: <span className="text-slate-700 font-medium">{targetRole}</span>
                </div>
              </div>

              {/* Question Headline */}
              <h4 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                "{currentQuestion.question}"
              </h4>

              {/* Question Intent Box */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <span>{interviewerTitle} Bu Soruda Ne Duymak İstiyor?</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentQuestion.interviewerIntent}
                </p>
                <div className="pt-2 flex flex-wrap gap-2 items-center text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Beklenen Anahtar Noktalar:</span>
                  {currentQuestion.keyExpectations.map((exp, i) => (
                    <span key={i} className="text-slate-700 font-medium">
                      {i > 0 && '·'} {exp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Answer Input Area */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <span>Sizin Yanıtınız</span>
                    {speechSupported && (
                      <span className="text-[11px] font-normal text-slate-500 lowercase">
                        (yazabilir veya mikrofondan konuşabilirsiniz)
                      </span>
                    )}
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowStarGuide(!showStarGuide)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{showStarGuide ? 'STAR Rehberini Gizle' : 'STAR Rehberi'}</span>
                    </button>

                    {speechSupported && (
                      <button
                        type="button"
                        onClick={toggleListening}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          isListening
                            ? 'bg-rose-100 text-rose-700 animate-pulse border border-rose-300'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                        title="Mikrofon ile sesli yanıtla"
                      >
                        {isListening ? (
                          <>
                            <MicOff className="w-3.5 h-3.5" />
                            <span>Dinleniyor...</span>
                          </>
                        ) : (
                          <>
                            <Mic className="w-3.5 h-3.5" />
                            <span>Sesle Yaz</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Collapsible STAR Guide */}
                {showStarGuide && (
                  <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200 text-xs text-slate-700 space-y-1.5">
                    <div className="font-bold text-blue-900">STAR Metodolojisi ile Yanıtlama İpucu:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <strong className="text-blue-800">S (Situation / Durum):</strong> Olayın veya problemin geçtiği şirket ve proje ortamı.
                      </div>
                      <div>
                        <strong className="text-blue-800">T (Task / Görev):</strong> Sizin çözmeniz gereken spesifik teknik meydan okuma.
                      </div>
                      <div>
                        <strong className="text-blue-800">A (Action / Eylem):</strong> Kullandığınız araçlar, aldığınız mimari kararlar.
                      </div>
                      <div>
                        <strong className="text-blue-800">R (Result / Sonuç):</strong> Ölçülebilir metrikler (%25 hızlanma, maliyet düşüşü).
                      </div>
                    </div>
                  </div>
                )}

                <textarea
                  rows={6}
                  value={currentAnswer}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [currentQuestion.id]: e.target.value,
                    }))
                  }
                  placeholder={`Mülakatçının sorusuna vereceğiniz cevabı buraya yazın. Örneğin: "Daha önce çalıştığım şirkette benzer bir senaryoda..."`}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-normal text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all leading-relaxed"
                />

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span className="tabular-nums">
                    {currentAnswer.trim() ? currentAnswer.trim().split(/\s+/).length : 0} kelime ·{' '}
                    {currentAnswer.length} karakter
                  </span>

                  <button
                    onClick={handleEvaluateAnswer}
                    disabled={isEvaluating || !currentAnswer.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isEvaluating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Koç Analiz Ediyor...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Koçtan Değerlendirme Al</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Evaluation Results Card */}
              {currentEvaluation && (
                <div className="mt-6 pt-6 border-t border-slate-100 space-y-6">
                  {/* Score & Summary Banner */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Koçluk Değerlendirmesi
                        </span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="text-xs font-semibold text-blue-600">
                          {interviewerTitle} Perspektifi
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {currentEvaluation.summary}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs shrink-0">
                      <span className="text-2xl font-extrabold text-blue-700 tabular-nums">
                        {currentEvaluation.score}
                      </span>
                      <span className="text-xs text-slate-400 font-bold">/ 10</span>
                    </div>
                  </div>

                  {/* STAR Method Breakdown */}
                  <div>
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-3">
                      STAR Metodolojisi Analizi:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {[
                        { key: 'situation', label: 'Situation (Durum)', data: currentEvaluation.starCompliance.situation },
                        { key: 'task', label: 'Task (Görev)', data: currentEvaluation.starCompliance.task },
                        { key: 'action', label: 'Action (Eylem)', data: currentEvaluation.starCompliance.action },
                        { key: 'result', label: 'Result (Sonuç)', data: currentEvaluation.starCompliance.result },
                      ].map((item) => (
                        <div
                          key={item.key}
                          className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                            item.data.present
                              ? 'bg-emerald-50/50 border-emerald-200'
                              : 'bg-amber-50/50 border-amber-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">{item.label}</span>
                            {item.data.present ? (
                              <span className="text-[10px] font-semibold text-emerald-700">Mevcut</span>
                            ) : (
                              <span className="text-[10px] font-semibold text-amber-700">Geliştirilmeli</span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 leading-normal">
                            {item.data.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strengths & Improvements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-slate-200 bg-white">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 mb-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Güçlü Yönleriniz</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {currentEvaluation.strengths.map((str, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">·</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-white">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-700 mb-2.5">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span>{interviewerTitle} İçin Geliştirilmesi Gerekenler</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {currentEvaluation.improvements.map((imp, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-amber-500 font-bold">·</span>
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Model Answer */}
                  <div className="p-5 rounded-xl border border-indigo-100 bg-indigo-50/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
                        <Zap className="w-4 h-4 text-indigo-600" />
                        <span>{interviewerTitle} Unvanını Etkileyecek Örnek İdeal Cevap:</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(currentEvaluation.modelAnswer)}
                        className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 px-2 py-1 rounded-md bg-white border border-indigo-200 transition-colors"
                      >
                        {copiedAnswer ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Kopyalandı</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Kopyala</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-normal bg-white p-3.5 rounded-lg border border-indigo-100">
                      {currentEvaluation.modelAnswer}
                    </p>
                  </div>

                  {/* Next Step Navigation */}
                  <div className="flex justify-end pt-2">
                    {currentQuestionIndex < questions.length - 1 ? (
                      <button
                        onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                      >
                        <span>Sonraki Soruya Geç ({currentQuestionIndex + 2} / {questions.length})</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="text-xs text-emerald-700 font-bold flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Tüm soruları tamamladınız! Dilediğiniz soruyu yeniden cevaplayabilirsiniz.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
