const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes - verifies JWT token
const protect = async (req, res, next) => {
    let token;

    // Check Bearer header first, then query parameter (for report downloads)
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.query.token) {
        token = req.query.token;
    }

    if (token) {
        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token (exclude password)
            req.user = await User.findById(decoded.id).select("-password");

            next();
        } catch (error) {
            console.error("Auth middleware error:", error.message);
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
};

module.exports = { protect };
