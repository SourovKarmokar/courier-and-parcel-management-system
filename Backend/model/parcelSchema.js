const mongoose = require("mongoose");
const { Schema } = mongoose;

const parcelSchema = new Schema({
  senderName: { type: String, required: true },
  senderEmail: { type: String, required: true },
  recipientName: { type: String, required: true },
  recipientPhone: { type: String, required: true },
  recipientAddress: { type: String, required: true },
  parcelWeight: { type: Number, required: true }, 
  parcelType: { type: String, required: true }, 
  deliveryCharge: { type: Number, required: true },


  // Tracking system 
  trackingId: { type: String, unique: true },
  status: {
    type: String,
    enum: ["pending", "assigned", "picked", "delivered", "cancelled"], 
    default: "pending"
  },
  
  assignedBy: {
    type: Schema.Types.ObjectId,
    ref: "userList"  // ✅ ঠিক আছে
  },

  // (customer) Booking
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "userList", // ✅ ঠিক আছে
    required: true,
  },
  
  // Assigned Delivery Man
  deliveryManId: {
    type: Schema.Types.ObjectId,
    ref: "userList" // ✅ ঠিক আছে
  }
}, { timestamps: true });
  
module.exports = mongoose.model("Parcel", parcelSchema);