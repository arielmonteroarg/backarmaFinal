import { Router } from "express";
import passport from "passport";




const router = Router();
router.get("/", (req, res) => {
  res.render("index", { title: "Página Principal" });
});

router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

router.get("/register", (req, res) => {
  res.render("register", { title: "Registro" });
});

router.get("/failed", (req, res) => {
   res.render("failed", {
    title: "Error",
    message: res.locals.errorMessage || "Ha ocurrido un error desconocido.",
  });
});

// Ruta protegida con JWT
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    
    const { first_name, last_name, age, role } = req.user;
    res.render("profile", {
      title: 'Perfil',
      user: req.user,
      first_name,
      last_name,
      age,
      role,
    });
  }
);

export default router;
