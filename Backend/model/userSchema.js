const mongoose = require("mongoose");
const {Schema} = mongoose;

const userSchema = new Schema({
  
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "agent", "customer"], // ✅ 3 roles
      default: "customer",
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    // Agent specific fields
    agentDetails: {
      vehicleNumber: String,
      licenseNumber: String,
      isAvailable: {
        type: Boolean,
        default: true,
      },
      currentLocation: {
        lat: Number,
        lng: Number,
      },
    },
    // Customer specific fields
    customerDetails: {
      defaultAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
      },
    },
    otp: {
      type: String,
    },
    otpExpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 });

module.exports = mongoose.model("userList",userSchema)
