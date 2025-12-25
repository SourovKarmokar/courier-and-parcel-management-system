const express = require("express");
const router = express.Router();
const { checkLogin, checkRole } = require("../../middleware/authMiddleware");
const Parcel = require("../../model/parcelSchema");

// ===============================
// CUSTOMER: My Parcels
// ===============================
router.get(
  "/my-parcels",
  checkLogin,
  checkRole(["customer"]),
  async (req, res) => {
    try {
      const parcels = await Parcel.find({
        senderId: req.userid,
      })
        .populate("deliveryManId", "firstName lastName phone")
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: parcels,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to load parcels" });
    }
  }
);

module.exports = router;
