const User = require("../models/User");
const brcypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
	return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// @desc Register user
// @route POST /api/auth/register
// @access Public
const registerUser = async (req, resp) => {};

// @desc Login user
// @route POST /api/auth/login
// @access Public
const loginUser = async (req, resp) => {};

// @desc Get user details
// @route GET /api/auth/profile
// @access Private(Requires JWT)
const getUserProfile = async (req, resp) => {};

// @desc patch user details
// @route PATCH /api/auth/profile
// @access Private(Requires JWT)
const updateUserProfile = async (req, resp) => {};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
