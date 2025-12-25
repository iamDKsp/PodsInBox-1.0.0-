import { getDB } from '../config/mongodb.js';

// Get a collection from the database
export const getCollection = (name) => {
    return getDB().collection(name);
};

// Generate a unique ID with prefix
export const generateId = (prefix = 'id') => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Helper functions for common operations
export const collections = {
    users: () => getCollection('users'),
    products: () => getCollection('products'),
    orders: () => getCollection('orders'),
    customers: () => getCollection('customers'),
    categories: () => getCollection('categories')
};

// Initialize default data if collections are empty
export async function initializeCollections() {
    const db = getDB();

    // Check if categories exist, if not create default ones
    const categoriesCount = await db.collection('categories').countDocuments();
    if (categoriesCount === 0) {
        const defaultCategories = [
            { name: 'Premium' },
            { name: 'Life Pod' },
            { name: 'Ignite' },
            { name: 'Waka' },
            { name: 'Ice King' },
            { name: 'Sed Adicct' },
            { name: 'Black Sheep' },
            { name: 'Refil' }
        ];
        await db.collection('categories').insertMany(defaultCategories);
        console.log('✅ Default categories initialized');
    }

    // Check if admin user exists
    const adminExists = await db.collection('users').findOne({ role: 'admin' });
    if (!adminExists) {
        await db.collection('users').insertOne({
            id: 'admin-1',
            name: 'Administrador',
            email: 'admin@podsinbox.com',
            password: 'admin123', // Should be hashed in production
            role: 'admin',
            createdAt: new Date().toISOString()
        });
        console.log('✅ Default admin user created');
    }
}

// Get all categories as an array of strings
export async function getCategories() {
    const categories = await getCollection('categories').find({}).toArray();
    return categories.map(c => c.name);
}
