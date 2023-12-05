const express = require("express");
const {
  registerUser,
  authUser,
  allUser,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddeleware");

const router = express.Router();

// For Registration --> post

// To search User name or email --> get
// Call protect to check if user is loged in or not and continue searching other user
router.route("/").post(registerUser).get(protect, allUser);

// // For Aunthetication
router.route("/login").post(authUser);

module.exports = router;
