import { Router } from 'express';
import { collections, getCategories } from '../utils/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Helper function to filter orders by date range
const filterOrdersByDate = (orders, dateFilter) => {
    if (!dateFilter || dateFilter === 'all') return orders;

    const now = new Date();
    let startDate;

    switch (dateFilter) {
        case 'day':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
        case 'week':
            const dayOfWeek = now.getDay();
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
            break;
        case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        case 'year':
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
        default:
            return orders;
    }

    return orders.filter(order => new Date(order.createdAt) >= startDate);
};

// Dashboard stats (admin only)
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const productsCollection = collections.products();
        const ordersCollection = collections.orders();
        const customersCollection = collections.customers();

        const { dateFilter } = req.query;

        // Get all orders and filter by date
        const allOrders = await ordersCollection.find({}).toArray();
        const filteredOrders = filterOrdersByDate(allOrders, dateFilter);

        // Calculate stats
        const totalProducts = await productsCollection.countDocuments();
        const totalOrders = filteredOrders.length;
        const totalUsers = await customersCollection.countDocuments();

        // Revenue from delivered orders only (completed sales)
        const totalRevenue = filteredOrders
            .filter(o => o.status === 'delivered')
            .reduce((sum, o) => sum + o.total, 0);

        // Order status breakdown
        const ordersByStatus = {
            pending: filteredOrders.filter(o => o.status === 'pending').length,
            confirmed: filteredOrders.filter(o => o.status === 'confirmed').length,
            processing: filteredOrders.filter(o => o.status === 'processing').length,
            shipped: filteredOrders.filter(o => o.status === 'shipped').length,
            delivered: filteredOrders.filter(o => o.status === 'delivered').length,
            cancelled: filteredOrders.filter(o => o.status === 'cancelled').length
        };

        // Low stock products (less than 10)
        const lowStockProducts = await productsCollection
            .find({ stock: { $lt: 10 } })
            .toArray();

        // Recent orders (last 5 from filtered)
        const recentOrders = filteredOrders
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        // Top selling products (from filtered orders)
        const productSales = {};
        filteredOrders.forEach(order => {
            order.items.forEach(item => {
                if (!productSales[item.productId]) {
                    productSales[item.productId] = { name: item.name, quantity: 0, revenue: 0 };
                }
                productSales[item.productId].quantity += item.quantity;
                productSales[item.productId].revenue += item.price * item.quantity;
            });
        });

        const topProducts = Object.entries(productSales)
            .map(([id, data]) => ({ id, ...data }))
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);

        res.json({
            stats: {
                totalProducts,
                totalOrders,
                totalUsers,
                totalRevenue,
                ordersByStatus
            },
            lowStockProducts,
            recentOrders,
            topProducts,
            dateFilter: dateFilter || 'all'
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: 'Erro ao carregar dashboard' });
    }
});

// Get all users (admin only)
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const usersCollection = collections.users();
        const users = await usersCollection.find({}).toArray();

        const sanitizedUsers = users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            createdAt: u.createdAt
        }));

        res.json({ users: sanitizedUsers });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});

// Get all customers (admin only)
router.get('/customers', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const customersCollection = collections.customers();
        const customers = await customersCollection
            .find({})
            .sort({ updatedAt: -1, createdAt: -1 })
            .toArray();

        res.json({ customers });
    } catch (error) {
        console.error('Get customers error:', error);
        res.status(500).json({ error: 'Erro ao buscar clientes' });
    }
});

// Get customer orders (admin only)
router.get('/customers/:id/orders', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const customersCollection = collections.customers();
        const ordersCollection = collections.orders();

        const customer = await customersCollection.findOne({ id: req.params.id });

        if (!customer) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        // Find orders by customer phone
        const customerOrders = await ordersCollection
            .find({ customerEmail: customer.phone })
            .sort({ createdAt: -1 })
            .toArray();

        res.json({ customer, orders: customerOrders });
    } catch (error) {
        console.error('Get customer orders error:', error);
        res.status(500).json({ error: 'Erro ao buscar pedidos do cliente' });
    }
});

// Get categories (admin can manage)
router.get('/categories', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const categories = await getCategories();
        res.json({ categories });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ error: 'Erro ao buscar categorias' });
    }
});

// Delete order log (admin only)
router.delete('/orders/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const ordersCollection = collections.orders();
        const orderId = req.params.id;

        const order = await ordersCollection.findOne({ id: orderId });

        if (!order) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }

        await ordersCollection.deleteOne({ id: orderId });

        res.json({ message: 'Pedido removido com sucesso' });
    } catch (error) {
        console.error('Delete order error:', error);
        res.status(500).json({ error: 'Erro ao remover pedido' });
    }
});

export default router;
