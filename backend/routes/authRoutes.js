const express = require("express");
const {
	loginUser,
	registerUser,
	getUserProfile,
	updateUserProfile,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerUser); //Register User
router.post("/login", loginUser); //Login User
router.get("/profile", protect, getUserProfile); //Get User Details
router.patch("/profile", protect, updateUserProfile); //Update User Details

module.exports = router;
