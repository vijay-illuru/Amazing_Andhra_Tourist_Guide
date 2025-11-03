import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ success: false, message: "You're not authorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(401).json({ success: false, message: "Token is invalid" });
    }
    req.user = user;
    next();
  });
};

export const verifyUser = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ success: false, message: "You're not authorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(401).json({ success: false, message: "Token is invalid" });
    }
    req.user = user;
    
    // Check if user is authorized (either the owner or admin)
    // If no :id param (e.g., /profile/me), just verify user is authenticated
    if (req.user && (!req.params.id || req.user.id === req.params.id || req.user.role === "admin")) {
      next();
    } else {
      return res
        .status(401)
        .json({ success: false, message: "You're not authenticated" });
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ success: false, message: "You're not authorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(401).json({ success: false, message: "Token is invalid" });
    }
    req.user = user;
    
    // Check if user is admin
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({ success: false, message: "You're not authorized" });
    }
  });
};
