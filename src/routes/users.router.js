import { Router } from "express";
import userModel from "../daos/mongo/models/user.model.js";
import { isAdmin } from "../middlewares/checkAuth.js";
import passport from "passport";

const router = Router();

router.get("/", passport.authenticate("jwt", { session: false, failureRedirect: "/api/users/login" }), isAdmin,  async (req, res) => {
   try {
    const users = await userModel.find().lean(); 
    res.render("users", { title: "Usuarios", users });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener usuarios");
  }
});

router.get("/ver/:id", async (req, res) => {
  res.json(await userModel.findById(req.params.id));
});

router.delete("/:id", async (req, res) => {
  res.json(await userModel.deleteOne({ _id: req.params.id }));
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
