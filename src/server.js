import express from "express";
import http from "http";
// 컨트롤러
import { chatRoom, getHome, incomeChatRoom } from "./controllers";
//  socket.io
import { Server } from "socket.io";

// express 세팅
const app = express();
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src" + "/views");
app.use("/assets", express.static("assets"));

// 라우팅
app.get("/", getHome);
app.get("/chat", chatRoom);
app.get("/getchat", incomeChatRoom);

// socketIO 세팅
const httpServer = http.createServer(app);
const wsServer = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"], //paste localhost:4000/admin to url
    credentials: true,
  },
});
wsServer.on("connection", (socket) => {
  socket.onAny((event) => {
    // console.log(`🖕 소켓 이벤트 종류: ${event}`);
  });
  socket.on("newText", (key) => {
    if (key) {
      wsServer.sockets.emit("getText", key);
      console.log(key);
    }
  });
});

export default httpServer;
