
'use server';

import { getSmartUpsellRecommendations, SmartUpsellInput } from '@/ai/flows/smart-upsell';
import { aiPoweredBudgetAndProfitabilityTracking, BudgetTrackingInput } from '@/ai/flows/ai-powered-budget-and-profitability-tracking';
import { validateUser } from '@/lib/users';
import type { User } from '@/lib/types';

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

export async function loginAction(credentials: {username: string, password: string}): Promise<{ success: boolean; user?: Omit<User, 'password'>; error?: string }> {
  try {
    const user = await validateUser(credentials.username, credentials.password);
    if (user) {
      return { success: true, user };
    }
    return { success: false, error: 'Credenciales inválidas.' };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Ocurrió un error en el servidor.' };
  }
}
