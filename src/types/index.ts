export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export interface Risk {
  risk: string;
  impact: "High" | "Medium" | "Low";
  explanation: string;
  mitigationStrategy: string;
}

export interface CustomerSegment {
  segment: string;
  description: string;
  pain: string;
  willingnessToPay: "High" | "Medium" | "Low";
  acquisitionChannels: string[];
}

export interface MarketGap {
  gap: string;
  demandLevel: "High" | "Medium" | "Low";
  description: string;
  existingPoorSolution: string;
  source: string;
}

export interface IdeaAnalysis {
  ideaType: 'tech' | 'physical' | 'service';
  initialAssessment: string;
  requiredSkills: string[];
  mentors: Mentor[];
  startingStage: number;
  marketSnapshot?: string;
  risks?: Risk[];
  competitors?: { name: string, strength: string, weakness: string, pricePoint: string, source: string }[];
  marketGaps?: MarketGap[];
  marketSize?: { tam: string, sam: string, som: string, cagr: string };
  customerSegments?: CustomerSegment[];
  revenueModel?: { model: string, pricingStrategy: string, marginEstimate: string };
  gtmStrategy?: { strategy: string, tactics: string[] };
}

export interface Mentor {
  name: string;
  expertise: string;
  role: string;
  bio?: string;
  matchScore?: number;
}

export interface StageGate {
  id: number;
  name: string;
  description: string;
  requirements: string[];
  completed: boolean;
}

export interface ValidationReport {
  stage: number;
  stageName: string;
  ideaScore: number;
  confidence: number;
  gatingDecision: "proceed" | "iterate" | "pause";
  summary: string;
  keyAssumptions: string[];
  risks: string[];
  evidenceNeeded: string[];
  nextActions: ActionItem[];
}

export interface ActionItem {
  title: string;
  ownerRole: string;
  effort: "S" | "M" | "L";
  dueInDays: number;
}
