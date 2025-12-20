const express = require("express")
const router = express.Router()

router.get("/registration",(req,res)=>{
    res.send("its cool")
})

module.exports = router