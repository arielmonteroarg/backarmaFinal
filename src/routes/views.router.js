import { Router } from "express";



const router = Router();
 router.get("/", (req, res) => {
  res.render("index", { title: "Página Principal" });
});

router.get("/failed", (req, res) => {
   res.render("failed", {
    title: "Error",
    message: res.locals.errorMessage || "Ha ocurrido un error desconocido.",
  });
});



export default router;
