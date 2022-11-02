import express from "express";
const app = express();
import http from "http";
const httpServer = http.createServer(app);
import { Server } from "socket.io";
const io = new Server(httpServer);
import { staticPage } from "./controllers";

// express 세팅
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src" + "/views");
app.use("/assets", express.static("assets"));

// 라우팅
app.get("/", staticPage("home", "welcome"));
app.get("/hockey", staticPage("pages/hockey", "play"));

io.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`🖕 소켓 이벤트 종류: ${event}`);
  });
});

export default httpServer;
