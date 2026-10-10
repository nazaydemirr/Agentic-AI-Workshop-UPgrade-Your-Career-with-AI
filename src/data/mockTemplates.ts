import { CompletedTraining } from '../types';

export interface TitlePreset {
  id: string;
  title: string;
  department: string;
  badge: string;
  description: string;
  avatarColor: string;
}

export const INTERVIEWER_TITLE_PRESETS: TitlePreset[] = [
  {
    id: 'em',
    title: 'Engineering Manager',
    department: 'Mühendislik Yönetimi',
    badge: 'EM',
    description: 'Takım dinamikleri, liderlik, proje teslimatı ve teknik borç yönetimi odağı.',
    avatarColor: 'from-blue-600 to-indigo-700',
  },
  {
    id: 'tech-lead',
    title: 'Tech Lead / Staff Engineer',
    department: 'Teknik Mimari',
    badge: 'TL',
    description: 'Kod kalitesi, ölçeklenebilirlik, sistem mimarisi ve trade-off derinliği.',
    avatarColor: 'from-violet-600 to-purple-800',
  },
  {
    id: 'vp-cto',
    title: 'VP of Engineering / CTO',
    department: 'Üst Düzey Yönetim',
    badge: 'C-Level',
    description: 'İş etkisi, teknoloji vizyonu, maliyet etkinliği ve organizasyonel büyüme.',
    avatarColor: 'from-amber-600 to-orange-700',
  },
  {
    id: 'hr-talent',
    title: 'Talent Acquisition Director (İK)',
    department: 'İnsan Kaynakları',
    badge: 'İK',
    description: 'Kültür uyumu, iletişim olgunluğu, çatışma yönetimi ve STAR örnekleri.',
    avatarColor: 'from-emerald-600 to-teal-800',
  },
  {
    id: 'data-lead',
    title: 'Lead Data Scientist / AI Architect',
    department: 'Veri & Yapay Zeka',
    badge: 'AI Lead',
    description: 'Model validasyonu, veri boru hatları, MLOps ve iş değeri yaratan yapay zeka.',
    avatarColor: 'from-cyan-600 to-blue-800',
  },
];

export const TARGET_ROLE_PRESETS = [
  'Senior Backend Developer (Go / Node / Python)',
  'Machine Learning & AI Engineer',
  'Senior Frontend / Fullstack Developer',
  'Lead Data Engineer',
  'DevOps & Cloud Platform Engineer',
];

export const SAMPLE_COMPLETED_TRAININGS: CompletedTraining[] = [
  {
    id: 'sample-1',
    title: 'Kapsamlı Python ve Veri Bilimi Uzmanlığı',
    provider: 'Coursera & DeepLearning.AI',
    contents: 'Python ile nesne yönelimli programlama, Pandas ve NumPy ile veri manipülasyonu, Matplotlib/Seaborn ile görselleştirme, Temel Scikit-Learn modelleri (Regresyon, Karar Ağaçları, Random Forest) ve Hiperparametre optimizasyonu.',
  },
  {
    id: 'sample-2',
    title: 'FastAPI ve Dağıtık Arka Yüz Mimarileri',
    provider: 'Udemy / Tech Academy',
    contents: 'Asenkron Python (async/await), FastAPI ile RESTful mikroservisler geliştirme, Pydantic ile veri doğrulama, PostgreSQL ve SQLAlchemy ORM kullanımı, Dockerfile oluşturma ve konteynerize mikroservis mimarisi.',
  },
  {
    id: 'sample-3',
    title: 'Derin Öğrenme ve PyTorch ile Doğal Dil İşleme',
    provider: 'DataCamp & HuggingFace',
    contents: 'Sinir ağları temelleri, PyTorch ile Tensör operasyonları, CNN ve RNN mimarileri, HuggingFace Transformers kütüphanesi ile BERT/RoBERTa modellerinin ince ayarı (Fine-tuning) ve metin sınıflandırma uygulamaları.',
  },
];
