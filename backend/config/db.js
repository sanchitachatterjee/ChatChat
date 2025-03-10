const mongoose= require('mongoose')

const connectDB=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MongoURI);
        console.log("MongoDb is connected")
    }
    catch(err){
       console.log(`Error: ${err.message}`)
       process.exit();
    }
}

module.exports= connectDB;