var socket = io();
import { gsap } from "gsap";
import "../scss/styles.scss";

let controls = { left: false, right: false, up: false, down: false };

class Button {
  constructor(elem) {
    this.active = false;
    this.elem = elem;
    this.name = elem.classList[1];
    this.height = elem.offsetHeight;
    this.width = elem.offsetWidth;
    this.x = elem.getBoundingClientRect().left;
    this.y = elem.getBoundingClientRect().top;
  }
  containsPoint(x, y) {
    // if the point is outside of the rectangle return false:
    if (x < this.x || x > this.x + this.width || y < this.y || y > this.y + this.height) {
      return false;
    }
    return true;
  }
}

class Controller {
  constructor(elem) {
    this.elem = elem;
    this.childrens = [...this.elem.children];
    this.buttons = [
      new Button(this.childrens[0]),
      new Button(this.childrens[1]),
      new Button(this.childrens[2]),
      new Button(this.childrens[3]),
    ];
    // console.log(this.buttons);
    this.testButtons = (e) => {
      for (const i of this.buttons) {
        i.active = false;
        if (i.containsPoint(e.x, e.y)) {
          i.active = true;
          break;
        }
      }
    };
    this.killButtons = (_) => {
      for (const i of this.buttons) {
        i.active = false;
      }
    };

    this.elem.addEventListener("pointerup", this.killButtons);
    this.elem.addEventListener("pointermove", this.testButtons);
    this.elem.addEventListener("pointerdown", this.testButtons);

    this.render = () => {
      for (const i of this.buttons) {
        if (i.active) {
          i.elem.style.backgroundColor = "black";
          if (i.name === "left") {
            controls.left = true;
          }
          if (i.name === "right") {
            controls.right = true;
          }
          if (i.name === "up") {
            controls.up = true;
          }
          if (i.name === "down") {
            controls.down = true;
          }
        } else {
          i.elem.style.backgroundColor = "white";
          if (i.name === "left") {
            controls.left = false;
          }
          if (i.name === "right") {
            controls.right = false;
          }
          if (i.name === "up") {
            controls.up = false;
          }
          if (i.name === "down") {
            controls.down = false;
          }
        }
        // console.log(controls);
      }
      requestAnimationFrame(this.render);
    };
  }
}
// TODO block 손보기
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

socket.on("connect", () => {
  console.log("emit NewPlayer with id: " + socket.id);
  selfID = socket.id;
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
        const control1 = new Controller(buttonContainer1);
        const buttonContainer2 = document.querySelector(".button__container__P2");
        const control2 = new Controller(buttonContainer2);

        // console.log(player[selfID].no);
        if (player[selfID].no === 1) {
          control1.render();
        } else if (player[selfID].no === 2) {
          control2.render();
        }

        setInterval(() => {
          socket.emit("userCommands", controls);
        }, 1000 / 60);
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

// socket.on("deletePlayer", (player) => {
//   console.log("called deletePlayer");
//   if (clientRackets[player.id]) {
//     delete clientRackets[player.id];
//     console.log(clientRackets);
//     // TODO delete ball
//   }
// });

// socket.on("connect", () => {
//   selfId = socket.id;
// });

// socket.on("updatePlayers", (players) => {
//   // const racketP1 = document.querySelector(".racket__P1");
//   // const racketP2 = document.querySelector(".racket__P1");
//   playersFound = {};
//   const racket1 = document.createElement("div");
//   racket1.classList.add("racket");
//   racket1.classList.add("racket__P1");
//   console.log("update players" + players);
// });

// const buttonContainer1 = document.querySelector(".button__container__P1");
// const control1 = new Controller(buttonContainer1);
// const buttonContainer2 = document.querySelector(".button__container__P2");
// const control2 = new Controller(buttonContainer2);
// control1.render();
// control2.render();
// setInterval(() => {
//   socket.emit("userCommands", controls);
// }, 1000 / 60);

// socket.on("makeRoom", (clientNo, roomNo) => {
//   console.log(clientNo);
//   const statusP1 = document.querySelector(".status__P1");
//   const statusP2 = document.querySelector(".status__P2");
//   const playerNum = +clientNo % 2;
//   if (playerNum === 1) {
//     // 1번 플레이어
//     // statusP1.children[0].innerHTML = "room: " + roomNo;
//     statusP1.children[1].innerHTML = "player: " + clientNo;
//     const buttonContainer = document.querySelector(".button__container__P1");
//     const control = new Controller(buttonContainer);
//     control.render();
//     setInterval(() => {
//       socket.emit("userCommands", controls);
//     }, 1000 / 60);
//   } else {
//     // 2번 플레이어
//     // statusP2.children[0].innerHTML = "room: " + roomNo;
//     statusP2.children[1].innerHTML = "player: " + clientNo;
//     const buttonContainer = document.querySelector(".button__container__P2");
//     const control = new Controller(buttonContainer);
//     control.render();
//     setInterval(() => {
//       socket.emit("userCommands", controls);
//     }, 1000 / 60);
//   }
// });

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
