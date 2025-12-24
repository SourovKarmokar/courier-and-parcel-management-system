const parcelSchema = require("../model/parcelSchema");
const crypto = require("crypto");
const userSchema = require("../model/userSchema"); // User এর তথ্য নেয়ার জন্য

// ১. নতুন পার্সেল বুক করা (Customer)
const createParcel = async (req, res) => {
  try {
    const { 
      recipientName, 
      recipientPhone, 
      recipientAddress, 
      parcelWeight, 
      parcelType 
    } = req.body;

    // ১. ভ্যালিডেশন
    if (!recipientName || !recipientPhone || !recipientAddress || !parcelWeight || !parcelType) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // ২. লগইন করা ইউজারের তথ্য বের করা (req.userid থেকে)
    const sender = await userSchema.findById(req.userid);
    
    if (!sender) {
      return res.status(404).json({ error: "Sender not found" });
    }

    // ৩. ডেলিভারি চার্জ ক্যালকুলেশন (লজিক: ১ কেজি = ১৫০ টাকা, প্রতি অতিরিক্ত কেজি ১০০ টাকা)
    // তুমি চাইলে এটা ফিক্সড রাখতে পারো
    let charge = 150; 
    if (parcelWeight > 1) {
      charge += (parcelWeight - 1) * 100;
    }

    // ৪. ইউনিক ট্র্যাকিং আইডি তৈরি (যেমন: TRK-123456)
    const trackingId = "TRK-" + crypto.randomInt(100000, 999999).toString();

    // ৫. নতুন পার্সেল অবজেক্ট তৈরি (তোমার স্কিমা অনুযায়ী)
    const newParcel = new parcelSchema({
      senderName: sender.firstName + " " + sender.lastName, // User থেকে নাম
      senderEmail: sender.email, // User থেকে ইমেইল
      recipientName,
      recipientPhone,
      recipientAddress,
      parcelWeight,
      parcelType,
      deliveryCharge: charge, // স্কিমাতে নাম deliveryCharge
      trackingId: trackingId,
      status: "pending", // ডিফল্ট স্ট্যাটাস
      senderId: req.userid // লগইন করা ইউজারের আইডি
    });

    // ৬. ডাটাবেসে সেভ করা
    await newParcel.save();

    res.status(201).json({
      success: true,
      message: "Parcel booked successfully!",
      data: newParcel
    });

  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ error: "Failed to book parcel" });
  }
};

// ২. নিজের সব পার্সেল দেখা (Customer)
const getMyParcels = async (req, res) => {
  try {
    // senderId দিয়ে খুঁজে বের করা
    const parcels = await parcelSchema
      .find({ senderId: req.userid })
      .sort({ createdAt: -1 }); // লেটেস্ট আগে দেখাবে

    res.status(200).json({ 
      success: true, 
      data: parcels 
    });

  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch parcels" });
  }
};

// ৩. সব পার্সেল দেখা (Admin এর জন্য)
const getAllParcels = async (req, res) => {
  try {
    // ডাটাবেস থেকে সব পার্সেল নিয়ে আসা
    const parcels = await parcelSchema.find().sort({ createdAt: -1 });
    res.status(200).json(parcels);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch all parcels" });
  }
};

// ৪. রাইডার অ্যাসাইন করা (Admin এর জন্য)
const assignRider = async (req, res) => {
  try {
    const { parcelId, riderId, riderName } = req.body;

    const updatedParcel = await parcelSchema.findByIdAndUpdate(
      parcelId,
      { 
        riderId: riderId,
        riderName: riderName, // স্কিমাতে এই ফিল্ড থাকলে ভালো
        status: "processing"  // রাইডার দিলে স্ট্যাটাস আপডেট হবে
      },
      { new: true }
    );

    res.status(200).json({ 
      success: true, 
      message: "Rider assigned and status updated to processing",
      data: updatedParcel 
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to assign rider" });
  }
};

// ৫. সব রাইডার/এজেন্ট এর তালিকা (Admin এর জন্য)
const getAllRiders = async (req, res) => {
  try {
    // ইউজার টেবিল থেকে যাদের রোল 'agent' তাদের খুঁজে বের করা
    const riders = await userSchema.find({ role: "agent" }).select("firstName lastName email _id");
    res.status(200).json(riders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch riders list" });
  }
};

// module.exports আপডেট করুন
module.exports = { 
  createParcel, 
  getMyParcels, 
  getAllParcels, 
  assignRider, 
  getAllRiders 
};