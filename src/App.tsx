import React, { useState } from 'react';
import { Header } from './components/Header';
import { InterviewCoachView } from './components/InterviewCoachView';
import { LearningRoadmapView } from './components/LearningRoadmapView';
import { TipsGuideModal } from './components/TipsGuideModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'interview' | 'roadmap' | 'tips'>('interview');
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onReset={handleReset}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div key={resetKey}>
          {activeTab === 'interview' && <InterviewCoachView />}
          {activeTab === 'roadmap' && <LearningRoadmapView />}
          {activeTab === 'tips' && (
            <TipsGuideModal
              onGoToInterview={() => setActiveTab('interview')}
              onGoToRoadmap={() => setActiveTab('roadmap')}
            />
          )}
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-700">Kariyer & Mülakat Koçu</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>Yazılım, Veri Bilimi ve Yapay Zeka Kariyer Hazırlık Platformu</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <span>STAR Metodolojisi</span>
            <span aria-hidden="true">·</span>
            <span>Unvan Bazlı Mülakat Simülasyonu</span>
            <span aria-hidden="true">·</span>
            <span>Beceri Açığı Analizi</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
