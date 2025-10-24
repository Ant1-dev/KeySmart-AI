import OpenAI from "openai";
import { UserProfile } from "../types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class OpenAIService {
  async generateChatResponse(
    message: string,
    userContext?: UserProfile,
    conversationHistory?: Array<{ role: string; content: string }>
  ): Promise<string> {
    const contextPrompt = userContext
      ? `User Context:
- Annual Income: $${userContext.annualIncome.toLocaleString()}
- Credit Score: ${userContext.creditScore}
- Monthly Debt: $${userContext.monthlyDebt.toLocaleString()}
- Down Payment Saved: $${userContext.downPaymentSaved.toLocaleString()}
- Location: ${userContext.location}
- First-time buyer: ${userContext.isFirstTime ? "Yes" : "No"}

`
      : "";

    const systemPrompt = `You are a helpful, empathetic mortgage advisor assistant for KeySmart AI, a platform helping first-time and minority homebuyers. Your role is to:

1. Explain mortgage concepts in simple, jargon-free language (8th grade reading level)
2. Be encouraging and supportive, never judgmental
3. Provide actionable advice based on the user's specific financial situation
4. Be honest about challenges but focus on solutions and next steps
5. Keep responses concise (2-4 paragraphs max, unless explaining complex topics)
6. Use emojis sparingly for warmth (1-2 per response maximum)
7. Never give specific financial advice or recommend specific lenders
8. Focus on credit building, down payment strategies, and budgeting when relevant
9. If asked about improving readiness, provide concrete steps with timelines
"10. Don't use markdown or special formatting (no bold, no italics). Use plain text only.\n" +
"11. When listing steps or tips, put each on a new line using hyphens or numbers.\n" +
"12. Keep paragraphs short and separated by blank lines for readability.\n"


${contextPrompt}

Answer the user's questions clearly, supportively, and with specific guidance when possible.`;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const messages: any[] = [{ role: "system", content: systemPrompt }];

      if (conversationHistory && conversationHistory.length > 0) {
        messages.push(...conversationHistory);
      }

      messages.push({ role: "user", content: message });

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages,
        max_tokens: 500,
        temperature: 0.7,
      });

      return (
        response.choices[0]?.message?.content ||
        "Sorry, I could not generate a response."
      );
    } catch (error) {
      console.error("OpenAI Error:", error);
      throw new Error("Failed to generate response");
    }
  }

  async explainLoanMatch(
    loanType: string,
    userProfile: UserProfile,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    matchedProgram: any
  ): Promise<string> {
    const prompt = `You are explaining to a first-time homebuyer why the ${loanType} loan is a good match for them.

User's Financial Profile:
- Credit Score: ${userProfile.creditScore}
- Annual Income: $${userProfile.annualIncome.toLocaleString()}
- Monthly Debt: $${userProfile.monthlyDebt.toLocaleString()}
- Down Payment Saved: $${userProfile.downPaymentSaved.toLocaleString()}
- First-time buyer: ${userProfile.isFirstTime ? "Yes" : "No"}
- Location: ${userProfile.location}

Loan Program Requirements:
- Minimum Credit Score: ${matchedProgram.minCreditScore}
- Down Payment Required: ${matchedProgram.minDownPaymentPercent}%
- Maximum DTI: ${matchedProgram.maxDTIPercent}%

Write a warm, encouraging explanation (3-4 paragraphs) covering:
1. Why their credit score qualifies them
2. How the down payment requirement matches their savings
3. What makes this loan program special for their situation
4. One specific next step they should take

Use simple language, be encouraging, and make it personal to THEIR numbers.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a supportive mortgage advisor helping first-time homebuyers understand their options.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 400,
        temperature: 0.7,
      });

      return (
        response.choices[0]?.message?.content ||
        "Unable to generate explanation."
      );
    } catch (error) {
      console.error("OpenAI Error:", error);
      throw new Error("Failed to generate explanation");
    }
  }

  async generateReadinessAnalysis(
    userProfile: UserProfile,
    readinessScore: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    matches: any[]
  ): Promise<{
    summary: string;
    immediateSteps: string[];
    shortTermSteps: string[];
    readyDate: string;
  }> {
    const dti =
      (userProfile.monthlyDebt / (userProfile.annualIncome / 12)) * 100;

    const prompt = `Analyze this first-time homebuyer's readiness and create a personalized action plan.

Profile:
- Readiness Score: ${readinessScore}%
- Credit Score: ${userProfile.creditScore}
- Annual Income: $${userProfile.annualIncome.toLocaleString()}
- DTI Ratio: ${dti.toFixed(1)}%
- Down Payment Saved: $${userProfile.downPaymentSaved.toLocaleString()}
- Qualified Loans: ${matches.length} programs

Create a JSON response with:
1. "summary": 2-sentence assessment of their readiness
2. "immediateSteps": Array of 2-3 actions for next 30 days
3. "shortTermSteps": Array of 2-3 actions for 1-3 months
4. "readyDate": Estimated month/year they'll be ready (e.g., "March 2026")

Be encouraging but realistic. Focus on credit building, saving, and education.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a homeownership coach. Respond ONLY with valid JSON.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content || "{}";
      return JSON.parse(content);
    } catch (error) {
      console.error("OpenAI Error:", error);
      // Fallback
      return {
        summary:
          "You're making great progress toward homeownership! With focused effort, you'll be ready soon.",
        immediateSteps: [
          "Get pre-qualified with an FHA-approved lender",
          "Review your credit report for errors at AnnualCreditReport.com",
        ],
        shortTermSteps: [
          "Continue saving for down payment consistently",
          "Complete a HUD-approved homebuyer education course",
        ],
        readyDate: "Spring 2026",
      };
    }
  }
}

export const openaiService = new OpenAIService();
