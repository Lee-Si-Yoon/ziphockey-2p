import express from "express";
const app = express();
import http from "http";
const httpServer = http.createServer(app);
import { Server } from "socket.io";
const io = new Server(httpServer);
import { staticPage } from "./controllers";

// express 세팅
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src" + "/views");
app.use("/assets", express.static("assets"));

// 라우팅
app.get("/", staticPage("home", "welcome"));

// SOCKET
// https://github.com/danielszabo88/CapsuleSoccer/blob/master/05%20-%20Adding%20socket.io%20Rooms/server.js
// line 850
let players = {};
let clientNo = 0;
let roomNo;

io.on("connection", connected);

function connected(socket) {
  clientNo++;
  roomNo = Math.round(clientNo / 2);
  socket.join(roomNo);
  console.log(`New client no.: ${clientNo}, room no.: ${roomNo}`);
  io.to(socket.id).emit("makeRoom", clientNo, roomNo);
  socket.on("disconnect", function () {});
}

export default httpServer;
