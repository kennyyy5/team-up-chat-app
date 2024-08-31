import express from "express"
//import {chats} from "./data/data.js"
import * as dotenv from "dotenv"
import {connectDB} from "./config/db.js"
import colors from "colors"
import {userRouter} from "./routes/userRoutes.js"
import { chatRouter } from "./routes/chatRoutes.js"
import { notFound, errorHandler } from "./middleware/errorMiddleware.js"
import { messageRouter } from "./routes/messageRoutes.js"
import { Server } from "socket.io";
import path from "path"

dotenv.config()
connectDB()
const app = express()

app.use(express.json())

const PORT = process.env.PORT || 5000

app.use("/api/user", userRouter)
app.use("/api/chat", chatRouter)
app.use("/api/message", messageRouter)

//_____________deployment____________

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

//_____________deployment____________

app.use(notFound);
app.use(errorHandler)


const server = app.listen(PORT,console.log(`Server started on PORT ${PORT}`.yellow.bold))


const io = new Server(server, {
  pingTimeout:60000,
  cors: {
    origin: "http://localhost:3000"
  }
});

io.on("connection", (socket)=>{
   // console.log("connected to socket.io")

    socket.on("setup",(userData)=>{
        socket.join(userData._id)
       // console.log(userData._id)
        socket.emit("connected")
    })

    socket.on("join chat",(room)=>{
        socket.join(room)
        console.log("user joined room: "+room)
        //socket.emit("connected")
    })

    socket.on("typing",(room)=>{
        socket.in(room).emit("typing")
        //socket.emit("connected")
    })

    socket.on("stop typing",(room)=>{
        socket.in(room).emit("stop typing")
        //socket.emit("connected")
    })

    socket.on("new message",(newMessageRecieved)=>{
      //  console.log(newMessageRecieved)
        var chat = newMessageRecieved?.chat
        if(!chat.users) return console.log("chat users not defined")

        chat.users.forEach(user =>{
            if(user._id === newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved)
        })
    })
    socket.off("setup",()=>{
        console.log('USER DISCONNECTED');
        socket.leave(userData._id)
    })
 })