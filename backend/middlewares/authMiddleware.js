const jwt= require('jsonwebtoken')
const User = require("../Modules/userModel")
const asyncHandler=require("express-async-handler")

const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWTSecret);

            req.user = await User.findById(decoded.id).select("-password");
            next();
        } catch (err) {
            console.error("JWT Verification Error:", err); 
            res.status(401);
            throw new Error("Not Authorized");
        }
    }

    if (!token) {
        console.error("No token found in headers"); 
        res.status(401);
        throw new Error("No token, no authorization");
    }
});

module.exports= { protect }