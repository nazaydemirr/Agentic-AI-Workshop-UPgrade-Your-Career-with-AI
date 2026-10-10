export interface InterviewerPersona {
  title: string;
  mindset: string;
  evaluationCriteria: string[];
  styleDescription: string;
  proTips: string[];
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: string;
  interviewerIntent: string;
  keyExpectations: string[];
}

export interface StarComplianceStep {
  present: boolean;
  comment: string;
}

export interface StarCompliance {
  situation: StarComplianceStep;
  task: StarComplianceStep;
  action: StarComplianceStep;
  result: StarComplianceStep;
}

export interface AnswerEvaluation {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  starCompliance: StarCompliance;
  modelAnswer: string;
}

export interface CompletedTraining {
  id: string;
  title: string;
  provider: string;
  contents: string;
}

export interface CompetencyAuditItem {
  skill: string;
  evidence?: string;
  gap?: string;
  importance?: string;
}

export interface CompetencyAudit {
  masteredSkills: CompetencyAuditItem[];
  partialSkills: CompetencyAuditItem[];
  criticalGaps: CompetencyAuditItem[];
}

export interface RoadmapStep {
  stepNumber: number;
  title: string;
  level: string;
  durationEstimate: string;
  coreTopics: string[];
  handsOnProject: {
    name: string;
    description: string;
    deliverable: string;
  };
  recommendedCourseTypes: string[];
}

export interface RoadmapAnalysis {
  analysisSummary: string;
  competencyAudit: CompetencyAudit;
  roadmapSteps: RoadmapStep[];
  interviewReadinessTips: string[];
}
