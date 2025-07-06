const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Transaction title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    type: {
      type: String,
      required: [true, "Transaction type is required"],
      enum: {
        values: ["income", "expense"],
        message: "Type must be either income or expense",
      },
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
      validate: {
        validator: (value) => Number.isFinite(value) && value > 0,
        message: "Amount must be a valid positive number",
      },
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["food", "transport", "shopping", "bills", "salary", "freelance", "other"],
        message: "Invalid category selected",
      },
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      validate: {
        validator: (value) => value <= new Date(),
        message: "Date cannot be in the future",
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // For now, making it optional for demo purposes
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Indexes for better query performance
transactionSchema.index({ userId: 1, date: -1 })
transactionSchema.index({ type: 1 })
transactionSchema.index({ category: 1 })

// Virtual for formatted amount
transactionSchema.virtual("formattedAmount").get(function () {
  return `$${this.amount.toFixed(2)}`
})

// Static method to get summary statistics
transactionSchema.statics.getSummary = async function (userId = null) {
  const matchStage = userId ? { userId: new mongoose.Types.ObjectId(userId) } : {}

  const summary = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalIncome: {
          $sum: {
            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
          },
        },
        totalExpenses: {
          $sum: {
            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
          },
        },
        transactionCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        totalIncome: 1,
        totalExpenses: 1,
        currentBalance: { $subtract: ["$totalIncome", "$totalExpenses"] },
        transactionCount: 1,
      },
    },
  ])

  return (
    summary[0] || {
      totalIncome: 0,
      totalExpenses: 0,
      currentBalance: 0,
      transactionCount: 0,
    }
  )
}

// Static method to get expense breakdown by category
transactionSchema.statics.getExpenseBreakdown = async function (userId = null) {
  const matchStage = userId ? { userId: new mongoose.Types.ObjectId(userId), type: "expense" } : { type: "expense" }

  return await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        amount: "$total",
        count: 1,
        percentage: {
          $multiply: [{ $divide: ["$total", { $sum: "$total" }] }, 100],
        },
      },
    },
    { $sort: { amount: -1 } },
  ])
}

module.exports = mongoose.model("Transaction", transactionSchema)
