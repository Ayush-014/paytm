const express = require('express');
const router = express.Router();
const secret = require("../config");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const User = require("../db");
const bcrypt = require("bcrypt");

const signUpSchema = zod.object({
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string().min(8),
    userName: zod.string().min(4),
});

const isExist = async (userName) => {
    const existingUser = await User.findOne({ userName });
    return existingUser;
};

router.post("/signup", async (req, res) => {
    const validation = signUpSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(411).json({
            message: "Invalid Input",
            errors: validation.error.errors
        });
    }

    const { firstName, lastName, password, userName } = req.body;

    try {
        if (await isExist(userName)) {
            return res.status(411).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            userName,
            password: hashedPassword,
        });
        await newUser.save();

        const token = jwt.sign({ userName }, secret, { expiresIn: "2h" });
        return res.status(201).json({
            userId: newUser._id,
            token
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

//signin
const signInSchema = zod.object({
    userName: zod.string(),
    password: zod.string().min(8),
});

router.post("/signin", async (req, res) => {
    const validation = signInSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(403).json({
            message: "Invalid Input",
            error: validation.error.errors
        });
    }

    const { userName, password } = req.body;

    try {
        const existingUser = await isExist(userName);
        if (!existingUser) {
            return res.status(403).json({ message: "Invalid username or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(403).json({ message: "Invalid username or password" });
        }

        const token = jwt.sign({ userName }, secret, { expiresIn: "2h" });
        return res.status(200).json({
            userId: existingUser._id,
            token
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
});


const updateSchema = zod.object({
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string().min(8),
});

router.put("/", verifyJwtToken, async (req,res) => {
    const validation = updateSchema.safeParse(req.body);
    if(!validation.success){
        return res.status(403).json({
            message: "Invalid inputs",
            error: validation.error.errors,
        });
    }

    try {
        await User.updateOne(req.body, {
            id: req.userId
        })
        return res.status(200).json({message: "Updation Successfull"});
    } catch(error) {
        return res.status(403).json({
            message: "Server error",
            error: error.message,
        });
    }
})

router.get("/bulk", async (req,res) => {
    const filter = req.query.filter || "";

    const filteredUsers = await User.find({
        $or: [{
            firstName: {
                "$regex" : filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: filteredUsers.map(user => ({
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id,
        }))
    })
    
})

module.exports = router;