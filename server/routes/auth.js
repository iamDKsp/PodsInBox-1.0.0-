import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt.js';
import { collections, generateId } from '../utils/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
        }

        const usersCollection = collections.users();

        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: generateId('user'),
            name,
            email,
            password: hashedPassword,
            role: 'customer',
            createdAt: new Date().toISOString()
        };

        await usersCollection.insertOne(newUser);

        const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.status(201).json({
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            },
            token
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Erro ao criar conta' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        const usersCollection = collections.users();
        const user = await usersCollection.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Check if password matches (handle both hashed and plain text for seed data)
        let isValidPassword = false;
        if (user.password.startsWith('$2')) {
            isValidPassword = await bcrypt.compare(password, user.password);
        } else {
            // For seed data or plain passwords (development only)
            isValidPassword = user.password === password;
        }

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
});

// Get profile
router.get('/profile', authenticateToken, (req, res) => {
    res.json({ user: req.user });
});

// Update profile
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { name, email } = req.body;
        const usersCollection = collections.users();

        const user = await usersCollection.findOne({ id: req.user.id });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        if (email && email !== req.user.email) {
            const emailExists = await usersCollection.findOne({ email, id: { $ne: req.user.id } });
            if (emailExists) {
                return res.status(400).json({ error: 'Email já está em uso' });
            }
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;

        await usersCollection.updateOne(
            { id: req.user.id },
            { $set: updateData }
        );

        const updatedUser = await usersCollection.findOne({ id: req.user.id });

        res.json({
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
});

// Change password
router.put('/password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const usersCollection = collections.users();

        const user = await usersCollection.findOne({ id: req.user.id });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        let isValidPassword = false;
        if (user.password.startsWith('$2')) {
            isValidPassword = await bcrypt.compare(currentPassword, user.password);
        } else {
            isValidPassword = user.password === currentPassword;
        }

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Senha atual incorreta' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await usersCollection.updateOne(
            { id: req.user.id },
            { $set: { password: hashedPassword } }
        );

        res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Erro ao alterar senha' });
    }
});

export default router;
