
'use server';

import type { SmartUpsellInput } from '@/ai/flows/smart-upsell';
import type { BudgetTrackingInput } from '@/ai/flows/ai-powered-budget-and-profitability-tracking';
import type { User, Category, Product, Table, Shift } from '@/lib/types';
import { getDbConnection } from '@/lib/db';
import { getSmartUpsellRecommendations } from '@/ai/flows/smart-upsell';
import { aiPoweredBudgetAndProfitabilityTracking } from '@/ai/flows/ai-powered-budget-and-profitability-tracking';

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
    const db = await getDbConnection();
    const user = await db.get<User>('SELECT id, username, password FROM users WHERE username = ?', credentials.username);

    if (user && user.password === credentials.password) {
      const { password: _, ...userWithoutPassword } = user;
      return { success: true, user: userWithoutPassword };
    }
    
    return { success: false, error: 'Credenciales inválidas.' };

  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Ocurrió un error en el servidor.' };
  }
}

export async function getCategoriesAction(): Promise<Category[]> {
    const db = await getDbConnection();
    return db.all<Category[]>("SELECT id, name, icon_name as iconName FROM categories ORDER BY id");
}

export async function getProductsByCategoryAction(categoryId: number): Promise<Product[]> {
    const db = await getDbConnection();
    return db.all<Product[]>(
        "SELECT id, name, price, category_id as categoryId, image_url as imageUrl, image_hint as imageHint FROM products WHERE category_id = ?",
        categoryId
    );
}

export async function getTablesAction(): Promise<Table[]> {
    const db = await getDbConnection();
    return db.all<Table[]>("SELECT id, name, status FROM tables ORDER BY id");
}


export async function getActiveShiftAction(userId: number): Promise<Shift | null> {
    const db = await getDbConnection();
    const shift = await db.get<Shift>(
        "SELECT id, user_id as userId, start_time as startTime, starting_cash as startingCash, is_active as isActive FROM shifts WHERE user_id = ? AND is_active = 1",
        userId
    );
    return shift || null;
}

export async function startShiftAction(userId: number, startingCash: number): Promise<Shift> {
    const db = await getDbConnection();
    const now = new Date().toISOString();
    
    // Deactivate any other active shifts for this user just in case
    await db.run("UPDATE shifts SET is_active = 0 WHERE user_id = ? AND is_active = 1", userId);

    const result = await db.run(
        "INSERT INTO shifts (user_id, start_time, starting_cash, is_active) VALUES (?, ?, ?, 1)",
        userId, now, startingCash
    );

    const newShift: Shift = {
        id: result.lastID!,
        userId,
        startTime: now,
        startingCash,
        isActive: true,
    };
    return newShift;
}

export async function endShiftAction(shiftId: number): Promise<void> {
    const db = await getDbConnection();
    await db.run(
        "UPDATE shifts SET is_active = 0, end_time = ? WHERE id = ?",
        new Date().toISOString(), shiftId
    );
}
