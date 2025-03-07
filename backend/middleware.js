const secret = require("./config");
const jwt = require("jsonwebtoken");

const verifyJwtToken = (req,res,next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log("authHeader " + authHeader);
        return res.status(403).json({message: "Access Denied"});
    }

    const token = authHeader.split(' ')[1];
    
    console.log("Received Token:", token);
    console.log("JWT Secret:", secret);


    try {
        const verified = jwt.verify(token, secret);
        console.log("verified: " + verified);
        if(verified) {
            req.userId = verified.userId;
            next();
        } else {
            return res.status(403).json({message: "Invalid Token"});
        }

    } catch (error) {
        console.error("JWT Verification Error:", error);
        return res.status(400).json({
            message: "Invalid token",
            error: error.message
        });    
    }
};

module.exports = {
    verifyJwtToken
};