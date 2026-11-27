
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      msg: "Debés iniciar sesión",
    });
  }

  if (req.user.rol !== "admin") {
    return res.status(403).json({
      msg: "No tenés permisos para realizar esta operación",
    });
  }

  next();
};

export default isAdmin;
