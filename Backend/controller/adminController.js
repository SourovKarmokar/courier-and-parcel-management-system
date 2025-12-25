const Parcel = require("../model/parcelSchema");
const User = require("../model/userSchema");

// ================= ALL PARCELS =================
exports.getAllParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find()
      .populate("senderId", "firstName email")
      .populate("deliveryManId", "firstName phone")
      .populate("assignedBy", "firstName email")
      .sort({ createdAt: -1 });

    res.status(200).json(parcels);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch parcels" });
  }
};

// ================= ALL AGENTS =================
exports.getAllDeliveryMan = async (req, res) => {
  try {
    const agents = await User.find({ role: "agent" }).select("-password");
    res.status(200).json(agents);
  } catch {
    res.status(500).json({ error: "Failed to fetch agents" });
  }
};

// ================= ASSIGN AGENT =================
exports.assignAgent = async (req, res) => {
  try {
    const { parcelId, agentId } = req.body;
    const adminId = req.userid;

    const parcel = await Parcel.findByIdAndUpdate(
      parcelId,
      {
        deliveryManId: agentId,
        status: "assigned",
        assignedBy: adminId,
      },
      { new: true }
    ).populate("deliveryManId", "firstName");

    if (!parcel) {
      return res.status(404).json({ error: "Parcel not found" });
    }

    const io = req.app.get("io");

    // 🔥 REALTIME → AGENT
    io.to(`agent_${agentId}`).emit("new-job-assigned", {
      parcel,
    });

    // 🔥 REALTIME → ADMIN (optional)
    io.emit("parcel-updated", {
      parcelId,
      status: "assigned",
      agentName: parcel.deliveryManId.firstName,
    });

    res.status(200).json({
      success: true,
      data: parcel,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Assign failed" });
  }
};


// ===============================
// GET ALL USERS
// ===============================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ error: "Failed to load users" });
  }
};

// ===============================
// DELETE USER
// ===============================
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};


// ===============================
// UPDATE USER ROLE
// ===============================
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    if (!["admin", "agent", "customer"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 🔥 REALTIME EVENT
    const io = req.app.get("io");
    if (io) {
      io.emit("user-role-updated", {
        userId: user._id,
        role: user.role,
      });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Role update failed" });
  }
};

