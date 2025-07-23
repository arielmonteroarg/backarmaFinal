import jwt from 'jsonwebtoken';
import config from '../config/index.js';

const authMiddleware = (req, res, next) => {
  try {
    // 1. Obtenemos el token de las cookies o del header Authorization
    const token = req.cookies.jwtCookieToken || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No autorizado - Token no proporcionado' });
    }

    // 2. Verificamos el token
    const decoded = jwt.verify(token, config.SECRET);
    
    // 3. Adjuntamos el usuario al request
    req.user = {
      _id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    console.error('Error en authMiddleware:', error.message);
    
    // Manejo específico de errores de JWT
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    
    return res.status(500).json({ error: 'Error de autenticación' });
  }
};
 export default authMiddleware;