let socket = io();
import { gsap } from "gsap";
import { ball, racket_1P, racket_2P, racket_3P } from "./dom";

let controls = { left: false, right: false, up: false, down: false };

class Controller {
  constructor(elem, controls) {
    this.elem = elem;
    this.controls = controls;
    this.children = [...this.elem.children];
    this.children.forEach((c) => {
      c.style.backgroundColor = "white";
    });
    this.pointerDownEvent = (e) => {
      // console.log(e.target);
      for (let btn in this.children) {
        if (this.children[btn] === e.target) {
          this.children[btn].style.backgroundColor = "black";
          if (e.target.classList[1] === "up") {
            // this.children[btn].style.backgroundColor = "white";
            controls.up = true;
          } else if (e.target.classList[1] === "down") {
            controls.down = true;
          } else if (e.target.classList[1] === "right") {
            controls.right = true;
          } else if (e.target.classList[1] === "left") {
            controls.left = true;
          }
        }
      }
      // console.log(controls);
      this.emitCommands(controls);
    };
    this.pointerUpEvent = (e) => {
      // console.log(e.target);
      for (let btn in this.children) {
        if (this.children[btn] === e.target) {
          this.children[btn].style.backgroundColor = "white";
          if (e.target.classList[1] === "up") {
            controls.up = false;
          } else if (e.target.classList[1] === "down") {
            controls.down = false;
          } else if (e.target.classList[1] === "right") {
            controls.right = false;
          } else if (e.target.classList[1] === "left") {
            controls.left = false;
          }
        }
      }
      this.emitCommands(controls);
    };
    this.pointerMoveEvent = (e) => {
      // console.log(e);
    };
    this.children.forEach((c) => {
      // c.addEventListener("pointermove", this.pointerMoveEvent);
      // c.addEventListener("pointerup", this.pointerUpEvent);
      // c.addEventListener("pointerdown", this.pointerDownEvent);
      c.addEventListener("touchmove", this.pointerMoveEvent);
      c.addEventListener("touchend", this.pointerUpEvent);
      c.addEventListener("touchstart", this.pointerDownEvent);
    });
  }
  emitCommands(controls) {
    socket.emit("userCommands", controls);
  }
}

const lerp = (a, b, n) => (1 - n) * a + n * b;
// let RacketPos = { x: 0, y: 0 };

class Racket {
  constructor(x, y, elem, id) {
    this.x = x;
    this.y = y;
    this.nx = x;
    this.ny = y;
    this.id = id;
    this.elem = elem;
    this.radius = elem.getBoundingClientRect().width / 2;
  }
  render() {
    requestAnimationFrame(() => this.draw(this.x, this.y));
  }
  draw(newX, newY) {
    const nX = lerp(this.nx, newX, 0.05);
    const nY = lerp(this.ny, newY, 0.05);
    gsap.to(this.elem, {
      x: nX - this.radius,
      y: nY - this.radius,
      ease: "Sine.out",
    });
    this.nx = newX;
    this.ny = newY;
    // gsap.to(this.elem, {
    //   x: newX - this.radius,
    //   y: newY - this.radius,
    //   ease: "Sine.out",
    // });
  }
}

class Ball {
  constructor(x, y, elem, roomNo) {
    this.x = x;
    this.y = y;
    this.nx = x;
    this.ny = y;
    this.velocity = { x: 0, y: 0 };
    this.mass = 3;
    this.speed = 7;
    this.elem = elem;
    this.radius = elem.getBoundingClientRect().width / 2;
    this.roomNo = roomNo;
  }
  fadeOutIn() {
    this.elem.style.opacity = 0;
    setTimeout(() => {
      gsap.to(this.elem, {
        opacity: 1,
        ease: "Sine.out",
      });
    }, 2000);
  }
  draw(newX, newY) {
    const nX = lerp(this.nx, newX, 0.05);
    const nY = lerp(this.ny, newY, 0.05);
    gsap.to(this.elem, {
      x: nX - this.radius,
      y: nY - this.radius,
      ease: "Sine.out",
    });
    this.nx = newX;
    this.ny = newY;
    // gsap.to(this.elem, {
    //   x: newX - this.radius,
    //   y: newY - this.radius,
    //   ease: "Sine.out",
    // });
  }
}

let selfID;
let clientRackets = {};
let hockeyBall;

socket.on("connect", () => {
  selfID = socket.id;
  console.log("NewPlayer with id: " + selfID);
  const playground = document.querySelector(".playground");
  const width = playground.offsetWidth;
  const height = playground.offsetHeight;
  socket.emit("NewPlayground", { width, height });
  setInterval(() => {
    socket.emit("ping");
  }, 1000);
});

socket.on("updateConnections", (player) => {
  console.log("on updateConnections, id: " + player[selfID].id);
  const playground = document.querySelector(".playground__container");
  for (let id in player) {
    if (clientRackets[id] === undefined) {
      const racketDiv = document.createElement("img");
      racketDiv.classList.add("racket");
      playground.appendChild(racketDiv);
      clientRackets[id] = new Racket(player[id].x, player[id].y, racketDiv, player[id].id);
      clientRackets[id].no = player[id].no;
      console.log(`Created new clientRacket: ${clientRackets[id].id}`);
      console.log(`new clientRacket position: x:${player[id].x}, y:${player[id].y}`);
      clientRackets[id].draw(player[id].x, player[id].y);
      if (id === selfID) {
        if (player[selfID].no === 1) {
          const buttonContainer1 = document.querySelector(".button__container__P1");
          const control1 = new Controller(buttonContainer1, controls);
          racketDiv.src = racket_1P;
        } else if (player[selfID].no === 2) {
          const buttonContainer2 = document.querySelector(".button__container__P2");
          const control2 = new Controller(buttonContainer2, controls);
          racketDiv.src = racket_2P;
        }
      }
    }
  }
});

let racketPos = { x: 0, y: 0 };
socket.on("positionUpdate", (playerReg) => {
  // console.log("getting ", playerReg);
  for (let id in clientRackets) {
    if (clientRackets[id] !== undefined && id === playerReg.id) {
      if (racketPos.x !== playerReg.x || racketPos.y !== playerReg.y) {
        clientRackets[id].draw(playerReg.x, playerReg.y);
      }
      racketPos.x = playerReg.x;
      racketPos.y = playerReg.y;
    } else {
      // alert("no player linked - positionUpdate");
    }
  }
});

socket.on("deletePlayer", (playerReg) => {
  console.log(`before deleting player, number of players: ${Object.keys(clientRackets).length}`);
  if (clientRackets[playerReg.id]) {
    clientRackets[playerReg.id].elem.remove();
    delete clientRackets[playerReg.id];
    console.log(`deleted player, left players: ${Object.keys(clientRackets).length}`);
    hockeyBall.elem.remove();
    hockeyBall = undefined;
    console.log(`deleted hockeyBall, left hockeyBall: ${Object.keys(hockeyBall).length}`);
  }
});

socket.on("updateHockeyBall", (hockeyBallReg) => {
  if (hockeyBall === undefined) {
    const playground = document.querySelector(".playground__container");
    const ballDiv = document.createElement("img");
    ballDiv.classList.add("ball");
    playground.appendChild(ballDiv);
    hockeyBall = new Ball(hockeyBallReg.x, hockeyBallReg.y, ballDiv, hockeyBallReg.roomNo);
    ballDiv.src = ball;
    console.log(`Creating hockeyBall from updateHockeyBall: ${JSON.stringify(hockeyBall)}`);
    hockeyBall.draw(hockeyBallReg.x, hockeyBallReg.y);
  } else {
    hockeyBall.draw(hockeyBallReg.x, hockeyBallReg.y);
  }
});

socket.on("updateUI", (data) => {
  for (let id in data) {
    if (id === selfID) {
      // TODO
      if (data[selfID].no === 1) {
        console.log(`from updateUI - player1: ${JSON.stringify(data[selfID])}`);
        const status = document.getElementById("status__P1").children[0];
        status.innerHTML = `P${data[selfID].no} / R${data[selfID].roomNo}`;
        const score = document.getElementById("scores__P1__P1");
        score.style.color = "var(--player1)";
        const scorePlate = document.getElementById("plate__P1__P1");
        scorePlate.style.color = "var(--player1)";
      }
      if (data[selfID].no === 2) {
        console.log(`from updateUI - player2: ${JSON.stringify(data[selfID])}`);
        const status = document.getElementById("status__P2").children[0];
        status.innerHTML = `P${data[selfID].no} / R${data[selfID].roomNo}`;
        const score = document.getElementById("scores__P2__P2");
        score.style.color = "var(--player2)";
        const scorePlate = document.getElementById("plate__P2__P2");
        scorePlate.style.color = "var(--player2)";
      }
    }
  }
});

let scores = { P1: 0, P2: 0, P3: 0 };

socket.on("updateScore", (scorerId) => {
  const P1__P1 = document.getElementById("scores__P1__P1");
  const P1__P2 = document.getElementById("scores__P1__P2");
  const P2__P1 = document.getElementById("scores__P2__P1");
  const P2__P2 = document.getElementById("scores__P2__P2");
  const fanfare__container = document.querySelector(".fanfare__container");
  const fanfare__P1 = document.getElementById("fanfare_P1");
  const fanfare__P2 = document.getElementById("fanfare_P2");
  const winner__container = document.querySelector(".winner__container");
  const winner_P1 = document.getElementById("winner_P1");
  const winner_P2 = document.getElementById("winner_P2");
  if (scorerId === null) {
    // gameover
    const highestValue = Math.max(...Object.values(scores));
    function getKeyByValue(object, value) {
      return Object.keys(object).find((key) => object[key] === value);
    }
    console.log(`winner: ${getKeyByValue(scores, highestValue)}`);
    gsap.to(winner__container, {
      opacity: 1,
      ease: "Sine.out",
    });
    if (highestValue > 0) {
      winner_P1.children[0].innerHTML = `winner is ${getKeyByValue(scores, highestValue)}!`;
      winner_P2.children[0].innerHTML = `winner is ${getKeyByValue(scores, highestValue)}!`;
    } else if (+highestValue === 0) {
      winner_P1.children[0].innerHTML = `draw...`;
      winner_P2.children[0].innerHTML = `draw...`;
    }
    scores = { P1: 0, P2: 0, P3: 0 };
    P1__P1.innerHTML = scores.P1;
    P1__P2.innerHTML = scores.P2;
    P2__P1.innerHTML = scores.P1;
    P2__P2.innerHTML = scores.P2;
  } else {
    for (let id in clientRackets) {
      if (id === scorerId) {
        // console.log(`scored by: P ${clientRackets[scorerId].no}`);
        if (clientRackets[id].no === 1) {
          scores.P1 += 1;
          console.log(
            `score for player 1, current score P1:${scores.P1}, P2:${scores.P2}, P3:${scores.P3}`
          );
        } else if (clientRackets[id].no === 2) {
          scores.P2 += 1;
          console.log(
            `score for player 2, current score P1:${scores.P1}, P2:${scores.P2}, P3:${scores.P3}`
          );
        } else if (clientRackets[id].no === 3) {
          scores.P3 += 1;
          console.log(
            `score for player 2, current score P3:${scores.P1}, P2:${scores.P2}, P3:${scores.P3}`
          );
        }
      }
    }
    // ball
    hockeyBall.fadeOutIn();
    // fanfare container
    const highestValue = Math.max(...Object.values(scores));
    if (highestValue < 3) {
      gsap.to(fanfare__container, {
        opacity: 1,
        ease: "Sine.out",
      });
      setTimeout(() => {
        gsap.to(fanfare__container, {
          opacity: 0,
          ease: "Sine.out",
        });
      }, 2000);
    } else {
      // show winner
    }
    // GUI
    P1__P1.innerHTML = scores.P1;
    P1__P2.innerHTML = scores.P2;
    P2__P1.innerHTML = scores.P1;
    P2__P2.innerHTML = scores.P2;
    fanfare__P1.children[0].innerHTML = `score for player ${clientRackets[scorerId].no}!`;
    fanfare__P1.children[1].innerHTML = `${scores.P1} : ${scores.P2}`;
    fanfare__P2.children[0].innerHTML = `score for player ${clientRackets[scorerId].no}!`;
    fanfare__P2.children[1].innerHTML = `${scores.P1} : ${scores.P2}`;
  }
});

socket.on("collision__P1", () => {
  // console.log("collision__P1");
});
socket.on("collision__P2", () => {
  // console.log("collision__P2");
});

socket.on("timer", (time) => {
  const scores__time__P1 = document.getElementById("scores__time__P1");
  const scores__time__P2 = document.getElementById("scores__time__P2");
  scores__time__P1.innerHTML = scores__time__P2.innerHTML = time;
  // console.log(`time is ticking: ${time}`);
});

const restart_Btns = [
  document.getElementById("restart_Btn_P1"),
  document.getElementById("restart_Btn_P2"),
];
restart_Btns.forEach((r) => {
  r.addEventListener("click", () => {
    if (hockeyBall !== undefined && hockeyBall.roomNo !== undefined) {
      socket.emit("restartGame", hockeyBall.roomNo);
    }
  });
});

socket.on("restart", () => {
  const winner__container = document.querySelector(".winner__container");
  gsap.to(winner__container, {
    opacity: 0,
    ease: "Sine.out",
  });
});
