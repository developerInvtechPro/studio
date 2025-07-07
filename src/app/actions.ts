
'use server';

import type { SmartUpsellInput } from '@/ai/flows/smart-upsell';
import type { BudgetTrackingInput } from '@/ai/flows/ai-powered-budget-and-profitability-tracking';
import type { User, Category, Product, Table, Shift, Order, OrderItem } from '@/lib/types';
import { getDbConnection } from '@/lib/db';
import { getSmartUpsellRecommendations } from '@/ai/flows/smart-upsell';
import { aiPoweredBudgetAndProfitabilityTracking } from '@/ai/flows/ai-powered-budget-and-profitability-tracking';
import type { Database } from 'sqlite';

const TAX_RATE = 0.15; // ISV Honduras

// #region Helper Functions

async function getOrderFromDb(db: Database, orderId: number): Promise<Order | null> {
    const orderHeader = await db.get<Omit<Order, 'items'>>('SELECT * FROM orders WHERE id = ?', orderId);
    if (!orderHeader) return null;

    const orderItemsResult = await db.all<any[]>(
        `SELECT
            oi.id,
            oi.quantity,
            oi.price_at_time,
            p.id as productId,
            p.name,
            p.price,
            p.category_id as categoryId,
            p.image_url as imageUrl,
            p.image_hint as imageHint
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?`,
        orderId
    );

    const items: OrderItem[] = orderItemsResult.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price_at_time: item.price_at_time,
        product: {
            id: item.productId,
            name: item.name,
            price: item.price,
            categoryId: item.categoryId,
            imageUrl: item.imageUrl,
            imageHint: item.imageHint,
        }
    }));

    return { ...orderHeader, items };
}


async function recalculateOrderTotals(db: Database, orderId: number): Promise<void> {
  const order = await db.get<{ discount_percentage: number }>("SELECT discount_percentage FROM orders WHERE id = ?", orderId);
  const discountPercentage = order?.discount_percentage || 0;

  const result = await db.get<{ subtotal: number }>(
    'SELECT SUM(price_at_time * quantity) as subtotal FROM order_items WHERE order_id = ?',
    orderId
  );
  const subtotal = result?.subtotal || 0;
  const discountAmount = subtotal * (discountPercentage / 100);
  const taxableAmount = subtotal - discountAmount;
  const tax = taxableAmount * TAX_RATE;
  const total = taxableAmount + tax;

  await db.run(
    'UPDATE orders SET subtotal = ?, tax_amount = ?, total_amount = ?, discount_amount = ? WHERE id = ?',
    subtotal,
    tax,
    total,
    discountAmount,
    orderId
  );
}

// #endregion

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

export async function searchProductsAction(query: string): Promise<Product[]> {
    const db = await getDbConnection();
    if (!query) return [];
    // Using LOWER() for case-insensitive search
    return db.all<Product[]>(
        "SELECT id, name, price, category_id as categoryId, image_url as imageUrl, image_hint as imageHint FROM products WHERE LOWER(name) LIKE LOWER(?)",
        `%${query}%`
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

export async function getOpenOrderForTable(tableId: number): Promise<Order | null> {
    const db = await getDbConnection();
    const openOrderHeader = await db.get<Omit<Order, 'items'>>(
        "SELECT * FROM orders WHERE table_id = ? AND status = 'pending'",
        tableId
    );

    if (!openOrderHeader) {
        return null;
    }

    return getOrderFromDb(db, openOrderHeader.id);
}

export async function addItemToOrder(tableId: number, shiftId: number, productId: number): Promise<Order> {
    const db = await getDbConnection();
    await db.run('BEGIN TRANSACTION');

    try {
        let order = await db.get<Omit<Order, 'items'>>("SELECT * FROM orders WHERE table_id = ? AND status = 'pending'", tableId);
        
        if (!order) {
            const orderResult = await db.run(
                `INSERT INTO orders (shift_id, table_id, customer_name, subtotal, tax_amount, total_amount, status, created_at, discount_percentage, discount_amount)
                 VALUES (?, ?, ?, 0, 0, 0, 'pending', ?, 0, 0)`,
                shiftId, tableId, `Mesa ${tableId}`, new Date().toISOString()
            );
            const orderId = orderResult.lastID!;
            order = await db.get<Omit<Order, 'items'>>('SELECT * FROM orders WHERE id = ?', orderId);
            if (!order) {
              throw new Error("Failed to create and retrieve the new order.");
            }
            await db.run("UPDATE tables SET status = 'occupied' WHERE id = ?", tableId);
        }

        const existingItem = await db.get("SELECT * FROM order_items WHERE order_id = ? AND product_id = ?", order.id, productId);
        
        if (existingItem) {
            await db.run("UPDATE order_items SET quantity = quantity + 1 WHERE id = ?", existingItem.id);
        } else {
            const product = await db.get<Product>("SELECT price FROM products WHERE id = ?", productId);
            if (!product) {
                throw new Error("Product not found");
            }
            await db.run(
                "INSERT INTO order_items (order_id, product_id, quantity, price_at_time) VALUES (?, ?, 1, ?)",
                order.id, productId, product.price
            );
        }

        await recalculateOrderTotals(db, order.id);
        await db.run('COMMIT');

        const fullOrder = await getOrderFromDb(db, order.id);
        if (!fullOrder) throw new Error("Could not retrieve updated order.");
        return fullOrder;

    } catch (error) {
        await db.run('ROLLBACK');
        console.error("Failed to add item to order:", error);
        throw new Error("Could not add item to order.");
    }
}


export async function updateOrderItemQuantity(orderItemId: number, newQuantity: number): Promise<Order> {
    const db = await getDbConnection();
    const item = await db.get<{ order_id: number }>("SELECT order_id FROM order_items WHERE id = ?", orderItemId);
    if (!item) throw new Error("Item not found");

    if (newQuantity < 1) {
        await db.run("DELETE FROM order_items WHERE id = ?", orderItemId);
    } else {
        await db.run("UPDATE order_items SET quantity = ? WHERE id = ?", newQuantity, orderItemId);
    }
    
    await recalculateOrderTotals(db, item.order_id);
    const fullOrder = await getOrderFromDb(db, item.order_id);
    if (!fullOrder) throw new Error("Could not retrieve updated order.");
    return fullOrder;
}

export async function removeItemFromOrder(orderItemId: number): Promise<Order> {
    return updateOrderItemQuantity(orderItemId, 0);
}


export async function cancelOrder(orderId: number): Promise<void> {
    const db = await getDbConnection();
    await db.run('BEGIN TRANSACTION');
    try {
        const order = await db.get("SELECT table_id FROM orders WHERE id = ?", orderId);
        if (order && order.table_id) {
            await db.run("UPDATE tables SET status = 'available' WHERE id = ?", order.table_id);
        }
        await db.run("DELETE FROM order_items WHERE order_id = ?", orderId);
        await db.run("DELETE FROM orders WHERE id = ?", orderId);
        await db.run('COMMIT');
    } catch (error) {
        await db.run('ROLLBACK');
        console.error("Failed to cancel order:", error);
        throw new Error("Could not cancel order.");
    }
}


export async function finalizeOrder(orderId: number): Promise<{ success: boolean; orderId?: number; error?: string }> {
  const db = await getDbConnection();
  try {
    await db.run('BEGIN TRANSACTION');

    const order = await db.get("SELECT table_id FROM orders WHERE id = ?", orderId);

    // Mark order as completed
    await db.run("UPDATE orders SET status = 'completed' WHERE id = ?", orderId);

    // Free up the table
    if (order && order.table_id) {
        await db.run("UPDATE tables SET status = 'available' WHERE id = ?", order.table_id);
    }

    await db.run('COMMIT');

    return { success: true, orderId: orderId };
  } catch (error: any) {
    await db.run('ROLLBACK');
    console.error('Failed to finalize order:', error);
    return { success: false, error: 'No se pudo finalizar la orden.' };
  }
}

export async function applyDiscountAction(orderId: number, percentage: number): Promise<Order> {
    if (percentage < 0 || percentage > 100) {
        throw new Error("Discount percentage must be between 0 and 100.");
    }
    const db = await getDbConnection();
    await db.run('UPDATE orders SET discount_percentage = ? WHERE id = ?', percentage, orderId);
    await recalculateOrderTotals(db, orderId);
    
    const fullOrder = await getOrderFromDb(db, orderId);
    if (!fullOrder) throw new Error("Could not retrieve updated order.");
    return fullOrder;
}

export async function updateTableStatusAction(tableId: number, status: 'available' | 'occupied' | 'reserved'): Promise<{ success: boolean; error?: string }> {
    const db = await getDbConnection();
    try {
        await db.run("UPDATE tables SET status = ? WHERE id = ?", status, tableId);
        return { success: true };
    } catch (error: any) {
        console.error('Failed to update table status:', error);
        return { success: false, error: 'No se pudo actualizar el estado de la mesa.' };
    }
}

export async function transferOrderAction(orderId: number, oldTableId: number, newTableId: number): Promise<{ success: boolean; error?: string }> {
  const db = await getDbConnection();
  await db.run('BEGIN TRANSACTION');
  try {
    const newTable = await db.get<Table>("SELECT * FROM tables WHERE id = ?", newTableId);
    if (newTable?.status !== 'available') {
        await db.run('ROLLBACK');
        return { success: false, error: "La mesa de destino no está disponible." };
    }

    await db.run("UPDATE orders SET table_id = ?, customer_name = ? WHERE id = ?", newTableId, `Mesa ${newTableId}`, orderId);
    await db.run("UPDATE tables SET status = 'occupied' WHERE id = ?", newTableId);
    await db.run("UPDATE tables SET status = 'available' WHERE id = ?", oldTableId);
    
    await db.run('COMMIT');
    return { success: true };
  } catch (error: any) {
    await db.run('ROLLBACK');
    console.error("Failed to transfer order:", error);
    return { success: false, error: "No se pudo trasladar la orden." };
  }
}
