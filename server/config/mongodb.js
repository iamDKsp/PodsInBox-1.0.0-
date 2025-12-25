import { MongoClient, ObjectId } from 'mongodb';

let client = null;
let db = null;

export async function connectDB() {
    if (db) return db;

    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error('MONGODB_URI environment variable is not set');
    }

    try {
        client = new MongoClient(uri);
        await client.connect();
        db = client.db('podsinbox');
        console.log('✅ Connected to MongoDB Atlas');
        return db;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
}

export function getDB() {
    if (!db) {
        throw new Error('Database not connected. Call connectDB() first.');
    }
    return db;
}

export async function closeDB() {
    if (client) {
        await client.close();
        client = null;
        db = null;
        console.log('MongoDB connection closed');
    }
}

// Helper to convert string ID to ObjectId if needed
export function toObjectId(id) {
    if (id instanceof ObjectId) return id;
    if (typeof id === 'string' && ObjectId.isValid(id)) {
        return new ObjectId(id);
    }
    return id;
}

export { ObjectId };
