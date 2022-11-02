const hockeyField = document.getElementById("hockeyCtx");
const fieldCtx = hockeyField.getContext("2d");

class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.velocity = { x: 0, y: 0 };
    this.color = "black";
    this.radius = 20;
    this.mass = 1;
    this.corFactor = 1.2;
  }
  /**
   * x축과 y축으로 속도를 결정하는 함수
   * @param {object} racket
   * @returns {{x:number, y:number}}
   */
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

  /**
   * 라켓과 공이 충돌했는지 판별하는 함수
   * @param {object} racket
   * @returns {boolean}
   */
  collision(racket) {
    // 중심점 좌표 사이의 거리가 두 반지름의 합보다 작으면 충돌
    let distanceUnits = Math.sqrt(
      Math.pow(Math.abs(this.x - racket.x), 2) +
        Math.pow(Math.abs(this.y - racket.y), 2)
    );
    let sumRadius = this.radius + racket.radius;

    return distanceUnits < sumRadius;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
  }
}

const controller = document.getElementById("hockeyController");
const controllerCtx = controller.getContext("2d");

class Racket {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.nx = x;
    this.ny = y;
    this.velocity = { x: 0, y: 0 };
    this.color = "red";
    this.radius = 30;
    this.mass = 3;
    this.speed = 7;
  }
  update() {
    this.velocity = { x: 0, y: 0 };

    this.nx = this.x + this.velocity.x;
    this.ny = this.y + this.velocity.y;

    this.x = this.nx;
    this.y = this.ny;
  }
  draw() {
    controllerCtx.lineWidth = 3;
    // controllerCtx.strokeStyle = "white";
    controllerCtx.fillStyle = this.color;
    controllerCtx.beginPath();
    controllerCtx.arc(this.x, this.y, this.radius, 0, Math.Pi * 2, true);
    controllerCtx.closePath();
    controllerCtx.fill();
  }
}

const { width, height } = controller.getBoundingClientRect();
const player = new Racket(width / 2, height - 60);
let running = true;

function render() {
  player.update();
  player.draw();
  if (running) requestAnimationFrame(render);
}

function init() {
  // controller.addEventListener("pointerdown", onPointerDown);
  // controller.addEventListener("pointermove", onPointerMove);
  // controller.addEventListener("pointerup", onPointerUp);
  // controller.addEventListener("pointercancel", onPointerUp);

  render();
}
init();

// let touching = false;

// function onPointerMove(event) {
//   const dot = document.getElementById(event.pointerId);
//   if (dot == null) return;
//   positionDot(event, dot);
// }

// function onPointerDown(event) {
//   const dot = document.createElement("div");
//   dot.classList.add("dot");
//   dot.id = event.pointerId;
//   positionDot(event, dot);
//   document.body.append(dot);
// }

// function onPointerUp(event) {
//   console.log("called");
//   const dot = document.getElementById(event.pointerId);
//   if (dot == null) return;
//   dot.remove();
// }

// function positionDot(e, dot) {
//   dot.style.position = "absolute";
//   dot.style.width = `${e.width}px`;
//   dot.style.height = `${e.height}px`;
//   dot.style.left = `${e.pageX}px`;
//   dot.style.top = `${e.pageY}px`;
//   dot.style.backgroundColor = "red";
// }

// window.onload = () => {
//   controller.addEventListener("pointerdown", onPointerDown);
//   controller.addEventListener("pointermove", onPointerMove);
//   controller.addEventListener("pointerup", onPointerUp);
//   controller.addEventListener("pointercancel", onPointerUp);
// };
