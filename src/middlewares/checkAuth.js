import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export const isAuthenticated = (req, res, next) => {
  const token = req.cookies.jwtCookieToken || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No autenticado' });

  try {
    const decoded = jwt.verify(token, config.SECRET);
    req.user = {
      _id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

export const authorize = (roles = []) => (req, res, next) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'No autenticado' });
  if (roles.length && !roles.includes(user.role)) {
    return res.status(403).json({ error: 'No autorizado' });
  }
  next();
};

export const isAdmin = (req, res, next) => authorize(['ADMIN'])(req, res, next);