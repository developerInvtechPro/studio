
'use server';

import { getSmartUpsellRecommendations, SmartUpsellInput } from '@/ai/flows/smart-upsell';
import { aiPoweredBudgetAndProfitabilityTracking, BudgetTrackingInput } from '@/ai/flows/ai-powered-budget-and-profitability-tracking';

export async function getUpsellAction(input: SmartUpsellInput) {
  try {
    const result = await getSmartUpsellRecommendations(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get recommendations.' };
  }
}

export async function getBudgetAction(input: BudgetTrackingInput) {
  try {
    const result = await aiPoweredBudgetAndProfitabilityTracking(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get budget insights.' };
  }
}
