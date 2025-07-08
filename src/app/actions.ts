
'use server';

import type { SmartUpsellInput } from '@/ai/flows/smart-upsell';
import type { BudgetTrackingInput } from '@/ai/flows/ai-powered-budget-and-profitability-tracking';
import type { User, Category, Product, Table, Shift, Order, OrderItem, Customer, PaymentMethod, CompletedOrderInfo, CompanyInfo, Supplier } from '@/lib/types';
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
            p.image_hint as imageHint,
            p.unit_of_measure_sale as unitOfMeasureSale,
            p.unit_of_measure_purchase as unitOfMeasurePurchase,
            p.is_active as isActive,
            p.tax_rate as taxRate
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
            unitOfMeasureSale: item.unitOfMeasureSale,
            unitOfMeasurePurchase: item.unitOfMeasurePurchase,
            isActive: !!item.isActive,
            taxRate: item.taxRate,
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
    subtotal.toFixed(2),
    tax.toFixed(2),
    total.toFixed(2),
    discountAmount.toFixed(2),
    orderId
  );
}

// #endregion

// #region AI Actions
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
// #endregion

// #region Auth & Shift Actions
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

export async function getActiveShiftAction(userId: number): Promise<Shift | null> {
    try {
        const db = await getDbConnection();
        const shift = await db.get<Shift>(
            "SELECT id, user_id as userId, start_time as startTime, starting_cash as startingCash, is_active as isActive FROM shifts WHERE user_id = ? AND is_active = 1",
            userId
        );
        return shift || null;
    } catch (error) {
        console.error("Failed to get active shift:", error);
        return null;
    }
}

export async function startShiftAction(userId: number, startingCash: number): Promise<Shift> {
    try {
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
    } catch (error) {
        console.error("Failed to start shift:", error);
        throw new Error("Could not start shift.");
    }
}

export async function endShiftAction(shiftId: number): Promise<void> {
    try {
        const db = await getDbConnection();
        await db.run(
            "UPDATE shifts SET is_active = 0, end_time = ? WHERE id = ?",
            new Date().toISOString(), shiftId
        );
    } catch (error) {
        console.error("Failed to end shift:", error);
        throw new Error("Could not end shift.");
    }
}
// #endregion

// #region Product & Category Actions
export async function getCategoriesAction(): Promise<Category[]> {
    try {
        const db = await getDbConnection();
        return db.all<Category[]>("SELECT id, name, icon_name as iconName FROM categories ORDER BY id");
    } catch (error) {
        console.error("Failed to get categories:", error);
        return [];
    }
}

export async function getProductsByCategoryAction(categoryId: number): Promise<Product[]> {
    try {
        const db = await getDbConnection();
        const rows = await db.all<any[]>(
            `SELECT id, name, price, category_id as categoryId, image_url as imageUrl, image_hint as imageHint,
            unit_of_measure_sale as unitOfMeasureSale, unit_of_measure_purchase as unitOfMeasurePurchase,
            is_active as isActive, tax_rate as taxRate
            FROM products WHERE category_id = ? AND is_active = 1`,
            categoryId
        );
        return rows.map(p => ({ ...p, isActive: !!p.isActive }));
    } catch (error) {
        console.error("Failed to get products by category:", error);
        return [];
    }
}

export async function searchProductsAction(query: string): Promise<Product[]> {
    try {
        const db = await getDbConnection();
        if (!query) return [];
        const rows = await db.all<any[]>(
            `SELECT id, name, price, category_id as categoryId, image_url as imageUrl, image_hint as imageHint,
            unit_of_measure_sale as unitOfMeasureSale, unit_of_measure_purchase as unitOfMeasurePurchase,
            is_active as isActive, tax_rate as taxRate
            FROM products WHERE LOWER(name) LIKE LOWER(?) AND is_active = 1`,
            `%${query}%`
        );
        return rows.map(p => ({ ...p, isActive: !!p.isActive }));
    } catch (error) {
        console.error("Failed to search products:", error);
        return [];
    }
}
// #endregion

// #region Table Actions
export async function getTablesAction(): Promise<Table[]> {
    try {
        const db = await getDbConnection();
        return db.all<Table[]>("SELECT id, name, status FROM tables ORDER BY id");
    } catch (error) {
        console.error("Failed to get tables:", error);
        return [];
    }
}

export async function updateTableStatusAction(tableId: number, status: 'available' | 'occupied' | 'reserved'): Promise<{ success: boolean; error?: string }> {
    try {
        const db = await getDbConnection();
        await db.run("UPDATE tables SET status = ? WHERE id = ?", status, tableId);
        return { success: true };
    } catch (error: any) {
        console.error('Failed to update table status:', error);
        return { success: false, error: 'No se pudo actualizar el estado de la mesa.' };
    }
}
// #endregion

// #region Order Actions
export async function getOpenOrderForTable(tableId: number): Promise<Order | null> {
    try {
        const db = await getDbConnection();
        const openOrderHeader = await db.get<Omit<Order, 'items'>>(
            "SELECT * FROM orders WHERE table_id = ? AND status = 'pending'",
            tableId
        );

        if (!openOrderHeader) {
            return null;
        }

        return getOrderFromDb(db, openOrderHeader.id);
    } catch (error) {
        console.error("Failed to get open order for table:", error);
        return null;
    }
}

export async function getOpenBarOrder(shiftId: number): Promise<Order | null> {
    try {
        const db = await getDbConnection();
        const openOrderHeader = await db.get<Omit<Order, 'items'>>(
            "SELECT * FROM orders WHERE shift_id = ? AND status = 'pending' AND table_id IS NULL",
            shiftId
        );

        if (!openOrderHeader) {
            return null;
        }

        return getOrderFromDb(db, openOrderHeader.id);
    } catch (error) {
        console.error("Failed to get open bar order:", error);
        return null;
    }
}

export async function addItemToOrder(tableId: number, shiftId: number, productId: number): Promise<{ success: boolean; data?: Order; error?: string }> {
    try {
        const db = await getDbConnection();
        await db.run('BEGIN TRANSACTION');

        try {
            let order = await db.get<Omit<Order, 'items'>>("SELECT * FROM orders WHERE table_id = ? AND status = 'pending'", tableId);
            
            if (!order) {
                const orderResult = await db.run(
                    `INSERT INTO orders (shift_id, table_id, customer_name, subtotal, tax_amount, total_amount, status, created_at, discount_percentage, discount_amount, order_type)
                     VALUES (?, ?, ?, 0, 0, 0, 'pending', ?, 0, 0, 'dine-in')`,
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
            return { success: true, data: fullOrder };

        } catch (innerError: any) {
            await db.run('ROLLBACK');
            throw innerError; // Re-throw to be caught by the outer catch
        }
    } catch (error: any) {
        console.error("Failed to add item to order:", error);
        return { success: false, error: error.message || "Could not add item to order." };
    }
}

export async function addItemToBarOrder(shiftId: number, productId: number): Promise<{ success: boolean; data?: Order; error?: string }> {
    try {
        const db = await getDbConnection();
        await db.run('BEGIN TRANSACTION');

        try {
            let order = await db.get<Omit<Order, 'items'>>("SELECT * FROM orders WHERE shift_id = ? AND status = 'pending' AND table_id IS NULL", shiftId);
            
            if (!order) {
                const orderResult = await db.run(
                    `INSERT INTO orders (shift_id, table_id, customer_id, customer_name, subtotal, tax_amount, total_amount, status, created_at, discount_percentage, discount_amount, order_type)
                     VALUES (?, NULL, NULL, ?, 0, 0, 0, 'pending', ?, 0, 0, 'take-away')`,
                    shiftId, `Para Llevar`, new Date().toISOString()
                );
                const orderId = orderResult.lastID!;
                order = await db.get<Omit<Order, 'items'>>('SELECT * FROM orders WHERE id = ?', orderId);
                if (!order) {
                  throw new Error("Failed to create and retrieve the new bar order.");
                }
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
            return { success: true, data: fullOrder };

        } catch (innerError: any) {
            await db.run('ROLLBACK');
            throw innerError;
        }
    } catch (error: any) {
        console.error("Failed to add item to bar order:", error);
        return { success: false, error: error.message || "Could not add item to bar order." };
    }
}

export async function updateOrderItemQuantity(orderItemId: number, newQuantity: number): Promise<{ success: boolean; data?: Order; error?: string }> {
    try {
        const db = await getDbConnection();
        await db.run('BEGIN TRANSACTION');
        try {
            const item = await db.get<{ order_id: number }>("SELECT order_id FROM order_items WHERE id = ?", orderItemId);
            if (!item) throw new Error("Item no encontrado.");

            if (newQuantity < 1) {
                await db.run("DELETE FROM order_items WHERE id = ?", orderItemId);
            } else {
                await db.run("UPDATE order_items SET quantity = ? WHERE id = ?", newQuantity, orderItemId);
            }
            
            await recalculateOrderTotals(db, item.order_id);
            
            const fullOrder = await getOrderFromDb(db, item.order_id);
            if (!fullOrder) throw new Error("No se pudo recuperar la orden actualizada.");
            
            await db.run('COMMIT');
            return { success: true, data: fullOrder };
        } catch (innerError: any) {
            await db.run('ROLLBACK');
            throw innerError;
        }

    } catch (error: any) {
        console.error("Failed to update item quantity:", error);
        return { success: false, error: error.message || "No se pudo actualizar la cantidad del producto." };
    }
}

export async function removeItemFromOrder(orderItemId: number): Promise<{ success: boolean; data?: Order; error?: string }> {
    return updateOrderItemQuantity(orderItemId, 0);
}

export async function cancelOrder(orderId: number): Promise<{ success: boolean; error?: string }> {
    try {
        const db = await getDbConnection();
        await db.run('BEGIN TRANSACTION');
        try {
            const order = await db.get<{ table_id: number }>("SELECT table_id FROM orders WHERE id = ?", orderId);
            if (order && order.table_id) {
                await db.run("UPDATE tables SET status = 'available' WHERE id = ?", order.table_id);
            }
            // Use ON DELETE CASCADE for order_items
            await db.run("DELETE FROM orders WHERE id = ?", orderId);
            await db.run('COMMIT');
            return { success: true };
        } catch (innerError: any) {
            await db.run('ROLLBACK');
            throw innerError;
        }
    } catch (error) {
        console.error("Failed to cancel order:", error);
        return { success: false, error: "Could not cancel order." };
    }
}

export async function processPaymentAction(orderId: number, payments: Payment[]): Promise<{ success: boolean; error?: string }> {
  try {
    const db = await getDbConnection();
    await db.run('BEGIN TRANSACTION');

    try {
        const order = await db.get<Order>("SELECT total_amount, table_id FROM orders WHERE id = ? AND status = 'pending'", orderId);
        if (!order) {
            throw new Error("Orden no encontrada o ya ha sido procesada.");
        }

        const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
        // Use a small tolerance (epsilon) for floating point comparison
        if ((order.total_amount - totalPaid) > 0.001) {
            throw new Error(`El pago (L ${totalPaid.toFixed(2)}) es insuficiente para cubrir el total de la orden (L ${order.total_amount.toFixed(2)}).`);
        }

        const paymentStmt = await db.prepare('INSERT INTO payments (order_id, payment_method_id, amount, created_at) VALUES (?, ?, ?, ?)');
        const now = new Date().toISOString();
        for (const payment of payments) {
            await paymentStmt.run(orderId, payment.paymentMethodId, payment.amount, now);
        }
        await paymentStmt.finalize();

        await db.run("UPDATE orders SET status = 'completed' WHERE id = ?", orderId);

        if (order.table_id) {
            await db.run("UPDATE tables SET status = 'available' WHERE id = ?", order.table_id);
        }

        await db.run('COMMIT');
        return { success: true };
    } catch (innerError: any) {
        await db.run('ROLLBACK');
        throw innerError;
    }
  } catch (error: any) {
    console.error('Failed to process payment:', error);
    return { success: false, error: error.message || 'No se pudo procesar el pago.' };
  }
}

export async function applyDiscountAction(orderId: number, percentage: number): Promise<{ success: boolean; data?: Order; error?: string }> {
    try {
        if (percentage < 0 || percentage > 100) {
            return { success: false, error: "El porcentaje de descuento debe estar entre 0 y 100." };
        }
        
        const db = await getDbConnection();
        await db.run('BEGIN TRANSACTION');
        try {
            await db.run('UPDATE orders SET discount_percentage = ? WHERE id = ?', percentage, orderId);
            await recalculateOrderTotals(db, orderId);
            
            const fullOrder = await getOrderFromDb(db, orderId);
            if (!fullOrder) throw new Error("No se pudo recuperar la orden actualizada.");
            
            await db.run('COMMIT');
            return { success: true, data: fullOrder };
        } catch (innerError: any) {
            await db.run('ROLLBACK');
            throw innerError;
        }
    } catch (error: any) {
        console.error("Failed to apply discount:", error);
        return { success: false, error: error.message || "No se pudo aplicar el descuento." };
    }
}

export async function transferOrderAction(orderId: number, oldTableId: number, newTableId: number): Promise<{ success: boolean; error?: string }> {
  try {
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
    } catch (innerError: any) {
        await db.run('ROLLBACK');
        throw innerError;
    }
  } catch (error: any) {
    console.error("Failed to transfer order:", error);
    return { success: false, error: "No se pudo trasladar la orden." };
  }
}
// #endregion

// #region Customer Actions
export async function searchCustomersAction(query: string): Promise<Customer[]> {
  try {
    const db = await getDbConnection();
    if (!query) {
        return db.all<Customer[]>("SELECT * FROM customers ORDER BY name LIMIT 20");
    }
    const searchTerm = `%${query.toLowerCase()}%`;
    return db.all<Customer[]>(
      "SELECT * FROM customers WHERE LOWER(name) LIKE ? OR LOWER(rtn) LIKE ? ORDER BY name",
      searchTerm,
      searchTerm
    );
  } catch (error) {
    console.error("Failed to search customers:", error);
    return [];
  }
}

export async function createCustomerAction(customerData: Omit<Customer, 'id'>): Promise<{ success: boolean; data?: Customer; error?: string }> {
    try {
        const db = await getDbConnection();
        const { name, rtn, phone, address } = customerData;

        // Basic validation
        if (!name || !rtn) {
            return { success: false, error: "Nombre y RTN son requeridos." };
        }

        const result = await db.run(
            "INSERT INTO customers (name, rtn, phone, address) VALUES (?, ?, ?, ?)",
            name, rtn, phone, address
        );
        
        const newCustomer: Customer = {
            id: result.lastID!,
            ...customerData,
        };
        return { success: true, data: newCustomer };
    } catch (error: any) {
        console.error("Failed to create customer:", error);
        if (error.code === 'SQLITE_CONSTRAINT') {
            return { success: false, error: "El RTN ya está registrado." };
        }
        return { success: false, error: error.message || "No se pudo crear el cliente." };
    }
}

export async function assignCustomerToOrderAction(orderId: number, customerId: number): Promise<{ success: boolean; data?: Order; error?: string }> {
    try {
        const db = await getDbConnection();
        await db.run('BEGIN TRANSACTION');
        try {
            const customer = await db.get<Customer>("SELECT * FROM customers WHERE id = ?", customerId);
            if (!customer) {
                throw new Error("Cliente no encontrado.");
            }
            
            await db.run('UPDATE orders SET customer_id = ?, customer_name = ? WHERE id = ?', customerId, customer.name, orderId);
            
            const fullOrder = await getOrderFromDb(db, orderId);
            if (!fullOrder) throw new Error("No se pudo recuperar la orden actualizada.");
            
            await db.run('COMMIT');
            return { success: true, data: fullOrder };
        } catch (innerError: any) {
            await db.run('ROLLBACK');
            throw innerError;
        }
    } catch (error: any) {
        console.error("Failed to assign customer to order:", error);
        return { success: false, error: error.message || "No se pudo asignar el cliente a la orden." };
    }
}
// #endregion

// #region Payment Actions
export async function getPaymentMethodsAction(): Promise<PaymentMethod[]> {
    try {
        const db = await getDbConnection();
        return db.all<PaymentMethod[]>("SELECT * FROM payment_methods ORDER BY id");
    } catch (error) {
        console.error("Failed to get payment methods:", error);
        return [];
    }
}
// #endregion

// #region Reporting Actions
interface ShiftSummary {
    totalSales: number;
    totalOrders: number;
    totalDiscounts: number;
    salesByPaymentMethod: { name: string, total: number }[];
    startingCash: number;
    cashSales: number;
    expectedCash: number;
}

export async function getShiftSummaryAction(shiftId: number): Promise<{ success: boolean; data?: ShiftSummary; error?: string }> {
    try {
        const db = await getDbConnection();

        const shift = await db.get<{ starting_cash: number }>("SELECT starting_cash FROM shifts WHERE id = ?", shiftId);
        if (!shift) {
            return { success: false, error: "Turno no encontrado." };
        }

        const orders = await db.all<{ total_amount: number; discount_amount: number; }>("SELECT total_amount, discount_amount FROM orders WHERE shift_id = ? AND status = 'completed'", shiftId);
        
        const totalSales = orders.reduce((sum, o) => sum + o.total_amount, 0);
        const totalDiscounts = orders.reduce((sum, o) => sum + (o.discount_amount || 0), 0);
        const totalOrders = orders.length;

        const payments = await db.all<{ name: string, total: number }>(
            `SELECT pm.name, SUM(p.amount) as total
             FROM payments p
             JOIN payment_methods pm ON p.payment_method_id = pm.id
             JOIN orders o ON p.order_id = o.id
             WHERE o.shift_id = ? AND o.status = 'completed'
             GROUP BY pm.name`,
            shiftId
        );

        const cashSales = payments.find(p => p.name.toLowerCase() === 'efectivo')?.total || 0;
        
        const summary: ShiftSummary = {
            totalSales,
            totalOrders,
            totalDiscounts,
            salesByPaymentMethod: payments,
            startingCash: shift.starting_cash,
            cashSales,
            expectedCash: shift.starting_cash + cashSales
        };
        
        return { success: true, data: summary };
    } catch (error: any) {
        console.error("Failed to get shift summary:", error);
        return { success: false, error: "No se pudo generar el resumen del turno." };
    }
}

export async function getCompletedOrdersForShiftAction(shiftId: number): Promise<{ success: boolean; data?: CompletedOrderInfo[]; error?: string }> {
    try {
        const db = await getDbConnection();
        const orders = await db.all<CompletedOrderInfo[]>(
            `SELECT id, customer_name, total_amount, created_at
             FROM orders
             WHERE shift_id = ? AND status = 'completed'
             ORDER BY created_at DESC`,
            shiftId
        );
        return { success: true, data: orders };
    } catch (error: any) {
        console.error("Failed to get completed orders for shift:", error);
        return { success: false, error: "No se pudo obtener el historial de órdenes." };
    }
}

export async function getOrderDetailsAction(orderId: number): Promise<{ success: boolean; data?: Order; error?: string }> {
    try {
        const db = await getDbConnection();
        const order = await getOrderFromDb(db, orderId);
        if (!order) {
            return { success: false, error: "Orden no encontrada." };
        }
        return { success: true, data: order };
    } catch (error: any) {
        console.error("Failed to get order details:", error);
        return { success: false, error: "No se pudo obtener el detalle de la orden." };
    }
}

export async function getLastCompletedOrderAction(shiftId: number): Promise<{ success: boolean; data?: Order; error?: string }> {
    try {
        const db = await getDbConnection();
        const lastOrderHeader = await db.get<{ id: number }>(
            "SELECT id FROM orders WHERE shift_id = ? AND status = 'completed' ORDER BY id DESC LIMIT 1",
            shiftId
        );
        
        if (!lastOrderHeader) {
            return { success: false, error: "No se encontró la última orden completada." };
        }
        
        const order = await getOrderFromDb(db, lastOrderHeader.id);
        if (!order) {
             return { success: false, error: "No se pudo cargar el detalle de la última orden." };
        }

        return { success: true, data: order };
    } catch (error: any) {
        console.error("Failed to get last completed order:", error);
        return { success: false, error: "No se pudo obtener la última orden." };
    }
}
// #endregion

// #region Admin Actions

export async function getCompanyInfoAction(): Promise<CompanyInfo | null> {
    try {
        const db = await getDbConnection();
        const info = await db.get<CompanyInfo>("SELECT * FROM company_info WHERE id = 1");
        return info || null;
    } catch (error) {
        console.error("Failed to get company info:", error);
        return null;
    }
}

export async function saveCompanyInfoAction(info: Omit<CompanyInfo, 'id'>): Promise<{ success: boolean; error?: string }> {
    try {
        const db = await getDbConnection();
        await db.run(
            `UPDATE company_info SET name = ?, rtn = ?, address = ?, phone = ?, email = ?, website = ? WHERE id = 1`,
            info.name, info.rtn, info.address, info.phone, info.email, info.website
        );
        return { success: true };
    } catch (error: any) {
        console.error("Failed to save company info:", error);
        return { success: false, error: "No se pudo guardar la información de la empresa." };
    }
}

export async function getAdminProductsAction(): Promise<Product[]> {
    try {
        const db = await getDbConnection();
        const rows = await db.all<any[]>(
            `SELECT id, name, price, category_id as categoryId, image_url as imageUrl, image_hint as imageHint,
            unit_of_measure_sale as unitOfMeasureSale, unit_of_measure_purchase as unitOfMeasurePurchase,
            is_active as isActive, tax_rate as taxRate
            FROM products ORDER BY name`
        );
        return rows.map(p => ({ ...p, isActive: !!p.isActive }));
    } catch (error) {
        console.error("Failed to get products for admin:", error);
        return [];
    }
}

export async function saveProductAction(product: Omit<Product, 'id'> & { id?: number }): Promise<{ success: boolean; data?: Product; error?: string }> {
    try {
        const db = await getDbConnection();
        const { id, name, price, categoryId, unitOfMeasureSale, unitOfMeasurePurchase, isActive, taxRate } = product;

        let lastId = id;

        if (id) {
            // Update existing product
            await db.run(
                `UPDATE products SET name = ?, price = ?, category_id = ?, unit_of_measure_sale = ?, 
                 unit_of_measure_purchase = ?, is_active = ?, tax_rate = ? WHERE id = ?`,
                name, price, categoryId, unitOfMeasureSale, unitOfMeasurePurchase, isActive, taxRate, id
            );
        } else {
            // Create new product
            const result = await db.run(
                `INSERT INTO products (name, price, category_id, unit_of_measure_sale, unit_of_measure_purchase, is_active, tax_rate, image_url, image_hint) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                name, price, categoryId, unitOfMeasureSale, unitOfMeasurePurchase, isActive, taxRate, 'https://placehold.co/200x200.png', name
            );
            lastId = result.lastID!;
        }

        if (!lastId) {
            return { success: false, error: 'Could not determine product ID after save.' };
        }

        const savedProductRaw = await db.get<any>(
            `SELECT id, name, price, category_id as categoryId, image_url as imageUrl, image_hint as imageHint,
            unit_of_measure_sale as unitOfMeasureSale, unit_of_measure_purchase as unitOfMeasurePurchase,
            is_active as isActive, tax_rate as taxRate
            FROM products WHERE id = ?`,
            lastId
        );

        if (!savedProductRaw) {
            return { success: false, error: 'Could not retrieve product after saving.' };
        }
        
        const savedProduct: Product = {
            ...savedProductRaw,
            isActive: !!savedProductRaw.isActive,
        };

        return { success: true, data: savedProduct };

    } catch (error: any) {
        console.error("Failed to save product:", error);
        return { success: false, error: "No se pudo guardar el producto." };
    }
}


// #endregion

// #region Supplier Actions

export async function getSuppliersAction(): Promise<Supplier[]> {
    try {
        const db = await getDbConnection();
        return db.all<Supplier[]>("SELECT * FROM suppliers ORDER BY name");
    } catch (error) {
        console.error("Failed to get suppliers:", error);
        return [];
    }
}

export async function saveSupplierAction(supplier: Omit<Supplier, 'id'> & { id?: number }): Promise<{ success: boolean; data?: Supplier; error?: string }> {
    try {
        const db = await getDbConnection();
        const { id, name, rtn, phone, address, email } = supplier;

        if (!name) {
            return { success: false, error: "El nombre es requerido." };
        }

        let lastId = id;

        if (id) {
            await db.run(
                `UPDATE suppliers SET name = ?, rtn = ?, phone = ?, address = ?, email = ? WHERE id = ?`,
                name, rtn, phone, address, email, id
            );
        } else {
            const result = await db.run(
                `INSERT INTO suppliers (name, rtn, phone, address, email) VALUES (?, ?, ?, ?, ?)`,
                name, rtn, phone, address, email
            );
            lastId = result.lastID!;
        }

        if (!lastId) {
            return { success: false, error: 'Could not determine supplier ID after save.' };
        }

        const savedSupplier = await db.get<Supplier>("SELECT * FROM suppliers WHERE id = ?", lastId);

        if (!savedSupplier) {
            return { success: false, error: 'Could not retrieve supplier after saving.' };
        }
        
        return { success: true, data: savedSupplier };

    } catch (error: any) {
        console.error("Failed to save supplier:", error);
        return { success: false, error: "No se pudo guardar el proveedor." };
    }
}

// #endregion

// #region Payment Method Admin Actions

export async function savePaymentMethodAction(method: Omit<PaymentMethod, 'id'> & { id?: number }): Promise<{ success: boolean; data?: PaymentMethod; error?: string }> {
    try {
        const db = await getDbConnection();
        const { id, name, type } = method;

        if (!name || !type) {
            return { success: false, error: "Nombre y tipo son requeridos." };
        }

        let lastId = id;

        if (id) {
            await db.run(
                `UPDATE payment_methods SET name = ?, type = ? WHERE id = ?`,
                name, type, id
            );
        } else {
            const result = await db.run(
                `INSERT INTO payment_methods (name, type) VALUES (?, ?)`,
                name, type
            );
            lastId = result.lastID!;
        }

        if (!lastId) {
            return { success: false, error: 'Could not determine payment method ID after save.' };
        }

        const savedMethod = await db.get<PaymentMethod>("SELECT * FROM payment_methods WHERE id = ?", lastId);

        if (!savedMethod) {
            return { success: false, error: 'Could not retrieve payment method after saving.' };
        }
        
        return { success: true, data: savedMethod };

    } catch (error: any) {
        console.error("Failed to save payment method:", error);
        return { success: false, error: "No se pudo guardar el medio de pago." };
    }
}
// #endregion
