const express = require("express");
const router = express.Router();
const { checkLogin, checkRole } = require("../../middleware/authMiddleware");

const {
  getAllParcels,
  getAllDeliveryMan,
  assignAgent,
  getAllUsers,
  deleteUser,
  updateUserRole,
} = require("../../controller/adminController");

// ✅ URLs MUST match frontend
router.get("/parcels", checkLogin, checkRole(["admin"]), getAllParcels);
router.get("/agents", checkLogin, checkRole(["admin"]), getAllDeliveryMan);
router.put("/assign-agent", checkLogin, checkRole(["admin"]), assignAgent);


// 🔥 USERS CRUD
router.get("/users", checkLogin, checkRole(["admin"]), getAllUsers);
router.delete("/users/:id", checkLogin, checkRole(["admin"]), deleteUser);

router.put("/users/:id/role", checkLogin, checkRole(["admin"]), updateUserRole);


module.exports = router;
