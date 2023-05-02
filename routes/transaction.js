const express = require("express");
const router = express.Router();
const TransactionController = require("../controllers/TransactionController");
const { isAuthenticated, isAdmin } = require("../middleware/isAuthenticated");

router.get(
  "/transactions",
  isAuthenticated,
  isAdmin,
  TransactionController.getAllTransaction
);

module.exports = router;
