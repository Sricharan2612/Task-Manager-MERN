const User = require("../models/User");
const Task = require("../models/Task");

const getUsers = async (req, resp) => {
	try {
		const users = await User.find({ role: "member" }).select("-password");

		//Adding task counts to each user
		const usersWithTaskCounts = await Promise.all(
			users.map(async (user) => {
				const pendingTasks = await Task.countDocuments({
					assignedTo: user._id,
					status: "Pending",
				});
				const inProgressTasks = await Task.countDocuments({
					assignedTo: user._id,
					status: "In Progress",
				});
				const completedTasks = await Task.countDocuments({
					assignedTo: user._id,
					status: "Completed",
				});

				return {
					...user._doc,
					pendingTasks,
					inProgressTasks,
					completedTasks,
				};
			})
		);

		resp.json(usersWithTaskCounts);
	} catch (error) {
		resp.status(500).json({ message: "Server error", error: error.message });
	}
};

const getUserById = async (req, resp) => {
	try {
		const user = await User.findById(req.params.id).select("-password");

		if (!user) {
			return resp.status(404).json({ message: "User not found" });
		}

		const pendingTasks = await Task.countDocuments({
			assignedTo: user._id,
			status: "Pending",
		});
		const inProgressTasks = await Task.countDocuments({
			assignedTo: user._id,
			status: "In Progress",
		});
		const completedTasks = await Task.countDocuments({
			assignedTo: user._id,
			status: "Completed",
		});

		resp.json({
			...user._doc,
			pendingTasks,
			inProgressTasks,
			completedTasks,
		});
	} catch (error) {
		resp.status(500).json({ message: "Server error", error: error.message });
	}
};

const deleteUser = async (req, resp) => {
	try {
		const id = req.params.id;
		const user = await User.deleteOne({ id });
	} catch (error) {
		resp.status(500).json({ message: "Server error", error: error.message });
	}
};

module.exports = { getUsers, getUserById, deleteUser };
