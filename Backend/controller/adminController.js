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