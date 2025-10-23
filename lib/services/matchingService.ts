// lib/services/matchingService.ts
import { UserProfile, LoanProgram, LoanMatch, MatchResult } from "../types";
import loanProgramsData from "../data/loan-programs.json";

export class MatchingService {
  private programs: LoanProgram[] = loanProgramsData.programs as LoanProgram[];

  calculateDTI(annualIncome: number, monthlyDebt: number): number {
    const monthlyIncome = annualIncome / 12;
    return (monthlyDebt / monthlyIncome) * 100;
  }

  calculateAffordableRange(
    annualIncome: number,
    monthlyDebt: number,
    downPayment: number,
    interestRate: number = 6.8
  ): { min: number; max: number } {
    const monthlyIncome = annualIncome / 12;
    const maxMonthlyPayment = monthlyIncome * 0.28; // 28% front-end ratio
    const paymentAfterDebt = maxMonthlyPayment - monthlyDebt * 0.3; // Conservative

    // Rough calculation: P&I only (not including taxes, insurance)
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = 360; // 30 years

    const loanAmount =
      (paymentAfterDebt * (Math.pow(1 + monthlyRate, numPayments) - 1)) /
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments));

    const maxPrice = loanAmount + downPayment;
    const minPrice = maxPrice * 0.7; // 70% of max

    return {
      min: Math.round(minPrice / 1000) * 1000,
      max: Math.round(maxPrice / 1000) * 1000,
    };
  }

  matchPrograms(profile: UserProfile): LoanMatch[] {
    const dti = this.calculateDTI(profile.annualIncome, profile.monthlyDebt);
    const matches: LoanMatch[] = [];

    for (const program of this.programs) {
      // Check eligibility
      if (profile.creditScore < program.minCreditScore) continue;
      if (dti > program.maxDTIPercent) continue;
      if (program.requiresFirstTime && !profile.isFirstTime) continue;
      // Skip VA if not military (we'd need to ask this)
      if (program.requiresMilitaryService) continue;

      // Calculate match score (0-100)
      let matchScore = 70; // Base score

      // Better credit = higher score
      if (profile.creditScore >= program.minCreditScore + 50) matchScore += 10;
      if (profile.creditScore >= program.minCreditScore + 100) matchScore += 10;

      // Lower DTI = higher score
      if (dti < 30) matchScore += 10;

      // Adequate down payment
      const affordableRange = this.calculateAffordableRange(
        profile.annualIncome,
        profile.monthlyDebt,
        profile.downPaymentSaved
      );
      const requiredDownPayment =
        affordableRange.max * (program.minDownPaymentPercent / 100);

      if (profile.downPaymentSaved >= requiredDownPayment) matchScore += 10;

      // First-time buyer bonus for FHA
      if (profile.isFirstTime && program.id === "fha") matchScore += 5;

      const estimatedDownPayment = Math.round(
        affordableRange.max * (program.minDownPaymentPercent / 100)
      );

      const estimatedMonthlyPayment = Math.round(
        (affordableRange.max - estimatedDownPayment) * 0.0065 // Rough estimate
      );

      const whyMatched: string[] = [];
      if (profile.creditScore >= program.minCreditScore) {
        whyMatched.push(
          `Your credit score (${profile.creditScore}) meets the requirement`
        );
      }
      if (dti <= program.maxDTIPercent) {
        whyMatched.push(
          `Your debt-to-income ratio (${dti.toFixed(1)}%) is excellent`
        );
      }
      if (profile.downPaymentSaved >= estimatedDownPayment) {
        whyMatched.push(`You have enough saved for the down payment`);
      }

      matches.push({
        program,
        matchScore,
        estimatedDownPayment,
        estimatedMonthlyPayment,
        affordableRange,
        whyMatched,
      });
    }

    // Sort by match score
    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  calculateReadinessScore(profile: UserProfile, matches: LoanMatch[]): number {
    let score = 0;

    // Credit score (0-35 points)
    if (profile.creditScore >= 740) score += 35;
    else if (profile.creditScore >= 680) score += 30;
    else if (profile.creditScore >= 620) score += 25;
    else if (profile.creditScore >= 580) score += 15;
    else score += 5;

    // DTI (0-25 points)
    const dti = this.calculateDTI(profile.annualIncome, profile.monthlyDebt);
    if (dti <= 30) score += 25;
    else if (dti <= 36) score += 20;
    else if (dti <= 43) score += 15;
    else score += 5;

    // Down payment (0-20 points)
    const hasMatches = matches.length > 0;
    if (hasMatches && matches[0]) {
      const needed = matches[0].estimatedDownPayment;
      if (profile.downPaymentSaved >= needed) score += 20;
      else if (profile.downPaymentSaved >= needed * 0.75) score += 15;
      else if (profile.downPaymentSaved >= needed * 0.5) score += 10;
      else score += 5;
    }

    // Has qualifying programs (0-20 points)
    if (matches.length >= 3) score += 20;
    else if (matches.length >= 2) score += 15;
    else if (matches.length >= 1) score += 10;

    return Math.min(score, 100);
  }

  async generateMatchResult(profile: UserProfile): Promise<MatchResult> {
    const matches = this.matchPrograms(profile);
    const dtiRatio = this.calculateDTI(
      profile.annualIncome,
      profile.monthlyDebt
    );
    const readinessScore = this.calculateReadinessScore(profile, matches);

    // Mock rates (we'll replace with API call later)
    const currentRates = {
      fixed30: 6.8,
      fixed15: 6.1,
      arm51: 6.3,
    };

    return {
      dtiRatio: Math.round(dtiRatio * 10) / 10,
      readinessScore,
      matches: matches.slice(0, 3), // Top 3 matches
      currentRates,
    };
  }
}

export const matchingService = new MatchingService();
