const express = require("express")
const { validateTransaction } = require("../middleware/validation")
const { asyncHandler } = require("../middleware/asyncHandler")
const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionById,
  calculateSummary,
  calculateExpenseBreakdown,
} = require("../utils/fileStorage")

const router = express.Router()

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Public
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, type, category, startDate, endDate, search } = req.query

    let transactions = getTransactions()

    // Apply filters
    if (type && ["income", "expense"].includes(type)) {
      transactions = transactions.filter((t) => t.type === type)
    }

    if (category) {
      transactions = transactions.filter((t) => t.category === category)
    }

    if (startDate || endDate) {
      transactions = transactions.filter((t) => {
        const transactionDate = new Date(t.date)
        const start = startDate ? new Date(startDate) : null
        const end = endDate ? new Date(endDate) : null

        if (start && transactionDate < start) return false
        if (end && transactionDate > end) return false
        return true
      })
    }

    if (search) {
      const searchLower = search.toLowerCase()
      transactions = transactions.filter((t) => t.title.toLowerCase().includes(searchLower))
    }

    // Sort by date (newest first)
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date))

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + Number.parseInt(limit)
    const paginatedTransactions = transactions.slice(startIndex, endIndex)

    res.status(200).json({
      success: true,
      data: paginatedTransactions,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        total: transactions.length,
        pages: Math.ceil(transactions.length / limit),
      },
    })
  }),
)

// @desc    Get transaction by ID
// @route   GET /api/transactions/:id
// @access  Public
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const transaction = getTransactionById(req.params.id)

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      })
    }

    res.status(200).json({
      success: true,
      data: transaction,
    })
  }),
)

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Public
router.post(
  "/",
  validateTransaction,
  asyncHandler(async (req, res) => {
    const transaction = addTransaction(req.body)

    res.status(201).json({
      success: true,
      data: transaction,
      message: "Transaction created successfully",
    })
  }),
)

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Public
router.put(
  "/:id",
  validateTransaction,
  asyncHandler(async (req, res) => {
    const transaction = updateTransaction(req.params.id, req.body)

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      })
    }

    res.status(200).json({
      success: true,
      data: transaction,
      message: "Transaction updated successfully",
    })
  }),
)

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Public
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const deleted = deleteTransaction(req.params.id)

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    })
  }),
)

// @desc    Get transaction summary
// @route   GET /api/transactions/summary/stats
// @access  Public
router.get(
  "/summary/stats",
  asyncHandler(async (req, res) => {
    const summary = calculateSummary()

    res.status(200).json({
      success: true,
      data: summary,
    })
  }),
)

// @desc    Get expense breakdown by category
// @route   GET /api/transactions/summary/breakdown
// @access  Public
router.get(
  "/summary/breakdown",
  asyncHandler(async (req, res) => {
    const breakdown = calculateExpenseBreakdown()

    res.status(200).json({
      success: true,
      data: breakdown,
    })
  }),
)

module.exports = router
