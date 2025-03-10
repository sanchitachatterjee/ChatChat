const express= require("express");
const dotenv= require("dotenv")
const connectDB = require("./config/db");
const userRoutes= require('./Routes/userRoutes')
const chatRoutes=require('./Routes/chatRoutes')
const messageRoutes=require('./Routes/messageRoutes')
const { errorHandler}= require('./middlewares/errorMiddleware')
const { notFound }= require('./middlewares/errorMiddleware')
const cors = require("cors");
const path=require("path")

dotenv.config()
connectDB()
const app = express()
app.use(cors());

app.use(express.json()) // to accept json data

app.use('/api/user',userRoutes)
app.use('/api/chat',chatRoutes)
app.use('/api/message',messageRoutes)

app.use(notFound)
app.use(errorHandler)


const PORT = process.env.PORT || 8000;
const server= app.listen(PORT, console.log(`Server started on PORT ${PORT}`))

const io= require('socket.io')(server,{
    pingTimeout:60000,// it will wait 60 sec before it becomes inactive
    cors:{
      origin: ["http://localhost:5173", "http://localhost:8000"],
      methods: ["GET", "POST"]    
   }
});

io.on("connect",(socket)=>{
   console.log('connected to socket.io')
   socket.on("setup",(userData)=>{
      //will create exclusive room for each user
      socket.join(userData._id)
      socket.emit('connected')
   });

   socket.on("Join chat",(room)=>{
     socket.join(room);
     console.log("User joined room "+room)
   });
   

   socket.on("Stop Typing",(room)=>{
      socket.in(room).emit("Stop Typing");
   })

   socket.on("Typing",(room)=>{
    socket.in(room).emit("Typing");
 })
   socket.on("New Message",(newMsgRecieved)=>{
     var chat=newMsgRecieved.chat;
     if(!chat.users){
      return console.log("not defiened")
     }

     chat.users.forEach((user) => {
       if(user._id === newMsgRecieved.sender._id)
         return;
       
       socket.in(user._id).emit("Message recieved",newMsgRecieved)
     });
   })
})
