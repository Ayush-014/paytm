const express = require("express");
const { Account } = require("../db");
const router = express.Router();
const { verifyJwtToken } = require("../middleware");

router.get("/balance", async (req, res) => {
    try {
        const account = await Account.findOne({
            userId: req.query.userId
        });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        res.status(200).json({ balance: account.balance });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

router.put("/transfer", verifyJwtToken, async (req, res) => {
    try {
        const { amount, to } = req.body;
        if (!amount || !to || amount <= 0) {
            return res.status(400).json({ message: "Invalid input data" });
        }

        const sender = await Account.findOne({ userId: req.body.userId });
        if (!sender || sender.balance < amount) {
            return res.status(403).json({ message: "Insufficient balance" });
        }

        const receiver = await Account.findOne({ userId: to });
        if (!receiver) {
            return res.status(404).json({ message: "Recipient account not found" });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            await Account.updateOne(
                { userId: req.body.userId },
                { $inc: { balance: -amount } },
                { session }
            );

            await Account.updateOne(
                { userId: to },
                { $inc: { balance: amount } },
                { session }
            );

            await session.commitTransaction();
            session.endSession();

            return res.status(200).json({ message: "Transfer successful" });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();

            return res.status(500).json({
                message: "Transaction failed",
                error: error.message
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

module.exports = router;
