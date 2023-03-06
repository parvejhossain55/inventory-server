const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const { user } = jwt.verify(token, process.env.JWT_SECRET);

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const isAdmin = async (req, res, next) => {
  const userRole = req.user.role;
  if (userRole !== "admin") {
    return res
      .status(403)
      .json({ message: "Access denied: User is not an admin" });
  }
  next();
};

module.exports = { isAuthenticated, isAdmin };
