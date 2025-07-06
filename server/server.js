const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const path = require("path")
const transactionRoutes = require("./routes/transactions")
const userRoutes = require("./routes/users")
const { errorHandler } = require("./middleware/errorHandler")
const { initializeDataFiles } = require("./utils/fileStorage")

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Initialize data files
initializeDataFiles()

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/transactions", transactionRoutes)
app.use("/api/users", userRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Expense Tracker API is running (File-based storage)",
    timestamp: new Date().toISOString(),
    storage: "JSON Files",
  })
})

// Error handling middleware
app.use(errorHandler)

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`💾 Using file-based storage`)
  console.log(`📁 Data files location: ${path.join(__dirname, "data")}`)
})

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down server...")
  process.exit(0)
})

module.exports = app
