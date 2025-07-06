const { body, validationResult } = require("express-validator")

// Validation middleware for transactions
const validateTransaction = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),

  body("type")
    .notEmpty()
    .withMessage("Type is required")
    .isIn(["income", "expense"])
    .withMessage("Type must be either income or expense"),

  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be a positive number greater than 0"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(["food", "transport", "shopping", "bills", "salary", "freelance", "other"])
    .withMessage("Invalid category selected"),

  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be in valid format")
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error("Date cannot be in the future")
      }
      return true
    }),

  body("description").optional().trim().isLength({ max: 500 }).withMessage("Description cannot exceed 500 characters"),

  // Middleware to handle validation errors
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }
    next()
  },
]

// Validation middleware for users
const validateUser = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 50 })
    .withMessage("Name cannot exceed 50 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  // Middleware to handle validation errors
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }
    next()
  },
]

module.exports = {
  validateTransaction,
  validateUser,
}
