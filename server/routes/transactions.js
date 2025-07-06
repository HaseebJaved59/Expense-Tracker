const express = require("express")
const Transaction = require("../models/Transaction")
const { validateTransaction } = require("../middleware/validation")
const { asyncHandler } = require("../middleware/asyncHandler")

const router = express.Router()

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Public (should be protected in production)
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, type, category, startDate, endDate, search } = req.query

    // Build filter object
    const filter = {}

    if (type && ["income", "expense"].includes(type)) {
      filter.type = type
    }

    if (category) {
      filter.category = category
    }

    if (startDate || endDate) {
      filter.date = {}
      if (startDate) filter.date.$gte = new Date(startDate)
      if (endDate) filter.date.$lte = new Date(endDate)
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" }
    }

    // Execute query with pagination
    const transactions = await Transaction.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()

    const total = await Transaction.countDocuments(filter)

    res.status(200).json({
      success: true,
      data: transactions,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
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
    const transaction = await Transaction.findById(req.params.id)

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
    const transaction = await Transaction.create(req.body)

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
    const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

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
    const transaction = await Transaction.findById(req.params.id)

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      })
    }

    await transaction.deleteOne()

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
    const summary = await Transaction.getSummary()

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
    const breakdown = await Transaction.getExpenseBreakdown()

    res.status(200).json({
      success: true,
      data: breakdown,
    })
  }),
)

module.exports = router
