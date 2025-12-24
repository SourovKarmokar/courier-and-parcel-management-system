const Parcel = require("../model/parcelSchema");
const User = require("../model/userSchema");

// 1. See all Parcel by Admin
exports.getAllParcels = async (req, res) => {
    try {
        const parcels = await Parcel.find()
            .populate("senderId", "firstName email")
            .populate("deliveryManId", "firstName phone") 
            .populate("assignedBy", "firstName email") 
            .sort({ createdAt: -1 });

        res.status(200).json(parcels);

    } catch (error) {
        console.log(error); 
        res.status(500).json({ error: "Failed to fetch parcels" });
    }
};

// 2. See All Delivery Agents
exports.getAllDeliveryMan = async (req, res) => {
    try {
        const agents = await User.find({ role: "agent" }).select("-password");
        res.status(200).json(agents);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch agents" });
    }
};

// 3. Assign Agent
exports.assignAgent = async (req, res) => {
    try {
        const { parcelId, agentId } = req.body;
        const adminId = req.userid; 

        const updatedParcel = await Parcel.findByIdAndUpdate(
            parcelId,
            {
                deliveryManId: agentId,
                status: "assigned",
                assignedBy: adminId 
            },
            { new: true }
        );

        if (!updatedParcel) {
            return res.status(404).json({ error: "Parcel not found" });
        }

        await User.findByIdAndUpdate(
            adminId,
            { 
                $addToSet: { "adminDetails.assignedAgents": agentId } 
            }
        );

        res.status(200).json({
            message: "Agent assigned successfully and saved to Admin profile!",
            data: updatedParcel
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Assignment failed" });
    }
};

// 4. Dashboard Stats (নাম ঠিক করা হয়েছে)
exports.getDashboardStats = async (req , res) => {
    try{
        // Total Parcel (Variable নাম ঠিক করা হয়েছে)
        const totalParcels = await Parcel.countDocuments();
        
        // Status অনুযায়ী count
        const deliveredParcels = await Parcel.countDocuments({ status: "delivered" });
        const pendingParcels = await Parcel.countDocuments({ status: "pending" });
        const cancelledParcels = await Parcel.countDocuments({ status: "cancelled" });

        // Total User and Agent
        const totalAgents = await User.countDocuments({ role: "agent" });
        const totalCustomers = await User.countDocuments({ role: "customer" });

        // Total Revenue and Delivered Parcel
        const revenueData = await Parcel.aggregate([
            { $match: { status: "delivered" } },
            { $group: { _id: null, totalRevenue: { $sum: "$deliveryCharge" } } }
        ]);

        const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

        res.status(200).json({
            success: true,
            data: {
                totalParcels,      // ✅ এখন নাম মিলবে
                deliveredParcels,
                pendingParcels,
                cancelledParcels,
                totalAgents,
                totalCustomers,
                totalRevenue 
            }
        });

    } catch (error) { 
        console.log(error);
        res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
}