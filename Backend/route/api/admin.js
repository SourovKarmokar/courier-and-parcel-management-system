const express = require("express");
const router = express.Router();
const { checkLogin, checkRole } = require("../../middleware/authMiddleware");

// 👇 নাম মিলিয়ে ইম্পোর্ট করা হলো (getAllDeliveryMan)
const { 
  getAllParcels, 
  getAllDeliveryMan, 
  assignAgent, 
  getDashboardStats
} = require("../../controller/adminController");


// ১. সব পার্সেল দেখা (Only Admin)
router.get("/all-parcels", checkLogin, checkRole(["admin"]), getAllParcels);

// ২. সব এজেন্ট দেখা (Only Admin)
// ✅ আগে এখানে ব্র্যাকেট ভুল ছিল, এখন ঠিক করা হয়েছে
router.get("/all-agents", checkLogin, checkRole(["admin"]), getAllDeliveryMan);

// ৩. এজেন্ট এসাইন করা (Only Admin)
router.put("/assign", checkLogin, checkRole(["admin"]), assignAgent);
// ৪. ড্যাশবোর্ড স্ট্যাটাস (Only Admin)
router.get("/dashboard-stats", checkLogin, checkRole(["admin"]), getDashboardStats);

module.exports = router;