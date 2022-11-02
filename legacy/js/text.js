import { emitMessage } from "./utils";

let rafId;
let heading = 0;
let directionConfig = { first: 150, second: 0 };

class Handler {
  constructor() {
    this.container = document.getElementById("handler");
    this.button = this.container.children[0];
    this.form = this.container.children[1];

    this.button.addEventListener("click", (e) => {
      this.button.style.display = "none";
      this.form.style.display = "flex";
    });

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      directionConfig.first = e.target[0].value;
      directionConfig.second = e.target[1].value;
      this.form.style.display = "none";
      this.button.style.display = "flex";
    });
  }
}

class Compass {
  constructor() {
    this.container = document.getElementById("compassContainer");

    if ("Magnetometer" in window) {
      let sensor = new Magnetometer();
      // sensor addeventlisten "error" 추가
      sensor.addEventListener("reading", (e) => {
        heading = Math.atan2(e.target.y, e.target.x) * (180 / Math.PI);
        heading = heading - 90;
        if (heading < 0) heading = 360 + heading;
        this.container.children[0].innerHTML = "각도: " + heading.toFixed(2);
        if (heading > directionConfig.first) {
          this.container.children[1].innerHTML = "→";
        } else {
          this.container.children[1].innerHTML = "←";
        }
      });
      sensor.start();
    } else {
      this.container.children[0].innerHTML = "센서 없음";
    }
  }
}

class TextArea {
  constructor(element) {
    // 투명화 시킬 것들
    this.others = element;
    // 입력폼
    this.textContainer = document.getElementById("textAreaContainer");
    this.form = document.querySelector(".send__form");
    this.startPosition = { x: 0, y: 0 };
    this.velocity = 2;
    this.accel = 0.25;
    this.onSubmit(this.form);
    this.form.children[0].addEventListener("input", () => {
      this.resizeTextArea(this.form);
    });
  }
  resizeTextArea(element) {
    element.children[0].style.height = "2rem";
    element.children[0].style.height = element.children[0].scrollHeight + "px";
  }
  onSubmit(element) {
    element.addEventListener("submit", (e) => {
      // 새로고침 방지
      e.preventDefault();
      if (e.target[0].value === "") return alert("메세지 입력바람");
      let textChildrens = [
        // this 말고 document에서 다시 확인
        ...document.getElementById("textAreaContainer").children,
      ];
      // 새로 메세지를 보낼 경우
      if (textChildrens.length === 0) {
        this.createBox(e.target[0].value);
        e.target[0].value = "";
        // 입력창 투명
        this.form.style.display = "none";
        this.others.forEach((e) => {
          e.style.display = "none";
        });
        // 메세지 보내기
        this.render();
      } else {
        alert("이미 보내고 있는 메세지가 있습니다");
      }
    });
  }
  createBox(value) {
    const newBox = document.createElement("li");
    newBox.innerText = value;
    this.textContainer.appendChild(newBox);
    // 모바일로 봤을 때 키보드 위에서 발사되는 문제
    this.textContainer.style.transform = `translateY(${
      window.innerHeight - this.textContainer.getBoundingClientRect().height
    }px)`;
    this.startPosition.x = this.textContainer.getBoundingClientRect().x;
    this.startPosition.y = this.textContainer.getBoundingClientRect().y;
  }

  // lerp 사용해서 가속도 구현
  render() {
    // 가속도 더하기
    this.velocity += this.accel;
    this.startPosition.y = this.startPosition.y - this.velocity;
    this.textContainer.style.transform = `translateY(${this.startPosition.y}px)`;
    // raf 아이디 받기
    rafId = requestAnimationFrame(() => this.render());
    // 보내기
    if (this.startPosition.y < 0) {
      if (heading > directionConfig.first) {
        emitMessage("right", this.textContainer.children[0].innerHTML);
      } else if (heading < directionConfig.first) {
        emitMessage("left", this.textContainer.children[0].innerHTML);
      } else {
        emitMessage("right", this.textContainer.children[0].innerHTML);
      }
      this.textContainer.children[0].remove();
      this.form.style.display = "flex";
      this.others.forEach((e) => {
        e.style.display = "flex";
      });
      // 값 초기화
      this.startPosition.y = this.startPosition.x = 0;
      this.velocity = 2;
      // 애니메이션 초기화
      cancelAnimationFrame(rafId);
    }
  }
}

window.onload = () => {
  const compass = new Compass();
  const handler = new Handler();
  const textarea = new TextArea([compass.container, handler.container]);
};
