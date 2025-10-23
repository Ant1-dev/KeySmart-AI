
export interface UserProfile {
  annualIncome: number;
  creditScore: number;
  monthlyDebt: number;
  downPaymentSaved: number;
  location: string;
  zipCode?: string;
  isFirstTime: boolean;
}

export interface LoanProgram {
  id: string;
  name: string;
  type: 'FHA' | 'VA' | 'USDA' | 'Conventional';
  minCreditScore: number;
  minDownPaymentPercent: number;
  maxDTIPercent: number;
  benefits: string[];
  description: string;
  requiresFirstTime?: boolean;
  requiresMilitaryService?: boolean;
}

export interface LoanMatch {
  program: LoanProgram;
  matchScore: number;
  estimatedDownPayment: number;
  estimatedMonthlyPayment: number;
  affordableRange: {
    min: number;
    max: number;
  };
  whyMatched: string[];
}

export interface MatchResult {
  dtiRatio: number;
  readinessScore: number;
  matches: LoanMatch[];
  currentRates: {
    fixed30: number;
    fixed15: number;
    arm51: number;
  };
}

export interface Counselor {
  id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  phone: string;
  website?: string;
  email?: string;
  services: string[];
  languages: string[];
  distance?: number;
}