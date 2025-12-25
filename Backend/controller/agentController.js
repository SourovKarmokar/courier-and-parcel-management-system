const Parcel = require("../model/parcelSchema");

// ===============================
// Agent: My Assigned Jobs
// ===============================
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Parcel.find({
      deliveryManId: req.userid,
    })
      .populate("senderId", "firstName email phone")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: jobs });
  } catch (err) {
    res.status(500).json({ error: "Failed to get jobs" });
  }
};

// ===============================
// Agent: Update Delivery Status
// ===============================
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { parcelId, status } = req.body;

    const valid = ["picked_up", "in_transit", "delivered", "failed"];
    if (!valid.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const parcel = await Parcel.findOneAndUpdate(
      { _id: parcelId, deliveryManId: req.userid },
      { status },
      { new: true }
    );

    if (!parcel) {
      return res.status(404).json({ error: "Parcel not found" });
    }

    // 🔥 REALTIME to CUSTOMER
    const io = req.app.get("io");
    io?.to(`customer_${parcel.senderId}`).emit("parcel-status-updated", {
      parcelId: parcel._id,
      status: parcel.status,
    });

    console.log(`📡 Realtime sent to customer_${parcel.senderId}`);

    res.json({ success: true, data: parcel });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
};
