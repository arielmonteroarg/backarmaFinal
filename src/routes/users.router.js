import { Router } from "express";
import userModel from "../daos/mongo/models/user.model.js";
import { isAdmin } from "../middlewares/checkAuth.js";
import passport from "passport";

const router = Router();

router.get("/", passport.authenticate("jwt", { session: false, failureRedirect: "/login" }), isAdmin,  async (req, res) => {
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

export default router;
