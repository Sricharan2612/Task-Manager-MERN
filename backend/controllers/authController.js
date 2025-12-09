const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
	return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// @desc Register user
// @route POST /api/auth/register
// @access Public
const registerUser = async (req, resp) => {
	try {
		const { name, email, password, profileImageUrl, adminInviteToken } =
			req.body;

		const userExists = await User.findOne({ email });
		if (userExists) {
			return resp.status(400).json({ message: "User already exists" });
		}

		//Determine user role: Admin if correct token is provided, otherwise Member
		let role = "member";
		if (
			adminInviteToken &&
			adminInviteToken == process.env.ADMIN_INVITE_TOKEN
		) {
			role = "admin";
		}

		//Hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		//Create new user
		const user = await User.create({
			name,
			email,
			password: hashedPassword,
			profileImageUrl,
			role,
		});

		resp.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			profileImageUrl: user.profileImageUrl,
			token: generateToken(user._id),
		});
	} catch (error) {
		resp.status(500).json({ message: "Server error", error: error.message });
	}
};

// @desc Login user
// @route POST /api/auth/login
// @access Public
const loginUser = async (req, resp) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });
		if (!user) {
			return resp.status(401).json({ message: "Invalid email or password" });
		}

		//compare password
		const isPasswordMatch = await bcrypt.compare(password, user.password);
		if (!isPasswordMatch) {
			return resp.status(401).json({ message: "Invalid email or password" });
		}

		//Return user data with JWT
		resp.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			profileImageUrl: user.profileImageUrl,
			token: generateToken(user._id),
		});
	} catch (error) {
		resp.status(500).json({ message: "Server error", error: error.message });
	}
};

// @desc Get user details
// @route GET /api/auth/profile
// @access Private(Requires JWT)
const getUserProfile = async (req, resp) => {
	try {
		const user = await User.findById(req.user.id).select("-password");
		if (!user) {
			return resp.status(404).json({ message: "User not found" });
		}

		resp.json(user);
	} catch (error) {
		resp.status(500).json({ message: "Server error", error: error.message });
	}
};

// @desc patch user details
// @route PATCH /api/auth/profile
// @access Private(Requires JWT)
const updateUserProfile = async (req, resp) => {
	try {
		const user = await User.findById(req.user.id).select("-password");
		if (!user) {
			return resp.status(404).json({ message: "User not found" });
		}

		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;
		user.role = req.body.role || user.role;
		user.profileImageUrl = req.body.profileImageUrl || user.profileImageUrl;

		if (req.body.password) {
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(req, body.password, salt);
		}

		const updatedUser = await user.save();
		resp.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			role: updatedUser.role,
			profileImageUrl: updatedUser.profileImageUrl,
			token: generateToken(updatedUser._id),
		});
	} catch (error) {
		resp.status(500).json({ message: "Server error", error: error.message });
	}
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
