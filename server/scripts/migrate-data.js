/**
 * Script de Migração de Dados
 * 
 * Este script migra os dados do arquivo db.json local para o MongoDB Atlas.
 * 
 * Uso:
 * 1. Configure a variável MONGODB_URI no arquivo .env
 * 2. Execute: node server/scripts/migrate-data.js
 */

import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables (simple approach without dotenv)
const envPath = join(__dirname, '..', '..', '.env');
let MONGODB_URI = process.env.MONGODB_URI;

// Try to read from .env file if not in environment
try {
    const envContent = readFileSync(envPath, 'utf-8');
    const match = envContent.match(/MONGODB_URI=(.+)/);
    if (match && !MONGODB_URI) {
        MONGODB_URI = match[1].trim();
    }
} catch (e) {
    // .env file doesn't exist, that's ok
}

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI não configurada. Configure no arquivo .env ou como variável de ambiente.');
    process.exit(1);
}

const DB_JSON_PATH = join(__dirname, '..', 'data', 'db.json');

async function migrate() {
    console.log('🚀 Iniciando migração de dados...\n');

    let client;

    try {
        // Read local database
        console.log('📖 Lendo db.json...');
        const localData = JSON.parse(readFileSync(DB_JSON_PATH, 'utf-8'));

        console.log(`   - ${localData.users?.length || 0} usuários`);
        console.log(`   - ${localData.products?.length || 0} produtos`);
        console.log(`   - ${localData.orders?.length || 0} pedidos`);
        console.log(`   - ${localData.customers?.length || 0} clientes`);
        console.log(`   - ${localData.categories?.length || 0} categorias\n`);

        // Connect to MongoDB
        console.log('🔗 Conectando ao MongoDB Atlas...');
        client = new MongoClient(MONGODB_URI);
        await client.connect();
        const db = client.db('podsinbox');
        console.log('✅ Conectado!\n');

        // Migrate users
        if (localData.users?.length > 0) {
            console.log('👥 Migrando usuários...');
            const usersCollection = db.collection('users');
            await usersCollection.deleteMany({}); // Clear existing
            await usersCollection.insertMany(localData.users);
            console.log(`   ✅ ${localData.users.length} usuários migrados`);
        }

        // Migrate products
        if (localData.products?.length > 0) {
            console.log('📦 Migrando produtos...');
            const productsCollection = db.collection('products');
            await productsCollection.deleteMany({}); // Clear existing
            await productsCollection.insertMany(localData.products);
            console.log(`   ✅ ${localData.products.length} produtos migrados`);
            console.log('   ⚠️  ATENÇÃO: URLs de imagens ainda apontam para localhost. Faça re-upload via admin.');
        }

        // Migrate orders
        if (localData.orders?.length > 0) {
            console.log('🛒 Migrando pedidos...');
            const ordersCollection = db.collection('orders');
            await ordersCollection.deleteMany({}); // Clear existing
            await ordersCollection.insertMany(localData.orders);
            console.log(`   ✅ ${localData.orders.length} pedidos migrados`);
        }

        // Migrate customers
        if (localData.customers?.length > 0) {
            console.log('👤 Migrando clientes...');
            const customersCollection = db.collection('customers');
            await customersCollection.deleteMany({}); // Clear existing
            await customersCollection.insertMany(localData.customers);
            console.log(`   ✅ ${localData.customers.length} clientes migrados`);
        }

        // Migrate categories
        if (localData.categories?.length > 0) {
            console.log('📁 Migrando categorias...');
            const categoriesCollection = db.collection('categories');
            await categoriesCollection.deleteMany({}); // Clear existing
            const categoryDocs = localData.categories.map(name => ({ name }));
            await categoriesCollection.insertMany(categoryDocs);
            console.log(`   ✅ ${localData.categories.length} categorias migradas`);
        }

        console.log('\n✅ MIGRAÇÃO CONCLUÍDA COM SUCESSO!');
        console.log('\n📋 Próximos passos:');
        console.log('   1. Configure as variáveis de ambiente no Railway');
        console.log('   2. Faça deploy do backend');
        console.log('   3. Atualize as imagens dos produtos via painel admin');
        console.log('   4. Configure VITE_API_URL na Vercel');
        console.log('   5. Faça deploy do frontend\n');

    } catch (error) {
        console.error('\n❌ Erro durante a migração:', error);
        process.exit(1);
    } finally {
        if (client) {
            await client.close();
        }
    }
}

migrate();
