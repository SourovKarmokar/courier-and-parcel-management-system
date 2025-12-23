// const express = require("express");
// const {authMiddleware} = require("../../middleware/authMiddleware");
// const router = express.Router();

// // Existing GET handler
// router.get("/welcome",authMiddleware, (req, res) => {
//     res.json("Welcome to user dashboard via GET");
// });

// // Add a POST handler
// router.post("/welcome", (req, res) => {
    
//     res.json("Data received via POST at welcome route");

//     console.log(req.userInfo,"info");
//     const {userid,firstName, email, role} = req.userInfo
    
// });

// module.exports = router;
