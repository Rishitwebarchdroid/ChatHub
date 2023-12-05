const express = require("express");
const { protect } = require("../middleware/authMiddeleware");
const { model } = require("mongoose");
const {
  sendMessage,
  allMessages,
} = require("../controllers/messageControllers");

const router = express.Router();

// To send a message
router.route("/").post(protect, sendMessage);

// To Fetch all Message of a chatId
router.route("/:chatId").get(protect, allMessages);

module.exports = router;
