const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Validate environment variables for Nodemailer
const requiredEnvVars = ["EMAIL_USER", "EMAIL_PASSWORD"];
const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName],
);

if (missingEnvVars.length > 0) {
  console.warn("⚠️  Warning: Missing Nodemailer environment variables:");
  missingEnvVars.forEach((varName) => console.warn(`   - ${varName}`));
  console.warn(
    "   Emails will not be sent until these are configured in .env file",
  );
}

const taskRoutes = require("./routes/tasks");
const { startEmailScheduler } = require("./services/emailScheduler");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/todoapp";

// View engine setup
app.set("view engine", "ejs");
app.set("views", "./views");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(".")); // Serve static files (CSS, JS, images)

// Routes
app.use("/api/tasks", taskRoutes);

// MongoDB Connection
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    // Start email scheduler after DB connection is established
    startEmailScheduler();
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Basic route - render EJS template
app.get("/", (req, res) => {
  res.render("index");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Make sure MongoDB is running and accessible at: ${MONGODB_URI}`);
});
