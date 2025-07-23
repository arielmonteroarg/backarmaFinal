import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import config from "../config/index.js";

const { SECRET, SECRET_EXPIRES_IN } = config;
const router = Router();

// Helper para determinar el tipo de respuesta
const isApiRequest = (req) => {
  return req.get('Accept') === 'application/json' || req.path.startsWith('/api');
};

// Registro de usuario
router.post("/register", (req, res, next) => {
  passport.authenticate("register", { session: false }, (err, user, info) => {
    if (err) return next(err);
    
    if (!user) {
      if (isApiRequest(req)) {
        return res.status(400).json({ 
          success: false, 
          message: info.message || 'Registro fallido' 
        });
      }
      req.session.errorMessage = info.message;
      return res.redirect("/register");
    }

    if (isApiRequest(req)) {
      return res.status(201).json({ 
        success: true,
        message: "Registro exitoso",
        user: { id: user._id, email: user.email }
      });
    }
    return res.redirect("/");
  })(req, res, next);
});

// Login de usuario
router.post("/login", (req, res, next) => {
  passport.authenticate("login", { session: false }, (err, user, info) => {
    if (err) return next(err);
    
    if (!user) {
      if (isApiRequest(req)) {
        return res.status(401).json({ 
          success: false, 
          message: info.message || 'Autenticación fallida' 
        });
      }
      req.session.errorMessage = info.message;
      return res.redirect("/api/users/login");
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      SECRET,
      { expiresIn: SECRET_EXPIRES_IN }
    );

    const cookieOptions = {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000
    };

    res.cookie("jwtCookieToken", token, cookieOptions);

    if (isApiRequest(req)) {
      return res.status(200).json({
        success: true,
        user: {
          id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          age: user.age,
          email: user.email,
          role: user.role
        },
        token
      });
    }
    return res.redirect("/");
  })(req, res, next);
});

// Ruta protegida - Current user
router.get("/current", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      if (isApiRequest(req)) {
        return res.status(401).json({ 
          success: false, 
          message: "Acceso no autorizado" 
        });
      }
      req.session.errorMessage = "Debes iniciar sesión";
      return res.redirect("/api/users/login");
    }

    if (isApiRequest(req)) {
      return res.status(200).json({
        success: true,
        user: {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role
        }
      });
    }
    
    res.render("current", {
      title: 'Perfil',
      user: user
    });
  })(req, res, next);
});

// Logout
router.get("/logout", (req, res) => {
  res.clearCookie("jwtCookieToken");
  
  if (isApiRequest(req)) {
    return res.status(200).json({ 
      success: true, 
      message: "Sesión cerrada" 
    });
  }
  return res.redirect("/");
});

export default router;