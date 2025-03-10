const jwt= require('jsonwebtoken')

const generateToken=(userid)=>{
    return jwt.sign({ id: userid }, process.env.JWTSecret,{
        expiresIn:"30d" //in 30 days
    })
};
module.exports= generateToken;