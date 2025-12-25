const mongoose = require("mongoose");
const { Schema } = mongoose;

const parcelSchema = new Schema({
  // ১. Sender Information (লগইন করা ইউজার থেকে আসবে)
  senderName: { 
    type: String, 
    required: true 
  },
  senderEmail: { 
    type: String, 
    required: true 
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "userList", // ⚠️ নিশ্চিত হয়ে নাও তোমার User Model এর নাম 'userList' কিনা
    required: true,
  },

  // ২. Recipient Information (বডি থেকে আসবে)
  recipientName: { 
    type: String, 
    required: true 
  },
  recipientPhone: { 
    type: String, 
    required: true 
  },
  recipientAddress: { 
    type: String, 
    required: true 
  },

  // ৩. Parcel Details (বডি থেকে আসবে)
  parcelWeight: { 
    type: Number, 
    required: true 
  },
  parcelType: { 
    type: String, 
    required: true 
  },

  // ৪. Calculated Fields (কন্ট্রোলারে ক্যালকুলেট করা হবে)
  deliveryCharge: { 
    type: Number, 
    required: true 
  },
  trackingId: { 
    type: String, 
    unique: true 
  },

  // ৫. Status & Assignment
  status: {
  type: String,
  enum: [
    "pending",
    "assigned",
    "picked_up",
    "in_transit",
    "delivered",
    "failed",
    "cancelled"
  ],
  default: "pending"
},

  
  // পরে অ্যাডমিন যখন অ্যাসাইন করবে তখন এগুলো লাগবে
  deliveryManId: {
    type: Schema.Types.ObjectId,
    ref: "userList"
  },
  assignedBy: {
    type: Schema.Types.ObjectId,
    ref: "userList"
  }

}, { timestamps: true });

module.exports = mongoose.model("Parcel", parcelSchema);