// This is a server-side file.
'use server';

/**
 * @fileOverview Provides daily profitability insights based on sales, costs, and other factors.
 *
 * - getDailyProfitabilityInsights - A function that retrieves daily profitability insights.
 * - DailyProfitabilityInsightsInput - The input type for the getDailyProfitabilityInsights function.
 * - DailyProfitabilityInsightsOutput - The return type for the getDailyProfitabilityInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DailyProfitabilityInsightsInputSchema = z.object({
  date: z.string().describe('The date for which to retrieve profitability insights (YYYY-MM-DD).'),
  totalSales: z.number().describe('The total sales amount for the day.'),
  totalCosts: z.number().describe('The total costs for the day, including cost of goods sold, labor, and operational expenses.'),
  otherFactors: z.string().describe('Any other factors that may impact profitability, such as discounts, promotions, or unexpected expenses.'),
  profitTarget: z.number().describe('The profit target for the day.'),
});
export type DailyProfitabilityInsightsInput = z.infer<typeof DailyProfitabilityInsightsInputSchema>;

const DailyProfitabilityInsightsOutputSchema = z.object({
  profit: z.number().describe('The profit for the day (totalSales - totalCosts).'),
  profitMargin: z.number().describe('The profit margin for the day (profit / totalSales).'),
  progressTowardsTarget: z.number().describe('The progress towards the profit target, as a percentage.'),
  insights: z.string().describe('A summary of the day\'s profitability, including factors that contributed to success or challenges, and recommendations for improvement.'),
});
export type DailyProfitabilityInsightsOutput = z.infer<typeof DailyProfitabilityInsightsOutputSchema>;

export async function getDailyProfitabilityInsights(input: DailyProfitabilityInsightsInput): Promise<DailyProfitabilityInsightsOutput> {
  return dailyProfitabilityInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dailyProfitabilityInsightsPrompt',
  input: {schema: DailyProfitabilityInsightsInputSchema},
  output: {schema: DailyProfitabilityInsightsOutputSchema},
  prompt: `You are an expert business analyst providing daily profitability insights for a cafe.

  Analyze the following data for {{date}}:

  Total Sales: ${{totalSales}}
  Total Costs: ${{totalCosts}}
  Other Factors: {{otherFactors}}
  Profit Target: ${{profitTarget}}

  Calculate the profit, profit margin, and progress towards the profit target.

  Provide a summary of the day's profitability, including factors that contributed to success or challenges.
  Offer recommendations for improvement to achieve the profit target.

  Ensure the output is accurate and insightful to help the owner make informed decisions.

  Here is the output schema that you must adhere to strictly. Adhere to the number of decimal points specified in the description.
  ${DailyProfitabilityInsightsOutputSchema.description}`,
});

const dailyProfitabilityInsightsFlow = ai.defineFlow(
  {
    name: 'dailyProfitabilityInsightsFlow',
    inputSchema: DailyProfitabilityInsightsInputSchema,
    outputSchema: DailyProfitabilityInsightsOutputSchema,
  },
  async input => {
    const profit = input.totalSales - input.totalCosts;
    const profitMargin = input.totalSales > 0 ? profit / input.totalSales : 0;
    const progressTowardsTarget = input.profitTarget > 0 ? Math.min(1, profit / input.profitTarget) : 0;

    const {output} = await prompt({
      ...input,
      profit,
      profitMargin,
      progressTowardsTarget,
    });
    return output!;
  }
);
