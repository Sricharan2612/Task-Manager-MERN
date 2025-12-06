import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Dashboard from "./pages/Admin/Dashboard";
import ManageTasks from "./pages/Admin/ManageTasks";
import CreateTask from "./pages/Admin/CreateTask";
import ManageUsers from "./pages/Admin/ManageUsers";
import UserDashboard from "./pages/User/UserDashboard";
import MyTasks from "./pages/User/MyTasks";
import ViewTaskDetails from "./pages/User/ViewTaskDetails";
import PrivateRoute from "./routes/PrivateRoute";

const App = () => {
	return (
		<div>
			<Routes>
				<Route
					path="/login"
					element={<Login />}
				/>
				<Route
					path="/signup"
					element={<Signup />}
				/>

				{/* Admin Roles */}
				<Route element={<PrivateRoute allowedRoles={["admin"]} />}>
					<Route
						path="/admin/dashboard"
						element={<Dashboard />}
					/>
					<Route
						path="/admin/tasks"
						element={<ManageTasks />}
					/>
					<Route
						path="/admin/create-task"
						element={<CreateTask />}
					/>
					<Route
						path="/admin/users"
						element={<ManageUsers />}
					/>
				</Route>

				{/* Admin Roles */}
				<Route element={<PrivateRoute allowedRoles={["user"]} />}>
					<Route
						path="/user/dashboard"
						element={<UserDashboard />}
					/>
					<Route
						path="/user/tasks"
						element={<MyTasks />}
					/>
					<Route
						path="/user/task-details/:id"
						element={<ViewTaskDetails />}
					/>
					<Route
						path="/user/users"
						element={<ManageUsers />}
					/>
				</Route>
			</Routes>
		</div>
	);
};

export default App;
