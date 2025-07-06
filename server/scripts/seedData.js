const mongoose = require("mongoose")
const dotenv = require("dotenv")
const Transaction = require("../models/Transaction")
const User = require("../models/User")
const path = require("path")
const { initializeDataFiles, addUser, addTransaction, getUsers, getTransactions } = require("../utils/fileStorage")
const bcrypt = require("bcryptjs")

// Load environment variables
dotenv.config()

// Sample data
const sampleTransactions = [
  {
    title: "Monthly Salary",
    type: "income",
    amount: 3500.0,
    category: "salary",
    date: "2024-01-01",
    description: "Monthly salary payment",
  },
  {
    title: "Grocery Shopping",
    type: "expense",
    amount: 85.5,
    category: "food",
    date: "2024-01-15",
    description: "Weekly grocery shopping at supermarket",
  },
  {
    title: "Gas Bill",
    type: "expense",
    amount: 120.0,
    category: "bills",
    date: "2024-01-10",
    description: "Monthly gas utility bill",
  },
  {
    title: "Uber Ride",
    type: "expense",
    amount: 25.75,
    category: "transport",
    date: "2024-01-12",
    description: "Ride to downtown",
  },
  {
    title: "Freelance Project",
    type: "income",
    amount: 800.0,
    category: "freelance",
    date: "2024-01-08",
    description: "Web development project payment",
  },
  {
    title: "Online Shopping",
    type: "expense",
    amount: 150.25,
    category: "shopping",
    date: "2024-01-14",
    description: "Clothes and accessories",
  },
  {
    title: "Restaurant Dinner",
    type: "expense",
    amount: 65.0,
    category: "food",
    date: "2024-01-16",
    description: "Dinner with friends",
  },
  {
    title: "Electricity Bill",
    type: "expense",
    amount: 95.3,
    category: "bills",
    date: "2024-01-05",
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
    console.log("🌱 Starting database seeding...")

    // Initialize data files
    initializeDataFiles()

    // Clear existing data by reinitializing files
    const fs = require("fs")
    const DATA_DIR = path.join(__dirname, "../data")
    const TRANSACTIONS_FILE = path.join(DATA_DIR, "transactions.json")
    const USERS_FILE = path.join(DATA_DIR, "users.json")

    fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify([], null, 2))
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2))
    console.log("🗑️  Cleared existing data")

    // Create sample user
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(sampleUser.password, salt)

    const userData = {
      ...sampleUser,
      email: sampleUser.email.toLowerCase(),
      password: hashedPassword,
    }

    const user = addUser(userData)
    console.log("👤 Created sample user")

    // Add sample transactions
    sampleTransactions.forEach((transaction) => {
      addTransaction({
        ...transaction,
        userId: user.id,
      })
    })

    console.log("💰 Created sample transactions")

    console.log("🎉 Database seeded successfully!")
    console.log(`📊 Created ${sampleTransactions.length} transactions`)
    console.log(`👤 Created 1 user (${user.email})`)
    console.log(`📁 Data stored in: ${DATA_DIR}`)

    // Display current data counts
    const users = getUsers()
    const transactions = getTransactions()
    console.log(`\n📈 Current data:`)
    console.log(`   Users: ${users.length}`)
    console.log(`   Transactions: ${transactions.length}`)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  }
}

// Run the seed function
if (require.main === module) {
  seedDatabase()
}

module.exports = { seedDatabase }
