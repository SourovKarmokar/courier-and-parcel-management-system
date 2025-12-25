const express = require("express");
const router = express.Router();

const { checkLogin, checkRole } = require("../../middleware/authMiddleware");
const agentController = require("../../controller/agentController");

// ===============================
// Agent Routes
// ===============================

// 1️⃣ Agent: My Assigned Jobs
router.get(
  "/my-jobs",
  checkLogin,
  checkRole(["agent"]),
  agentController.getMyJobs
);

// 2️⃣ Agent: Update Delivery Status
router.put(
  "/update-status",
  checkLogin,
  checkRole(["agent"]),
  agentController.updateDeliveryStatus
);

module.exports = router;
