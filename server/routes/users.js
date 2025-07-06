const express = require("express")
const bcrypt = require("bcryptjs")
const { validateUser } = require("../middleware/validation")
const { asyncHandler } = require("../middleware/asyncHandler")
const { addUser, getUserByEmail, getUserById, updateUser } = require("../utils/fileStorage")

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
    const existingUser = getUserByEmail(email)
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      })
    }

    // Hash password
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const userData = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      currency: "USD",
      monthlyBudget: 0,
    }

    const user = addUser(userData)

    // Remove password from response
    const { password: _, ...userResponse } = user

    res.status(201).json({
      success: true,
      data: userResponse,
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

    // Check for user
    const user = getUserByEmail(email)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Remove password from response
    const { password: _, ...userResponse } = user

    res.status(200).json({
      success: true,
      data: userResponse,
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
    const user = getUserById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Remove password from response
    const { password: _, ...userResponse } = user

    res.status(200).json({
      success: true,
      data: userResponse,
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

    const user = updateUser(req.params.id, { name, currency, monthlyBudget })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Remove password from response
    const { password: _, ...userResponse } = user

    res.status(200).json({
      success: true,
      data: userResponse,
      message: "Profile updated successfully",
    })
  }),
)

module.exports = router
