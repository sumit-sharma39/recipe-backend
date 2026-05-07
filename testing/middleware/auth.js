const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    // check Authorization header first, then cookie as fallback
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1] || req.cookies.token;

    if (!token)
        return res.status(401).json({ error: "Not authenticated" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};

module.exports = auth;