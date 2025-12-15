const Task = require("../models/Task");

const getTasks = async (req, resp) => {
	try {
		const { status } = req.query;
		let filter = {};
		if (status) {
			filter.status = status;
		}

		let tasks;
		if (req.user.role === "admin") {
			tasks = await Task.find(filter).populate(
				"assignedTo",
				"name email profileImageUrl"
			);
		} else {
			tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(
				"assignedTo",
				"name email profileImageUrl"
			);
		}
		//Adding completed todos checklist count to each task
		tasks = await Promise.all(
			tasks.map(async (task) => {
				const completedCount = task.todoCheckList.filter(
					(todo) => todo.completed
				).length;
				return { ...task._doc, completedTodoCount: completedCount };
			})
		);

		//Status summary counts
		const allTasks = await Task.countDocuments(
			req.user.role === "admin" ? {} : { assignedTo: req.user._id }
		);

		const pendingTasks = await Task.countDocuments({
			...filter,
			status: "Pending",
			...(req.user.role !== "admin" && { assignedTo: req.user._id }),
		});
		const inProgressTasks = await Task.countDocuments({
			...filter,
			status: "In Progress",
			...(req.user.role !== "admin" && { assignedTo: req.user._id }),
		});

		const completedTasks = await Task.countDocuments({
			...filter,
			status: "Completed",
			...(req.user.role !== "admin" && { assignedTo: req.user._id }),
		});

		resp.json({
			tasks,
			statusSummary: {
				all: allTasks,
				pendingTasks,
				inProgressTasks,
				completedTasks,
			},
		});
	} catch (error) {
		resp.status(500).json({ message: "Server error", error: error.message });
	}
};

const getTaskById = async (req, resp) => {
	try {
		const task = await Task.findById(req.params.id).populate(
			"assignedTo",
			"name email profileImageUrl"
		);

		if (!task) {
			resp.status(404).json({ message: "Task not found" });
		}

		resp.json(task);
	} catch (error) {
		resp.status(500).json({ message: "Server error", error: error.message });
	}
};

const createTask = async (req, resp) => {
	try {
		const {
			title,
			description,
			priority,
			dueDate,
			assignedTo,
			attachments,
			todoCheckList,
		} = req.body;

		if (!Array.isArray(assignedTo)) {
			return resp
				.status(400)
				.json({ message: "assignedTo must be an array of user IDs" });
		}

		const task = await Task.create({
			title,
			description,
			priority,
			dueDate,
			assignedTo,
			createdBy: req.user._id,
			attachments,
			todoCheckList,
		});
		resp.status(201).json({ message: "Task created successfully", task });
	} catch (error) {
		resp.status(500).json({ message: "Server error", error: error.message });
	}
};

const updateTask = async (req, resp) => {
	try {
		const task = await Task.findById(req.params.id);

		if (!task) return resp.status(404).json({ message: "Task not found" });

		task.title = req.body.title || task.title;
		task.description = req.body.description || task.description;
		task.priority = req.body.priority || task.priority;
		task.dueDate = req.body.dueDate || task.dueDate;
		task.todoCheckList = req.body.todoCheckList || task.todoCheckList;
		task.attachments = req.body.attachments || task.attachments;

		if (req.body.assignedTo) {
			if (!Array.isArray(req.body.assignedTo)) {
				return resp
					.status(400)
					.json({ message: "assignedTo must be an array of user IDs" });
			}
		}
		task.assignedTo = req.body.assignedTo;

		const updatedTask = await task.save();
		resp.json({ message: "Task updated successfully", updatedTask });
	} catch (error) {
		resp.status(500).json({ message: "Server error", error: error.message });
	}
};

const deleteTask = async (req, resp) => {
	try {
		const task = await Task.findById(req.params.id);
		if (!task) return resp.status(404).json({ message: "Task not found" });

		await task.deleteOne();
		resp.json({ message: "Task deleted successfully" });
	} catch (error) {
		resp.status(500).json({ message: "Server error", error: error.message });
	}
};

const updateTaskStatus = async (req, resp) => {
	try {
		const task = await Task.findById(req.params.id);
		if (!task) return resp.status(404).json({ message: "Task not found" });

		const isAssigned = task.assignedTo.some(
			(userId) => userId.toString() === req.user._id.toString()
		);

		if (!isAssigned && req.user.role !== "admin") {
			return resp.status(403).json({ message: "Not authorized" });
		}

		task.status = req.body.status || task.status;

		if (task.status === "Completed") {
			task.todoCheckList.forEach((item) => (item.completed = true));
			task.progress = 100;
		}

		await task.save();
		resp.json({ message: "Task status updated successfully", task });
	} catch (error) {
		resp.status(500).json({ message: "Server error", error: error.message });
	}
};

const updateTaskChecklist = async (req, resp) => {
	try {
		const { todoCheckList } = req.body;
		const task = await Task.findById(req.params.id);

		if (!task) return resp.status(404).json({ message: "Task not found" });
		if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
			return resp
				.status(403)
				.json({ message: "Not authorized to update checklist" });
		}

		task.todoCheckList = todoCheckList;

		const completedCount = task.todoCheckList.filter(
			(item) => item.completed
		).length;
		const totalItems = task.todoCheckList.length;
		task.progress =
			totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

		if (task.progress === 100) {
			task.status = "Completed";
		} else if (task.progress > 0) {
			task.status = "In Progress";
		} else {
			task.status = "Pending";
		}

		await task.save();

		const updatedTask = await Task.findById(req.params.id).populate(
			"assignedTo",
			"name email profileImageUrl"
		);
		resp.json({ message: "Task checklist updated", task: updatedTask });
	} catch (error) {
		resp.status(500).json({ message: "Server error", error: error.message });
	}
};

const getDashboardData = async (req, resp) => {
	try {
	} catch (error) {
		resp.status(500).json({ message: "Server error", error: error.message });
	}
};
const getUserDashboardData = async (req, resp) => {
	try {
	} catch (error) {
		resp.status(500).json({ message: "Server error", error: error.message });
	}
};

module.exports = {
	getTasks,
	getTaskById,
	createTask,
	updateTask,
	deleteTask,
	updateTaskStatus,
	updateTaskChecklist,
	getDashboardData,
	getUserDashboardData,
};
