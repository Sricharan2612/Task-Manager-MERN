const express = require("express");
const {
	loginUser,
	registerUser,
	getUserProfile,
	updateUserProfile,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post("/register", registerUser); //Register User
router.post("/login", loginUser); //Login User
router.get("/profile", protect, getUserProfile); //Get User Details
router.patch("/profile", protect, updateUserProfile); //Update User Details

router.post("/upload-image", upload.single("image"), (req, resp) => {
	if (!req.file) {
		return resp.status(400).json({ message: "No file uploaded" });
	}
	const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
		req.file.filename
	}`;

	resp.status(200).json({ imageUrl });
});

module.exports = router;
