const socket = io();

const lerp = (a, b, n) => parseFloat((1 - n) * a + n + b).toFixed(2);

let posY;
let accel = 1;

export default class TextArea {
  constructor(ulElement, formElement) {
    this.textContainer = ulElement;
    this.form = formElement;
    this.startPosition = { x: 0, y: 0 };
    this.onSubmit(this.form);
  }

  onSubmit(element) {
    element.addEventListener("submit", (e) => {
      e.preventDefault();
      let textChildrens = [...this.textContainer.children];
      if (textChildrens.length === 0) {
        // 새로 메세지를 보낼 경우
        this.createBox(e.target[0].value);
        e.target[0].value = "";
        this.form.style.display = "none";
        requestAnimationFrame(() => this.render());
      } else {
      }
    });
  }
  createBox(value) {
    const newBox = document.createElement("li");
    newBox.innerText = value;
    this.textContainer.appendChild(newBox);
    this.textContainer.style.transform = `translateY(${
      window.innerHeight - this.textContainer.getBoundingClientRect().height
    }px)`;
    this.startPosition.x = this.textContainer.getBoundingClientRect().x;
    this.startPosition.y = this.textContainer.getBoundingClientRect().y;
  }

  // requestanimationframe을 실시간을 계속 돌리지 않을 방법
  // translateY를 이용해서 옮길 방법
  render() {
    this.startPosition.y = this.startPosition.y - 2;
    this.textContainer.style.transform = `translateY(${this.startPosition.y}px)`;
    if (
      this.textContainer.getBoundingClientRect().y <
      this.textContainer.getBoundingClientRect().height
    ) {
      socket.emit("newText", this.textContainer.children[0].innerHTML);
      this.textContainer.remove();
      this.form.style.display = "flex";
    }
    requestAnimationFrame(() => this.render());
  }
}
