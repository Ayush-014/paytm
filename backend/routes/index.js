const express = require('express');
const router = express.Router();
const userRouter = require("./user");


router.use("/user", userRouter);
module.exports = router;


// const router2 = express.Router();
// const router3 = express.Router();
// router.get('/api/v1', (req,res,next) => {
//     console.log("router1 get route");
//     res.send();
//     res.end();
// })

// router1.get('/api/v1', (req,res,next) => {
//     console.log("router1 get route");
//     res.send();
//     res.end();
// })