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
    this.radius = 40;
    // CONTROLS
    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;
    // set
    this.no;
    this.field = { width: 0, height: 0 };
    this.score = 0;
    BODIES.push(this);
  }
  block__upAndDown() {
    if (this.ny + this.radius > this.field.height) {
      this.down = false;
      this.ny = this.field.height - this.radius;
      this.velocity.y *= -1;
    }
    if (this.ny - this.radius < 0) {
      this.up = false;
      this.ny = this.radius;
      this.velocity.y *= -1;
    }
  }
  block__P1() {
    if (this.nx + this.radius > this.field.width / 2) {
      this.right = false;
      this.nx = this.field.width - this.radius;
      this.velocity.x *= -1;
    }
    if (this.nx - this.radius < 0) {
      this.left = false;
      this.nx = this.radius;
      this.velocity.x *= -1;
    }
  }
  block__P2() {
    if (this.nx + this.radius > this.field.width) {
      this.right = false;
      this.nx = this.field.width - this.radius;
      this.velocity.x *= -1;
    }
    if (this.nx - this.radius < this.field.width / 2) {
      this.left = false;
      this.nx = this.radius;
      this.velocity.x *= -1;
    }
  }
  update() {
    this.velocity = { x: 0, y: 0 };

    if (this.left) this.velocity.x -= this.speed;
    if (this.right) this.velocity.x += this.speed;
    if (this.up) this.velocity.y -= this.speed;
    if (this.down) this.velocity.y += this.speed;

    this.block__upAndDown();
    if (+this.no === 1) {
      this.block__P1();
    } else if (+this.no === 2) {
      this.block__P2();
    }

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
    this.radius = 40;
    // GET
    this.player1 = player1;
    this.player2 = player2;
    this.field = { width: 0, height: 0 };
    BODIES.push(this);
  }
  // 라켓과 공이 충돌했는지 판별하는 함수
  collision(racket) {
    // 중심점 좌표 사이의 거리가 두 반지름의 합보다 작으면 충돌
    let distanceUnits = Math.sqrt(
      Math.pow(Math.abs(this.x - racket.x), 2) + Math.pow(Math.abs(this.y - racket.y), 2)
    );
    let sumRadius = this.radius + racket.radius;

    return distanceUnits < sumRadius;
  }
  getVelocity(racket) {
    return {
      x:
        ((this.mass - racket.mass * this.corFactor) / (this.mass + racket.mass)) * this.velocity.x +
        ((racket.mass + racket.mass * this.corFactor) / (this.mass + racket.mass)) *
          racket.velocity.x,
      y:
        ((this.mass - racket.mass * this.corFactor) / (this.mass + racket.mass)) * this.velocity.y +
        ((racket.mass + racket.mass * this.corFactor) / (this.mass + racket.mass)) *
          racket.velocity.y,
    };
  }
  checkWalls() {
    // 벽 확인
    if (this.nx + this.radius > this.field.width) {
      this.nx = this.field.width - this.radius;
      this.velocity.x *= -1;
    }
    if (this.nx - this.radius < 0) {
      this.nx = this.radius;
      this.velocity.x *= -1;
    }
    if (this.ny + this.radius > this.field.height) {
      this.ny = this.field.height - this.radius;
      this.velocity.y *= -1;
    }
    if (this.ny - this.radius < 0) {
      this.ny = this.radius;
      this.velocity.y *= -1;
    }
  }
  update() {
    // 라켓에 충돌할 시 공의 이동 방향이 바뀜
    if (this.player1 !== undefined && this.player2 !== undefined) {
      if (this.collision(this.player1)) {
        this.velocity = this.getVelocity(this.player1);
        io.emit("collision__P1");
      } else if (this.collision(this.player2)) {
        this.velocity = this.getVelocity(this.player2);
        io.emit("collision__P2");
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
          x: this.velocity.x * -1,
          y: this.velocity.y * -1,
        };
        // 라켓이 움직일 수 없으면 공을 움직임
        if (
          this.player1.y - this.velocity.y > this.field.height - this.player1.radius ||
          this.player1.y - this.velocity.y < this.field.height / 2 + this.player1.radius
        ) {
          // while (this.collision(player)) {
          //   this.nx = this.x + this.velocity.x;
          //   this.ny = this.y + this.velocity.y;
          //   this.x = this.nx;
          //   this.y = this.ny;
          // }
          // 공이 움직일 수 없으면 라켓을 움직임
        } else {
          while (this.collision(this.player1)) {
            this.player1.nx = this.player1.x - this.velocity.x;
            this.player1.ny = this.player1.y - this.velocity.y;
            this.player1.x = this.player1.nx;
            this.player1.y = this.player1.ny;
          }
        }
      }
      if (this.collision(this.player2)) {
        this.velocity = {
          x: this.velocity.x * -1,
          y: this.velocity.y * -1,
        };
        // 라켓이 움직일 수 없으면 공을 움직임
        if (
          this.player2.y - this.velocity.y > this.field.height - this.player2.radius ||
          this.player2.y - this.velocity.y < this.field.height / 2 + this.player2.radius
        ) {
          // while (this.collision(player)) {
          //   this.nx = this.x + this.velocity.x;
          //   this.ny = this.y + this.velocity.y;
          //   this.x = this.nx;
          //   this.y = this.ny;
          // }
          // 공이 움직일 수 없으면 라켓을 움직임
        } else {
          while (this.collision(this.player2)) {
            this.player2.nx = this.player2.x - this.velocity.x;
            this.player2.ny = this.player2.y - this.velocity.y;
            this.player2.x = this.player2.nx;
            this.player2.y = this.player2.ny;
          }
        }
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
let serverRackets = []; // 서버 상 라켓
let playerReg = {}; // 라켓의 위치
let clientNo = 0;
let roomNo;
let hockeyBall;
let hockeyBallReg = {};

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
    playerReg[socket.id] = { id: socket.id, x: 150, y: 50, no: 1 };
    hockeyBall = new Ball(400, 200);
    io.sockets.emit("updateHockeyBall", { x: hockeyBall.x, y: hockeyBall.y });
  } else if (clientNo % 2 === 0) {
    serverRackets[socket.id] = new Racket(600, 200);
    // serverRackets[socket.id].layer = roomNo;
    serverRackets[socket.id].no = 2;
    playerReg[socket.id] = { id: socket.id, x: 200, y: 50, no: 2 };
  }

  socket.on("NewPlayground", (dimension) => {
    // console.log(dimension.width, dimension.height);
    serverRackets[socket.id].field = dimension;
    hockeyBall.field = dimension;
    if (clientNo % 2 === 1) {
      serverRackets[socket.id].x = dimension.width * 0.25;
      serverRackets[socket.id].y = dimension.height * 0.5;
      // hockeyBallReg.x = dimension.width * 0.5;
      // hockeyBallReg.y = dimension.height * 0.5;
      hockeyBall.player1 = serverRackets[socket.id];
    } else if (clientNo % 2 === 0) {
      serverRackets[socket.id].x = dimension.width * 0.75;
      serverRackets[socket.id].y = dimension.height / 2;
      hockeyBall.x = dimension.width * 0.3;
      hockeyBall.y = dimension.height * 0.5;
      hockeyBall.player2 = serverRackets[socket.id];
    }
    // console.log(hockeyBall);
  });

  io.sockets.emit("updateConnections", playerReg, clientNo, roomNo);

  socket.on("disconnect", function () {
    // console.log(`on disconnection room: ${serverRackets[socket.id].layer}`);
    delete serverRackets[socket.id];
    delete playerReg[socket.id];
    if (clientNo % 2 === 0) {
      hockeyBall = {};
    }
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
    // TODO 컨트롤 계속 true로 두지 않기
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
  if (hockeyBall === undefined) {
    // console.log("waiting for P2");
    return;
  } else {
    if (hockeyBall.player1 !== undefined && hockeyBall.player2 !== undefined) {
      hockeyBallReg = { x: hockeyBall.x, y: hockeyBall.y };
      gameLogic();
    }
  }
  io.emit("positionUpdate", playerReg);
  io.emit("updateHockeyBall", hockeyBallReg);
}

function gameLogic() {
  if (
    hockeyBall.x <= hockeyBall.radius ||
    hockeyBall.x >= hockeyBall.field.width - hockeyBall.radius
  ) {
    scoring();
  }
  for (let id in serverRackets) {
    if (serverRackets[id].score === 3) {
      gameOver();
    }
  }
}

function gameOver() {
  console.log("Game Over");
  gameSetup();
  io.emit("updateScore", null);
  setTimeout(() => {
    for (let id in serverRackets) {
      serverRackets[id].score = 0;
    }
  }, 2000);
}

function scoring() {
  let scorerId;

  if (hockeyBall.x <= hockeyBall.radius) {
    for (let id in serverRackets) {
      if (serverRackets[id].no === 2) {
        serverRackets[id].score++;
        scorerId = id;
        console.log("score for player 2!");
      }
    }
  }
  if (hockeyBall.x >= hockeyBall.field.width - hockeyBall.radius) {
    for (let id in serverRackets) {
      if (serverRackets[id].no === 1) {
        serverRackets[id].score++;
        scorerId = id;
        console.log("score for player 1!");
      }
    }
  }
  gameSetup();
  // TODO 여기에 딜레이 줘서 바로 시작하지 못하게
  // TODO 잠시 스탑 이벤트 만들기 3,2,1....
  io.emit("updateScore", scorerId);
}

function gameSetup() {
  for (let id in serverRackets) {
    if (serverRackets[id].no === 1) {
      serverRackets[id].x = serverRackets[id].field.width * 0.25;
      serverRackets[id].y = serverRackets[id].field.height * 0.5;
    }
    if (serverRackets[id].no === 2) {
      serverRackets[id].x = serverRackets[id].field.width * 0.75;
      serverRackets[id].y = serverRackets[id].field.height * 0.5;
    }
  }
  hockeyBall.x = hockeyBall.field.width * 0.3;
  hockeyBall.y = hockeyBall.field.height * 0.5;
}

export default httpServer;
