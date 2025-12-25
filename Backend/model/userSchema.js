const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
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
      unique: true,   // ✅ enough (index auto)
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
      enum: ["admin", "agent", "customer"],
      default: "customer",
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },

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

    customerDetails: {
      defaultAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
      },
    },

    adminDetails: {
      designation: String,
      managedArea: String,
      assignedAgents: [
        {
          type: Schema.Types.ObjectId,
          ref: "userList",
        },
      ],
    },

    otp: String,
    otpExpire: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("userList", userSchema);
