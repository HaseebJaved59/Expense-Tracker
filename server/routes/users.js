const express = require("express")
const User = require("../models/User")
const { validateUser } = require("../middleware/validation")
const { asyncHandler } = require("../middleware/asyncHandler")

const router = express.Router()

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
router.post(
  "/register",
  validateUser,
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      })
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    })

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        monthlyBudget: user.monthlyBudget,
      },
      message: "User registered successfully",
    })
  }),
)

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      })
    }

    // Check for user and include password
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        monthlyBudget: user.monthlyBudget,
      },
      message: "Login successful",
    })
  }),
)

// @desc    Get user profile
// @route   GET /api/users/profile/:id
// @access  Public (should be protected)
router.get(
  "/profile/:id",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      data: user,
    })
  }),
)

// @desc    Update user profile
// @route   PUT /api/users/profile/:id
// @access  Public (should be protected)
router.put(
  "/profile/:id",
  asyncHandler(async (req, res) => {
    const { name, currency, monthlyBudget } = req.body

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, currency, monthlyBudget },
      {
        new: true,
        runValidators: true,
      },
    )

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      data: user,
      message: "Profile updated successfully",
    })
  }),
)

module.exports = router
