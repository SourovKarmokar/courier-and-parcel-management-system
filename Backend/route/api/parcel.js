const express = require("express")
const { checkLogin } = require("../../middleware/authMiddleware")
const { createParcel, getMyParcels } = require("../../controller/parcelController")
const router  = express.Router()

//Parcel Book With Login
router.post("/book" , checkLogin , createParcel)

//Own BookHistory see to Login
router.get("/my-parcels" , checkLogin , getMyParcels)

module.exports = router