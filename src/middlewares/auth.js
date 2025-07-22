const authMiddleware = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/api/users/login'); // o donde corresponda
  }
  };

  
  
  export default authMiddleware;