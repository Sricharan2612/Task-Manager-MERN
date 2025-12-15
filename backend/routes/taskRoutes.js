const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const {
	getDashboardData,
	getUserDashboardData,
	getTasks,
	getTaskById,
	createTask,
	updateTask,
	deleteTask,
	updateTaskStatus,
	updateTaskChecklist,
} = require("../controllers/taskController");

const router = express.Router();

router.get("/dashboard-data", protect, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);
router.get("/", protect, getTasks);
router.get("/:id", protect, getTaskById);
router.post("/create-task", protect, adminOnly, createTask);
router.patch("/update-task/:id", protect, updateTask);
router.delete("/delete-task/:id", protect, adminOnly, deleteTask);
router.patch("/update-status/:id", protect, updateTaskStatus);
router.patch("/update-todo/:id", protect, updateTaskChecklist);

module.exports = router;
