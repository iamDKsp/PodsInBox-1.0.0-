import { Router } from 'express';
import multer from 'multer';
import { collections, generateId, getCategories } from '../utils/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { uploadImage } from '../config/cloudinary.js';

const router = Router();

// Use memory storage for Cloudinary uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Get all products (public)
router.get('/', async (req, res) => {
    try {
        const productsCollection = collections.products();
        const { search, category, minPrice, maxPrice, sort } = req.query;

        let query = {};

        // Search filter
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { name: searchRegex },
                { flavor: searchRegex },
                { description: searchRegex }
            ];
        }

        // Category filter
        if (category && category !== 'Todos') {
            query.category = category;
        }

        // Price filters
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        let products = await productsCollection.find(query).toArray();

        // Sorting
        if (sort) {
            switch (sort) {
                case 'price-asc':
                    products.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    products.sort((a, b) => b.price - a.price);
                    break;
                case 'name':
                    products.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'newest':
                    products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    break;
            }
        }

        // Always sort featured products first
        products.sort((a, b) => {
            if (a.isFeatured && !b.isFeatured) return -1;
            if (!a.isFeatured && b.isFeatured) return 1;
            return 0;
        });

        const categories = await getCategories();

        res.json({ products, categories });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
});

// Get single product (public)
router.get('/:id', async (req, res) => {
    try {
        const productsCollection = collections.products();
        const product = await productsCollection.findOne({ id: req.params.id });

        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        res.json({ product });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ error: 'Erro ao buscar produto' });
    }
});

// Create product (admin only)
router.post('/', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
    try {
        const { name, flavor, description, price, originalPrice, category, stock, isNew, isBestSeller, isFeatured, flavors } = req.body;

        // Handle image upload
        let imageUrl = req.body.image;
        if (req.file) {
            try {
                const result = await uploadImage(req.file.buffer);
                imageUrl = result.secure_url;
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                return res.status(500).json({ error: 'Erro ao fazer upload da imagem' });
            }
        }

        if (!name || !flavor || !price || !category) {
            return res.status(400).json({ error: 'Nome, sabor, preço e categoria são obrigatórios' });
        }

        const productsCollection = collections.products();

        // Parse flavors if it's a string
        let parsedFlavors = [];
        if (flavors) {
            parsedFlavors = typeof flavors === 'string' ? JSON.parse(flavors) : flavors;
        }

        const newProduct = {
            id: generateId('prod'),
            name,
            flavor,
            description: description || '',
            price: parseFloat(price),
            originalPrice: originalPrice ? parseFloat(originalPrice) : null,
            image: imageUrl || 'https://images.unsplash.com/photo-1560913210-46c2f2944c6f?w=400&h=400&fit=crop',
            category,
            stock: parseInt(stock) || 0,
            isNew: isNew === 'true' || isNew === true,
            isBestSeller: isBestSeller === 'true' || isBestSeller === true,
            isFeatured: isFeatured === 'true' || isFeatured === true,
            flavors: parsedFlavors,
            createdAt: new Date().toISOString()
        };

        await productsCollection.insertOne(newProduct);

        res.status(201).json({ product: newProduct });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ error: 'Erro ao criar produto' });
    }
});

// Update product (admin only)
router.put('/:id', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
    try {
        const productsCollection = collections.products();
        const product = await productsCollection.findOne({ id: req.params.id });

        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        const { name, flavor, description, price, originalPrice, category, stock, isNew, isBestSeller, isFeatured, flavors } = req.body;

        // Handle image upload
        let imageUrl = req.body.image;
        if (req.file) {
            try {
                const result = await uploadImage(req.file.buffer);
                imageUrl = result.secure_url;
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                return res.status(500).json({ error: 'Erro ao fazer upload da imagem' });
            }
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (flavor) updateData.flavor = flavor;
        if (description !== undefined) updateData.description = description;
        if (price) updateData.price = parseFloat(price);
        if (originalPrice !== undefined) updateData.originalPrice = originalPrice ? parseFloat(originalPrice) : null;
        if (imageUrl !== undefined) updateData.image = imageUrl;
        if (category) updateData.category = category;
        if (stock !== undefined) updateData.stock = parseInt(stock);
        if (isNew !== undefined) updateData.isNew = isNew === 'true' || isNew === true;
        if (isBestSeller !== undefined) updateData.isBestSeller = isBestSeller === 'true' || isBestSeller === true;
        if (isFeatured !== undefined) updateData.isFeatured = isFeatured === 'true' || isFeatured === true;
        if (flavors !== undefined) {
            updateData.flavors = typeof flavors === 'string' ? JSON.parse(flavors) : flavors;
        }

        await productsCollection.updateOne(
            { id: req.params.id },
            { $set: updateData }
        );

        const updatedProduct = await productsCollection.findOne({ id: req.params.id });

        res.json({ product: updatedProduct });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
});

// Delete product (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const productsCollection = collections.products();
        const product = await productsCollection.findOne({ id: req.params.id });

        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        await productsCollection.deleteOne({ id: req.params.id });

        res.json({ message: 'Produto removido com sucesso' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ error: 'Erro ao remover produto' });
    }
});

export default router;
