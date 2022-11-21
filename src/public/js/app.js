var socket = io();
import { gsap } from "gsap";
import "../scss/styles.scss";

let controls = { left: false, right: false, up: false, down: false };

// class Button {
//   constructor(elem) {
//     this.active = false;
//     this.elem = elem;
//     this.name = elem.classList[1];
//     this.x = elem.getBoundingClientRect().left;
//     this.y = elem.getBoundingClientRect().top;
//     this.height = elem.getBoundingClientRect().height;
//     this.width = elem.getBoundingClientRect().width;
//   }
//   containsPoint(x, y) {
//     // if the point is outside of the rectangle return false:
//     if (x < this.x || x > this.x + this.width || y < this.y || y > this.y + this.height) {
//       return false;
//     }
//     return true;
//   }
// }

// class Controller {
//   constructor(elem) {
//     this.elem = elem;
//     this.childrens = [...this.elem.children];
//     this.buttons = [
//       new Button(this.childrens[0]),
//       new Button(this.childrens[1]),
//       new Button(this.childrens[2]),
//       new Button(this.childrens[3]),
//     ];
//     // console.log(this.buttons);
//     this.testButtons = (e) => {
//       console.log(e);
//       // console.log(e.x, this.buttons[0].x, this.buttons[0].width);
//       for (const i of this.buttons) {
//         i.active = false;
//         if (i.containsPoint(e.x, e.y)) {
//           i.active = true;
//           break;
//         }
//       }
//     };

//     this.killButtons = (_) => {
//       for (const i of this.buttons) {
//         i.active = false;
//       }
//     };

//     this.elem.addEventListener("pointerup", this.killButtons);
//     this.elem.addEventListener("pointermove", this.testButtons);
//     this.elem.addEventListener("pointerdown", this.testButtons);

//     this.render = () => {
//       for (const i of this.buttons) {
//         if (i.active) {
//           i.elem.style.backgroundColor = "black";
//           if (i.name === "left") {
//             controls.left = true;
//           }
//           if (i.name === "right") {
//             controls.right = true;
//           }
//           if (i.name === "up") {
//             controls.up = true;
//           }
//           if (i.name === "down") {
//             controls.down = true;
//           }
//         } else {
//           i.elem.style.backgroundColor = "white";
//           if (i.name === "left") {
//             controls.left = false;
//           }
//           if (i.name === "right") {
//             controls.right = false;
//           }
//           if (i.name === "up") {
//             controls.up = false;
//           }
//           if (i.name === "down") {
//             controls.down = false;
//           }
//         }
//         // console.log(controls);
//       }
//       requestAnimationFrame(this.render);
//     };
//   }
// }

let justPressed = false;

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
      console.log(controls);
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
        const buttonContainer2 = document.querySelector(".button__container__P2");
        if (player[selfID].no === 1) {
          const control1 = new Controller(buttonContainer1, controls);
        } else if (player[selfID].no === 2) {
          const control2 = new Controller(buttonContainer2, controls);
        }

        // const buttonContainer1 = document.querySelector(".button__container__P1");
        // const control1 = new Controller(buttonContainer1);
        // const buttonContainer2 = document.querySelector(".button__container__P2");
        // const control2 = new Controller(buttonContainer2);
        // // console.log(player[selfID].no);
        // if (player[selfID].no === 1) {
        //   control1.render();
        // } else if (player[selfID].no === 2) {
        //   control2.render();
        // }
        // setInterval(() => {
        //   socket.emit("userCommands", controls);
        // }, 1000 / 60);
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
