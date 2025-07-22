
export type UrgencyLevel = 'Self-Care' | 'Consult a Doctor' | 'Urgent Care' | 'Emergency';
export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface PotentialCondition {
  name: string;
  description: string;
  severity: SeverityLevel;
}

export interface Recommendation {
  urgency: UrgencyLevel;
  advice: string;
}

export interface HealthAnalysis {
  symptomSummary: string;
  potentialConditions: PotentialCondition[];
  recommendation: Recommendation;
  disclaimer: string;
}

export interface AnalysisRecord {
  id: string;
  timestamp: string; // ISO String
  originalSymptoms: string;
  analysis: HealthAnalysis;
}
