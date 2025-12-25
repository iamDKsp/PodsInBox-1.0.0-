import { Router } from 'express';
import { collections, generateId } from '../utils/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { generateWhatsAppLink } from '../utils/whatsapp.js';

const router = Router();

// Helper function to create or update customer
const upsertCustomer = async (customerName, customerPhone, address, orderTotal) => {
    const customersCollection = collections.customers();

    const existingCustomer = await customersCollection.findOne({ phone: customerPhone });

    if (existingCustomer) {
        // Update existing customer
        await customersCollection.updateOne(
            { phone: customerPhone },
            {
                $set: {
                    name: customerName,
                    ...(address && { address }),
                    updatedAt: new Date().toISOString()
                },
                $inc: {
                    orderCount: 1,
                    totalSpent: orderTotal
                }
            }
        );
        return await customersCollection.findOne({ phone: customerPhone });
    } else {
        // Create new customer
        const newCustomer = {
            id: generateId('customer'),
            name: customerName,
            phone: customerPhone,
            address: address || '',
            orderCount: 1,
            totalSpent: orderTotal,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        await customersCollection.insertOne(newCustomer);
        return newCustomer;
    }
};

// Create order and get WhatsApp link
router.post('/', async (req, res) => {
    try {
        const { items, customerName, customerEmail, address } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Carrinho vazio' });
        }

        if (!customerName || !customerEmail) {
            return res.status(400).json({ error: 'Nome e telefone são obrigatórios' });
        }

        const productsCollection = collections.products();
        const ordersCollection = collections.orders();

        // Validate stock and calculate total
        let total = 0;
        const orderItems = [];

        for (const item of items) {
            // Handle product IDs that may have flavor suffix
            const baseProductId = item.id.includes('-flavor-')
                ? item.id.split('-flavor-')[0]
                : item.id;

            const product = await productsCollection.findOne({ id: baseProductId });

            if (!product) {
                return res.status(400).json({ error: `Produto ${item.name} não encontrado` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    error: `Estoque insuficiente para ${product.name}. Disponível: ${product.stock}`
                });
            }

            orderItems.push({
                productId: product.id,
                name: product.name,
                flavor: product.flavor,
                price: product.price,
                quantity: item.quantity
            });

            total += product.price * item.quantity;
        }

        // Create order
        const newOrder = {
            id: generateId('order'),
            customerName,
            customerEmail, // This is actually the phone number
            address: address || '',
            items: orderItems,
            total,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        // Deduct stock
        for (const item of items) {
            const baseProductId = item.id.includes('-flavor-')
                ? item.id.split('-flavor-')[0]
                : item.id;

            await productsCollection.updateOne(
                { id: baseProductId },
                { $inc: { stock: -item.quantity } }
            );
        }

        await ordersCollection.insertOne(newOrder);

        // Auto-create or update customer
        await upsertCustomer(customerName, customerEmail, address, total);

        // Generate WhatsApp link
        const whatsappLink = generateWhatsAppLink(newOrder);

        res.status(201).json({
            order: newOrder,
            whatsappLink
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ error: 'Erro ao criar pedido' });
    }
});

// Get user orders (authenticated)
router.get('/my-orders', authenticateToken, async (req, res) => {
    try {
        const ordersCollection = collections.orders();
        const orders = await ordersCollection
            .find({ customerEmail: req.user.email })
            .sort({ createdAt: -1 })
            .toArray();

        res.json({ orders });
    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({ error: 'Erro ao buscar pedidos' });
    }
});

// Get all orders (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const ordersCollection = collections.orders();
        const { status } = req.query;

        let query = {};
        if (status) {
            query.status = status;
        }

        const orders = await ordersCollection
            .find(query)
            .sort({ createdAt: -1 })
            .toArray();

        res.json({ orders });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ error: 'Erro ao buscar pedidos' });
    }
});

// Get single order
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const ordersCollection = collections.orders();
        const order = await ordersCollection.findOne({ id: req.params.id });

        if (!order) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }

        // Check if user is admin or order owner
        if (req.user.role !== 'admin' && order.customerEmail !== req.user.email) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        res.json({ order });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ error: 'Erro ao buscar pedido' });
    }
});

// Update order status (admin only)
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { status } = req.body;

        if (!['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
            return res.status(400).json({ error: 'Status inválido' });
        }

        const ordersCollection = collections.orders();
        const productsCollection = collections.products();
        const customersCollection = collections.customers();

        const order = await ordersCollection.findOne({ id: req.params.id });

        if (!order) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }

        const previousStatus = order.status;

        // If cancelling and wasn't already cancelled, restore stock
        if (status === 'cancelled' && previousStatus !== 'cancelled') {
            for (const item of order.items) {
                await productsCollection.updateOne(
                    { id: item.productId },
                    { $inc: { stock: item.quantity } }
                );
            }

            // Update customer total spent
            await customersCollection.updateOne(
                { phone: order.customerEmail },
                {
                    $inc: {
                        totalSpent: -order.total,
                        orderCount: -1
                    },
                    $set: { updatedAt: new Date().toISOString() }
                }
            );
        }

        // If un-cancelling (restoring from cancelled), deduct stock again
        if (previousStatus === 'cancelled' && status !== 'cancelled') {
            for (const item of order.items) {
                const product = await productsCollection.findOne({ id: item.productId });
                if (product && product.stock < item.quantity) {
                    return res.status(400).json({
                        error: `Estoque insuficiente para restaurar pedido. Produto: ${product.name}`
                    });
                }
                await productsCollection.updateOne(
                    { id: item.productId },
                    { $inc: { stock: -item.quantity } }
                );
            }

            // Restore customer total spent
            await customersCollection.updateOne(
                { phone: order.customerEmail },
                {
                    $inc: {
                        totalSpent: order.total,
                        orderCount: 1
                    },
                    $set: { updatedAt: new Date().toISOString() }
                }
            );
        }

        await ordersCollection.updateOne(
            { id: req.params.id },
            { $set: { status, updatedAt: new Date().toISOString() } }
        );

        const updatedOrder = await ordersCollection.findOne({ id: req.params.id });

        res.json({ order: updatedOrder });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ error: 'Erro ao atualizar status' });
    }
});

export default router;
