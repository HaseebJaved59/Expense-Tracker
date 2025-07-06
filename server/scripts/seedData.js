const mongoose = require("mongoose")
const dotenv = require("dotenv")
const Transaction = require("../models/Transaction")
const User = require("../models/User")

// Load environment variables
dotenv.config()

// Sample data
const sampleTransactions = [
  {
    title: "Monthly Salary",
    type: "income",
    amount: 3500.0,
    category: "salary",
    date: new Date("2024-01-01"),
    description: "Monthly salary payment",
  },
  {
    title: "Grocery Shopping",
    type: "expense",
    amount: 85.5,
    category: "food",
    date: new Date("2024-01-15"),
    description: "Weekly grocery shopping at supermarket",
  },
  {
    title: "Gas Bill",
    type: "expense",
    amount: 120.0,
    category: "bills",
    date: new Date("2024-01-10"),
    description: "Monthly gas utility bill",
  },
  {
    title: "Uber Ride",
    type: "expense",
    amount: 25.75,
    category: "transport",
    date: new Date("2024-01-12"),
    description: "Ride to downtown",
  },
  {
    title: "Freelance Project",
    type: "income",
    amount: 800.0,
    category: "freelance",
    date: new Date("2024-01-08"),
    description: "Web development project payment",
  },
  {
    title: "Online Shopping",
    type: "expense",
    amount: 150.25,
    category: "shopping",
    date: new Date("2024-01-14"),
    description: "Clothes and accessories",
  },
  {
    title: "Restaurant Dinner",
    type: "expense",
    amount: 65.0,
    category: "food",
    date: new Date("2024-01-16"),
    description: "Dinner with friends",
  },
  {
    title: "Electricity Bill",
    type: "expense",
    amount: 95.3,
    category: "bills",
    date: new Date("2024-01-05"),
    description: "Monthly electricity bill",
  },
]

const sampleUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  password: "password123",
  currency: "USD",
  monthlyBudget: 2000,
}

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/expense-tracker")
    console.log("✅ Connected to MongoDB")

    // Clear existing data
    await Transaction.deleteMany({})
    await User.deleteMany({})
    console.log("🗑️  Cleared existing data")

    // Create sample user
    const user = await User.create(sampleUser)
    console.log("👤 Created sample user")

    // Add userId to transactions and create them
    const transactionsWithUser = sampleTransactions.map((transaction) => ({
      ...transaction,
      userId: user._id,
    }))

    await Transaction.insertMany(transactionsWithUser)
    console.log("💰 Created sample transactions")

    console.log("🎉 Database seeded successfully!")
    console.log(`📊 Created ${sampleTransactions.length} transactions`)
    console.log(`👤 Created 1 user (${user.email})`)

    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  }
}

// Run the seed function
seedDatabase()
