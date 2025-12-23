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
  //traking system 
  trackingId:{type: String , unique: true},
  status: {
    type: String,
   enum: ["pending", "assigned", "picked", "delivered", "cancelled"], 
    default: "pending"
  },

  //(customer) Booking
  senderId:{
    type: Schema.Types.ObjectId,
    ref: "userList",
    require:true,
  },
  //Assigned Delivery Man
  ddeliveryManId: {
    type: Schema.Types.ObjectId,
    ref: "userList"
  }
}, { timestamps: true });
  
  module.exports = mongoose.model("Parcel", parcelSchema);
