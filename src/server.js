const BODIES = [];

class Racket {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.nx = x;
    this.ny = y;
    this.velocity = { x: 0, y: 0 };
    this.mass = 3;
    this.speed = 7;
    this.radius = 10;
    // CONTROLS
    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;
    // set
    BODIES.push(this);
  }
  // block() {
  //   if (this.nx + this.radius > fieldWidth) {
  //     this.nx = fieldWidth - this.radius;
  //     this.velocity.x *= -0.6;
  //   }
  //   if (this.nx - this.radius < 0) {
  //     this.nx = this.radius;
  //     this.velocity.x *= -0.6;
  //   }
  //   if (this.ny + this.radius > fieldHeight) {
  //     this.ny = fieldHeight - this.radius;
  //     this.velocity.y *= -0.6;
  //   }
  //   if (this.ny - this.radius < 0) {
  //     this.ny = this.radius;
  //     this.velocity.y *= -0.6;
  //   }
  // }
  update() {
    this.velocity = { x: 0, y: 0 };

    if (this.left) this.velocity.x -= this.speed;
    if (this.right) this.velocity.x += this.speed;
    if (this.up) this.velocity.y -= this.speed;
    if (this.down) this.velocity.y += this.speed;

    this.nx = this.x + this.velocity.x;
    this.ny = this.y + this.velocity.y;

    this.x = this.nx;
    this.y = this.ny;
  }
}

// SERVER
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
let serverRackets = []; // 서버 상 라켓
let playerReg = {}; // 라켓의 위치
let clientNo = 0;
let roomNo;

io.on("connection", connected);
setInterval(serverLoop, 1000 / 60);

function connected(socket) {
  clientNo++;
  roomNo = Math.round(clientNo / 2);
  // socket.join(roomNo);
  // console.log(`New client no.: ${clientNo}, room no.: ${roomNo}`);
  console.log("New client connected, with id: " + socket.id);
  if (clientNo % 2 === 1) {
    // 플레이어 1 생성
    serverRackets[socket.id] = new Racket(200, 200);
    // serverRackets[socket.id].layer = roomNo;
    serverRackets[socket.id].no = 1;
    playerReg[socket.id] = { id: socket.id, x: 50, y: 50, no: 1 };
  } else if (clientNo % 2 === 0) {
    serverRackets[socket.id] = new Racket(600, 200);
    // serverRackets[socket.id].layer = roomNo;
    serverRackets[socket.id].no = 2;
    playerReg[socket.id] = { id: socket.id, x: 200, y: 50, no: 2 };
  }

  io.sockets.emit("updateConnections", playerReg, clientNo, roomNo);

  socket.on("disconnect", function () {
    // console.log(`on disconnection room: ${serverRackets[socket.id].layer}`);
    delete serverRackets[socket.id];
    delete playerReg[socket.id];
    console.log("From disconnect | Current number of players: " + Object.keys(playerReg).length);
    // socket.emit("deletePlayer", playerReg[socket.id]);
    io.sockets.emit("updateConnections", playerReg);
  });

  socket.on("userCommands", (data) => {
    // console.log(data);
    serverRackets[socket.id].left = data.left;
    serverRackets[socket.id].up = data.up;
    serverRackets[socket.id].right = data.right;
    serverRackets[socket.id].down = data.down;
  });
}

function userInteraction() {
  BODIES.forEach((b) => {
    b.update();
  });
}

function serverLoop() {
  userInteraction();
  for (let id in serverRackets) {
    // console.log(serverRackets[id].x, serverRackets[id].y);
    playerReg[id].x = serverRackets[id].x;
    playerReg[id].y = serverRackets[id].y;
  }
  io.emit("positionUpdate", playerReg);
}

export default httpServer;
