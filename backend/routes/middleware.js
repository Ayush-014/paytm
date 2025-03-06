const secret = require("../config");
const jwt = require("jsonwebtoken");

const verifyJwtToken = (req,res,next) => {
    const authHeader = req.header.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({message: "Access Denied"});
    }

    const token = authHeader.split(' ')[1];

    try {
        const verified = jwt.verify(token, secret);
        if(verified) {
            req.userId = verified.userId;
            next();
        } else {
            return res.status(403).json({message: "Invalid Token"});
        }

    } catch (err) {
        return res.status(400).json({message: "Invalid Token"});
    }
};

module.exports = {
    verifyJwtToken
};