// use server'
'use server';

/**
 * @fileOverview AI agent for providing smart up-sell and cross-sell recommendations based on the current order.
 *
 * - getSmartUpsellRecommendations - A function that handles the up-sell and cross-sell recommendation process.
 * - SmartUpsellInput - The input type for the getSmartUpsellRecommendations function.
 * - SmartUpsellOutput - The return type for the getSmartUpsellRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartUpsellInputSchema = z.object({
  orderItems: z
    .array(
      z.object({
        name: z.string().describe('The name of the item in the order.'),
        category: z.string().describe('The category of the item.'),
        price: z.number().describe('The price of the item.'),
      })
    )
    .describe('The list of items currently in the order.'),
});
export type SmartUpsellInput = z.infer<typeof SmartUpsellInputSchema>;

const SmartUpsellOutputSchema = z.object({
  recommendations: z
    .array(
      z.object({
        name: z.string().describe('The name of the recommended item.'),
        description: z.string().describe('A short description of the recommended item.'),
        reason: z.string().describe('The reason for recommending this item based on the current order.'),
      })
    )
    .describe('A list of up-sell and cross-sell recommendations.'),
});
export type SmartUpsellOutput = z.infer<typeof SmartUpsellOutputSchema>;

export async function getSmartUpsellRecommendations(input: SmartUpsellInput): Promise<SmartUpsellOutput> {
  return smartUpsellFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartUpsellPrompt',
  input: {schema: SmartUpsellInputSchema},
  output: {schema: SmartUpsellOutputSchema},
  prompt: `You are a point-of-sale (POS) assistant that provides smart up-sell and cross-sell recommendations to cashiers based on the current order.

  Analyze the current order items and suggest additional items that the customer might be interested in, in order to increase sales and customer satisfaction.

  Consider the category and price of the items when making recommendations. Give a specific reason for each recommendation based on the current order.

Current Order Items:
{{#each orderItems}}
- Name: {{name}}, Category: {{category}}, Price: {{price}}
{{/each}}

Format your output as a JSON object that matches the following schema: SmartUpsellOutputSchema.
`,
});

const smartUpsellFlow = ai.defineFlow(
  {
    name: 'smartUpsellFlow',
    inputSchema: SmartUpsellInputSchema,
    outputSchema: SmartUpsellOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
