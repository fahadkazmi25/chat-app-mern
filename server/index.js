require('dotenv').config()
const express=require('express')
const cors=require('cors')
const userRoutes=require("./routes/userRoutes")
const messageRoutes=require("./routes/messages")
const mongoose=require('mongoose')
const app=express()
const socket=require('socket.io')

app.use(cors())
app.use(express.json())
app.use("/api/auth",userRoutes)
app.use("/api/messages",messageRoutes)

//app.use("/api/auth", authRoutes);
mongoose.connect("mongodb://localhost:27017/chat",{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("DB cpnnected succeffully")
}).catch((err)=>{
    console.log(err.message)
})


const server=app.listen(5000,()=>{
    console.log("Server started on Port 5000")
})

const io = socket(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });
  
  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });
  
    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.msg);
      }
    });
  });
  