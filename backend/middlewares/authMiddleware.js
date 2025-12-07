const jwt = require("jsonwebtoken");
const User = require("../models/User");

//Middleware to protect routes

const protect = async (req, resp, next) => {
	try {
		const token = req.headers.authorization;

		if (token && token.startsWith("Bearer")) {
			token = token.split(" ")[1];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.user = await User.findById(decoded.id).select("-password");
			next();
		} else {
			resp.status(401).json({ message: "Not authorized, no token" });
		}
	} catch (error) {
		resp.status(401).json({ message: "Token failed", error: error.message });
	}
};

//Middleware for Admin-only access

const adminOnly = (req, resp, next) => {
	if (req.user.role && req.user.role === "admin") {
		next();
	} else {
		resp.status(403).json({ message: "Access denied, admin only" });
	}
};

module.exports = { protect, adminOnly };
