// Autenticación basada en sesión
export const isAuthenticated = (req, res, next) => {
  if (req.session?.user) {
    return next();
  }
  res.redirect("/login"); 
};

// Autorización por rol
export const isAdmin = (req, res, next) => {
  const user = req.user || req.session.user; // soporte para JWT o sesión
  if (!user || user.role !== "ADMIN") {
     req.session.errorMessage = "Acceso restringido a administradores";
    return res.redirect("/failed");
  }
  next();
};