const Parcel = require("../model/parcelSchema")

//Create Booling
exports.createParcel = async (req , res) => {
    try{
        const { recipientName, recipientPhone, recipientAddress, parcelWeight, parcelType } = req.body;

        //charge calculation 1kg 100tk
        const chargePerKg = 100;
        const deliveryCharge =     parcelWeight * chargePerKg;

        //TreakId Generate
        const trackingId = "TRK" + Date.now() + Math.floor(Math.random() * 1000);

        const nowParcel = new Parcel({
      senderName: req.firstName, 
      senderEmail: req.email,    
      senderId: req.userid,
      recipientName,
      recipientPhone,
      recipientAddress,
      parcelWeight,
      parcelType,
      deliveryCharge,
      trackingId
    })

    await nowParcel.save()

    res.status(201).json({
        success: true,
        message: "Parcel booked successfully!",
        date: nowParcel,

    })
    }catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Booking failed! Please try again."
        })
        
    }
}

exports.getMyParcels = async (req, res) => {
    try {
        const parcels = await Parcel.find({senderId: req.userid}).sort({ createdAt: -1 });
        res.status(200).json(parcels);
    }catch (error){
        res.status(500).json({ error: "Could not fetch parcels" })
    }
}