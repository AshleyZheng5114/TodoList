require("dotenv").config();

const express = require("express");
const cors = require("cors");
const passport = require("passport");
const connectDB = require("./config/db");
const app = express();

// middleware
// Allow CORS requests from the frontend URL specified in environment variables
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, // Allow cookies to be sent in cross-origin requests
  }),
);

// parsing JSON request bodies
app.use(express.json());

// Initialize Passport for authentication
app.use(passport.initialize());

// Connect to database
connectDB();

// routes
app.use("api/auth", require("./routes/auth"));
app.use("/api/todos", require("./routes/todos"));

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🚀 Server 正在运行！                  ║
║   📍 http://localhost:${PORT}               ║
║   🌍 Frontend: http://localhost:4200   ║
║   🗄️  MongoDB: ${process.env.MONGODB_URI}    ║
╚════════════════════════════════════════╝
  `);
});
