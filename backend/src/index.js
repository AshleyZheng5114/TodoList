require("dotenv").config();

const express = require("express");
const app = express();

const startServer = async () => {
  try {
    // Connect to the database
    const connectDB = require("./config/db");
    await connectDB(); // wait for the database connection to be established before starting the server

    // After successful database connection, set up middleware and routes
    const PORT = process.env.PORT || 3000; // Use the PORT from environment variables or default to 3000
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1); // Exit the process with an error code
  }
};

// middleware
app.use(express.json());

// routes
app.use("/api/todos", require("./routes/todos"));

startServer(); // Start the server after setting up everything
