const BODIES = [];

class Racket {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.nx = x;
    this.ny = y;
    this.velocity = { x: 0, y: 0 };
    this.mass = 3;
    this.speed = 4;
    this.radius = 30;
    // CONTROLS
    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;
    // set
    this.no;
    this.roomNo;
    this.field = { width: 0, height: 0 };
    this.score = 0;
    BODIES.push(this);
  }
  // block__area__byPosition() {
  //   if (this.ny + this.radius > this.field.height) this.ny = this.field.height - this.radius;
  //   if (this.ny - this.radius < 0) this.ny = this.radius;
  //   if (this.nx - this.radius < 0) this.nx = this.radius;
  //   if (this.nx + this.radius > this.field.width) this.nx = this.field.width - this.radius;
  // }
  block__area__byKey() {
    if (this.ny + this.radius > this.field.height) {
      this.down = false;
      this.velocity.y *= -0.6;
    }
    if (this.ny - this.radius < 0) {
      this.up = false;
      this.velocity.y *= -0.6;
    }
    if (this.nx - this.radius < 0) {
      this.left = false;
      this.velocity.x *= -0.6;
    }
    if (this.nx + this.radius > this.field.width) {
      this.right = false;
      this.velocity.x *= -0.6;
    }
  }
  block__P1() {
    if (this.nx + this.radius > this.field.width / 2) this.right = false;
  }
  block__P2() {
    if (this.nx - this.radius < this.field.width / 2) this.left = false;
  }
  update() {
    this.velocity = { x: 0, y: 0 };

    this.block__area__byKey();
    if (+this.no === 1) {
      this.block__P1();
    } else if (+this.no === 2) {
      this.block__P2();
    }

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

class Ball {
  constructor(x, y, player1, player2) {
    this.y = y;
    this.ny = y;
    this.x = x;
    this.nx = x;
    this.velocity = { x: 0, y: 0 };
    this.mass = 1;
    this.corFactor = 1.2;
    this.radius = 18;
    // GET
    this.player1 = player1;
    this.player2 = player2;
    this.roomNo;
    this.field = { width: 0, height: 0 };
    this.collisionActive = false;
    BODIES.push(this);
  }
  remove() {
    if (BODIES.indexOf(this) !== -1) {
      BODIES.splice(BODIES.indexOf(this), 1);
    }
  }
  reset() {
    this.velocity = { x: 0, y: 0 };
    this.collisionActive = false;
    setTimeout(() => {
      this.collisionActive = true;
    }, 2000);
  }
  // 라켓과 공이 충돌했는지 판별하는 함수
  collision(racket) {
    if (this.collisionActive) {
      // 중심점 좌표 사이의 거리가 두 반지름의 합보다 작으면 충돌
      let distanceUnits = Math.sqrt(
        Math.pow(Math.abs(this.x - racket.x), 2) +
          Math.pow(Math.abs(this.y - racket.y), 2)
      );
      let sumRadius = this.radius + racket.radius;

      return distanceUnits < sumRadius;
    }
  }
  getVelocity(racket) {
    return {
      x:
        ((this.mass - racket.mass * this.corFactor) /
          (this.mass + racket.mass)) *
          this.velocity.x +
        ((racket.mass + racket.mass * this.corFactor) /
          (this.mass + racket.mass)) *
          racket.velocity.x,
      y:
        ((this.mass - racket.mass * this.corFactor) /
          (this.mass + racket.mass)) *
          this.velocity.y +
        ((racket.mass + racket.mass * this.corFactor) /
          (this.mass + racket.mass)) *
          racket.velocity.y,
    };
  }
  checkWalls() {
    // 벽 확인
    if (this.nx + this.radius > this.field.width) {
      this.nx = this.field.width - this.radius;
      this.velocity.x *= -0.6;
    }
    if (this.nx - this.radius < 0) {
      this.nx = this.radius;
      this.velocity.x *= -0.6;
    }
    if (this.ny + this.radius > this.field.height) {
      this.ny = this.field.height - this.radius;
      this.velocity.y *= -0.6;
    }
    if (this.ny - this.radius < 0) {
      this.ny = this.radius;
      this.velocity.y *= -0.6;
    }
  }
  update() {
    // 라켓에 충돌할 시 공의 이동 방향이 바뀜
    if (this.player1 !== undefined && this.player2 !== undefined) {
      if (this.collision(this.player1)) {
        this.velocity = this.getVelocity(this.player1);
        // io.to(this.roomNo).emit("collision__P1");
      } else if (this.collision(this.player2)) {
        this.velocity = this.getVelocity(this.player2);
        // io.to(this.roomNo).emit("collision__P2");
      }
    }

    this.nx = this.x + this.velocity.x;
    this.ny = this.y + this.velocity.y;

    this.checkWalls();

    this.x = this.nx;
    this.y = this.ny;

    if (this.player1 !== undefined && this.player2 !== undefined) {
      if (this.collision(this.player1)) {
        this.velocity = {
          x: this.velocity.x * -0.6,
          y: this.velocity.y * -0.6,
        };
        //   // 라켓이 움직일 수 없으면 공을 움직임
        //   if (
        //     this.player1.y - this.velocity.y > this.field.height - this.player1.radius ||
        //     this.player1.y - this.velocity.y < this.field.height / 2 + this.player1.radius
        //   ) {
        //     while (this.collision(this.player1)) {
        //       this.nx = this.x + this.velocity.x;
        //       this.ny = this.y + this.velocity.y;
        //       // this.x = this.nx;
        //       // this.y = this.ny;
        //     }
        //     // 공이 움직일 수 없으면 라켓을 움직임
        //   } else {
        //     while (this.collision(this.player1)) {
        //       this.player1.nx = this.player1.x - this.velocity.x;
        //       this.player1.ny = this.player1.y - this.velocity.y;
        //       this.player1.x = this.player1.nx;
        //       this.player1.y = this.player1.ny;
        //     }
        //   }
      }
      if (this.collision(this.player2)) {
        this.velocity = {
          x: this.velocity.x * -0.6,
          y: this.velocity.y * -0.6,
        };
        //   // 라켓이 움직일 수 없으면 공을 움직임
        //   if (
        //     this.player2.y - this.velocity.y > this.field.height - this.player2.radius ||
        //     this.player2.y - this.velocity.y < this.field.height / 2 + this.player2.radius
        //   ) {
        //     while (this.collision(this.player2)) {
        //       this.nx = this.x + this.velocity.x;
        //       this.ny = this.y + this.velocity.y;
        //       // this.x = this.nx;
        //       // this.y = this.ny;
        //     }
        //     // 공이 움직일 수 없으면 라켓을 움직임
        //   } else {
        //     while (this.collision(this.player2)) {
        //       this.player2.nx = this.player2.x - this.velocity.x;
        //       this.player2.ny = this.player2.y - this.velocity.y;
        //       // this.player2.x = this.player2.nx;
        //       // this.player2.y = this.player2.ny;
        //     }
        //   }
      }
    }
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
let serverRackets = {}; // 서버 상 라켓
let playerReg = {}; // 라켓의 위치
let hockeyBall = {};
let hockeyBallReg = {};
let clientNo = 0;
let roomNo;
let timer = {};

io.on("connection", connected);
setInterval(serverLoop, 1000 / 60);

class Timer {
  constructor(roomNo) {
    this.time = 120;
    this.roomNo = roomNo;
    this.active = false;
  }
  runTimer() {
    if (this.active && this.time > 0) {
      this.time -= 1;
    }
  }
}

function connected(socket) {
  clientNo++;
  roomNo = Math.round(clientNo / 2);
  socket.join(roomNo);
  console.log(`New client no.: ${clientNo}, room no.: ${roomNo}`);
  // console.log("New client connected, with id: " + socket.id);
  if (clientNo % 2 === 1) {
    // 플레이어 1 생성
    serverRackets[socket.id] = new Racket(207, 156);
    serverRackets[socket.id].no = 1;
    serverRackets[socket.id].roomNo = roomNo;
    playerReg[socket.id] = {
      id: socket.id,
      x: 207,
      y: 156,
      roomNo: roomNo,
      no: 1,
    };
  } else if (clientNo % 2 === 0) {
    serverRackets[socket.id] = new Racket(621, 156);
    serverRackets[socket.id].no = 2;
    serverRackets[socket.id].roomNo = roomNo;
    playerReg[socket.id] = {
      id: socket.id,
      x: 621,
      y: 156,
      roomNo: roomNo,
      no: 2,
    };
  }

  socket.on("NewPlayground", (dimension) => {
    serverRackets[socket.id].field = dimension;
    io.to(serverRackets[socket.id].roomNo).emit(
      "updateUI",
      playerReg[socket.id]
    );
    if (clientNo % 2 === 0) {
      // create new ball
      hockeyBall[roomNo] = new Ball(314, 156);
      hockeyBall[roomNo].roomNo = roomNo;
      hockeyBall[roomNo].field = dimension;
      hockeyBall[roomNo].collisionActive = true;
      hockeyBallReg[roomNo] = { x: 314, y: 156, roomNo: roomNo };
      io.emit("updateHockeyBall", hockeyBallReg[roomNo]);
      for (let id in playerReg) {
        if (playerReg[id].id !== socket.id) {
          hockeyBall[roomNo].player1 = serverRackets[playerReg[id].id];
        } else {
          hockeyBall[roomNo].player2 = serverRackets[playerReg[id].id];
        }
      }
      // Timer
      timer[roomNo] = new Timer(roomNo);
      timer[roomNo].active = true;
    }
  });
  for (let id in serverRackets) {
    // console.log(playerReg[id]);
    io.to(serverRackets[id].roomNo).emit("updateConnections", playerReg);
    io.to(serverRackets[id].roomNo).emit("updateUI", playerReg);
  }

  // io.sockets.emit("updateConnections", playerReg);

  socket.on("disconnect", function () {
    if (hockeyBall[serverRackets[socket.id].roomNo]) {
      // console.log(hockeyBall[roomNo]);
      delete hockeyBall[serverRackets[socket.id].roomNo];
    }
    io.to(serverRackets[socket.id].roomNo).emit(
      "deletePlayer",
      playerReg[socket.id]
    );
    delete serverRackets[socket.id];
    delete playerReg[socket.id];

    if (timer[roomNo]) {
      timer[roomNo].active = false;
      delete timer[roomNo];
    }

    console.log(`Number of balls: ${Object.keys(hockeyBall).length}`);
    console.log(`Number of Bodies: ${BODIES.length}`);
    console.log(`Joined players ever: ${clientNo}`);
    console.log(
      "From disconnect | Current number of players: " +
        Object.keys(playerReg).length
    );
    io.emit("updateConnections", playerReg);
  });

  socket.on("userCommands", (data) => {
    if (timer[roomNo] !== undefined && timer[roomNo].active) {
      serverRackets[socket.id].left = data.left;
      serverRackets[socket.id].up = data.up;
      serverRackets[socket.id].right = data.right;
      serverRackets[socket.id].down = data.down;
    }
  });

  socket.on("restartGame", (roomNo) => {
    if (timer[roomNo] !== undefined) {
      timer[roomNo].active = true;
      io.to(roomNo).emit("restart");
    }
  });

  socket.on("ping", () => {
    // console.log("pong" + Object.keys(serverRackets).length);
  });
}

setInterval(() => {
  for (let room = 1; room <= roomNo; room++) {
    if (timer[room] === undefined) {
    } else {
      if (timer[room].active) {
        timer[room].runTimer();
        io.to(room).emit("timer", timer[room].time);
      }
    }
  }
}, 1000);

function userInteraction() {
  BODIES.forEach((b) => {
    b.update();
  });
}

function serverLoop() {
  userInteraction();
  // RACKET POSITION
  for (let id in serverRackets) {
    if (
      serverRackets[id].x !== playerReg[id].x ||
      serverRackets[id].y !== playerReg[id].y
    ) {
      // console.log(serverRackets[id].x, serverRackets[id].y);
      io.to(serverRackets[id].roomNo).emit("positionUpdate", {
        id: id,
        x: serverRackets[id].x,
        y: serverRackets[id].y,
      });
    }
    playerReg[id].x = serverRackets[id].x;
    playerReg[id].y = serverRackets[id].y;
  }
  // BALL POSITION
  for (let room = 1; room <= roomNo; room++) {
    if (hockeyBall[room] === undefined) {
      // console.log("waiting for P2");
    } else {
      if (
        hockeyBall[room].player1 !== undefined &&
        hockeyBall[room].player2 !== undefined
      ) {
        if (
          hockeyBall[room].x !== hockeyBallReg[room].x ||
          hockeyBall[room].y !== hockeyBallReg[room].y
        ) {
          // console.log(hockeyBall[room].x);
          io.to(room).emit("updateHockeyBall", {
            x: hockeyBall[room].x,
            y: hockeyBall[room].y,
            roomNo: room,
          });
        }
        hockeyBallReg[room].x = hockeyBall[room].x;
        hockeyBallReg[room].y = hockeyBall[room].y;
      }
      gameLogic(room);
    }
  }
}

function gameLogic(room) {
  if (timer[room].time > 0) {
    if (
      hockeyBall[room].y > 90 &&
      hockeyBall[room].y < hockeyBall[room].field.height - 90
    ) {
      if (
        hockeyBall[room].x <= hockeyBall[room].radius ||
        hockeyBall[room].x >=
          hockeyBall[room].field.width - hockeyBall[room].radius
      ) {
        scoring(room);
      }
    }
    for (let id in serverRackets) {
      if (
        serverRackets[id].score === 3 &&
        serverRackets[id].roomNo === roomNo
      ) {
        gameOver();
      }
    }
  } else {
    gameOver();
    // for (let id in serverRackets) {
    // }
  }
}

function scoring(room) {
  let scorerId;
  if (
    hockeyBall[room].y > 90 &&
    hockeyBall[room].y < hockeyBall[room].field.height - 90
  ) {
    if (
      hockeyBall[room].x >=
      hockeyBall[room].field.width - hockeyBall[room].radius
    ) {
      for (let id in serverRackets) {
        if (serverRackets[id].no === 1 && serverRackets[id].roomNo === roomNo) {
          serverRackets[id].score++;
          scorerId = id;
          console.log("score for player 1!");
          hockeyBall[room].reset();
          io.to(room).emit("updateHockeyBall", {
            x: 314,
            y: 156,
            roomNo: room,
          });
          hockeyBall[room].x = 314;
          hockeyBall[room].y = 156;
        }
      }
    }
    if (hockeyBall[room].x <= hockeyBall[room].radius) {
      for (let id in serverRackets) {
        if (serverRackets[id].no === 2 && serverRackets[id].roomNo === roomNo) {
          serverRackets[id].score++;
          scorerId = id;
          console.log("score for player 2!");
          hockeyBall[room].reset();
          io.to(room).emit("updateHockeyBall", {
            x: 514,
            y: 156,
            roomNo: room,
          });
          hockeyBall[room].x = 514;
          hockeyBall[room].y = 156;
        }
      }
    }
  }
  gameSetup();
  // TODO 여기에 딜레이 줘서 바로 시작하지 못하게
  // TODO 잠시 스탑 이벤트 만들기 3,2,1....
  io.to(roomNo).emit("updateScore", scorerId);
}

function gameSetup() {
  for (let id in serverRackets) {
    if (serverRackets[id].no === 1 && serverRackets[id].roomNo === roomNo) {
      io.to(serverRackets[id].roomNo).emit("positionUpdate", {
        id: id,
        x: 157,
        y: 156,
      });
      serverRackets[id].x = 157;
      serverRackets[id].y = 156;
      serverRackets[id].velocity = { x: 0, y: 0 };
    }
    if (serverRackets[id].no === 2 && serverRackets[id].roomNo === roomNo) {
      io.to(serverRackets[id].roomNo).emit("positionUpdate", {
        id: id,
        x: 671,
        y: 156,
      });
      serverRackets[id].x = 671;
      serverRackets[id].y = 156;
      serverRackets[id].velocity = { x: 0, y: 0 };
    }
  }
}

function gameOver() {
  console.log("Game Over");
  gameSetup();
  io.emit("updateScore", null);
  for (let id in serverRackets) {
    serverRackets[id].score = 0;
  }
  if (timer[roomNo] !== undefined) {
    timer[roomNo].time = 120;
    timer[roomNo].active = false;
  }
}

export default httpServer;
