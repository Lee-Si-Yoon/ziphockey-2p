const socket = io();

const lerp = (a, b, n) => parseFloat((1 - n) * a + n + b).toFixed(2);

let textStack = [];
let posY;
let accel = 1;

class sender {
  constructor() {
    this.textContainer = document.getElementById("textAreaContainer");
    this.form = document.querySelector(".send__form");
    this.onSubmit(this.form);
    this.sendBox();
  }
  onSubmit(element) {
    element.addEventListener("submit", (e) => {
      e.preventDefault();
      let textChildrens = [
        ...document.getElementById("textAreaContainer").children,
      ];
      // 새로 메세지를 보낼 경우
      if (textChildrens.length === 0) {
        this.createBox(e.target[0].value);
        e.target[0].value = "";
        this.form.style.display = "none";
        this.sendBox(this.textContainer.children[0]);
      } else {
      }
    });
  }
  createBox(value) {
    const newBox = document.createElement("li");
    newBox.innerText = value;
    this.textContainer.appendChild(newBox);
    this.textContainer.style.setProperty(
      "--move-y",
      `${window.innerHeight - newBox.getBoundingClientRect().height}px`
    );
    textStack.push(newBox);
    posY = newBox.getBoundingClientRect().y;
  }
  // requestanimationframe을 실시간을 계속 돌리지 않을 방법
  sendBox() {
    posY = posY - 2 * accel;
    accel += 0.01;
    this.textContainer.style.setProperty("--move-y", `${posY}px`);
    if (
      this.textContainer.getBoundingClientRect().y <
        this.textContainer.getBoundingClientRect().height &&
      this.textContainer.children[0]
    ) {
      accel = 1;
      socket.emit("newText", this.textContainer.children[0].innerHTML);
      this.textContainer.children[0].remove();
      this.form.style.display = "flex";
    }
    requestAnimationFrame(this.sendBox.bind(this));
  }
}

new sender();
