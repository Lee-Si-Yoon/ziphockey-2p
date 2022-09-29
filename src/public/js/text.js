const socket = io();

const lerp = (a, b, n) => parseFloat((1 - n) * a + n + b).toFixed(2);
let rafId;

export default class TextArea {
  constructor(ulElement, formElement) {
    this.textContainer = ulElement;
    this.form = formElement;
    this.startPosition = { x: 0, y: 0 };
    this.velocity = 2;
    this.accel = 0.25;
    this.onSubmit(this.form);
  }

  onSubmit(element) {
    element.addEventListener("submit", (e) => {
      e.preventDefault();
      let textChildrens = [
        ...document.getElementById("textAreaContainer").children,
      ];
      if (textChildrens.length === 0) {
        // 새로 메세지를 보낼 경우
        this.createBox(e.target[0].value);
        e.target[0].value = "";
        this.form.style.display = "none";
        this.render();
      } else {
        console.log("here");
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

  // lerp 사용해서 가속도 구현
  render() {
    this.velocity += this.accel;
    console.log(rafId);
    this.startPosition.y = this.startPosition.y - this.velocity;
    this.textContainer.style.transform = `translateY(${this.startPosition.y}px)`;
    rafId = requestAnimationFrame(() => this.render());
    if (
      this.textContainer.getBoundingClientRect().y <
      this.textContainer.getBoundingClientRect().height
    ) {
      this.velocity = 2;
      socket.emit("newText", this.textContainer.children[0].innerHTML);
      this.textContainer.children[0].remove();
      this.form.style.display = "flex";
      cancelAnimationFrame(rafId);
    }
  }
}
