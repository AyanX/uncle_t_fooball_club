const {
  generateToken,
  verifyRefreshToken,
  verifyToken,
  generateRefreshToken,
} = require("./jwt");

const verifyRefreshTokenFunc = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

console.log("Verifying refresh token:", refreshToken);

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
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (e) {
    console.error("Error verifying refresh token:", e);
     return res.status(401).json({ error: "Unauthorized" });

  }
};

const useAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
        console.error("No token provided, checking refresh token");
      //check refresh token
      return verifyRefreshTokenFunc(req, res, next);
    } else {
      //token exists, verify it
      const decoded = verifyToken(token);
      if (decoded) {
        req.user = decoded;
        return next();
      }
    }
    console.error("Invalid token");
    verifyRefreshTokenFunc(req, res, next)
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};


module.exports = useAuth;