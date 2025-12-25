import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js';
import { collections } from '../utils/database.js';

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token de acesso não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        const usersCollection = collections.users();
        const user = await usersCollection.findOne({ id: decoded.userId });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        req.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Token inválido ou expirado' });
    }
};

export const requireAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Acesso restrito a administradores' });
    }
    next();
};
