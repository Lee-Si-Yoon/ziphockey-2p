import express from "express";
const app = express();
import http from "http";
const httpServer = http.createServer(app);
import { Server } from "socket.io";
export const io = new Server(httpServer);
import { staticPage, postNewRoom } from "./controllers";

// express 세팅
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src" + "/views");
app.use("/assets", express.static("assets"));

// 라우팅
app.get("/", staticPage("home", "welcome"));
// app.get("/newroom", staticPage("pages/newroom", "newroom"));
// app.get("/loading", staticPage("pages/loading", "loading"));
// app.get("/roomlist", staticPage("pages/roomlist", "roomlist"));
// app.get("/hockey", staticPage("play/hockey", "play"));

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = io;
  let publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}
function countRoom(roomName) {
  return io.sockets.adapter.rooms.get(roomName)?.size;
}

io.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`🖕 소켓 이벤트 종류: ${event}`);
  });
  socket.on("enterRoom", (roomName) => {
    socket.join(roomName);
    socket.to(roomName).emit("welcome", roomName, countRoom(roomName));
    io.sockets.emit("room_change", publicRooms());
  });
  socket.on("getReady", (roomName, count) => {
    socket.to(roomName).emit("ready", roomName, count);
  });
  // DISCONNECTION
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1)
    );
  });
  socket.on("disconnect", () => {
    io.sockets.emit("room_change", publicRooms());
  });
});

export default httpServer;
