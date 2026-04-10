const {
  generateToken,
  verifyRefreshToken,
  verifyToken,
  generateRefreshToken,
} = require("./jwt");

const verifyRefreshTokenFunc = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    console.error("No refresh token provided , forbidden");
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);

    if (decoded) {
     // generate new access token
      const newAccessToken = generateToken({ email: decoded.email});
      const newRefreshToken = generateRefreshToken({ email: decoded.email});
      res.cookie("token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 10 minutes
      }).cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      req.user = decoded;
      return next();
    } else {
      console.error("Invalid refresh token");
      return res.status(403).json({ error: "Unauthorized" });
    }
  } catch (e) {
    console.error("Error verifying refresh token:", e);
     return res.status(403).json({ error: "Unauthorized" });

  }
};

const useAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return verifyRefreshTokenFunc(req, res, next);
    }

    try {
      const decoded = verifyToken(token);
      req.user = decoded;
      return next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return verifyRefreshTokenFunc(req, res, next);
      }
      return res.status(403).json({ error: "Unauthorized" });
    }

  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(403).json({ error: "Unauthorized" });
  }
};


module.exports = useAuth;