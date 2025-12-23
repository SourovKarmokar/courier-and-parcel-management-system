const express = require("express");
const router = express.Router();
const { checkLogin, checkRole } = require("../../middleware/authMiddleware");
const { getMyJobs, updateDeliveryStatus } = require("../../controller/agentController");

// ১. আমার কাজ দেখা (Only Agent)
router.get("/my-jobs", checkLogin, checkRole(["agent"]), getMyJobs);

// ২. স্ট্যাটাস আপডেট করা (Only Agent)
router.put("/update-status", checkLogin, checkRole(["agent"]), updateDeliveryStatus);

module.exports = router;