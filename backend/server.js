require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

//Middleware to handle cors
app.use(
	cors({
		origin: process.env.CLIENT_URL || "*",
		methods: ["GET", "POST", "PATCH", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

//Connecting Database
connectDB();

//Middleware
app.use(express.json());

//Routes
// app.use("/api/auth", authRoutes)
// app.use("/api/users", userRoutes)
// app.use("/app/tasks",taskRoutes)
// app.use("/app/reports",reportRoutes)

//Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
