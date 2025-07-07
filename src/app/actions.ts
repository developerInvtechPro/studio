
'use server';

import type { SmartUpsellInput } from '@/ai/flows/smart-upsell';
import type { BudgetTrackingInput } from '@/ai/flows/ai-powered-budget-and-profitability-tracking';
import type { User, Category, Product, Table, Shift, OrderItem } from '@/lib/types';
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

export interface CreateOrderInput {
    shiftId: number;
    tableId: number | null;
    items: OrderItem[];
    subtotal: number;
    tax: number;
    total: number;
    customerName: string;
}

export async function createOrderAction(input: CreateOrderInput): Promise<{ success: boolean; orderId?: number; error?: string }> {
  const db = await getDbConnection();
  try {
    await db.run('BEGIN TRANSACTION');

    const orderResult = await db.run(
        `INSERT INTO orders (shift_id, table_id, customer_name, subtotal, tax_amount, total_amount, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, 'completed', ?)`,
        input.shiftId,
        input.tableId,
        input.customerName,
        input.subtotal,
        input.tax,
        input.total,
        new Date().toISOString()
    );

    const orderId = orderResult.lastID;
    if (!orderId) {
        throw new Error("Failed to create order.");
    }
    
    const itemStmt = await db.prepare(
        'INSERT INTO order_items (order_id, product_id, quantity, price_at_time) VALUES (?, ?, ?, ?)'
    );

    for (const item of input.items) {
        await itemStmt.run(orderId, item.product.id, item.quantity, item.product.price);
    }
    await itemStmt.finalize();

    if (input.tableId) {
        await db.run("UPDATE tables SET status = 'occupied' WHERE id = ?", input.tableId);
    }

    await db.run('COMMIT');

    return { success: true, orderId: orderId };
  } catch (error: any) {
    await db.run('ROLLBACK');
    console.error('Failed to create order:', error);
    return { success: false, error: 'No se pudo crear la orden.' };
  }
}
