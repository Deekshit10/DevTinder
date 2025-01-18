const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isAuthorized = token === "xyz";
  if (!isAuthorized) {
    res.status(401), send("admin is not authorized");
  }
  next();
};

module.exports = {
  adminAuth,
};
