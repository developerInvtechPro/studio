'use server';

/**
 * @fileOverview AI-powered budget and profitability tracking flow.
 *
 * - aiPoweredBudgetAndProfitabilityTracking - A function that provides budget reminders and sales recommendations.
 * - BudgetTrackingInput - The input type for the aiPoweredBudgetAndProfitabilityTracking function.
 * - BudgetTrackingOutput - The return type for the aiPoweredBudgetAndProfitabilityTracking function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BudgetTrackingInputSchema = z.object({
  cashierId: z.string().describe('The ID of the cashier.'),
  dailySales: z.number().describe('The current daily sales amount for the cashier.'),
  dailyBudget: z.number().describe('The daily sales budget for the cashier.'),
  timeOfDay: z.string().describe('The current time of day (e.g., morning, afternoon, evening).'),
  previousRecommendations: z.string().optional().describe('Previous AI recommendations, if any.'),
});
export type BudgetTrackingInput = z.infer<typeof BudgetTrackingInputSchema>;

const BudgetTrackingOutputSchema = z.object({
  reminder: z.string().describe('A reminder message indicating progress towards the budget.'),
  recommendation: z.string().describe('An AI-powered recommendation to help achieve the budget.'),
});
export type BudgetTrackingOutput = z.infer<typeof BudgetTrackingOutputSchema>;

export async function aiPoweredBudgetAndProfitabilityTracking(
  input: BudgetTrackingInput
): Promise<BudgetTrackingOutput> {
  return aiPoweredBudgetAndProfitabilityTrackingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'budgetTrackingPrompt',
  input: {schema: BudgetTrackingInputSchema},
  output: {schema: BudgetTrackingOutputSchema},
  prompt: `You are an AI assistant helping cashiers achieve their daily sales budget.

  Cashier ID: {{{cashierId}}}
  Current Daily Sales: {{{dailySales}}}
  Daily Budget: {{{dailyBudget}}}
  Time of Day: {{{timeOfDay}}}
  Previous Recommendations: {{{previousRecommendations}}}

  Provide a concise reminder of their progress towards the budget and a single, actionable recommendation to increase sales.
  The recommendation should be tailored to the time of day and the cashier's current sales performance.
  Focus on up-selling, cross-selling, or promotional offers.

  Reminder:
  Recommendation: `,
});

const aiPoweredBudgetAndProfitabilityTrackingFlow = ai.defineFlow(
  {
    name: 'aiPoweredBudgetAndProfitabilityTrackingFlow',
    inputSchema: BudgetTrackingInputSchema,
    outputSchema: BudgetTrackingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
