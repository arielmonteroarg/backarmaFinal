import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import config from "../config/index.js";

const { SECRET } = config;



const router = Router();

router.post(
  "/register",
  passport.authenticate("register", {
    session: false,
    successRedirect: "/login",
    failureRedirect: "/failed",
  }),
);



router.post(
  "/login",(req, res, next) => {
    passport.authenticate("login", { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.session.errorMessage = info.message; // Aquí capturas el mensaje de error
        return res.redirect("/failed");
      }
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      SECRET,
      { expiresIn: "1h" }
    );

/*     req.session.user = {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      age: user.age,
      email: user.email,
      role: user.role,
    };
 */
    res.cookie("jwtCookieToken", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: false, // poné true si estás en HTTPS
        maxAge: 3600000, // 1 hora
      })
      .redirect("/");
  })
  (req, res, next);
  }
);

// Ruta protegida con JWT
router.get(
  "/current",
   (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user) => {
      if (err || !user) {
        req.session.errorMessage = "Token inválido o inexistente. Por favor iniciá sesión.";
        return res.redirect("/failed");
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  (req, res) => {
    const { first_name, last_name, age, role } = req.user;
    res.render("current", {
      title: 'Current',
      user: req.user,
      first_name,
      last_name,
      age,
      role,
    });

  }
);


router.get("/logout", (req, res) => {
  // Limpia la cookie JWT primero
  res.clearCookie("jwtCookieToken");

  // Luego intenta cerrar sesión si existe
  if (req.logout) {
    req.logout(err => {
      if (err) {
        console.error("❌ Error al cerrar sesión:", err);
        return res.status(500).json({ fatal_error: "view console" });
      }
      return res.redirect("/");
    });
  } else {
    // En caso de que no estés usando sesiones Passport
    return res.redirect("/");
  }
});


export default router;
