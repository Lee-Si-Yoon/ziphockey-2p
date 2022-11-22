var socket = io();
import { gsap } from "gsap";
import "../scss/styles.scss";

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
      // this.emitCommands(controls);
    };
    this.pointerMoveEvent = (e) => {
      // console.log(e);
    };
    this.children.forEach((c) => {
      c.addEventListener("pointermove", this.pointerMoveEvent);
      c.addEventListener("pointerup", this.pointerUpEvent);
      c.addEventListener("pointerdown", this.pointerDownEvent);
    });
  }
  emitCommands(controls) {
    socket.emit("userCommands", controls);
  }
}

class Racket {
  constructor(x, y, elem, id) {
    this.x = x;
    this.y = y;
    this.nx = x;
    this.ny = y;
    this.velocity = { x: 0, y: 0 };
    this.id = id;
    this.mass = 3;
    this.speed = 7;
    this.elem = elem;
    this.radius = elem.getBoundingClientRect().width / 2;
    this.score = 0;
  }

  draw(newX, newY) {
    gsap.to(this.elem, {
      x: newX - this.radius,
      y: newY - this.radius,
      ease: "power4.out",
    });
  }
}

class Ball {
  constructor(x, y, elem) {
    this.x = x;
    this.y = y;
    this.nx = x;
    this.ny = y;
    this.velocity = { x: 0, y: 0 };
    this.mass = 3;
    this.speed = 7;
    this.elem = elem;
    this.radius = elem.getBoundingClientRect().width / 2;
  }

  draw(newX, newY) {
    gsap.to(this.elem, {
      x: newX - this.radius,
      y: newY - this.radius,
      ease: "power4.out",
    });
  }
}

let selfID;
let clientRackets = {};
let hockeyBall;

socket.on("connect", () => {
  console.log("emit NewPlayer with id: " + socket.id);
  selfID = socket.id;
  const playground = document.querySelector(".playground");
  const { width, height } = playground.getBoundingClientRect();
  socket.emit("NewPlayground", { width, height });
});

socket.on("updateConnections", (player, clientNo, roomNo) => {
  console.log("on updateConnections id: " + player[selfID].id);
  // console.log(player[selfID]);
  const playground = document.querySelector(".playground__container");
  let playersFound = {};
  for (let id in player) {
    if (clientRackets[id] === undefined) {
      const racketDiv = document.createElement("div");
      racketDiv.classList.add("racket");
      playground.appendChild(racketDiv);
      clientRackets[id] = new Racket(player[id].x, player[id].y, racketDiv, player[id].id);
      // TODO 플레이어 상태 타이밍 맞게 업로드
      if (player[id].no === 1) {
        const statusContainer = document.querySelector(".status__P1");
        statusContainer.children[0].innerHTML = "room: " + roomNo;
        statusContainer.children[1].innerHTML = "player: " + clientNo;
      } else if (player[id].no === 2) {
        const statusContainer = document.querySelector(".status__P2");
        statusContainer.children[0].innerHTML = "room: " + roomNo;
        statusContainer.children[1].innerHTML = "player: " + clientNo;
      }
      if (id === selfID) {
        const buttonContainer1 = document.querySelector(".button__container__P1");
        const buttonContainer2 = document.querySelector(".button__container__P2");
        if (player[selfID].no === 1) {
          const control1 = new Controller(buttonContainer1, controls);
        } else if (player[selfID].no === 2) {
          const control2 = new Controller(buttonContainer2, controls);
        }
      }
    }
    playersFound[id] = true;
    for (let id in clientRackets) {
      if (!playersFound[id]) {
        // console.log(clientRackets[id], selfID);
        clientRackets[id].elem.remove();
        delete clientRackets[id];
      }
    }
  }
});

socket.on("positionUpdate", (playerReg) => {
  // console.log("getting ", playerReg);
  for (let id in playerReg) {
    if (clientRackets[id] !== undefined) {
      // console.log(clientRackets[id]);
      clientRackets[id].draw(playerReg[id].x, playerReg[id].y);
    }
  }
});

socket.on("updateHockeyBall", (hockeyBallReg) => {
  // console.log("getting ", hockeyBallReg);
  if (hockeyBall === undefined) {
    const playground = document.querySelector(".playground__container");
    const ballDiv = document.createElement("div");
    ballDiv.classList.add("ball");
    playground.appendChild(ballDiv);
    hockeyBall = new Ball(hockeyBallReg.x, hockeyBallReg.y, ballDiv);
  } else {
    hockeyBall.draw(hockeyBallReg.x, hockeyBallReg.y);
  }
});

socket.on("updateScore", (scorerId) => {
  if (scorerId === null) {
    for (let id in clientRackets) {
      clientRackets[id].score = 0;
    }
  } else {
    for (let id in clientRackets) {
      if (id === scorerId) {
        if (clientRackets[id].no === 1) {
          clientRackets[id].score++;
          console.log("score for player 1!");
        } else if (clientRackets[id].no === 2) {
          clientRackets[id].score++;
          console.log("score for player 2!");
        }
      }
    }
  }
});

socket.on("collision__P1", () => {
  console.log("collision__P1");
});
socket.on("collision__P2", () => {
  console.log("collision__P2");
});

/** DOM 기능들 */
function lockButton() {
  const lockBtnP1 = document.querySelector(".lock__button__P1");
  const lockBtnP2 = document.querySelector(".lock__button__P2");
  function onClickShowP1() {
    body.style.overflow = "visible";
    lockBtnP1.addEventListener("click", onClickHideP1);
  }
  function onClickShowP2() {
    body.style.overflow = "visible";
    lockBtnP2.addEventListener("click", onClickHideP2);
  }
  function onClickHideP1() {
    body.style.overflow = "hidden";
    lockBtnP1.removeEventListener("click", onClickHideP1);
    lockBtnP1.addEventListener("click", onClickShowP1);
  }
  function onClickHideP2() {
    body.style.overflow = "hidden";
    lockBtnP2.removeEventListener("click", onClickHideP2);
    lockBtnP2.addEventListener("click", onClickShowP2);
  }
  lockBtnP1.addEventListener("click", onClickHideP1);
  lockBtnP2.addEventListener("click", onClickHideP2);
}
lockButton();

/**
 * 페이지 숨기고 보여줄 때 사용
 * @param {HTMLElement} hide 숨길 것
 * @param {HTMLElement} show 보여줄 것
 */
export function hideAndShow(hide, show) {
  hide.classList.add("hidden");
  show.classList.remove("hidden");
}
const body = document.querySelector("body");
window.onload = () => {
  body.classList.remove("loading");
  gsap.from(body, {
    opacity: 0,
    duration: 1,
    ease: "Power3.easeOut",
  });
};
