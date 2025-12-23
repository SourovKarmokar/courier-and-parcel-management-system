const Parcel = require("../model/parcelSchema");

// ১. আমার কাজগুলো দেখা (Get My Jobs)
exports.getMyJobs = async (req, res) => {
  try {
    // লগইন করা এজেন্টের ID (req.userid) দিয়ে পার্সেল খুঁজবো
    const myParcels = await Parcel.find({ deliveryManId: req.userid })
      .populate("senderId", "firstName email phone") // সেন্ডারের তথ্য
      .populate("assignedBy", "firstName email") // কোন এডমিন দিয়েছে
      .sort({ createdAt: -1 });

    res.status(200).json(myParcels);
  } catch (error) {
    res.status(500).json({ error: "Failed to get jobs" });
  }
};

// ২. স্ট্যাটাস আপডেট করা (Update Delivery Status)
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { parcelId, status } = req.body;

    // স্ট্যাটাস ভ্যালিডেশন
    const validStatuses = ["picked", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status update" });
    }

    const updatedParcel = await Parcel.findByIdAndUpdate(
      parcelId,
      { status: status },
      { new: true }
    );

    if (!updatedParcel) {
      return res.status(404).json({ error: "Parcel not found" });
    }

    res.status(200).json({
      message: "Status updated successfully!",
      data: updatedParcel
    });

  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
};