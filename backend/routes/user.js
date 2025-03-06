const express = require('express');
const router = express.Router();
const secret = require("../config");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { User } = require("../db");

const zodSchema = zod.object({
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string().min(8),
    userName: zod.string().min(4),
});

const verifyJwtToken = (req, res,next) => {
    const token = req.header("Authorization");
    if(!token)  return res.status(401).json({message: "Access Denied"});

    try {
        const verified = jwt.verify(token.split(" ")[1], secret);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({message: "Invalid Token"});
    }
};

const isExist = async ( userName ) => {
    const existingUser = await User.findOne({ userName });
    // return !!existingUser;
    return existingUser._id;
}

router.post("/signup", async (req, res) => {
    const validation = loginSchema.safeParse(req.body);
    if(!validation.success){
        return res.status(411).json({
            message: "Invalid Input",
            errors: validation.error.errors
        });
    }
    const { firstName, lastName, password, userName } = req.body;

    try {
        if(await isExist( userName )) {
            return res.status(411).json({message: "User already exist"});
        }
        
        const newUser = new User({
            firstName, lastName, userName, password,
        });
        await newUser.save();

        const token = jwt.sign({ userName }, secret, {expiresIn: "2h"});
        res.status(201).json({
            userId: newUser._id,
            token
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

module.exports = router;