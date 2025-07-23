import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import config from "../config/index.js";

const { SECRET, SECRET_EXPIRES_IN } = config;
const router = Router();

// Registro de usuario
router.post("/register", (req, res, next) => {
  passport.authenticate("register", { session: false }, (err, user, info) => {
    if (err) return next(err);
    
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: info.message || 'Registro fallido' 
      });
    }

    return res.status(201).json({ 
      success: true,
      message: "Registro exitoso",
      user: { id: user._id, email: user.email }
    });
  })(req, res, next);
});

// Login de usuario
router.post("/login", (req, res, next) => {
  passport.authenticate("login", { session: false }, (err, user, info) => {
    if (err) return next(err);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: info.message || 'Autenticación fallida' 
      });
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
  })(req, res, next);
});

// Ruta protegida - Current user
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
  const user = req.user;
  return res.status(200).json({
    success: true,
    user: {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role
    }
  });
});

// Logout
router.get("/logout", (req, res) => {
  res.clearCookie("jwtCookieToken");
  return res.status(200).json({ 
    success: true, 
    message: "Sesión cerrada" 
  });
});

export default router;